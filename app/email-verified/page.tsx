import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell, EmailVerifiedCard } from "@/components/auth/CustomerAuthForms";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Email Verified", description: "Your .CO account email has been verified.", path: "/email-verified", index: false });

export default function EmailVerifiedPage() { return <AuthShell eyebrow="Account ready" title="You’re all set." description="Your account has been confirmed and is ready for your next .CO ritual."><Suspense fallback={null}><EmailVerifiedCard/></Suspense></AuthShell>; }
