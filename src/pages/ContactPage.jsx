import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  MessageSquare,
  ArrowRight,
  Compass,
  SlidersHorizontal,
  Mail,
  Send,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useCity } from '../hooks/useCity';
import { trackPhoneCall, trackWhatsAppClick, trackQuoteConversion } from '../lib/googleAds';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  const { t, getCityPath, currentCity } = useCity();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: 'Transfert aéroport (CDG / Orly)',
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
        subject: `Demande Contact Rapide [${currentCity || 'Paris'}] - ${formData.name}`,
        from_name: formData.name || 'Client Contact',
        Nom: formData.name,
        Telephone: formData.phone,
        Prestation: formData.serviceType,
        Details: formData.notes || '—',
        Source: 'Page Contact SELY Privé'
      };

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      trackQuoteConversion({ ref: `CONTACT-${Date.now()}` });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const followupWhatsApp = encodeURIComponent(
    `Bonjour SELY Privé,\n\nJe viens de faire une demande sur votre site :\n- Nom : ${formData.name}\n- Prestation : ${formData.serviceType}\n- Tél : ${formData.phone}\n- Détails : ${formData.notes || '—'}`
  );

  return (
    <div className={styles.page}>
      {/* Photo de fond Place Vendôme */}
      <div className={styles.heroBackdrop}>
        <img
          src="/paris_hero_vendome.jpg"
          alt="Chauffeur privé Place Vendôme Paris"
        />
      </div>
      <div className={styles.heroOverlay} />

      <div className={styles.container}>
        <div className={styles.splitLayout}>

          {/* ── Colonne Gauche : Appel & WhatsApp Direct ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.leftCol}
          >
            <h1 className={styles.pageTitle}>Contact & Réservation</h1>
            <p className={styles.pageSubtitle}>
              Chauffeur privé de prestige à Paris · Service disponible 24h/24 et 7j/7
            </p>

            {/* LE NUMÉRO EN GROS */}
            <a
              href="tel:+33184805676"
              onClick={trackPhoneCall}
              className={styles.bigPhoneCard}
              id="contact-big-phone-btn"
              title="Appeler directement le 01 84 80 56 76"
            >
              <div className={styles.phoneIconCircle}>
                <Phone size={24} />
              </div>
              <div className={styles.phoneTextCol}>
                <span className={styles.phoneLabel}>Appel Direct · 24h/24 & 7j/7</span>
                <span className={styles.phoneNumber}>01 84 80 56 76</span>
              </div>
            </a>

            {/* LE WHATSAPP */}
            <a
              href={`https://wa.me/33605826497?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackWhatsAppClick}
              className={styles.whatsAppCard}
              id="contact-whatsapp-btn"
              title="Écrire sur WhatsApp au 06 05 82 64 97"
            >
              <div className={styles.whatsAppIconCircle}>
                <MessageSquare size={22} />
              </div>
              <div className={styles.whatsAppTextCol}>
                <span className={styles.whatsAppLabel}>WhatsApp Conciergerie · Réponse Immédiate</span>
                <span className={styles.whatsAppNumber}>06 05 82 64 97</span>
              </div>
            </a>

            {/* Les Deux Boutons : Réserver en Ligne / Devis Spécifique */}
            <div className={styles.bookingButtonsRow}>
              <button
                type="button"
                onClick={() => navigate(getCityPath('/reserver'))}
                className={styles.bookingBtnPrimary}
                id="contact-btn-reserver"
              >
                <Compass size={15} />
                <span>Réserver un chauffeur</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(getCityPath('/demande-specifique'))}
                className={styles.bookingBtnSecondary}
                id="contact-btn-specifique"
              >
                <SlidersHorizontal size={15} />
                <span>Demande spécifique</span>
              </button>
            </div>

            {/* Footer discret */}
            <div className={styles.contactFooterLine}>
              <span>
                Email :{' '}
                <a href="mailto:direction@sely.pro" className={styles.contactFooterLink}>
                  direction@sely.pro
                </a>
              </span>
              <span>·</span>
              <span>Paris & Aéroports CDG, Orly, Le Bourget</span>
            </div>
          </motion.div>

          {/* ── Colonne Droite : Demande Rapide ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className={styles.rightCol}
          >
            {submitted ? (
              <div className={styles.successCard}>
                <CheckCircle2 size={44} color="#4ade80" />
                <h4>Demande bien reçue</h4>
                <p>
                  Notre équipe prend contact avec vous sous 15 minutes.
                </p>
                <a
                  href={`https://wa.me/33605826497?text=${followupWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.successWaBtn}
                >
                  <MessageSquare size={15} />
                  <span>Confirmer sur WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className={styles.resetBtn}
                >
                  Nouvelle demande
                </button>
              </div>
            ) : (
              <div>
                <h3 className={styles.formTitle}>Demande rapide de devis</h3>
                <p className={styles.formSubtitle}>
                  Renseignez vos coordonnées, nous vous répondons immédiatement.
                </p>

                <form onSubmit={handleSubmit} className={styles.quickForm}>
                  <div className={styles.formRow}>
                    <div className={styles.field}>
                      <label>Votre nom *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="M. / Mme..."
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Téléphone *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="06 00 00 00 00"
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>Prestation souhaitée *</label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="Transfert Roissy-CDG">Transfert Paris ↔ Roissy-CDG</option>
                      <option value="Transfert Orly">Transfert Paris ↔ Orly</option>
                      <option value="Aviation d’affaires Le Bourget">Aviation d’affaires Le Bourget</option>
                      <option value="Transfert Gare TGV">Transfert Gare Parisienne</option>
                      <option value="Mise à disposition à la journée">Mise à disposition (à l'heure / journée)</option>
                      <option value="Urgence moins de 3 heures">Prise en charge urgente (&lt; 3 heures)</option>
                      <option value="Autre demande sur-mesure">Autre demande sur-mesure</option>
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label>Détails du trajet / Date / Vol</label>
                    <textarea
                      rows={2}
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Numéro de vol, date/heure, adresses ou exigences particulières..."
                      className={styles.textarea}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={styles.submitBtn}
                    id="contact-submit-btn"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Envoyer ma demande</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
