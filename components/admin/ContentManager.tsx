"use client";

import { useState } from "react";
import { Archive, Database, Plus, Save } from "lucide-react";
import { archiveContentRecord, saveContentRecord } from "@/lib/content/actions";
import type { ContentRecord, ContentType } from "@/lib/content/types";

type EditableRecord = Record<string, unknown> & { id: string; publicationStatus: "draft" | "published" };

function emptyRecord(type: ContentType): EditableRecord {
  const id = `new-${type.slice(0, -1) || type}`;
  const seo = { title: "", description: "", canonicalPath: "/" };
  if (type === "products") return { id, slug: id, name: "New product", subtitle: "", category: "", format: "", status: "preview", shortDescription: "", longDescription: "", price: undefined, currency: "INR", availability: "", availabilityStatus: "preview", comingSoon: false, image: "", images: [], ingredients: [], nutritionHighlights: [], benefits: [], howToUse: [], seo, publicationStatus: "draft", featured: false };
  if (type === "recipes") return { id, slug: id, title: "New recipe", category: "", description: "", ingredients: [], steps: [], prepTime: "", cookTime: "", servings: "", time: "", difficulty: "Easy", nutrition: "", image: "", relatedProduct: "", product: "", seo, publicationStatus: "draft", featured: false };
  if (type === "journal") return { id, slug: id, title: "New journal post", excerpt: "", body: "", category: "", author: "", image: "", publishedDate: "", date: "", readTime: "", seo, publicationStatus: "draft", featured: false };
  if (type === "testimonials") return { id, quote: "", name: "", role: "", source: "", featured: false, publicationStatus: "draft" };
  if (type === "homepage") return { id: "homepage", heroEyebrow: "", heroHeadline: [""], heroSubheadline: "", heroCtaText: "", heroCtaLink: "/shop", secondaryCtaText: "", secondaryCtaLink: "/about", trustBadges: [], groveStages: [], featuredProductSlugs: [], featuredRecipeSlugs: [], featuredTestimonialIds: [], seo, publicationStatus: "draft" };
  return { id, pagePath: "/", title: "", description: "", canonicalPath: "/", publicationStatus: "draft" };
}

function recordLabel(record: EditableRecord) {
  return String(record.name || record.title || record.pagePath || record.id);
}

function JsonField({ label, value, onValid }: { label: string; value: unknown; onValid: (value: unknown) => void }) {
  const [text, setText] = useState(() => JSON.stringify(value ?? [], null, 2));
  const [valid, setValid] = useState(true);
  return (
    <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.08em] text-grove md:col-span-2">
      {label}
      <textarea rows={5} value={text} onChange={(event) => { const next = event.target.value; setText(next); try { onValid(JSON.parse(next)); setValid(true); } catch { setValid(false); } }} className={`rounded-lg border bg-white px-3 py-3 font-mono text-xs font-normal normal-case tracking-normal text-ink ${valid ? "border-coconut/15" : "border-red-500"}`} />
      {!valid ? <span className="normal-case tracking-normal text-red-700">Enter valid JSON before saving.</span> : null}
    </label>
  );
}

function ContentEditor({ type, initial, writable, isNew = false }: { type: ContentType; initial: EditableRecord; writable: boolean; isNew?: boolean }) {
  const [record, setRecord] = useState(initial);
  const set = (key: string, value: unknown) => setRecord((current) => ({ ...current, [key]: value }));
  const setSeo = (key: string, value: unknown) => setRecord((current) => ({ ...current, seo: { ...(current.seo as Record<string, unknown> || {}), [key]: value } }));
  const input = (label: string, key: string, typeName = "text") => (
    <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.08em] text-grove">
      {label}
      <input type={typeName} value={String(record[key] ?? "")} onChange={(event) => set(key, typeName === "number" ? (event.target.value === "" ? undefined : Number(event.target.value)) : event.target.value)} className="min-h-11 rounded-lg border border-coconut/15 bg-white px-3 text-sm font-normal normal-case tracking-normal text-ink" />
    </label>
  );
  const area = (label: string, key: string, rows = 3) => (
    <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.08em] text-grove md:col-span-2">
      {label}
      <textarea rows={rows} value={Array.isArray(record[key]) ? (record[key] as unknown[]).join("\n") : String(record[key] ?? "")} onChange={(event) => set(key, Array.isArray(record[key]) ? event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) : event.target.value)} className="rounded-lg border border-coconut/15 bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal text-ink" />
    </label>
  );
  const jsonArea = (label: string, key: string) => <JsonField label={label} value={record[key]} onValid={(value) => set(key, value)} />;

  return (
    <details open={isNew} className="co-neu overflow-hidden p-5 dark:bg-paper">
      <summary className="cursor-pointer list-none font-display text-2xl text-ink">{isNew ? "Create new" : recordLabel(record)}</summary>
      <form action={saveContentRecord.bind(null, type)} className="mt-5 grid gap-4 md:grid-cols-2">
        {input("ID", "id")}
        {"slug" in record ? input("Slug", "slug") : null}
        {"name" in record ? input("Name", "name") : null}
        {"title" in record ? input("Title", "title") : null}
        {"pagePath" in record ? input("Page path", "pagePath") : null}
        {"canonicalPath" in record ? input("Canonical path", "canonicalPath") : null}
        {type === "seo" ? input("Open Graph image", "ogImage") : null}
        {"subtitle" in record ? input("Subtitle", "subtitle") : null}
        {"category" in record ? input("Category", "category") : null}
        {"author" in record ? input("Author", "author") : null}
        {"role" in record ? input("Role/type", "role") : null}
        {"source" in record ? input("Source", "source") : null}
        {"format" in record ? input("Format", "format") : null}
        {"image" in record ? input("Image URL/path", "image") : null}
        {"hoverImage" in record ? input("Hover image", "hoverImage") : null}
        {"price" in record ? input("Price", "price", "number") : null}
        {type === "testimonials" ? input("Rating (optional, 1–5)", "rating", "number") : null}
        {"currency" in record ? input("Currency", "currency") : null}
        {"availability" in record ? area("Availability copy", "availability") : null}
        {"prepTime" in record ? input("Prep time", "prepTime") : null}
        {"cookTime" in record ? input("Cook time", "cookTime") : null}
        {"servings" in record ? input("Servings", "servings") : null}
        {"time" in record ? input("Total time", "time") : null}
        {"nutrition" in record ? input("Nutrition highlight", "nutrition") : null}
        {"relatedProduct" in record ? input("Related product", "relatedProduct") : null}
        {"publishedDate" in record ? input("Published date", "publishedDate") : null}
        {"readTime" in record ? input("Read time", "readTime") : null}
        {type === "products" ? <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.08em] text-grove">Product stage<select value={String(record.status || "preview")} onChange={(event) => set("status", event.target.value)} className="min-h-11 rounded-lg border border-coconut/15 bg-white px-3 text-sm normal-case tracking-normal text-ink"><option value="preview">Preview</option><option value="coming-soon">Coming soon</option></select></label> : null}
        {"availabilityStatus" in record ? <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.08em] text-grove">Availability status<select value={String(record.availabilityStatus)} onChange={(event) => set("availabilityStatus", event.target.value)} className="min-h-11 rounded-lg border border-coconut/15 bg-white px-3 text-sm normal-case tracking-normal text-ink"><option value="preview">Preview</option><option value="coming-soon">Coming soon</option><option value="in-stock">In stock</option><option value="out-of-stock">Out of stock</option></select></label> : null}
        {"difficulty" in record ? <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.08em] text-grove">Difficulty<select value={String(record.difficulty)} onChange={(event) => set("difficulty", event.target.value)} className="min-h-11 rounded-lg border border-coconut/15 bg-white px-3 text-sm normal-case tracking-normal text-ink"><option value="Easy">Easy</option><option value="Medium">Medium</option></select></label> : null}
        {"quote" in record ? area("Quote", "quote") : null}
        {"shortDescription" in record ? area("Short description", "shortDescription") : null}
        {"longDescription" in record ? area("Long description", "longDescription", 5) : null}
        {"description" in record ? area("Description", "description") : null}
        {"excerpt" in record ? area("Excerpt", "excerpt") : null}
        {"body" in record ? area("Body/content", "body", 8) : null}
        {"heroEyebrow" in record ? input("Hero eyebrow", "heroEyebrow") : null}
        {"heroHeadline" in record ? area("Hero headline — one line per row", "heroHeadline") : null}
        {"heroSubheadline" in record ? area("Hero subheadline", "heroSubheadline") : null}
        {"heroCtaText" in record ? input("Hero CTA text", "heroCtaText") : null}
        {"heroCtaLink" in record ? input("Hero CTA link", "heroCtaLink") : null}
        {"secondaryCtaText" in record ? input("Secondary CTA text", "secondaryCtaText") : null}
        {"secondaryCtaLink" in record ? input("Secondary CTA link", "secondaryCtaLink") : null}
        {"ingredients" in record ? area("Ingredients — one per line", "ingredients") : null}
        {"images" in record ? area("Product images — one per line", "images") : null}
        {"nutritionHighlights" in record ? area("Nutrition highlights — one per line", "nutritionHighlights") : null}
        {"steps" in record ? area("Steps — one per line", "steps", 6) : null}
        {"benefits" in record ? area("Benefits — one per line", "benefits") : null}
        {"howToUse" in record ? area("How to use — one per line", "howToUse") : null}
        {"featuredProductSlugs" in record ? area("Featured product slugs", "featuredProductSlugs") : null}
        {"featuredRecipeSlugs" in record ? area("Featured recipe slugs", "featuredRecipeSlugs") : null}
        {"featuredTestimonialIds" in record ? area("Featured testimonial IDs", "featuredTestimonialIds") : null}
        {"groveStages" in record ? area("Grove stages", "groveStages") : null}
        {"trustBadges" in record ? jsonArea("Trust badges JSON", "trustBadges") : null}
        {"seo" in record ? (
          <>
            <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.08em] text-grove">SEO title<input value={String((record.seo as Record<string, unknown>)?.title ?? "")} onChange={(event) => setSeo("title", event.target.value)} className="min-h-11 rounded-lg border border-coconut/15 bg-white px-3 text-sm font-normal normal-case tracking-normal text-ink" /></label>
            <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.08em] text-grove">Canonical path<input value={String((record.seo as Record<string, unknown>)?.canonicalPath ?? "")} onChange={(event) => setSeo("canonicalPath", event.target.value)} className="min-h-11 rounded-lg border border-coconut/15 bg-white px-3 text-sm font-normal normal-case tracking-normal text-ink" /></label>
            <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.08em] text-grove md:col-span-2">SEO description<textarea rows={3} value={String((record.seo as Record<string, unknown>)?.description ?? "")} onChange={(event) => setSeo("description", event.target.value)} className="rounded-lg border border-coconut/15 bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal text-ink" /></label>
            <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.08em] text-grove md:col-span-2">SEO / Open Graph image<input value={String((record.seo as Record<string, unknown>)?.ogImage ?? "")} onChange={(event) => setSeo("ogImage", event.target.value || undefined)} className="min-h-11 rounded-lg border border-coconut/15 bg-white px-3 text-sm font-normal normal-case tracking-normal text-ink" /></label>
          </>
        ) : null}
        <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.08em] text-grove">Status<select value={record.publicationStatus} onChange={(event) => set("publicationStatus", event.target.value)} className="min-h-11 rounded-lg border border-coconut/15 bg-white px-3 text-sm normal-case tracking-normal text-ink"><option value="draft">Draft</option><option value="published">Published</option></select></label>
        {"featured" in record ? <label className="flex min-h-11 items-center gap-3 self-end text-sm text-ink"><input type="checkbox" checked={Boolean(record.featured)} onChange={(event) => set("featured", event.target.checked)} /> Featured</label> : null}
        {"comingSoon" in record ? <label className="flex min-h-11 items-center gap-3 self-end text-sm text-ink"><input type="checkbox" checked={Boolean(record.comingSoon)} onChange={(event) => set("comingSoon", event.target.checked)} /> Coming soon</label> : null}
        {type === "seo" ? <label className="flex min-h-11 items-center gap-3 self-end text-sm text-ink"><input type="checkbox" checked={Boolean(record.noindex)} onChange={(event) => set("noindex", event.target.checked)} /> Noindex</label> : null}
        <input type="hidden" name="payload" value={JSON.stringify(record)} />
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button disabled={!writable} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-coconut px-4 text-sm text-paper disabled:cursor-not-allowed disabled:opacity-45"><Save size={15} /> Save</button>
          {!isNew ? <button formAction={archiveContentRecord.bind(null, type)} name="id" value={record.id} disabled={!writable} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-coconut/15 px-4 text-sm text-coconut disabled:opacity-45"><Archive size={15} /> Archive as draft</button> : null}
        </div>
      </form>
    </details>
  );
}

export function ContentManager({ type, records, writable, message }: { type: ContentType; records: ContentRecord[]; writable: boolean; message?: string }) {
  return (
    <section className="co-glass p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div><p className="mb-3 text-[0.68rem] uppercase tracking-editorial text-grove">Dashboard → Firestore → public site</p><h2 className="font-display text-4xl text-ink md:text-5xl">{type === "homepage" ? "Homepage content" : type.charAt(0).toUpperCase() + type.slice(1)}</h2></div>
        <span className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-coconut/12 px-4 text-sm text-coconut"><Database size={15} /> {writable ? "Firestore connected" : "Read-only fallback"}</span>
      </div>
      {message ? <p className="mt-5 rounded-lg border border-grove/20 bg-grove/8 p-4 text-sm text-ink">{message}</p> : null}
      {!writable ? <p className="mt-5 text-sm leading-7 text-muted">Curated fallback content is shown. Configure Firebase Admin credentials to enable protected writes; public pages remain available either way.</p> : null}
      <div className="mt-6 grid gap-4">
        {records.map((record) => <ContentEditor key={record.id} type={type} initial={record as EditableRecord} writable={writable} />)}
        {type !== "homepage" ? <ContentEditor type={type} initial={emptyRecord(type)} writable={writable} isNew /> : null}
      </div>
    </section>
  );
}
