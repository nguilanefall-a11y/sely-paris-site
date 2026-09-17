export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, currency = 'eur', title, description, metadata, redirectUrl } = req.body;

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ error: 'Invalid or missing amount' });
  }

  const apiKey = process.env.WHOP_API_KEY || 'apik_mrPBXFhUqWN8k_C6365443_C_e757150796ffe939dbc0bdee34f1e658418433af9809d7f732fdc847be50fd';
  const accountId = process.env.WHOP_ACCOUNT_ID || 'biz_5oY1Qe4By05YTu';

  try {
    const safeTitle = (title ? String(title) : 'SELY Privé - Réservation').slice(0, 30);

    const whopRes = await fetch('https://api.whop.com/api/v1/checkout_configurations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_id: accountId,
        redirect_url: redirectUrl || 'https://www.selyprive.com/reservation-succes',
        metadata: metadata || {},
        plan: {
          title: safeTitle,
          description: description || 'Prestation de chauffeur privé de luxe SELY',
          plan_type: 'one_time',
          initial_price: Math.round(Number(amount)),
          currency: currency.toLowerCase(),
        },
      }),
    });

    const data = await whopRes.json();
    if (!whopRes.ok) {
      console.error('Whop API error:', data);
      return res.status(whopRes.status).json(data);
    }

    return res.status(200).json({
      checkoutUrl: data.purchase_url,
      checkoutId: data.id,
    });
  } catch (error) {
    console.error('Whop checkout handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}
