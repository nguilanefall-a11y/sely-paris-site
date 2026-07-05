import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete';

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('transfer');
  
  // Hook up address autocomplete
  const pickupAutocomplete = useAddressAutocomplete();
  const destAutocomplete = useAddressAutocomplete();
  
  const pickupValue = pickupAutocomplete.query;
  const setPickupValue = pickupAutocomplete.setQuery;
  const destinationValue = destAutocomplete.query;
  const setDestinationValue = destAutocomplete.setQuery;
  
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [durationValue, setDurationValue] = useState('');

  // Suggestion focused states
  const [pickupFocused, setPickupFocused] = useState(false);
  const [destFocused, setDestFocused] = useState(false);

  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  // Pre-fill date and time by default
  useEffect(() => {
    const now = new Date();
    
    // Date: YYYY-MM-DD
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    setDateValue(`${y}-${m}-${d}`);
    
    // Time: next rounded hour
    let h = now.getHours() + 1;
    if (h >= 24) h = 0;
    setTimeValue(`${String(h).padStart(2, '0')}:00`);
  }, []);

  // GSAP refs
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const videoRef = useRef(null);
  const bookingBarRef = useRef(null);
  const heroLineRef = useRef(null);

  const durationOptions = [
    t('hero.duration_2h', '2h (80 km inclus)'),
    t('hero.duration_4h', '4h (160 km inclus)'),
    t('hero.duration_6h', '6h (240 km inclus)'),
    t('hero.duration_8h', '8h (320 km inclus)'),
    t('hero.duration_10h', '10h (400 km inclus)'),
    t('hero.duration_multi', 'Plusieurs journées')
  ];

  const formatDate = (val) => {
    if (!val) return '';
    const d = new Date(val + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (val) => {
    if (!val) return '';
    return val;
  };

  const handleBookingClick = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('service', activeTab);
    if (pickupValue) params.set('pickup', pickupValue);
    if (activeTab === 'transfer' && destinationValue) params.set('destination', destinationValue);
    if (activeTab === 'hourly' && durationValue) params.set('duration', durationValue);
    if (dateValue) params.set('date', dateValue);
    if (timeValue) params.set('time', timeValue);
    navigate(`/reserver?${params.toString()}`);
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
      <img
        ref={videoRef}
        src="/hero-bg.jpg"
        alt="Mercedes S-Class Paris"
        className={styles.videoBackground}
      />
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
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'transfer' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('transfer')}
          >
            {t('hero.tab_transfer', 'Transfert')}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'hourly' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('hourly')}
          >
            {t('hero.tab_hourly', 'Mise à disposition')}
          </button>
        </div>

        <div className={styles.fields}>
          <div className={styles.field}>
            <label>{t('hero.pickup_label', 'Lieu de prise en charge')}</label>
            <input
              type="text"
              placeholder={t('hero.pickup_placeholder', 'Adresse, aéroport, hôtel...')}
              value={pickupValue}
              onChange={(e) => setPickupValue(e.target.value)}
              onFocus={() => setPickupFocused(true)}
              onBlur={() => setPickupFocused(false)}
            />
            <AnimatePresence>
              {pickupFocused && (
                <motion.div 
                  className={styles.suggestions}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {pickupAutocomplete.suggestions.length > 0 ? (
                    pickupAutocomplete.suggestions.map((s) => (
                      <div 
                        key={s.id} 
                        className={styles.suggestionItem}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setPickupValue(s.label);
                          pickupAutocomplete.setSuggestions([]);
                          setPickupFocused(false);
                        }}
                      >
                        {s.label}
                      </div>
                    ))
                  ) : (
                    ['Paris Centre', 'Aéroport CDG', 'Aéroport Orly', 'Gare de Lyon'].map((s) => (
                      <span 
                        key={s} 
                        className={styles.chip}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setPickupValue(s);
                          setPickupFocused(false);
                        }}
                      >
                        {s}
                      </span>
                    ))
                  )}
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
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
              >
                <label>{t('hero.destination_label', 'Destination')}</label>
                <input
                  type="text"
                  placeholder={t('hero.destination_placeholder', 'Adresse, aéroport, hôtel...')}
                  value={destinationValue}
                  onChange={(e) => setDestinationValue(e.target.value)}
                  onFocus={() => setDestFocused(true)}
                  onBlur={() => setDestFocused(false)}
                />
                <AnimatePresence>
                  {destFocused && (
                    <motion.div 
                      className={styles.suggestions}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {destAutocomplete.suggestions.length > 0 ? (
                        destAutocomplete.suggestions.map((s) => (
                          <div 
                            key={s.id} 
                            className={styles.suggestionItem}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setDestinationValue(s.label);
                              destAutocomplete.setSuggestions([]);
                              setDestFocused(false);
                            }}
                          >
                            {s.label}
                          </div>
                        ))
                      ) : (
                        ['Paris Centre', 'Aéroport CDG', 'Aéroport Orly', 'Gare de Lyon'].map((s) => (
                          <span 
                            key={s} 
                            className={styles.chip}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setDestinationValue(s);
                              setDestFocused(false);
                            }}
                          >
                            {s}
                          </span>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="duration"
                className={styles.field}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
              >
                <label>{t('hero.duration_label', 'Durée')}</label>
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
            <label>{t('hero.date_label', 'Date')}</label>
            <div className={styles.dateTimeDisplay}>
              <span className={dateValue ? styles.valueSet : styles.valuePlaceholder}>
                {dateValue ? formatDate(dateValue) : t('hero.date_placeholder', 'jj/mm/aaaa')}
              </span>
              <input
                ref={dateInputRef}
                type="date"
                className={styles.hiddenNativeInput}
                onChange={(e) => setDateValue(e.target.value)}
                value={dateValue}
              />
            </div>
          </div>

          <div className={styles.fieldDivider}></div>

          <div className={`${styles.field} ${styles.fieldClickable}`} onClick={() => timeInputRef.current?.showPicker?.()}>
            <label>{t('hero.time_label', 'Heure de prise en charge')}</label>
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
            {t('hero.cta_options', 'Voir les options')}
          </button>
        </div>

        {/* ── Demande spécifique ── */}
        <div className={styles.specialBar}>
          <span className={styles.specialText}>
            {t('hero.special_text', 'Vous avez une question ou une demande spécifique ?')}
          </span>
          <button onClick={() => navigate('/demande-specifique')} className={styles.specialCta}>
            {t('hero.special_cta_full', 'Demande sur-mesure')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
