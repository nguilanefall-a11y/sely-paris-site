import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCity } from '../hooks/useCity';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

const HERO_TERRITORIES = [
  { id: 'france', name: 'France', path: '/paris' },
  { id: 'angleterre', name: 'Angleterre', path: '/london' },
  { id: 'suisse', name: 'Suisse', path: '/suisse' },
  { id: 'usa', name: 'USA', path: '/usa' },
  { id: 'italie', name: 'Italie', path: '/italie' },
  { id: 'uae', name: 'UAE', path: '/uae' },
];

const PICKUP_SUGGESTIONS = [
  'Aéroport Charles de Gaulle (CDG)',
  'Aéroport Paris-Orly',
  'Hôtel Ritz Paris — Place Vendôme',
  'Tour Eiffel — Champ de Mars',
  'Gare du Nord',
  'Four Seasons George V — Paris',
];

export default function Hero() {
  const { city, t } = useCity();
  const bgMedia = t('hero.video', '/hero-video-nb.mp4');
  const isVideo = !bgMedia.endsWith('.jpg') && !bgMedia.endsWith('.png') && !bgMedia.endsWith('.webp') && !bgMedia.endsWith('.jpeg');
  const navigate = useNavigate();

  const [pickupValue, setPickupValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const videoRef = useRef(null);
  const heroLineRef = useRef(null);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    const cityPath = city && city !== 'paris' ? city : 'paris';
    const params = new URLSearchParams({ step: '0', service: 'transfer' });
    if (pickupValue.trim()) params.set('pickup', pickupValue.trim());
    navigate(`/${cityPath}/reserver?${params.toString()}`);
  }, [city, navigate, pickupValue]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setPickupValue(suggestion);
    setShowSuggestions(false);
    const cityPath = city && city !== 'paris' ? city : 'paris';
    const params = new URLSearchParams({ step: '0', service: 'transfer', pickup: suggestion });
    navigate(`/${cityPath}/reserver?${params.toString()}`);
  }, [city, navigate]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        if (videoRef.current && sectionRef.current) {
          gsap.to(videoRef.current, {
            y: 60,
            scale: 1.05,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          });
        }
      });
      if (heroLineRef.current) {
        gsap.fromTo(heroLineRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.3 }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const filteredSuggestions = PICKUP_SUGGESTIONS.filter(s =>
    !pickupValue || s.toLowerCase().includes(pickupValue.toLowerCase())
  );

  return (
    <section ref={sectionRef} className={styles.heroSection}>
      {isVideo ? (
        <video
          ref={videoRef}
          src={bgMedia}
          autoPlay loop muted playsInline
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
            objectFit: 'cover', width: '100%', height: '100%',
            objectPosition: t('hero.video_position', 'center'),
            filter: t('hero.video_filter', 'none')
          }}
        />
      )}
      <div className={styles.videoOverlay} />
      <div ref={heroLineRef} className={styles.heroLine} />

      <div className={styles.heroContentWrapper}>
        {/* Headline */}
        <div className={styles.heroCenter}>
          <span className={styles.heroPreTitle}>
            {t('hero.pretitle', (() => {
              const labels = {
                paris: 'PARIS', bordeaux: 'BORDEAUX', 'french-riviera': 'FRENCH RIVIERA',
                london: 'LONDRES', suisse: 'SUISSE', usa: 'ÉTATS-UNIS',
                italie: 'ITALIE', uae: 'ÉMIRATS ARABES UNIS',
              };
              return `MAISON DE CHAUFFEUR PRIVÉ — ${labels[city] || 'PARIS'}`;
            })())}
          </span>
          <h1
            ref={titleRef}
            className={styles.heroTitle}
            dangerouslySetInnerHTML={{ __html: t('hero.headline', "L'art du <em>déplacement</em>.") }}
          />
          <p className={styles.heroSubhead}>
            {t('hero.subheadline', 'Excellence, discrétion absolue et berlines de prestige avec chauffeur dédié.')}
          </p>
        </div>

        {/* ── Booking Widget ── */}
        <div className={styles.heroCtaContainer}>
          <form className={styles.bookingWidget} onSubmit={handleSubmit} autoComplete="off">

            <div className={styles.widgetBadge}>
              <div className={styles.dockPulseDotWrapper}>
                <span className={styles.dockDot} />
                <span className={styles.dockDotRing} />
              </div>
              <span className={styles.dockTag}>DEVIS IMMÉDIAT</span>
            </div>

            <div className={styles.widgetInputRow}>
              <div className={styles.widgetInputWrapper}>
                <MapPin size={18} className={styles.widgetInputIcon} />
                <input
                  ref={inputRef}
                  type="text"
                  value={pickupValue}
                  onChange={(e) => { setPickupValue(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder={t('hero.pickup_placeholder', "D'où partez-vous ? (aéroport, hôtel, adresse...)")}
                  className={styles.widgetInput}
                  aria-label="Adresse de départ"
                />
              </div>
              <button type="submit" className={styles.widgetCta}>
                <span>{t('hero.cta_btn', 'Obtenir un devis')}</span>
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            </div>

            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className={styles.widgetSuggestions}>
                {filteredSuggestions.slice(0, 5).map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    className={styles.widgetSuggestionItem}
                    onMouseDown={() => handleSuggestionClick(s)}
                  >
                    <MapPin size={13} className={styles.sugItemIcon} />
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Countries — discreet trust line */}
          <div className={styles.operatesInRow}>
            <span className={styles.operatesInLabel}>{t('hero.operates_in', 'Nous opérons en :')}</span>
            {HERO_TERRITORIES.map((terr, i) => (
              <span key={terr.id}>
                <button
                  type="button"
                  className={styles.operatesInCountry}
                  onClick={() => navigate(`${terr.path}/reserver?step=0`)}
                >
                  {terr.name}
                </button>
                {i < HERO_TERRITORIES.length - 1 && (
                  <span className={styles.operatesInDot}> · </span>
                )}
              </span>
            ))}
          </div>

          {/* Social Proof — Google VIP Reviews */}
          <div className={styles.heroTrustBadge}>
            <span className={styles.stars}>★★★★★</span>
            <span className={styles.ratingText}>
              <strong>5.0 / 5</strong> · {t('testimonials.google_reviews_count', '409 avis vérifiés sur Google')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
