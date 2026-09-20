import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell, CustomerResetPasswordForm } from "@/components/auth/CustomerAuthForms";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Choose a New Password", description: "Set a new password for your .CO account.", path: "/reset-password", index: false });

export default function ResetPasswordPage() { return <AuthShell variant="reset" eyebrow="A brighter return" title={<>Choose a new<br/><em>password.</em></>} description="Use the six-digit code from your email, then choose a strong new password."><Suspense fallback={null}><CustomerResetPasswordForm/></Suspense></AuthShell>; }
