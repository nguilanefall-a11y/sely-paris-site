import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Vehicle.module.css';

const vehicles = [
  {
    key: 'v1',
    mainImage: '/vclass-main.png',
    gallery: [
      { src: '/vclass-int-1.png', alt: 'Mercedes V-Class VIP Seats' },
      { src: '/vclass-int-2.png', alt: 'Mercedes V-Class Interior' },
      { src: '/vclass-int-3.png', alt: 'Mercedes V-Class Dashboard' }
    ]
  },
  {
    key: 'v3',
    mainImage: '/sclass-main.png',
    gallery: [
      { src: '/sclass-int-1.png', alt: 'Mercedes S-Class Rear Cabin' },
      { src: '/sclass-int-2.png', alt: 'Mercedes S-Class Dashboard' },
      { src: '/sclass-int-3.png', alt: 'Mercedes S-Class Console Detail' }
    ]
  },
  {
    key: 'v7',
    mainImage: '/eclass-main.png',
    gallery: [
      { src: '/eclass-int-1.png', alt: 'Mercedes E-Class Dashboard' },
      { src: '/eclass-int-2.png', alt: 'Mercedes E-Class Rear Seats' },
      { src: '/eclass-int-3.png', alt: 'Mercedes E-Class Center Console' }
    ]
  },
  {
    key: 'v8',
    mainImage: '/maybach-main.png',
    gallery: [
      { src: '/maybach-int-1.png', alt: 'Mercedes-Maybach Rear Cabin' },
      { src: '/maybach-int-2.png', alt: 'Mercedes-Maybach Dashboard' },
      { src: '/maybach-int-3.png', alt: 'Mercedes-Maybach Reclined Seat' }
    ]
  },
  {
    key: 'v6',
    mainImage: '/sprinter-19-ext.png',
    isSprinterGroup: true,
    capacities: {
      '7': {
        titleKey: 'v6_7_title',
        subtitleKey: 'v6_7_subtitle',
        mainImage: '/sprinter-7-ext.png',
        gallery: [
          { src: '/sprinter-7-int-1.png', alt: 'Mercedes Sprinter VIP 7 places' },
          { src: '/sprinter-7-int-2.png', alt: 'Mercedes Sprinter VIP Salon' }
        ]
      },
      '12': {
        titleKey: 'v6_12_title',
        subtitleKey: 'v6_12_subtitle',
        mainImage: '/sprinter-12-ext.png',
        gallery: [
          { src: '/sprinter-12-int-1.png', alt: 'Mercedes Sprinter VIP 12 places' },
          { src: '/sprinter-12-int-2.png', alt: 'Mercedes Sprinter VIP Salon Lumineux' },
          { src: '/van_interior_black_seats.png', alt: 'Mercedes Sprinter VIP 12 Cabin' }
        ]
      },
      '19': {
        titleKey: 'v6_19_title',
        subtitleKey: 'v6_19_subtitle',
        mainImage: '/sprinter-19-ext.png',
        gallery: [
          { src: '/sprinter-19-int-1.png', alt: 'Minibus Mercedes Sprinter (16-19 places)' },
          { src: '/van_interior_luxury.png', alt: 'Minibus Mercedes Sprinter Cabine' }
        ]
      }
    }
  },
  {
    key: 'v0',
    mainImage: '/tesla-model-y.png',
    gallery: [
      { src: '/interior-rear-seats.png', alt: 'Sièges Arrière Spacieux' },
      { src: '/interior-1.png', alt: 'Intérieur Avant' },
      { src: '/interior-2.png', alt: 'Toit Panoramique' }
    ]
  },
  {
    key: 'v4',
    mainImage: '/chrysler_300_limo.png',
    gallery: [
      { src: '/chrysler-int-1.png', alt: 'Chrysler 300 Limo Interior' },
      { src: '/chrysler-int-2.png', alt: 'Chrysler 300 Limo Bar Detail' },
      { src: '/chrysler-int-3.png', alt: 'Chrysler 300 Limo Lounge Seating' }
    ]
  }
];

export default function Vehicle() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload all vehicle images to avoid lag during carousel transitions
  useEffect(() => {
    vehicles.forEach(vehicle => {
      if (vehicle.isSprinterGroup) {
        Object.keys(vehicle.capacities).forEach(cap => {
          const mainImg = new Image();
          mainImg.src = vehicle.capacities[cap].mainImage;
          
          vehicle.capacities[cap].gallery.forEach(galleryItem => {
            const gImg = new Image();
            gImg.src = galleryItem.src;
          });
        });
      } else {
        const img = new Image();
        img.src = vehicle.mainImage;
        
        vehicle.gallery.forEach(galleryItem => {
          const gImg = new Image();
          gImg.src = galleryItem.src;
        });
      }
    });
  }, []);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % vehicles.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + vehicles.length) % vehicles.length);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [selectedSprinterCapacity, setSelectedSprinterCapacity] = useState('7');

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const currentVehicle = vehicles[currentIndex];

  const activeTitle = currentVehicle.isSprinterGroup
    ? t(`vehicle.${currentVehicle.capacities[selectedSprinterCapacity].titleKey}`)
    : t(`vehicle.${currentVehicle.key}_title`);

  const activeSubtitle = currentVehicle.isSprinterGroup
    ? t(`vehicle.${currentVehicle.capacities[selectedSprinterCapacity].subtitleKey}`)
    : t(`vehicle.${currentVehicle.key}_subtitle`);

  const activeMainImage = currentVehicle.isSprinterGroup
    ? currentVehicle.capacities[selectedSprinterCapacity].mainImage
    : currentVehicle.mainImage;

  const activeGallery = currentVehicle.isSprinterGroup
    ? currentVehicle.capacities[selectedSprinterCapacity].gallery
    : currentVehicle.gallery;

  return (
    <section className={styles.vehicleSection}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2>{t('vehicle.section_title')}</h2>
        </motion.div>

        <div 
          className={styles.carouselWrapper}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button className={styles.navButton} onClick={handlePrev} aria-label="Previous vehicle">
            <ChevronLeft size={36} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentVehicle.key}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className={styles.carouselContent}
            >
              <div className={styles.vehicleInfo}>
                <div className={styles.titleRow}>
                  <h3 className={styles.vehicleTitle}>{activeTitle}</h3>
                  {currentVehicle.isSprinterGroup && (
                    <div className={styles.capacitySelector}>
                      {Object.keys(currentVehicle.capacities).map((cap) => (
                        <button
                          key={cap}
                          className={`${styles.capTab} ${selectedSprinterCapacity === cap ? styles.capTabActive : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSprinterCapacity(cap);
                          }}
                        >
                          {cap} places
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className={styles.vehicleSubtitle}>{activeSubtitle}</p>
              </div>

              <div className={styles.imageWrapper}>
                <div className={styles.glow}></div>
                <img src={currentVehicle.mainImage} alt={activeTitle} className={styles.mainImage} />
              </div>

              {activeGallery && activeGallery.length > 0 && (
                <div className={styles.gallery}>
                  <div className={styles.galleryScroll} key={selectedSprinterCapacity}>
                    {activeGallery.map((img, idx) => (
                      <img key={idx} src={img.src} alt={img.alt} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <button className={styles.navButton} onClick={handleNext} aria-label="Next vehicle">
            <ChevronRight size={36} />
          </button>
        </div>
      </div>
    </section>
  );
}
