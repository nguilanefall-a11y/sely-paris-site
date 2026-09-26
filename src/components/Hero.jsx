import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCity } from '../hooks/useCity';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

const HERO_TERRITORIES = [
  { id: 'france', name: 'France', scriptName: 'France', hubs: 'Paris · Côte d\'Azur · Bordeaux · Courchevel', path: '/paris' },
  { id: 'angleterre', name: 'Angleterre', scriptName: 'Angleterre', hubs: 'Londres · Heathrow · Windsor', path: '/london' },
  { id: 'suisse', name: 'Suisse', scriptName: 'Suisse', hubs: 'Genève · Zurich · Gstaad · St-Moritz', path: '/suisse' },
  { id: 'usa', name: 'USA', scriptName: 'États-Unis', hubs: 'New York · Miami · Los Angeles', path: '/usa' },
  { id: 'italie', name: 'Italie', scriptName: 'Italie', hubs: 'Milan · Rome · Côte Amalfitaine', path: '/italie' },
  { id: 'uae', name: 'UAE', scriptName: 'Émirats', hubs: 'Dubaï · Abu Dhabi', path: '/uae' },
];

export default function Hero() {
  const { city, t, getCityPath } = useCity();
  const bgMedia = t('hero.video', '/hero-video-nb.mp4');
  const isVideo = !bgMedia.endsWith('.jpg') && !bgMedia.endsWith('.png') && !bgMedia.endsWith('.webp') && !bgMedia.endsWith('.jpeg');
  const navigate = useNavigate();
  const location = useLocation();

  const getIndexFromCity = (c) => {
    if (c === 'suisse') return 2;
    if (c === 'usa') return 3;
    if (c === 'italie') return 4;
    if (c === 'uae') return 5;
    if (c === 'london') return 1;
    return 0; // paris, bordeaux, french-riviera -> france
  };

  const [activeIndex, setActiveIndex] = useState(() => getIndexFromCity(city));

  useEffect(() => {
    setActiveIndex(getIndexFromCity(city));
  }, [city]);

  // GSAP refs
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const videoRef = useRef(null);
  const heroLineRef = useRef(null);

  const handleCountryClick = (terr) => {
    navigate(`${terr.path}/reserver?territory=${terr.id}&step=0`);
  };

  // GSAP Parallax and Subtle Text Reveal
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
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
            delay: 0.3,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const activeTerritory = HERO_TERRITORIES[activeIndex];

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

      {/* Luminous fine line at bottom of hero */}
      <div ref={heroLineRef} className={styles.heroLine}></div>

      {/* Hero Content Stack: Title + Luxury 3D Country Selector */}
      <div className={styles.heroContentWrapper}>
        <div className={styles.heroCenter}>
          <span className={styles.heroPreTitle}>
            {t('hero.pretitle', (() => {
              const cityLabels = {
                paris: 'PARIS',
                bordeaux: 'BORDEAUX',
                'french-riviera': 'FRENCH RIVIERA',
                london: 'LONDRES',
                suisse: 'SUISSE',
                usa: 'ÉTATS-UNIS',
                italie: 'ITALIE',
                uae: 'ÉMIRATS ARABES UNIS',
              };
              return `MAISON DE CHAUFFEUR PRIVÉ — ${cityLabels[city] || 'PARIS'}`;
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

        {/* ── Luxury White Capsule: 1-Tap Direct Quote by Country ── */}
        <div className={styles.heroCtaContainer}>
          <div className={styles.whiteLuxuryDock} id="hero-country-selector">
            
            {/* Tag / Indicator */}
            <div className={styles.dockHeaderBadge}>
              <div className={styles.dockPulseDotWrapper}>
                <span className={styles.dockDot} />
                <span className={styles.dockDotRing} />
              </div>
              <span className={styles.dockTag}>{t('hero.destinations_tag', 'DEVIS IMMÉDIAT')}</span>
            </div>

            {/* All 6 Countries in Fountain-Pen Calligraphy: 1-Click Instant Quote Funnel */}
            <div className={styles.countriesList} role="tablist" aria-label="Sélectionnez votre destination pour un devis immédiat">
              {HERO_TERRITORIES.map((terr, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={terr.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleCountryClick(terr)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`${styles.countryScriptBtn} ${isActive ? styles.countryScriptBtnActive : ''}`}
                    title={`Demander un devis pour ${terr.name} — Transfert, Mise à disposition ou Sur-mesure`}
                  >
                    <span className={styles.countryScriptName}>{terr.scriptName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Discreet Active Hub Preview & Clear Direct Action Affordance */}
          <div className={styles.activeHubPreview}>
            <span className={styles.activeHubTag}>HUB OPÉRATIONNEL :</span>
            <span className={styles.activeHubText}>{activeTerritory.hubs}</span>
            <span className={styles.activeHubDot}>·</span>
            <span className={styles.activeHubAction}>CLIQUEZ SUR UN PAYS POUR VOTRE DEVIS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
