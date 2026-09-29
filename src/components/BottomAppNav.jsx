import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Car, MessageSquare, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCity } from '../hooks/useCity';
import styles from './BottomAppNav.module.css';

export default function BottomAppNav({ activeTab = 'home', onTabChange }) {
  const { getCityPath } = useCity();
  const navigate = useNavigate();
  const [helpOpen, setHelpOpen] = useState(false);

  const handleBook = () => {
    navigate(getCityPath('/reserver'));
  };

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

        {/* Round blue FAB button matching media_1790590617904.png */}
        <button
          type="button"
          className={styles.mobileFabBookBtn}
          onClick={handleBook}
          aria-label="Réserver un voyage"
        >
          <Car size={22} strokeWidth={2} />
        </button>
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
                Notre direction des opérations est à votre écoute 24h/24 et 7j/7 pour toute assistance ou demande particulière.
              </p>

              <div className={styles.modalActions}>
                <a
                  href="https://wa.me/33649567812"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                >
                  <MessageSquare size={18} />
                  <span>Échanger sur WhatsApp</span>
                </a>

                <a
                  href="tel:+33184805676"
                  className={styles.phoneBtn}
                >
                  <Phone size={18} />
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
