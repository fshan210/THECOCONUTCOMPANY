import { Hono } from "hono";
import { productListQuerySchema, slugParamSchema } from "@dotco/contracts";
import type { AppBindings } from "../types/context.js";
import { notFound } from "../errors/api-error.js";
import { getProductBySlug, listProducts } from "../services/catalog.js";

export const productRoutes = new Hono<AppBindings>()
  .get("/products", async (c) => {
    const query = productListQuerySchema.parse(c.req.query());
    const data = await listProducts(query);
    return c.json({ data, meta: { count: data.items.length }, requestId: c.get("requestId") });
  })
  .get("/products/:slug", async (c) => {
    const { slug } = slugParamSchema.parse(c.req.param());
    const product = await getProductBySlug(slug);
    if (!product) throw notFound("Product not found.");
    return c.json({ data: product, meta: {}, requestId: c.get("requestId") });
  })
  .get("/categories", (c) => c.json({
    data: [
      { slug: "coconut-water", title: "Coconut Water" },
      { slug: "ice-cream", title: "Ice Cream" },
      { slug: "food", title: "Food" },
      { slug: "cosmetics", title: "Cosmetics" },
      { slug: "utensils", title: "Utensils" },
      { slug: "bundles-gifts", title: "Bundles & Gifts" }
    ],
    meta: {},
    requestId: c.get("requestId")
  }));
