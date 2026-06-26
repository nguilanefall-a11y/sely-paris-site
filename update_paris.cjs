const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = ['fr.json', 'en.json'];

const replacements = [
  { search: /AM Privé/g, replace: 'SELY' },
  { search: /AM PRIVÉ/g, replace: 'SELY' },
  { search: /am-prive/g, replace: 'sely' },
  { search: /Bordeaux & Nouvelle-Aquitaine/g, replace: 'Paris & Île-de-France' },
  { search: /Bordeaux and Nouvelle-Aquitaine/g, replace: 'Paris & Île-de-France' },
  { search: /Bordeaux/g, replace: 'Paris' },
  { search: /Nouvelle-Aquitaine/g, replace: 'Île-de-France' },
  { search: /Aéroport de Bordeaux-Mérignac/g, replace: 'Aéroports de Paris (CDG, Orly)' },
  { search: /Bordeaux-Mérignac Airport/g, replace: 'Paris Airports (CDG, Orly)' },
  { search: /Gare St-Jean/g, replace: 'Gares Parisiennes' },
  { search: /Gare Saint-Jean/g, replace: 'Gares Parisiennes' },
  { search: /St-Jean Train Station/g, replace: 'Paris Train Stations' },
  { search: /Saint-Émilion/g, replace: 'Versailles' },
  { search: /Médoc/g, replace: 'Champagne' },
  { search: /Graves/g, replace: 'Châteaux de la Loire' },
  { search: /Bassin d'Arcachon/g, replace: 'Normandie (Deauville)' },
  { search: /Arcachon/g, replace: 'Deauville' },
  { search: /Cap Ferret/g, replace: 'Honfleur' },
  { search: /Dune du Pilat/g, replace: 'Mont Saint-Michel' }
];

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    replacements.forEach(({ search, replace }) => {
      content = content.replace(search, replace);
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
