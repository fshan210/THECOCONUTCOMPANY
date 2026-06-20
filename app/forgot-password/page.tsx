import type { Metadata } from "next";
import { CustomerForgotPasswordForm } from "@/components/auth/CustomerAuthForms";
import { Appear } from "@/components/motion/Appear";
import { PublicSection } from "@/components/PublicDesign";
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
      <PublicSection className="pt-28 md:pt-32">
        <Appear className="mx-auto max-w-xl rounded-3xl border border-coconut/10 bg-[#fff8ea] p-6 shadow-[0_18px_48px_rgba(62,46,31,0.06)] md:p-10">
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Password reset</p>
          <h1 className="font-display text-5xl font-light leading-tight text-coconut md:text-6xl">Reset your .CO password.</h1>
          <p className="mt-5 text-base leading-8 text-coconut/70">Enter your email and we will send a secure link to help you get back in.</p>
          <CustomerForgotPasswordForm />
        </Appear>
      </PublicSection>
    </>
  );
}
