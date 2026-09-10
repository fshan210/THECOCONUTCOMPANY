import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Heart, Leaf, Package, ShieldCheck } from "lucide-react";
import { transparentProductAssets } from "@/lib/website-assets";
import "@/styles/commerce-default.css";
export function CommerceHero({
  eyebrow,
  title,
  body,
  products = false,
  scene = "grove",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  body: string;
  products?: boolean;
  scene?: string;
  children?: ReactNode;
}) {
  return (
    <section className={`cm-hero ${products ? "cm-hero--products" : ""}`}>
      <picture>
        <source
          media="(max-width: 600px)"
          srcSet={`/assets/redesign/commerce/${scene}-mobile.webp`}
        />
        <img
          src={`/assets/redesign/commerce/${scene}.webp`}
          width="1672"
          height="941"
          alt=""
          fetchPriority="high"
        />
      </picture>
      <div className="cm-hero-inner">
        <div className="cm-hero-copy">
          <p className="cm-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{body}</p>
          {children}
        </div>
        {products && (
          <div className="cm-hero-products" aria-label=".CO coconut essentials">
            {["water", "kitchen-oil", "kitchen-milk"].map((id) => (
              <div key={id}>
                <Image
                  src={transparentProductAssets[id].src}
                  alt={
                    {
                      water: ".CO Water",
                      "kitchen-oil": ".CO Kitchen Coconut Oil",
                      "kitchen-milk": ".CO Kitchen Coconut Milk",
                    }[id] ?? ".CO coconut essentials"
                  }
                  fill
                  sizes="(max-width:600px) 26vw, 220px"
                  className="object-contain"
                  priority
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
export function CommerceSurface({ children }: { children: ReactNode }) {
  return <div className="commerce-surface">{children}</div>;
}
export function CommerceLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      className={`cm-button ${secondary ? "cm-button--secondary" : ""}`}
      href={href}
    >
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}
export function CommerceTrust() {
  return (
    <div className="cm-trust">
      {[
        {
          Icon: Package,
          title: "Delivery & returns",
          body: "Our current policies",
          href: "/shipping-delivery",
        },
        {
          Icon: Heart,
          title: "Your favourites",
          body: "Keep good things close",
          href: "/wishlist",
        },
        {
          Icon: Leaf,
          title: "Our coconut story",
          body: "From origin to everyday",
          href: "/sustainability",
        },
        {
          Icon: ShieldCheck,
          title: "Help & support",
          body: "We’re here for you",
          href: "/support",
        },
      ].map(({ Icon, title, body, href }) => (
        <Link href={href} key={title}>
          <Icon />
          <span>
            {title}
            <small>{body}</small>
          </span>
        </Link>
      ))}
    </div>
  );
}
export function CommerceClose() {
  return (
    <section className="cm-close">
      <p className="cm-eyebrow">The coconut world</p>
      <h2>
        A little more goodness,
        <br />
        <em>every day.</em>
      </h2>
      <CommerceLink href="/sustainability" secondary>
        Explore our story
      </CommerceLink>
    </section>
  );
}
