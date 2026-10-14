const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'src', 'locales');

const frSecurity = {
  hero_badge: 'DIRIGEANT AGRÉÉ CNAPS · SÉCURITÉ PRIVÉE & PROTECTION VIP',
  hero_title_pre: 'Sécurité Privée & Haute Protection ',
  hero_title_gold: 'Pour Vos Déplacements d’Exception',
  hero_subtitle: 'Sous la direction d’un dirigeant titulaire de l’agrément CNAPS, SELY Privé orchestre des dispositifs de sécurité sur-mesure : protection rapprochée (APR), chauffeurs formés à la conduite défensive, convois sécurisés et accompagnement discret de personnalités, familles et délégations internationales.',
  cta_quote: 'Demander un dispositif de sécurité',
  cta_phone: 'Ligne Sécurité 24/7 : +33 1 84 80 56 76',
  cta_wa: 'WhatsApp Sécurité',
  cnaps_card_title: 'Direction Agréée CNAPS · Ministère de l’Intérieur',
  cnaps_card_desc: 'Notre dirigeant est titulaire de l’agrément dirigeant délivré par le Conseil National des Activités Privées de Sécurité (CNAPS), garantissant la stricte moralité, les compétences professionnelles et la régularité juridique de toutes nos prestations de protection et de sécurité.',
  cnaps_legal_label: 'Mention légale obligatoire (Art. L612-14 du CSI) :',
  cnaps_legal_text: 'L’autorisation d’exercice ne confère aucune prérogative de puissance publique à l’entreprise ou aux personnes qui en bénéficient.',
  cnaps_pill: 'Agrément Vérifié',
  pillars_eyebrow: 'DISPOSITIFS & COMPÉTENCES',
  pillars_title: 'Une Prise en Charge Globale de Votre Sécurité',
  pillars_desc: 'Chaque mission fait l’objet d’une planification rigoureuse pour concilier une protection sans faille avec le confort, la fluidité et l’élégance d’un service de Grande Remise.',
  p1_title: 'Chauffeurs de Sécurité & Conduite Défensive',
  p1_desc: 'Pilotes expérimentés formés aux techniques de conduite anti-agression, anti-filature, évitement d’obstacles et maîtrise des situations d’urgence en milieu urbain et autoroutier.',
  p1_h1: 'Formation conduite défensive & évasive certifiée',
  p1_h2: 'Maîtrise des véhicules blindés et lourds (Classe S, Maybach, Escalade)',
  p1_h3: 'Repérage permanent et détection des menaces périphériques',
  p2_title: 'Agents de Protection Rapprochée (APR)',
  p2_desc: 'Gardes du corps professionnels certifiés CNAPS, discrets et élégants, habitués aux exigences protocolaires des personnalités publiques, diplomates, dirigeants et familles fortunées.',
  p2_h1: 'Carte professionnelle CNAPS & habilitation officielle',
  p2_h2: 'Discrétion absolue, posture protocolaire et costume sur-mesure',
  p2_h3: 'Agents polyglottes (Français, Anglais, Arabe, Russe)',
  p3_title: 'Convois Sécurisés & Cortèges d’Escorte',
  p3_desc: 'Planification et coordination de cortèges multi-véhicules avec véhicule ouvreur de reconnaissance, berline principale sécurisée et SUV d’escorte rapprochée.',
  p3_h1: 'Liaison radio cryptée permanente entre équipages',
  p3_h2: 'Reconnaissance préalable des itinéraires et points de repli',
  p3_h3: 'Coordination possible avec les services officiels et ambassades',
  p4_title: 'Accompagnement VIP, Familles & Séjours',
  p4_desc: 'Prise en charge intégrale et sécurisation des déplacements familiaux, de la sortie du jet privé (Le Bourget, Nice, Genève) aux résidences privées, palaces et stations de villégiature.',
  p4_h1: 'Sécurisation des enfants et des proches en toute bienveillance',
  p4_h2: 'Accompagnement shopping de luxe, salons privés et galas',
  p4_h3: 'Veille sécuritaire discrète 24h/24 lors de vos séjours',
  p5_title: 'Sécurisation Événements, Joaillerie & Mode',
  p5_desc: 'Protection et transport sécurisé pour les maisons de haute joaillerie, défilés de Fashion Week, ventes aux enchères et événements privés à haute visibilité.',
  p5_h1: 'Transferts sécurisés de pièces de joaillerie et d’art',
  p5_h2: 'Contrôle des accès VIP et filtrage discret des invités',
  p5_h3: 'Cellule dédiée Fashion Week et festivals internationaux',
  p6_title: 'Audit de Vulnérabilité & Gestion de Crise',
  p6_desc: 'Étude méthodique en amont des axes routiers, repérage des établissements hospitaliers, identification des zones à risque et plans de continuité sécuritaire.',
  p6_h1: 'Cartographie préalable des points d’évacuation médicale',
  p6_h2: 'Permanence opérationnelle de crise et supervision en temps réel',
  p6_h3: 'Adaptabilité dynamique en fonction des conditions de circulation',
  leader_box_title: 'Direction des Opérations Sécurité',
  leader_box_sub: 'Dirigeant Agréé CNAPS · Paris',
  leader_eyebrow: 'ENGAGEMENT DE LA DIRECTION',
  leader_title: 'La Sécurité d’Élite, l’Élégance de la Discrétion',
  leader_quote: 'La véritable sécurité ne s’impose pas par l’ostentation : elle se distingue par l’anticipation, la maîtrise absolue du terrain et une discrétion irréprochable.',
  leader_text: 'Titulaire de l’agrément dirigeant CNAPS, notre direction supervise personnellement l’élaboration de chaque dispositif. Nous vous accompagnons dans toutes vos problématiques de sécurité privée : évaluation du niveau de risque, coordination des convois, sélection d’agents de protection rapprochée bilingues et mise à disposition de chauffeurs rompus aux exigences des personnalités et délégations les plus sensibles.',
  cred1: 'Agrément Dirigeant CNAPS',
  cred2: 'Secret Professionnel Absolu',
  cred3: 'Régie Active 24h/24 & 7j/7',
  cred4: 'Habilitations Préfectorales',
  fleet_eyebrow: 'FLOTTE SÉCURISÉE',
  fleet_title: 'Véhicules Dédiés à la Protection & aux Cortèges',
  fleet_desc: 'Des berlines de prestige aux grands SUV de protection, notre parc répond aux critères les plus stricts de sécurité, d’insonorisation et de confort palace.',
  fleet_cat1: 'Berlines Exécutives Sécurisées',
  fleet_desc1: 'Vitrage feuilleté surteinté anti-effraction, insonorisation d’art, salon grand confort et discrétion souveraine.',
  fleet_cat2: 'SUV d’Escorte & Protection',
  fleet_desc2: 'Présence statutaire imposante, motricité intégrale tout-terrain, volume protecteur et assise dominante pour vos équipes de sécurité.',
  fleet_cat3: 'Transport Sécurisé de Délégation',
  fleet_desc3: 'Salon de commandement roulant permettant de déplacer jusqu’à 7 à 19 passagers sous haute protection, avec cloisons occultantes et espace de travail confidentiel.',
  spec_tinted: 'Vitres teintées',
  spec_wifi: 'Wi-Fi chiffré',
  spec_quiet: 'Silence feutré',
  spec_allroad: 'Transmission intégrale',
  spec_stature: 'Gabarit statutaire',
  spec_power: 'Puissance d’intervention',
  spec_lounge: 'Salon privé confidentiel',
  spec_team: 'Équipe & délégation',
  spec_privacy: 'Occultation totale',
  protocol_eyebrow: 'MÉTHODOLOGIE OPÉRATIONNELLE',
  protocol_title: 'Un Déploiement Sécurisé en 4 Étapes',
  step1_title: 'Évaluation & Briefing Confidentiel',
  step1_desc: 'Recueil confidentiel de vos contraintes d’itinéraires, sensibilité du profil, horaires et exigences spécifiques de protocole.',
  step2_title: 'Dimensionnement du Dispositif',
  step2_desc: 'Sélection des chauffeurs de sécurité, attribution des agents de protection rapprochée (APR) et choix des véhicules adaptés.',
  step3_title: 'Reconnaissance & Déploiement',
  step3_desc: 'Reconnaissance des accès, liaisons sécurisées avec notre régie 24/7 et prise en charge ponctuelle dès le point d’accueil.',
  step4_title: 'Supervision Permanente & Débriefing',
  step4_desc: 'Suivi satellite en temps réel par notre régie opérationnelle, adaptabilité continue face aux aléas et permanence du dirigeant.',
  form_badge: 'DISPOSITIF SUR-MESURE',
  form_title: 'Demande Confidentielle de Sécurité Privée',
  form_sub: 'Notre direction opérationnelle analyse votre demande sous le sceau de la confidentialité et vous répond sous 15 minutes.',
  submitted_title: 'Votre demande sécurisée a bien été transmise',
  submitted_desc: 'Notre direction agréée CNAPS prend contact avec vous en toute discrétion dans un délai inférieur à 15 minutes.',
  new_request: 'Nouvelle demande',
  label_name: 'Nom complet / Titre *',
  label_phone: 'Téléphone sécurisé *',
  label_email: 'Email officiel *',
  label_service: 'Type de prestation souhaitée *',
  label_duration: 'Période / Durée envisagée',
  label_notes: 'Détails du besoin & Exigences spécifiques',
  opt_apr: 'Protection Rapprochée VIP (APR)',
  opt_driver: 'Chauffeur de Sécurité & Conduite Défensive',
  opt_convoy: 'Convoi Sécurisé & Véhicule d’Escorte',
  opt_family: 'Sécurisation de Séjour & Famille',
  opt_event: 'Joaillerie, Mode & Événementiel',
  opt_audit: 'Audit d’Itinéraire & Conseil Sécurité',
  btn_submit: 'Transmettre ma demande confidentielle',
  btn_submitting: 'Transmission sécurisée...',
  form_notice: 'Confidentialité totale garantie · Données protégées par le secret professionnel',
  faq_eyebrow: 'QUESTIONS FRÉQUENTES',
  faq_title: 'Sécurité Privée & Réglementation CNAPS',
  faq1_q: 'Qu’est-ce que l’agrément CNAPS et pourquoi est-il indispensable ?',
  faq1_a: 'Le CNAPS (Conseil National des Activités Privées de Sécurité) est un établissement public administratif placé sous tutelle du Ministère de l’Intérieur. L’agrément dirigeant garantit l’honorabilité, la moralité stricte et les compétences professionnelles exigées par le Code de la sécurité intérieure (Livre VI). Seules les structures sous direction agréée CNAPS sont habilitées à organiser et coordonner légalement des prestations de sécurité privée et de protection de personnes.',
  faq2_q: 'Vos agents de protection rapprochée peuvent-ils intervenir en tenue civile ou en costume ?',
  faq2_a: 'Absolument. Selon vos préférences et la nature de votre déplacement (dîner de gala, séjour privé en famille, Fashion Week, sommet d’affaires), nos agents de protection rapprochée s’adaptent avec élégance : costume sombre haut de gamme, tenue de ville décontractée ou dispositif de protection totalement furtif.',
  faq3_q: 'Proposez-vous des convois avec véhicule d’escorte et voiture ouvreuse ?',
  faq3_a: 'Oui. Nous organisons régulièrement des convois sécurisés complets comprenant une berline de tête (reconnaissance d’itinéraire), le véhicule VIP principal (blindé ou hautement sécurisé) et un ou plusieurs SUV d’escorte pour loger les agents APR et les bagages précieux.',
  faq4_q: 'Comment est préservée la confidentialité de nos trajets et identités ?',
  faq4_a: 'La discrétion fait partie de notre ADN. L’ensemble de nos intervenants, chauffeurs et agents de sécurité sont soumis à une obligation légale de secret professionnel absolu et à des accords de confidentialité (NDA) stricts. Aucune information relative à nos passagers, leurs horaires ou leurs points de destination n’est jamais divulguée.',
  faq5_q: 'Quel est le délai de mobilisation pour une mission urgente ?',
  faq5_a: 'Grâce à notre régie opérationnelle permanente et à la disponibilité directe de notre direction agréée, nous sommes en mesure d’activer des dispositifs d’urgence en moins d’une heure en région parisienne et sur les principaux hubs aéroportuaires.',
  bar_title: 'Besoin d’un Dispositif de Sécurité Immédiat ?',
  bar_sub: 'Permanence opérationnelle de notre direction agréée disponible 24h/24 et 7j/7.'
};

const enSecurity = {
  hero_badge: 'CNAPS-CERTIFIED EXECUTIVE · PRIVATE SECURITY & VIP PROTECTION',
  hero_title_pre: 'Private Security & High Protection ',
  hero_title_gold: 'For Your Exceptional Journeys',
  hero_subtitle: 'Under the leadership of an executive holding official CNAPS accreditation (French Ministry of the Interior), SELY Privé orchestrates bespoke security operations: close protection officers (CPO), defensive driving chauffeurs, secure convoys, and discreet accompaniment for dignitaries, VIP families, and international delegations.',
  cta_quote: 'Request a security detail',
  cta_phone: '24/7 Security Line: +33 1 84 80 56 76',
  cta_wa: 'WhatsApp Security',
  cnaps_card_title: 'CNAPS-Certified Management · French Ministry of the Interior',
  cnaps_card_desc: 'Our executive holds the official director accreditation issued by CNAPS (National Council for Private Security Activities), ensuring strict probity, top-tier professional competencies, and full regulatory compliance for all our protection and security services.',
  cnaps_legal_label: 'Mandatory statutory notice (Art. L612-14 CSI):',
  cnaps_legal_text: 'Exercise authorization does not confer any public power prerogatives on the company or on the persons who benefit from it.',
  cnaps_pill: 'Verified Accreditation',
  pillars_eyebrow: 'CAPABILITIES & OPERATIONS',
  pillars_title: 'Comprehensive Mastery of Your Personal Safety',
  pillars_desc: 'Every mission undergoes rigorous planning to reconcile flawless protection with the fluid elegance, discretion, and prestige of elite Grand Remise chauffeur services.',
  p1_title: 'Security Chauffeurs & Defensive Driving',
  p1_desc: 'Highly experienced pilots trained in anti-ambush tactics, counter-surveillance, obstacle evasion, and high-speed emergency maneuvering in urban and highway environments.',
  p1_h1: 'Certified defensive & evasive driving qualification',
  p1_h2: 'Mastery of heavy and armored vehicles (S-Class, Maybach, Escalade)',
  p1_h3: 'Continuous perimeter scanning and early threat detection',
  p2_title: 'Close Protection Officers (CPO / APR)',
  p2_desc: 'CNAPS-certified professional bodyguards, discreet and impeccably dressed, experienced with the protocol requirements of dignitaries, executives, public figures, and wealthy families.',
  p2_h1: 'Official CNAPS professional card & state credentials',
  p2_h2: 'Absolute discretion, tailored suit or casual attire, refined demeanor',
  p2_h3: 'Multilingual officers (French, English, Arabic, Russian)',
  p3_title: 'Secure Convoys & Motorcades',
  p3_desc: 'Planning and execution of multi-vehicle motorcades featuring lead reconnaissance vehicles, fortified VIP sedans, and dedicated escort SUVs.',
  p3_h1: 'Encrypted real-time radio communication between vehicles',
  p3_h2: 'Advance reconnaissance of routes, checkpoints, and safe havens',
  p3_h3: 'Direct liaison with embassies and official security details',
  p4_title: 'VIP & Family Stays Protection',
  p4_desc: 'Comprehensive protection for family holidays and executive stays, from private jet tarmac handling (Le Bourget, Nice, Geneva) to luxury villas, 5-star palaces, and ski resorts.',
  p4_h1: 'Attentive, gentle protection for children and relatives',
  p4_h2: 'Escort for luxury shopping, private viewing rooms, and galas',
  p4_h3: '24/7 low-profile security watch throughout your stay',
  p5_title: 'High Jewelry, Fashion & Events Security',
  p5_desc: 'Secure transport and physical protection for high jewelry houses, Paris Fashion Week shows, exclusive auctions, and high-profile private receptions.',
  p5_h1: 'Armored transfers of high-value jewelry and fine art',
  p5_h2: 'VIP access control and discreet guest verification',
  p5_h3: 'Dedicated Fashion Week and international festival task force',
  p6_title: 'Vulnerability Audits & Crisis Management',
  p6_desc: 'Methodical route surveying, medical facility mapping, threat assessment, and business continuity planning for all travel itineraries.',
  p6_h1: 'Pre-mapped emergency medical evacuation routes',
  p6_h2: '24/7 crisis monitoring and real-time operational oversight',
  p6_h3: 'Dynamic rerouting based on traffic anomalies or security alerts',
  leader_box_title: 'Security Operations Directorate',
  leader_box_sub: 'CNAPS-Accredited Executive · Paris',
  leader_eyebrow: 'MANAGEMENT PLEDGE',
  leader_title: 'Elite Security with the Elegance of Discretion',
  leader_quote: 'True security is never ostentatious: it is defined by advance preparation, seamless situational control, and unfailing discretion.',
  leader_text: 'Holding official CNAPS director accreditation, our executive management personally oversees the design and execution of every detail. We assist you across all private security needs: risk assessment, convoy coordination, bilingual bodyguard assignments, and expert drivers trained for high-profile passengers.',
  cred1: 'CNAPS Director Accreditation',
  cred2: 'Strict Professional Secrecy',
  cred3: '24/7 Live Operations Desk',
  cred4: 'Prefectural Authorizations',
  fleet_eyebrow: 'SECURED FLEET',
  fleet_title: 'Vehicles Tailored for Protection & Convoys',
  fleet_desc: 'From executive flagships to heavy protective SUVs, our fleet meets the highest standards of safety, acoustic insulation, and palace comfort.',
  fleet_cat1: 'Secure Executive Sedans',
  fleet_desc1: 'Anti-intrusion acoustic double glazing, luxury lounge interior, supreme smoothness, and regal privacy.',
  fleet_cat2: 'Escort & Protection SUVs',
  fleet_desc2: 'Commanding road presence, all-wheel drive, protective volume, and elevated seating for security teams.',
  fleet_cat3: 'Secure Delegation Transport',
  fleet_desc3: 'Rolling tactical lounge accommodating 7 to 19 passengers with blackout blinds and confidential workspace.',
  spec_tinted: 'Tinted privacy glass',
  spec_wifi: 'Encrypted Wi-Fi',
  spec_quiet: 'Silent acoustic cabin',
  spec_allroad: 'All-Wheel Drive',
  spec_stature: 'Commanding stature',
  spec_power: 'High-response powertrain',
  spec_lounge: 'Confidential boardroom layout',
  spec_team: 'Full team & delegation',
  spec_privacy: 'Complete blackout blinds',
  protocol_eyebrow: 'OPERATIONAL PROTOCOL',
  protocol_title: '4-Step Secured Deployment',
  step1_title: 'Confidential Assessment & Briefing',
  step1_desc: 'Discrete collection of itinerary constraints, profile sensitivity, timing, and protocol nuances.',
  step2_title: 'Dispositive Architecture',
  step2_desc: 'Careful selection of security drivers, close protection officers (CPO), and tailored vehicle compositions.',
  step3_title: 'Advance Recon & Deployment',
  step3_desc: 'Point-of-arrival reconnaissance, encrypted communications setup with 24/7 dispatch, and punctual reception.',
  step4_title: 'Live Tracking & Debrief',
  step4_desc: 'Real-time satellite vehicle tracking, agile route adjustments, and direct executive availability throughout.',
  form_badge: 'BESPOKE SECURITY',
  form_title: 'Confidential Private Security Inquiry',
  form_sub: 'Our operations management reviews your requirements under strict confidentiality and responds within 15 minutes.',
  submitted_title: 'Your confidential request has been safely received',
  submitted_desc: 'Our CNAPS-accredited director will reach out to you discreetly within 15 minutes.',
  new_request: 'Submit another request',
  label_name: 'Full Name / Title *',
  label_phone: 'Secure Phone Number *',
  label_email: 'Official Email *',
  label_service: 'Requested Security Service *',
  label_duration: 'Dates / Expected Duration',
  label_notes: 'Details & Specific Requirements',
  opt_apr: 'Close Protection Officers / Bodyguards (CPO)',
  opt_driver: 'Security Chauffeur & Defensive Driving',
  opt_convoy: 'Secured Motorcade & Escort Vehicle',
  opt_family: 'Family & VIP Vacation Security',
  opt_event: 'Jewelry, Fashion & Event Protection',
  opt_audit: 'Route Assessment & Security Advisory',
  btn_submit: 'Transmit Confidential Request',
  btn_submitting: 'Transmitting securely...',
  form_notice: 'Guaranteed confidentiality · Protected under strict professional secrecy',
  faq_eyebrow: 'FREQUENTLY ASKED QUESTIONS',
  faq_title: 'Private Security & CNAPS Compliance',
  faq1_q: 'What is CNAPS accreditation and why is it mandatory?',
  faq1_a: 'CNAPS (National Council for Private Security Activities) is an administrative public body under the French Ministry of the Interior. Executive accreditation certifies the probity, background vetting, and professional skills required under Book VI of the French Internal Security Code. Only CNAPS-approved entities are legally authorized to organize and coordinate private security and close protection operations in France.',
  faq2_q: 'Can close protection officers operate in business suits or casual wear?',
  faq2_a: 'Yes, absolutely. Depending on your preferences and the context of your travel (gala dinners, family leisure, Paris Fashion Week, or executive summits), our agents blend in naturally: high-end dark suits, smart casual attire, or completely discreet covert protection.',
  faq3_q: 'Do you provide complete motorcades with lead reconnaissance and escort SUVs?',
  faq3_a: 'Yes. We routinely deploy complete motorcades comprising a lead reconnaissance vehicle, the principal VIP vehicle, and escort SUVs carrying close protection officers and secure luggage.',
  faq4_q: 'How is the confidentiality of our itineraries and identities protected?',
  faq4_a: 'Discretion is our absolute hallmark. All drivers, protection officers, and controllers are bound by strict non-disclosure agreements (NDAs) and statutory professional secrecy. No itinerary details, schedules, or passenger identities are ever disclosed.',
  faq5_q: 'How fast can an urgent security detail be mobilized?',
  faq5_a: 'With our 24/7 operations desk and direct executive involvement, emergency security details can be mobilized in under one hour across the Paris region and major airport hubs.',
  bar_title: 'Need an Immediate Security Detail?',
  bar_sub: '24/7 operational desk overseen directly by our CNAPS-accredited management.'
};

const translations = {
  fr: {
    nav: { security: 'Sécurité Privée' },
    services: {
      security_badge: 'DÉPARTEMENT SÉCURITÉ PRIVÉE • AGRÉMENT CNAPS',
      security_title: 'Protection Rapprochée & Chauffeurs de Sécurité',
      security_desc: 'Notre direction générale titulaire de l’agrément dirigeant CNAPS vous accompagne dans la sécurisation intégrale de vos déplacements : agents de protection rapprochée (APR), conduite défensive anti-agression, convois sécurisés et discrétion absolue.',
      security_legal: "Art. L612-14 CSI : L'autorisation d'exercice ne confère aucune prérogative de puissance publique à l'entreprise ou aux personnes qui en bénéficient.",
      security_cta: 'DÉCOUVRIR LE DÉPARTEMENT SÉCURITÉ'
    },
    footer: {
      cnaps_mention: 'Protection rapprochée & sécurité privée : Dirigeant agréé CNAPS (Conseil National des Activités Privées de Sécurité) conformément au Code de la sécurité intérieure.',
      cnaps_link: 'Consulter le département sécurité →'
    },
    security: frSecurity
  },
  en: {
    nav: { security: 'Private Security' },
    services: {
      security_badge: 'PRIVATE SECURITY DIVISION • CNAPS ACCREDITATION',
      security_title: 'Close Protection & Security Chauffeurs',
      security_desc: 'Led by an executive certified by CNAPS (French Ministry of the Interior), SELY accompanies you in securing all your journeys: close protection officers (CPO), defensive driving, armored convoys, and total discretion.',
      security_legal: 'Art. L612-14 CSI: Exercise authorization does not confer any public power prerogatives on the company or on the persons who benefit from it.',
      security_cta: 'EXPLORE SECURITY DIVISION'
    },
    footer: {
      cnaps_mention: 'Close protection & private security: CNAPS-certified Director in full compliance with the French Internal Security Code.',
      cnaps_link: 'Explore security department →'
    },
    security: enSecurity
  },
  es: {
    nav: { security: 'Seguridad Privada' },
    services: {
      security_badge: 'DIVISIÓN SEGURIDAD PRIVADA • ACREDITACIÓN CNAPS',
      security_title: 'Protección Cercana & Chóferes de Seguridad',
      security_desc: 'Bajo la dirección de un titular acreditado por el CNAPS (Ministerio del Interior francés), SELY le acompaña en la protección de sus desplazamientos: escoltas personales (APR), conducción defensiva, convoyes protegidos y confidencialidad absoluta.',
      security_legal: 'Art. L612-14 CSI: La autorización no confiere ninguna prerrogativa de poder público a la empresa ni a las personas que de ella se benefician.',
      security_cta: 'DESCUBRIR EL DEPARTAMENTO DE SEGURIDAD'
    },
    footer: {
      cnaps_mention: 'Protección cercana y seguridad privada: Director acreditado por el CNAPS en conformidad con la legislación francesa.',
      cnaps_link: 'Ver departamento de seguridad →'
    },
    security: {
      ...enSecurity,
      hero_badge: 'DIRECTOR ACREDITADO CNAPS · SEGURIDAD PRIVADA & PROTECCIÓN VIP',
      hero_title_pre: 'Seguridad Privada & Alta Protección ',
      hero_title_gold: 'Para Sus Desplazamientos Excepcionales',
      hero_subtitle: 'Bajo la dirección de un titular de la acreditación CNAPS (Ministerio del Interior francés), SELY Privé diseña dispositivos de seguridad a medida: escoltas (APR), chóferes de seguridad, convoyes protegidos y discreción absoluta para personalidades y familias.',
      cta_quote: 'Solicitar dispositivo de seguridad',
      cta_phone: 'Línea de Seguridad 24/7: +33 1 84 80 56 76',
      cta_wa: 'WhatsApp Seguridad',
      cnaps_card_title: 'Dirección Acreditada CNAPS · Ministerio del Interior',
      cnaps_card_desc: 'Nuestro director cuenta con la acreditación oficial del CNAPS, garantizando la honorabilidad estricta y el marco legal para todas nuestras operaciones de seguridad y protección.',
      cnaps_legal_label: 'Mención legal obligatoria (Art. L612-14 CSI):',
      cnaps_legal_text: 'La autorización de ejercicio no confiere ninguna prerrogativa de poder público a la empresa ni a las personas que de ella se benefician.',
      cnaps_pill: 'Acreditación Verificada',
      pillars_eyebrow: 'DISPOSITIVOS & OPERACIONES',
      pillars_title: 'Protección Integral y a Medida de Su Seguridad',
      p1_title: 'Chóferes de Seguridad & Conducción Defensiva',
      p2_title: 'Agentes de Protección Cercana (Escoltas APR)',
      p3_title: 'Convoyes Protegidos & Vehículos de Escolta',
      p4_title: 'Protección VIP, Familias & Estancias',
      p5_title: 'Seguridad para Alta Joyería, Moda & Eventos',
      p6_title: 'Auditoría de Vulnerabilidad & Gestión de Crisis',
      fleet_title: 'Vehículos Dedicados a la Protección & Convoyes',
      form_title: 'Solicitud Confidencial de Seguridad Privada',
      submitted_title: 'Su solicitud confidencial ha sido recibida',
      submitted_desc: 'Nuestra dirección acreditada por el CNAPS se pondrá en contacto con usted en un plazo inferior a 15 minutos.',
      btn_submit: 'Enviar mi solicitud confidencial',
      btn_submitting: 'Transmisión segura en curso...',
      form_notice: 'Confidencialidad absoluta garantizada · Secreto profesional estricto',
      bar_title: '¿Necesita un Dispositivo de Seguridad Inmediato?',
      bar_sub: 'Central operativa disponible 24 horas al día, 7 días a la semana.'
    }
  },
  ar: {
    nav: { security: 'الأمن الخاص' },
    services: {
      security_badge: 'قسم الأمن الخاص • اعتماد CNAPS الرسمي',
      security_title: 'الحماية الشخصية اللصيقة وسائقو الأمن',
      security_desc: 'تحت إشراف إدارة معتمدة من المجلس الوطني لأنشطة الأمن الخاص الفرنسي (CNAPS)، توفر سيلي تأميناً شاملاً لتنقلاتكم: حراس شخصيون، قيادة دفاعية، مواكب آمنة وسرية تامة.',
      security_legal: 'المادة L612-14 من قانون الأمن الداخلي الفرنسي: لا يمنح الترخيص أي امتيازات من السلطة العامة.',
      security_cta: 'اكتشف قسم الأمن والحماية'
    },
    footer: {
      cnaps_mention: 'حماية شخصية وأمن خاص: إدارة معتمدة من CNAPS وفقاً للقانون الفرنسي للأمن الداخلي.',
      cnaps_link: 'استكشف قسم الأمن الخاص ←'
    },
    security: {
      ...enSecurity,
      hero_badge: 'إدارة معتمدة من CNAPS · الأمن الخاص وحماية كبار الشخصيات',
      hero_title_pre: 'الأمن الخاص والحماية الفائقة ',
      hero_title_gold: 'لتنقلاتكم الاستثنائية بأعلى درجات الأمان',
      hero_subtitle: 'تحت إشراف إدارة حاصلة على ترخيص CNAPS الصادر عن وزارة الداخلية الفرنسية، تقدم سيلي بريفيه حلول حماية متكاملة: حراس شخصيون مدربون، سائقو أمن محترفون، مواكب مؤمنة وحماية سرية للشخصيات الهامة والعائلات.',
      cta_quote: 'طلب ترتيبات أمنية خاصة',
      cta_phone: 'خط الطوارئ والأمن 24/7: +33 1 84 80 56 76',
      cta_wa: 'واتساب الأمن الخاص',
      cnaps_card_title: 'إدارة مرخصة من CNAPS · وزارة الداخلية الفرنسية',
      cnaps_card_desc: 'مديرنا حاصل على الاعتماد الرسمي الصادر عن المجلس الوطني لأنشطة الأمن الخاص في فرنسا، مما يضمن أعلى معايير النزاهة والكفاءة والامتثال القانوني الكامل.',
      cnaps_legal_label: 'إشعار قانوني إلزامي (المادة L612-14):',
      cnaps_legal_text: 'لا يمنح ترخيص الممارسة أي سلطة أو صلاحية من صلاحيات القوة العامة للشركة أو الأشخاص المستفيدين منه.',
      cnaps_pill: 'ترخيص رسمي معتمد',
      pillars_eyebrow: 'القدرات والعمليات',
      pillars_title: 'حماية شاملة ومحكمة لسلامتكم',
      p1_title: 'سائقو الأمن والقيادة الدفاعية والوقائية',
      p2_title: 'حراس الحماية الشخصية اللصيقة (APR)',
      p3_title: 'مواكب أمنية وسيارات مرافقة مصفحة',
      p4_title: 'تأمين إقامات كبار الشخصيات والعائلات',
      p5_title: 'تأمين المجوهرات الراقية وعروض الأزياء والفعاليات',
      p6_title: 'تقييم المخاطر وإدارة الأزمات',
      fleet_title: 'أسطول مخصص للحماية والمواكب الرسمية',
      form_title: 'طلب أمني خاص بسرية تامة',
      submitted_title: 'تم استلام طلبكم السري بنجاح',
      submitted_desc: 'ستتواصل معكم إدارتنا المعتمدة من CNAPS بسرية تامة في غضون أقل من 15 دقيقة.',
      btn_submit: 'إرسال الطلب السري بأمان',
      btn_submitting: 'جارٍ الإرسال المشفر...',
      form_notice: 'سرية مطلقة مضمونة · بياناتكم خاضعة للسر المهني الكامل',
      bar_title: 'هل تحتاج إلى انتشار أمني فوري؟',
      bar_sub: 'غرفة العمليات المركزية متاحة على مدار الساعة 24/7.'
    }
  },
  zh: {
    nav: { security: '私人安保' },
    services: {
      security_badge: '私人安保部门 • 法国CNAPS官方认证',
      security_title: '要员贴身保镖与安全防卫司机',
      security_desc: '由法国国家私人安全活动委员会（CNAPS，内政部监管）认证主管领导，SELY为您提供全方位出行护航：贴身要员保护（APR）、防暴规避驾驶、防弹车队及高度保密保障。',
      security_legal: '法国安全法第L612-14条：营运许可不赋予企业或从业人员任何公权力特权。',
      security_cta: '探索私人安保部门'
    },
    footer: {
      cnaps_mention: '贴身护卫与私人安保：CNAPS认证主管，严格遵照法国国内安全法。',
      cnaps_link: '查阅安保部门详情 →'
    },
    security: {
      ...enSecurity,
      hero_badge: '法国内政部CNAPS认证主管 · 私人安保与要员贴身保护',
      hero_title_pre: '顶级私人安保与贵宾护卫 ',
      hero_title_gold: '为您的尊贵行程保驾护航',
      hero_subtitle: '在持有法国国家私人安全活动委员会（CNAPS）官方执照的管理层领导下，SELY Privé为您量身定制全套安全方案：专业贴身保镖（APR）、防卫驾驶司机、护送车队以及对名流、政要和家庭的绝对机密伴随。',
      cta_quote: '申请专属安全护卫方案',
      cta_phone: '24/7安全专线：+33 1 84 80 56 76',
      cta_wa: 'WhatsApp安全通道',
      cnaps_card_title: '法国CNAPS官方认证资质 · 内政部监督',
      cnaps_card_desc: '我们的主管持有CNAPS颁发的专业安全资质，严格遵守法国国内安全法典，确保所有保护行动合法合规、纪律严明。',
      cnaps_legal_label: '法定声明条款（法国内政安全法典第L612-14条）：',
      cnaps_legal_text: '安全业务经营许可不赋予企业或从业人员任何公权力特权。',
      cnaps_pill: '官方核验证质',
      pillars_eyebrow: '核心能力与执行方案',
      pillars_title: '全方位掌控您的出行安全',
      p1_title: '安全特卫司机与战术防卫驾驶',
      p2_title: '要员贴身保护特卫（CNAPS保镖）',
      p3_title: '护航车队与前后防卫车编组',
      p4_title: '贵宾家族及奢华度假全程守护',
      p5_title: '高级珠宝、时装周与高端盛会安保',
      p6_title: '路线风险评估与应急危机预案',
      fleet_title: '专用于高级护卫与车队行动的座驾',
      form_title: '机密安全服务咨询',
      submitted_title: '您的机密申请已成功送达',
      submitted_desc: '我们的CNAPS持牌安全主管将在15分钟内与您取得联系。',
      btn_submit: '安全递交机密需求',
      btn_submitting: '正在安全加密传输...',
      form_notice: '承诺绝对隐私与职业保密协议保障',
      bar_title: '需要即刻启动安全防护？',
      bar_sub: '指挥中心24小时/7天待命，随叫随到。'
    }
  },
  de: {
    nav: { security: 'Private Sicherheit' },
    services: {
      security_badge: 'ABTEILUNG PRIVATE SICHERHEIT • CNAPS-ZULASSUNG',
      security_title: 'Personenschutz & Sicherheits-Chauffeure',
      security_desc: 'Unter der Leitung eines vom CNAPS (französisches Innenministerium) akkreditierten Geschäftsführers bietet SELY höchsten Schutz für Ihre Fahrten: Bodyguards, defensive Fahrtechniken, Konvois und absolute Diskretion.',
      security_legal: 'Art. L612-14 CSI: Die Ausübungsbewilligung verleiht dem Unternehmen oder den Begünstigten keine hoheitlichen Befugnisse.',
      security_cta: 'SICHERHEITSABTEILUNG ENTDECKEN'
    },
    footer: {
      cnaps_mention: 'Personenschutz & private Sicherheit: CNAPS-zertifizierter Direktor gemäß französischem Gesetz über innere Sicherheit.',
      cnaps_link: 'Zur Sicherheitsabteilung →'
    },
    security: {
      ...enSecurity,
      hero_badge: 'CNAPS-ZERTIFIZIERTER DIREKTOR · PRIVATE SICHERHEIT & VIP-SCHUTZ',
      hero_title_pre: 'Private Sicherheit & Personenschutz ',
      hero_title_gold: 'Für Ihre Exklusiven Reisen',
      hero_subtitle: 'Unter der Leitung eines CNAPS-akkreditierten Geschäftsführers orchestriert SELY Privé maßgeschneiderte Sicherheitskonzepte: Personenschützer (APR), defensiv geschulte Fahrer, Begleitkonvois und diskrete Betreuung für Persönlichkeiten und Delegationen.',
      cta_quote: 'Sicherheitsdispositiv anfordern',
      cta_phone: '24/7 Sicherheits-Hotline: +33 1 84 80 56 76',
      cta_wa: 'WhatsApp Sicherheit',
      cnaps_card_title: 'CNAPS-Akkreditierte Direktion · Französisches Innenministerium',
      cnaps_card_desc: 'Unsere Leitung verfügt über die offizielle CNAPS-Zulassung des französischen Staates, welche höchste Rechtskonformität, Integrität und professionelle Fachkompetenz gewährleistet.',
      cnaps_legal_label: 'Gesetzlich vorgeschriebener Hinweis (Art. L612-14 CSI):',
      cnaps_legal_text: 'Die Ausübungsbewilligung verleiht dem Unternehmen oder den Begünstigten keine hoheitlichen Befugnisse.',
      cnaps_pill: 'Geprüfte Zulassung',
      pillars_eyebrow: 'EINSATZ & KOMPETENZEN',
      pillars_title: 'Ganzheitliche Sicherheit für Ihre Einsätze',
      p1_title: 'Sicherheits-Chauffeure & Defensive Fahrpraxis',
      p2_title: 'Personenschützer & Bodyguards (APR)',
      p3_title: 'Begleitete Konvois & Eskortenfahrzeuge',
      p4_title: 'VIP- & Familienbetreuung auf Reisen',
      p5_title: 'Sicherheit für Haute Joaillerie & Fashion Week',
      p6_title: 'Routen-Audits & Krisenmanagement',
      fleet_title: 'Sicherheitsflotte für Schutz & Konvois',
      form_title: 'Vertrauliche Sicherheitsanfrage',
      submitted_title: 'Ihre vertrauliche Anfrage wurde übermittelt',
      submitted_desc: 'Unsere CNAPS-akkreditierte Direktion kontaktiert Sie diskret innerhalb von 15 Minuten.',
      btn_submit: 'Vertrauliche Anfrage absenden',
      btn_submitting: 'Sichere Übertragung...',
      form_notice: 'Garantierte Vertraulichkeit · Unter striktem Berufsgeheimnis',
      bar_title: 'Dringender Bedarf an Sicherheitskräften?',
      bar_sub: 'Einsatzzentrale 24 Stunden an 7 Tagen erreichbar.'
    }
  },
  it: {
    nav: { security: 'Sicurezza Privata' },
    services: {
      security_badge: 'REPARTO SICUREZZA PRIVATA • ACCREDITAMENTO CNAPS',
      security_title: 'Protezione Ravvicinata & Autisti di Sicurezza',
      security_desc: "Sotto la direzione di un responsabile accreditato CNAPS (Ministero dell'Interno francese), SELY garantisce la massima sicurezza per i vostri spostamenti: guardie del corpo, guida difensiva, convogli protetti e riservatezza assoluta.",
      security_legal: "Art. L612-14 CSI: L'autorizzazione non conferisce alcuna prerogativa di potere pubblico all'azienda o a chi ne beneficia.",
      security_cta: 'SCOPRI IL REPARTO SICUREZZA'
    },
    footer: {
      cnaps_mention: 'Protezione ravvicinata e sicurezza privata: Direttore accreditato CNAPS in conformità con la legge francese.',
      cnaps_link: 'Consulta il reparto sicurezza →'
    },
    security: {
      ...enSecurity,
      hero_badge: 'DIRETTORE ACCREDITATO CNAPS · SICUREZZA PRIVATA & PROTEZIONE VIP',
      hero_title_pre: 'Sicurezza Privata & Alta Protezione ',
      hero_title_gold: 'Per i Vostri Spostamenti di Prestigio',
      hero_subtitle: "Con la guida di un dirigente titolare dell'accreditamento CNAPS, SELY Privé organizza dispositivi di sicurezza su misura: guardie del corpo (APR), autisti formati alla guida difensiva, convogli protetti e totale discrezione.",
      cta_quote: 'Richiedi un dispositivo di sicurezza',
      cta_phone: 'Linea Sicurezza 24/7: +33 1 84 80 56 76',
      cta_wa: 'WhatsApp Sicurezza',
      cnaps_card_title: 'Direzione Accreditata CNAPS · Ministero dell’Interno',
      cnaps_card_desc: "La nostra direzione detiene l'abilitazione ufficiale CNAPS, garanzia di rigorosa moralità, competenza operativa e conformità giuridica per tutti i servizi di protezione.",
      cnaps_legal_label: 'Nota legale obbligatoria (Art. L612-14 CSI):',
      cnaps_legal_text: "L'autorizzazione di esercizio non conferisce alcuna prerogativa di potere pubblico all'impresa né alle persone che ne beneficiano.",
      cnaps_pill: 'Accreditamento Verificato',
      pillars_eyebrow: 'DISPOSITIVI & COMPETENZE',
      pillars_title: 'Gestione Globale della Vostra Sicurezza',
      p1_title: 'Autisti di Sicurezza & Guida Difensiva',
      p2_title: 'Agenti di Protezione Ravvicinata (APR)',
      p3_title: 'Convogli Protetti & Veicoli di Scorta',
      p4_title: 'Accompagnamento VIP, Famiglie & Soggiorni',
      p5_title: 'Sicurezza per Eventi, Alta Gioielleria & Moda',
      p6_title: 'Audit di Vulnerabilità & Gestione Crisi',
      fleet_title: 'Flotta Dedicata alla Protezione & ai Convogli',
      form_title: 'Richiesta Riservata di Sicurezza Privata',
      submitted_title: 'La vostra richiesta è stata inoltrata con successo',
      submitted_desc: 'La nostra direzione accreditata CNAPS vi contatterà in totale riservatezza entro 15 minuti.',
      btn_submit: 'Invia la mia richiesta riservata',
      btn_submitting: 'Trasmissione protetta...',
      form_notice: 'Riservatezza assoluta garantita · Dati protetti da segreto professionale',
      bar_title: 'Necessità Immediata di Protezione?',
      bar_sub: 'Centrale operativa attiva 24 ore su 24, 7 giorni su 7.'
    }
  },
  pt: {
    nav: { security: 'Segurança Privada' },
    services: {
      security_badge: 'DEPARTAMENTO DE SEGURANÇA PRIVADA • CNAPS',
      security_title: 'Proteção Pessoal & Motoristas de Segurança',
      security_desc: 'Sob a direção de um responsável certificado pelo CNAPS (Ministério do Interior francês), a SELY assegura as suas viagens com guarda-costas (APR), condução evasiva, comboios protegidos e discrição absoluta.',
      security_legal: 'Art. L612-14 CSI: A autorização não confere qualquer prerrogativa de autoridade pública.',
      security_cta: 'CONHECER DEPARTAMENTO DE SEGURANÇA'
    },
    footer: {
      cnaps_mention: 'Proteção pessoal e segurança privada: Diretor certificado pelo CNAPS de acordo com o Código de Segurança Interna.',
      cnaps_link: 'Consultar departamento de segurança →'
    },
    security: {
      ...enSecurity,
      hero_badge: 'DIRETOR CERTIFICADO CNAPS · SEGURANÇA PRIVADA & PROTEÇÃO VIP',
      hero_title_pre: 'Segurança Privada & Alta Proteção ',
      hero_title_gold: 'Para as Suas Viagens Exclusivas',
      hero_subtitle: 'Sob a liderança de um diretor certificado pelo CNAPS, a SELY Privé disponibiliza dispositivos de proteção personalizados: agentes de proteção pessoal (APR), motoristas de segurança, comboios blindados e total discrição.',
      cta_quote: 'Solicitar dispositivo de segurança',
      cta_phone: 'Linha de Segurança 24/7: +33 1 84 80 56 76',
      cta_wa: 'WhatsApp Segurança',
      cnaps_card_title: 'Direção Credenciada CNAPS · Ministério do Interior',
      cnaps_card_desc: 'O nosso diretor é titular da acreditação oficial do CNAPS, assegurando rigor moral, competências de elite e conformidade legal rigorosa em todas as operações de segurança.',
      cnaps_legal_label: 'Aviso legal obrigatório (Art. L612-14 CSI):',
      cnaps_legal_text: 'A autorização de exercício não confere qualquer prerrogativa de autoridade pública à empresa nem aos seus beneficiários.',
      cnaps_pill: 'Acreditação Verificada',
      pillars_eyebrow: 'DISPOSITIVOS & OPERAÇÕES',
      pillars_title: 'Proteção Integral para a Sua Tranquilidade',
      p1_title: 'Motoristas de Segurança & Condução Defensiva',
      p2_title: 'Agentes de Proteção Pessoal (Guarda-Costas APR)',
      p3_title: 'Comboios Protegidos & Viaturas de Escolta',
      p4_title: 'Acompanhamento VIP, Famílias & Férias',
      p5_title: 'Segurança de Alta Joalharia, Moda & Eventos',
      p6_title: 'Auditoria de Vulnerabilidade & Gestão de Crise',
      fleet_title: 'Frota Vocacionada para Proteção & Escoltas',
      form_title: 'Pedido Confidencial de Segurança Privada',
      submitted_title: 'O seu pedido confidencial foi transmitido com sucesso',
      submitted_desc: 'A nossa direção certificada entrará em contacto consigo com discrição em menos de 15 minutos.',
      btn_submit: 'Enviar pedido confidencial',
      btn_submitting: 'A enviar com segurança...',
      form_notice: 'Confidencialidade estrita garantida · Segredo profissional absoluto',
      bar_title: 'Necessidade Urgente de Segurança?',
      bar_sub: 'Central de operações ativa 24 horas por dia, 7 dias por semana.'
    }
  },
  ru: {
    nav: { security: 'Частная безопасность' },
    services: {
      security_badge: 'ОТДЕЛ ЧАСТНОЙ БЕЗОПАСНОСТИ • АККРЕДИТАЦИЯ CNAPS',
      security_title: 'Личная охрана и водители безопасности',
      security_desc: 'Под руководством директора, аккредитованного французским государственным органом CNAPS (МВД Франции), SELY обеспечивает полную безопасность поездок: телохранители, защитное вождение, бронированные кортежи и строжайшая конфиденциальность.',
      security_legal: 'Ст. L612-14 CSI: Разрешение на деятельность не наделяет полномочиями государственной власти предприятие или лиц, пользующихся им.',
      security_cta: 'УЗНАТЬ ОБ ОТДЕЛЕ БЕЗОПАСНОСТИ'
    },
    footer: {
      cnaps_mention: 'Личная охрана и частная безопасность: директор аккредитован CNAPS в соответствии с законодательством Франции.',
      cnaps_link: 'Перейти в отдел безопасности →'
    },
    security: {
      ...enSecurity,
      hero_badge: 'АККРЕДИТАЦИЯ CNAPS (МВД ФРАНЦИИ) · ЛИЧНАЯ ОХРАНА И VIP-БЕЗОПАСНОСТЬ',
      hero_title_pre: 'Частная безопасность и высшая защита ',
      hero_title_gold: 'Для Ваших исключительных поездок',
      hero_subtitle: 'Под руководством директора, аккредитованного государственным органом CNAPS, SELY Privé организует эксклюзивные комплексы безопасности: сотрудники личной охраны (APR), водители защитного вождения, бронированные кортежи и полная конфиденциальность.',
      cta_quote: 'Запросить комплекс безопасности',
      cta_phone: 'Линия безопасности 24/7: +33 1 84 80 56 76',
      cta_wa: 'WhatsApp Безопасность',
      cnaps_card_title: 'Руководство с аккредитацией CNAPS · МВД Франции',
      cnaps_card_desc: 'Наш руководитель обладает государственной лицензией CNAPS, что гарантирует безупречную репутацию, высокий профессионализм и юридическую чистоту всех охранных услуг.',
      cnaps_legal_label: 'Обязательное правовое уведомление (Ст. L612-14 CSI):',
      cnaps_legal_text: 'Разрешение на деятельность не наделяет полномочиями государственной власти предприятие или лиц, пользующихся им.',
      cnaps_pill: 'Лицензия проверена',
      pillars_eyebrow: 'КОМПЛЕКС УСЛУГ И КОМПЕТЕНЦИИ',
      pillars_title: 'Полный контроль Вашей персональной безопасности',
      p1_title: 'Водители безопасности и защитное вождение',
      p2_title: 'Сотрудники личной охраны (Телохранители APR)',
      p3_title: 'Охраняемые кортежи и автомобили сопровождения',
      p4_title: 'Сопровождение VIP, семей и отдыха',
      p5_title: 'Охрана ювелирных изделий, показов мод и событий',
      p6_title: 'Аудит маршрутов и управление кризисными ситуациями',
      fleet_title: 'Автопарк для охраны и кортежей',
      form_title: 'Конфиденциальный запрос на услуги безопасности',
      submitted_title: 'Ваш конфиденциальный запрос успешно отправлен',
      submitted_desc: 'Наше руководство с лицензией CNAPS свяжется с Вами с соблюдением строгой конфиденциальности в течение 15 минут.',
      btn_submit: 'Отправить конфиденциальный запрос',
      btn_submitting: 'Безопасная передача данных...',
      form_notice: 'Полная конфиденциальность гарантирована · Защищено профессиональной тайной',
      bar_title: 'Срочно требуется обеспечение безопасности?',
      bar_sub: 'Оперативный диспетчерский пункт доступен круглосуточно 24/7.'
    }
  },
  ja: {
    nav: { security: '民間警備' },
    services: {
      security_badge: '民間警備部門 • フランスCNAPS公認',
      security_title: '要人警護（身辺警護）＆ セキュリティ専属ドライバー',
      security_desc: 'フランス内務省直轄のCNAPS公認役員のもと、SELYは高度な身辺警護、防犯・緊急回避運転、護衛車列、徹底した機密保持体制で安全な移動を提供します。',
      security_legal: 'フランス内務治安法 第L612-14条：営業認可は公権力の特権を付与するものではありません。',
      security_cta: 'セキュリティ部門を見る'
    },
    footer: {
      cnaps_mention: '要人身辺警護・民間セキュリティ：フランス内務治安法に準拠したCNAPS認定責任者。',
      cnaps_link: 'セキュリティ部門のご案内 →'
    },
    security: {
      ...enSecurity,
      hero_badge: 'フランスCNAPS公認役員 · 民間セキュリティ＆VIP身辺警護',
      hero_title_pre: '最高峰の民間セキュリティと身辺警護 ',
      hero_title_gold: '安心と格式を極めた特別な移動空間',
      hero_subtitle: 'フランス内務省直轄CNAPSの公認資格を持つ役員が指揮を執り、SELY Privéは要人身辺警護（APR）、防衛運転技術を修めたセキュリティドライバー、護衛車列、そして極めて厳格な機密保持体制を構築します。',
      cta_quote: 'セキュリティ体制のご相談・お見積り',
      cta_phone: '24時間セキュリティ専用回線: +33 1 84 80 56 76',
      cta_wa: 'WhatsAppセキュリティ直通',
      cnaps_card_title: 'CNAPS公認統括ディレクター · フランス内務省認可',
      cnaps_card_desc: '当社の責任者はフランス内務省が監督するCNAPS（国家民間警備活動評議会）の公認免許を保持し、法規に完全準拠した信頼性の高い警護サービスを提供します。',
      cnaps_legal_label: '法定必須告知（フランス内務治安法 第L612-14条）:',
      cnaps_legal_text: '営業認可は、企業または受益者に対していかなる公権力の特権を付与するものではありません。',
      cnaps_pill: '公認資格確認済',
      pillars_eyebrow: '警護体制と専門技能',
      pillars_title: 'お客様の安全を包括的に掌握・護衛',
      p1_title: 'セキュリティドライバー＆防衛・緊急回避運転',
      p2_title: '要人身辺警護員（CNAPS認定ボディガード）',
      p3_title: '護衛車列・エスコート車両編成',
      p4_title: 'VIP・ご家族旅行・滞在の安全確保',
      p5_title: 'ハイジュエリー・ファッションウィーク・イベント警備',
      p6_title: 'ルートリスク監査＆危機管理体制',
      fleet_title: '警護・車列専用の高水準フリート',
      form_title: '機密保持セキュリティ事前相談',
      submitted_title: '機密相談リクエストが安全に送信されました',
      submitted_desc: 'CNAPS公認ディレクターが15分以内に極秘厳守にて直接ご連絡差し上げます。',
      btn_submit: '機密相談を送信する',
      btn_submitting: '暗号化通信で送信中...',
      form_notice: '守秘義務によりすべての個人情報・旅程は完全に保護されます',
      bar_title: '緊急の警護体制が必要ですか？',
      bar_sub: '24時間365日、専任オペレーションデスクが迅速に対応します。'
    }
  }
};

let updatedCount = 0;

for (const lang of Object.keys(translations)) {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    continue;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`JSON parse error in ${lang}.json`, e);
    continue;
  }

  const langUpdates = translations[lang];

  // 1. Update nav
  if (!data.nav) data.nav = {};
  if (langUpdates.nav) {
    Object.assign(data.nav, langUpdates.nav);
  }

  // 2. Update services
  if (!data.services) data.services = {};
  if (langUpdates.services) {
    Object.assign(data.services, langUpdates.services);
  }

  // 3. Update footer
  if (!data.footer) data.footer = {};
  if (langUpdates.footer) {
    Object.assign(data.footer, langUpdates.footer);
  }

  // 4. Update security
  data.security = langUpdates.security;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`Updated ${lang}.json successfully with security translations.`);
  updatedCount++;
}

console.log(`Finished updating ${updatedCount} locales.`);
