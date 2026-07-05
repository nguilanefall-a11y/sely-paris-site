import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Phone, Mail } from 'lucide-react';
import styles from './Booking.module.css';

export default function Booking() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section id="booking" className={styles.bookingSection}>
      <div className={styles.container}>
        <div className={styles.splitLayout}>
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={styles.contactSection}
          >
            <h2 dangerouslySetInnerHTML={{ __html: t('booking.badge_contact').replace('\n', '<br />') }} />
            <div className={styles.divider}></div>
            <p className={styles.contactDesc}>
              {t('booking.contact_desc')}
            </p>
            
            <div className={styles.contactItems}>
              <div className={styles.contactItem}>
                <Mail size={20} className={styles.contactIcon} />
                <div className={styles.contactText}>
                  <strong>EMAIL</strong>
                  <a href="mailto:direction@sely.pro" className={styles.contactLink}>direction@sely.pro</a>
                </div>
              </div>
              
              <div className={styles.contactItem}>
                <Phone size={20} className={styles.contactIcon} />
                <div className={styles.contactText}>
                  <strong>{t('booking.phoneLabel')}</strong>
                  <a href="tel:+33184160842" className={styles.contactLink}>+33 1 84 16 08 42</a>
                </div>
              </div>

              <div className={styles.contactItem}>
                <MapPin size={20} className={styles.contactIcon} />
                <div className={styles.contactText}>
                  <strong>{t('booking.zoneLabel')}</strong>
                  <span>{t('booking.zoneValue')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className={styles.formSection}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`glass-panel ${styles.formBox}`}
            >
              <h3 className={styles.formTitle}>{t('booking.choose_service', 'Sélectionnez un service pour réserver')}</h3>
              
              <div className={styles.buttonsContainer}>
                <button 
                  onClick={() => navigate('/reserver?service=transfer')}
                  className={styles.actionBtn}
                >
                  <div className={styles.btnIconWrapper}>
                    <Navigation size={24} />
                  </div>
                  <div className={styles.btnTextWrapper}>
                    <span className={styles.btnTitle}>{t('hero.tab_transfer', 'Transfert')}</span>
                    <span className={styles.btnDesc}>{t('booking.btn_transfer_desc', 'Aéroports, gares et trajets de ville à ville')}</span>
                  </div>
                  <svg className={styles.btnArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>

                <button 
                  onClick={() => navigate('/reserver?service=hourly')}
                  className={styles.actionBtn}
                >
                  <div className={styles.btnIconWrapper}>
                    <Clock size={24} />
                  </div>
                  <div className={styles.btnTextWrapper}>
                    <span className={styles.btnTitle}>{t('hero.tab_hourly', 'Mise à disposition')}</span>
                    <span className={styles.btnDesc}>{t('booking.btn_hourly_desc', 'Chauffeur privé dédié pour quelques heures ou la journée')}</span>
                  </div>
                  <svg className={styles.btnArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>

              <div className={styles.specialRequestWrapper}>
                <span className={styles.specialText}>
                  {t('hero.special_text', 'Vous avez une question ou une demande spécifique ?')}
                </span>
                <button 
                  onClick={() => navigate('/demande-specifique')} 
                  className={styles.specialLink}
                >
                  {t('hero.special_cta_full', 'Demande sur-mesure')}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
