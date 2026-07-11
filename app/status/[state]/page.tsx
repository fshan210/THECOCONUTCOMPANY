import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatePanel } from "@/components/launch/StatePanel";

const states = {
  "newsletter-subscribed": ["success", "You’re on the list.", "Fresh product notes, recipes and .CO stories will find their way to your inbox.", "Explore recipes", "/recipes"],
  "recipe-submitted": ["success", "Your recipe is in the kitchen.", "Thank you for sharing a coconut ritual with the .CO community. It is ready for review.", "Back to recipes", "/recipes"],
  "order-placed": ["success", "Your order is confirmed.", "A confirmation and tracking details will be sent when live ordering is enabled.", "Track order", "/track-order"],
  "password-reset-sent": ["success", "Check your inbox.", "Your secure password reset link is on its way. It may take a minute to arrive.", "Back to login", "/login"],
  "account-created": ["success", "Your .CO shelf is ready.", "Verify your email to unlock saved products, recipes and account tools.", "Open account", "/account"],
  "discount-claimed": ["success", "Your welcome is saved.", "Create your account with the same email so your introductory offer stays connected.", "Create account", "/register?source=welcome"],
  "contact-submitted": ["success", "Your note is ready.", "Your email app has the message prepared for review and sending.", "Back home", "/"],
  "checkout-failed": ["error", "Checkout could not continue.", "No payment was captured. Return to your shelf and try again when live checkout is available.", "Return to cart", "/cart"],
  "order-failed": ["error", "No order was created.", "Nothing was charged. Please return to the shop or contact support if you need help.", "Contact support", "/support"]
} as const;

export const metadata: Metadata = { title: "Account status", robots: { index: false, follow: false } };
export function generateStaticParams() { return Object.keys(states).map((state) => ({ state })); }

export default async function StatusPage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const value = states[state as keyof typeof states];
  if (!value) notFound();
  const [kind, title, body, label, href] = value;
  return <main className="grid min-h-[72vh] place-items-center bg-[#f8f4ec] px-4 py-12"><div className="w-full max-w-[680px]"><StatePanel kind={kind} eyebrow={kind === "success" ? "All set" : "Not completed"} title={title} body={body} primary={{ label, href }} secondary={{ label: "Visit .CO home", href: "/" }} /></div></main>;
}
