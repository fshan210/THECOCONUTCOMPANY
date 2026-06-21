import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, BillboardWord, CTAButton, IngredientBadge, MotionSection, ProductTile } from "@/components/brand/BrandPrimitives";
import { StructuredData } from "@/components/seo/StructuredData";
import { productCategories, shopProducts } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Shop",
  description: "Explore .CO coconut water, ice cream, kitchen, botanica, wellness and lifestyle previews.",
  path: "/shop"
});

export default function ShopPage() {
  const heroProduct = shopProducts[0];

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }]} />
      <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
        <div className="co-container">
          <MotionSection>
            <BillboardWord word="SHOP" className="co-display-section text-[var(--co-brown)]/[0.08]" />
          </MotionSection>
          <div className="co-grid-12 mt-4 items-stretch md:-mt-4">
            <MotionSection className="lg:col-span-6">
              <BentoCard className="flex h-full min-h-[560px] flex-col justify-between">
                <div>
                  <p className="co-label mb-5">Product shelf</p>
                  <h1 className="text-[clamp(36px,8vw,118px)] font-bold leading-[0.84] text-[var(--co-ink)]">
                    Buy into a colder coconut ritual.
                  </h1>
                  <p className="co-body mt-7 max-w-xl">Explore the bottle, the scoop, the kitchen note, the care direction, and the larger .CO world.</p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  {productCategories.map((category) => (
                    <IngredientBadge key={category}>{category}</IngredientBadge>
                  ))}
                </div>
              </BentoCard>
            </MotionSection>
            <MotionSection delay={0.08} className="mt-4 lg:col-span-6 lg:mt-0">
              <ProductTile
                title={heroProduct.name}
                eyebrow="Featured product"
                body={heroProduct.shortDescription}
                image={heroProduct.image}
                hoverImage={heroProduct.hoverImage}
                href={`/shop/${heroProduct.slug}`}
                word="WATER"
                className="h-full"
              />
            </MotionSection>
          </div>
        </div>
      </section>

      <section className="co-section bg-[var(--co-white)]">
        <div className="co-container">
          <MotionSection className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="co-label mb-5">All products</p>
              <h2 className="co-h2 max-w-4xl text-[var(--co-brown)]">A clear shelf for every coconut ritual.</h2>
            </div>
            <CTAButton href="/recipes" variant="outline">Pair with recipes</CTAButton>
          </MotionSection>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shopProducts.map((product, index) => (
              <MotionSection key={product.slug} delay={index * 0.04}>
                <Link href={`/shop/${product.slug}`} className="group block h-full">
                  <BentoCard className="co-press flex h-full flex-col">
                    <div className="relative mb-6">
                      <BrandImage src={product.image} alt={product.name} sizes="(min-width: 1024px) 30vw, 92vw" aspect="product" fit="contain" hoverZoom fallbackLabel={product.name} className="rounded-[36px]" />
                      {product.hoverImage ? (
                        <Image
                          src={product.hoverImage}
                          alt=""
                          aria-hidden="true"
                          fill
                          sizes="(min-width: 1024px) 30vw, 92vw"
                          className="rounded-[36px] object-contain p-6 opacity-0 transition duration-500 ease-out group-hover:opacity-100"
                        />
                      ) : null}
                    </div>
                    <p className="co-label mb-4">{product.category}</p>
                    <div className="mb-5 flex flex-wrap gap-2">
                      {product.benefits.slice(0, 2).map((benefit) => (
                        <span key={benefit} className="rounded-full border border-[var(--co-border)] bg-[var(--co-cream)] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--co-brown)]">
                          {benefit}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-[clamp(34px,4vw,58px)] font-bold leading-[0.9] text-[var(--co-brown)]">{product.name}</h2>
                    <p className="co-body mt-5">{product.shortDescription}</p>
                    <span className="mt-7 inline-flex w-fit rounded-full border border-[var(--co-border)] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--co-ink)] transition group-hover:border-[var(--co-black)] group-hover:bg-[var(--co-black)] group-hover:text-[var(--co-white)]">
                      Product details
                    </span>
                  </BentoCard>
                </Link>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      <section className="co-section bg-[var(--co-cream)]">
        <div className="co-container">
          <BentoCard tone="dark" className="grid gap-8 md:grid-cols-[1fr_0.62fr] md:items-center">
            <div>
              <p className="co-label mb-5 text-[var(--co-sun)]">Early access</p>
              <h2 className="co-h2">First taste notes, cold shelf updates, and product availability.</h2>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68">A focused customer path for people who want the cold bottle and the wider coconut world first.</p>
              <div className="mt-8">
                <CTAButton href="/register" variant="light">Create account</CTAButton>
              </div>
            </div>
            <BrandImage src={publicAssets.water.flatLay} alt=".CO early access product flat lay" sizes="(min-width: 768px) 34vw, 92vw" aspect="landscape" fit="cover" hoverZoom className="rounded-[36px]" />
          </BentoCard>
        </div>
      </section>
    </>
  );
}
