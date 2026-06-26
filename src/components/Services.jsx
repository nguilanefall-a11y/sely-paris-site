import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, MapPin, Briefcase, Zap } from 'lucide-react';
import styles from './Services.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  const services = [
    {
      icon: <MapPin size={32} />,
      title: t('services.srv1_title'),
      desc: t('services.srv1_desc')
    },
    {
      icon: <Briefcase size={32} />,
      title: t('services.srv2_title'),
      desc: t('services.srv2_desc')
    },
    {
      icon: <Zap size={32} />,
      title: t('services.srv3_title'),
      desc: t('services.srv3_desc')
    },
    {
      icon: <ShieldCheck size={32} />,
      title: t('services.srv4_title'),
      desc: t('services.srv4_desc')
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

      // Cards scale+fade reveal with icon rotation
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const icon = card.querySelector(`.${styles.iconWrapper}`);

        gsap.fromTo(card,
          { opacity: 0, y: 30, scale: 0.85 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7,
            delay: idx * 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true,
            },
          }
        );

        if (icon) {
          gsap.fromTo(icon,
            { rotation: -10, scale: 0.8 },
            {
              rotation: 0, scale: 1,
              duration: 0.6,
              delay: idx * 0.12 + 0.15,
              ease: 'back.out(1.4)',
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
    <section id="services" className={styles.servicesSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('services.title')}</h2>
          <p className={styles.subtitle}>{t('services.subtitle')}</p>
        </div>

        <div className={styles.grid}>
          {services.map((srv, idx) => (
            <div 
              key={idx}
              ref={el => cardRefs.current[idx] = el}
              className={`glass-panel ${styles.card}`}
            >
              <div className={styles.iconWrapper}>{srv.icon}</div>
              <h3>{srv.title}</h3>
              <p>{srv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
