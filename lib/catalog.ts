import { publicAssets } from "@/lib/public-assets";
import { productGalleries } from "@/lib/website-assets";

export type ProductStatus = "coming-soon" | "preview";

export type ShopProduct = {
  slug: string;
  name: string;
  category: string;
  format: string;
  status: ProductStatus;
  price?: number;
  image: string;
  hoverImage?: string;
  shortDescription: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string[];
  availability: string;
};

export const productCategories = ["Coconut Water", "Ice Cream", "Kitchen", "BOTANiCA"];

const approvedProductImage = (id: string) => productGalleries[id]?.primary ?? publicAssets.water.floating;
const approvedProductHover = (id: string) => productGalleries[id]?.gallery[1]?.src ?? productGalleries[id]?.primary;

export const shopProducts: ShopProduct[] = [
  {
    slug: "co-water",
    name: ".CO Water",
    category: "Coconut Water",
    format: "Chilled bottle",
    status: "coming-soon",
    price: 60,
    image: approvedProductImage("water"),
    hoverImage: approvedProductHover("water"),
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
    price: 220,
    image: approvedProductImage("melt"),
    hoverImage: approvedProductHover("melt"),
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
    price: 250,
    image: approvedProductImage("kitchen-oil"),
    hoverImage: approvedProductHover("kitchen-oil"),
    shortDescription: "A coconut kitchen staple for simple cooking, finishing, and everyday pantry use.",
    benefits: ["Kitchen-friendly", "Coconut aroma", "Daily pantry ritual"],
    ingredients: ["Coconut-derived oil"],
    howToUse: ["Use as directed on pack", "Try in cooking and finishing", "Store in a cool, dry place"],
    availability: "Product preview. Final pack details will be shared before release."
  },
  {
    slug: "co-kitchen-coconut-flour",
    name: ".CO Kitchen Coconut Flour",
    category: "Kitchen",
    format: "Pantry staple",
    status: "preview",
    price: 180,
    image: approvedProductImage("kitchen-flour"),
    hoverImage: approvedProductHover("kitchen-flour"),
    shortDescription: "Finely milled coconut flour for baking, breakfast bowls, and everyday pantry use.",
    benefits: ["Coconut pantry staple", "Baking friendly", "Naturally versatile"],
    ingredients: ["Coconut flour"],
    howToUse: ["Use in baking blends", "Stir into breakfast bowls", "Store sealed in a cool, dry place"],
    availability: "Product preview. Final pack details will be shared before release."
  },
  {
    slug: "co-kitchen-coconut-milk",
    name: ".CO Kitchen Coconut Milk",
    category: "Kitchen",
    format: "Cooking essential",
    status: "preview",
    price: 180,
    image: approvedProductImage("kitchen-milk"),
    hoverImage: approvedProductHover("kitchen-milk"),
    shortDescription: "A smooth coconut milk direction for curries, desserts, drinks, and daily cooking.",
    benefits: ["Creamy coconut base", "Cooking friendly", "Everyday pantry ritual"],
    ingredients: ["Coconut milk"],
    howToUse: ["Shake before use", "Add to curries and desserts", "Refrigerate after opening"],
    availability: "Product preview. Final pack details will be shared before release."
  },
  {
    slug: "co-botanica-shampoo",
    name: ".CO BOTANiCA Coconut Shampoo",
    category: "BOTANiCA",
    format: "Hair care preview",
    status: "preview",
    price: 399,
    image: approvedProductImage("botanica-shampoo"),
    hoverImage: approvedProductHover("botanica-shampoo"),
    shortDescription: "A gentle coconut-led shampoo direction for a clean, balanced wash ritual.",
    benefits: ["Gentle cleanse", "Coconut-led care", "Daily ritual"],
    ingredients: ["Final INCI list pending retail pack"],
    howToUse: ["Use only as directed on pack", "Rinse thoroughly", "Stop use if irritation occurs"],
    availability: "Care preview. No treatment or medical claims are made."
  },
  {
    slug: "co-botanica-face-wash",
    name: ".CO BOTANiCA Coconut Face Wash",
    category: "BOTANiCA",
    format: "Face care preview",
    status: "preview",
    price: 399,
    image: approvedProductImage("botanica-face-wash"),
    hoverImage: approvedProductHover("botanica-face-wash"),
    shortDescription: "A calm daily cleanse inspired by coconut botanicals.",
    benefits: ["Gentle cleanse", "Daily ritual", "Coconut botanical direction"],
    ingredients: ["Final INCI list pending retail pack"],
    howToUse: ["Use only as directed on pack", "Patch-test before use", "Stop use if irritation occurs"],
    availability: "Care preview. No treatment or medical claims are made."
  },
  {
    slug: "co-botanica-hair-serum",
    name: ".CO BOTANiCA Coconut Hair Serum",
    category: "BOTANiCA",
    format: "Hair care preview",
    status: "preview",
    price: 499,
    image: approvedProductImage("botanica-hair-serum"),
    hoverImage: approvedProductHover("botanica-hair-serum"),
    shortDescription: "A lightweight coconut botanical serum direction for an easy finishing ritual.",
    benefits: ["Light finish", "Coconut-led care", "Everyday ritual"],
    ingredients: ["Final INCI list pending retail pack"],
    howToUse: ["Use only as directed on pack", "Apply sparingly", "Stop use if irritation occurs"],
    availability: "Care preview. No treatment or medical claims are made."
  },
  {
    slug: "co-botanica-body-moisturizer",
    name: ".CO BOTANiCA Coconut Body Moisturizer",
    category: "BOTANiCA",
    format: "Body care preview",
    status: "preview",
    price: 499,
    image: approvedProductImage("botanica-moisturizer"),
    hoverImage: approvedProductHover("botanica-moisturizer"),
    shortDescription: "A soft coconut botanical moisturizer direction for daily body care.",
    benefits: ["Daily moisture", "Soft finish", "Coconut botanical direction"],
    ingredients: ["Final INCI list pending retail pack"],
    howToUse: ["Use only as directed on pack", "Patch-test before use", "Stop use if irritation occurs"],
    availability: "Care preview. No treatment or medical claims are made."
  }
];

export const recipeCategories = [
  "All recipes",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Desserts",
  "Drinks",
  "Smoothies",
  "Quick Meals",
  "Healthy",
  "Seasonal"
] as const;

export type RecipeCategory = Exclude<(typeof recipeCategories)[number], "All recipes">;

export type Recipe = {
  slug: string;
  title: string;
  category: RecipeCategory;
  time: string;
  difficulty: "Easy" | "Medium";
  nutrition: string;
  product: string;
  image: string;
  description: string;
  ingredients: string[];
};

export const recipes: Recipe[] = [
  {
    slug: "coconut-mango-cooler",
    title: "Coconut Mango Cooler",
    category: "Drinks",
    time: "5 min",
    difficulty: "Easy",
    nutrition: "Hydrating",
    product: ".CO Water",
    image: publicAssets.recipes.cooler,
    description: "A bright mango and coconut water cooler for warm afternoons.",
    ingredients: ["Coconut water", "Mango", "Lime", "Ice"]
  },
  {
    slug: "tender-coconut-smoothie-bowl",
    title: "Tender Coconut Smoothie Bowl",
    category: "Breakfast",
    time: "10 min",
    difficulty: "Easy",
    nutrition: "Fruit forward",
    product: ".CO Water",
    image: publicAssets.recipes.bowl,
    description: "A soft breakfast bowl with coconut water, fruit, and a calm morning rhythm.",
    ingredients: ["Coconut water", "Banana", "Seasonal fruit", "Coconut flakes"]
  },
  {
    slug: "coconut-coffee-chill",
    title: "Coconut Coffee Chill",
    category: "Drinks",
    time: "6 min",
    difficulty: "Easy",
    nutrition: "Light refreshment",
    product: ".CO Water",
    image: publicAssets.recipes.coffee,
    description: "Cold coffee softened with coconut freshness for a simple cafe-style glass.",
    ingredients: ["Cold coffee", "Coconut water", "Ice", "Optional coconut cream"]
  },
  {
    slug: "coconut-lime-rice-bowl",
    title: "Coconut Lime Rice Bowl",
    category: "Lunch",
    time: "25 min",
    difficulty: "Easy",
    nutrition: "Plant based",
    product: ".CO Kitchen",
    image: publicAssets.recipes.riceBowl,
    description: "Fragrant coconut rice lifted with lime, herbs, and crisp toasted coconut.",
    ingredients: ["Rice", "Coconut milk", "Lime", "Coriander", "Toasted coconut"]
  },
  {
    slug: "kerala-coconut-vegetable-stew",
    title: "Kerala Coconut Vegetable Stew",
    category: "Dinner",
    time: "35 min",
    difficulty: "Medium",
    nutrition: "Vegetable rich",
    product: ".CO Kitchen",
    image: publicAssets.recipes.vegetableStew,
    description: "A gentle Kerala-style stew with vegetables, curry leaves, and a silky coconut broth.",
    ingredients: ["Coconut milk", "Mixed vegetables", "Curry leaves", "Ginger", "Black pepper"]
  },
  {
    slug: "toasted-coconut-energy-bites",
    title: "Toasted Coconut Energy Bites",
    category: "Snacks",
    time: "15 min",
    difficulty: "Easy",
    nutrition: "Fibre rich",
    product: ".CO Kitchen",
    image: publicAssets.recipes.energyBites,
    description: "Soft date-and-oat bites rolled in coconut for an easy desk or travel snack.",
    ingredients: ["Dates", "Rolled oats", "Coconut flakes", "Nut butter", "Sea salt"]
  },
  {
    slug: "mango-coconut-scoop",
    title: "Mango Coconut Scoop",
    category: "Desserts",
    time: "5 min",
    difficulty: "Easy",
    nutrition: "Dessert ritual",
    product: "MELT.CO",
    image: publicAssets.melt.lifestyle,
    description: "Mango, toasted coconut, and a generous scoop of coconut-led frozen dessert.",
    ingredients: ["MELT.CO", "Fresh mango", "Toasted coconut", "Mint"]
  },
  {
    slug: "green-coconut-smoothie",
    title: "Green Coconut Smoothie",
    category: "Smoothies",
    time: "8 min",
    difficulty: "Easy",
    nutrition: "Greens and fruit",
    product: ".CO Water",
    image: publicAssets.recipes.cooler,
    description: "Leafy greens, fruit, and cold coconut water blended into a bright everyday glass.",
    ingredients: ["Coconut water", "Spinach", "Pineapple", "Banana", "Lime"]
  },
  {
    slug: "coconut-milk-veggie-curry",
    title: "Coconut Milk Veggie Curry",
    category: "Quick Meals",
    time: "25 min",
    difficulty: "Easy",
    nutrition: "Plant based",
    product: ".CO Kitchen",
    image: publicAssets.recipes.veggieCurry,
    description: "A weeknight vegetable curry with a warm coconut finish and one-pan ease.",
    ingredients: ["Coconut milk", "Mixed vegetables", "Curry paste", "Lime", "Rice"]
  },
  {
    slug: "coconut-chia-cup",
    title: "Coconut Chia Cup",
    category: "Healthy",
    time: "10 min + chill",
    difficulty: "Easy",
    nutrition: "Fibre rich",
    product: ".CO Kitchen",
    image: publicAssets.recipes.chiaCup,
    description: "Creamy overnight chia with mango and toasted coconut for a fridge-ready ritual.",
    ingredients: ["Coconut milk", "Chia seeds", "Mango", "Toasted coconut"]
  },
  {
    slug: "seasonal-coconut-berry-bowl",
    title: "Seasonal Coconut Berry Bowl",
    category: "Seasonal",
    time: "12 min",
    difficulty: "Easy",
    nutrition: "Fresh fruit",
    product: ".CO Kitchen",
    image: publicAssets.recipes.seasonalBowl,
    description: "Seasonal fruit, tender coconut, mint, and toasted flakes in one bright bowl.",
    ingredients: ["Seasonal berries", "Tender coconut", "Orange", "Mint", "Coconut flakes"]
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
