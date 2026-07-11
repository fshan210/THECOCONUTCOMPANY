import "server-only";

import { getFirebaseAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";
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
  ContentSeo,
  ContentTestimonial,
  ContentType,
  HomepageContent,
  SeoMetadataContent
} from "@/lib/content/types";
import { validateContentRecord } from "@/lib/content/validation";
import { isServerApiConfigured, serverApiGet } from "@/lib/backend/server-api-client";

export interface ContentSource {
  getProducts(includeDrafts?: boolean): Promise<ContentProduct[]>;
  getRecipes(includeDrafts?: boolean): Promise<ContentRecipe[]>;
  getJournalPosts(includeDrafts?: boolean): Promise<ContentJournalPost[]>;
  getTestimonials(includeDrafts?: boolean): Promise<ContentTestimonial[]>;
  getHomepageContent(includeDrafts?: boolean): Promise<HomepageContent | null>;
  getSeoMetadata(path: string, includeDrafts?: boolean): Promise<SeoMetadataContent | null>;
  getRecords(type: ContentType): Promise<ContentRecord[]>;
}

const fallbackByType = {
  products: fallbackProducts,
  recipes: fallbackRecipes,
  journal: fallbackJournalPosts,
  testimonials: fallbackTestimonials,
  homepage: [fallbackHomepage],
  seo: fallbackSeoMetadata
} satisfies Record<ContentType, ContentRecord[]>;

function published<T extends { publicationStatus: string }>(items: T[], includeDrafts = false) {
  return includeDrafts ? items : items.filter((item) => item.publicationStatus === "published");
}

export class FallbackContentSource implements ContentSource {
  async getProducts(includeDrafts = false) { return published(fallbackProducts, includeDrafts); }
  async getRecipes(includeDrafts = false) { return published(fallbackRecipes, includeDrafts); }
  async getJournalPosts(includeDrafts = false) { return published(fallbackJournalPosts, includeDrafts); }
  async getTestimonials(includeDrafts = false) { return published(fallbackTestimonials, includeDrafts); }
  async getHomepageContent() { return fallbackHomepage; }
  async getSeoMetadata(path: string) { return fallbackSeoMetadata.find((item) => item.pagePath === path) ?? null; }
  async getRecords(type: ContentType) { return fallbackByType[type]; }
}

export class FirestoreContentSource implements ContentSource {
  private async collection<T extends ContentRecord>(type: ContentType): Promise<T[]> {
    const db = await getFirebaseAdminDb();
    const snapshot = await db.collection(firestoreCollections[type]).get();
    return snapshot.docs
      .map((doc) => validateContentRecord(type, { id: doc.id, ...doc.data() }))
      .filter(Boolean) as T[];
  }

  async getProducts(includeDrafts = false) { return published(await this.collection<ContentProduct>("products"), includeDrafts); }
  async getRecipes(includeDrafts = false) { return published(await this.collection<ContentRecipe>("recipes"), includeDrafts); }
  async getJournalPosts(includeDrafts = false) { return published(await this.collection<ContentJournalPost>("journal"), includeDrafts); }
  async getTestimonials(includeDrafts = false) { return published(await this.collection<ContentTestimonial>("testimonials"), includeDrafts); }
  async getHomepageContent(includeDrafts = false) {
    const snapshot = await (await getFirebaseAdminDb()).collection(firestoreCollections.homepage).doc("homepage").get();
    if (!snapshot.exists) return null;
    const content = validateContentRecord("homepage", { id: "homepage", ...snapshot.data() }) as HomepageContent | null;
    if (!content) return null;
    return includeDrafts || content.publicationStatus === "published" ? content : null;
  }
  async getSeoMetadata(path: string, includeDrafts = false) {
    const records = await this.collection<SeoMetadataContent>("seo");
    return records.find((item) => item.pagePath === path && (includeDrafts || item.publicationStatus === "published")) ?? null;
  }
  async getRecords(type: ContentType) {
    if (type === "homepage") {
      const homepage = await this.getHomepageContent(true);
      return homepage ? [homepage] : [];
    }
    return this.collection(type);
  }
}

/**
 * DEV-only read adapter. It deliberately maps the small public API contract to
 * the existing content model and throws on failure so the server layer can use
 * its curated fallback data. It never exposes credentials to the browser.
 */
export class AwsDevContentSource implements ContentSource {
  async getProducts() {
    const result = await serverApiGet<{ items: Array<{ id: string; slug: string; title: string; subtitle: string; category: string; price: { amount: number; currency: string }; available: boolean }> }>("/v1/products?limit=50");
    return result.items.map((item): ContentProduct => ({
      id: item.id, slug: item.slug, name: item.title, subtitle: item.subtitle, category: item.category,
      format: item.subtitle, status: item.available ? "coming-soon" : "preview", shortDescription: item.subtitle,
      longDescription: item.subtitle, price: item.price.amount, currency: item.price.currency, availability: item.available ? "Available in DEV catalog" : "Preview",
      availabilityStatus: item.available ? "in-stock" : "preview", comingSoon: !item.available, image: "", images: [],
      ingredients: [], nutritionHighlights: [], benefits: [], howToUse: [], seo: { title: item.title, description: item.subtitle, canonicalPath: `/shop/${item.slug}` },
      publicationStatus: "published", featured: false
    }));
  }
  async getRecipes() { return (await serverApiGet<{ items: Array<{ slug: string; title: string }> }>("/v1/recipes")).items.map((item) => ({ ...fallbackRecipes.find((fallback) => fallback.slug === item.slug) ?? fallbackRecipes[0], id: item.slug, slug: item.slug, title: item.title })); }
  async getJournalPosts() { return (await serverApiGet<{ items: Array<{ slug: string; title: string }> }>("/v1/journal")).items.map((item) => ({ ...fallbackJournalPosts.find((fallback) => fallback.slug === item.slug) ?? fallbackJournalPosts[0], id: item.slug, slug: item.slug, title: item.title })); }
  async getTestimonials() { return []; }
  async getHomepageContent() { return fallbackHomepage; }
  async getSeoMetadata(path: string) { return fallbackSeoMetadata.find((item) => item.pagePath === path) ?? null; }
  async getRecords(type: ContentType) {
    if (type === "products") return this.getProducts();
    if (type === "recipes") return this.getRecipes();
    if (type === "journal") return this.getJournalPosts();
    return [];
  }
}

export function getContentSource(): ContentSource {
  if (process.env.DOTCO_USE_API_CONTENT === "true" && isServerApiConfigured()) return new AwsDevContentSource();
  return isFirebaseAdminConfigured() ? new FirestoreContentSource() : new FallbackContentSource();
}

export function fallbackSeo(path: string): ContentSeo | null {
  return fallbackSeoMetadata.find((item) => item.pagePath === path) ?? null;
}
