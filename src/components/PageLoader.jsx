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
  const [isLoading, setIsLoading] = useState(() => {
    // Only show once per session and never on admin routes
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p.startsWith('/admin') || p.startsWith('/sely-office')) {
        return false;
      }
      if (sessionStorage.getItem('sely_loader_seen')) {
        return false;
      }
    }
    return true;
  });

  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
      try {
        sessionStorage.setItem('sely_loader_seen', '1');
      } catch (e) {}
    }, 900);
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.overlay}
          onClick={() => {
            setIsLoading(false);
            try { sessionStorage.setItem('sely_loader_seen', '1'); } catch (e) {}
          }}
          initial={{ y: 0 }}
          exit={{ y: "-100%", pointerEvents: "none" }}
          transition={{
            duration: 0.45,
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
