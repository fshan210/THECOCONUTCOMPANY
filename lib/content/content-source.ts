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

export function getContentSource(): ContentSource {
  return isFirebaseAdminConfigured() ? new FirestoreContentSource() : new FallbackContentSource();
}

export function fallbackSeo(path: string): ContentSeo | null {
  return fallbackSeoMetadata.find((item) => item.pagePath === path) ?? null;
}
