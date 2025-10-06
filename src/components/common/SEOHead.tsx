import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: any;
}

export function SEOHead({
  title = "ECR Beach Resorts - Luxury Beach Resorts & Event Venues in India",
  description = "Discover luxury beach resorts, villas & event venues across India. Perfect for weddings, corporate events & vacations. 500+ verified properties. Best price guarantee.",
  keywords = "beach resorts, luxury villas, event venues, wedding venues, corporate events, vacation rentals, Goa resorts, Kerala backwaters, Udaipur hotels",
  image = "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1200",
  url = "https://ecrbeachresorts.com",
  type = "website",
  structuredData
}: SEOHeadProps) {
  
  React.useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
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
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, image, url, type, structuredData]);

  return null; // This component doesn't render anything
}

// Property-specific SEO data generator
export const generatePropertySEO = (property: any) => {
  const minPrice = Math.min(...property.room_types.map((r: any) => r.price_per_night));
  
  return {
    title: `${property.title} - ${property.city} | ECR Beach Resorts`,
    description: `Book ${property.title} in ${property.city}. ${property.description.slice(0, 120)}... Starting from ₹${minPrice.toLocaleString()}/night. Instant confirmation.`,
    keywords: `${property.title}, ${property.city} hotels, ${property.state} resorts, ${property.amenities.join(', ')}, beach resort booking`,
    image: property.images[0],
    url: `https://ecrbeachresorts.com/property/${property.id}`,
    type: 'product' as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": property.title,
      "description": property.description,
      "image": property.images,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.address,
        "addressLocality": property.city,
        "addressRegion": property.state,
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": property.geo?.lat || 0,
        "longitude": property.geo?.lng || 0
      },
      "amenityFeature": property.amenities.map((amenity: string) => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity
      })),
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": minPrice,
        "availability": "https://schema.org/InStock"
      },
      "checkinTime": property.check_in_time,
      "checkoutTime": property.check_out_time,
      "starRating": {
        "@type": "Rating",
        "ratingValue": "4.8"
      }
    }
  };
};

// Search results SEO data generator
export const generateSearchSEO = (searchQuery: any, resultsCount: number) => {
  const eventName = searchQuery.selectedEvent ? 
    mockEvents.find((e: any) => e.id === searchQuery.selectedEvent)?.name || 'Events' : 
    'Properties';
    
  return {
    title: `${eventName} Venues & Properties | ECR Beach Resorts - ${resultsCount} Results`,
    description: `Find perfect ${eventName.toLowerCase()} venues and properties. ${resultsCount} verified options available. Best prices, instant booking, 24/7 support.`,
    keywords: `${eventName.toLowerCase()} venues, event properties, ${eventName} booking, luxury venues India`,
    url: `https://ecrbeachresorts.com/search?event=${searchQuery.selectedEvent}&checkin=${searchQuery.checkIn}&checkout=${searchQuery.checkOut}`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SearchResultsPage",
      "name": `${eventName} Venues Search Results`,
      "description": `Search results for ${eventName.toLowerCase()} venues and properties`,
      "numberOfItems": resultsCount
    }
  };
};

// Import mock events for SEO
const mockEvents = [
  { id: '1', name: 'Wedding', description: 'Perfect venues for your special day' },
  { id: '2', name: 'Corporate Event', description: 'Professional spaces for business gatherings' },
  { id: '3', name: 'Birthday Party', description: 'Celebrate in style with our party venues' },
  { id: '4', name: 'Anniversary', description: 'Romantic settings for milestone celebrations' },
  { id: '5', name: 'Conference', description: 'Modern facilities for conferences and seminars' },
  { id: '6', name: 'Workshop', description: 'Interactive spaces for learning and development' },
  { id: '7', name: 'Reunion', description: 'Comfortable venues for family and friend gatherings' },
  { id: '8', name: 'Product Launch', description: 'Impressive venues for product presentations' }
];