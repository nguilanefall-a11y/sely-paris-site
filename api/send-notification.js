export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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

  const { access_key, ...bodyData } = req.body || {};
  const key = access_key || process.env.WEB3FORMS_ACCESS_KEY || '42e184b9-b298-4b91-a156-4414c23a9f22';

  try {
    const web3formsRes = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        access_key: key,
        ...bodyData,
      }),
    });

    const data = await web3formsRes.json();
    return res.status(web3formsRes.status).json(data);
  } catch (error) {
    console.error('Error sending notification email via API route:', error);
    return res.status(500).json({ error: error.message });
  }
}
