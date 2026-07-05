import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import styles from './HowItWorks.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const stepsRef = useRef([]);
  const lineRef = useRef(null);
  const ctaRef = useRef(null);

  const steps = [
    {
      number: '1',
      title: t('howItWorks.step1_title'),
      desc: t('howItWorks.step1_desc')
    },
    {
      number: '2',
      title: t('howItWorks.step2_title'),
      desc: t('howItWorks.step2_desc')
    },
    {
      number: '3',
      title: t('howItWorks.step3_title'),
      desc: t('howItWorks.step3_desc')
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header fade-up
      const headerEls = sectionRef.current?.querySelectorAll(`.${styles.subtitle}, .${styles.title}`);
      if (headerEls?.length) {
        gsap.fromTo(headerEls,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        );
      }

      // Image scale reveal with parallax
      if (imageRef.current) {
        gsap.fromTo(imageRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1, scale: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );

        // Subtle parallax on the image (desktop/tablet only, disabled on mobile to prevent scroll jump bug)
        let mm = gsap.matchMedia();
        mm.add("(min-width: 768px)", () => {
          gsap.to(imageRef.current.querySelector('img'), {
            y: -30,
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          });
        });
      }

      // Steps staggered reveal with bouncy numbers
      stepsRef.current.forEach((step, idx) => {
        if (!step) return;
        const number = step.querySelector(`.${styles.stepNumber}`);
        
        gsap.fromTo(step,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.6,
            delay: idx * 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              once: true,
            },
          }
        );

        if (number) {
          gsap.fromTo(number,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.5,
              delay: idx * 0.2 + 0.2,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: step,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }
      });

      // CTA fade-up
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.subtitle}>{t('howItWorks.subtitle')}</p>
          <h2 className={styles.title}>{t('howItWorks.title')}</h2>
        </div>

        <div className={styles.imageWrapper} ref={imageRef}>
          <img src="/processus_hero.png" alt={t('howItWorks.image_alt')} />
          <div className={styles.imageOverlay}></div>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={styles.step}
              ref={el => stepsRef.current[idx] = el}
            >
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>{step.number}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
              </div>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.ctaWrapper} ref={ctaRef}>
          <Link to="/reserver" className={styles.ctaButton}>
            {t('howItWorks.cta')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
