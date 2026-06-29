"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { BrandImage } from "@/components/BrandImage";
import type { ContentJournalPost } from "@/lib/content/types";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

const ease = [0.16, 1, 0.3, 1] as const;
export function JournalGrid({ entries: journalEntries, compact = false }: { entries: ContentJournalPost[]; compact?: boolean }) {
  const categories = ["All", ...Array.from(new Set(journalEntries.map((entry) => entry.category)))];
  const [activeCategory, setActiveCategory] = useState("All");
  const { shouldReduce } = useCoconutMotionMode();
  const entries = useMemo(
    () => journalEntries.filter((entry) => activeCategory === "All" || entry.category === activeCategory),
    [activeCategory, journalEntries]
  );
  const featured = entries.find((entry) => entry.featured) ?? entries[0];
  const remaining = compact ? entries.slice(0, 4) : entries.filter((entry) => entry !== featured);

  return (
    <div>
      {!compact ? (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Journal categories">
          {categories.map((category) => {
            const selected = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveCategory(category)}
                className={`co-press min-h-11 shrink-0 rounded-full border px-5 text-xs font-bold uppercase tracking-[0.08em] ${selected ? "border-[var(--co-palm)] bg-[var(--co-palm)] text-white" : "border-[var(--co-border)] bg-white text-[var(--co-brown)]"}`}
              >
                {category}
              </button>
            );
          })}
        </div>
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeCategory}
          initial={shouldReduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduce ? undefined : { opacity: 0, y: 8 }}
          transition={{ duration: shouldReduce ? 0 : 0.5, ease }}
        >
          {!compact && featured ? (
            <article className="co-press mb-4 grid overflow-hidden rounded-[40px] border border-[var(--co-border)] bg-white lg:grid-cols-[1.15fr_0.85fr]">
              <BrandImage
                src={featured.image}
                alt={`${featured.title} editorial photograph`}
                sizes="(min-width: 1024px) 56vw, 92vw"
                aspect="wide"
                fit="cover"
                hoverZoom
                className="h-full min-h-[330px] rounded-[40px] border-0"
              />
              <div className="flex flex-col justify-center p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[var(--co-sun)] px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--co-black)]">Featured</span>
                  <span className="co-label">{featured.category}</span>
                </div>
                <h2 className="mt-6 text-[clamp(38px,5vw,72px)] font-bold leading-[0.92] text-[var(--co-brown)]">{featured.title}</h2>
                <p className="mt-5 text-base leading-7 text-[var(--co-muted)]">{featured.excerpt}</p>
                <p className="mt-7 text-xs font-bold uppercase tracking-[0.08em] text-[var(--co-palm)]">{featured.date} · {featured.readTime}</p>
              </div>
            </article>
          ) : null}

          <div className={`grid gap-4 ${compact ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3"}`}>
            {remaining.map((entry, index) => (
              <motion.article
                layout
                key={entry.title}
                initial={shouldReduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduce ? 0 : 0.48, ease, delay: shouldReduce ? 0 : index * 0.045 }}
                className="co-press h-full overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-white"
              >
                <BrandImage src={entry.image} alt={`${entry.title} editorial visual`} sizes="(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 92vw" aspect="landscape" fit="cover" hoverZoom className="rounded-[32px] border-0" />
                <div className="p-5 md:p-6">
                  <p className="co-label">{entry.category}</p>
                  <h3 className="mt-4 text-[clamp(28px,3vw,42px)] font-bold leading-[0.96] text-[var(--co-brown)]">{entry.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[var(--co-muted)]">{entry.excerpt}</p>
                  <p className="mt-6 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--co-palm)]">{entry.date} · {entry.readTime}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
