import "server-only";

import { unstable_cache } from "next/cache";
import { getContentSource } from "@/lib/content/content-source";
import {
  fallbackHomepage,
  fallbackJournalPosts,
  fallbackProducts,
  fallbackRecipes,
  fallbackSeoMetadata,
  fallbackTestimonials
} from "@/lib/content/fallback-data";
import type {
  ContentJournalPost,
  ContentProduct,
  ContentRecipe,
  ContentRecord,
  ContentTestimonial,
  ContentType,
  HomepageContent,
  SeoMetadataContent
} from "@/lib/content/types";

const cacheSeconds = 300;

function mergeById<T extends { id: string; publicationStatus: string }>(fallback: T[], dynamic: T[]) {
  const merged = new Map(fallback.map((item) => [item.id, item]));
  dynamic.forEach((item) => merged.set(item.id, item));
  return Array.from(merged.values()).filter((item) => item.publicationStatus === "published");
}

const cachedProducts = unstable_cache(async () => {
  try {
    const products = mergeById(fallbackProducts, await getContentSource().getProducts(true));
    return products.length ? products : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}, ["cms-products-v1"], { revalidate: cacheSeconds, tags: ["content", "content:products"] });

const cachedRecipes = unstable_cache(async () => {
  try {
    const recipes = mergeById(fallbackRecipes, await getContentSource().getRecipes(true));
    return recipes.length ? recipes : fallbackRecipes;
  } catch {
    return fallbackRecipes;
  }
}, ["cms-recipes-v1"], { revalidate: cacheSeconds, tags: ["content", "content:recipes"] });

const cachedJournal = unstable_cache(async () => {
  try {
    const posts = mergeById(fallbackJournalPosts, await getContentSource().getJournalPosts(true));
    return posts.length ? posts : fallbackJournalPosts;
  } catch {
    return fallbackJournalPosts;
  }
}, ["cms-journal-v1"], { revalidate: cacheSeconds, tags: ["content", "content:journal"] });

const cachedTestimonials = unstable_cache(async () => {
  try {
    const testimonials = mergeById(fallbackTestimonials, await getContentSource().getTestimonials(true));
    return testimonials.length ? testimonials : fallbackTestimonials;
  } catch {
    return fallbackTestimonials;
  }
}, ["cms-testimonials-v1"], { revalidate: cacheSeconds, tags: ["content", "content:testimonials"] });

const cachedHomepage = unstable_cache(async () => {
  try {
    return (await getContentSource().getHomepageContent()) ?? fallbackHomepage;
  } catch {
    return fallbackHomepage;
  }
}, ["cms-homepage-v1"], { revalidate: cacheSeconds, tags: ["content", "content:homepage"] });

const cachedSeo = unstable_cache(async () => {
  try {
    const records = await getContentSource().getRecords("seo") as SeoMetadataContent[];
    return mergeById(fallbackSeoMetadata, records);
  } catch {
    return fallbackSeoMetadata;
  }
}, ["cms-seo-v1"], { revalidate: cacheSeconds, tags: ["content", "content:seo"] });

export async function getProducts(): Promise<ContentProduct[]> { return cachedProducts(); }
export async function getProduct(slug: string) { return (await getProducts()).find((item) => item.slug === slug) ?? null; }
export async function getRecipes(): Promise<ContentRecipe[]> { return cachedRecipes(); }
export async function getJournalPosts(): Promise<ContentJournalPost[]> { return cachedJournal(); }
export async function getTestimonials(): Promise<ContentTestimonial[]> { return cachedTestimonials(); }
export async function getHomepageContent(): Promise<HomepageContent> { return cachedHomepage(); }
export async function getSeoMetadata(path: string): Promise<SeoMetadataContent | null> {
  return (await cachedSeo()).find((item) => item.pagePath === path) ?? null;
}

export async function getAdminContentRecords(type: ContentType): Promise<ContentRecord[]> {
  try {
    const records = await getContentSource().getRecords(type);
    return records.length ? records : fallbackRecords(type);
  } catch {
    return fallbackRecords(type);
  }
}

function fallbackRecords(type: ContentType): ContentRecord[] {
  const records: Record<ContentType, ContentRecord[]> = {
    products: fallbackProducts,
    recipes: fallbackRecipes,
    journal: fallbackJournalPosts,
    testimonials: fallbackTestimonials,
    homepage: [fallbackHomepage],
    seo: fallbackSeoMetadata
  };
  return records[type];
}
