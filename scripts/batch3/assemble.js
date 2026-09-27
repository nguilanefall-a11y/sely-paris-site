import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { topic10 } from './topic_10.js';
import { topic18 } from './topic_18.js';
import { topic19 } from './topic_19.js';
import { topic20 } from './topic_20.js';
import { topic21 } from './topic_21.js';
import { topic22 } from './topic_22.js';
import { topic23 } from './topic_23.js';
import { topic24 } from './topic_24.js';
import { topic25 } from './topic_25.js';
import { topic26 } from './topic_26.js';
import { topic27 } from './topic_27.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allBatch3 = [
  topic10,
  topic18,
  topic19,
  topic20,
  topic21,
  topic22,
  topic23,
  topic24,
  topic25,
  topic26,
  topic27,
].sort((a, b) => a.id - b.id);

console.log('=== BATCH 3 AUDIT (Flotte, Véhicules & Bagages) ===');
console.log('ID | FR words | EN words | ES words | AR words | Title');

function getWordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function getArticleTotalWords(tr) {
  if (!tr) return 0;
  let total = 0;
  total += getWordCount(tr.directAnswer);
  total += getWordCount(tr.intro);
  if (tr.sections) {
    tr.sections.forEach(s => {
      total += getWordCount(s.h2);
      total += getWordCount(s.h3);
      if (s.content) total += getWordCount(s.content);
      if (s.paragraphs) s.paragraphs.forEach(p => total += getWordCount(p));
      if (s.callout) total += getWordCount(s.callout.text);
      if (s.bulletPoints) s.bulletPoints.forEach(bp => total += getWordCount(bp));
    });
  }
  if (tr.sections2) {
    tr.sections2.forEach(s => {
      total += getWordCount(s.h2);
      total += getWordCount(s.h3);
      if (s.content) total += getWordCount(s.content);
      if (s.paragraphs) s.paragraphs.forEach(p => total += getWordCount(p));
      if (s.callout) total += getWordCount(s.callout.text);
      if (s.bulletPoints) s.bulletPoints.forEach(bp => total += getWordCount(bp));
    });
  }
  if (tr.stepsWorkflow || tr.steps) {
    (tr.stepsWorkflow || tr.steps).forEach(st => {
      total += getWordCount(st.title);
      total += getWordCount(st.description);
    });
  }
  if (tr.comparisonTable) {
    tr.comparisonTable.headers.forEach(h => total += getWordCount(h));
    tr.comparisonTable.rows.forEach(r => r.forEach(c => total += getWordCount(c)));
  }
  if (tr.faq) {
    tr.faq.forEach(f => {
      total += getWordCount(f.q);
      total += getWordCount(f.a);
    });
  }
  return total;
}

allBatch3.forEach(a => {
  const frW = getArticleTotalWords(a.translations.fr);
  const enW = getArticleTotalWords(a.translations.en);
  const esW = getArticleTotalWords(a.translations.es);
  const arW = getArticleTotalWords(a.translations.ar);
  console.log(
    a.id.toString().padEnd(3) + ' | ' +
    frW.toString().padEnd(8) + ' | ' +
    enW.toString().padEnd(8) + ' | ' +
    esW.toString().padEnd(8) + ' | ' +
    arW.toString().padEnd(8) + ' | ' +
    (a.translations.fr?.title || '').slice(0, 40)
  );
});

const targetFile = path.join(__dirname, '../../src/data/journal/articlesVehiculesBagages.js');
const content = `// ─── ARTICLES DE LA CATÉGORIE : FLOTTE, VÉHICULES & BAGAGES (Sujets 10, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27) ───\n\nexport const ARTICLES_VEHICULES_BAGAGES = ${JSON.stringify(allBatch3, null, 2)};\n`;

fs.writeFileSync(targetFile, content, 'utf8');
console.log(`\n[SUCCESS] Saved ${allBatch3.length} enriched articles to ${targetFile}`);
