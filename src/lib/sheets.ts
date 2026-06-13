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
  if (!SHEET_ID || !process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
    console.log('[sheets] Credentials not set — skipping append for', fields.email)
    return
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
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
