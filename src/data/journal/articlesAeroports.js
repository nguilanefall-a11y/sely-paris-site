// ─── ARTICLES DE LA CATÉGORIE : AÉROPORTS & TRANSFERTS ───

export const ARTICLES_AEROPORTS = [
  // ─── SUJET 11 : Combien coûte un transfert entre CDG et Paris ? ───
  {
    id: 11,
    category: 'aeroports',
    heroImage: '/transfert_aeroport_paris.png',
    secondaryImages: ['/airport_transfer_luxury.png', '/sclass_paris_hero.jpg'],
    readingTime: '6 min',
    publishedAt: '2026-03-16',
    slugs: {
      fr: 'prix-transfert-cdg-paris-chauffeur',
      en: 'cdg-paris-chauffeur-transfer-cost',
      es: 'precio-traslado-cdg-paris-chofer',
      ar: 'taklifat-naql-cdg-baris',
    },
    translations: {
      fr: {
        title: 'Combien coûte un transfert entre CDG et Paris avec chauffeur privé ?',
        metaTitle: 'Prix Transfert CDG Paris en Chauffeur Privé | Tarifs 2026',
        metaDescription: 'Tarifs d’un chauffeur privé de CDG à Paris : fourchette indicative 129 € à 179 €, accueil personnalisé, suivi de vol et comparatif taxi.',
        h1: 'Combien coûte un transfert entre CDG et Paris avec chauffeur privé ?',
        heroAlt: 'Chauffeur privé attendant un passager avec une tablette personnalisée à l’aéroport Paris CDG',
        directAnswer: 'Un transfert privé entre l’aéroport Paris Charles-de-Gaulle (CDG) et Paris intramuros coûte généralement entre 129 € et 179 €, selon la catégorie du véhicule sélectionné (Mercedes Classe E, Classe S ou Classe V), l’arrondissement de destination, l’horaire et les conditions de réservation.',
        intro: 'L’aéroport Roissy-Charles-de-Gaulle est situé à environ 25 à 35 kilomètres au nord-est de la capitale. Choisir un chauffeur privé vous garantit un tarif fixe convenu d’avance, sans compteur qui tourne dans les ralentissements de l’autoroute A1.',
        sections: [
          {
            h2: 'Ce que comprend le forfait transfert CDG',
            content: 'Contrairement à une simple course en taxi ou VTC standard, un transfert haut de gamme SELY Privé comprend l’ensemble de ces prestations :',
            bulletPoints: [
              'Suivi en temps réel de votre vol : votre chauffeur ajuste son arrivée en fonction de l’heure réelle d’atterrissage.',
              'Accueil personnalisé Meet & Greet : le chauffeur vous attend dès la sortie des bagages avec une pancarte nominative.',
              '60 minutes d’attente gracieuse incluses après l’atterrissage effectif de l’avion.',
              'Prise en charge complète de vos bagages jusqu’au coffre du véhicule.',
              'Confort absolu à bord : bouteilles d’eau minérale fraîches, chargeurs pour smartphones et connexion Wi-Fi.',
            ],
          },
          {
            h2: 'Comparatif des véhicules pour votre transfert CDG',
            content: 'Selon le nombre de passagers et le volume de vos valises, plusieurs options s’offrent à vous :',
          },
        ],
        comparisonTable: {
          headers: ['Véhicule', 'Capacité Passagers', 'Capacité Bagages', 'Tarif indicatif CDG ⇄ Paris'],
          rows: [
            ['Mercedes Classe E (Berline Affaires)', '1 à 3 personnes', '2 grandes valises + 2 cabines', '129 € à 149 €'],
            ['Mercedes Classe S (Grand Prestige)', '1 à 3 personnes', '2 à 3 grandes valises + 2 cabines', '159 € à 189 €'],
            ['Mercedes Classe V (Van VIP)', '1 à 7 personnes', '7 à 8 grandes valises + bagages à main', '149 € à 179 €'],
            ['Mercedes Maybach (First Class)', '1 à 2 personnes', '3 valises soute', 'Sur demande VIP'],
          ],
        },
        bottomContent: 'Le tarif peut varier légèrement en fonction d’une dépose en grande périphérie ou de demandes particulières de conciergerie.',
        faq: [
          {
            q: 'Mon vol a du retard, vais-je payer un supplément ?',
            a: 'Non. Nous synchronisons nos chauffeurs avec les flux radars de l’aéroport CDG. Si votre vol a 45 minutes de retard, votre chauffeur arrive simplement 45 minutes plus tard, sans surcoût.',
          },
          {
            q: 'Où le chauffeur m’attend-il exactement ?',
            a: 'Dès que vous franchissez les portes automatiques de la zone douanière et de livraison des bagages, votre chauffeur se tient debout face à la sortie avec une tablette affichant votre nom.',
          },
        ],
        cta: {
          title: 'Vous atterrissez prochainement à Paris Charles-de-Gaulle ?',
          subtitle: 'Réservez votre chauffeur privé et commencez votre séjour parisien en toute sérénité.',
          buttonText: 'Réserver mon transfert CDG',
          link: '/paris/reserver?service=transfer',
        },
        relatedSlugs: ['comment-retrouver-chauffeur-cdg', 'prix-chauffeur-prive-paris', 'combien-de-bagages-mercedes-classe-v'],
      },
      en: {
        title: 'How Much Does a Private Chauffeur Transfer Between CDG and Paris Cost?',
        metaTitle: 'CDG to Paris Private Chauffeur Cost | 2026 Rates',
        metaDescription: 'Find out the price of a luxury private chauffeur from Charles de Gaulle Airport (CDG) to Paris: indicative range €129 - €179 with flight tracking and meet & greet.',
        h1: 'How Much Does a Private Chauffeur Transfer Between CDG and Paris Cost?',
        heroAlt: 'Private chauffeur welcoming passengers at Charles de Gaulle airport terminal',
        directAnswer: 'A private chauffeur transfer between Paris Charles de Gaulle Airport (CDG) and central Paris generally costs between €129 and €179, depending on your vehicle choice (Mercedes E-Class, S-Class, or V-Class van), destination district, pickup time, and specific booking requirements.',
        comparisonTable: {
          headers: ['Vehicle', 'Passenger Capacity', 'Luggage Capacity', 'Indicative CDG ⇄ Paris Fare'],
          rows: [
            ['Mercedes E-Class (Executive)', '1 - 3 guests', '2 large suitcases + 2 cabin bags', '€129 - €149'],
            ['Mercedes S-Class (Palace Saloon)', '1 - 3 guests', '2 - 3 large suitcases + 2 cabin bags', '€159 - €189'],
            ['Mercedes V-Class (VIP Van)', '1 - 7 guests', '7 - 8 large suitcases + hand luggage', '€149 - €179'],
          ],
        },
        faq: [
          {
            q: 'What happens if my international flight is delayed?',
            a: 'Nothing to worry about. We track your flight in real time and automatically adjust your pickup time with zero penalty.',
          },
        ],
        cta: {
          title: 'Landing soon at Paris Charles de Gaulle?',
          subtitle: 'Secure your executive airport transfer today with instant confirmation.',
          buttonText: 'Book my CDG transfer',
          link: '/paris/reserver?service=transfer',
        },
        relatedSlugs: ['how-to-meet-chauffeur-cdg', 'private-chauffeur-paris-cost', 'v-class-luggage-capacity'],
      },
      es: {
        title: '¿Cuánto cuesta un traslado entre CDG y París con chófer privado?',
        metaTitle: 'Precio Traslado CDG a París con Chófer Privado',
        metaDescription: 'Precios de traslado privado desde el aeropuerto Charles de Gaulle (CDG) a París: entre 129 € y 179 €, bienvenida personalizada y seguimiento de vuelo.',
        h1: '¿Cuánto cuesta un traslado entre CDG y París con chófer privado?',
        heroAlt: 'Chófer privado esperando con cartel nominativo en el aeropuerto CDG de París',
        directAnswer: 'Un traslado privado entre el aeropuerto París Charles-de-Gaulle (CDG) y el centro de París cuesta habitualmente entre 129 € y 179 €, en función del vehículo seleccionado (Mercedes Clase E, Clase S o Clase V), el punto de destino y el horario.',
        comparisonTable: {
          headers: ['Vehículo', 'Pasajeros', 'Equipaje', 'Precio orientativo'],
          rows: [
            ['Mercedes Clase E', '1 a 3 pers.', '2 maletas grandes + 2 de mano', '129 € a 149 €'],
            ['Mercedes Clase S', '1 a 3 pers.', '2-3 maletas grandes', '159 € a 189 €'],
            ['Mercedes Clase V', '1 a 7 pers.', '7-8 maletas grandes', '149 € a 179 €'],
          ],
        },
        cta: {
          title: '¿Llega pronto a París Charles de Gaulle?',
          subtitle: 'Reserve su traslado privado en unos clics.',
          buttonText: 'Reservar traslado CDG',
          link: '/paris/reserver?service=transfer',
        },
        relatedSlugs: ['como-encontrar-chofer-cdg', 'precio-chofer-privado-paris'],
      },
      ar: {
        title: 'كم تكلفة النقل الخاص بين مطار شارل ديغول (CDG) وباريس؟',
        metaTitle: 'تكلفة نقل مطار شارل ديغول باريس مع سائق خاص | 2026',
        metaDescription: 'أسعار النقل الخاص الفاخر من مطار شارل ديغول إلى باريس: بين 129 € و 179 € مع استقبال رسمي بالاسم وتتبع الرحلة.',
        h1: 'كم تكلفة النقل الخاص بين مطار شارل ديغول (CDG) وباريس؟',
        heroAlt: 'سائق خاص يستقبل المسافرين في صالة مطار شارل ديغول بباريس',
        directAnswer: 'تكلف رحلة النقل الخاص بين مطار باريس شارل ديغول (CDG) ووسط العاصمة باريس عموماً بين 129 € و 179 €، حسب فئة المركبة المختارة (مرسيدس الفئة E أو الفئة S الفاخرة أو فان الفئة V العائلي)، والوجهة الدقيقة ووقت الحجز.',
        comparisonTable: {
          headers: ['فئة السيارة', 'سعة الركاب', 'سعة الحقائب', 'السعر التقريبي CDG ⇄ باريس'],
          rows: [
            ['مرسيدس الفئة E (درجة أعمال)', '1 - 3 أشخاص', '2 حقيبة كبيرة + 2 حقيبة يد', '129 € إلى 149 €'],
            ['مرسيدس الفئة S (فخامة القصور)', '1 - 3 أشخاص', '2 - 3 حقائب كبيرة', '159 € إلى 189 €'],
            ['مرسيدس الفئة V (فان VIP عائلي)', '1 - 7 أشخاص', '7 - 8 حقائب كبيرة + حقائب يد', '149 € إلى 179 €'],
          ],
        },
        cta: {
          title: 'هل تسافر قريباً إلى باريس عبر مطار شارل ديغول؟',
          subtitle: 'احجز استقبالك الفاخر الآن بكل يسر وسهولة.',
          buttonText: 'حجز النقل من مطار CDG',
          link: '/paris/reserver?service=transfer',
        },
        relatedSlugs: ['kaif-taltaqi-bi-saeq-cdg', 'taklifat-saeq-khas-baris'],
      },
    },
  },

  // ─── SUJET 13 : Comment retrouver son chauffeur à l'aéroport CDG ? ───
  {
    id: 13,
    category: 'aeroports',
    heroImage: '/processus_hero.png',
    secondaryImages: ['/chauffeur.png', '/transfert_airport_van.png'],
    readingTime: '5 min',
    publishedAt: '2026-03-17',
    slugs: {
      fr: 'comment-retrouver-chauffeur-cdg',
      en: 'how-to-meet-chauffeur-cdg',
      es: 'como-encontrar-chofer-cdg',
      ar: 'kaif-taltaqi-bi-saeq-cdg',
    },
    translations: {
      fr: {
        title: 'Comment retrouver son chauffeur à l’aéroport CDG ? Guide Pratique',
        metaTitle: 'Comment retrouver son chauffeur à l’aéroport CDG ? Guide Pratique',
        metaDescription: 'Guide pas à pas pour retrouver votre chauffeur privé à l’aéroport Paris CDG : sortie bagages, pancarte nominative, terminaux 1, 2 et 3.',
        h1: 'Comment retrouver son chauffeur à l’aéroport Paris-CDG ?',
        heroAlt: 'Chauffeur privé élégant accueillant un voyageur avec une tablette nominative au terminal CDG',
        directAnswer: 'À l’aéroport Paris-CDG, votre chauffeur privé vous attend directement à l’intérieur du terminal, immédiatement après la sortie de la zone sécurisée de retrait des bagages (douane), avec une pancarte digitale à votre nom. Vous recevez également un SMS dès l’atterrissage contenant son numéro direct et la plaque du véhicule.',
        intro: 'Avec ses multiples terminaux (Terminal 1, 2A, 2B, 2C, 2D, 2E, 2F, 2G et Terminal 3), l’aéroport Charles-de-Gaulle peut sembler intimidant après un long vol. Voici le déroulement exact pour une prise en charge fluide sans aucun stress.',
        stepsWorkflow: [
          {
            stepNumber: '1',
            title: 'Atterrissage & Notification SMS',
            description: 'Dès que l’avion touche la piste, votre chauffeur vous envoie un message de bienvenue avec son contact téléphonique direct et la confirmation de son positionnement.',
          },
          {
            stepNumber: '2',
            title: 'Passage des contrôles et bagages',
            description: 'Vous franchissez le contrôle des passeports et récupérez vos valises sur le tapis roulant. Vous n’avez pas à vous presser : 60 minutes d’attente gracieuse sont incluses.',
          },
          {
            stepNumber: '3',
            title: 'Sortie en porte d’arrivée (Pancarte)',
            description: 'En franchissant les portes vitrées coulissantes de la zone douanière, votre chauffeur se tient face à vous parmi les arrivants avec une tablette lumineuse affichant votre nom ou le logo de votre société.',
          },
          {
            stepNumber: '4',
            title: 'Escorte et prise en charge des valises',
            description: 'Votre chauffeur prend en charge l’ensemble de vos bagages et vous escorte vers le véhicule stationné au parking réservé aux professionnels.',
          },
        ],
        faq: [
          {
            q: 'Que faire si je ne trouve pas mon chauffeur ?',
            a: 'Appelez ou envoyez un message directement au numéro reçu par SMS. Le chauffeur vous indiquera son repère exact (ex: face à la sortie porte 14).',
          },
        ],
        cta: {
          title: 'Préparez votre arrivée sereine à Paris-CDG',
          subtitle: 'Votre chauffeur privé vous attendra en porte avec le plus haut niveau d’attention.',
          buttonText: 'Organiser mon accueil CDG',
          link: '/paris/reserver?service=transfer',
        },
        relatedSlugs: ['prix-transfert-cdg-paris-chauffeur', 'prix-chauffeur-prive-paris', 'difference-vtc-chauffeur-prive'],
      },
      en: {
        title: 'How to Meet Your Private Chauffeur at Paris CDG Airport? Step-by-Step Guide',
        metaTitle: 'How to Meet Your Chauffeur at CDG Airport | Step-by-Step Guide',
        metaDescription: 'Step-by-step guide to finding your private chauffeur at Paris CDG Airport: terminal meet & greet, name board, luggage pickup, and clear directions.',
        h1: 'How to Meet Your Private Chauffeur at Paris CDG Airport',
        heroAlt: 'Chauffeur in dark suit holding an iPad with passenger name at Paris CDG terminal arrivals',
        directAnswer: 'At Paris-CDG Airport, your private chauffeur greets you inside the terminal right after you exit the baggage claim customs doors, holding a digital name board displaying your name. You also receive an SMS upon touchdown with your chauffeur’s direct phone number and vehicle details.',
        stepsWorkflow: [
          { stepNumber: '1', title: 'Touchdown & Welcome SMS', description: 'Your chauffeur sends a greeting text confirming presence.' },
          { stepNumber: '2', title: 'Passport Control & Bags', description: '60 minutes of complimentary waiting time starts from touchdown.' },
          { stepNumber: '3', title: 'Arrivals Gate Meet & Greet', description: 'Your chauffeur greets you right outside customs with an iPad name board.' },
          { stepNumber: '4', title: 'Luggage Escort to Vehicle', description: 'Full baggage assistance to the private executive parking bay.' },
        ],
        cta: {
          title: 'Planning your flight into Paris Charles de Gaulle?',
          subtitle: 'Enjoy flawless Palace-standard airport pickup from the second you land.',
          buttonText: 'Book my Meet & Greet',
          link: '/paris/reserver?service=transfer',
        },
        relatedSlugs: ['cdg-paris-chauffeur-transfer-cost', 'private-chauffeur-paris-cost'],
      },
      es: {
        title: '¿Cómo encontrar a su chófer en el aeropuerto París CDG? Guía paso a paso',
        metaTitle: 'Cómo encontrar a su chófer en el aeropuerto CDG París',
        metaDescription: 'Guía práctica para reunirse con su chófer privado en el aeropuerto Charles de Gaulle: salida de aduanas, cartel con nombre y terminales.',
        h1: '¿Cómo encontrar a su chófer en el aeropuerto París-CDG?',
        heroAlt: 'Chófer elegante esperando con cartel nominativo en la terminal de llegadas de París CDG',
        directAnswer: 'En el aeropuerto París-CDG, su chófer privado le espera en el interior de la terminal, justo al cruzar la puerta de salida de recogida de equipajes (aduana), sosteniendo un cartel digital con su nombre. Además, recibirá un SMS al aterrizar con su número de teléfono directo.',
        cta: {
          title: 'Viaje a París con total tranquilidad',
          subtitle: 'Su chófer le espera nada más aterrizar.',
          buttonText: 'Organizar mi llegada',
          link: '/paris/reserver?service=transfer',
        },
        relatedSlugs: ['precio-traslado-cdg-paris-chofer', 'precio-chofer-privado-paris'],
      },
      ar: {
        title: 'كيف تلتقي بسائقك الخاص في مطار باريس شارل ديغول (CDG)؟ دليل الخطوات',
        metaTitle: 'كيف تلتقي بسائقك في مطار شارل ديغول باريس | دليل عملي',
        metaDescription: 'دليل عملي خطوة بخطوة للالتقاء بسائقك الخاص في مطار شارل ديغول بباريس: صالة الوصول، اللوحة الاسمية، وصالات 1 و 2 و 3.',
        h1: 'كيف تلتقي بسائقك الخاص في مطار باريس شارل ديغول؟',
        heroAlt: 'سائق خاص يحمل لوحة رقمية باسم المسافر في مطار شارل ديغول بباريس',
        directAnswer: 'في مطار باريس شارل ديغول، ينتظرك سائقك الخاص داخل مبنى المطار مباشرة فور خروجك من بوابات الجمارك بعد استلام الحقائب، حاملاً لوحة رقمية واضحة تحمل اسمك الكريم. كما ستصلك رسالة نصية قصيرة فور هبوط الطائرة تحتوي على رقم هاتفه المباشر ورقم لوحة السيارة.',
        cta: {
          title: 'هل تخطط لزيارة باريس قريباً؟',
          subtitle: 'اجعل لحظة وصولك للمطار بداية لتجربة فاخرة لا تُنسى.',
          buttonText: 'حجز استقبال المطار الآن',
          link: '/paris/reserver?service=transfer',
        },
        relatedSlugs: ['taklifat-naql-cdg-baris', 'taklifat-saeq-khas-baris'],
      },
    },
  },
];
