import React, { useRef, useEffect } from 'react';
import { useCity } from '../hooks/useCity';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plane, Briefcase, Clock, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { usePerspectiveTilt } from '../hooks/usePerspectiveTilt';
import styles from './Services.module.css';

gsap.registerPlugin(ScrollTrigger);

function ServiceMonolith({ service, index }) {
  const navigate = useNavigate();
  const { t, getCityPath } = useCity();

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
            {t('services.reserve_btn', 'RÉSERVER CE SERVICE')}
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
  const { t, getCityPath } = useCity();
  const sectionRef = useRef(null);

  const services = [
    {
      serviceKey: 'transfer',
      icon: <Plane size={20} strokeWidth={1.5} />,
      title: t('services.srv1_title', 'Transferts Aéroport & Gare'),
      desc: t('services.srv1_desc', 'Trajets directs et accueil nominatif avec pancarte aux aéroports CDG, Orly, Le Bourget et gares TGV.'),
      tag: t('services.tag1', 'PROTOCOLE AÉROPORTUAIRE'),
      bgImage: '/airport_transfer_luxury.png'
    },
    {
      serviceKey: 'hourly',
      icon: <Briefcase size={20} strokeWidth={1.5} />,
      title: t('services.srv2_title', 'Voyages d\'Affaires'),
      desc: t('services.srv2_desc', 'Un salon de travail roulant feutré et connecté. Wi-Fi haut débit, chargeurs et discrétion diplomatique garantie.'),
      tag: t('services.tag2', 'EXECUTIVE & DIPLOMATIE'),
      bgImage: '/experience_chauffeur_no_watch.png'
    },
    {
      serviceKey: 'hourly',
      icon: <Clock size={20} strokeWidth={1.5} />,
      title: t('services.srv3_title', 'Chauffeur à la journée'),
      desc: t('services.srv3_desc', 'Un véhicule et un chauffeur dédiés pour quelques heures, la journée ou vos événements parisiens haute couture.'),
      tag: t('services.tag3', 'SUR-MESURE & ÉVÉNEMENTS'),
      bgImage: '/louvre-chauffeur-hero.jpg'
    },
    {
      serviceKey: 'transfer',
      icon: <Sparkles size={20} strokeWidth={1.5} />,
      title: t('services.srv4_title', 'Attentions Particulières'),
      desc: t('services.srv4_desc', 'Service de bagagerie palace, bouteilles d\'eau minérale de prestige, confiseries et presse internationale sur demande.'),
      tag: t('services.tag4', 'STANDARDS DE PALACE'),
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
              {t('services.eyebrow', 'SERVICES DE HAUTE REMISE')}
            </span>
          </div>

          <h2 className={styles.title}>
            {t('services.headline_pre', 'Un Service de ')}<span className={styles.titleItalic}>{t('services.headline_bold', 'Grand Standing.')}</span>
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

        {/* ── VIP Security & CNAPS Highlight Banner ── */}
        <div className={styles.securityBanner}>
          <div className={styles.securityBannerGleam} />
          <div className={styles.securityBannerLeft}>
            <div className={styles.securityBadge}>
              <Shield size={14} className={styles.shieldIcon} />
              <span>{t('services.security_badge', 'DÉPARTEMENT SÉCURITÉ PRIVÉE • AGRÉMENT CNAPS')}</span>
            </div>
            <h3 className={styles.securityTitle}>
              {t('services.security_title', 'Protection Rapprochée & Chauffeurs de Sécurité')}
            </h3>
            <p className={styles.securityText}>
              {t(
                'services.security_desc',
                'Notre direction générale titulaire de l’agrément dirigeant CNAPS vous accompagne dans la sécurisation intégrale de vos déplacements : agents de protection rapprochée (APR), conduite défensive anti-agression, convois sécurisés et discrétion absolue.'
              )}
            </p>
            <div className={styles.securityLegalNotice}>
              {t('services.security_legal', 'Art. L612-14 CSI : L\'autorisation d\'exercice ne confère aucune prérogative de puissance publique à l\'entreprise ou aux personnes qui en bénéficient.')}
            </div>
          </div>
          <div className={styles.securityBannerRight}>
            <Link to={getCityPath('/securite-privee')} className={styles.securityCta}>
              <span>{t('services.security_cta', 'DÉCOUVRIR LE DÉPARTEMENT SÉCURITÉ')}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
