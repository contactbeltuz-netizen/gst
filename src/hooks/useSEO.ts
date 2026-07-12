import { useLocation } from "react-router-dom";
import { defaultSEO, pageSEOConfigs, SEOConfig } from "../config/seoConfig";

/**
 * A custom hook to dynamically resolve SEO metadata for the current page.
 * Merges default SEO values, route-specific SEO configurations, and manual component-level overrides.
 */
export function useSEO(overrides?: Partial<SEOConfig>): SEOConfig {
  const location = useLocation();
  const path = location.pathname;

  // Find standard route config (or fallback if dynamic route matching is needed)
  let matchedConfig = pageSEOConfigs[path];

  // If we are viewing a dynamic blog detail like "/blog/123"
  if (!matchedConfig && path.startsWith("/blog/")) {
    matchedConfig = pageSEOConfigs["/blog"];
  }

  const merged: SEOConfig = {
    title: overrides?.title || matchedConfig?.title || defaultSEO.title,
    description: overrides?.description || matchedConfig?.description || defaultSEO.description,
    keywords: overrides?.keywords || matchedConfig?.keywords || defaultSEO.keywords,
    ogTitle: overrides?.ogTitle || overrides?.title || matchedConfig?.ogTitle || matchedConfig?.title || defaultSEO.title,
    ogDescription: overrides?.ogDescription || overrides?.description || matchedConfig?.ogDescription || matchedConfig?.description || defaultSEO.description,
    ogImage: overrides?.ogImage || matchedConfig?.ogImage || defaultSEO.ogImage || "/seo_cover.png",
    ogType: overrides?.ogType || matchedConfig?.ogType || defaultSEO.ogType || "website",
    canonicalUrl: overrides?.canonicalUrl || matchedConfig?.canonicalUrl || `https://mygstsolution.com${path}`
  };

  return merged;
}
