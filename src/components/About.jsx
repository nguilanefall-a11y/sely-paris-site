import React, { useRef, useEffect } from 'react';
import { useCity } from '../hooks/useCity';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { usePerspectiveTilt } from '../hooks/usePerspectiveTilt';
import { ArrowRight, ShieldCheck, Clock, Award, MessageCircle } from 'lucide-react';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function About() {
  const { t, getCityPath } = useCity();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isEn = i18n?.language?.startsWith('en');

  const sectionRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageInnerRef = useRef(null);
  const contentRef = useRef(null);

  // 3D Perspective Tilt for editorial image monolith
  const {
    ref: tiltRef,
    style: tiltStyle,
    glareStyle,
    bind: tiltBind
  } = usePerspectiveTilt({
    maxTilt: 4,
    scale: 1.012,
    perspective: 1300,
    speed: 450,
    glare: true
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic image dollying on scroll
      if (imageInnerRef.current) {
        gsap.fromTo(
          imageInnerRef.current,
          { scale: 1.08, y: -20 },
          {
            scale: 1.0,
            y: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            }
          }
        );
      }

      // Content reveal
      if (contentRef.current) {
        const revealEls = contentRef.current.querySelectorAll('[data-reveal]');
        gsap.fromTo(
          revealEls,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 72%',
              once: true,
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const whatsappUrl = 'https://wa.me/33605827497?text=Bonjour%20SELY,%20je%20souhaite%20r%C3%A9server%20un%20chauffeur%20priv%C3%A9.';

  return (
    <section id="about" className={styles.section} ref={sectionRef}>
      {/* ── Deep Background Plan: Monumental Floating Editorial Watermark ── */}
      <div className={styles.watermarkLayer} aria-hidden="true">
        <span className={styles.watermarkText}>MAISON SELY</span>
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>

          {/* ── Left Column: 3D Image Monolith ── */}
          <div className={styles.imageCol} ref={imageWrapperRef}>
            <div 
              className={styles.imageCard3D}
              ref={tiltRef}
              style={tiltStyle}
              {...tiltBind}
            >
              <div className={styles.specularGlare} style={glareStyle} />
              <div className={styles.imageOverflow}>
                <img
                  ref={imageInnerRef}
                  src="/sclass_paris.png"
                  alt="SELY — Chauffeur Privé Paris Prestige"
                  className={styles.image}
                  loading="lazy"
                />
              </div>

              {/* Floating Badge (Z: +45px) */}
              <div className={styles.floatingTag}>
                <div className={styles.tagDot} />
                <span className={styles.tagText}>
                  {isEn ? 'PROTOCOL & LUXURY MOBILITY' : 'PROTOCOLE DIPLOMATIQUE & PALACE'}
                </span>
              </div>
            </div>
          </div>

          {/* ── Right Column: Editorial & Pillars ── */}
          <div className={styles.contentCol} ref={contentRef}>
            <div className={styles.eyebrowRow} data-reveal>
              <span className={styles.eyebrowLine} />
              <span className={styles.eyebrow}>
                {isEn ? 'YOUR PRIVATE CHAUFFEUR' : 'VOTRE CHAUFFEUR PRIVÉ'}
              </span>
            </div>

            <h2 className={styles.title} data-reveal>
              {isEn ? (
                <>The art of bespoke <span className={styles.titleItalic}>transportation.</span></>
              ) : (
                <>L'art de la grande <span className={styles.titleItalic}>remise à Paris.</span></>
              )}
            </h2>

            <p className={styles.body} data-reveal>
              {isEn 
                ? 'SELY is more than just a ride. It is the assurance of having a true professional dedicated to the success of your journey.'
                : 'SELY n\'est pas qu\'un service de transport. C\'est la garantie d\'avoir à vos côtés un véritable professionnel, dédié à la réussite de votre trajet.'}
            </p>

            <p className={styles.body} data-reveal>
              {isEn 
                ? 'Bilingual, punctual, and absolutely discreet, your chauffeur accompanies you in all your travels with relentless standards.'
                : 'Bilingue, ponctuel et d\'une discrétion absolue, votre chauffeur vous accompagne dans tous vos déplacements avec une exigence de chaque instant.'}
            </p>

            {/* ── Three Pillars — 3D Monolith Cards ── */}
            <div className={styles.pillarsGrid} data-reveal>
              <div className={styles.pillarCard}>
                <div className={styles.pillarHeader}>
                  <span className={styles.pillarNum}>01</span>
                  <Award size={15} strokeWidth={1.5} className={styles.pillarIcon} />
                </div>
                <div className={styles.pillarContent}>
                  <h4 className={styles.pillarTitle}>
                    {isEn ? 'Professional & Bilingual' : 'Savoir-Être & Bilinguisme'}
                  </h4>
                  <p className={styles.pillarDesc}>
                    {isEn 
                      ? 'English-fluent drivers, immaculate formal attire, palace hospitality code.'
                      : 'Chauffeurs anglophones, tenue de rigueur impeccable et codes de palace.'}
                  </p>
                </div>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarHeader}>
                  <span className={styles.pillarNum}>02</span>
                  <Clock size={15} strokeWidth={1.5} className={styles.pillarIcon} />
                </div>
                <div className={styles.pillarContent}>
                  <h4 className={styles.pillarTitle}>
                    {isEn ? 'Strict Punctuality' : 'Ponctualité Stricte'}
                  </h4>
                  <p className={styles.pillarDesc}>
                    {isEn 
                      ? 'Vehicle placed on location 15 minutes ahead of schedule with real-time flight tracking.'
                      : 'Mise en place 15 minutes en avance et suivi télémétrique des vols en direct.'}
                  </p>
                </div>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarHeader}>
                  <span className={styles.pillarNum}>03</span>
                  <ShieldCheck size={15} strokeWidth={1.5} className={styles.pillarIcon} />
                </div>
                <div className={styles.pillarContent}>
                  <h4 className={styles.pillarTitle}>
                    {isEn ? 'Absolute Confidentiality' : 'Discrétion Absolue'}
                  </h4>
                  <p className={styles.pillarDesc}>
                    {isEn 
                      ? 'Diplomatic non-disclosure protocol guaranteeing complete business privacy.'
                      : 'Engagement de secret professionnel absolu pour vos réunions et conversations.'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Action Bar with WhatsApp Direct Button ── */}
            <div className={styles.actionsBar} data-reveal>
              <button
                type="button"
                onClick={() => navigate(getCityPath('/reserver'))}
                className={styles.primaryCta}
              >
                <span>{isEn ? 'BOOK A CHAUFFEUR' : 'RÉSERVER UN CHAUFFEUR'}</span>
                <ArrowRight size={14} strokeWidth={1.8} className={styles.ctaArrow} />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
                title="Échanger directement sur WhatsApp"
              >
                <WhatsAppIcon />
                <span>{isEn ? 'WHATSAPP ASSISTANCE' : 'ASSISTANCE WHATSAPP'}</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
