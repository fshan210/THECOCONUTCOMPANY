export type RecipeItem = {
  slug: string;
  title: string;
  category: string;
  time: number;
  difficulty: "Easy" | "Medium";
  image: string;
  description: string;
  products: { name: string; detail: string; image: string; slug: string }[];
  variations: { name: string; detail: string }[];
  ingredients: string[];
  steps: string[];
  nutrition: string[];
};

const shop = "/assets/shop/products";
const generated = "/assets/recipes/generated";

export const recipes: RecipeItem[] = [
  {
    slug: "tropical-coconut-chia-pudding",
    title: "Tropical Coconut Chia Pudding",
    category: "Breakfast",
    time: 10,
    difficulty: "Easy",
    image: "/assets/recipes/refined/tropical-coconut-mango-chia-pudding.png",
    description: "A creamy, dreamy chia pudding made with coconut milk and topped with bright tropical fruit.",
    products: [
      { name: ".CO Coconut Water", detail: "100% Organic", image: `${shop}/IndividualProduct_CO-Water.png`, slug: "co-water" },
      { name: "Melt.CO Mango + Coconut", detail: "Coconut Ice Cream", image: `${shop}/IndividualProduct_MeltCO.png`, slug: "melt-co" },
      { name: ".CO Toasted Coconut Chips", detail: "Golden + crisp", image: `${shop}/IndividualProduct_CoconutChips.png`, slug: "coconut-chips" },
    ],
    variations: [
      { name: "Vegan", detail: "Use maple syrup instead of honey" },
      { name: "High Protein", detail: "Add a scoop of plant protein" },
      { name: "Low Sugar", detail: "Swap maple syrup for stevia" },
      { name: "Keto", detail: "Use a low-carb sweetener and full-fat coconut milk" },
    ],
    ingredients: ["3 tbsp chia seeds", "180 ml coconut milk", "60 ml .CO Coconut Water", "1 tsp maple syrup", "Fresh mango", "Toasted coconut chips"],
    steps: ["Whisk chia seeds, coconut milk, coconut water and maple syrup.", "Rest for five minutes, whisk again, then chill until softly set.", "Top with mango, coconut chips and a little mint before serving."],
    nutrition: ["Plant-based", "Naturally hydrating", "Source of fibre", "No artificial additives"],
  },
  { slug: "green-coconut-detox-smoothie", title: "Green Coconut Detox Smoothie", category: "Drinks", time: 5, difficulty: "Easy", image: `${generated}/co-green-coconut-smoothie-editorial-4k.avif`, description: "A clean green blend of coconut water, herbs and fruit.", products: [{ name: ".CO Coconut Water", detail: "100% Organic", image: `${shop}/IndividualProduct_CO-Water.png`, slug: "co-water" }], variations: [{ name: "Gym Friendly", detail: "Blend with your preferred plant protein" }, { name: "Kids Friendly", detail: "Add half a banana for gentle sweetness" }], ingredients: ["250 ml .CO Coconut Water", "Handful of spinach", "Half a green apple", "Fresh lime", "Mint"], steps: ["Add all ingredients to a blender.", "Blend until completely smooth.", "Serve immediately over ice."], nutrition: ["Vegan", "Gluten free", "Hydrating"] },
  { slug: "coconut-berry-smoothie-bowl", title: "Coconut Berry Smoothie Bowl", category: "Breakfast", time: 10, difficulty: "Easy", image: `${generated}/seasonal-coconut-berry-salad.jpg`, description: "Creamy coconut, berries and crisp toppings in a bright breakfast bowl.", products: [{ name: ".CO Coconut Water", detail: "100% Organic", image: `${shop}/IndividualProduct_CO-Water.png`, slug: "co-water" }], variations: [{ name: "High Protein", detail: "Add plant protein or coconut yoghurt" }], ingredients: ["Frozen berries", "Banana", ".CO Coconut Water", "Coconut flakes"], steps: ["Blend the frozen fruit with coconut water.", "Pour into a chilled bowl.", "Finish with fruit and coconut flakes."], nutrition: ["Vegan", "Fruit-forward", "No added sugar"] },
  { slug: "melt-co-mango-nice-cream", title: "Melt.CO Mango Nice Cream", category: "Desserts", time: 15, difficulty: "Easy", image: `${generated}/co-mango-nice-cream-editorial-4k.avif`, description: "A cool mango and coconut scoop with an impossibly creamy finish.", products: [{ name: "Melt.CO Mango + Coconut", detail: "Coconut Ice Cream", image: `${shop}/IndividualProduct_MeltCO.png`, slug: "melt-co" }], variations: [{ name: "Vegan", detail: "Already fully plant-based" }], ingredients: ["Melt.CO Mango + Coconut", "Fresh mango", "Toasted coconut"], steps: ["Temper Melt.CO for five minutes.", "Scoop into a chilled bowl.", "Top with mango and toasted coconut."], nutrition: ["Dairy free", "Plant-based"] },
  { slug: "coconut-thai-veggie-curry", title: "Coconut Thai Veggie Curry", category: "Lunch", time: 20, difficulty: "Medium", image: `${generated}/coconut-milk-veggie-curry.jpg`, description: "A fragrant, deeply comforting vegetable curry with coconut richness.", products: [{ name: ".CO Coconut Oil", detail: "Cold pressed", image: `${shop}/IndividualProduct_CoconutOil.png`, slug: "coconut-oil" }, { name: ".CO Coconut Aminos", detail: "Savoury seasoning", image: `${shop}/IndividualProduct_CoconutAminos.png`, slug: "coconut-aminos" }], variations: [{ name: "High Protein", detail: "Add tofu or chickpeas" }, { name: "Gluten Free", detail: "Use certified gluten-free aminos" }], ingredients: ["Mixed vegetables", "Coconut milk", "Curry paste", ".CO Coconut Oil", "Fresh herbs"], steps: ["Sauté curry paste in coconut oil.", "Add vegetables and coconut milk.", "Simmer until tender and finish with herbs."], nutrition: ["Vegan", "Vegetable-rich"] },
  { slug: "coconut-energy-balls", title: "Coconut Energy Balls", category: "Snacks", time: 15, difficulty: "Easy", image: `${generated}/toasted-coconut-energy-bites.jpg`, description: "Soft cocoa-coconut bites made for an easy afternoon lift.", products: [{ name: ".CO Toasted Coconut Chips", detail: "Golden + crisp", image: `${shop}/IndividualProduct_CoconutChips.png`, slug: "coconut-chips" }, { name: ".CO Coconut Sugar", detail: "Warm pantry sweetness", image: `${shop}/IndividualProduct_CoconutSugar.png`, slug: "coconut-sugar" }], variations: [{ name: "Gym Friendly", detail: "Add your preferred plant protein" }], ingredients: ["Dates", "Cocoa", "Coconut chips", "Coconut sugar", "Pinch of salt"], steps: ["Pulse everything in a food processor.", "Roll into even balls.", "Chill before serving."], nutrition: ["Vegan", "No refined sugar"] },
  { slug: "chocolate-coconut-pudding", title: "Chocolate Coconut Pudding", category: "Desserts", time: 10, difficulty: "Easy", image: "/assets/recipes/coconut coffee chill.png", description: "Silky chocolate pudding with deep cocoa and soft coconut notes.", products: [{ name: ".CO Coconut Sugar", detail: "Warm pantry sweetness", image: `${shop}/IndividualProduct_CoconutSugar.png`, slug: "coconut-sugar" }], variations: [{ name: "Low Sugar", detail: "Reduce coconut sugar to taste" }, { name: "Pregnancy Friendly", detail: "Use pasteurised coconut milk and omit coffee" }], ingredients: ["Coconut milk", "Cocoa", "Coconut sugar", "Chia seeds"], steps: ["Whisk all ingredients until smooth.", "Chill until set.", "Finish with shaved coconut."], nutrition: ["Dairy free", "Plant-based"] },
  { slug: "coconut-lime-rice-bowl", title: "Coconut Lime Rice Bowl", category: "Lunch", time: 25, difficulty: "Easy", image: `${generated}/coconut-lime-rice-bowl.jpg`, description: "Bright coconut rice, greens and a fresh lime finish.", products: [{ name: ".CO Coconut Oil", detail: "Cold pressed", image: `${shop}/IndividualProduct_CoconutOil.png`, slug: "coconut-oil" }], variations: [{ name: "High Protein", detail: "Add tofu, tempeh or lentils" }], ingredients: ["Cooked rice", "Coconut milk", "Lime", "Greens", "Coconut oil"], steps: ["Warm rice with coconut milk.", "Sauté greens in coconut oil.", "Assemble and finish with lime."], nutrition: ["Vegan", "Gluten free"] },
];

export const recipeCategories = ["All Recipes", "Smoothies", "Breakfast", "Lunch", "Desserts", "Drinks", "Snacks", "Baking", "Vegan", "Gluten Free"];

