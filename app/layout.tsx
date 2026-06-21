import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { headers } from "next/headers";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { Analytics } from "@/components/seo/Analytics";
import { StructuredData } from "@/components/seo/StructuredData";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CustomerAuthProvider } from "@/components/auth/CustomerAuthProvider";
import { CartProvider } from "@/lib/cart/cart-context";
import { getCustomerSession } from "@/lib/customer/auth";
import { defaultDescription, siteName, siteUrl } from "@/lib/seo/metadata";
import "./globals.css";

const brandFont = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
  display: "swap",
  variable: "--font-brand"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description: defaultDescription,
  alternates: {
    canonical: "/"
  },
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
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: defaultDescription,
    images: ["/opengraph-image"]
  }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const customerSession = await getCustomerSession();
  const headerStore = await headers();
  const isAdminShell = headerStore.get("x-co-admin-rewrite") === "1";

  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/assets/Coconut_Water_Assets/hero composition.png" fetchPriority="high" />
        <link rel="preload" as="image" href="/assets/Coconut_Water_Assets/floating pack.png" fetchPriority="high" />
      </head>
      <body className={`${brandFont.variable} font-sans antialiased`}>
        <CustomerAuthProvider session={customerSession}>
          <CartProvider>
            <StructuredData />
            {isAdminShell ? null : <Navigation />}
            <main>{children}</main>
            {isAdminShell ? null : <Footer />}
            {isAdminShell ? null : <CartDrawer />}
            <Analytics />
          </CartProvider>
        </CustomerAuthProvider>
      </body>
    </html>
  );
}
