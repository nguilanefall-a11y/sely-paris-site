import React, { useState, useCallback } from 'react';
import { useCity } from '../hooks/useCity';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, MessageSquare, Home, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Hero.module.css';

const HERO_TEXTS = {
  fr: {
    welcome: 'Bienvenue',
    heroTitle: 'Commencez votre voyage',
    destinationPlaceholder: 'Saisissez votre destination',
    exploreServices: '↓ Explorez les voyages et les services',
    navHome: 'Accueil',
    navJourneys: 'Voyages',
    navHelp: 'Aide',
  },
  en: {
    welcome: 'Welcome',
    heroTitle: 'Start your journey',
    destinationPlaceholder: 'Where to? Enter destination',
    exploreServices: '↓ Explore journeys & services',
    navHome: 'Home',
    navJourneys: 'Journeys',
    navHelp: 'Help',
  },
  es: {
    welcome: 'Bienvenido',
    heroTitle: 'Comience su viaje',
    destinationPlaceholder: 'Ingrese su destino',
    exploreServices: '↓ Explorar viajes y servicios',
    navHome: 'Inicio',
    navJourneys: 'Viajes',
    navHelp: 'Ayuda',
  },
  ar: {
    welcome: 'مرحباً بكم',
    heroTitle: 'ابدأ رحلتك',
    destinationPlaceholder: 'أدخل وجهتك',
    exploreServices: '↓ استكشف الرحلات والخدمات',
    navHome: 'الرئيسية',
    navJourneys: 'الرحلات',
    navHelp: 'المساعدة',
  },
  zh: {
    welcome: '欢迎',
    heroTitle: '开启您的尊享旅程',
    destinationPlaceholder: '输入您的目的地',
    exploreServices: '↓ 探索专属行程与服务',
    navHome: '首页',
    navJourneys: '行程',
    navHelp: '帮助',
  },
};

export default function Hero() {
  const { city, i18n } = useCity();
  const navigate = useNavigate();

  const [destinationValue, setDestinationValue] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);

  const langKey = i18n?.language?.startsWith('en')
    ? 'en'
    : i18n?.language?.startsWith('es')
    ? 'es'
    : i18n?.language?.startsWith('ar')
    ? 'ar'
    : i18n?.language?.startsWith('zh')
    ? 'zh'
    : 'fr';

  const ht = HERO_TEXTS[langKey] || HERO_TEXTS.fr;

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    const cityPath = city && city !== 'paris' ? city : 'paris';
    if (!destinationValue.trim()) {
      navigate(`/${cityPath}/reserver`);
      return;
    }
    const params = new URLSearchParams({ step: '1', service: 'transfer', destination: destinationValue.trim() });
    navigate(`/${cityPath}/reserver?${params.toString()}`);
  }, [city, navigate, destinationValue]);

  const scrollToServices = () => {
    const el = document.getElementById('vehicules') || document.querySelector('section:nth-of-type(2)');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.bgImage} />
      <div className={styles.vignetteOverlay} />


      {/* Main Lower Third */}
      <div className={styles.mainContent}>
        <h1 className={styles.heroTitle}>
          {ht.heroTitle}
        </h1>

        <form className={styles.destinationLineWrapper} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.destinationUnderlineInput}
            placeholder={ht.destinationPlaceholder}
            value={destinationValue}
            onChange={(e) => setDestinationValue(e.target.value)}
            aria-label={ht.destinationPlaceholder}
          />
          <button type="submit" className={styles.destSubmitArrowBtn} aria-label="Valider la destination">
            <ArrowRight size={20} strokeWidth={1.8} />
          </button>
        </form>

        <button type="button" className={styles.exploreServicesBtn} onClick={scrollToServices}>
          <span>{ht.exploreServices}</span>
        </button>
      </div>

      {/* Floating Bottom Capsule Nav */}
      <nav className={styles.floatingCapsuleNav} aria-label="Navigation">
        <button
          type="button"
          className={`${styles.capsuleNavBtn} ${styles.capsuleNavBtnActive}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Home size={18} strokeWidth={1.8} />
          <span>{ht.navHome}</span>
        </button>

        <button
          type="button"
          className={styles.capsuleNavBtn}
          onClick={scrollToServices}
        >
          <Compass size={18} strokeWidth={1.8} />
          <span>{ht.navJourneys}</span>
        </button>

        <button
          type="button"
          className={styles.capsuleNavBtn}
          onClick={() => setHelpOpen(true)}
        >
          <MessageSquare size={18} strokeWidth={1.8} />
          <span>{ht.navHelp}</span>
        </button>
      </nav>

      {/* Help Modal */}
      <AnimatePresence>
        {helpOpen && (
          <>
            <motion.div
              className={styles.modalBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHelpOpen(false)}
            />
            <motion.div
              className={styles.helpModal}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
            >
              <div className={styles.helpHeader}>
                <h3>Assistance & Conciergerie VIP</h3>
                <button type="button" onClick={() => setHelpOpen(false)} className={styles.closeBtn}>
                  <X size={20} />
                </button>
              </div>
              <p className={styles.helpText}>Notre direction des opérations est à votre écoute 24h/24 et 7j/7.</p>
              <div className={styles.helpActions}>
                <a
                  href="https://wa.me/33184805676?text=Bonjour%20SELY%20Privé,%20je%20souhaite%20un%20renseignement%20sur%20un%20service."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                >
                  <MessageSquare size={16} />
                  <span>Échanger sur WhatsApp</span>
                </a>
                <a href="tel:+33184805676" className={styles.phoneBtn}>
                  <Phone size={16} />
                  <span>+33 1 84 80 56 76</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
