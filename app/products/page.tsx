import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, BillboardWord, CTAButton, IngredientBadge, MotionSection, ProductMarquee, ProductTile } from "@/components/brand/BrandPrimitives";
import { StructuredData } from "@/components/seo/StructuredData";
import { shopProducts } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Products",
  description: "Explore the .CO coconut ecosystem: coconut water, ice cream, kitchen, botanica, wellness and lifestyle.",
  path: "/products"
});

const productWords = ["WATER", "MELT", "KITCHEN", "CARE", "RITUAL"];

export default function ProductsPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }]} />
      <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
        <div className="co-container">
          <MotionSection>
            <BillboardWord word="PRODUCTS" className="co-display-section text-[var(--co-brown)]/[0.08]" />
          </MotionSection>
          <div className="co-grid-12 mt-4 items-end md:-mt-3">
            <MotionSection className="lg:col-span-7">
              <h1 className="text-[clamp(36px,9vw,132px)] font-bold leading-[0.84] text-[var(--co-ink)]">
                One coconut house. Many everyday rituals.
              </h1>
              <p className="co-body mt-7 max-w-2xl">
                Drink, scoop, cook, care, and live with coconut through a focused product family.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {productWords.map((word, index) => (
                  <IngredientBadge key={word} tone={index === 1 ? "sun" : "cream"}>{word}</IngredientBadge>
                ))}
              </div>
            </MotionSection>
            <MotionSection delay={0.08} className="mt-5 lg:col-span-5 lg:mt-0">
              <BrandImage src={publicAssets.water.flatLay} alt=".CO coconut water flat lay" sizes="(min-width: 1024px) 40vw, 92vw" aspect="landscape" fit="cover" priority hoverZoom className="rounded-[48px] shadow-[0_24px_70px_rgba(58,36,22,0.1)]" />
            </MotionSection>
          </div>
        </div>
      </section>

      <ProductMarquee words={productWords} />

      <section className="co-section bg-[var(--co-white)]">
        <div className="co-container">
          <MotionSection className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="co-label mb-5">Product house</p>
              <h2 className="co-h2 max-w-4xl text-[var(--co-brown)]">Packshots, rituals, and shelf logic.</h2>
            </div>
            <CTAButton href="/shop">Shop product shelf</CTAButton>
          </MotionSection>
          <div className="grid gap-4 md:grid-cols-2">
            {shopProducts.map((product, index) => (
              <MotionSection key={product.slug} delay={index * 0.04}>
                <ProductTile
                  title={product.name}
                  eyebrow={`${product.category} / ${product.format}`}
                  body={product.shortDescription}
                  image={product.image}
                  hoverImage={product.hoverImage}
                  href={`/shop/${product.slug}`}
                  word={product.category.split(" ")[0]}
                  trust={product.benefits}
                  className="h-full"
                />
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      <section className="co-section bg-[var(--co-cream)]">
        <div className="co-container grid gap-4 md:grid-cols-3">
          {[
            ["Serve cold", "The bottle has a clear everyday job: fridge, glass, heat, reset."],
            ["Coconut-first", "Every product starts from a coconut ritual people already know."],
            ["Easy to choose", "Large images, clear names, and simple copy keep every product easy to understand."]
          ].map(([title, body], index) => (
            <MotionSection key={title} delay={index * 0.05}>
              <BentoCard tone={index === 1 ? "green" : "white"} className="h-full">
                <p className="text-7xl font-bold leading-none opacity-20">0{index + 1}</p>
                <h3 className="mt-8 text-4xl font-bold leading-none">{title}</h3>
                <p className={`mt-5 text-base leading-7 ${index === 1 ? "text-white/70" : "text-[var(--co-muted)]"}`}>{body}</p>
              </BentoCard>
            </MotionSection>
          ))}
        </div>
      </section>
    </>
  );
}
