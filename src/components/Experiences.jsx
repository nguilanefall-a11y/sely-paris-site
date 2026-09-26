import React, { useRef, useEffect } from 'react';
import { useCity } from '../hooks/useCity';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Compass } from 'lucide-react';
import { usePerspectiveTilt } from '../hooks/usePerspectiveTilt';
import styles from './Experiences.module.css';

gsap.registerPlugin(ScrollTrigger);

function ExperienceCard3D({ exp, index }) {
  const navigate = useNavigate();
  const { getCityPath } = useCity();
  const { i18n } = useTranslation();
  const isEn = i18n?.language?.startsWith('en');

  const {
    ref: tiltRef,
    style: tiltStyle,
    glareStyle,
    bind: tiltBind
  } = usePerspectiveTilt({
    maxTilt: 5,
    scale: 1.015,
    perspective: 1200,
    speed: 400,
    glare: true
  });

  return (
    <div
      ref={tiltRef}
      style={tiltStyle}
      {...tiltBind}
      className={styles.card}
      onClick={() => navigate(getCityPath('/reserver?service=hourly'))}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(getCityPath('/reserver?service=hourly'));
        }
      }}
    >
      <div className={styles.specularGlare} style={glareStyle} />

      <div className={styles.cardImage}>
        <img src={exp.img} alt={exp.title} loading="lazy" />
        <div className={styles.imageOverlay} />
        <div className={styles.floatingIndex}>0{index + 1}</div>
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{exp.title}</h3>
        <p className={styles.cardDesc}>{exp.desc}</p>

        <div className={styles.linkRow}>
          <span className={styles.linkText}>
            {isEn ? 'BOOK THIS EXPERIENCE' : 'RÉSERVER CETTE EXPÉRIENCE'}
          </span>
          <ArrowRight size={14} strokeWidth={1.8} className={styles.linkArrow} />
        </div>
      </div>
    </div>
  );
}

export default function Experiences() {
  const { t } = useCity();
  const { i18n } = useTranslation();
  const isEn = i18n?.language?.startsWith('en');
  const sectionRef = useRef(null);

  const experiences = [
    {
      img: t('experiences.e1_image', '/versailles_chateau.png'),
      title: t('experiences.e1_title', 'Escapade à Versailles'),
      desc: t('experiences.e1_desc', 'Départ depuis votre palace ou hôtel parisien. Attente de votre chauffeur privé dans les cours d\'honneur pendant votre visite.')
    },
    {
      img: t('experiences.e2_image', '/experience_chauffeur_no_watch.png'),
      title: t('experiences.e2_title', 'Chauffeur Dédié Journée'),
      desc: t('experiences.e2_desc', 'Une liberté totale d\'itinéraire au cœur de la capitale. Votre véhicule reste à votre disposition immédiate à chaque arrêt.')
    },
    {
      img: t('experiences.e3_image', '/luxury_event_gala.png'),
      title: t('experiences.e3_title', 'Événements & Fashion Week'),
      desc: t('experiences.e3_desc', 'Desserte haute couture des défilés, galas et soirées de prestige avec gestion coordonnée des accès VIP.')
    },
    {
      img: t('experiences.e4_image', '/luxury_shopping_paris.png'),
      title: t('experiences.e4_title', 'Shopping Haute Joaillerie'),
      desc: t('experiences.e4_desc', 'Accompagnement sur-mesure place Vendôme et avenue Montaigne avec prise en charge sécurisée de vos achats de luxe.')
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* ── Background Watermark ── */}
      <div className={styles.watermarkLayer} aria-hidden="true">
        <span className={styles.watermarkText}>EXPÉRIENCES</span>
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrow}>
              {isEn ? 'CURATED BESPOKE JOURNEYS' : 'EXPÉRIENCES & SUR-MESURE'}
            </span>
          </div>

          <h2 className={styles.title}>
            {isEn ? (
              <>Art of Living &amp; <span className={styles.titleItalic}>Parisian Prestige.</span></>
            ) : (
              <>Art de Vivre &amp; <span className={styles.titleItalic}>Prestige Parisien.</span></>
            )}
          </h2>

          <p className={styles.subtitle}>
            {t(
              'experiences.subtitle',
              'Des trajets pensés comme des instants privilégiés dans les lieux les plus emblématiques de la capitale.'
            )}
          </p>
        </div>

        <div className={styles.grid}>
          {experiences.map((exp, idx) => (
            <ExperienceCard3D key={idx} exp={exp} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
