import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendEmail, notifyHtml, confirmHtml } from '@/lib/email'

export async function POST(req: NextRequest) {
  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Honeypot — silently drop spam
  if (body.company) return NextResponse.json({ ok: true })

  // Validate required fields
  if (!body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }
  if (!/\S+@\S+\.\S+/.test(body.email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const firstName = body.name.trim().split(' ')[0]

  // Determine if this came from the strategy form (has goal/stage/budget) or contact form (has need)
  const isLead = !!(body.goal || body.stage || body.budget)

  try {
    const payload = await getPayload({ config })

    if (isLead) {
      await payload.create({
        collection: 'leads',
        data: {
          name: body.name.trim(),
          email: body.email.trim(),
          website: body.website || '',
          goal: body.goal || undefined,
          stage: body.stage || undefined,
          budget: body.budget || '',
          sourcePage: body.sourcePage || '',
          utmSource: body.utmSource || '',
          utmMedium: body.utmMedium || '',
          utmCampaign: body.utmCampaign || '',
          status: 'new',
        },
      })
    } else {
      await payload.create({
        collection: 'contact-submissions',
        data: {
          name: body.name.trim(),
          email: body.email.trim(),
          website: body.website || '',
          need: body.need || undefined,
          message: body.message || '',
        },
      })
    }
  } catch (err) {
    // DB may not be connected in dev — log and continue so emails still send
    console.error('[contact] Payload save error:', err)
  }

  // Notification to team
  await sendEmail({
    to: process.env.NOTIFY_EMAIL!,
    subject: `New ${isLead ? 'lead' : 'contact'}: ${body.name.trim()} — ${body.goal || body.need || 'Agentix.co'}`,
    html: notifyHtml({
      Name: body.name.trim(),
      Email: body.email.trim(),
      Website: body.website || '',
      ...(isLead
        ? { Goal: body.goal || '', Stage: body.stage || '', Budget: body.budget || '' }
        : { Need: body.need || '', Message: body.message || '' }),
      'Source page': body.sourcePage || '',
    }),
  })

  // Confirmation to sender
  await sendEmail({
    to: body.email.trim(),
    subject: 'We got your message — Agentix',
    html: confirmHtml(firstName, body.email.trim()),
  })

  return NextResponse.json({ ok: true })
}
