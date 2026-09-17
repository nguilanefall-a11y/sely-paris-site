import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCity } from '../hooks/useCity';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Calendar, Clock, ArrowRight, Sparkles, Navigation } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete';
import { formatDateISO, formatTimeHHMM, getEarliestBookingDateTime, validateBookingDateTime } from '../lib/bookingTime';

gsap.registerPlugin(ScrollTrigger);

const CustomDurationSelect = ({ options, t, onSelect, selectedIndex: controlledIndex }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(controlledIndex || 0);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.customSelect} ref={ref}>
      <div
        className={`${styles.selectTrigger} ${isOpen ? styles.selectOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{options[selectedIndex]}</span>
        <ChevronDown
          size={14}
          className={`${styles.selectChevron} ${isOpen ? styles.chevronRotated : ''}`}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.selectDropdown}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {options.map((option, idx) => (
              <div
                key={idx}
                className={`${styles.selectOption} ${idx === selectedIndex ? styles.selectOptionActive : ''}`}
                onClick={() => {
                  setSelectedIndex(idx);
                  if (onSelect) onSelect(idx, option);
                  setIsOpen(false);
                }}
              >
                {option}
                {idx === selectedIndex && (
                  <span className={styles.checkMark}>✓</span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Hero() {
  const { t, getCityPath, currentCity, i18n } = useCity();
  const bgMedia = t('hero.video', '/hero-video-nb.mp4');
  const isVideo = !bgMedia.endsWith('.jpg') && !bgMedia.endsWith('.png') && !bgMedia.endsWith('.webp') && !bgMedia.endsWith('.jpeg');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('transfer');
  
  // Hook up address autocomplete with active city bias
  const pickupAutocomplete = useAddressAutocomplete('', currentCity || 'paris');
  const destAutocomplete = useAddressAutocomplete('', currentCity || 'paris');
  
  const pickupValue = pickupAutocomplete.query;
  const setPickupValue = pickupAutocomplete.setQuery;
  const destinationValue = destAutocomplete.query;
  const setDestinationValue = destAutocomplete.setQuery;

  const [pickupCoords, setPickupCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  
  const earliestDateTime = useMemo(() => getEarliestBookingDateTime(), []);
  const todayISO = useMemo(() => formatDateISO(new Date()), []);

  const [dateValue, setDateValue] = useState(() => formatDateISO(earliestDateTime));
  const [timeValue, setTimeValue] = useState(() => formatTimeHHMM(earliestDateTime));
  const [durationValue, setDurationValue] = useState('');

  // Suggestion focused states
  const [pickupFocused, setPickupFocused] = useState(false);
  const [destFocused, setDestFocused] = useState(false);

  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  // GSAP refs
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const videoRef = useRef(null);
  const bookingBarRef = useRef(null);
  const heroLineRef = useRef(null);
  const [errorKey, setErrorKey] = useState('');

  const durationOptions = [
    t('hero.duration_3h', '3h (60 km inclus)'),
    t('hero.duration_4h', '4h (80 km inclus)'),
    t('hero.duration_5h', '5h (100 km inclus)'),
    t('hero.duration_6h', '6h (120 km inclus)'),
    t('hero.duration_7h', '7h (140 km inclus)'),
    t('hero.duration_8h', '8h (160 km inclus - Journée)'),
    t('hero.duration_9h', '9h (180 km inclus)'),
    t('hero.duration_10h', '10h (200 km inclus)'),
    t('hero.duration_11h', '11h (220 km inclus)'),
    t('hero.duration_12h', '12h (240 km inclus)'),
    t('hero.duration_13h', '13h (260 km inclus)'),
    t('hero.duration_14h', '14h (280 km inclus)'),
    t('hero.duration_multi', 'Plusieurs journées (Sur devis)')
  ];

  const formatDate = (val) => {
    if (!val) return '';
    const d = new Date(val + 'T00:00:00');
    return d.toLocaleDateString(i18n?.language === 'en' ? 'en-US' : 'fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (val) => {
    if (!val) return '';
    return val;
  };

  const getErrorFallback = (key) => {
    switch (key) {
      case 'error_pickup':
        return 'Veuillez renseigner une adresse exacte de prise en charge pour continuer.';
      case 'error_destination':
        return 'Veuillez renseigner une adresse exacte de destination.';
      case 'error_past_datetime':
        return 'Veuillez sélectionner une date et une heure dans le futur.';
      case 'error_min_notice_3h':
        return "Les réservations en ligne nécessitent un délai d'au moins 3 heures.";
      case 'error_night_before_8am':
        return 'Les départs matinaux en réservation directe ne sont pas disponibles avant 08h00.';
      default:
        return 'Veuillez vérifier vos informations.';
    }
  };

  const handleBookingClick = (e) => {
    e.preventDefault();
    setErrorKey('');

    // Blacklane-style mandatory check: pickup must be provided
    if (!pickupValue || pickupValue.trim().length < 3) {
      setErrorKey('error_pickup');
      setPickupFocused(true);
      return;
    }

    // If transfer, destination must also be provided
    if (activeTab === 'transfer' && (!destinationValue || destinationValue.trim().length < 3)) {
      setErrorKey('error_destination');
      setDestFocused(true);
      return;
    }

    // Lead time & night check: minimum 3h notice, night not before 8am
    const timeValidation = validateBookingDateTime(dateValue, timeValue);
    if (!timeValidation.isValid) {
      setErrorKey(timeValidation.errorKey);
      return;
    }

    const params = new URLSearchParams();
    params.set('service', activeTab);
    params.set('pickup', pickupValue.trim());
    if (activeTab === 'transfer') {
      params.set('destination', destinationValue.trim());
      if (destCoords) params.set('destCoords', destCoords.join(','));
    } else {
      params.set('duration', durationValue || '3h (60 km inclus)');
    }
    if (pickupCoords) params.set('pickupCoords', pickupCoords.join(','));
    if (dateValue) params.set('date', dateValue);
    if (timeValue) params.set('time', timeValue);
    navigate(getCityPath(`/reserver?${params.toString()}`));
  };

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text split animation for the hero title
      if (titleRef.current) {
        const titleEl = titleRef.current;
        const text = titleEl.innerHTML;
        // Wrap each word in a span for animation
        const words = text.split(/(\s+|<[^>]+>)/g).filter(Boolean);
        let wrappedHTML = '';
        words.forEach((word) => {
          if (word.match(/^</) || word.match(/^\s+$/)) {
            wrappedHTML += word;
          } else {
            wrappedHTML += `<span class="${styles.heroWord}">${word}</span>`;
          }
        });
        titleEl.innerHTML = wrappedHTML;

        const wordSpans = titleEl.querySelectorAll(`.${styles.heroWord}`);
        gsap.fromTo(wordSpans,
          { opacity: 0, y: 30, filter: 'blur(4px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.5,
          }
        );
      }

      // Booking bar slide-up with subtle bounce
      if (bookingBarRef.current) {
        gsap.fromTo(bookingBarRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0,
            duration: 1,
            ease: 'back.out(1.2)',
            delay: 1.2,
          }
        );
      }

      // Image parallax on scroll (desktop/tablet only, disabled on mobile to prevent scroll jump bug)
      let mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        if (videoRef.current) {
          gsap.to(videoRef.current, {
            y: 80,
            scale: 1.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5,
            },
          });
        }
      });

      // Hero luminous line animation
      if (heroLineRef.current) {
        gsap.fromTo(heroLineRef.current,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1, opacity: 1,
            duration: 1.5,
            ease: 'power2.inOut',
            delay: 1.8,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.heroSection}>
      {isVideo ? (
        <video
          ref={videoRef}
          src={bgMedia}
          autoPlay
          loop
          muted
          playsInline
          className={styles.videoBackground}
          style={{ 
            objectPosition: t('hero.video_position', 'center'),
            filter: t('hero.video_filter', 'none')
          }}
        />
      ) : (
        <img
          src={bgMedia}
          alt={t('hero.media_alt', 'SELY Chauffeur Privé')}
          className={styles.videoBackground}
          style={{ 
            objectFit: 'cover', 
            width: '100%', 
            height: '100%', 
            objectPosition: t('hero.video_position', 'center'),
            filter: t('hero.video_filter', 'none')
          }}
        />
      )}
      <div className={styles.videoOverlay}></div>

      {/* Luminous line at bottom of hero */}
      <div ref={heroLineRef} className={styles.heroLine}></div>

      <div className={styles.heroCenter}>
        <h1
          ref={titleRef}
          className={styles.heroTitle}
          dangerouslySetInnerHTML={{ __html: t('hero.headline', "L'art du <em>déplacement</em>.") }}
        />
      </div>

      <div
        ref={bookingBarRef}
        className={styles.bookingBar}
        style={{ opacity: 0 }}
      >
        <div className={styles.tabsWrapper}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'transfer' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('transfer')}
            >
              <Navigation size={13} className={styles.tabIcon} />
              {t('hero.tab_transfer', 'Transfert')}
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'hourly' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('hourly')}
            >
              <Clock size={13} className={styles.tabIcon} />
              {t('hero.tab_hourly', 'Mise à disposition')}
            </button>
          </div>
        </div>

        <div className={styles.fields}>
          <div className={styles.field}>
            <label>
              <MapPin size={12} className={styles.labelIcon} />
              {t('hero.pickup_label', 'Lieu de prise en charge')}
            </label>
            <input
              type="text"
              placeholder={t('hero.pickup_placeholder', 'Adresse, aéroport, hôtel...')}
              value={pickupValue}
              onChange={(e) => setPickupValue(e.target.value)}
              onFocus={() => setPickupFocused(true)}
              onBlur={() => setPickupFocused(false)}
            />
            <AnimatePresence>
              {pickupFocused && pickupAutocomplete.suggestions.length > 0 && (
                <motion.div 
                  className={styles.suggestions}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {pickupAutocomplete.suggestions.map((s) => (
                    <div 
                      key={s.id} 
                      className={styles.suggestionItem}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setPickupValue(s.label);
                        if (s.coordinates) setPickupCoords(s.coordinates);
                        pickupAutocomplete.setSuggestions([]);
                        setPickupFocused(false);
                      }}
                    >
                      <MapPin size={13} style={{ marginRight: 6, opacity: 0.7, flexShrink: 0 }} />
                      <span>{s.label}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.fieldDivider}></div>

          <AnimatePresence mode="wait">
            {activeTab === 'transfer' ? (
              <motion.div
                key="destination"
                className={styles.field}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.2 }}
              >
                <label>
                  <Navigation size={12} className={styles.labelIcon} />
                  {t('hero.destination_label', 'Destination')}
                </label>
                <input
                  type="text"
                  placeholder={t('hero.destination_placeholder', 'Adresse exacte, aéroport, hôtel...')}
                  value={destinationValue}
                  onChange={(e) => setDestinationValue(e.target.value)}
                  onFocus={() => setDestFocused(true)}
                  onBlur={() => setDestFocused(false)}
                />
                <AnimatePresence>
                  {destFocused && destAutocomplete.suggestions.length > 0 && (
                    <motion.div 
                      className={styles.suggestions}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {destAutocomplete.suggestions.map((s) => (
                        <div 
                          key={s.id} 
                          className={styles.suggestionItem}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setDestinationValue(s.label);
                            if (s.coordinates) setDestCoords(s.coordinates);
                            destAutocomplete.setSuggestions([]);
                            setDestFocused(false);
                          }}
                        >
                          <Navigation size={13} style={{ marginRight: 6, opacity: 0.7, flexShrink: 0 }} />
                          <span>{s.label}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="duration"
                className={styles.field}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.2 }}
              >
                <label>
                  <Sparkles size={12} className={styles.labelIcon} />
                  {t('hero.duration_label', 'Durée')}
                </label>
                <CustomDurationSelect 
                  options={durationOptions} 
                  t={t} 
                  onSelect={(idx, label) => setDurationValue(label)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.fieldDivider}></div>

          <div className={`${styles.field} ${styles.fieldClickable}`} onClick={() => dateInputRef.current?.showPicker?.()}>
            <label>
              <Calendar size={12} className={styles.labelIcon} />
              {t('hero.date_label', 'Date')}
            </label>
            <div className={styles.dateTimeDisplay}>
              <span className={dateValue ? styles.valueSet : styles.valuePlaceholder}>
                {dateValue ? formatDate(dateValue) : t('hero.date_placeholder', 'jj/mm/aaaa')}
              </span>
              <input
                ref={dateInputRef}
                type="date"
                min={todayISO}
                className={styles.hiddenNativeInput}
                onChange={(e) => setDateValue(e.target.value)}
                value={dateValue}
              />
            </div>
          </div>

          <div className={styles.fieldDivider}></div>

          <div className={`${styles.field} ${styles.fieldClickable}`} onClick={() => timeInputRef.current?.showPicker?.()}>
            <label>
              <Clock size={12} className={styles.labelIcon} />
              {t('hero.time_label', 'Heure de prise en charge')}
            </label>
            <div className={styles.dateTimeDisplay}>
              <span className={timeValue ? styles.valueSet : styles.valuePlaceholder}>
                {timeValue ? formatTime(timeValue) : '--:--'}
              </span>
              <input
                ref={timeInputRef}
                type="time"
                className={styles.hiddenNativeInput}
                onChange={(e) => setTimeValue(e.target.value)}
                value={timeValue}
              />
            </div>
          </div>

          <button onClick={handleBookingClick} className={styles.bookingCta}>
            <span>{t('hero.cta_options', 'Réservez')}</span>
            <ArrowRight size={15} className={styles.ctaArrow} />
          </button>
        </div>

        {errorKey && (
          <motion.div 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.heroError}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', width: '100%' }}>
              <span>⚠️ {t(`hero.${errorKey}`, getErrorFallback(errorKey))}</span>
              {['error_min_notice_3h', 'error_night_before_8am', 'error_past_datetime'].includes(errorKey) && (
                <button
                  type="button"
                  onClick={() => navigate(getCityPath(`/demande-specifique?type=rapide&pickup=${encodeURIComponent(pickupValue || '')}&date=${dateValue}&time=${timeValue}`))}
                  style={{
                    background: '#e5c158',
                    color: '#0b0c0e',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  ⚡ {t('hero.urgent_cta', 'Prise en charge rapide')}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Demande spécifique ── */}
        <div className={styles.specialBar}>
          <span className={styles.specialText}>
            {t('hero.special_text', 'Vous avez une question ou une demande spécifique ?')}
          </span>
          <button onClick={() => navigate(getCityPath('/demande-specifique'))} className={styles.specialCta}>
            <span>{t('hero.special_cta_full', 'Demande sur-mesure')}</span>
            <ArrowRight size={13} className={styles.specialArrow} />
          </button>
        </div>
      </div>
    </section>
  );
}
