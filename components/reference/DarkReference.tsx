"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Search, ShoppingCart, UserRound } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";

export const RD = {
  recipe: "/assets/redesign/recipes/",
  sustainability: "/assets/redesign/sustainability/",
  journal: "/assets/redesign/journal/",
  misc: "/assets/redesign/misc/",
} as const;

const routes = [["Home", "/"], ["About", "/about"], ["Products", "/shop"], ["Recipes", "/recipes"], ["Sustainability", "/sustainability"], ["Journal", "/journal"]] as const;

export function DarkHeader() {
  const path = usePathname();
  const cart = useCart();
  return <header className="rd-header"><Link href="/" className="rd-logo" aria-label=".CO home"><b>.CO</b><span>The Coconut<br/>Company</span></Link><nav aria-label="Primary navigation">{routes.map(([label, href]) => <Link key={href} href={href} className={path === href || (href !== "/" && path.startsWith(href)) ? "active" : ""}>{label}</Link>)}</nav><div className="rd-utilities"><Link href="/shop" aria-label="Search"><Search/></Link><Link href="/account" prefetch={false} aria-label="Account"><UserRound/></Link><Link href="/wishlist" prefetch={false} aria-label="Saved items"><Heart/></Link><button type="button" onClick={()=>cart.setOpen(true)} aria-label={`Open cart with ${cart.totalQuantity} items`}><ShoppingCart/><i>{cart.totalQuantity}</i></button></div></header>;
}

export function DarkFooter() {
  return <footer className="rd-footer"><div className="rd-footer-brand"><div className="rd-logo"><b>.CO</b><span>The Coconut<br/>Company</span></div><em>Made for living.</em></div>{[["Products",["All Products",".CO Water",".CO Kitchen","BOTANiCA","MELT"]],["Company",["About Us","Our Journey","Sustainability","Journal"]],["Support",["Help & FAQs","Shipping & Returns","Track Your Order","Contact Us"]],["Legal",["Privacy Policy","Terms & Conditions"]]].map(([heading,items])=><div key={heading as string}><h3>{heading}</h3>{(items as string[]).map((item)=><Link key={item} href={item === "Privacy Policy" ? "/privacy" : item === "Terms & Conditions" ? "/terms" : "/shop"}>{item}</Link>)}</div>)}<p>© 2026 .CO The Coconut Company</p></footer>;
}

export function DarkShell({children, className=""}:{children:React.ReactNode;className?:string}) { return <div className={`rd-page ${className}`}><DarkHeader/><main>{children}</main><DarkFooter/></div>; }

export function Eyebrow({children}:{children:React.ReactNode}) { return <p className="rd-eyebrow">{children}</p>; }
export function ButtonLink({href,children,ghost=false}:{href:string;children:React.ReactNode;ghost?:boolean}) { return <Link className={`rd-button ${ghost ? "ghost" : ""}`} href={href}>{children}<span>→</span></Link>; }
export function Scene({src,alt,className="",priority=false}:{src:string;alt:string;className?:string;priority?:boolean}) { return <div className={`rd-scene ${className}`}><Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover"/></div>; }
export function Newsletter() { return <section className="rd-newsletter"><div><Eyebrow>Stay in the loop</Eyebrow><h2>Good things,<br/><em>straight to you.</em></h2><p>Recipes, new drops and real stories.</p></div><form onSubmit={(e)=>e.preventDefault()}><label className="sr-only" htmlFor="rd-newsletter-email">Email address</label><input id="rd-newsletter-email" type="email" required placeholder="Enter your email"/><button>Subscribe <span>→</span></button></form><Scene src={`${RD.misc}coconut floating with shadow.png`} alt="Split coconut in warm light"/></section>; }
