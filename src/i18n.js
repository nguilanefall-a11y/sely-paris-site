import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frTranslation from './locales/fr.json';
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import arTranslation from './locales/ar.json';
import zhTranslation from './locales/zh.json';
import deTranslation from './locales/de.json';
import itTranslation from './locales/it.json';
import ptTranslation from './locales/pt.json';
import ruTranslation from './locales/ru.json';
import jaTranslation from './locales/ja.json';

// Détecteur intelligent de langue pour les visiteurs SELY :
const SUPPORTED_LANGS = ['fr', 'en', 'es', 'ar', 'zh', 'de', 'it', 'pt', 'ru', 'ja'];

const selySmartDetector = {
  name: 'selySmartDetector',
  lookup() {
    if (typeof window === 'undefined') return 'fr';

    const pathname = (window.location.pathname || '').toLowerCase();
    const firstSegment = pathname.split('/').filter(Boolean)[0];
    if (['fr', 'en', 'es', 'ar', 'zh', 'de', 'it', 'pt', 'ru', 'ja'].includes(firstSegment)) {
      if (firstSegment === 'ar') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
      return firstSegment;
    }

    try {
      const hasManual = localStorage.getItem('sely_manual_lang') === 'true';
      const saved = localStorage.getItem('sely_preferred_lang') || localStorage.getItem('i18nextLng');
      if (hasManual && saved && SUPPORTED_LANGS.includes(saved)) {
        if (saved === 'ar') document.documentElement.dir = 'rtl';
        return saved;
      }

      const geoSaved = sessionStorage.getItem('sely_geo_lang');
      if (geoSaved && SUPPORTED_LANGS.includes(geoSaved)) {
        if (geoSaved === 'ar') document.documentElement.dir = 'rtl';
        return geoSaved;
      }
    } catch (e) {
      // Storage unavailable
    }

    const navLangs = navigator.languages || [navigator.language || ''];
    for (const l of navLangs) {
      if (!l) continue;
      const code = l.toLowerCase().split('-')[0];
      if (SUPPORTED_LANGS.includes(code)) {
        if (code === 'ar') document.documentElement.dir = 'rtl';
        return code;
      }
    }

    return 'fr';
  },
  cacheUserLanguage(lng) {
    if (typeof window !== 'undefined') {
      try {
        if (lng === 'ar') {
          document.documentElement.dir = 'rtl';
        } else {
          document.documentElement.dir = 'ltr';
        }
      } catch (e) {}
    }
  },
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(selySmartDetector);

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: frTranslation },
      en: { translation: enTranslation },
      es: { translation: esTranslation },
      ar: { translation: arTranslation },
      zh: { translation: zhTranslation },
      de: { translation: deTranslation },
      it: { translation: itTranslation },
      pt: { translation: ptTranslation },
      ru: { translation: ruTranslation },
      ja: { translation: jaTranslation },
    },
    fallbackLng: 'fr',
    supportedLngs: SUPPORTED_LANGS,
    detection: {
      order: ['selySmartDetector'],
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Handle RTL and html lang on language change and initial load
const syncDocumentLanguage = (lng) => {
  if (typeof document !== 'undefined') {
    const lang = lng || 'fr';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }
};

syncDocumentLanguage(i18n.language);
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
