import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Search, X } from 'lucide-react';
import {
  ALL_WORLD_LANGUAGES,
  POPULAR_LANGUAGES,
  getLanguageMetadata,
} from '../lib/languages';
import {
  applyUniversalLanguage,
  getCurrentActiveLanguage,
} from '../lib/universalTranslator';
import styles from './LanguageSelector.module.css';

export default function LanguageSelector({ variant = 'navbar', className = '' }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCode, setActiveCode] = useState(() => getCurrentActiveLanguage());
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Sync active code when i18n changes
  useEffect(() => {
    setActiveCode(getCurrentActiveLanguage());
  }, [i18n.language]);

  const currentLangMeta = useMemo(() => {
    return getLanguageMetadata(activeCode);
  }, [activeCode]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus search input on desktop when opened
      setTimeout(() => {
        if (searchInputRef.current && window.innerWidth > 768) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filtered languages according to user query
  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ALL_WORLD_LANGUAGES;
    return ALL_WORLD_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        (l.englishName && l.englishName.toLowerCase().includes(q)) ||
        l.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectLanguage = async (code) => {
    setActiveCode(code);
    setIsOpen(false);
    setSearchQuery('');
    await applyUniversalLanguage(code, { isManual: true });
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
        <span className={styles.flag}>{currentLangMeta.flag}</span>
        <span className={styles.shortCode}>
          {currentLangMeta.short || currentLangMeta.code.toUpperCase().slice(0, 2)}
        </span>
        <ChevronDown size={11} className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu} role="dialog" aria-label="Sélectionnez une langue">
          <div className={styles.dropdownHeader}>
            <div className={styles.headerTitle}>
              Langues & Régions ({ALL_WORLD_LANGUAGES.length}+)
            </div>
            <div className={styles.searchBox}>
              <Search size={13} color="#888" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une langue / Search..."
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Effacer recherche"
                >
                  <X size={12} color="#888" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Chips (Top VIP Languages) */}
          {!searchQuery && (
            <div className={styles.quickChipsSection}>
              <div className={styles.quickChipsLabel}>Sélection Rapide</div>
              <div className={styles.chipsGrid}>
                {POPULAR_LANGUAGES.map((item) => {
                  const isCur =
                    activeCode === item.code || activeCode.startsWith(item.code);
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleSelectLanguage(item.code)}
                      className={`${styles.chipBtn} ${isCur ? styles.chipActive : ''}`}
                    >
                      <span>{item.flag}</span>
                      <span>{item.short}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full List of Languages */}
          <div className={styles.languagesList} role="menu">
            {filteredLanguages.length === 0 ? (
              <div className={styles.noResults}>
                Aucune langue trouvée pour « {searchQuery} »
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected =
                  activeCode === lang.code ||
                  activeCode === lang.codeAlias ||
                  activeCode.startsWith(lang.code);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`${styles.menuItem} ${isSelected ? styles.itemActive : ''}`}
                  >
                    <span className={styles.itemFlag}>{lang.flag}</span>
                    <div className={styles.itemLabelGroup}>
                      <span className={styles.itemLabel}>{lang.name}</span>
                      {lang.englishName && lang.englishName !== lang.name && (
                        <span className={styles.itemEnglishName}>
                          {lang.englishName}
                        </span>
                      )}
                    </div>
                    {isSelected && <span className={styles.activeDot} />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
