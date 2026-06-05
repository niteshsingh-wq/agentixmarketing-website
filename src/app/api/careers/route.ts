import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, notifyHtml, confirmHtml } from '@/lib/email'

export async function POST(req: NextRequest) {
  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }
  if (!/\S+@\S+\.\S+/.test(body.email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const firstName = body.name.trim().split(' ')[0]

  // Notification to team
  await sendEmail({
    to: process.env.NOTIFY_EMAIL!,
    subject: `New application: ${body.name.trim()} — ${body.role || 'Agentix'}`,
    html: notifyHtml({
      Name: body.name.trim(),
      Email: body.email.trim(),
      Role: body.role || '',
      LinkedIn: body.linkedin || '',
      'Why Agentix': body.why || '',
    }),
  })

  // Confirmation to applicant
  await sendEmail({
    to: body.email.trim(),
    subject: 'Application received — Agentix',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0a0a0b">
        <h2>Application received.</h2>
        <p>Hi ${firstName},</p>
        <p>Thanks for applying for the <strong>${body.role || 'role'}</strong> position at Agentix. We review every application personally and will be in touch within a few days.</p>
        <p style="margin-top:24px">— The Agentix team</p>
      </div>`,
  })

  return NextResponse.json({ ok: true })
}
