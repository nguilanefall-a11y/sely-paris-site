import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./PageLoader.module.css";

/**
 * PageLoader – luxury full-screen intro overlay.
 * Self-dismisses after ~2.2 s with a smooth upward slide-out.
 */
export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.overlay}
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{
            duration: 0.7,
            ease: [0.76, 0, 0.24, 1], /* cubic-bezier – smooth power ease */
          }}
          key="page-loader"
        >
          {/* Logo mark */}
          <span className={styles.logoMark}>S</span>

          {/* Brand wordmark */}
          <span className={styles.brandName}>SELY PARIS</span>

          {/* Thin progress bar */}
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
