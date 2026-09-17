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
  ShieldCheck,
  PlaneTakeoff,
  Briefcase,
  MessageSquare,
  Loader2,
  AlertCircle,
  Car,
  ArrowRight,
  Route,
  SlidersHorizontal,
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  Luggage,
  CreditCard,
  Sparkles,
  Shield,
} from 'lucide-react';
import { getFormAccessKey } from '../lib/formRouting';
import { calculateTripPrice, getDrivingDistanceKm } from '../lib/pricingEngine';
import { createWhopCheckout } from '../lib/whopCheckout';
import { useBookingsStore } from '../admin/store/useBookingsStore';
import styles from './ReservationPage.module.css';

/* ─── vehicle catalogue ─── */
const VEHICLES = [
  {
    id: 'classe-v',
    nameKey: 'reservation.vehicles.classeV',
    nameFallback: 'Mercedes Classe V',
    passengers: '7 passagers',
    descKey: 'reservation.vehicles.classeVDesc',
    descFallback: 'Espace et confort premium pour vos déplacements en groupe.',
    image: '/vclass-main.png',
  },
  {
    id: 'classe-s',
    nameKey: 'reservation.vehicles.classeS',
    nameFallback: 'Mercedes Classe S',
    passengers: '3 passagers',
    descKey: 'reservation.vehicles.classeSDesc',
    descFallback: 'Berline de prestige, confort absolu et élégance intemporelle.',
    image: '/sclass-main.png',
  },
  {
    id: 'classe-e',
    nameKey: 'reservation.vehicles.classeE',
    nameFallback: 'Mercedes Classe E',
    passengers: '3 passagers',
    descKey: 'reservation.vehicles.classeEDesc',
    descFallback: 'Élégance et performance, idéale pour vos déplacements professionnels.',
    image: '/eclass-main.png',
  },
  {
    id: 'maybach',
    nameKey: 'reservation.vehicles.maybach',
    nameFallback: 'Mercedes-Maybach',
    passengers: '3 passagers',
    descKey: 'reservation.vehicles.maybachDesc',
    descFallback: 'L\'excellence automobile, le summum du luxe et du raffinement.',
    image: '/maybach-main.png',
  },
  {
    id: 'sprinter-vip',
    nameKey: 'reservation.vehicles.sprinterVip',
    nameFallback: 'Mercedes Sprinter VIP (7 places)',
    passengers: '7 passagers',
    descKey: 'reservation.vehicles.sprinterVipDesc',
    descFallback: 'Le grand luxe en salon privé mobile. Confort et intimité exceptionnels.',
    image: '/sprinter-7-ext.png',
  },
  {
    id: 'sprinter-12',
    nameKey: 'reservation.vehicles.sprinter12',
    nameFallback: 'Mercedes Sprinter VIP (12 places)',
    passengers: '12 passagers',
    descKey: 'reservation.vehicles.sprinter12Desc',
    descFallback: 'Grand salon VIP spacieux, confort et convivialité pour 12 passagers.',
    image: '/sprinter-12-ext.png',
  },
  {
    id: 'sprinter-minibus',
    nameKey: 'reservation.vehicles.sprinterMinibus',
    nameFallback: 'Minibus Mercedes Sprinter (16-19 places)',
    passengers: '16-19 passagers',
    descKey: 'reservation.vehicles.sprinterMinibusDesc',
    descFallback: 'Transport VIP grand groupe, espace et capacité exceptionnels.',
    image: '/sprinter-19-ext.png',
  },
  {
    id: 'tesla-y',
    nameKey: 'reservation.vehicles.teslaY',
    nameFallback: 'Tesla Model Y',
    passengers: '4 passagers',
    descKey: 'reservation.vehicles.teslaYDesc',
    descFallback: 'Mobilité électrique haut de gamme, silence et modernité.',
    image: '/tesla-model-y.png',
  },
  {
    id: 'limousine',
    nameKey: 'reservation.vehicles.limousine',
    nameFallback: 'Limousine Chrysler 300',
    passengers: '8-12 passagers',
    descKey: 'reservation.vehicles.limousineDesc',
    descFallback: 'Expérience limousine exclusive pour vos événements prestigieux.',
    image: '/chrysler_300_limo.png',
  },
];

/* ─── animation variants ─── */
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
};

/* ─── helpers ─── */
const AIRPORT_KEYWORDS = ['aéroport', 'cdg', 'orly', 'airport', 'roissy', 'beauvais'];

function containsAirport(value) {
  if (!value) return false;
  const lower = value.toLowerCase();
  return AIRPORT_KEYWORDS.some((kw) => lower.includes(kw));
}

/* ─── component ─── */
export default function ReservationPage() {
  const { t, cityName, currentCity, getCityPath, i18n } = useCity();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const earliestDateTime = useMemo(() => getEarliestBookingDateTime(), []);
  const todayISO = useMemo(() => formatDateISO(new Date()), []);

  /* --- pre-filled trip info from URL --- */
  const [serviceType, setServiceType] = useState(
    searchParams.get('service') || 'transfer'
  );
  // Hook up address autocomplete with active city bias
  const pickupAutocomplete = useAddressAutocomplete(searchParams.get('pickup') || '', currentCity || 'paris');
  const destAutocomplete = useAddressAutocomplete(searchParams.get('destination') || '', currentCity || 'paris');
  
  const pickup = pickupAutocomplete.query;
  const setPickup = pickupAutocomplete.setQuery;
  const destination = destAutocomplete.query;
  const setDestination = destAutocomplete.setQuery;
  
  const [pickupCoords, setPickupCoords] = useState(() => {
    const raw = searchParams.get('pickupCoords');
    if (raw && raw.includes(',')) {
      const parts = raw.split(',').map(Number);
      if (!isNaN(parts[0]) && !isNaN(parts[1])) return parts;
    }
    return null;
  });
  const [destCoords, setDestCoords] = useState(() => {
    const raw = searchParams.get('destCoords');
    if (raw && raw.includes(',')) {
      const parts = raw.split(',').map(Number);
      if (!isNaN(parts[0]) && !isNaN(parts[1])) return parts;
    }
    return null;
  });
  const [distanceKm, setDistanceKm] = useState(null);

  const formRef = useRef(null);
  const [pickupFocused, setPickupFocused] = useState(false);
  const [destFocused, setDestFocused] = useState(false);
  const [duration, setDuration] = useState(searchParams.get('duration') || '3 heures');
  const [date, setDate] = useState(() => {
    if (searchParams.get('date')) return searchParams.get('date');
    return formatDateISO(earliestDateTime);
  });
  const [time, setTime] = useState(() => {
    if (searchParams.get('time')) return searchParams.get('time');
    return formatTimeHHMM(earliestDateTime);
  });

  /* --- vehicle --- */
  const [selectedVehicle, setSelectedVehicle] = useState('classe-s'); // Select Classe S by default

  /* --- personal info --- */
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [passengerCount, setPassengerCount] = useState('1');

  /* --- options --- */
  const [babySeat, setBabySeat] = useState(false);
  const [childSeat, setChildSeat] = useState(false);
  const [nameBoard, setNameBoard] = useState(false);
  const [flightNumber, setFlightNumber] = useState('');
  const [luggageCount, setLuggageCount] = useState('0');
  const [specialRequests, setSpecialRequests] = useState('');

  /* --- form state --- */
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [submissionAction, setSubmissionAction] = useState('pay'); // 'pay' | 'quote'

  // Geocode an address query into [lon, lat] automatically
  const geocodeAddress = useCallback(async (text) => {
    if (!text || text.trim().length < 3) return null;
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(text)}&limit=1`);
      if (res.ok) {
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          return data.features[0].geometry.coordinates; // [lon, lat]
        }
      }
    } catch (e) {}
    return null;
  }, []);

  // Automatic geocoding if user typed an address without selecting from dropdown
  useEffect(() => {
    let active = true;
    if (pickup && pickup.trim().length >= 4 && !pickupCoords) {
      const timer = setTimeout(() => {
        geocodeAddress(pickup).then((coords) => {
          if (active && coords) setPickupCoords(coords);
        });
      }, 600);
      return () => { active = false; clearTimeout(timer); };
    }
  }, [pickup, pickupCoords, geocodeAddress]);

  useEffect(() => {
    let active = true;
    if (destination && destination.trim().length >= 4 && !destCoords) {
      const timer = setTimeout(() => {
        geocodeAddress(destination).then((coords) => {
          if (active && coords) setDestCoords(coords);
        });
      }, 600);
      return () => { active = false; clearTimeout(timer); };
    }
  }, [destination, destCoords, geocodeAddress]);

  // Calcul automatique de la distance routière en temps réel
  useEffect(() => {
    let active = true;
    if (serviceType === 'transfer' && pickupCoords && destCoords) {
      getDrivingDistanceKm(pickupCoords, destCoords).then((dist) => {
        if (active && dist) setDistanceKm(dist);
      });
    }
    return () => { active = false; };
  }, [serviceType, pickupCoords, destCoords]);

  const showFlightField = useMemo(
    () => containsAirport(pickup) || containsAirport(destination),
    [pickup, destination]
  );

  const selectedVehicleData = useMemo(
    () => VEHICLES.find((v) => v.id === selectedVehicle),
    [selectedVehicle]
  );

  // Blacklane-style check: trip must be defined to compute exact prices and proceed
  const isTripDefined = useMemo(() => {
    if (!pickup || pickup.trim().length < 3) return false;
    if (serviceType === 'transfer') {
      return Boolean(destination && destination.trim().length >= 3);
    }
    return Boolean(duration);
  }, [pickup, destination, serviceType, duration]);

  // Moteur de calcul tarifaire intelligent en direct
  const calculatedPrice = useMemo(() => {
    if (!selectedVehicle || !isTripDefined) return null;
    return calculateTripPrice({
      city: currentCity || 'paris',
      serviceType,
      vehicleId: selectedVehicle,
      duration: duration || '3',
      distanceKm,
      pickup,
      destination,
      time,
      options: { babySeat, childSeat, nameBoard },
      lang: i18n?.language === 'en' ? 'en' : 'fr',
    });
  }, [
    currentCity,
    serviceType,
    selectedVehicle,
    duration,
    distanceKm,
    pickup,
    destination,
    time,
    babySeat,
    childSeat,
    nameBoard,
    isTripDefined,
  ]);

  /* --- submit handler --- */
  const handleSubmit = useCallback(
    async (e, actionType = 'pay') => {
      if (e && e.preventDefault) e.preventDefault();
      
      // Blacklane check: must have pickup and destination
      if (!isTripDefined) {
        setErrorMessage(serviceType === 'transfer' ? 'error_transfer' : 'error_hourly');
        setStatus('error');
        if (!pickup) setPickupFocused(true);
        else setDestFocused(true);
        window.scrollTo({ top: 180, behavior: 'smooth' });
        return;
      }

      // Timing check: minimum 3h notice & night rule
      const timeValidation = validateBookingDateTime(date, time);
      if (!timeValidation.isValid) {
        setErrorMessage(timeValidation.errorKey);
        setStatus('error');
        window.scrollTo({ top: 180, behavior: 'smooth' });
        return;
      }

      // HTML5 form validation (check required fields: first name, last name, email, phone, pickup, etc.)
      if (formRef.current && !formRef.current.reportValidity()) {
        return;
      }

      setStatus('loading');

      const isPayment = actionType === 'pay';
      const totalTTC = calculatedPrice ? `${calculatedPrice.total} € TTC` : 'Sur devis';

      // 0. Enregistrer immédiatement dans l'Espace Admin SELY Office
      try {
        useBookingsStore.getState().addBooking({
          clientName: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          company,
          city: currentCity || 'paris',
          serviceType,
          pickup,
          destination: serviceType === 'transfer' ? destination : `${duration || '3 heures'}`,
          date,
          time,
          passengerCount,
          luggageCount,
          vehicle: selectedVehicleData?.nameFallback || 'Mercedes Classe S',
          amount: calculatedPrice ? calculatedPrice.total : 0,
          status: isPayment ? 'pending' : 'quote',
          flightNumber,
          specialRequests,
        });
      } catch (storeErr) {
        console.warn('Booking store save warning:', storeErr);
      }

      const payload = {
        access_key: getFormAccessKey(),
        subject: isPayment
          ? `[RÉSERVATION & PAIEMENT WHOP] [${cityName || 'Paris'}] - SELY (${totalTTC})`
          : `[DEMANDE DE DEVIS] [${cityName || 'Paris'}] - SELY (${totalTTC})`,
        from_name: `${firstName} ${lastName}`,
        Ville: cityName || currentCity || 'Paris',
        'Montant calculé': totalTTC,
        'Détail tarif': calculatedPrice?.details || '—',
        ...(distanceKm ? { 'Distance estimée': `${distanceKm} km` } : {}),
        /* trip */
        'Type de service': serviceType === 'transfer' ? 'Transfert' : 'Mise à disposition',
        'Lieu de prise en charge': pickup,
        ...(serviceType === 'transfer'
          ? { Destination: destination }
          : { Durée: duration || '3 heures' }),
        Date: date,
        Heure: time,
        /* vehicle */
        Véhicule: selectedVehicleData?.nameFallback || 'Mercedes Classe S',
        /* personal */
        Prénom: firstName,
        Nom: lastName,
        Email: email,
        Téléphone: phone,
        Société: company || '—',
        'Nombre de passagers': passengerCount,
        /* options */
        'Siège bébé': babySeat ? 'Oui (+15€)' : 'Non',
        'Siège enfant': childSeat ? 'Oui (+15€)' : 'Non',
        'Accueil avec panneau': nameBoard ? 'Oui (+20€)' : 'Non',
        ...(showFlightField ? { 'Numéro de vol': flightNumber || '—' } : {}),
        'Nombre de bagages': luggageCount,
        'Demandes particulières': specialRequests || '—',
      };

      try {
        // 1. Sauvegarder la réservation et notifier la direction par email
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch((err) => console.warn('Email notification warning:', err));

        if (isPayment) {
          if (!calculatedPrice || !calculatedPrice.total || calculatedPrice.total <= 0) {
            setErrorMessage('error_price_calc');
            setStatus('error');
            return;
          }

          // 2. Générer le checkout Whop dynamique
          const returnUrl = `${window.location.origin}/${currentCity ? currentCity + '/' : ''}reservation-succes`;
          const vehicleNameShort = selectedVehicleData?.nameFallback ? selectedVehicleData.nameFallback.replace('Mercedes ', '') : 'Chauffeur';
          const checkoutUrl = await createWhopCheckout({
            amount: calculatedPrice.total,
            currency: 'eur',
            title: `SELY - ${vehicleNameShort}`.slice(0, 30),
            description: `${calculatedPrice.details} | Client: ${firstName} ${lastName} | Trajet: ${pickup} → ${serviceType === 'transfer' ? destination : duration} | Date: ${date} ${time}`,
            metadata: {
              client: `${firstName} ${lastName}`,
              email,
              phone,
              city: currentCity || 'paris',
              serviceType,
              pickup,
              destination: serviceType === 'transfer' ? destination : `${duration || 3}h`,
            },
            redirectUrl: returnUrl,
          });

          if (checkoutUrl) {
            window.location.href = checkoutUrl;
            return;
          } else {
            throw new Error("Impossible de générer l'URL de redirection Whop.");
          }
        }

        // Si demande de devis simple expressément demandée
        setStatus('success');
      } catch (err) {
        console.error('Reservation submission error:', err);
        setErrorMessage(err.message || 'error_whop_redirect');
        setStatus('error');
      }
    },
    [
      isTripDefined, calculatedPrice, distanceKm, cityName, currentCity,
      serviceType, pickup, destination, duration, date, time,
      selectedVehicle, selectedVehicleData,
      firstName, lastName, email, phone, company, passengerCount,
      babySeat, childSeat, nameBoard, flightNumber, luggageCount,
      specialRequests, showFlightField,
    ]
  );

  /* ─── render ─── */
  if (status === 'success') {
    return (
      <div className={styles.page}>
        <motion.div
          className={styles.successWrapper}
          variants={successVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className={styles.successIcon}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          >
            <Check size={48} strokeWidth={2.5} />
          </motion.div>
          <motion.h2
            className={styles.successTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {t('reservation.success.title', 'Demande envoyée avec succès')}
          </motion.h2>
          <motion.p
            className={styles.successText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            {t(
              'reservation.success.message',
              'Notre équipe vous contactera dans les plus brefs délais avec un devis personnalisé.'
            )}
          </motion.p>
          <motion.div
            className={styles.successAccent}
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <form ref={formRef} onSubmit={(e) => handleSubmit(e, submissionAction)} className={styles.formWrapper}>
        {/* ─────── SECTION 1 — Trip Summary Banner ─────── */}
        <motion.section
          className={styles.tripBanner}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={styles.sectionHeader}>
            <Route size={14} className={styles.sectionIcon} />
            <span className={styles.sectionLabel}>
              {t('reservation.tripSummary.label', 'Votre trajet')}
            </span>
          </div>

          {/* service toggle */}
          <div className={styles.serviceToggle}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${serviceType === 'transfer' ? styles.toggleActive : ''}`}
              onClick={() => setServiceType('transfer')}
            >
              <ArrowRight size={14} />
              {t('reservation.service.transfer', 'Transfert')}
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${serviceType === 'hourly' ? styles.toggleActive : ''}`}
              onClick={() => setServiceType('hourly')}
            >
              <Clock size={14} />
              {t('reservation.service.hourly', 'Mise à disposition')}
            </button>
          </div>

          <div className={styles.tripGrid}>
            <div className={styles.inputGroup} style={{ position: 'relative' }}>
              <label className={styles.inputLabel}>
                <MapPin size={13} />
                {t('reservation.tripSummary.pickup', 'Prise en charge')}
              </label>
              <input
                type="text"
                className={styles.input}
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                onFocus={() => setPickupFocused(true)}
                onBlur={() => setPickupFocused(false)}
                placeholder={t('reservation.tripSummary.pickupPlaceholder', 'Adresse de départ')}
                required
              />
              <AnimatePresence>
                {pickupFocused && pickupAutocomplete.suggestions.length > 0 && (
                  <motion.div 
                    className={styles.suggestions}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {pickupAutocomplete.suggestions.map((s) => (
                      <div 
                        key={s.id} 
                        className={styles.suggestionItem}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setPickup(s.label);
                          if (s.coordinates) setPickupCoords(s.coordinates);
                          pickupAutocomplete.setSuggestions([]);
                          setPickupFocused(false);
                        }}
                      >
                        <MapPin size={13} style={{ marginRight: 6, opacity: 0.7, flexShrink: 0 }} />
                        <span>{s.label}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* destination or duration */}
            {serviceType === 'transfer' ? (
              <div className={styles.inputGroup} style={{ position: 'relative' }}>
                <label className={styles.inputLabel}>
                  <MapPin size={13} />
                  {t('reservation.tripSummary.destination', 'Destination')} *
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onFocus={() => setDestFocused(true)}
                  onBlur={() => setDestFocused(false)}
                  placeholder={t('reservation.tripSummary.destinationPlaceholder', 'Adresse exacte d\'arrivée')}
                  required
                />
                <AnimatePresence>
                  {destFocused && destAutocomplete.suggestions.length > 0 && (
                    <motion.div 
                      className={styles.suggestions}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {destAutocomplete.suggestions.map((s) => (
                        <div 
                          key={s.id} 
                          className={styles.suggestionItem}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setDestination(s.label);
                            if (s.coordinates) setDestCoords(s.coordinates);
                            destAutocomplete.setSuggestions([]);
                            setDestFocused(false);
                          }}
                        >
                          <Navigation size={13} style={{ marginRight: 6, opacity: 0.7, flexShrink: 0 }} />
                          <span>{s.label}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <Clock size={13} />
                  {t('reservation.tripSummary.duration', 'Durée')}
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder={t('reservation.tripSummary.durationPlaceholder', 'Ex: 4 heures')}
                  required
                />
              </div>
            )}

            {/* date */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Calendar size={13} />
                {t('reservation.tripSummary.date', 'Date')}
              </label>
              <div
                className={styles.input + ' ' + styles.clickableInput}
                onClick={() => {
                  const el = document.getElementById('res-date-input');
                  if (el) { el.showPicker ? el.showPicker() : el.focus(); }
                }}
              >
                <span className={date ? styles.valueSet : styles.valuePlaceholder}>
                  {date
                    ? new Date(date + 'T00:00:00').toLocaleDateString(i18n?.language === 'en' ? 'en-US' : 'fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : 'jj/mm/aaaa'}
                </span>
                <input
                  id="res-date-input"
                  type="date"
                  min={todayISO}
                  className={styles.hiddenNativeInput}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* time */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Clock size={13} />
                {t('reservation.tripSummary.time', 'Heure')}
              </label>
              <div
                className={styles.input + ' ' + styles.clickableInput}
                onClick={() => {
                  const el = document.getElementById('res-time-input');
                  if (el) { el.showPicker ? el.showPicker() : el.focus(); }
                }}
              >
                <span className={time ? styles.valueSet : styles.valuePlaceholder}>
                  {time || '--:--'}
                </span>
                <input
                  id="res-time-input"
                  type="time"
                  className={styles.hiddenNativeInput}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─────── SECTION 2 — Vehicle Selection ─────── */}
        <motion.section
          className={styles.section}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className={styles.sectionHeader}>
            <Car size={14} className={styles.sectionIcon} />
            <span className={styles.sectionLabel}>
              {t('reservation.vehicles.label', 'Choisissez votre véhicule')}
            </span>
          </div>

          {!isTripDefined && (
            <div className={styles.tripNotice}>
              <MapPin size={18} color="#e5c158" style={{ flexShrink: 0 }} />
              <div>
                <strong>{t('reservation.notice_vehicle_title', 'Indiquez votre lieu de départ et de destination ci-dessus')}</strong>
                <p>{t('reservation.notice_vehicle_desc', "Les tarifs exacts garantis par véhicule s'afficheront dès la saisie de votre trajet.")}</p>
              </div>
            </div>
          )}

          <div className={styles.vehicleGrid}>
            {VEHICLES.map((vehicle, i) => {
              const isSelected = selectedVehicle === vehicle.id;
              return (
                <motion.button
                  key={vehicle.id}
                  type="button"
                  className={`${styles.vehicleCard} ${isSelected ? styles.vehicleSelected : ''}`}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={styles.vehicleImageWrapper}>
                    <img
                      src={vehicle.image}
                      alt={t(vehicle.nameKey, vehicle.nameFallback)}
                      className={styles.vehicleImage}
                      loading="lazy"
                    />
                    {isSelected && (
                      <motion.div
                        className={styles.vehicleCheck}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <Check size={16} strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>
                  <div className={styles.vehicleInfo}>
                    <h3 className={styles.vehicleName}>
                      {t(vehicle.nameKey, vehicle.nameFallback)}
                    </h3>
                    <div className={styles.vehicleMeta}>
                      <span className={styles.vehiclePassengers}>
                        <Users size={12} />
                        {vehicle.passengers}
                      </span>
                      <span className={styles.vehiclePrice}>
                        {(() => {
                          if (!isTripDefined) {
                            return t('reservation.address_required', 'Adresse requise');
                          }
                          const vPrice = calculateTripPrice({
                            city: currentCity || 'paris',
                            serviceType,
                            vehicleId: vehicle.id,
                            duration: duration || '3',
                            distanceKm,
                            pickup,
                            destination,
                            time,
                            lang: i18n?.language === 'en' ? 'en' : 'fr',
                          });
                          return `${vPrice.total} €`;
                        })()}
                      </span>
                    </div>
                    <p className={styles.vehicleDesc}>
                      {t(vehicle.descKey, vehicle.descFallback)}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* ─────── SECTION 3 — Your Information ─────── */}
        <motion.section
          className={styles.section}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className={styles.sectionHeader}>
            <User size={14} className={styles.sectionIcon} />
            <span className={styles.sectionLabel}>
              {t('reservation.info.label', 'Vos informations')}
            </span>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <User size={13} />
                {t('reservation.info.firstName', 'Prénom')} *
              </label>
              <input
                type="text"
                className={styles.input}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('reservation.info.firstNamePlaceholder', 'Votre prénom')}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <User size={13} />
                {t('reservation.info.lastName', 'Nom')} *
              </label>
              <input
                type="text"
                className={styles.input}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t('reservation.info.lastNamePlaceholder', 'Votre nom')}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Mail size={13} />
                {t('reservation.info.email', 'Email')} *
              </label>
              <input
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('reservation.info.emailPlaceholder', 'votre@email.com')}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Phone size={13} />
                {t('reservation.info.phone', 'Téléphone')} *
              </label>
              <input
                type="tel"
                className={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('reservation.info.phonePlaceholder', '+33 6 00 00 00 00')}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Building2 size={13} />
                {t('reservation.info.company', 'Société')}
              </label>
              <input
                type="text"
                className={styles.input}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={t('reservation.info.companyPlaceholder', 'Nom de votre société (optionnel)')}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Users size={13} />
                {t('reservation.info.passengers', 'Nombre de passagers')}
              </label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.select}
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(e.target.value)}
                >
                  {Array.from({ length: 19 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1
                        ? t('reservation.info.passenger', 'passager')
                        : t('reservation.info.passengersUnit', 'passagers')}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className={styles.selectChevron} />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─────── SECTION 4 — Options & Details ─────── */}
        <motion.section
          className={styles.section}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className={styles.sectionHeader}>
            <SlidersHorizontal size={14} className={styles.sectionIcon} />
            <span className={styles.sectionLabel}>
              {t('reservation.options.label', 'Options & détails')}
            </span>
          </div>

          {/* checkboxes */}
          <div className={styles.optionsGrid}>
            <label className={`${styles.checkboxCard} ${babySeat ? styles.checkboxActive : ''}`}>
              <input
                type="checkbox"
                checked={babySeat}
                onChange={(e) => setBabySeat(e.target.checked)}
                className={styles.hiddenCheckbox}
              />
              <div className={styles.checkboxIcon}>
                <Baby size={20} />
              </div>
              <span className={styles.checkboxLabel}>
                {t('reservation.options.babySeat', 'Siège bébé')}
              </span>
              <div className={styles.checkboxIndicator}>
                {babySeat && <Check size={14} strokeWidth={3} />}
              </div>
            </label>

            <label className={`${styles.checkboxCard} ${childSeat ? styles.checkboxActive : ''}`}>
              <input
                type="checkbox"
                checked={childSeat}
                onChange={(e) => setChildSeat(e.target.checked)}
                className={styles.hiddenCheckbox}
              />
              <div className={styles.checkboxIcon}>
                <ShieldCheck size={20} />
              </div>
              <span className={styles.checkboxLabel}>
                {t('reservation.options.childSeat', 'Siège enfant')}
              </span>
              <div className={styles.checkboxIndicator}>
                {childSeat && <Check size={14} strokeWidth={3} />}
              </div>
            </label>

            <label className={`${styles.checkboxCard} ${nameBoard ? styles.checkboxActive : ''}`}>
              <input
                type="checkbox"
                checked={nameBoard}
                onChange={(e) => setNameBoard(e.target.checked)}
                className={styles.hiddenCheckbox}
              />
              <div className={styles.checkboxIcon}>
                <FileText size={20} />
              </div>
              <span className={styles.checkboxLabel}>
                {t('reservation.options.nameBoard', 'Accueil avec panneau nominatif')}
              </span>
              <div className={styles.checkboxIndicator}>
                {nameBoard && <Check size={14} strokeWidth={3} />}
              </div>
            </label>
          </div>

          {/* conditional flight number */}
          <AnimatePresence>
            {showFlightField && (
              <motion.div
                className={styles.inputGroup}
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <label className={styles.inputLabel}>
                  <PlaneTakeoff size={13} />
                  {t('reservation.options.flightNumber', 'Numéro de vol')}
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder={t('reservation.options.flightPlaceholder', 'Ex: AF1234')}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* luggage + special requests */}
          <div className={styles.detailsRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Briefcase size={13} />
                {t('reservation.options.luggage', 'Nombre de bagages')}
              </label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.select}
                  value={luggageCount}
                  onChange={(e) => setLuggageCount(e.target.value)}
                >
                  {Array.from({ length: 21 }, (_, i) => i).map((n) => (
                    <option key={n} value={n}>
                      {n} {n <= 1
                        ? t('reservation.options.luggageUnit', 'bagage')
                        : t('reservation.options.luggageUnits', 'bagages')}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className={styles.selectChevron} />
              </div>
            </div>
          </div>

          <div className={styles.inputGroup} style={{ marginTop: 20 }}>
            <label className={styles.inputLabel}>
              <MessageSquare size={13} />
              {t('reservation.options.specialRequests', 'Demandes particulières')}
            </label>
            <textarea
              className={styles.textarea}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder={t(
                'reservation.options.specialPlaceholder',
                'Informations complémentaires, demandes spécifiques...'
              )}
              rows={4}
            />
          </div>
        </motion.section>

        {/* ─────── SUBMIT & PRICING CARD ─────── */}
        <motion.div
          className={styles.submitSection}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {calculatedPrice && (
            <motion.div 
              className={styles.pricingCard}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.pricingHeader}>
                <div className={styles.pricingTitleBox}>
                  <span className={styles.pricingBadge}>
                    <Sparkles size={12} />
                    {t('reservation.pricing_guaranteed', 'Tarif Garanti & Tout Inclus')}
                  </span>
                </div>
                <div className={styles.pricingAmountBox}>
                  <span className={styles.pricingAmount}>
                    {calculatedPrice.total} {calculatedPrice.symbol}
                  </span>
                  <span className={styles.pricingTax}>TTC</span>
                </div>
              </div>

              <div className={styles.pricingBreakdown}>
                <div className={styles.pricingItem}>
                  <span className={styles.pricingItemLabel}>{t('reservation.pricing_service', 'Prestation :')}</span>
                  <span className={styles.pricingItemValue}>{calculatedPrice.details}</span>
                </div>
                {calculatedPrice.optionsPrice > 0 && (
                  <div className={styles.pricingItem}>
                    <span className={styles.pricingItemLabel}>{t('reservation.pricing_options', 'Options à bord :')}</span>
                    <span className={styles.pricingItemValue}>+{calculatedPrice.optionsPrice} €</span>
                  </div>
                )}
                <div className={styles.pricingItem}>
                  <span className={styles.pricingItemLabel}>{t('reservation.pricing_included', 'Service inclus :')}</span>
                  <span className={styles.pricingItemValue}>{t('reservation.pricing_amenities', 'Chauffeur en costume, accueil personnalisé, wifi, rafraîchissements')}</span>
                </div>
              </div>

              <div className={styles.pricingBadgesRow}>
                <div className={styles.pricingBadgeItem}>
                  <Shield size={13} color="#e5c158" />
                  <span>{t('reservation.badge_secure', 'Paiement 100% sécurisé')}</span>
                </div>
                <div className={styles.pricingBadgeItem}>
                  <CreditCard size={13} color="#e5c158" />
                  <span>{t('reservation.badge_payment_methods', 'Apple Pay • Google Pay • CB')}</span>
                </div>
                <div className={styles.pricingBadgeItem}>
                  <Sparkles size={13} color="#e5c158" />
                  <span>{t('reservation.badge_instant_confirmation', 'Confirmation instantanée')}</span>
                </div>
              </div>
            </motion.div>
          )}

          {!isTripDefined && (
            <div className={styles.tripNotice} style={{ marginBottom: '1.5rem', background: 'rgba(229, 193, 88, 0.08)', border: '1px solid rgba(229, 193, 88, 0.25)' }}>
              <MapPin size={18} color="#e5c158" style={{ flexShrink: 0 }} />
              <div>
                <strong>{t('reservation.notice_checkout_title', 'Adresses précises requises pour calculer le tarif garanti')}</strong>
                <p>{t('reservation.notice_checkout_desc', "Veuillez renseigner votre lieu de prise en charge et votre destination exacte en haut de page pour calculer l'itinéraire et activer le paiement sécurisé en ligne.")}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <motion.div
              className={styles.errorBanner}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', width: '100%' }}>
                <span>
                  {errorMessage?.startsWith('error_')
                    ? t(`reservation.${errorMessage}`, t(`hero.${errorMessage}`, errorMessage))
                    : (errorMessage || t('reservation.error', 'Une erreur est survenue lors du traitement. Veuillez réessayer.'))}
                </span>
                {['error_min_notice_3h', 'error_night_before_8am', 'error_past_datetime'].includes(errorMessage) && (
                  <button
                    type="button"
                    onClick={() => navigate(getCityPath(`/demande-specifique?type=rapide&pickup=${encodeURIComponent(pickup || '')}&date=${date}&time=${time}`))}
                    style={{
                      background: '#e5c158',
                      color: '#0b0c0e',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    ⚡ {t('reservation.urgent_cta', 'Prise en charge rapide')}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          <div className={styles.paymentActionsRow}>
            <motion.button
              type="submit"
              onClick={() => setSubmissionAction('pay')}
              className={styles.submitBtnWhop}
              disabled={status === 'loading'}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {status === 'loading' && submissionAction === 'pay' ? (
                <>
                  <Loader2 size={18} className={styles.spinner} />
                  <span>{t('reservation.generating_payment', 'Génération sécurisée du paiement...')}</span>
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>
                    {t('reservation.pay_btn', 'Réserver & Payer en ligne')} ({calculatedPrice ? `${calculatedPrice.total} €` : '—'})
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>

            <button
              type="submit"
              className={styles.quoteOnlyBtn}
              onClick={() => setSubmissionAction('quote')}
              disabled={status === 'loading'}
            >
              {status === 'loading' && submissionAction === 'quote'
                ? t('reservation.processing', 'Traitement en cours...')
                : t('reservation.quote_btn', 'Demander un devis sans paiement immédiat')}
            </button>
          </div>

          <p className={styles.submitNote}>
            {t('reservation.secure_note', 'Transaction sécurisée par Whop Inc. Chauffeur privé professionnel garanti.')}
          </p>
        </motion.div>
      </form>
    </div>
  );
}
