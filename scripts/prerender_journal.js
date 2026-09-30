import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { JOURNAL_ARTICLES } from '../src/data/journal/articles.js';
import { JOURNAL_CATEGORIES } from '../src/data/journal/categories.js';

const distDir = path.join(__dirname, '../dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('Error: dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const baseTemplate = fs.readFileSync(templatePath, 'utf8');

const BASE_URL = 'https://www.selyprive.com';
const languages = ['fr', 'en', 'es', 'ar'];

const translationsUi = {
  fr: {
    home: 'Accueil',
    journal: 'Le Journal',
    directAnswer: 'L’essentiel en bref',
    faqTitle: 'Questions fréquentes sur ce sujet',
    relatedTitle: 'Poursuivre votre lecture',
    switchLang: 'Langue de l’article :',
    hubTitle: 'Le Journal SELY Privé | L’Art du Chauffeur Privé d’Exception à Paris',
    hubMeta: 'Découvrez Le Journal SELY Privé : 40 guides d’experts sur les transferts aéroports, la mise à disposition, la Fashion Week et notre flotte de prestige à Paris.',
  },
  en: {
    home: 'Home',
    journal: 'The Journal',
    directAnswer: 'Key Takeaways',
    faqTitle: 'Frequently Asked Questions',
    relatedTitle: 'Related Guides & Articles',
    switchLang: 'Article Language:',
    hubTitle: 'The SELY Privé Journal | The Art of Private Chauffeur Service in Paris',
    hubMeta: 'Explore the SELY Privé Journal: 40 expert guides on Paris airport transfers, hourly disposal, Fashion Week, and luxury Mercedes fleet in Paris.',
  },
  es: {
    home: 'Inicio',
    journal: 'El Diario',
    directAnswer: 'Resumen esencial',
    faqTitle: 'Preguntas frecuentes',
    relatedTitle: 'Artículos relacionados',
    switchLang: 'Idioma del artículo:',
    hubTitle: 'El Diario SELY Privé | El Arte del Chófer Privado en París',
    hubMeta: 'Descubra El Diario SELY Privé: 40 guías exclusivas sobre traslados a aeropuertos, servicios por horas, Fashion Week y flota Mercedes en París.',
  },
  ar: {
    home: 'الرئيسية',
    journal: 'المجلة',
    directAnswer: 'الخلاصة المباشرة',
    faqTitle: 'الأسئلة الشائعة حول هذا الموضوع',
    relatedTitle: 'مقالات وأدلة ذات صلة',
    switchLang: 'لغة المقال:',
    hubTitle: 'مجلة SELY Privé | فن التنقل الفاخر مع سائق خاص في باريس',
    hubMeta: 'اكتشف مجلة SELY Privé: 40 دليلاً حصرياً حول خدمات نقل المطارات، السائق الخاص بالساعة، أسبوع الموضة وأسطول مرسيدس الفاخر في باريس.',
  },
};

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanBaseTemplate(template) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name=["']description["'][\s\S]*?>\s*/gi, '')
    .replace(/<meta\s+property=["']og:[\s\S]*?>\s*/gi, '')
    .replace(/<meta\s+property=["']twitter:[\s\S]*?>\s*/gi, '')
    .replace(/<meta\s+name=["']twitter:[\s\S]*?>\s*/gi, '')
    .replace(/<link\s+rel=["']canonical["'][\s\S]*?>\s*/gi, '');
}

let generatedCount = 0;

// ─── 1. PRERENDER 160 ARTICLES (40 × 4) ───
for (const article of JOURNAL_ARTICLES) {
  for (const lang of languages) {
    const tr = article.translations[lang] || article.translations.fr;
    const slug = article.slugs[lang] || article.slugs.fr;
    const isRtl = lang === 'ar';
    const categoryData = JOURNAL_CATEGORIES[article.category];
    const categoryName = categoryData?.names[lang] || categoryData?.names.fr || '';
    const ui = translationsUi[lang] || translationsUi.fr;

    const pageUrl = `${BASE_URL}/${lang}/journal/${slug}`;

    // Generate JSON-LD Schema
    const schemaGraph = [
      {
        '@type': 'Article',
        headline: tr.title,
        description: tr.metaDescription,
        image: `${BASE_URL}${article.heroImage}`,
        datePublished: article.publishedAt,
        author: {
          '@type': 'Organization',
          name: 'SELY Privé',
          url: BASE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'SELY Privé',
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/logo-onyx.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: ui.home,
            item: `${BASE_URL}/${lang}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: ui.journal,
            item: `${BASE_URL}/${lang}/journal`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tr.h1 || tr.title,
            item: pageUrl,
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
    ].filter(Boolean);

    // Build Semantic Body HTML
    let bodyHtml = `
      <article class="sely-journal-prerender" dir="${isRtl ? 'rtl' : 'ltr'}" lang="${lang}">
        <nav aria-label="Breadcrumb" class="prerender-breadcrumb">
          <a href="/${lang}">${escapeHtml(ui.home)}</a> &gt;
          <a href="/${lang}/journal">${escapeHtml(ui.journal)}</a> &gt;
          <span>${escapeHtml(categoryName)}</span>
        </nav>

        <header class="prerender-header">
          <span class="prerender-badge">${escapeHtml(categoryName)}</span>
          <time datetime="${article.publishedAt}">${article.publishedAt}</time>
          <h1>${escapeHtml(tr.h1 || tr.title)}</h1>
          ${tr.intro ? `<p class="prerender-intro">${escapeHtml(tr.intro)}</p>` : ''}
        </header>

        <figure class="prerender-hero">
          <img src="${article.heroImage}" alt="${escapeHtml(tr.heroAlt || tr.title)}" width="1200" height="630" />
          ${tr.heroAlt ? `<figcaption>${escapeHtml(tr.heroAlt)}</figcaption>` : ''}
        </figure>

        ${
          tr.directAnswer
            ? `<aside class="prerender-direct-answer">
                <strong>${escapeHtml(ui.directAnswer)}</strong>
                <p>${escapeHtml(tr.directAnswer)}</p>
              </aside>`
            : ''
        }

        <div class="prerender-content">
    `;

    // Sections
    if (tr.sections) {
      for (const sec of tr.sections) {
        bodyHtml += `<section class="prerender-section">`;
        if (sec.h2) bodyHtml += `<h2>${escapeHtml(sec.h2)}</h2>`;
        if (sec.h3) bodyHtml += `<h3>${escapeHtml(sec.h3)}</h3>`;
        if (sec.content) bodyHtml += `<p>${escapeHtml(sec.content)}</p>`;
        if (sec.paragraphs) {
          for (const p of sec.paragraphs) {
            bodyHtml += `<p>${escapeHtml(p)}</p>`;
          }
        }
        if (sec.callout) {
          bodyHtml += `
            <div class="prerender-callout">
              <h4>${escapeHtml(sec.callout.title || 'Conseil SELY Privé')}</h4>
              <p>${escapeHtml(sec.callout.text)}</p>
            </div>
          `;
        }
        if (sec.bulletPoints && sec.bulletPoints.length > 0) {
          bodyHtml += `<ul>`;
          for (const bp of sec.bulletPoints) {
            bodyHtml += `<li>${escapeHtml(bp)}</li>`;
          }
          bodyHtml += `</ul>`;
        }
        if (sec.image) {
          bodyHtml += `
            <figure class="prerender-inline-img">
              <img src="${sec.image.src}" alt="${escapeHtml(sec.image.alt || tr.title)}" loading="lazy" />
              ${sec.image.caption ? `<figcaption>${escapeHtml(sec.image.caption)}</figcaption>` : ''}
            </figure>
          `;
        }
        bodyHtml += `</section>`;
      }
    }

    // Step-by-step
    const steps = tr.stepsWorkflow || tr.steps;
    if (steps && steps.length > 0) {
      bodyHtml += `<section class="prerender-steps">`;
      for (const st of steps) {
        bodyHtml += `
          <div class="prerender-step">
            <span class="step-num">${escapeHtml(st.stepNumber)}</span>
            <h3>${escapeHtml(st.title)}</h3>
            <p>${escapeHtml(st.description)}</p>
          </div>
        `;
      }
      bodyHtml += `</section>`;
    }

    // Comparison Table
    if (tr.comparisonTable) {
      bodyHtml += `
        <div class="prerender-table-wrapper">
          <table>
            <thead>
              <tr>${tr.comparisonTable.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${tr.comparisonTable.rows
                .map((row) => `<tr>${row.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`)
                .join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // Sections 2 (post-table)
    if (tr.sections2) {
      for (const sec of tr.sections2) {
        bodyHtml += `<section class="prerender-section">`;
        if (sec.h2) bodyHtml += `<h2>${escapeHtml(sec.h2)}</h2>`;
        if (sec.h3) bodyHtml += `<h3>${escapeHtml(sec.h3)}</h3>`;
        if (sec.content) bodyHtml += `<p>${escapeHtml(sec.content)}</p>`;
        if (sec.paragraphs) {
          for (const p of sec.paragraphs) {
            bodyHtml += `<p>${escapeHtml(p)}</p>`;
          }
        }
        if (sec.callout) {
          bodyHtml += `
            <div class="prerender-callout">
              <h4>${escapeHtml(sec.callout.title || 'Conseil SELY Privé')}</h4>
              <p>${escapeHtml(sec.callout.text)}</p>
            </div>
          `;
        }
        if (sec.bulletPoints && sec.bulletPoints.length > 0) {
          bodyHtml += `<ul>`;
          for (const bp of sec.bulletPoints) {
            bodyHtml += `<li>${escapeHtml(bp)}</li>`;
          }
          bodyHtml += `</ul>`;
        }
        if (sec.image) {
          bodyHtml += `
            <figure class="prerender-inline-img">
              <img src="${sec.image.src}" alt="${escapeHtml(sec.image.alt || tr.title)}" loading="lazy" />
              ${sec.image.caption ? `<figcaption>${escapeHtml(sec.image.caption)}</figcaption>` : ''}
            </figure>
          `;
        }
        bodyHtml += `</section>`;
      }
    }

    if (tr.bottomContent) {
      bodyHtml += `<p class="prerender-bottom">${escapeHtml(tr.bottomContent)}</p>`;
    }

    // Contextual CTA
    if (tr.cta) {
      bodyHtml += `
        <div class="prerender-cta">
          <h3>${escapeHtml(tr.cta.title)}</h3>
          <p>${escapeHtml(tr.cta.subtitle)}</p>
          <a href="${tr.cta.link}">${escapeHtml(tr.cta.buttonText)}</a>
        </div>
      `;
    }

    // FAQ
    if (tr.faq && tr.faq.length > 0) {
      bodyHtml += `
        <section class="prerender-faq">
          <h2>${escapeHtml(ui.faqTitle)}</h2>
          <dl>
            ${tr.faq
              .map(
                (item) => `
                <dt>${escapeHtml(item.q)}</dt>
                <dd>${escapeHtml(item.a)}</dd>
              `
              )
              .join('')}
          </dl>
        </section>
      `;
    }

    bodyHtml += `</div></article>`;

    // Compose final HTML
    let finalHtml = cleanBaseTemplate(baseTemplate);

    const pageTitle = `${tr.metaTitle || tr.title} | SELY Privé Paris`;

    // Injected Head Meta Tags
    const headInjections = `
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(tr.metaDescription)}" />
    <link rel="canonical" href="${pageUrl}" />
    <link rel="alternate" hreflang="fr" href="${BASE_URL}/fr/journal/${article.slugs.fr}" />
    <link rel="alternate" hreflang="en" href="${BASE_URL}/en/journal/${article.slugs.en}" />
    <link rel="alternate" hreflang="es" href="${BASE_URL}/es/journal/${article.slugs.es}" />
    <link rel="alternate" hreflang="ar" href="${BASE_URL}/ar/journal/${article.slugs.ar}" />
    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/fr/journal/${article.slugs.fr}" />
    <meta property="og:title" content="${escapeHtml(tr.metaTitle || tr.title)}" />
    <meta property="og:description" content="${escapeHtml(tr.metaDescription)}" />
    <meta property="og:image" content="${BASE_URL}${article.heroImage}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(tr.metaTitle || tr.title)}" />
    <meta name="twitter:description" content="${escapeHtml(tr.metaDescription)}" />
    <meta name="twitter:image" content="${BASE_URL}${article.heroImage}" />
    <script type="application/ld+json">
      ${JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaGraph })}
    </script>
    `;

    finalHtml = finalHtml.replace('</head>', `${headInjections}\n</head>`);

    // Inject Body inside <div id="root">
    finalHtml = finalHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${bodyHtml}</div>`
    );

    // Ensure output directory exists
    const targetDir = path.join(distDir, lang, 'journal', slug);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), finalHtml, 'utf8');
    generatedCount++;
  }
}

// ─── 2. PRERENDER 5 HUB PAGES (/journal, /fr/journal, /en/journal, etc.) ───
for (const lang of languages) {
  const ui = translationsUi[lang] || translationsUi.fr;
  const hubUrl = `${BASE_URL}/${lang}/journal`;

  let hubBodyHtml = `
    <main class="sely-journal-hub-prerender" dir="${lang === 'ar' ? 'rtl' : 'ltr'}" lang="${lang}">
      <header>
        <h1>${escapeHtml(ui.hubTitle)}</h1>
        <p>${escapeHtml(ui.hubMeta)}</p>
      </header>
      <section class="journal-categories-list">
        <h2>Catégories</h2>
        <ul>
          ${Object.values(JOURNAL_CATEGORIES)
            .map((cat) => `<li>${escapeHtml(cat.names[lang] || cat.names.fr)}</li>`)
            .join('')}
        </ul>
      </section>
      <section class="journal-articles-index">
        <h2>Tous les articles</h2>
        <div class="articles-grid">
          ${JOURNAL_ARTICLES.map((art) => {
            const tr = art.translations[lang] || art.translations.fr;
            const slug = art.slugs[lang] || art.slugs.fr;
            return `
              <article class="article-card">
                <h3><a href="/${lang}/journal/${slug}">${escapeHtml(tr.h1 || tr.title)}</a></h3>
                <p>${escapeHtml(tr.directAnswer?.slice(0, 160))}...</p>
              </article>
            `;
          }).join('')}
        </div>
      </section>
    </main>
  `;

  let hubHtml = cleanBaseTemplate(baseTemplate);

  const hubMetaInjections = `
    <title>${escapeHtml(ui.hubTitle)}</title>
    <meta name="description" content="${escapeHtml(ui.hubMeta)}" />
    <link rel="canonical" href="${hubUrl}" />
    <link rel="alternate" hreflang="fr" href="${BASE_URL}/fr/journal" />
    <link rel="alternate" hreflang="en" href="${BASE_URL}/en/journal" />
    <link rel="alternate" hreflang="es" href="${BASE_URL}/es/journal" />
    <link rel="alternate" hreflang="ar" href="${BASE_URL}/ar/journal" />
    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/fr/journal" />
  `;

  hubHtml = hubHtml.replace('</head>', `${hubMetaInjections}\n</head>`);
  hubHtml = hubHtml.replace(
    '<div id="root"></div>',
    `<div id="root">${hubBodyHtml}</div>`
  );

  const hubTargetDir = path.join(distDir, lang, 'journal');
  fs.mkdirSync(hubTargetDir, { recursive: true });
  fs.writeFileSync(path.join(hubTargetDir, 'index.html'), hubHtml, 'utf8');

  // Also write default /journal/index.html from FR
  if (lang === 'fr') {
    const defaultHubDir = path.join(distDir, 'journal');
    fs.mkdirSync(defaultHubDir, { recursive: true });
    fs.writeFileSync(path.join(defaultHubDir, 'index.html'), hubHtml, 'utf8');
  }
}

console.log(`[PRERENDER] Successfully generated ${generatedCount} article pages and 5 hub pages in dist/!`);

// ─── 3. PRERENDER CONVERSION CONFIRMATION PAGES WITH GOOGLE ADS EVENT SNIPPET ───
const rawConversionSnippet = `
    <!-- Event snippet for Demande de devis (1) conversion page -->
    <script>
      gtag('event', 'conversion', {'send_to': 'AW-18418775333/IzlhCL_QyIsdEKXq4M5E'});
    </script>
`;

const conversionRoutes = [
  'reservation-succes',
  'confirmation-devis',
  'devis-confirme',
  'paris/reservation-succes',
  'paris/confirmation-devis',
  'paris/devis-confirme',
];

for (const route of conversionRoutes) {
  let convHtml = baseTemplate;
  if (!convHtml.includes('AW-18418775333/IzlhCL_QyIsdEKXq4M5E')) {
    convHtml = convHtml.replace('</head>', `${rawConversionSnippet}\n</head>`);
  }
  const convDir = path.join(distDir, route);
  fs.mkdirSync(convDir, { recursive: true });
  fs.writeFileSync(path.join(convDir, 'index.html'), convHtml, 'utf8');
}

console.log(`[PRERENDER] Successfully generated ${conversionRoutes.length} conversion confirmation pages in dist/!`);

