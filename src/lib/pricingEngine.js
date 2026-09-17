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
    name: 'Mercedes Classe V',
    category: 'Van Prestige (7 places)',
    hourlyRate: 90,
    minHours: 2,
    transferBase: 50,
    perKm: 2.80,
    transferMin: 120,
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
  'sprinter-minibus': {
    name: 'Minibus Sprinter (16-19 places)',
    category: 'Transport de Groupe Exécutif',
    hourlyRate: 170,
    minHours: 3,
    transferBase: 120,
    perKm: 4.50,
    transferMin: 240,
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
    name: 'Mercedes Sprinter VIP (12 places)',
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
  options = {}, // { babySeat, childSeat, nameBoard }
}) {
  const cityConfig = CITY_CONFIGS[city] || CITY_CONFIGS.paris;
  const vehicle = VEHICLE_RATES[vehicleId] || VEHICLE_RATES['classe-s'];
  const multiplier = cityConfig.multiplier;

  let basePrice = 0;
  let calculationDetails = '';
  let billedHours = 0;
  let billedDistance = 0;

  if (serviceType === 'hourly') {
    // Parse duration (ex: "3 heures", "3h", "3", etc.)
    const parsedDuration = parseInt(String(duration).replace(/\D/g, ''), 10) || vehicle.minHours;
    billedHours = Math.max(parsedDuration, vehicle.minHours);
    const hourlyRate = Math.round(vehicle.hourlyRate * multiplier);
    basePrice = billedHours * hourlyRate;
    calculationDetails = `Mise à disposition ${billedHours}h en ${vehicle.name} (${hourlyRate} €/h)`;
  } else {
    // Mode transfert
    // Si distance non connue, on utilise la distance typique aéroport/ville de la région
    billedDistance = distanceKm && distanceKm > 3 ? distanceKm : cityConfig.defaultDistanceKm;
    const transferBase = Math.round(vehicle.transferBase * multiplier);
    const perKm = Math.round(vehicle.perKm * multiplier * 100) / 100;
    const computedPrice = transferBase + (billedDistance * perKm);
    const transferMin = Math.round(vehicle.transferMin * multiplier);
    basePrice = Math.max(computedPrice, transferMin);
    calculationDetails = `Transfert ~${Math.round(billedDistance)} km en ${vehicle.name}`;
  }

  // Majoration nuit (21h00 - 06h00) : +15%
  let nightSurcharge = 0;
  if (time) {
    const hour = parseInt(time.split(':')[0], 10);
    if (!isNaN(hour) && (hour >= 21 || hour < 6)) {
      nightSurcharge = Math.round(basePrice * 0.15);
      basePrice += nightSurcharge;
      calculationDetails += ' (incl. tarif nuit +15%)';
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
