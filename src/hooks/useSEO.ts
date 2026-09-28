import { useEffect } from 'react';

export interface SEOBreadcrumb {
  name: string;
  item: string;
}

export interface SEOFAQItem {
  question: string;
  answer: string;
}

export interface SEOProductData {
  name: string;
  description?: string;
  image?: string;
  price: number;
  priceCurrency?: string; // default 'UZS'
  sku?: string;
  brand?: string;
  category?: string;
  inStock?: boolean;
  minOrder?: number;
  ratingValue?: number;
  reviewCount?: number;
}

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
  lang?: 'uz' | 'ru';
  product?: SEOProductData;
  breadcrumbs?: SEOBreadcrumb[];
  faqs?: SEOFAQItem[];
  schema?: Record<string, any>;
}

const DEFAULT_ORIGIN = 'https://snabtash.uz';
const DEFAULT_IMAGE = 'https://snabtash.uz/logo-horizontal.png';
const DEFAULT_TITLE = "SNABTASH — B2B Ta'minot va Ulgurji Savdo Platformasi";
const DEFAULT_DESC =
  "SNABTASH — O'zbekiston korxona va ofislari uchun maishiy kimyo, tozalash vositalari, kantselyariya va xo'jalik mollarining ulgurji savdosi. Toshkent bo'ylab tezkor yetkazib berish va B2B zayavka tizimi.";

function getOrCreateMeta(attrName: 'name' | 'property', attrValue: string): HTMLMetaElement {
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  return el;
}

function getOrCreateLink(rel: string, extraAttr?: { name: string; value: string }): HTMLLinkElement {
  let selector = `link[rel="${rel}"]`;
  if (extraAttr) {
    selector += `[${extraAttr.name}="${extraAttr.value}"]`;
  }
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (extraAttr) {
      el.setAttribute(extraAttr.name, extraAttr.value);
    }
    document.head.appendChild(el);
  }
  return el;
}

export function useSEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noindex = false,
  lang = 'uz',
  product,
  breadcrumbs,
  faqs,
  schema,
}: SEOProps) {
  useEffect(() => {
    const prevTitle = document.title;
    const resolvedTitle = title ? `${title} | SNABTASH` : DEFAULT_TITLE;
    const resolvedDesc = description || DEFAULT_DESC;
    const resolvedImage = image ? (image.startsWith('http') ? image : `${DEFAULT_ORIGIN}${image.startsWith('/') ? '' : '/'}${image}`) : DEFAULT_IMAGE;
    const currentPath = url || (typeof window !== 'undefined' ? window.location.pathname : '/');
    const resolvedUrl = currentPath.startsWith('http') ? currentPath : `${DEFAULT_ORIGIN}${currentPath.startsWith('/') ? '' : '/'}${currentPath}`;

    // 1. Page Title
    document.title = resolvedTitle;

    // 2. Primary Meta Tags
    getOrCreateMeta('name', 'title').setAttribute('content', resolvedTitle);
    getOrCreateMeta('name', 'description').setAttribute('content', resolvedDesc);

    if (keywords) {
      getOrCreateMeta('name', 'keywords').setAttribute('content', keywords);
    }

    // 3. Robots Directives
    const metaRobots = getOrCreateMeta('name', 'robots');
    if (noindex) {
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else {
      metaRobots.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // 4. Canonical URL & Hreflang
    const canonicalLink = getOrCreateLink('canonical');
    canonicalLink.setAttribute('href', resolvedUrl);

    const hreflangUz = getOrCreateLink('alternate', { name: 'hreflang', value: 'uz' });
    hreflangUz.setAttribute('href', resolvedUrl);

    const hreflangRu = getOrCreateLink('alternate', { name: 'hreflang', value: 'ru' });
    const ruUrl = resolvedUrl.includes('?') ? `${resolvedUrl}&lang=ru` : `${resolvedUrl}?lang=ru`;
    hreflangRu.setAttribute('href', ruUrl);

    const hreflangDefault = getOrCreateLink('alternate', { name: 'hreflang', value: 'x-default' });
    hreflangDefault.setAttribute('href', resolvedUrl);

    // 5. Open Graph (Facebook, Telegram, WhatsApp, LinkedIn)
    getOrCreateMeta('property', 'og:type').setAttribute('content', type);
    getOrCreateMeta('property', 'og:title').setAttribute('content', resolvedTitle);
    getOrCreateMeta('property', 'og:description').setAttribute('content', resolvedDesc);
    getOrCreateMeta('property', 'og:image').setAttribute('content', resolvedImage);
    getOrCreateMeta('property', 'og:url').setAttribute('content', resolvedUrl);
    getOrCreateMeta('property', 'og:site_name').setAttribute('content', 'SNABTASH B2B');
    getOrCreateMeta('property', 'og:locale').setAttribute('content', lang === 'ru' ? 'ru_RU' : 'uz_UZ');

    if (type === 'product' && product) {
      getOrCreateMeta('property', 'product:price:amount').setAttribute('content', String(product.price));
      getOrCreateMeta('property', 'product:price:currency').setAttribute('content', product.priceCurrency || 'UZS');
    }

    // 6. Twitter Card
    getOrCreateMeta('name', 'twitter:card').setAttribute('content', 'summary_large_image');
    getOrCreateMeta('name', 'twitter:title').setAttribute('content', resolvedTitle);
    getOrCreateMeta('name', 'twitter:description').setAttribute('content', resolvedDesc);
    getOrCreateMeta('name', 'twitter:image').setAttribute('content', resolvedImage);
    getOrCreateMeta('name', 'twitter:url').setAttribute('content', resolvedUrl);

    // 7. Schema.org JSON-LD Structured Data Injection for Google Rich Snippets
    const jsonLdGraph: any[] = [];

    // 7a. Product Schema (Google Merchant / Shopping Rich Snippet)
    if (product) {
      const productSchema: any = {
        '@type': 'Product',
        '@id': `${resolvedUrl}#product`,
        name: product.name,
        description: product.description || resolvedDesc,
        image: resolvedImage,
        sku: product.sku || undefined,
        brand: {
          '@type': 'Brand',
          name: product.brand || 'SNABTASH',
        },
        offers: {
          '@type': 'Offer',
          url: resolvedUrl,
          priceCurrency: product.priceCurrency || 'UZS',
          price: product.price,
          priceValidUntil: '2027-12-31',
          availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'SNABTASH B2B',
            url: DEFAULT_ORIGIN,
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'UZ',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 14,
            returnMethod: 'https://schema.org/ReturnByMail',
          },
        },
      };

      if (product.ratingValue) {
        productSchema.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: product.ratingValue,
          reviewCount: product.reviewCount || 1,
        };
      }

      jsonLdGraph.push(productSchema);
    }

    // 7b. BreadcrumbList Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbListSchema = {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.item.startsWith('http') ? b.item : `${DEFAULT_ORIGIN}${b.item.startsWith('/') ? '' : '/'}${b.item}`,
        })),
      };
      jsonLdGraph.push(breadcrumbListSchema);
    }

    // 7c. FAQPage Schema (Interactive Google Search Accordions)
    if (faqs && faqs.length > 0) {
      const faqSchema = {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      };
      jsonLdGraph.push(faqSchema);
    }

    // 7d. Custom schema provided by page
    if (schema) {
      jsonLdGraph.push(schema);
    }

    // Inject or update the script tag
    const scriptId = 'snabtash-dynamic-seo-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLdGraph.length > 0) {
      const schemaData = {
        '@context': 'https://schema.org',
        '@graph': jsonLdGraph,
      };

      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaData);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      document.title = prevTitle;
      const cleanScript = document.getElementById(scriptId);
      if (cleanScript) {
        cleanScript.remove();
      }
    };
  }, [title, description, keywords, image, url, type, noindex, lang, product, breadcrumbs, faqs, schema]);
}
