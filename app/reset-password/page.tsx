import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerResetPasswordForm } from "@/components/auth/CustomerAuthForms";
import { BentoCard, BillboardWord, MotionSection } from "@/components/brand/BrandPrimitives";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Reset Password",
  description: "Confirm a new password for your .CO account.",
  path: "/reset-password",
  index: false
});

export default function ResetPasswordPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Reset Password", path: "/reset-password" }]} />
      <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
        <MotionSection className="co-container max-w-2xl">
          <BentoCard>
            <BillboardWord word="NEW" className="text-[clamp(68px,12vw,140px)] text-[var(--co-brown)]/[0.08]" />
            <p className="co-label mb-5">New password</p>
            <h1 className="co-h2 text-[var(--co-brown)]">Create a new password.</h1>
            <p className="co-body mt-5">Use the secure reset link from your email to complete this step.</p>
            <Suspense fallback={null}>
              <CustomerResetPasswordForm />
            </Suspense>
          </BentoCard>
        </MotionSection>
      </section>
    </>
  );
}
