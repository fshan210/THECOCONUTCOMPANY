import { recipes, shopProducts } from "@/lib/catalog";
import { journalEntries } from "@/lib/content";
import type {
  ContentJournalPost,
  ContentProduct,
  ContentRecipe,
  ContentTestimonial,
  HomepageContent,
  SeoMetadataContent
} from "@/lib/content/types";

export const fallbackProducts: ContentProduct[] = shopProducts.map((product, index) => ({
  id: product.slug,
  ...product,
  subtitle: product.format,
  longDescription: product.shortDescription,
  currency: "INR",
  availabilityStatus: product.status,
  comingSoon: product.status === "coming-soon",
  images: [product.image, ...(product.hoverImage ? [product.hoverImage] : [])],
  nutritionHighlights: [],
  seo: {
    title: product.name,
    description: product.shortDescription,
    canonicalPath: `/shop/${product.slug}`,
    ogImage: product.image
  },
  publicationStatus: "published",
  featured: index < 3
}));

export const fallbackRecipes: ContentRecipe[] = recipes.map((recipe, index) => ({
  id: recipe.slug,
  ...recipe,
  steps: [],
  prepTime: recipe.time,
  cookTime: "",
  servings: "",
  relatedProduct: recipe.product,
  seo: {
    title: recipe.title,
    description: recipe.description,
    canonicalPath: `/recipes#${recipe.slug}`,
    ogImage: recipe.image
  },
  publicationStatus: "published",
  featured: index === 0
}));

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const fallbackJournalPosts: ContentJournalPost[] = journalEntries.map((entry) => {
  const slug = toSlug(entry.title);
  return {
    id: slug,
    slug,
    ...entry,
    body: entry.excerpt,
    author: ".CO Editorial",
    publishedDate: entry.date,
    seo: {
      title: entry.title,
      description: entry.excerpt,
      canonicalPath: `/journal#${slug}`,
      ogImage: entry.image
    },
    publicationStatus: "published"
  };
});

export const fallbackTestimonials: ContentTestimonial[] = [
  { id: "early-taster", quote: "It tastes like real tender coconut, not a packaged drink.", name: "Early Taster", role: "Taster", source: "Early tasting table", featured: true, publicationStatus: "published" },
  { id: "retail-partner", quote: "The brand feels premium but still rooted in Kerala.", name: "Retail Partner", role: "Retail", source: "Partner feedback", featured: true, publicationStatus: "published" },
  { id: "wellness-customer", quote: "Clean, simple, and perfect straight from the fridge.", name: "Wellness Customer", role: "Customer", source: "Customer feedback", featured: true, publicationStatus: "published" },
  { id: "distributor-feedback", quote: "The kind of coconut brand I would expect to see internationally.", name: "Distributor Feedback", role: "Distributor", source: "Distributor feedback", featured: true, publicationStatus: "published" }
];

export const fallbackHomepage: HomepageContent = {
  id: "homepage",
  heroEyebrow: "Tender coconut water from Kerala",
  heroHeadline: ["Nature's", "hydration.", ".CO by", "nature."],
  heroSubheadline: "Tender coconut water with a clean Kerala origin story. Cold ritual. Real goodness. Fridge shelf ready.",
  heroCtaText: "Shop Now",
  heroCtaLink: "/shop",
  secondaryCtaText: "Explore Story",
  secondaryCtaLink: "/about",
  trustBadges: [
    { icon: "leaf", title: "100% Natural", body: "Real coconut taste." },
    { icon: "drop", title: "Nothing Added", body: "Clean and simple." },
    { icon: "cold", title: "Fridge Shelf Ready", body: "Best served cold." }
  ],
  groveStages: ["Coconut", "Coconut water", ".CO bottle"],
  featuredProductSlugs: fallbackProducts.filter((item) => item.featured).map((item) => item.slug),
  featuredRecipeSlugs: fallbackRecipes.slice(0, 3).map((item) => item.slug),
  featuredTestimonialIds: fallbackTestimonials.map((item) => item.id),
  seo: {
    title: ".CO | The Coconut Company",
    description: "A modern coconut-origin lifestyle brand from Palakkad, Kerala. Made for Living.",
    canonicalPath: "/"
  },
  publicationStatus: "published"
};

export const fallbackSeoMetadata: SeoMetadataContent[] = [
  fallbackHomepage.seo,
  { title: "Shop", description: "Explore .CO coconut water, ice cream, kitchen, botanica, wellness and lifestyle previews.", canonicalPath: "/shop" },
  { title: "Recipes", description: "Coconut water drinks, smoothie bowls, and simple everyday recipes using .CO products.", canonicalPath: "/recipes" },
  { title: "Journal", description: "Editorial notes on coconut culture, taste, recipes, product thinking, and Made for Living.", canonicalPath: "/journal" }
].map((seo) => ({ id: seo.canonicalPath === "/" ? "home" : seo.canonicalPath.slice(1), pagePath: seo.canonicalPath, ...seo, publicationStatus: "published" }));
