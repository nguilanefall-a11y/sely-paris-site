import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCity } from '../hooks/useCity';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Compass, ShieldCheck, UserCheck, Car } from 'lucide-react';
import { usePerspectiveTilt } from '../hooks/usePerspectiveTilt';
import styles from './HowItWorks.module.css';

gsap.registerPlugin(ScrollTrigger);

function StepMonolith({ step, index }) {
  const {
    ref: tiltRef,
    style: tiltStyle,
    glareStyle,
    bind: tiltBind
  } = usePerspectiveTilt({
    maxTilt: 5,
    scale: 1.018,
    perspective: 1100,
    speed: 400,
    glare: true
  });

  return (
    <div
      ref={tiltRef}
      style={tiltStyle}
      {...tiltBind}
      className={styles.stepCard}
    >
      <div className={styles.specularGlare} style={glareStyle} />

      <div className={styles.stepCardInner}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIcon}>{step.icon}</div>
        </div>

        <div className={styles.stepBody}>
          <span className={styles.stepCategory}>{step.category}</span>
          <h3 className={styles.stepTitle}>{step.title}</h3>
          <p className={styles.stepDesc}>{step.desc}</p>
        </div>

        <div className={styles.stepFooter}>
          <span className={styles.stepMeta}>{step.meta}</span>
          <div className={styles.stepIndicatorDot} />
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const { t, getCityPath } = useCity();
  const { i18n } = useTranslation();
  const isEn = i18n?.language?.startsWith('en');

  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const pathLineRef = useRef(null);

  const steps = [
    {
      category: isEn ? 'SELECTION' : 'SÉLECTION',
      icon: <Car size={18} strokeWidth={1.5} />,
      title: t('howItWorks.step1_title', 'Configuration & Choix'),
      desc: t(
        'howItWorks.step1_desc',
        'Sélectionnez votre itinéraire, date et véhicule d\'exception parmi notre flotte de berlines de prestige, SUV et vans VIP.'
      ),
      meta: isEn ? 'Instant online quote' : 'Devis instantané en ligne'
    },
    {
      category: isEn ? 'CONFIRMATION' : 'PROTOCOLE',
      icon: <UserCheck size={18} strokeWidth={1.5} />,
      title: t('howItWorks.step2_title', 'Attribution du Chauffeur'),
      desc: t(
        'howItWorks.step2_desc',
        'Confirmation immédiate et transmission des coordonnées directes de votre chauffeur bilingue dédié.'
      ),
      meta: isEn ? '24/7 dedicated dispatch' : 'Suivi télémétrique des vols'
    },
    {
      category: isEn ? 'JOURNEY' : 'EXPÉRIENCE',
      icon: <ShieldCheck size={18} strokeWidth={1.5} />,
      title: t('howItWorks.step3_title', 'Prise en Charge Palace'),
      desc: t(
        'howItWorks.step3_desc',
        'Mise en place 15 minutes en avance, accueil personnalisé en tenue formelle et voyage dans un calme feutré.'
      ),
      meta: isEn ? 'Zero compromise serenity' : 'Discrétion diplomatique'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      const headerEl = sectionRef.current?.querySelector(`.${styles.header}`);
      if (headerEl) {
        gsap.fromTo(
          headerEl,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            }
          }
        );
      }

      // Parallax on wide image banner
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current.querySelector('img'),
          { y: -30, scale: 1.05 },
          {
            y: 30,
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            }
          }
        );
      }

      // Progressive luminous line fill on scroll
      if (pathLineRef.current) {
        gsap.fromTo(
          pathLineRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current?.querySelector(`.${styles.stepsWrapper}`),
              start: 'top 75%',
              end: 'bottom 85%',
              scrub: 0.5,
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* ── Background Watermark ── */}
      <div className={styles.watermarkLayer} aria-hidden="true">
        <span className={styles.watermarkText}>PROTOCOLE</span>
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrow}>
              {isEn ? 'THE SELY PROTOCOL' : 'LE PROTOCOLE SELY'}
            </span>
          </div>

          <h2 className={styles.title}>
            {isEn ? (
              <>Trajectory of <span className={styles.titleItalic}>Excellence.</span></>
            ) : (
              <>L'Itinéraire d'une <span className={styles.titleItalic}>Haute Exigence.</span></>
            )}
          </h2>

          <p className={styles.subtitle}>
            {t(
              'howItWorks.subtitle',
              'Trois étapes rigoureuses pour transformer votre déplacement à Paris en une parenthèse de fluidité et de prestige.'
            )}
          </p>
        </div>

        {/* ── Wide Architectural Hero Banner ── */}
        <div className={styles.imageWrapper} ref={imageRef}>
          <img src="/processus_hero.png" alt="Protocole SELY Chauffeur Privé Paris" loading="lazy" />
          <div className={styles.imageOverlay} />
          <div className={styles.imageBadge}>
            <Compass size={13} strokeWidth={1.5} />
            <span>{isEn ? 'PRECISION TRANSFERS & PALACE LOGISTICS' : 'LOGISTIQUE HAUTE PRÉCISION · PARIS'}</span>
          </div>
        </div>

        {/* ── 3D Steps Trajectory ── */}
        <div className={styles.stepsWrapper}>
          {/* Luminous Progressive Itinerary Line */}
          <div className={styles.trackLineBase}>
            <div className={styles.trackLineFill} ref={pathLineRef} />
          </div>

          <div className={styles.stepsGrid}>
            {steps.map((step, idx) => (
              <StepMonolith key={idx} step={step} index={idx} />
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div className={styles.ctaWrapper}>
          <Link to={getCityPath('/reserver')} className={styles.ctaButton}>
            <span>{t('howItWorks.cta', 'RÉSERVER UN TRAJET')}</span>
            <ArrowRight size={14} strokeWidth={1.8} className={styles.ctaArrow} />
          </Link>
        </div>
      </div>
    </section>
  );
}
