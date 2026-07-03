import type { Metadata } from "next";
import { CustomerForgotPasswordForm } from "@/components/auth/CustomerAuthForms";
import { MotionSection } from "@/components/brand/BrandPrimitives";
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
      <section className="bg-[var(--co-cream)] px-4 py-10 md:py-20">
        <MotionSection className="co-container max-w-2xl">
          <div className="rounded-[28px] border border-[var(--co-border)] bg-[var(--co-white)] p-5 shadow-[0_18px_55px_rgba(58,36,22,.07)] sm:p-8 md:rounded-[36px] md:p-10">
            <p className="co-label mb-5">Password reset</p>
            <h1 className="font-['Cormorant_Garamond'] text-[42px] leading-[.95] text-[var(--co-brown)] md:text-[56px]">Reset your password.</h1>
            <p className="mt-4 text-sm leading-6 text-[var(--co-muted)]">Enter your email and we will send a secure link to help you get back in.</p>
            <CustomerForgotPasswordForm />
          </div>
        </MotionSection>
      </section>
    </>
  );
}
