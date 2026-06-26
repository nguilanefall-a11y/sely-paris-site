import React from 'react';
import { motion } from 'framer-motion';
import styles from './PageHeader.module.css';

export default function PageHeader({ title, subtitle, image }) {
  return (
    <div className={styles.headerContainer}>
      {image && <img src={image} alt="" className={styles.bgImage} />}
      <div className={styles.overlay}></div>
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </motion.div>
    </div>
  );
}
