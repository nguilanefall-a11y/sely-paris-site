import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './PortalPage.module.css';

export default function PortalPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeBg, setActiveBg] = useState('default');

  const destinations = [
    { key: 'paris', label: t('cities.paris', 'PARIS').toUpperCase(), bg: '/sclass_paris.png' },
    { key: 'bordeaux', label: t('cities.bordeaux', 'BORDEAUX').toUpperCase(), bg: '/chateau_bordeaux.png' },
    { key: 'french-riviera', label: t('cities.french-riviera', 'CÔTE D\'AZUR').toUpperCase(), bg: '/airport_transfer_luxury.png' },
    { key: 'london', label: t('cities.london', 'LONDON').toUpperCase(), bg: '/hero-bg.jpg' }
  ];

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language.startsWith('fr') ? 'en' : 'fr');
  };

  const handleSelect = (city) => {
    navigate(`/${city}`);
  };

  return (
    <div className={styles.portalContainer}>
      {/* Background Media Container */}
      <div className={styles.bgContainer}>
        <AnimatePresence mode="wait">
          {activeBg === 'default' ? (
            <motion.video
              key="default-video"
              src="/portal-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className={styles.bgVideo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          ) : (
            <motion.img
              key={activeBg}
              src={destinations.find(d => d.key === activeBg)?.bg}
              alt={activeBg}
              className={styles.bgImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.35, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
        <div className={styles.overlay}></div>
      </div>

      {/* Header elements (Language Switcher) */}
      <header className={styles.header}>
        <button onClick={toggleLanguage} className={styles.langToggle}>
          {i18n.language.startsWith('en') ? 'EN' : 'FR'}
        </button>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={styles.brandWrapper}
        >
          <h1 className={styles.brandTitle}>S E L Y</h1>
          <p className={styles.brandSubtitle}>PRIVATE CHAUFFEUR SERVICE</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className={styles.destinationsList}
        >
          {destinations.map((dest, idx) => (
            <motion.button
              key={dest.key}
              className={styles.destBtn}
              onClick={() => handleSelect(dest.key)}
              onMouseEnter={() => setActiveBg(dest.key)}
              onMouseLeave={() => setActiveBg('default')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + idx * 0.15, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={styles.destName}>{dest.label}</span>
              <span className={styles.destLine}></span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Footer copyright */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} SELY. All rights reserved.</p>
      </footer>
    </div>
  );
}
