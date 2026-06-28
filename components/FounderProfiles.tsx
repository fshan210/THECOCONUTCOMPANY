"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BrandImage } from "@/components/BrandImage";
import { DoodleIcon } from "@/components/brand/BrandPrimitives";
import { publicAssets } from "@/lib/public-assets";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

const founders = [
  {
    slug: "fazil-shersha",
    name: "Fazil Shersha",
    role: "Co-founder",
    line: "The dreamer. The doer.",
    image: publicAssets.social.founderFazil,
    position: "62% 34%",
    intro: "Fazil leads .CO with a belief that better coconut products should feel clear, useful, and close to everyday life.",
    story: "His work connects brand direction, product thinking, and the long view: build patiently, listen closely, and let the quality of the ritual do the talking.",
    focus: ["Product vision", "Brand direction", "Coconut-first growth"]
  },
  {
    slug: "afsala-muthali",
    name: "Afsala Muthali",
    role: "Co-founder",
    line: "The creator. The caretaker.",
    image: publicAssets.social.founderAfsala,
    position: "52% 30%",
    intro: "Afsala shapes how .CO feels in the hand, on the shelf, and around the table, with care for every consumer-facing detail.",
    story: "Her perspective keeps the brand warm and grounded. From product experience to storytelling, the question stays simple: does this make a real day feel a little better?",
    focus: ["Consumer experience", "Creative care", "Everyday rituals"]
  }
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

export function FounderProfiles() {
  const [activeSlug, setActiveSlug] = useState<(typeof founders)[number]["slug"]>(founders[0].slug);
  const { shouldReduce } = useCoconutMotionMode();
  const activeFounder = founders.find((founder) => founder.slug === activeSlug) ?? founders[0];

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Founder profiles">
        {founders.map((founder) => {
          const selected = founder.slug === activeSlug;
          return (
            <button
              key={founder.slug}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="founder-profile"
              onClick={() => setActiveSlug(founder.slug)}
              className={`co-press min-h-12 rounded-full border px-5 text-sm font-bold ${
                selected
                  ? "border-[var(--co-palm)] bg-[var(--co-palm)] text-white"
                  : "border-[var(--co-border)] bg-white text-[var(--co-brown)] hover:border-[var(--co-palm)]"
              }`}
            >
              {founder.name}
            </button>
          );
        })}
      </div>

      <div id="founder-profile" role="tabpanel" className="min-h-[560px] overflow-hidden rounded-[40px] border border-[var(--co-border)] bg-white shadow-[0_20px_52px_rgba(58,36,22,0.07)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={activeFounder.slug}
            initial={shouldReduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: shouldReduce ? 0 : 0.55, ease }}
            className="grid min-h-[560px] lg:grid-cols-[0.92fr_1.08fr]"
          >
            <div className="relative min-h-[390px] p-3 md:p-5 lg:min-h-[560px]">
              <BrandImage
                src={activeFounder.image}
                alt={`${activeFounder.name}, ${activeFounder.role} of .CO The Coconut Company`}
                sizes="(min-width: 1024px) 44vw, 92vw"
                aspect="portrait"
                fit="cover"
                position={activeFounder.position}
                priority
                className="h-full min-h-[365px] rounded-[32px] border-0 lg:min-h-[520px]"
              />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
              <div className="flex items-center gap-3">
                <DoodleIcon name="palm" animated className="h-9 w-9 text-[var(--co-palm)]" />
                <p className="co-label">{activeFounder.role}</p>
              </div>
              <h2 className="mt-6 text-[clamp(44px,6vw,92px)] font-bold leading-[0.88] text-[var(--co-brown)]">
                {activeFounder.name}
              </h2>
              <p className="co-editorial-quote mt-4 text-[clamp(24px,3vw,40px)] leading-tight text-[var(--co-palm)]">
                {activeFounder.line}
              </p>
              <p className="mt-8 max-w-xl text-base leading-7 text-[var(--co-ink)]">{activeFounder.intro}</p>
              <p className="mt-4 max-w-xl text-base leading-7 text-[var(--co-muted)]">{activeFounder.story}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {activeFounder.focus.map((item) => (
                  <span key={item} className="rounded-full border border-[var(--co-border)] bg-[var(--co-cream)] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--co-brown)]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
