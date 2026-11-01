import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  MessageSquare,
  ArrowRight,
  Compass,
  SlidersHorizontal
} from 'lucide-react';
import { useCity } from '../hooks/useCity';
import { trackPhoneCall, trackWhatsAppClick } from '../lib/googleAds';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  const { t, getCityPath } = useCity();
  const navigate = useNavigate();

  const whatsappMessage = encodeURIComponent(
    `Bonjour SELY Privé,\n\nJe souhaite réserver un chauffeur privé ou obtenir un devis immédiat à Paris.`
  );

  return (
    <div className={styles.page}>
      {/* ── 1. Hero Section (Place Vendôme & Actions Immédiates) ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackdrop}>
          <img
            src="/paris_hero_vendome.jpg"
            alt="SELY Privé Chauffeur de prestige Place Vendôme Paris"
          />
        </div>
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.eyebrowTag}
          >
            <span className={styles.livePulseDot} />
            <span>{t('contact.eyebrow', 'CONCIERGERIE PRIVÉE · PARIS 24H/24 & 7J/7')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={styles.heroTitle}
          >
            {t('contact.hero_title_pre', 'Contact & Réservation')}
            <span className={styles.heroTitleItalic}>
              {t('contact.hero_title_gold', 'L’excellence du chauffeur privé à Paris')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={styles.heroSubtitle}
          >
            {t(
              'contact.hero_subtitle',
              'Pour vos transferts aéroports, vos trajets parisiens ou une mise à disposition sur-mesure, notre conciergerie est à votre écoute continue. Prise en charge immédiate 24h/24 et 7j/7.'
            )}
          </motion.p>

          {/* ── Les Deux Boutons d'Action Principaux (Google Ads) ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className={styles.heroActionsGrid}
          >
            {/* Bouton Appel Direct */}
            <a
              href="tel:+33184805676"
              onClick={trackPhoneCall}
              className={styles.heroCallBtn}
              id="contact-hero-call-btn"
              title="Appeler SELY Privé"
            >
              <div className={styles.ctaIconCircle}>
                <Phone size={19} />
              </div>
              <div className={styles.ctaTextCol}>
                <span className={styles.ctaSubLabel}>{t('contact.call_sub', 'Appel Direct · 24h/24 & 7j/7')}</span>
                <span className={styles.ctaMainLabel}>+33 1 84 80 56 76</span>
              </div>
            </a>

            {/* Bouton WhatsApp Conciergerie */}
            <a
              href={`https://wa.me/33605826497?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackWhatsAppClick}
              className={styles.heroWhatsAppBtn}
              id="contact-hero-whatsapp-btn"
              title="Discuter sur WhatsApp avec la conciergerie"
            >
              <div className={styles.ctaIconCircleWhatsApp}>
                <MessageSquare size={19} />
              </div>
              <div className={styles.ctaTextCol}>
                <span className={styles.ctaSubLabel}>{t('contact.wa_sub', 'WhatsApp Conciergerie · 24/7')}</span>
                <span className={styles.ctaMainLabel}>+33 6 05 82 64 97</span>
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Les Deux Canaux de Réservation (Lignes Épurées) ── */}
      <section className={styles.bookingChannelsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIndex}>{t('contact.sec1_idx', '01 / Vos Déplacements')}</span>
            <h2 className={styles.sectionTitle}>
              {t('contact.sec1_title', 'Deux Façons de Commander Votre Service')}
            </h2>
            <p className={styles.sectionDesc}>
              {t(
                'contact.sec1_desc',
                'Calculez votre tarif fixe en ligne en toute autonomie ou transmettez votre itinéraire pour une étude personnalisée.'
              )}
            </p>
          </div>

          <div className={styles.optionsGrid}>
            {/* Colonne 1: Réserver un Chauffeur */}
            <div className={styles.optionColumn}>
              <span className={styles.optionNum}>01 / Transfert & Trajet Direct</span>
              <h3>{t('contact.c1_title', 'Réserver un Chauffeur')}</h3>
              <p>
                {t(
                  'contact.c1_desc',
                  'Transfert aéroports (Paris-CDG, Orly, Le Bourget), gares parisiennes et déplacements immédiats. Tarif fixe garanti dès la commande, suivi de vol et accueil nominatif avec pancarte inclus.'
                )}
              </p>
              <button
                type="button"
                onClick={() => navigate(getCityPath('/reserver'))}
                className={styles.optionActionLinkPrimary}
                id="contact-btn-reserver-chauffeur"
              >
                <span>{t('contact.c1_cta', 'Réserver un chauffeur en ligne')}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Colonne 2: Demande Spécifique de Devis */}
            <div className={styles.optionColumn}>
              <span className={styles.optionNum}>02 / Mise à Disposition & Événements</span>
              <h3>{t('contact.c2_title', 'Demande Spécifique de Devis')}</h3>
              <p>
                {t(
                  'contact.c2_desc',
                  'Chauffeur dédié pour quelques heures ou plusieurs journées, Fashion Week, délégations diplomatiques, cortèges multi-véhicules ou missions urgentes en moins de 3 heures. Devis précis transmis sous 15 minutes.'
                )}
              </p>
              <button
                type="button"
                onClick={() => navigate(getCityPath('/demande-specifique'))}
                className={styles.optionActionLink}
                id="contact-btn-demande-specifique"
              >
                <span>{t('contact.c2_cta', 'Faire une demande spécifique')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Annuaire & Coordonnées (Lignes Fines & Épurées) ── */}
      <section className={styles.directorySection}>
        <div className={styles.container}>
          <div className={styles.directoryGrid}>
            <div className={styles.directoryItem}>
              <span className={styles.directoryLabel}>{t('contact.ch1_tag', 'TÉLÉPHONE DIRECT')}</span>
              <a href="tel:+33184805676" onClick={trackPhoneCall} className={styles.directoryValue}>
                +33 1 84 80 56 76
              </a>
              <p className={styles.directoryDesc}>
                {t('contact.ch1_desc', 'Permanence 24h/24 et 7j/7 pour passagers et concierges.')}
              </p>
            </div>

            <div className={styles.directoryItem}>
              <span className={styles.directoryLabel}>{t('contact.ch2_tag', 'WHATSAPP CONCIERGERIE')}</span>
              <a
                href={`https://wa.me/33605826497?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackWhatsAppClick}
                className={styles.directoryValue}
              >
                +33 6 05 82 64 97
              </a>
              <p className={styles.directoryDesc}>
                {t('contact.ch2_desc', 'Échange en temps réel, détails de vol et suivi chauffeur.')}
              </p>
            </div>

            <div className={styles.directoryItem}>
              <span className={styles.directoryLabel}>{t('contact.ch3_tag', 'EMAIL OFFICIEL')}</span>
              <a href="mailto:direction@sely.pro" className={styles.directoryValue}>
                direction@sely.pro
              </a>
              <p className={styles.directoryDesc}>
                {t('contact.ch3_desc', 'Comptes corporate, facturation et devis sur-mesure.')}
              </p>
            </div>

            <div className={styles.directoryItem}>
              <span className={styles.directoryLabel}>{t('contact.ch4_tag', 'ZONES COUVERTES')}</span>
              <span className={styles.directoryValue}>Paris & Aéroports</span>
              <p className={styles.directoryDesc}>
                {t('contact.ch4_desc', 'Paris 8e (Triangle d’Or), Roissy-CDG, Orly, Le Bourget.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Barre Mobile d'Action Rapide ── */}
      <div className={styles.mobileStickyBar}>
        <div className={styles.mobileStickyActions}>
          <a
            href="tel:+33184805676"
            onClick={trackPhoneCall}
            className={styles.mobileStickyCallBtn}
            id="mobile-sticky-call-btn"
          >
            <Phone size={14} />
            <span>01 84 80 56 76</span>
          </a>

          <a
            href={`https://wa.me/33605826497?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsAppClick}
            className={styles.mobileStickyWaBtn}
            id="mobile-sticky-wa-btn"
          >
            <MessageSquare size={14} />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => navigate(getCityPath('/reserver'))}
            className={styles.mobileStickyBookBtn}
            id="mobile-sticky-book-btn"
          >
            <Compass size={14} />
            <span>Réserver</span>
          </button>
        </div>
      </div>
    </div>
  );
}
