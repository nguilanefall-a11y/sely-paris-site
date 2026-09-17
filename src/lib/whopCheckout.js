/**
 * Client helper to generate Whop checkout URLs with dynamic pricing.
 */

const WHOP_API_KEY = 'apik_mrPBXFhUqWN8k_C6365443_C_e757150796ffe939dbc0bdee34f1e658418433af9809d7f732fdc847be50fd';
const WHOP_ACCOUNT_ID = 'biz_5oY1Qe4By05YTu';

export async function createWhopCheckout({
  amount,
  currency = 'eur',
  title = 'SELY Privé - Réservation',
  description = 'Prestation de chauffeur privé haut de gamme SELY',
  metadata = {},
  redirectUrl = `${window.location.origin}/reservation-succes`,
}) {
  const roundedAmount = Math.round(Number(amount));
  const safeTitle = (title ? String(title) : 'SELY Privé - Réservation').slice(0, 30);

  // 1. Try serverless backend route first
  try {
    const res = await fetch('/api/create-whop-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: roundedAmount,
        currency,
        title: safeTitle,
        description,
        metadata,
        redirectUrl,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.checkoutUrl) {
        return data.checkoutUrl;
      }
    }
  } catch (err) {
    console.warn('Backend checkout route unreachable, falling back to direct API', err);
  }

  // 2. Direct client fallback with Whop CORS enabled
  const directRes = await fetch('https://api.whop.com/api/v1/checkout_configurations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WHOP_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      account_id: WHOP_ACCOUNT_ID,
      redirect_url: redirectUrl,
      metadata,
      plan: {
        title: safeTitle,
        description,
        plan_type: 'one_time',
        initial_price: roundedAmount,
        currency: currency.toLowerCase(),
      },
    }),
  });

  if (!directRes.ok) {
    const errData = await directRes.json();
    throw new Error(errData.message || 'Erreur lors de la création du paiement Whop');
  }

  const directData = await directRes.json();
  return directData.purchase_url;
}
