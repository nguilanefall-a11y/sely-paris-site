import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./PageLoader.module.css";

/**
 * PageLoader – Luxury full-screen intro overlay
 * Features:
 * - High-resolution private jet & VIP tarmac sunset backdrop
 * - Monogram "S" with subtle pulse
 * - Brand wordmark "SELY PARIS"
 * - GPU-accelerated 1px progress line (0 to 100% smoothly)
 * - Ultra-smooth haute-couture curtain lift transition (0.85s)
 * - Zero mobile lag, locked scroll during display
 */
export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(() => {
    // Never show on backoffice / admin routes
    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      if (p.startsWith("/admin") || p.startsWith("/sely-office")) {
        return false;
      }
    }
    return true;
  });

  useEffect(() => {
    if (!isLoading) return;

    // Lock page scrolling during preloader to eliminate mobile bounce/jank
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Guaranteed visible duration: 2.2 seconds
    // Progress bar animates smoothly from 0% to 100% over 1.8s,
    // stays full for 400ms, then initiates the silky curtain lift.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.overlay}
          onClick={() => setIsLoading(false)}
          initial={{ y: 0, opacity: 1 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          key="page-loader"
        >
          {/* Background image: Private jet & luxury limousine on tarmac at sunset */}
          <div className={styles.bgImage} />
          <div className={styles.backdropVeil} />

          {/* Centered Brand & Loader Content */}
          <motion.div
            className={styles.contentContainer}
            exit={{
              opacity: 0,
              y: -24,
              transition: { duration: 0.45, ease: "easeOut" },
            }}
          >
            {/* Monogram */}
            <span className={styles.logoMark}>S</span>

            {/* Brand Wordmark */}
            <span className={styles.brandName}>SELY PARIS</span>

            {/* Delicate 1px progress track */}
            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressFill}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 1.8,
                  ease: [0.22, 1, 0.36, 1], // Smooth progressive deceleration to 100%
                }}
              />
            </div>

            {/* Subtle Luxury Status Text */}
            <span className={styles.loadingText}>HAUTE COUTURE MOBILITY</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
