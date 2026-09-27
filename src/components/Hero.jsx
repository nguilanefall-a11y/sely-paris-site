import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useCity } from '../hooks/useCity';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  MessageSquare,
  Home,
  X,
  Phone,
  PlaneTakeoff,
  Train,
  MapPin,
  Car,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete';
import { getPopularDestinations } from '../lib/popularDestinations';
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

export default function Hero() {
  const { city, i18n } = useCity();
  const navigate = useNavigate();

  const [inputFocused, setInputFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const containerRef = useRef(null);

  const currentCity = city || 'paris';
  const destAutocomplete = useAddressAutocomplete('', currentCity);

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

  // Handle outside click to close suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setInputFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Filtered popular proposals for the active city
  const popularList = useMemo(() => {
    return getPopularDestinations(currentCity, destAutocomplete.query);
  }, [currentCity, destAutocomplete.query]);

  // Combined list to display: live photon results if available, otherwise matched popular destinations
  const displayList = useMemo(() => {
    if (destAutocomplete.suggestions && destAutocomplete.suggestions.length > 0) {
      return destAutocomplete.suggestions.map((item) => ({
        id: item.id,
        label: item.label || item.description,
        subtitle: item.subtitle || (item.label && item.label.includes(',') ? item.label.split(',').slice(1).join(',').trim() : ''),
        type: item.type || (item.label.toLowerCase().includes('aéroport') || item.label.toLowerCase().includes('airport') ? 'airport' : 'address'),
      }));
    }
    return popularList;
  }, [destAutocomplete.suggestions, popularList]);

  const handleSelectDestination = useCallback((item) => {
    const label = item.label || item.description || '';
    destAutocomplete.setQuery(label);
    setDropdownOpen(false);
    setInputFocused(false);

    const cityPath = currentCity !== 'paris' ? currentCity : 'paris';
    const params = new URLSearchParams({
      step: '1',
      service: 'transfer',
      destination: label,
    });
    navigate(`/${cityPath}/reserver?${params.toString()}`);
  }, [currentCity, destAutocomplete, navigate]);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    const cityPath = currentCity !== 'paris' ? currentCity : 'paris';
    const val = destAutocomplete.query.trim();
    if (!val) {
      navigate(`/${cityPath}/reserver`);
      return;
    }
    const params = new URLSearchParams({
      step: '1',
      service: 'transfer',
      destination: val,
    });
    navigate(`/${cityPath}/reserver?${params.toString()}`);
  }, [currentCity, destAutocomplete.query, navigate]);

  const scrollToServices = () => {
    const el = document.getElementById('vehicules') || document.querySelector('section:nth-of-type(2)');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  const showSuggestions = dropdownOpen && displayList && displayList.length > 0;

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

        {/* Destination Input with Immediate Live Proposals attached right underneath */}
        <div className={styles.destinationContainer} ref={containerRef}>
          <form
            className={`${styles.destinationLineWrapper} ${inputFocused ? styles.destinationLineWrapperFocused : ''}`}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className={styles.destinationUnderlineInput}
              placeholder={ht.destinationPlaceholder}
              value={destAutocomplete.query}
              onChange={(e) => {
                destAutocomplete.setQuery(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => {
                setInputFocused(true);
                setDropdownOpen(true);
              }}
              aria-label={ht.destinationPlaceholder}
              autoComplete="off"
            />
            {destAutocomplete.isLoading ? (
              <div className={styles.destLoadingSpinner}>
                <Loader2 size={18} className={styles.spinnerIcon} />
              </div>
            ) : (
              <button
                type="submit"
                className={styles.destSubmitArrowBtn}
                aria-label="Valider la destination"
              >
                <ArrowRight size={20} strokeWidth={1.8} />
              </button>
            )}
          </form>

          {/* Autocomplete proposals popover directly attached below the input */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                className={styles.destSuggestionsDropdown}
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.18 }}
              >
                {displayList.map((item, idx) => {
                  const lbl = item.label || '';
                  const isAirport =
                    item.type === 'airport' ||
                    lbl.toLowerCase().includes('aéroport') ||
                    lbl.toLowerCase().includes('airport') ||
                    lbl.includes('CDG') ||
                    lbl.includes('ORY') ||
                    lbl.includes('LFPB');
                  const isStation =
                    item.type === 'station' ||
                    lbl.toLowerCase().includes('gare') ||
                    lbl.toLowerCase().includes('station');

                  return (
                    <button
                      key={item.id || idx}
                      type="button"
                      className={styles.destSuggestionItem}
                      onClick={() => handleSelectDestination(item)}
                    >
                      <div className={styles.suggestionIconWrap}>
                        {isAirport ? (
                          <PlaneTakeoff size={15} strokeWidth={1.8} />
                        ) : isStation ? (
                          <Train size={15} strokeWidth={1.8} />
                        ) : (
                          <MapPin size={15} strokeWidth={1.8} />
                        )}
                      </div>
                      <div className={styles.suggestionTextWrap}>
                        <span className={styles.suggestionMainText}>{lbl}</span>
                        {item.subtitle && (
                          <span className={styles.suggestionSubText}>{item.subtitle}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          className={styles.exploreServicesBtn}
          onClick={scrollToServices}
        >
          <span>{ht.exploreServices}</span>
        </button>
      </div>

      {/* Floating Bottom Capsule Nav matching exact mobile photo (hidden when typing/focused to keep screen clean) */}
      {!inputFocused && (
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
            onClick={scrollToServices}
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
      )}

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
                <button
                  type="button"
                  onClick={() => setHelpOpen(false)}
                  className={styles.closeBtn}
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
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
