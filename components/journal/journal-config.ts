import { J } from "./journal-data";
export const forms = [
  "Milk",
  "Cream",
  "Oil",
  "Flour",
  "Water",
  "Sugar",
] as const;
export const processes = [
  "Fresh",
  "Cold-Pressed",
  "Fermented",
  "Dehydrated",
] as const;
export const dishes = ["Curry", "Snack", "Drink", "Dessert", "Bake"] as const;
export type CoconutConfig = {
  form: (typeof forms)[number];
  process: (typeof processes)[number];
  dish: (typeof dishes)[number];
};
const recipes = {
  curry: {
    title: "Kerala Coconut Vegetable Stew",
    image: "stew",
    slug: "kerala-coconut-vegetable-stew",
    minutes: 35,
    description:
      "Coconut milk brings a mellow base to vegetables and fragrant curry paste.",
  },
  bowl: {
    title: "Tropical Coconut Chia Pudding",
    image: "bowl",
    slug: "tropical-coconut-chia-pudding",
    minutes: 10,
    description: "Chia, coconut and fruit become a simple make-ahead bowl.",
  },
  drink: {
    title: "Green Coconut Detox Smoothie",
    image: "drink",
    slug: "green-coconut-detox-smoothie",
    minutes: 5,
    description:
      "Coconut water gives fruit and greens a light, refreshing base.",
  },
  dessert: {
    title: "Chocolate Coconut Pudding",
    image: "milk",
    slug: "chocolate-coconut-pudding",
    minutes: 10,
    description: "Cocoa and coconut milk make a softly set dessert.",
  },
  snack: {
    title: "Coconut Energy Balls",
    image: "bowl",
    slug: "coconut-energy-balls",
    minutes: 15,
    description:
      "Dates, coconut and cocoa come together in a small chilled bite.",
  },
  rice: {
    title: "Coconut Lime Rice Bowl",
    image: "stew",
    slug: "coconut-lime-rice-bowl",
    minutes: 25,
    description:
      "A little coconut oil carries the flavour through greens and rice.",
  },
};
const map: Record<
  CoconutConfig["form"],
  Record<CoconutConfig["dish"], keyof typeof recipes>
> = {
  Milk: {
    Curry: "curry",
    Snack: "bowl",
    Drink: "drink",
    Dessert: "dessert",
    Bake: "bowl",
  },
  Cream: {
    Curry: "curry",
    Snack: "bowl",
    Drink: "drink",
    Dessert: "dessert",
    Bake: "dessert",
  },
  Oil: {
    Curry: "rice",
    Snack: "snack",
    Drink: "drink",
    Dessert: "dessert",
    Bake: "snack",
  },
  Flour: {
    Curry: "curry",
    Snack: "snack",
    Drink: "drink",
    Dessert: "dessert",
    Bake: "snack",
  },
  Water: {
    Curry: "rice",
    Snack: "bowl",
    Drink: "drink",
    Dessert: "bowl",
    Bake: "bowl",
  },
  Sugar: {
    Curry: "curry",
    Snack: "snack",
    Drink: "drink",
    Dessert: "dessert",
    Bake: "snack",
  },
};
const formNotes = {
  Milk: "Use milk for a creamy base; add it gently and adjust the liquid.",
  Cream:
    "Cream is richer than milk. Dilute gradually if the recipe calls for milk.",
  Oil: "Oil carries flavour; it cannot replace the liquid in milk or water.",
  Flour:
    "Flour needs a recipe written for its absorbency. Do not swap it directly for liquid coconut.",
  Water:
    "Water keeps a dish light. It cannot provide the richness of coconut milk.",
  Sugar:
    "Sugar adds sweetness, not coconut milk’s richness. Taste before adding more.",
};
const processNotes = {
  Fresh: "Work in small batches and follow the pack’s storage instructions.",
  "Cold-Pressed":
    "Cold pressing is an oil process. For other forms, choose their labelled preparation method.",
  Fermented:
    "Fermentation changes acidity and texture. Use a recipe written for a fermented ingredient.",
  Dehydrated:
    "Dried formats need their own quantities; follow rehydration instructions where provided.",
};
const products = {
  Milk: { name: ".CO Coconut Milk", slug: "co-kitchen-coconut-milk" },
  Cream: { name: ".CO Coconut Milk", slug: "co-kitchen-coconut-milk" },
  Oil: { name: ".CO Coconut Oil", slug: "co-kitchen-coconut-oil" },
  Flour: { name: ".CO Coconut Flour", slug: "co-kitchen-coconut-flour" },
  Water: { name: ".CO Coconut Water", slug: "co-water" },
  Sugar: { name: ".CO Kitchen collection", slug: "" },
};
export function resolveCoconut(config: CoconutConfig) {
  const recipe = recipes[map[config.form][config.dish]];
  const alternative =
    config.dish === "Bake" ||
    config.form === "Flour" ||
    (config.process === "Cold-Pressed" && config.form !== "Oil") ||
    config.process === "Fermented";
  return {
    ...recipe,
    image: J + recipe.image + ".webp",
    key: `${config.form}-${config.process}-${config.dish}`,
    note: `${formNotes[config.form]} ${processNotes[config.process]}`,
    product: products[config.form],
    alternative,
    matchLabel: alternative
      ? "A starting point to explore"
      : "From the recipe collection",
    explanation: alternative
      ? `There is no exact tested recipe for ${config.process.toLowerCase()} coconut ${config.form.toLowerCase()} in this ${config.dish.toLowerCase()} selection. Try the related recipe below using its listed ingredients.`
      : recipe.description,
  };
}
