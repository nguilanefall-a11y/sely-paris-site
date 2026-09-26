import { ARTICLES_CHAUFFEUR_PRIVE } from './articlesChauffeurPrive.js';
import { ARTICLES_MISE_A_DISPOSITION } from './articlesMiseADisposition.js';
import { ARTICLES_AEROPORTS } from './articlesAeroports.js';
import { ARTICLES_VEHICULES_BAGAGES } from './articlesVehiculesBagages.js';
import { ARTICLES_FASHION_WEEK_EVENTS } from './articlesFashionWeekEvents.js';
import { ARTICLES_BUSINESS_INTERNATIONAL } from './articlesBusinessInternational.js';

// Aggregate all modular articles into a single sorted registry
export const JOURNAL_ARTICLES = [
  ...ARTICLES_CHAUFFEUR_PRIVE,
  ...ARTICLES_MISE_A_DISPOSITION,
  ...ARTICLES_AEROPORTS,
  ...ARTICLES_VEHICULES_BAGAGES,
  ...ARTICLES_FASHION_WEEK_EVENTS,
  ...ARTICLES_BUSINESS_INTERNATIONAL,
].sort((a, b) => a.id - b.id);

// Helper to look up an article by any slug across all 4 languages
export function getArticleBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();
  return JOURNAL_ARTICLES.find(
    (art) =>
      art.slugs?.fr === cleanSlug ||
      art.slugs?.en === cleanSlug ||
      art.slugs?.es === cleanSlug ||
      art.slugs?.ar === cleanSlug
  );
}

// Helper to look up an article by numeric ID
export function getArticleById(id) {
  return JOURNAL_ARTICLES.find((art) => art.id === Number(id));
}
