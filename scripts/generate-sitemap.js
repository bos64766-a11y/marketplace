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

// Helper to add a URL entry with bidirectional hreflangs
function addUrlPair(uzPath, ruPath, changefreq, priority) {
  const locUz = `${DOMAIN}${uzPath}`;
  const locRu = `${DOMAIN}${ruPath}`;

  // 1. Uzbek Version
  xml += `  <url>
    <loc>${locUz}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="uz" href="${locUz}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${locRu}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${locUz}" />
  </url>
`;

  // 2. Russian Version
  xml += `  <url>
    <loc>${locRu}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="uz" href="${locUz}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${locRu}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${locUz}" />
  </url>
`;
}

// Add static pages
for (const p of staticPages) {
  const uzPath = p.path;
  const ruPath = p.path === '/' ? '/ru' : `/ru${p.path}`;
  addUrlPair(uzPath, ruPath, p.changefreq, p.priority);
}

// Add categories
for (const cat of categories) {
  const uzPath = `/catalog/${cat}`;
  const ruPath = `/ru/catalog/${cat}`;
  addUrlPair(uzPath, ruPath, 'weekly', '0.85');
}

// Add products
for (const slug of productSlugs) {
  const uzPath = `/product/${slug}`;
  const ruPath = `/ru/product/${slug}`;
  addUrlPair(uzPath, ruPath, 'weekly', '0.80');
}

xml += `</urlset>
`;

const outputPath = path.join(rootDir, 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`✓ Sitemap successfully generated at: ${outputPath} (${staticPages.length + categories.length + productSlugs.length} URLs)`);
