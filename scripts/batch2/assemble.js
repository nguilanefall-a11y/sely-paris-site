import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { topic01 } from './topic_01.js';
import { topic02 } from './topic_02.js';
import { topic03 } from './topic_03.js';
import { topic04 } from './topic_04.js';
import { topic05 } from './topic_05.js';
import { topic06 } from './topic_06.js';
import { topic39 } from './topic_39.js';
import { topic40 } from './topic_40.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allBatch2 = [
  topic01,
  topic02,
  topic03,
  topic04,
  topic05,
  topic06,
  topic39,
  topic40,
].sort((a, b) => a.id - b.id);

console.log('=== BATCH 2 AUDIT (Chauffeur Privé & Comparatifs) ===');
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

allBatch2.forEach(a => {
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

const targetFile = path.join(__dirname, '../../src/data/journal/articlesChauffeurPrive.js');
const content = `// ─── ARTICLES DE LA CATÉGORIE : CHAUFFEUR PRIVÉ & COMPARATIFS (Sujets 1, 2, 3, 4, 5, 6, 39, 40) ───\n\nexport const ARTICLES_CHAUFFEUR_PRIVE = ${JSON.stringify(allBatch2, null, 2)};\n`;

fs.writeFileSync(targetFile, content, 'utf8');
console.log(`\n[SUCCESS] Saved ${allBatch2.length} enriched articles to ${targetFile}`);
