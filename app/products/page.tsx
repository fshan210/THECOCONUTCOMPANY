import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, CTAButton, DoodleIcon, MotionSection, ProductCard, SectionShell, TrustBadge } from "@/components/brand/BrandPrimitives";
import type { DoodleName } from "@/components/brand/BrandPrimitives";
import { StructuredData } from "@/components/seo/StructuredData";
import { shopProducts } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Products",
  description: "Explore the .CO coconut ecosystem: coconut water, ice cream, kitchen, botanica, wellness and lifestyle.",
  path: "/products"
});

const categories: Array<{ label: string; icon: DoodleName }> = [
  { label: "Coconut Water", icon: "bottle" },
  { label: "Ice Cream", icon: "bowl" },
  { label: "Kitchen", icon: "coconut" },
  { label: "Botanica", icon: "leaf" },
  { label: "Ritual", icon: "wave" }
];

export default function ProductsPage() {
  const water = shopProducts[0];
  const melt = shopProducts[1];

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }]} />

      <section className="bg-[var(--co-cream)] pt-8 md:pt-12">
        <div className="co-container">
          <div className="grid min-h-[560px] overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] lg:grid-cols-[0.82fr_1.18fr]">
            <div className="flex flex-col justify-center p-6 md:p-10">
              <h1 className="co-display-section text-[var(--co-ink)]">PRODUCTS</h1>
              <h2 className="mt-5 text-[clamp(26px,3vw,42px)] font-bold leading-tight text-[var(--co-palm)]">
                Pure. Honest. Effective.
              </h2>
              <p className="mt-6 max-w-[32ch] text-base leading-7 text-[var(--co-muted)] [overflow-wrap:anywhere]">
                Made from real coconuts. No shortcuts. No unnecessary ingredients.
              </p>
              <div className="mt-8">
                <CTAButton href="/shop">Explore all products</CTAButton>
              </div>
            </div>
            <div className="grid gap-0 sm:grid-cols-2">
              <BrandImage src={publicAssets.water.hero} alt=".CO coconut water product" sizes="(min-width: 1024px) 32vw, 92vw" aspect="portrait" fit="cover" priority hoverZoom className="h-full min-h-[430px] rounded-none border-0" />
              <BrandImage src={publicAssets.melt.hero} alt="MELT.CO coconut mango ice cream product" sizes="(min-width: 1024px) 32vw, 92vw" aspect="portrait" fit="cover" priority hoverZoom className="h-full min-h-[430px] rounded-none border-0" />
            </div>
          </div>

          <div className="grid gap-4 border-b border-[var(--co-border)] bg-[var(--co-white)] px-4 py-6 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map(({ label, icon }) => (
              <div key={label} className="flex flex-col items-center gap-3 text-center">
                <DoodleIcon name={icon} className="h-9 w-9 text-[var(--co-palm)]" />
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--co-brown)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionShell className="bg-[var(--co-cream)]">
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <MotionSection>
            <BentoCard className="flex h-full min-h-[360px] flex-col justify-between rounded-[24px] bg-[var(--co-white)]">
              <div>
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-[var(--co-palm)]">Bestseller</p>
                <h2 className="co-h2 text-[var(--co-brown)]">.CO Coconut Water</h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-[var(--co-muted)]">
                  Tender coconut water with a clean, easy taste for everyday refreshment.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-6">
                <TrustBadge icon="leaf" title="100% Natural" body="Real coconut taste." />
                <TrustBadge icon="drop" title="Nothing Added" body="Simple and clean." />
              </div>
              <div className="mt-8">
                <CTAButton href="/shop/co-water" variant="outline">Shop now</CTAButton>
              </div>
            </BentoCard>
          </MotionSection>
          <MotionSection delay={0.08}>
            <BrandImage src={publicAssets.water.flatLay} alt=".CO coconut water flat lay with coconut pieces" sizes="(min-width: 1024px) 48vw, 92vw" aspect="landscape" fit="cover" hoverZoom className="h-full min-h-[360px] rounded-[24px]" />
          </MotionSection>
        </div>
      </SectionShell>

      <SectionShell className="bg-[var(--co-white)]">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="co-h2 text-[var(--co-brown)]">Shop by category</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--co-muted)]">A clear product shelf for drink, scoop, cook, care, and daily ritual.</p>
          </div>
          <CTAButton href="/shop" variant="outline">Open shop</CTAButton>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shopProducts.map((product, index) => (
            <MotionSection key={product.slug} delay={index * 0.04}>
              <ProductCard
                title={product.name}
                body={product.shortDescription}
                image={product.image}
                href={`/shop/${product.slug}`}
                badge={index === 0 ? "Bestseller" : product.category}
                imageFit={product.category === "Coconut Water" || product.category === "Ice Cream" ? "contain" : "cover"}
                accent={product.category === "Ice Cream"}
                className="h-full"
              />
            </MotionSection>
          ))}
        </div>
      </SectionShell>
    </>
  );
}
