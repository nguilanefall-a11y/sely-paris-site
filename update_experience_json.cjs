const fs = require('fs');
const path = require('path');

const frPath = path.join(__dirname, 'src/locales/fr.json');
const enPath = path.join(__dirname, 'src/locales/en.json');

const frData = JSON.parse(fs.readFileSync(frPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

frData.page_experience = {
  "title": "L'Art du Voyage",
  "subtitle": "Plus qu'un simple trajet, un moment de grâce hors du temps.",
  "intro": "Dès l'instant où vous prenez place à bord de nos véhicules, le monde extérieur s'apaise. Nous avons conçu <strong>AM Privé</strong> non pas comme un service de transport, mais comme un créateur d'espace et de temps. Un cocon d'élégance où chaque détail est pensé pour éveiller vos sens et vous offrir ce qu'il y a de plus précieux : l'instant présent.",
  "b1_title": "Une Flotte d'Exception",
  "b1_desc": "Voyagez à bord de nos véhicules haut de gamme récents. Du confort absolu de nos vans Mercedes Classe V à l'élégance silencieuse de nos berlines Tesla, chaque véhicule est méticuleusement entretenu pour votre sécurité et votre bien-être.",
  "b2_title": "Chauffeurs d'Élite",
  "b2_desc": "Nos chauffeurs sont bien plus que des conducteurs. Formés à l'excellence, ils se distinguent par leur discrétion absolue, leur présentation irréprochable et leur connaissance parfaite de la région bordelaise.",
  "b3_title": "Service Premium à Bord",
  "b3_desc": "Profitez d'un véritable salon mobile. Wi-Fi haut débit, rafraîchissements, presse du jour, chargeurs pour vos appareils et température personnalisée : chaque détail est pensé pour votre confort absolu.",
  "b4_title": "Conciergerie Mobile",
  "b4_desc": "Vos envies dictent notre service. Besoin d'une bouteille de champagne spécifique, de macarons locaux ou d'une réservation de dernière minute ? Notre équipe anticipe et répond à vos moindres exigences.",
  "cta": "Réserver mon chauffeur"
};

enData.page_experience = {
  "title": "The Art of Travel",
  "subtitle": "More than just a journey, a moment of grace out of time.",
  "intro": "From the moment you step into our vehicles, the outside world fades away. We designed <strong>AM Privé</strong> not as a transport service, but as a creator of space and time. A cocoon of elegance where every detail is tailored to awaken your senses and offer you what is most precious: the present moment.",
  "b1_title": "An Exceptional Fleet",
  "b1_desc": "Travel aboard our latest premium vehicles. From the absolute comfort of our Mercedes V-Class vans to the silent elegance of our Tesla sedans, each vehicle is meticulously maintained for your safety and well-being.",
  "b2_title": "Elite Chauffeurs",
  "b2_desc": "Our chauffeurs are much more than drivers. Trained in excellence, they stand out for their absolute discretion, impeccable presentation, and perfect knowledge of the Bordeaux region.",
  "b3_title": "Premium Onboard Service",
  "b3_desc": "Enjoy a true mobile lounge. High-speed Wi-Fi, refreshments, daily press, chargers for your devices, and personalized temperature: every detail is designed for your absolute comfort.",
  "b4_title": "Mobile Concierge",
  "b4_desc": "Your desires dictate our service. Need a specific bottle of champagne, local macarons, or a last-minute reservation? Our team anticipates and meets your every requirement.",
  "cta": "Book my chauffeur"
};

fs.writeFileSync(frPath, JSON.stringify(frData, null, 2));
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));

console.log('Experience JSON updated.');
