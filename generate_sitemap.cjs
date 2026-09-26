const fs = require('fs');
const path = require('path');

// Read articles directly from articles.js
const articlesFile = fs.readFileSync(path.join(__dirname, 'src/data/journal/articles.js'), 'utf8');

// Extract slugs
const matchSlugs = [...articlesFile.matchAll(/slugs:\s*\{([^}]+)\}/g)];
const articlesList = matchSlugs.map((m) => {
  const inner = m[1];
  const fr = inner.match(/fr:\s*['"]([^'"]+)['"]/)?.[1];
  const en = inner.match(/en:\s*['"]([^'"]+)['"]/)?.[1];
  const es = inner.match(/es:\s*['"]([^'"]+)['"]/)?.[1];
  const ar = inner.match(/ar:\s*['"]([^'"]+)['"]/)?.[1];
  return { fr, en, es, ar };
});

const BASE_URL = 'https://www.selyprive.com';
const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Core Commercial Pages -->
  <url>
    <loc>${BASE_URL}/paris</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/paris/vehicules</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/paris/excellence</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/paris/reserver</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/paris/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/paris/mentions-legales</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${BASE_URL}/paris/politique-de-confidentialite</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Le Journal Hub Pages (FR, EN, ES, AR) -->
  <url>
    <loc>${BASE_URL}/fr/journal</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}/fr/journal" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/journal" />
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es/journal" />
    <xhtml:link rel="alternate" hreflang="ar" href="${BASE_URL}/ar/journal" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/fr/journal" />
  </url>
  <url>
    <loc>${BASE_URL}/en/journal</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}/fr/journal" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/journal" />
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es/journal" />
    <xhtml:link rel="alternate" hreflang="ar" href="${BASE_URL}/ar/journal" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/fr/journal" />
  </url>
  <url>
    <loc>${BASE_URL}/es/journal</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}/fr/journal" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/journal" />
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es/journal" />
    <xhtml:link rel="alternate" hreflang="ar" href="${BASE_URL}/ar/journal" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/fr/journal" />
  </url>
  <url>
    <loc>${BASE_URL}/ar/journal</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}/fr/journal" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/journal" />
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es/journal" />
    <xhtml:link rel="alternate" hreflang="ar" href="${BASE_URL}/ar/journal" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/fr/journal" />
  </url>
`;

// Add each article with cross-language hreflangs
articlesList.forEach((art) => {
  const langs = ['fr', 'en', 'es', 'ar'];
  langs.forEach((lang) => {
    const slug = art[lang];
    if (!slug) return;
    const loc = `${BASE_URL}/${lang}/journal/${slug}`;

    xml += `
  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}/fr/journal/${art.fr}" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/journal/${art.en}" />
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es/journal/${art.es}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${BASE_URL}/ar/journal/${art.ar}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/fr/journal/${art.fr}" />
  </url>`;
  });
});

xml += `
</urlset>
`;

fs.writeFileSync(path.join(__dirname, 'public/sitemap.xml'), xml.trim());
console.log('Successfully generated public/sitemap.xml with', articlesList.length * 4 + 11, 'indexed URLs.');
