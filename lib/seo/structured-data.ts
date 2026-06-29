import { siteName, siteUrl } from "@/lib/seo/metadata";
import type { ContentProduct } from "@/lib/content/types";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    alternateName: [".CO", "The Coconut Company"],
    slogan: "Made for Living.",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.svg`,
    description: "A coconut-origin food and beverage brand from Palakkad, Kerala.",
    founder: [
      {
        "@type": "Person",
        name: "Fazil Shersha",
        jobTitle: "Co-founder"
      },
      {
        "@type": "Person",
        name: "Afsala Muthali",
        jobTitle: "Co-founder"
      }
    ],
    brand: {
      "@type": "Brand",
      name: siteName,
      alternateName: ".CO",
      url: siteUrl,
      logo: `${siteUrl}/images/logo.svg`
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${siteUrl}/contact`,
      availableLanguage: ["English"]
    },
    foundingLocation: {
      "@type": "Place",
      name: "Palakkad, Kerala, India"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Palakkad",
      addressRegion: "Kerala",
      addressCountry: "IN"
    },
    sameAs: [
      "https://www.instagram.com/cothecoconutcompany",
      "https://www.linkedin.com/company/dotcolife"
    ]
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: "A modern coconut-origin lifestyle brand. Made for Living.",
    inLanguage: "en-IN",
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl
    }
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`
    }))
  };
}

export function productSchema(product: ContentProduct) {
  if (typeof product.price !== "number" || !product.currency || !["in-stock", "out-of-stock"].includes(product.availabilityStatus)) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.length ? product.images.map((image) => `${siteUrl}${image}`) : [`${siteUrl}${product.image}`],
    sku: product.slug,
    brand: { "@type": "Brand", name: siteName },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/shop/${product.slug}`,
      price: product.price,
      priceCurrency: product.currency,
      availability: product.availabilityStatus === "in-stock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };
}

export function recipeSchema(recipe: {
  title: string;
  description: string;
  image: string;
  time: string;
  difficulty: string;
  category?: string;
  product: string;
  slug: string;
  ingredients?: string[];
}) {
  const minutes = Number.parseInt(recipe.time, 10);

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: `${siteUrl}${recipe.image}`,
    url: `${siteUrl}/recipes#${recipe.slug}`,
    recipeCategory: recipe.category ?? recipe.difficulty,
    recipeIngredient: recipe.ingredients ?? [recipe.product],
    totalTime: Number.isFinite(minutes) ? `PT${minutes}M` : undefined,
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl
    },
    mainEntityOfPage: `${siteUrl}/recipes#${recipe.slug}`
  };
}

export function collectionPageSchema(input: {
  name: string;
  description: string;
  path: string;
  items: Array<{ name: string; description: string; image: string }>;
}) {
  const url = `${siteUrl}${input.path}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: input.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: item.name,
          description: item.description,
          image: `${siteUrl}${item.image}`,
          url: `${url}#latest-articles`
        }
      }))
    }
  };
}
