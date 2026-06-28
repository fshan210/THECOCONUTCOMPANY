import Link from "next/link";
import type { Metadata } from "next";
import { BrandImage } from "@/components/BrandImage";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { BentoCard, CTAButton, DoodleIcon, FeatureStrip, IngredientBadge, MotionSection, ProductSwapImage } from "@/components/brand/BrandPrimitives";
import type { DoodleName } from "@/components/brand/BrandPrimitives";
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
  const water = shopProducts[0];
  const melt = shopProducts[1];
  const shopCategories: Array<{ label: string; icon: DoodleName }> = [
    { label: "Coconut Water", icon: "bottle" },
    { label: "Ice Cream", icon: "bowl" },
    { label: "Kitchen", icon: "coconut" },
    { label: "Botanica", icon: "leaf" },
    { label: "Wellness", icon: "drop" },
    { label: "Lifestyle", icon: "wave" }
  ];
  const trustItems: Array<{ title: string; body: string; icon: DoodleName }> = [
    { title: "Secure payment", body: "100% secure checkout", icon: "bottle" },
    { title: "Easy returns", body: "Hassle-free returns", icon: "wave" },
    { title: "Fast delivery", body: "Cold shelf updates", icon: "palm" },
    { title: "Sustainable packaging", body: "Eco-friendly mindset", icon: "leaf" }
  ];

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }]} />
      <section className="bg-[var(--co-cream)] pt-8 md:pt-12">
        <div className="co-container">
          <div className="grid min-h-[560px] overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] lg:grid-cols-[0.86fr_1.14fr]">
            <div className="flex flex-col justify-center p-6 md:p-10">
              <h1 className="co-display-section text-[var(--co-ink)]">SHOP</h1>
              <h2 className="mt-5 text-[clamp(26px,3vw,42px)] font-bold leading-tight text-[var(--co-palm)]">
                Goodness delivered
                <br />
                to your door.
              </h2>
              <p className="mt-6 max-w-[32ch] text-base leading-7 text-[var(--co-muted)] [overflow-wrap:anywhere]">
                Choose your favourites and enjoy the goodness of real coconut, anytime.
              </p>
              <div className="mt-8">
                <CTAButton href="#all-products">Shop all</CTAButton>
              </div>
            </div>
            <div className="min-h-[430px] p-4 md:p-5">
              <BrandImage
                src={publicAssets.campaign.retailBusiness}
                alt=".CO product carton with coconut water and coconut ice cream"
                sizes="(min-width: 1024px) 54vw, 92vw"
                aspect="wide"
                fit="cover"
                position="center"
                priority
                hoverZoom
                fallbackLabel={`${water.name} and ${melt.name}`}
                className="h-full min-h-[430px] rounded-[32px] border-0"
              />
            </div>
          </div>

          <FeatureStrip className="sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ title, body, icon }) => (
              <div key={title} className="flex items-start gap-3 rounded-[28px] border border-[var(--co-border)] bg-[rgba(255,255,255,0.74)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)]">
                <DoodleIcon name={icon} className="h-8 w-8 shrink-0 text-[var(--co-palm)]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--co-brown)]">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--co-muted)]">{body}</p>
                </div>
              </div>
            ))}
          </FeatureStrip>
        </div>
      </section>

      <section id="all-products" className="co-section bg-[var(--co-white)]">
        <div className="co-container">
          <MotionSection className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="co-label mb-5">All products</p>
              <h2 className="co-h2 max-w-4xl text-[var(--co-brown)]">A clear shelf for every coconut ritual.</h2>
            </div>
            <CTAButton href="/recipes" variant="outline">Pair with recipes</CTAButton>
          </MotionSection>
          <div className="mb-10">
            <p className="co-label mb-5">Shop by category</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {shopProducts.slice(0, 5).map((product) => (
                <Link key={product.slug} href={`/shop/${product.slug}`} className="group block">
                  <article className="co-press overflow-hidden rounded-[24px] border border-[var(--co-border)] bg-[var(--co-cream)] p-2">
                    <BrandImage src={product.image} alt={`${product.category} category`} sizes="(min-width: 1024px) 18vw, 45vw" aspect="square" fit="contain" hoverZoom fallbackLabel={product.category} className="rounded-[24px] border-0 bg-[var(--co-white)]" imageClassName="!p-2 md:!p-3" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--co-brown)]">{product.category}</p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
          <div className="mb-8 flex flex-wrap gap-3">
            {productCategories.map((category, index) => (
              <IngredientBadge key={category} tone={index === 0 ? "sun" : "cream"}>{category}</IngredientBadge>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shopProducts.map((product, index) => (
              <MotionSection key={product.slug} delay={index * 0.04}>
                <BentoCard className="group co-press flex h-full min-h-[540px] flex-col rounded-[32px]">
                  <Link href={`/shop/${product.slug}`} className="block">
                    <ProductSwapImage title={product.name} image={product.image} hoverImage={product.hoverImage} sizes="(min-width: 1024px) 30vw, 92vw" className="mb-6" />
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
                  </Link>
                  <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row sm:items-center sm:justify-between">
                    <Link href={`/shop/${product.slug}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--co-border)] px-4 text-xs font-bold uppercase tracking-[0.12em] text-[var(--co-ink)] transition hover:border-[var(--co-black)]">
                      Product details
                    </Link>
                    <AddToCartButton slug={product.slug} label="Quick add" className="sm:px-5" />
                  </div>
                </BentoCard>
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
            <BrandImage src={publicAssets.campaign.retailBusiness} alt=".CO early access retail shelf and product carton" sizes="(min-width: 768px) 34vw, 92vw" aspect="landscape" fit="cover" hoverZoom className="rounded-[32px]" />
          </BentoCard>
        </div>
      </section>
    </>
  );
}
