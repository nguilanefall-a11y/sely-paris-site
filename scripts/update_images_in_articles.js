import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, '../src/data/journal');
const files = [
  'articlesChauffeurPrive.js',
  'articlesAeroports.js',
  'articlesVehiculesBagages.js',
  'articlesMiseADisposition.js',
  'articlesFashionWeekEvents.js',
  'articlesBusinessInternational.js',
];

for (const f of files) {
  const filePath = path.join(dir, f);
  const fileUrl = pathToFileURL(filePath).href;
  const mod = await import(fileUrl);
  const key = Object.keys(mod)[0];
  const list = mod[key];

  list.forEach((art) => {
    const idStr = String(art.id).padStart(2, '0');
    art.heroImage = `/journal/journal_topic_${idStr}.jpg`;
  });

  const content = `// ─── ARTICLES DE LA CATÉGORIE ───\n\nexport const ${key} = ${JSON.stringify(list, null, 2)};\n`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[SUCCESS] Updated ${list.length} articles in ${f}`);
}
