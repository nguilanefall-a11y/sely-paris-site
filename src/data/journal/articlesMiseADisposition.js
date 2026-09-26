// ─── ARTICLES DE LA CATÉGORIE : MISE À DISPOSITION ───

export const ARTICLES_MISE_A_DISPOSITION = [
  // ─── SUJET 7 : Combien coûte une mise à disposition avec chauffeur à Paris ? ───
  {
    id: 7,
    category: 'mise-a-disposition',
    heroImage: '/london_hourly_bg.jpg',
    secondaryImages: ['/sclass_paris.png', '/vclass-paris-luxury.jpg'],
    readingTime: '6 min',
    publishedAt: '2026-03-26',
    slugs: {
      fr: 'prix-mise-a-disposition-chauffeur-paris',
      en: 'hourly-chauffeur-paris-cost',
      es: 'precio-chofer-por-horas-paris',
      ar: 'taklifat-saeq-bil-saa-baris',
    },
    translations: {
      fr: {
        title: 'Combien coûte une mise à disposition avec chauffeur à Paris ? Forfaits 2026',
        metaTitle: 'Prix d’une Mise à Disposition avec Chauffeur à Paris | Tarifs Forfaits',
        metaDescription: 'Tarifs d’une mise à disposition horaire avec chauffeur privé à Paris : forfaits 3h, demi-journée (4h) et journée complète (8h). Véhicules Mercedes Classe E, S et V.',
        h1: 'Combien coûte une mise à disposition avec chauffeur à Paris ?',
        heroAlt: 'Chauffeur privé attendant son passager devant un palace parisien lors d’une mise à disposition',
        directAnswer: 'À Paris, une mise à disposition horaire avec chauffeur privé coûte généralement entre 90 € et 130 € par heure pour une berline affaires (Mercedes Classe E) ou un van VIP (Mercedes Classe V), et entre 140 € et 250 € par heure pour une berline de grand luxe (Mercedes Classe S ou Maybach). La plupart des Maisons de prestige appliquent un minimum de réservation de 3 ou 4 heures consécutives, incluant le carburant, les assurances professionnelles et un forfait kilométrique urbain généreux.',
        intro: 'La mise à disposition (aussi appelée « chauffeur à l’heure » ou « chauffeur à la journée ») est la formule privilégiée des dirigeants, des familles et des délégations souhaitant une liberté de mouvement totale sans contrainte de commande répétée.',
        sections: [
          {
            h2: 'Les forfaits types constatés à Paris',
            content: 'Découvrez les fourchettes tarifaires courantes pour une mise à disposition d’excellence :',
          },
        ],
        comparisonTable: {
          headers: ['Formule', 'Durée & Kilométrage', 'Mercedes Classe E / V', 'Mercedes Classe S / Maybach'],
          rows: [
            ['Forfait 3 Heures (Minimum)', '3 heures · 60 km inclus', '270 € à 360 €', '420 € à 650 €'],
            ['Demi-Journée (4 Heures)', '4 heures · 80 km inclus', '360 € à 480 €', '560 € à 850 €'],
            ['Journée Complète (8 Heures)', '8 heures · 150 km inclus', '720 € à 960 €', '1 120 € à 1 800 €'],
            ['Heure supplémentaire', 'Au-delà du forfait', '90 € à 120 € / h', '140 € à 220 € / h'],
          ],
        },
        sections2: [
          {
            h2: 'Ce que comprend le forfait horaire SELY Privé',
            content: 'Nos forfaits de mise à disposition incluent tous les frais opérationnels :',
            bulletPoints: [
              'Chauffeur privé bilingue dédié exclusivement à votre planning tout au long de la durée.',
              'Kilométrage généreux adapté aux déplacements dans Paris intramuros et la petite couronne.',
              'Carburant et assurance responsabilité civile illimitée pour les passagers transportés.',
              'Attente du chauffeur sur place ou à proximité immédiate à chacun de vos rendez-vous.',
              'Rafraîchissements, chargeurs de smartphones et connexion Wi-Fi haut débit à bord.',
            ],
          },
        ],
        faq: [
          {
            q: 'Les péages et parkings sont-ils inclus ?',
            a: 'Les parkings payants demandés par le client lors d’attentes spécifiques (gares, salons ou événements) ou les péages hors Île-de-France peuvent être refacturés au réel sur justificatif.',
          },
          {
            q: 'Peut-on prolonger la mise à disposition en cours de journée ?',
            a: 'Absolument. Si vos réunions ou vos dîners se prolongent, prévenez simplement votre chauffeur. Les heures supplémentaires sont comptabilisées en toute transparence.',
          },
        ],
        cta: {
          title: 'Besoin d’un chauffeur dédié pour plusieurs heures à Paris ?',
          subtitle: 'Configurez votre forfait personnalisé et recevez votre devis en direct.',
          buttonText: 'Réserver une mise à disposition',
          link: '/paris/reserver?service=hourly',
        },
        relatedSlugs: ['comment-fonctionne-mise-a-disposition-chauffeur', 'reserver-chauffeur-prive-toute-une-journee-paris'],
      },
      en: {
        title: 'How Much Does an Hourly Chauffeur Cost in Paris? 2026 Pricing',
        metaTitle: 'Hourly Chauffeur Cost in Paris | Rates for Daily Hire',
        metaDescription: 'Discover the price of hourly and daily private chauffeur hire in Paris: 3-hour, half-day (4h), and full-day (8h) packages for Mercedes E, S, and V-Class.',
        h1: 'How Much Does an Hourly Chauffeur Cost in Paris?',
        heroAlt: 'Chauffeur waiting by luxury car during an hourly disposal in Paris',
        directAnswer: 'In Paris, hourly private chauffeur hire typically ranges between €90 and €130 per hour for an executive saloon (Mercedes E-Class) or luxury van (Mercedes V-Class), and between €140 and €250 per hour for an ultra-luxury palace limousine (Mercedes S-Class or Maybach). Luxury houses generally require a 3 or 4-hour minimum charter, including fuel, comprehensive commercial insurance, and generous urban mileage.',
        comparisonTable: {
          headers: ['Package', 'Duration & Mileage', 'Mercedes E / V-Class', 'Mercedes S-Class / Maybach'],
          rows: [
            ['3-Hour Charter (Minimum)', '3 hours · 60 km included', '€270 to €360', '€420 to €650'],
            ['Half-Day (4 Hours)', '4 hours · 80 km included', '€360 to €480', '€560 to €850'],
            ['Full Day (8 Hours)', '8 hours · 150 km included', '€720 to €960', '€1,120 to €1,800'],
            ['Overtime Hour', 'Per additional hour', '€90 to €120 / hr', '€140 to €220 / hr'],
          ],
        },
        faq: [
          {
            q: 'Can I extend my hourly booking on the go?',
            a: 'Yes, simply inform your chauffeur if your dinner or business meetings run over schedule. Extra hours are billed transparently.',
          },
        ],
        cta: {
          title: 'Book a dedicated chauffeur by the hour in Paris',
          subtitle: 'Complete flexibility with dedicated Mercedes vehicles.',
          buttonText: 'Book hourly charter',
          link: '/paris/reserver?service=hourly',
        },
        relatedSlugs: ['hourly-chauffeur-paris-cost', 'book-private-chauffeur-full-day-paris'],
      },
      es: {
        title: '¿Cuánto cuesta un chófer por horas en París? Tarifas 2026',
        metaTitle: 'Precio de un Chófer por Horas en París | Tarifas por Día',
        metaDescription: 'Tarifas de alquiler de chófer privado por horas en París: paquetes de media jornada (4h) y jornada completa (8h) en Mercedes Clase E, S y V.',
        h1: '¿Cuánto cuesta un chófer por horas en París?',
        heroAlt: 'Chófer privado esperando durante un servicio por horas en París',
        directAnswer: 'En París, contratar un chófer privado por horas cuesta entre 90 € y 130 € por hora en Clase E o Clase V, y entre 140 € y 250 € por hora en Clase S o Maybach. Los servicios suelen contratarse con un mínimo de 3 o 4 horas con kilometraje urbano, combustible y seguro incluidos.',
        comparisonTable: {
          headers: ['Paquete', 'Duración', 'Mercedes Clase E / V', 'Mercedes Clase S / Maybach'],
          rows: [
            ['Media Jornada (4h)', '4 horas', '360 € a 480 €', '560 € a 850 €'],
            ['Jornada Completa (8h)', '8 horas', '720 € a 960 €', '1.120 € a 1.800 €'],
          ],
        },
        cta: {
          title: 'Contrate un chófer privado por horas en París',
          subtitle: 'Máxima flexibilidad para sus traslados y reuniones.',
          buttonText: 'Reservar por horas',
          link: '/paris/reserver?service=hourly',
        },
        relatedSlugs: ['precio-chofer-por-horas-paris', 'como-funciona-chofer-por-horas-paris'],
      },
      ar: {
        title: 'كم تكلفة سائق خاص بالساعة في باريس؟ باقات وأسعار 2026',
        metaTitle: 'تكلفة حجز سائق خاص بالساعة في باريس | باقات يومية',
        metaDescription: 'أسعار حجز سائق خاص بالساعة في باريس: باقات نصف يوم (4 ساعات) ويوم كامل (8 ساعات) مع سيارات مرسيدس الفئة E و S و V.',
        h1: 'كم تكلفة حجز سائق خاص بالساعة في باريس؟',
        heroAlt: 'سائق خاص ينتظر ضيفه خلال خدمة حجز بالساعة في باريس',
        directAnswer: 'في باريس، تتراوح تكلفة حجز سائق خاص بالساعة (Mise à disposition) عادةً بين 90 € و 130 € للساعة لسيارات مرسيدس الفئة E أو فان الفئة V، وبين 140 € و 250 € للساعة لسيارات مرسيدس الفئة S الملكية أو مايباخ. وتشترط معظم دور النقل الفاخر حداً أدنى يبدأ من 3 أو 4 ساعات متتالية شاملة الوقود والتأمين الشامل وكيلومترات مجانية كافية.',
        comparisonTable: {
          headers: ['الباقة', 'المدة والكيلومترات', 'مرسيدس E أو الفئة V', 'مرسيدس الفئة S أو مايباخ'],
          rows: [
            ['نصف يوم (4 ساعات)', '4 ساعات · 80 كم مشمول', '360 € إلى 480 €', '560 € إلى 850 €'],
            ['يوم كامل (8 ساعات)', '8 ساعات · 150 كم مشمول', '720 € إلى 960 €', '1,120 € إلى 1,800 €'],
          ],
        },
        cta: {
          title: 'احجز سائقك المكرس بالساعة في باريس',
          subtitle: 'مرونة تامة لرحلات التسوق والاجتماعات.',
          buttonText: 'احجز بالساعة الآن',
          link: '/paris/reserver?service=hourly',
        },
        relatedSlugs: ['taklifat-saeq-bil-saa-baris', 'kaif-yaamal-saeq-bil-saa-baris'],
      },
    },
  },

  // ─── SUJET 8 : Comment fonctionne une mise à disposition avec chauffeur ? ───
  {
    id: 8,
    category: 'mise-a-disposition',
    heroImage: '/london_about.jpg',
    secondaryImages: ['/experience_concierge.png', '/sclass-amg-int.jpg'],
    readingTime: '5 min',
    publishedAt: '2026-03-27',
    slugs: {
      fr: 'comment-fonctionne-mise-a-disposition-chauffeur',
      en: 'how-hourly-chauffeur-service-works',
      es: 'como-funciona-chofer-por-horas-paris',
      ar: 'kaif-yaamal-saeq-bil-saa-baris',
    },
    translations: {
      fr: {
        title: 'Comment fonctionne une mise à disposition avec chauffeur privé à Paris ?',
        metaTitle: 'Comment fonctionne une mise à disposition avec chauffeur ?',
        metaDescription: 'Guide pratique du fonctionnement d’une mise à disposition : liberté d’arrêts, chauffeur en attente sur place, garde de vos affaires et flexibilité.',
        h1: 'Comment fonctionne une mise à disposition avec chauffeur ?',
        heroAlt: 'Chauffeur privé en costume attendant patiemment son passager à Paris',
        directAnswer: 'Lors d’une mise à disposition, le véhicule et le chauffeur vous sont exclusivement réservés pour un bloc d’heures défini (ex: 4h, 8h ou journée entière). Contrairement à un transfert simple qui s’achève dès l’arrivée, le chauffeur reste en veille permanente à proximité immédiate de chacun de vos rendez-vous, garde vos effets personnels et sacs de shopping en sécurité dans le coffre, et s’adapte instantanément à tout changement d’itinéraire sur simple appel ou message.',
        intro: 'C’est la formule reine pour les journées denses mêlant rendez-vous d’affaires, shopping et déjeuners dans des arrondissements différents.',
        stepsWorkflow: [
          {
            stepNumber: '1',
            title: 'Prise en charge à votre adresse',
            description: 'Votre chauffeur se présente 15 minutes en avance au lieu convenu (votre hôtel, résidence privée ou bureau).',
          },
          {
            stepNumber: '2',
            title: 'Arrêts multiples à votre convenance',
            description: 'Enchaînez vos rendez-vous, boutiques de luxe ou restaurants. Vous indiquez vos étapes au fur et à mesure sans recalcul de commande.',
          },
          {
            stepNumber: '3',
            title: 'Attente sécurisée et garde de vos effets',
            description: 'Laissez vos manteaux, ordinateurs et sacs de shopping dans le véhicule verrouillé et climatisé pendant que vous êtes en rendez-vous.',
          },
          {
            stepNumber: '4',
            title: 'Reprise immédiate sur simple message',
            description: 'Lorsque vous êtes prêt à repartir, un simple SMS ou appel WhatsApp suffit pour que votre chauffeur se présente devant la porte.',
          },
        ],
        faq: [
          {
            q: 'Puis-je changer d’itinéraire en cours de route ?',
            a: 'Oui, c’est le principe même de la mise à disposition : vous pouvez modifier vos destinations, ajouter des arrêts imprévus ou décider d’un détour sans aucune contrainte.',
          },
        ],
        cta: {
          title: 'Profitez d’une liberté de mouvement absolue à Paris',
          subtitle: 'Un chauffeur dédié à vos côtés pour toute la durée de votre choix.',
          buttonText: 'Organiser ma mise à disposition',
          link: '/paris/reserver?service=hourly',
        },
        relatedSlugs: ['prix-mise-a-disposition-chauffeur-paris', 'reserver-chauffeur-prive-toute-une-journee-paris'],
      },
      en: {
        title: 'How Does an Hourly Chauffeur Service Work in Paris?',
        metaTitle: 'How Hourly Chauffeur Hire Works in Paris | Step-by-Step',
        metaDescription: 'Understand how hourly chauffeur hire works in Paris: dedicated standby driver, unlimited stops, secure baggage storage, and seamless on-demand mobility.',
        h1: 'How Does an Hourly Chauffeur Service Work?',
        heroAlt: 'Dedicated chauffeur standing by executive vehicle in Paris',
        directAnswer: 'With an hourly chauffeur service (mise à disposition), both the vehicle and driver are exclusively dedicated to you for a booked time block (e.g., 4h, 8h, or all day). Unlike a one-way transfer, your chauffeur remains parked nearby on standby at every stop, safeguards your shopping and personal items inside the vehicle, and adjusts instantly to spontaneous route adjustments upon your command.',
        stepsWorkflow: [
          { stepNumber: '1', title: 'Pickup at Your Location', description: 'Your chauffeur arrives 15 minutes early at your hotel or residence.' },
          { stepNumber: '2', title: 'Unlimited Flexible Stops', description: 'Travel between boutiques, meetings, and restaurants at your own pace.' },
          { stepNumber: '3', title: 'Secure Onboard Storage', description: 'Leave your coats, laptops, and shopping bags safely inside the locked cabin.' },
          { stepNumber: '4', title: 'Instant Curbside Departure', description: 'One quick text or WhatsApp message brings your car directly to the entrance.' },
        ],
        cta: {
          title: 'Experience ultimate Parisian travel flexibility',
          subtitle: 'Your personal chauffeur standing by throughout the day.',
          buttonText: 'Book hourly chauffeur',
          link: '/paris/reserver?service=hourly',
        },
        relatedSlugs: ['hourly-chauffeur-paris-cost', 'book-private-chauffeur-full-day-paris'],
      },
      es: {
        title: '¿Cómo funciona un servicio de chófer por horas en París?',
        metaTitle: 'Cómo Funciona un Chófer por Horas en París | Guía',
        metaDescription: 'Funcionamiento del servicio de chófer a disposición por horas: paradas ilimitadas, espera en el lugar, custodia de compras y máxima flexibilidad.',
        h1: '¿Cómo funciona un servicio de chófer por horas?',
        heroAlt: 'Chófer privado de prestigio esperando a su cliente en París',
        directAnswer: 'El servicio de chófer por horas le asigna un vehículo y un chófer en exclusiva durante el bloque de tiempo contratado: el conductor le espera cerca en cada una de sus paradas, custodia sus compras de lujo y equipaje en el coche, y se adapta al instante a cualquier cambio de planes.',
        cta: {
          title: 'Muévase por París con total libertad',
          subtitle: 'Un chófer privado dedicado a su agenda.',
          buttonText: 'Reservar servicio por horas',
          link: '/paris/reserver?service=hourly',
        },
        relatedSlugs: ['precio-chofer-por-horas-paris', 'como-reservar-chofer-privado-paris'],
      },
      ar: {
        title: 'كيف تعمل خدمة السائق الخاص بالساعة في باريس؟',
        metaTitle: 'كيف تعمل خدمة السائق تحت الطلب بالساعة في باريس؟',
        metaDescription: 'دليل عملي لخدمة السائق الخاص بالساعة في باريس: توقفات غير محدودة، انتظار مستمر أمام المكان، حفظ المقتنيات والمشتريات بأمان.',
        h1: 'كيف تعمل خدمة السائق الخاص بالساعة في باريس؟',
        heroAlt: 'سائق خاص ينتظر أمام متجر فاخر في باريس',
        directAnswer: 'في خدمة السائق الخاص بالساعة (Mise à disposition)، يتم تخصيص السيارة والسائق بالكامل لخدمتكم لفترة زمنية محددة (مثل 4 ساعات أو 8 ساعات أو طوال اليوم): يبقى السائق بانتظاركم في الخارج بالقرب من كل موعد، ويحفظ حقائبكم ومشترياتكم الثمينة بأمان تام داخل السيارة، وينطلق فورياً إلى أي وجهة جديدة بمجرد خروجكم.',
        cta: {
          title: 'تمتع بحرية تنقل مطلقة في قلب باريس',
          subtitle: 'سائقك الخاص بانتظارك طوال اليوم أينما ذهبت.',
          buttonText: 'احجز بالساعة الآن',
          link: '/paris/reserver?service=hourly',
        },
        relatedSlugs: ['taklifat-saeq-bil-saa-baris', 'kaif-tahjiz-saeq-khas-baris'],
      },
    },
  },

  // ─── SUJET 9 : Peut-on réserver un chauffeur privé pour toute une journée à Paris ? ───
  {
    id: 9,
    category: 'mise-a-disposition',
    heroImage: '/voyages_hero.png',
    secondaryImages: ['/champagne_vineyard.png', '/versailles_chateau.png'],
    readingTime: '6 min',
    publishedAt: '2026-03-28',
    slugs: {
      fr: 'reserver-chauffeur-prive-toute-une-journee-paris',
      en: 'book-private-chauffeur-full-day-paris',
      es: 'reservar-chofer-privado-todo-el-dia-paris',
      ar: 'hajz-saeq-khas-yawm-kamel-baris',
    },
    translations: {
      fr: {
        title: 'Peut-on réserver un chauffeur privé pour toute une journée à Paris ?',
        metaTitle: 'Réserver un Chauffeur Privé pour Toute une Journée à Paris',
        metaDescription: 'Organisation d’une journée complète avec chauffeur privé à Paris : déroulement type, réunions d’affaires, shopping, dîners et escapades à Versailles.',
        h1: 'Peut-on réserver un chauffeur privé pour toute une journée à Paris ?',
        heroAlt: 'Mercedes berline de prestige traversant la place de la Concorde à Paris lors d’une journée privée',
        directAnswer: 'Oui, absolument. Réserver un chauffeur privé pour toute une journée (généralement sur un forfait de 8 à 12 heures) est l’une des prestations les plus demandées chez SELY Privé. Cela vous assure la présence continue du même chauffeur professionnel, un véhicule Mercedes réservé exclusivement à votre usage, la possibilité d’enchaîner une multitude de rendez-vous dans Paris et sa région (Versailles, aéroports, shopping, dîners), et une flexibilité totale jusqu’au terme de votre soirée.',
        intro: 'Que vous soyez en voyage d’affaires avec un calendrier serré ou en visite touristique d’exception en famille, la journée complète est la garantie d’un confort sans interruption.',
        sections: [
          {
            h2: 'Exemple d’une journée type avec chauffeur dédié',
            content: 'Découvrez comment s’organise une journée fluide à Paris :',
            bulletPoints: [
              '09h00 : Prise en charge au palace ou à la résidence et départ pour vos premières réunions d’affaires à La Défense.',
              '12h30 : Conduite vers votre restaurant sur la Rive Gauche ; votre chauffeur patiente sur place pendant votre déjeuner.',
              '14h30 : Après-midi shopping privé sur l’Avenue Montaigne et la Place Vendôme ; vos achats sont déposés en sécurité dans le coffre au fur et à mesure.',
              '17h00 : Escapade pour un rendez-vous culturel ou une visite de galerie d’art dans le Marais.',
              '20h00 : Dépose pour votre dîner gastronomique ou spectacle à l’Opéra Garnier, puis raccompagnement nocturne en toute quiétude.',
            ],
          },
        ],
        faq: [
          {
            q: 'Le chauffeur peut-il nous conduire en dehors de Paris (Versailles, Champagne) ?',
            a: 'Oui. Le forfait journée complète peut tout à fait inclure un aller-retour au Château de Versailles, une visite des caves en Champagne ou une journée shopping à La Vallée Village.',
          },
          {
            q: 'Y a-t-il des pauses obligatoires pour le chauffeur ?',
            a: 'Conformément à la législation sur la sécurité routière, pour les prestations très longues excédant 10 heures consécutives, une pause repas est prévue ou un relais de chauffeur peut être organisé sans rupture de service pour le client.',
          },
        ],
        cta: {
          title: 'Planifiez votre journée d’exception à Paris',
          subtitle: 'Un chauffeur privé et un véhicule de prestige dédiés à votre seul emploi du temps.',
          buttonText: 'Réserver ma journée complète',
          link: '/paris/reserver?service=hourly',
        },
        relatedSlugs: ['prix-mise-a-disposition-chauffeur-paris', 'comment-fonctionne-mise-a-disposition-chauffeur'],
      },
      en: {
        title: 'Can You Book a Private Chauffeur for a Full Day in Paris?',
        metaTitle: 'Book a Private Chauffeur for a Full Day in Paris | Daily Hire',
        metaDescription: 'Discover full-day private chauffeur hire in Paris: 8 to 12-hour charters for business roadshows, luxury shopping, Versailles day trips, and fine dining.',
        h1: 'Can You Book a Private Chauffeur for a Full Day in Paris?',
        heroAlt: 'Black luxury Mercedes saloon driving along the Seine in Paris during full-day charter',
        directAnswer: 'Yes, absolutely. Reserving a private chauffeur for an entire day (typically an 8 to 12-hour block) is one of SELY Privé’s most popular services. It ensures the unbroken presence of the same dedicated professional chauffeur, an exclusive Mercedes vehicle on standby, unlimited point-to-point transit across Paris and greater Île-de-France (including Versailles and airports), and complete schedule freedom until your evening concludes.',
        sections: [
          {
            h2: 'Sample itinerary of an executive full day in Paris',
            content: 'How an 8-hour executive charter unfolds smoothly:',
            bulletPoints: [
              '09:00 AM: Hotel pickup and direct transit to morning board meetings in La Défense business district.',
              '12:30 PM: Transfer to private dining on the Left Bank; chauffeur remains parked on standby.',
              '02:30 PM: Private afternoon shopping along Avenue Montaigne and Place Vendôme with secure in-car bag storage.',
              '05:00 PM: Afternoon museum visit or private gallery viewing in Le Marais.',
              '08:00 PM: Evening drop-off at the Opera Garnier or Michelin-starred restaurant with late-night return.',
            ],
          },
        ],
        cta: {
          title: 'Design your perfect full day in Paris',
          subtitle: 'Continuous luxury transport tailored to your schedule.',
          buttonText: 'Book full day chauffeur',
          link: '/paris/reserver?service=hourly',
        },
        relatedSlugs: ['hourly-chauffeur-paris-cost', 'how-hourly-chauffeur-service-works'],
      },
      es: {
        title: '¿Se puede reservar un chófer privado para todo un día en París?',
        metaTitle: 'Reservar un Chófer Privado para Todo el Día en París',
        metaDescription: 'Alquiler de chófer privado por jornada completa en París: itinerarios de 8 a 12 horas, reuniones de empresa, compras y visitas a Versalles.',
        h1: '¿Se puede reservar un chófer privado para todo un día en París?',
        heroAlt: 'Mercedes de lujo recorriendo París durante un servicio de día completo',
        directAnswer: 'Sí, totalmente. Reservar un chófer privado para todo el día (paquetes de 8 a 12 horas) es ideal para disfrutar de la máxima comodidad: el mismo chófer profesional permanece a su disposición continua, permitiéndole enlazar reuniones, compras de lujo, restaurantes y excursiones a Versalles.',
        cta: {
          title: 'Organice su día completo en París',
          subtitle: 'Un chófer privado y un vehículo de lujo a su entera disposición.',
          buttonText: 'Reservar jornada completa',
          link: '/paris/reserver?service=hourly',
        },
        relatedSlugs: ['precio-chofer-por-horas-paris', 'como-funciona-chofer-por-horas-paris'],
      },
      ar: {
        title: 'هل يمكن حجز سائق خاص ليوم كامل في باريس؟',
        metaTitle: 'حجز سائق خاص ليوم كامل في باريس | باقة 8 إلى 12 ساعة',
        metaDescription: 'تنظيم يوم كامل مع سائق خاص في باريس: مسارات العمل، رحلات التسوق في جادة مونتين، وزيارات قصر فرساي والمطاعم الفاخرة.',
        h1: 'هل يمكن حجز سائق خاص ليوم كامل في باريس؟',
        heroAlt: 'سيارة مرسيدس فخمة تجوب شوارع باريس خلال حجز يوم كامل',
        directAnswer: 'نعم بالتأكيد. يعد حجز سائق خاص ليوم كامل (عادة لباقة من 8 إلى 12 ساعة) الخيار الأكثر طلباً لدى ضيوف SELY Privé في باريس. يضمن لكم بقاء نفس السائق المحترف والسيارة الفاخرة في خدمتكم طوال اليوم دون انقطاع، مما يتيح لكم التنقل بسلاسة بين الاجتماعات، والمطاعم، والتسوق، وزيارة المعالم مثل فرساي وحتى عودتكم ليلاً إلى الفندق.',
        cta: {
          title: 'خطط ليوم استثنائي في باريس',
          subtitle: 'سائق خاص وسيارة مرسيدس مكرسة بالكامل لجدول أعمالكم.',
          buttonText: 'احجز يومك الكامل الآن',
          link: '/paris/reserver?service=hourly',
        },
        relatedSlugs: ['taklifat-saeq-bil-saa-baris', 'kaif-yaamal-saeq-bil-saa-baris'],
      },
    },
  },
];
