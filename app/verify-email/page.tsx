import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell, CustomerVerifyEmailForm } from "@/components/auth/CustomerAuthForms";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getPendingVerification, maskEmail } from "@/lib/auth/verification-state";

export const metadata: Metadata = createPageMetadata({ title: "Verify Email", description: "Verify your .CO account email.", path: "/verify-email", index: false });

export default async function VerifyEmailPage() {
  const pending = await getPendingVerification();
  return <><StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Verify email", path: "/verify-email" }]} /><AuthShell variant="verify" eyebrow="The entry" title={<>Enter the code<br/>we sent to<br/><em>your email</em></>} description="Take your time. Enter all six digits from the message we sent."><Suspense fallback={null}><CustomerVerifyEmailForm initialEmail={pending?.email} maskedDestination={pending ? maskEmail(pending.email) : undefined} initialReturnTo={pending?.returnTo}/></Suspense></AuthShell></>;
}
