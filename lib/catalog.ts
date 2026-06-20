import { publicAssets } from "@/lib/public-assets";

export type ProductStatus = "coming-soon" | "preview";

export type ShopProduct = {
  slug: string;
  name: string;
  category: string;
  format: string;
  status: ProductStatus;
  image: string;
  hoverImage?: string;
  shortDescription: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string[];
  availability: string;
};

export const productCategories = ["Coconut Water", "Ice Cream", "Kitchen", "Botanica", "Wellness", "Lifestyle"];

export const shopProducts: ShopProduct[] = [
  {
    slug: "co-water",
    name: ".CO Water",
    category: "Coconut Water",
    format: "Chilled bottle",
    status: "coming-soon",
    image: publicAssets.water.floating,
    hoverImage: publicAssets.water.flatLay,
    shortDescription: "Tender coconut water with a clean, easy taste for everyday refreshment.",
    benefits: ["Clean coconut taste", "Best served chilled", "Easy everyday ritual"],
    ingredients: ["Tender coconut water"],
    howToUse: ["Serve cold", "Pour over ice", "Use in coolers, smoothies, and breakfast bowls"],
    availability: "Join early access for first tasting notes and product updates."
  },
  {
    slug: "melt-co-mango-coconut",
    name: "MELT.CO Mango Coconut",
    category: "Ice Cream",
    format: "Frozen dessert",
    status: "coming-soon",
    image: publicAssets.melt.hero,
    hoverImage: publicAssets.melt.flatLay,
    shortDescription: "A coconut-led frozen dessert with mango brightness and a smooth, sunny finish.",
    benefits: ["Coconut creaminess", "Mango-forward taste", "Dessert bowl friendly"],
    ingredients: ["Coconut base", "Mango", "Natural flavour"],
    howToUse: ["Keep frozen", "Rest briefly before scooping", "Serve with fruit, crumble, or on its own"],
    availability: "Join early access for flavor notes and first scoop updates."
  },
  {
    slug: "co-kitchen-coconut-oil",
    name: ".CO Kitchen Coconut Oil",
    category: "Kitchen",
    format: "Kitchen staple",
    status: "preview",
    image: publicAssets.ecosystem.kitchenHero,
    hoverImage: publicAssets.ecosystem.kitchenAlt,
    shortDescription: "A coconut kitchen staple for simple cooking, finishing, and everyday pantry use.",
    benefits: ["Kitchen-friendly", "Coconut aroma", "Daily pantry ritual"],
    ingredients: ["Coconut-derived oil"],
    howToUse: ["Use as directed on pack", "Try in cooking and finishing", "Store in a cool, dry place"],
    availability: "Product preview. Final pack details will be shared before release."
  },
  {
    slug: "co-botanica-coconut-care",
    name: ".CO Botanica Coconut Care",
    category: "Botanica",
    format: "Care preview",
    status: "preview",
    image: publicAssets.ecosystem.botanicaHero,
    hoverImage: publicAssets.ecosystem.botanicaAlt,
    shortDescription: "A gentle coconut-inspired care direction for body, hair, and shelf rituals.",
    benefits: ["Everyday care feel", "Coconut-inspired", "Simple usage mindset"],
    ingredients: ["Coconut-inspired care ingredients"],
    howToUse: ["Use only as directed on pack", "Patch-test care products", "Stop use if irritation occurs"],
    availability: "Product preview. No treatment or medical claims are made."
  },
  {
    slug: "co-lifestyle",
    name: ".CO Lifestyle",
    category: "Lifestyle",
    format: "Ritual objects",
    status: "preview",
    image: publicAssets.water.lifestyle,
    hoverImage: publicAssets.water.hero,
    shortDescription: "A warm collection of coconut-world objects, recipe ideas, and seasonal living notes.",
    benefits: ["Made for Living", "Giftable moments", "Coconut culture"],
    ingredients: ["Product-specific materials"],
    howToUse: ["Use according to each item", "Pair with recipes and product rituals", "Keep close to daily life"],
    availability: "Preview collection for the .CO world."
  }
];

export const recipes = [
  {
    slug: "coconut-mango-cooler",
    title: "Coconut Mango Cooler",
    category: "Coconut water drinks",
    time: "5 min",
    difficulty: "Easy",
    product: ".CO Water",
    image: publicAssets.recipes.cooler,
    description: "A bright mango and coconut water cooler for warm afternoons.",
    ingredients: ["Coconut water", "Mango", "Lime", "Ice"]
  },
  {
    slug: "tender-coconut-smoothie-bowl",
    title: "Tender Coconut Smoothie Bowl",
    category: "Smoothies",
    time: "10 min",
    difficulty: "Easy",
    product: ".CO Water",
    image: publicAssets.recipes.bowl,
    description: "A soft breakfast bowl with coconut water, fruit, and a calm morning rhythm.",
    ingredients: ["Coconut water", "Banana", "Seasonal fruit", "Coconut flakes"]
  },
  {
    slug: "coconut-coffee-chill",
    title: "Coconut Coffee Chill",
    category: "Coconut water drinks",
    time: "6 min",
    difficulty: "Easy",
    product: ".CO Water",
    image: publicAssets.recipes.coffee,
    description: "Cold coffee softened with coconut freshness for a simple cafe-style glass.",
    ingredients: ["Cold coffee", "Coconut water", "Ice", "Optional coconut cream"]
  }
];

export const usageDirections = [
  { title: "Drink", body: "Serve cold and keep it close for warm-day resets." },
  { title: "Scoop", body: "Let coconut-led dessert slow the evening down." },
  { title: "Cook", body: "Add a familiar coconut note to simple meals." },
  { title: "Care", body: "Keep routines gentle, clear, and easy to understand." }
];

export const communityNotes = [
  {
    label: "Taste note",
    note: "Clean coconut taste, not too loud, easy to drink cold.",
    source: "Early tasting table"
  },
  {
    label: "Home note",
    note: "It feels like something that belongs in the fridge, not just on a campaign page.",
    source: "Kitchen conversation"
  },
  {
    label: "Design note",
    note: "Warm, simple, and premium without becoming distant.",
    source: "Brand circle"
  }
];

export const socialStories = [
  "A brand close to coconut country",
  "Recipes from everyday homes",
  "Products that feel useful",
  "A warm shelf for modern living"
];
