import { publicAssets } from "@/lib/public-assets";

export const products = [
  {
    name: ".CO Water",
    role: "Tender coconut water",
    detail: "Clean, bright coconut water for breakfast tables, sunny commutes, post-walk resets, and fridge-door rituals.",
    image: publicAssets.water.floating,
    hoverImage: publicAssets.water.flatLay
  },
  {
    name: "MELT.CO",
    role: "Coconut ice cream",
    detail: "A creamy coconut-led frozen treat for slow evenings, dessert bowls, and warm-day spoons.",
    image: publicAssets.melt.hero,
    hoverImage: publicAssets.melt.flatLay
  },
  {
    name: ".CO Kitchen",
    role: "Coconut pantry",
    detail: "Simple coconut kitchen staples for cooking, finishing, and adding a familiar tropical note to everyday food.",
    image: publicAssets.ecosystem.kitchenHero,
    hoverImage: publicAssets.ecosystem.kitchenAlt
  },
  {
    name: ".CO Botanica",
    role: "Coconut care",
    detail: "Gentle coconut-inspired care ideas for everyday wash, body, and shelf rituals.",
    image: publicAssets.ecosystem.botanicaHero,
    hoverImage: publicAssets.ecosystem.botanicaAlt
  },
  {
    name: ".CO Lifestyle",
    role: "Made for Living",
    detail: "Small coconut-world objects, recipes, and seasonal drops that make the brand feel at home.",
    image: publicAssets.water.lifestyle,
    hoverImage: publicAssets.water.hero
  }
];

export const journalEntries = [
  {
    title: "Why Coconut Feels Like Home",
    category: "Origins",
    excerpt: "A short note on taste, memory, shade, kitchens, and the quiet comfort of coconut in everyday life.",
    image: publicAssets.campaign.groveOrigin,
    date: "May 10",
    readTime: "4 min read",
    featured: true
  },
  {
    title: "Made for Living",
    category: "Brand",
    excerpt: "How .CO thinks about useful products, warm design, clean labels, and rituals that fit real days.",
    image: publicAssets.brand.madeForLiving,
    date: "May 02",
    readTime: "3 min read",
    featured: false
  },
  {
    title: "A Better Coconut Water Moment",
    category: "Wellness",
    excerpt: "What makes a chilled coconut water feel clean, refreshing, balanced, and easy to come back to.",
    image: publicAssets.water.flatLay,
    date: "Apr 25",
    readTime: "3 min read",
    featured: false
  },
  {
    title: "Cooking With Coconut",
    category: "Recipes",
    excerpt: "Gentle pantry ideas for breakfast bowls, desserts, curries, coolers, and small hosting moments.",
    image: publicAssets.recipes.riceBowl,
    date: "Apr 12",
    readTime: "5 min read",
    featured: false
  },
  {
    title: "What Thoughtful Processing Looks Like",
    category: "Behind .CO",
    excerpt: "A clear, human look at the care between a harvested coconut and a finished product.",
    image: publicAssets.campaign.processingBottling,
    date: "Mar 28",
    readTime: "4 min read",
    featured: false
  },
  {
    title: "Sustainability Is How We Grow",
    category: "Sustainability",
    excerpt: "Why practical sourcing, careful handling, and less waste matter more than loud promises.",
    image: publicAssets.campaign.sustainabilityHands,
    date: "Mar 20",
    readTime: "4 min read",
    featured: false
  }
];

export const timeline = [
  {
    year: "01",
    title: "Kerala roots",
    detail: "The story starts close to coconut trees, household rituals, and the everyday taste of tender coconut."
  },
  {
    year: "02",
    title: "Coconut-first products",
    detail: "Every .CO product begins with a clear coconut use case: drink, scoop, cook, care, or share."
  },
  {
    year: "03",
    title: "Made for Living",
    detail: "The brand is built for ordinary moments: a cold bottle, a simple bowl, a clean shelf, a familiar recipe."
  }
];

export const impactMetrics = [
  { label: "Coconut first", value: "1", detail: "One ingredient family, many daily rituals" },
  { label: "Simple labels", value: "3", detail: "Taste, texture, and clarity before claims" },
  { label: "Local mindset", value: "100%", detail: "Rooted in Kerala coconut culture" },
  { label: "Useful formats", value: "5", detail: "Drink, dessert, kitchen, care, lifestyle" }
];
