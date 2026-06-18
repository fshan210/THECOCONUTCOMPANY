import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Bell, Handshake, Leaf } from "lucide-react";
import { FloatingDoodleLayer } from "@/components/BrandDoodles";
import { Reveal } from "@/components/Motion";
import { StructuredData } from "@/components/seo/StructuredData";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { shopProducts } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/seo/metadata";
import { productSchema } from "@/lib/seo/structured-data";

type ProductPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return shopProducts.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = shopProducts.find((item) => item.slug === params.slug);
  if (!product) return {};

  return createPageMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/shop/${product.slug}`
  });
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = shopProducts.find((item) => item.slug === params.slug);
  if (!product) notFound();

  const sections = [
    { title: "Benefits / use cases", items: product.benefits },
    { title: "Ingredients", items: product.ingredients },
    { title: "How to use", items: product.howToUse },
    { title: "Availability", items: [product.availability] }
  ];
  const compositionBySlug: Record<string, string> = {
    "co-water": "/assets/generated/composition-poolside.webp",
    "melt-co-mango-coconut": "/assets/generated/composition-icecream.webp",
    "co-kitchen-coconut-oil": "/assets/generated/composition-tetra.webp",
    "co-botanica-coconut-care": "/assets/generated/composition-flatlay.webp",
    "co-lifestyle": "/assets/generated/composition-morning.webp"
  };

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
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_48%,rgba(168,176,123,0.24)_100%)] px-5 py-16 md:px-8 md:py-24">
        <FloatingDoodleLayer density="light" />
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.95fr_1.05fr]">
        <Reveal className="co-glass relative aspect-[4/5] overflow-hidden">
          <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-40 opacity-[0.08]" />
          <div className="absolute inset-x-16 bottom-12 h-10 rounded-full bg-coconut/14 blur-xl" />
          <Image src={product.image} alt={product.name} fill priority sizes="(min-width: 768px) 48vw, 100vw" className="object-contain p-5 drop-shadow-[0_26px_36px_rgba(62,46,31,0.2)]" />
        </Reveal>
        <Reveal delay={0.1} className="self-center">
          <Link href="/shop" className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-editorial text-muted">
            <ArrowLeft size={14} /> Shop
          </Link>
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">{product.category}</p>
          <h1 className="font-display text-6xl leading-none text-ink md:text-8xl">{product.name}</h1>
          <p className="mt-6 text-base uppercase tracking-editorial text-coconut">{product.format}</p>
          <p className="mt-8 max-w-2xl text-lg leading-9 text-muted">{product.shortDescription}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <AddToCartButton slug={product.slug} />
            <Link href="/sign-up" className="inline-flex min-h-12 items-center gap-3 border border-shell px-6 py-4 text-sm text-coconut">
              Notify Me <Bell size={16} />
            </Link>
            <Link href="/shop" className="inline-flex min-h-12 items-center gap-3 border border-shell px-6 py-4 text-sm text-coconut">
              Distributor Enquiry <Handshake size={16} />
            </Link>
          </div>
        </Reveal>
        </div>
      </section>
      <section className="px-5 py-8 md:px-8 md:py-12">
        <Reveal className="co-glass mx-auto grid max-w-7xl gap-6 overflow-hidden p-4 md:grid-cols-[0.8fr_1.2fr] md:items-center md:p-6">
          <div className="p-4">
            <p className="mb-4 text-[0.72rem] uppercase tracking-editorial text-grove">Product preview</p>
            <h2 className="font-display text-4xl leading-tight text-ink md:text-5xl">How it lives beyond the packshot.</h2>
            <p className="mt-5 text-sm leading-7 text-muted">A fuller consumer view for retail, hospitality, and everyday use while checkout remains in pre-launch mode.</p>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden bg-[linear-gradient(135deg,#F5EBD7,#fffdf8)]">
            <Image src={compositionBySlug[product.slug] ?? "/assets/generated/composition-flatlay.webp"} alt={`${product.name} composition preview`} fill sizes="(min-width: 768px) 58vw, 92vw" className="object-contain p-3" />
          </div>
        </Reveal>
      </section>
      <section className="bg-paper px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
          {sections.map((section) => (
            <Reveal key={section.title}>
              <article className="co-neu h-full p-6">
                <Leaf className="mb-6 text-grove" size={20} />
                <h2 className="mb-6 font-display text-3xl text-ink">{section.title}</h2>
                <ul className="space-y-4 text-sm leading-7 text-muted">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
