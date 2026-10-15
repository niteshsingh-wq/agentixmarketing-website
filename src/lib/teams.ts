const TEAMS_WEBHOOK_URL = process.env.TEAMS_WEBHOOK_URL

export async function notifyTeamsNewLead(fields: Record<string, string>) {
  if (!TEAMS_WEBHOOK_URL) {
    console.warn('[teams] NOT CONFIGURED — notification skipped. Missing env var: TEAMS_WEBHOOK_URL')
    return
  }

  try {
    const card = {
      type: 'AdaptiveCard',
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      version: '1.4',
      body: [
        {
          type: 'TextBlock',
          text: '🎯 New lead from Agentixmarketing.com',
          weight: 'Bolder',
          size: 'Medium',
          wrap: true,
        },
        {
          type: 'FactSet',
          facts: Object.entries(fields)
            .filter(([, value]) => value)
            .map(([title, value]) => ({ title, value })),
        },
      ],
    }

    const res = await fetch(TEAMS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    })

    if (!res.ok) {
      console.error('[teams] notify failed:', res.status, await res.text())
    }
  } catch (err) {
    console.error('[teams] notify error:', err)
  }
}
