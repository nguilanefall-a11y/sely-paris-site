import React, { useRef, useEffect } from 'react';
import { useCity } from '../hooks/useCity';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import styles from './ExcellencePage.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function ExcellencePage() {
  const { t, getCityPath } = useCity();
  const sectionRef = useRef(null);
  const philosophyRef = useRef(null);
  const pillarsRef = useRef([]);
  const immersiveRef = useRef(null);
  const onboardRef = useRef([]);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Philosophy fade in
      if (philosophyRef.current) {
        const els = philosophyRef.current.querySelectorAll('p, blockquote');
        gsap.fromTo(els,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: { trigger: philosophyRef.current, start: 'top 75%', once: true }
          }
        );
      }

      // Pillar cards
      pillarsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.7,
            delay: i * 0.12,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
          }
        );
      });

      // Immersive section
      if (immersiveRef.current) {
        gsap.fromTo(immersiveRef.current.querySelectorAll('h2, p'),
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: { trigger: immersiveRef.current, start: 'top 70%', once: true }
          }
        );
      }

      // Onboard cards
      onboardRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 25 },
          {
            opacity: 1, y: 0,
            duration: 0.7,
            delay: i * 0.15,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
          }
        );
      });

      // CTA
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: ctaRef.current, start: 'top 85%', once: true }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.page} ref={sectionRef}>
      <PageHeader
        title={t('page_excellence.title')}
        subtitle={t('page_excellence.subtitle')}
        image="/excellence_hero.png"
      />

      {/* Philosophy */}
      <section className={styles.philosophySection} ref={philosophyRef}>
        <div className={styles.philosophyInner}>
          <p className={styles.overline}>{t('page_excellence.overline', 'NOTRE PHILOSOPHIE')}</p>
          <blockquote className={styles.philosophyQuote}>
            {t('page_excellence.quote')}
          </blockquote>
          <p className={styles.philosophyDesc} dangerouslySetInnerHTML={{ __html: t('page_excellence.intro') }} />
        </div>
      </section>

      {/* Pillars */}
      <section className={styles.pillarsSection}>
        <div className={styles.pillarsGrid}>
          {['c1', 'c2', 'c3', 'c4'].map((key, idx) => (
            <div
              key={key}
              className={styles.pillarCard}
              ref={el => pillarsRef.current[idx] = el}
            >
              <h3 className={styles.pillarTitle}>{t(`page_excellence.${key}_title`)}</h3>
              <p className={styles.pillarDesc}>{t(`page_excellence.${key}_desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Immersive */}
      <section className={styles.immersiveSection}>
        <div className={styles.immersiveImageWrapper}>
          <img src={t('page_excellence.immersive_image', '/sclass_paris.png')} alt="Mercedes S-Class" className={styles.immersiveImage} />
          <div className={styles.immersiveOverlay}></div>
        </div>
        <div className={styles.immersiveContent} ref={immersiveRef}>
          <h2 className={styles.immersiveTitle}>{t('page_excellence.immersive_title')}</h2>
          <p className={styles.immersiveDesc}>{t('page_excellence.immersive_desc')}</p>
        </div>
      </section>

      {/* L'expérience à bord */}
      <section className={styles.onboardSection}>
        <p className={styles.overline}>{t('page_excellence.onboard_overline', 'L\'EXPÉRIENCE À BORD')}</p>
        <h2 className={styles.sectionTitle}>{t('page_excellence.onboard_title')}</h2>
        <div className={styles.onboardGrid}>
          {[
            { img: '/sclass-interior-white.jpg', key: 'onboard_1' },
            { img: '/interior-2.jpg', key: 'onboard_2' },
            { img: '/maybach-interior-first-class.jpg', key: 'onboard_3' }
          ].map((item, idx) => (
            <div
              key={item.key}
              className={styles.onboardCard}
              ref={el => onboardRef.current[idx] = el}
            >
              <div className={styles.onboardImageWrapper}>
                <img src={item.img} alt={t(`page_excellence.${item.key}_title`)} />
              </div>
              <h3 className={styles.onboardCardTitle}>{t(`page_excellence.${item.key}_title`)}</h3>
              <p className={styles.onboardCardDesc}>{t(`page_excellence.${item.key}_desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection} ref={ctaRef}>
        <h2 className={styles.ctaTitle}>{t('page_excellence.why_title')}</h2>
        <p className={styles.ctaDesc}>{t('page_excellence.why_desc')}</p>
        <Link to={getCityPath('/reserver')} className={styles.ctaButton}>
          {t('page_excellence.cta_final', 'Réserver maintenant')}
        </Link>
      </section>
    </div>
  );
}
