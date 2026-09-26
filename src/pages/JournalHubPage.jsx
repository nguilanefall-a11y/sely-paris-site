import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { JOURNAL_CATEGORIES } from '../data/journal/categories';
import { JOURNAL_ARTICLES } from '../data/journal/articles';
import { ChevronRight, Clock, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import styles from './JournalHubPage.module.css';

export default function JournalHubPage() {
  const { i18n } = useTranslation();
  const location = useLocation();

  // Determine language from URL path or active i18n language
  const currentLang = useMemo(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (['fr', 'en', 'es', 'ar'].includes(pathParts[0])) {
      return pathParts[0];
    }
    const current = (i18n.language || 'fr').toLowerCase().split('-')[0];
    return ['fr', 'en', 'es', 'ar'].includes(current) ? current : 'fr';
  }, [location.pathname, i18n.language]);

  const isRtl = currentLang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categoriesList = useMemo(() => {
    return Object.values(JOURNAL_CATEGORIES);
  }, []);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') return JOURNAL_ARTICLES;
    return JOURNAL_ARTICLES.filter((art) => art.category === selectedCategory);
  }, [selectedCategory]);

  const texts = {
    fr: {
      hubTitle: 'Le Journal',
      hubSubtitle: 'L’art du voyage sur mesure, guides pratiques et expertise de la Maison SELY à Paris.',
      allCategories: 'Tous les articles',
      readArticle: 'Lire l’article',
      breadcrumbHome: 'Accueil',
      breadcrumbJournal: 'Le Journal',
      publishedOn: 'Publié le',
      emptyCategory: 'Aucun article dans cette rubrique pour le moment.',
      seoNote: 'Guides de référence et analyses détaillées pour vos déplacements en berline, van VIP et limousine d’apparat à Paris.',
    },
    en: {
      hubTitle: 'The Journal',
      hubSubtitle: 'The art of bespoke travel, practical guides, and insider mobility expertise by SELY in Paris.',
      allCategories: 'All Articles',
      readArticle: 'Read article',
      breadcrumbHome: 'Home',
      breadcrumbJournal: 'The Journal',
      publishedOn: 'Published on',
      emptyCategory: 'No articles currently in this category.',
      seoNote: 'Benchmark guides and in-depth analyses for your executive transfers and Palace-standard travel in Paris.',
    },
    es: {
      hubTitle: 'El Diario',
      hubSubtitle: 'El arte del viaje a medida, guías prácticas y excelencia de la Maison SELY en París.',
      allCategories: 'Todos los artículos',
      readArticle: 'Leer artículo',
      breadcrumbHome: 'Inicio',
      breadcrumbJournal: 'El Diario',
      publishedOn: 'Publicado el',
      emptyCategory: 'No hay artículos en esta categoría por el momento.',
      seoNote: 'Guías exclusivas para sus traslados de lujo y servicios por horas en París.',
    },
    ar: {
      hubTitle: 'المجلة',
      hubSubtitle: 'فن التنقل الفاخر، أدلة إرشادية وتجارب السفر الحصرية من دار SELY في باريس.',
      allCategories: 'كافة المقالات',
      readArticle: 'قراءة المقال',
      breadcrumbHome: 'الرئيسية',
      breadcrumbJournal: 'المجلة',
      publishedOn: 'تاريخ النشر',
      emptyCategory: 'لا توجد مقالات في هذا القسم حالياً.',
      seoNote: 'دليلك الحصري لخدمات السائق الخاص والتنقلات الرسمية والمطارات في العاصمة الفرنسية باريس.',
    },
  }[currentLang] || texts.fr;

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className={`${styles.hubPage} ${isRtl ? styles.rtl : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${texts.hubTitle} | SELY Privé Paris`,
            description: texts.hubSubtitle,
            url: `https://www.selyprive.com/${currentLang}/journal`,
            publisher: {
              '@type': 'Organization',
              name: 'SELY Privé',
              logo: 'https://www.selyprive.com/logo-onyx.png',
            },
          }),
        }}
      />

      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Fil d’Ariane">
          <Link to={`/${currentLang}`}>{texts.breadcrumbHome}</Link>
          <ChevronRight size={14} className={styles.breadcrumbSep} />
          <span>{texts.breadcrumbJournal}</span>
        </nav>

        {/* Header */}
        <header className={styles.hubHeader}>
          <div className={styles.badgeRow}>
            <span className={styles.journalBadge}>
              <BookOpen size={13} />
              SELY ÉDITION
            </span>
          </div>
          <h1 className={styles.hubTitle}>{texts.hubTitle}</h1>
          <p className={styles.hubSubtitle}>{texts.hubSubtitle}</p>
        </header>

        {/* Category Filter Pills */}
        <div className={styles.categoryFilterBar}>
          <button
            type="button"
            className={`${styles.filterChip} ${selectedCategory === 'all' ? styles.filterChipActive : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            {texts.allCategories}
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.filterChip} ${selectedCategory === cat.id ? styles.filterChipActive : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.names[currentLang] || cat.names.fr}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className={styles.articlesGrid}>
          {filteredArticles.map((art) => {
            const tr = art.translations[currentLang] || art.translations.fr;
            const categoryData = JOURNAL_CATEGORIES[art.category];
            const categoryName = categoryData ? (categoryData.names[currentLang] || categoryData.names.fr) : '';
            const articleSlug = art.slugs[currentLang] || art.slugs.fr;
            const articleLink = `/${currentLang}/journal/${articleSlug}`;

            return (
              <article key={art.id} className={styles.articleCard}>
                <Link to={articleLink} className={styles.cardImageLink} aria-label={tr.title}>
                  <img
                    src={art.heroImage}
                    alt={tr.heroAlt || tr.title}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                  <span className={styles.cardCategoryBadge}>{categoryName}</span>
                </Link>

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.readingTime}>
                      <Clock size={12} />
                      {art.readingTime}
                    </span>
                    <span className={styles.metaDot}>•</span>
                    <time dateTime={art.publishedAt} className={styles.publishDate}>
                      {art.publishedAt}
                    </time>
                  </div>

                  <h2 className={styles.cardTitle}>
                    <Link to={articleLink}>{tr.h1 || tr.title}</Link>
                  </h2>

                  <p className={styles.cardExcerpt}>
                    {tr.directAnswer ? tr.directAnswer.substring(0, 160) + '...' : ''}
                  </p>

                  <div className={styles.cardFooter}>
                    <Link to={articleLink} className={styles.readMoreBtn}>
                      <span>{texts.readArticle}</span>
                      <ArrowIcon size={14} className={styles.arrowIcon} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredArticles.length === 0 && (
          <div className={styles.emptyState}>
            <p>{texts.emptyCategory}</p>
          </div>
        )}

        {/* Bottom SEO Note */}
        <footer className={styles.hubFooterNote}>
          <p>{texts.seoNote}</p>
        </footer>
      </div>
    </div>
  );
}
