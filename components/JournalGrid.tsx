import Image from "next/image";
import { journalEntries } from "@/lib/content";
import { publicAssets } from "@/lib/public-assets";

const journalImages = [
  publicAssets.brand.palms,
  publicAssets.brand.madeForLiving,
  publicAssets.water.flatLay,
  publicAssets.ecosystem.kitchenGroup
];

export function JournalGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {journalEntries.map((entry, index) => (
        <article key={entry.title} className="h-full overflow-hidden rounded-3xl border border-coconut/10 bg-[#fff8ea] shadow-[0_18px_48px_rgba(62,46,31,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(62,46,31,0.1)]">
          <div className="relative aspect-[4/3] bg-paper">
            <Image src={journalImages[index % journalImages.length]} alt={`${entry.title} editorial visual`} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 48vw, 92vw" className="object-cover" />
          </div>
          <div className="p-7">
            <p className="mb-6 text-[0.7rem] font-medium uppercase tracking-editorial text-grove">{entry.category}</p>
            <h3 className="mb-5 font-display text-3xl font-light leading-tight text-coconut">{entry.title}</h3>
            <p className="text-sm leading-7 text-coconut/68">{entry.excerpt}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
