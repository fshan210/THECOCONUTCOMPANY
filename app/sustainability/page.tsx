import type { Metadata } from "next";
import { Leaf, PackageCheck, Sprout } from "lucide-react";
import { Appear } from "@/components/motion/Appear";
import { DoodleImage, HoverImageFrame, PublicHeader, PublicSection } from "@/components/PublicDesign";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Sustainability",
  description: "A simple sustainability mindset for coconut sourcing, ingredients, and everyday product use.",
  path: "/sustainability"
});

const commitments = [
  { title: "Thoughtful sourcing", body: "Stay close to coconut country and choose ingredient partners with care.", icon: Sprout },
  { title: "Clear ingredients", body: "Keep labels and product stories easy for people to understand.", icon: PackageCheck },
  { title: "Whole coconut respect", body: "Look for useful ways coconut can show up across drink, food, care, and home.", icon: Leaf }
];

export default function SustainabilityPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Sustainability", path: "/sustainability" }]} />
      <PublicSection className="pt-28 md:pt-32">
        <DoodleImage src={publicAssets.doodles.rawCoconut} className="right-8 top-20 h-36 w-36 md:h-56 md:w-56" />
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.92fr_1.08fr] md:items-center">
          <Appear>
            <p className="mb-8 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Sustainability</p>
            <h1 className="font-display text-6xl font-light leading-none text-coconut md:text-8xl">Respect for the coconut, simply told.</h1>
            <p className="mt-8 max-w-2xl text-lg leading-9 text-coconut/70">
              Sustainability at .CO begins with useful products, thoughtful sourcing, clear ingredients, and less wasteful thinking.
            </p>
          </Appear>
          <Appear delay={0.1} className="relative min-h-[420px] md:min-h-[540px]">
            <HoverImageFrame src={publicAssets.brand.grove} hoverSrc={publicAssets.brand.harvest} alt="Coconut grove and harvesting" sizes="(min-width: 768px) 48vw, 92vw" className="absolute inset-0" imageClassName="object-cover" />
          </Appear>
        </div>
      </PublicSection>

      <PublicSection tone="warm">
        <PublicHeader kicker="Our commitments" title="Small choices that make the product feel better." body="We keep the sustainability language practical: source thoughtfully, communicate clearly, and make products people can actually use." />
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {commitments.map((item, index) => {
            const Icon = item.icon;
            return (
              <Appear key={item.title} delay={index * 0.08}>
                <article className="h-full rounded-3xl border border-coconut/10 bg-paper p-7 shadow-[0_16px_44px_rgba(62,46,31,0.05)]">
                  <Icon className="mb-8 text-grove" size={24} />
                  <h2 className="font-display text-3xl font-light leading-tight text-coconut">{item.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-coconut/68">{item.body}</p>
                </article>
              </Appear>
            );
          })}
        </div>
      </PublicSection>
    </>
  );
}
