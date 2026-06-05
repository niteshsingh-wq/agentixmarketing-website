import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
})

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  if (!process.env.BREVO_USER || !process.env.BREVO_SMTP_KEY) {
    // In dev without credentials — log and skip, don't crash the route
    console.log('[email] Credentials not set — skipping send to', opts.to, '|', opts.subject)
    return
  }
  return transporter.sendMail({
    from: '"Agentix" <hello@agentixmarketing.com>',
    ...opts,
  })
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
