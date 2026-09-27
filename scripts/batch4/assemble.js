import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { topic07 } from './topic_07.js';
import { topic08 } from './topic_08.js';
import { topic09 } from './topic_09.js';
import { topic30 } from './topic_30.js';

import { topic31 } from './topic_31.js';
import { topic32 } from './topic_32.js';
import { topic33 } from './topic_33.js';
import { topic34 } from './topic_34.js';
import { topic35 } from './topic_35.js';
import { topic36 } from './topic_36.js';

import { topic37 } from './topic_37.js';
import { topic38 } from './topic_38.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function auditList(title, list) {
  console.log(`\n=== AUDIT: ${title} ===`);
  console.log('ID | FR words | EN words | ES words | AR words | Title');
  list.forEach(a => {
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
      (a.translations.fr?.title || '').slice(0, 42)
    );
  });
}

// 1. Mise à Disposition (IDs 7, 8, 9, 30)
const miseADispositionList = [topic07, topic08, topic09, topic30].sort((a, b) => a.id - b.id);
auditList('MISE À DISPOSITION (7, 8, 9, 30)', miseADispositionList);

const fileMiseADispo = path.join(__dirname, '../../src/data/journal/articlesMiseADisposition.js');
const contentMiseADispo = `// ─── ARTICLES DE LA CATÉGORIE : MISE À DISPOSITION (Sujets 7, 8, 9, 30) ───\n\nexport const ARTICLES_MISE_A_DISPOSITION = ${JSON.stringify(miseADispositionList, null, 2)};\n`;
fs.writeFileSync(fileMiseADispo, contentMiseADispo, 'utf8');
console.log(`[SUCCESS] Saved ${miseADispositionList.length} articles to ${fileMiseADispo}`);

// 2. Fashion Week & Événements (IDs 31, 32, 33, 34, 35, 36)
const fashionWeekList = [topic31, topic32, topic33, topic34, topic35, topic36].sort((a, b) => a.id - b.id);
auditList('FASHION WEEK & ÉVÉNEMENTS (31, 32, 33, 34, 35, 36)', fashionWeekList);

const fileFashionWeek = path.join(__dirname, '../../src/data/journal/articlesFashionWeekEvents.js');
const contentFashionWeek = `// ─── ARTICLES DE LA CATÉGORIE : FASHION WEEK & ÉVÉNEMENTS (Sujets 31, 32, 33, 34, 35, 36) ───\n\nexport const ARTICLES_FASHION_WEEK_EVENTS = ${JSON.stringify(fashionWeekList, null, 2)};\n`;
fs.writeFileSync(fileFashionWeek, contentFashionWeek, 'utf8');
console.log(`[SUCCESS] Saved ${fashionWeekList.length} articles to ${fileFashionWeek}`);

// 3. Business & International (IDs 37, 38)
const businessList = [topic37, topic38].sort((a, b) => a.id - b.id);
auditList('BUSINESS & INTERNATIONAL (37, 38)', businessList);

const fileBusiness = path.join(__dirname, '../../src/data/journal/articlesBusinessInternational.js');
const contentBusiness = `// ─── ARTICLES DE LA CATÉGORIE : BUSINESS & INTERNATIONAL (Sujets 37, 38) ───\n\nexport const ARTICLES_BUSINESS_INTERNATIONAL = ${JSON.stringify(businessList, null, 2)};\n`;
fs.writeFileSync(fileBusiness, contentBusiness, 'utf8');
console.log(`[SUCCESS] Saved ${businessList.length} articles to ${fileBusiness}`);
