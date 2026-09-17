import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const WHOP_API_KEY = 'apik_mrPBXFhUqWN8k_C6365443_C_e757150796ffe939dbc0bdee34f1e658418433af9809d7f732fdc847be50fd';
const WHOP_ACCOUNT_ID = 'biz_5oY1Qe4By05YTu';

export const useBookingsStore = create(
  persist(
    (set, get) => ({
      bookings: [],
      isLoading: false,
      lastSyncedAt: null,

      addBooking: (booking) => {
        const newBooking = {
          id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          createdAt: new Date().toISOString(),
          status: booking.status || 'pending', // 'paid' | 'pending' | 'quote' | 'completed' | 'cancelled'
          source: booking.source || 'site',
          ...booking,
        };
        set((state) => ({
          bookings: [newBooking, ...state.bookings],
        }));
        return newBooking;
      },

      updateBookingStatus: (id, newStatus) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status: newStatus, updatedAt: new Date().toISOString() } : b
          ),
        }));
      },

      deleteBooking: (id) => {
        set((state) => ({
          bookings: state.bookings.filter((b) => b.id !== id),
        }));
      },

      // Synchronisation directe avec l'API Whop
      syncWhopPayments: async () => {
        set({ isLoading: true });
        try {
          let payments = [];

          // 1. Essayer le endpoint interne
          try {
            const res = await fetch('/api/get-whop-payments');
            if (res.ok) {
              const data = await res.json();
              if (data && data.data) payments = data.data;
            }
          } catch (e) {
            console.warn('API endpoint get-whop-payments unreachable, trying direct Whop API');
          }

          // 2. Fallback direct API Whop
          if (!payments || payments.length === 0) {
            const directRes = await fetch(`https://api.whop.com/api/v1/payments?account_id=${WHOP_ACCOUNT_ID}`, {
              headers: { Authorization: `Bearer ${WHOP_API_KEY}` },
            });
            if (directRes.ok) {
              const data = await directRes.json();
              if (data && data.data) payments = data.data;
            }
          }

          if (payments && payments.length > 0) {
            const currentBookings = get().bookings;
            const newImported = [];

            payments.forEach((p) => {
              // Vérifier si ce paiement est déjà présent
              const exists = currentBookings.some((b) => b.whopPaymentId === p.id);
              if (!exists) {
                const isPaid = p.status === 'paid';
                newImported.push({
                  id: `whop_${p.id}`,
                  whopPaymentId: p.id,
                  source: 'whop',
                  createdAt: p.created_at || new Date().toISOString(),
                  status: isPaid ? 'paid' : p.status,
                  clientName: p.billing_address?.name || p.user?.username || 'Client Whop',
                  email: p.customer_email || '—',
                  phone: p.customer_phone || '—',
                  city: p.metadata?.city || 'paris',
                  serviceType: p.metadata?.serviceType || 'transfer',
                  pickup: p.metadata?.pickup || p.billing_address?.city || 'Réservation Whop',
                  destination: p.metadata?.destination || '—',
                  date: p.metadata?.date || p.created_at?.split('T')[0] || '—',
                  time: p.metadata?.time || '—',
                  vehicle: p.plan?.title || p.product?.title || 'Chauffeur Privé',
                  amount: p.total?.amount ? Number(p.total.amount) : 0,
                  currency: (p.currency || 'eur').toUpperCase(),
                  paymentMethod: p.payment_instrument?.card?.brand
                    ? `${p.payment_instrument.card.brand.toUpperCase()} •••• ${p.payment_instrument.card.last4 || ''}`
                    : p.payment_method_type || 'Carte Bancaire',
                });
              }
            });

            if (newImported.length > 0) {
              set((state) => ({
                bookings: [...newImported, ...state.bookings],
                lastSyncedAt: new Date().toISOString(),
              }));
            } else {
              set({ lastSyncedAt: new Date().toISOString() });
            }
          }
        } catch (error) {
          console.error('Error syncing Whop payments:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'sely-bookings-storage',
    }
  )
);
