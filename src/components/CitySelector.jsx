import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, MapPin } from 'lucide-react';
import { useCity } from '../hooks/useCity';
import styles from './CitySelector.module.css';

export default function CitySelector() {
  const { city, t } = useCity();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const cities = [
    { key: 'paris', label: t('cities.paris', 'Paris') },
    { key: 'bordeaux', label: t('cities.bordeaux', 'Bordeaux') },
    { key: 'french-riviera', label: t('cities.french-riviera', 'French Riviera') },
    { key: 'london', label: t('cities.london', 'Londres') },
    { key: 'suisse', label: t('cities.suisse', 'Suisse') },
    { key: 'italie', label: t('cities.italie', 'Italie') },
    { key: 'uae', label: t('cities.uae', 'Émirats (UAE)') },
    { key: 'usa', label: t('cities.usa', 'États-Unis (USA)') },
  ];

  const currentLabel = cities.find(c => c.key === city)?.label || t('cities.paris', 'Paris');

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCityChange = (newCity) => {
    setIsOpen(false);
    
    // Switch to the same subpage for the new city
    const pathParts = location.pathname.split('/');
    const subpath = pathParts.slice(2).join('/');
    const targetPath = `/${newCity}${subpath ? `/${subpath}` : ''}${location.search}`;
    navigate(targetPath);
  };

  return (
    <div className={styles.selectorWrapper} ref={dropdownRef}>
      <button 
        className={styles.selectorBtn} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sélectionner la destination"
      >
        <MapPin size={14} className={styles.pinIcon} />
        <span>{currentLabel}</span>
        <ChevronDown size={12} className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {cities.map((c) => (
            <button
              key={c.key}
              onClick={() => handleCityChange(c.key)}
              className={`${styles.dropdownItem} ${c.key === city ? styles.activeItem : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
