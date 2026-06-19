import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerResetPasswordForm } from "@/components/auth/CustomerAuthForms";
import { FloatingDoodleLayer } from "@/components/BrandDoodles";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Reset Password",
  description: "Confirm a new password for your .CO account.",
  path: "/reset-password"
});

export default function ResetPasswordPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Reset Password", path: "/reset-password" }]} />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_50%,rgba(168,176,123,0.22)_100%)] px-5 py-16 md:px-8 md:py-24">
        <FloatingDoodleLayer density="light" />
        <div className="co-glass mx-auto max-w-xl p-6 md:p-10">
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">New password</p>
          <h1 className="font-display text-5xl leading-tight text-ink md:text-6xl">Create a new password.</h1>
          <p className="mt-5 text-base leading-8 text-muted">Use the secure Firebase reset link from your email to complete this step.</p>
          <Suspense fallback={null}>
            <CustomerResetPasswordForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
