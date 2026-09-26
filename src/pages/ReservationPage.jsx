import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { getFormAccessKey } from '../lib/formRouting';
import { calculateTripPrice, getDrivingDistanceKm } from '../lib/pricingEngine';
import { useBookingsStore } from '../admin/store/useBookingsStore';
import LuxuryDateTimePicker from '../components/LuxuryDateTimePicker';
import styles from './ReservationPage.module.css';

/* ─── vehicle catalogue (reused directly) ─── */
/* ─── Vehicle Classes Hierarchy (Business -> First -> XL -> VIP) ─── */
const VEHICLE_CLASSES = [
  {
    id: 'business',
    title: 'Classe Business',
    badge: 'ACCÈS AFFAIRES',
    desc: 'Berlines exécutives pour vos transferts aéroports et rendez-vous professionnels.',
    notice: 'Gamme optimale pour transferts fréquents, corporate et gares.',
  },
  {
    id: 'first',
    title: 'Classe First',
    badge: 'GRANDE REMISE',
    desc: 'L\'excellence du prestige automobile et le confort de palace.',
    notice: 'La référence des dirigeants, diplomates et palaces internationaux.',
  },
  {
    id: 'xl',
    title: 'Classe XL',
    badge: 'GRAND VOLUME',
    desc: 'Vans & Grands volumes pour familles, groupes et délégations.',
    notice: 'Espace spacieux jusqu\'à 19 passagers et grands bagages sans compromis.',
  },
  {
    id: 'vip',
    title: 'Classe VIP',
    badge: 'HAUTE DISTINCTION',
    desc: 'Haute couture automobile et salons privés d\'exception.',
    notice: 'Prestations d\'apparat réservées aux cortèges officiels et personnalités d\'exception.',
  },
];

/* ─── Vehicle Catalogue Ordered: Business -> First -> XL -> VIP ─── */
const VEHICLES = [
  /* ─── 1. CLASSE BUSINESS ─── */
  {
    id: 'classe-e',
    name: 'Mercedes Classe E',
    classId: 'business',
    classTitle: 'Classe Business',
    passengers: '3 passagers',
    maxPassengers: 3,
    maxLuggage: 2,
    categoryBadge: 'CLASSE BUSINESS',
    desc: 'Élégance et efficacité, la référence pour vos déplacements professionnels et transferts aéroport.',
    image: '/eclass-paris-luxury.jpg',
  },
  {
    id: 'tesla-y',
    name: 'Tesla Model Y',
    classId: 'business',
    classTitle: 'Classe Business',
    passengers: '4 passagers',
    maxPassengers: 4,
    maxLuggage: 3,
    categoryBadge: 'CLASSE BUSINESS ÉCO',
    desc: 'Mobilité électrique haut de gamme, silence absolu et modernité technologique.',
    image: '/tesla-y-paris-luxury.jpg',
  },

  /* ─── 2. CLASSE FIRST ─── */
  {
    id: 'classe-s',
    name: 'Mercedes Classe S',
    classId: 'first',
    classTitle: 'Classe First',
    passengers: '3 passagers',
    maxPassengers: 3,
    maxLuggage: 3,
    categoryBadge: 'CLASSE FIRST',
    desc: 'Berline de prestige par excellence, confort absolu, insonorisation d\'art et élégance intemporelle.',
    image: '/sclass-main-new.jpg',
    rearImage: '/sclass_paris_hero.jpg',
    interiorImage: '/sclass-interior-white.jpg',
  },
  {
    id: 'range-rover',
    name: 'Range Rover Autobiography',
    classId: 'first',
    classTitle: 'Classe First',
    passengers: '3 passagers',
    maxPassengers: 3,
    maxLuggage: 4,
    categoryBadge: 'CLASSE FIRST SUV',
    desc: 'Le SUV britannique d\'exception, position dominante majestueuse et sérénité royale.',
    image: '/range-rover-main.jpg',
    rearImage: '/range-rover-rear.jpg',
    interiorImage: '/range-rover-interior.jpg',
  },
  {
    id: 'cadillac-escalade',
    name: 'Cadillac Escalade ESV',
    classId: 'first',
    classTitle: 'Classe First',
    passengers: '6 passagers',
    maxPassengers: 6,
    maxLuggage: 6,
    categoryBadge: 'CLASSE FIRST GRAND SUV',
    desc: 'Le grand SUV américain par excellence, salon VIP spacieux et présence statutaire incomparable.',
    image: '/cadillac-escalade-main.jpg',
    rearImage: '/cadillac-escalade-rear.jpg',
    interiorImage: '/cadillac-escalade-interior.jpg',
  },

  /* ─── 3. CLASSE XL ─── */
  {
    id: 'classe-v',
    name: 'Mercedes Classe V Business',
    classId: 'xl',
    classTitle: 'Classe XL',
    passengers: '7 passagers',
    maxPassengers: 7,
    maxLuggage: 7,
    categoryBadge: 'CLASSE XL BUSINESS VAN',
    desc: 'Salon mobile face-à-face grand confort pour vos déplacements en famille, séjours et équipes.',
    image: '/vclass-paris-luxury.jpg',
    rearImage: '/vclass-rear-luxury.jpg',
    interiorImage: '/vclass_interior_vip_lounge.jpg',
  },
  {
    id: 'peugeot-traveller',
    name: 'Peugeot Traveller',
    classId: 'xl',
    classTitle: 'Classe XL',
    passengers: '6 passagers',
    maxPassengers: 6,
    maxLuggage: 6,
    categoryBadge: 'CLASSE XL VAN',
    desc: 'Van spacieux et sobre, configuration 6 places grand confort, idéal pour les transferts d\'entreprises, délégations et familles.',
    image: '/peugeot-traveller-front-paris.jpg',
    rearImage: '/peugeot-traveller-rear-paris.jpg',
  },
  {
    id: 'sprinter-19-standard',
    name: 'Mercedes Sprinter Standard (19 places)',
    classId: 'xl',
    classTitle: 'Classe XL',
    passengers: '19 passagers',
    maxPassengers: 19,
    maxLuggage: 19,
    categoryBadge: 'CLASSE XL MINIBUS',
    desc: 'Minibus grand tourisme 19 places avec plancher bois, idéal pour groupes d\'affaires et événements.',
    image: '/minibus-19-standard-interior.jpg',
  },

  /* ─── 4. CLASSE VIP ─── */
  {
    id: 'maybach',
    name: 'Mercedes-Maybach',
    classId: 'vip',
    classTitle: 'Classe VIP',
    passengers: '3 passagers',
    maxPassengers: 3,
    maxLuggage: 3,
    categoryBadge: '★ CLASSE VIP MAYBACH',
    desc: 'Le summum du luxe automobile, empattement long, flûtes argentées et confort d\'aviation privée.',
    image: '/maybach-paris-luxury.jpg',
    rearImage: '/maybach-rear-luxury.jpg',
    interiorImage: '/maybach-interior-first-class.jpg',
  },
  {
    id: 'rolls-phantom',
    name: 'Rolls-Royce Phantom',
    classId: 'vip',
    classTitle: 'Classe VIP',
    passengers: '3 passagers',
    maxPassengers: 3,
    maxLuggage: 3,
    categoryBadge: '★ CLASSE VIP PHANTOM',
    desc: 'L\'incarnation ultime du prestige et de l\'aristocratie mondiale, portières antagonistes et tapis de laine.',
    image: '/rolls-phantom-main.jpg',
    rearImage: '/rolls-phantom-rear.jpg',
    interiorImage: '/rolls-phantom-interior.jpg',
  },
  {
    id: 'rolls-cullinan',
    name: 'Rolls-Royce Cullinan',
    classId: 'vip',
    classTitle: 'Classe VIP',
    passengers: '3 passagers',
    maxPassengers: 3,
    maxLuggage: 4,
    categoryBadge: '★ CLASSE VIP CULLINAN',
    desc: 'Le SUV le plus prestigieux au monde, prestance impériale, silence absolu et confort d\'exception.',
    image: '/rolls-cullinan-main.jpg',
    rearImage: '/rolls-cullinan-rear.jpg',
    interiorImage: '/rolls-cullinan-interior.jpg',
  },
  {
    id: 'sprinter-7-vip',
    name: 'Mercedes Sprinter VIP (7 places)',
    classId: 'vip',
    classTitle: 'Classe VIP',
    passengers: '7 passagers',
    maxPassengers: 7,
    maxLuggage: 10,
    categoryBadge: '★ CLASSE VIP PRIVATE JET',
    desc: 'Salon First Class mobile en cuir blanc nappa, ciel étoilé, grand écran cinéma et bar privé.',
    image: '/minibus-7-vip-interior.jpg',
  },
  {
    id: 'sprinter-14-vip',
    name: 'Mercedes Sprinter VIP (14 places)',
    classId: 'vip',
    classTitle: 'Classe VIP',
    passengers: '14 passagers',
    maxPassengers: 14,
    maxLuggage: 14,
    categoryBadge: '★ CLASSE VIP SALON CONFÉRENCE',
    desc: 'Salon d\'affaires mobile 14 places avec tables laquées, cuir beige diamant et connectivité ultra-VIP.',
    image: '/minibus-14-vip-interior.jpg',
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

export default function ReservationPage() {
  const { t, city: currentCity, getCityPath, i18n } = useCity();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

  // Service selection: null (Screen 0), 'transfer', 'hourly', 'bespoke'
  const initialService = searchParams.get('service') || null;
  const [service, setService] = useState(initialService);

  // Step counter (1-indexed for each service)
  const [step, setStep] = useState(() => {
    const s = searchParams.get('step');
    if (s && !isNaN(parseInt(s, 10))) return parseInt(s, 10);
    return initialService ? 1 : 0;
  });

  // Direction for slide animation: 1 = forward, -1 = backward
  const [direction, setDirection] = useState(1);

  // Transfer & Hourly inputs
  const pickupAutocomplete = useAddressAutocomplete(searchParams.get('pickup') || '', currentCity || 'paris');
  const destAutocomplete = useAddressAutocomplete(searchParams.get('destination') || '', currentCity || 'paris');
  
  const pickup = pickupAutocomplete.query;
  const setPickup = pickupAutocomplete.setQuery;
  const destination = destAutocomplete.query;
  const setDestination = destAutocomplete.setQuery;

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

  const [selectedClassFilter, setSelectedClassFilter] = useState('all'); // 'all' | 'business' | 'first' | 'xl' | 'vip'
  const [selectedVehicle, setSelectedVehicle] = useState(() => {
    const fromUrl = searchParams.get('vehicle');
    if (fromUrl && VEHICLES.some((v) => v.id === fromUrl)) return fromUrl;
    return 'classe-e';
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
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

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
  const selectedVehicleData = useMemo(
    () => VEHICLES.find((v) => v.id === selectedVehicle) || VEHICLES[1],
    [selectedVehicle]
  );

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

  // Navigation handlers
  const goToNextStep = () => {
    setDirection(1);
    if (service === 'hourly' && step === 2) {
      setStep(4);
    } else {
      setStep((prev) => prev + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevStep = () => {
    setDirection(-1);
    if (step <= 1) {
      setStep(0);
      setService(null);
    } else if (service === 'hourly' && step === 4) {
      setStep(2);
    } else {
      setStep((prev) => prev - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectService = (type) => {
    setService(type);
    setDirection(1);
    setStep(1);
  };

  // Voice Recognition for Bespoke flow
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas prise en charge sur ce navigateur. Vous pouvez saisir votre demande au clavier.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = i18n?.language === 'en' ? 'en-US' : 'fr-FR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setBespokeText((prev) => {
          const current = prev.trim();
          return current ? `${current} ${transcript.trim()}` : transcript.trim();
        });
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

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
      } else {
        setStatus('error');
        setErrorMessage("Une erreur est survenue lors de l'envoi de votre réservation. Veuillez nous joindre directement par téléphone.");
      }
    } catch (e) {
      setStatus('error');
      setErrorMessage("Une erreur réseau est survenue. Veuillez vérifier votre connexion.");
    }
  };

  // Step counter & displayed steps
  const displayedStep = useMemo(() => {
    if (service === 'hourly' && step >= 4) {
      return step - 1;
    }
    return step;
  }, [service, step]);

  const displayedTotalSteps = useMemo(() => {
    if (service === 'hourly') return 6;
    if (service === 'transfer') return 7;
    if (service === 'bespoke') return 2;
    return 1;
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
            <span>{service === 'transfer' ? 'Transfert' : service === 'hourly' ? 'Mise à disposition' : 'Sur-mesure'}</span>
            <span className={styles.stepDot}>·</span>
            <span>Étape {displayedStep} sur {displayedTotalSteps}</span>
          </div>
        )}

        <div className={styles.headerRight}>
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
              SCREEN 0 : SERVICE SELECTION
              ══════════════════════════════════════════════════════════════════════════ */}
          {step === 0 && (
            <motion.div
              key="step-0-service"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.screenContainer}
            >
              <div className={styles.screenIntro}>
                <div className={styles.territoryPillRow}>
                  <span className={styles.microBadge}>SÉLECTION DU SERVICE</span>
                  <span className={styles.territoryIndicatorBadge}>
                    <span className={styles.territoryIndicatorDot} />
                    {activeTerritory.name.toUpperCase()} · {activeTerritory.hubs}
                  </span>
                </div>
                <h1 className={styles.screenTitle}>Comment souhaitez-vous voyager ?</h1>
                <p className={styles.screenSubtitle}>
                  Choisissez la formule adaptée à votre déplacement en {activeTerritory.name}.
                </p>
              </div>

              <div className={styles.serviceCardsGrid}>
                {/* 1. Transfert */}
                <button
                  type="button"
                  onClick={() => selectService('transfer')}
                  className={styles.serviceChoiceCard}
                  id="choice-transfer-btn"
                >
                  <div className={styles.serviceChoiceIcon}>
                    <Navigation size={22} strokeWidth={1.5} />
                  </div>
                  <div className={styles.serviceChoiceBody}>
                    <div className={styles.serviceChoiceBadge}>POINT A À POINT B</div>
                    <h3 className={styles.serviceChoiceTitle}>Transfert</h3>
                    <p className={styles.serviceChoiceDesc}>
                      Liaisons directes d'adresse à adresse, aéroports, gares parisiennes et trajets intercités.
                    </p>
                  </div>
                  <div className={styles.serviceChoiceCta}>
                    <span>Sélectionner</span>
                    <ArrowRight size={15} strokeWidth={1.5} />
                  </div>
                </button>

                {/* 2. Mise à disposition */}
                <button
                  type="button"
                  onClick={() => selectService('hourly')}
                  className={styles.serviceChoiceCard}
                  id="choice-hourly-btn"
                >
                  <div className={styles.serviceChoiceIcon}>
                    <Clock size={22} strokeWidth={1.5} />
                  </div>
                  <div className={styles.serviceChoiceBody}>
                    <div className={styles.serviceChoiceBadge}>CHAUFFEUR DÉDIÉ</div>
                    <h3 className={styles.serviceChoiceTitle}>Mise à disposition</h3>
                    <p className={styles.serviceChoiceDesc}>
                      Berline et chauffeur privé réservés à l'heure ou pour la journée complète.
                    </p>
                  </div>
                  <div className={styles.serviceChoiceCta}>
                    <span>Sélectionner</span>
                    <ArrowRight size={15} strokeWidth={1.5} />
                  </div>
                </button>

                {/* 3. Demande sur-mesure */}
                <button
                  type="button"
                  onClick={() => selectService('bespoke')}
                  className={styles.serviceChoiceCard}
                  id="choice-bespoke-btn"
                >
                  <div className={styles.serviceChoiceIcon}>
                    <SlidersHorizontal size={22} strokeWidth={1.5} />
                  </div>
                  <div className={styles.serviceChoiceBody}>
                    <div className={styles.serviceChoiceBadge}>SUR-MESURE & ÉVÉNEMENTS</div>
                    <h3 className={styles.serviceChoiceTitle}>Demande sur mesure</h3>
                    <p className={styles.serviceChoiceDesc}>
                      Fashion Week, délégations diplomatiques, convois officiels, mariages ou exigences exclusives.
                    </p>
                  </div>
                  <div className={styles.serviceChoiceCta}>
                    <span>Sélectionner</span>
                    <ArrowRight size={15} strokeWidth={1.5} />
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              TRANSFER & HOURLY — STEP 1 : PICKUP LOCATION
              ══════════════════════════════════════════════════════════════════════════ */}
          {((service === 'transfer' && step === 1) || (service === 'hourly' && step === 1)) && (
            <motion.div
              key="pickup-step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.screenContainer}
            >
              <div className={styles.screenIntro}>
                <div className={styles.territoryPillRow}>
                  <span className={styles.microBadge}>
                    {service === 'transfer' ? 'LIEU DE DÉPART' : 'POINT DE RENDEZ-VOUS'}
                  </span>
                  <span className={styles.territoryIndicatorBadge}>
                    <span className={styles.territoryIndicatorDot} />
                    {activeTerritory.name.toUpperCase()}
                  </span>
                </div>
                <h2 className={styles.screenTitle}>
                  {service === 'transfer'
                    ? 'Où votre chauffeur vient-il vous chercher ?'
                    : 'Où commence votre mise à disposition ?'}
                </h2>
                <p className={styles.screenSubtitle}>
                  {service === 'transfer'
                    ? 'Indiquez une adresse précise, un hôtel ou un terminal d\'aéroport.'
                    : 'Indiquez le point de rencontre avec votre chauffeur privé dédié.'}
                </p>
              </div>

              <div className={styles.inputWrapper}>
                <div className={styles.searchBar}>
                  <MapPin size={20} className={styles.inputIcon} />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder={
                      service === 'transfer'
                        ? 'Adresse de prise en charge, aéroport, palace...'
                        : 'Hôtel, palace, bureau, adresse parisienne...'
                    }
                    autoFocus
                    className={styles.luxuryInput}
                    id="pickup-input"
                  />
                  {pickup && (
                    <button type="button" onClick={() => setPickup('')} className={styles.clearBtn}>
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Autocomplete Dropdown */}
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
                          goToNextStep();
                        }}
                        className={styles.suggestionItem}
                      >
                        <MapPin size={16} className={styles.sugIcon} />
                        <span className={styles.sugLabel}>{s.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Luxury fast shortcuts */}
                <div className={styles.shortcutsSection}>
                  <span className={styles.shortcutsTitle}>SUGGESTIONS FRÉQUENTES</span>
                  <div className={styles.shortcutsGrid}>
                    {LUXURY_SUGGESTIONS.slice(0, 6).map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPickup(item.label);
                          goToNextStep();
                        }}
                        className={styles.shortcutChip}
                      >
                        <span className={styles.chipCat}>{item.category}</span>
                        <span className={styles.chipLabel}>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.screenFooter}>
                <button
                  type="button"
                  disabled={!pickup || pickup.trim().length < 3}
                  onClick={goToNextStep}
                  className={styles.nextStepBtn}
                  id="pickup-continue-btn"
                >
                  <span>Continuer</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              TRANSFER FLOW — STEP 2 : DESTINATION
              ══════════════════════════════════════════════════════════════════════════ */}
          {service === 'transfer' && step === 2 && (
            <motion.div
              key="transfer-step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.screenContainer}
            >
              <div className={styles.screenIntro}>
                <span className={styles.microBadge}>DESTINATION</span>
                <h2 className={styles.screenTitle}>Où souhaitez-vous vous rendre ?</h2>
                <p className={styles.screenSubtitle}>
                  Précisez votre lieu d'arrivée pour calculer l'itinéraire de prestige.
                </p>
              </div>

              <div className={styles.inputWrapper}>
                <div className={styles.searchBar}>
                  <Navigation size={20} className={styles.inputIcon} />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Adresse de destination, aéroport, restaurant..."
                    autoFocus
                    className={styles.luxuryInput}
                    id="destination-input"
                  />
                  {destination && (
                    <button type="button" onClick={() => setDestination('')} className={styles.clearBtn}>
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Autocomplete Dropdown */}
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
                          goToNextStep();
                        }}
                        className={styles.suggestionItem}
                      >
                        <MapPin size={16} className={styles.sugIcon} />
                        <span className={styles.sugLabel}>{s.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Shortcuts */}
                <div className={styles.shortcutsSection}>
                  <span className={styles.shortcutsTitle}>DESTINATIONS POPULAIRES</span>
                  <div className={styles.shortcutsGrid}>
                    {LUXURY_SUGGESTIONS.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setDestination(item.label);
                          goToNextStep();
                        }}
                        className={styles.shortcutChip}
                      >
                        <span className={styles.chipCat}>{item.category}</span>
                        <span className={styles.chipLabel}>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.screenFooter}>
                <button
                  type="button"
                  disabled={!destination || destination.trim().length < 3}
                  onClick={goToNextStep}
                  className={styles.nextStepBtn}
                  id="destination-continue-btn"
                >
                  <span>Continuer</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              HOURLY FLOW — STEP 2 : MISE À DISPOSITION INSTINCTIVE
              ══════════════════════════════════════════════════════════════════════════ */}
          {service === 'hourly' && step === 2 && (
            <motion.div
              key="hourly-step-2-schedule"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.screenContainer}
            >
              <div className={styles.screenIntro}>
                <span className={styles.microBadge}>MISE À DISPOSITION</span>
                <h2 className={styles.screenTitle}>Configurez votre planning</h2>
                <p className={styles.screenSubtitle}>
                  Choisissez votre durée par jour, avec des horaires flexibles ou sur-mesure.
                </p>
              </div>

              <div className={styles.scheduleContainer}>
                <div className={styles.multiDaysList}>
                  {scheduleDays.map((d, index) => {
                    const isToday = d.date === todayISO;
                    return (
                      <div key={d.id} className={styles.dayCard}>
                        {/* Day Card Header */}
                        <div className={styles.dayCardHeader}>
                          <div className={styles.dayCardHeaderLeft}>
                            <span className={styles.dayBadge}>
                              Jour {index + 1}
                            </span>
                            <span className={styles.dayHeaderDateDesc}>
                              · {formatDayShort(d.date)}
                            </span>
                          </div>
                          {scheduleDays.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeScheduleDay(d.id)}
                              className={styles.removeDayMiniBtn}
                              title={`Supprimer Jour ${index + 1}`}
                            >
                              <Trash2 size={13} />
                              <span>Retirer</span>
                            </button>
                          )}
                        </div>

                        {/* 1. Date selection: Only Aujourd'hui and Autre date */}
                        <div className={styles.daySubBlock}>
                          <div className={styles.daySubBlockTitle}>
                            <Calendar size={13} />
                            <span>Date :</span>
                          </div>
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
                                onChange={(e) => {
                                  if (e.target.value) updateDayDate(d.id, e.target.value);
                                }}
                                className={styles.nativeDateOverlay}
                              />
                            </label>
                          </div>
                          <div className={styles.dateVisualDisplay}>
                            Date retenue : <strong>{formatDayFull(d.date)}</strong>
                          </div>
                        </div>

                        {/* 2. Duration selection: Horizontal scroll strip */}
                        <div className={styles.daySubBlock}>
                          <div className={styles.daySubBlockTitleBetween}>
                            <div className={styles.daySubBlockTitle}>
                              <Clock size={13} />
                              <span>Durée : <strong>{d.hours || 8}h</strong></span>
                            </div>
                            <span className={styles.scrollHintText}>Faites défiler horizontalement ➔</span>
                          </div>

                          <div className={styles.durationScrollWrapper}>
                            <div className={styles.durationScrollStrip}>
                              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 24].map((h) => {
                                const isSelected = (d.hours || 8) === h;
                                return (
                                  <button
                                    key={h}
                                    type="button"
                                    onClick={() => setDayPresetHours(d.id, h)}
                                    className={`${styles.durationScrollPill} ${isSelected ? styles.durationPillActive : ''}`}
                                  >
                                    <span className={styles.durationPillNumber}>{h}h</span>
                                    {h === 8 && <span className={styles.durationPillTag}>1 jour</span>}
                                    {h === 4 && <span className={styles.durationPillTag}>1/2 j</span>}
                                    {h === 24 && <span className={styles.durationPillTag}>24/24</span>}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* 3. Flexible hours or exact hours */}
                        <div className={styles.daySubBlock}>
                          {d.isFlexible ? (
                            <div className={styles.flexibleTimeCard}>
                              <div className={styles.flexibleCardLeft}>
                                <span className={styles.flexibleDot} />
                                <div>
                                  <div className={styles.flexibleTitle}>
                                    Horaires flexibles ({d.hours || 8}h)
                                  </div>
                                  <div className={styles.flexibleDesc}>
                                    Départ libre · Votre chauffeur se tient prêt selon vos besoins
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleDayFlexible(d.id)}
                                className={styles.togglePreciseBtn}
                              >
                                <Clock size={13} />
                                <span>+ Préciser des horaires exacts</span>
                              </button>
                            </div>
                          ) : (
                            <div className={styles.exactTimeCard}>
                              <div className={styles.exactTimeHeader}>
                                <span>Horaires précis souhaités :</span>
                                <button
                                  type="button"
                                  onClick={() => toggleDayFlexible(d.id)}
                                  className={styles.backToFlexibleLink}
                                >
                                  Revenir en horaires flexibles
                                </button>
                              </div>
                              <div className={styles.exactTimeInputsRow}>
                                <div className={styles.timeFieldCol}>
                                  <label className={styles.timeFieldLabel}>Début :</label>
                                  <input
                                    type="time"
                                    value={d.startTime || '09:00'}
                                    onChange={(e) => updateDayStartTime(d.id, e.target.value)}
                                    className={styles.timeInputField}
                                  />
                                </div>
                                <div className={styles.timeSeparatorCol}>
                                  <ArrowRight size={16} />
                                </div>
                                <div className={styles.timeFieldCol}>
                                  <label className={styles.timeFieldLabel}>Fin :</label>
                                  <input
                                    type="time"
                                    value={d.endTime || '17:00'}
                                    onChange={(e) => updateDayEndTime(d.id, e.target.value)}
                                    className={styles.timeInputField}
                                  />
                                </div>
                                <div className={styles.timeResultBadge}>
                                  <strong>{d.hours || 8}h</strong>
                                  <span>de service</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add day / Add week action buttons */}
                <div className={styles.addScheduleRow}>
                  <button
                    type="button"
                    onClick={addScheduleDay}
                    className={styles.addDayActionBtn}
                    id="add-day-btn"
                  >
                    <Plus size={15} />
                    <span>Ajouter une journée</span>
                  </button>

                  <button
                    type="button"
                    onClick={addScheduleWeek}
                    className={styles.addWeekActionBtn}
                    id="add-week-btn"
                  >
                    <CalendarRange size={15} />
                    <span>Ajouter une semaine (7 jours)</span>
                  </button>
                </div>

                {/* Schedule Summary Banner */}
                <div className={styles.scheduleSummaryBox}>
                  <div className={styles.scheduleSummaryLeft}>
                    <Calendar size={18} />
                    <div>
                      <span className={styles.scheduleSummaryTitle}>
                        {scheduleDays.length} journée{scheduleDays.length > 1 ? 's' : ''} configurée{scheduleDays.length > 1 ? 's' : ''}
                      </span>
                      <span className={styles.scheduleSummarySubtitle}>
                        Chauffeur privé dédié selon votre planning quotidien
                      </span>
                    </div>
                  </div>
                  <div className={styles.scheduleSummaryHoursBadge}>
                    {totalScheduleHours}h au total
                  </div>
                </div>

                {/* Long Distance Option (Common to both modes) */}
                <div className={styles.longDistanceSectionClean}>
                  <div className={styles.ldTitleHeader}>
                    <Route size={18} />
                    <div>
                      <h4 className={styles.ldTitleText}>Périmètre des déplacements</h4>
                      <p className={styles.ldSubText}>
                        Souhaitez-vous circuler en agglomération ou prévoir des trajets régionaux / intercités ?
                      </p>
                    </div>
                  </div>

                  <div className={styles.ldSegmentedRow}>
                    <button
                      type="button"
                      onClick={() => setHasLongDistance(false)}
                      className={`${styles.ldSegmentBtn} ${!hasLongDistance ? styles.ldSegmentActive : ''}`}
                    >
                      <Building2 size={16} />
                      <div className={styles.ldSegmentLabelBox}>
                        <strong>Paris & Île-de-France</strong>
                        <span>Trajets locaux et environs</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHasLongDistance(true)}
                      className={`${styles.ldSegmentBtn} ${hasLongDistance ? styles.ldSegmentActive : ''}`}
                    >
                      <Route size={16} />
                      <div className={styles.ldSegmentLabelBox}>
                        <strong>Longue distance / Intercités</strong>
                        <span>Trajets régionaux (&gt; 100 km)</span>
                      </div>
                    </button>
                  </div>

                  {hasLongDistance && (
                    <div className={styles.ldInputDrawer}>
                      <label className={styles.ldDrawerLabel}>
                        Précisez les villes, étapes ou régions prévues :
                      </label>
                      <input
                        type="text"
                        value={longDistanceCities}
                        onChange={(e) => setLongDistanceCities(e.target.value)}
                        placeholder="Ex : Paris - Deauville, Normandie, Reims, Champagne..."
                        className={styles.luxuryInput}
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.screenFooter}>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className={styles.nextStepBtn}
                  id="schedule-continue-btn"
                >
                  <span>Continuer vers les véhicules ({totalScheduleHours}h)</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              TRANSFER FLOW — STEP 3 : DATE & HEURE
              ══════════════════════════════════════════════════════════════════════════ */}
          {service === 'transfer' && step === 3 && (
            <motion.div
              key="datetime-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.screenContainer}
            >
              <div className={styles.screenIntro}>
                <span className={styles.microBadge}>PLANIFICATION</span>
                <h2 className={styles.screenTitle}>Quand votre chauffeur doit-il se présenter ?</h2>
                <p className={styles.screenSubtitle}>
                  Sélectionnez la date et l'horaire précis de votre prise en charge.
                </p>
              </div>

              <LuxuryDateTimePicker
                selectedDate={date}
                onDateChange={setDate}
                selectedTime={time}
                onTimeChange={setTime}
                isEn={i18n?.language === 'en'}
                minDateISO={todayISO}
              />

              <div className={styles.screenFooter}>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className={styles.nextStepBtn}
                  id="datetime-continue-btn"
                >
                  <span>Continuer vers les véhicules</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              TRANSFER & HOURLY — STEP : VEHICLE SELECTION
              ══════════════════════════════════════════════════════════════════════════ */}
          {((service === 'transfer' && step === 4) || (service === 'hourly' && step === 4)) && (
            <motion.div
              key="vehicle-selection-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.screenContainerLarge}
            >
              <div className={styles.screenIntro}>
                <span className={styles.microBadge}>FLOTTE DE PRESTIGE</span>
                <h2 className={styles.screenTitle}>Sélectionnez votre véhicule</h2>
                <p className={styles.screenSubtitle}>
                  Prestation de prestige tout inclus (carburant, péages, accueil chauffeur et accompagnement dédié).
                </p>
              </div>

              {/* Class Filter Quick Tabs */}
              <div className={styles.classFilterTabs}>
                <button
                  type="button"
                  onClick={() => setSelectedClassFilter('all')}
                  className={`${styles.classFilterTab} ${selectedClassFilter === 'all' ? styles.classFilterActive : ''}`}
                >
                  <span>Toute la flotte</span>
                </button>
                {VEHICLE_CLASSES.map((cls) => (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setSelectedClassFilter(cls.id)}
                    className={`${styles.classFilterTab} ${selectedClassFilter === cls.id ? styles.classFilterActive : ''} ${cls.id === 'vip' ? styles.classFilterVip : ''}`}
                  >
                    {cls.id === 'business' && <Briefcase size={13} />}
                    {cls.id === 'first' && <Award size={13} />}
                    {cls.id === 'xl' && <Users size={13} />}
                    {cls.id === 'vip' && <Sparkles size={13} />}
                    <span>{cls.title}</span>
                  </button>
                ))}
              </div>

              {/* Categorized Class Sections (Business -> First -> XL -> VIP) */}
              <div className={styles.classesContainer}>
                {VEHICLE_CLASSES.filter((cls) => selectedClassFilter === 'all' || selectedClassFilter === cls.id).map((cls) => {
                  const classVehicles = VEHICLES.filter((v) => v.classId === cls.id);
                  if (classVehicles.length === 0) return null;

                  return (
                    <div key={cls.id} className={styles.classSection} id={`class-section-${cls.id}`}>
                      {/* Class Header Bar */}
                      <div className={`${styles.classHeaderBar} ${cls.id === 'vip' ? styles.classHeaderVip : ''}`}>
                        <div className={styles.classHeaderLeft}>
                          <div className={`${styles.classIconPill} ${cls.id === 'vip' ? styles.classIconVip : ''}`}>
                            {cls.id === 'business' && <Briefcase size={16} />}
                            {cls.id === 'first' && <Award size={16} />}
                            {cls.id === 'xl' && <Users size={16} />}
                            {cls.id === 'vip' && <Sparkles size={16} />}
                          </div>
                          <div className={styles.classHeaderTexts}>
                            <div className={styles.classTitleRow}>
                              <h3 className={styles.classSectionTitle}>{cls.title}</h3>
                              <span className={styles.classSectionBadge}>{cls.badge}</span>
                            </div>
                            <p className={styles.classSectionDesc}>{cls.desc}</p>
                          </div>
                        </div>
                        <div className={styles.classHeaderNotice}>
                          <span>{cls.notice}</span>
                        </div>
                      </div>

                      {/* Vehicles in this class */}
                      <div className={styles.vehiclesListGrid}>
                        {classVehicles.map((v) => {
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
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setSelectedVehicle(v.id);
                                  goToNextStep();
                                }
                              }}
                              className={`${styles.vehicleSelectCard} ${isSelected ? styles.vehicleSelected : ''} ${v.classId === 'vip' ? styles.vehicleCardVip : ''}`}
                            >
                              <div className={styles.vehicleImgBox}>
                                <img src={displayImg} alt={v.name} className={styles.vehicleImg} />
                                {isSelected && (
                                  <div className={styles.vehicleCheckBadge}>
                                    <Check size={16} />
                                  </div>
                                )}
                                <span className={`${styles.vehicleBadgeOverlay} ${v.classId === 'vip' ? styles.vehicleBadgeVip : ''}`}>
                                  {v.categoryBadge}
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
                                    <div className={styles.vehicleClassMiniTag}>
                                      {v.classTitle}
                                    </div>
                                    <h4 className={styles.vehicleName}>{v.name}</h4>
                                    {service === 'hourly' && (
                                      <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 500, marginTop: '0.15rem' }}>
                                        Planning : {scheduleDays.length} jour{scheduleDays.length > 1 ? 's' : ''} · {totalScheduleHours}h au total{hasLongDistance ? ' · Longue distance' : ''}
                                      </div>
                                    )}
                                    <div className={styles.vehicleCapacityRow}>
                                      <span className={styles.vehicleCapacityBadge}>
                                        <Users size={12} strokeWidth={2} />
                                        <span>Jusqu'à {v.maxPassengers} passagers max</span>
                                      </span>
                                      <span className={styles.vehicleCapacityBadge}>
                                        <Luggage size={12} strokeWidth={2} />
                                        <span>{v.maxLuggage} valises max</span>
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

                                <p className={styles.vehicleDesc}>{v.desc}</p>

                                <div className={styles.vehicleQuotePills}>
                                  <span className={styles.quotePill}>Devis sur-mesure</span>
                                  <span className={styles.quotePill}>Péages & carburant inclus</span>
                                  <span className={styles.quotePill}>Attente offerte</span>
                                  <span className={styles.quotePill}>Wi-Fi & Eau fraîche</span>
                                </div>

                                <div className={styles.vehicleSelectCtaRow}>
                                  <span className={styles.vehicleSelectText}>
                                    {isSelected ? 'Véhicule sélectionné' : 'Choisir ce véhicule'}
                                  </span>
                                  <ArrowRight size={14} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              TRANSFER & HOURLY — STEP 5 : CONTACT DETAILS
              ══════════════════════════════════════════════════════════════════════════ */}
          {((service === 'transfer' && step === 5) || (service === 'hourly' && step === 5)) && (
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
                <span className={styles.microBadge}>COORDONNÉES CLIENT</span>
                <h2 className={styles.screenTitle}>Vos informations de contact</h2>
                <p className={styles.screenSubtitle}>
                  Pour recevoir votre confirmation et les détails du chauffeur avant la course.
                </p>
              </div>

              <div className={styles.contactFormGrid}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Prénom *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jean"
                      required
                      className={styles.luxuryInput}
                      id="firstname-input"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Nom *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Dupont"
                      required
                      className={styles.luxuryInput}
                      id="lastname-input"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      <Mail size={14} />
                      <span>Email *</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jean.dupont@gmail.com"
                      required
                      className={styles.luxuryInput}
                      id="email-input"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>
                      <Phone size={14} />
                      <span>Téléphone mobile *</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      required
                      className={styles.luxuryInput}
                      id="phone-input"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>
                    <Building2 size={14} />
                    <span>Société (Optionnel)</span>
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Maison de couture, Ambassade, Entreprise..."
                    className={styles.luxuryInput}
                  />
                </div>
              </div>

              <div className={styles.screenFooter}>
                <button
                  type="button"
                  disabled={!firstName?.trim() || !lastName?.trim() || !isEmailValid || !phone?.trim()}
                  onClick={goToNextStep}
                  className={styles.nextStepBtn}
                  id="contact-continue-btn"
                >
                  <span>Continuer</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              TRANSFER & HOURLY — STEP 6 : INSTRUCTIONS CHAUFFEUR & CONFORT
              ══════════════════════════════════════════════════════════════════════════ */}
          {((service === 'transfer' && step === 6) || (service === 'hourly' && step === 6)) && (
            <motion.div
              key="options-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.screenContainer}
            >
              <div className={styles.screenIntro}>
                <span className={styles.microBadge}>CONFORT À BORD</span>
                <h2 className={styles.screenTitle}>Détails complémentaires pour votre confort</h2>
                <p className={styles.screenSubtitle}>
                  Toutes ces options sont facultatives et incluses dans votre service.
                </p>
              </div>

              <div className={styles.optionsStack}>
                {/* CONTEXT-AWARE: FLIGHT NUMBER ONLY IF AIRPORT TRIP! */}
                {isAirportTrip && (
                  <div className={styles.optionBox}>
                    <div className={styles.optionBoxTop}>
                      <PlaneTakeoff size={20} />
                      <div className={styles.optionBoxText}>
                        <span className={styles.optionBoxTitle}>Numéro de vol d'arrivée</span>
                        <span className={styles.optionBoxDesc}>
                          Permet au chauffeur de suivre l'heure exacte de votre atterrissage en temps réel.
                        </span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      placeholder="Ex : AF1234, DL402, EK073..."
                      className={styles.luxuryInput}
                    />
                  </div>
                )}

                {/* Instructions particulières pour le chauffeur */}
                <div className={styles.instructionsSection}>
                  <label className={styles.fieldLabel} style={{ marginBottom: '0.85rem' }}>
                    <MessageSquare size={16} />
                    <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Instructions particulières pour le chauffeur</span>
                  </label>

                  <div className={styles.checkboxOptionsGrid}>
                    {DRIVER_INSTRUCTIONS_LIST.map((item) => {
                      const isChecked = driverInstructions.includes(item.id);
                      return (
                        <label
                          key={item.id}
                          className={`${styles.checkOptionCard} ${isChecked ? styles.checkOptionActive : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleDriverInstruction(item.id)}
                            className={styles.hiddenCheckbox}
                          />
                          <div className={styles.checkSquare}>
                            {isChecked && <Check size={14} />}
                          </div>
                          <div className={styles.checkText}>
                            <strong>{item.title}</strong>
                            <span>{item.desc}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className={styles.noteBox} style={{ marginTop: '1.25rem' }}>
                    <textarea
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Autre consigne ou code d'accès éventuel (optionnel)..."
                      className={styles.luxuryTextarea}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.screenFooterBetween}>
                <button type="button" onClick={goToNextStep} className={styles.skipBtn}>
                  Passer cette étape
                </button>
                <button type="button" onClick={goToNextStep} className={styles.nextStepBtn} id="options-continue-btn">
                  <span>Voir le récapitulatif</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════
              TRANSFER & HOURLY — STEP 7 : SUMMARY & FINAL CONFIRMATION
              ══════════════════════════════════════════════════════════════════════════ */}
          {((service === 'transfer' && step === 7) || (service === 'hourly' && step === 7)) && (
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
                  <div className={styles.voucherRefBox}>
                    <span className={styles.voucherLabel}>RÉFÉRENCE DU DEVIS</span>
                    <span className={styles.voucherRef}>SELY-{date?.replace(/-/g, '') || '2026'}-VIP</span>
                  </div>
                  <div className={styles.voucherStatusBadge}>
                    <CheckCircle2 size={13} />
                    <span>DEVIS OFFICIEL SUR-MESURE</span>
                  </div>
                </div>

                {/* Vehicle header */}
                <div className={styles.summaryVehicleHeader}>
                  <img src={selectedVehicleData.image} alt={selectedVehicleData.name} className={styles.summaryVehicleThumb} />
                  <div className={styles.summaryVehicleDetails}>
                    <span className={styles.summaryTag}>{service === 'transfer' ? 'TRANSFERT PRIVÉ' : 'MISE À DISPOSITION'}</span>
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
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`${styles.voiceBtn} ${isListening ? styles.voiceBtnActive : ''}`}
                    title="Activer la saisie vocale"
                  >
                    {isListening ? (
                      <>
                        <MicOff size={16} />
                        <span>En écoute... Cliquez pour arrêter</span>
                      </>
                    ) : (
                      <>
                        <Mic size={16} />
                        <span>Parler au micro</span>
                      </>
                    )}
                  </button>
                </div>

                <textarea
                  rows={5}
                  value={bespokeText}
                  onChange={(e) => setBespokeText(e.target.value)}
                  placeholder="Ex : Nous sommes 6 personnes arrivant de New York ce vendredi. Nous avons besoin d'un Classe V pour trois jours et d'une berline supplémentaire samedi soir..."
                  className={styles.bespokeLargeTextarea}
                  id="bespoke-textarea"
                />

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
                      <span>Téléphone mobile *</span>
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
                      <span>Email *</span>
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
