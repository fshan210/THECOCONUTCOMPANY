import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { Analytics } from "@/components/seo/Analytics";
import { ConsentDefaults } from "@/components/seo/ConsentDefaults";
import { StructuredData } from "@/components/seo/StructuredData";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CustomerAuthProvider } from "@/components/auth/CustomerAuthProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { LaunchExperience } from "@/components/launch/LaunchExperience";
import { CartProvider } from "@/lib/cart/cart-context";
import { getCustomerSession } from "@/lib/customer/auth";
import { defaultDescription, siteName, siteUrl } from "@/lib/seo/metadata";
import { getProducts } from "@/lib/content/server";
import "./globals.css";

const roboto = localFont({
  src: [
    { path: "./fonts/Roboto-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Roboto-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Roboto-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Roboto-Bold.ttf", weight: "700", style: "normal" }
  ],
  variable: "--font-co-sans",
  display: "swap",
  preload: false,
  fallback: ["Arial", "Helvetica", "sans-serif"]
});

const instrumentSerif = localFont({
  src: [
    { path: "./fonts/InstrumentSerif-Regular.woff2", style: "normal", weight: "400" },
    { path: "./fonts/InstrumentSerif-Italic.woff2", style: "italic", weight: "400" }
  ],
  variable: "--font-co-editorial",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "serif"]
});


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description: defaultDescription,
  applicationName: siteName,
  category: "food and beverage",
  keywords: ["coconut water", "coconut products", "Kerala coconut", "MELT.CO", "The Coconut Company"],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ]
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || ""
    }
  },
  openGraph: {
    title: siteName,
    description: defaultDescription,
    url: siteUrl,
    siteName,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: siteName
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: defaultDescription,
    images: ["/opengraph-image"]
  }
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f8f4ec"
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const customerSession = await getCustomerSession();
  const headerStore = await headers();
  const isAdminShell = headerStore.get("x-co-admin-rewrite") === "1";
  const products = await getProducts();

  return (
    <html lang="en-IN" data-scroll-behavior="smooth">
      <head>
        <ConsentDefaults />
      </head>
      <body className={`${roboto.variable} ${instrumentSerif.variable} font-sans antialiased`}>
        <CustomerAuthProvider session={customerSession}>
          <CartProvider catalog={products}>
            <LenisProvider>
              <MotionProvider>
                <StructuredData includeGlobal />
                {isAdminShell ? null : <Navigation />}
                <main>{children}</main>
                {isAdminShell ? null : <Footer />}
                {isAdminShell ? null : <CartDrawer />}
                {isAdminShell ? null : <LaunchExperience />}
                <Analytics />
              </MotionProvider>
            </LenisProvider>
          </CartProvider>
        </CustomerAuthProvider>
      </body>
    </html>
  );
}
