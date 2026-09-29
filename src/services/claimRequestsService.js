/**
 * SELY Paris - Claim Requests Service
 * Manages client requests to link offline/manual bookings (WhatsApp, email, external payments)
 * to their online client account.
 */

const STORAGE_CLAIMS_KEY = 'sely_claim_requests';

export const claimRequestsService = {
  getRequests() {
    try {
      const raw = localStorage.getItem(STORAGE_CLAIMS_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading claim requests:', e);
      return [];
    }
  },

  addRequest({ clientName, clientEmail, clientPhone, details, userId }) {
    const list = this.getRequests();
    const newReq = {
      id: `claim_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      clientName: (clientName || '').trim(),
      clientEmail: (clientEmail || '').trim().toLowerCase(),
      clientPhone: (clientPhone || '').trim(),
      details: (details || '').trim(),
      userId: userId || null,
      status: 'pending', // 'pending' | 'linked' | 'rejected'
      createdAt: new Date().toISOString(),
      linkedBookingId: null,
    };

    const updated = [newReq, ...list];
    try {
      localStorage.setItem(STORAGE_CLAIMS_KEY, JSON.stringify(updated));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('sely_claim_requests_updated'));
      }
    } catch (e) {
      console.error('Error saving claim request:', e);
    }
    return newReq;
  },

  updateRequestStatus(id, newStatus, linkedBookingId = null) {
    const list = this.getRequests();
    const updated = list.map((req) =>
      req.id === id
        ? {
            ...req,
            status: newStatus,
            linkedBookingId: linkedBookingId || req.linkedBookingId,
            resolvedAt: new Date().toISOString(),
          }
        : req
    );
    try {
      localStorage.setItem(STORAGE_CLAIMS_KEY, JSON.stringify(updated));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('sely_claim_requests_updated'));
      }
    } catch (e) {}
    return updated;
  },

  deleteRequest(id) {
    const list = this.getRequests();
    const updated = list.filter((r) => r.id !== id);
    try {
      localStorage.setItem(STORAGE_CLAIMS_KEY, JSON.stringify(updated));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('sely_claim_requests_updated'));
      }
    } catch (e) {}
    return updated;
  },
};
