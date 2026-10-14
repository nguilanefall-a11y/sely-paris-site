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
  CN: 'zh-CN', HK: 'zh-TW', TW: 'zh-TW', MO: 'zh-TW', SG: 'zh-CN',

  // Europe & Monde
  DE: 'de', AT: 'de',
  IT: 'it', SM: 'it', VA: 'it',
  PT: 'pt', BR: 'pt',
  RU: 'ru', BY: 'ru', KZ: 'ru',
  JP: 'ja',
  KR: 'ko',
  TR: 'tr',
  NL: 'nl',
  SE: 'sv',
  PL: 'pl',
  GR: 'el', CY: 'el',
  IL: 'he',
  NO: 'no',
  DK: 'da',
  FI: 'fi',
  CZ: 'cs',
  RO: 'ro',
  HU: 'hu',
  UA: 'uk',
  TH: 'th',
  VN: 'vi',
  ID: 'id',
  IN: 'hi',

  // Pays anglophones
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en',
};

/**
 * Résout la meilleure langue pour un visiteur selon :
 * 1. La langue configurée sur son appareil/téléphone (ex: un voyageur hispanophone ou arabophone aux USA garde sa langue !)
 * 2. Le pays de géolocalisation IP
 */
export function resolveBestLanguage({ visitorCountry, browserLangs = [] } = {}) {
  const deviceLangs = (browserLangs || [])
    .map((l) => String(l).toLowerCase().split('-')[0])
    .filter(Boolean);
  const primaryDeviceLang = deviceLangs[0];

  // Si le téléphone du voyageur est dans une langue spécifique (ex: espagnol, arabe, français, russe, japonais, etc.)
  // même s'il est physiquement en Amérique ou en Angleterre, on respecte la langue de son téléphone !
  if (primaryDeviceLang && primaryDeviceLang !== 'en') {
    return primaryDeviceLang;
  }

  // Si la langue du téléphone est l'anglais ou générique, on utilise le pays IP s'il a une langue nationale spécifique
  if (visitorCountry) {
    const countryLang = getLanguageForCountry(visitorCountry);
    if (countryLang) return countryLang;
  }

  return primaryDeviceLang || 'fr';
}

/**
 * Résout le code langue recommandé pour un code pays ISO (2 lettres)
 */
export function getLanguageForCountry(countryCode) {
  if (!countryCode) return null;
  const cc = String(countryCode).toUpperCase().trim();
  if (COUNTRY_TO_LANG[cc]) {
    return COUNTRY_TO_LANG[cc];
  }
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

import { applyUniversalLanguage } from './universalTranslator';

/**
 * Initialise la détection automatique de la langue
 * S'exécute au chargement de l'application.
 * Priorise la langue de l'appareil du voyageur, puis son pays IP.
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

  // 2. Si l'utilisateur a manuellement choisi une langue, on applique son choix absolu
  try {
    const hasManualChoice = localStorage.getItem('sely_manual_lang') === 'true';
    if (hasManualChoice) {
      const preferred = localStorage.getItem('sely_preferred_lang') || localStorage.getItem('i18nextLng');
      if (preferred) {
        await applyUniversalLanguage(preferred, { isManual: false });
      }
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
    const browserLangs = typeof navigator !== 'undefined' ? (navigator.languages || [navigator.language || '']) : [];

    if (country) {
      try {
        sessionStorage.setItem('sely_visitor_country', country);
        sessionStorage.setItem('sely_geo_detected', 'true');
      } catch (e) {}
    }

    const recommendedLang = resolveBestLanguage({
      visitorCountry: country,
      browserLangs,
    });

    if (recommendedLang) {
      try {
        sessionStorage.setItem('sely_geo_lang', recommendedLang);
      } catch (e) {}

      await applyUniversalLanguage(recommendedLang, { isManual: false });
    }
  } catch (err) {
    // Tolérance totale aux pannes réseau
  }
}
