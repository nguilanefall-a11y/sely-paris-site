import React, { useState } from 'react';
import { useCity } from '../hooks/useCity';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  MessageSquare,
  Home,
  X,
  Phone,
  Car,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Hero.module.css';

const HERO_TEXTS = {
  fr: {
    welcome: 'Bienvenue',
    heroTitle: 'Commencez\nvotre voyage',
    destinationPlaceholder: 'Saisissez votre destination',
    exploreServices: '↓ Explorez les voyages et les services',
    navHome: 'Accueil',
    navJourneys: 'Voyages',
    navHelp: 'Aide',
  },
  en: {
    welcome: 'Welcome',
    heroTitle: 'Start\nyour journey',
    destinationPlaceholder: 'Where to? Enter destination',
    exploreServices: '↓ Explore journeys & services',
    navHome: 'Home',
    navJourneys: 'Journeys',
    navHelp: 'Help',
  },
  es: {
    welcome: 'Bienvenido',
    heroTitle: 'Comience\nsu viaje',
    destinationPlaceholder: 'Ingrese su destino',
    exploreServices: '↓ Explorar viajes y servicios',
    navHome: 'Inicio',
    navJourneys: 'Viajes',
    navHelp: 'Ayuda',
  },
  ar: {
    welcome: 'مرحباً بكم',
    heroTitle: 'ابدأ\nرحلتك',
    destinationPlaceholder: 'أدخل وجهتك',
    exploreServices: '↓ استكشف الرحلات والخدمات',
    navHome: 'الرئيسية',
    navJourneys: 'الرحلات',
    navHelp: 'المساعدة',
  },
  zh: {
    welcome: '欢迎',
    heroTitle: '开启您的\n尊享旅程',
    destinationPlaceholder: '输入您的目的地',
    exploreServices: '↓ 探索专属行程与服务',
    navHome: '首页',
    navJourneys: '行程',
    navHelp: '帮助',
  },
};

export default function Hero({ hideBottomNav = false }) {
  const { city, getCityPath, i18n } = useCity();
  const navigate = useNavigate();

  const [helpOpen, setHelpOpen] = useState(false);

  const currentCity = city || 'paris';

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

  const handleGoToReservation = () => {
    const cityPath = currentCity !== 'paris' ? currentCity : 'paris';
    navigate(`/${cityPath}/reserver`);
  };

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
          {ht.heroTitle.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < ht.heroTitle.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>

        {/* Destination Line Trigger: tapping it navigates directly to the dedicated booking screen */}
        <div className={styles.destinationContainer}>
          <div
            className={styles.destinationLineWrapper}
            onClick={handleGoToReservation}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleGoToReservation();
              }
            }}
            aria-label={ht.destinationPlaceholder}
          >
            <span className={styles.destinationTriggerPlaceholder}>
              {ht.destinationPlaceholder}
            </span>
            <div className={styles.destSubmitArrowBtn}>
              <ArrowRight size={20} strokeWidth={1.8} />
            </div>
          </div>
        </div>

        <button
          type="button"
          className={styles.exploreServicesBtn}
          onClick={scrollToServices}
        >
          <span>{ht.exploreServices}</span>
        </button>
      </div>

      {/* Floating Bottom Capsule Nav matching exact mobile photo */}
      {!hideBottomNav && (
        <>
          <nav className={styles.floatingCapsuleNav} aria-label="Navigation">
            <button
              type="button"
              className={`${styles.capsuleNavBtn} ${styles.capsuleNavBtnActive}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className={styles.activePillBackground}>
                <Home size={18} strokeWidth={2} />
                <span>{ht.navHome}</span>
              </div>
            </button>

            <button
              type="button"
              className={styles.capsuleNavBtn}
              onClick={() => navigate(getCityPath('/voyages'))}
            >
              <Car size={18} strokeWidth={1.8} />
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
              <motion.div
                className={styles.modalBackdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setHelpOpen(false)}
              >
                <motion.div
                  className={styles.helpModal}
                  initial={{ scale: 0.94, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.94, opacity: 0, y: 15 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.helpHeader}>
                    <h3>Assistance & Conciergerie VIP</h3>
                    <button
                      type="button"
                      onClick={() => setHelpOpen(false)}
                      className={styles.closeBtn}
                      aria-label="Fermer"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <p className={styles.helpText}>
                    Notre direction des opérations est à votre écoute 24h/24 et 7j/7.
                  </p>
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
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </section>
  );
}
