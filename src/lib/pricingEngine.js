/**
 * SELY Privé - Moteur de Calcul Tarifaire Intelligent & Adaptatif
 * Adapté à chaque destination (Paris, Côte d'Azur, Londres, Bordeaux)
 * Tarification Grande Remise / Chauffeur Privé Luxe
 */

export const CITY_CONFIGS = {
  paris: {
    name: 'Paris & Île-de-France',
    currency: 'EUR',
    symbol: '€',
    lat: 48.8566,
    lon: 2.3522,
    multiplier: 1.0,
    defaultDistanceKm: 28, // Distance moyenne Paris - Aéroports CDG/Orly
  },
  'french-riviera': {
    name: 'Côte d\'Azur & Monaco',
    currency: 'EUR',
    symbol: '€',
    lat: 43.7102,
    lon: 7.2620,
    multiplier: 1.15, // Marché très haut de gamme (Monaco, Cannes, Saint-Tropez)
    defaultDistanceKm: 32, // Nice - Monaco / Nice - Cannes
  },
  london: {
    name: 'London & Greater London',
    currency: 'EUR',
    symbol: '€',
    lat: 51.5074,
    lon: -0.1278,
    multiplier: 1.10, // Marché exécutif Mayfair, Congestion charge, Heathrow
    defaultDistanceKm: 30, // Central London - Heathrow
  },
  bordeaux: {
    name: 'Bordeaux & Vignobles',
    currency: 'EUR',
    symbol: '€',
    lat: 44.8378,
    lon: -0.5792,
    multiplier: 0.95,
    defaultDistanceKm: 25, // Bordeaux - Mérignac / Châteaux
  },
  suisse: {
    name: 'Suisse (Genève & Zurich)',
    currency: 'EUR',
    symbol: '€',
    lat: 46.2044,
    lon: 6.1432,
    multiplier: 1.25, // Marché suisse haute horlogerie / banques privées
    defaultDistanceKm: 35, // Genève - Cologny / Nyon
  },
  usa: {
    name: 'USA (New York, Miami, LA)',
    currency: 'EUR',
    symbol: '€',
    lat: 40.7128,
    lon: -74.0060,
    multiplier: 1.20,
    defaultDistanceKm: 30, // Manhattan - JFK
  },
  italie: {
    name: 'Italie (Milan & Rome)',
    currency: 'EUR',
    symbol: '€',
    lat: 45.4642,
    lon: 9.1900,
    multiplier: 1.05,
    defaultDistanceKm: 45, // Milan - Malpensa
  },
  uae: {
    name: 'Émirats (Dubaï & Abu Dhabi)',
    currency: 'EUR',
    symbol: '€',
    lat: 25.2048,
    lon: 55.2708,
    multiplier: 1.15,
    defaultDistanceKm: 35, // Downtown - DXB
  },
};

export const VEHICLE_RATES = {
  'classe-e': {
    name: 'Mercedes Classe E',
    category: 'Berline Affaires',
    hourlyRate: 95,
    minHours: 2,
    transferBase: 60,
    perKm: 3.20,
    transferMin: 110,
  },
  'classe-s': {
    name: 'Mercedes Classe S',
    category: 'Berline Première Classe',
    hourlyRate: 160,
    minHours: 3,
    transferBase: 90,
    perKm: 4.80,
    transferMin: 190,
  },
  'classe-v': {
    name: 'Mercedes Classe V Business',
    category: 'Van Prestige Business (7 places)',
    hourlyRate: 90,
    minHours: 2,
    transferBase: 50,
    perKm: 2.80,
    transferMin: 120,
  },
  'peugeot-traveller': {
    name: 'Peugeot Traveller',
    category: 'Van Confort (6 places)',
    hourlyRate: 85,
    minHours: 2,
    transferBase: 50,
    perKm: 2.70,
    transferMin: 110,
  },
  'maybach': {
    name: 'Mercedes-Maybach',
    category: 'Luxe Absolu',
    hourlyRate: 280,
    minHours: 3,
    transferBase: 180,
    perKm: 7.50,
    transferMin: 350,
  },
  'sprinter-7-vip': {
    name: 'Mercedes Sprinter VIP (7 places)',
    category: 'Salon VIP Mobile & Jet Privé',
    hourlyRate: 230,
    minHours: 3,
    transferBase: 160,
    perKm: 5.80,
    transferMin: 320,
  },
  'sprinter-14-vip': {
    name: 'Mercedes Sprinter VIP (14 places)',
    category: 'Salon Conférence VIP Prestige',
    hourlyRate: 270,
    minHours: 3,
    transferBase: 190,
    perKm: 6.80,
    transferMin: 380,
  },
  'sprinter-19-standard': {
    name: 'Mercedes Sprinter Standard (19 places)',
    category: 'Minibus Grand Tourisme & Confort',
    hourlyRate: 200,
    minHours: 3,
    transferBase: 140,
    perKm: 5.20,
    transferMin: 280,
  },
  'sprinter-minibus': {
    name: 'Minibus Sprinter (19 places)',
    category: 'Transport de Groupe Exécutif',
    hourlyRate: 200,
    minHours: 3,
    transferBase: 140,
    perKm: 5.20,
    transferMin: 280,
  },
  'sprinter-vip': {
    name: 'Mercedes Sprinter VIP (7 places)',
    category: 'Salon VIP Mobile & Jet Privé',
    hourlyRate: 230,
    minHours: 3,
    transferBase: 160,
    perKm: 5.80,
    transferMin: 320,
  },
  'sprinter-12': {
    name: 'Mercedes Sprinter VIP (14 places)',
    category: 'Grand Salon VIP Prestige',
    hourlyRate: 270,
    minHours: 3,
    transferBase: 190,
    perKm: 6.80,
    transferMin: 380,
  },
  'tesla-y': {
    name: 'Tesla Model Y',
    category: 'Berline Électrique',
    hourlyRate: 85,
    minHours: 2,
    transferBase: 50,
    perKm: 2.80,
    transferMin: 95,
  },
  'limousine': {
    name: 'Limousine Stretch VIP',
    category: 'Cérémonie & Prestige',
    hourlyRate: 280,
    minHours: 3,
    transferBase: 180,
    perKm: 7.00,
    transferMin: 350,
  },
  'rolls-phantom': {
    name: 'Rolls-Royce Phantom',
    category: 'Hyper Luxe & Prestige',
    hourlyRate: 350,
    minHours: 3,
    transferBase: 250,
    perKm: 9.00,
    transferMin: 450,
  },
  'rolls-cullinan': {
    name: 'Rolls-Royce Cullinan',
    category: 'SUV Ultra Luxe',
    hourlyRate: 380,
    minHours: 3,
    transferBase: 280,
    perKm: 9.50,
    transferMin: 500,
  },
  'range-rover': {
    name: 'Range Rover Autobiography',
    category: 'SUV Prestige',
    hourlyRate: 180,
    minHours: 3,
    transferBase: 110,
    perKm: 5.20,
    transferMin: 220,
  },
  'classe-g': {
    name: 'Mercedes Classe G',
    category: 'SUV d\'Exception',
    hourlyRate: 250,
    minHours: 3,
    transferBase: 160,
    perKm: 6.80,
    transferMin: 320,
  },
  'brabus-g': {
    name: 'G-Class Brabus 800',
    category: 'Supercar SUV Exclusive',
    hourlyRate: 320,
    minHours: 3,
    transferBase: 220,
    perKm: 8.50,
    transferMin: 420,
  },
  'cadillac-escalade': {
    name: 'Cadillac Escalade ESV',
    category: 'SUV VIP Américain',
    hourlyRate: 240,
    minHours: 3,
    transferBase: 150,
    perKm: 6.50,
    transferMin: 300,
  },
};

/**
 * Calcule la distance par vol d'oiseau (Haversine) avec facteur de courbure routière
 */
export function calculateHaversineKm(coord1, coord2) {
  if (!coord1 || !coord2) return null;
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directDistance = R * c;
  // Facteur routier moyen de 1.32 entre vol d'oiseau et réseau routier
  return Math.round(directDistance * 1.32 * 10) / 10;
}

/**
 * Tente d'obtenir la distance routière exacte via OSRM, fallback sur Haversine
 */
export async function getDrivingDistanceKm(coord1, coord2) {
  if (!coord1 || !coord2) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500); // 2.5s max
    const url = `https://router.project-osrm.org/route/v1/driving/${coord1[0]},${coord1[1]};${coord2[0]},${coord2[1]}?overview=false`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes[0] && data.routes[0].distance) {
        return Math.round((data.routes[0].distance / 1000) * 10) / 10;
      }
    }
  } catch (e) {
    // Fallback silencieux
  }
  return calculateHaversineKm(coord1, coord2);
}

/**
 * Moteur principal de calcul tarifaire
 */
export function calculateTripPrice({
  city = 'paris',
  serviceType = 'transfer', // 'transfer' | 'hourly'
  vehicleId = 'classe-s',
  duration = 3, // en heures si mise à disposition
  distanceKm = null,
  pickup = '',
  destination = '',
  time = '',
  isLongDistance = false,
  options = {}, // { babySeat, childSeat, nameBoard }
  lang = 'fr',
}) {
  const cityConfig = CITY_CONFIGS[city] || CITY_CONFIGS.paris;
  const vehicle = VEHICLE_RATES[vehicleId] || VEHICLE_RATES['classe-s'];
  const multiplier = cityConfig.multiplier;

  let basePrice = 0;
  let calculationDetails = '';
  let billedHours = 0;
  let billedDistance = 0;

  if (serviceType === 'hourly') {
    // Parse duration (ex: "3 heures", "3h", 11, etc.)
    const parsedDuration = typeof duration === 'number'
      ? duration
      : (parseInt(String(duration).replace(/\D/g, ''), 10) || vehicle.minHours);
    billedHours = Math.max(parsedDuration, vehicle.minHours);
    const hourlyRate = Math.round(vehicle.hourlyRate * multiplier);
    basePrice = billedHours * hourlyRate;
    const ldLabel = isLongDistance
      ? (lang === 'en' ? ' · Long distance itinerary' : ' · Longue distance incluse')
      : '';
    calculationDetails = lang === 'en'
      ? `Hourly service ${billedHours}h in ${vehicle.name} (${hourlyRate} €/h)${ldLabel}`
      : `Mise à disposition ${billedHours}h en ${vehicle.name} (${hourlyRate} €/h)${ldLabel}`;
  } else {
    // Mode transfert
    // Si distance non connue, on utilise la distance typique aéroport/ville de la région
    billedDistance = distanceKm && distanceKm > 3 ? distanceKm : cityConfig.defaultDistanceKm;
    const transferBase = Math.round(vehicle.transferBase * multiplier);
    const perKm = Math.round(vehicle.perKm * multiplier * 100) / 100;
    const computedPrice = transferBase + (billedDistance * perKm);
    const transferMin = Math.round(vehicle.transferMin * multiplier);
    basePrice = Math.max(computedPrice, transferMin);
    calculationDetails = lang === 'en'
      ? `Transfer ~${Math.round(billedDistance)} km in ${vehicle.name}`
      : `Transfert ~${Math.round(billedDistance)} km en ${vehicle.name}`;
  }

  // Majoration nuit (21h00 - 06h00) : +15%
  let nightSurcharge = 0;
  if (time) {
    const hour = parseInt(time.split(':')[0], 10);
    if (!isNaN(hour) && (hour >= 21 || hour < 6)) {
      nightSurcharge = Math.round(basePrice * 0.15);
      basePrice += nightSurcharge;
      calculationDetails += lang === 'en' ? ' (incl. night rate +15%)' : ' (incl. tarif nuit +15%)';
    }
  }

  // Options
  let optionsPrice = 0;
  if (options.babySeat) optionsPrice += 15;
  if (options.childSeat) optionsPrice += 15;
  if (options.nameBoard) optionsPrice += 20;

  const total = Math.round((basePrice + optionsPrice) / 5) * 5; // Arrondi esthétique au 5 € le plus proche

  return {
    total,
    totalPrice: total,
    currency: cityConfig.currency,
    symbol: cityConfig.symbol,
    details: calculationDetails,
    billedHours,
    billedDistance,
    nightSurcharge,
    optionsPrice,
    vehicleName: vehicle.name,
    category: vehicle.category,
  };
}
