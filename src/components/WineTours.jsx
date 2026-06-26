import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Briefcase, Map, Navigation } from 'lucide-react';
import styles from './WineTours.module.css';

export default function WineTours() {
  const { t } = useTranslation();
  return (
    <section id="wine-tours" className={styles.wineSection}>
      <div className={styles.bgWrapper}>
        <img src="/paris-bg.png" alt="Vignobles de Paris" className={styles.bgMedia} />
        <div className={styles.bgOverlay}></div>
      </div>

      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <div className={styles.badge}>
            <Briefcase size={16} />
            <span>{t('wine_tours.badge')}</span>
          </div>
          
          <h2 className={styles.title}>{t('wine_tours.title')}</h2>
          <p className={styles.subtitle}>{t('wine_tours.subtitle')}</p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <Map className={styles.icon} size={28} />
              <div>
                <h3>{t('wine_tours.f1_title')}</h3>
                <p>{t('wine_tours.f1_desc')}</p>
              </div>
            </div>
            <div className={styles.feature}>
              <Navigation className={styles.icon} size={28} />
              <div>
                <h3>{t('wine_tours.f2_title')}</h3>
                <p>{t('wine_tours.f2_desc')}</p>
              </div>
            </div>
          </div>

          <a href="/reserver" className={styles.ctaButton}>
            {t('wine_tours.cta')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
