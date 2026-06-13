import { JournalGrid } from "@/components/JournalGrid";
import { Reveal } from "@/components/Motion";
import { SectionHeader } from "@/components/SectionHeader";

export default function JournalPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <Reveal className="max-w-5xl">
          <p className="mb-8 text-[0.72rem] uppercase tracking-editorial text-grove">Journal</p>
          <h1 className="font-display text-6xl leading-none text-ink md:text-8xl">
            Field notes, product thinking, and coconut culture.
          </h1>
        </Reveal>
      </section>

      <section className="bg-paper px-5 py-24 md:px-8">
        <SectionHeader
          kicker="Magazine"
          title="Editorial blocks for a growing brand world."
          body="Designed for essays, founder letters, field reports, product launches, and hospitality stories without feeling like a generic blog."
        />
        <div className="mx-auto max-w-7xl">
          <JournalGrid />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-24 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <Reveal className="border-t border-shell pt-8">
          <p className="mb-6 text-[0.72rem] uppercase tracking-editorial text-grove">Featured essay</p>
          <h2 className="font-display text-5xl leading-tight text-ink md:text-7xl">The coconut is not a trend. It is infrastructure.</h2>
        </Reveal>
        <Reveal delay={0.1} className="border-t border-shell pt-8">
          <p className="text-lg leading-9 text-muted">
            In Kerala, coconut belongs to kitchen, ceremony, care, work, and memory. The .CO journal treats that breadth as a modern editorial system.
          </p>
        </Reveal>
      </section>
    </>
  );
}
