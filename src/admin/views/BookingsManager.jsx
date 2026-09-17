import React, { useState, useEffect } from 'react';
import { useBookingsStore } from '../store/useBookingsStore';
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
  ExternalLink,
  Trash2,
  Eye,
  X,
  Plus,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function BookingsManager() {
  const {
    bookings,
    isLoading,
    lastSyncedAt,
    syncWhopPayments,
    updateBookingStatus,
    deleteBooking,
    addBooking,
  } = useBookingsStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Sync on mount
  useEffect(() => {
    syncWhopPayments();
  }, [syncWhopPayments]);

  // Calculations
  const totalCount = bookings.length;
  const paidBookings = bookings.filter((b) => b.status === 'paid');
  const totalRevenue = paidBookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const quoteCount = bookings.filter((b) => b.status === 'quote').length;

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      (b.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.pickup || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.vehicle || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesCity = cityFilter === 'all' || (b.city || '').toLowerCase() === cityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCity;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              color: '#4ade80',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}
          >
            <CheckCircle2 size={12} /> Payé (Whop)
          </span>
        );
      case 'quote':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: 'rgba(196, 161, 101, 0.15)',
              color: 'var(--gold-accent)',
              border: '1px solid rgba(196, 161, 101, 0.3)',
            }}
          >
            <Clock3 size={12} /> Devis Demandé
          </span>
        );
      case 'completed':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            Course Terminée
          </span>
        );
      case 'cancelled':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            Annulé
          </span>
        );
      default:
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
              color: '#facc15',
              border: '1px solid rgba(234, 179, 8, 0.3)',
            }}
          >
            <Clock3 size={12} /> En Attente
          </span>
        );
    }
  };

  const getCityName = (cityCode) => {
    switch ((cityCode || '').toLowerCase()) {
      case 'london':
        return 'Londres';
      case 'french-riviera':
        return 'Côte d\'Azur';
      case 'bordeaux':
        return 'Bordeaux';
      default:
        return 'Paris';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            Réservations & Courses
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Suivi des courses en direct, détails clients et encaissements Whop
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => syncWhopPayments()}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <RefreshCw size={15} className={isLoading ? 'spinner' : ''} />
            <span>{isLoading ? 'Synchronisation...' : 'Synchroniser Whop'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Total Réservations</p>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 600 }}>{totalCount}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Toutes destinations</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #4ade80' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Encaissé via Whop</p>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#4ade80' }}>
            {totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{paidBookings.length} paiements confirmés</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #facc15' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>En attente de règlement</p>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#facc15' }}>{pendingCount}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Checkouts générés</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--gold-accent)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Demandes de devis</p>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--gold-accent)' }}>{quoteCount}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>À contacter</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Rechercher client, email, téléphone, véhicule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.5rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              color: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              color: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          >
            <option value="all" style={{ background: '#12141a' }}>Tous les statuts</option>
            <option value="paid" style={{ background: '#12141a' }}>Payé (Whop)</option>
            <option value="pending" style={{ background: '#12141a' }}>En attente</option>
            <option value="quote" style={{ background: '#12141a' }}>Devis demandé</option>
            <option value="completed" style={{ background: '#12141a' }}>Course terminée</option>
            <option value="cancelled" style={{ background: '#12141a' }}>Annulé</option>
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              color: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          >
            <option value="all" style={{ background: '#12141a' }}>Toutes les villes</option>
            <option value="paris" style={{ background: '#12141a' }}>Paris</option>
            <option value="london" style={{ background: '#12141a' }}>Londres</option>
            <option value="french-riviera" style={{ background: '#12141a' }}>Côte d'Azur</option>
            <option value="bordeaux" style={{ background: '#12141a' }}>Bordeaux</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-panel" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>DATE / HEURE</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>CLIENT</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>TRAJET & VILLE</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>VÉHICULE</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>MONTANT</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>STATUT</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Aucune réservation trouvée.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  style={{
                    borderBottom: '1px solid var(--border-glass)',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {/* Date / Time */}
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                    <div style={{ fontWeight: 600 }}>{booking.date || '—'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{booking.time || '—'}</div>
                  </td>

                  {/* Client */}
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{booking.clientName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{booking.email}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gold-accent)' }}>{booking.phone}</div>
                  </td>

                  {/* Trajet & Ville */}
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.06)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                      {getCityName(booking.city)}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#ffffff', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <strong>Départ:</strong> {booking.pickup}
                    </div>
                    {booking.destination && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <strong>Arrivée:</strong> {booking.destination}
                      </div>
                    )}
                  </td>

                  {/* Vehicle */}
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    {booking.vehicle}
                  </td>

                  {/* Amount */}
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', fontWeight: 700 }}>
                    {booking.amount ? `${Number(booking.amount).toFixed(2)} €` : 'Sur devis'}
                    {booking.paymentMethod && (
                      <div style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-secondary)' }}>
                        {booking.paymentMethod}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '1rem 1.5rem' }}>
                    {getStatusBadge(booking.status)}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {booking.phone && booking.phone !== '—' && (
                        <a
                          href={`https://wa.me/${booking.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${booking.clientName}, nous confirmons la prise en charge de votre réservation SELY Privé.`)}`}
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
                          }}
                        >
                          <MessageCircle size={15} />
                        </a>
                      )}

                      <button
                        onClick={() => setSelectedBooking(booking)}
                        title="Voir le détail"
                        style={{
                          padding: '0.45rem',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-glass)',
                          color: '#ffffff',
                          cursor: 'pointer',
                        }}
                      >
                        <Eye size={15} />
                      </button>

                      <button
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Détail Réservation */}
      {selectedBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            zIndex: 1000,
          }}
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '560px',
              width: '100%',
              borderRadius: '16px',
              padding: '2rem',
              backgroundColor: '#12141a',
              border: '1px solid var(--border-glass)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--gold-accent)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Détail de la Réservation</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Client</span>
                <strong>{selectedBooking.clientName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Statut</span>
                {getStatusBadge(selectedBooking.status)}
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Email</span>
                <span>{selectedBooking.email}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Téléphone</span>
                <strong>{selectedBooking.phone}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Date & Heure</span>
                <span>{selectedBooking.date} à {selectedBooking.time}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Montant</span>
                <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>
                  {selectedBooking.amount ? `${Number(selectedBooking.amount).toFixed(2)} €` : 'Sur devis'}
                </strong>
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><strong>Lieu de prise en charge :</strong> {selectedBooking.pickup}</div>
              {selectedBooking.destination && <div><strong>Destination :</strong> {selectedBooking.destination}</div>}
              <div><strong>Véhicule :</strong> {selectedBooking.vehicle}</div>
              {selectedBooking.flightNumber && <div><strong>Numéro de vol :</strong> {selectedBooking.flightNumber}</div>}
              {selectedBooking.specialRequests && <div><strong>Demande spéciale :</strong> {selectedBooking.specialRequests}</div>}
            </div>

            {/* Modifier le statut */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Changer le statut :</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    updateBookingStatus(selectedBooking.id, 'paid');
                    setSelectedBooking({ ...selectedBooking, status: 'paid' });
                  }}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: 'none', cursor: 'pointer' }}
                >
                  Payé
                </button>
                <button
                  onClick={() => {
                    updateBookingStatus(selectedBooking.id, 'completed');
                    setSelectedBooking({ ...selectedBooking, status: 'completed' });
                  }}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: 'none', cursor: 'pointer' }}
                >
                  Terminé
                </button>
                <button
                  onClick={() => {
                    updateBookingStatus(selectedBooking.id, 'cancelled');
                    setSelectedBooking({ ...selectedBooking, status: 'cancelled' });
                  }}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: 'none', cursor: 'pointer' }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
