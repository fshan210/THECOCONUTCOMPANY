import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell, CustomerResetPasswordForm } from "@/components/auth/CustomerAuthForms";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Choose a New Password", description: "Set a new password for your .CO account.", path: "/reset-password", index: false });

export default function ResetPasswordPage() { return <><StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "New password", path: "/reset-password" }]} /><AuthShell eyebrow="Secure reset" title="Choose a new password." description="Use the six-digit code from your email, then choose a strong new password."><Suspense fallback={null}><CustomerResetPasswordForm/></Suspense></AuthShell></>; }
