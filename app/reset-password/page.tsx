import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerResetPasswordForm } from "@/components/auth/CustomerAuthForms";
import { MotionSection } from "@/components/brand/BrandPrimitives";
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
      <section className="bg-[var(--co-cream)] px-4 py-10 md:py-20">
        <MotionSection className="co-container max-w-2xl">
          <div className="rounded-[28px] border border-[var(--co-border)] bg-[var(--co-white)] p-5 shadow-[0_18px_55px_rgba(58,36,22,.07)] sm:p-8 md:rounded-[36px] md:p-10">
            <p className="co-label mb-5">New password</p>
            <h1 className="font-['Cormorant_Garamond'] text-[42px] leading-[.95] text-[var(--co-brown)] md:text-[56px]">Create a new password.</h1>
            <p className="mt-4 text-sm leading-6 text-[var(--co-muted)]">Use the secure reset link from your email to complete this step.</p>
            <Suspense fallback={null}>
              <CustomerResetPasswordForm />
            </Suspense>
          </div>
        </MotionSection>
      </section>
    </>
  );
}
