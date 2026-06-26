const fs = require('fs');
const path = require('path');

const frPath = path.join(__dirname, 'src/locales/fr.json');
const enPath = path.join(__dirname, 'src/locales/en.json');

const frData = JSON.parse(fs.readFileSync(frPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const newPagesKeysFr = {
  "page_experience": {
    "title": "L'Expérience",
    "subtitle": "Plus qu'un simple trajet, un moment de grâce hors du temps.",
    "intro": "Dès l'instant où vous prenez place à bord de nos véhicules, le monde extérieur s'apaise. Nous avons conçu <strong>AM Privé</strong> non pas comme un service de transport, mais comme un créateur d'espace et de temps. Un cocon d'élégance où chaque détail est pensé pour éveiller vos sens et vous offrir ce qu'il y a de plus précieux : l'instant présent.",
    "b1_title": "Sentiment de Liberté",
    "b1_desc": "Laissez-vous porter sans contraintes. Votre temps vous appartient, nous nous occupons de chaque détail logistique pour vous offrir une évasion totale.",
    "b2_title": "Tranquillité d'Esprit",
    "b2_desc": "De la réservation jusqu'à votre retour, notre service garantit une fluidité absolue. Reposez-vous sur une expertise logistique sans faille.",
    "b3_title": "Découverte Authentique",
    "b3_desc": "Accédez à l'inaccessible. Nous ouvrons pour vous les portes des domaines les plus confidentiels pour des rencontres privilégiées.",
    "b4_title": "Souvenirs Inoubliables",
    "b4_desc": "Chaque trajet est pensé pour créer une émotion. Ce n'est pas un simple déplacement, c'est le prélude de vos plus beaux souvenirs.",
    "cta": "Créer mon voyage sur mesure"
  },
  "page_voyages": {
    "title": "Nos Voyages",
    "subtitle": "Quatre manières de redécouvrir l'art du déplacement.",
    "v1_title": "Wine Tours d'Exception",
    "v1_desc": "Découvrez les secrets les mieux gardés du vignoble bordelais. Nous organisons pour vous des visites privées dans les châteaux les plus prestigieux (Grands Crus Classés, domaines confidentiels), incluant des dégustations exclusives et des rencontres avec les maîtres de chai.",
    "v1_inc1": "Chauffeur expert de la région",
    "v1_inc2": "Itinéraire personnalisé",
    "v1_inc3": "Accès privilégié aux domaines",
    "v2_title": "Transferts Premium",
    "v2_desc": "Gare, aéroport, ou trajets d'affaires : optimisez votre temps dans un cadre luxueux. Nos chauffeurs vous accueillent avec courtoisie et assurent vos déplacements avec une ponctualité rigoureuse, vous permettant de vous concentrer sur l'essentiel.",
    "v2_inc1": "Accueil personnalisé",
    "v2_inc2": "Wi-Fi et rafraîchissements",
    "v2_inc3": "Suivi des vols en temps réel",
    "v3_title": "Événements & Galas",
    "v3_desc": "Faites une arrivée remarquée lors de vos soirées de gala, mariages ou événements d'entreprise. Nos vans Classe V offrent l'espace et l'élégance nécessaires pour sublimer vos moments les plus importants.",
    "v3_inc1": "Disponibilité complète",
    "v3_inc2": "Coordination événementielle",
    "v3_inc3": "Service voiturier de luxe",
    "v4_title": "Service Sur Mesure",
    "v4_desc": "Une demande spécifique ? Notre service de conciergerie mobile répond à toutes vos exigences. De la bouteille de champagne au millésime précis, jusqu'aux macarons de la région, nous façonnons l'habitacle selon vos désirs.",
    "v4_inc1": "Attention VIP",
    "v4_inc2": "Conciergerie dédiée",
    "v4_inc3": "Personnalisation totale",
    "cta": "Demander un Devis Personnalisé"
  },
  "page_processus": {
    "title": "Le Processus",
    "subtitle": "De votre première demande jusqu'à votre destination, la fluidité est notre maître-mot.",
    "s1_title": "Votre Demande",
    "s1_desc": "Tout commence par vous. Contactez-nous pour nous faire part de vos envies, de vos dates et de la nature de votre besoin. Nous sommes à votre écoute pour comprendre les moindres détails de vos attentes.",
    "s2_title": "Proposition Personnalisée",
    "s2_desc": "Dans les plus brefs délais, notre équipe vous soumet un itinéraire sur mesure et un devis clair. Pas de formules standardisées : uniquement des propositions ajustées à votre niveau d'exigence.",
    "s3_title": "Le Jour J",
    "s3_desc": "Laissez-vous guider. Votre chauffeur expert vous accueille avec élégance et discrétion. Votre Classe V est parfaitement préparé, climatisé et équipé selon vos préférences. Le voyage parfait peut commencer.",
    "s4_title": "Après Votre Voyage",
    "s4_desc": "Notre relation ne s'arrête pas à destination. Nous nous assurons de votre entière satisfaction. C'est cette attention continue qui fait que nos clients reviennent année après année.",
    "cta": "Démarrer le processus"
  },
  "page_excellence": {
    "title": "L'Excellence AM Privé",
    "subtitle": "L'art de recevoir, en mouvement.",
    "intro": "Ce qui nous rend unique ne se trouve pas uniquement sous le capot de nos vans Classe V, mais dans l'état d'esprit qui anime chaque membre de notre équipe. Chez AM Privé, le luxe véritable réside dans <strong>l'anticipation, le raffinement discret et le savoir-être</strong>.",
    "c1_title": "Discrétion Absolue",
    "c1_desc": "Nous comprenons la valeur de votre sphère privée. Nos chauffeurs font preuve d'une confidentialité totale lors de tous vos déplacements privés et professionnels.",
    "c2_title": "Flexibilité Totale",
    "c2_desc": "Un imprévu ? Un changement de plan de dernière minute ? Notre service s'adapte en temps réel à vos exigences. Vous ne vous adaptez jamais à nous.",
    "c3_title": "Passion des Vignobles",
    "c3_desc": "Ancrés dans la région bordelaise, nous partageons avec vous notre amour du terroir et vous ouvrons les portes de lieux d'exception souvent inaccessibles.",
    "c4_title": "Excellence du Service",
    "c4_desc": "Chaque détail compte. De la tenue irréprochable de notre flotte à l'anticipation de vos besoins, nous visons la perfection à chaque kilomètre.",
    "why_title": "Pourquoi ils reviennent",
    "why_desc": "La plus belle preuve de notre excellence réside dans la fidélité de nos clients. Au fil des années, AM Privé est devenu le partenaire de confiance exclusif de dizaines d'entreprises, d'hôtels prestigieux et de particuliers exigeants qui ne s'en remettent plus qu'à nous pour leurs séjours dans la région.",
    "cta": "Vivre la différence"
  },
  "page_testimonials": {
    "title": "Témoignages",
    "subtitle": "Ceux qui parlent le mieux de notre service sont ceux qui l'ont vécu.",
    "t4_quote": "L'équipe d'AM Privé a pris en charge nos invités pour notre mariage. L'organisation était sans faille et le standing parfaitement au rendez-vous.",
    "t4_name": "Claire & David",
    "t5_quote": "Un service de conciergerie mobile incroyable. Nous avions des demandes spécifiques pour des vins introuvables et tout était prêt à notre arrivée.",
    "t5_name": "Laurent H.",
    "t6_quote": "Le meilleur service de chauffeur que j'ai pu expérimenter en France. La connaissance de la région par le chauffeur a rendu notre séjour mémorable.",
    "t6_name": "Antoine G.",
    "cta": "Voir tous les avis sur Google"
  },
  "page_contact": {
    "title": "Contact",
    "subtitle": "Nous sommes à votre entière disposition pour organiser votre prochain trajet."
  }
};

const newPagesKeysEn = {
  "page_experience": {
    "title": "The Experience",
    "subtitle": "More than just a journey, a moment of grace out of time.",
    "intro": "From the moment you step into our vehicles, the outside world fades away. We designed <strong>AM Privé</strong> not as a transport service, but as a creator of space and time. A cocoon of elegance where every detail is tailored to awaken your senses and offer you what is most precious: the present moment.",
    "b1_title": "Sense of Freedom",
    "b1_desc": "Let yourself be carried away without constraints. Your time is yours, we take care of every logistical detail to offer you a total escape.",
    "b2_title": "Peace of Mind",
    "b2_desc": "From booking to your return, our service guarantees absolute fluidity. Rely on flawless logistical expertise.",
    "b3_title": "Authentic Discovery",
    "b3_desc": "Access the inaccessible. We open the doors of the most confidential estates for privileged encounters.",
    "b4_title": "Unforgettable Memories",
    "b4_desc": "Every journey is designed to create an emotion. It is not just a trip, it is the prelude to your most beautiful memories.",
    "cta": "Create my bespoke journey"
  },
  "page_voyages": {
    "title": "Our Journeys",
    "subtitle": "Four ways to rediscover the art of travel.",
    "v1_title": "Exceptional Wine Tours",
    "v1_desc": "Discover the best-kept secrets of the Bordeaux vineyards. We organize private tours for you in the most prestigious châteaux, including exclusive tastings and meetings with cellar masters.",
    "v1_inc1": "Expert local chauffeur",
    "v1_inc2": "Personalized itinerary",
    "v1_inc3": "Privileged access to estates",
    "v2_title": "Premium Transfers",
    "v2_desc": "Train station, airport, or business trips: optimize your time in a luxurious setting. Our chauffeurs welcome you courteously and ensure your travels with strict punctuality.",
    "v2_inc1": "Personalized welcome",
    "v2_inc2": "On-board Wi-Fi and refreshments",
    "v2_inc3": "Real-time flight tracking",
    "v3_title": "Events & Galas",
    "v3_desc": "Make a grand entrance at your gala evenings, weddings, or corporate events. Our V-Class vans offer the space and elegance needed to sublime your most important moments.",
    "v3_inc1": "Full availability",
    "v3_inc2": "Event coordination",
    "v3_inc3": "Luxury valet service",
    "v4_title": "Bespoke Service",
    "v4_desc": "A specific request? Our mobile concierge service meets all your requirements. From a specific vintage champagne to local macarons, we shape the cabin to your desires.",
    "v4_inc1": "VIP attention",
    "v4_inc2": "Dedicated concierge",
    "v4_inc3": "Total personalization",
    "cta": "Request a Custom Quote"
  },
  "page_processus": {
    "title": "The Process",
    "subtitle": "From your first request to your destination, fluidity is our watchword.",
    "s1_title": "Your Request",
    "s1_desc": "It all starts with you. Contact us to share your desires, dates, and the nature of your needs. We listen to understand every detail of your expectations.",
    "s2_title": "Personalized Proposal",
    "s2_desc": "As soon as possible, our team submits a tailor-made itinerary and a clear quote. No standardized formulas: only proposals adjusted to your level of requirement.",
    "s3_title": "The D-Day",
    "s3_desc": "Let us guide you. Your expert chauffeur welcomes you with elegance and discretion. Your V-Class is perfectly prepared, air-conditioned, and equipped according to your preferences.",
    "s4_title": "After Your Journey",
    "s4_desc": "Our relationship does not end at the destination. We ensure your complete satisfaction. It is this continuous attention that makes our clients return year after year.",
    "cta": "Start the process"
  },
  "page_excellence": {
    "title": "AM Privé Excellence",
    "subtitle": "The art of hosting, in motion.",
    "intro": "What makes us unique is not only found under the hood of our V-Class vans, but in the mindset that drives every member of our team. At AM Privé, true luxury lies in <strong>anticipation, discreet refinement, and soft skills</strong>.",
    "c1_title": "Absolute Discretion",
    "c1_desc": "We understand the value of your private sphere. Our chauffeurs demonstrate total confidentiality during all your private and professional travels.",
    "c2_title": "Total Flexibility",
    "c2_desc": "An unforeseen event? A last-minute change of plans? Our service adapts in real time to your requirements. You never adapt to us.",
    "c3_title": "Passion for Vineyards",
    "c3_desc": "Rooted in the Bordeaux region, we share our love for the terroir with you and open the doors to exceptional places often inaccessible.",
    "c4_title": "Service Excellence",
    "c4_desc": "Every detail matters. From the impeccable attire of our fleet to anticipating your needs, we aim for perfection with every mile.",
    "why_title": "Why they return",
    "why_desc": "The best proof of our excellence lies in the loyalty of our clients. Over the years, AM Privé has become the exclusive trusted partner of dozens of companies, prestigious hotels, and demanding individuals who rely solely on us for their stays in the region.",
    "cta": "Experience the difference"
  },
  "page_testimonials": {
    "title": "Testimonials",
    "subtitle": "Those who speak best of our service are those who have experienced it.",
    "t4_quote": "The AM Privé team took care of our guests for our wedding. The organization was flawless and the standing perfectly met our expectations.",
    "t4_name": "Claire & David",
    "t5_quote": "An incredible mobile concierge service. We had specific requests for hard-to-find wines and everything was ready upon our arrival.",
    "t5_name": "Laurent H.",
    "t6_quote": "The best chauffeur service I have experienced in France. The chauffeur's knowledge of the region made our stay memorable.",
    "t6_name": "Antoine G.",
    "cta": "See all reviews on Google"
  },
  "page_contact": {
    "title": "Contact",
    "subtitle": "We are entirely at your disposal to organize your next journey."
  }
};

const updatedFr = { ...frData, ...newPagesKeysFr };
const updatedEn = { ...enData, ...newPagesKeysEn };

// Also add the new nav items to nav
updatedFr.nav = {
  ...updatedFr.nav,
  "experience": "L'Expérience",
  "voyages": "Nos Voyages",
  "processus": "Le Processus",
  "excellence": "L'Excellence",
  "testimonials": "Témoignages"
};
updatedEn.nav = {
  ...updatedEn.nav,
  "experience": "The Experience",
  "voyages": "Our Journeys",
  "processus": "The Process",
  "excellence": "Excellence",
  "testimonials": "Testimonials"
};

fs.writeFileSync(frPath, JSON.stringify(updatedFr, null, 2));
fs.writeFileSync(enPath, JSON.stringify(updatedEn, null, 2));

console.log("Translations updated successfully.");
