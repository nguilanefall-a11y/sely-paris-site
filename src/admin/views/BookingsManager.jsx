import React, { useState, useEffect } from 'react';
import { useBookingsStore } from '../store/useBookingsStore';
import { claimRequestsService } from '../../services/claimRequestsService';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock3,
  RefreshCw,
  Search,
  Filter,
  CreditCard,
  MessageCircle,
  Trash2,
  Eye,
  X,
  Plus,
  Sparkles,
  Edit2,
  Save,
  Check,
  Link2,
  Inbox,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

// The 5 official categories defined for SELY Privé
export const VEHICLE_5_CATEGORIES = [
  {
    id: 'business_class',
    label: 'Business Class',
    subtitle: 'Classe E, EQE, Tesla Model Y (jusqu’à 3 passagers)',
    defaultModel: 'Business Class (Mercedes Classe E / EQE)',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.3)',
    passengers: 3,
    luggage: 2,
    image: '/eclass-paris-luxury.jpg',
    models: [
      'Business Class (Mercedes Classe E)',
      'Business Class (Mercedes EQE Électrique)',
      'Business Class (Tesla Model Y)',
    ],
  },
  {
    id: 'first_class',
    label: 'First Class',
    subtitle: 'Mercedes Classe S ou similaire (jusqu’à 3 passagers)',
    defaultModel: 'First Class (Mercedes Classe S)',
    color: '#c5a880',
    bgColor: 'rgba(197, 168, 128, 0.15)',
    border: 'rgba(197, 168, 128, 0.3)',
    passengers: 3,
    luggage: 3,
    image: '/sclass-main-new.jpg',
    models: [
      'First Class (Mercedes Classe S Longue)',
      'First Class (Mercedes Classe S Maybach Line)',
      'First Class (BMW Série 7)',
    ],
  },
  {
    id: 'xl',
    label: 'XL',
    subtitle: 'Mercedes Classe V / Business Van (jusqu’à 7 passagers)',
    defaultModel: 'XL (Mercedes Classe V)',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.3)',
    passengers: 7,
    luggage: 7,
    image: '/vclass-paris-luxury.jpg',
    models: [
      'XL (Mercedes Classe V Extra Long)',
      'XL (Mercedes Classe V Salon Face-à-Face)',
      'XL (Mercedes EQV 100% Électrique)',
    ],
  },
  {
    id: 'sprinter',
    label: 'Sprinter',
    subtitle: 'Mercedes Sprinter VIP (7 à 19 places)',
    defaultModel: 'Sprinter (Mercedes Sprinter VIP 14 places)',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(139, 92, 246, 0.3)',
    passengers: 14,
    luggage: 14,
    image: '/mercedes_sprinter_vip.png',
    models: [
      'Sprinter 7 places (VIP Lounge cuir & travail)',
      'Sprinter 14 places (Affaires & Événements)',
      'Sprinter 19 places (Grand Tourisme & Congrès)',
    ],
  },
  {
    id: 'special',
    label: 'Véhicule Spécial',
    subtitle: 'Prestige Collection (Maybach, Rolls-Royce, Escalade...)',
    defaultModel: 'Véhicule Spécial (Mercedes-Maybach)',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    border: 'rgba(236, 72, 153, 0.3)',
    passengers: 3,
    luggage: 3,
    image: '/maybach-paris-luxury.jpg',
    models: [
      'Véhicule Spécial (Mercedes-Maybach)',
      'Véhicule Spécial (Rolls-Royce Ghost)',
      'Véhicule Spécial (Cadillac Escalade ESV)',
      'Véhicule Spécial (Limousine Américaine 300C)',
      'Véhicule Spécial (Sur Mesure)',
    ],
  },
];

const sanitizeDate = (d) => {
  if (!d || d === '—' || !/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    return new Date().toISOString().split('T')[0];
  }
  return d;
};

const sanitizeTime = (t) => {
  if (!t || t === '—' || !/^\d{2}:\d{2}$/.test(t)) {
    return '12:00';
  }
  return t;
};

export const getVehicleMeta = (vehicleStr = '') => {
  const s = vehicleStr.toLowerCase();
  if (s.includes('sprinter')) {
    return VEHICLE_5_CATEGORIES.find((v) => v.id === 'sprinter');
  }
  if (s.includes('spécial') || s.includes('special') || s.includes('maybach') || s.includes('rolls') || s.includes('escalade') || s.includes('limousine') || s.includes('prestige')) {
    return VEHICLE_5_CATEGORIES.find((v) => v.id === 'special');
  }
  if (s.includes('xl') || s.includes('van') || s.includes('classe v') || s.includes('v-class')) {
    return VEHICLE_5_CATEGORIES.find((v) => v.id === 'xl');
  }
  if (s.includes('first') || s.includes('classe s') || s.includes('s-class') || s.includes('série 7')) {
    return VEHICLE_5_CATEGORIES.find((v) => v.id === 'first_class');
  }
  return VEHICLE_5_CATEGORIES.find((v) => v.id === 'business_class');
};

export default function BookingsManager() {
  const {
    bookings,
    isLoading,
    syncWhopPayments,
    updateBookingStatus,
    updateBooking,
    deleteBooking,
    addBooking,
  } = useBookingsStore();

  const [activeMainTab, setActiveMainTab] = useState('bookings'); // 'bookings' | 'claims'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editBookingForm, setEditBookingForm] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Claim requests state
  const [claimRequests, setClaimRequests] = useState([]);
  const [claimFilter, setClaimFilter] = useState('all'); // 'all' | 'pending' | 'linked' | 'rejected'
  const [selectedClaimForLink, setSelectedClaimForLink] = useState(null);
  const [linkingSearch, setLinkingSearch] = useState('');
  const [pendingClaimToLinkOnCreate, setPendingClaimToLinkOnCreate] = useState(null);

  // Load claims on mount & listen to changes
  useEffect(() => {
    const loadClaims = () => {
      setClaimRequests(claimRequestsService.getRequests());
    };
    loadClaims();
    window.addEventListener('sely_claim_requests_updated', loadClaims);
    return () => window.removeEventListener('sely_claim_requests_updated', loadClaims);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Linking a claim request to an existing booking
  const handleLinkBookingToClaim = (bookingId, claimReq) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const updatedBooking = {
      ...booking,
      email: claimReq.clientEmail,
      clientName: claimReq.clientName || booking.clientName,
      phone: claimReq.clientPhone || booking.phone,
    };

    updateBooking(bookingId, {
      email: claimReq.clientEmail,
      clientName: claimReq.clientName || booking.clientName,
      phone: claimReq.clientPhone || booking.phone,
    });

    syncToClientTrips(updatedBooking);
    claimRequestsService.updateRequestStatus(claimReq.id, 'linked', bookingId);
    setSelectedClaimForLink(null);
    triggerToast(`Course reliée avec succès au compte de ${claimReq.clientName} (${claimReq.clientEmail}) !`);
  };

  // Sync to client trips in localStorage
  const syncToClientTrips = (bookingData) => {
    try {
      const rawTrips = localStorage.getItem('sely_client_trips');
      let existingTrips = rawTrips ? JSON.parse(rawTrips) : [];
      const meta = getVehicleMeta(bookingData.vehicle);

      const clientTrip = {
        id: bookingData.id,
        status: bookingData.status === 'completed' ? 'past' : (bookingData.status === 'cancelled' ? 'cancelled' : 'upcoming'),
        service: bookingData.serviceType || 'transfer',
        serviceLabel: bookingData.serviceType === 'hourly' ? 'Mise à disposition Chauffeur' : 'Transfert Privé Point A à B',
        date: bookingData.date,
        time: bookingData.time,
        pickup: bookingData.pickup,
        destination: bookingData.destination,
        vehicleName: bookingData.vehicle,
        vehicleCategory: meta?.label || bookingData.vehicle,
        vehicleImage: meta?.image || '/sclass-main-new.jpg',
        price: `${bookingData.amount} €`,
        passengers: Number(bookingData.passengers) || meta?.passengers || 2,
        luggage: Number(bookingData.luggage) || meta?.luggage || 2,
        flightNumber: bookingData.flightNumber || '',
        chauffeur: bookingData.chauffeur || '',
        chauffeurPhone: bookingData.chauffeurPhone || '',
        notes: bookingData.notes || '',
        clientEmail: bookingData.email,
        clientName: bookingData.clientName,
        clientPhone: bookingData.phone,
        invoiceNumber: `FACT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod: bookingData.paymentMethod || 'Lien de paiement externe',
      };

      const existingIndex = existingTrips.findIndex((t) => t.id === bookingData.id);
      if (existingIndex >= 0) {
        existingTrips[existingIndex] = { ...existingTrips[existingIndex], ...clientTrip };
      } else {
        existingTrips = [clientTrip, ...existingTrips];
      }

      localStorage.setItem('sely_client_trips', JSON.stringify(existingTrips));
      window.dispatchEvent(new Event('sely_trips_updated'));
    } catch (err) {
      console.error('Failed to sync to client trips', err);
    }
  };

  // Form for New Manual Booking (clean, empty defaults)
  const [newForm, setNewForm] = useState({
    clientName: '',
    email: '',
    phone: '',
    serviceType: 'transfer',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    city: 'paris',
    pickup: '',
    destination: '',
    vehicleCategory: 'business_class',
    vehicle: 'Business Class (Mercedes Classe E)',
    amount: '',
    paymentMethod: 'Lien de paiement externe (Stripe / WhatsApp)',
    status: 'paid', // 'paid' | 'completed' | 'cancelled' | 'pending'
    passengers: 2,
    luggage: 2,
    chauffeur: '',
    chauffeurPhone: '',
    flightNumber: '',
    notes: '',
  });

  const handleSelectNewCategory = (catId) => {
    const cat = VEHICLE_5_CATEGORIES.find((c) => c.id === catId);
    if (!cat) return;
    setNewForm((prev) => ({
      ...prev,
      vehicleCategory: catId,
      vehicle: cat.defaultModel,
      passengers: cat.passengers,
      luggage: cat.luggage,
    }));
  };

  const handleCreateBooking = (e) => {
    e.preventDefault();
    const created = addBooking({
      source: 'manual_admin',
      clientName: newForm.clientName,
      email: newForm.email,
      phone: newForm.phone,
      serviceType: newForm.serviceType,
      date: newForm.date,
      time: newForm.time,
      city: newForm.city,
      pickup: newForm.pickup,
      destination: newForm.destination,
      vehicle: newForm.vehicle,
      vehicleCategory: VEHICLE_5_CATEGORIES.find((c) => c.id === newForm.vehicleCategory)?.label || 'Business Class',
      amount: parseFloat(newForm.amount) || 0,
      paymentMethod: newForm.paymentMethod,
      status: newForm.status,
      passengers: Number(newForm.passengers) || 2,
      luggage: Number(newForm.luggage) || 2,
      chauffeur: newForm.chauffeur,
      chauffeurPhone: newForm.chauffeurPhone,
      flightNumber: newForm.flightNumber,
      notes: newForm.notes,
    });

    syncToClientTrips(created);
    setShowNewModal(false);
    setNewForm({
      clientName: '',
      email: '',
      phone: '',
      serviceType: 'transfer',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      city: 'paris',
      pickup: '',
      destination: '',
      vehicleCategory: 'business_class',
      vehicle: 'Business Class (Mercedes Classe E)',
      amount: '',
      paymentMethod: 'Lien de paiement externe (Stripe / WhatsApp)',
      status: 'paid',
      passengers: 2,
      luggage: 2,
      chauffeur: '',
      chauffeurPhone: '',
      flightNumber: '',
      notes: '',
    });

    if (pendingClaimToLinkOnCreate) {
      claimRequestsService.updateRequestStatus(pendingClaimToLinkOnCreate.id, 'linked', created.id);
      setPendingClaimToLinkOnCreate(null);
    }

    triggerToast(`Course enregistrée et synchronisée avec ${created.email}`);
  };

  // Open Edit modal
  const handleOpenEdit = (booking) => {
    const meta = getVehicleMeta(booking.vehicle);
    setSelectedBooking(booking);
    setEditBookingForm({
      ...booking,
      vehicleCategory: meta?.id || 'first_class',
      vehicle: booking.vehicle || meta?.defaultModel || 'First Class (Mercedes Classe S)',
      passengers: booking.passengers || meta?.passengers || 2,
      luggage: booking.luggage || meta?.luggage || 2,
      date: sanitizeDate(booking.date),
      time: sanitizeTime(booking.time),
    });
  };

  const handleSelectEditCategory = (catId) => {
    const cat = VEHICLE_5_CATEGORIES.find((c) => c.id === catId);
    if (!cat) return;
    setEditBookingForm((prev) => ({
      ...prev,
      vehicleCategory: catId,
      vehicle: cat.defaultModel,
      passengers: cat.passengers,
      luggage: cat.luggage,
    }));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editBookingForm) return;

    const catObj = VEHICLE_5_CATEGORIES.find((c) => c.id === editBookingForm.vehicleCategory);
    const updatedData = {
      ...editBookingForm,
      vehicleCategory: catObj?.label || editBookingForm.vehicleCategory,
      date: sanitizeDate(editBookingForm.date),
      time: sanitizeTime(editBookingForm.time),
      amount: parseFloat(editBookingForm.amount) || 0,
      passengers: Number(editBookingForm.passengers) || 2,
      luggage: Number(editBookingForm.luggage) || 2,
    };

    updateBooking(updatedData.id, updatedData);
    syncToClientTrips(updatedData);
    setSelectedBooking(null);
    setEditBookingForm(null);
    triggerToast(`Modifications enregistrées et synchronisées avec le client !`);
  };

  const handleQuickStatusChange = (bookingId, newStatus) => {
    updateBookingStatus(bookingId, newStatus);
    const updated = bookings.find((b) => b.id === bookingId);
    if (updated) {
      const merged = { ...updated, status: newStatus };
      syncToClientTrips(merged);
    }
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
    }
    triggerToast(`Statut mis à jour : ${newStatus}`);
  };

  // Sync on mount
  useEffect(() => {
    syncWhopPayments();
  }, [syncWhopPayments]);

  // Calculations
  const totalCount = bookings.length;
  const paidBookings = bookings.filter((b) => b.status === 'paid');
  const totalRevenue = paidBookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      (b.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.pickup || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.destination || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.chauffeur || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.vehicle || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    let matchesVehicle = true;
    if (vehicleFilter !== 'all') {
      const meta = getVehicleMeta(b.vehicle);
      matchesVehicle = meta?.label === vehicleFilter;
    }

    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const pendingClaims = claimRequests.filter((r) => r.status === 'pending');
  const linkedClaims = claimRequests.filter((r) => r.status === 'linked');
  const pendingClaimsCount = pendingClaims.length;

  const filteredClaimRequests = claimRequests.filter((req) => {
    if (claimFilter !== 'all' && req.status !== claimFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (req.clientName || '').toLowerCase().includes(term) ||
      (req.clientEmail || '').toLowerCase().includes(term) ||
      (req.clientPhone || '').toLowerCase().includes(term) ||
      (req.details || '').toLowerCase().includes(term)
    );
  });

  const availableBookingsForLinking = bookings.filter((b) => {
    if (!linkingSearch) return true;
    const term = linkingSearch.toLowerCase();
    return (
      (b.clientName || '').toLowerCase().includes(term) ||
      (b.email || '').toLowerCase().includes(term) ||
      (b.phone || '').toLowerCase().includes(term) ||
      (b.pickup || '').toLowerCase().includes(term) ||
      (b.destination || '').toLowerCase().includes(term) ||
      (b.date || '').toLowerCase().includes(term) ||
      (b.vehicle || '').toLowerCase().includes(term)
    );
  });

  const getClaimStatusBadge = (status) => {
    switch (status) {
      case 'linked':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <CheckCircle2 size={12} /> Reliée au client
          </span>
        );
      case 'rejected':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
            <X size={12} /> Ignorée
          </span>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
            <Clock3 size={12} /> En Attente
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <CheckCircle2 size={12} /> Confirmé / Payé
          </span>
        );
      case 'completed':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            Terminé (Facturé)
          </span>
        );
      case 'cancelled':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            Annulé
          </span>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
            <Clock3 size={12} /> En Attente
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#ffffff' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: '#1e293b',
          border: '1px solid #c5a880',
          color: '#ffffff',
          padding: '0.85rem 1.4rem',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem',
          fontWeight: 500,
        }}>
          <Check size={18} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            Gestion & Attribution des Réservations
          </h1>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Attribution des 5 catégories de véhicules, dates, chauffeurs et encaissements externes
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowNewModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.3rem',
              borderRadius: '8px',
              backgroundColor: '#c5a880',
              color: '#000000',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(197, 168, 128, 0.35)',
            }}
          >
            <Plus size={16} />
            <span>+ Saisir une réservation manuelle</span>
          </button>

          <button
            onClick={() => syncWhopPayments()}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} className={isLoading ? 'spinner' : ''} />
            <span>{isLoading ? 'Synchronisation...' : 'Synchroniser'}</span>
          </button>
        </div>
      </div>

      {/* Pending Claims Alert Banner */}
      {pendingClaimsCount > 0 && activeMainTab !== 'claims' && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '10px',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 10px #ef4444' }} />
            <span style={{ fontSize: '0.9rem', color: '#fca5a5' }}>
              <strong>{pendingClaimsCount} demande(s) de rattachement client en attente :</strong> Un ou plusieurs clients connectés demandent la synchronisation d'une réservation sur leur compte.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveMainTab('claims')}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '6px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>Traiter les demandes</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.1rem' }}>
        <button
          type="button"
          onClick={() => setActiveMainTab('bookings')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeMainTab === 'bookings' ? '3px solid #c5a880' : '3px solid transparent',
            color: activeMainTab === 'bookings' ? '#ffffff' : '#94a3b8',
            fontWeight: activeMainTab === 'bookings' ? 700 : 500,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            transition: 'all 0.2s',
          }}
        >
          <Car size={18} color={activeMainTab === 'bookings' ? '#c5a880' : '#94a3b8'} />
          <span>Courses & Réservations</span>
          <span style={{
            fontSize: '0.75rem',
            padding: '0.15rem 0.55rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#e2e8f0',
          }}>
            {bookings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('claims')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeMainTab === 'claims' ? '3px solid #c5a880' : '3px solid transparent',
            color: activeMainTab === 'claims' ? '#ffffff' : '#94a3b8',
            fontWeight: activeMainTab === 'claims' ? 700 : 500,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            transition: 'all 0.2s',
          }}
        >
          <Link2 size={18} color={activeMainTab === 'claims' ? '#c5a880' : '#94a3b8'} />
          <span>Demandes de rattachement</span>
          {pendingClaimsCount > 0 ? (
            <span style={{
              fontSize: '0.75rem',
              padding: '0.15rem 0.55rem',
              borderRadius: '12px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontWeight: 700,
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
            }}>
              {pendingClaimsCount}
            </span>
          ) : (
            <span style={{
              fontSize: '0.75rem',
              padding: '0.15rem 0.55rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
            }}>
              {claimRequests.length}
            </span>
          )}
        </button>
      </div>

      {activeMainTab === 'bookings' && (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: '#0f131c', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Réservations</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0.35rem 0' }}>{totalCount}</h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Toutes catégories</span>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: '#0f131c', border: '1px solid rgba(34,197,94,0.3)', borderLeft: '4px solid #22c55e' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chiffre d'Affaires Encaissé</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0.35rem 0', color: '#4ade80' }}>
            {totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{paidBookings.length} courses confirmées</span>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: '#0f131c', border: '1px solid rgba(250,204,21,0.3)', borderLeft: '4px solid #facc15' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>En Attente de Règlement</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0.35rem 0', color: '#facc15' }}>{pendingCount}</h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Liens envoyés / devis</span>
        </div>
      </div>

      {/* 5 VEHICLES QUICK ATTRIBUTION & FILTER BAR */}
      <div style={{
        padding: '1.2rem',
        borderRadius: '10px',
        backgroundColor: '#0c0f17',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#c5a880', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Filtrer par Catégorie de Véhicule (5 Types) :
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {filteredBookings.length} course(s) affichée(s)
          </span>
        </div>

        {/* 5 Vehicle Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setVehicleFilter('all')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: vehicleFilter === 'all' ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
              backgroundColor: vehicleFilter === 'all' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.03)',
              color: '#ffffff',
            }}
          >
            Tous les véhicules
          </button>

          {VEHICLE_5_CATEGORIES.map((cat) => {
            const isSelected = vehicleFilter === cat.label;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setVehicleFilter(cat.label)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isSelected ? `2px solid ${cat.color}` : `1px solid ${cat.border}`,
                  backgroundColor: isSelected ? cat.bgColor : 'rgba(255,255,255,0.02)',
                  color: isSelected ? '#ffffff' : cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.85rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Rechercher client, email, téléphone, lieu, chauffeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem 0.55rem 2.3rem',
                borderRadius: '6px',
                backgroundColor: '#121622',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: '#121622',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Tous les statuts</option>
            <option value="paid">Confirmé / Payé</option>
            <option value="completed">Terminé (Facturé)</option>
            <option value="cancelled">Annulé</option>
            <option value="pending">En attente</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div style={{ borderRadius: '10px', overflowX: 'auto', backgroundColor: '#0c0f17', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '0.85rem 1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>DATE & HEURE</th>
              <th style={{ padding: '0.85rem 1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>CLIENT</th>
              <th style={{ padding: '0.85rem 1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>PRISE EN CHARGE & ARRIVÉE</th>
              <th style={{ padding: '0.85rem 1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>VÉHICULE ATTRIBUÉ</th>
              <th style={{ padding: '0.85rem 1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>MONTANT</th>
              <th style={{ padding: '0.85rem 1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>CHAUFFEUR</th>
              <th style={{ padding: '0.85rem 1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>STATUT</th>
              <th style={{ padding: '0.85rem 1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  Aucune réservation trouvée pour ces critères.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => {
                const vehicleMeta = getVehicleMeta(booking.vehicle);
                return (
                  <tr
                    key={booking.id}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.15s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Date / Time */}
                    <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{booking.date || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#c5a880', fontWeight: 500 }}>{booking.time || '—'}</div>
                    </td>

                    {/* Client */}
                    <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{booking.clientName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{booking.email}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{booking.phone}</div>
                    </td>

                    {/* Trajet */}
                    <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.82rem', maxWidth: '240px' }}>
                      <div style={{ color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <span style={{ color: '#4ade80', fontWeight: 700 }}>•</span> {booking.pickup}
                      </div>
                      <div style={{ color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <span style={{ color: '#38bdf8', fontWeight: 700 }}>•</span> {booking.destination || 'Mise à disposition'}
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.82rem' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: vehicleMeta?.bgColor || 'rgba(255,255,255,0.05)',
                        color: vehicleMeta?.color || '#ffffff',
                        border: `1px solid ${vehicleMeta?.border || 'rgba(255,255,255,0.1)'}`,
                        marginBottom: '0.25rem',
                      }}>
                        <Car size={12} />
                        <span>{vehicleMeta?.label || 'Véhicule'}</span>
                      </div>
                      <div style={{ color: '#ffffff', fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                        {booking.vehicle}
                      </div>
                    </td>

                    {/* Amount */}
                    <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.9rem', fontWeight: 700 }}>
                      <div style={{ color: '#ffffff' }}>
                        {booking.amount ? `${Number(booking.amount).toFixed(2)} €` : 'Sur devis'}
                      </div>
                      {booking.paymentMethod && (
                        <div style={{ fontSize: '0.68rem', fontWeight: 400, color: '#94a3b8' }}>
                          {booking.paymentMethod.replace('Lien de paiement externe', 'Lien Stripe/Ext')}
                        </div>
                      )}
                    </td>

                    {/* Chauffeur */}
                    <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.82rem' }}>
                      <div style={{ color: '#ffffff', fontWeight: 500 }}>
                        {booking.chauffeur || '— Non assigné'}
                      </div>
                      {booking.chauffeurPhone && (
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          {booking.chauffeurPhone}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      {getStatusBadge(booking.status)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {booking.phone && booking.phone !== '—' && (
                          <a
                            href={`https://wa.me/${booking.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${booking.clientName}, nous confirmons la prise en charge de votre course SELY Privé le ${booking.date} à ${booking.time} en ${booking.vehicle}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Contacter sur WhatsApp"
                            style={{
                              padding: '0.45rem',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(37, 211, 102, 0.15)',
                              color: '#25d366',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid rgba(37, 211, 102, 0.3)',
                            }}
                          >
                            <MessageCircle size={15} />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(booking)}
                          title="Attribuer voiture, date ou modifier"
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(197, 168, 128, 0.15)',
                            border: '1px solid rgba(197, 168, 128, 0.4)',
                            color: '#c5a880',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <Edit2 size={13} />
                          <span>Attribuer</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteBooking(booking.id)}
                          title="Supprimer"
                          style={{
                            padding: '0.45rem',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: 'none',
                            color: '#f87171',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
        </>
      )}

      {/* ========================================================= */}
      {/* VUE 2: GESTION DES DEMANDES DE RATTACHEMENT CLIENT        */}
      {/* ========================================================= */}
      {activeMainTab === 'claims' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* KPI Cards for claims */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: '#0f131c', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Demandes</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0.35rem 0' }}>{claimRequests.length}</h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Historique complet</span>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: '#0f131c', border: '1px solid rgba(250,204,21,0.3)', borderLeft: '4px solid #facc15' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>En Attente de Rattachement</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0.35rem 0', color: '#facc15' }}>{pendingClaimsCount}</h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>À relier à une course</span>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: '#0f131c', border: '1px solid rgba(34,197,94,0.3)', borderLeft: '4px solid #22c55e' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Courses Reliées avec Succès</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0.35rem 0', color: '#4ade80' }}>{linkedClaims.length}</h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Visibles sur l'espace client</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{
            padding: '1rem 1.2rem',
            borderRadius: '10px',
            backgroundColor: '#0c0f17',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: `Toutes (${claimRequests.length})` },
                { id: 'pending', label: `En attente (${pendingClaimsCount})` },
                { id: 'linked', label: `Reliées (${linkedClaims.length})` },
                { id: 'rejected', label: `Ignorées (${claimRequests.filter(r => r.status === 'rejected').length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setClaimFilter(f.id)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: claimFilter === f.id ? '1px solid #c5a880' : '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: claimFilter === f.id ? 'rgba(197,168,128,0.2)' : 'rgba(255,255,255,0.03)',
                    color: claimFilter === f.id ? '#ffffff' : '#94a3b8',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: '240px', flex: 1, maxWidth: '400px' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Rechercher client, email, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem 0.55rem 2.3rem',
                  borderRadius: '6px',
                  backgroundColor: '#121622',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Claims Table */}
          <div style={{ borderRadius: '10px', overflowX: 'auto', backgroundColor: '#0c0f17', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                  <th style={{ padding: '0.85rem 1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>DATE DE DEMANDE</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>CLIENT & CONTACT</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>DÉTAILS DU TRAJET DEMANDÉ</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>STATUT</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textAlign: 'right' }}>ACTIONS DE RATTACHEMENT</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaimRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                      <Inbox size={40} style={{ opacity: 0.35, marginBottom: '0.75rem', margin: '0 auto 0.75rem auto', display: 'block' }} />
                      <div style={{ fontWeight: 600, fontSize: '1rem', color: '#ffffff' }}>Aucune demande de rattachement trouvée</div>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '460px', margin: '0.5rem auto 0' }}>
                        Quand un client connecté clique sur <em>« Votre réservation n'apparaît pas ? »</em> depuis son espace, sa demande apparaît instantanément ici pour être reliée.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredClaimRequests.map((req) => {
                    const linkedBooking = req.linkedBookingId ? bookings.find((b) => b.id === req.linkedBookingId) : null;
                    return (
                      <tr
                        key={req.id}
                        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.15s ease' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {/* Date */}
                        <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.85rem', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 600, color: '#ffffff' }}>
                            {new Date(req.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            {new Date(req.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        {/* Client & contact */}
                        <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.85rem', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <User size={14} color="#c5a880" />
                            {req.clientName}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                            {req.clientEmail}
                          </div>
                          {req.clientPhone && (
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                              Tél: {req.clientPhone}
                            </div>
                          )}
                        </td>

                        {/* Details */}
                        <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.85rem', verticalAlign: 'top', maxWidth: '300px' }}>
                          <div style={{ color: req.details ? '#e2e8f0' : '#64748b', fontStyle: req.details ? 'normal' : 'italic', lineHeight: 1.4 }}>
                            {req.details || 'Aucun détail précisé par le client'}
                          </div>
                          {linkedBooking && (
                            <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.65rem', borderRadius: '6px', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.25)', fontSize: '0.78rem', color: '#4ade80' }}>
                              <strong>Course reliée :</strong> {linkedBooking.date} • {linkedBooking.pickup} &rarr; {linkedBooking.destination} ({linkedBooking.vehicle})
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '0.9rem 1.25rem', verticalAlign: 'top' }}>
                          {getClaimStatusBadge(req.status)}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right', verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            {req.status === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLinkingSearch('');
                                    setSelectedClaimForLink(req);
                                  }}
                                  style={{
                                    padding: '0.45rem 0.8rem',
                                    borderRadius: '6px',
                                    backgroundColor: '#c5a880',
                                    color: '#000000',
                                    border: 'none',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    boxShadow: '0 2px 8px rgba(197,168,128,0.3)',
                                  }}
                                >
                                  <Link2 size={13} />
                                  <span>Relier à une course</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPendingClaimToLinkOnCreate(req);
                                    setNewForm({
                                      clientName: req.clientName,
                                      email: req.clientEmail,
                                      phone: req.clientPhone || '',
                                      serviceType: 'transfer',
                                      date: new Date().toISOString().split('T')[0],
                                      time: '12:00',
                                      city: 'paris',
                                      pickup: '',
                                      destination: '',
                                      vehicleCategory: 'business_class',
                                      vehicle: 'Business Class (Mercedes Classe E)',
                                      amount: '',
                                      paymentMethod: 'Lien de paiement externe (Stripe / WhatsApp)',
                                      status: 'paid',
                                      passengers: 2,
                                      luggage: 2,
                                      chauffeur: '',
                                      chauffeurPhone: '',
                                      flightNumber: '',
                                      notes: req.details ? `Demande de rattachement: ${req.details}` : '',
                                    });
                                    setShowNewModal(true);
                                  }}
                                  style={{
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '6px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: '#ffffff',
                                    fontSize: '0.78rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                  }}
                                  title="Créer une nouvelle course directement pour ce client"
                                >
                                  <Plus size={13} />
                                  <span>Créer course</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    claimRequestsService.updateRequestStatus(req.id, 'rejected');
                                    triggerToast('Demande marquée comme ignorée');
                                  }}
                                  style={{
                                    padding: '0.45rem 0.65rem',
                                    borderRadius: '6px',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    border: 'none',
                                    color: '#f87171',
                                    fontSize: '0.78rem',
                                    cursor: 'pointer',
                                  }}
                                  title="Ignorer cette demande"
                                >
                                  Ignorer
                                </button>
                              </>
                            )}

                            {req.status === 'linked' && (
                              <button
                                type="button"
                                onClick={() => {
                                  claimRequestsService.updateRequestStatus(req.id, 'pending', null);
                                  triggerToast('Déliaison effectuée. Demande repassée en attente.');
                                }}
                                style={{
                                  padding: '0.45rem 0.75rem',
                                  borderRadius: '6px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                  border: '1px solid rgba(255, 255, 255, 0.15)',
                                  color: '#cbd5e1',
                                  fontSize: '0.78rem',
                                  cursor: 'pointer',
                                }}
                              >
                                Délier
                              </button>
                            )}

                            {req.status === 'rejected' && (
                              <button
                                type="button"
                                onClick={() => {
                                  claimRequestsService.updateRequestStatus(req.id, 'pending');
                                  triggerToast('Demande réactivée en attente');
                                }}
                                style={{
                                  padding: '0.45rem 0.75rem',
                                  borderRadius: '6px',
                                  backgroundColor: 'rgba(234, 179, 8, 0.15)',
                                  border: '1px solid rgba(234, 179, 8, 0.3)',
                                  color: '#facc15',
                                  fontSize: '0.78rem',
                                  cursor: 'pointer',
                                }}
                              >
                                Réactiver
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                claimRequestsService.deleteRequest(req.id);
                                triggerToast('Demande supprimée');
                              }}
                              style={{
                                padding: '0.45rem',
                                borderRadius: '6px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#64748b',
                                cursor: 'pointer',
                              }}
                              title="Supprimer définitivement l'entrée"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: ATTRIBUER & MODIFIER UNE RÉSERVATION EXISTANTE */}
      {/* ========================================================= */}
      {selectedBooking && editBookingForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 1100,
            overflowY: 'auto',
          }}
          onClick={() => {
            setSelectedBooking(null);
            setEditBookingForm(null);
          }}
        >
          <div
            style={{
              maxWidth: '720px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              borderRadius: '14px',
              padding: '2rem',
              backgroundColor: '#0f131c',
              border: '1px solid rgba(197, 168, 128, 0.4)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  Attribuer & Modifier la Réservation
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                  Client : <strong>{editBookingForm.clientName}</strong> ({editBookingForm.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedBooking(null);
                  setEditBookingForm(null);
                }}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* SECTION 1: ATTRIBUER LE VÉHICULE (LES 5 CHOIX OFFICIELS) */}
              <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c5a880', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    1. Attribuer le Type de Voiture (5 choix) *
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Cliquez pour sélectionner</span>
                </div>

                {/* 5 Vehicle Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '0.85rem' }}>
                  {VEHICLE_5_CATEGORIES.map((cat) => {
                    const isSelected = editBookingForm.vehicleCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        data-vehicle-cat={cat.id}
                        onClick={() => handleSelectEditCategory(cat.id)}
                        style={{
                          padding: '0.75rem 0.5rem',
                          borderRadius: '8px',
                          border: isSelected ? `2px solid ${cat.color}` : '1px solid rgba(255,255,255,0.1)',
                          backgroundColor: isSelected ? cat.bgColor : 'rgba(255,255,255,0.02)',
                          color: '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Car size={18} color={cat.color} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isSelected ? cat.color : '#ffffff' }}>
                          {cat.label}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                          {cat.passengers} passagers max
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Specific Model selection / custom text */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                      Modèle exact attribué
                    </label>
                    <select
                      value={editBookingForm.vehicle}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, vehicle: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '6px',
                        backgroundColor: '#121622',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                      }}
                    >
                      {VEHICLE_5_CATEGORIES.find((c) => c.id === editBookingForm.vehicleCategory)?.models.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                      <option value={editBookingForm.vehicle}>{editBookingForm.vehicle}</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                      Passagers
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={editBookingForm.passengers}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, passengers: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '6px',
                        backgroundColor: '#121622',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                      Bagages
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={editBookingForm.luggage}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, luggage: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '6px',
                        backgroundColor: '#121622',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: DATE & HEURE */}
              <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#c5a880', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  2. Date & Heure de Prise en Charge *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                      Date de prise en charge
                    </label>
                    <input
                      type="date"
                      required
                      value={editBookingForm.date}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, date: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '6px',
                        backgroundColor: '#121622',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                      Heure de prise en charge
                    </label>
                    <input
                      type="time"
                      value={editBookingForm.time}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, time: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '6px',
                        backgroundColor: '#121622',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: LIEUX & LOGISTIQUE */}
              <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#c5a880', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  3. Trajet & Prestation
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Lieu de prise en charge (Départ) *</label>
                    <input
                      type="text"
                      required
                      value={editBookingForm.pickup}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, pickup: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '6px',
                        backgroundColor: '#121622',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Destination / Mise à disposition *</label>
                    <input
                      type="text"
                      required
                      value={editBookingForm.destination}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, destination: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '6px',
                        backgroundColor: '#121622',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Chauffeur assigné</label>
                    <input
                      type="text"
                      value={editBookingForm.chauffeur || ''}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, chauffeur: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '6px',
                        backgroundColor: '#121622',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Téléphone chauffeur</label>
                    <input
                      type="tel"
                      value={editBookingForm.chauffeurPhone || ''}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, chauffeurPhone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '6px',
                        backgroundColor: '#121622',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: STATUT & ENCAISSEMENT */}
              <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#c5a880', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  4. Statut & Montant Encaissé
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Statut de la course *</label>
                    <select
                      value={editBookingForm.status}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, status: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '6px',
                        backgroundColor: '#121622',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="paid">Confirmé / Payé (À Venir)</option>
                      <option value="completed">Terminé (Passé / Facturé)</option>
                      <option value="cancelled">Annulé</option>
                      <option value="pending">En attente de paiement</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Montant total TTC (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editBookingForm.amount}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, amount: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '6px',
                        backgroundColor: '#121622',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Moyen d'encaissement</label>
                    <select
                      value={editBookingForm.paymentMethod}
                      onChange={(e) => setEditBookingForm({ ...editBookingForm, paymentMethod: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '6px',
                        backgroundColor: '#121622',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="Lien de paiement externe (Stripe / WhatsApp)">Lien de paiement externe</option>
                      <option value="Paiement WhatsApp confirmé">WhatsApp confirmé</option>
                      <option value="Virement bancaire professionnel reçu">Virement bancaire reçu</option>
                      <option value="Carte bancaire à bord">Carte bancaire à bord</option>
                      <option value="Facturation fin de mois / Entreprise">Facturation Entreprise</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBooking(null);
                    setEditBookingForm(null);
                  }}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    backgroundColor: '#c5a880',
                    border: 'none',
                    color: '#000000',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 15px rgba(197, 168, 128, 0.4)',
                  }}
                >
                  <Save size={16} />
                  <span>Enregistrer & Synchroniser Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: SAISIR UNE NOUVELLE RÉSERVATION MANUELLE */}
      {/* ========================================================= */}
      {showNewModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 1100,
            overflowY: 'auto',
          }}
          onClick={() => setShowNewModal(false)}
        >
          <div
            style={{
              maxWidth: '720px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              borderRadius: '14px',
              padding: '2rem',
              backgroundColor: '#0f131c',
              border: '1px solid rgba(197, 168, 128, 0.4)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  Saisie Manuelle d'une Course
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                  Enregistrez les clients encaissés sur WhatsApp, mail ou virement
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* SECTION 1: CLIENT */}
              <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#c5a880', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  1. Informations Client
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Nom du client *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : M. Dupont"
                      value={newForm.clientName}
                      onChange={(e) => setNewForm({ ...newForm, clientName: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Email client (Compte Voyages) *</label>
                    <input
                      type="email"
                      required
                      placeholder="client@domaine.com"
                      value={newForm.email}
                      onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Téléphone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+33 6 ..."
                      value={newForm.phone}
                      onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: ATTRIBUER LE VÉHICULE (LES 5 CHOIX) */}
              <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c5a880', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    2. Attribuer le Type de Voiture (5 choix) *
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '0.85rem' }}>
                  {VEHICLE_5_CATEGORIES.map((cat) => {
                    const isSelected = newForm.vehicleCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        data-vehicle-cat={cat.id}
                        onClick={() => handleSelectNewCategory(cat.id)}
                        style={{
                          padding: '0.75rem 0.5rem',
                          borderRadius: '8px',
                          border: isSelected ? `2px solid ${cat.color}` : '1px solid rgba(255,255,255,0.1)',
                          backgroundColor: isSelected ? cat.bgColor : 'rgba(255,255,255,0.02)',
                          color: '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Car size={18} color={cat.color} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isSelected ? cat.color : '#ffffff' }}>
                          {cat.label}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                          {cat.passengers} passagers max
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Modèle exact attribué</label>
                    <select
                      value={newForm.vehicle}
                      onChange={(e) => setNewForm({ ...newForm, vehicle: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.8rem' }}
                    >
                      {VEHICLE_5_CATEGORIES.find((c) => c.id === newForm.vehicleCategory)?.models.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Passagers</label>
                    <input
                      type="number"
                      min="1"
                      value={newForm.passengers}
                      onChange={(e) => setNewForm({ ...newForm, passengers: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Bagages</label>
                    <input
                      type="number"
                      min="0"
                      value={newForm.luggage}
                      onChange={(e) => setNewForm({ ...newForm, luggage: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: DATE, HEURE & TRAJET */}
              <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#c5a880', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  3. Date, Heure & Trajet
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Date de prise en charge *</label>
                    <input
                      type="date"
                      required
                      value={newForm.date}
                      onChange={(e) => setNewForm({ ...newForm, date: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Heure de prise en charge</label>
                    <input
                      type="time"
                      value={newForm.time}
                      onChange={(e) => setNewForm({ ...newForm, time: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Lieu de prise en charge (Départ) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : Aéroport Paris-CDG Terminal 2E"
                      value={newForm.pickup}
                      onChange={(e) => setNewForm({ ...newForm, pickup: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Destination / Mise à disposition *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : Hôtel Ritz Paris ou Mise à disposition 4h"
                      value={newForm.destination}
                      onChange={(e) => setNewForm({ ...newForm, destination: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: ENCAISSEMENT & CHAUFFEUR */}
              <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#c5a880', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  4. Encaissement, Statut & Chauffeur
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Montant TTC (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={newForm.amount}
                      onChange={(e) => setNewForm({ ...newForm, amount: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Mode d'encaissement</label>
                    <select
                      value={newForm.paymentMethod}
                      onChange={(e) => setNewForm({ ...newForm, paymentMethod: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                    >
                      <option value="Lien de paiement externe (Stripe / WhatsApp)">Lien de paiement externe</option>
                      <option value="Paiement WhatsApp confirmé">WhatsApp confirmé</option>
                      <option value="Virement bancaire professionnel reçu">Virement bancaire reçu</option>
                      <option value="Carte bancaire à bord">Carte bancaire à bord</option>
                      <option value="Facturation fin de mois / Entreprise">Facturation Entreprise</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Statut de la course *</label>
                    <select
                      value={newForm.status}
                      onChange={(e) => setNewForm({ ...newForm, status: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    >
                      <option value="paid">Confirmé / Payé (À Venir)</option>
                      <option value="completed">Terminé (Facturé)</option>
                      <option value="cancelled">Annulé</option>
                      <option value="pending">En attente de paiement</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Chauffeur assigné</label>
                    <input
                      type="text"
                      placeholder="Ex : Karim B."
                      value={newForm.chauffeur}
                      onChange={(e) => setNewForm({ ...newForm, chauffeur: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Téléphone chauffeur</label>
                    <input
                      type="tel"
                      placeholder="+33 6 ..."
                      value={newForm.chauffeurPhone}
                      onChange={(e) => setNewForm({ ...newForm, chauffeurPhone: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', backgroundColor: '#121622', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    backgroundColor: '#c5a880',
                    border: 'none',
                    color: '#000000',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(197, 168, 128, 0.4)',
                  }}
                >
                  Enregistrer & Synchroniser Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: RELIER UNE DEMANDE CLIENT À UNE COURSE EXISTANTE */}
      {/* ========================================================= */}
      {selectedClaimForLink && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 1200,
            overflowY: 'auto',
          }}
          onClick={() => setSelectedClaimForLink(null)}
        >
          <div
            style={{
              backgroundColor: '#0d111a',
              border: '1px solid rgba(197, 168, 128, 0.4)',
              borderRadius: '12px',
              padding: '1.75rem',
              maxWidth: '750px',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#c5a880', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                  <Link2 size={14} /> Rattachement de réservation
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  Relier la réservation de {selectedClaimForLink.clientName}
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Compte client : <strong style={{ color: '#ffffff' }}>{selectedClaimForLink.clientEmail}</strong>
                  {selectedClaimForLink.clientPhone && ` • Tél : ${selectedClaimForLink.clientPhone}`}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedClaimForLink(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Client request info banner */}
            <div style={{ backgroundColor: 'rgba(197, 168, 128, 0.08)', border: '1px solid rgba(197, 168, 128, 0.25)', borderRadius: '8px', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#c5a880', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Précisions indiquées par le client :
              </div>
              <div style={{ fontSize: '0.88rem', color: '#f1f5f9' }}>
                {selectedClaimForLink.details || 'Aucune précision complémentaire saisie par le client.'}
              </div>
            </div>

            {/* Search courses */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                Rechercher la course correspondante dans le planning :
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filtrer par nom, adresse, date, véhicule..."
                  value={linkingSearch}
                  onChange={(e) => setLinkingSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.3rem',
                    borderRadius: '8px',
                    backgroundColor: '#121622',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* List of bookings to link */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '350px', overflowY: 'auto' }}>
              {availableBookingsForLinking.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  Aucune course trouvée correspondant à « {linkingSearch} ».
                </div>
              ) : (
                availableBookingsForLinking.map((booking) => {
                  const meta = getVehicleMeta(booking.vehicle);
                  return (
                    <div
                      key={booking.id}
                      style={{
                        padding: '0.9rem 1.1rem',
                        borderRadius: '8px',
                        backgroundColor: '#141926',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
                            {booking.date} • {booking.time}
                          </span>
                          <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '10px', backgroundColor: meta?.bgColor || 'rgba(197,168,128,0.2)', color: meta?.color || '#c5a880', fontWeight: 600 }}>
                            {meta?.label || booking.vehicle}
                          </span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4ade80' }}>
                            {booking.amount} €
                          </span>
                        </div>

                        <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.2rem' }}>
                          <span style={{ color: '#4ade80' }}>•</span> {booking.pickup} &rarr; {booking.destination}
                        </div>

                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Client actuel : <span style={{ color: '#94a3b8' }}>{booking.clientName}</span> ({booking.email || 'Sans email'})
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleLinkBookingToClaim(booking.id, selectedClaimForLink)}
                        style={{
                          padding: '0.6rem 1rem',
                          borderRadius: '6px',
                          backgroundColor: '#c5a880',
                          color: '#000000',
                          border: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 2px 8px rgba(197,168,128,0.3)',
                        }}
                      >
                        <Check size={14} />
                        <span>Connecter à ce client</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setSelectedClaimForLink(null)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
