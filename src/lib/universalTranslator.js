/**
 * SELY Privé – Moteur de Traduction Universel & Multilingue
 * Combine les traductions natives réactives i18next (FR, EN, ES, AR, ZH)
 * avec le moteur de traduction universel pour couvrir TOUTES les 130+ langues du monde.
 */

import i18n from '../i18n';
import { ALL_WORLD_LANGUAGES, POPULAR_LANGUAGES, getLanguageMetadata } from './languages';

const RTL_LANGS = ['ar', 'he', 'fa', 'ur', 'ps', 'sd'];
const NATIVE_I18N_LANGS = ['fr', 'en', 'es', 'ar', 'zh', 'de', 'it', 'pt', 'ru', 'ja'];

let isGoogleScriptLoaded = false;
let isGoogleScriptLoading = false;

/**
 * Configure les cookies de traduction Google Translate sans conflit
 */
function setGoogleTransCookie(targetLang) {
  if (typeof document === 'undefined') return;
  const hostname = window.location.hostname;
  const cookieValue = `/auto/${targetLang}`;
  
  // Set for current path, root path, and domain
  document.cookie = `googtrans=${cookieValue}; path=/;`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=${hostname};`;
  
  // Also delete older prefix if any
  if (hostname.includes('.')) {
    const rootDomain = hostname.split('.').slice(-2).join('.');
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${rootDomain};`;
  }
}

/**
 * Efface le cookie de traduction Google Translate (retour au français/langue native)
 */
function clearGoogleTransCookie() {
  if (typeof document === 'undefined') return;
  const hostname = window.location.hostname;
  const pastDate = 'Thu, 01 Jan 1970 00:00:00 GMT';
  
  document.cookie = `googtrans=; expires=${pastDate}; path=/;`;
  document.cookie = `googtrans=; expires=${pastDate}; path=/; domain=${hostname};`;
  if (hostname.includes('.')) {
    const rootDomain = hostname.split('.').slice(-2).join('.');
    document.cookie = `googtrans=; expires=${pastDate}; path=/; domain=.${rootDomain};`;
  }
}

/**
 * Charge le script Google Translate de façon asynchrone et invisible
 */
export function ensureGoogleTranslateLoaded() {
  if (typeof window === 'undefined' || isGoogleScriptLoaded || isGoogleScriptLoading) return;
  isGoogleScriptLoading = true;

  // Création du conteneur caché
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);
  }

  window.googleTranslateElementInit = function() {
    try {
      new window.google.translate.TranslateElement({
        pageLanguage: 'fr',
        autoDisplay: false,
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      }, 'google_translate_element');
      isGoogleScriptLoaded = true;
      isGoogleScriptLoading = false;
    } catch (e) {
      // Ignorer
    }
  };

  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  script.onload = () => {
    isGoogleScriptLoaded = true;
    isGoogleScriptLoading = false;
  };
  script.onerror = () => {
    isGoogleScriptLoading = false;
  };
  document.head.appendChild(script);
}

/**
 * Applique une langue universelle (n'importe quelle langue du monde)
 * @param {string} langCode - Code ISO (ex: 'fr', 'en', 'ar', 'de', 'ru', 'ja', 'it', 'sv', 'ko'...)
 * @param {object} options - { isManual: boolean }
 */
export async function applyUniversalLanguage(langCode, options = {}) {
  if (!langCode || typeof window === 'undefined') return;

  const isManual = options.isManual === true;
  const cleanCode = String(langCode).trim().toLowerCase().split('-')[0];
  const fullCode = String(langCode).trim();

  // Déterminer la direction (RTL vs LTR)
  const isRtl = RTL_LANGS.includes(cleanCode);
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = fullCode;

  // Si c'est un choix manuel du visiteur, mémoriser pour toujours
  if (isManual) {
    try {
      localStorage.setItem('sely_manual_lang', 'true');
      localStorage.setItem('sely_preferred_lang', fullCode);
    } catch (e) {}
  }

  // Cas 1 : Langue native supportée directement par react-i18next (FR, EN, ES, AR, ZH)
  if (NATIVE_I18N_LANGS.includes(cleanCode)) {
    clearGoogleTransCookie();
    try {
      localStorage.setItem('i18nextLng', cleanCode);
    } catch (e) {}

    await i18n.changeLanguage(cleanCode);

    // Si le combo Google était actif, le réinitialiser silencieusement
    const select = document.querySelector('.goog-te-combo');
    if (select && select.value !== '') {
      select.value = '';
      select.dispatchEvent(new Event('change'));
    }
    return;
  }

  // Cas 2 : N'importe quelle autre langue du monde (130+ langues : DE, IT, RU, JA, PT, TR, SV, PL, KO, HI...)
  // On bascule la source React en français (base source parfaite) et on active Google Translate pour cette langue
  await i18n.changeLanguage('fr');
  setGoogleTransCookie(fullCode);
  ensureGoogleTranslateLoaded();

  // Déclencher le changement sur le select Google s'il est déjà injecté
  const triggerGoogleSelect = () => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = fullCode;
      select.dispatchEvent(new Event('change'));
      return true;
    }
    return false;
  };

  if (!triggerGoogleSelect()) {
    // Si pas encore prêt, retenter brièvement
    const interval = setInterval(() => {
      if (triggerGoogleSelect()) {
        clearInterval(interval);
      }
    }, 200);
    setTimeout(() => clearInterval(interval), 4000);
  }
}

/**
 * Récupère la langue actuellement active (native ou universelle)
 */
export function getCurrentActiveLanguage() {
  if (typeof window === 'undefined') return 'fr';

  try {
    const manualLang = localStorage.getItem('sely_preferred_lang');
    if (manualLang) return manualLang;

    // Vérifier cookie Google Translate
    const match = document.cookie.match(/googtrans=\/auto\/([^;]+)/);
    if (match && match[1]) {
      return match[1];
    }

    const i18nLang = i18n.language?.split('-')[0];
    if (i18nLang) return i18nLang;
  } catch (e) {}

  return 'fr';
}
