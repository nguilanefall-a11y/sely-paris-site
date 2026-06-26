import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Experiences.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Experiences() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  const experiences = [
    {
      img: '/versailles_chateau.png',
      title: t('experiences.e1_title'),
      desc: t('experiences.e1_desc')
    },
    {
      img: '/experience_chauffeur_no_watch.png',
      title: t('experiences.e2_title'),
      desc: t('experiences.e2_desc')
    },
    {
      img: '/luxury_event_gala.png',
      title: t('experiences.e3_title'),
      desc: t('experiences.e3_desc')
    },
    {
      img: '/experience_concierge.png',
      title: t('experiences.e4_title'),
      desc: t('experiences.e4_desc')
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header fade-up
      const headerEl = sectionRef.current?.querySelector(`.${styles.header}`);
      if (headerEl) {
        gsap.fromTo(headerEl,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        );
      }

      // Cards with clip-path image reveal
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const img = card.querySelector(`.${styles.cardImage} img`);

        // Card fade-up
        gsap.fromTo(card,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.7,
            delay: idx * 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true,
            },
          }
        );

        // Image clip-path reveal
        if (img) {
          gsap.fromTo(img,
            { clipPath: 'inset(0 100% 0 0)' },
            {
              clipPath: 'inset(0 0% 0 0)',
              duration: 1,
              delay: idx * 0.15 + 0.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{t('experiences.title')}</h2>
        </div>

        <div className={styles.grid}>
          {experiences.map((exp, idx) => (
            <div 
              key={idx}
              className={styles.card}
              ref={el => cardRefs.current[idx] = el}
            >
              <div className={styles.cardImage}>
                <img src={exp.img} alt={exp.title} />
              </div>
              <div className={styles.cardContent}>
                <h3>{exp.title}</h3>
                <p>{exp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
