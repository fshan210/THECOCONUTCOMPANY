import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CustomerLoginForm } from "@/components/auth/CustomerAuthForms";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, BillboardWord, MotionSection } from "@/components/brand/BrandPrimitives";
import { StructuredData } from "@/components/seo/StructuredData";
import { getCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Login",
  description: "Login to your .CO customer account.",
  path: "/login"
});

export default async function LoginPage() {
  const session = await getCustomerSession();
  if (session) redirect("/account");

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Login", path: "/login" }]} />
      <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
        <div className="co-container grid gap-4 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
          <MotionSection>
            <BentoCard className="h-full min-h-[620px]">
              <BillboardWord word="LOGIN" className="text-[clamp(72px,11vw,150px)] text-[var(--co-brown)]/[0.08]" />
              <p className="co-label mb-5">Customer account</p>
              <h1 className="co-h2 text-[var(--co-brown)]">Welcome back to your coconut shelf.</h1>
              <p className="co-body mt-6">Save products, revisit recipes, and keep your coconut rituals close.</p>
              <CustomerLoginForm />
            </BentoCard>
          </MotionSection>
          <MotionSection delay={0.08}>
            <BrandImage src={publicAssets.water.lifestyle} alt=".CO coconut water lifestyle" sizes="(min-width: 1024px) 54vw, 92vw" aspect="portrait" fit="cover" priority hoverZoom className="h-full min-h-[620px] rounded-[48px]" />
          </MotionSection>
        </div>
      </section>
    </>
  );
}
