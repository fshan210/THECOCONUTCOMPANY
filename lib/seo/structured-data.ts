import { siteName, siteUrl } from "@/lib/seo/metadata";
import type { ContentProduct } from "@/lib/content/types";
import type { ContentJournalPost, ContentRecipe } from "@/lib/content/types";

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
    image: product.images.length ? product.images.map((image) => image.startsWith("http") ? image : `${siteUrl}${image}`) : [product.image.startsWith("http") ? product.image : `${siteUrl}${product.image}`],
    sku: product.slug,
    category: product.category,
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

export function recipeSchema(recipe: Pick<ContentRecipe, "title" | "description" | "image" | "time" | "difficulty" | "category" | "product" | "slug" | "ingredients" | "steps" | "prepTime" | "cookTime" | "servings" | "nutrition">) {
  const minutes = Number.parseInt(recipe.time, 10);
  const prepMinutes = Number.parseInt(recipe.prepTime, 10);
  const cookMinutes = Number.parseInt(recipe.cookTime, 10);
  const image = recipe.image.startsWith("http") ? recipe.image : `${siteUrl}${recipe.image}`;
  const path = `/recipes/${recipe.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: [image],
    url: `${siteUrl}${path}`,
    recipeCategory: recipe.category ?? recipe.difficulty,
    recipeIngredient: recipe.ingredients ?? [recipe.product],
    recipeInstructions: recipe.steps?.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step
    })),
    prepTime: Number.isFinite(prepMinutes) ? `PT${prepMinutes}M` : undefined,
    cookTime: Number.isFinite(cookMinutes) ? `PT${cookMinutes}M` : undefined,
    totalTime: Number.isFinite(minutes) ? `PT${minutes}M` : undefined,
    recipeYield: recipe.servings || undefined,
    nutrition: recipe.nutrition ? { "@type": "NutritionInformation", description: recipe.nutrition } : undefined,
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl
    },
    mainEntityOfPage: `${siteUrl}${path}`
  };
}

export function articleSchema(post: ContentJournalPost) {
  const path = post.seo.canonicalPath.startsWith("/journal/") ? post.seo.canonicalPath : `/journal#${post.slug}`;
  const image = post.image.startsWith("http") ? post.image : `${siteUrl}${post.image}`;

  const publishedDate = Number.isNaN(Date.parse(post.publishedDate)) ? undefined : new Date(post.publishedDate).toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [image],
    datePublished: publishedDate,
    dateModified: publishedDate,
    articleSection: post.category,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo.svg` }
    },
    mainEntityOfPage: `${siteUrl}${path}`
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };
}

export function personSchema(input: { name: string; jobTitle: string; image?: string; sameAs?: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    jobTitle: input.jobTitle,
    image: input.image ? (input.image.startsWith("http") ? input.image : `${siteUrl}${input.image}`) : undefined,
    worksFor: { "@type": "Organization", name: siteName, url: siteUrl },
    sameAs: input.sameAs?.length ? input.sameAs : undefined
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
