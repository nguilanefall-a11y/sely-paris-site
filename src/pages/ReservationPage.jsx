import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete';
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
} from 'lucide-react';
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
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  /* --- pre-filled trip info from URL --- */
  const [serviceType, setServiceType] = useState(
    searchParams.get('service') || 'transfer'
  );
  // Hook up address autocomplete
  const pickupAutocomplete = useAddressAutocomplete(searchParams.get('pickup') || '');
  const destAutocomplete = useAddressAutocomplete(searchParams.get('destination') || '');
  
  const pickup = pickupAutocomplete.query;
  const setPickup = pickupAutocomplete.setQuery;
  const destination = destAutocomplete.query;
  const setDestination = destAutocomplete.setQuery;
  
  const [pickupFocused, setPickupFocused] = useState(false);
  const [destFocused, setDestFocused] = useState(false);
  const [duration, setDuration] = useState(searchParams.get('duration') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [time, setTime] = useState(searchParams.get('time') || '');

  /* --- vehicle --- */
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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

  const showFlightField = useMemo(
    () => containsAirport(pickup) || containsAirport(destination),
    [pickup, destination]
  );

  const selectedVehicleData = useMemo(
    () => VEHICLES.find((v) => v.id === selectedVehicle),
    [selectedVehicle]
  );

  /* --- submit handler --- */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setStatus('loading');

      const payload = {
        access_key: 'dee08b8f-5afc-44f3-a9d4-a80bd02bce90',
        subject: 'Nouvelle Demande de Réservation - SELY',
        from_name: `${firstName} ${lastName}`,
        /* trip */
        'Type de service': serviceType === 'transfer' ? 'Transfert' : 'Mise à disposition',
        'Lieu de prise en charge': pickup,
        ...(serviceType === 'transfer'
          ? { Destination: destination }
          : { Durée: duration }),
        Date: date,
        Heure: time,
        /* vehicle */
        Véhicule: selectedVehicleData?.nameFallback || '—',
        /* personal */
        Prénom: firstName,
        Nom: lastName,
        Email: email,
        Téléphone: phone,
        Société: company || '—',
        'Nombre de passagers': passengerCount,
        /* options */
        'Siège bébé': babySeat ? 'Oui' : 'Non',
        'Siège enfant': childSeat ? 'Oui' : 'Non',
        'Accueil avec panneau': nameBoard ? 'Oui' : 'Non',
        ...(showFlightField ? { 'Numéro de vol': flightNumber || '—' } : {}),
        'Nombre de bagages': luggageCount,
        'Demandes particulières': specialRequests || '—',
      };

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    },
    [
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
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
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
                {pickupFocused && (
                  <motion.div 
                    className={styles.suggestions}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {pickupAutocomplete.suggestions.length > 0 ? (
                      pickupAutocomplete.suggestions.map((s) => (
                        <div 
                          key={s.id} 
                          className={styles.suggestionItem}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setPickup(s.label);
                            pickupAutocomplete.setSuggestions([]);
                            setPickupFocused(false);
                          }}
                        >
                          {s.label}
                        </div>
                      ))
                    ) : (
                      ['Paris Centre', 'Aéroport CDG', 'Aéroport Orly', 'Gare de Lyon'].map((s) => (
                        <span 
                          key={s} 
                          className={styles.chip}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setPickup(s);
                            setPickupFocused(false);
                          }}
                        >
                          {s}
                        </span>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* destination or duration */}
            {serviceType === 'transfer' ? (
              <div className={styles.inputGroup} style={{ position: 'relative' }}>
                <label className={styles.inputLabel}>
                  <MapPin size={13} />
                  {t('reservation.tripSummary.destination', 'Destination')}
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onFocus={() => setDestFocused(true)}
                  onBlur={() => setDestFocused(false)}
                  placeholder={t('reservation.tripSummary.destinationPlaceholder', 'Adresse d\'arrivée')}
                  required
                />
                <AnimatePresence>
                  {destFocused && (
                    <motion.div 
                      className={styles.suggestions}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {destAutocomplete.suggestions.length > 0 ? (
                        destAutocomplete.suggestions.map((s) => (
                          <div 
                            key={s.id} 
                            className={styles.suggestionItem}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setDestination(s.label);
                              destAutocomplete.setSuggestions([]);
                              setDestFocused(false);
                            }}
                          >
                            {s.label}
                          </div>
                        ))
                      ) : (
                        ['Paris Centre', 'Aéroport CDG', 'Aéroport Orly', 'Gare de Lyon'].map((s) => (
                          <span 
                            key={s} 
                            className={styles.chip}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setDestination(s);
                              setDestFocused(false);
                            }}
                          >
                            {s}
                          </span>
                        ))
                      )}
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
                    ? new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : 'jj/mm/aaaa'}
                </span>
                <input
                  id="res-date-input"
                  type="date"
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
                        {t('reservation.vehicles.surDevis', 'Sur devis')}
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

        {/* ─────── SUBMIT ─────── */}
        <motion.div
          className={styles.submitSection}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {status === 'error' && (
            <motion.div
              className={styles.errorBanner}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={16} />
              {t(
                'reservation.error',
                'Une erreur est survenue. Veuillez réessayer.'
              )}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className={styles.submitBtn}
            disabled={status === 'loading'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                {t('reservation.submitting', 'Envoi en cours...')}
              </>
            ) : (
              <>
                {t('reservation.submit', 'Demander un devis')}
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>

          <p className={styles.submitNote}>
            {t(
              'reservation.submitNote',
              'Notre équipe vous recontactera sous 2h avec un devis personnalisé.'
            )}
          </p>
        </motion.div>
      </form>
    </div>
  );
}
