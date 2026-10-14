/**
 * SELY Privé – Automatic Geolocation & Visitor Language Detector
 * Détecte le pays et la langue du visiteur selon son IP (en-têtes Vercel / Edge CDN ou fallback)
 * et adapte automatiquement la langue du site.
 */

const COUNTRY_TO_LANG = {
  // Francophonie
  FR: 'fr', MC: 'fr', BE: 'fr', LU: 'fr', CH: 'fr',
  SN: 'fr', CI: 'fr', CD: 'fr', CM: 'fr', GA: 'fr',
  ML: 'fr', MG: 'fr', BF: 'fr', NE: 'fr', TG: 'fr',
  BJ: 'fr', RE: 'fr', GP: 'fr', MQ: 'fr', GF: 'fr',

  // Pays arabophones & Moyen-Orient (VIP & Palaces)
  AE: 'ar', SA: 'ar', QA: 'ar', KW: 'ar', BH: 'ar',
  OM: 'ar', EG: 'ar', LB: 'ar', JO: 'ar', MA: 'ar',
  DZ: 'ar', TN: 'ar', IQ: 'ar', LY: 'ar',

  // Monde hispanophone
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es',
  PE: 'es', VE: 'es', EC: 'es', GT: 'es', CU: 'es',
  BO: 'es', DO: 'es', UY: 'es', CR: 'es', PA: 'es',

  // Monde sinophone
  CN: 'zh', HK: 'zh', TW: 'zh', MO: 'zh', SG: 'zh',
};

/**
 * Résout le code langue recommandé pour un code pays ISO (2 lettres)
 * Si le pays n'est pas francophone, hispanophone, arabophone ou sinophone,
 * bascule automatiquement vers l'anglais ('en', langue de référence internationale).
 */
export function getLanguageForCountry(countryCode) {
  if (!countryCode) return null;
  const cc = String(countryCode).toUpperCase().trim();
  if (COUNTRY_TO_LANG[cc]) {
    return COUNTRY_TO_LANG[cc];
  }
  // Tous les autres pays (USA, UK, Allemagne, Italie, Japon, etc.) -> Anglais
  return 'en';
}

/**
 * Détecte le pays du visiteur de manière non bloquante :
 * 1. Tente l'endpoint interne /api/geo (fourni par Vercel Edge Headers)
 * 2. En fallback (ex. localhost), interroge un service public ultra-léger et gratuit (country.is)
 */
export async function detectVisitorCountry() {
  if (typeof window === 'undefined') return null;

  // 1. Appel /api/geo (fourni par Vercel Edge Headers)
  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 2000) : null;

    const res = await fetch('/api/geo', {
      method: 'GET',
      cache: 'no-store',
      signal: controller ? controller.signal : undefined,
    });
    if (timeoutId) clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.country) {
        return data.country.toUpperCase();
      }
    }
  } catch (e) {
    // Continuer vers fallback
  }

  // 2. Fallback gratuit sans clé (api.country.is)
  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 2500) : null;

    const res = await fetch('https://api.country.is', {
      method: 'GET',
      signal: controller ? controller.signal : undefined,
    });
    if (timeoutId) clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.country) {
        return data.country.toUpperCase();
      }
    }
  } catch (e) {
    // Fallback silencieux
  }

  return null;
}

/**
 * Initialise la détection automatique de la langue par géolocalisation
 * S'exécute au chargement de l'application.
 * Ne remplace JAMAIS la langue si l'utilisateur a expressément choisi une langue via le sélecteur.
 */
export async function initGeoLanguageDetection(i18nInstance) {
  if (typeof window === 'undefined' || !i18nInstance) return;

  // 1. Si la route courante a un préfixe de langue explicite (ex: /en/journal/...), ne pas écraser
  const pathname = (window.location.pathname || '').toLowerCase();
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  if (['fr', 'en', 'es', 'ar', 'zh'].includes(firstSegment)) {
    return;
  }

  // 2. Si l'utilisateur a manuellement choisi une langue, on respecte son choix absolu
  try {
    const hasManualChoice = localStorage.getItem('sely_manual_lang') === 'true';
    if (hasManualChoice) {
      return;
    }

    // 3. Si la langue a déjà été détectée et enregistrée pour cette session
    const alreadyGeoDetected = sessionStorage.getItem('sely_geo_detected');
    if (alreadyGeoDetected) {
      return;
    }
  } catch (e) {
    // Mode privé strict
  }

  try {
    const country = await detectVisitorCountry();
    if (country) {
      try {
        sessionStorage.setItem('sely_visitor_country', country);
        sessionStorage.setItem('sely_geo_detected', 'true');
      } catch (e) {}

      const recommendedLang = getLanguageForCountry(country);
      if (recommendedLang) {
        try {
          sessionStorage.setItem('sely_geo_lang', recommendedLang);
        } catch (e) {}

        const currentLang = (i18nInstance.language || '').split('-')[0];
        if (currentLang !== recommendedLang) {
          await i18nInstance.changeLanguage(recommendedLang);
        }
      }
    }
  } catch (err) {
    // Tolérance totale aux pannes réseau
  }
}
