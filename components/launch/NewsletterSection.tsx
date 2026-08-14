"use client";

import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { NewsletterForm } from "@/components/launch/NewsletterForm";

export function NewsletterSection() {
  return <section className="co-newsletter-shell" aria-labelledby="co-newsletter-title">
    <div className="co-newsletter-panel">
      <div className="co-newsletter-farm" aria-hidden="true"><ResponsiveImage src="/assets/backgrounds/kerala-groves/co-kerala-grove-editorial-4k.avif" alt="" fill sizes="(max-width: 767px) 100vw, 1400px" className="object-cover" /></div>
      <div className="co-newsletter-overlay" aria-hidden="true" />
      <div className="co-newsletter-copy"><p>Good things, occasionally.</p><h2 id="co-newsletter-title">Stay in the loop</h2><span>Get updates on new products, recipes &amp; offers.</span></div>
      <div className="co-newsletter-form-wrap"><NewsletterForm /></div>
    </div>
  </section>;
}
