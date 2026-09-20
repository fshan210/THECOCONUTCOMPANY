import { siteName, siteUrl } from "@/lib/seo/metadata";
import type { ContentProduct } from "@/lib/content/types";
import type { ContentJournalPost, ContentRecipe } from "@/lib/content/types";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    alternateName: [".CO", "The Coconut Company"],
    slogan: "Made for Living.",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.svg`,
    description: "A coconut-origin food and beverage brand from Palakkad, Kerala.",
    brand: {
      "@type": "Brand",
      name: siteName,
      alternateName: ".CO",
      url: siteUrl,
      logo: `${siteUrl}/images/logo.svg`
    }
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    description: "A modern coconut-origin lifestyle brand. Made for Living.",
    inLanguage: "en-IN",
    publisher: {
      "@id": `${siteUrl}/#organization`
    }
  };
}

export function siteNavigationSchema() {
  const items = [
    ["Home", "/"], ["Shop", "/shop"], ["Recipes", "/recipes"], ["Journal", "/journal"],
    ["Sustainability", "/sustainability"], ["Founders", "/founders"], ["About", "/about"], ["Contact", "/contact"], ["FAQ", "/faqs"]
  ];
  return {
    "@context": "https://schema.org", "@type": "ItemList", name: ".CO primary site navigation",
    itemListElement: items.map(([name,path],index)=>({ "@type":"SiteNavigationElement", position:index+1, name, url:`${siteUrl}${path}` }))
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  const pageUrl = `${siteUrl}${items.at(-1)?.path ?? "/"}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
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
  const url = `${siteUrl}/shop/${product.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.shortDescription,
    image: product.images.length ? product.images.map((image) => image.startsWith("http") ? image : `${siteUrl}${image}`) : [product.image.startsWith("http") ? product.image : `${siteUrl}${product.image}`],
    sku: product.slug,
    category: product.category,
    brand: { "@type": "Brand", name: siteName },
    offers: {
      "@type": "Offer",
      url,
      price: product.price,
      priceCurrency: product.currency,
      availability: product.availabilityStatus === "in-stock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };
}

export function recipeSchema(recipe: Pick<ContentRecipe, "title" | "description" | "image" | "time" | "difficulty" | "category" | "product" | "slug" | "ingredients" | "steps" | "prepTime" | "cookTime" | "servings" | "nutrition">) {
  if (!recipe.title || !recipe.description || !recipe.image || !recipe.ingredients?.length || !recipe.steps?.length) return null;
  const minutes = Number.parseInt(recipe.time, 10);
  const image = recipe.image.startsWith("http") ? recipe.image : `${siteUrl}${recipe.image}`;
  const path = `/recipes/${recipe.slug}`;
  const url = `${siteUrl}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "@id": `${url}#recipe`,
    name: recipe.title,
    description: recipe.description,
    image: [image],
    url,
    recipeCategory: recipe.category ?? recipe.difficulty,
    recipeIngredient: recipe.ingredients ?? [recipe.product],
    recipeInstructions: recipe.steps?.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step
    })),
    totalTime: Number.isFinite(minutes) ? `PT${minutes}M` : undefined,
    recipeYield: recipe.servings || undefined,
    publisher: {
      "@id": `${siteUrl}/#organization`
    },
    mainEntityOfPage: url
  };
}

export function articleSchema(post: ContentJournalPost) {
  if (!post.seo.canonicalPath.startsWith("/journal/")) return null;
  const path = post.seo.canonicalPath;
  const image = post.image.startsWith("http") ? post.image : `${siteUrl}${post.image}`;

  const publishedDate = Number.isNaN(Date.parse(post.publishedDate)) ? undefined : new Date(post.publishedDate).toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteUrl}${path}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [image],
    datePublished: publishedDate,
    articleSection: post.category,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@id": `${siteUrl}/#organization`
    },
    mainEntityOfPage: `${siteUrl}${path}`
  };
}

export function faqSchema(items: ReadonlyArray<{ question: string; answer: string }>, path = "/") {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}${path}#faq`,
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
  items?: Array<{ name: string; description: string; image: string; path: string }>;
}) {
  const url = `${siteUrl}${input.path}`;
  const items = input.items ?? [];

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name: input.name,
    description: input.description,
    url,
    mainEntity: items.length ? {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: item.name,
          description: item.description,
          image: item.image.startsWith("http") ? item.image : `${siteUrl}${item.image}`,
          url: `${siteUrl}${item.path}`
        }
      }))
    } : undefined
  };
}
