import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frTranslation from './locales/fr.json';
import enTranslation from './locales/en.json';

// Détecteur intelligent de langue pour les visiteurs SELY :
// 1. Choix explicite enregistré en premier (localStorage)
// 2. Si premier visiteur : vérifie si l'appareil a le français dans ses langues préférées (navigator.languages)
// 3. Si ville internationale (/london, /usa, /uae) -> anglais
// 4. Par défaut pour la Maison Paris -> français
const selySmartDetector = {
  name: 'selySmartDetector',
  lookup() {
    if (typeof window === 'undefined') return 'fr';

    // 1. Si l'utilisateur a déjà cliqué pour choisir sa langue, on respecte son choix
    const saved = localStorage.getItem('i18nextLng');
    if (saved === 'fr' || saved === 'en') return saved;

    const pathname = (window.location.pathname || '').toLowerCase();
    const isInternationalCity =
      pathname.startsWith('/london') ||
      pathname.startsWith('/usa') ||
      pathname.startsWith('/uae');

    if (isInternationalCity) {
      return 'en';
    }

    // 2. Détection selon les langues de l'appareil du visiteur (iOS, Android, Mac, Windows)
    const navLangs = navigator.languages || [navigator.language || ''];
    const hasFrench = navLangs.some(
      (l) => l && l.toLowerCase().startsWith('fr')
    );

    // Si l'utilisateur est francophone, on le sert toujours en français
    if (hasFrench) {
      return 'fr';
    }

    // Si le visiteur est sur la page Paris sans langue explicite mais avec device purement non-francophone
    const isPurelyForeign = navLangs.length > 0 && !hasFrench;
    if (isPurelyForeign && !pathname.startsWith('/paris') && !pathname.startsWith('/bordeaux') && pathname !== '/') {
      return 'en';
    }

    // Par défaut sur le domaine SELY Paris
    return 'fr';
  },
  cacheUserLanguage(lng) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lng);
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
      fr: {
        translation: frTranslation,
      },
      en: {
        translation: enTranslation,
      },
    },
    fallbackLng: 'fr',
    detection: {
      order: ['selySmartDetector', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
