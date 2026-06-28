import { siteName, siteUrl } from "@/lib/seo/metadata";
import type { ShopProduct } from "@/lib/catalog";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    alternateName: [".CO", "The Coconut Company"],
    slogan: "Made for Living.",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.svg`,
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
    inLanguage: "en"
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

export function productSchemaPlaceholder() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: ".CO coconut product range",
    brand: {
      "@type": "Brand",
      name: siteName
    }
  };
}

export function articleSchemaPlaceholder() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ".CO coconut culture and product notes",
    publisher: organizationSchema()
  };
}

export function productSchema(product: ShopProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: {
      "@type": "Brand",
      name: siteName
    },
    category: product.category,
    description: product.shortDescription,
    image: `${siteUrl}${product.image}`,
    url: `${siteUrl}/shop/${product.slug}`,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/PreOrder",
      priceCurrency: "INR",
      url: `${siteUrl}/shop/${product.slug}`
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
    publisher: organizationSchema()
  };
}
