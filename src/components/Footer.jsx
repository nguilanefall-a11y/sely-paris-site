import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <div className={styles.logoContainer}>
              <span className={styles.logoMark}>S</span>
              <h3 className={styles.brandName}>SELY</h3>
            </div>
            <p className={styles.brandSlogan}>{t('footer.slogan')}</p>
          </div>
          
          <div className={styles.linksCol}>
            <h4>{t('footer.col1')}</h4>
            <ul>
              <li><Link to="/flotte">{t('nav.fleet')}</Link></li>
              <li><Link to="/excellence">{t('nav.excellence')}</Link></li>
              <li><Link to="/contact">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          
          <div className={styles.contactCol}>
            <h4>{t('footer.col2_contact', 'Contact')}</h4>
            <div className={styles.contactItem}>
              <Phone size={16} className={styles.contactIcon} />
              <a href="tel:+33184160842">{t('footer.phone', '+33 1 84 16 08 42')}</a>
            </div>
            <div className={styles.contactItem}>
              <Mail size={16} className={styles.contactIcon} />
              <a href="mailto:contact@sely.com">{t('footer.email', 'contact@sely.com')}</a>
            </div>
            <div className={styles.contactItem}>
              <MapPin size={16} className={styles.contactIcon} />
              <span>{t('footer.location', 'Paris & Île-de-France')}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            &copy; {currentYear} {t('footer.rights')}
            <span className={styles.separator}>|</span>
            <Link to="/politique-de-confidentialite" className={styles.privacyLink}>{t('footer.privacy_policy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
