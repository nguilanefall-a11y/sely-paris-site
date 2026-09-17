import React from 'react';
import { useCity } from '../hooks/useCity';
import PageHeader from '../components/PageHeader';
import styles from './PrivacyPolicyPage.module.css';

export default function PrivacyPolicyPage() {
  const { t } = useCity();
  
  return (
    <div className={styles.page}>
      <PageHeader 
        title={t('page_privacy.title')} 
        subtitle={t('page_privacy.subtitle')} 
      />
      <div className={styles.content}>
        
        <h2>{t('page_privacy.s1_title')}</h2>
        <p>{t('page_privacy.s1_desc')}</p>

        <h2>{t('page_privacy.s2_title')}</h2>
        <p>{t('page_privacy.s2_desc')}</p>

        <h2>{t('page_privacy.s3_title')}</h2>
        <p>{t('page_privacy.s3_desc')}</p>

        <h2>{t('page_privacy.s4_title')}</h2>
        <p>{t('page_privacy.s4_desc')}</p>

        <h2>{t('page_privacy.s5_title')}</h2>
        <p>{t('page_privacy.s5_desc')}</p>

        <h2>{t('page_privacy.s6_title')}</h2>
        <p>{t('page_privacy.s6_desc')}</p>

        <h2>{t('page_privacy.s7_title')}</h2>
        <p>{t('page_privacy.s7_desc')}</p>

        <h2>{t('page_privacy.s8_title')}</h2>
        <p>{t('page_privacy.s8_desc')}</p>

      </div>
    </div>
  );
}
