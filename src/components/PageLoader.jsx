import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./PageLoader.module.css";

/**
 * PageLoader – luxury full-screen intro overlay based on Aureus architecture.
 * Features:
 * - Haute couture draped fabric backdrop
 * - Monogram "S" with subtle pulse
 * - Brand wordmark "SELY PARIS"
 * - Refined 1px progress indicator ("un petit truc qui charge")
 * - 0.7s smooth upward curtain slide-out
 */
export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1.2 seconds sleek intro timing with immediate click responsiveness
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.overlay}
          initial={{ y: 0 }}
          exit={{ y: "-100%", pointerEvents: "none" }}
          transition={{
            duration: 0.5,
            ease: [0.76, 0, 0.24, 1], /* cubic-bezier – smooth luxury curtain slide-up */
          }}
          key="page-loader"
        >
          {/* Background image: Haute couture draped white fabric */}
          <div className={styles.bgImage} />
          <div className={styles.backdropVeil} />

          {/* Centered Brand & Loader Content */}
          <div className={styles.contentContainer}>
            {/* Monogram */}
            <span className={styles.logoMark}>S</span>

            {/* Brand Wordmark */}
            <span className={styles.brandName}>SELY PARIS</span>

            {/* Delicate 1px progress track */}
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} />
            </div>

            {/* Subtle Luxury Status Text */}
            <span className={styles.loadingText}>HAUTE COUTURE MOBILITY</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
