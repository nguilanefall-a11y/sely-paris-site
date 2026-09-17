import React from 'react';
import { Link } from 'react-router-dom';
import { useCity } from '../hooks/useCity';
import { motion } from 'framer-motion';
import { Briefcase, Map, Navigation } from 'lucide-react';
import styles from './WineTours.module.css';

export default function WineTours() {
  const { t, getCityPath } = useCity();
  return (
    <section id="wine-tours" className={styles.wineSection}>
      <div className={styles.bgWrapper}>
        <img src={t('wine_tours.bg_image', '/paris-bg.png')} alt={t('wine_tours.bg_alt', 'Vignobles de Paris')} className={styles.bgMedia} />
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

          <Link to={getCityPath('/reserver')} className={styles.ctaButton}>
            {t('wine_tours.cta')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
