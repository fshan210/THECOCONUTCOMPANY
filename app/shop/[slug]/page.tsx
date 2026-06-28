import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, CTAButton, IngredientBadge, MotionSection, TrustBadge } from "@/components/brand/BrandPrimitives";
import { StructuredData } from "@/components/seo/StructuredData";
import { shopProducts } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/seo/metadata";
import { productSchema } from "@/lib/seo/structured-data";
import { publicAssets } from "@/lib/public-assets";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return shopProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = shopProducts.find((item) => item.slug === slug);
  if (!product) return {};

  return createPageMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/shop/${product.slug}`
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = shopProducts.find((item) => item.slug === slug);
  if (!product) notFound();

  const compositionBySlug: Record<string, string> = {
    "co-water": publicAssets.campaign.breakfastRitual,
    "melt-co-mango-coconut": publicAssets.melt.lifestyle,
    "co-kitchen-coconut-oil": publicAssets.ecosystem.kitchenGroup,
    "co-botanica-coconut-care": publicAssets.ecosystem.botanicaGroup,
    "co-lifestyle": publicAssets.campaign.workoutRitual
  };
  const relatedProducts = shopProducts.filter((item) => item.slug !== product.slug).slice(0, 3);

  return (
    <>
      <StructuredData
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: product.name, path: `/shop/${product.slug}` }
        ]}
        extra={[productSchema(product)]}
      />
      <section className="bg-[var(--co-cream)] pt-8 md:pt-12">
        <div className="co-container">
          <Link href="/shop" className="co-label mb-8 inline-flex min-h-11 items-center text-[var(--co-muted)] transition hover:text-[var(--co-palm)]">Back to shop</Link>
          <div className="grid min-h-[620px] overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] lg:grid-cols-[0.86fr_1.14fr]">
            <MotionSection>
              <div className="flex h-full min-h-[480px] flex-col justify-center p-6 md:p-10">
                <div>
                  <p className="co-label mb-5">{product.category}</p>
                  <h1 className="co-display-section text-[var(--co-ink)]">{product.name}</h1>
                  <p className="mt-6 text-sm font-bold uppercase tracking-[0.12em] text-[var(--co-brown)]">{product.format}</p>
                  <p className="mt-7 max-w-xl text-base leading-7 text-[var(--co-muted)]">{product.shortDescription}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <AddToCartButton slug={product.slug} label="Save product" />
                    <CTAButton href="/register" variant="outline">Early access</CTAButton>
                  </div>
                </div>
                <div className="mt-9 grid gap-4 sm:grid-cols-2">
                  <TrustBadge icon="drop" title={product.benefits[0] || "Coconut first"} body="Product cue" />
                  <TrustBadge icon="cold" title={product.status === "coming-soon" ? "Early access" : "Preview"} body="Availability" />
                </div>
              </div>
            </MotionSection>
            <MotionSection delay={0.08} className="p-4 md:p-5">
              <BrandImage
                src={product.image}
                alt={product.name}
                sizes="(min-width: 1024px) 54vw, 92vw"
                aspect="wide"
                fit="contain"
                priority
                hoverZoom
                fallbackLabel={product.name}
                className="h-full min-h-[480px] rounded-[32px] border-0 bg-[var(--co-cream)]"
              />
            </MotionSection>
          </div>
          <div className="sticky bottom-3 z-40 mt-4 flex flex-col gap-4 rounded-[24px] border border-[var(--co-border)] bg-[rgba(245,235,215,0.94)] p-4 shadow-[0_20px_54px_rgba(58,36,22,0.14)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[var(--co-brown)]">{product.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[var(--co-muted)]">{product.status === "coming-soon" ? "Early access" : "Product preview"} / {product.format}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <AddToCartButton slug={product.slug} label="Save to shelf" className="w-full sm:w-auto" />
              <CTAButton href="/register" variant="outline" className="w-full sm:w-auto">Join early access</CTAButton>
            </div>
          </div>
        </div>
      </section>

      <section className="co-section bg-[var(--co-white)]">
        <div className="co-container grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <MotionSection>
            <BrandImage src={compositionBySlug[product.slug] || publicAssets.water.flatLay} alt={`${product.name} lifestyle composition`} sizes="(min-width: 1024px) 44vw, 92vw" aspect="portrait" fit="cover" hoverZoom className="h-full min-h-[560px] rounded-[40px]" />
          </MotionSection>
          <MotionSection delay={0.08}>
            <BentoCard className="h-full min-h-[560px]">
              <p className="co-label mb-5">Why it works</p>
              <h2 className="co-h2 text-[var(--co-brown)]">A clear reason to keep it close.</h2>
              <div className="mt-9 grid gap-3">
                {product.benefits.map((benefit, index) => (
                  <IngredientBadge key={benefit} tone={index === 0 ? "sun" : "cream"}>{benefit}</IngredientBadge>
                ))}
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                <div>
                  <p className="co-label mb-4">Ingredients</p>
                  <ul className="space-y-3 text-base leading-7 text-[var(--co-muted)]">
                    {product.ingredients.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="co-label mb-4">How to use</p>
                  <ul className="space-y-3 text-base leading-7 text-[var(--co-muted)]">
                    {product.howToUse.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </BentoCard>
          </MotionSection>
        </div>
      </section>

      <section className="co-section bg-[var(--co-cream)] pt-0">
        <div className="co-container">
          <MotionSection className="mb-8 max-w-4xl">
            <p className="co-label mb-5">Product story</p>
            <h2 className="co-h2 text-[var(--co-brown)]">From ingredient to ritual, every frame has a reason.</h2>
          </MotionSection>
          <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <MotionSection>
              <BrandImage
                src={product.hoverImage || product.image}
                alt={`${product.name} product detail and packaging`}
                sizes="(min-width: 1024px) 54vw, 92vw"
                aspect="wide"
                fit="contain"
                hoverZoom
                className="h-full min-h-[420px] rounded-[40px] bg-[var(--co-white)]"
              />
            </MotionSection>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <MotionSection delay={0.06}>
                <BrandImage src={publicAssets.journey.grove} alt="Kerala coconut grove at the beginning of the .CO product journey" sizes="(min-width: 1024px) 38vw, 92vw" aspect="landscape" fit="cover" hoverZoom className="rounded-[32px]" />
              </MotionSection>
              <MotionSection delay={0.1}>
                <BrandImage src={publicAssets.journey.processing} alt="Careful coconut processing and bottling" sizes="(min-width: 1024px) 38vw, 92vw" aspect="landscape" fit="cover" hoverZoom className="rounded-[32px]" />
              </MotionSection>
            </div>
          </div>
        </div>
      </section>

      <section className="co-section bg-[var(--co-white)] pt-0">
        <div className="co-container">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="co-label mb-5">Continue exploring</p>
              <h2 className="co-h2 text-[var(--co-brown)]">More from the coconut shelf.</h2>
            </div>
            <CTAButton href="/shop" variant="outline">View all products</CTAButton>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedProducts.map((item, index) => (
              <MotionSection key={item.slug} delay={index * 0.05}>
                <Link href={`/shop/${item.slug}`} className="group block h-full">
                  <BentoCard className="co-press h-full rounded-[32px]">
                    <BrandImage src={item.image} alt={item.name} sizes="(min-width: 768px) 31vw, 92vw" aspect="product" fit="contain" hoverZoom className="mb-6 rounded-[24px] bg-[var(--co-cream)]" />
                    <p className="co-label mb-3">{item.category}</p>
                    <h3 className="text-3xl font-bold leading-[0.94] text-[var(--co-brown)]">{item.name}</h3>
                    <p className="mt-4 text-sm leading-6 text-[var(--co-muted)]">{item.shortDescription}</p>
                  </BentoCard>
                </Link>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
