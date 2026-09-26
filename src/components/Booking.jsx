import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCity } from '../hooks/useCity';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Compass, SlidersHorizontal, Sparkles, ArrowRight } from 'lucide-react';
import styles from './Booking.module.css';

export default function Booking() {
  const { t, getCityPath } = useCity();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'specifique' ? 'specific' : 'standard';
  const [activeTab, setActiveTab] = useState(initialTab);

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
                  <a href={t('footer.phone_link', 'tel:+33184805676')} className={styles.contactLink}>{t('footer.phone', '+33 1 84 80 56 76')}</a>
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
              {/* Onglets Contact */}
              <div className={styles.tabNav}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === 'standard' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('standard')}
                  id="contact-tab-reservation"
                >
                  <Compass size={15} />
                  <span>Réserver un service</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === 'specific' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('specific')}
                  id="contact-tab-demande-specifique"
                >
                  <SlidersHorizontal size={15} />
                  <span>Demande spécifique</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'standard' ? (
                  <motion.div
                    key="tab-standard"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className={styles.tabBadge}>
                      <span>SERVICE PRIVÉ AVEC CHAUFFEUR</span>
                    </div>
                    <h3 className={styles.formTitle}>
                      {t('booking.book_title', 'Votre déplacement d\'exception commence ici')}
                    </h3>
                    <p className={styles.formSubtitle}>
                      {t('booking.book_subtitle', 'Transfert, mise à disposition avec chauffeur dédié ou accueil personnalisé.')}
                    </p>
                    
                    <div className={styles.buttonsContainer}>
                      <button 
                        onClick={() => navigate(getCityPath('/reserver'))}
                        className={styles.actionBtn}
                        id="booking-section-primary-btn"
                      >
                        <div className={styles.btnIconWrapper}>
                          <Compass size={22} strokeWidth={1.5} />
                        </div>
                        <div className={styles.btnTextWrapper}>
                          <span className={styles.btnTitle}>{t('hero.primary_cta', 'Réservez votre service')}</span>
                          <span className={styles.btnDesc}>{t('hero.primary_cta_sub', 'Transfert · Mise à disposition · Sur-mesure')}</span>
                        </div>
                        <svg className={styles.btnArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </button>
                    </div>

                    <div className={styles.quickLine}>
                      <span>Besoin d'aide immédiate ?</span>
                      <a href={t('footer.phone_link', 'tel:+33184805676')} className={styles.quickLineLink}>
                        <Phone size={13} />
                        <span>{t('footer.phone', '+33 1 84 80 56 76')}</span>
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="tab-specific"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className={styles.tabBadge}>
                      <span>SUR-MESURE & ÉVÉNEMENTS</span>
                    </div>
                    <h3 className={styles.formTitle}>Demande spécifique & sur-mesure</h3>
                    <p className={styles.formSubtitle}>
                      Événements officiels, délégations, transferts urgents (&lt; 3h), convois multi-véhicules ou demandes particulières.
                    </p>
                    
                    <div className={styles.buttonsContainer}>
                      <button 
                        onClick={() => navigate(getCityPath('/demande-specifique'))}
                        className={styles.actionBtn}
                        id="booking-section-specific-btn"
                      >
                        <div className={styles.btnIconWrapper}>
                          <SlidersHorizontal size={22} strokeWidth={1.5} />
                        </div>
                        <div className={styles.btnTextWrapper}>
                          <span className={styles.btnTitle}>Accéder au formulaire Demande Spécifique</span>
                          <span className={styles.btnDesc}>Traitement prioritaire par notre direction sous 1h</span>
                        </div>
                        <svg className={styles.btnArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </button>
                    </div>

                    <div className={styles.quickLine}>
                      <span>Ligne directe prioritaire :</span>
                      <a href={t('footer.phone_link', 'tel:+33184805676')} className={styles.quickLineLink}>
                        <Phone size={13} />
                        <span>{t('footer.phone', '+33 1 84 80 56 76')}</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
