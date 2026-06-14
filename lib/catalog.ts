export type ProductStatus = "coming-soon" | "future";

export type ShopProduct = {
  slug: string;
  name: string;
  category: string;
  format: string;
  status: ProductStatus;
  image: string;
  shortDescription: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string[];
  availability: string;
};

export const productCategories = [
  "Coconut Water",
  "Frozen Desserts",
  "Kitchen",
  "Botanica",
  "Wellness",
  "Lifestyle"
];

export const shopProducts: ShopProduct[] = [
  {
    slug: "co-water",
    name: ".CO Water",
    category: "Coconut Water",
    format: "330 ml PET bottle",
    status: "coming-soon",
    image: "/assets/transparent/co-water.webp",
    shortDescription: "Tender coconut water designed for everyday hydration, hospitality, and modern retail rituals.",
    benefits: ["Clean coconut taste", "Chilled daily ritual", "Hospitality-ready format"],
    ingredients: ["Tender coconut water"],
    howToUse: ["Serve chilled", "Pair with breakfast, travel, training, or afternoon resets", "Use in mocktails and smoothies"],
    availability: "Launching soon. Early access and distributor enquiries are open."
  },
  {
    slug: "melt-co-mango-coconut",
    name: "MELT.CO Mango Coconut",
    category: "Frozen Desserts",
    format: "300-350 ml tub",
    status: "coming-soon",
    image: "/assets/transparent/mango-coconut-dessert.webp",
    shortDescription: "A coconut-based frozen dessert expression built around mango, creaminess, and clean indulgence.",
    benefits: ["Coconut-led creaminess", "Tropical dessert ritual", "Cafe and home-ready format"],
    ingredients: ["Coconut base", "Mango", "Natural flavour system"],
    howToUse: ["Keep frozen", "Temper briefly before serving", "Serve alone or as a dessert cup base"],
    availability: "Pre-launch product. Final ingredient list and launch markets will be confirmed before release."
  },
  {
    slug: "co-kitchen-coconut-oil",
    name: ".CO Kitchen Coconut Oil",
    category: "Kitchen",
    format: "Future pantry product",
    status: "future",
    image: "/optimized/assets-textures-palm-shadow.webp",
    shortDescription: "A future kitchen expression for everyday cooking, finishing, and pantry rituals.",
    benefits: ["Culinary coconut expression", "Pantry-first design", "Built for daily cooking rituals"],
    ingredients: ["Coconut-derived oil"],
    howToUse: ["Use as directed on final packaging", "Designed for kitchen applications", "Store according to final label guidance"],
    availability: "Future product direction. Distributor and partnership conversations are open."
  },
  {
    slug: "co-botanica-coconut-care",
    name: ".CO Botanica Coconut Care",
    category: "Botanica",
    format: "Future skincare line",
    status: "future",
    image: "/assets/transparent/coconut-care.webp",
    shortDescription: "A future body, hair, and care line exploring coconut-derived ingredients for modern routines.",
    benefits: ["Body and hair care direction", "Minimal formulation mindset", "Coconut-origin ritual language"],
    ingredients: ["Future coconut-derived care ingredients"],
    howToUse: ["Use only as directed on future packaging", "Patch-test care products before regular use", "Avoid use if irritation occurs"],
    availability: "Future product direction. No medical or treatment claims are made."
  },
  {
    slug: "co-lifestyle",
    name: ".CO Lifestyle",
    category: "Lifestyle",
    format: "Future lifestyle collection",
    status: "future",
    image: "/optimized/assets-social-founder-journey.webp",
    shortDescription: "A future line of coconut-origin lifestyle objects, rituals, and brand collaborations.",
    benefits: ["Lifestyle-led brand world", "Gift and hospitality potential", "Designed for modern coconut living"],
    ingredients: ["Future product-specific materials"],
    howToUse: ["Use according to future product guidance", "Designed for gifting, hospitality, and everyday rituals"],
    availability: "Future brand extension. Partnership conversations are open."
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
    image: "/optimized/assets-products-co-water-reserve.webp",
    description: "A chilled mango and coconut water drink for warm afternoons and simple hosting.",
    ingredients: ["Coconut water", "Mango", "Lime", "Ice"]
  },
  {
    slug: "tender-coconut-smoothie-bowl",
    title: "Tender Coconut Smoothie Bowl",
    category: "Smoothies",
    time: "10 min",
    difficulty: "Easy",
    product: ".CO Water",
    image: "/optimized/assets-coconut-made-for-living-banner.webp",
    description: "A light bowl with tender coconut, fruit, and a clean breakfast rhythm.",
    ingredients: ["Tender coconut", "Banana", "Seasonal fruit", "Coconut water"]
  },
  {
    slug: "coconut-coffee-chill",
    title: "Coconut Coffee Chill",
    category: "Coconut water drinks",
    time: "6 min",
    difficulty: "Easy",
    product: ".CO Water",
    image: "/optimized/assets-products-co-water.webp",
    description: "Cold coffee softened with coconut freshness for a restrained cafe-style ritual.",
    ingredients: ["Cold coffee", "Coconut water", "Ice", "Optional coconut cream"]
  },
  {
    slug: "coconut-cream-dessert-cup",
    title: "Coconut Cream Dessert Cup",
    category: "Desserts",
    time: "12 min",
    difficulty: "Medium",
    product: "MELT.CO Mango Coconut",
    image: "/optimized/assets-recipes-mango-coconut-dessert.webp",
    description: "A layered dessert cup using coconut creaminess, mango, and a minimal finish.",
    ingredients: ["MELT.CO Mango Coconut", "Coconut flakes", "Mango", "Shortbread crumb"]
  },
  {
    slug: "post-workout-coconut-hydration",
    title: "Post-Workout Coconut Hydration",
    category: "Wellness rituals",
    time: "3 min",
    difficulty: "Easy",
    product: ".CO Water",
    image: "/optimized/assets-coconut-tender-coconut-water.webp",
    description: "A simple chilled coconut water ritual after movement, travel, or heat.",
    ingredients: ["Chilled coconut water", "Pinch of salt", "Lime"]
  }
];

export const usageDirections = [
  { title: "Hair care", body: "Future coconut-derived formats for wash-day and finishing rituals." },
  { title: "Skin care", body: "Future body care expressions with clear usage guidance and minimal claims." },
  { title: "Body care", body: "Daily care products designed around texture, scent restraint, and simplicity." },
  { title: "Kitchen use", body: "Pantry formats for cooking, finishing, and everyday coconut-led recipes." },
  { title: "Wellness rituals", body: "Hydration and routine moments built around coconut as a lifestyle ingredient." }
];

export const communityNotes = [
  {
    label: "Early feedback",
    note: "The brand feels calm, elevated, and rooted without looking traditional.",
    source: "Founder community"
  },
  {
    label: "Retail buyer note",
    note: "The product system has room to move from beverage into a full coconut house.",
    source: "Sample content"
  },
  {
    label: "Early taster note",
    note: "The direction is fresh, clean, and suited to premium hospitality spaces.",
    source: "Sample content"
  }
];

export const socialStories = [
  "From Palakkad to the world",
  "Building in public",
  "Product development",
  "Farm to brand journey",
  "UAE and GCC expansion"
];
