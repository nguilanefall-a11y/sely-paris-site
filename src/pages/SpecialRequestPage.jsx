import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCity } from '../hooks/useCity';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, MessageSquare, Loader2, Check, Send, Zap } from 'lucide-react';
import { getFormAccessKey } from '../lib/formRouting';
import styles from './SpecialRequestPage.module.css';

export default function SpecialRequestPage() {
  const { t, cityName, currentCity } = useCity();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'rapide' ? 'rapide' : 'sur-mesure';
  const [requestType, setRequestType] = useState(initialType);
  const [status, setStatus] = useState('idle');

  const prefilledPickup = searchParams.get('pickup') || '';
  const prefilledDate = searchParams.get('date') || '';
  const prefilledTime = searchParams.get('time') || '';

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: initialType === 'rapide' && (prefilledPickup || prefilledDate || prefilledTime)
      ? `Prise en charge rapide souhaitée : ${prefilledPickup ? `Départ : ${prefilledPickup}` : ''}${prefilledDate ? ` le ${prefilledDate}` : ''}${prefilledTime ? ` à ${prefilledTime}` : ''}.`
      : '',
  });

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const isUrgent = requestType === 'rapide';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: getFormAccessKey(),
          subject: isUrgent
            ? `⚡ URGENT - Prise en charge rapide [${cityName || 'Paris'}] - SELY`
            : `Demande Spécifique [${cityName || 'Paris'}] - SELY`,
          from_name: `${form.firstName} ${form.lastName}`,
          Ville: cityName || currentCity || 'Paris',
          'Type de demande': isUrgent ? '⚡ Prise en charge rapide (< 3h ou Nuit)' : 'Sur-mesure / Événement',
          'Prénom': form.firstName,
          'Nom': form.lastName,
          'Email': form.email,
          'Téléphone': form.phone,
          'Société': form.company || '—',
          'Message': form.message,
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.page}>
        <motion.div
          className={styles.successCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <motion.div
            className={styles.successIcon}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <Check size={32} />
          </motion.div>
          <h2 className={styles.successTitle}>
            {t('specialRequest.success.title', 'Demande envoyée avec succès !')}
          </h2>
          <p className={styles.successText}>
            {t('specialRequest.success.text', 'Notre équipe vous recontactera dans les plus brefs délais pour répondre à votre demande.')}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.header}>
          <h1 className={styles.title}>
            {t('specialRequest.title', 'Demande spécifique')}
          </h1>
          <p className={styles.subtitle}>
            {t('specialRequest.subtitle', 'Événement, plusieurs journées, itinéraire sur-mesure... Décrivez votre besoin, nous nous occupons du reste.')}
          </p>
        </div>

        <div className={styles.typeSelectorRow}>
          <button
            type="button"
            className={`${styles.typeOption} ${requestType === 'rapide' ? styles.typeOptionActive : ''}`}
            onClick={() => {
              setRequestType('rapide');
              if (!form.message) {
                setForm(prev => ({ ...prev, message: 'Demande de prise en charge rapide / urgente : ' }));
              }
            }}
          >
            {t('specialRequest.type_urgent', '⚡ Prise en charge rapide (< 3h ou Nuit)')}
          </button>
          <button
            type="button"
            className={`${styles.typeOption} ${requestType === 'sur-mesure' ? styles.typeOptionActive : ''}`}
            onClick={() => setRequestType('sur-mesure')}
          >
            {t('specialRequest.type_event', 'Événement / Sur-mesure')}
          </button>
          <button
            type="button"
            className={`${styles.typeOption} ${requestType === 'autre' ? styles.typeOptionActive : ''}`}
            onClick={() => setRequestType('autre')}
          >
            {t('specialRequest.type_other', 'Autre demande spécifique')}
          </button>
        </div>

        {requestType === 'rapide' && (
          <div className={styles.urgentBanner}>
            <div className={styles.urgentBannerHeader}>
              <Zap size={18} />
              <span>{t('specialRequest.urgentBannerTitle', 'Prise en charge rapide & prioritaire')}</span>
            </div>
            <p className={styles.urgentBannerText}>
              {t('specialRequest.urgentBannerText', 'Votre demande sera traitée en priorité absolue par notre régulateur d\'astreinte 24/7. Pour un départ immédiat sous 1 heure, vous pouvez également joindre directement notre standard.')}
            </p>
            <a href="tel:+33184160842" className={styles.urgentCallBtn}>
              <Phone size={14} />
              <span>+33 1 84 16 08 42</span>
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Coordonnées */}
          <div className={styles.sectionLabel}>
            <User size={14} />
            <span>{t('specialRequest.infoLabel', 'Vos coordonnées')}</span>
          </div>

          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>{t('specialRequest.firstName', 'Prénom')} *</label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.inputIcon} />
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={handleChange('firstName')}
                  placeholder={t('specialRequest.firstNamePlaceholder', 'Votre prénom')}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>{t('specialRequest.lastName', 'Nom')} *</label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.inputIcon} />
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={handleChange('lastName')}
                  placeholder={t('specialRequest.lastNamePlaceholder', 'Votre nom')}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>{t('specialRequest.email', 'Email')} *</label>
              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder={t('specialRequest.emailPlaceholder', 'votre@email.com')}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>{t('specialRequest.phone', 'Téléphone')} *</label>
              <div className={styles.inputWrapper}>
                <Phone size={16} className={styles.inputIcon} />
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange('phone')}
                  placeholder={t('specialRequest.phonePlaceholder', '+33 6 12 34 56 78')}
                />
              </div>
            </div>

            <div className={styles.inputGroup + ' ' + styles.fullWidth}>
              <label>{t('specialRequest.company', 'Société')}</label>
              <div className={styles.inputWrapper}>
                <Building2 size={16} className={styles.inputIcon} />
                <input
                  type="text"
                  value={form.company}
                  onChange={handleChange('company')}
                  placeholder={t('specialRequest.companyPlaceholder', 'Nom de votre société (optionnel)')}
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className={styles.sectionLabel}>
            <MessageSquare size={14} />
            <span>{t('specialRequest.messageLabel', 'Votre demande')}</span>
          </div>

          <div className={styles.inputGroup}>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={handleChange('message')}
              placeholder={t('specialRequest.messagePlaceholder', 'Décrivez votre besoin : type d\'événement, nombre de jours, itinéraire souhaité, nombre de passagers, dates...')}
              className={styles.textarea}
            />
          </div>

          <motion.button
            type="submit"
            className={styles.submitBtn}
            disabled={status === 'loading'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                {t('specialRequest.submitting', 'Envoi en cours...')}
              </>
            ) : (
              <>
                <Send size={18} />
                {t('specialRequest.submit', 'Envoyer ma demande')}
              </>
            )}
          </motion.button>

          {status === 'error' && (
            <p className={styles.errorText}>
              {t('specialRequest.error', 'Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.')}
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
