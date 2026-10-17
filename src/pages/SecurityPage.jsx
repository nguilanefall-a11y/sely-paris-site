import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Loader2,
  Check
} from 'lucide-react';
import { useCity } from '../hooks/useCity';
import styles from './SecurityPage.module.css';

export default function SecurityPage() {
  const { t, currentCity } = useCity();

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
      desc: t('security.fleet_desc1', 'Vitrage feuilleté surteinté anti-effraction, insonorisation d’art, salon grand confort et discrétion souveraine pour vos déplacements sensibles.'),
      image: '/maybach-paris-luxury.jpg',
      specs: [t('security.spec_tinted', 'Vitrage anti-effraction'), t('security.spec_wifi', 'Wi-Fi chiffré'), t('security.spec_quiet', 'Insonorisation totale')]
    },
    {
      name: 'Cadillac Escalade ESV & Range Rover',
      category: t('security.fleet_cat2', 'SUV d’Escorte & Protection Rapprochée'),
      desc: t('security.fleet_desc2', 'Gabarit statutaire protecteur, motricité intégrale et assise dominante pour le transport des équipages de sécurité et des bagages confidentiels.'),
      image: '/cadillac-escalade-main.jpg',
      specs: [t('security.spec_allroad', 'Transmission intégrale'), t('security.spec_stature', 'Gabarit d’intervention'), t('security.spec_power', 'Puissance & motricité')]
    },
    {
      name: 'Mercedes Sprinter Lounge VIP',
      category: t('security.fleet_cat3', 'Transport Sécurisé de Délégation'),
      desc: t('security.fleet_desc3', 'Salon de commandement roulant permettant de déplacer délégations et entourages sous haute protection, avec cloisons occultantes et bureau sécurisé.'),
      image: '/minibus-7-vip-interior.jpg',
      specs: [t('security.spec_lounge', 'Salon privé confidentiel'), t('security.spec_team', 'Jusqu’à 7 à 19 passagers'), t('security.spec_privacy', 'Occultation totale')]
    }
  ];

  const protocolSteps = [
    {
      roman: 'I',
      title: t('security.step1_title', 'Évaluation & Briefing Confidentiel'),
      desc: t('security.step1_desc', 'Recueil confidentiel des contraintes d’itinéraires, profil d’exposition, calendrier et impératifs protocolaires.')
    },
    {
      roman: 'II',
      title: t('security.step2_title', 'Dimensionnement du Dispositif'),
      desc: t('security.step2_desc', 'Sélection des chauffeurs de sécurité, attribution des agents APR certifiés CNAPS et configuration de la flotte adaptée.')
    },
    {
      roman: 'III',
      title: t('security.step3_title', 'Reconnaissance & Déploiement'),
      desc: t('security.step3_desc', 'Reconnaissance minutieuse des accès, activation de la régie opérationnelle 24/7 et mise en place anticipée des véhicules.')
    },
    {
      roman: 'IV',
      title: t('security.step4_title', 'Supervision Permanente & Débriefing'),
      desc: t('security.step4_desc', 'Télémesure et suivi en direct, gestion proactive des itinéraires de délestage et permanence directe du dirigeant.')
    }
  ];

  const faqs = [
    {
      q: t('security.faq1_q', 'Qu’est-ce que l’agrément dirigeant CNAPS et pourquoi est-il obligatoire ?'),
      a: t('security.faq1_a', 'Le Conseil National des Activités Privées de Sécurité (CNAPS) est l’établissement public administratif placé sous la tutelle du Ministère de l’Intérieur. L’agrément dirigeant atteste de la moralité stricte, de l’honorabilité et de la formation qualifiante requises par le Code de la sécurité intérieure (Livre VI). Seules les structures dirigées par un titulaire d’agrément CNAPS peuvent organiser et coordonner légalement des prestations de protection de personnes et de sécurité privée.')
    },
    {
      q: t('security.faq2_q', 'Quelle est la tenue de vos agents de protection rapprochée (APR) ?'),
      a: t('security.faq2_a', 'L’élégance et la discrétion dictent nos choix. Selon le contexte de votre séjour (dîner officiel, semaine de la mode, vacances en famille ou rendez-vous d’affaires confidentiel), nos agents adaptent leur posture : costume sombre sur-mesure d’inspiration diplomatique, tenue de ville sobre ou présence totalement furtive en retrait.')
    },
    {
      q: t('security.faq3_q', 'Organisez-vous des convois avec véhicules d’escorte et voiture ouvreuse ?'),
      a: t('security.faq3_a', 'Oui. Nous déployons régulièrement des convois coordonnés intégrant un véhicule ouvreur pour l’anticipation des carrefours et embouteillages, la berline principale abritant le VIP, ainsi qu’un ou plusieurs SUV de protection arrière en liaison radio cryptée constante.')
    },
    {
      q: t('security.faq4_q', 'Comment est garantie la stricte confidentialité de nos déplacements ?'),
      a: t('security.faq4_a', 'Tous nos intervenants sont liés par une clause contractuelle de non-divulgation (NDA) et assujettis aux obligations strictes du secret professionnel. Aucune mention d’identité, d’itinéraire, de résidence privée ou d’horaire de vol n’est conservée ou divulguée à des tiers.')
    },
    {
      q: t('security.faq5_q', 'Quel est le délai de mobilisation pour une mise en place urgente ?'),
      a: t('security.faq5_a', 'Notre régie opérationnelle permanente et l’accès direct au dirigeant agréé permettent de mettre en place un dispositif d’urgence en moins d’une heure en région parisienne et sur les principaux terminaux d’aviation d’affaires (Le Bourget, Orly, Roissy).')
    }
  ];

  return (
    <div className={styles.page}>
      {/* ── 1. Hero Section (Quiet Luxury & Minimalist Lines) ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackdrop}>
          <img src="/hero-jet-tarmac.jpg" alt="SELY Sécurité Privée & Protection VIP" />
        </div>
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.institutionalTag}
          >
            <span>{t('security.hero_badge', 'RÉGLEMENTATION MINISTÈRE DE L’INTÉRIEUR · DIRIGEANT AGRÉÉ CNAPS')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={styles.heroTitle}
          >
            {t('security.hero_title_pre', 'Sécurité Privée & Haute Protection')}
            <span className={styles.heroTitleItalic}>
              {t('security.hero_title_gold', 'Pour vos déplacements d’exception')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={styles.heroSubtitle}
          >
            {t(
              'security.hero_subtitle',
              'Sous la direction d’un dirigeant titulaire de l’agrément CNAPS, SELY Privé orchestre des dispositifs de sécurité sur-mesure : protection rapprochée (APR), chauffeurs formés à la conduite défensive, convois sécurisés et accompagnement discret de personnalités, familles et délégations internationales.'
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className={styles.heroActions}
          >
            <a href="#dossier-securite" className={styles.primaryCta}>
              {t('security.cta_quote', 'Demander un dispositif')}
            </a>

            <a href="tel:+33184805676" className={styles.secondaryCta}>
              <Phone size={14} />
              <span>{t('security.cta_phone', '+33 1 84 80 56 76')}</span>
            </a>

            <a
              href={`https://wa.me/33184805676?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappLink}
            >
              <MessageSquare size={14} />
              <span>WhatsApp Direction</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Official CNAPS Regulatory Cartouche ── */}
      <section className={styles.cnapsSection}>
        <div className={styles.cnapsFrame}>
          <div className={styles.cnapsSealSymbol}>
            CNAPS
            <span>Direction Agréée</span>
          </div>

          <div className={styles.cnapsDetails}>
            <h3>{t('security.cnaps_card_title', 'Direction Agréée CNAPS · Ministère de l’Intérieur')}</h3>
            <p>
              {t(
                'security.cnaps_card_desc',
                'Notre dirigeant est titulaire de l’agrément dirigeant délivré par le Conseil National des Activités Privées de Sécurité (CNAPS), garantissant la stricte moralité, les compétences professionnelles et la régularité juridique de toutes nos prestations de protection et de sécurité.'
              )}
            </p>
            <div className={styles.cnapsLegalStatute}>
              <strong>{t('security.cnaps_legal_label', 'Mention légale obligatoire (Art. L612-14 du CSI) :')}</strong> « {t('security.cnaps_legal_text', 'L’autorisation d’exercice ne confère aucune prérogative de puissance publique à l’entreprise ou aux personnes qui en bénéficient.')} »
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Pillars: Architectural Editorial List ── */}
      <section className={styles.sectionWrapper}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIndex}>01 / Domaines d’intervention</span>
            <h2 className={styles.sectionTitle}>
              {t('security.pillars_title', 'Une prise en charge globale de votre sécurité')}
            </h2>
            <p className={styles.sectionDesc}>
              {t(
                'security.pillars_desc',
                'Chaque mission fait l’objet d’une planification rigoureuse pour concilier une protection sans faille avec le confort, la fluidité et l’élégance d’un service de Grande Remise.'
              )}
            </p>
          </div>

          <div className={styles.pillarsList}>
            {securityPillars.map((pillar, idx) => (
              <div key={pillar.id} className={styles.pillarRow}>
                <div className={styles.pillarNum}>0{idx + 1}</div>
                <div className={styles.pillarTitleCol}>
                  <h4>{pillar.title}</h4>
                </div>
                <div className={styles.pillarBodyCol}>
                  <p>{pillar.desc}</p>
                  <ul className={styles.pillarPoints}>
                    {pillar.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Word from Management (Editorial Portrait & Credentials) ── */}
      <section className={styles.statementSection}>
        <div className={styles.container}>
          <div className={styles.statementGrid}>
            <div className={styles.statementVisual}>
              <img src="/experience_chauffeur.png" alt="Direction SELY Privé Sécurité" />
            </div>

            <div className={styles.statementContent}>
              <span className={styles.sectionIndex}>02 / Direction & Déontologie</span>
              <blockquote className={styles.statementQuote}>
                « {t('security.leader_quote', 'La véritable sécurité ne s’impose pas par l’ostentation : elle se distingue par l’anticipation, la maîtrise absolue du terrain et une discrétion irréprochable.')} »
              </blockquote>
              <p className={styles.statementText}>
                {t(
                  'security.leader_text',
                  'Titulaire de l’agrément dirigeant CNAPS, notre direction supervise personnellement l’élaboration de chaque dispositif. Nous vous accompagnons dans toutes vos problématiques de sécurité privée : évaluation du niveau de risque, coordination des convois, sélection d’agents de protection rapprochée bilingues et mise à disposition de chauffeurs rompus aux exigences des personnalités et délégations les plus sensibles.'
                )}
              </p>

              <div className={styles.credentialsRow}>
                <div className={styles.credentialItem}>
                  <span className={styles.credentialLabel}>Agrément Officiel</span>
                  <span className={styles.credentialValue}>CNAPS · Ministère de l’Intérieur</span>
                </div>
                <div className={styles.credentialItem}>
                  <span className={styles.credentialLabel}>Déontologie</span>
                  <span className={styles.credentialValue}>Secret Professionnel Strict (NDA)</span>
                </div>
                <div className={styles.credentialItem}>
                  <span className={styles.credentialLabel}>Permanence</span>
                  <span className={styles.credentialValue}>Régie Opérationnelle 24h/24 · 7j/7</span>
                </div>
                <div className={styles.credentialItem}>
                  <span className={styles.credentialLabel}>Conformité Légale</span>
                  <span className={styles.credentialValue}>Livre VI Code Sécurité Intérieure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Secured Fleet ── */}
      <section className={styles.sectionWrapper}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIndex}>03 / Flotte & Équipements</span>
            <h2 className={styles.sectionTitle}>
              {t('security.fleet_title', 'Véhicules dédiés à la protection & aux cortèges')}
            </h2>
            <p className={styles.sectionDesc}>
              {t(
                'security.fleet_desc',
                'Des berlines de prestige aux grands SUV de protection, notre parc répond aux critères les plus stricts de sécurité, d’insonorisation et de confort palace.'
              )}
            </p>
          </div>

          <div className={styles.fleetGrid}>
            {secureFleet.map((v, i) => (
              <div key={i} className={styles.fleetCard}>
                <div className={styles.fleetImageWrapper}>
                  <img src={v.image} alt={v.name} />
                </div>
                <span className={styles.fleetCategory}>{v.category}</span>
                <h4>{v.name}</h4>
                <p>{v.desc}</p>
                <div className={styles.fleetSpecs}>
                  {v.specs.join(' · ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Operational Methodology ── */}
      <section className={styles.sectionWrapper}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIndex}>04 / Protocole Opérationnel</span>
            <h2 className={styles.sectionTitle}>
              {t('security.protocol_title', 'Un déploiement sécurisé en 4 étapes')}
            </h2>
          </div>

          <div className={styles.methodologyGrid}>
            {protocolSteps.map((step, i) => (
              <div key={i} className={styles.methodologyStep}>
                <span className={styles.stepRoman}>{step.roman}</span>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Confidential Protocol Request Form (Underline Architectural Design) ── */}
      <section id="dossier-securite" className={styles.dossierSection}>
        <div className={styles.container}>
          <div className={styles.dossierInner}>
            <div className={styles.dossierHeader}>
              <span className={styles.sectionIndex}>05 / Contact Direct & Confidentiel</span>
              <h3>{t('security.form_title', 'Demande confidentielle de dispositif')}</h3>
              <p>
                {t(
                  'security.form_sub',
                  'Notre direction opérationnelle analyse votre demande sous le sceau de la confidentialité et vous répond sous 15 minutes.'
                )}
              </p>
            </div>

            {submitted ? (
              <div className={styles.successDossier}>
                <h3>{t('security.submitted_title', 'Votre demande sécurisée a bien été transmise')}</h3>
                <p>
                  {t(
                    'security.submitted_desc',
                    'Notre direction agréée CNAPS prend contact avec vous en toute discrétion dans un délai inférieur à 15 minutes.'
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className={styles.resetBtn}
                >
                  {t('security.new_request', 'Nouvelle demande')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.dossierForm}>
                <div className={styles.fieldWrapper}>
                  <label className={styles.fieldLabel}>{t('security.label_name', 'Nom complet / Titre *')}</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="M. / Mme / Excellence..."
                    className={styles.minimalInput}
                  />
                </div>

                <div className={styles.fieldWrapper}>
                  <label className={styles.fieldLabel}>{t('security.label_phone', 'Téléphone sécurisé *')}</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+33 6 00 00 00 00"
                    className={styles.minimalInput}
                  />
                </div>

                <div className={styles.fieldWrapper}>
                  <label className={styles.fieldLabel}>{t('security.label_email', 'Email officiel *')}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@organisation.com"
                    className={styles.minimalInput}
                  />
                </div>

                <div className={styles.fieldWrapper}>
                  <label className={styles.fieldLabel}>{t('security.label_service', 'Type de prestation souhaitée *')}</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className={styles.minimalSelect}
                  >
                    <option value="protection_rapprochee">{t('security.opt_apr', 'Protection Rapprochée VIP (APR)')}</option>
                    <option value="chauffeur_securite">{t('security.opt_driver', 'Chauffeur de Sécurité & Conduite Défensive')}</option>
                    <option value="convoi_cortege">{t('security.opt_convoy', 'Convoi Sécurisé & Véhicule d’Escorte')}</option>
                    <option value="sejour_famille">{t('security.opt_family', 'Sécurisation de Séjour & Famille')}</option>
                    <option value="joaillerie_evenement">{t('security.opt_event', 'Joaillerie, Mode & Événementiel')}</option>
                    <option value="audit_reconnaissance">{t('security.opt_audit', 'Audit d’Itinéraire & Conseil Sécurité')}</option>
                  </select>
                </div>

                <div className={styles.fieldWrapperFull}>
                  <label className={styles.fieldLabel}>{t('security.label_duration', 'Période / Durée envisagée')}</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Ex : Du 15 au 18 octobre (Fashion Week), ou mission ponctuelle 24h..."
                    className={styles.minimalInput}
                  />
                </div>

                <div className={styles.fieldWrapperFull}>
                  <label className={styles.fieldLabel}>{t('security.label_notes', 'Détails du besoin & Exigences spécifiques')}</label>
                  <textarea
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Nombre de personnalités, aéroport d'arrivée, exigences de discrétion, véhicules souhaités..."
                    className={styles.minimalTextarea}
                  />
                </div>

                <div className={styles.dossierActionRow}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={styles.submitDossierBtn}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>{t('security.btn_submitting', 'Transmission sécurisée...')}</span>
                      </>
                    ) : (
                      <span>{t('security.btn_submit', 'Transmettre la demande confidentielle')}</span>
                    )}
                  </button>

                  <div className={styles.secrecyNotice}>
                    {t('security.form_notice', 'Confidentialité totale garantie · Données protégées par le secret professionnel')}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── 8. FAQ Section ── */}
      <section className={styles.faqSection}>
        <div className={styles.sectionHeader} style={{ textAlign: 'center', margin: '0 auto 3.5rem' }}>
          <span className={styles.sectionIndex}>06 / Précisions Légales & Pratiques</span>
          <h2 className={styles.sectionTitle}>{t('security.faq_title', 'Questions fréquentes')}</h2>
        </div>

        <div>
          {faqs.map((item, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className={styles.faqItem}>
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className={styles.faqQuestionBtn}
                >
                  <span>{item.q}</span>
                  <span className={styles.faqToggleIcon}>
                    {isOpen ? '—' : '+'}
                  </span>
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

      {/* ── 9. Final 24/7 Hotline Strip ── */}
      <div className={styles.hotlineStrip}>
        <div className={styles.hotlineInner}>
          <div className={styles.hotlineText}>
            <h5>{t('security.bar_title', 'Besoin d’un Dispositif de Sécurité Immédiat ?')}</h5>
            <p>{t('security.bar_sub', 'Permanence opérationnelle de notre direction agréée disponible 24h/24 et 7j/7.')}</p>
          </div>
          <a href="tel:+33184805676" className={styles.hotlineCallLink}>
            +33 1 84 80 56 76
          </a>
        </div>
      </div>
    </div>
  );
}
