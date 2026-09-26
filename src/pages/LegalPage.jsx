import React from 'react';
import { useCity } from '../hooks/useCity';
import PageHeader from '../components/PageHeader';
import { Shield, FileText, CheckCircle, Scale, Building2, Phone, Mail } from 'lucide-react';
import styles from './LegalPage.module.css';

export default function LegalPage() {
  const { t, i18n } = useCity();
  const isEn = i18n?.language?.startsWith('en');

  return (
    <div className={styles.legalPage}>
      <PageHeader
        title={isEn ? "Legal Notices & VTC License" : "Mentions Légales & Licence VTC"}
        subtitle={isEn 
          ? "Official institutional information, EVTC transport registry and regulatory compliance."
          : "Informations institutionnelles officielles, inscription au registre EVTC et garanties réglementaires."}
        image="/louvre-chauffeur-hero.jpg"
      />

      <div className={styles.container}>
        <div className={styles.complianceBanner}>
          <div className={styles.complianceIcon}>
            <Shield size={28} />
          </div>
          <div className={styles.complianceText}>
            <h3>{isEn ? "Registered Luxury Passenger Transport Operator (EVTC)" : "Exploitant de Transport de Personnes Agréé (EVTC)"}</h3>
            <p>
              {isEn
                ? "SELY operates strictly within the framework of European and French transportation laws under the supervision of the Ministry of Transport, with full professional liability insurance."
                : "SELY exerce son activité sous le contrôle du Ministère chargé des Transports et de la Préfecture de Police de Paris, en conformité totale avec le Code des transports et les standards de Grande Remise."}
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {/* 1. Éditeur */}
          <section className={styles.legalCard}>
            <div className={styles.cardHeader}>
              <Building2 size={20} className={styles.cardIcon} />
              <h2>{isEn ? "1. Company & Publication" : "1. Éditeur du Site"}</h2>
            </div>
            <div className={styles.cardBody}>
              <p><strong>Dénomination :</strong> SELY PRIVÉ</p>
              <p><strong>Activité :</strong> Service de transport de personnes avec chauffeur (VTC), Grande Remise & Conciergerie de mobilité haut de gamme.</p>
              <p><strong>Siège social :</strong> Paris, France</p>
              <p><strong>Direction de la publication :</strong> Direction Générale SELY</p>
              <p><strong>Email officiel :</strong> <a href="mailto:direction@sely.pro">direction@sely.pro</a></p>
              <p><strong>Permanence opérationnelle :</strong> <a href="tel:+33184805676">+33 1 84 80 56 76</a></p>
            </div>
          </section>

          {/* 2. Registre VTC & Assurances */}
          <section className={styles.legalCard}>
            <div className={styles.cardHeader}>
              <CheckCircle size={20} className={styles.cardIcon} />
              <h2>{isEn ? "2. VTC License & Insurance" : "2. Inscription EVTC & Assurances"}</h2>
            </div>
            <div className={styles.cardBody}>
              <p><strong>Registre National des Exploitants VTC :</strong> Inscrit au registre officiel des Exploitants de Voitures de Transport avec Chauffeur (EVTC) sous l'autorité du Ministère de la Transition Écologique et de la Cohésion des Territoires.</p>
              <p><strong>Chauffeurs professionnels :</strong> Tous les chauffeurs de la Maison SELY sont titulaires d'une carte professionnelle de conducteur de VTC en cours de validité délivrée par la Préfecture de Police, attestant de leur honorabilité et de leur qualification médicale et technique.</p>
              <p><strong>Assurance Responsabilité Civile Professionnelle :</strong> Police d'assurance professionnelle illimitée pour le transport de personnes à titre onéreux souscrite auprès d'une compagnie notoirement solvable, conforme aux articles L. 3120-4 et R. 3120-8 du Code des transports.</p>
            </div>
          </section>

          {/* 3. Hébergement */}
          <section className={styles.legalCard}>
            <div className={styles.cardHeader}>
              <FileText size={20} className={styles.cardIcon} />
              <h2>{isEn ? "3. Hosting Provider" : "3. Hébergement du Service"}</h2>
            </div>
            <div className={styles.cardBody}>
              <p><strong>Hébergeur :</strong> Vercel Inc.</p>
              <p><strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
              <p><strong>Infrastructure :</strong> Serveurs sécurisés haute disponibilité avec chiffrement SSL/TLS 256 bits et protection DDoS avancée.</p>
            </div>
          </section>

          {/* 4. RGPD & Propriété */}
          <section className={styles.legalCard}>
            <div className={styles.cardHeader}>
              <Scale size={20} className={styles.cardIcon} />
              <h2>{isEn ? "4. Intellectual Property & GDPR" : "4. Propriété & Protection des Données"}</h2>
            </div>
            <div className={styles.cardBody}>
              <p><strong>Propriété intellectuelle :</strong> L'ensemble des contenus, marques, logos, visuels, photographies et architectures du site www.selyprive.com sont la propriété exclusive de SELY PRIVÉ. Toute reproduction intégrale ou partielle sans accord préalable est strictement interdite.</p>
              <p><strong>Protection des données personnelles (RGPD) :</strong> Les données recueillies dans le cadre des demandes de devis et réservations font l'objet d'un traitement sécurisé strictement confidentiel. Conformément à la réglementation européenne (RGPD 2016/679), vous disposez d'un droit permanent d'accès, de rectification et d'effacement de vos données personnelles sur simple demande par email à : <a href="mailto:direction@sely.pro">direction@sely.pro</a>.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
