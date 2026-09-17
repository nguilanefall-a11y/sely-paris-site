export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.WHOP_API_KEY || 'apik_mrPBXFhUqWN8k_C6365443_C_e757150796ffe939dbc0bdee34f1e658418433af9809d7f732fdc847be50fd';
  const accountId = process.env.WHOP_ACCOUNT_ID || 'biz_5oY1Qe4By05YTu';

  try {
    const whopRes = await fetch(`https://api.whop.com/api/v1/payments?account_id=${accountId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const data = await whopRes.json();
    if (!whopRes.ok) {
      return res.status(whopRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Fetch Whop payments error:', err);
    return res.status(500).json({ error: err.message });
  }
}
