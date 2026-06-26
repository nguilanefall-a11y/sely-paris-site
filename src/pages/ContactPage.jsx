import React from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/PageHeader';
import Booking from '../components/Booking';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <PageHeader
        title={t('page_contact.title')}
        subtitle={t('page_contact.subtitle')}
        image="/contact_hero.png"
      />
      <div style={{ padding: '4rem 0' }}>
        <Booking />
      </div>
    </div>
  );
}
