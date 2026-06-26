import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';
import styles from './ExcellencePage.module.css';

export default function ExcellencePage() {
  const { t } = useTranslation();

  const commitments = [
    {
      title: t('page_excellence.c1_title'),
      desc: t('page_excellence.c1_desc')
    },
    {
      title: t('page_excellence.c2_title'),
      desc: t('page_excellence.c2_desc')
    },
    {
      title: t('page_excellence.c3_title'),
      desc: t('page_excellence.c3_desc')
    },
    {
      title: t('page_excellence.c4_title'),
      desc: t('page_excellence.c4_desc')
    }
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('page_excellence.title')}
        subtitle={t('page_excellence.subtitle')}
        image="/excellence_hero.png"
      />

      <section className={styles.introSection}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.introText}
          dangerouslySetInnerHTML={{ __html: t('page_excellence.intro') }}
        />
      </section>

      <div className={styles.cardGrid}>
        {commitments.map((item, idx) => (
          <motion.div
            key={idx}
            className={styles.card}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <section className={styles.whySection}>
        <h2 className={styles.whyTitle}>{t('page_excellence.why_title')}</h2>
        <p className={styles.whyDesc}>{t('page_excellence.why_desc')}</p>
      </section>

      <div className={styles.ctaWrapper}>
        <Link to="/contact" className={styles.cta}>
          {t('page_excellence.cta')}
        </Link>
      </div>
    </div>
  );
}
