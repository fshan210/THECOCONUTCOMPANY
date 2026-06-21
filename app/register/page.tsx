import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CustomerRegisterForm } from "@/components/auth/CustomerAuthForms";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, BillboardWord, MotionSection } from "@/components/brand/BrandPrimitives";
import { StructuredData } from "@/components/seo/StructuredData";
import { getCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Register",
  description: "Create your .CO customer account.",
  path: "/register"
});

export default async function RegisterPage() {
  const session = await getCustomerSession();
  if (session) redirect("/account");

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Register", path: "/register" }]} />
      <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
        <div className="co-container grid gap-4 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <MotionSection>
            <BentoCard className="h-full min-h-[640px]">
              <BillboardWord word="JOIN" className="text-[clamp(72px,11vw,150px)] text-[var(--co-brown)]/[0.08]" />
              <p className="co-label mb-5">Create account</p>
              <h1 className="co-h2 text-[var(--co-brown)]">Build your coconut ritual library.</h1>
              <p className="co-body mt-6">A warm customer account for favourite products, saved recipes, and gentle .CO notes.</p>
              <CustomerRegisterForm />
            </BentoCard>
          </MotionSection>
          <MotionSection delay={0.08}>
            <BrandImage src={publicAssets.water.hero} alt=".CO coconut water product story" sizes="(min-width: 1024px) 42vw, 92vw" aspect="portrait" fit="contain" priority hoverZoom className="h-full min-h-[640px] rounded-[48px]" />
          </MotionSection>
        </div>
      </section>
    </>
  );
}
