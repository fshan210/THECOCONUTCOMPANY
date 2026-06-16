import Image from "next/image";
import { journalEntries } from "@/lib/content";

const journalImages = [
  "/optimized/assets-farming-kerala-coconut-palm.webp",
  "/optimized/assets-coconut-made-for-living-banner.webp",
  "/assets/transparent/co-social-media-pack.webp",
  "/optimized/assets-farms-coconut-harvesting.webp"
];

export function JournalGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-4">
      {journalEntries.map((entry, index) => (
        <article key={entry.title} className="co-glass co-soft-depth-hover min-h-72 overflow-hidden">
          <div className="relative aspect-[4/3] bg-shell">
            <Image src={journalImages[index % journalImages.length]} alt={`${entry.title} editorial visual`} fill sizes="(min-width: 768px) 25vw, 90vw" className="object-cover" />
          </div>
          <div className="p-7">
          <p className="mb-8 text-[0.7rem] uppercase tracking-editorial text-grove">{entry.category}</p>
          <h3 className="mb-5 font-display text-3xl leading-tight text-ink">{entry.title}</h3>
          <p className="text-sm leading-7 text-muted">{entry.excerpt}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
