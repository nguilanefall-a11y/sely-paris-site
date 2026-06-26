const fs = require('fs');
const path = require('path');

const frPath = path.join(__dirname, 'src/locales/fr.json');
const enPath = path.join(__dirname, 'src/locales/en.json');

const frData = JSON.parse(fs.readFileSync(frPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

frData.page_voyages = {
  "title": "Nos Expériences",
  "subtitle": "Découvrez nos itinéraires privés dans le Grand Sud-Ouest.",
  "v1_title": "Wine Tour Saint-Émilion & Pomerol",
  "v1_desc": "Découvrez le joyau du Bordelais, classé au patrimoine mondial de l’UNESCO. Visites privées dans les châteaux les plus prestigieux (Château Cheval Blanc, Ausone, Angélus, Pavie, Figeac, Troplong Mondot...). Dégustations d’exception dans l’un des plus beaux villages de France, au cœur d’un terroir unique entre Pomerol et Saint-Émilion.",
  "v2_title": "Médoc",
  "v2_desc": "Entre estuaire et océan, partez à la découverte des plus grands crus du Médoc. Visites privées dans les châteaux iconiques de cette appellation mythique. Un voyage au cœur de l’histoire et de l’excellence viticole bordelaise.",
  "v3_title": "Graves & Sauternes",
  "v3_desc": "Terroir historique et or des sables. Découvrez les grands vins blancs liquoreux de Sauternes et les crus classés de Graves. Une expérience unique dans des châteaux d’exception, berceau de certains des plus grands vins du monde.",
  "v4_title": "Arcachon & le Bassin",
  "v4_desc": "Découvrez le Bassin d’Arcachon, la Dune du Pilat, le Cap Ferret et les parcs ostréicoles. Une journée inoubliable entre océan, nature et gastronomie locale, en van privé avec chauffeur expert.",
  "v5_title": "Mariages & Événements",
  "v5_desc": "Un service haut de gamme pour vos mariages et événements privés. Limousines et vans premium disponibles, avec possibilité d’ajouter champagne, bouquet de roses, décoration et tous les détails qui rendront votre journée inoubliable.",
  "v6_title": "Sur Mesure",
  "v6_desc": "Vous avez une idée précise ? Nous créons pour vous un itinéraire 100% personnalisé selon vos envies, votre rythme et votre budget. Que ce soit pour une journée, plusieurs jours ou une expérience unique, nous sommes à votre écoute.",
  "cta": "Demander un devis personnalisé"
};

enData.page_voyages = {
  "title": "Our Experiences",
  "subtitle": "Discover our private itineraries in the Great Southwest.",
  "v1_title": "Saint-Émilion & Pomerol Wine Tour",
  "v1_desc": "Discover the jewel of the Bordeaux region, a UNESCO World Heritage site. Private visits to the most prestigious châteaux (Château Cheval Blanc, Ausone, Angélus, Pavie, Figeac, Troplong Mondot...). Exceptional tastings in one of the most beautiful villages in France, in the heart of a unique terroir between Pomerol and Saint-Émilion.",
  "v2_title": "Médoc",
  "v2_desc": "Between estuary and ocean, set off to discover the greatest crus of the Médoc. Private visits to the iconic châteaux of this mythical appellation. A journey into the heart of Bordeaux's history and winemaking excellence.",
  "v3_title": "Graves & Sauternes",
  "v3_desc": "Historic terroir and golden sands. Discover the great sweet white wines of Sauternes and the classified growths of Graves. A unique experience in exceptional châteaux, the cradle of some of the world's greatest wines.",
  "v4_title": "Arcachon & the Bay",
  "v4_desc": "Discover the Arcachon Bay, the Dune du Pilat, Cap Ferret, and the oyster farms. An unforgettable day between ocean, nature, and local gastronomy, in a private van with an expert chauffeur.",
  "v5_title": "Weddings & Events",
  "v5_desc": "A premium service for your weddings and private events. Premium limousines and vans available, with the possibility to add champagne, a bouquet of roses, decoration, and all the details that will make your day unforgettable.",
  "v6_title": "Bespoke",
  "v6_desc": "Do you have a specific idea? We create a 100% personalized itinerary for you according to your desires, your pace, and your budget. Whether for a day, several days, or a unique experience, we are at your disposal.",
  "cta": "Request a personalized quote"
};

fs.writeFileSync(frPath, JSON.stringify(frData, null, 2));
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));

console.log('Voyages updated successfully in JSON.');
