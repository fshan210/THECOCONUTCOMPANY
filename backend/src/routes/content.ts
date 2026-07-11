import { Hono } from "hono";
import { slugParamSchema } from "@dotco/contracts";
import type { AppBindings } from "../types/context.js";
import { notFound } from "../errors/api-error.js";

const recipes = [
  { slug: "tropical-coconut-chia-pudding", title: "Tropical Coconut Chia Pudding" },
  { slug: "green-coconut-detox-smoothie", title: "Green Coconut Detox Smoothie" }
];
const journal = [
  { slug: "rethinking-coconut-farming", title: "How we are rethinking coconut farming" },
  { slug: "journey-from-a-dream-to-co", title: "The journey from a dream to .CO" }
];

export const contentRoutes = new Hono<AppBindings>()
  .get("/recipes", (c) => c.json({ data: { items: recipes }, meta: { count: recipes.length }, requestId: c.get("requestId") }))
  .get("/recipes/:slug", (c) => {
    const { slug } = slugParamSchema.parse(c.req.param());
    const item = recipes.find((recipe) => recipe.slug === slug);
    if (!item) throw notFound("Recipe not found.");
    return c.json({ data: item, meta: {}, requestId: c.get("requestId") });
  })
  .get("/journal", (c) => c.json({ data: { items: journal }, meta: { count: journal.length }, requestId: c.get("requestId") }))
  .get("/journal/:slug", (c) => {
    const { slug } = slugParamSchema.parse(c.req.param());
    const item = journal.find((post) => post.slug === slug);
    if (!item) throw notFound("Journal post not found.");
    return c.json({ data: item, meta: {}, requestId: c.get("requestId") });
  });
