import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getArticleBySlug, JOURNAL_ARTICLES } from '../data/journal/articles';
import { JOURNAL_CATEGORIES } from '../data/journal/categories';
import {
  ChevronRight,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  ChevronDown,
  Globe,
  Share2,
} from 'lucide-react';
import styles from './JournalArticlePage.module.css';

export default function JournalArticlePage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // Find article by any of its localized slugs
  const article = useMemo(() => {
    return getArticleBySlug(slug);
  }, [slug]);

  // Determine current language from URL path
  const currentLang = useMemo(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (['fr', 'en', 'es', 'ar'].includes(pathParts[0])) {
      return pathParts[0];
    }
    const current = (i18n.language || 'fr').toLowerCase().split('-')[0];
    return ['fr', 'en', 'es', 'ar'].includes(current) ? current : 'fr';
  }, [location.pathname, i18n.language]);

  const isRtl = currentLang === 'ar';

  // State for FAQ accordion
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // If article not found, redirect to journal hub
  useEffect(() => {
    if (!article) {
      navigate(`/${currentLang}/journal`, { replace: true });
    }
  }, [article, currentLang, navigate]);

  if (!article) return null;

  const tr = article.translations[currentLang] || article.translations.fr;
  const categoryData = JOURNAL_CATEGORIES[article.category];
  const categoryName = categoryData ? (categoryData.names[currentLang] || categoryData.names.fr) : '';

  // Related articles lookup
  const relatedArticles = useMemo(() => {
    if (!article.translations.fr.relatedSlugs) return [];
    return article.translations.fr.relatedSlugs
      .map((s) => getArticleBySlug(s))
      .filter((a) => a && a.id !== article.id)
      .slice(0, 3);
  }, [article]);

  const canonicalUrl = `https://www.selyprive.com/${currentLang}/journal/${article.slugs[currentLang] || article.slugs.fr}`;

  const texts = {
    fr: {
      breadcrumbHome: 'Accueil',
      breadcrumbJournal: 'Le Journal',
      directAnswerLabel: 'L’essentiel en bref',
      faqTitle: 'Questions fréquentes sur ce sujet',
      relatedTitle: 'Poursuivre votre lecture',
      readArticle: 'Lire l’article',
      tableOfContents: 'Sommaire',
      switchLanguageLabel: 'Langue de l’article :',
    },
    en: {
      breadcrumbHome: 'Home',
      breadcrumbJournal: 'The Journal',
      directAnswerLabel: 'Key Takeaways',
      faqTitle: 'Frequently Asked Questions',
      relatedTitle: 'Related Guides & Articles',
      readArticle: 'Read article',
      tableOfContents: 'Table of Contents',
      switchLanguageLabel: 'Article Language:',
    },
    es: {
      breadcrumbHome: 'Inicio',
      breadcrumbJournal: 'El Diario',
      directAnswerLabel: 'Resumen esencial',
      faqTitle: 'Preguntas frecuentes',
      relatedTitle: 'Artículos relacionados',
      readArticle: 'Leer artículo',
      tableOfContents: 'Sumario',
      switchLanguageLabel: 'Idioma del artículo:',
    },
    ar: {
      breadcrumbHome: 'الرئيسية',
      breadcrumbJournal: 'المجلة',
      directAnswerLabel: 'الخلاصة المباشرة',
      faqTitle: 'الأسئلة الشائعة حول هذا الموضوع',
      relatedTitle: 'مقالات وأدلة ذات صلة',
      readArticle: 'قراءة المقال',
      tableOfContents: 'فهرس المحتوى',
      switchLanguageLabel: 'لغة المقال:',
    },
  }[currentLang] || texts.fr;

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <article className={`${styles.articlePage} ${isRtl ? styles.rtl : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Schema.org Article, Breadcrumbs & FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Article',
                headline: tr.title,
                description: tr.metaDescription,
                image: `https://www.selyprive.com${article.heroImage}`,
                datePublished: article.publishedAt,
                author: {
                  '@type': 'Organization',
                  name: 'SELY Privé',
                  url: 'https://www.selyprive.com',
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'SELY Privé',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://www.selyprive.com/logo-onyx.png',
                  },
                },
                mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': canonicalUrl,
                },
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: texts.breadcrumbHome,
                    item: `https://www.selyprive.com/${currentLang}`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: texts.breadcrumbJournal,
                    item: `https://www.selyprive.com/${currentLang}/journal`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: tr.h1 || tr.title,
                    item: canonicalUrl,
                  },
                ],
              },
              tr.faq && tr.faq.length > 0
                ? {
                    '@type': 'FAQPage',
                    mainEntity: tr.faq.map((item) => ({
                      '@type': 'Question',
                      name: item.q,
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: item.a,
                      },
                    })),
                  }
                : null,
            ].filter(Boolean),
          }),
        }}
      />

      <div className={styles.container}>
        {/* Top bar with Breadcrumbs & Language Switcher */}
        <div className={styles.topBar}>
          <nav className={styles.breadcrumb} aria-label="Fil d’Ariane">
            <Link to={`/${currentLang}`}>{texts.breadcrumbHome}</Link>
            <ChevronRight size={13} className={styles.breadcrumbSep} />
            <Link to={`/${currentLang}/journal`}>{texts.breadcrumbJournal}</Link>
            <ChevronRight size={13} className={styles.breadcrumbSep} />
            <span className={styles.breadcrumbCurrent}>{categoryName}</span>
          </nav>

          {/* Multilingual Switcher between translated versions of THIS article */}
          <div className={styles.articleLangSwitcher}>
            <Globe size={13} className={styles.langIcon} />
            <span className={styles.langLabel}>{texts.switchLanguageLabel}</span>
            <div className={styles.langLinks}>
              {['fr', 'en', 'es', 'ar'].map((langKey) => {
                const targetSlug = article.slugs[langKey] || article.slugs.fr;
                const isCurrent = langKey === currentLang;
                const labels = { fr: 'FR', en: 'EN', es: 'ES', ar: 'العربية' };

                return (
                  <Link
                    key={langKey}
                    to={`/${langKey}/journal/${targetSlug}`}
                    className={`${styles.langChip} ${isCurrent ? styles.langChipActive : ''}`}
                  >
                    {labels[langKey]}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Article Header */}
        <header className={styles.articleHeader}>
          <div className={styles.categoryPillRow}>
            <span className={styles.categoryBadge}>{categoryName}</span>
            <span className={styles.readingTimeBadge}>
              <Clock size={12} />
              {article.readingTime}
            </span>
            <span className={styles.dateBadge}>
              <Calendar size={12} />
              {article.publishedAt}
            </span>
          </div>

          <h1 className={styles.articleH1}>{tr.h1 || tr.title}</h1>

          {tr.intro && <p className={styles.articleIntro}>{tr.intro}</p>}
        </header>

        {/* Hero Image */}
        <div className={styles.heroImageWrapper}>
          <img
            src={article.heroImage}
            alt={tr.heroAlt || tr.title}
            className={styles.heroImage}
          />
          {tr.heroAlt && <figcaption className={styles.imageCaption}>{tr.heroAlt}</figcaption>}
        </div>

        {/* Direct Answer Box (Answers intent immediately) */}
        {tr.directAnswer && (
          <aside className={styles.directAnswerCard}>
            <div className={styles.directAnswerHeader}>
              <CheckCircle2 size={18} className={styles.directAnswerIcon} />
              <h3>{texts.directAnswerLabel}</h3>
            </div>
            <p className={styles.directAnswerText}>{tr.directAnswer}</p>
          </aside>
        )}

        {/* Content Layout (Article Body) */}
        <div className={styles.articleBody}>
          {tr.sections &&
            tr.sections.map((section, idx) => (
              <section key={idx} className={styles.contentSection}>
                <h2 className={styles.sectionH2}>{section.h2}</h2>
                {section.content && <p className={styles.paragraph}>{section.content}</p>}

                {section.bulletPoints && (
                  <ul className={styles.bulletList}>
                    {section.bulletPoints.map((pt, pIdx) => (
                      <li key={pIdx} className={styles.bulletItem}>
                        <CheckCircle2 size={15} className={styles.bulletIcon} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

          {/* Bespoke Step-by-Step Workflow (for Process & Airport Pickups) */}
          {tr.stepsWorkflow && tr.stepsWorkflow.length > 0 && (
            <section className={styles.stepsSection}>
              <div className={styles.stepsGrid}>
                {tr.stepsWorkflow.map((st, sIdx) => (
                  <div key={sIdx} className={styles.stepCard}>
                    <div className={styles.stepHeader}>
                      <span className={styles.stepBadge}>{st.stepNumber}</span>
                      <h3 className={styles.stepTitle}>{st.title}</h3>
                    </div>
                    <p className={styles.stepDesc}>{st.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bespoke Comparison / Capacity Table */}
          {tr.comparisonTable && (
            <section className={styles.tableSection}>
              <div className={styles.tableResponsive}>
                <table className={styles.comparisonTable}>
                  <thead>
                    <tr>
                      {tr.comparisonTable.headers.map((h, hIdx) => (
                        <th key={hIdx}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tr.comparisonTable.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className={cIdx === 0 ? styles.tableCellBold : ''}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tr.bottomContent && (
            <p className={styles.bottomParagraph}>{tr.bottomContent}</p>
          )}

          {/* Contextual CTA */}
          {tr.cta && (
            <div className={styles.ctaBox}>
              <div className={styles.ctaBody}>
                <h3 className={styles.ctaTitle}>{tr.cta.title}</h3>
                <p className={styles.ctaSubtitle}>{tr.cta.subtitle}</p>
              </div>
              <Link to={tr.cta.link} className={styles.ctaButton}>
                <span>{tr.cta.buttonText}</span>
                <ArrowIcon size={15} />
              </Link>
            </div>
          )}

          {/* FAQ Section */}
          {tr.faq && tr.faq.length > 0 && (
            <section className={styles.faqSection}>
              <h2 className={styles.faqSectionTitle}>{texts.faqTitle}</h2>
              <div className={styles.faqAccordion}>
                {tr.faq.map((item, fIdx) => {
                  const isOpen = openFaqIndex === fIdx;
                  return (
                    <div
                      key={fIdx}
                      className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
                    >
                      <button
                        type="button"
                        className={styles.faqQuestionBtn}
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : fIdx)}
                        aria-expanded={isOpen}
                      >
                        <span className={styles.faqQuestionText}>{item.q}</span>
                        <ChevronDown
                          size={16}
                          className={`${styles.faqChevron} ${isOpen ? styles.faqChevronRotate : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className={styles.faqAnswer}>
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Related Articles (Maillage interne) */}
          {relatedArticles.length > 0 && (
            <section className={styles.relatedSection}>
              <h3 className={styles.relatedTitle}>{texts.relatedTitle}</h3>
              <div className={styles.relatedGrid}>
                {relatedArticles.map((rel) => {
                  const relTr = rel.translations[currentLang] || rel.translations.fr;
                  const relSlug = rel.slugs[currentLang] || rel.slugs.fr;
                  const relLink = `/${currentLang}/journal/${relSlug}`;

                  return (
                    <Link key={rel.id} to={relLink} className={styles.relatedCard}>
                      <div className={styles.relatedImageWrapper}>
                        <img
                          src={rel.heroImage}
                          alt={relTr.title}
                          className={styles.relatedImage}
                          loading="lazy"
                        />
                      </div>
                      <div className={styles.relatedInfo}>
                        <span className={styles.relatedCategory}>
                          {JOURNAL_CATEGORIES[rel.category]?.names[currentLang] || ''}
                        </span>
                        <h4 className={styles.relatedHeading}>{relTr.h1 || relTr.title}</h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
