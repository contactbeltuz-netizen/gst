export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string | string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

export const defaultSEO: SEOConfig = {
  title: "MyGST Solution | Premier GST Advisory & Compliance Partner",
  description: "End-to-end GST registration, filing, annual audits, notice representation, and compliance management for SMEs and Startups across India.",
  keywords: [
    "GST consultant",
    "GST advisory India",
    "MyGST Solution",
    "tax consultant",
    "business GST India",
    "GST registration online",
    "GST filing service",
    "GST compliance partner"
  ]
};

export const pageSEOConfigs: Record<string, Partial<SEOConfig>> = {
  "/": {
    title: "MyGST Solution | Premier GST Advisory & Compliance Partner",
    description: "End-to-end GST registration, filing, annual audits, notice representation, and compliance management for SMEs and Startups across India.",
    keywords: [
      "GST consultant",
      "GST advisory India",
      "MyGST Solution",
      "tax consultant",
      "business GST India",
      "GST registration online",
      "GST filing service"
    ]
  },
  "/services": {
    title: "GST Consulting Services | MyGST Solution",
    description: "Expert GST advisory and processing services for SMEs, Startups, and Large Enterprises. Registration, Audits, Filing, and notice representation.",
    keywords: [
      "GST advisory service",
      "GST registration India",
      "GSTR filing assistance",
      "GST notice drafting",
      "GST annual audit helper",
      "GST corporate compliance"
    ]
  },
  "/about": {
    title: "About Us | MyGST Solution",
    description: "Learn more about MyGST Solution, our mission, our professional tax consultants, and why we are India's trusted compliance partner.",
    keywords: [
      "about MyGST Solution",
      "GST advisory company",
      "legal tax consultants",
      "India tax experts",
      "corporate compliance team"
    ]
  },
  "/contact": {
    title: "Contact GST Consultants | MyGST Solution",
    description: "Get in touch with top tax professionals. Schedule a consultation or query resolution regarding professional tax, notice audits, and GST.",
    keywords: [
      "contact GST expert",
      "GST consultation phone number",
      "tax advisory contact",
      "MyGST office details"
    ]
  },
  "/blog": {
    title: "Blog - Latest GST Updates & Compliance Advisories | MyGST Solution",
    description: "Stay updated with the latest GST rules, compliance strategies, and legal insights from our expert consultants to keep your business penalty-free.",
    keywords: [
      "GST updates blog",
      "recent GST notifications",
      "GST circular clarification",
      "compliance insights",
      "tax legal advice India",
      "GST blog India"
    ]
  },
  "/gst-calculator": {
    title: "Free GST Calculator Tool | MyGST Solution",
    description: "Calculate CGST, SGST, IGST amount instantly with our free online calculator. Accurate and easy computation with flexible slab rates (5%, 12%, 18%, 28%).",
    keywords: [
      "online GST calculator",
      "calculate CGST SGST",
      "IGST tax computation",
      "free GST tax tool",
      "input tax credit calculator"
    ]
  },
  "/hsn-code-finder": {
    title: "HSN Code & GST Rate Finder Tool | MyGST Solution",
    description: "Search HSN and SAC codes easily to find applicable GST rates for products and services. Fast lookup tool for Indian businesses.",
    keywords: [
      "HSN code lookup",
      "SAC code rate finder",
      "GST tax slab search",
      "find HSN code products",
      "service tax SAC search"
    ]
  },
  "/login": {
    title: "Admin & Member Login | MyGST Solution",
    description: "Login securely to access the administrative dashboard, post compliance advisory blogs, or view regional programmatic SEO keywords.",
    keywords: ["admin portal login", "staff GST access", "member dashboard login"]
  },
  "/client-portal": {
    title: "Client Portal | MyGST Solution",
    description: "Manage your corporate GST compliance status, check pending invoices, upload required filings, and review advisor communications safely.",
    keywords: ["client portal login", "GST customer dashboard", "secure filing hub"]
  }
};
