import { useState, useEffect } from 'react';

const STORAGE_USER_KEY = 'sely_client_user';
const STORAGE_TRIPS_KEY = 'sely_client_trips';

const DEFAULT_SAMPLE_TRIPS = [
  {
    id: 'TRIP-2026-9481',
    status: 'upcoming',
    service: 'transfer',
    serviceLabel: 'Transfert Point A à B',
    date: '2026-10-04',
    time: '14:30',
    pickup: 'Aéroport Paris-Charles de Gaulle (CDG) - Terminal 2E',
    destination: 'Hôtel Ritz Paris, 15 Place Vendôme, 75001 Paris',
    vehicleName: 'First Class (Mercedes Classe S)',
    vehicleCategory: 'First Class',
    vehicleImage: '/sclass-main-new.jpg',
    price: '180 €',
    passengers: 2,
    luggage: 3,
    flightNumber: 'AF 023 (New York JFK -> Paris CDG)',
    chauffeur: 'Jean-Marc L. (Chauffeur Référent SELY)',
    chauffeurPhone: '+33 6 88 41 20 99',
    notes: 'Accueil pancarte nominative au déboucheur de douane.',
  },
  {
    id: 'TRIP-2026-8120',
    status: 'past',
    service: 'transfer',
    serviceLabel: 'Transfert VIP Aéroport',
    date: '2026-09-22',
    time: '10:15',
    pickup: 'Four Seasons Hôtel George V, Paris',
    destination: 'Aéroport Paris-Le Bourget (Terminal Aviation Privée)',
    vehicleName: 'Business Van (Mercedes Classe V)',
    vehicleCategory: 'Business Van',
    vehicleImage: '/vclass-paris-luxury.jpg',
    price: '240 €',
    invoiceNumber: 'FACT-2026-0922',
    passengers: 4,
    luggage: 6,
    completedAt: '2026-09-22T11:05:00.000Z',
  },
  {
    id: 'TRIP-2026-7045',
    status: 'cancelled',
    service: 'hourly',
    serviceLabel: 'Mise à disposition 4h',
    date: '2026-09-15',
    time: '09:00',
    pickup: 'Place de la Concorde, 75008 Paris',
    destination: 'Château de Versailles & Environs',
    vehicleName: 'Business Class (Mercedes Classe E)',
    vehicleCategory: 'Business Class',
    vehicleImage: '/eclass-paris-luxury.jpg',
    price: '360 €',
    cancelledAt: '2026-09-14T18:20:00.000Z',
    cancelReason: 'Annulé par le client (changement d’agenda)',
  },
];

const DEFAULT_GOOGLE_USER = {
  id: 'usr_google_default',
  name: 'Alexander Wright',
  firstName: 'Alexander',
  lastName: 'Wright',
  email: 'alexander.wright@luxury.com',
  phone: '+33 6 12 34 56 78',
  company: 'Family Office Privé',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  provider: 'google',
  frequentAddresses: [
    { id: '1', label: 'Domicile Paris', address: '18 Place Vendôme, 75001 Paris', type: 'home' },
    { id: '2', label: 'Bureau Corporate', address: '42 Avenue Montaigne, 75008 Paris', type: 'work' },
    { id: '3', label: 'Aéroport habituel', address: 'Aéroport CDG Terminal 2E', type: 'airport' },
    { id: '4', label: 'Hôtel de référence', address: 'Hôtel Ritz Paris (Place Vendôme)', type: 'hotel' },
  ],
  paymentBilling: {
    cardType: 'Visa Infinite',
    last4: '4242',
    expiry: '09/28',
    billingName: 'Alexander Wright',
    billingAddress: '18 Place Vendôme, 75001 Paris',
    vatNumber: 'FR 32 948 201 023',
    autoInvoice: true,
  },
};

// Singleton store subscriber
let listeners = [];
let currentUserState = null;
let currentTripsState = DEFAULT_SAMPLE_TRIPS;

try {
  const savedUser = localStorage.getItem(STORAGE_USER_KEY);
  if (savedUser) {
    currentUserState = JSON.parse(savedUser);
  }
  const savedTrips = localStorage.getItem(STORAGE_TRIPS_KEY);
  if (savedTrips) {
    currentTripsState = JSON.parse(savedTrips);
  }
} catch (e) {}

function notifyListeners() {
  listeners.forEach((listener) => listener({ user: currentUserState, trips: currentTripsState }));
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

  const loginWithGoogle = (customData) => {
    const userToSave = customData || DEFAULT_GOOGLE_USER;
    currentUserState = userToSave;
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userToSave));
      if (!localStorage.getItem(STORAGE_TRIPS_KEY)) {
        localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(DEFAULT_SAMPLE_TRIPS));
      }
    } catch (e) {}
    notifyListeners();
  };

  const loginWithEmail = ({ email, password }) => {
    const userToSave = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      firstName: email.split('@')[0],
      lastName: '',
      email: email,
      phone: '+33 6 00 00 00 00',
      company: '',
      provider: 'email',
      frequentAddresses: [
        { id: '1', label: 'Domicile', address: 'Paris, France', type: 'home' },
      ],
      paymentBilling: {
        cardType: 'Mastercard',
        last4: '8810',
        expiry: '12/27',
        billingName: email.split('@')[0],
        billingAddress: 'Paris, France',
        vatNumber: '',
        autoInvoice: true,
      },
    };
    currentUserState = userToSave;
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userToSave));
      if (!localStorage.getItem(STORAGE_TRIPS_KEY)) {
        localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(DEFAULT_SAMPLE_TRIPS));
      }
    } catch (e) {}
    notifyListeners();
  };

  const registerUser = ({ firstName, lastName, email, phone }) => {
    const fullName = `${firstName} ${lastName}`.trim() || email.split('@')[0];
    const userToSave = {
      id: `usr_${Date.now()}`,
      name: fullName,
      firstName: firstName || '',
      lastName: lastName || '',
      email: email,
      phone: phone || '',
      company: '',
      provider: 'email',
      frequentAddresses: [
        { id: '1', label: 'Domicile', address: 'Paris, France', type: 'home' },
      ],
      paymentBilling: {
        cardType: 'Visa',
        last4: '1234',
        expiry: '10/28',
        billingName: fullName,
        billingAddress: 'Paris, France',
        vatNumber: '',
        autoInvoice: true,
      },
    };
    currentUserState = userToSave;
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userToSave));
      if (!localStorage.getItem(STORAGE_TRIPS_KEY)) {
        localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(DEFAULT_SAMPLE_TRIPS));
      }
    } catch (e) {}
    notifyListeners();
  };

  const logout = () => {
    currentUserState = null;
    try {
      localStorage.removeItem(STORAGE_USER_KEY);
    } catch (e) {}
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
    currentUserState = {
      ...currentUserState,
      ...info,
      name: `${info.firstName || ''} ${info.lastName || ''}`.trim() || currentUserState.name,
    };
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUserState));
    } catch (e) {}
    notifyListeners();
  };

  const updateFrequentAddresses = (addresses) => {
    if (!currentUserState) return;
    currentUserState = {
      ...currentUserState,
      frequentAddresses: addresses,
    };
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUserState));
    } catch (e) {}
    notifyListeners();
  };

  const updatePaymentBilling = (billing) => {
    if (!currentUserState) return;
    currentUserState = {
      ...currentUserState,
      paymentBilling: {
        ...currentUserState.paymentBilling,
        ...billing,
      },
    };
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUserState));
    } catch (e) {}
    notifyListeners();
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
