import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useCity } from '../hooks/useCity';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete';
import { formatDateISO, formatTimeHHMM, getEarliestBookingDateTime, validateBookingDateTime } from '../lib/bookingTime';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Check,
  ChevronDown,
  Baby,
  PlaneTakeoff,
  Briefcase,
  MessageSquare,
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ArrowUpDown,
  X,
  User,
  Mail,
  Phone,
  Building2,
  Luggage,
  CreditCard,
  SlidersHorizontal,
  Award,
  UserCheck,
  Shield,
  Navigation,
  Mic,
  MicOff,
  CheckCircle2,
  ChevronRight,
  Layers,
  Plus,
  Trash2,
  Route,
  CalendarRange,
  Sparkles,
  Menu,
  Home,
  Compass,
  ArrowDown,
} from 'lucide-react';
import { getFormAccessKey } from '../lib/formRouting';
import LanguageSelector from '../components/LanguageSelector';
import { MessageCircle } from 'lucide-react';
import { calculateTripPrice, getDrivingDistanceKm } from '../lib/pricingEngine';
import { useBookingsStore } from '../admin/store/useBookingsStore';
import LuxuryDateTimePicker from '../components/LuxuryDateTimePicker';
import { useVoiceDictation } from '../hooks/useVoiceDictation';
import { getPopularDestinations } from '../lib/popularDestinations';
import styles from './ReservationPage.module.css';

/* ─── Vehicle Catalogue & Quote Classes (Simplified & Blacklane UX Logic) ─── */

export const QUOTE_CLASSES = [
  {
    id: 'business-class',
    classCategory: 'standard',
    name: 'Business Class',
    subtitle: 'Classe E, EQE, Tesla Model Y ou similaire',
    vehicleTag: 'Business Class',
    passengers: 'Jusqu’à 3 passagers',
    maxPassengers: 3,
    maxLuggage: 2,
    luggage: '2 valises max',
    desc: 'Berlines exécutives haut de gamme pour vos transferts aéroports, gares et rendez-vous professionnels.',
    image: '/eclass-paris-luxury.jpg',
    models: ['Mercedes Classe E', 'Mercedes EQE', 'Tesla Model Y'],
  },
  {
    id: 'business-van',
    classCategory: 'standard',
    name: 'Business Van',
    subtitle: 'Classe V ou similaire',
    vehicleTag: 'Business Van',
    passengers: 'Jusqu’à 7 passagers',
    maxPassengers: 7,
    maxLuggage: 7,
    luggage: '7 valises max',
    desc: 'Salon face-à-face grand confort pour délégations professionnelles, familles et bagages volumineux.',
    image: '/vclass-paris-luxury.jpg',
    rearImage: '/vclass-rear-luxury.jpg',
    interiorImage: '/vclass_interior_vip_lounge.jpg',
    models: ['Mercedes Classe V'],
  },
  {
    id: 'first-class',
    classCategory: 'standard',
    name: 'First Class',
    subtitle: 'Classe S ou similaire',
    vehicleTag: 'First Class',
    passengers: 'Jusqu’à 3 passagers',
    maxPassengers: 3,
    maxLuggage: 3,
    luggage: '3 valises max',
    desc: 'La quintessence du prestige automobile mondial, insonorisation d’art et confort absolu de palace.',
    image: '/sclass-main-new.jpg',
    rearImage: '/sclass_paris_hero.jpg',
    interiorImage: '/sclass-interior-white.jpg',
    models: ['Mercedes Classe S'],
  },
];

export const LARGE_GROUPS_VEHICLES = [
  {
    id: 'sprinter-7-vip',
    classCategory: 'large-groups',
    capacityTag: '7 places',
    name: 'Mercedes Sprinter Lounge (7 places)',
    subtitle: 'Salon VIP Privé First Class',
    passengers: '7 passagers',
    maxPassengers: 7,
    maxLuggage: 10,
    luggage: '10 valises max',
    desc: 'Fauteuils club individuels en cuir nappa, espace de travail modulable et confort haut de gamme.',
    image: '/minibus-7-vip-interior.jpg',
  },
  {
    id: 'sprinter-14-vip',
    classCategory: 'large-groups',
    capacityTag: '14 places',
    name: 'Mercedes Sprinter (14 places)',
    subtitle: 'Minibus Affaires & Événements',
    passengers: '14 passagers',
    maxPassengers: 14,
    maxLuggage: 14,
    luggage: '14 valises max',
    desc: 'Minibus grand confort dédié aux délégations d’affaires, mariages et transferts de groupes.',
    image: '/minibus-14-vip-interior.jpg',
  },
  {
    id: 'sprinter-19-standard',
    classCategory: 'large-groups',
    capacityTag: '19 places',
    name: 'Mercedes Sprinter (19 places)',
    subtitle: 'Grand Tourisme & Congrès',
    passengers: '19 passagers',
    maxPassengers: 19,
    maxLuggage: 19,
    luggage: '19 valises max',
    desc: 'Minibus 19 places grand tourisme avec plancher bois, idéal pour grands groupes et événements.',
    image: '/minibus-19-standard-interior.jpg',
  },
];

export const PRESTIGE_VEHICLES = [
  {
    id: 'maybach',
    classCategory: 'prestige',
    name: 'Mercedes-Maybach',
    subtitle: 'Salon Première Classe & Flûtes',
    passengers: '3 passagers',
    maxPassengers: 3,
    maxLuggage: 3,
    luggage: '3 valises max',
    desc: 'Le summum du luxe automobile, empattement long, flûtes argentées et confort d’aviation privée.',
    image: '/maybach-paris-luxury.jpg',
    rearImage: '/maybach-rear-luxury.jpg',
    interiorImage: '/maybach-interior-first-class.jpg',
  },
  {
    id: 'rolls-phantom',
    classCategory: 'prestige',
    name: 'Rolls-Royce Phantom',
    subtitle: 'Prestance Majestueuse & Portes Antagonistes',
    passengers: '3 passagers',
    maxPassengers: 3,
    maxLuggage: 3,
    luggage: '3 valises max',
    desc: 'L’incarnation ultime de l’aristocratie automobile, silence feutré royal et finitions d’exception.',
    image: '/rolls-phantom-main.jpg',
    rearImage: '/rolls-phantom-rear.jpg',
    interiorImage: '/rolls-phantom-interior.jpg',
  },
  {
    id: 'rolls-cullinan',
    classCategory: 'prestige',
    name: 'Rolls-Royce Cullinan',
    subtitle: 'SUV de Prestige Suprême',
    passengers: '3 passagers',
    maxPassengers: 3,
    maxLuggage: 4,
    luggage: '4 valises max',
    desc: 'Le SUV le plus luxueux au monde, prestance souveraine et confort absolu sur toutes distances.',
    image: '/rolls-cullinan-main.jpg',
    rearImage: '/rolls-cullinan-rear.jpg',
    interiorImage: '/rolls-cullinan-interior.jpg',
  },
  {
    id: 'cadillac-escalade',
    classCategory: 'prestige',
    name: 'Cadillac Escalade ESV',
    subtitle: 'Grand SUV Américain Statutaire',
    passengers: '6 passagers',
    maxPassengers: 6,
    maxLuggage: 6,
    luggage: '6 valises max',
    desc: 'Le grand SUV américain d’exception, salon spacieux et présence statutaire incomparable.',
    image: '/cadillac-escalade-main.jpg',
    rearImage: '/cadillac-escalade-rear.jpg',
    interiorImage: '/cadillac-escalade-interior.jpg',
  },
  {
    id: 'range-rover',
    classCategory: 'prestige',
    name: 'Range Rover Autobiography',
    subtitle: 'SUV Britannique de Référence',
    passengers: '3 passagers',
    maxPassengers: 3,
    maxLuggage: 4,
    luggage: '4 valises max',
    desc: 'SUV britannique emblématique, assise dominante majestueuse et sérénité de conduite.',
    image: '/range-rover-main.jpg',
    rearImage: '/range-rover-rear.jpg',
    interiorImage: '/range-rover-interior.jpg',
  },
];

const VEHICLES = [
  ...QUOTE_CLASSES,
  ...LARGE_GROUPS_VEHICLES,
  ...PRESTIGE_VEHICLES,
  // Backward compatibility aliases
  {
    id: 'classe-e',
    name: 'Mercedes Classe E',
    aliasOf: 'business-class',
    passengers: '3 passagers',
    maxPassengers: 3,
    maxLuggage: 2,
    image: '/eclass-paris-luxury.jpg',
  },
  {
    id: 'tesla-y',
    name: 'Tesla Model Y',
    aliasOf: 'business-class',
    passengers: '4 passagers',
    maxPassengers: 4,
    maxLuggage: 3,
    image: '/tesla-y-paris-luxury.jpg',
  },
  {
    id: 'classe-s',
    name: 'Mercedes Classe S',
    aliasOf: 'first-class',
    passengers: '3 passagers',
    maxPassengers: 3,
    maxLuggage: 3,
    image: '/sclass-main-new.jpg',
  },
  {
    id: 'classe-v',
    name: 'Mercedes Classe V',
    aliasOf: 'business-van',
    passengers: '7 passagers',
    maxPassengers: 7,
    maxLuggage: 7,
    image: '/vclass-paris-luxury.jpg',
  },
];

const AIRPORT_KEYWORDS = ['aéroport', 'cdg', 'orly', 'airport', 'roissy', 'beauvais', 'bourget'];

function containsAirport(value) {
  if (!value) return false;
  const lower = value.toLowerCase();
  return AIRPORT_KEYWORDS.some((kw) => lower.includes(kw));
}

const TERRITORIES_DATA = {
  france: {
    id: 'france',
    name: 'France',
    hubs: 'Paris · Côte d\'Azur · Courchevel',
    suggestions: [
      { label: 'Aéroport Paris-Le Bourget (Terminal VIP)', category: 'Aviation d\'Affaires' },
      { label: 'Aéroport CDG (Charles de Gaulle)', category: 'Aéroport' },
      { label: 'Aéroport Paris-Orly', category: 'Aéroport' },
      { label: 'Hôtel Ritz Paris (Place Vendôme)', category: 'Palace' },
      { label: 'Four Seasons Hôtel George V (Paris)', category: 'Palace' },
      { label: 'Hôtel Plaza Athénée (Avenue Montaigne)', category: 'Palace' },
      { label: 'Aéroport Nice Côte d\'Azur (Terminal 2)', category: 'Riviera' },
    ]
  },
  angleterre: {
    id: 'angleterre',
    name: 'Angleterre',
    hubs: 'Londres · Heathrow · UK',
    suggestions: [
      { label: 'London Heathrow Airport (VIP Windsor Suite)', category: 'Aéroport VIP' },
      { label: 'Farnborough Airport (Aviation Privée)', category: 'Aviation d\'Affaires' },
      { label: 'The Ritz London (Piccadilly)', category: 'Palace' },
      { label: 'Claridge\'s (Mayfair, London)', category: 'Palace' },
      { label: 'London City Airport (Private Jet Centre)', category: 'Aéroport' },
    ]
  },
  suisse: {
    id: 'suisse',
    name: 'Suisse',
    hubs: 'Genève · Zurich · Gstaad',
    suggestions: [
      { label: 'Aéroport de Genève (Cointrin - Terminal VIP)', category: 'Aviation d\'Affaires' },
      { label: 'Aéroport de Zurich (Kloten)', category: 'Aéroport' },
      { label: 'Four Seasons Hotel des Bergues (Genève)', category: 'Palace' },
      { label: 'The Dolder Grand (Zurich)', category: 'Palace' },
      { label: 'The Alpina Gstaad', category: 'Palace' },
    ]
  },
  usa: {
    id: 'usa',
    name: 'USA',
    hubs: 'New York · Miami · Los Angeles',
    suggestions: [
      { label: 'Teterboro Private Airport (TEB - New York)', category: 'Aviation d\'Affaires' },
      { label: 'JFK International Airport (New York)', category: 'Aéroport' },
      { label: 'Miami International Airport (MIA)', category: 'Aéroport' },
      { label: 'The Plaza Hotel (Fifth Avenue, NY)', category: 'Palace' },
      { label: 'Faena Hotel (Miami Beach)', category: 'Palace' },
    ]
  },
  italie: {
    id: 'italie',
    name: 'Italie',
    hubs: 'Milan · Rome · Côte Amalfitaine',
    suggestions: [
      { label: 'Milano Malpensa Airport (Terminal VIP)', category: 'Aéroport' },
      { label: 'Roma Fiumicino Airport (Leonardo da Vinci)', category: 'Aéroport' },
      { label: 'Armani Hotel Milano', category: 'Palace' },
      { label: 'Hotel de Russie (Roma)', category: 'Palace' },
      { label: 'Belmond Hotel Caruso (Ravello / Amalfi)', category: 'Palace' },
    ]
  },
  uae: {
    id: 'uae',
    name: 'UAE',
    hubs: 'Dubaï · Abu Dhabi',
    suggestions: [
      { label: 'Dubai International Airport (DXB Al Majlis VIP)', category: 'Aéroport VIP' },
      { label: 'Al Maktoum International (DWC Private Jet)', category: 'Aviation d\'Affaires' },
      { label: 'Burj Al Arab Jumeirah (Dubaï)', category: 'Palace' },
      { label: 'Emirates Palace Mandarin Oriental (Abu Dhabi)', category: 'Palace' },
      { label: 'Atlantis The Royal (Palm Jumeirah)', category: 'Palace' },
    ]
  },
};

const DRIVER_INSTRUCTIONS_LIST = [
  {
    id: 'silence',
    title: 'Silence souhaité à bord',
    desc: 'Trajet calme et reposant, idéal pour travailler ou se détendre sans distraction.',
  },
  {
    id: 'call_on_arrival',
    title: 'Appel ou SMS à l’arrivée',
    desc: 'Votre chauffeur vous avertit discrètement dès qu’il est stationné au point de rendez-vous.',
  },
  {
    id: 'luggage_help',
    title: 'Aide au port des bagages',
    desc: 'Prise en charge et chargement attentionné de vos bagages dès votre accueil.',
  },
  {
    id: 'cabin_temp',
    title: 'Température cabine personnalisée',
    desc: 'Climatisation fraîche ou cabine tempérée ajustée selon vos préférences.',
  },
];

const WELCOME_TEXTS = {
  fr: {
    welcome: 'Bienvenue',
    heroTitle: 'Commencez votre voyage',
    destinationPlaceholder: 'Saisissez votre destination',
    exploreServices: '↓ Explorez les voyages et les services',
    navHome: 'Accueil',
    navJourneys: 'Voyages',
    navHelp: 'Aide',
    servicesTitle: 'Explorez nos formules de voyage',
    servicesSubtitle: 'Sélectionnez la prestation adaptée à vos exigences de mobilité.',
    helpTitle: 'Assistance & Conciergerie VIP',
    helpSubtitle: 'Notre régie opérationnelle est à votre disposition 24h/24 et 7j/7.',
    helpWhatsapp: 'Échanger directement sur WhatsApp',
    helpPhone: 'Appeler la permanence (+33 1 84 80 56 76)',
    close: 'Fermer',
  },
  en: {
    welcome: 'Welcome',
    heroTitle: 'Start your journey',
    destinationPlaceholder: 'Where to? Enter destination',
    exploreServices: '↓ Explore journeys & services',
    navHome: 'Home',
    navJourneys: 'Journeys',
    navHelp: 'Help',
    servicesTitle: 'Explore our mobility services',
    servicesSubtitle: 'Select the bespoke private chauffeur service tailored to your needs.',
    helpTitle: 'VIP Concierge & Assistance',
    helpSubtitle: 'Our dispatch team is available 24/7.',
    helpWhatsapp: 'Chat directly on WhatsApp',
    helpPhone: 'Call dispatch hotline (+33 1 84 80 56 76)',
    close: 'Close',
  },
  es: {
    welcome: 'Bienvenido',
    heroTitle: 'Comience su viaje',
    destinationPlaceholder: 'Ingrese su destino',
    exploreServices: '↓ Explorar viajes y servicios',
    navHome: 'Inicio',
    navJourneys: 'Viajes',
    navHelp: 'Ayuda',
    servicesTitle: 'Explore nuestros servicios',
    servicesSubtitle: 'Seleccione el servicio de chófer privado adaptado a sus desplazamientos.',
    helpTitle: 'Asistencia y Conserjería VIP',
    helpSubtitle: 'Nuestra oficina de operaciones está disponible 24/7.',
    helpWhatsapp: 'Contactar por WhatsApp',
    helpPhone: 'Llamar al servicio 24/7 (+33 1 84 80 56 76)',
    close: 'Cerrar',
  },
  ar: {
    welcome: 'مرحباً بكم',
    heroTitle: 'ابدأ رحلتك',
    destinationPlaceholder: 'أدخل وجهتك',
    exploreServices: '↓ استكشف الرحلات والخدمات',
    navHome: 'الرئيسية',
    navJourneys: 'الرحلات',
    navHelp: 'المساعدة',
    servicesTitle: 'استكشف خدمات التنقل الفاخرة',
    servicesSubtitle: 'اختر الخدمة المناسبة لاحتياجات تنقلكم.',
    helpTitle: 'المساعدة وخدمة كبار الشخصيات',
    helpSubtitle: 'فريق العمليات متاح لخدمتكم على مدار الساعة 24/7.',
    helpWhatsapp: 'تواصل مباشر عبر واتساب',
    helpPhone: 'الاتصال بالخط الساخن (+33 1 84 80 56 76)',
    close: 'إغلاق',
  },
  zh: {
    welcome: '欢迎',
    heroTitle: '开启您的尊享旅程',
    destinationPlaceholder: '输入您的目的地',
    exploreServices: '↓ 探索专属行程与服务',
    navHome: '首页',
    navJourneys: '行程',
    navHelp: '帮助',
    servicesTitle: '探索我们的尊享出行服务',
    servicesSubtitle: '选择符合您出行期望的专属私享司机方案。',
    helpTitle: '贵宾礼宾与即时协助',
    helpSubtitle: '我们的调度中心 24/7 全天候在线为您服务。',
    helpWhatsapp: '通过 WhatsApp 直联',
    helpPhone: '致电 24/7 热线 (+33 1 84 80 56 76)',
    close: '关闭',
  },
};

export default function ReservationPage() {
  const { t, city: currentCity, getCityPath, i18n } = useCity();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const langKey = i18n?.language?.startsWith('en')
    ? 'en'
    : i18n?.language?.startsWith('es')
    ? 'es'
    : i18n?.language?.startsWith('ar')
    ? 'ar'
    : i18n?.language?.startsWith('zh')
    ? 'zh'
    : 'fr';

  const welcomeT = WELCOME_TEXTS[langKey] || WELCOME_TEXTS.fr;
  const isRtl = langKey === 'ar';

  const [menuOpen, setMenuOpen] = useState(false);
  const [showServicesSheet, setShowServicesSheet] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const cityToTerritory = {
    paris: 'france',
    bordeaux: 'france',
    'french-riviera': 'france',
    london: 'angleterre',
    suisse: 'suisse',
    usa: 'usa',
    italie: 'italie',
    uae: 'uae',
  };
  const fallbackTerritory = cityToTerritory[currentCity] || 'france';
  const territoryKey = (searchParams.get('territory') || fallbackTerritory).toLowerCase();
  const activeTerritory = TERRITORIES_DATA[territoryKey] || TERRITORIES_DATA.france;
  const LUXURY_SUGGESTIONS = activeTerritory.suggestions;

  const earliestDateTime = useMemo(() => getEarliestBookingDateTime(), []);
  const todayISO = useMemo(() => formatDateISO(new Date()), []);
  const tomorrowISO = useMemo(() => {
    const tm = new Date();
    tm.setDate(tm.getDate() + 1);
    return formatDateISO(tm);
  }, []);

  const formatDayFull = useCallback((dateStr) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const formatted = dateObj.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch (e) {
      return dateStr;
    }
  }, []);

  const formatDayShort = useCallback((dateStr) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const formatted = dateObj.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch (e) {
      return dateStr;
    }
  }, []);

  // Service selection: 'transfer' (default: Aller simple), 'hourly' (Chauffeur à l'heure), 'bespoke'
  const initialService = searchParams.get('service') || 'transfer';
  const [service, setService] = useState(initialService);

  // Step counter (starts at Step 1: Réservez un voyage)
  const [step, setStep] = useState(() => {
    const s = searchParams.get('step');
    if (s && !isNaN(parseInt(s, 10)) && parseInt(s, 10) > 0) return parseInt(s, 10);
    return 1;
  });

  const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
  const [urgentModalOpen, setUrgentModalOpen] = useState(false);
  const [activeInputFocus, setActiveInputFocus] = useState(null); // 'pickup' | 'destination' | null

  // Direction for slide animation: 1 = forward, -1 = backward
  const [direction, setDirection] = useState(1);

  // Transfer & Hourly inputs
  const pickupAutocomplete = useAddressAutocomplete(searchParams.get('pickup') || '', currentCity || 'paris');
  const destAutocomplete = useAddressAutocomplete(searchParams.get('destination') || '', currentCity || 'paris');
  
  const pickup = pickupAutocomplete.query;
  const setPickup = pickupAutocomplete.setQuery;
  const destination = destAutocomplete.query;
  const setDestination = destAutocomplete.setQuery;
  const [destScreen0Open, setDestScreen0Open] = useState(false);

  const [pickupCoords, setPickupCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);

  const [date, setDate] = useState(() => searchParams.get('date') || formatDateISO(earliestDateTime));
  const [time, setTime] = useState(() => searchParams.get('time') || formatTimeHHMM(earliestDateTime));
  const [duration, setDuration] = useState(searchParams.get('duration') || '3 heures');
  const [customHours, setCustomHours] = useState('5');

  // Multi-day custom schedule for hourly service
  const [scheduleDays, setScheduleDays] = useState(() => [
    {
      id: 1,
      date: searchParams.get('date') || formatDateISO(earliestDateTime),
      startTime: searchParams.get('time') || '09:00',
      endTime: '17:00',
      hours: 8,
      isFlexible: true,
    },
  ]);
  const [hasLongDistance, setHasLongDistance] = useState(false);
  const [longDistanceCities, setLongDistanceCities] = useState('');

  const computeSlotHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 3;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    let diff = (eh * 60 + (em || 0)) - (sh * 60 + (sm || 0));
    if (diff <= 0) diff += 24 * 60;
    return Math.max(1, Math.round(diff / 60));
  };

  const totalScheduleHours = useMemo(() => {
    return scheduleDays.reduce((acc, d) => acc + (d.hours || 0), 0);
  }, [scheduleDays]);

  const toggleDayFlexible = (dayId) => {
    setScheduleDays((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, isFlexible: !d.isFlexible } : d))
    );
  };

  const setDayPresetHours = (dayId, hours) => {
    setScheduleDays((prev) =>
      prev.map((d) => {
        if (d.id !== dayId) return d;
        const [sh, sm] = (d.startTime || '09:00').split(':').map(Number);
        const endH = (sh + hours) % 24;
        const endHStr = String(endH).padStart(2, '0');
        const endMStr = String(sm || 0).padStart(2, '0');
        return {
          ...d,
          hours,
          endTime: `${endHStr}:${endMStr}`,
        };
      })
    );
  };

  const updateDayStartTime = (dayId, newStart) => {
    setScheduleDays((prev) =>
      prev.map((d) => {
        if (d.id !== dayId) return d;
        const currentHours = d.hours || 8;
        const [sh, sm] = newStart.split(':').map(Number);
        const endH = (sh + currentHours) % 24;
        const endHStr = String(endH).padStart(2, '0');
        const endMStr = String(sm || 0).padStart(2, '0');
        return {
          ...d,
          startTime: newStart,
          endTime: `${endHStr}:${endMStr}`,
        };
      })
    );
  };

  const updateDayEndTime = (dayId, newEnd) => {
    setScheduleDays((prev) =>
      prev.map((d) => {
        if (d.id !== dayId) return d;
        const updated = { ...d, endTime: newEnd };
        updated.hours = computeSlotHours(updated.startTime, newEnd);
        return updated;
      })
    );
  };

  const updateDayTime = (dayId, field, value) => {
    setScheduleDays((prev) =>
      prev.map((d) => {
        if (d.id !== dayId) return d;
        const updated = { ...d, [field]: value };
        updated.hours = computeSlotHours(updated.startTime, updated.endTime);
        return updated;
      })
    );
  };

  const updateDayDate = (dayId, value) => {
    setScheduleDays((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, date: value } : d))
    );
  };

  const addScheduleDay = () => {
    setScheduleDays((prev) => {
      const lastDay = prev[prev.length - 1];
      let nextDateStr = todayISO;
      if (lastDay && lastDay.date) {
        try {
          const d = new Date(lastDay.date);
          d.setDate(d.getDate() + 1);
          nextDateStr = d.toISOString().split('T')[0];
        } catch (e) {
          nextDateStr = todayISO;
        }
      }
      const newId = prev.length > 0 ? Math.max(...prev.map((item) => item.id)) + 1 : 1;
      const defaultHours = lastDay ? lastDay.hours : 8;
      return [
        ...prev,
        {
          id: newId,
          date: nextDateStr,
          startTime: '09:00',
          endTime: '17:00',
          hours: defaultHours,
          isFlexible: true,
        },
      ];
    });
  };

  const addScheduleWeek = () => {
    setScheduleDays((prev) => {
      const lastDay = prev[prev.length - 1];
      let baseDate = new Date();
      if (lastDay && lastDay.date) {
        try {
          baseDate = new Date(lastDay.date);
        } catch (e) {
          baseDate = new Date();
        }
      }
      const maxId = prev.length > 0 ? Math.max(...prev.map((item) => item.id)) : 0;
      const defaultHours = lastDay ? lastDay.hours : 8;
      const newDays = [];
      for (let i = 1; i <= 7; i++) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + i);
        const nextDateStr = d.toISOString().split('T')[0];
        newDays.push({
          id: maxId + i,
          date: nextDateStr,
          startTime: '09:00',
          endTime: '17:00',
          hours: defaultHours,
          isFlexible: true,
        });
      }
      return [...prev, ...newDays];
    });
  };

  const removeScheduleDay = (dayId) => {
    if (scheduleDays.length <= 1) return;
    setScheduleDays((prev) => prev.filter((d) => d.id !== dayId));
  };

  const setNumberOfDays = (count) => {
    const targetCount = Math.max(1, Math.min(30, count));
    setScheduleDays((prev) => {
      if (prev.length === targetCount) return prev;
      if (prev.length < targetCount) {
        const newDays = [...prev];
        const lastDay = prev[prev.length - 1];
        const defaultHours = lastDay ? lastDay.hours : 8;
        const defaultStartTime = lastDay ? lastDay.startTime : '09:00';
        for (let i = prev.length; i < targetCount; i++) {
          let nextDate = todayISO;
          try {
            const lastDate = newDays[newDays.length - 1]?.date || todayISO;
            const d = new Date(lastDate);
            d.setDate(d.getDate() + 1);
            nextDate = d.toISOString().split('T')[0];
          } catch (e) {
            nextDate = todayISO;
          }
          newDays.push({
            id: Date.now() + i,
            date: nextDate,
            startTime: defaultStartTime,
            endTime: '17:00',
            hours: defaultHours,
            isFlexible: true,
          });
        }
        return newDays;
      } else {
        return prev.slice(0, targetCount);
      }
    });
  };

  const getFallbackSuggestions = (text) => {
    const query = (text || '').trim().toLowerCase();
    if (!query) return LUXURY_SUGGESTIONS.slice(0, 6);
    const popular = getPopularDestinations(currentCity, query).map((p) => ({
      label: p.label,
      category: p.subtitle || p.type || 'Lieu d’intérêt',
    }));
    const luxury = LUXURY_SUGGESTIONS.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query))
    );
    const combined = [...popular, ...luxury];
    const unique = [];
    const seen = new Set();
    for (const item of combined) {
      const key = item.label.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }
    return unique.length > 0 ? unique.slice(0, 6) : LUXURY_SUGGESTIONS.slice(0, 6);
  };

  const [fleetMode, setFleetMode] = useState(() => {
    const fromUrl = searchParams.get('vehicle');
    if (fromUrl) {
      if (LARGE_GROUPS_VEHICLES.some((v) => v.id === fromUrl)) return 'large-groups';
      if (PRESTIGE_VEHICLES.some((v) => v.id === fromUrl)) return 'prestige';
    }
    return 'standard';
  });
  const [largeGroupCapacity, setLargeGroupCapacity] = useState('all');

  const [selectedVehicle, setSelectedVehicle] = useState(() => {
    const fromUrl = searchParams.get('vehicle');
    if (fromUrl) {
      if (fromUrl === 'classe-e' || fromUrl === 'tesla-y') return 'business-class';
      if (fromUrl === 'classe-v') return 'business-van';
      if (fromUrl === 'classe-s') return 'first-class';
      if (VEHICLES.some((v) => v.id === fromUrl)) return fromUrl;
    }
    return 'business-class';
  });
  const [vehicleAngles, setVehicleAngles] = useState({});

  const [passengerCount, setPassengerCount] = useState('1');
  const [luggageCount, setLuggageCount] = useState('0');
  const [flightNumber, setFlightNumber] = useState('');

  // Options & Instructions chauffeur
  const [driverInstructions, setDriverInstructions] = useState([]);
  const [specialRequests, setSpecialRequests] = useState('');

  const toggleDriverInstruction = (id) => {
    setDriverInstructions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Contact details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  // Bespoke Flow inputs
  const [bespokeText, setBespokeText] = useState('');

  // Form submission state
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  // Geocode addresses automatically
  const geocodeAddress = useCallback(async (text) => {
    if (!text || text.trim().length < 3) return null;
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(text)}&limit=1`);
      if (res.ok) {
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          return data.features[0].geometry.coordinates;
        }
      }
    } catch (e) {}
    return null;
  }, []);

  useEffect(() => {
    if (pickup && pickup.trim().length >= 4 && !pickupCoords) {
      const timer = setTimeout(() => {
        geocodeAddress(pickup).then((coords) => {
          if (coords) setPickupCoords(coords);
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pickup, pickupCoords, geocodeAddress]);

  useEffect(() => {
    if (destination && destination.trim().length >= 4 && !destCoords) {
      const timer = setTimeout(() => {
        geocodeAddress(destination).then((coords) => {
          if (coords) setDestCoords(coords);
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [destination, destCoords, geocodeAddress]);

  // Real-time distance calculation
  useEffect(() => {
    if (service === 'transfer' && pickupCoords && destCoords) {
      getDrivingDistanceKm(pickupCoords, destCoords).then((dist) => {
        if (dist) setDistanceKm(dist);
      });
    }
  }, [service, pickupCoords, destCoords]);

  // Context-aware airport check: true if pickup or destination contains airport
  const isAirportTrip = useMemo(
    () => containsAirport(pickup) || containsAirport(destination),
    [pickup, destination]
  );

  // Selected vehicle object
  const selectedVehicleData = useMemo(() => {
    let match = VEHICLES.find((v) => v.id === selectedVehicle);
    if (!match && selectedVehicle) {
      match = VEHICLES.find((v) => v.aliasOf === selectedVehicle);
    }
    if (match && match.aliasOf) {
      match = VEHICLES.find((v) => v.id === match.aliasOf) || match;
    }
    return match || QUOTE_CLASSES[0];
  }, [selectedVehicle]);

  // Pricing calculation
  const calculatedPrice = useMemo(() => {
    if (!selectedVehicle) return null;
    return calculateTripPrice({
      city: currentCity || 'paris',
      serviceType: service === 'hourly' ? 'hourly' : 'transfer',
      vehicleId: selectedVehicle,
      duration: service === 'hourly' ? totalScheduleHours : (duration === 'custom' ? `${customHours} heures` : duration),
      distanceKm: distanceKm || 25,
      pickup,
      destination,
      time: service === 'hourly' ? (scheduleDays[0]?.startTime || '09:00') : time,
      isLongDistance: hasLongDistance,
      options: {},
      lang: i18n?.language === 'en' ? 'en' : 'fr',
    });
  }, [
    currentCity,
    service,
    selectedVehicle,
    duration,
    customHours,
    distanceKm,
    pickup,
    destination,
    time,
    totalScheduleHours,
    hasLongDistance,
    scheduleDays,
    i18n?.language,
  ]);

  // Navigation handlers — simplified 4-step tunnel
  const goToNextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevStep = () => {
    setDirection(-1);
    if (step <= 1) {
      navigate(getCityPath('/'));
    } else {
      setStep((prev) => prev - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwapAddresses = () => {
    const prevPickup = pickup;
    const prevPickupCoords = pickupCoords;
    setPickup(destination || '');
    setPickupCoords(destCoords || null);
    setDestination(prevPickup || '');
    setDestCoords(prevPickupCoords || null);
  };

  const handleSelectSuggestion = (place) => {
    if (activeInputFocus === 'pickup' || (!pickup && destination)) {
      setPickup(place.label);
      if (place.coordinates) setPickupCoords(place.coordinates);
    } else {
      setDestination(place.label);
      if (place.coordinates) setDestCoords(place.coordinates);
    }
    setActiveInputFocus(null);
  };

  const selectService = (type) => {
    setService(type);
    setDirection(1);
    setStep(1);
  };

  // Voice Recognition for Bespoke flow
  const {
    isListening,
    errorMessage: voiceError,
    voiceLang,
    setVoiceLang,
    toggleListening: toggleSpeechRecognition,
  } = useVoiceDictation({
    value: bespokeText,
    onChange: setBespokeText,
    initialLang: i18n?.language?.startsWith('en') ? 'en-US' : 'fr-FR',
  });


  // Formatted WhatsApp message for direct continuation
  const whatsappQuoteText = useMemo(() => {
    const cityName = currentCity ? (currentCity.charAt(0).toUpperCase() + currentCity.slice(1)) : 'Paris';
    const lines = [
      `*DEMANDE DE DEVIS SELY PRIVÉ*`,
      `• Service : ${service === 'transfer' ? 'Transfert' : service === 'hourly' ? 'Chauffeur à la journée' : 'Sur-mesure'}`,
      `• Destination / Ville : ${cityName}`,
      pickup ? `• Prise en charge : ${pickup}` : null,
      destination ? `• Destination : ${destination}` : null,
      date ? `• Date : ${date} à ${time}` : null,
      selectedVehicleData ? `• Véhicule : ${selectedVehicleData.name}` : null,
      phone ? `• Téléphone : ${phone}` : null,
      email ? `• Email : ${email}` : null,
      flightNumber ? `• N° Vol : ${flightNumber}` : null,
      specialRequests ? `• Instructions : ${specialRequests}` : null,
      bespokeText ? `• Demande sur-mesure : ${bespokeText}` : null,
      `\nPouvez-vous me confirmer la disponibilité et le tarif ? Merci.`
    ].filter(Boolean).join('\n');
    return encodeURIComponent(lines);
  }, [currentCity, service, pickup, destination, date, time, selectedVehicleData, phone, email, flightNumber, specialRequests, bespokeText]);

  // Final submit handler
  const handleFinalSubmit = async (e, paymentAction = 'quote') => {
    if (e && e.preventDefault) e.preventDefault();
    setStatus('loading');

    const cityName = currentCity ? (currentCity.charAt(0).toUpperCase() + currentCity.slice(1)) : 'Paris';

    try {
      const accessKey = getFormAccessKey();
      let payload = {};

      if (service === 'bespoke') {
        payload = {
          access_key: accessKey,
          subject: `Demande Sur-Mesure & Événements [${cityName}] - SELY`,
          from_name: `${firstName || 'Client'} ${lastName || ''}`.trim(),
          Ville: cityName,
          Service: 'Demande Sur-Mesure & Événements',
          Téléphone: phone,
          Email: email,
          Description: bespokeText,
        };
      } else {
        const formattedSchedule = scheduleDays
          .map((d, idx) => {
            if (d.isFlexible) {
              return `Jour ${idx + 1} (${d.date}) : ${d.hours}h flexibles (horaires libres)`;
            }
            return `Jour ${idx + 1} (${d.date}) : ${d.startTime} à ${d.endTime} (${d.hours}h)`;
          })
          .join('\n');

        payload = {
          access_key: accessKey,
          subject: `🚗 Réservation ${service === 'transfer' ? 'Transfert' : 'Mise à disposition'} [${cityName}] - ${selectedVehicleData.name}`,
          from_name: `${firstName} ${lastName}`,
          Ville: cityName,
          Service: service === 'transfer'
            ? 'Transfert Point A à Point B'
            : `Mise à disposition (${scheduleDays.length} jours · ${totalScheduleHours}h au total)`,
          Départ: pickup,
          Destination: service === 'transfer'
            ? destination
            : (hasLongDistance ? `Longue distance : ${longDistanceCities || 'Oui'}` : 'Local & Agglomération'),
          Date: service === 'hourly' ? `${scheduleDays[0]?.date || date} (Début)` : date,
          Heure: service === 'hourly' ? `${scheduleDays[0]?.startTime || time}` : time,
          'Planning détaillé': service === 'hourly' ? formattedSchedule : '—',
          'Trajets longue distance': hasLongDistance ? `Oui (${longDistanceCities || 'Non spécifié'})` : 'Non (Local)',
          Véhicule: selectedVehicleData.name,
          Passagers: `Jusqu'à ${selectedVehicleData.maxPassengers} passagers (Capacité max)`,
          Bagages: `${selectedVehicleData.maxLuggage} valises max`,
          'Numéro de vol': isAirportTrip && flightNumber ? flightNumber : '—',
          'Instructions chauffeur': driverInstructions.length > 0
            ? driverInstructions.map((id) => DRIVER_INSTRUCTIONS_LIST.find((item) => item.id === id)?.title || id).join(', ')
            : 'Standards VIP',
          'Précisions particulières': specialRequests || 'Aucune',
          Prénom: firstName,
          Nom: lastName,
          Email: email,
          Téléphone: phone,
          Société: company || '—',
          Tarif: 'Sur devis',
          'Action client': 'Demande de devis',
        };

        // Add to local admin store
        try {
          useBookingsStore.getState().addBooking({
            serviceType: service,
            vehicle: selectedVehicleData.name,
            vehicleId: selectedVehicle,
            pickup,
            destination: service === 'transfer' ? destination : (hasLongDistance ? longDistanceCities : 'Local'),
            date: service === 'hourly' ? scheduleDays[0]?.date || date : date,
            time: service === 'hourly' ? scheduleDays[0]?.startTime || time : time,
            duration: service === 'hourly' ? `${scheduleDays.length} jours / ${totalScheduleHours}h` : '',
            notes: service === 'hourly' ? `Planning:\n${formattedSchedule}\nLongue distance: ${hasLongDistance ? (longDistanceCities || 'Oui') : 'Non'}` : '',
            passengers: selectedVehicleData.maxPassengers || 1,
            luggage: selectedVehicleData.maxLuggage || 0,
            flightNumber: isAirportTrip ? flightNumber : '',
            client: {
              firstName,
              lastName,
              email,
              phone,
              company,
            },
            price: calculatedPrice?.totalPrice || 0,
            status: 'confirmed',
          });
        } catch (e) {}
      }

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus('success');

        const quoteRef = `SELY-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const quoteData = {
          ref: quoteRef,
          createdAt: new Date().toISOString(),
          service: service,
          serviceLabel: service === 'transfer'
            ? 'Transfert Point A à Point B'
            : (service === 'hourly'
                ? `Mise à disposition (${scheduleDays.length} j · ${totalScheduleHours}h)`
                : 'Demande Sur-Mesure & Événements'),
          cityName: cityName,
          vehicleName: selectedVehicleData?.name,
          vehicleImage: selectedVehicleData?.image,
          vehicleCategory: selectedVehicleData?.category,
          pickup: pickup,
          destination: service === 'transfer'
            ? destination
            : (hasLongDistance ? (longDistanceCities || 'Longue distance') : 'Local & Agglomération'),
          date: service === 'hourly' ? (scheduleDays[0]?.date || date) : date,
          time: service === 'hourly' ? (scheduleDays[0]?.startTime || time) : time,
          scheduleDays: service === 'hourly' ? scheduleDays : null,
          totalHours: service === 'hourly' ? totalScheduleHours : null,
          passengers: selectedVehicleData?.maxPassengers,
          luggage: selectedVehicleData?.maxLuggage,
          flightNumber: isAirportTrip && flightNumber ? flightNumber : null,
          driverInstructions: driverInstructions.length > 0
            ? driverInstructions.map((id) => DRIVER_INSTRUCTIONS_LIST.find((item) => item.id === id)?.title || id)
            : [],
          specialRequests: specialRequests || null,
          client: {
            firstName,
            lastName,
            email,
            phone,
            company: company || '',
          },
          bespokeText: service === 'bespoke' ? bespokeText : null,
          estimatedPrice: calculatedPrice?.totalPrice || null,
        };

        try {
          sessionStorage.setItem('sely_latest_quote', JSON.stringify(quoteData));
        } catch (err) {}

        navigate(getCityPath('/reservation-succes'), { state: quoteData });
      } else {
        setStatus('error');
        setErrorMessage("Une erreur est survenue lors de l'envoi de votre réservation. Veuillez nous joindre directement par téléphone.");
      }
    } catch (e) {
      setStatus('error');
      setErrorMessage("Une erreur réseau est survenue. Veuillez vérifier votre connexion.");
    }
  };

  // Step counter — new 4-step tunnel
  const displayedStep = step;

  const displayedTotalSteps = useMemo(() => {
    if (service === 'bespoke') return 2;
    return 4; // transfer and hourly both have 4 steps
  }, [service]);

  const progressPct = useMemo(() => {
    if (step === 0) return 0;
    return Math.min(100, Math.round((displayedStep / displayedTotalSteps) * 100));
  }, [step, displayedStep, displayedTotalSteps]);

  // Email format validation
  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() || '');
  }, [email]);

  // Framer Motion slide variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeIn' },
    }),
  };

  if (step <= 1) {
    return (
      <div className={`${styles.voyageScreenWrapper} ${isRtl ? styles.rtl : ''}`}>
        {/* Top bar: Back circle button + Serif Title */}
        <header className={styles.voyageHeader}>
          <button
            type="button"
            onClick={goToPrevStep}
            className={styles.backCircleBtn}
            aria-label="Retour à l'accueil"
          >
            <ChevronLeft size={22} strokeWidth={1.8} />
          </button>
          <h1 className={styles.voyageTitle}>
            {t('tunnel.reserve_title', 'Réservez un voyage')}
          </h1>
        </header>

        {/* Capsule Pills Row */}
        <div style={{ position: 'relative', marginBottom: '1.75rem' }}>
          <div className={styles.pillsRow}>
            {/* Pill 1: Aller simple / Chauffeur à l'heure */}
            <button
              type="button"
              onClick={() => {
                setServiceMenuOpen(!serviceMenuOpen);
                setUrgentModalOpen(false);
              }}
              className={styles.pillSelectorBtn}
              id="service-selector-pill"
            >
              <Route size={16} strokeWidth={1.8} />
              <span>{service === 'hourly' ? t('tunnel.service_hourly_label', 'Chauffeur à l’heure') : t('tunnel.service_transfer_label', 'Aller simple')}</span>
              <ChevronDown size={14} className={styles.pillChevron} />
            </button>

            {/* Pill 2: Demande spécifique urgente */}
            <button
              type="button"
              onClick={() => {
                setUrgentModalOpen(true);
                setServiceMenuOpen(false);
              }}
              className={styles.pillSelectorBtn}
              id="urgent-request-pill"
            >
              <Sparkles size={16} strokeWidth={1.8} style={{ color: '#b8903c' }} />
              <span>{t('tunnel.urgent_pill_label', 'Demande spécifique urgente')}</span>
              <ChevronDown size={14} className={styles.pillChevron} />
            </button>
          </div>

          {/* Service Dropdown Popover */}
          <AnimatePresence>
            {serviceMenuOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 1001 }}
                  onClick={() => setServiceMenuOpen(false)}
                />
                <motion.div
                  className={styles.popoverMenu}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                >
                  <button
                    type="button"
                    className={`${styles.popoverMenuItem} ${service === 'transfer' ? styles.popoverMenuItemActive : ''}`}
                    onClick={() => {
                      setService('transfer');
                      setServiceMenuOpen(false);
                    }}
                  >
                    <div className={styles.sugIconCircle}>
                      <Route size={16} />
                    </div>
                    <div className={styles.popoverMenuItemText}>
                      <strong>{t('tunnel.service_transfer_label', 'Aller simple')}</strong>
                      <span>{t('tunnel.service_transfer_desc', 'Transfert direct point à point')}</span>
                    </div>
                    {service === 'transfer' && <Check size={16} />}
                  </button>

                  <button
                    type="button"
                    className={`${styles.popoverMenuItem} ${service === 'hourly' ? styles.popoverMenuItemActive : ''}`}
                    onClick={() => {
                      setService('hourly');
                      setServiceMenuOpen(false);
                    }}
                  >
                    <div className={styles.sugIconCircle}>
                      <Clock size={16} />
                    </div>
                    <div className={styles.popoverMenuItemText}>
                      <strong>{t('tunnel.service_hourly_label', 'Chauffeur à l’heure')}</strong>
                      <span>{t('tunnel.service_hourly_desc', 'Mise à disposition horaire ou à la journée')}</span>
                    </div>
                    {service === 'hourly' && <Check size={16} />}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Underline Inputs Container */}
        <div className={styles.inputsContainer}>
          {/* Pickup field */}
          <div className={styles.fieldBlock}>
            <label className={styles.fieldLabel}>
              {service === 'hourly' ? t('tunnel.pickup_hourly_label', 'Point de prise en charge') : t('tunnel.pickup_label', 'Lieu de prise en charge')}
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                className={styles.underlineInputClean}
                placeholder={t('tunnel.pickup_placeholder', 'Aéroport, adresse, hôtel, ...')}
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                onFocus={() => setActiveInputFocus('pickup')}
                id="pickup-input"
                autoComplete="off"
                style={{ paddingRight: pickup ? '2rem' : '0' }}
              />
              {pickup && (
                <button
                  type="button"
                  onClick={() => setPickup('')}
                  className={styles.clearBtn}
                  style={{ position: 'absolute', right: 0 }}
                  aria-label="Effacer le départ"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Pickup temporary autocomplete / suggestions dropdown */}
            {activeInputFocus === 'pickup' && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 140 }}
                  onClick={() => setActiveInputFocus(null)}
                />
                <div className={styles.fieldSuggestionsDropdown}>
                  {pickupAutocomplete.suggestions && pickupAutocomplete.suggestions.length > 0 ? (
                    pickupAutocomplete.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setPickup(s.label);
                          if (s.coordinates) setPickupCoords(s.coordinates);
                          pickupAutocomplete.setSuggestions([]);
                          setActiveInputFocus(null);
                        }}
                        className={styles.fieldSuggestionItem}
                      >
                        <div className={styles.sugIconCircle}>
                          <MapPin size={16} />
                        </div>
                        <div className={styles.sugDetails}>
                          <span className={styles.sugMain}>{s.label}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    getFallbackSuggestions(pickup).map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setPickup(item.label);
                          setActiveInputFocus(null);
                        }}
                        className={styles.fieldSuggestionItem}
                      >
                        <div className={styles.sugIconCircle}>
                          {item.category.includes('Aéroport') || item.category.includes('Aviation') ? (
                            <PlaneTakeoff size={16} />
                          ) : (
                            <MapPin size={16} />
                          )}
                        </div>
                        <div className={styles.sugDetails}>
                          <span className={styles.sugMain}>{item.label}</span>
                          <span className={styles.sugSub}>{item.category}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Floating Swap Button */}
          <button
            type="button"
            onClick={handleSwapAddresses}
            className={styles.swapBtnFloating}
            aria-label="Inverser les adresses"
            title="Inverser départ et destination"
          >
            <ArrowUpDown size={17} strokeWidth={1.8} />
          </button>

          {/* Destination field */}
          <div className={styles.fieldBlock}>
            <label className={styles.fieldLabel}>
              {service === 'hourly' ? t('tunnel.dest_hourly_label', 'Zone de déplacement (optionnel)') : t('tunnel.dest_label', 'Destination')}
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                className={styles.underlineInputClean}
                placeholder={service === 'hourly' ? t('tunnel.dest_hourly_placeholder', 'Paris & Île-de-France, province...') : t('tunnel.dest_placeholder', 'Où aller ?')}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setActiveInputFocus('destination')}
                id="destination-input"
                autoComplete="off"
                style={{ paddingRight: destination ? '2rem' : '0' }}
              />
              {destination && (
                <button
                  type="button"
                  onClick={() => setDestination('')}
                  className={styles.clearBtn}
                  style={{ position: 'absolute', right: 0 }}
                  aria-label="Effacer la destination"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Destination temporary autocomplete / suggestions dropdown */}
            {activeInputFocus === 'destination' && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 140 }}
                  onClick={() => setActiveInputFocus(null)}
                />
                <div className={styles.fieldSuggestionsDropdown}>
                  {destAutocomplete.suggestions && destAutocomplete.suggestions.length > 0 ? (
                    destAutocomplete.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setDestination(s.label);
                          if (s.coordinates) setDestCoords(s.coordinates);
                          destAutocomplete.setSuggestions([]);
                          setActiveInputFocus(null);
                        }}
                        className={styles.fieldSuggestionItem}
                      >
                        <div className={styles.sugIconCircle}>
                          <MapPin size={16} />
                        </div>
                        <div className={styles.sugDetails}>
                          <span className={styles.sugMain}>{s.label}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    getFallbackSuggestions(destination).map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setDestination(item.label);
                          setActiveInputFocus(null);
                        }}
                        className={styles.fieldSuggestionItem}
                      >
                        <div className={styles.sugIconCircle}>
                          {item.category.includes('Aéroport') || item.category.includes('Aviation') ? (
                            <PlaneTakeoff size={16} />
                          ) : (
                            <MapPin size={16} />
                          )}
                        </div>
                        <div className={styles.sugDetails}>
                          <span className={styles.sugMain}>{item.label}</span>
                          <span className={styles.sugSub}>{item.category}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Transfer: Date & Time Picker */}
        {service === 'transfer' && (
          <div className={styles.datetimeSection}>
            <LuxuryDateTimePicker
              selectedDate={date}
              onDateChange={setDate}
              selectedTime={time}
              onTimeChange={setTime}
              isEn={i18n?.language === 'en'}
              minDateISO={todayISO}
            />
          </div>
        )}

        {/* Hourly: Multi-Day & Schedule Selector */}
        {service === 'hourly' && (
          <div className={styles.hourlyDaysSection}>
            {/* Number of days row */}
            <div className={styles.daysStepperRow}>
              <div>
                <span className={styles.hourlySectionTitle}>Mise à disposition</span>
                <p className={styles.hourlySectionSubtitle}>Choisissez le nombre de jours et vos horaires</p>
              </div>

              <div className={styles.stepperControl}>
                <button
                  type="button"
                  className={styles.stepperBtn}
                  onClick={() => setNumberOfDays(scheduleDays.length - 1)}
                  disabled={scheduleDays.length <= 1}
                  aria-label="Moins de jours"
                >
                  -
                </button>
                <span className={styles.stepperCount}>
                  {scheduleDays.length} {scheduleDays.length > 1 ? 'jours' : 'jour'}
                </span>
                <button
                  type="button"
                  className={styles.stepperBtn}
                  onClick={() => setNumberOfDays(scheduleDays.length + 1)}
                  aria-label="Plus de jours"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quick preset chips */}
            <div className={styles.quickDaysPills}>
              {[1, 2, 3, 5, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNumberOfDays(num)}
                  className={`${styles.quickDayPill} ${scheduleDays.length === num ? styles.quickDayPillActive : ''}`}
                >
                  {num === 7 ? '1 semaine' : `${num} ${num > 1 ? 'jours' : 'jour'}`}
                </button>
              ))}
            </div>

            {/* Days list */}
            <div className={styles.hourlyDaysList}>
              {scheduleDays.map((d, index) => {
                return (
                  <div key={d.id} className={styles.hourlyDayCard}>
                    <div className={styles.hourlyDayHeader}>
                      <div className={styles.hourlyDayBadge}>
                        <span>Jour {index + 1}</span>
                        <span className={styles.hourlyDayDateDesc}>· {formatDayShort(d.date)}</span>
                      </div>
                      {scheduleDays.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeScheduleDay(d.id)}
                          className={styles.removeDayMiniBtn}
                        >
                          <Trash2 size={13} />
                          <span>Retirer</span>
                        </button>
                      )}
                    </div>

                    {/* Date and start time row */}
                    <div className={styles.dayDateTimeRow}>
                      <div className={styles.dayDateCol}>
                        <label className={styles.miniFieldLabel}>Date du jour {index + 1}</label>
                        <input
                          type="date"
                          min={todayISO}
                          value={d.date}
                          onChange={(e) => {
                            if (e.target.value) updateDayDate(d.id, e.target.value);
                          }}
                          className={styles.nativeDateClean}
                        />
                      </div>
                      <div className={styles.dayTimeCol}>
                        <label className={styles.miniFieldLabel}>Heure de départ</label>
                        <input
                          type="time"
                          value={d.startTime || '09:00'}
                          onChange={(e) => updateDayStartTime(d.id, e.target.value)}
                          className={styles.nativeTimeClean}
                        />
                      </div>
                    </div>

                    {/* Hours pill selector */}
                    <div className={styles.dayHoursRow}>
                      <label className={styles.miniFieldLabel}>Durée de la journée</label>
                      <div className={styles.durationScrollStrip}>
                        {[3, 4, 6, 8, 10, 12, 24].map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setDayPresetHours(d.id, h)}
                            className={`${styles.durationScrollPill} ${(d.hours || 8) === h ? styles.durationPillActive : ''}`}
                          >
                            <span className={styles.durationPillNumber}>{h}h</span>
                            {h === 8 && <span className={styles.durationPillTag}>1 jour</span>}
                            {h === 4 && <span className={styles.durationPillTag}>1/2 j</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total summary banner */}
            <div className={styles.hourlyTotalBanner}>
              <Calendar size={16} />
              <span>
                Total : <strong>{scheduleDays.length} {scheduleDays.length > 1 ? 'jours' : 'jour'}</strong> · <strong>{totalScheduleHours}h</strong> de mise à disposition
              </span>
            </div>
          </div>
        )}
        {/* Action Button: Choisir mon véhicule */}
        <button
          type="button"
          disabled={
            !pickup ||
            pickup.trim().length < 2 ||
            (service === 'transfer' && (!destination || destination.trim().length < 2))
          }
          onClick={goToNextStep}
          className={styles.continueBtnLuxury}
          id="voyage-continue-btn"
        >
          <span>{t('tunnel.choose_vehicle', 'Choisir mon véhicule')}</span>
          <ArrowRight size={18} />
        </button>

        {/* Urgent Request Modal */}
        <AnimatePresence>
          {urgentModalOpen && (
            <>
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(3px)',
                  zIndex: 1001,
                }}
                onClick={() => setUrgentModalOpen(false)}
              />
              <motion.div
                className={styles.urgentModal}
                initial={{ opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
                animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                exit={{ opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.urgentHeader}>
                  <div className={styles.urgentTitleRow}>
                    <div className={styles.urgentBadgeIcon}>
                      <Sparkles size={18} />
                    </div>
                    <h3>{t('tunnel.urgent_modal_title', 'Demande spécifique urgente')}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUrgentModalOpen(false)}
                    className={styles.clearBtn}
                    aria-label="Fermer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className={styles.urgentText}>
                  {t('tunnel.urgent_modal_desc', 'Besoin immédiat dans l’heure, convoi de berlines officielles, sécurité rapprochée ou requête sur-mesure ? Notre régie opérationnelle VIP est active 24h/24 et 7j/7.')}
                </p>

                <div className={styles.urgentActions}>
                  <a
                    href="https://wa.me/33184805676?text=Bonjour%20SELY%20Privé,%20j'ai%20une%20demande%20spécifique%20urgente."
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.urgentWaBtn}
                  >
                    <MessageSquare size={17} />
                    <span>{t('tunnel.urgent_wa_cta', 'Échanger directement sur WhatsApp')}</span>
                  </a>

                  <a href="tel:+33184805676" className={styles.urgentPhoneBtn}>
                    <Phone size={17} />
                    <span>{t('tunnel.urgent_phone_cta', 'Appeler la permanence (+33 1 84 80 56 76)')}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setUrgentModalOpen(false);
                      navigate(getCityPath('/demande-specifique'));
                    }}
                    className={styles.urgentBespokeLink}
                  >
                    {t('tunnel.urgent_bespoke_cta', 'Remplir le formulaire sur-mesure détaillé →')}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }


  return (
    <div className={styles.funnelOverlay}>
      {/* Top thin progress bar */}
      {step > 0 && (
        <div className={styles.progressTrack}>
          <motion.div
            className={styles.progressIndicator}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Top Header Controls: Back & Close */}
      <header className={styles.funnelHeader}>
        <div className={styles.headerLeft}>
          {step > 0 ? (
            <button
              type="button"
              onClick={goToPrevStep}
              className={styles.navBackBtn}
              aria-label="Étape précédente"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
              <span>{t('funnel.back', 'Retour')}</span>
            </button>
          ) : (
            <div className={styles.brandMark}>
              <span className={styles.brandS}>S</span>
              <span className={styles.brandWordmark}>SELY PRIVÉ</span>
            </div>
          )}
        </div>

        {step > 0 && (
          <div className={styles.stepCounter}>
            <span>{service === 'transfer' ? t('tunnel.service_transfer', 'Transfert') : service === 'hourly' ? t('tunnel.service_hourly', 'Chauffeur à la journée') : t('tunnel.service_bespoke', 'Sur-mesure')}</span>
          </div>
        )}

        <div className={styles.headerRight}>
          <LanguageSelector variant="tunnel" />
          <button
            type="button"
            onClick={() => navigate(getCityPath('/'))}
            className={styles.navCloseBtn}
            aria-label="Quitter le tunnel"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Main Multi-Step Content Area */}
      <main className={styles.funnelMain}>
        <AnimatePresence mode="wait" custom={direction}>

          {/* ══════════════════════════════════════════════════════════════════════════
              STEP 1 : ITINÉRAIRE + DATE (ALL-IN-ONE)
              Transfer: départ + destination + date/heure
              Hourly: point de départ + planning + date
              ══════════════════════════════════════════════════════════════════════════ */}
          {((service === 'transfer' && step === 1) || (service === 'hourly' && step === 1)) && (
            <motion.div
              key="step-1-merged"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.screenContainer}
            >
              <div className={styles.screenIntro}>
                <span className={styles.microBadge}>
                  {service === 'transfer' ? t('tunnel.step1_badge_transfer', 'VOTRE TRAJET') : t('tunnel.step1_badge_hourly', 'CHAUFFEUR À LA JOURNÉE')}
                </span>
                <h2 className={styles.screenTitle}>
                  {service === 'transfer' ? t('tunnel.step1_title_transfer', 'Configurez votre transfert') : t('tunnel.step1_title_hourly', 'Configurez votre journée chauffeur')}
                </h2>
                <p className={styles.screenSubtitle}>
                  {service === 'transfer' ? t('tunnel.step1_sub_transfer', 'Renseignez votre départ, destination, date et heure en une seule fois.') : t('tunnel.step1_sub_hourly', 'Indiquez votre zone de départ, le nombre de jours et les horaires souhaités.')}
                </p>
              </div>

              <div className={styles.mergedFormStack}>

                {/* ── Pickup ── */}
                <div className={styles.mergedFieldGroup}>
                  <label className={styles.mergedFieldLabel}>
                    <MapPin size={15} />
                    <span>{service === 'transfer' ? t('tunnel.pickup_label', 'Lieu de départ *') : t('tunnel.pickup_hourly_label', 'Point de rendez-vous *')}</span>
                  </label>
                  <div className={styles.searchBar}>
                    <MapPin size={18} className={styles.inputIcon} />
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder={
                        service === 'transfer'
                          ? 'Adresse, aéroport, hôtel, palace...'
                          : 'Hôtel, palace, bureau, adresse parisienne...'
                      }
                      className={styles.luxuryInput}
                      id="pickup-input"
                    />
                    {pickup && (
                      <button type="button" onClick={() => setPickup('')} className={styles.clearBtn}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {pickupAutocomplete.suggestions && pickupAutocomplete.suggestions.length > 0 && (
                    <div className={styles.suggestionsBox}>
                      {pickupAutocomplete.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPickup(s.label);
                            if (s.coordinates) setPickupCoords(s.coordinates);
                            pickupAutocomplete.setSuggestions([]);
                          }}
                          className={styles.suggestionItem}
                        >
                          <MapPin size={16} className={styles.sugIcon} />
                          <span className={styles.sugLabel}>{s.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Quick suggestions */}
                  {!pickup && (
                    <div className={styles.shortcutsGrid} style={{ marginTop: '0.5rem' }}>
                      {LUXURY_SUGGESTIONS.slice(0, 4).map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPickup(item.label)}
                          className={styles.shortcutChip}
                        >
                          <span className={styles.chipCat}>{item.category}</span>
                          <span className={styles.chipLabel}>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Destination (Transfer only) ── */}
                {service === 'transfer' && (
                  <div className={styles.mergedFieldGroup}>
                    <label className={styles.mergedFieldLabel}>
                      <Navigation size={15} />
                      <span>{t('tunnel.dest_label', 'Destination *')}</span>
                    </label>
                    <div className={styles.searchBar}>
                      <Navigation size={18} className={styles.inputIcon} />
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Adresse d'arrivée, aéroport, restaurant, hôtel..."
                        className={styles.luxuryInput}
                        id="destination-input"
                      />
                      {destination && (
                        <button type="button" onClick={() => setDestination('')} className={styles.clearBtn}>
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    {destAutocomplete.suggestions && destAutocomplete.suggestions.length > 0 && (
                      <div className={styles.suggestionsBox}>
                        {destAutocomplete.suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setDestination(s.label);
                              if (s.coordinates) setDestCoords(s.coordinates);
                              destAutocomplete.setSuggestions([]);
                            }}
                            className={styles.suggestionItem}
                          >
                            <MapPin size={16} className={styles.sugIcon} />
                            <span className={styles.sugLabel}>{s.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Date + Time (Transfer) ── */}
                {service === 'transfer' && (
                  <div className={styles.mergedFieldGroup}>
                    <label className={styles.mergedFieldLabel}>
                      <Calendar size={15} />
                      <span>{t('tunnel.datetime_label', 'Date et heure de prise en charge *')}</span>
                    </label>
                    <LuxuryDateTimePicker
                      selectedDate={date}
                      onDateChange={setDate}
                      selectedTime={time}
                      onTimeChange={setTime}
                      isEn={i18n?.language === 'en'}
                      minDateISO={todayISO}
                    />
                  </div>
                )}

                {/* ── Planning Hourly (inline, simplified) ── */}
                {service === 'hourly' && (
                  <div className={styles.mergedFieldGroup}>
                    <label className={styles.mergedFieldLabel}>
                      <Calendar size={15} />
                      <span>Planning des journées</span>
                    </label>
                    <div className={styles.scheduleContainer}>
                      <div className={styles.multiDaysList}>
                        {scheduleDays.map((d, index) => {
                          const isToday = d.date === todayISO;
                          return (
                            <div key={d.id} className={styles.dayCard}>
                              <div className={styles.dayCardHeader}>
                                <div className={styles.dayCardHeaderLeft}>
                                  <span className={styles.dayBadge}>Jour {index + 1}</span>
                                  <span className={styles.dayHeaderDateDesc}>· {formatDayShort(d.date)}</span>
                                </div>
                                {scheduleDays.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeScheduleDay(d.id)}
                                    className={styles.removeDayMiniBtn}
                                  >
                                    <Trash2 size={13} />
                                    <span>Retirer</span>
                                  </button>
                                )}
                              </div>

                              <div className={styles.daySubBlock}>
                                <div className={styles.dateTwoButtonsRow}>
                                  <button
                                    type="button"
                                    onClick={() => updateDayDate(d.id, todayISO)}
                                    className={`${styles.dateSelectBtn} ${isToday ? styles.dateSelectActive : ''}`}
                                  >
                                    <span>Aujourd'hui</span>
                                  </button>
                                  <label
                                    className={`${styles.dateSelectBtn} ${!isToday ? styles.dateSelectActive : ''}`}
                                    onClick={(e) => {
                                      const input = e.currentTarget.querySelector('input');
                                      if (input && typeof input.showPicker === 'function') {
                                        try { input.showPicker(); } catch (err) {}
                                      }
                                    }}
                                  >
                                    <Calendar size={13} />
                                    <span>{!isToday ? formatDayShort(d.date) : 'Autre date'}</span>
                                    <input
                                      type="date"
                                      min={todayISO}
                                      value={d.date}
                                      onChange={(e) => { if (e.target.value) updateDayDate(d.id, e.target.value); }}
                                      className={styles.nativeDateOverlay}
                                    />
                                  </label>
                                </div>
                              </div>

                              <div className={styles.daySubBlock}>
                                <div className={styles.durationScrollWrapper}>
                                  <div className={styles.durationScrollStrip}>
                                    {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 24].map((h) => (
                                      <button
                                        key={h}
                                        type="button"
                                        onClick={() => setDayPresetHours(d.id, h)}
                                        className={`${styles.durationScrollPill} ${(d.hours || 8) === h ? styles.durationPillActive : ''}`}
                                      >
                                        <span className={styles.durationPillNumber}>{h}h</span>
                                        {h === 8 && <span className={styles.durationPillTag}>1 jour</span>}
                                        {h === 4 && <span className={styles.durationPillTag}>1/2 j</span>}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className={styles.addScheduleRow}>
                        <button type="button" onClick={addScheduleDay} className={styles.addDayActionBtn}>
                          <Plus size={15} />
                          <span>Ajouter une journée</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              <div className={styles.screenFooter}>
                <button
                  type="button"
                  disabled={
                    !pickup || pickup.trim().length < 3 ||
                    (service === 'transfer' && (!destination || destination.trim().length < 3))
                  }
                  onClick={goToNextStep}
                  className={styles.nextStepBtn}
                  id="step1-continue-btn"
                >
                  <span>{t('tunnel.choose_vehicle_cta', 'Choisir mon véhicule')}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              TRANSFER & HOURLY — STEP : VEHICLE SELECTION
              ══════════════════════════════════════════════════════════════════════════ */}
          {((service === 'transfer' && step === 2) || (service === 'hourly' && step === 2)) && (
            <motion.div
              key="step2-vehicles"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.screenContainer}
            >
              <div className={styles.screenIntro}>
                <span className={styles.microBadge}>NOTRE FLOTTE DEVIS</span>
                <h2 className={styles.screenTitle}>Sélectionnez votre véhicule</h2>
                <p className={styles.screenSubtitle}>Prestation tout inclus (chauffeur dédié, carburant, péages et accueil personnalisé).</p>
              </div>

              {/* Category Filter Tabs */}
              <div className={styles.classFilterTabs}>
                <button
                  type="button"
                  onClick={() => setFleetMode('standard')}
                  className={`${styles.classFilterTab} ${fleetMode === 'standard' ? styles.classFilterActive : ''}`}
                >
                  <span>Formules Devis (3)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFleetMode('large-groups')}
                  className={`${styles.classFilterTab} ${fleetMode === 'large-groups' ? styles.classFilterActive : ''}`}
                >
                  <span>Large Groups (7-19)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFleetMode('prestige')}
                  className={`${styles.classFilterTab} ${fleetMode === 'prestige' ? styles.classFilterActive : ''}`}
                >
                  <span>Prestige Collection</span>
                </button>
              </div>

              {/* ── MODE 1: STANDARD 3 QUOTE CLASSES (Blacklane UX Logic) ── */}
              {fleetMode === 'standard' && (
                <div style={{ marginTop: '1.25rem' }}>
                  <div className={styles.vehiclesListGrid}>
                    {QUOTE_CLASSES.map((qc) => {
                      const isSelected = selectedVehicle === qc.id || (selectedVehicleData && selectedVehicleData.id === qc.id);
                      return (
                        <div
                          key={qc.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedVehicle(qc.id);
                            goToNextStep();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedVehicle(qc.id);
                              goToNextStep();
                            }
                          }}
                          className={`${styles.vehicleSelectCard} ${isSelected ? styles.vehicleSelected : ''}`}
                        >
                          <div className={styles.vehicleImgBox}>
                            <img src={qc.image} alt={qc.name} className={styles.vehicleImg} />
                            {isSelected && (
                              <div className={styles.vehicleCheckBadge}>
                                <Check size={16} />
                              </div>
                            )}
                            <span className={styles.vehicleBadgeOverlay}>
                              {qc.vehicleTag}
                            </span>
                          </div>

                          <div className={styles.vehicleInfoBox}>
                            <div className={styles.vehicleTopRow}>
                              <div className={styles.vehicleTitleGroup}>
                                <h4 className={styles.vehicleName} style={{ fontSize: '1.22rem', fontWeight: 600 }}>{qc.name}</h4>
                                <div className={styles.categorySubtitleLine}>
                                  {qc.subtitle}
                                </div>
                                {service === 'hourly' && (
                                  <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 500, marginTop: '0.2rem' }}>
                                    Planning : {scheduleDays.length} jour{scheduleDays.length > 1 ? 's' : ''} · {totalScheduleHours}h au total
                                  </div>
                                )}
                                <div className={styles.vehicleCapacityRow} style={{ marginTop: '0.45rem' }}>
                                  <span className={styles.vehicleCapacityBadge}>
                                    <Users size={13} strokeWidth={2} />
                                    <span>{qc.passengers}</span>
                                  </span>
                                  <span className={styles.vehicleCapacityBadge}>
                                    <Luggage size={13} strokeWidth={2} />
                                    <span>{qc.luggage}</span>
                                  </span>
                                </div>
                              </div>
                              <div className={styles.vehicleQuoteBox}>
                                <span className={styles.vehiclePrice}>
                                  Sur devis
                                </span>
                                <span className={styles.vehiclePriceNote}>Étude personnalisée</span>
                              </div>
                            </div>

                            <p className={styles.vehicleDesc}>{qc.desc}</p>

                            <div className={styles.vehicleQuotePills}>
                              <span className={styles.quotePill}>Devis sous 30 min</span>
                              <span className={styles.quotePill}>Chauffeur dédié</span>
                              <span className={styles.quotePill}>Wi-Fi & Rafraîchissements</span>
                            </div>

                            <button
                              type="button"
                              className={styles.chooseVehiclePrimaryBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVehicle(qc.id);
                                goToNextStep();
                              }}
                            >
                              <span>Choisir {qc.name}</span>
                              <ArrowRight size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Two Special Categories Discovery Banners */}
                  <div className={styles.specialCategoriesSection}>
                    <div className={styles.specialCategoryDivider}>
                      <span>Ou découvrez nos catégories spéciales</span>
                    </div>

                    <div className={styles.specialCategoriesGrid}>
                      {/* Large Groups Card */}
                      <div
                        className={styles.specialCategoryCard}
                        onClick={() => setFleetMode('large-groups')}
                        role="button"
                        tabIndex={0}
                      >
                        <div className={styles.specialCategoryHeader}>
                          <div className={styles.specialCategoryIconBox}>
                            <Users size={20} />
                          </div>
                          <div>
                            <span className={styles.specialCategoryTag}>Catégorie Spéciale</span>
                            <h4 className={styles.specialCategoryTitle}>Large Groups (7 à 19 places)</h4>
                          </div>
                        </div>
                        <p className={styles.specialCategoryDesc}>
                          Mercedes Sprinter de 7 à 19 places pour délégations, mariages et transport d’équipes. Choisissez précisément la capacité souhaitée.
                        </p>
                        <div className={styles.specialCapacityPills}>
                          <span>7 places Lounge VIP</span>
                          <span>14 places Minibus</span>
                          <span>19 places Tourisme</span>
                        </div>
                        <div className={styles.specialCategoryCta}>
                          <span>Choisir selon la capacité (7 à 19 pl.)</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>

                      {/* Prestige Collection Card */}
                      <div
                        className={styles.specialCategoryCard}
                        onClick={() => setFleetMode('prestige')}
                        role="button"
                        tabIndex={0}
                      >
                        <div className={styles.specialCategoryHeader}>
                          <div className={styles.specialCategoryIconBox}>
                            <Sparkles size={20} style={{ color: '#b8903c' }} />
                          </div>
                          <div>
                            <span className={styles.specialCategoryTag} style={{ color: '#b8903c' }}>Catégorie Spéciale</span>
                            <h4 className={styles.specialCategoryTitle}>Prestige Collection</h4>
                          </div>
                        </div>
                        <p className={styles.specialCategoryDesc}>
                          Mercedes-Maybach, Rolls-Royce Phantom & Cullinan, Cadillac Escalade ESV, Range Rover. Sélectionnez votre véhicule d’exception précis.
                        </p>
                        <div className={styles.specialCapacityPills}>
                          <span>Mercedes-Maybach</span>
                          <span>Rolls-Royce</span>
                          <span>Escalade</span>
                          <span>Range Rover</span>
                        </div>
                        <div className={styles.specialCategoryCta}>
                          <span>Choisir précisément le véhicule</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── MODE 2: LARGE GROUPS (7 à 19 places) ── */}
              {fleetMode === 'large-groups' && (
                <div style={{ marginTop: '1.25rem' }}>
                  <div className={styles.specialHeaderBanner}>
                    <button
                      type="button"
                      className={styles.backToStandardBtn}
                      onClick={() => setFleetMode('standard')}
                    >
                      ← Retour aux 3 formules principales
                    </button>
                    <h3 className={styles.specialSectionTitle}>Large Groups : Sprinter de 7 à 19 places</h3>
                    <p className={styles.specialSectionSub}>
                      Sélectionnez la configuration adaptée à la taille de votre groupe et au volume de vos bagages.
                    </p>

                    <div className={styles.capacityFilterBar}>
                      <button
                        type="button"
                        onClick={() => setLargeGroupCapacity('all')}
                        className={`${styles.capacityFilterBtn} ${largeGroupCapacity === 'all' ? styles.capacityFilterBtnActive : ''}`}
                      >
                        Toutes les capacités
                      </button>
                      <button
                        type="button"
                        onClick={() => setLargeGroupCapacity('7')}
                        className={`${styles.capacityFilterBtn} ${largeGroupCapacity === '7' ? styles.capacityFilterBtnActive : ''}`}
                      >
                        7 places (Lounge VIP)
                      </button>
                      <button
                        type="button"
                        onClick={() => setLargeGroupCapacity('14')}
                        className={`${styles.capacityFilterBtn} ${largeGroupCapacity === '14' ? styles.capacityFilterBtnActive : ''}`}
                      >
                        14 places (Minibus Affaires)
                      </button>
                      <button
                        type="button"
                        onClick={() => setLargeGroupCapacity('19')}
                        className={`${styles.capacityFilterBtn} ${largeGroupCapacity === '19' ? styles.capacityFilterBtnActive : ''}`}
                      >
                        19 places (Grand Tourisme)
                      </button>
                    </div>
                  </div>

                  <div className={styles.vehiclesListGrid}>
                    {LARGE_GROUPS_VEHICLES.filter(v => largeGroupCapacity === 'all' || v.capacityTag.includes(largeGroupCapacity)).map((v) => {
                      const isSelected = selectedVehicle === v.id;
                      return (
                        <div
                          key={v.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedVehicle(v.id);
                            goToNextStep();
                          }}
                          className={`${styles.vehicleSelectCard} ${isSelected ? styles.vehicleSelected : ''}`}
                        >
                          <div className={styles.vehicleImgBox}>
                            <img src={v.image} alt={v.name} className={styles.vehicleImg} />
                            {isSelected && (
                              <div className={styles.vehicleCheckBadge}>
                                <Check size={16} />
                              </div>
                            )}
                            <span className={styles.vehicleBadgeOverlay}>{v.capacityTag}</span>
                          </div>

                          <div className={styles.vehicleInfoBox}>
                            <div className={styles.vehicleTopRow}>
                              <div className={styles.vehicleTitleGroup}>
                                <h4 className={styles.vehicleName}>{v.name}</h4>
                                <div className={styles.categorySubtitleLine}>{v.subtitle}</div>
                                {service === 'hourly' && (
                                  <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 500, marginTop: '0.15rem' }}>
                                    Planning : {scheduleDays.length} jour{scheduleDays.length > 1 ? 's' : ''} · {totalScheduleHours}h au total
                                  </div>
                                )}
                                <div className={styles.vehicleCapacityRow} style={{ marginTop: '0.4rem' }}>
                                  <span className={styles.vehicleCapacityBadge}>
                                    <Users size={13} strokeWidth={2} />
                                    <span>Jusqu'à {v.maxPassengers} passagers</span>
                                  </span>
                                  <span className={styles.vehicleCapacityBadge}>
                                    <Luggage size={13} strokeWidth={2} />
                                    <span>{v.maxLuggage} valises max</span>
                                  </span>
                                </div>
                              </div>
                              <div className={styles.vehicleQuoteBox}>
                                <span className={styles.vehiclePrice}>Sur devis</span>
                                <span className={styles.vehiclePriceNote}>Étude personnalisée</span>
                              </div>
                            </div>

                            <p className={styles.vehicleDesc}>{v.desc}</p>

                            <button
                              type="button"
                              className={styles.chooseVehiclePrimaryBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVehicle(v.id);
                                goToNextStep();
                              }}
                            >
                              <span>Choisir ce Sprinter ({v.capacityTag})</span>
                              <ArrowRight size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── MODE 3: PRESTIGE COLLECTION (Modèles d'exception précis) ── */}
              {fleetMode === 'prestige' && (
                <div style={{ marginTop: '1.25rem' }}>
                  <div className={styles.specialHeaderBanner}>
                    <button
                      type="button"
                      className={styles.backToStandardBtn}
                      onClick={() => setFleetMode('standard')}
                    >
                      ← Retour aux 3 formules principales
                    </button>
                    <h3 className={styles.specialSectionTitle}>Prestige Collection : Véhicules d'exception</h3>
                    <p className={styles.specialSectionSub}>
                      Mercedes-Maybach, Rolls-Royce, Cadillac Escalade, Range Rover. Choisissez précisément le modèle pour votre déplacement.
                    </p>
                  </div>

                  <div className={styles.vehiclesListGrid}>
                    {PRESTIGE_VEHICLES.map((v) => {
                      const isSelected = selectedVehicle === v.id;
                      const activeAngle = vehicleAngles[v.id] || 'front';
                      const displayImg =
                        activeAngle === 'rear' && v.rearImage
                          ? v.rearImage
                          : activeAngle === 'interior' && v.interiorImage
                          ? v.interiorImage
                          : v.image;
                      const hasMultiAngles = Boolean(v.rearImage || v.interiorImage);

                      return (
                        <div
                          key={v.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedVehicle(v.id);
                            goToNextStep();
                          }}
                          className={`${styles.vehicleSelectCard} ${isSelected ? styles.vehicleSelected : ''}`}
                        >
                          <div className={styles.vehicleImgBox}>
                            <img src={displayImg} alt={v.name} className={styles.vehicleImg} />
                            {isSelected && (
                              <div className={styles.vehicleCheckBadge}>
                                <Check size={16} />
                              </div>
                            )}
                            <span className={styles.vehicleBadgeOverlay} style={{ background: 'rgba(184, 144, 60, 0.85)', color: '#fff' }}>
                              ★ Prestige
                            </span>

                            {hasMultiAngles && (
                              <div
                                className={styles.vehicleAnglePills}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  className={`${styles.vehicleAngleBtn} ${activeAngle === 'front' ? styles.vehicleAngleBtnActive : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setVehicleAngles((prev) => ({ ...prev, [v.id]: 'front' }));
                                  }}
                                >
                                  Devant
                                </button>
                                {v.rearImage && (
                                  <button
                                    type="button"
                                    className={`${styles.vehicleAngleBtn} ${activeAngle === 'rear' ? styles.vehicleAngleBtnActive : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setVehicleAngles((prev) => ({ ...prev, [v.id]: 'rear' }));
                                    }}
                                  >
                                    Arrière
                                  </button>
                                )}
                                {v.interiorImage && (
                                  <button
                                    type="button"
                                    className={`${styles.vehicleAngleBtn} ${activeAngle === 'interior' ? styles.vehicleAngleBtnActive : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setVehicleAngles((prev) => ({ ...prev, [v.id]: 'interior' }));
                                    }}
                                  >
                                    Intérieur
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          <div className={styles.vehicleInfoBox}>
                            <div className={styles.vehicleTopRow}>
                              <div className={styles.vehicleTitleGroup}>
                                <h4 className={styles.vehicleName}>{v.name}</h4>
                                <div className={styles.categorySubtitleLine}>{v.subtitle}</div>
                                {service === 'hourly' && (
                                  <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 500, marginTop: '0.15rem' }}>
                                    Planning : {scheduleDays.length} jour{scheduleDays.length > 1 ? 's' : ''} · {totalScheduleHours}h au total
                                  </div>
                                )}
                                <div className={styles.vehicleCapacityRow} style={{ marginTop: '0.4rem' }}>
                                  <span className={styles.vehicleCapacityBadge}>
                                    <Users size={13} strokeWidth={2} />
                                    <span>Jusqu'à {v.maxPassengers} passagers</span>
                                  </span>
                                  <span className={styles.vehicleCapacityBadge}>
                                    <Luggage size={13} strokeWidth={2} />
                                    <span>{v.maxLuggage} valises max</span>
                                  </span>
                                </div>
                              </div>
                              <div className={styles.vehicleQuoteBox}>
                                <span className={styles.vehiclePrice}>Sur devis</span>
                                <span className={styles.vehiclePriceNote}>Étude personnalisée</span>
                              </div>
                            </div>

                            <p className={styles.vehicleDesc}>{v.desc}</p>

                            <button
                              type="button"
                              className={styles.chooseVehiclePrimaryBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVehicle(v.id);
                                goToNextStep();
                              }}
                            >
                              <span>Choisir ce modèle ({v.name})</span>
                              <ArrowRight size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              TRANSFER & HOURLY — STEP 5 : CONTACT DETAILS
              ══════════════════════════════════════════════════════════════════════════ */}
          {((service === 'transfer' && step === 3) || (service === 'hourly' && step === 3)) && (
            <motion.div
              key="contact-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.screenContainer}
            >
              <div className={styles.screenIntro}>
                <span className={styles.microBadge}>{t('tunnel.step3_badge', 'VOS COORDONNÉES')}</span>
                <h2 className={styles.screenTitle}>{t('tunnel.step3_title', 'Où vous contacter pour confirmer ?')}</h2>
                <p className={styles.screenSubtitle}>{t('tunnel.step3_subtitle', 'Seuls votre numéro de téléphone et votre email sont nécessaires. Notre équipe vous répond sous 30 minutes.')}</p>
              </div>

              <div className={styles.contactFormGrid}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      <Phone size={14} />
                      <span>{t('tunnel.phone_label', 'Téléphone mobile *')}</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      required
                      autoFocus
                      className={styles.luxuryInput}
                      id="phone-input"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      <Mail size={14} />
                      <span>{t('tunnel.email_label', 'Email *')}</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@domain.com"
                      required
                      className={styles.luxuryInput}
                      id="email-input"
                    />
                  </div>
                </div>

                {/* Numéro de vol si aéroport */}
                {isAirportTrip && (
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      <PlaneTakeoff size={14} />
                      <span>{t('tunnel.flight_label', 'Numéro de vol (optionnel)')}</span>
                    </label>
                    <input
                      type="text"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      placeholder="Ex : AF1234, DL402, EK073..."
                      className={styles.luxuryInput}
                    />
                  </div>
                )}

                {/* Notes libres */}
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>
                    <MessageSquare size={14} />
                    <span>{t('tunnel.notes_label', 'Précisions particulières (optionnel)')}</span>
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Code d'accès, instructions spécifiques, nom pour l'accueil chauffeur..."
                    className={styles.luxuryTextarea}
                  />
                </div>
              </div>

              <div className={styles.screenFooter}>
                <button
                  type="button"
                  disabled={!isEmailValid || !phone?.trim()}
                  onClick={goToNextStep}
                  className={styles.nextStepBtn}
                  id="contact-continue-btn"
                >
                  <span>{t('tunnel.view_summary_cta', 'Voir le récapitulatif')}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              TRANSFER & HOURLY — STEP 7 : SUMMARY & FINAL CONFIRMATION
              ══════════════════════════════════════════════════════════════════════════ */}
          {((service === 'transfer' && step === 4) || (service === 'hourly' && step === 4)) && (
            <motion.div
              key="summary-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.screenContainer}
            >
              <div className={styles.screenIntro}>
                <span className={styles.microBadge}>DEMANDE DE DEVIS OFFICIEL</span>
                <h2 className={styles.screenTitle}>Votre demande de devis</h2>
                <p className={styles.screenSubtitle}>
                  Étude personnalisée sur mesure, sans supplément caché ni engagement.
                </p>
              </div>

              <div className={styles.summaryCard}>
                {/* Official Voucher Top Ribbon */}
                <div className={styles.voucherTopRibbon}>
                  <div className={styles.voucherStatusBadge}>
                    <CheckCircle2 size={13} />
                    <span>DEVIS OFFICIEL SUR-MESURE</span>
                  </div>
                </div>

                {/* Vehicle header */}
                <div className={styles.summaryVehicleHeader}>
                  <img src={selectedVehicleData.image} alt={selectedVehicleData.name} className={styles.summaryVehicleThumb} />
                  <div className={styles.summaryVehicleDetails}>
                    <span className={styles.summaryTag}>{service === 'transfer' ? 'TRANSFERT PRIVÉ' : 'CHAUFFEUR À LA JOURNÉE'}</span>
                    <h3 className={styles.summaryVehicleTitle}>{selectedVehicleData.name}</h3>
                    <span className={styles.summarySpecs}>
                      <Users size={14} /> Jusqu'à {selectedVehicleData.maxPassengers} passagers max · <Luggage size={14} /> {selectedVehicleData.maxLuggage} valises max
                    </span>
                  </div>
                </div>

                {/* Itinerary details */}
                <div className={styles.summaryDetailsList}>
                  <div className={styles.summaryRow}>
                    <MapPin size={16} className={styles.summaryIcon} />
                    <div className={styles.summaryCol}>
                      <strong>Lieu de départ :</strong>
                      <span>{pickup}</span>
                    </div>
                  </div>

                  {service === 'transfer' && (
                    <div className={styles.summaryRow}>
                      <Navigation size={16} className={styles.summaryIcon} />
                      <div className={styles.summaryCol}>
                        <strong>Destination :</strong>
                        <span>{destination}</span>
                        {distanceKm && <span className={styles.distanceBadge}>{distanceKm} km estimés</span>}
                      </div>
                    </div>
                  )}

                  {service === 'hourly' ? (
                    <div className={styles.summaryRow}>
                      <Calendar size={16} className={styles.summaryIcon} />
                      <div className={styles.summaryCol} style={{ width: '100%' }}>
                        <strong>Planning ({scheduleDays.length} jour{scheduleDays.length > 1 ? 's' : ''} · {totalScheduleHours}h au total) :</strong>
                        <div className={styles.scheduleSummaryList}>
                          {scheduleDays.map((d, idx) => (
                            <div key={d.id} className={styles.scheduleSummaryItem}>
                              <span className={styles.scheduleSummaryDayTag}>Jour {idx + 1}</span>
                              <span className={styles.scheduleSummaryDate}>{d.date}</span>
                              <span className={styles.scheduleSummarySlot}>
                                {d.isFlexible ? `${d.hours}h flexibles (départ libre)` : `${d.startTime} → ${d.endTime}`}
                              </span>
                              <span className={styles.scheduleSummaryHours}>{d.hours}h</span>
                            </div>
                          ))}
                        </div>
                        {hasLongDistance && (
                          <div className={styles.summaryLongDistanceNote}>
                            <Route size={14} />
                            <span>Longue distance : {longDistanceCities || 'Oui (Inter-villes)'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.summaryRow}>
                      <Calendar size={16} className={styles.summaryIcon} />
                      <div className={styles.summaryCol}>
                        <strong>Date & Heure :</strong>
                        <span>{date} à {time}</span>
                      </div>
                    </div>
                  )}

                  <div className={styles.summaryRow}>
                    <User size={16} className={styles.summaryIcon} />
                    <div className={styles.summaryCol}>
                      <strong>Client :</strong>
                      <span>{firstName} {lastName} · {phone} · {email}</span>
                    </div>
                  </div>

                  {isAirportTrip && flightNumber && (
                    <div className={styles.summaryRow}>
                      <PlaneTakeoff size={16} className={styles.summaryIcon} />
                      <div className={styles.summaryCol}>
                        <strong>Vol de suivi :</strong>
                        <span>{flightNumber}</span>
                      </div>
                    </div>
                  )}

                  {driverInstructions.length > 0 && (
                    <div className={styles.summaryRow}>
                      <MessageSquare size={16} className={styles.summaryIcon} />
                      <div className={styles.summaryCol}>
                        <strong>Instructions chauffeur :</strong>
                        <span>
                          {driverInstructions
                            .map((id) => DRIVER_INSTRUCTIONS_LIST.find((item) => item.id === id)?.title || id)
                            .join(' · ')}
                        </span>
                      </div>
                    </div>
                  )}

                  {specialRequests && (
                    <div className={styles.summaryRow}>
                      <MessageSquare size={16} className={styles.summaryIcon} />
                      <div className={styles.summaryCol}>
                        <strong>Précisions particulières :</strong>
                        <span>{specialRequests}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Official Financial Quotation Breakdown */}
                <div className={styles.quoteBreakdownTable}>
                  <div className={styles.quoteTableHeader}>
                    <span>DÉTAIL DU DEVIS</span>
                    <span>TARIFICATION</span>
                  </div>
                  <div className={styles.quoteTableRow}>
                    <span>Prestation chauffeur privé & véhicule ({selectedVehicleData.name})</span>
                    <span className={styles.freeMention}>Sur devis</span>
                  </div>
                  <div className={styles.quoteTableRow}>
                    <span>Instructions personnalisées & confort à bord</span>
                    <span className={styles.freeMention}>Inclus</span>
                  </div>
                  <div className={styles.quoteTableRow}>
                    <span>Carburant, autoroutes et péages</span>
                    <span className={styles.freeMention}>Inclus</span>
                  </div>
                  <div className={styles.quoteTableRow}>
                    <span>Attente offerte (30 min ville / 60 min aéroport)</span>
                    <span className={styles.freeMention}>Offert</span>
                  </div>
                  <div className={styles.quoteTableRow}>
                    <span>Bouteilles d'eau fraîches, chargeurs & Wi-Fi à bord</span>
                    <span className={styles.freeMention}>Offert</span>
                  </div>
                  <div className={styles.quoteTableRow}>
                    <span>Assurances professionnelles & taxes</span>
                    <span className={styles.freeMention}>Incluses</span>
                  </div>
                  <div className={styles.quoteTableTotalRow}>
                    <div className={styles.quoteTotalLeft}>
                      <strong>TARIFICATION DE LA PRESTATION</strong>
                      <span>Étude tarifaire sur-mesure transmise sous 15 min par nos conseillers dédiés</span>
                    </div>
                    <strong className={styles.bigPrice}>
                      Sur devis
                    </strong>
                  </div>
                </div>

                {/* 4 Palace Security Guarantees */}
                <div className={styles.guaranteesGrid}>
                  <div className={styles.guaranteeItem}>
                    <Shield size={16} className={styles.guaranteeIcon} />
                    <div>
                      <strong>Annulation Flexible</strong>
                      <p>Sans frais jusqu'à 24h avant la prise en charge.</p>
                    </div>
                  </div>
                  <div className={styles.guaranteeItem}>
                    <PlaneTakeoff size={16} className={styles.guaranteeIcon} />
                    <div>
                      <strong>Suivi Vol en Temps Réel</strong>
                      <p>Ajustement automatique en cas de retard de vol.</p>
                    </div>
                  </div>
                  <div className={styles.guaranteeItem}>
                    <Award size={16} className={styles.guaranteeIcon} />
                    <div>
                      <strong>Chauffeur Grande Remise</strong>
                      <p>Tenue costume stricte, discrétion absolue garantie.</p>
                    </div>
                  </div>
                  <div className={styles.guaranteeItem}>
                    <CheckCircle2 size={16} className={styles.guaranteeIcon} />
                    <div>
                      <strong>Devis Sans Engagement</strong>
                      <p>Proposition ferme et détaillée transmise sous 15 minutes.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.summaryActionsGrid}>
                <button
                  type="button"
                  disabled={status === 'loading'}
                  onClick={(e) => handleFinalSubmit(e, 'quote')}
                  className={styles.primaryPayBtn}
                  id="final-submit-quote-btn"
                >
                  {status === 'loading' ? (
                    <Loader2 size={18} className={styles.spinner} />
                  ) : (
                    <>
                      <span>Envoyer le devis</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <div className={styles.errorAlert}>
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              BESPOKE FLOW — STEP 1 : VOICE INPUT + AI STRUCTURING
              ══════════════════════════════════════════════════════════════════════════ */}
          {service === 'bespoke' && step === 1 && (
            <motion.div
              key="bespoke-step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.screenContainer}
            >
              <div className={styles.screenIntro}>
                <span className={styles.microBadge}>DEMANDE SUR-MESURE & ÉVÉNEMENTS</span>
                <h2 className={styles.screenTitle}>Décrivez votre besoin avec vos propres mots</h2>
                <p className={styles.screenSubtitle}>
                  Vous pouvez saisir votre texte au clavier ou simplement parler grâce à la dictée vocale.
                </p>
              </div>

              <div className={styles.bespokeInputBox}>
                <div className={styles.textareaHeader}>
                  <span className={styles.inputHeaderTitle}>VOTRE PROGRAMME DE MOBILITÉ</span>
                  <div className={styles.voiceControlGroup}>
                    <button
                      type="button"
                      onClick={toggleSpeechRecognition}
                      className={`${styles.voiceBtn} ${isListening ? styles.voiceBtnActive : ''}`}
                      title={voiceLang.startsWith('fr') ? "Parler au micro en français" : "Speak into microphone in English"}
                    >
                      {isListening ? (
                        <>
                          <MicOff size={16} />
                          <span>{voiceLang.startsWith('fr') ? 'En écoute... Arrêter' : 'Listening... Stop'}</span>
                        </>
                      ) : (
                        <>
                          <Mic size={16} />
                          <span>{voiceLang.startsWith('fr') ? 'Parler au micro' : 'Speak into mic'}</span>
                        </>
                      )}
                    </button>

                    <div className={styles.voiceLangToggle}>
                      <button
                        type="button"
                        className={`${styles.voiceLangBtn} ${voiceLang.startsWith('fr') ? styles.voiceLangBtnActive : ''}`}
                        onClick={() => setVoiceLang('fr-FR')}
                        title="Micro en Français"
                      >
                        🇫🇷 FR
                      </button>
                      <button
                        type="button"
                        className={`${styles.voiceLangBtn} ${voiceLang.startsWith('en') ? styles.voiceLangBtnActive : ''}`}
                        onClick={() => setVoiceLang('en-US')}
                        title="Micro in English"
                      >
                        🇬🇧 EN
                      </button>
                    </div>
                  </div>
                </div>

                <textarea
                  rows={5}
                  value={bespokeText}
                  onChange={(e) => setBespokeText(e.target.value)}
                  placeholder="Ex : Nous sommes 6 personnes arrivant de New York ce vendredi. Nous avons besoin d'un Classe V pour trois jours et d'une berline supplémentaire samedi soir..."
                  className={styles.bespokeLargeTextarea}
                />

                {isListening && (
                  <div className={styles.listeningBadge}>
                    <span className={styles.listeningDot} />
                    <span>
                      {voiceLang.startsWith('fr')
                        ? 'Microphone actif (Français 🇫🇷) : parlez maintenant...'
                        : 'Microphone active (English 🇬🇧) : speak now...'}
                    </span>
                  </div>
                )}
                {voiceError && (
                  <p className={styles.voiceErrorNotice}>{voiceError}</p>
                )}
              </div>

              <div className={styles.screenFooter}>
                <button
                  type="button"
                  disabled={!bespokeText || bespokeText.trim().length < 5}
                  onClick={goToNextStep}
                  className={styles.nextStepBtn}
                  id="bespoke-continue-btn"
                >
                  <span>Continuer vers vos coordonnées</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              BESPOKE FLOW — STEP 2 : CONTACT (PHONE & EMAIL ONLY REQUIRED!)
              ══════════════════════════════════════════════════════════════════════════ */}
          {service === 'bespoke' && step === 2 && (
            <motion.div
              key="bespoke-step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.screenContainer}
            >
              <div className={styles.screenIntro}>
                <span className={styles.microBadge}>COORDONNÉES DE RÉPONSE</span>
                <h2 className={styles.screenTitle}>Où notre équipe doit-elle vous contacter ?</h2>
                <p className={styles.screenSubtitle}>
                  Seuls votre numéro de téléphone et votre email sont indispensables.
                </p>
              </div>

              <div className={styles.contactFormGrid}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      <Phone size={14} />
                      <span>{t('tunnel.phone_label', 'Téléphone mobile *')}</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      required
                      autoFocus
                      className={styles.luxuryInput}
                      id="bespoke-phone-input"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      <Mail size={14} />
                      <span>{t('tunnel.email_label', 'Email *')}</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@domain.com"
                      required
                      className={styles.luxuryInput}
                      id="bespoke-email-input"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      <User size={14} />
                      <span>Votre Nom complet (Optionnel)</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Prénom et Nom"
                      className={styles.luxuryInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      <Building2 size={14} />
                      <span>Société / Organisation (Optionnel)</span>
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Agence, Ambassade, Entreprise..."
                      className={styles.luxuryInput}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.screenFooter}>
                <button
                  type="button"
                  disabled={!phone?.trim() || !isEmailValid || status === 'loading'}
                  onClick={handleFinalSubmit}
                  className={styles.nextStepBtn}
                  id="bespoke-submit-btn"
                >
                  {status === 'loading' ? (
                    <Loader2 size={18} className={styles.spinner} />
                  ) : (
                    <>
                      <span>Transmettre ma demande sur-mesure</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <div className={styles.errorAlert}>
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              SUCCESS CONFIRMATION SCREEN
              ══════════════════════════════════════════════════════════════════════════ */}
          {status === 'success' && (
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.successScreen}
            >
              <div className={styles.successIconCircle}>
                <Check size={36} />
              </div>
              <h2 className={styles.successTitle}>Votre devis a été envoyé avec succès</h2>
              <p className={styles.successMessage}>
                Notre équipe dédiée a bien reçu votre demande. Votre devis officiel détaillé ainsi que la confirmation de votre prise en charge vous sont adressés par email et SMS.
              </p>
              <div className={styles.successActions}>
                <button
                  type="button"
                  onClick={() => navigate(getCityPath('/'))}
                  className={styles.nextStepBtn}
                >
                  <span>Retourner à l'accueil SELY</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
