import { useEffect } from 'react';

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: any;
}

export function useSEO(config: SEOConfig) {
  useEffect(() => {
    const {
      title = "ECR Beach Resorts - Luxury Beach Resorts & Event Venues in India",
      description = "Discover luxury beach resorts, villas & event venues across India. Perfect for weddings, corporate events & vacations. 500+ verified properties.",
      keywords = "beach resorts, luxury villas, event venues, wedding venues, corporate events, vacation rentals",
      image = "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1200",
      url = "https://ecrbeachresorts.com",
      type = "website",
      structuredData
    } = config;

    // Update document title
    document.title = title;
    
    // Helper function to update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    
    // Update Twitter tags
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);
    updateMetaTag('twitter:url', url, true);
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
    
    // Add structured data if provided
    if (structuredData) {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Add new structured data
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-dynamic', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Remove dynamic structured data when component unmounts
      const dynamicScript = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]');
      if (dynamicScript) {
        dynamicScript.remove();
      }
    };
  }, [config]);
}

// SEO utilities
export const seoUtils = {
  // Generate breadcrumb structured data
  generateBreadcrumbs: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }),

  // Generate FAQ structured data
  generateFAQ: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }),

  // Generate review structured data
  generateReviews: (reviews: Array<{ rating: number; author: string; text: string; date: string }>) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "reviewBody": reviews[0]?.text,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": reviews[0]?.rating,
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": reviews[0]?.author
    },
    "datePublished": reviews[0]?.date
  }),

  // Clean text for SEO
  cleanText: (text: string, maxLength = 160) => {
    return text
      .replace(/[^\w\s-.,!?]/g, '') // Remove special characters
      .slice(0, maxLength)
      .trim();
  },

  // Generate slug from title
  generateSlug: (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
};