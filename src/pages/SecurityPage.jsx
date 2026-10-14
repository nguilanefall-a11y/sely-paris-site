import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  Lock,
  Award,
  Users,
  Car,
  Phone,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Building2,
  Sparkles,
  Radio,
  Eye,
  Check,
  Send,
  Loader2
} from 'lucide-react';
import { useCity } from '../hooks/useCity';
import styles from './SecurityPage.module.css';

export default function SecurityPage() {
  const { t, getCityPath, currentCity } = useCity();

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'protection_rapprochee',
    duration: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        access_key: '62ebf81d-e490-449e-b2d4-bb3583ca86e0',
        subject: `🛡️ Demande Sécurité Privée & CNAPS [${currentCity || 'Paris'}] - ${formData.name}`,
        from_name: formData.name || 'Demande Sécurité',
        Nom: formData.name,
        Telephone: formData.phone,
        Email: formData.email,
        Prestation: formData.serviceType,
        Duree: formData.duration,
        Details: formData.notes || '—',
        Source: 'Page Sécurité Privée SELY'
      };

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true); // Graceful fallback
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour SELY Privé,\n\nJe souhaite obtenir un renseignement confidentiel concernant un dispositif de sécurité privée / protection VIP.`
  );

  const securityPillars = [
    {
      id: 'chauffeurs_securite',
      icon: <Car size={24} />,
      title: t('security.p1_title', 'Chauffeurs de Sécurité & Conduite Défensive'),
      desc: t('security.p1_desc', 'Pilotes expérimentés formés aux techniques de conduite anti-agression, anti-filature, évitement d’obstacles et maîtrise des situations d’urgence en milieu urbain et autoroutier.'),
      highlights: [
        t('security.p1_h1', 'Formation conduite défensive & évasive certifiée'),
        t('security.p1_h2', 'Maîtrise des véhicules blindés et lourds (Classe S, Maybach, Escalade)'),
        t('security.p1_h3', 'Repérage permanent et détection des menaces périphériques')
      ]
    },
    {
      id: 'apr_bodyguards',
      icon: <Shield size={24} />,
      title: t('security.p2_title', 'Agents de Protection Rapprochée (APR)'),
      desc: t('security.p2_desc', 'Gardes du corps professionnels certifiés CNAPS, discrets et élégants, habitués aux exigences protocolaires des personnalités publiques, diplomates, dirigeants et familles fortunées.'),
      highlights: [
        t('security.p2_h1', 'Carte professionnelle CNAPS & habilitation officielle'),
        t('security.p2_h2', 'Discrétion absolue, posture protocolaire et costume sur-mesure'),
        t('security.p2_h3', 'Agents polyglottes (Français, Anglais, Arabe, Russe)')
      ]
    },
    {
      id: 'convois_corteges',
      icon: <Users size={24} />,
      title: t('security.p3_title', 'Convois Sécurisés & Cortèges d’Escorte'),
      desc: t('security.p3_desc', 'Planification et coordination de cortèges multi-véhicules avec véhicule ouvreur de reconnaissance, berline principale sécurisée et SUV d’escorte rapprochée.'),
      highlights: [
        t('security.p3_h1', 'Liaison radio cryptée permanente entre équipages'),
        t('security.p3_h2', 'Reconnaissance préalable des itinéraires et points de repli'),
        t('security.p3_h3', 'Coordination possible avec les services officiels et ambassades')
      ]
    },
    {
      id: 'accompagnement_familles',
      icon: <Lock size={24} />,
      title: t('security.p4_title', 'Accompagnement VIP, Familles & Séjours'),
      desc: t('security.p4_desc', 'Prise en charge intégrale et sécurisation des déplacements familiaux, de la sortie du jet privé (Le Bourget, Nice, Genève) aux résidences privées, palaces et stations de villégiature.'),
      highlights: [
        t('security.p4_h1', 'Sécurisation des enfants et des proches en toute bienveillance'),
        t('security.p4_h2', 'Accompagnement shopping de luxe, salons privés et galas'),
        t('security.p4_h3', 'Veille sécuritaire discrète 24h/24 lors de vos séjours')
      ]
    },
    {
      id: 'joaillerie_haute_couture',
      icon: <Sparkles size={24} />,
      title: t('security.p5_title', 'Sécurisation Événements, Joaillerie & Mode'),
      desc: t('security.p5_desc', 'Protection et transport sécurisé pour les maisons de haute joaillerie, défilés de Fashion Week, ventes aux enchères et événements privés à haute visibilité.'),
      highlights: [
        t('security.p5_h1', 'Transferts sécurisés de pièces de joaillerie et d’art'),
        t('security.p5_h2', 'Contrôle des accès VIP et filtrage discret des invités'),
        t('security.p5_h3', 'Cellule dédiée Fashion Week et festivals internationaux')
      ]
    },
    {
      id: 'audit_itineraires',
      icon: <Eye size={24} />,
      title: t('security.p6_title', 'Audit de Vulnérabilité & Gestion de Crise'),
      desc: t('security.p6_desc', 'Étude méthodique en amont des axes routiers, repérage des établissements hospitaliers, identification des zones à risque et plans de continuité sécuritaire.'),
      highlights: [
        t('security.p6_h1', 'Cartographie préalable des points d’évacuation médicale'),
        t('security.p6_h2', 'Permanence opérationnelle de crise et supervision en temps réel'),
        t('security.p6_h3', 'Adaptabilité dynamique en fonction des conditions de circulation')
      ]
    }
  ];

  const secureFleet = [
    {
      name: 'Mercedes-Maybach & Classe S',
      category: t('security.fleet_cat1', 'Berlines Exécutives Sécurisées'),
      desc: t('security.fleet_desc1', 'Vitrage feuilleté surteinté anti-effraction, insonorisation d’art, salon grand confort et discrétion souveraine.'),
      image: '/maybach-paris-luxury.jpg',
      specs: [t('security.spec_tinted', 'Vitres teintées'), t('security.spec_wifi', 'Wi-Fi chiffré'), t('security.spec_quiet', 'Silence feutré')]
    },
    {
      name: 'Cadillac Escalade ESV & Range Rover',
      category: t('security.fleet_cat2', 'SUV d’Escorte & Protection'),
      desc: t('security.fleet_desc2', 'Présence statutaire imposante, motricité intégrale tout-terrain, volume protecteur et assise dominante pour vos équipes de sécurité.'),
      image: '/cadillac-escalade-main.jpg',
      specs: [t('security.spec_allroad', 'Transmission intégrale'), t('security.spec_stature', 'Gabarit statutaire'), t('security.spec_power', 'Puissance d’intervention')]
    },
    {
      name: 'Mercedes Sprinter Lounge VIP',
      category: t('security.fleet_cat3', 'Transport Sécurisé de Délégation'),
      desc: t('security.fleet_desc3', 'Salon de commandement roulant permettant de déplacer jusqu’à 7 à 19 passagers sous haute protection, avec cloisons occultantes et espace de travail confidentiel.'),
      image: '/minibus-7-vip-interior.jpg',
      specs: [t('security.spec_lounge', 'Salon privé confidentiel'), t('security.spec_team', 'Équipe & délégation'), t('security.spec_privacy', 'Occultation totale')]
    }
  ];

  const protocolSteps = [
    {
      num: '01',
      title: t('security.step1_title', 'Évaluation & Briefing Confidentiel'),
      desc: t('security.step1_desc', 'Recueil confidentiel de vos contraintes d’itinéraires, sensibilité du profil, horaires et exigences spécifiques de protocole.')
    },
    {
      num: '02',
      title: t('security.step2_title', 'Dimensionnement du Dispositif'),
      desc: t('security.step2_desc', 'Sélection des chauffeurs de sécurité, attribution des agents de protection rapprochée (APR) et choix des véhicules adaptés.')
    },
    {
      num: '03',
      title: t('security.step3_title', 'Reconnaissance & Déploiement'),
      desc: t('security.step3_desc', 'Reconnaissance des accès, liaisons sécurisées avec notre régie 24/7 et prise en charge ponctuelle dès le point d’accueil.')
    },
    {
      num: '04',
      title: t('security.step4_title', 'Supervision Permanente & Débriefing'),
      desc: t('security.step4_desc', 'Suivi satellite en temps réel par notre régie opérationnelle, adaptabilité continue face aux aléas et permanence du dirigeant.')
    }
  ];

  const faqs = [
    {
      q: t('security.faq1_q', 'Qu’est-ce que l’agrément CNAPS et pourquoi est-il indispensable ?'),
      a: t('security.faq1_a', 'Le CNAPS (Conseil National des Activités Privées de Sécurité) est un établissement public administratif placé sous tutelle du Ministère de l’Intérieur. L’agrément dirigeant garantit l’honorabilité, la moralité stricte et les compétences professionnelles exigées par le Code de la sécurité intérieure (Livre VI). Seules les structures sous direction agréée CNAPS sont habilitées à organiser et coordonner légalement des prestations de sécurité privée et de protection de personnes.')
    },
    {
      q: t('security.faq2_q', 'Vos agents de protection rapprochée peuvent-ils intervenir en tenue civile ou en costume ?'),
      a: t('security.faq2_a', 'Absolument. Selon vos préférences et la nature de votre déplacement (dîner de gala, séjour privé en famille, Fashion Week, sommet d’affaires), nos agents de protection rapprochée s’adaptent avec élégance : costume sombre haut de gamme, tenue de ville décontractée ou dispositif de protection totalement furtif.')
    },
    {
      q: t('security.faq3_q', 'Proposez-vous des convois avec véhicule d’escorte et voiture ouvreuse ?'),
      a: t('security.faq3_a', 'Oui. Nous organisons régulièrement des convois sécurisés complets comprenant une berline de tête (reconnaissance d’itinéraire), le véhicule VIP principal (blindé ou hautement sécurisé) et un ou plusieurs SUV d’escorte pour loger les agents APR et les bagages précieux.')
    },
    {
      q: t('security.faq4_q', 'Comment est préservée la confidentialité de nos trajets et identités ?'),
      a: t('security.faq4_a', 'La discrétion fait partie de notre ADN. L’ensemble de nos intervenants, chauffeurs et agents de sécurité sont soumis à une obligation légale de secret professionnel absolu et à des accords de confidentialité (NDA) stricts. Aucune information relative à nos passagers, leurs horaires ou leurs points de destination n’est jamais divulguée.')
    },
    {
      q: t('security.faq5_q', 'Quel est le délai de mobilisation pour une mission urgente ?'),
      a: t('security.faq5_a', 'Grâce à notre régie opérationnelle permanente et à la disponibilité directe de notre direction agréée, nous sommes en mesure d’activer des dispositifs d’urgence en moins d’une heure en région parisienne et sur les principaux hubs aéroportuaires.')
    }
  ];

  return (
    <div className={styles.page}>
      {/* ── 1. Hero Section ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackdrop}>
          <img src="/hero-jet-tarmac.jpg" alt="SELY Sécurité Privée & Protection VIP" />
        </div>
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.cnapsBadgeTop}
          >
            <span className={styles.cnapsBadgeDot} />
            <ShieldCheck size={15} />
            <span>{t('security.hero_badge', 'DIRIGEANT AGRÉÉ CNAPS · SÉCURITÉ PRIVÉE & PROTECTION VIP')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className={styles.heroTitle}
          >
            {t('security.hero_title_pre', 'Sécurité Privée & Haute Protection ')}
            <span className={styles.heroTitleGold}>{t('security.hero_title_gold', 'Pour Vos Déplacements d’Exception')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className={styles.heroSubtitle}
          >
            {t(
              'security.hero_subtitle',
              'Sous la direction d’un dirigeant titulaire de l’agrément CNAPS, SELY Privé orchestre des dispositifs de sécurité sur-mesure : protection rapprochée (APR), chauffeurs formés à la conduite défensive, convois sécurisés et accompagnement discret de personnalités, familles et délégations internationales.'
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className={styles.heroActions}
          >
            <a href="#devis-securite" className={styles.primaryCta}>
              <Shield size={17} />
              <span>{t('security.cta_quote', 'Demander un dispositif de sécurité')}</span>
            </a>

            <a href="tel:+33184805676" className={styles.secondaryCta}>
              <Phone size={16} />
              <span>{t('security.cta_phone', 'Ligne Sécurité 24/7 : +33 1 84 80 56 76')}</span>
            </a>

            <a
              href={`https://wa.me/33184805676?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappCta}
            >
              <MessageSquare size={16} />
              <span>{t('security.cta_wa', 'WhatsApp Sécurité')}</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Official CNAPS Regulatory Card ── */}
      <section className={styles.cnapsBannerSection}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={styles.cnapsCard}
        >
          <div className={styles.cnapsSeal}>
            <Award size={36} strokeWidth={1.6} />
          </div>

          <div className={styles.cnapsInfo}>
            <h3>{t('security.cnaps_card_title', 'Direction Agréée CNAPS · Ministère de l’Intérieur')}</h3>
            <p>
              {t(
                'security.cnaps_card_desc',
                'Notre dirigeant est titulaire de l’agrément dirigeant délivré par le Conseil National des Activités Privées de Sécurité (CNAPS), garantissant la stricte moralité, les compétences professionnelles et la régularité juridique de toutes nos prestations de protection et de sécurité.'
              )}
            </p>
            <div className={styles.cnapsLegalQuote}>
              <strong>{t('security.cnaps_legal_label', 'Mention légale obligatoire (Art. L612-14 du CSI) :')}</strong> « {t('security.cnaps_legal_text', 'L’autorisation d’exercice ne confère aucune prérogative de puissance publique à l’entreprise ou aux personnes qui en bénéficient.')} »
            </div>
          </div>

          <div className={styles.cnapsActionBox}>
            <div className={styles.cnapsPill}>
              <CheckCircle2 size={15} />
              <span>{t('security.cnaps_pill', 'Agrément Vérifié')}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 3. The 6 Security Core Pillars ── */}
      <section className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <Shield size={14} />
            <span>{t('security.pillars_eyebrow', 'DISPOSITIFS & COMPÉTENCES')}</span>
          </div>
          <h2 className={styles.sectionTitle}>
            {t('security.pillars_title', 'Une Prise en Charge Globale de Votre Sécurité')}
          </h2>
          <p className={styles.sectionDesc}>
            {t(
              'security.pillars_desc',
              'Chaque mission fait l’objet d’une planification rigoureuse pour concilier une protection sans faille avec le confort, la fluidité et l’élégance d’un service de Grande Remise.'
            )}
          </p>
        </div>

        <div className={styles.pillarsGrid}>
          {securityPillars.map((pillar, idx) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={styles.pillarCard}
            >
              <div className={styles.pillarIconBox}>
                {pillar.icon}
              </div>
              <h4>{pillar.title}</h4>
              <p>{pillar.desc}</p>
              <ul className={styles.pillarHighlights}>
                {pillar.highlights.map((h, i) => (
                  <li key={i}>
                    <Check size={14} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 4. Word from Management & Qualifications ── */}
      <section className={styles.leaderSection}>
        <div className={styles.leaderInner}>
          <div className={styles.leaderVisual}>
            <img src="/experience_chauffeur.png" alt="Direction SELY Privé Sécurité" />
            <div className={styles.leaderVisualBadge}>
              <h5>{t('security.leader_box_title', 'Direction des Opérations Sécurité')}</h5>
              <span>{t('security.leader_box_sub', 'Dirigeant Agréé CNAPS · Paris')}</span>
            </div>
          </div>

          <div className={styles.leaderContent}>
            <div className={styles.sectionEyebrow}>
              <Award size={14} />
              <span>{t('security.leader_eyebrow', 'ENGAGEMENT DE LA DIRECTION')}</span>
            </div>
            <h3>{t('security.leader_title', 'La Sécurité d’Élite, l’Élégance de la Discrétion')}</h3>
            <p className={styles.leaderQuote}>
              « {t('security.leader_quote', 'La véritable sécurité ne s’impose pas par l’ostentation : elle se distingue par l’anticipation, la maîtrise absolue du terrain et une discrétion irréprochable.')} »
            </p>
            <p className={styles.leaderText}>
              {t(
                'security.leader_text',
                'Titulaire de l’agrément dirigeant CNAPS, notre direction supervise personnellement l’élaboration de chaque dispositif. Nous vous accompagnons dans toutes vos problématiques de sécurité privée : évaluation du niveau de risque, coordination des convois, sélection d’agents de protection rapprochée bilingues et mise à disposition de chauffeurs rompus aux exigences des personnalités et délégations les plus sensibles.'
              )}
            </p>

            <div className={styles.leaderCredentials}>
              <div className={styles.credentialItem}>
                <ShieldCheck size={18} />
                <span>{t('security.cred1', 'Agrément Dirigeant CNAPS')}</span>
              </div>
              <div className={styles.credentialItem}>
                <Lock size={18} />
                <span>{t('security.cred2', 'Secret Professionnel Absolu')}</span>
              </div>
              <div className={styles.credentialItem}>
                <Radio size={18} />
                <span>{t('security.cred3', 'Régie Active 24h/24 & 7j/7')}</span>
              </div>
              <div className={styles.credentialItem}>
                <Building2 size={18} />
                <span>{t('security.cred4', 'Habilitations Préfectorales')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Secure Fleet & Vehicles ── */}
      <section className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <Car size={14} />
            <span>{t('security.fleet_eyebrow', 'FLOTTE SÉCURISÉE')}</span>
          </div>
          <h2 className={styles.sectionTitle}>
            {t('security.fleet_title', 'Véhicules Dédiés à la Protection & aux Cortèges')}
          </h2>
          <p className={styles.sectionDesc}>
            {t(
              'security.fleet_desc',
              'Des berlines de prestige aux grands SUV de protection, notre parc répond aux critères les plus stricts de sécurité, d’insonorisation et de confort palace.'
            )}
          </p>
        </div>

        <div className={styles.fleetShowcaseGrid}>
          {secureFleet.map((v, i) => (
            <div key={i} className={styles.fleetItem}>
              <div className={styles.fleetImgBox}>
                <img src={v.image} alt={v.name} />
                <span className={styles.fleetBadge}>{v.category}</span>
              </div>
              <div className={styles.fleetContent}>
                <h4>{v.name}</h4>
                <p>{v.desc}</p>
                <div className={styles.fleetSpecsRow}>
                  {v.specs.map((s, idx) => (
                    <span key={idx} className={styles.fleetSpecTag}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Protocol 4 Steps ── */}
      <section className={styles.sectionWrapper} style={{ paddingTop: '0' }}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <Radio size={14} />
            <span>{t('security.protocol_eyebrow', 'MÉTHODOLOGIE OPÉRATIONNELLE')}</span>
          </div>
          <h2 className={styles.sectionTitle}>
            {t('security.protocol_title', 'Un Déploiement Sécurisé en 4 Étapes')}
          </h2>
        </div>

        <div className={styles.protocolGrid}>
          {protocolSteps.map((step, i) => (
            <div key={i} className={styles.protocolStep}>
              <span className={styles.stepNum}>{step.num}</span>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Interactive Security Quote / Contact Form ── */}
      <section id="devis-securite" className={styles.formSection}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <div className={styles.sectionEyebrow}>
              <ShieldCheck size={14} />
              <span>{t('security.form_badge', 'DISPOSITIF SUR-MESURE')}</span>
            </div>
            <h3>{t('security.form_title', 'Demande Confidentielle de Sécurité Privée')}</h3>
            <p>
              {t(
                'security.form_sub',
                'Notre direction opérationnelle analyse votre demande sous le sceau de la confidentialité et vous répond sous 15 minutes.'
              )}
            </p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ display: 'inline-flex', padding: '1.2rem', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', color: '#4ade80', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={48} />
              </div>
              <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.8rem' }}>
                {t('security.submitted_title', 'Votre demande sécurisée a bien été transmise')}
              </h3>
              <p style={{ color: '#a1a1aa', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
                {t('security.submitted_desc', 'Notre direction agréée CNAPS prend contact avec vous en toute discrétion dans un délai inférieur à 15 minutes.')}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className={styles.secondaryCta}
              >
                {t('security.new_request', 'Nouvelle demande')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>{t('security.label_name', 'Nom complet / Titre *')}</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="M. / Mme / Excellence..."
                    className={styles.luxuryInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>{t('security.label_phone', 'Téléphone sécurisé *')}</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+33 6 00 00 00 00"
                    className={styles.luxuryInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>{t('security.label_email', 'Email officiel *')}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@organisation.com"
                    className={styles.luxuryInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>{t('security.label_service', 'Type de prestation souhaitée *')}</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className={styles.luxurySelect}
                  >
                    <option value="protection_rapprochee">{t('security.opt_apr', 'Protection Rapprochée VIP (APR)')}</option>
                    <option value="chauffeur_securite">{t('security.opt_driver', 'Chauffeur de Sécurité & Conduite Défensive')}</option>
                    <option value="convoi_cortege">{t('security.opt_convoy', 'Convoi Sécurisé & Véhicule d’Escorte')}</option>
                    <option value="sejour_famille">{t('security.opt_family', 'Sécurisation de Séjour & Famille')}</option>
                    <option value="joaillerie_evenement">{t('security.opt_event', 'Joaillerie, Mode & Événementiel')}</option>
                    <option value="audit_reconnaissance">{t('security.opt_audit', 'Audit d’Itinéraire & Conseil Sécurité')}</option>
                  </select>
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.fieldLabel}>{t('security.label_duration', 'Période / Durée envisagée')}</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Ex : Du 15 au 18 octobre (Fashion Week), ou mission ponctuelle 24h..."
                    className={styles.luxuryInput}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.fieldLabel}>{t('security.label_notes', 'Détails du besoin & Exigences spécifiques')}</label>
                  <textarea
                    rows={4}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Nombre de personnalités, aéroport d'arrivée, exigences de discrétion, véhicules souhaités..."
                    className={styles.luxuryTextarea}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={styles.submitBtn}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{t('security.btn_submitting', 'Transmission sécurisée...')}</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>{t('security.btn_submit', 'Transmettre ma demande confidentielle')}</span>
                  </>
                )}
              </button>

              <div className={styles.confidentialNotice}>
                <Lock size={13} />
                <span>{t('security.form_notice', 'Confidentialité totale garantie · Données protégées par le secret professionnel')}</span>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── 8. FAQ Section ── */}
      <section className={styles.faqSection}>
        <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
          <div className={styles.sectionEyebrow}>
            <FileText size={14} />
            <span>{t('security.faq_eyebrow', 'QUESTIONS FRÉQUENTES')}</span>
          </div>
          <h2 className={styles.sectionTitle}>{t('security.faq_title', 'Sécurité Privée & Réglementation CNAPS')}</h2>
        </div>

        <div className={styles.faqList}>
          {faqs.map((item, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className={styles.faqItem}>
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className={styles.faqQuestion}
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp size={18} color="#c5a059" /> : <ChevronDown size={18} color="#9ca3af" />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className={styles.faqAnswer}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 9. Final 24/7 Hotline Bar ── */}
      <div className={styles.hotlineBar}>
        <div className={styles.hotlineInner}>
          <div className={styles.hotlineText}>
            <h4>{t('security.bar_title', 'Besoin d’un Dispositif de Sécurité Immédiat ?')}</h4>
            <p>{t('security.bar_sub', 'Permanence opérationnelle de notre direction agréée disponible 24h/24 et 7j/7.')}</p>
          </div>
          <div className={styles.hotlineActions}>
            <a href="tel:+33184805676" className={styles.hotlinePhoneBtn}>
              <Phone size={15} />
              <span>+33 1 84 80 56 76</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
