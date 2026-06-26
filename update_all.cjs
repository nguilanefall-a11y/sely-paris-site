const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { search: /AM PRIVÉ/g, replace: 'SELY' },
  { search: /AM Privé/g, replace: 'SELY' },
  { search: /am-prive/g, replace: 'sely' },
  { search: /Bordeaux & Nouvelle-Aquitaine/g, replace: 'Paris & Île-de-France' },
  { search: /Bordeaux and Nouvelle-Aquitaine/g, replace: 'Paris & Île-de-France' },
  { search: /Bordeaux/g, replace: 'Paris' },
  { search: /Nouvelle-Aquitaine/g, replace: 'Île-de-France' },
  { search: /Aéroport de Bordeaux-Mérignac/g, replace: 'Aéroports de Paris (CDG, Orly)' },
  { search: /Bordeaux-Mérignac Airport/g, replace: 'Paris Airports (CDG, Orly)' },
  { search: /Gare St-Jean/g, replace: 'Gares Parisiennes' },
  { search: /Gare Saint-Jean/g, replace: 'Gares Parisiennes' },
  { search: /St-Jean Train Station/g, replace: 'Paris Train Stations' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.match(/\.(js|jsx|ts|tsx|json)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      replacements.forEach(({ search, replace }) => {
        if (content.match(search)) {
          content = content.replace(search, replace);
          modified = true;
        }
      });
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
