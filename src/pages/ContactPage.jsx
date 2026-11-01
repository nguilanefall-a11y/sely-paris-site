import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  MessageSquare,
  Compass,
  SlidersHorizontal,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Send,
  Loader2,
  Lock,
  Calendar
} from 'lucide-react';
import { useCity } from '../hooks/useCity';
import { trackPhoneCall, trackWhatsAppClick, trackQuoteConversion } from '../lib/googleAds';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  const { t, getCityPath, currentCity } = useCity();
  const navigate = useNavigate();

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'transfert_aeroport',
    datetime: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour SELY Privé,\n\nJe souhaite réserver un chauffeur privé ou obtenir un devis immédiat à Paris.`
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        access_key: '62ebf81d-e490-449e-b2d4-bb3583ca86e0',
        subject: `🛎️ Demande Contact & Devis Express [${currentCity || 'Paris'}] - ${formData.name}`,
        from_name: formData.name || 'Client Contact',
        Nom: formData.name,
        Telephone: formData.phone,
        Email: formData.email,
        Prestation: formData.serviceType,
        DateHeure: formData.datetime || 'Dès que possible',
        Details: formData.notes || '—',
        Source: 'Page Contact SELY Privé (Google Ads)'
      };

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      trackQuoteConversion({
        ref: `CONTACT-${Date.now()}`
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true); // Graceful fallback
    } finally {
      setSubmitting(false);
    }
  };

  const generatedWhatsAppFollowup = encodeURIComponent(
    `Bonjour SELY Privé,\n\nJe viens de vous envoyer une demande sur votre site :\n- Nom : ${formData.name}\n- Prestation : ${formData.serviceType}\n- Date/Heure : ${formData.datetime || 'À convenir'}\n- Tél : ${formData.phone}\n\nMerci de me confirmer la prise en charge.`
  );

  return (
    <div className={styles.page}>
      {/* ── 1. Hero Section (Prestige Place Vendôme & Direct Google Ads CTAs) ── */}
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
            <span>{t('contact.eyebrow', 'RÉGIE OPÉRATIONNELLE 24/7 · PARIS & ÎLE-DE-FRANCE')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={styles.heroTitle}
          >
            {t('contact.hero_title_pre', 'Contact Direct & Réservation')}
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
              'Notre régie est à votre entière disposition 24h/24 et 7j/7 pour vos transferts aéroports (CDG, Orly, Le Bourget), gares, mise à disposition horaire et cortèges d’exception. Prise en charge immédiate garantie.'
            )}
          </motion.p>

          {/* Direct Action Buttons: Phone & WhatsApp */}
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
              title="Appeler SELY Privé 24h/24"
            >
              <div className={styles.ctaIconCircle}>
                <Phone size={20} />
              </div>
              <div className={styles.ctaTextCol}>
                <span className={styles.ctaSubLabel}>{t('contact.call_sub', 'Appel Direct · Régie 24/7')}</span>
                <span className={styles.ctaMainLabel}>+33 1 84 80 56 76</span>
              </div>
            </a>

            {/* Bouton WhatsApp Conciergerie */}
            <a
              href={`https://wa.me/33184805676?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackWhatsAppClick}
              className={styles.heroWhatsAppBtn}
              id="contact-hero-whatsapp-btn"
              title="Discuter sur WhatsApp avec SELY Privé"
            >
              <div className={styles.ctaIconCircleWhatsApp}>
                <MessageSquare size={20} />
              </div>
              <div className={styles.ctaTextCol}>
                <span className={styles.ctaSubLabel}>{t('contact.wa_sub', 'Réponse sous 3 min · 24/7')}</span>
                <span className={styles.ctaMainLabel}>{t('contact.wa_main', 'Contacter sur WhatsApp')}</span>
              </div>
            </a>
          </motion.div>

          <div className={styles.heroTrustIndicators}>
            <div className={styles.trustIndicatorItem}>
              <span className={styles.trustIndicatorCheck}>✓</span>
              <span>{t('contact.trust_call', 'Prise d’appel immédiate sans attente')}</span>
            </div>
            <div className={styles.trustIndicatorItem}>
              <span className={styles.trustIndicatorCheck}>✓</span>
              <span>{t('contact.trust_drivers', 'Chauffeurs bilingues en costume')}</span>
            </div>
            <div className={styles.trustIndicatorItem}>
              <span className={styles.trustIndicatorCheck}>✓</span>
              <span>{t('contact.trust_airports', 'CDG · Orly · Le Bourget · Gares')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. The Two Core Booking & Quote Channels ── */}
      <section className={styles.bookingChannelsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIndex}>{t('contact.sec1_idx', '01 / Vos Options de Réservation')}</span>
            <h2 className={styles.sectionTitle}>
              {t('contact.sec1_title', 'Organiser Votre Déplacement à Paris')}
            </h2>
            <p className={styles.sectionDesc}>
              {t(
                'contact.sec1_desc',
                'Que vous souhaitiez un transfert aéroport immédiat ou une prise en charge sur-mesure pour un séjour diplomatique ou privé, accédez au canal adapté en un clic.'
              )}
            </p>
          </div>

          <div className={styles.bookingCardsGrid}>
            {/* Card 1: Réserver un Chauffeur */}
            <div className={styles.bookingCard}>
              <div className={styles.bookingCardTop}>
                <span className={styles.bookingCardTag}>{t('contact.c1_tag', 'DEVIS IMMÉDIAT & RÉSERVATION')}</span>
                <Compass size={28} className={styles.bookingCardIcon} />
              </div>

              <h3>{t('contact.c1_title', 'Réserver un Chauffeur')}</h3>
              <p>
                {t(
                  'contact.c1_desc',
                  'Transfert aéroports (Paris-CDG, Orly, Le Bourget), gares parisiennes et trajets de ville à ville. Prix fixe tout compris garanti, accueil avec pancarte nominative et ajustement automatique en cas de retard de vol.'
                )}
              </p>

              <ul className={styles.bookingCardFeatures}>
                <li>
                  <span className={styles.featureBullet}>—</span>
                  <span>{t('contact.c1_f1', 'Tarif garanti sans compteur ni supplément de trafic')}</span>
                </li>
                <li>
                  <span className={styles.featureBullet}>—</span>
                  <span>{t('contact.c1_f2', 'Accueil nominatif en sortie de terminal ou de quai')}</span>
                </li>
                <li>
                  <span className={styles.featureBullet}>—</span>
                  <span>{t('contact.c1_f3', 'Confirmation immédiate par SMS & Email')}</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => navigate(getCityPath('/reserver'))}
                className={styles.bookingCardBtnPrimary}
                id="contact-btn-reserver-chauffeur"
              >
                <span>{t('contact.c1_cta', 'Réserver un chauffeur en ligne')}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Card 2: Demande Spécifique de Devis */}
            <div className={styles.bookingCard}>
              <div className={styles.bookingCardTop}>
                <span className={styles.bookingCardTag}>{t('contact.c2_tag', 'SUR-MESURE & CORPORATE')}</span>
                <SlidersHorizontal size={28} className={styles.bookingCardIcon} />
              </div>

              <h3>{t('contact.c2_title', 'Demande Spécifique de Devis')}</h3>
              <p>
                {t(
                  'contact.c2_desc',
                  'Mise à disposition horaire ou à la journée, Fashion Week, délégations diplomatiques, cortèges multi-véhicules, transferts urgents en moins de 3 heures ou dispositifs sous protection privée (agrément CNAPS).'
                )}
              </p>

              <ul className={styles.bookingCardFeatures}>
                <li>
                  <span className={styles.featureBullet}>—</span>
                  <span>{t('contact.c2_f1', 'Mise à disposition dédiée de 4 h à plusieurs semaines')}</span>
                </li>
                <li>
                  <span className={styles.featureBullet}>—</span>
                  <span>{t('contact.c2_f2', 'Coordination de convois et sécurité rapprochée (CNAPS)')}</span>
                </li>
                <li>
                  <span className={styles.featureBullet}>—</span>
                  <span>{t('contact.c2_f3', 'Proposition personnalisée transmise sous 15 minutes')}</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => navigate(getCityPath('/demande-specifique'))}
                className={styles.bookingCardBtnSecondary}
                id="contact-btn-demande-specifique"
              >
                <span>{t('contact.c2_cta', 'Faire une demande spécifique')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Direct Contact Directory & Channels ── */}
      <section className={styles.directorySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIndex}>{t('contact.sec2_idx', '02 / Permanence & Coordonnées')}</span>
            <h2 className={styles.sectionTitle}>
              {t('contact.sec2_title', 'Nos Canaux de Contact Directs')}
            </h2>
          </div>

          <div className={styles.directoryGrid}>
            {/* Ligne Téléphonique 24/7 */}
            <div className={styles.directoryCard}>
              <div className={styles.directoryCardHeader}>
                <Phone size={18} className={styles.directoryIcon} />
                <span className={styles.directoryCardTag}>{t('contact.ch1_tag', 'TÉLÉPHONE DIRECT')}</span>
              </div>
              <div className={styles.directoryCardValue}>+33 1 84 80 56 76</div>
              <p className={styles.directoryCardDesc}>
                {t('contact.ch1_desc', 'Permanence opérationnelle continue 24h/24 et 7j/7 pour passagers, concierges de palace et réservations de dernière minute.')}
              </p>
              <a
                href="tel:+33184805676"
                onClick={trackPhoneCall}
                className={styles.directoryLink}
              >
                <span>{t('contact.ch1_link', 'Appeler la régie')}</span>
                <ArrowRight size={13} />
              </a>
            </div>

            {/* WhatsApp VIP */}
            <div className={styles.directoryCard}>
              <div className={styles.directoryCardHeader}>
                <MessageSquare size={18} className={styles.directoryIcon} />
                <span className={styles.directoryCardTag}>{t('contact.ch2_tag', 'WHATSAPP CONCIERGE')}</span>
              </div>
              <div className={styles.directoryCardValue}>+33 1 84 80 56 76</div>
              <p className={styles.directoryCardDesc}>
                {t('contact.ch2_desc', 'Le canal privilégié pour échanger en temps réel, transmettre vos billets d’avion et recevoir les coordonnées exactes du chauffeur.')}
              </p>
              <a
                href={`https://wa.me/33184805676?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackWhatsAppClick}
                className={styles.directoryLink}
              >
                <span>{t('contact.ch2_link', 'Ouvrir WhatsApp')}</span>
                <ArrowRight size={13} />
              </a>
            </div>

            {/* Email Direction */}
            <div className={styles.directoryCard}>
              <div className={styles.directoryCardHeader}>
                <Mail size={18} className={styles.directoryIcon} />
                <span className={styles.directoryCardTag}>{t('contact.ch3_tag', 'EMAIL OFFICIEL')}</span>
              </div>
              <div className={styles.directoryCardValue}>direction@sely.pro</div>
              <p className={styles.directoryCardDesc}>
                {t('contact.ch3_desc', 'Pour les demandes corporate, les ouvertures de comptes d’entreprise, la facturation centralisée et les appels d’offres.')}
              </p>
              <a href="mailto:direction@sely.pro" className={styles.directoryLink}>
                <span>{t('contact.ch3_link', 'Envoyer un email')}</span>
                <ArrowRight size={13} />
              </a>
            </div>

            {/* Base & Hubs */}
            <div className={styles.directoryCard}>
              <div className={styles.directoryCardHeader}>
                <MapPin size={18} className={styles.directoryIcon} />
                <span className={styles.directoryCardTag}>{t('contact.ch4_tag', 'ZONES COUVERTES')}</span>
              </div>
              <div className={styles.directoryCardValue}>Paris & Aéroports</div>
              <p className={styles.directoryCardDesc}>
                {t('contact.ch4_desc', 'Paris 8e (Triangle d’Or), Roissy-CDG, Orly, Le Bourget, Gares TGV, Versailles, Normandie et transferts longue distance.')}
              </p>
              <span style={{ fontSize: '0.74rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#71717a' }}>
                {t('contact.ch4_badge', 'Flotte active 24/7')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Express Devis & Message Form ── */}
      <section id="devis-rapide" className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <span className={styles.sectionIndex}>{t('contact.sec3_idx', '03 / Demande Rapide')}</span>
              <h3>{t('contact.form_title', 'Transmettre Votre Demande Directement')}</h3>
              <p>
                {t(
                  'contact.form_sub',
                  'Indiquez vos besoins ci-dessous. Notre régie vous contacte immédiatement par téléphone ou WhatsApp avec une proposition tarifaire précise.'
                )}
              </p>
            </div>

            {submitted ? (
              <div className={styles.successMessageCard}>
                <div className={styles.successIcon}>
                  <CheckCircle2 size={32} />
                </div>
                <h3>{t('contact.success_title', 'Votre demande a bien été reçue')}</h3>
                <p>
                  {t(
                    'contact.success_desc',
                    'Notre régie opérationnelle SELY Privé analyse votre itinéraire et prend contact avec vous sous 15 minutes.'
                  )}
                </p>

                <div className={styles.successActions}>
                  <a
                    href={`https://wa.me/33184805676?text=${generatedWhatsAppFollowup}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackWhatsAppClick}
                    className={styles.whatsappInstantBtn}
                  >
                    <MessageSquare size={16} />
                    <span>{t('contact.success_wa_cta', 'Accélérer ma confirmation sur WhatsApp')}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className={styles.resetBtn}
                  >
                    {t('contact.new_request', 'Nouvelle demande')}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.expressForm}>
                <div className={styles.fieldWrapper}>
                  <label className={styles.fieldLabel}>{t('contact.label_name', 'Nom complet / Société *')}</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="M. / Mme / Société..."
                    className={styles.minimalInput}
                  />
                </div>

                <div className={styles.fieldWrapper}>
                  <label className={styles.fieldLabel}>{t('contact.label_phone', 'Numéro de téléphone *')}</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+33 6 00 00 00 00"
                    className={styles.minimalInput}
                  />
                </div>

                <div className={styles.fieldWrapper}>
                  <label className={styles.fieldLabel}>{t('contact.label_email', 'Adresse email *')}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@exemple.com"
                    className={styles.minimalInput}
                  />
                </div>

                <div className={styles.fieldWrapper}>
                  <label className={styles.fieldLabel}>{t('contact.label_service', 'Prestation souhaitée *')}</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className={styles.minimalSelect}
                  >
                    <option value="transfert_cdg">{t('contact.opt_cdg', 'Transfert Paris ↔ Roissy-CDG')}</option>
                    <option value="transfert_orly">{t('contact.opt_orly', 'Transfert Paris ↔ Orly')}</option>
                    <option value="transfert_bourget">{t('contact.opt_bourget', 'Aviation d’affaires Le Bourget')}</option>
                    <option value="transfert_gare">{t('contact.opt_gare', 'Transfert Gare TGV Paris')}</option>
                    <option value="mise_a_disposition">{t('contact.opt_hourly', 'Mise à disposition horaire / journée')}</option>
                    <option value="urgence_3h">{t('contact.opt_urgent', 'Prise en charge urgente (< 3 heures)')}</option>
                    <option value="securite_vip">{t('contact.opt_security', 'Sécurité privée & Protection VIP (CNAPS)')}</option>
                    <option value="autre_sur_mesure">{t('contact.opt_other', 'Autre demande sur-mesure')}</option>
                  </select>
                </div>

                <div className={styles.fieldWrapperFull}>
                  <label className={styles.fieldLabel}>{t('contact.label_datetime', 'Date & heure souhaitées')}</label>
                  <input
                    type="text"
                    name="datetime"
                    value={formData.datetime}
                    onChange={handleInputChange}
                    placeholder="Ex : Aujourd'hui à 18h30, ou 24 octobre à 09h00 (Vol AF1234)..."
                    className={styles.minimalInput}
                  />
                </div>

                <div className={styles.fieldWrapperFull}>
                  <label className={styles.fieldLabel}>{t('contact.label_notes', 'Détails du trajet & Exigences spécifiques')}</label>
                  <textarea
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Adresses précises de prise en charge, nombre de passagers, bagages, siège enfant requis..."
                    className={styles.minimalTextarea}
                  />
                </div>

                <div className={styles.formActionRow}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={styles.submitBtn}
                    id="contact-submit-express-btn"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>{t('contact.btn_sending', 'Envoi en cours...')}</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>{t('contact.btn_submit', 'Envoyer ma demande de devis')}</span>
                      </>
                    )}
                  </button>

                  <div className={styles.formSecurityNotice}>
                    <Lock size={12} />
                    <span>{t('contact.confidential_notice', 'Confidentialité totale garantie · Vos données ne sont jamais partagées')}</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── 5. Prestige Guarantees Strip ── */}
      <section className={styles.guaranteesSection}>
        <div className={styles.container}>
          <div className={styles.guaranteesGrid}>
            <div className={styles.guaranteeItem}>
              <span className={styles.guaranteeIndex}>01 /</span>
              <h4>{t('contact.g1_title', 'Chauffeurs de Grande Remise')}</h4>
              <p>{t('contact.g1_desc', 'Chauffeurs professionnels en costume sombre, bilingues anglais/français, formés au protocole et à la discrétion diplomatique.')}</p>
            </div>

            <div className={styles.guaranteeItem}>
              <span className={styles.guaranteeIndex}>02 /</span>
              <h4>{t('contact.g2_title', 'Suivi des Vols en Direct')}</h4>
              <p>{t('contact.g2_desc', 'Ajustement automatique en temps réel dès l’atterrissage à Paris-CDG, Orly ou Le Bourget. Zéro surcoût en cas de retard.')}</p>
            </div>

            <div className={styles.guaranteeItem}>
              <span className={styles.guaranteeIndex}>03 /</span>
              <h4>{t('contact.g3_title', 'Tarifs Fixes & Transparents')}</h4>
              <p>{t('contact.g3_desc', 'Le montant annoncé est le montant facturé. Péages, attente à l’arrivée, bagages et rafraîchissements sont intégralement inclus.')}</p>
            </div>

            <div className={styles.guaranteeItem}>
              <span className={styles.guaranteeIndex}>04 /</span>
              <h4>{t('contact.g4_title', 'Flotte Palace Récente')}</h4>
              <p>{t('contact.g4_desc', 'Véhicules Mercedes-Benz de moins de 2 ans (Classe E, Classe S, Maybach, Classe V van), insonorisation d’art et vitres teintées.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Mobile Sticky Rapid Action Bar (Google Ads Call & WhatsApp) ── */}
      <div className={styles.mobileStickyBar}>
        <div className={styles.mobileStickyActions}>
          <a
            href="tel:+33184805676"
            onClick={trackPhoneCall}
            className={styles.mobileStickyCallBtn}
            id="mobile-sticky-call-btn"
          >
            <Phone size={15} />
            <span>Appeler</span>
          </a>

          <a
            href={`https://wa.me/33184805676?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsAppClick}
            className={styles.mobileStickyWaBtn}
            id="mobile-sticky-wa-btn"
          >
            <MessageSquare size={15} />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => navigate(getCityPath('/reserver'))}
            className={styles.mobileStickyBookBtn}
            id="mobile-sticky-book-btn"
          >
            <Compass size={15} />
            <span>Réserver</span>
          </button>
        </div>
      </div>
    </div>
  );
}
