import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSEO } from '../hooks/useSEO';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
}

export default function SEO({ title, description, keywords }: SEOProps) {
  const resolved = useSEO({ title, description, keywords });

  const keywordsString = Array.isArray(resolved.keywords)
    ? resolved.keywords.join(', ')
    : resolved.keywords || '';

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{resolved.title}</title>
      <meta name="description" content={resolved.description} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      <link rel="canonical" href={resolved.canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={resolved.ogType} />
      <meta property="og:title" content={resolved.ogTitle} />
      <meta property="og:description" content={resolved.ogDescription} />
      <meta property="og:image" content={resolved.ogImage} />
      <meta property="og:url" content={resolved.canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolved.ogTitle} />
      <meta name="twitter:description" content={resolved.ogDescription} />
      <meta name="twitter:image" content={resolved.ogImage} />
    </Helmet>
  );
}
