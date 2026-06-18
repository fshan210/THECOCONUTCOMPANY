"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Factory, Globe2, MapPinned, PackageCheck, Sprout, Users } from "lucide-react";
import { FloatingDoodleLayer } from "@/components/BrandDoodles";
import { coconutEase, useCoconutMotionMode } from "@/lib/animations/coconut-motion";

const journey = [
  {
    title: "Palakkad",
    detail: "The brand begins in Kerala's coconut country, keeping origin, community knowledge, and sourcing intelligence close to the land.",
    accent: "Origin map",
    image: "/optimized/assets-farming-kerala-coconut-palm.webp",
    visual: "map",
    icon: MapPinned
  },
  {
    title: "Farmers",
    detail: "Farm relationships form the first line of quality, with accountable supply, harvest discipline, and closer origin visibility.",
    accent: "Farm network",
    image: "/optimized/assets-farms-coconut-harvesting.webp",
    visual: "farm",
    icon: Users
  },
  {
    title: "VAP",
    detail: "Village aggregation points reduce handling loss and create a practical local route into the product system.",
    accent: "Village aggregation",
    image: "/assets/generated/journey-aggregation.webp",
    visual: "vap",
    icon: Sprout
  },
  {
    title: "Manufacturing",
    detail: "Cold-chain discipline, bottling standards, and format development turn raw origin into a modern house system.",
    accent: "Bottling flow",
    image: "/assets/generated/journey-manufacturing.webp",
    visual: "manufacturing",
    icon: Factory
  },
  {
    title: "UAE",
    detail: "A first international route connects Kerala to Dubai through hospitality, premium retail, and diaspora demand.",
    accent: "Kerala to Dubai",
    image: "/assets/generated/journey-uae.webp",
    visual: "route",
    icon: PackageCheck
  },
  {
    title: "Global Expansion",
    detail: "The long horizon is a coconut lifestyle house: beverage, food, care, kitchen, and culture.",
    accent: "World reveal",
    image: "/assets/generated/journey-global.webp",
    visual: "global",
    icon: Globe2
  }
];

export function AboutJourney() {
  const motionMode = useCoconutMotionMode();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F5EBD7_0%,#fffdf8_46%,rgba(168,176,123,0.3)_100%)] px-5 py-16 md:px-8 md:py-24">
      <FloatingDoodleLayer density="light" />
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-[30vw] opacity-[0.08]" />
      <div className="mx-auto mb-14 grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Coconut journey</p>
          <h2 className="font-display text-5xl leading-tight text-ink md:text-7xl">From a Kerala grove to a global table.</h2>
        </div>
        <p className="max-w-2xl text-base leading-8 text-muted md:text-lg md:leading-9">
          Each stage pairs a real visual cue with the operating system behind .CO: origin, farmers, aggregation, manufacturing, UAE access, and the wider coconut house.
        </p>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-grove/0 via-grove/34 to-grove/0 md:block" />
        <div className="grid gap-6">
          {journey.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={motionMode.shouldReduce ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
                whileInView={motionMode.shouldReduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ duration: 0.82, delay: index * 0.04, ease: coconutEase }}
                className="co-glass relative grid overflow-hidden p-4 md:grid-cols-[0.76fr_1.24fr] md:gap-6 md:p-6"
              >
                <div className="relative z-10 flex min-h-80 flex-col justify-between bg-[linear-gradient(145deg,#fffdf8,#F5EBD7)] p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-grove text-paper shadow-[0_16px_34px_rgba(74,111,74,0.24)]">
                      <Icon size={20} />
                    </span>
                    <span className="text-[0.68rem] uppercase tracking-editorial text-grove">{item.accent}</span>
                  </div>
                  <div>
                    <p className="mb-4 font-display text-7xl leading-none text-coconut/16">0{index + 1}</p>
                    <h3 className="font-display text-5xl leading-none text-ink md:text-6xl">{item.title}</h3>
                    <p className="mt-6 max-w-md text-sm leading-7 text-muted md:text-base md:leading-8">{item.detail}</p>
                  </div>
                </div>
                <JourneyVisual index={index} reduceMotion={motionMode.shouldReduce} image={item.image} title={item.title} visual={item.visual} />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function JourneyVisual({
  index,
  reduceMotion,
  image,
  title,
  visual
}: {
  index: number;
  reduceMotion: boolean;
  image: string;
  title: string;
  visual: string;
}) {
  const labels: Record<string, string[]> = {
    map: ["Palakkad", "Kerala", "Origin"],
    farm: ["Harvest", "Farm gate", "Quality"],
    vap: ["Village", "Sorting", "Cold route"],
    manufacturing: ["Wash", "Chill", "Bottle"],
    route: ["India", "UAE", "Hospitality"],
    global: ["Water", "Food", "Care"]
  };

  return (
    <div className="co-glass relative mt-4 min-h-80 overflow-hidden bg-porcelain md:mt-0 md:min-h-[430px]">
      <Image
        src={image}
        alt={`${title} stage of the .CO coconut journey`}
        fill
        sizes="(min-width: 1024px) 58vw, (min-width: 768px) 52vw, 92vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-porcelain/72 via-porcelain/28 to-coconut/34" />
      <StageOverlay visual={visual} reduceMotion={reduceMotion} index={index} />
      <div className="absolute bottom-5 left-5 right-5 grid gap-2 sm:grid-cols-3">
        {(labels[visual] ?? labels.global).map((label) => (
          <span key={label} className="co-glass-dark px-3 py-2 text-center text-[0.62rem] uppercase tracking-editorial text-paper/82">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function StageOverlay({ visual, reduceMotion, index }: { visual: string; reduceMotion: boolean; index: number }) {
  if (visual === "manufacturing") {
    return (
      <div className="absolute inset-x-6 top-1/2 grid -translate-y-1/2 gap-3 sm:grid-cols-3">
        {["Wash", "Fill", "Pack"].map((step, stepIndex) => (
          <motion.div
            key={step}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: stepIndex * 0.12, duration: 0.6, ease: coconutEase }}
            className="co-glass grid min-h-20 place-items-center text-xs uppercase tracking-editorial text-coconut"
          >
            {step}
          </motion.div>
        ))}
      </div>
    );
  }

  if (visual === "farm" || visual === "vap") {
    return (
      <div className="absolute inset-8">
        <motion.div
          initial={reduceMotion ? false : { scaleX: 0 }}
          whileInView={reduceMotion ? undefined : { scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: coconutEase }}
          className="absolute left-[12%] top-1/2 h-px w-[76%] origin-left bg-gradient-to-r from-coconut/10 via-grove/75 to-coconut/10"
        />
        {[0, 1, 2, 3].map((node) => (
          <motion.span
            key={node}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + node * 0.12, duration: 0.58, ease: coconutEase }}
            className="absolute grid h-9 w-9 place-items-center rounded-full border border-paper/60 bg-grove text-paper shadow-[0_0_24px_rgba(74,111,74,0.24)]"
            style={{ left: `${10 + node * 24}%`, top: `${42 + (node % 2 === 0 ? -12 : 10)}%` }}
          >
            <ArrowRight size={14} />
          </motion.span>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1.05, ease: coconutEase }}
      className="absolute inset-10 rounded-[48%] border border-grove/42"
    >
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-grove/20" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-grove/20" />
      <motion.span
        animate={reduceMotion ? undefined : { offsetDistance: ["0%", "100%"] }}
        transition={{ duration: 9 + index, repeat: Infinity, ease: "linear" }}
        className="absolute h-3 w-3 rounded-full bg-sun shadow-[0_0_24px_rgba(216,192,122,0.8)] [offset-path:ellipse(42%_36%_at_50%_50%)]"
      />
    </motion.div>
  );
}
