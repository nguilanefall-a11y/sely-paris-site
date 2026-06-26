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
    key: 'v0',
    mainImage: '/tesla-model-y.png',
    gallery: [
      { src: '/interior-rear-seats.png', alt: 'Sièges Arrière Spacieux' },
      { src: '/interior-1.png', alt: 'Intérieur Avant' },
      { src: '/interior-2.png', alt: 'Toit Panoramique' }
    ]
  },
  {
    key: 'v2',
    mainImage: '/model3-main.png',
    gallery: [
      { src: '/model3-int-1.png', alt: 'Tesla Model 3 Rear Cabin' },
      { src: '/model3-int-2.png', alt: 'Tesla Model 3 Dashboard' },
      { src: '/model3-int-3.png', alt: 'Tesla Model 3 Panoramic Roof' }
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
    key: 'v8',
    mainImage: '/maybach-main.png',
    gallery: [
      { src: '/maybach-int-1.png', alt: 'Mercedes-Maybach Rear Cabin' },
      { src: '/maybach-int-2.png', alt: 'Mercedes-Maybach Dashboard' },
      { src: '/maybach-int-3.png', alt: 'Mercedes-Maybach Reclined Seat' }
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
    key: 'v6',
    mainImage: '/mercedes_sprinter_vip.png',
    gallery: [
      { src: '/sprinter-int-1.png', alt: 'Mercedes Sprinter VIP Seats' },
      { src: '/van_interior_black_seats.png', alt: 'Mercedes Sprinter Interior Cabin' },
      { src: '/van_interior_luxury.png', alt: 'Mercedes Sprinter Luxury Lounge' }
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
      const img = new Image();
      img.src = vehicle.mainImage;
      vehicle.gallery.forEach(galleryItem => {
        const gImg = new Image();
        gImg.src = galleryItem.src;
      });
    });
  }, []);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % vehicles.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + vehicles.length) % vehicles.length);

  const currentVehicle = vehicles[currentIndex];

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

        <div className={styles.carouselWrapper}>
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
                <h3 className={styles.vehicleTitle}>{t(`vehicle.${currentVehicle.key}_title`)}</h3>
                <p className={styles.vehicleSubtitle}>{t(`vehicle.${currentVehicle.key}_subtitle`)}</p>
              </div>

              <div className={styles.imageWrapper}>
                <div className={styles.glow}></div>
                <img src={currentVehicle.mainImage} alt={t(`vehicle.${currentVehicle.key}_title`)} className={styles.mainImage} />
              </div>

              {currentVehicle.gallery.length > 0 && (
                <div className={styles.gallery}>
                  <div className={styles.galleryScroll}>
                    {currentVehicle.gallery.map((img, idx) => (
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
