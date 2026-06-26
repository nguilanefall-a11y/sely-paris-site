const fs = require('fs');
const path = require('path');

const frPath = path.join(__dirname, 'src/locales/fr.json');
const enPath = path.join(__dirname, 'src/locales/en.json');

const frData = JSON.parse(fs.readFileSync(frPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Update FR
frData.testimonials.t1_quote = "Nous avons fait appel à AM Privé pour une tournée des vignobles à Margaux et Saint-Émilion. Le professionnalisme de notre chauffeur et la qualité du véhicule ont rendu notre journée parfaite.";
frData.testimonials.t1_name = "Michael & Sarah W.";

frData.testimonials.t2_quote = "Voyageant fréquemment à Bordeaux pour affaires, la ponctualité et le confort sont essentiels pour moi. Le Classe V est exceptionnel, c'est un véritable bureau mobile entre deux rendez-vous.";
frData.testimonials.t2_name = "James T.";

frData.testimonials.t3_quote = "Dès notre arrivée à l'aéroport, l'accueil fut parfait. Le véhicule était immaculé et le trajet jusqu'à notre hôtel s'est déroulé de manière très fluide. Un service haut de gamme que je recommande.";
frData.testimonials.t3_name = "Alexander V.";

frData.page_testimonials.t4_quote = "Notre hôtel nous a recommandé ce service pour notre séjour sur le Bassin d'Arcachon. La flexibilité du chauffeur et ses recommandations de restaurants ont rendu nos vacances inoubliables.";
frData.page_testimonials.t4_name = "Elena R.";

frData.page_testimonials.t5_quote = "Une organisation logistique irréprochable pour les déplacements de notre entreprise. Les véhicules étaient coordonnés à la perfection pendant trois jours. Une véritable tranquillité d'esprit pour notre direction.";
frData.page_testimonials.t5_name = "Hideki S.";

frData.page_testimonials.t6_quote = "Le service sur-mesure a pris tout son sens. Nous voyagions avec notre fille et avions besoin d'aménagements spécifiques : tout était préparé avec un soin exceptionnel avant même notre arrivée.";
frData.page_testimonials.t6_name = "Isabella & Marco C.";

// Update EN
enData.testimonials.t1_quote = "We used AM Privé for a vineyard tour in Margaux and Saint-Émilion. The professionalism of our chauffeur and the quality of the vehicle made our day absolutely perfect.";
enData.testimonials.t1_name = "Michael & Sarah W.";

enData.testimonials.t2_quote = "Traveling frequently to Bordeaux for business, punctuality and comfort are essential for me. The V-Class is exceptional, acting as a true mobile office between meetings.";
enData.testimonials.t2_name = "James T.";

enData.testimonials.t3_quote = "From the moment we arrived at the airport, the welcome was perfect. The vehicle was immaculate and the ride to our hotel was incredibly smooth. A premium service I highly recommend.";
enData.testimonials.t3_name = "Alexander V.";

enData.page_testimonials.t4_quote = "Our hotel recommended this service for our stay in the Arcachon Bay. The chauffeur's flexibility and restaurant recommendations made our vacation truly memorable.";
enData.page_testimonials.t4_name = "Elena R.";

enData.page_testimonials.t5_quote = "Flawless logistical organization for our company's corporate travel. The vehicles were perfectly coordinated over three days. Complete peace of mind for our executive team.";
enData.page_testimonials.t5_name = "Hideki S.";

enData.page_testimonials.t6_quote = "The bespoke service truly lived up to its name. We were traveling with our daughter and required specific arrangements: everything was prepared with exceptional care before we even arrived.";
enData.page_testimonials.t6_name = "Isabella & Marco C.";

fs.writeFileSync(frPath, JSON.stringify(frData, null, 2));
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));

console.log("Reviews updated!");
