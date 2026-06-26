import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ isHome }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language.startsWith('fr') ? 'en' : 'fr');
  };

  const navClass = `${styles.header} ${scrolled || !isHome || mobileMenuOpen ? styles.solid : styles.transparent}`;

  const links = [
    { to: '/vehicules', label: t('nav.vehicules', 'Flotte') },
    { to: '/excellence', label: t('nav.excellence', 'Services') },
    { to: '/contact', label: t('nav.contact', 'Contact') },
  ];

  return (
    <>
      <header className={navClass}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className={styles.logoContainer}
        >
          <Link to="/" className={styles.logoLink}>
            <span className={styles.logoMark}>S</span>
            <div className={styles.logoText}>
              SELY<br/><span>PARIS</span>
            </div>
          </Link>
        </motion.div>

        <a href="tel:+33184160842" className={styles.phoneBadge}>
          <Phone size={14} />
          <span>+33 1 84 16 08 42</span>
        </a>

        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={styles.nav}
        >
          {links.map((link) => (
            <Link key={link.to} to={link.to} className={location.pathname === link.to ? styles.active : ''}>
              {link.label}
            </Link>
          ))}
          <Link to="/reserver" className={styles.ctaButtonSolid}>{t('nav.book', 'Réserver')}</Link>
          <button onClick={toggleLanguage} className={styles.langToggle}>
            {i18n.language.startsWith('en') ? 'EN' : 'FR'}
          </button>
        </motion.nav>

        <div className={styles.mobileMenuToggle} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.mobileNav}
          >
            {links.map((link) => (
              <Link key={link.to} to={link.to} className={location.pathname === link.to ? styles.active : ''}>
                {link.label}
              </Link>
            ))}
            <Link to="/reserver" className={styles.mobileCta}>{t('nav.book', 'Réserver')}</Link>
            <button onClick={toggleLanguage} className={styles.mobileLangToggle}>
              {i18n.language.startsWith('en') ? 'English' : 'Français'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
