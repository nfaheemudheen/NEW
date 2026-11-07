
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed',
    })
  }

  try {
    const webhookUrl = process.env.SHEETS_WEBHOOK_URL
    const secret = process.env.SHEETS_SHARED_SECRET

    if (!webhookUrl || !secret) {
      return res.status(500).json({
        ok: false,
        error: 'Google Sheets server configuration is missing.',
      })
    }

    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : req.body

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        ...body,
        secret,
      }),
    })

    const responseText = await response.text()

    let result
    try {
      result = JSON.parse(responseText)
    } catch {
      throw new Error(
        'Apps Script did not return JSON. Check its Web App deployment permissions.'
      )
    }

    if (!response.ok || result.ok !== true) {
      throw new Error(
        result.error || `Google Sheets returned ${response.status}`
      )
    }

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || 'Could not save enquiry.',
    })
  }
}
