import type { Metadata } from "next";
import { HeroStoryCanvas } from "@/components/HeroStoryCanvas";
import { StructuredData } from "@/components/seo/StructuredData";
import {
  BrandWorldTeaser,
  OriginStorySection,
  ProductBentoSection,
  RecipePreviewSection,
  RetailDistributorCTA,
  TasteRitualGrid,
  TestimonialsSection,
  TrustCueStrip
} from "@/components/HomeExperienceSections";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getHomepageContent, getProducts, getRecipes, getTestimonials } from "@/lib/content/server";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomepageContent();
  return createPageMetadata({ title: seo.title, description: seo.description, path: seo.canonicalPath, absoluteTitle: true, index: !seo.noindex, ogImage: seo.ogImage });
}

export default async function HomePage() {
  const [homepage, products, recipes, testimonials] = await Promise.all([getHomepageContent(), getProducts(), getRecipes(), getTestimonials()]);
  const featuredProducts = homepage.featuredProductSlugs.map((slug) => products.find((item) => item.slug === slug)).filter(Boolean) as typeof products;
  const featuredRecipes = homepage.featuredRecipeSlugs.map((slug) => recipes.find((item) => item.slug === slug)).filter(Boolean) as typeof recipes;
  const featuredTestimonials = homepage.featuredTestimonialIds.map((id) => testimonials.find((item) => item.id === id)).filter(Boolean) as typeof testimonials;
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }]} />
      <HeroStoryCanvas content={homepage} />
      <ProductBentoSection products={featuredProducts.length ? featuredProducts : products} />
      <OriginStorySection />
      <TasteRitualGrid />
      <TrustCueStrip />
      <RecipePreviewSection recipes={featuredRecipes.length ? featuredRecipes : recipes} />
      <TestimonialsSection testimonials={featuredTestimonials.length ? featuredTestimonials : testimonials} />
      <RetailDistributorCTA />
      <BrandWorldTeaser />
    </>
  );
}
