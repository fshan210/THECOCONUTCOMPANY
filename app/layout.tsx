import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: ".CO | The Coconut Company",
  description: "A premium coconut company from Palakkad, Kerala, built for a global life."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
