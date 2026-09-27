export const POPULAR_DESTINATIONS = {
  paris: [
    { id: 'cdg', label: 'Aéroport Paris-Charles de Gaulle (CDG)', subtitle: 'Roissy-en-France', type: 'airport' },
    { id: 'ory', label: 'Aéroport de Paris-Orly (ORY)', subtitle: 'Orly / Paray-Vieille-Poste', type: 'airport' },
    { id: 'lfpb', label: 'Aéroport Paris-Le Bourget (VIP)', subtitle: 'Terminaux d\'affaires FBO', type: 'airport' },
    { id: 'champs', label: 'Avenue des Champs-Élysées', subtitle: '75008 Paris', type: 'monument' },
    { id: 'vendome', label: 'Place Vendôme', subtitle: '75001 Paris (Palaces & Joaillerie)', type: 'monument' },
    { id: 'versailles', label: 'Château de Versailles', subtitle: '78000 Versailles', type: 'monument' },
    { id: 'gdn', label: 'Gare du Nord (Eurostar / Thalys)', subtitle: '75010 Paris', type: 'station' },
    { id: 'gdl', label: 'Gare de Lyon', subtitle: '75012 Paris', type: 'station' },
    { id: 'defense', label: 'La Défense', subtitle: 'Esplanade & Quartier d\'affaires', type: 'business' },
    { id: 'eiffel', label: 'Tour Eiffel & Champ de Mars', subtitle: '75007 Paris', type: 'monument' },
  ],
  london: [
    { id: 'lhr', label: 'Heathrow Airport (LHR)', subtitle: 'London Terminals', type: 'airport' },
    { id: 'lgw', label: 'Gatwick Airport (LGW)', subtitle: 'London', type: 'airport' },
    { id: 'mayfair', label: 'Mayfair', subtitle: 'London W1', type: 'monument' },
    { id: 'knightsbridge', label: 'Knightsbridge', subtitle: 'London SW1X', type: 'monument' },
  ],
  'french-riviera': [
    { id: 'nce', label: 'Aéroport Nice Côte d\'Azur (NCE)', subtitle: 'Nice', type: 'airport' },
    { id: 'mcm', label: 'Monaco / Monte-Carlo', subtitle: 'Principauté de Monaco', type: 'monument' },
    { id: 'cannes', label: 'Boulevard de la Croisette', subtitle: 'Cannes', type: 'monument' },
    { id: 'sttropez', label: 'Saint-Tropez', subtitle: 'Place des Lices & Port', type: 'monument' },
  ],
  bordeaux: [
    { id: 'bod', label: 'Aéroport de Bordeaux-Mérignac (BOD)', subtitle: 'Mérignac', type: 'airport' },
    { id: 'bdx-gare', label: 'Gare Bordeaux Saint-Jean', subtitle: 'Bordeaux', type: 'station' },
    { id: 'vignobles', label: 'Route des Châteaux Médoc / Saint-Émilion', subtitle: 'Vignobles', type: 'monument' },
  ],
  suisse: [
    { id: 'gva', label: 'Genève Aéroport (GVA)', subtitle: 'Genève Cointrin', type: 'airport' },
    { id: 'zrh', label: 'Zurich Airport (ZRH)', subtitle: 'Kloten', type: 'airport' },
  ],
  italie: [
    { id: 'mxp', label: 'Milano Malpensa Airport (MXP)', subtitle: 'Milan', type: 'airport' },
    { id: 'lin', label: 'Milano Linate Airport (LIN)', subtitle: 'Milan', type: 'airport' },
  ],
  uae: [
    { id: 'dxb', label: 'Dubai International Airport (DXB)', subtitle: 'Dubai VIP Terminal', type: 'airport' },
    { id: 'dwc', label: 'Al Maktoum International (DWC)', subtitle: 'Dubai South', type: 'airport' },
    { id: 'downtown', label: 'Downtown Dubai / Burj Khalifa', subtitle: 'Dubai', type: 'monument' },
  ],
  usa: [
    { id: 'jfk', label: 'JFK International Airport', subtitle: 'New York', type: 'airport' },
    { id: 'lga', label: 'LaGuardia Airport', subtitle: 'New York', type: 'airport' },
    { id: 'manhattan', label: 'Manhattan', subtitle: 'New York, NY', type: 'monument' },
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
