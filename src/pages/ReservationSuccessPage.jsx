import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Phone, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import styles from './ReservationSuccessPage.module.css';

export default function ReservationSuccessPage() {
  return (
    <div className={styles.page}>
      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.iconWrapper}>
          <CheckCircle size={44} className={styles.checkIcon} />
        </div>

        <span className={styles.badge}>
          <ShieldCheck size={14} />
          Demande de devis transmise
        </span>

        <h1 className={styles.title}>Votre demande de devis est confirmée</h1>
        
        <p className={styles.description}>
          Nous vous remercions de votre confiance. Votre demande de devis a été enregistrée avec succès auprès de la direction SELY Privé.
        </p>

        <div className={styles.infoBox}>
          <div className={styles.infoItem}>
            <ShieldCheck size={18} className={styles.infoIcon} />
            <div>
              <strong>Étude personnalisée sous 15 min</strong>
              <p>Notre direction opérationnelle étudie votre itinéraire et vous transmet votre devis ferme.</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <Mail size={18} className={styles.infoIcon} />
            <div>
              <strong>Devis & Confirmation</strong>
              <p>Un récapitulatif détaillé vous est envoyé par email et SMS.</p>
            </div>
          </div>
        </div>

        <div className={styles.contactRow}>
          <a href="tel:+33184805676" className={styles.contactBtn}>
            <Phone size={15} />
            Assistance Dédiée 24/7
          </a>
          <a 
            href="https://wa.me/33184805676?text=Bonjour%20SELY,%20je%20viens%20d'effectuer%20une%20demande%20de%20devis%20sur%20le%20site." 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.whatsappBtn}
          >
            Assistance WhatsApp
          </a>
        </div>

        <Link to="/" className={styles.homeLink}>
          Retour à l'accueil
          <ArrowRight size={15} />
        </Link>
      </motion.div>
    </div>
  );
}
