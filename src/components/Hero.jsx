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
    helpTitle: 'Assistance & Conciergerie VIP',
    helpDesc: 'Notre direction des opérations est à votre écoute 24h/24 et 7j/7.',
    helpWhatsapp: 'Échanger sur WhatsApp',
  },
  en: {
    welcome: 'Welcome',
    heroTitle: 'Start\nyour journey',
    destinationPlaceholder: 'Where to? Enter destination',
    exploreServices: '↓ Explore journeys & services',
    navHome: 'Home',
    navJourneys: 'Journeys',
    navHelp: 'Help',
    helpTitle: 'VIP Concierge & Dispatch',
    helpDesc: 'Our operations desk is available 24/7.',
    helpWhatsapp: 'Chat on WhatsApp',
  },
  es: {
    welcome: 'Bienvenido',
    heroTitle: 'Comience\nsu viaje',
    destinationPlaceholder: 'Ingrese su destino',
    exploreServices: '↓ Explorar viajes y servicios',
    navHome: 'Inicio',
    navJourneys: 'Viajes',
    navHelp: 'Ayuda',
    helpTitle: 'Asistencia & Conserjería VIP',
    helpDesc: 'Nuestro equipo de operaciones está a su disposición 24/7.',
    helpWhatsapp: 'Contactar por WhatsApp',
  },
  ar: {
    welcome: 'مرحباً بكم',
    heroTitle: 'ابدأ\nرحلتك',
    destinationPlaceholder: 'أدخل وجهتك',
    exploreServices: '↓ استكشف الرحلات والخدمات',
    navHome: 'الرئيسية',
    navJourneys: 'الرحلات',
    navHelp: 'المساعدة',
    helpTitle: 'المساعدة والكونسيرج VIP',
    helpDesc: 'فريق العمليات لدينا في خدمتكم على مدار الساعة 24/7.',
    helpWhatsapp: 'محادثة عبر واتساب',
  },
  zh: {
    welcome: '欢迎',
    heroTitle: '开启您的\n尊享旅程',
    destinationPlaceholder: '输入您的目的地',
    exploreServices: '↓ 探索专属行程与服务',
    navHome: '首页',
    navJourneys: '行程',
    navHelp: '帮助',
    helpTitle: 'VIP尊享礼宾与全天候支持',
    helpDesc: '运营调度中心为您提供24小时全天候服务。',
    helpWhatsapp: '通过 WhatsApp 沟通',
  },
  de: {
    welcome: 'Willkommen',
    heroTitle: 'Beginnen Sie\nIhre Reise',
    destinationPlaceholder: 'Wohin möchten Sie? Ziel eingeben',
    exploreServices: '↓ Reisen & Services entdecken',
    navHome: 'Startseite',
    navJourneys: 'Reisen',
    navHelp: 'Hilfe',
    helpTitle: 'VIP-Concierge & Kundenservice',
    helpDesc: 'Unsere Einsatzleitung ist rund um die Uhr für Sie da (24/7).',
    helpWhatsapp: 'Über WhatsApp schreiben',
  },
  it: {
    welcome: 'Benvenuto',
    heroTitle: 'Iniziate il\nvostro viaggio',
    destinationPlaceholder: 'Dove desiderate andare? Destinazione',
    exploreServices: '↓ Scoprite viaggi e servizi',
    navHome: 'Home',
    navJourneys: 'Viaggi',
    navHelp: 'Aiuto',
    helpTitle: 'Assistenza & Concierge VIP',
    helpDesc: 'La nostra centrale operativa è a vostra disposizione 24/7.',
    helpWhatsapp: 'Scrivi su WhatsApp',
  },
  pt: {
    welcome: 'Bem-vindo',
    heroTitle: 'Comece a\nsua viagem',
    destinationPlaceholder: 'Para onde vai? Insira o destino',
    exploreServices: '↓ Explorar viagens e serviços',
    navHome: 'Início',
    navJourneys: 'Viagens',
    navHelp: 'Ajuda',
    helpTitle: 'Assistência & Concierge VIP',
    helpDesc: 'A nossa central de operações está disponível 24 horas por dia, 7 dias por semana.',
    helpWhatsapp: 'Falar no WhatsApp',
  },
  ru: {
    welcome: 'Добро пожаловать',
    heroTitle: 'Начните ваше\nпутешествие',
    destinationPlaceholder: 'Куда едем? Введите пункт назначения',
    exploreServices: '↓ Посмотреть поездки и услуги',
    navHome: 'Главная',
    navJourneys: 'Поездки',
    navHelp: 'Помощь',
    helpTitle: 'VIP-консьерж и поддержка',
    helpDesc: 'Наша операционная служба на связи 24 часа в сутки, 7 дней в неделю.',
    helpWhatsapp: 'Написать в WhatsApp',
  },
  ja: {
    welcome: 'ようこそ',
    heroTitle: '特別な旅を\nここから',
    destinationPlaceholder: '目的地を入力してください',
    exploreServices: '↓ 旅程とサービスを見る',
    navHome: 'ホーム',
    navJourneys: '旅程',
    navHelp: 'ヘルプ',
    helpTitle: 'VIP コンシェルジュ＆サポート',
    helpDesc: '運行オペレーションデスクは24時間365日対応いたします。',
    helpWhatsapp: 'WhatsAppで問い合わせる',
  },
};

export default function Hero({ hideBottomNav = false }) {
  const { city, getCityPath, i18n } = useCity();
  const navigate = useNavigate();

  const [helpOpen, setHelpOpen] = useState(false);

  const currentCity = city || 'paris';
  const cleanLang = (i18n?.language || 'fr').split('-')[0].toLowerCase();
  const ht = HERO_TEXTS[cleanLang] || HERO_TEXTS.fr;

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
                    <h3>{ht.helpTitle}</h3>
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
                    {ht.helpDesc}
                  </p>
                  <div className={styles.helpActions}>
                    <a
                      href="https://wa.me/33184805676?text=Bonjour%20SELY%20Privé,%20je%20souhaite%20un%20renseignement%20sur%20un%20service."
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsappBtn}
                    >
                      <MessageSquare size={16} />
                      <span>{ht.helpWhatsapp}</span>
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
