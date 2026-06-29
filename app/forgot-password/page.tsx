import type { Metadata } from "next";
import { CustomerForgotPasswordForm } from "@/components/auth/CustomerAuthForms";
import { BentoCard, BillboardWord, MotionSection } from "@/components/brand/BrandPrimitives";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Forgot Password",
  description: "Reset your .CO customer account password.",
  path: "/forgot-password",
  index: false
});

export default function ForgotPasswordPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Forgot Password", path: "/forgot-password" }]} />
      <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
        <MotionSection className="co-container max-w-2xl">
          <BentoCard>
            <BillboardWord word="RESET" className="text-[clamp(68px,12vw,140px)] text-[var(--co-brown)]/[0.08]" />
            <p className="co-label mb-5">Password reset</p>
            <h1 className="co-h2 text-[var(--co-brown)]">Reset your .CO password.</h1>
            <p className="co-body mt-5">Enter your email and we will send a secure link to help you get back in.</p>
            <CustomerForgotPasswordForm />
          </BentoCard>
        </MotionSection>
      </section>
    </>
  );
}
