import nodemailer from 'nodemailer'

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

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    // In dev without credentials — log and skip, don't crash the route
    console.log('[email] Credentials not set — skipping send to', opts.to, '|', opts.subject)
    return
  }
  const info = await transporter.sendMail({
    from: `"Agentix" <${FROM_ADDRESS}>`,
    ...opts,
  })
  console.log('[email] sent', opts.to, '|', opts.subject, '| messageId:', info.messageId, '| response:', info.response)
  return info
}

export function notifyHtml(fields: Record<string, string>) {
  const rows = Object.entries(fields)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#888;font-size:14px;white-space:nowrap">${k}</td><td style="padding:6px 12px;font-size:14px">${v || '—'}</td></tr>`)
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
      <p>Hi ${firstName},</p>
      <p>Thanks for reaching out. We'll come back to you at ${email} within one business day with next steps.</p>
      <p style="margin-top:24px">— The Agentix team</p>
    </div>`
}
