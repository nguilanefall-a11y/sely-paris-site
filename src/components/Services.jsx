import React, { useRef, useEffect } from 'react';
import { useCity } from '../hooks/useCity';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plane, Briefcase, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { usePerspectiveTilt } from '../hooks/usePerspectiveTilt';
import styles from './Services.module.css';

gsap.registerPlugin(ScrollTrigger);

function ServiceMonolith({ service, index }) {
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
    maxTilt: 6,
    scale: 1.02,
    perspective: 1200,
    speed: 400,
    glare: true
  });

  return (
    <div
      ref={tiltRef}
      style={tiltStyle}
      {...tiltBind}
      className={styles.monolithCard}
      onClick={() => navigate(getCityPath(`/reserver?service=${service.serviceKey}`))}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(getCityPath(`/reserver?service=${service.serviceKey}`));
        }
      }}
    >
      {/* Background Image Layer */}
      <div className={styles.imageBackdrop}>
        <img src={service.bgImage} alt={service.title} loading="lazy" />
        <div className={styles.darkGradient} />
      </div>

      {/* Dynamic Specular Sheen */}
      <div className={styles.specularGlare} style={glareStyle} />

      {/* Foreground Monolith Content */}
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={styles.iconCircle}>
            {service.icon}
          </div>
          <span className={styles.ghostIndex}>0{index + 1}</span>
        </div>

        <div className={styles.cardBody}>
          <span className={styles.cardTag}>{service.tag}</span>
          <h3 className={styles.cardTitle}>{service.title}</h3>
          <p className={styles.cardDesc}>{service.desc}</p>
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.ctaText}>
            {isEn ? 'RESERVE THIS SERVICE' : 'RÉSERVER CE SERVICE'}
          </span>
          <div className={styles.ctaArrowWrapper}>
            <ArrowRight size={14} strokeWidth={1.8} className={styles.ctaArrow} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const { t } = useCity();
  const { i18n } = useTranslation();
  const isEn = i18n?.language?.startsWith('en');
  const sectionRef = useRef(null);

  const services = [
    {
      serviceKey: 'transfer',
      icon: <Plane size={20} strokeWidth={1.5} />,
      title: t('services.srv1_title', 'Transferts Aéroport & Gare'),
      desc: t('services.srv1_desc', 'Trajets directs et accueil nominatif avec pancarte aux aéroports CDG, Orly, Le Bourget et gares TGV.'),
      tag: isEn ? 'FLIGHT & RAIL PROTOCOL' : 'PROTOCOLE AÉROPORTUAIRE',
      bgImage: '/airport_transfer_luxury.png'
    },
    {
      serviceKey: 'hourly',
      icon: <Briefcase size={20} strokeWidth={1.5} />,
      title: t('services.srv2_title', 'Voyages d\'Affaires'),
      desc: t('services.srv2_desc', 'Un salon de travail roulant feutré et connecté. Wi-Fi haut débit, chargeurs et discrétion diplomatique garantie.'),
      tag: isEn ? 'CORPORATE EXECUTIVE' : 'EXECUTIVE & DIPLOMATIE',
      bgImage: '/experience_chauffeur_no_watch.png'
    },
    {
      serviceKey: 'hourly',
      icon: <Clock size={20} strokeWidth={1.5} />,
      title: t('services.srv3_title', 'Mise à Disposition'),
      desc: t('services.srv3_desc', 'Un véhicule et un chauffeur dédiés pour quelques heures, la journée ou vos événements parisiens haute couture.'),
      tag: isEn ? 'BESPOKE AVAILABILITY' : 'SUR-MESURE & ÉVÉNEMENTS',
      bgImage: '/louvre-chauffeur-hero.jpg'
    },
    {
      serviceKey: 'transfer',
      icon: <Sparkles size={20} strokeWidth={1.5} />,
      title: t('services.srv4_title', 'Attentions Particulières'),
      desc: t('services.srv4_desc', 'Service de bagagerie palace, bouteilles d\'eau minérale de prestige, confiseries et presse internationale sur demande.'),
      tag: isEn ? 'PALACE EXCELLENCE' : 'STANDARDS DE PALACE',
      bgImage: '/experience_onboard.png'
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
    <section id="services" className={styles.servicesSection} ref={sectionRef}>
      {/* ── Background Editorial Watermark ── */}
      <div className={styles.watermarkLayer} aria-hidden="true">
        <span className={styles.watermarkText}>SERVICES</span>
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrow}>
              {isEn ? 'HAUTE MOBILITY EXPERIENCES' : 'SERVICES DE HAUTE REMISE'}
            </span>
          </div>

          <h2 className={styles.title}>
            {isEn ? (
              <>Uncompromising <span className={styles.titleItalic}>Standards.</span></>
            ) : (
              <>Un Service de <span className={styles.titleItalic}>Grand Standing.</span></>
            )}
          </h2>

          <p className={styles.subtitle}>
            {t(
              'services.subtitle',
              'Un service de chauffeur privé d\'exception conçu sur mesure pour les exigences des maisons de luxe, délégations et voyageurs exigeants.'
            )}
          </p>
        </div>

        {/* ── 3D Floating Glass Monoliths Grid ── */}
        <div className={styles.grid}>
          {services.map((srv, idx) => (
            <ServiceMonolith key={idx} service={srv} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
