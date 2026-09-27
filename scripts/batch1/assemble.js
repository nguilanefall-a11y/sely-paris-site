import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { topic11 } from './topic_11.js';
import { topic12 } from './topic_12.js';
import { topic13 } from './topic_13.js';
import { topic14 } from './topic_14.js';
import { topic15 } from './topic_15.js';
import { topic16 } from './topic_16.js';
import { topic17 } from './topic_17.js';
import { topic28 } from './topic_28.js';
import { topic29 } from './topic_29.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allBatch1 = [
  topic11,
  topic12,
  topic13,
  topic14,
  topic15,
  topic16,
  topic17,
  topic28,
  topic29,
].sort((a, b) => a.id - b.id);

console.log('=== BATCH 1 AUDIT (Airports & Le Bourget) ===');
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

allBatch1.forEach(a => {
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

const targetFile = path.join(__dirname, '../../src/data/journal/articlesAeroports.js');
const content = `// ─── ARTICLES DE LA CATÉGORIE : AÉROPORTS & TRANSFERTS (Sujets 11, 12, 13, 14, 15, 16, 17, 28, 29) ───\n\nexport const ARTICLES_AEROPORTS = ${JSON.stringify(allBatch1, null, 2)};\n`;

fs.writeFileSync(targetFile, content, 'utf8');
console.log(`\n[SUCCESS] Saved ${allBatch1.length} enriched articles to ${targetFile}`);
