import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerResetPasswordForm } from "@/components/auth/CustomerAuthForms";
import { Appear } from "@/components/motion/Appear";
import { PublicSection } from "@/components/PublicDesign";
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
      <PublicSection className="pt-28 md:pt-32">
        <Appear className="mx-auto max-w-xl rounded-3xl border border-coconut/10 bg-[#fff8ea] p-6 shadow-[0_18px_48px_rgba(62,46,31,0.06)] md:p-10">
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">New password</p>
          <h1 className="font-display text-5xl font-light leading-tight text-coconut md:text-6xl">Create a new password.</h1>
          <p className="mt-5 text-base leading-8 text-coconut/70">Use the secure reset link from your email to complete this step.</p>
          <Suspense fallback={null}>
            <CustomerResetPasswordForm />
          </Suspense>
        </Appear>
      </PublicSection>
    </>
  );
}
