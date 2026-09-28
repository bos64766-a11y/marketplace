import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DOMAIN = 'https://snabtash.uz';
const TODAY = new Date().toISOString().split('T')[0];

// Static High Priority Pages
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/catalog', priority: '0.95', changefreq: 'daily' },
  { path: '/delivery-payment', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.75', changefreq: 'monthly' },
  { path: '/contacts', priority: '0.75', changefreq: 'monthly' },
  { path: '/request', priority: '0.7', changefreq: 'monthly' },
];

// Categories
const categories = [
  'maishiy-kimyo',
  'xojalikmollari',
  'kanselyariya',
  'gigiyena',
  'himoya-vositalari',
  'avtokimyo',
];

// Read products file to extract slugs
const productsFilePath = path.join(rootDir, 'src', 'data', 'products.ts');
let productSlugs = [];

try {
  const content = fs.readFileSync(productsFilePath, 'utf8');
  const slugMatches = content.matchAll(/"slug":\s*"([^"]+)"/g);
  for (const match of slugMatches) {
    if (match[1] && !productSlugs.includes(match[1])) {
      productSlugs.push(match[1]);
    }
  }
} catch (err) {
  console.warn('Could not parse products for sitemap:', err);
}

console.log(`Generating sitemap with ${staticPages.length} static pages, ${categories.length} categories, and ${productSlugs.length} products...`);

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

// Add static pages
for (const p of staticPages) {
  const loc = `${DOMAIN}${p.path}`;
  const ruLoc = p.path === '/' ? `${DOMAIN}/?lang=ru` : `${DOMAIN}${p.path}?lang=ru`;
  xml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="uz" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${ruLoc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />
  </url>
`;
}

// Add categories
for (const cat of categories) {
  const loc = `${DOMAIN}/catalog/${cat}`;
  const ruLoc = `${loc}?lang=ru`;
  xml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
    <xhtml:link rel="alternate" hreflang="uz" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${ruLoc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />
  </url>
`;
}

// Add products
for (const slug of productSlugs) {
  const loc = `${DOMAIN}/product/${slug}`;
  const ruLoc = `${loc}?lang=ru`;
  xml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
    <xhtml:link rel="alternate" hreflang="uz" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${ruLoc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />
  </url>
`;
}

xml += `</urlset>
`;

const outputPath = path.join(rootDir, 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`✓ Sitemap successfully generated at: ${outputPath} (${staticPages.length + categories.length + productSlugs.length} URLs)`);
