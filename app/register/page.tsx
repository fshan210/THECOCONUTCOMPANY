import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CustomerRegisterForm } from "@/components/auth/CustomerAuthForms";
import { BrandImage } from "@/components/BrandImage";
import { BentoCard, MotionSection, TrustBadge } from "@/components/brand/BrandPrimitives";
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
      <section className="bg-[var(--co-cream)] pt-8 md:pt-12">
        <div className="co-container">
          <div className="grid overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-[var(--co-white)] lg:grid-cols-[1.05fr_0.95fr]">
            <MotionSection>
              <BentoCard className="h-full min-h-[590px] rounded-none border-0 shadow-none">
                <p className="co-label mb-5">Create account</p>
                <h1 className="co-h2 text-[var(--co-brown)]">Build your coconut ritual library.</h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-[var(--co-muted)]">A warm customer account for favourite products, saved recipes, and gentle .CO notes.</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <TrustBadge icon="drop" title="Early access" body="First product notes." />
                  <TrustBadge icon="leaf" title="Made for Living" body="Useful coconut rituals." />
                </div>
                <CustomerRegisterForm />
              </BentoCard>
            </MotionSection>
            <MotionSection delay={0.08}>
              <BrandImage src={publicAssets.campaign.retailBusiness} alt=".CO product shelf account registration" sizes="(min-width: 1024px) 46vw, 92vw" aspect="wide" fit="cover" priority hoverZoom className="h-full min-h-[590px] rounded-none border-0" />
            </MotionSection>
          </div>
        </div>
      </section>
    </>
  );
}
