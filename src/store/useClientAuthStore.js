import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

const STORAGE_TRIPS_KEY = 'sely_client_trips';

// Singleton store subscriber
let listeners = [];
let currentUserState = authService.getCurrentSession();
let currentTripsState = [];
let authLoadingState = false;
let authErrorState = null;

export function reloadTripsFromStorage() {
  try {
    const savedTrips = localStorage.getItem(STORAGE_TRIPS_KEY);
    if (savedTrips) {
      const parsed = JSON.parse(savedTrips);
      currentTripsState = parsed.filter(
        (t) =>
          t.id !== 'TRIP-2026-9481' &&
          t.id !== 'TRIP-2026-8120' &&
          (t.clientEmail || '').toLowerCase() !== 'alexander.wright@luxury.com'
      );
    } else {
      currentTripsState = [];
    }
  } catch (e) {
    currentTripsState = [];
  }
  notifyListeners();
}

try {
  const savedTrips = localStorage.getItem(STORAGE_TRIPS_KEY);
  if (savedTrips) {
    const parsed = JSON.parse(savedTrips);
    const cleaned = parsed.filter(
      (t) =>
        t.id !== 'TRIP-2026-9481' &&
        t.id !== 'TRIP-2026-8120' &&
        (t.clientEmail || '').toLowerCase() !== 'alexander.wright@luxury.com'
    );
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(cleaned));
      currentTripsState = cleaned;
    } else {
      currentTripsState = parsed;
    }
  } else {
    currentTripsState = [];
  }
} catch (e) {}

function notifyListeners() {
  listeners.forEach((listener) =>
    listener({
      user: currentUserState,
      trips: currentTripsState,
      authLoading: authLoadingState,
      authError: authErrorState,
    })
  );
}

// Global listener for cross-tab or cross-component sync
if (typeof window !== 'undefined') {
  window.addEventListener('sely_trips_updated', reloadTripsFromStorage);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_TRIPS_KEY) {
      reloadTripsFromStorage();
    }
    if (e.key === 'sely_auth_session_v2') {
      currentUserState = authService.getCurrentSession();
      notifyListeners();
    }
  });
}

export function useClientAuthStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const clearAuthError = () => {
    authErrorState = null;
    notifyListeners();
  };

  /**
   * Real email + password login
   */
  const loginWithEmail = async ({ email, password }) => {
    authLoadingState = true;
    authErrorState = null;
    notifyListeners();
    try {
      const user = await authService.loginWithEmail({ email, password });
      currentUserState = user;
      authLoadingState = false;
      notifyListeners();
      return { success: true, user };
    } catch (err) {
      authLoadingState = false;
      authErrorState = err.message || 'Erreur lors de la connexion.';
      notifyListeners();
      return { success: false, error: authErrorState };
    }
  };

  /**
   * Real user registration
   */
  const registerUser = async ({ firstName, lastName, email, phone, password }) => {
    authLoadingState = true;
    authErrorState = null;
    notifyListeners();
    try {
      const user = await authService.register({ firstName, lastName, email, phone, password });
      currentUserState = user;
      authLoadingState = false;
      notifyListeners();
      return { success: true, user };
    } catch (err) {
      authLoadingState = false;
      authErrorState = err.message || "Erreur lors de l'inscription.";
      notifyListeners();
      return { success: false, error: authErrorState };
    }
  };

  /**
   * Real Google OAuth Login
   */
  const loginWithGoogle = async (credential) => {
    authLoadingState = true;
    authErrorState = null;
    notifyListeners();
    try {
      if (typeof credential === 'string' && credential.includes('.')) {
        // Real Google JWT from Google Identity Services
        const user = await authService.loginWithGoogleCredential(credential);
        currentUserState = user;
        authLoadingState = false;
        notifyListeners();
        return { success: true, user };
      } else if (credential && typeof credential === 'object' && credential.email) {
        // Direct authenticated object from popup or OAuth redirect
        const user = authService.setSession({
          id: credential.id || `usr_google_${Date.now()}`,
          email: credential.email,
          firstName: credential.firstName || credential.name?.split(' ')[0] || 'Client',
          lastName: credential.lastName || '',
          name: credential.name || credential.email.split('@')[0],
          avatar: credential.avatar || credential.picture || '',
          phone: credential.phone || '',
          company: '',
          provider: 'google',
        });
        currentUserState = user;
        authLoadingState = false;
        notifyListeners();
        return { success: true, user };
      } else {
        throw new Error('Identifiants Google non reconnus.');
      }
    } catch (err) {
      authLoadingState = false;
      authErrorState = err.message || 'Erreur lors de la connexion Google.';
      notifyListeners();
      return { success: false, error: authErrorState };
    }
  };

  /**
   * Real user logout
   */
  const logout = () => {
    authService.logout();
    currentUserState = null;
    authErrorState = null;
    notifyListeners();
  };

  const cancelTrip = (tripId, reason = 'Annulation demandée par le client') => {
    currentTripsState = currentTripsState.map((trip) => {
      if (trip.id === tripId) {
        return {
          ...trip,
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
          cancelReason: reason,
        };
      }
      return trip;
    });
    try {
      localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(currentTripsState));
    } catch (e) {}
    notifyListeners();
  };

  const updatePersonalInfo = (info) => {
    if (!currentUserState) return;
    try {
      const updated = authService.updateProfile(info);
      currentUserState = updated;
      notifyListeners();
    } catch (e) {
      console.error('Failed to update personal info:', e);
    }
  };

  const updateFrequentAddresses = (addresses) => {
    if (!currentUserState) return;
    try {
      const updated = authService.updateProfile({ frequentAddresses: addresses });
      currentUserState = updated;
      notifyListeners();
    } catch (e) {
      console.error('Failed to update addresses:', e);
    }
  };

  const updatePaymentBilling = (billing) => {
    if (!currentUserState) return;
    try {
      const updated = authService.updateProfile({ paymentBilling: billing });
      currentUserState = updated;
      notifyListeners();
    } catch (e) {
      console.error('Failed to update billing:', e);
    }
  };

  const addTrip = (trip) => {
    currentTripsState = [trip, ...currentTripsState];
    try {
      localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(currentTripsState));
    } catch (e) {}
    notifyListeners();
  };

  return {
    user: currentUserState,
    trips: currentTripsState,
    authLoading: authLoadingState,
    authError: authErrorState,
    clearAuthError,
    loginWithGoogle,
    loginWithEmail,
    registerUser,
    logout,
    cancelTrip,
    updatePersonalInfo,
    updateFrequentAddresses,
    updatePaymentBilling,
    addTrip,
  };
}
