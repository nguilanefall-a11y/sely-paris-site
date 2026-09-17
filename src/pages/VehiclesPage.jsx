import React from 'react';
import { motion } from 'framer-motion';
import { useCity } from '../hooks/useCity';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';
import styles from './VehiclesPage.module.css';

export default function VehiclesPage() {
  const { t, getCityPath } = useCity();

  const vehicles = [
    {
      title: t('page_vehicules.v2_title', 'Mercedes Classe V'),
      desc: t('page_vehicules.v2_desc', "L'excellence pour les groupes. Un van de luxe offrant un espace salon pour jusqu'à 7 passagers."),
      image: "/vclass-main.png"
    },
    {
      title: t('page_vehicules.v3_title', 'Mercedes Classe S'),
      desc: t('page_vehicules.v3_desc', 'Le summum du luxe automobile. Confort absolu, raffinement et prestige pour vos déplacements les plus exigeants.'),
      image: "/sclass-main.png"
    },
    {
      title: t('page_vehicules.v7_title', 'Mercedes Classe E'),
      desc: t('page_vehicules.v7_desc', 'L\'alliance parfaite entre élégance et performance. Une berline premium pour un transport en toute discrétion.'),
      image: "/eclass-main.png"
    },
    {
      title: t('page_vehicules.v8_title', 'Mercedes-Maybach'),
      desc: t('page_vehicules.v8_desc', "L'ultime expression du luxe. Un salon privé sur roues pour une expérience de voyage incomparable."),
      image: "/maybach-main.png"
    },
    {
      title: t('page_vehicules.v6_title', 'Mercedes Sprinter VIP (7, 12 ou 19 places)'),
      desc: t('page_vehicules.v6_desc', "Disponible en configurations de 7, 12 ou 19 places. Un salon privé roulant haut de gamme s'adaptant parfaitement aux exigences de votre groupe et circuits de prestige."),
      image: "/sprinter-12-ext.png"
    },
    {
      title: t('page_vehicules.v1_title', 'Tesla Model Y'),
      desc: t('page_vehicules.v1_desc', "Confort, espace et écologie pour tous vos déplacements. Idéal pour 1 à 4 passagers avec bagages."),
      image: "/tesla-model-y.png"
    },
    {
      title: t('page_vehicules.v4_title', 'Limousine Chrysler 300'),
      desc: t('page_vehicules.v4_desc', "Pour vos événements d'exception. Disponible en configuration 8 places ou 12 places pour un luxe absolu et une expérience inoubliable."),
      image: "/chrysler_300_limo.png"
    }
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('page_vehicules.title', 'Notre Flotte de Véhicules')}
        subtitle={t('page_vehicules.subtitle', "L'Excellence à votre service")}
        image="/experience_hero.png"
      />

      <section className={styles.introSection}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.introText}
          dangerouslySetInnerHTML={{ __html: t('page_vehicules.intro', "Découvrez notre flotte d'une trentaine de véhicules haut de gamme, sélectionnés pour vous offrir un confort optimal et une sécurité absolue lors de vos transferts et excursions.") }}
        />
      </section>

      <div className={styles.vehicleGrid}>
        {vehicles.map((vehicule, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={idx % 2 === 0 ? styles.vehicleRow : styles.vehicleRowReversed}
          >
            <div className={styles.vehicleInfo}>
              <h2 className={styles.vehicleTitle}>{vehicule.title}</h2>
              <p className={styles.vehicleDesc}>{vehicule.desc}</p>
            </div>
            <div className={styles.vehicleImageWrapper}>
              <img src={vehicule.image} alt={vehicule.title} className={styles.vehicleImage} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.ctaWrapper}>
        <Link to={getCityPath('/contact')} className={styles.cta}>
          {t('page_vehicules.cta', 'Réserver un véhicule')}
        </Link>
      </div>
    </div>
  );
}
