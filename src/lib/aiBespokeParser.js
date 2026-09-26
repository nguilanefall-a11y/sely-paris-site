/**
 * AI & Natural Language Parser for Bespoke Luxury Chauffeur Requests
 * Capable of extracting structured parameters from unstructured text (French & English).
 */

const VEHICLE_PATTERNS = [
  { id: 'classe-v', name: 'Mercedes Classe V', regex: /\b(v[- ]?class|classe[- ]?v|van|sprinter)\b/i },
  { id: 'classe-s', name: 'Mercedes Classe S', regex: /\b(s[- ]?class|classe[- ]?s|berline de luxe)\b/i },
  { id: 'maybach', name: 'Mercedes-Maybach', regex: /\b(maybach)\b/i },
  { id: 'classe-e', name: 'Mercedes Classe E', regex: /\b(e[- ]?class|classe[- ]?e)\b/i },
  { id: 'rolls-royce', name: 'Rolls-Royce', regex: /\b(rolls|phantom|cullinan)\b/i },
  { id: 'range-rover', name: 'Range Rover', regex: /\b(range[- ]?rover|autobiography)\b/i },
  { id: 'tesla', name: 'Tesla', regex: /\b(tesla|model[- ]?y)\b/i },
  { id: 'sprinter-vip', name: 'Sprinter VIP', regex: /\b(sprinter vip|minibus)\b/i },
];

const PASSENGER_WORDS = {
  un: 1, une: 1, one: 1,
  deux: 2, two: 2,
  trois: 3, three: 3,
  quatre: 4, four: 4,
  cinq: 5, five: 5,
  six: 6, six_en: 6,
  sept: 7, seven: 7,
  huit: 8, eight: 8,
  neuf: 9, nine: 9,
  dix: 10, ten: 10,
  douze: 12, twelve: 12,
  quinze: 15, fifteen: 15,
  vingt: 20, twenty: 20,
};

const DAYS_PATTERNS = [
  /\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b/gi,
  /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
  /\b(ce soir|demain|ce week-end|today|tonight|tomorrow|this weekend|next week)\b/gi,
  /\b(\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)\b/g,
];

const DURATION_PATTERNS = [
  /(\d+|un|une|deux|trois|quatre|cinq|six|seven|eight|three|four)\s*(?:jours?|days?|nuits?|nights?)/i,
  /(\d+)\s*(?:heures?|hours?|h\b)/i,
  /\b(journée complète|demi-journée|full[- ]?day|half[- ]?day|week[- ]?end|semaine)\b/i,
];

const LOCATION_PATTERNS = [
  /\b(paris|new york|londres|london|geneve|geneva|nice|cannes|monaco|bordeaux|milan|dubai|los angeles|miami)\b/gi,
  /\b(cdg|orly|le bourget|roissy|heathrow|jfk|newark|laguardia|aeroport|airport|gare du nord|gare de lyon)\b/gi,
  /\b(ritz|george v|bristol|plaza ath[eé]n[eé]e|crillon|meurice|shangri-la|peninsula)\b/gi,
];

export function parseBespokeRequestAI(text) {
  if (!text || text.trim().length === 0) return null;

  const result = {
    passengers: null,
    vehicles: [],
    dates: [],
    duration: null,
    locations: [],
    specialHighlights: [],
    rawText: text,
  };

  // 1. Extract Passengers
  const paxRegex = /(\d+)\s*(?:personnes?|passagers?|people|guests?|passengers?|pax|prs)\b/i;
  const paxMatch = text.match(paxRegex);
  if (paxMatch) {
    result.passengers = parseInt(paxMatch[1], 10);
  } else {
    // Check word numbers (e.g., "six people")
    for (const [word, val] of Object.entries(PASSENGER_WORDS)) {
      const wordRegex = new RegExp(`\\b${word}\\s+(?:personnes?|passagers?|people|guests?|passengers?|pax)\\b`, 'i');
      if (wordRegex.test(text)) {
        result.passengers = val;
        break;
      }
    }
  }

  // 2. Extract Vehicles
  for (const v of VEHICLE_PATTERNS) {
    if (v.regex.test(text)) {
      result.vehicles.push(v.name);
    }
  }
  // Check multiple vehicles mention
  if (/\b(deux|2|trois|3|plusieurs|another|second|additional)\s*(?:véhicules?|voitures?|berlines?|vans?|cars?|vehicles?)\b/i.test(text)) {
    result.specialHighlights.push('Flotte multiple demandée');
  }

  // 3. Extract Dates & Days
  for (const pattern of DAYS_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((m) => {
        const cleaned = m.trim();
        if (!result.dates.some((d) => d.toLowerCase() === cleaned.toLowerCase())) {
          result.dates.push(cleaned.charAt(0).toUpperCase() + cleaned.slice(1));
        }
      });
    }
  }

  // 4. Extract Duration
  for (const pattern of DURATION_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      result.duration = match[0];
      break;
    }
  }

  // 5. Extract Locations
  for (const pattern of LOCATION_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((m) => {
        const cleanLoc = m.trim();
        if (!result.locations.some((l) => l.toLowerCase() === cleanLoc.toLowerCase())) {
          result.locations.push(cleanLoc.toUpperCase());
        }
      });
    }
  }

  // 6. Special context highlights
  if (/fashion week/i.test(text)) result.specialHighlights.push('Fashion Week');
  if (/mariage|wedding/i.test(text)) result.specialHighlights.push('Célébration / Mariage');
  if (/diplomatique|delegation|ambassade|minist/i.test(text)) result.specialHighlights.push('Convoi Officiel / Diplomatique');
  if (/vip|protocole|discr[eé]tion/i.test(text)) result.specialHighlights.push('Protocole VIP Haute Discrétion');

  return result;
}
