import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import styles from './LanguageSelector.module.css';

export const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', short: 'FR' },
  { code: 'en', label: 'English', flag: '🇬🇧', short: 'EN' },
  { code: 'es', label: 'Español', flag: '🇪🇸', short: 'ES' },
  { code: 'ar', label: 'العربية', flag: '🇦🇪', short: 'AR' },
  { code: 'zh', label: '中文', flag: '🇨🇳', short: '中文' },
];

export default function LanguageSelector({ variant = 'navbar', className = '' }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find(
    (l) => l.code === (i18n.language?.split('-')[0] || 'fr')
  ) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`${styles.selectorWrapper} ${styles[variant] || ''} ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.triggerBtn}
        aria-label="Changer de langue / Change language"
        aria-expanded={isOpen}
      >
        <Globe size={13} className={styles.globeIcon} />
        <span className={styles.flag}>{currentLang.flag}</span>
        <span className={styles.shortCode}>{currentLang.short}</span>
        <ChevronDown size={11} className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu} role="menu">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(lang.code)}
                className={`${styles.menuItem} ${isSelected ? styles.itemActive : ''}`}
              >
                <span className={styles.itemFlag}>{lang.flag}</span>
                <span className={styles.itemLabel}>{lang.label}</span>
                {isSelected && <span className={styles.activeDot} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
