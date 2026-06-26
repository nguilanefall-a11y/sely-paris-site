const fs = require('fs');
const path = require('path');

const frPath = path.join(__dirname, 'src/locales/fr.json');
const enPath = path.join(__dirname, 'src/locales/en.json');

const frData = JSON.parse(fs.readFileSync(frPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Update Testimonials in FR
frData.testimonials.t1_quote = "Nous avons réservé AM Privé pour une tournée des châteaux à Margaux et Saint-Émilion. Le niveau de service, de connaissance et de discrétion de notre chauffeur a dépassé toutes nos attentes. Une expérience 5 étoiles de bout en bout.";
frData.testimonials.t1_name = "Michael & Sarah W. (USA)";

frData.testimonials.t2_quote = "Voyageant fréquemment à Bordeaux pour affaires, l'exigence de ponctualité est primordiale pour moi. Le van Classe V est devenu mon bureau mobile. Une connexion Wi-Fi parfaite et un confort de roulement absolu.";
frData.testimonials.t2_name = "James T. (UK)";

frData.testimonials.t3_quote = "Dès notre arrivée à l'aéroport, l'accueil fut d'une grande élégance. Bouteilles d'eau fraîche, lingettes, et un véhicule immaculé. C'est exactement le standard de qualité que l'on attend d'un service de grande remise.";
frData.testimonials.t3_name = "Alexander V. (Germany)";

frData.page_testimonials.t4_quote = "Notre hôtel nous a recommandé ce service pour notre séjour sur le Bassin d'Arcachon. La flexibilité du chauffeur et ses recommandations de restaurants confidentiels ont rendu nos vacances inoubliables.";
frData.page_testimonials.t4_name = "Elena R. (Spain)";

frData.page_testimonials.t5_quote = "Une organisation logistique irréprochable pour la délégation de notre entreprise. Huit véhicules coordonnés à la perfection pendant trois jours. Une sérénité totale pour notre équipe de direction.";
frData.page_testimonials.t5_name = "Hideki S. (Japan)";

frData.page_testimonials.t6_quote = "Le service sur-mesure a pris tout son sens. Nous avions demandé du champagne d'une maison spécifique et un siège auto particulier pour notre fille : tout était préparé avec un soin exceptionnel avant même notre arrivée.";
frData.page_testimonials.t6_name = "Isabella & Marco C. (Italy)";

// Update Testimonials in EN
enData.testimonials.t1_quote = "We booked AM Privé for a châteaux tour in Margaux and Saint-Émilion. The level of service, knowledge, and discretion of our chauffeur exceeded all our expectations. A 5-star experience from start to finish.";
enData.testimonials.t1_name = "Michael & Sarah W. (USA)";

enData.testimonials.t2_quote = "Traveling frequently to Bordeaux for business, punctuality is paramount to me. The V-Class van has become my mobile office. Perfect Wi-Fi connection and absolute ride comfort.";
enData.testimonials.t2_name = "James T. (UK)";

enData.testimonials.t3_quote = "Upon our arrival at the airport, the welcome was of great elegance. Cold water bottles, wipes, and an immaculate vehicle. This is exactly the standard of quality one expects from a premium luxury service.";
enData.testimonials.t3_name = "Alexander V. (Germany)";

enData.page_testimonials.t4_quote = "Our hotel recommended this service for our stay in the Arcachon Bay. The driver's flexibility and his recommendations for confidential restaurants made our vacation unforgettable.";
enData.page_testimonials.t4_name = "Elena R. (Spain)";

enData.page_testimonials.t5_quote = "Flawless logistical organization for our company's delegation. Eight vehicles perfectly coordinated over three days. Total peace of mind for our executive team.";
enData.page_testimonials.t5_name = "Hideki S. (Japan)";

enData.page_testimonials.t6_quote = "The bespoke service truly lived up to its name. We had requested champagne from a specific house and a particular car seat for our daughter: everything was prepared with exceptional care before we even arrived.";
enData.page_testimonials.t6_name = "Isabella & Marco C. (Italy)";

fs.writeFileSync(frPath, JSON.stringify(frData, null, 2));
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));

console.log('Testimonials updated successfully.');
