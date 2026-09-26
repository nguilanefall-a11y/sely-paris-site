import React, { useState } from 'react';
import { useCity } from '../hooks/useCity';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import styles from './VehiclesPage.module.css';

const VEHICLES_CATALOG = [
  {
    id: 'classe-v',
    title: 'Mercedes Classe V Business',
    titleEn: 'Mercedes V-Class Business',
    category: 'VAN BUSINESS & ÉLÉGANCE',
    categoryEn: 'EXECUTIVE BUSINESS VAN',
    desc: 'L\'excellence incontournable pour les délégations d\'affaires, familles et transferts aéroport en groupe. Salon VIP spacieux face-à-face grand confort.',
    descEn: 'The benchmark for executive delegations, families, and group airport transfers. Spacious face-to-face VIP salon.',
    passengers: '7',
    luggage: '7',
    image: '/vclass-paris-luxury.jpg',
    rearImage: '/vclass-rear-luxury.jpg',
    interiorImage: '/vclass_interior_vip_lounge.jpg',
    badge: 'LE PLUS DEMANDÉ',
    badgeEn: 'MOST REQUESTED'
  },
  {
    id: 'peugeot-traveller',
    title: 'Peugeot Traveller',
    titleEn: 'Peugeot Traveller',
    category: 'VAN CONFORT (6 PLACES)',
    categoryEn: 'COMFORT VAN (6 SEATS)',
    desc: 'Van spacieux et sobre, configuration 6 places modulable grand confort. Idéal pour transferts d\'entreprises, délégations et familles.',
    descEn: 'Spacious and functional van with modular 6-passenger layout. Ideal for corporate transfers, delegations, and family itineraries.',
    passengers: '6',
    luggage: '6',
    image: '/peugeot-traveller-front-paris.jpg',
    rearImage: '/peugeot-traveller-rear-paris.jpg',
    badge: 'NOUVEAU FLEET',
    badgeEn: 'NEW FLEET'
  },
  {
    id: 'classe-s',
    title: 'Mercedes Classe S',
    titleEn: 'Mercedes S-Class',
    category: 'BERLINE DE PRESTIGE',
    categoryEn: 'PRESTIGE FLAGSHIP SALOON',
    desc: 'Le summum mondial du voyage automobile de luxe. Confort feutré, insonorisation absolue et raffinement intemporel avec chauffeur dédié.',
    descEn: 'The world benchmark for luxury chauffeur travel. Acoustic serenity, sublime suspension, and peerless executive elegance.',
    passengers: '3',
    luggage: '3',
    image: '/sclass-main-new.jpg',
    rearImage: '/sclass_paris_hero.jpg',
    interiorImage: '/sclass-interior-white.jpg',
    badge: 'FLEURON BUSINESS',
    badgeEn: 'BUSINESS FLAGSHIP'
  },
  {
    id: 'classe-e',
    title: 'Mercedes Classe E',
    titleEn: 'Mercedes E-Class',
    category: 'BERLINE EXECUTIVE',
    categoryEn: 'EXECUTIVE SALOON',
    desc: 'L\'alliance parfaite entre discrétion, élégance sobre et confort pour tous vos rendez-vous d\'affaires et transferts parisiens.',
    descEn: 'Discreet elegance, quiet poise, and modern technology tailored for corporate itineraries across the capital.',
    passengers: '3',
    luggage: '2',
    image: '/eclass-paris-luxury.jpg',
    badge: 'CORPORATE VIP',
    badgeEn: 'CORPORATE VIP'
  },
  {
    id: 'maybach',
    title: 'Mercedes-Maybach',
    titleEn: 'Mercedes-Maybach',
    category: 'HAUTE AUTOMOBILE',
    categoryEn: 'HAUTE AUTOMOBILE',
    desc: 'L\'ultime expression du luxe automobile. Sièges Première Classe inclinables, acoustique de cathédrale et finitions joaillières.',
    descEn: 'The ultimate expression of automotive haute couture. Reclining first-class suite, cathedral acoustics, and bespoke craftsmanship.',
    passengers: '3',
    luggage: '3',
    image: '/maybach-paris-luxury.jpg',
    badge: 'ULTRA-EXCLUSIVE',
    badgeEn: 'ULTRA-EXCLUSIVE'
  },
  {
    id: 'rolls-phantom',
    title: 'Rolls-Royce Phantom',
    titleEn: 'Rolls-Royce Phantom',
    category: 'ARISTOCRATIE BRITANNIQUE',
    categoryEn: 'BRITISH ARISTOCRACY',
    desc: 'L\'incarnation suprême du prestige mondial. Portes antagonistes motorisées, plafond étoilé Starlight et présence magistrale.',
    descEn: 'The supreme icon of world aristocracy. Power coach doors, constellation starlight headliner, and incomparable presence.',
    passengers: '3',
    luggage: '3',
    image: '/rolls-phantom-main.jpg',
    badge: 'PRESTIGE MAJEUR',
    badgeEn: 'SUMMIT OF LUXURY'
  },
  {
    id: 'rolls-cullinan',
    title: 'Rolls-Royce Cullinan',
    titleEn: 'Rolls-Royce Cullinan',
    category: 'SUV HAUTE COUTURE',
    categoryEn: 'HAUTE COUTURE SUV',
    desc: 'Le SUV le plus prestigieux au monde. Position dominante, silence souverain et confort d\'un palace roulant sur tous les parcours.',
    descEn: 'The most opulent luxury SUV ever built. Elevated posture, sovereign serenity, and palace refinement over any terrain.',
    passengers: '3',
    luggage: '4',
    image: '/rolls-cullinan-main.jpg',
    badge: 'PALACE TOUT-TERRAIN',
    badgeEn: 'ROLLING PALACE'
  },
  {
    id: 'range-rover',
    title: 'Range Rover Autobiography',
    titleEn: 'Range Rover Autobiography',
    category: 'SUV D\'EXCEPTION',
    categoryEn: 'AUTOBIOGRAPHY SUV',
    desc: 'Le grand luxe britannique par excellence. Puissance sereine, cuir étendu et suspension pneumatique isolant parfaitement des aléas de la route.',
    descEn: 'British bespoke grandeur. Effortless power, extended leather appointments, and whisper-quiet ride isolation.',
    passengers: '3',
    luggage: '4',
    image: '/range-rover-main.jpg',
    badge: 'SÉRÉNITÉ ROYALE',
    badgeEn: 'ROYAL SERENITY'
  },
  {
    id: 'classe-g',
    title: 'Mercedes Classe G',
    titleEn: 'Mercedes G-Class',
    category: 'ICÔNE INTEMPORELLE',
    categoryEn: 'TIMELESS ICON',
    desc: 'L\'icône tout-terrain légendaire de Stuttgart au design mythique, associant tempérament audacieux et finitions ultra-luxueuses.',
    descEn: 'The mythic off-road icon from Stuttgart, combining commanding character, bold presence, and opulent craftsmanship.',
    passengers: '3',
    luggage: '3',
    image: '/g-class-main.jpg',
    badge: 'CHARISME MYTHIQUE',
    badgeEn: 'MYTHIC CHARISMA'
  },
  {
    id: 'brabus-g',
    title: 'G-Class Brabus 800',
    titleEn: 'G-Class Brabus 800',
    category: 'SUPER-SUV 800 CH',
    categoryEn: 'SUPER-SUV 800 HP',
    desc: 'Déclinaison super-sportive et ultra-exclusive par le préparateur Brabus. Carbone apparent, puissance démesurée et habitacle sur-mesure.',
    descEn: 'Ultra-exclusive supercar performance by Brabus. Visible carbon fibre, extraordinary power, and bespoke tailored cockpit.',
    passengers: '3',
    luggage: '3',
    image: '/brabus-g-class-main.jpg',
    badge: 'HYPER-EXCLUSIF',
    badgeEn: 'HYPER-EXCLUSIVE'
  },
  {
    id: 'cadillac-escalade',
    title: 'Cadillac Escalade ESV',
    titleEn: 'Cadillac Escalade ESV',
    category: 'GRAND SUV VIP AMÉRICAIN',
    categoryEn: 'FLAGSHIP AMERICAN SUV',
    desc: 'Le SUV américain par excellence en format extra-long. Espace colossal, présence cinématographique et salon VIP grand confort.',
    descEn: 'The definitive American VIP SUV in extended wheelbase. Cinematic road stance, vast luggage space, and grand comfort.',
    passengers: '6',
    luggage: '6',
    image: '/cadillac-escalade-main.jpg',
    rearImage: '/cadillac-escalade-rear.jpg',
    interiorImage: '/cadillac-escalade-interior.jpg',
    badge: 'FORMAT LONG ESV',
    badgeEn: 'EXTENDED ESV'
  },
  {
    id: 'tesla-y',
    title: 'Tesla Model Y',
    titleEn: 'Tesla Model Y',
    category: 'ÉCO-PRESTIGE ÉLECTRIQUE',
    categoryEn: 'PREMIUM ELECTRIC',
    desc: 'Mobilité 100% électrique moderne. Toit panoramique en verre, silence de roulement exceptionnel et empreinte carbone minimale.',
    descEn: 'Modern zero-emission mobility. Full-length panoramic glass roof, serene electric silence, and seamless city navigation.',
    passengers: '4',
    luggage: '3',
    image: '/tesla-y-paris-luxury.jpg',
    badge: '100% ÉLECTRIQUE',
    badgeEn: '100% ELECTRIC'
  },
  {
    id: 'sprinter-7-vip',
    title: 'Mercedes Sprinter VIP (7 Places)',
    titleEn: 'Mercedes Sprinter VIP (7 Seats)',
    category: 'MINIBUS SALON FIRST CLASS',
    categoryEn: 'FIRST CLASS VIP MINIBUS',
    desc: 'Salon privé mobile 7 places d\'exception avec sellerie white nappa brodée, ciel étoilé étincelant en fibres optiques, grand écran cinéma 4K et bar privé.',
    descEn: '7-seat First Class mobile suite with embroidered white nappa leather, sparkling starlight roof, 4K cinema display and integrated private bar.',
    passengers: '7',
    luggage: '10',
    image: '/minibus-7-vip-interior.jpg',
    badge: '7 PLACES VIP',
    badgeEn: '7 SEATS VIP'
  },
  {
    id: 'sprinter-14-vip',
    title: 'Mercedes Sprinter VIP (14 Places)',
    titleEn: 'Mercedes Sprinter VIP (14 Seats)',
    category: 'MINIBUS SALON CONFÉRENCE',
    categoryEn: 'BOARDROOM SALOON MINIBUS',
    desc: 'Salon d\'affaires et de conférence mobile 14 places avec tables de travail laquées, cuir beige diamant, éclairage d\'ambiance et ciel étoilé bleu cristal.',
    descEn: '14-seat executive boardroom coach with lacquered conference tables, diamond-quilted beige leather, and crystal blue starlight ceiling.',
    passengers: '14',
    luggage: '14',
    image: '/minibus-14-vip-interior.jpg',
    badge: '14 PLACES VIP',
    badgeEn: '14 SEATS VIP'
  },
  {
    id: 'sprinter-19-standard',
    title: 'Mercedes Sprinter Standard (19 Places)',
    titleEn: 'Mercedes Sprinter Standard (19 Seats)',
    category: 'MINIBUS GRAND TOURISME',
    categoryEn: 'GRAND TOURING MINIBUS',
    desc: 'Minibus grand tourisme 19 places avec plancher aspect parquet bois noble, sellerie cuir ergonomique grand confort et rampes lumineuses LED néon.',
    descEn: '19-seat grand touring coach with hardwood-style flooring, ergonomic leather armchairs, and ambient dual-line LED roof lighting.',
    passengers: '19',
    luggage: '19',
    image: '/minibus-19-standard-interior.jpg',
    badge: '19 PLACES STANDARD',
    badgeEn: '19 SEATS STANDARD'
  }
];

export default function VehiclesPage() {
  const { t, getCityPath, i18n } = useCity();
  const navigate = useNavigate();
  const isEn = i18n?.language?.startsWith('en');

  const [activeCategory, setActiveCategory] = useState('all');
  const [minibusFilter, setMinibusFilter] = useState('all'); // 'all' | 'vip' | 'standard'
  const [activeAngles, setActiveAngles] = useState({});

  const filteredVehicles = VEHICLES_CATALOG.filter((v) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'berlines') return v.id === 'classe-s' || v.id === 'classe-e' || v.id === 'tesla-y';
    if (activeCategory === 'prestige') return v.id === 'maybach' || v.id === 'rolls-phantom' || v.id === 'rolls-cullinan';
    if (activeCategory === 'suv') return v.id === 'range-rover' || v.id === 'classe-g' || v.id === 'brabus-g' || v.id === 'cadillac-escalade';
    if (activeCategory === 'vans') return v.id === 'classe-v' || v.id === 'peugeot-traveller';
    if (activeCategory === 'minibus') {
      if (!v.id.startsWith('sprinter')) return false;
      if (minibusFilter === 'vip') return v.id.includes('vip');
      if (minibusFilter === 'standard') return v.id.includes('standard');
      return true;
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <PageHeader
        title={isEn ? 'The Private Fleet' : 'Notre Flotte d\'Exception'}
        subtitle={isEn ? 'Excellence, craftsmanship and absolute security' : 'L\'Excellence automobile à votre service'}
        image="/sclass-main-new.jpg"
      />

      <section className={styles.introSection}>
        <div className={styles.introContainer}>
          <span className={styles.introBadge}>
            {isEn ? 'CURATED COLLECTION — PARIS & ÎLE-DE-FRANCE' : 'COLLECTION PRIVÉE — PARIS & ÎLE-DE-FRANCE'}
          </span>
          <p className={styles.introText}>
            {isEn
              ? 'Discover our private collection of thirty flagship vehicles, meticulously maintained according to five-star palace hospitality standards.'
              : 'Découvrez notre flotte d\'une trentaine de véhicules haut de gamme, entretenus selon les standards les plus exigeants de la grande hôtellerie pour vous garantir confort, sécurité et discrétion absolue.'}
          </p>

          {/* Category Tabs */}
          <div className={styles.filterBar}>
            {[
              { id: 'all', label: isEn ? 'ALL VEHICLES' : 'TOUTE LA FLOTTE' },
              { id: 'berlines', label: isEn ? 'BERLINES' : 'BERLINES' },
              { id: 'prestige', label: isEn ? 'HAUTE COUTURE' : 'HAUTE COUTURE' },
              { id: 'suv', label: isEn ? 'SUVS PRESTIGE' : 'SUVS PRESTIGE' },
              { id: 'vans', label: isEn ? 'VANS' : 'VANS' },
              { id: 'minibus', label: isEn ? 'MINIBUS' : 'MINIBUS' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.filterBtn} ${activeCategory === tab.id ? styles.filterBtnActive : ''}`}
                onClick={() => {
                  setActiveCategory(tab.id);
                  if (tab.id !== 'minibus') setMinibusFilter('all');
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Subfilter when Minibus category is selected */}
          {activeCategory === 'minibus' && (
            <div className={styles.minibusSubFilterBar}>
              {[
                { id: 'all', label: isEn ? 'All 3 Minibuses' : 'Les 3 Minibus (7, 14, 19)' },
                { id: 'vip', label: isEn ? '★ VIP Saloons (7 & 14 Seats)' : '★ Salons VIP (7 & 14 Places)' },
                { id: 'standard', label: isEn ? 'Standard Edition (19 Seats)' : 'Édition Standard (19 Places)' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  className={`${styles.subFilterBtn} ${minibusFilter === sub.id ? styles.subFilterBtnActive : ''}`}
                  onClick={() => setMinibusFilter(sub.id)}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Architectural Vehicles Grid ── */}
      <section className={styles.fleetSection}>
        <div className={styles.fleetGrid}>
          {filteredVehicles.map((veh, idx) => {
            const currentAngle = activeAngles[veh.id] || 'front';
            const displayImage =
              currentAngle === 'rear' && veh.rearImage
                ? veh.rearImage
                : currentAngle === 'interior' && veh.interiorImage
                ? veh.interiorImage
                : veh.image;
            const hasMultipleAngles = Boolean(veh.rearImage || veh.interiorImage);

            return (
              <article key={veh.id} className={styles.vehicleCard}>
                <div className={styles.cardVisualWrapper}>
                  <img
                    src={displayImage}
                    alt={isEn ? veh.titleEn : veh.title}
                    className={styles.cardImage}
                    loading={idx < 4 ? 'eager' : 'lazy'}
                  />
                  <div className={styles.cardBadge}>
                    <span>{isEn ? veh.badgeEn : veh.badge}</span>
                  </div>

                  {hasMultipleAngles && (
                    <div className={styles.angleDial}>
                      <button
                        type="button"
                        className={`${styles.angleBtn} ${currentAngle === 'front' ? styles.angleBtnActive : ''}`}
                        onClick={() => setActiveAngles((prev) => ({ ...prev, [veh.id]: 'front' }))}
                      >
                        {isEn ? 'Front' : 'Devant'}
                      </button>
                      {veh.rearImage && (
                        <button
                          type="button"
                          className={`${styles.angleBtn} ${currentAngle === 'rear' ? styles.angleBtnActive : ''}`}
                          onClick={() => setActiveAngles((prev) => ({ ...prev, [veh.id]: 'rear' }))}
                        >
                          {isEn ? 'Rear' : 'Arrière'}
                        </button>
                      )}
                      {veh.interiorImage && (
                        <button
                          type="button"
                          className={`${styles.angleBtn} ${currentAngle === 'interior' ? styles.angleBtnActive : ''}`}
                          onClick={() => setActiveAngles((prev) => ({ ...prev, [veh.id]: 'interior' }))}
                        >
                          {isEn ? 'Cabin' : 'Intérieur'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <span className={styles.cardCategory}>{isEn ? veh.categoryEn : veh.category}</span>
                  <h2 className={styles.cardTitle}>{isEn ? veh.titleEn : veh.title}</h2>
                  <p className={styles.cardDesc}>{isEn ? veh.descEn : veh.desc}</p>
                </div>

                <div className={styles.specsRow}>
                  <div className={styles.specItem}>
                    <Users size={15} strokeWidth={1.5} className={styles.specIcon} />
                    <span>{veh.passengers} {isEn ? 'seats' : 'places'}</span>
                  </div>
                  <div className={styles.specItem}>
                    <Briefcase size={15} strokeWidth={1.5} className={styles.specIcon} />
                    <span>{veh.luggage} {isEn ? 'bags' : 'valises'}</span>
                  </div>
                  <div className={styles.specItem}>
                    <ShieldCheck size={15} strokeWidth={1.5} className={styles.specIcon} />
                    <span>VIP Chauffeur</span>
                  </div>
                </div>

                <div className={styles.cardAction}>
                  <button
                    type="button"
                    onClick={() => navigate(getCityPath(`/reserver?service=transfer&vehicle=${veh.id}`))}
                    className={styles.reserveBtn}
                  >
                    <span>{isEn ? 'RESERVE THIS VEHICLE' : 'RÉSERVER CE VÉHICULE'}</span>
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className={styles.bottomBanner}>
        <div className={styles.bottomContainer}>
          <h3 className={styles.bottomTitle}>
            {isEn ? 'Need a tailored fleet or specific arrangement?' : 'Besoin d\'un convoi ou d\'une configuration spécifique ?'}
          </h3>
          <p className={styles.bottomDesc}>
            {isEn
              ? 'Our dedicated team coordinates multi-vehicle motorcades, events, and bespoke security transfers.'
              : 'Notre équipe dédiée organise vos convois multi-véhicules, mises à disposition longue durée et déplacements officiels.'}
          </p>
          <div className={styles.bottomActions}>
            <Link to={getCityPath('/reserver?service=transfer')} className={styles.bottomPrimary}>
              {isEn ? 'BOOK A TRANSFER' : 'RÉSERVER UN TRANSFERT'}
            </Link>
            <Link to={getCityPath('/demande-specifique')} className={styles.bottomSecondary}>
              {isEn ? 'BESPOKE INQUIRY' : 'DEMANDE SUR-MESURE'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
