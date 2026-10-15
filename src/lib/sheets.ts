import { google } from 'googleapis'

const SHEET_ID = process.env.GOOGLE_SHEET_ID
const RANGE = 'Leads!A:N'

export interface SheetLeadFields {
  name: string
  email: string
  phone: string
  website: string
  goal: string
  stage: string
  budget: string
  message: string
  sourcePage: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
}

export async function appendLeadToSheet(fields: SheetLeadFields) {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY

  const missing = [
    !SHEET_ID && 'GOOGLE_SHEET_ID',
    !clientEmail && 'GOOGLE_SHEETS_CLIENT_EMAIL',
    !privateKey && 'GOOGLE_SHEETS_PRIVATE_KEY',
  ].filter(Boolean)

  if (!SHEET_ID || !clientEmail || !privateKey) {
    // warn, not log — this is a misconfiguration, and silently skipping is how
    // this integration stayed dead in production without anyone noticing.
    console.warn(
      `[sheets] NOT CONFIGURED — lead for ${fields.email} was NOT written to the spreadsheet. Missing env vars: ${missing.join(', ')}`
    )
    return
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    const sheets = google.sheets({ version: 'v4', auth })

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[
          timestamp,
          fields.name,
          fields.email,
          fields.website,
          fields.goal,
          fields.stage,
          fields.budget,
          fields.message,
          fields.sourcePage,
          fields.utmSource,
          fields.utmMedium,
          fields.utmCampaign,
          'New',
          // Leading apostrophe forces Sheets to treat as text — otherwise
          // USER_ENTERED parses a leading "+" as a formula and shows #ERROR!
          fields.phone ? `'${fields.phone}` : '',
        ]],
      },
    })
    console.log('[sheets] appended row for', fields.email)
  } catch (err) {
    console.error('[sheets] append error:', err)
  }
}
