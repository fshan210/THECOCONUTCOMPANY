import { BrandImage } from "@/components/BrandImage";
import { BentoCard, MotionSection } from "@/components/brand/BrandPrimitives";
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {journalEntries.map((entry, index) => (
        <MotionSection key={entry.title} delay={index * 0.04}>
          <BentoCard className="co-press h-full">
            <BrandImage src={journalImages[index % journalImages.length]} alt={`${entry.title} editorial visual`} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 48vw, 92vw" aspect="landscape" fit="cover" hoverZoom className="mb-6 rounded-[28px]" />
            <p className="co-label mb-5">{entry.category}</p>
            <h3 className="text-3xl font-bold leading-[0.95] text-[var(--co-brown)]">{entry.title}</h3>
            <p className="co-body mt-5 text-sm">{entry.excerpt}</p>
          </BentoCard>
        </MotionSection>
      ))}
    </div>
  );
}
