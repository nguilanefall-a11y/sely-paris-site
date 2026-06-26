import { motion } from 'framer-motion';
import styles from './SectionDivider.module.css';

const SectionDivider = ({ className }) => {
  return (
    <div className={`${styles.container}${className ? ` ${className}` : ''}`}>
      <motion.div
        className={styles.line}
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </div>
  );
};

export default SectionDivider;
