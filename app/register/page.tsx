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
  path: "/register",
  index: false
});

export default async function RegisterPage() {
  const session = await getCustomerSession();
  if (session) redirect("/account");

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Register", path: "/register" }]} />
      <section className="bg-[var(--co-cream)] pt-8 md:pt-12">
        <div className="co-container">
          <div className="grid overflow-hidden rounded-[28px] border border-[var(--co-border)] bg-[var(--co-white)] lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[32px]">
            <MotionSection>
              <BentoCard className="h-full min-h-0 rounded-[28px] border-0 p-5 shadow-none sm:p-7 md:p-10 lg:min-h-[590px] lg:rounded-[32px]">
                <p className="co-label mb-5">Create account</p>
                <h1 className="co-h2 max-md:text-[42px] max-md:leading-[.95] text-[var(--co-brown)]">Create your .CO account.</h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--co-muted)] md:mt-6 md:text-base md:leading-7">Save favourite products, recipes and account details in one calm place.</p>
                <div className="mt-8 hidden gap-4 sm:grid sm:grid-cols-2">
                  <TrustBadge icon="drop" title="Early access" body="First product notes." />
                  <TrustBadge icon="leaf" title="Made for Living" body="Useful coconut rituals." />
                </div>
                <CustomerRegisterForm />
              </BentoCard>
            </MotionSection>
            <MotionSection delay={0.08} className="hidden p-4 md:p-5 lg:block">
              <BrandImage src={publicAssets.campaign.retailBusiness} alt=".CO product shelf account registration" sizes="(min-width: 1024px) 46vw, 92vw" aspect="wide" fit="cover" priority hoverZoom className="h-full min-h-[590px] rounded-[32px] border-0" />
            </MotionSection>
          </div>
        </div>
      </section>
    </>
  );
}
