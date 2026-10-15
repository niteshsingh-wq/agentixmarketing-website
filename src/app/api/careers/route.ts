import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, notifyHtml, careersConfirmHtml } from '@/lib/email'
import { cleanBody, cleanField, isValidEmail, type FieldName } from '@/lib/validation'
import { rateLimit, refundRateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit'

// Sends mail on every request — never prerender or cache.
export const dynamic = 'force-dynamic'

const FIELDS: readonly FieldName[] = ['name', 'email', 'phone', 'role', 'linkedin', 'why']

const IP_LIMIT = 3
const IP_WINDOW = 3600 // 1 hour — applications are not submitted in bursts
const EMAIL_LIMIT = 2
const EMAIL_WINDOW = 86400 // 1 day

export async function POST(req: NextRequest) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Honeypot — matches the contact form's protection, which careers lacked.
  if (cleanField((raw as Record<string, unknown>)?.company)) {
    return NextResponse.json({ ok: true })
  }

  const body = cleanBody(raw, FIELDS)

  if (!body.name || !body.email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }
  if (!isValidEmail(body.email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const ip = clientIp(req)
  const ipCheck = await rateLimit('careers:ip', ip, IP_LIMIT, IP_WINDOW)
  if (!ipCheck.ok) return tooManyRequests(ipCheck)

  const emailCheck = await rateLimit(
    'careers:email',
    body.email.toLowerCase(),
    EMAIL_LIMIT,
    EMAIL_WINDOW
  )
  if (!emailCheck.ok) return tooManyRequests(emailCheck)

  const firstName = body.name.split(' ')[0]
  const notifyTo = process.env.NOTIFY_EMAIL

  // Careers has NO database path — the notification email is the only record
  // of an application. Send it first, and only confirm to the applicant once
  // it has actually gone out; otherwise the applicant would get an
  // "Application received" email alongside an error on screen.
  const notified = notifyTo
    ? await sendEmail({
        to: notifyTo,
        subject: `New application: ${body.name} — ${body.role || 'Agentix'}`,
        html: notifyHtml({
          Name: body.name,
          Email: body.email,
          Phone: body.phone,
          Role: body.role,
          LinkedIn: body.linkedin,
          'Why Agentix': body.why,
        }),
      }).catch(err => {
        console.error('[careers] notification email failed:', err)
        return null
      })
    : (console.error('[careers] NOTIFY_EMAIL is not set'), null)

  if (!notified) {
    console.error('[careers] APPLICATION LOST — notification email was not delivered')
    // Our failure, not the applicant's: do not let it count against a retry.
    await Promise.all([
      refundRateLimit('careers:ip', ip),
      refundRateLimit('careers:email', body.email.toLowerCase()),
    ])
    return NextResponse.json(
      { error: 'We could not record your application. Please email connect@agentixmarketing.com directly.' },
      { status: 503 }
    )
  }

  try {
    await sendEmail({
      to: body.email,
      subject: 'Application received — Agentix',
      html: careersConfirmHtml(firstName, body.role),
    })
  } catch (err) {
    // The team has the application; a failed confirmation must not fail it.
    console.error('[careers] confirmation email failed:', err)
  }

  return NextResponse.json({ ok: true })
}
