export const POPULAR_DESTINATIONS = {
  paris: [
    { id: 'cdg', label: 'Aéroport Paris-Charles de Gaulle (CDG)', subtitle: 'Roissy · Terminaux 1, 2, 3', type: 'airport', coordinates: [2.55, 49.0097] },
    { id: 'ory', label: 'Aéroport de Paris-Orly (ORY)', subtitle: 'Orly 1-2-3-4', type: 'airport', coordinates: [2.3652, 48.7262] },
    { id: 'lfpb', label: 'Aéroport Paris-Le Bourget (VIP)', subtitle: 'Terminaux d\'affaires FBO', type: 'airport', coordinates: [2.4414, 48.9694] },
    { id: 'champs', label: 'Avenue des Champs-Élysées', subtitle: '75008 Paris', type: 'monument', coordinates: [2.3084, 48.8698] },
    { id: 'vendome', label: 'Place Vendôme (Hôtel Ritz)', subtitle: '75001 Paris (Palaces & Joaillerie)', type: 'monument', coordinates: [2.3294, 48.8674] },
    { id: 'versailles', label: 'Château de Versailles', subtitle: '78000 Versailles', type: 'monument', coordinates: [2.1204, 48.8049] },
    { id: 'gdn', label: 'Gare du Nord (Eurostar / Thalys)', subtitle: '75010 Paris', type: 'station', coordinates: [2.3553, 48.8809] },
    { id: 'gdl', label: 'Gare de Lyon', subtitle: '75012 Paris', type: 'station', coordinates: [2.3735, 48.8449] },
    { id: 'defense', label: 'La Défense', subtitle: 'Esplanade & Quartier d\'affaires', type: 'business', coordinates: [2.2382, 48.8924] },
    { id: 'eiffel', label: 'Tour Eiffel & Champ de Mars', subtitle: '75007 Paris', type: 'monument', coordinates: [2.2945, 48.8584] },
  ],
  london: [
    { id: 'lhr', label: 'Heathrow Airport (LHR)', subtitle: 'London Terminals 2, 3, 4, 5', type: 'airport', coordinates: [-0.4543, 51.4700] },
    { id: 'lgw', label: 'Gatwick Airport (LGW)', subtitle: 'London', type: 'airport', coordinates: [-0.1821, 51.1537] },
    { id: 'mayfair', label: 'Mayfair', subtitle: 'London W1', type: 'monument', coordinates: [-0.1495, 51.5100] },
    { id: 'knightsbridge', label: 'Knightsbridge', subtitle: 'London SW1X', type: 'monument', coordinates: [-0.1609, 51.5015] },
  ],
  'french-riviera': [
    { id: 'nce', label: 'Aéroport Nice Côte d\'Azur (NCE)', subtitle: 'Nice Terminal 1 & 2', type: 'airport', coordinates: [7.2159, 43.6584] },
    { id: 'mcm', label: 'Monaco / Monte-Carlo', subtitle: 'Principauté de Monaco', type: 'monument', coordinates: [7.4246, 43.7384] },
    { id: 'cannes', label: 'Boulevard de la Croisette', subtitle: 'Cannes', type: 'monument', coordinates: [7.0253, 43.5503] },
    { id: 'sttropez', label: 'Saint-Tropez', subtitle: 'Place des Lices & Port', type: 'monument', coordinates: [6.6406, 43.2727] },
  ],
  bordeaux: [
    { id: 'bod', label: 'Aéroport de Bordeaux-Mérignac (BOD)', subtitle: 'Mérignac', type: 'airport', coordinates: [-0.7156, 44.8283] },
    { id: 'bdx-gare', label: 'Gare Bordeaux Saint-Jean', subtitle: 'Bordeaux', type: 'station', coordinates: [-0.5567, 44.8260] },
    { id: 'vignobles', label: 'Route des Châteaux Médoc / Saint-Émilion', subtitle: 'Vignobles', type: 'monument', coordinates: [-0.1556, 44.8943] },
  ],
  suisse: [
    { id: 'gva', label: 'Genève Aéroport (GVA)', subtitle: 'Genève Cointrin', type: 'airport', coordinates: [6.1092, 46.2381] },
    { id: 'zrh', label: 'Zurich Airport (ZRH)', subtitle: 'Kloten', type: 'airport', coordinates: [8.5492, 47.4582] },
  ],
  italie: [
    { id: 'mxp', label: 'Milano Malpensa Airport (MXP)', subtitle: 'Milan Terminal 1 & 2', type: 'airport', coordinates: [8.7231, 45.6301] },
    { id: 'lin', label: 'Milano Linate Airport (LIN)', subtitle: 'Milan', type: 'airport', coordinates: [9.2783, 45.4451] },
  ],
  uae: [
    { id: 'dxb', label: 'Dubai International Airport (DXB)', subtitle: 'Dubai VIP Terminal', type: 'airport', coordinates: [55.3657, 25.2532] },
    { id: 'dwc', label: 'Al Maktoum International (DWC)', subtitle: 'Dubai South', type: 'airport', coordinates: [55.1713, 24.8960] },
    { id: 'downtown', label: 'Downtown Dubai / Burj Khalifa', subtitle: 'Dubai', type: 'monument', coordinates: [55.2744, 25.1972] },
  ],
  usa: [
    { id: 'jfk', label: 'JFK International Airport', subtitle: 'New York Terminals', type: 'airport', coordinates: [-73.7781, 40.6413] },
    { id: 'lga', label: 'LaGuardia Airport', subtitle: 'New York', type: 'airport', coordinates: [-73.8740, 40.7769] },
    { id: 'manhattan', label: 'Manhattan', subtitle: 'New York, NY', type: 'monument', coordinates: [-73.9712, 40.7831] },
  ],
};

export function getPopularDestinations(city = 'paris', query = '') {
  const key = city && POPULAR_DESTINATIONS[city] ? city : 'paris';
  const list = POPULAR_DESTINATIONS[key];
  if (!query || !query.trim()) return list;
  const q = query.trim().toLowerCase();
  return list.filter(item => 
    item.label.toLowerCase().includes(q) ||
    item.subtitle.toLowerCase().includes(q) ||
    item.id.toLowerCase().includes(q)
  );
}
