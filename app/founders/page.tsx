import Image from "next/image";
import type { Metadata } from "next";
import { Heart, Sprout, Waves } from "lucide-react";
import { JournalGrid } from "@/components/JournalGrid";
import { Appear } from "@/components/motion/Appear";
import { DoodleImage, PublicHeader, PublicSection } from "@/components/PublicDesign";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

const founders = [
  {
    name: "Fazil Shersha",
    role: "Founder / Brand",
    image: publicAssets.water.lifestyle,
    bio: "Shapes the brand world, product storytelling, and the feeling that .CO should be premium without becoming distant."
  },
  {
    name: "Afsala Muthali",
    role: "Co-founder / Product warmth",
    image: publicAssets.water.flatLay,
    bio: "Keeps the product lens close to home, taste, everyday rituals, and the human details that make coconut feel familiar."
  }
];

const journey = [
  { title: "Close to coconut country", body: "The brand begins with the taste and memory of coconut in daily life.", icon: Sprout },
  { title: "Useful products", body: "Every product should earn its place in a fridge, freezer, shelf, or recipe.", icon: Heart },
  { title: "Warm design", body: "Premium, but still human. Clean, but never cold.", icon: Waves }
];

export const metadata: Metadata = createPageMetadata({
  title: "Founders",
  description: "Meet the founders building .CO around coconut rituals, taste, and Made for Living warmth.",
  path: "/founders"
});

export default function FoundersPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Founders", path: "/founders" }]} />
      <PublicSection className="pt-28 md:pt-32">
        <DoodleImage src={publicAssets.doodles.rawCoconut} className="right-8 top-20 h-36 w-36 md:h-56 md:w-56" />
        <Appear className="mx-auto max-w-7xl">
          <p className="mb-8 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Founders</p>
          <h1 className="max-w-5xl font-display text-6xl font-light leading-none text-coconut md:text-8xl">Built by founders who care about ordinary rituals.</h1>
          <p className="mt-8 max-w-2xl text-lg leading-9 text-coconut/70">
            .CO is shaped by taste, memory, product clarity, and the belief that coconut can feel both premium and deeply familiar.
          </p>
        </Appear>
      </PublicSection>

      <PublicSection tone="warm">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          {founders.map((founder, index) => (
            <Appear key={founder.name} delay={index * 0.1}>
              <article className="h-full overflow-hidden rounded-3xl border border-coconut/10 bg-paper shadow-[0_18px_48px_rgba(62,46,31,0.06)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#fff8ea]">
                  <Image src={founder.image} alt={founder.name} fill sizes="(min-width: 768px) 46vw, 92vw" className="object-cover transition duration-700 hover:scale-[1.03]" />
                </div>
                <div className="p-8 md:p-10">
                  <p className="mb-4 text-[0.7rem] font-medium uppercase tracking-editorial text-grove">{founder.role}</p>
                  <h2 className="font-display text-5xl font-light text-coconut">{founder.name}</h2>
                  <p className="mt-6 text-base leading-8 text-coconut/68">{founder.bio}</p>
                </div>
              </article>
            </Appear>
          ))}
        </div>
      </PublicSection>

      <PublicSection>
        <div className="mx-auto mb-16 grid max-w-7xl gap-5 md:grid-cols-3">
          {journey.map((item, index) => {
            const Icon = item.icon;
            return (
              <Appear key={item.title} delay={index * 0.08}>
                <article className="h-full rounded-3xl border border-coconut/10 bg-[#fff8ea] p-7 shadow-[0_16px_44px_rgba(62,46,31,0.05)]">
                  <Icon className="mb-8 text-grove" size={24} />
                  <h2 className="font-display text-3xl font-light text-coconut">{item.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-coconut/68">{item.body}</p>
                </article>
              </Appear>
            );
          })}
        </div>
        <PublicHeader kicker="Journal" title="Notes from the founders' desk." />
        <div className="mx-auto max-w-7xl">
          <JournalGrid />
        </div>
      </PublicSection>
    </>
  );
}
