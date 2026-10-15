import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendEmail, notifyHtml, confirmHtml } from '@/lib/email'
import { appendLeadToSheet } from '@/lib/sheets'
import { notifyTeamsNewLead } from '@/lib/teams'
import { cleanBody, cleanField, isValidEmail, type FieldName } from '@/lib/validation'
import { rateLimit, refundRateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit'

// This route writes to Postgres and sends mail — it must never be prerendered
// or cached.
export const dynamic = 'force-dynamic'

const FIELDS: readonly FieldName[] = [
  'name', 'email', 'phone', 'website', 'goal', 'stage', 'budget',
  'need', 'message', 'sourcePage', 'utmSource', 'utmMedium', 'utmCampaign',
]

// Per-IP: generous enough for a genuine user who resubmits, tight enough that
// the endpoint cannot be used to relay mail at volume.
const IP_LIMIT = 5
const IP_WINDOW = 600 // 10 minutes
// Per-recipient: stops one address being mail-bombed from rotating IPs.
const EMAIL_LIMIT = 3
const EMAIL_WINDOW = 3600 // 1 hour

export async function POST(req: NextRequest) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Honeypot — silently drop spam. Checked before any work is done.
  if (cleanField((raw as Record<string, unknown>)?.company)) {
    return NextResponse.json({ ok: true })
  }

  const body = cleanBody(raw, FIELDS)

  // Validate required fields server-side — the frontend is not trusted.
  if (!body.name || !body.email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }
  if (!isValidEmail(body.email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Rate limit by IP first, then by recipient address.
  const ip = clientIp(req)
  const ipCheck = await rateLimit('contact:ip', ip, IP_LIMIT, IP_WINDOW)
  if (!ipCheck.ok) return tooManyRequests(ipCheck)

  const emailCheck = await rateLimit(
    'contact:email',
    body.email.toLowerCase(),
    EMAIL_LIMIT,
    EMAIL_WINDOW
  )
  if (!emailCheck.ok) return tooManyRequests(emailCheck)

  const firstName = body.name.split(' ')[0]

  // Determine if this came from the strategy form (has goal/stage/budget) or contact form (has need)
  const isLead = !!(body.goal || body.stage || body.budget)

  // A submission is only reported as received once the database row exists.
  let persisted = false

  try {
    const payload = await getPayload({ config })

    if (isLead) {
      await payload.create({
        collection: 'leads',
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone,
          website: body.website,
          goal: (body.goal || undefined) as never,
          stage: (body.stage || undefined) as never,
          budget: body.budget,
          sourcePage: body.sourcePage,
          utmSource: body.utmSource,
          utmMedium: body.utmMedium,
          utmCampaign: body.utmCampaign,
          status: 'new',
        },
      })
    } else {
      await payload.create({
        collection: 'contact-submissions',
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone,
          website: body.website,
          need: (body.need || undefined) as never,
          message: body.message,
        },
      })
    }
    persisted = true
  } catch (err) {
    console.error('[contact] Payload save FAILED:', err)
  }

  const notifyFields: Record<string, string> = {
    Name: body.name,
    Email: body.email,
    Phone: body.phone,
    Website: body.website,
    ...(isLead
      ? { Goal: body.goal, Stage: body.stage, Budget: body.budget }
      : { Need: body.need, Message: body.message }),
    'Source page': body.sourcePage,
  }

  const notifyTo = process.env.NOTIFY_EMAIL
  const subject = `New ${isLead ? 'lead' : 'contact'}: ${body.name} — ${body.goal || body.need || 'Agentix.co'}`

  if (!persisted) {
    // The database is the system of record — without a row the lead never
    // reaches the CMS, so the visitor must not be told it was received.
    // Email the team a flagged copy so the details are still recoverable,
    // but skip the visitor confirmation, Sheets and Teams: the visitor is
    // asked to retry, and a retry would otherwise duplicate all of them.
    const backup = notifyTo
      ? await sendEmail({ to: notifyTo, subject: `[NOT SAVED] ${subject}`, html: notifyHtml(notifyFields) })
          .catch(err => {
            console.error('[contact] backup notification failed:', err)
            return null
          })
      : null
    console.error(`[contact] LEAD NOT PERSISTED — backup notification ${backup ? 'sent' : 'NOT sent'}`)
    // Our failure, not the visitor's: do not let it count against their retry.
    await Promise.all([
      refundRateLimit('contact:ip', ip),
      refundRateLimit('contact:email', body.email.toLowerCase()),
    ])
    return NextResponse.json(
      { error: 'We could not record your message. Please try again, or email connect@agentixmarketing.com directly.' },
      { status: 503 }
    )
  }

  // The lead is saved. Notifications are best-effort from here on and never
  // change the response.
  const results = await Promise.allSettled([
    notifyTo
      ? sendEmail({ to: notifyTo, subject, html: notifyHtml(notifyFields) })
      : Promise.reject(new Error('NOTIFY_EMAIL is not set')),
    sendEmail({
      to: body.email,
      subject: 'We got your message — Agentix',
      html: confirmHtml(firstName, body.email),
    }),
    appendLeadToSheet({
      name: body.name,
      email: body.email,
      phone: body.phone,
      website: body.website,
      goal: body.goal,
      stage: body.stage,
      budget: body.budget,
      message: body.message || body.need,
      sourcePage: body.sourcePage,
      utmSource: body.utmSource,
      utmMedium: body.utmMedium,
      utmCampaign: body.utmCampaign,
    }),
    notifyTeamsNewLead(notifyFields),
  ])

  // Surface failures in the logs instead of swallowing them — previously an
  // allSettled rejection was discarded entirely, which is why the Sheets and
  // Teams integrations could be dead in production without anyone noticing.
  const labels = ['notify-email', 'confirm-email', 'google-sheets', 'teams-webhook']
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`[contact] side-effect "${labels[i]}" failed:`, r.reason)
    }
  })

  // sendEmail resolves with null when it skipped, so a fulfilled promise
  // alone is NOT proof the mail went out.
  if (!(results[0].status === 'fulfilled' && results[0].value != null)) {
    console.error('[contact] lead saved but the team notification email was NOT delivered')
  }

  return NextResponse.json({ ok: true })
}
