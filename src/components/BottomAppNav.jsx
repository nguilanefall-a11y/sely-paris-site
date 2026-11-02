import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Car, MessageSquare, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCity } from '../hooks/useCity';
import { trackWhatsAppClick, trackPhoneCall } from '../lib/googleAds';
import styles from './BottomAppNav.module.css';

const WhatsAppIcon = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function BottomAppNav({ activeTab = 'home', onTabChange }) {
  const { getCityPath } = useCity();
  const navigate = useNavigate();
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <nav className={styles.mobileBottomNav} aria-label="Navigation Principale">
        <div className={styles.mobileCapsuleBar}>
          {/* Accueil Button */}
          <button
            type="button"
            className={`${styles.mobileCapsuleBtn} ${activeTab === 'home' ? styles.mobileActivePill : ''}`}
            onClick={() => onTabChange && onTabChange('home')}
          >
            <Home size={18} strokeWidth={activeTab === 'home' ? 2.2 : 1.8} />
            <span>Accueil</span>
          </button>

          {/* Voyages Button */}
          <button
            type="button"
            className={`${styles.mobileCapsuleBtn} ${activeTab === 'voyages' ? styles.mobileActivePill : ''}`}
            onClick={() => onTabChange && onTabChange('voyages')}
          >
            <Car size={18} strokeWidth={activeTab === 'voyages' ? 2.2 : 1.8} />
            <span>Voyages</span>
          </button>

          {/* Aide Button */}
          <button
            type="button"
            className={styles.mobileCapsuleBtn}
            onClick={() => setHelpOpen(true)}
          >
            <MessageSquare size={18} strokeWidth={1.8} />
            <span>Aide</span>
          </button>
        </div>

        {/* Bouton WhatsApp direct remplaçant le bouton voiture */}
        <a
          href="https://wa.me/33605827497?text=Bonjour%20SELY%20Priv%C3%A9%2C%20je%20souhaite%20r%C3%A9server%20un%20chauffeur%20ou%20obtenir%20un%20renseignement."
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackWhatsAppClick}
          className={styles.mobileFabWaBtn}
          aria-label="Contacter sur WhatsApp"
          title="WhatsApp SELY Privé · 06 05 82 74 97"
        >
          <WhatsAppIcon size={25} />
        </a>
      </nav>

      {/* Centered Help & Conciergerie Modal */}
      <AnimatePresence>
        {helpOpen && (
          <div className={styles.modalBackdrop} onClick={() => setHelpOpen(false)}>
            <motion.div
              className={styles.helpModal}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Assistance & Conciergerie VIP</h3>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setHelpOpen(false)}
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>

              <p className={styles.modalBodyText}>
                Notre direction des opérations est à votre écoute 24h/24 et 7j/7.
              </p>

              <div className={styles.modalActions}>
                <a
                  href="https://wa.me/33605827497?text=Bonjour%20SELY%20Priv%C3%A9%2C%20je%20souhaite%20un%20renseignement%20sur%20un%20service."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackWhatsAppClick}
                  className={styles.whatsappBtn}
                >
                  <WhatsAppIcon size={18} />
                  <span>Échanger sur WhatsApp</span>
                </a>

                <a
                  href="tel:+33184805676"
                  onClick={trackPhoneCall}
                  className={styles.phoneBtn}
                >
                  <Phone size={16} />
                  <span>+33 1 84 80 56 76</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
