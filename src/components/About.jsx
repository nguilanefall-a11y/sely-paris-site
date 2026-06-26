import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserCheck, Shield, Clock } from 'lucide-react';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const attrsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image clip-path reveal (curtain opening from left)
      if (imageRef.current) {
        gsap.fromTo(imageRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        );
      }

      // Content fade-up with stagger
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('h2, p, .about-desc');
        gsap.fromTo(elements,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              once: true,
            },
          }
        );
      }

      // Attribute badges pop with scale
      if (attrsRef.current.length > 0) {
        gsap.fromTo(attrsRef.current,
          { opacity: 0, y: 20, scale: 0.8 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className={styles.aboutSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.imageContainer} ref={imageRef}>
          <div className={styles.imageWrapper}>
            <img src="/sclass_paris.png" alt="Chauffeur Privé SELY Paris" />
            <div className={styles.overlay}></div>
          </div>
        </div>

        <div className={styles.content} ref={contentRef}>
          <h2 className={styles.title}>{t('about.title')}</h2>
          <p className={styles.subtitle}>{t('about.subtitle')}</p>
          
          <div className={`${styles.description} about-desc`}>
            <p>{t('about.desc_p1')}</p>
            <p>{t('about.desc_p2')}</p>
          </div>

          <div className={styles.attributes}>
            <div className={styles.attribute} ref={el => attrsRef.current[0] = el}>
              <UserCheck className={styles.icon} size={24} />
              <span>{t('about.attr1')}</span>
            </div>
            <div className={styles.attribute} ref={el => attrsRef.current[1] = el}>
              <Clock className={styles.icon} size={24} />
              <span>{t('about.attr2')}</span>
            </div>
            <div className={styles.attribute} ref={el => attrsRef.current[2] = el}>
              <Shield className={styles.icon} size={24} />
              <span>{t('about.attr3')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
