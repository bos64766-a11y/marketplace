import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noindex?: boolean;
}

export function useSEO({ title, description, keywords, image, noindex }: SEOProps) {
  useEffect(() => {
    // 1. Title
    const prevTitle = document.title;
    if (title) {
      document.title = `${title} | SNABTASH`;
    } else {
      document.title = "SNABTASH — B2B Ta'minot va Ulgurji Savdo Platformasi";
    }

    // 2. Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const prevDesc = metaDesc.getAttribute('content') || '';
    if (description) {
      metaDesc.setAttribute('content', description);
    }

    // 3. Open Graph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) {
      ogTitle.setAttribute('content', `${title} | SNABTASH`);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) {
      ogDesc.setAttribute('content', description);
    }

    // 4. Open Graph Image
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg && image) {
      ogImg.setAttribute('content', image);
    }

    // 5. Robots
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else if (metaRobots) {
      metaRobots.setAttribute('content', 'index, follow, max-image-preview:large');
    }

    // 6. Keywords
    if (keywords) {
      const metaKw = document.querySelector('meta[name="keywords"]');
      if (metaKw) {
        metaKw.setAttribute('content', keywords);
      }
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute('content', prevDesc);
      }
    };
  }, [title, description, keywords, image, noindex]);
}
