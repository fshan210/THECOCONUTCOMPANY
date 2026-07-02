import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CustomerLoginForm } from "@/components/auth/CustomerAuthForms";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, MotionSection, TrustBadge } from "@/components/brand/BrandPrimitives";
import { StructuredData } from "@/components/seo/StructuredData";
import { getCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Login",
  description: "Login to your .CO customer account.",
  path: "/login",
  index: false
});

export default async function LoginPage() {
  const session = await getCustomerSession();
  if (session) redirect("/account");

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Login", path: "/login" }]} />
      <section className="relative overflow-hidden bg-[var(--co-cream)] px-3 pb-8 pt-5 md:px-0 md:pb-14 md:pt-12">
        <div className="pointer-events-none absolute -right-24 top-8 size-80 rounded-full bg-[#d7dfc9]/50 blur-3xl" />
        <div className="co-container">
          <div className="co-premium-glass grid overflow-hidden rounded-[32px] lg:grid-cols-[0.9fr_1.1fr]">
            <MotionSection>
              <BentoCard className="h-full min-h-[560px] rounded-[32px] border-0 bg-transparent p-6 shadow-none md:p-10">
                <p className="co-label mb-5">Customer account</p>
                <h1 className="co-h2 text-[var(--co-brown)]">Welcome back to your coconut shelf.</h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-[var(--co-muted)]">Save products, revisit recipes, and keep your coconut rituals close.</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <TrustBadge icon="bottle" title="Products" body="Keep shelf notes close." />
                  <TrustBadge icon="bowl" title="Recipes" body="Return to rituals." />
                </div>
                <CustomerLoginForm />
              </BentoCard>
            </MotionSection>
            <MotionSection delay={0.08} className="order-first p-3 lg:order-none md:p-5">
              <BrandImage src={publicAssets.campaign.breakfastRitual} alt=".CO breakfast coconut water account ritual" sizes="(min-width: 1024px) 54vw, 92vw" aspect="wide" fit="cover" priority hoverZoom className="h-[260px] rounded-[26px] border-0 lg:h-full lg:min-h-[560px] lg:rounded-[32px]" />
            </MotionSection>
          </div>
        </div>
      </section>
    </>
  );
}
