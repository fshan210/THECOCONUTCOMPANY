import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell, CustomerVerifyEmailForm } from "@/components/auth/CustomerAuthForms";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Verify Email", description: "Verify your .CO account email.", path: "/verify-email", index: false });

export default function VerifyEmailPage() { return <><StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Verify email", path: "/verify-email" }]} /><AuthShell eyebrow="One last step" title="Verify your email." description="Enter the six-digit code we sent to finish setting up your .CO account."><Suspense fallback={null}><CustomerVerifyEmailForm/></Suspense></AuthShell></>; }
