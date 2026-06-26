import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import styles from './Pricing.module.css';

export default function Pricing() {
  const { t } = useTranslation();

  const pricingPlans = [
    {
      name: t('pricing.plan1_name', 'Transfert Aéroport'),
      price: t('pricing.plan1_price', '60€'),
      prefix: t('pricing.plan1_prefix', 'À partir de'),
      features: [
        t('pricing.plan1_f1', 'Aéroport Mérignac / Gare St Jean'),
        t('pricing.plan1_f2', 'Attente avec pancarte'),
        t('pricing.plan1_f3', 'Suivi du vol en temps réel')
      ]
    },
    {
      name: t('pricing.plan2_name', 'Mise à Disposition'),
      price: t('pricing.plan2_price', '250€'),
      prefix: t('pricing.plan2_prefix', 'À partir de (4h)'),
      features: [
        t('pricing.plan2_f1', 'Chauffeur dédié'),
        t('pricing.plan2_f2', 'Kilométrage inclus (100km)'),
        t('pricing.plan2_f3', 'Flexibilité totale des trajets')
      ],
      highlighted: true
    },
    {
      name: t('pricing.plan3_name', 'Wine Tour'),
      price: t('pricing.plan3_price', 'Sur Devis'),
      prefix: t('pricing.plan3_prefix', 'Forfait Journée'),
      features: [
        t('pricing.plan3_f1', 'Itinéraire sur-mesure'),
        t('pricing.plan3_f2', 'Attente aux châteaux'),
        t('pricing.plan3_f3', 'Service conciergerie inclus')
      ]
    }
  ];

  return (
    <section id="pricing" className={styles.pricingSection}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2>{t('pricing.title', 'Tarification Transparente')}</h2>
          <p>{t('pricing.subtitle', 'Le luxe sans surprise. Des forfaits clairs et adaptés à vos besoins.')}</p>
        </motion.div>

        <div className={styles.grid}>
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={idx}
              className={`${styles.card} ${plan.highlighted ? styles.highlighted : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              {plan.highlighted && <div className={styles.popularBadge}>{t('pricing.popular_badge', 'Le plus demandé')}</div>}
              
              <div className={styles.cardHeader}>
                <h3>{plan.name}</h3>
                <span className={styles.prefix}>{plan.prefix}</span>
                <div className={styles.price}>{plan.price}</div>
              </div>
              
              <ul className={styles.featureList}>
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx}>
                    <Check size={18} className={styles.checkIcon} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a href="/reserver" className={plan.highlighted ? styles.btnPrimary : styles.btnSecondary}>
                {t('pricing.cta', 'Réserver')}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
