import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCity } from '../hooks/useCity';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerspectiveTilt } from '../hooks/usePerspectiveTilt';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Briefcase,
  Shield,
  Wifi,
  ArrowRight,
  Play,
  Pause,
  Compass,
  Eye,
  Sparkles
} from 'lucide-react';
import styles from './Vehicle.module.css';

const FLEET_VEHICLES = [
  {
    id: 'classe-v',
    key: 'v1',
    category: 'VAN BUSINESS PALACE',
    categoryEn: 'PALACE BUSINESS VAN',
    name: 'Mercedes Classe V Business',
    watermark: 'CLASSE V',
    subtitle: 'L\'excellence pour les groupes d\'affaires, délégations et transferts aéroports',
    subtitleEn: 'The executive benchmark for delegations & airport transfers',
    image: '/vclass-paris-luxury.jpg',
    rearImage: '/vclass-rear-luxury.jpg',
    interiorImage: '/vclass_interior_vip_lounge.jpg',
    passengers: '7',
    luggage: '7',
    badge: 'LE PLUS DEMANDÉ',
    badgeEn: 'MOST REQUESTED',
    highlights: ['Salon VIP face-à-face grand confort', 'Cuir Nappa étendu & Climatisation quadri-zone', 'Wifi haut débit & Rafraîchissements de courtoisie'],
    highlightsEn: ['Face-to-face VIP Lounge configuration', 'Nappa leather & 4-zone climate control', 'High-speed Wi-Fi & Chilled beverages'],
    group: 'vans'
  },
  {
    id: 'peugeot-traveller',
    key: 'v15',
    category: 'VAN CONFORT 6 PLACES',
    categoryEn: 'COMFORT VAN 6 SEATS',
    name: 'Peugeot Traveller',
    watermark: 'TRAVELLER',
    subtitle: 'Confort spacieux et fonctionnel 6 places pour groupes, familles et délégations',
    subtitleEn: 'Spacious and functional 6-seat comfort for groups, families and delegations',
    image: '/peugeot-traveller-front-paris.jpg',
    rearImage: '/peugeot-traveller-rear-paris.jpg',
    passengers: '6',
    luggage: '6',
    badge: 'NOUVEAU FLEET',
    badgeEn: 'NEW FLEET',
    highlights: ['Configuration 6 places spacieuse et modulable', 'Climatisation multi-zone & Vitres surteintées', 'Sièges individuels confortables & Grand volume bagages'],
    highlightsEn: ['Spacious modular 6-seat configuration', 'Multi-zone climate control & Privacy glass', 'Comfortable individual seating & Large luggage space'],
    group: 'vans'
  },
  {
    id: 'classe-s',
    key: 'v3',
    category: 'BERLINE DE PRESTIGE',
    categoryEn: 'PRESTIGE FLAGSHIP SALOON',
    name: 'Mercedes Classe S',
    watermark: 'CLASSE S',
    subtitle: 'La référence mondiale du voyage en première classe diplomatique',
    subtitleEn: 'The global benchmark for first-class diplomatic chauffeur travel',
    image: '/sclass_paris_hero.jpg',
    rearImage: '/sclass-main-new.jpg',
    interiorImage: '/sclass-interior-white.jpg',
    passengers: '3',
    luggage: '3',
    badge: 'FLEURON BUSINESS',
    badgeEn: 'BUSINESS FLAGSHIP',
    highlights: ['Suspension pneumatique AIRMATIC active', 'Insonorisation acoustique totale feutrée', 'Suite arrière First Class 2026 en cuir blanc'],
    highlightsEn: ['Active AIRMATIC air suspension', 'Total acoustic sound isolation', 'First Class 2026 rear suite in white Nappa'],
    group: 'berlines'
  },
  {
    id: 'classe-e',
    key: 'v7',
    category: 'BERLINE EXECUTIVE',
    categoryEn: 'EXECUTIVE SALOON',
    name: 'Mercedes Classe E',
    watermark: 'CLASSE E',
    subtitle: 'Élégance sobre et efficience pour vos déplacements d\'affaires parisiens',
    subtitleEn: 'Discreet elegance and efficiency for Parisian corporate travel',
    image: '/eclass-paris-luxury.jpg',
    rearImage: '/eclass-rear-paris-eiffel.jpg',
    interiorImage: '/eclass-interior-paris-eiffel.jpg',
    passengers: '3',
    luggage: '2',
    badge: 'CORPORATE VIP',
    badgeEn: 'CORPORATE VIP',
    highlights: ['Cockpit MBUX Superscreen 2026', 'Confort feutré & Finitions cuir perforé', 'Maniabilité urbaine d\'exception'],
    highlightsEn: ['2026 MBUX Superscreen cockpit', 'Refined perforated leather appointments', 'Effortless city manoeuvrability'],
    group: 'berlines'
  },
  {
    id: 'maybach',
    key: 'v8',
    category: 'HAUTE AUTOMOBILE',
    categoryEn: 'ULTRA-LUXURY FLAGSHIP',
    name: 'Mercedes-Maybach',
    watermark: 'MAYBACH',
    subtitle: 'Le summum absolu du luxe et du raffinement automobile mondial',
    subtitleEn: 'The absolute pinnacle of automotive prestige and refinement',
    image: '/maybach-paris-luxury.jpg',
    rearImage: '/maybach-rear-luxury.jpg',
    interiorImage: '/maybach-interior-first-class.jpg',
    passengers: '2',
    luggage: '3',
    badge: 'ULTRA-EXCLUSIVE',
    badgeEn: 'ULTRA-EXCLUSIVE',
    highlights: ['Sièges Executive inclinables à 43.5° avec repose-jambes', 'Système audio 4D Burmester High-End', 'Flûtes de champagne argentées & cave réfrigérée'],
    highlightsEn: ['Executive seats reclining up to 43.5° with leg-rest', 'Burmester 4D High-End acoustic suite', 'Silver-plated champagne flutes & refrigerated compartment'],
    group: 'prestige'
  },
  {
    id: 'rolls-phantom',
    key: 'v9',
    category: 'ARISTOCRATIE BRITANNIQUE',
    categoryEn: 'BRITISH ARISTOCRACY',
    name: 'Rolls-Royce Phantom',
    watermark: 'PHANTOM',
    subtitle: 'L\'incarnation légendaire du luxe aristocratique mondial',
    subtitleEn: 'The timeless icon of world aristocracy and sovereign luxury',
    image: '/rolls-phantom-main.jpg',
    rearImage: '/rolls-phantom-rear.jpg',
    interiorImage: '/rolls-phantom-interior.jpg',
    passengers: '3',
    luggage: '3',
    badge: 'PRESTIGE MAJEUR',
    badgeEn: 'SUMMIT OF LUXURY',
    highlights: ['Portes antagonistes motorisées à fermeture douce', 'Plafond étoilé Starlight Headliner constellations', 'Tapis en laine d\'agneau d\'épaisseur royale'],
    highlightsEn: ['Coach-style power closing doors', 'Starlight Headliner constellation ceiling', 'Thick deep-pile lambswool carpets'],
    group: 'prestige'
  },
  {
    id: 'rolls-cullinan',
    key: 'v10',
    category: 'SUV HAUTE COUTURE',
    categoryEn: 'HAUTE COUTURE SUV',
    name: 'Rolls-Royce Cullinan',
    watermark: 'CULLINAN',
    subtitle: 'Le SUV le plus luxueux et imposant jamais conçu sur terre',
    subtitleEn: 'The most opulent and majestic luxury SUV ever conceived',
    image: '/rolls-cullinan-main.jpg',
    rearImage: '/rolls-cullinan-rear.jpg',
    interiorImage: '/rolls-cullinan-interior.jpg',
    passengers: '3',
    luggage: '4',
    badge: 'PALACE TOUT-TERRAIN',
    badgeEn: 'ROLLING PALACE',
    highlights: ['Architecture tout-aluminium Architecture of Luxury', 'Double vitrage acoustique et thermique de 6mm', 'Position surélevée dominante feutrée'],
    highlightsEn: ['All-aluminium Architecture of Luxury', '6mm acoustic & thermal dual glazing', 'Commanding elevated seating posture'],
    group: 'prestige'
  },
  {
    id: 'range-rover',
    key: 'v12',
    category: 'SUV AUTOBIOGRAPHY',
    categoryEn: 'AUTOBIOGRAPHY LUXURY SUV',
    name: 'Range Rover Autobiography',
    watermark: 'RANGE ROVER',
    subtitle: 'Le raffinement britannique d\'exception en version sur-mesure',
    subtitleEn: 'Peerless British refinement and bespoke craftsmanship',
    image: '/range-rover-main.jpg',
    rearImage: '/range-rover-rear.jpg',
    interiorImage: '/range-rover-interior.jpg',
    passengers: '3',
    luggage: '4',
    badge: 'SÉRÉNITÉ ROYALE',
    badgeEn: 'ROYAL SERENITY',
    highlights: ['Sièges massants 24 directions chauffants et ventilés', 'Filtration d\'air active nano-e à ionisation', 'Conduite feutrée sans aucune vibration'],
    highlightsEn: ['24-way heated, cooled & hot-stone massage seats', 'Nanoe active cabin air purification', 'Whisper-quiet vibration-free ride'],
    group: 'suv'
  },
  {
    id: 'classe-g',
    key: 'v11',
    category: 'ICÔNE INTEMPORELLE',
    categoryEn: 'TIMELESS ICON',
    name: 'Mercedes Classe G',
    watermark: 'CLASSE G',
    subtitle: 'L\'icône tout-terrain mythique au charisme et à la prestance inégalés',
    subtitleEn: 'The legendary off-roader with unmatched charisma and presence',
    image: '/g-class-main.jpg',
    rearImage: '/g-class-rear.jpg',
    interiorImage: '/g-class-interior.jpg',
    passengers: '3',
    luggage: '3',
    badge: 'CHARISME MYTHIQUE',
    badgeEn: 'MYTHIC CHARISMA',
    highlights: ['Silhouette géométrique emblématique', 'Sellerie Designo cuir étendu surpiqué', 'Prestance inimitable au cœur de Paris'],
    highlightsEn: ['Timeless iconic silhouette', 'Designo extended topstitched leather', 'Unmistakable presence across Paris'],
    group: 'suv'
  },
  {
    id: 'brabus-g',
    key: 'v13',
    category: 'SUPER-SUV 800 CH',
    categoryEn: 'SUPER-SUV 800 HP',
    name: 'G-Class Brabus 800',
    watermark: 'BRABUS 800',
    subtitle: 'Déclinaison super-sportive et ultra-exclusive par Brabus',
    subtitleEn: 'Ultra-exclusive high-performance custom by Brabus',
    image: '/brabus-g-class-main.jpg',
    rearImage: '/brabus-g-class-rear.jpg',
    interiorImage: '/g-class-interior.jpg',
    passengers: '3',
    luggage: '3',
    badge: 'HYPER-EXCLUSIF',
    badgeEn: 'HYPER-EXCLUSIVE',
    highlights: ['Préparation moteur 800 chevaux & Carbone forgé', 'Échappement sport à valves actives latérales', 'Intérieur sur-mesure Brabus Masterpiece'],
    highlightsEn: ['800-HP tuning & forged carbon aerodynamic kit', 'Active side-valve sports exhaust', 'Bespoke Brabus Masterpiece cabin'],
    group: 'suv'
  },
  {
    id: 'cadillac-escalade',
    key: 'v14',
    category: 'GRAND SUV AMÉRICAIN',
    categoryEn: 'FLAGSHIP AMERICAN SUV',
    name: 'Cadillac Escalade ESV',
    watermark: 'ESCALADE',
    subtitle: 'Salon VIP grand gabarit au confort américain grandiose',
    subtitleEn: 'Commanding VIP proportions with spacious American luxury',
    image: '/cadillac-escalade-main.jpg',
    rearImage: '/cadillac-escalade-rear.jpg',
    interiorImage: '/cadillac-escalade-interior.jpg',
    passengers: '6',
    luggage: '6',
    badge: 'FORMAT LONG ESV',
    badgeEn: 'EXTENDED ESV',
    highlights: ['Écran incurvé OLED 38 pouces haute définition', 'Système audio AKG Studio Reference 36 haut-parleurs', 'Capacité bagages immense pour délégations'],
    highlightsEn: ['38-inch curved OLED high-resolution display', 'AKG Studio Reference 36-speaker sound system', 'Vast luggage volume for diplomatic delegations'],
    group: 'suv'
  },
  {
    id: 'tesla-y',
    key: 'v0',
    category: 'ÉCO-PRESTIGE ÉLECTRIQUE',
    categoryEn: 'PREMIUM ELECTRIC',
    name: 'Tesla Model Y',
    watermark: 'MODEL Y',
    subtitle: 'Mobilité 100% électrique, silence parfait et toit panoramique',
    subtitleEn: 'Pure zero-emission mobility with serene glass panoramic roof',
    image: '/tesla-y-paris-luxury.jpg',
    rearImage: '/teslay-rear-paris-eiffel.jpg',
    interiorImage: '/teslay-interior-paris-eiffel.jpg',
    passengers: '4',
    luggage: '3',
    badge: '100% ÉLECTRIQUE',
    badgeEn: '100% ELECTRIC',
    highlights: ['Toit panoramique en verre thermique intégral', 'Silence de roulement acoustique absolu', 'Zéro émission & Accès prioritaire toutes zones'],
    highlightsEn: ['Full-length thermal glass panoramic roof', 'Whisper-silent electric drivetrain', 'Zero emissions & total urban priority access'],
    group: 'berlines'
  },
  {
    id: 'sprinter-12',
    key: 'v6',
    isMinibus: true,
    category: 'MINIBUS & SALON PRIVÉ',
    categoryEn: 'MINIBUS & VIP SALOON',
    name: 'Mercedes Sprinter VIP',
    watermark: 'SPRINTER',
    subtitle: 'Le jet privé sur roues configurable en 7, 14 ou 19 passagers (VIP ou Standard)',
    subtitleEn: 'Private jet on wheels configured for 7, 14, or 19 guests (VIP or Standard)',
    image: '/sprinter-12-ext.png',
    rearImage: '/sprinter-12-ext.png',
    interiorImage: '/minibus-14-vip-interior.jpg',
    passengers: '7 - 19',
    luggage: '10 - 19',
    badge: 'SALON CONFIGURABLE',
    badgeEn: 'CONFIGURABLE SALOON',
    highlights: ['Configuration sur-mesure 7, 14 ou 19 places', 'Choix Finition VIP (Ciel étoilé & Tables) ou Standard', 'Service palace avec chauffeur de direction dédié'],
    highlightsEn: ['Bespoke 7, 14, or 19 seat configurations', 'Choice of VIP (Starlight & Tables) or Standard finish', 'Palace service with dedicated executive chauffeur'],
    group: 'minibus'
  }
];

export const MINIBUS_CONFIGS = {
  '7-vip': {
    id: 'sprinter-7-vip',
    key: '7-vip',
    name: 'Mercedes Sprinter VIP (7 Places)',
    nameEn: 'Mercedes Sprinter VIP (7 Seats)',
    category: 'SALON PRIVÉ LUXE SUPRÊME',
    categoryEn: 'ULTRA-VIP PRIVATE SALOON',
    subtitle: 'Salon First Class mobile avec fauteuils white nappa, ciel étoilé étincelant et grand écran cinéma 4K',
    subtitleEn: 'First Class mobile cabin with white nappa recliners, sparkling starlight ceiling & 4K cinema display',
    image: '/sprinter-7-ext.png',
    rearImage: '/sprinter-7-ext.png',
    interiorImage: '/minibus-7-vip-interior.jpg',
    passengers: '7',
    luggage: '10',
    badge: '7 PLACES · SALON VIP',
    badgeEn: '7 SEATS · VIP SALOON',
    highlights: ['Fauteuils First Class en cuir blanc nappa brodé', 'Ciel étoilé en fibres optiques & Écran cinéma connecté', 'Insonorisation acoustique totale feutrée & Bar privé'],
    highlightsEn: ['First Class recliners in embroidered white nappa leather', 'Fiber optic starlight ceiling & connected cinema display', 'Whisper-quiet acoustic soundproofing & private bar'],
  },
  '14-vip': {
    id: 'sprinter-14-vip',
    key: '14-vip',
    name: 'Mercedes Sprinter VIP (14 Places)',
    nameEn: 'Mercedes Sprinter VIP (14 Seats)',
    category: 'SALON D\'AFFAIRES & PROTOCOLE',
    categoryEn: 'EXECUTIVE BOARDROOM COACH',
    subtitle: 'Salon de conférence mobile avec tables laquées, cuir jaune/beige diamant, ambiance ambrée et ciel étoilé bleu',
    subtitleEn: 'Mobile boardroom with lacquered tables, beige diamond leather & crystal blue starry sky ceiling',
    image: '/sprinter-12-ext.png',
    rearImage: '/sprinter-12-ext.png',
    interiorImage: '/minibus-14-vip-interior.jpg',
    passengers: '14',
    luggage: '14',
    badge: '14 PLACES · SALON VIP',
    badgeEn: '14 SEATS · VIP SALOON',
    highlights: ['Fauteuils grand confort en cuir beige capitonné diamant', 'Tables de réunion laquées & Ciel étoilé bleu cristal', 'Éclairage d\'ambiance polychrome & Système multimédia palace'],
    highlightsEn: ['Diamond-quilted beige leather armchairs', 'Lacquered executive conference tables & blue crystal starlight roof', 'Polychrome ambient LED illumination & multimedia suite'],
  },
  '19-standard': {
    id: 'sprinter-19-standard',
    key: '19-standard',
    name: 'Mercedes Sprinter Standard (19 Places)',
    nameEn: 'Mercedes Sprinter Standard (19 Seats)',
    category: 'MINIBUS GRAND CONFORT',
    categoryEn: 'GRAND COMFORT COACH',
    subtitle: 'Transport grand tourisme 19 places avec sièges cuir noir liseré argent, parquet bois noble et rampes LED néon',
    subtitleEn: 'Grand touring 19-seat coach with black leather silver-piped seats, hardwood floor & dual LED strips',
    image: '/sprinter-19-ext.png',
    rearImage: '/sprinter-19-ext.png',
    interiorImage: '/minibus-19-standard-interior.jpg',
    passengers: '19',
    luggage: '19',
    badge: '19 PLACES · STANDARD',
    badgeEn: '19 SEATS · STANDARD',
    highlights: ['19 sièges ergonomiques en cuir noir avec passepoil gris', 'Plancher aspect parquet bois noble & Tables d\'appoint rabattables', 'Rampes LED néon bleu/violet & Écran vidéo panoramique'],
    highlightsEn: ['19 ergonomic black leather seats with silver piping', 'Hardwood-style flooring & integrated fold-out tables', 'Dual-line blue/violet LED roof strip & panoramic video'],
  },
};

const AUTOPLAY_INTERVAL = 6000;

export default function Vehicle() {
  const { i18n } = useTranslation();
  const { getCityPath } = useCity();
  const navigate = useNavigate();
  const isEn = i18n?.language?.startsWith('en');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState('all');
  const [activeAngle, setActiveAngle] = useState('exterior'); // 'exterior' | 'rear' | 'interior'
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const stripRef = useRef(null);
  const progressTimerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const [selectedMinibus, setSelectedMinibus] = useState('7-vip');

  // 3D Perspective Tilt for the vehicle visual frame
  const {
    ref: tiltRef,
    style: tiltStyle,
    glareStyle,
    bind: tiltBind
  } = usePerspectiveTilt({
    maxTilt: 5,
    scale: 1.015,
    perspective: 1200,
    speed: 450,
    glare: true
  });

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    if (filter === 'all') return FLEET_VEHICLES;
    return FLEET_VEHICLES.filter(v => v.group === filter);
  }, [filter]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
    setActiveAngle('exterior');
  }, [filter]);

  const currentVehicle = filteredVehicles[currentIndex] || filteredVehicles[0];
  const isMinibus = currentVehicle.id === 'sprinter-12' || currentVehicle.isMinibus || currentVehicle.group === 'minibus';

  const activeMinibusConfig = MINIBUS_CONFIGS[selectedMinibus] || MINIBUS_CONFIGS['7-vip'];

  const displayedVehicle = useMemo(() => {
    if (isMinibus) {
      return {
        ...currentVehicle,
        ...activeMinibusConfig,
        id: activeMinibusConfig.id,
      };
    }
    return currentVehicle;
  }, [currentVehicle, isMinibus, activeMinibusConfig]);

  const currentImage = useMemo(() => {
    if (activeAngle === 'rear') return displayedVehicle.rearImage || displayedVehicle.image;
    if (activeAngle === 'interior') return displayedVehicle.interiorImage || displayedVehicle.image;
    return displayedVehicle.image;
  }, [displayedVehicle, activeAngle]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % filteredVehicles.length);
    setProgress(0);
    setActiveAngle('exterior');
    startTimeRef.current = Date.now();
  }, [filteredVehicles.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + filteredVehicles.length) % filteredVehicles.length);
    setProgress(0);
    setActiveAngle('exterior');
    startTimeRef.current = Date.now();
  }, [filteredVehicles.length]);

  // Silk Auto-Parade Timer
  useEffect(() => {
    if (isPaused) return;

    startTimeRef.current = Date.now();
    const tickInterval = 50;

    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentPct = Math.min((elapsed / AUTOPLAY_INTERVAL) * 100, 100);
      setProgress(currentPct);

      if (elapsed >= AUTOPLAY_INTERVAL) {
        handleNext();
      }
    }, tickInterval);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPaused, currentIndex, handleNext]);

  // Center active thumbnail in bottom strip
  useEffect(() => {
    if (stripRef.current) {
      const activeEl = stripRef.current.children[currentIndex];
      if (activeEl) {
        const strip = stripRef.current;
        const offset = activeEl.offsetLeft - (strip.offsetWidth / 2) + (activeEl.offsetWidth / 2);
        strip.scrollTo({ left: offset, behavior: 'smooth' });
      }
    }
  }, [currentIndex]);

  const goToVehicle = (idx) => {
    setCurrentIndex(idx);
    setProgress(0);
    setActiveAngle('exterior');
    startTimeRef.current = Date.now();
  };

  const handleBookVehicle = (vehId) => {
    navigate(getCityPath(`/reserver?service=transfer&vehicle=${vehId}`));
  };

  // Camera angle variants for dollying cinematics
  const angleVariants = {
    initial: (angle) => {
      if (angle === 'interior') return { opacity: 0, scale: 1.08, filter: 'blur(6px)' };
      if (angle === 'rear') return { opacity: 0, scale: 0.97, x: 25, filter: 'blur(3px)' };
      return { opacity: 0, scale: 0.97, x: -25, filter: 'blur(3px)' };
    },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (angle) => {
      if (angle === 'interior') return { opacity: 0, scale: 0.95, filter: 'blur(4px)', transition: { duration: 0.35 } };
      return { opacity: 0, scale: 1.02, filter: 'blur(4px)', transition: { duration: 0.35 } };
    }
  };

  return (
    <section 
      className={styles.vehicleSection}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      id="flotte"
    >
      {/* ── Deep Background Plan: Monumental Floating Watermark ── */}
      <div className={styles.watermarkStage} aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVehicle.id}
            initial={{ opacity: 0, y: 35, letterSpacing: '0.04em' }}
            animate={{ opacity: 0.045, y: 0, letterSpacing: '0.08em' }}
            exit={{ opacity: 0, y: -35 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.watermarkText}
          >
            {currentVehicle.watermark || currentVehicle.name.toUpperCase()}
          </motion.div>
        </AnimatePresence>
        <div className={styles.ambientBeam} />
      </div>

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.categoryBadgeGroup}>
              <span className={styles.luxuryDot} />
              <span className={styles.categoryBadge}>
                {isEn ? 'THE PRIVATE AUTOMOTIVE SUITE' : 'LA FLOTTE D\'EXCEPTION'}
              </span>
            </div>

            <div className={styles.paradeIndicator}>
              <button 
                type="button"
                onClick={() => setIsPaused(!isPaused)} 
                className={styles.playPauseBtn}
                title={isPaused ? (isEn ? 'Play auto parade' : 'Reprendre le défilé') : (isEn ? 'Pause parade' : 'Mettre en pause')}
              >
                {isPaused ? <Play size={11} fill="currentColor" /> : <Pause size={11} fill="currentColor" />}
                <span>{isPaused ? (isEn ? 'PAUSED' : 'EN PAUSE') : (isEn ? '3D PARADE' : 'DÉFILÉ 3D')}</span>
              </button>
              <div className={styles.counter}>
                <span className={styles.counterCurrent}>
                  {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <span className={styles.counterDivider}>/</span>
                <span className={styles.counterTotal}>
                  {String(filteredVehicles.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.titleRow}>
            <h2 className={styles.title}>
              Prestige &amp; <span className={styles.titleItalic}>Haute Mobilité.</span>
            </h2>
            <p className={styles.subtitle}>
              {isEn 
                ? 'An uncompromising private collection of thirty flagship limousines and luxury vans, curated for state protocol, diplomatic summits, and bespoke Parisian travel.'
                : 'Une collection privée de trente véhicules de grand prestige entretenus selon les exigences rigoureuses du protocole diplomatique et des palaces parisiens.'}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className={styles.filterTabs}>
            {[
              { id: 'all', label: isEn ? 'ALL FLEET' : 'TOUTE LA FLOTTE' },
              { id: 'berlines', label: isEn ? 'BERLINES D\'ÉTAT' : 'BERLINES D\'ÉTAT' },
              { id: 'prestige', label: isEn ? 'HAUTE COUTURE' : 'HAUTE COUTURE' },
              { id: 'suv', label: isEn ? 'PREMIUM SUVS' : 'SUVS PRESTIGE' },
              { id: 'vans', label: isEn ? 'PALACE VANS' : 'VANS' },
              { id: 'minibus', label: isEn ? 'MINIBUS' : 'MINIBUS' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.filterTab} ${filter === tab.id ? styles.filterTabActive : ''}`}
                onClick={() => setFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Vehicle Spotlight 3D Stage ── */}
        <div className={styles.spotlightWrapper}>
          {/* Subtle Progress Bar */}
          <div className={styles.progressBarTrack}>
            <div 
              className={styles.progressBarFill} 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className={styles.spotlightGrid}>
            {/* Left: 3D Vehicle Visual Stage with Perspective Tilt */}
            <div 
              className={styles.visualContainer}
              ref={tiltRef}
              style={tiltStyle}
              {...tiltBind}
            >
              <div className={styles.specularGlare} style={glareStyle} />

              <AnimatePresence mode="wait" custom={activeAngle}>
                <motion.div
                  key={`${currentVehicle.id}-${activeAngle}`}
                  custom={activeAngle}
                  variants={angleVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={styles.visualFrame}
                >
                  <img
                    src={currentImage}
                    alt={`${currentVehicle.name} - ${activeAngle}`}
                    className={styles.carImage}
                    loading="eager"
                  />
                  <div className={styles.frameVignette} />
                </motion.div>
              </AnimatePresence>

              {/* Floating Status Pill (Z: +40px) */}
              <div className={styles.floatingStatusPill}>
                <Sparkles size={11} className={styles.statusPillIcon} />
                <span className={styles.statusPillBadge}>
                  {isEn ? currentVehicle.badgeEn : currentVehicle.badge}
                </span>
                <span className={styles.statusPillDot}>·</span>
                <span className={styles.statusPillAngle}>
                  {activeAngle === 'exterior' 
                    ? (isEn ? 'EXTERIOR 3/4' : 'EXTÉRIEUR 3/4') 
                    : activeAngle === 'rear' 
                    ? (isEn ? 'REAR 3/4' : 'VUE ARRIÈRE') 
                    : (isEn ? 'FIRST CLASS SUITE' : 'HABITACLE 2026')}
                </span>
              </div>

              {/* ── Cinematic 3D Angle Dial / Selector ── */}
              <div className={styles.cameraDialBar}>
                <div className={styles.cameraDialLabel}>
                  <Compass size={12} strokeWidth={1.5} />
                  <span>{isEn ? 'PERSPECTIVE' : 'ANGLE CAMÉRA'}</span>
                </div>
                <div className={styles.cameraDialPills}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveAngle('exterior'); setIsPaused(true); }}
                    className={`${styles.dialPill} ${activeAngle === 'exterior' ? styles.dialPillActive : ''}`}
                    title={isEn ? 'Front 3/4 Exterior View' : 'Vue Extérieure 3/4 avant'}
                  >
                    <span className={styles.dialNum}>01</span>
                    <span className={styles.dialText}>{isEn ? 'EXTERIOR' : 'EXTÉRIEUR'}</span>
                  </button>

                  {displayedVehicle.rearImage && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setActiveAngle('rear'); setIsPaused(true); }}
                      className={`${styles.dialPill} ${activeAngle === 'rear' ? styles.dialPillActive : ''}`}
                      title={isEn ? 'Rear 3/4 Stature View' : 'Vue Arrière statutaire'}
                    >
                      <span className={styles.dialNum}>02</span>
                      <span className={styles.dialText}>{isEn ? 'REAR' : 'ARRIÈRE'}</span>
                    </button>
                  )}

                  {displayedVehicle.interiorImage && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setActiveAngle('interior'); setIsPaused(true); }}
                      className={`${styles.dialPill} ${activeAngle === 'interior' ? styles.dialPillActive : ''}`}
                      title={isEn ? 'First Class Interior Suite' : 'Habitacle Première Classe'}
                    >
                      <span className={styles.dialNum}>03</span>
                      <span className={styles.dialText}>{isEn ? 'CABIN' : 'HABITACLE'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Visual Navigation Controls */}
              <div className={styles.navControls}>
                <button
                  type="button"
                  onClick={handlePrev}
                  className={styles.navBtn}
                  aria-label={isEn ? 'Previous vehicle' : 'Véhicule précédent'}
                >
                  <ChevronLeft size={17} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={styles.navBtn}
                  aria-label={isEn ? 'Next vehicle' : 'Véhicule suivant'}
                >
                  <ChevronRight size={17} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Right: Architectural Monolith & Specifications */}
            <div className={styles.detailsContainer}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentVehicle.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className={styles.detailsContent}
                >
                  <div className={styles.categoryLine}>
                    <span className={styles.categoryLabel}>
                      {isEn ? displayedVehicle.categoryEn : displayedVehicle.category}
                    </span>
                  </div>

                  <h3 className={styles.carName}>{displayedVehicle.name}</h3>
                  <p className={styles.carDesc}>
                    {isEn ? displayedVehicle.subtitleEn : displayedVehicle.subtitle}
                  </p>

                  {/* Interactive Minibus Selection: Exactly 3 Models */}
                  {isMinibus && (
                    <div className={styles.minibusConfigurator}>
                      <div className={styles.configRow}>
                        <span className={styles.configLabel}>{isEn ? 'CONFIGURATION' : 'CONFIGURATION'} :</span>
                        <div className={styles.configPills}>
                          {[
                            { key: '7-vip', label: isEn ? '7 Seats · VIP' : '7 Places · VIP', isVip: true },
                            { key: '14-vip', label: isEn ? '14 Seats · VIP' : '14 Places · VIP', isVip: true },
                            { key: '19-standard', label: isEn ? '19 Seats · Standard' : '19 Places · Standard', isVip: false },
                          ].map((item) => (
                            <button
                              key={item.key}
                              type="button"
                              className={`${styles.configBtn} ${item.isVip ? styles.configBtnVip : ''} ${selectedMinibus === item.key ? (item.isVip ? styles.configBtnVipActive : styles.configBtnActive) : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMinibus(item.key);
                                setActiveAngle('interior');
                                setIsPaused(true);
                              }}
                            >
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3D Specs Monolith Blocks */}
                  <div className={styles.specsGrid}>
                    <div className={styles.specBox}>
                      <Users size={15} strokeWidth={1.5} className={styles.specIcon} />
                      <div className={styles.specInfo}>
                        <span className={styles.specTitle}>{isEn ? 'PASSENGERS' : 'PASSAGERS'}</span>
                        <span className={styles.specValue}>{displayedVehicle.passengers} {isEn ? 'Guests' : 'Places'}</span>
                      </div>
                    </div>

                    <div className={styles.specBox}>
                      <Briefcase size={15} strokeWidth={1.5} className={styles.specIcon} />
                      <div className={styles.specInfo}>
                        <span className={styles.specTitle}>{isEn ? 'LUGGAGE' : 'BAGAGES'}</span>
                        <span className={styles.specValue}>{displayedVehicle.luggage} {isEn ? 'Bags' : 'Valises'}</span>
                      </div>
                    </div>
                  </div>

                  {/* High Fashion Standards Checklist */}
                  <div className={styles.highlightsList}>
                    <span className={styles.highlightsHeader}>
                      {isEn ? 'CABIN ATTRIBUTES & PROTOCOL' : 'ÉQUIPEMENTS & PRESTATIONS À BORD'}
                    </span>
                    {(isEn ? displayedVehicle.highlightsEn : displayedVehicle.highlights).map((item, idx) => (
                      <div key={idx} className={styles.highlightRow}>
                        <span className={styles.highlightIndex}>0{idx + 1}</span>
                        <span className={styles.highlightText}>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions Row */}
                  <div className={styles.actionsRow}>
                    <button
                      type="button"
                      onClick={() => handleBookVehicle(displayedVehicle.id)}
                      className={styles.primaryCta}
                    >
                      <span>{isEn ? 'SELECT THIS VEHICLE' : 'RÉSERVER CE VÉHICULE'}</span>
                      <ArrowRight size={14} strokeWidth={1.8} className={styles.ctaArrow} />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(getCityPath('/vehicules'))}
                      className={styles.secondaryCta}
                    >
                      <span>{isEn ? 'DISCOVER FULL FLEET' : 'TOUTE LA FLOTTE'}</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── 3D Interactive Horizontal Fleet Carousel Strip ── */}
        <div className={styles.stripSection}>
          <div className={styles.stripHeader}>
            <div className={styles.stripHeaderLeft}>
              <span className={styles.stripTitle}>
                {isEn ? 'CATALOGUE SCÉNIQUE DE LA FLOTTE' : 'SÉLECTEUR RAPIDE DE LA FLOTTE'}
              </span>
              <span className={styles.stripSubtitle}>
                {isEn ? 'Explore each bespoke model in the collection' : 'Parcourez les 12 modèles de notre flotte'}
              </span>
            </div>
            <span className={styles.stripHint}>
              {isEn ? 'Click to inspect in 3D' : 'Cliquez pour afficher en 3D'}
            </span>
          </div>

          <div className={styles.stripScrollWrapper} ref={stripRef}>
            {filteredVehicles.map((veh, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={veh.id}
                  type="button"
                  onClick={() => goToVehicle(idx)}
                  className={`${styles.stripCard} ${isActive ? styles.stripCardActive : ''}`}
                >
                  <div className={styles.stripCardThumb}>
                    <img src={veh.image} alt={veh.name} loading="lazy" />
                    {isActive && <div className={styles.stripCardGlow} />}
                  </div>
                  <div className={styles.stripCardInfo}>
                    <div className={styles.stripCardHeader}>
                      <span className={styles.stripCardIndex}>{String(idx + 1).padStart(2, '0')}</span>
                      <span className={styles.stripCardBadge}>{veh.passengers}p</span>
                    </div>
                    <span className={styles.stripCardName}>{veh.name}</span>
                    <span className={styles.stripCardCat}>{veh.category}</span>
                  </div>
                  {isActive && <div className={styles.stripActiveIndicator} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
