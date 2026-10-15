import nodemailer from 'nodemailer'
import { isValidEmail } from '@/lib/validation'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// agentixmarketing.com is a Workspace domain alias — SMTP auth requires the
// account's primary address (GMAIL_USER), but mail is sent as this alias.
const FROM_ADDRESS = 'connect@agentixmarketing.com'

/**
 * Escape a user-controlled value for safe interpolation into an HTML email
 * body. Every template in this file routes untrusted input through here.
 *
 * Without this, a caller could inject arbitrary markup — including links and
 * styled content — into mail sent *from* the Agentix domain, which is a
 * ready-made phishing primitive.
 */
export function esc(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Escape and convert newlines to <br> for multi-line fields (message, why). */
export function escMultiline(value: unknown): string {
  return esc(value).replace(/\r?\n/g, '<br>')
}

/**
 * Returns the nodemailer info object on a real send, or `null` when the send
 * was skipped (missing credentials / invalid recipient). Callers MUST treat
 * `null` as "not delivered" — resolving successfully is not proof of sending.
 */
export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    // In dev without credentials — log and skip, don't crash the route
    console.warn('[email] NOT CONFIGURED — skipping send to', opts.to, '|', opts.subject)
    return null
  }

  // Final guard: never hand an unvalidated or injected address to the SMTP
  // layer, even if a caller inside this app forgot to validate.
  if (!isValidEmail(opts.to)) {
    console.error('[email] Refusing to send — invalid recipient address')
    return null
  }

  // Subjects are built from user input in places; strip CR/LF so they cannot
  // forge additional SMTP headers, and cap the length.
  const subject = opts.subject.replace(/[\r\n]+/g, ' ').slice(0, 200)

  const info = await transporter.sendMail({
    from: `"Agentix" <${FROM_ADDRESS}>`,
    to: opts.to,
    subject,
    html: opts.html,
  })
  console.log('[email] sent', opts.to, '|', subject, '| messageId:', info.messageId, '| response:', info.response)
  return info
}

/**
 * Internal notification table. Both keys and values are escaped — keys are
 * app-controlled today, but escaping them costs nothing and removes the
 * footgun if a caller ever passes a dynamic key.
 */
export function notifyHtml(fields: Record<string, string>) {
  const rows = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#888;font-size:14px;white-space:nowrap">${esc(k)}</td><td style="padding:6px 12px;font-size:14px">${escMultiline(v) || '—'}</td></tr>`
    )
    .join('')
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
      <h2 style="color:#0a0a0b;margin-bottom:4px">New lead from Agentix.co</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:16px">${rows}</table>
    </div>`
}

export function confirmHtml(firstName: string, email: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0a0a0b">
      <h2>We got your message.</h2>
      <p>Hi ${esc(firstName)},</p>
      <p>Thanks for reaching out. We'll come back to you at ${esc(email)} within one business day with next steps.</p>
      <p style="margin-top:24px">— The Agentix team</p>
    </div>`
}

/** Confirmation sent to a careers applicant. */
export function careersConfirmHtml(firstName: string, role: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0a0a0b">
      <h2>Application received.</h2>
      <p>Hi ${esc(firstName)},</p>
      <p>Thanks for applying for the <strong>${esc(role || 'role')}</strong> position at Agentix. We review every application personally and will be in touch within a few days.</p>
      <p style="margin-top:24px">— The Agentix team</p>
    </div>`
}
