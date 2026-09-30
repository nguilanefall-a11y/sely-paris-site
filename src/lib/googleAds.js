/**
 * Google Ads Conversion Tracking Helper
 * Conversion: Demande de devis (1)
 * ID: AW-18418775333/IzlhCL_QyIsdEKXq4M5E
 */

export const GOOGLE_ADS_CONVERSION_ID = 'AW-18418775333/IzlhCL_QyIsdEKXq4M5E';

/**
 * Fires the Google Ads conversion event for a completed quote request
 * @param {Object} details - Optional details like transaction ref or estimated price
 */
export function trackQuoteConversion(details = {}) {
  try {
    if (typeof window !== 'undefined') {
      // Ensure dataLayer exists
      window.dataLayer = window.dataLayer || [];

      // If gtag is defined, use it
      if (typeof window.gtag === 'function') {
        const payload = {
          send_to: GOOGLE_ADS_CONVERSION_ID,
        };

        if (details.estimatedPrice && Number(details.estimatedPrice) > 0) {
          payload.value = Number(details.estimatedPrice);
          payload.currency = 'EUR';
        }

        if (details.ref) {
          payload.transaction_id = details.ref;
        }

        window.gtag('event', 'conversion', payload);
        console.log('[Google Ads] Conversion event successfully sent:', GOOGLE_ADS_CONVERSION_ID, payload);
      } else {
        // Fallback: push directly to dataLayer
        window.dataLayer.push({
          event: 'conversion',
          send_to: GOOGLE_ADS_CONVERSION_ID,
          value: details.estimatedPrice || undefined,
          currency: 'EUR',
          transaction_id: details.ref || undefined,
        });
        console.log('[Google Ads] Fallback dataLayer push for conversion:', GOOGLE_ADS_CONVERSION_ID);
      }
    }
  } catch (error) {
    console.warn('[Google Ads] Error sending conversion event:', error);
  }
}
