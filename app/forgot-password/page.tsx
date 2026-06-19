import type { Metadata } from "next";
import { CustomerForgotPasswordForm } from "@/components/auth/CustomerAuthForms";
import { FloatingDoodleLayer } from "@/components/BrandDoodles";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Forgot Password",
  description: "Reset your .CO customer account password.",
  path: "/forgot-password"
});

export default function ForgotPasswordPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Forgot Password", path: "/forgot-password" }]} />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_50%,rgba(74,111,74,0.16)_100%)] px-5 py-16 md:px-8 md:py-24">
        <FloatingDoodleLayer density="light" />
        <div className="co-glass mx-auto max-w-xl p-6 md:p-10">
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Password reset</p>
          <h1 className="font-display text-5xl leading-tight text-ink md:text-6xl">Reset your .CO password.</h1>
          <p className="mt-5 text-base leading-8 text-muted">Enter your email and Firebase will send a secure reset link.</p>
          <CustomerForgotPasswordForm />
        </div>
      </section>
    </>
  );
}
