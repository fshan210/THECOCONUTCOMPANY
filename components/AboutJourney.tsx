"use client";

import Image from "next/image";
import { Droplets, Heart, Leaf, PackageCheck, Sprout, Waves } from "lucide-react";
import { Appear } from "@/components/motion/Appear";
import { PublicHeader, PublicSection } from "@/components/PublicDesign";
import { publicAssets } from "@/lib/public-assets";

const journey = [
  {
    title: "Kerala roots",
    detail: "A coconut story shaped by shade, kitchens, tender coconut stalls, family tables, and the comfort of familiar taste.",
    image: publicAssets.brand.palms,
    icon: Sprout
  },
  {
    title: "Coconut-first products",
    detail: "We begin with uses people already understand: a cold drink, a smooth scoop, a kitchen note, a gentle care ritual.",
    image: publicAssets.water.hero,
    icon: Droplets
  },
  {
    title: "Thoughtful sourcing",
    detail: "Our sourcing mindset is simple: stay close to coconut country, respect the ingredient, and choose partners with care.",
    image: publicAssets.brand.harvest,
    icon: Leaf
  },
  {
    title: "Clean processing mindset",
    detail: "We keep product language clear and practical, with taste, texture, and freshness leading the conversation.",
    image: publicAssets.water.ingredients,
    icon: PackageCheck
  },
  {
    title: "Everyday rituals",
    detail: "The products are designed for real routines: breakfast, heat, recipes, after-dinner spoons, and small hosting moments.",
    image: publicAssets.recipes.cooler,
    icon: Waves
  },
  {
    title: "Made for Living",
    detail: "The brand should feel warm enough for home and polished enough for a premium shelf.",
    image: publicAssets.brand.madeForLiving,
    icon: Heart
  }
];

export function AboutJourney() {
  return (
    <PublicSection tone="warm">
      <PublicHeader
        kicker="Our journey"
        title="A coconut story that stays close to real life."
        body="No big promises. Just a warmer, cleaner way to bring coconut into everyday products."
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
        {journey.map((item, index) => {
          const Icon = item.icon;
          return (
            <Appear key={item.title} delay={index * 0.04}>
              <article className="grid h-full overflow-hidden rounded-3xl border border-coconut/10 bg-paper shadow-[0_18px_48px_rgba(62,46,31,0.06)] lg:grid-cols-[0.82fr_1fr]">
                <div className="relative min-h-72">
                  <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 28vw, (min-width: 768px) 46vw, 92vw" className="object-cover" />
                </div>
                <div className="flex min-h-72 flex-col justify-between p-6 md:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-grove/10 text-grove">
                      <Icon size={20} />
                    </span>
                    <span className="text-[0.68rem] font-medium uppercase tracking-editorial text-coconut/38">0{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-4xl font-light leading-tight text-coconut">{item.title}</h3>
                    <p className="mt-5 text-sm leading-7 text-coconut/68">{item.detail}</p>
                  </div>
                </div>
              </article>
            </Appear>
          );
        })}
      </div>
    </PublicSection>
  );
}
