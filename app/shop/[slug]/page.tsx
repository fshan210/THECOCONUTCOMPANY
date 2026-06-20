import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Bell, Leaf } from "lucide-react";
import { Appear } from "@/components/motion/Appear";
import { HoverImageFrame, PublicSection } from "@/components/PublicDesign";
import { StructuredData } from "@/components/seo/StructuredData";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
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

  const sections = [
    { title: "Benefits / use cases", items: product.benefits },
    { title: "Ingredients", items: product.ingredients },
    { title: "How to use", items: product.howToUse },
    { title: "Availability", items: [product.availability] }
  ];
  const compositionBySlug: Record<string, { image: string; hover?: string }> = {
    "co-water": { image: publicAssets.water.lifestyle, hover: publicAssets.water.flatLay },
    "melt-co-mango-coconut": { image: publicAssets.melt.lifestyle, hover: publicAssets.melt.ingredients },
    "co-kitchen-coconut-oil": { image: publicAssets.ecosystem.kitchenGroup, hover: publicAssets.ecosystem.kitchenAlt },
    "co-botanica-coconut-care": { image: publicAssets.ecosystem.botanicaGroup, hover: publicAssets.ecosystem.botanicaAlt },
    "co-lifestyle": { image: publicAssets.water.hero, hover: publicAssets.water.lifestyle }
  };
  const composition = compositionBySlug[product.slug] ?? { image: publicAssets.water.flatLay };

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
      <PublicSection className="pt-28 md:pt-32">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-center">
          <Appear className="relative aspect-[4/5] min-h-[420px]">
            <HoverImageFrame src={product.image} hoverSrc={product.hoverImage} alt={product.name} sizes="(min-width: 768px) 48vw, 92vw" className="absolute inset-0" />
          </Appear>
          <Appear delay={0.1}>
            <Link href="/shop" className="mb-10 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-editorial text-coconut/62 transition hover:text-grove">
              <ArrowLeft size={14} /> Shop
            </Link>
            <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">{product.category}</p>
            <h1 className="font-display text-6xl font-light leading-none text-coconut md:text-8xl">{product.name}</h1>
            <p className="mt-6 text-base font-medium uppercase tracking-editorial text-coconut">{product.format}</p>
            <p className="mt-8 max-w-2xl text-lg leading-9 text-coconut/70">{product.shortDescription}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <AddToCartButton slug={product.slug} label="Save product" />
              <Link href="/sign-up" className="inline-flex min-h-12 items-center gap-3 rounded-2xl border border-coconut/14 px-6 py-4 text-sm font-medium text-coconut transition hover:border-grove hover:text-grove">
                Notify Me <Bell size={16} />
              </Link>
            </div>
          </Appear>
        </div>
      </PublicSection>

      <PublicSection tone="warm" className="py-12 md:py-16">
        <Appear className="mx-auto grid max-w-7xl gap-6 overflow-hidden rounded-3xl border border-coconut/10 bg-paper p-4 shadow-[0_18px_48px_rgba(62,46,31,0.06)] md:grid-cols-[0.8fr_1.2fr] md:items-center md:p-6">
          <div className="p-4">
            <p className="mb-4 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Product moment</p>
            <h2 className="font-display text-4xl font-light leading-tight text-coconut md:text-5xl">How it lives beyond the packshot.</h2>
            <p className="mt-5 text-sm leading-7 text-coconut/68">A fuller consumer view for taste, table, shelf, recipe, and daily use.</p>
          </div>
          <div className="relative aspect-[16/9] min-h-72">
            <HoverImageFrame src={composition.image} hoverSrc={composition.hover} alt={`${product.name} composition preview`} sizes="(min-width: 768px) 58vw, 92vw" className="absolute inset-0" imageClassName="object-cover" />
          </div>
        </Appear>
      </PublicSection>

      <PublicSection>
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
          {sections.map((section) => (
            <Appear key={section.title}>
              <article className="h-full rounded-3xl border border-coconut/10 bg-[#fff8ea] p-6 shadow-[0_16px_44px_rgba(62,46,31,0.05)]">
                <Leaf className="mb-6 text-grove" size={20} />
                <h2 className="mb-6 font-display text-3xl font-light text-coconut">{section.title}</h2>
                <ul className="space-y-4 text-sm leading-7 text-coconut/68">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </Appear>
          ))}
        </div>
      </PublicSection>
    </>
  );
}
