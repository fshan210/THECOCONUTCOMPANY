"use client";

import { Appear } from "@/components/motion/Appear";
import { HoverImageFrame, PublicSection } from "@/components/PublicDesign";
import { publicAssets } from "@/lib/public-assets";

export function FounderStory() {
  return (
    <PublicSection>
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.92fr_1.08fr] md:items-center">
        <Appear className="relative min-h-[420px] md:min-h-[560px]">
          <HoverImageFrame src={publicAssets.water.lifestyle} hoverSrc={publicAssets.water.flatLay} alt=".CO founder story visual" sizes="(min-width: 768px) 46vw, 92vw" className="absolute inset-0" />
        </Appear>
        <Appear delay={0.1}>
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Founder story</p>
          <h2 className="font-display text-5xl font-light leading-tight text-coconut md:text-7xl">Close to the coconut rituals we know by heart.</h2>
          <p className="mt-8 max-w-xl text-lg leading-9 text-coconut/70">
            .CO is shaped by founders who want coconut products to feel warm, useful, and beautifully simple: the kind of thing you reach for without overthinking it.
          </p>
        </Appear>
      </div>
    </PublicSection>
  );
}
