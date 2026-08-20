"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Droplets, HandHeart, Heart, Package, Sprout, TreePalm } from "lucide-react";
import { useRef } from "react";

const milestones = [
  { year: "2020", title: "It all started", body: "A simple idea: build a coconut company around considered products and everyday living.", icon: Sprout },
  { year: "2021", title: "Building the foundation", body: "Early product work turned the idea into a practical sourcing and production plan.", icon: TreePalm },
  { year: "2022", title: "First product direction", body: "The coconut-water ecosystem became the anchor for the wider .CO brand world.", icon: Droplets },
  { year: "2023", title: "Growing the ecosystem", body: "Kitchen, Creamery and Botanica directions expanded the brand beyond one bottle.", icon: Heart },
  { year: "2024", title: "Rooted partnerships", body: "A Pollachi contract-farm anchor and Kerala operating base shaped the sourcing model.", icon: HandHeart },
  { year: "Next", title: "Made for living", body: "Phase-one UHT production and a measured VAP network are the next execution milestones.", icon: Package },
] as const;

function Milestone({ item, index, progress }: { item: (typeof milestones)[number]; index: number; progress: MotionValue<number> }) {
  const threshold = index / (milestones.length - 1);
  const opacity = useTransform(progress, [Math.max(0, threshold - .1), threshold], [.38, 1]);
  const scale = useTransform(progress, [Math.max(0, threshold - .05), threshold, Math.min(1, threshold + .08)], [.96, 1.02, 1]);
  const glow = useTransform(progress, [Math.max(0, threshold - .04), threshold], [0, 1]);
  const Icon = item.icon;
  return (
    <motion.li className="about-milestone" style={{ opacity, scale }}>
      <motion.span className="about-milestone__node" style={{ "--milestone-glow": glow } as React.CSSProperties}><Icon /></motion.span>
      <p>{item.year}</p><h3>{item.title}</h3><small>{item.body}</small>
    </motion.li>
  );
}

export function JourneyScrollStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 78%", "end 32%"] });
  const desktopLine = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section ref={ref} id="our-journey" className="about-journey" aria-labelledby="journey-title">
      <div className="about-journey__heading"><p className="about-eyebrow">Our milestones</p><h2 id="journey-title">Small moments,<br /><em>big meaning.</em></h2><span>Every milestone reminds us why we started—and where we are going.</span></div>
      <ol className="about-timeline">
        <span className="about-timeline__track" aria-hidden="true"><motion.i style={{ scaleX: desktopLine, scaleY: desktopLine }} /></span>
        {milestones.map((item, index) => <Milestone key={item.year} item={item} index={index} progress={scrollYProgress} />)}
      </ol>
    </section>
  );
}
