import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frTranslation from './locales/fr.json';
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import arTranslation from './locales/ar.json';
import zhTranslation from './locales/zh.json';

// Détecteur intelligent de langue pour les visiteurs SELY :
const SUPPORTED_LANGS = ['fr', 'en', 'es', 'ar', 'zh'];

const selySmartDetector = {
  name: 'selySmartDetector',
  lookup() {
    if (typeof window === 'undefined') return 'fr';

    const saved = localStorage.getItem('i18nextLng');
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

    const pathname = (window.location.pathname || '').toLowerCase();
    if (pathname.startsWith('/london') || pathname.startsWith('/usa')) return 'en';
    if (pathname.startsWith('/uae')) return 'ar';

    const navLangs = navigator.languages || [navigator.language || ''];
    for (const l of navLangs) {
      if (!l) continue;
      const code = l.toLowerCase().split('-')[0];
      if (SUPPORTED_LANGS.includes(code)) return code;
    }

    return 'fr';
  },
  cacheUserLanguage(lng) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lng);
      if (lng === 'ar') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
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
    },
    fallbackLng: 'fr',
    supportedLngs: SUPPORTED_LANGS,
    detection: {
      order: ['selySmartDetector', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Handle RTL on language change
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  }
});

export default i18n;
