"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ResponsiveImage as Image } from "@/components/media/ResponsiveImage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  CookingPot,
  Gift,
  Grid2X2,
  Headphones,
  Heart,
  IceCreamBowl,
  Instagram,
  MapPin,
  Milk,
  Leaf,
  LockKeyhole,
  Menu,
  PackageCheck,
  PlayCircle,
  Plus,
  Recycle,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Utensils,
  X,
  Clock3,
  Sprout,
  Hand,
  Factory,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, useMotionTemplate, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { CartButton } from "@/components/cart/CartDrawer";
import { useCustomerSession } from "@/components/auth/CustomerAuthProvider";
import { customerGreeting } from "@/lib/customer/display-name";
import { NewsletterForm } from "@/components/launch/NewsletterForm";
import { CookiePreferencesButton } from "@/components/launch/CookiePreferencesButton";
import { useCart } from "@/lib/cart/cart-context";
import { getScrollTrigger, prefersReducedMotion } from "@/lib/animation/gsap-scrolltrigger";
import type { ContentProduct, ContentRecipe, ContentTestimonial, HomepageContent } from "@/lib/content/types";
import { publicAssets } from "@/lib/public-assets";
import { homepageEnvironmentAssets, resolveWebsiteAsset, transparentProductAssets, websiteAssets } from "@/lib/website-assets";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/lib/ui/use-body-scroll-lock";
import { ImpactCounters } from "@/components/home/ImpactCounters";
import { sustainabilityImpact } from "@/lib/content/impact";
import { choreography } from "@/lib/motion/choreography";
import { mediaUrl } from "@/lib/media";
import { shopProducts } from "@/lib/catalog";
import { CinematicHomeSequence } from "@/components/home/CinematicHomePage";

const ease = [0.16, 1, 0.3, 1] as const;
const subscribeToHydration = () => () => undefined;
const getHydratedSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function useHydrationSafeReducedMotion() {
  const reducedMotion = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeToHydration, getHydratedSnapshot, getServerHydrationSnapshot);
  return hydrated && Boolean(reducedMotion);
}

type HeaderLink = readonly [label: string, href: string];

function DockNavigationItem({ active, href, label, light, pointerX }: { active: boolean; href: string; label: string; light: boolean; pointerX: MotionValue<number> }) {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const scaleTarget = useTransform(pointerX, (pointer) => {
    const rect = itemRef.current?.getBoundingClientRect();
    if (!rect) return active ? 1.025 : 1;
    const distance = Math.abs(pointer - (rect.left + rect.width / 2));
    const proximity = Math.max(0, 1 - distance / 132);
    return (active ? 1.025 : 1) + proximity * (active ? .105 : .14);
  });
  const liftTarget = useTransform(pointerX, (pointer) => {
    const rect = itemRef.current?.getBoundingClientRect();
    if (!rect) return active ? -1 : 0;
    const distance = Math.abs(pointer - (rect.left + rect.width / 2));
    return (active ? -1 : 0) - Math.max(0, 1 - distance / 132) * 3.2;
  });
  const scale = useSpring(scaleTarget, { mass: .1, stiffness: 150, damping: 16 });
  const y = useSpring(liftTarget, { mass: .1, stiffness: 150, damping: 16 });
  const activate = () => {
    const rect = itemRef.current?.getBoundingClientRect();
    if (rect) pointerX.set(rect.left + rect.width / 2);
  };

  return <motion.div style={{ scale, y }} className="origin-center will-change-transform">
    <Link ref={itemRef} href={href} prefetch={href === "/" ? false : undefined} aria-current={active ? "page" : undefined} onFocus={activate} className={cn("co-reference-nav-link relative block rounded-full px-2 py-2 transition after:absolute after:inset-x-2 after:bottom-0 after:h-px after:origin-left after:transition-transform hover:after:scale-x-100", light ? "after:bg-[#f5dbbc] hover:text-white" : "after:bg-[#305a34] hover:text-[#305a34]", active ? light ? "font-bold text-white after:scale-x-100" : "font-bold text-[#214d2b] after:scale-x-100" : "after:scale-x-0")}>
      {label}
    </Link>
  </motion.div>;
}

function DockNavigation({ links, pathname, light }: { links: HeaderLink[]; pathname: string; light: boolean }) {
  const pointerX = useMotionValue(-9999);
  const updatePointer = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") pointerX.set(event.clientX);
  };
  const resetPointer = () => pointerX.set(-9999);

  return <nav onPointerMove={updatePointer} onPointerLeave={resetPointer} className={cn("absolute left-1/2 hidden -translate-x-1/2 items-center gap-[clamp(18px,1.8vw,34px)] whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.04em] transition-colors lg:flex", light ? "text-[#f8f0e3]" : "text-[#17130f]")} aria-label="Primary navigation">
    {links.map(([label, href]) => {
      const route = href.split("#")[0];
      const active = label === "Products" ? false : route === "/shop" ? pathname === "/shop" || pathname.startsWith("/shop/") : pathname === route || pathname.startsWith(`${route}/`);
      return <DockNavigationItem key={href} active={active} href={href} label={label} light={light} pointerX={pointerX} />;
    })}
  </nav>;
}

const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSczMCc+PGZpbHRlciBpZD0nYic+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nNicvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyNmN2YyZTgnLz48L3N2Zz4=";
const homeHeroAsset = resolveWebsiteAsset(websiteAssets.home.hero);
const familyTransitionAssets = ([
  ["From the source", "Origin", websiteAssets.home.transitions.origin, "/about"],
  ["Pure hydration", "Water", websiteAssets.home.transitions.water, "/shop?product=co-water"],
  ["Everyday nourishment", "Kitchen", websiteAssets.home.transitions.kitchen, "/shop?category=Food"],
  ["Considered care", "BOTANiCA", websiteAssets.home.transitions.botanica, "/shop?category=Cosmetics"],
  ["Slow indulgence", "MELT", websiteAssets.home.transitions.melt, "/shop?category=Ice%20Cream"],
] as const).map(([eyebrow, title, asset, href]) => [eyebrow, title, resolveWebsiteAsset(asset), href] as const);

type DisplayProduct = {
  slug: string;
  shopSlug?: string;
  name: string;
  shortName: string;
  subtitle: string;
  detail: string;
  image: string;
  price: string;
};

const categoryItems = [
  { label: "Coconut Water", icon: Milk, href: "/shop?product=co-water" },
  { label: "Ice Cream", icon: IceCreamBowl, href: "/shop?product=melt-co-mango-coconut" },
  { label: "Coconut Oil", icon: CookingPot, href: "/shop?product=co-kitchen-coconut-oil" },
  { label: "Coconut Flour", icon: Utensils, href: "/shop?product=co-kitchen-coconut-flour" },
  { label: "Coconut Milk", icon: Milk, href: "/shop?product=co-kitchen-coconut-milk" },
  { label: "BOTANiCA", icon: Sparkles, href: "/shop?product=co-botanica-face-wash" }
];

const productPresentation: Record<string, Partial<DisplayProduct>> = {
  "co-water": {
    name: ".CO Water",
    shortName: ".CO Water 330ml",
    subtitle: "100% Organic Coconut Water",
    detail: "Clean tender coconut water with a calm, refreshing finish.",
    image: transparentProductAssets.water.src,
    price: "₹120.00"
  },
  "melt-co-mango-coconut": {
    name: "Melt.CO",
    shortName: "Mango + Coconut 350ml",
    subtitle: "Coconut Ice Cream",
    detail: "Creamy coconut ice cream with real fruit. Pure indulgence in every spoon.",
    image: transparentProductAssets.melt.src,
    price: "₹220.00"
  },
  "co-kitchen-coconut-oil": {
    name: ".CO Foods",
    shortName: ".CO Coconut Oil",
    subtitle: "Cold-pressed Coconut Oil",
    detail: "A versatile coconut pantry staple for everyday cooking and mindful rituals.",
    image: transparentProductAssets["kitchen-oil"].src,
    price: "₹160.00"
  },
  "co-botanica-face-wash": {
    name: ".CO BOTANiCA Coconut Face Wash",
    shortName: "Coconut Face Wash",
    subtitle: "Coconut Face Wash",
    detail: "A gentle, refreshing coconut care ritual made for everyday cleansing.",
    image: transparentProductAssets["botanica-face-wash"].src,
    price: "₹499.00"
  }
};

function toDisplayProducts(products: ContentProduct[]): DisplayProduct[] {
  const order = ["co-water", "melt-co-mango-coconut", "co-kitchen-coconut-oil", "co-botanica-face-wash"];

  return order.map((slug) => {
    const product = products.find((item) => item.slug === slug);
    const presentation = productPresentation[slug];

    return {
      slug,
      name: presentation?.name ?? product?.name ?? slug,
      shortName: presentation?.shortName ?? product?.name ?? slug,
      subtitle: presentation?.subtitle ?? product?.shortDescription ?? "",
      detail: presentation?.detail ?? product?.longDescription ?? product?.shortDescription ?? "",
      image: presentation?.image ?? product?.image ?? publicAssets.water.floating,
      price: product?.price ? `₹${product.price.toFixed(2)}` : presentation?.price ?? "Coming soon"
    };
  });
}

function toPopupProducts(products: DisplayProduct[]): DisplayProduct[] {
  const extras: DisplayProduct[] = [
    { slug: "coconut-flour", shopSlug: "co-kitchen-coconut-flour", name: ".CO Kitchen Coconut Flour", shortName: "Coconut Flour", subtitle: "Coconut pantry staple", detail: "Finely milled coconut flour for baking and breakfast rituals.", image: transparentProductAssets["kitchen-flour"].src, price: "₹180.00" },
    { slug: "coconut-milk", shopSlug: "co-kitchen-coconut-milk", name: ".CO Kitchen Coconut Milk", shortName: "Coconut Milk", subtitle: "Creamy kitchen staple", detail: "A smooth coconut base for curries, drinks and desserts.", image: transparentProductAssets["kitchen-milk"].src, price: "₹180.00" },
    { slug: "botanica-shampoo", shopSlug: "co-botanica-shampoo", name: ".CO BOTANiCA Coconut Shampoo", shortName: "Coconut Shampoo", subtitle: "Gentle wash ritual", detail: "A coconut-led shampoo direction for clean, balanced hair care.", image: transparentProductAssets["botanica-shampoo"].src, price: "₹399.00" },
    { slug: "botanica-hair-serum", shopSlug: "co-botanica-hair-serum", name: ".CO BOTANiCA Coconut Hair Serum", shortName: "Hair Serum", subtitle: "Light finishing ritual", detail: "A lightweight coconut botanical hair-care preview.", image: transparentProductAssets["botanica-hair-serum"].src, price: "₹499.00" },
    { slug: "botanica-moisturizer", shopSlug: "co-botanica-body-moisturizer", name: ".CO BOTANiCA Coconut Body Moisturizer", shortName: "Body Moisturizer", subtitle: "Everyday coconut moisture", detail: "A soft coconut botanical body-care ritual.", image: transparentProductAssets["botanica-moisturizer"].src, price: "₹499.00" }
  ];

  return [...products, ...extras];
}

export function ReferenceHeader() {
  const pathname = usePathname();
  const shopShell = pathname === "/shop" || pathname.startsWith("/shop/");
  const homeShell = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const session = useCustomerSession();
  const greeting = customerGreeting(session);
  const accountHref = session ? "/account" : "/login?redirect=%2Faccount";
  useBodyScrollLock(menuOpen);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => setScrolled((current) => current === (latest > 460) ? current : latest > 460));
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  const links: HeaderLink[] = [
    ["Home", "/"],
    ["About", "/about"],
    ["Products", "/shop#all-products"],
    ["Recipes", "/recipes"],
    ["Sustainability", "/sustainability"],
    ["Journal", "/journal"]
  ];

  return (
    <>
      <AnimatePresence>
        {menuOpen ? <motion.button type="button" aria-label="Close mobile navigation" onClick={() => setMenuOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#211812]/18 backdrop-blur-[2px] lg:hidden" /> : null}
      </AnimatePresence>
      <motion.header
        initial={false}
        animate={{ width: "min(1320px, calc(100% - 28px))", top: 10, borderRadius: 26, minHeight: scrolled ? 66 : 70, backgroundColor: shopShell || homeShell ? "rgba(57,28,17,.78)" : scrolled ? "rgba(248,244,236,.88)" : "rgba(134,72,41,.48)", boxShadow: shopShell || homeShell ? "inset 0 1px 0 rgba(255,239,219,.12), 0 16px 44px rgba(18,7,3,.22)" : scrolled ? "inset 0 1px 0 rgba(255,255,255,.88), 0 16px 44px rgba(29,13,7,.20)" : "inset 0 1px 0 rgba(255,239,219,.18), 0 16px 44px rgba(29,13,7,.12)" }}
        transition={{ duration: 0.42, ease }}
        style={{ backdropFilter: "blur(14px) saturate(1.08)", WebkitBackdropFilter: "blur(14px) saturate(1.08)" }}
        className={cn("co-glass-header fixed left-1/2 top-2.5 z-[110] flex min-h-[70px] w-[calc(100%-28px)] -translate-x-1/2 items-center rounded-[26px] px-5 md:px-8", shopShell || homeShell || !scrolled ? "border border-[#f5dbbc]/20 text-[#fff7e9]" : "border border-white/55 text-[#17130f]")}
      >
        <div className="relative mx-auto flex w-full max-w-[1500px] items-center justify-between gap-5">
          <Link href="/" prefetch={false} aria-current={pathname === "/" ? "page" : undefined} className={cn("relative ml-10 block h-[52px] w-[86px] rounded-2xl md:ml-0 md:h-[58px] md:w-[88px]", pathname === "/" && "co-nav-active")} aria-label=".CO home">
            <Image src="/images/logo.svg" alt=".CO The Coconut Company" fill priority sizes="88px" className={cn("object-contain object-left transition-[filter] duration-300", (shopShell || homeShell || !scrolled) && "brightness-0 invert")} />
          </Link>

          <DockNavigation links={links} pathname={pathname} light={shopShell || homeShell || !scrolled} />

          <div className={cn("ml-auto flex items-center gap-1 transition-colors md:gap-1.5", shopShell || homeShell || !scrolled ? "text-[#fff7e9]" : "text-[#17130f]")}>
            <Link href="/shop" aria-label="Search products" className="grid size-10 place-items-center rounded-full transition hover:bg-white/70">
              <Search size={19} strokeWidth={1.7} />
            </Link>
            <Link href={accountHref} aria-label={session ? `Open account for ${greeting}` : "Sign in to your account"} className="inline-flex h-10 items-center gap-2 rounded-full px-1.5 transition hover:bg-white/70">
              {session ? <span className="hidden max-w-[112px] truncate text-[11px] font-semibold text-[#305a34] min-[520px]:inline">Hi, {greeting}</span> : null}
              <CircleUserRound size={19} strokeWidth={1.6} />
            </Link>
            <CartButton showZero className="!size-10 !rounded-full !border-0 !bg-transparent !shadow-none hover:!bg-white/70" />
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              className="absolute left-3 grid size-10 place-items-center rounded-full lg:hidden"
            >
              {menuOpen ? <X size={21} strokeWidth={1.7} /> : <Menu size={22} strokeWidth={1.7} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen ? (
            <motion.nav
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.28, ease }}
              className="absolute left-3 right-3 top-[calc(100%+8px)] max-h-[calc(100dvh-96px)] overflow-y-auto overscroll-contain rounded-[26px] border border-white/70 bg-[rgba(247,242,232,.96)] p-3 shadow-[0_24px_65px_rgba(53,39,30,.16)] backdrop-blur-[22px] [touch-action:pan-y] lg:hidden"
            >
              {links.map(([label, href]) => {
                const route = href.split("#")[0];
                const active = label === "Products" ? false : route === "/shop" ? pathname === "/shop" || pathname.startsWith("/shop/") : pathname === route || pathname.startsWith(`${route}/`);
                return (
                <Link
                  key={href}
                  href={href}
                  prefetch={href === "/" ? false : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={cn("block rounded-2xl border-b border-[#35271e]/8 px-4 py-3 text-xs font-semibold uppercase tracking-[.08em] last:border-0", active && "co-nav-active bg-white/68 font-bold text-[#214d2b]")}
                >
                  {label}
                </Link>
                );
              })}
              <Link href={accountHref} onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-xs font-semibold uppercase tracking-[.08em] text-[#305a34]">
                {session ? `Hi, ${greeting}` : "Sign in"}
              </Link>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

function MoreProductsDialog({ products, className }: { products: DisplayProduct[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DisplayProduct | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [desktopPosition, setDesktopPosition] = useState({ top: 190, left: 24 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pageScrollRef = useRef(0);
  useBodyScrollLock(open, pageScrollRef.current);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(820, window.innerWidth - 48);
    setDesktopPosition({
      top: Math.max(24, Math.min(rect.bottom + 18, window.innerHeight - 590)),
      left: Math.min(Math.max(24, rect.right - width + 110), window.innerWidth - width - 24)
    });
  };

  useEffect(() => {
    if (!open || isMobile) return undefined;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [open, isMobile]);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [selected]);

  const close = () => {
    setSelected(null);
    setOpen(false);
  };

  return (
    <LayoutGroup id="more-products-dialog">
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setSelected(null);
      }}
    >
      <Dialog.Trigger asChild>
        <motion.button
          ref={triggerRef}
          layoutId="more-products-cloud"
          animate={{ opacity: open ? 0 : 1, scale: open ? 0.96 : 1 }}
          transition={{ duration: 0.28, ease }}
          type="button"
          onClickCapture={() => { pageScrollRef.current = window.scrollY; }}
          className={cn(
            "inline-flex min-h-12 items-center gap-4 rounded-full bg-[#304f2c] px-6 text-[11px] font-semibold uppercase tracking-[0.04em] text-white shadow-[0_12px_28px_rgba(48,79,44,.22)] transition hover:-translate-y-0.5 hover:bg-[#233e21]",
            className
          )}
        >
          More Products
          <span className="grid size-8 place-items-center rounded-full bg-white/14">
            <Grid2X2 size={14} />
          </span>
        </motion.button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[140] bg-[rgba(36,31,26,.34)] backdrop-blur-[7px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild onEscapeKeyDown={close} onPointerDownOutside={close} onOpenAutoFocus={(event) => { event.preventDefault(); requestAnimationFrame(() => contentRef.current?.focus()); }}>
              <motion.div
                ref={contentRef}
                tabIndex={-1}
                data-lenis-prevent
                layoutId="more-products-cloud"
                className="fixed z-[150] overflow-y-auto overscroll-contain border border-white/65 bg-[rgba(247,242,232,.72)] text-[#35271e] shadow-[0_28px_90px_rgba(25,20,16,.24)] backdrop-blur-[26px] [scrollbar-gutter:stable] [touch-action:pan-y]"
                style={
                  isMobile
                    ? { inset: "78px 12px 12px", borderRadius: 28, WebkitOverflowScrolling: "touch" }
                    : { top: desktopPosition.top, left: desktopPosition.left, width: "min(820px, calc(100vw - 48px))", maxHeight: "calc(100dvh - 80px)", borderRadius: 36, WebkitOverflowScrolling: "touch" }
                }
                initial={{ opacity: 0, scale: 0.9, y: 18, transformOrigin: "85% 0%" }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 18 }}
                transition={{ duration: 0.48, ease }}
              >
                <div className="p-5 md:p-7">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <Dialog.Title className="font-['Cormorant_Garamond'] text-[34px] leading-none md:text-[40px]">More from .CO</Dialog.Title>
                      <Dialog.Description className="mt-2 max-w-sm text-sm leading-6 text-[#5e554d]">
                        Discover our full range of coconut goodness.
                      </Dialog.Description>
                    </div>
                    <Dialog.Close asChild>
                      <button type="button" aria-label="Close more products" className="grid size-10 shrink-0 place-items-center rounded-full border border-white/75 bg-white/28 text-[#35271e]">
                        <X size={18} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    {selected && isMobile ? (
                      <motion.div key="detail" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.32, ease }}>
                        <article className="mt-5 overflow-hidden rounded-[28px] bg-[rgba(255,252,246,.88)] p-4">
                          <div className="relative aspect-[4/4.5] overflow-hidden rounded-[24px] bg-[#f7f1e7]">
                            <Image src={selected.image} alt={selected.name} fill sizes="calc(100vw - 72px)" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-contain p-5" />
                          </div>
                          <h3 className="mt-5 font-['Cormorant_Garamond'] text-[34px] leading-none">{selected.name}</h3>
                          <p className="mt-3 text-sm font-medium">{selected.subtitle}</p>
                          <p className="mt-3 text-sm leading-6 text-[#625950]">{selected.detail}</p>
                          <p className="mt-5 font-['Space_Grotesk'] text-lg font-semibold">{selected.price}</p>
                          <Link href={`/shop?product=${selected.shopSlug ?? selected.slug}#all-products`} className="co-primary-cta mt-5 flex min-h-12 items-center justify-between rounded-full bg-[#304f2c] px-5 text-xs font-semibold uppercase text-white">
                            Shop now
                            <span className="grid size-8 place-items-center rounded-full bg-white/14">
                              <ArrowRight size={16} />
                            </span>
                          </Link>
                        </article>

                        <div className="my-5 flex justify-center gap-2" aria-hidden="true">
                          {products.map((product) => (
                            <span key={product.slug} className={cn("size-2 rounded-full border border-white/80", product.slug === selected.slug ? "bg-[#304f2c]" : "bg-white/50")} />
                          ))}
                        </div>

                        <div className="rounded-[28px] border border-white/55 bg-white/18 p-3">
                          <h3 className="px-2 py-2 font-['Cormorant_Garamond'] text-2xl">More Products</h3>
                          <div className="space-y-2">
                            {products.filter((product) => product.slug !== selected.slug).map((product) => (
                              <button
                                key={product.slug}
                                type="button"
                                onClick={() => setSelected(product)}
                                className="grid w-full grid-cols-[86px_1fr_38px] items-center gap-3 rounded-[22px] border border-white/60 bg-white/16 p-3 text-left"
                              >
                                <span className="relative block aspect-square">
                                  <Image src={product.image} alt={product.name} fill sizes="86px" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-contain p-1" />
                                </span>
                                <span>
                                  <span className="block font-['Cormorant_Garamond'] text-xl">{product.name}</span>
                                  <span className="mt-1 block text-xs leading-5 text-[#625950]">{product.subtitle}</span>
                                </span>
                                <span className="grid size-9 place-items-center rounded-full border border-white/70">
                                  <ArrowRight size={15} />
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="overview" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.32, ease }}>
                        <div className="mt-5 grid gap-3 md:grid-cols-4">
                          {products.map((product) => (
                            <article key={product.slug} className="grid min-h-[190px] grid-cols-[110px_1fr] items-center gap-3 rounded-[24px] border border-white/70 bg-white/24 p-3 md:block md:min-h-[290px]">
                              <button type="button" onClick={() => isMobile && setSelected(product)} className="relative block aspect-[3/4] w-full md:aspect-[4/5]" aria-label={`View ${product.name}`}>
                                <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 170px, 110px" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-contain p-1 md:p-3" />
                              </button>
                              <div className="md:mt-3">
                                <button type="button" onClick={() => isMobile && setSelected(product)} className="text-left font-['Cormorant_Garamond'] text-[25px] leading-none md:text-[22px]">
                                  {product.name}
                                </button>
                                <p className="mt-2 text-xs leading-5 text-[#625950]">{product.subtitle}</p>
                                <Link href={`/shop?product=${product.shopSlug ?? product.slug}#all-products`} className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase">
                                  Shop now <ArrowRight size={14} />
                                </Link>
                              </div>
                            </article>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button type="button" onClick={selected ? () => setSelected(null) : close} className="mt-5 flex min-h-12 w-full items-center justify-center gap-4 rounded-full border border-white/70 bg-white/12 text-xs font-semibold uppercase">
                    <ArrowLeft size={16} />
                    Back to Products
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
    </LayoutGroup>
  );
}

const heroTrustPoints = [
  [Leaf, "100% Natural", "No shortcuts, ever."],
  [Heart, "Better for You", "Clean, honest and nourishing."],
  [Recycle, "Better for Earth", "Sustainably by choice."],
] as const;

const homepageVideoAssets = {
  scraping: {
    desktop: "/assets/video/homepage-v2/co-home-scraping-scroll-desktop-v1.mp4",
    mobile: "/assets/video/homepage-v2/co-home-scraping-scroll-mobile-portrait-v2.mp4",
    poster: "/assets/video/homepage-v2/co-home-scraping-poster-v1.jpg",
  },
  farm: {
    src: "/assets/video/homepage-v2/co-home-farm-1080p-v1.mp4",
    poster: "/assets/video/homepage-v2/co-home-farm-poster-v1.jpg",
  },
} as const;

function HeroScrapeSequence({ homepage, products }: { homepage: HomepageContent; products: DisplayProduct[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const videoFrameRef = useRef<number | null>(null);
  const targetVideoTimeRef = useRef(0);
  const displayedVideoTimeRef = useRef(0);
  const progressRef = useRef(0);
  const videoDeliveryActiveRef = useRef(false);
  const [mobileVideo, setMobileVideo] = useState(false);
  const [videoDeliveryActive, setVideoDeliveryActive] = useState(false);
  const reducedMotion = useHydrationSafeReducedMotion();
  const sequenceMotion = choreography.homepage.heroScrape;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const heroMotion = choreography.homepage.hero;
  const heroSequence = sequenceMotion.hero;
  const videoSequence = sequenceMotion.video;
  const coconutY = useTransform(scrollYProgress, [...heroSequence.coconutMotion], ["0vh", `${heroMotion.coconut.yVh}vh`]);
  const coconutRotate = useTransform(scrollYProgress, [...heroSequence.coconutMotion], [0, heroMotion.coconut.rotateDeg]);
  const coconutScale = useTransform(scrollYProgress, [...heroSequence.coconutMotion], [1, heroMotion.coconut.scale]);
  const coconutOpacity = useTransform(scrollYProgress, [...heroSequence.coconutOpacity.input], [...heroSequence.coconutOpacity.output]);
  const copyY = useTransform(scrollYProgress, [...heroSequence.copyY.input], [...heroSequence.copyY.output]);
  const copyOpacity = useTransform(scrollYProgress, [...heroSequence.copyOpacity.input], [...heroSequence.copyOpacity.output]);
  const trustY = useTransform(scrollYProgress, [...heroSequence.trustY.input], [...heroSequence.trustY.output]);
  const trustOpacity = useTransform(scrollYProgress, [...heroSequence.trustOpacity.input], [...heroSequence.trustOpacity.output]);
  const shelfOpacity = useTransform(scrollYProgress, [...heroSequence.shelfOpacity.input], [...heroSequence.shelfOpacity.output]);
  const shelfY = useTransform(scrollYProgress, [...heroSequence.shelfY.input], [...heroSequence.shelfY.output]);
  const orbitOpacity = useTransform(scrollYProgress, [...heroSequence.orbitOpacity.input], [...heroSequence.orbitOpacity.output]);
  const contactOpacity = useTransform(scrollYProgress, [...heroSequence.contactShadow], [...heroMotion.contactShadow.opacity]);
  const contactScaleX = useTransform(scrollYProgress, [...heroSequence.contactShadow], [...heroMotion.contactShadow.scaleX]);
  const contactScaleY = useTransform(scrollYProgress, [...heroSequence.contactShadow], [...heroMotion.contactShadow.scaleY]);
  const contactY = useTransform(scrollYProgress, [...heroSequence.contactShadow], [...heroMotion.contactShadow.yPx]);
  const contactBlurValue = useTransform(scrollYProgress, [...heroSequence.contactShadow], [...heroMotion.contactShadow.blurPx]);
  const contactFilter = useMotionTemplate`blur(${contactBlurValue}px)`;
  const ambientOpacity = useTransform(scrollYProgress, [...heroSequence.ambientShadow], [...heroMotion.ambientShadow.opacity]);
  const ambientScaleX = useTransform(scrollYProgress, [...heroSequence.ambientShadow], [...heroMotion.ambientShadow.scaleX]);
  const ambientScaleY = useTransform(scrollYProgress, [...heroSequence.ambientShadow], [...heroMotion.ambientShadow.scaleY]);
  const ambientY = useTransform(scrollYProgress, [...heroSequence.ambientShadow], [...heroMotion.ambientShadow.yPx]);
  const ambientBlurValue = useTransform(scrollYProgress, [...heroSequence.ambientShadow], [...heroMotion.ambientShadow.blurPx]);
  const ambientFilter = useMotionTemplate`blur(${ambientBlurValue}px)`;
  const mediaOpacity = useTransform(scrollYProgress, [...videoSequence.appearance.input], [...videoSequence.appearance.output]);
  const cinematicVeilOpacity = useTransform(scrollYProgress, [...sequenceMotion.cinematicVeil.input], [...sequenceMotion.cinematicVeil.output]);
  const firstOpacity = useTransform(scrollYProgress, [...videoSequence.copy.first], [0, 1, 1, 0]);
  const firstY = useTransform(scrollYProgress, [...videoSequence.copy.first], [16, 0, 0, -10]);
  const secondOpacity = useTransform(scrollYProgress, [...videoSequence.copy.second], [0, 1, 1, 0]);
  const secondY = useTransform(scrollYProgress, [...videoSequence.copy.second], [16, 0, 0, -10]);
  const originOpacity = useTransform(scrollYProgress, [...sequenceMotion.origin.reveal.input], [...sequenceMotion.origin.reveal.output]);
  const originCopyOpacity = useTransform(scrollYProgress, [...sequenceMotion.origin.copy.input], [...sequenceMotion.origin.copy.output]);
  const originCopyY = useTransform(scrollYProgress, [...sequenceMotion.origin.copy.input], [22, 0, 0]);
  const originScale = useTransform(scrollYProgress, [sequenceMotion.thresholds.originVisualStart, sequenceMotion.thresholds.originJourneyStart], [1.018, 1]);
  const environmentScale = useTransform(scrollYProgress, [0, 0.30], [1, 1.014]);

  const syncVideo = (progress: number) => {
    const video = videoRef.current;
    if (reducedMotion || !video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const normalized = Math.min(Math.max((progress - videoSequence.timelineStart) / (videoSequence.timelineEnd - videoSequence.timelineStart), 0), 1);
    const safeFinalTimestamp = Math.min(videoSequence.finalTimestampSeconds, Math.max(video.duration - videoSequence.finalFrameGuardSeconds, 0));
    targetVideoTimeRef.current = videoSequence.introTimestampSeconds + normalized * (safeFinalTimestamp - videoSequence.introTimestampSeconds);
    if (frameRef.current !== null) return;
    const seek = () => {
      const activeVideo = videoRef.current;
      if (!activeVideo) { frameRef.current = null; return; }
      const delta = targetVideoTimeRef.current - displayedVideoTimeRef.current;
      displayedVideoTimeRef.current = Math.abs(delta) < 0.012 ? targetVideoTimeRef.current : displayedVideoTimeRef.current + delta * videoSequence.seekDamping;
      if (Math.abs(activeVideo.currentTime - displayedVideoTimeRef.current) > 0.018) {
        activeVideo.currentTime = displayedVideoTimeRef.current;
        if (typeof activeVideo.requestVideoFrameCallback === "function" && videoFrameRef.current === null) {
          videoFrameRef.current = activeVideo.requestVideoFrameCallback((_now, metadata) => {
            videoFrameRef.current = null;
            if (Number.isFinite(metadata.mediaTime)) displayedVideoTimeRef.current = metadata.mediaTime;
          });
        }
      }
      if (Math.abs(targetVideoTimeRef.current - displayedVideoTimeRef.current) < 0.012) { frameRef.current = null; return; }
      frameRef.current = requestAnimationFrame(seek);
    };
    frameRef.current = requestAnimationFrame(seek);
  };

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    progressRef.current = progress;
    syncVideo(progress);
  });

  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const update = () => setMobileVideo(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const activateWithinScrollLead = () => {
      const section = sectionRef.current;
      if (!section || videoDeliveryActiveRef.current) return;
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const layoutProgress = (window.scrollY - section.offsetTop) / scrollDistance;
      if (layoutProgress < 0.08) return;
      videoDeliveryActiveRef.current = true;
      setVideoDeliveryActive(true);
    };
    const frame = window.requestAnimationFrame(activateWithinScrollLead);
    window.addEventListener("scroll", activateWithinScrollLead, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", activateWithinScrollLead);
    };
  }, []);

  useEffect(() => {
    if (!videoDeliveryActive) return;
    videoRef.current?.load();
  }, [videoDeliveryActive]);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    if (videoFrameRef.current !== null && videoRef.current?.cancelVideoFrameCallback) videoRef.current.cancelVideoFrameCallback(videoFrameRef.current);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="co-hero-scrape-sequence"
      style={{ height: `${reducedMotion ? sequenceMotion.reducedMotionHeightVh : mobileVideo ? sequenceMotion.mobileScrollHeightVh : sequenceMotion.desktopScrollHeightVh}svh` }}
      data-gate4-sequence
      aria-labelledby="co-home-hero-title"
    >
      <div className="co-hero-scrape-sequence__stage">
        <motion.div className="co-hero-scrape-sequence__brown-field" style={{ scale: environmentScale }} aria-hidden="true" />

        <motion.div className="co-hero-scrape-sequence__video-layer" style={{ opacity: mediaOpacity }} aria-hidden="true">
          {reducedMotion ? (
            <Image src={homepageVideoAssets.scraping.poster} alt="" fill sizes="100vw" className="co-hero-scrape-sequence__video" />
          ) : (
            <video
              ref={videoRef}
              className="co-hero-scrape-sequence__video"
              poster={mediaUrl(homepageVideoAssets.scraping.poster)}
              muted
              playsInline
              controls={false}
              preload={videoDeliveryActive ? "auto" : "none"}
              tabIndex={-1}
              data-delivery-active={videoDeliveryActive}
              onLoadedMetadata={(event) => {
                event.currentTarget.currentTime = videoSequence.introTimestampSeconds;
                displayedVideoTimeRef.current = videoSequence.introTimestampSeconds;
                targetVideoTimeRef.current = videoSequence.introTimestampSeconds;
                syncVideo(progressRef.current);
              }}
            >
              {videoDeliveryActive ? (
                <>
                  <source media="(max-width: 900px)" src={mediaUrl(homepageVideoAssets.scraping.mobile)} type="video/mp4" />
                  <source src={mediaUrl(homepageVideoAssets.scraping.desktop)} type="video/mp4" />
                </>
              ) : null}
            </video>
          )}
          <div className="co-hero-scrape-sequence__video-mask" />
        </motion.div>

        <div className="co-home-hero__stage co-hero-scrape-sequence__hero-layer">
          <div className="co-home-hero__atmosphere" aria-hidden="true" />
          <motion.div className="co-home-hero__orbit" style={reducedMotion ? undefined : { opacity: orbitOpacity }} aria-hidden="true"><span /></motion.div>

          <motion.div className="co-home-hero__copy" style={{ opacity: copyOpacity, y: copyY }}>
            <p className="co-home-hero__eyebrow">Made for living</p>
            <h1 id="co-home-hero-title" aria-label="Rooted in nature. Made for living." className="co-home-hero__title">
              Rooted in <em>nature.</em><br />Made for <em>living.</em>
            </h1>
            <p className="co-home-hero__body">Honest coconut essentials crafted for a better you and a better planet.</p>
            <Link href={homepage.heroCtaLink || "/shop"} className="co-home-hero__cta">
              Explore products <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </motion.div>

          <div className="co-home-hero__visual" aria-hidden="true">
            <motion.div className="co-home-hero__shadow co-home-hero__shadow--ambient" style={{ opacity: ambientOpacity, scaleX: ambientScaleX, scaleY: ambientScaleY, y: ambientY, filter: ambientFilter }} />
            <motion.div className="co-home-hero__shadow co-home-hero__shadow--contact" style={{ opacity: contactOpacity, scaleX: contactScaleX, scaleY: contactScaleY, y: contactY, filter: contactFilter }} />
            <motion.div className="co-home-hero__coconut" style={{ opacity: coconutOpacity, y: coconutY, rotate: coconutRotate, scale: coconutScale }}>
              <Image src="/assets/home/co-hero-coconut-transparent-v1.webp" alt="" fill priority sizes="(min-width: 768px) 134vw, 230vw" quality={100} className="object-contain" />
            </motion.div>
          </div>

          <motion.div className="co-home-hero__trust" style={{ opacity: trustOpacity, y: trustY }}>
            {heroTrustPoints.map(([FeatureIcon, title, body]) => (
              <div key={title} className="co-home-hero__trust-item">
                <span className="co-home-hero__trust-icon"><FeatureIcon size={17} strokeWidth={1.45} aria-hidden="true" /></span>
                <span><strong>{title}</strong><small>{body}</small></span>
              </div>
            ))}
          </motion.div>

          <motion.div className="co-home-hero__scroll-cue" style={{ opacity: shelfOpacity }} aria-hidden="true"><span />Scroll to explore</motion.div>
          <motion.div className="co-hero-scrape-sequence__shelf" style={{ opacity: shelfOpacity, y: shelfY }}><CategoryRail products={products} /></motion.div>
        </div>

        <motion.div className="co-hero-scrape-sequence__cinematic-veil" style={{ opacity: cinematicVeilOpacity }} aria-hidden="true" />

        <div className="co-hero-scrape-sequence__film-copy">
          <motion.p className="co-hero-scrape-sequence__film-eyebrow" style={{ opacity: firstOpacity, y: firstY }}>From one coconut</motion.p>
          <motion.h2 id="co-scrape-title" style={{ opacity: secondOpacity, y: secondY }}>comes an entire<br />way of <em>living.</em></motion.h2>
        </div>

        <motion.div className="co-hero-scrape-sequence__origin" style={{ opacity: originOpacity, scale: originScale }} aria-hidden="true">
          <Image src={homepageEnvironmentAssets.origin.src} alt="" fill sizes="100vw" loading="eager" fetchPriority="low" className="co-hero-scrape-sequence__origin-media" />
          <div className="co-hero-scrape-sequence__origin-wash" />
          <motion.div className="co-hero-scrape-sequence__origin-copy" style={{ opacity: originCopyOpacity, y: originCopyY }}>
            <p>Pollachi · From the source</p>
            <h2>Where every .CO day begins.</h2>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function CategoryRail({ products }: { products: DisplayProduct[] }) {
  const shelfOrder = ["co-water", "co-kitchen-coconut-oil", "coconut-flour", "coconut-milk", "co-botanica-face-wash", "melt-co-mango-coconut"];
  const shelfProducts = shelfOrder.flatMap((slug) => {
    const product = products.find((candidate) => candidate.slug === slug || candidate.shopSlug === slug);
    return product ? [product] : [];
  });

  return (
    <section className="co-home-hero__categories">
      <div className="co-home-hero__category-glass">
        <div className="co-home-hero__category-row">
          {categoryItems.map(({ label, icon: Icon, href }) => (
            <Link key={label} href={href} className="co-home-hero__category-item">
              <Icon size={23} strokeWidth={1.35} />
              <span>{label}</span>
            </Link>
          ))}
          <div className="co-home-hero__more"><MoreProductsDialog products={products} className="!bg-[#8f4b2a] !text-[#fff7e9]" /></div>
        </div>
        <div className="co-home-hero__product-shelf" aria-label="Featured products">
          <div className="co-home-hero__product-heading"><span>More products</span><Link href="/shop">View all products <ArrowRight size={13} /></Link></div>
          <div className="co-home-hero__product-grid">
            {shelfProducts.map((product) => (
              <Link key={product.slug} href={`/shop/${product.shopSlug ?? product.slug}`} className="co-home-hero__product-card">
                <span className="co-home-hero__product-image"><Image src={product.image} alt="" fill sizes="120px" className="object-contain" /></span>
                <span className="co-home-hero__product-copy"><strong>{product.shortName}</strong><small>{product.price}</small></span>
                <span className="co-home-hero__product-plus" aria-hidden="true"><Plus size={12} /></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const originMilestones = [
  [Sprout, "01", "Grown with care", "Rooted in Kerala and the coconut belt."],
  [Hand, "02", "Harvested responsibly", "Selected close to the source."],
  [Factory, "03", "Crafted with honest process", "Considered at every step."],
  [Heart, "04", "Made for real life", "Carried into everyday rituals."],
] as const;

function OriginJourneyPath({ progress }: { progress: MotionValue<number> }) {
  const pathRef = useRef<SVGPathElement>(null);
  const lightRef = useRef<SVGCircleElement>(null);
  const reducedMotion = useHydrationSafeReducedMotion();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const path = mobile
    ? "M 36 88 C 176 126 72 262 168 352 C 222 404 86 510 166 602 C 222 666 104 770 180 888"
    : "M 132 414 C 286 344 344 468 472 404 C 612 334 708 336 836 400 C 970 468 1088 352 1308 416";
  const updateLight = useCallback((value: number) => {
    const pathNode = pathRef.current;
    const lightNode = lightRef.current;
    if (!pathNode || !lightNode) return;
    const point = pathNode.getPointAtLength(pathNode.getTotalLength() * Math.min(1, Math.max(0, value)));
    lightNode.setAttribute("cx", String(point.x));
    lightNode.setAttribute("cy", String(point.y));
    lightNode.style.opacity = value <= 1 ? "1" : "0";
  }, []);

  useMotionValueEvent(progress, "change", (value) => {
    if (!reducedMotion) updateLight(value);
  });
  useEffect(() => updateLight(reducedMotion ? 1 : progress.get()), [progress, reducedMotion, updateLight]);

  return (
    <svg className={`co-origin-journey__path co-origin-journey__path--${mobile ? "mobile" : "desktop"}`} viewBox={mobile ? "0 0 220 960" : "0 0 1440 620"} preserveAspectRatio="none" aria-hidden="true">
      <path ref={pathRef} className="co-origin-journey__path-ghost" d={path} />
      <motion.path className="co-origin-journey__path-drawn" d={path} style={{ pathLength: reducedMotion ? 1 : progress }} />
      <circle ref={lightRef} className="co-origin-journey__path-light" r={choreography.homepage.originReceipt.origin.path.lightRadius} />
    </svg>
  );
}

function OriginMilestone({ item, progress, threshold, index }: { item: (typeof originMilestones)[number]; progress: MotionValue<number>; threshold: number; index: number }) {
  const [Icon, number, title, copy] = item;
  const opacity = useTransform(progress, [Math.max(0, threshold - 0.1), threshold, Math.min(1, threshold + 0.1), 1], [0.34, 1, 0.72, 0.72]);
  const scale = useTransform(progress, [Math.max(0, threshold - 0.08), threshold, Math.min(1, threshold + 0.1), 1], [1, choreography.homepage.originReceipt.origin.path.milestoneScale, 1, 1]);
  const markerGlow = useTransform(
    progress,
    [Math.max(0, threshold - 0.08), threshold, Math.min(1, threshold + 0.1)],
    ["0 0 0 rgba(244,201,149,0)", "0 0 24px rgba(244,201,149,.48)", "0 0 0 rgba(244,201,149,0)"],
  );
  return (
    <motion.li style={{ opacity, scale }} className={`co-origin-journey__milestone co-origin-journey__milestone--${index + 1}`}>
      <motion.span className="co-origin-journey__marker" style={{ boxShadow: markerGlow }}><Icon size={16} strokeWidth={1.4} /></motion.span>
      <span><small>{number}</small><strong>{title}</strong><p>{copy}</p></span>
    </motion.li>
  );
}

const originProductCutouts = [
  ["water", ".CO Coconut Water"],
  ["kitchen-flour", "Coconut Flour"],
  ["kitchen-milk", "Coconut Milk"],
  ["botanica-shampoo", "BOTANICA Shampoo"],
  ["melt", "MELT Coconut + Mango"],
] as const;

function OriginJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useHydrationSafeReducedMotion();
  const sequence = choreography.homepage.originReceipt.origin;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const pathProgress = useTransform(
    scrollYProgress,
    [sequence.path.drawStart, sequence.path.drawEnd],
    [0, 1],
  );
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-2.5%", "2.5%"]);
  const midgroundY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ["-5.5%", "5.5%"]);
  const originOpacity = useTransform(scrollYProgress, [0, 0.22, 0.36], [1, 1, 0]);
  const harvestOpacity = useTransform(scrollYProgress, [...sequence.sceneThresholds.harvest], [0, 1, 1, 0]);
  const craftOpacity = useTransform(scrollYProgress, [...sequence.sceneThresholds.craft], [0, 1, 1, 0]);
  const everydayOpacity = useTransform(scrollYProgress, [...sequence.sceneThresholds.everyday], [0, 1, 1, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.07, 0.34, 0.58], [0.76, 1, 1, 0.22]);
  const titleY = useTransform(scrollYProgress, [0, 0.09], [8, 0]);
  const productOpacity = useTransform(scrollYProgress, [...sequence.sceneThresholds.products], [0, 1, 1]);
  const productY = useTransform(scrollYProgress, [...sequence.sceneThresholds.products], [28, 0, 0]);
  const handoffOpacity = useTransform(scrollYProgress, [0.78, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="co-origin-journey"
      style={{ height: reducedMotion ? "100svh" : `${sequence.desktopScrollHeightSvh}svh` }}
      aria-labelledby="co-origin-title"
      data-gate="origin"
      data-reduced-motion={reducedMotion ? "true" : undefined}
    >
      <div className="co-origin-journey__stage">
        <div className="co-origin-journey__environment" aria-hidden="true">
          <motion.div className="co-origin-journey__scene co-origin-journey__scene--origin" style={reducedMotion ? undefined : { y: backgroundY, opacity: originOpacity }}>
            <Image src={homepageEnvironmentAssets.origin.src} alt="" fill sizes="100vw" loading="eager" fetchPriority="low" className="co-origin-journey__environment-media" />
          </motion.div>
          <motion.div className="co-origin-journey__scene co-origin-journey__scene--harvest" style={reducedMotion ? undefined : { y: midgroundY, opacity: harvestOpacity }}>
            <Image src={homepageEnvironmentAssets.harvest.desktop} alt="" fill sizes="100vw" className="co-origin-journey__environment-media co-origin-journey__environment-media--desktop" />
            <Image src={homepageEnvironmentAssets.harvest.mobile} alt="" fill sizes="100vw" className="co-origin-journey__environment-media co-origin-journey__environment-media--mobile" />
          </motion.div>
          <motion.div className="co-origin-journey__scene co-origin-journey__scene--craft" style={reducedMotion ? undefined : { y: midgroundY, opacity: craftOpacity }}>
            <Image src={homepageEnvironmentAssets.craft.desktop} alt="" fill sizes="100vw" className="co-origin-journey__environment-media co-origin-journey__environment-media--desktop" />
            <Image src={homepageEnvironmentAssets.craft.mobile} alt="" fill sizes="100vw" className="co-origin-journey__environment-media co-origin-journey__environment-media--mobile" />
          </motion.div>
          <motion.div className="co-origin-journey__scene co-origin-journey__scene--everyday" style={reducedMotion ? undefined : { y: backgroundY, opacity: everydayOpacity }}>
            <Image src={homepageEnvironmentAssets.everyday.src} alt="" fill sizes="100vw" className="co-origin-journey__environment-media" />
          </motion.div>
          <div className="co-origin-journey__atmosphere" />
        </div>
        <motion.div className="co-origin-journey__content" style={reducedMotion ? undefined : { y: foregroundY }}>
          <motion.header className="co-origin-journey__intro" style={reducedMotion ? undefined : { opacity: titleOpacity, y: titleY }}>
            <p className="co-sequence-eyebrow">Pollachi · From the source</p>
            <h2 id="co-origin-title">From origin<br />to <em>everyday living.</em></h2>
            <p className="co-origin-journey__support">Grown, harvested and crafted with one destination in mind: real life.</p>
          </motion.header>
          <OriginJourneyPath progress={pathProgress} />
          <div className="co-origin-journey__endpoint co-origin-journey__endpoint--origin">Pollachi, Tamil Nadu</div>
          <div className="co-origin-journey__endpoint co-origin-journey__endpoint--everyday">Made for living.</div>
          <ol className="co-origin-journey__milestones" aria-label="From origin to everyday living">
            {originMilestones.map((item, index) => <OriginMilestone key={item[1]} item={item} progress={pathProgress} threshold={sequence.path.milestoneThresholds[index]} index={index} />)}
          </ol>
          <motion.div className="co-origin-journey__everyday-still-life" style={reducedMotion ? undefined : { opacity: productOpacity, y: productY }} aria-label="Products grounded in the everyday living scene">
            {originProductCutouts.map(([id, label], index) => (
              <span key={id} className={`co-origin-journey__still-life-product co-origin-journey__still-life-product--${index + 1}`}>
                <Image src={transparentProductAssets[id].src} alt={label} fill sizes="180px" className="object-contain" />
              </span>
            ))}
          </motion.div>
          <Link href="/about" className="co-sequence-link co-origin-journey__cta">Explore our journey <ArrowRight size={15} /></Link>
        </motion.div>
        <motion.div className="co-origin-journey__handoff" style={reducedMotion ? undefined : { opacity: handoffOpacity }} aria-hidden="true" />
      </div>
    </section>
  );
}

const receiptMomentSpecs = [
  ["07:30", "Out the door", "co-water", "350 ml", "water"],
  ["11:00", "Need something cold", "melt-co-mango-coconut", "350 ml", "melt"],
  ["13:30", "Cooking at home", "co-kitchen-coconut-oil", "500 ml", "kitchen-oil"],
  ["18:00", "Shower + reset", "co-botanica-shampoo", "350 ml", "botanica-shampoo"],
  ["22:00", "Something sweet", "co-kitchen-coconut-milk", "500 ml", "kitchen-milk"],
] as const;

function productForSlug(slug: string) {
  return shopProducts.find((product) => product.slug === slug)!;
}

function cutoutForProductSlug(slug: string) {
  const ids: Record<string, keyof typeof transparentProductAssets> = {
    "co-water": "water",
    "melt-co-mango-coconut": "melt",
    "co-kitchen-coconut-oil": "kitchen-oil",
    "co-kitchen-coconut-flour": "kitchen-flour",
    "co-kitchen-coconut-milk": "kitchen-milk",
    "co-botanica-shampoo": "botanica-shampoo",
    "co-botanica-face-wash": "botanica-face-wash",
    "co-botanica-hair-serum": "botanica-hair-serum",
    "co-botanica-body-moisturizer": "botanica-moisturizer",
  };
  return transparentProductAssets[ids[slug]];
}

function CoReceiptSection() {
  const cart = useCart();
  const reducedMotion = useHydrationSafeReducedMotion();
  const mobileTimesRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(receiptMomentSpecs.map(([, , slug]) => slug)));
  const [activeMoment, setActiveMoment] = useState(0);
  const [activeTime, activeLabel, activeSlug, activeSize, activeCutoutId] = receiptMomentSpecs[activeMoment];
  const activeProduct = productForSlug(activeSlug);
  const activeCutout = transparentProductAssets[activeCutoutId];
  const selectedProducts = receiptMomentSpecs
    .filter(([, , slug]) => selected.has(slug))
    .map(([, , slug, size, cutoutId]) => ({ product: productForSlug(slug), size, cutout: transparentProductAssets[cutoutId] }));
  const subtotal = selectedProducts.reduce((sum, { product }) => sum + (product.price ?? 0), 0);
  const toggle = (slug: string) => setSelected((current) => {
    const next = new Set(current);
    if (next.has(slug)) next.delete(slug); else next.add(slug);
    return next;
  });
  const addDay = () => selectedProducts.forEach(({ product }) => cart.addItem(product.slug));
  useEffect(() => {
    const scroller = mobileTimesRef.current;
    const activeButton = scroller?.querySelector<HTMLButtonElement>(`button[data-moment-index="${activeMoment}"]`);
    if (!scroller || !activeButton) return;
    const centeredLeft = activeButton.offsetLeft - (scroller.clientWidth - activeButton.offsetWidth) / 2;
    scroller.scrollTo({ left: Math.max(0, centeredLeft), behavior: reducedMotion ? "auto" : "smooth" });
  }, [activeMoment, reducedMotion]);

  return (
    <section className="co-receipt-section" aria-labelledby="co-receipt-title" data-gate="receipt">
      <div className="co-receipt-section__layout">
        <div className="co-receipt-builder">
          <header data-co-reveal>
            <p className="co-sequence-eyebrow">The .CO receipt</p>
            <h2 id="co-receipt-title">Your .CO day.</h2>
            <p className="co-receipt-builder__script">Pick what today looks like.</p>
            <p className="co-receipt-builder__body">Little choices. Real impact. Build a day made for you and rooted in Kerala.</p>
          </header>
          <div className="co-receipt-moments" role="group" aria-label="Choose moments for your .CO day">
            {receiptMomentSpecs.map(([time, label, slug, size, cutoutId], index) => {
              const product = productForSlug(slug);
              const cutout = transparentProductAssets[cutoutId];
              const active = selected.has(slug);
              return (
                <button key={slug} type="button" onClick={() => toggle(slug)} aria-pressed={active} className="co-receipt-moment" data-selected={active}>
                  <span className="co-receipt-moment__time">{time}</span>
                  <span className="co-receipt-moment__label">{label}</span>
                  <span className="co-receipt-moment__niche">
                    <span className="co-receipt-moment__check">{active ? "✓" : "+"}</span>
                    <span className="co-receipt-moment__product"><Image src={cutout.src} alt={product.name} fill sizes="190px" className="object-contain" /></span>
                  </span>
                  <strong>{product.name}</strong>
                  <small>{size}</small>
                  <span className="co-receipt-moment__index">0{index + 1}</span>
                </button>
              );
            })}
          </div>
          <div className="co-receipt-mobile" role="group" aria-label="Choose a moment for your .CO day">
            <div className="co-receipt-mobile__selector"><div ref={mobileTimesRef} className="co-receipt-mobile__times">
              {receiptMomentSpecs.map(([time, label, slug], index) => (
                <button key={slug} type="button" data-moment-index={index} onClick={() => setActiveMoment(index)} aria-pressed={activeMoment === index} aria-label={`${time}, ${label}`}>
                  <span>{time}</span><small>{label}</small>
                </button>
              ))}
            </div><ChevronRight size={16} aria-hidden="true" /></div>
            <div className="co-receipt-mobile__dots" aria-hidden="true">{receiptMomentSpecs.map((item, index) => <span key={item[0]} data-active={activeMoment === index} />)}</div>
            <button type="button" onClick={() => toggle(activeSlug)} aria-pressed={selected.has(activeSlug)} className="co-receipt-mobile__active">
              <span className="co-receipt-mobile__active-copy"><small>{activeTime}</small><strong>{activeLabel}</strong><span>{selected.has(activeSlug) ? "Added to your day" : "Add this moment"}</span></span>
              <AnimatePresence mode="wait" initial={false}><motion.span key={activeSlug} initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: selected.has(activeSlug) ? -6 : 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: reducedMotion ? 0 : .52, ease }} className="co-receipt-mobile__active-product"><Image src={activeCutout.src} alt={activeProduct.name} fill sizes="180px" className="object-contain" /></motion.span></AnimatePresence>
              <span className="co-receipt-mobile__active-meta"><strong>{activeProduct.name}</strong><small>{activeSize}</small><b>{selected.has(activeSlug) ? "✓" : "+"}</b></span>
            </button>
          </div>
          <div className="co-receipt-builder__note"><Leaf size={19} /><span>Small choices. Big ripple.<br /><small>Every .CO moment supports considered living.</small></span></div>
        </div>
        <aside className="co-receipt-panel" aria-label="Your .CO receipt" data-co-reveal>
          <div className="co-receipt-panel__brand"><span>.CO</span><small>The Coconut Company</small></div>
          <div className="co-receipt-panel__meta"><span>Your .CO Receipt</span><time>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date())}</time></div>
          <div className="co-receipt-panel__rows" aria-live="polite">
            <AnimatePresence initial={false} mode="popLayout">
              {selectedProducts.map(({ product, size, cutout }) => <motion.div layout key={product.slug} initial={reducedMotion ? false : { opacity: 0, y: choreography.homepage.originReceipt.receipt.rowYpx }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -6 }} transition={{ duration: reducedMotion ? 0 : choreography.homepage.originReceipt.receipt.rowDurationSeconds, ease }} className="co-receipt-panel__row">
                <span><Image src={cutout.src} alt="" fill sizes="48px" className="object-contain" /></span>
                <span><strong>{product.name}</strong><small>{size}</small></span>
                <small className="co-receipt-panel__qty">×1</small>
                <b>₹{product.price?.toLocaleString("en-IN")}</b>
              </motion.div>)}
            </AnimatePresence>
          </div>
          <div className="co-receipt-panel__total"><span>Subtotal<small>{selectedProducts.length} selected moments</small></span><motion.b key={subtotal} initial={reducedMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>₹{subtotal.toLocaleString("en-IN")}</motion.b></div>
          <div className="co-receipt-panel__grand-total"><span>Total</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
          <button type="button" onClick={addDay} disabled={!selectedProducts.length} className="co-receipt-panel__cta">Get my day <ArrowRight size={18} /></button>
          <p className="co-receipt-panel__privacy"><LockKeyhole size={14} /> Secure. Private. Yours.</p>
        </aside>
      </div>
    </section>
  );
}

type RoutineFeedMode = "launch" | "live";
const routineFeedMode: RoutineFeedMode = "launch";
const routineSpecs = [
  { title: "Sunrise Reset", summary: "A calm coastal start, built around hydration and an easy breakfast.", location: "Kochi, India", icon: Clock3, environment: "/assets/home/generated/co-routine-kochi-environment-v1.webp", mapPath: "M12 62 C42 34 78 74 112 46 S178 18 226 56 S292 92 336 42", slugs: ["co-water", "co-kitchen-coconut-flour", "co-kitchen-coconut-oil"] },
  { title: "Sunday Kitchen", summary: "A slow home-cooking ritual for the table and the week ahead.", location: "Bengaluru, India", icon: Sparkles, environment: "/assets/home/generated/co-routine-bengaluru-environment-v1.webp", mapPath: "M18 34 L72 28 L102 60 L142 22 L184 48 L218 30 L264 74 L332 44 M58 12 L82 94 M194 8 L178 94", slugs: ["co-kitchen-coconut-milk", "co-kitchen-coconut-oil", "co-kitchen-coconut-flour"] },
  { title: "Night Reset", summary: "A quiet evening care ritual with a warm, unhurried finish.", location: "Dubai, UAE", icon: RotateCcw, environment: "/assets/home/generated/co-routine-dubai-environment-v1.webp", mapPath: "M16 76 C68 22 126 92 180 40 C214 8 268 28 334 14 M76 12 C108 44 94 72 128 96 M248 8 C226 46 258 66 238 96", slugs: ["co-botanica-shampoo", "co-botanica-body-moisturizer", "co-botanica-hair-serum"] },
] as const;

type GlobalPulseMode = "launch" | "live";
type GlobalPulseItem = { city: string; routine: string };
const globalPulseMode: GlobalPulseMode = "launch";
const globalPulseItems: GlobalPulseItem[] = [
  { city: "MUMBAI · INDIA", routine: "Curated launch routines across markets." },
  { city: "DUBAI · UAE", routine: "Curated launch routines across markets." },
  { city: "KOCHI · INDIA", routine: "Curated launch routines across markets." },
  { city: "BENGALURU · INDIA", routine: "Curated launch routines across markets." },
];

function StealRoutineSection() {
  const cart = useCart();
  const reducedMotion = useHydrationSafeReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [pulseIndex, setPulseIndex] = useState(0);
  useEffect(() => {
    if (reducedMotion || paused || expanded) return undefined;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % routineSpecs.length), choreography.homepage.lower.routine.cycleMs);
    return () => window.clearInterval(timer);
  }, [expanded, paused, reducedMotion]);
  useEffect(() => {
    if (reducedMotion || paused) return undefined;
    const timer = window.setInterval(() => setPulseIndex((value) => (value + 1) % globalPulseItems.length), choreography.homepage.lower.routine.pulseCycleMs);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);
  const routine = routineSpecs[active];
  const products = routine.slugs.map(productForSlug);
  const total = products.reduce((sum, product) => sum + (product.price ?? 0), 0);
  const addAll = () => products.forEach((product) => cart.addItem(product.slug));

  return (
    <section className="co-routine-section" aria-labelledby="co-routine-title" data-gate="routine" data-mode={routineFeedMode} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }} onPointerDown={() => setPaused(true)}>
      <header className="co-routine-section__header" data-co-reveal>
        <div><p className="co-sequence-eyebrow">Steal the routine</p><h2 id="co-routine-title">Steal someone<br />else&apos;s <em>.CO day.</em></h2></div>
        <div className="co-routine-section__aside">
          <p>Real rituals, hand-picked for how coconut fits into the day.</p>
          <div className="co-global-pulse" data-mode={globalPulseMode} aria-live="polite">
            <span>Global .CO pulse</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={pulseIndex} initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: reducedMotion ? 0 : choreography.homepage.lower.routine.crossfadeSeconds, ease }}>
                <strong>{globalPulseItems[pulseIndex].city}</strong>{globalPulseItems[pulseIndex].routine}
              </motion.p>
            </AnimatePresence>
            <small>{globalPulseMode === "launch" ? "Curated launch routines across India, UAE & beyond" : "Anonymised order pulse"}</small>
          </div>
        </div>
      </header>
      <div className="co-routine-section__stage">
        <nav aria-label="Curated routines" className="co-routine-section__tabs">{routineSpecs.map((item, index) => <button key={item.title} type="button" onClick={() => { setActive(index); setExpanded(false); }} aria-current={active === index ? "true" : undefined}><span>0{index + 1}</span>{item.title}</button>)}</nav>
        <div className="co-routine-cards">
          {routineSpecs.map((item, itemIndex) => {
            const RoutineIcon = item.icon;
            const cardProducts = item.slugs.map(productForSlug);
            const cardTotal = cardProducts.reduce((sum, product) => sum + (product.price ?? 0), 0);
            return <motion.article key={item.title} data-active={active === itemIndex} animate={{ opacity: active === itemIndex ? 1 : .88 }} className="co-routine-card">
              <Image src={mediaUrl(item.environment)} alt="" fill sizes="(min-width: 901px) 31vw, 88vw" className="co-routine-card__environment" />
              <svg className="co-routine-card__map" viewBox="0 0 350 104" preserveAspectRatio="none" aria-hidden="true"><path d={item.mapPath} /></svg>
              <div className="co-routine-card__wash" />
              <div className="co-routine-card__meta"><span><RoutineIcon size={15} /></span><p><small>{item.location}</small><strong>{item.title}</strong><em>{item.summary}</em><b>Total ₹{cardTotal.toLocaleString("en-IN")}</b></p></div>
              <div className="co-routine-card__products">{cardProducts.map((product, index) => <span key={product.slug} className={`co-routine-card__product co-routine-card__product--${index + 1}`}><Image src={cutoutForProductSlug(product.slug).src} alt={product.name} fill sizes="150px" className="object-contain" /></span>)}</div>
              <button type="button" onClick={() => { setActive(itemIndex); setExpanded(true); }}>Steal this routine <ArrowRight size={14} /></button>
            </motion.article>;
          })}
        </div>
        <AnimatePresence>{expanded ? <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="co-routine-details"><header><span>{routine.location}</span><strong>{routine.title}</strong><b>₹{total.toLocaleString("en-IN")}</b></header><div>{products.map((product, index) => <p key={product.slug}><span>{index + 1}</span>{product.name}<b>₹{product.price}</b></p>)}</div><button type="button" onClick={addAll}>Add all <Plus size={15} /></button><button type="button" onClick={() => setExpanded(false)}>Keep watching</button></motion.div> : null}</AnimatePresence>
      </div>
    </section>
  );
}

function FarmEnvironmentalMedia() {
  const reducedMotion = useHydrationSafeReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(false);
  const [videoDeliveryActive, setVideoDeliveryActive] = useState(false);
  useEffect(() => {
    const host = hostRef.current;
    const video = videoRef.current;
    if (reducedMotion || !host || !video) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
      if (entry.isIntersecting) {
        setVideoDeliveryActive(true);
        if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) void video.play().catch(() => undefined);
      } else video.pause();
    }, { rootMargin: "700px 0px" });
    observer.observe(host);
    return () => { observer.disconnect(); video.pause(); };
  }, [reducedMotion]);
  useEffect(() => {
    if (!videoDeliveryActive) return;
    videoRef.current?.load();
  }, [videoDeliveryActive]);
  return reducedMotion ? (
    <Image src={homepageVideoAssets.farm.poster} alt="Kerala coconut farm landscape" fill sizes="100vw" className="object-cover" />
  ) : (
    <div ref={hostRef} className="absolute inset-0">
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        poster={mediaUrl(homepageVideoAssets.farm.poster)}
        muted
        loop
        playsInline
        controls={false}
        preload={videoDeliveryActive ? "auto" : "none"}
        data-delivery-active={videoDeliveryActive}
        aria-label="Kerala coconut farm landscape"
        onCanPlay={(event) => {
          if (inViewRef.current) void event.currentTarget.play().catch(() => undefined);
        }}
      >
        {videoDeliveryActive ? <source src={mediaUrl(homepageVideoAssets.farm.src)} type="video/mp4" /> : null}
      </video>
    </div>
  );
}

const outsideShelfScenes = [
  ["/assets/backgrounds/day-with-co/dawn-grove.png", "Morning light moving through a Kerala coconut grove."],
  ["/assets/backgrounds/day-with-co/evening-interior.png", "A slow coastal road beneath coconut palms."],
  ["/assets/backgrounds/day-with-co/late-afternoon.png", "A sunlit kitchen prepared for an everyday coconut ritual."],
  ["/assets/backgrounds/day-with-co/morning-care-v2.png", "A calm morning care space opening to the palms."],
  ["/assets/backgrounds/day-with-co/midmorning-road.png", "A coconut dessert shared at the end of the day."],
] as const;

function OutsideShelfSection() {
  const reducedMotion = useHydrationSafeReducedMotion();
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  useEffect(() => {
    const syncVisibility = () => setPageHidden(document.hidden);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);
  useEffect(() => {
    if (reducedMotion || paused || pageHidden) return undefined;
    const timer = window.setInterval(() => setOffset((value) => (value + 1) % outsideShelfScenes.length), choreography.homepage.lower.outsideShelf.cycleMs);
    return () => window.clearInterval(timer);
  }, [pageHidden, paused, reducedMotion]);
  const scenes = outsideShelfScenes.map((_, index) => outsideShelfScenes[(index + offset) % outsideShelfScenes.length]);
  const slotNames = ["far-left", "near-left", "center", "near-right", "far-right"] as const;
  const move = (direction: -1 | 1) => setOffset((value) => (value + direction + outsideShelfScenes.length) % outsideShelfScenes.length);
  return <section className="co-outside-shelf" aria-labelledby="outside-shelf-title" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <header><div><p className="co-sequence-eyebrow">.CO outside the shelf</p><h2 id="outside-shelf-title">Real life. Real moments.</h2></div><Link href="/journal">See more moments <ArrowRight size={14} /></Link></header>
    <div className="co-outside-shelf__reel" onPointerDown={() => setPaused(true)}>
      <div className="co-outside-shelf__ambient" aria-hidden="true"><Image src={scenes[2][0]} alt="" fill sizes="100vw" className="object-cover" /></div>
      <motion.div className="co-outside-shelf__track" drag={reducedMotion ? false : "x"} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.12} onDragStart={() => setPaused(true)} onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 48) move(info.offset.x < 0 ? 1 : -1); }}>
        {scenes.map(([src, alt], index) => <figure key={src} className={`co-outside-shelf__frame co-outside-shelf__frame--${slotNames[index]}`} aria-hidden={index === 2 ? undefined : true}><Image src={src} alt={index === 2 ? alt : ""} fill sizes={index === 2 ? "40vw" : "28vw"} className="object-cover" /></figure>)}
      </motion.div>
      <div className="co-outside-shelf__controls"><button type="button" onClick={() => move(-1)} aria-label="Previous lifestyle moment"><ArrowLeft size={15} /></button><button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Resume lifestyle reel" : "Pause lifestyle reel"}>{paused ? <PlayCircle size={16} /> : <span aria-hidden="true">Ⅱ</span>}</button><button type="button" onClick={() => move(1)} aria-label="Next lifestyle moment"><ArrowRight size={15} /></button></div>
    </div>
  </section>;
}

const marqueeItems = [
  [Truck, "Free Delivery", "On orders over ₹699"],
  [Headphones, "24/7 Support", "We're here anytime"],
  [RotateCcw, "Easy Returns", "14-day easy returns"],
  [LockKeyhole, "Secure Payments", "100% safe & secure"],
  [Leaf, "Fresh Bottling", "Straight from Kerala"],
  [Sparkles, "Made in Kerala", "Rooted in our home"],
  [Milk, "Naturally Hydrating", "Pure coconut goodness"],
  [ShieldCheck, "Premium Quality", "Made with care"],
  [PackageCheck, "Thoughtful Packaging", "Better for Earth"],
  [Recycle, "Sustainably Sourced", "From trusted farms"]
] as const;

function DeliveryMarquee() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current || prefersReducedMotion()) return undefined;
    const { gsap } = getScrollTrigger();
    const tween = gsap.to(trackRef.current, { xPercent: -50, duration: 38, repeat: -1, ease: "none" });
    const pause = () => tween.pause();
    const resume = () => tween.resume();
    const wrap = wrapRef.current;
    wrap?.addEventListener("mouseenter", pause);
    wrap?.addEventListener("mouseleave", resume);
    return () => {
      wrap?.removeEventListener("mouseenter", pause);
      wrap?.removeEventListener("mouseleave", resume);
      tween.kill();
    };
  }, []);

  return (
    <section ref={wrapRef} className="mt-3 overflow-hidden bg-[#173412] py-3 text-white md:mt-8 md:py-4" aria-label="Customer benefits">
      <div ref={trackRef} className="flex w-max will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {marqueeItems.map(([Icon, title, detail]) => (
              <div key={`${copy}-${title}`} className="flex w-[215px] shrink-0 items-center gap-3 border-r border-white/16 px-5 md:w-[260px] md:px-7">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/30"><Icon size={17} strokeWidth={1.5} /></span>
                <span><span className="block text-[10px] font-semibold uppercase">{title}</span><span className="mt-1 block text-[9px] text-white/68">{detail}</span></span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

const bentoCards = [
  {
    title: "Naturally Hydrating",
    body: "Clean hydration straight from nature.",
    image: "/assets/home/refined/naturally-hydrating-4k.png",
    tone: "light"
  },
  {
    title: "Made with Care",
    body: "Thoughtful ingredients, honest and pure.",
    image: "/assets/home/refined/made-with-care-4k.png",
    tone: "light"
  },
  {
    title: "Sustainably Yours",
    body: "Ethical sourcing for a better tomorrow.",
    image: "/assets/home/refined/sustainably-yours-4k.png",
    tone: "light"
  },
  {
    title: "Recipes to Inspire",
    body: "Simple, delicious recipes for every moment.",
    image: "/assets/home/refined/recipes-to-inspire-4k.png",
    tone: "dark"
  }
];

function PlanetBentoSection({ products }: { products: DisplayProduct[] }) {
  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-14 md:px-8 md:pb-12 md:pt-24">
      <div className="relative mx-auto max-w-[1320px]">
        <div className="grid grid-cols-[.9fr_1.1fr] items-center gap-3 md:grid-cols-[.78fr_1.22fr] md:gap-8">
          <div className="max-w-[360px] md:pl-[8%]">
            <h2 className="font-['Cormorant_Garamond'] text-[30px] leading-[.98] tracking-[-.025em] md:text-[46px]">One coconut.<br />Made with intent.</h2>
            <p className="mt-4 text-[11px] leading-5 text-[#5e554d] md:mt-5 md:text-sm md:leading-7">Every .CO product is a step towards a healthier you and a happier Earth.</p>
            <Link href="/sustainability" className="mt-6 inline-flex items-center gap-3 border-b border-[#305a34] pb-1 text-[11px] font-semibold uppercase text-[#305a34]">
              Our promise <ArrowRight size={15} />
            </Link>
          </div>
          <div className="relative min-h-[200px] overflow-hidden rounded-[22px] border border-white/70 bg-white/35 shadow-[0_22px_60px_rgba(53,39,30,.08)] md:min-h-[280px] md:rounded-[28px]">
            <Image src="/assets/home/refined/planet-editorial-4k.png" alt="Fresh coconuts and palm leaves on warm travertine" fill sizes="62vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,242,232,.62),transparent_42%)]" />
          </div>
          <span className="sr-only">{products.length} curated products</span>
        </div>

      </div>
    </section>
  );
}

function BrandFamilyTransitions() {
  return (
    <section className="px-4 py-10 md:px-8 md:py-14" aria-labelledby="family-transition-title">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#305a34]">One coconut. Many rituals.</p>
            <h2 id="family-transition-title" className="mt-3 max-w-[14ch] font-['Cormorant_Garamond'] text-[34px] leading-[.94] tracking-[-.025em] md:text-[52px]">From origin to everyday living.</h2>
          </div>
          <p className="hidden max-w-sm text-right text-xs leading-6 text-[#625950] md:block">Explore the product families connected by one considered coconut ecosystem.</p>
        </div>
        <div className="mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] md:grid md:grid-cols-5 md:overflow-visible [&::-webkit-scrollbar]:hidden">
          {familyTransitionAssets.map(([eyebrow, title, asset, href], index) => {
            return (
              <motion.article key={title} whileHover={{ y: -5 }} transition={{ duration: .35, ease }} className="group relative min-h-[360px] min-w-[78vw] snap-center overflow-hidden rounded-[26px] border border-white/70 bg-[#eee6d9] shadow-[0_18px_50px_rgba(53,39,30,.07)] md:min-h-[390px] md:min-w-0">
                <Image src={asset.desktop} mobileSrc={asset.mobile} alt={asset.alt} fill sizes="(min-width:768px) 20vw, 78vw" quality={92} placeholder="blur" blurDataURL={blurDataURL} className="object-cover transition duration-700 group-hover:scale-[1.025]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,24,18,.02)_35%,rgba(25,19,14,.72)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white md:p-4">
                  <p className="text-[8px] font-semibold uppercase tracking-[.16em] text-white/72">0{index + 1} · {eyebrow}</p>
                  <h3 className="mt-2 font-['Cormorant_Garamond'] text-[30px] leading-none">{title}</h3>
                  <Link href={href} className="mt-4 inline-flex min-h-11 items-center gap-2 text-[9px] font-semibold uppercase" aria-label={`Explore ${title}`}>Explore <ArrowRight size={14} /></Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductsSection({ products }: { products: DisplayProduct[] }) {
  const cart = useCart();

  return (
    <section className="px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-[1320px] rounded-[32px] bg-white/56 p-4 shadow-[0_20px_60px_rgba(53,39,30,.06)] md:rounded-[36px] md:p-7">
        <div className="flex items-end justify-between gap-4 px-1">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#305a34]">Our Products</p>
            <h2 className="mt-3 font-['Cormorant_Garamond'] text-[30px] leading-[.95] tracking-[-.025em] md:text-[48px]">
              Crafted with nature.
              <br />
              Perfect for you.
            </h2>
          </div>
          <Link href="/shop" className="hidden items-center gap-3 text-[11px] font-semibold uppercase md:flex">
            View all products <ArrowRight size={16} />
          </Link>
          <Link href="/shop" aria-label="View all products" className="grid size-10 place-items-center rounded-full border border-[#35271e]/12 md:hidden">
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 pb-2 md:grid-cols-4">
          {products.map((product) => (
            <motion.article key={product.slug} whileHover={{ y: -5 }} transition={{ duration: 0.35, ease }} className="min-w-0 rounded-[20px] border border-[#35271e]/8 bg-[rgba(255,255,255,.62)] p-2.5 md:rounded-[26px] md:p-4">
              <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-[18px] bg-[#f8f4ec]">
                <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 280px, 46vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-contain p-3 md:p-5" />
              </Link>
              <div className="mt-4 grid grid-cols-[1fr_38px] gap-3">
                <div>
                  <h3 className="text-[12px] font-medium leading-5 md:text-sm">{product.shortName}</h3>
                  <p className="mt-2 font-['Space_Grotesk'] text-[11px] font-medium md:text-xs">{product.price}</p>
                </div>
                <button type="button" onClick={() => cart.addItem(product.slug)} aria-label={`Add ${product.name}`} className="grid size-9 place-items-center rounded-full border border-[#35271e]/14 transition hover:bg-[#304f2c] hover:text-white">
                  <Plus size={15} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

const recipeCards = [
  { title: "Coconut Berry Smoothie Bowl", category: "Breakfast", time: "10 min", image: publicAssets.recipes.seasonalBowl },
  { title: "Melt.CO Mango Nice Cream", category: "Dessert", time: "15 min", image: "/assets/recipes/generated/co-mango-nice-cream-editorial-4k.avif" },
  { title: "Coconut Thai Veggie Curry", category: "Lunch", time: "20 min", image: publicAssets.recipes.veggieCurry },
  { title: "Green Coconut Detox Smoothie", category: "Drinks", time: "5 min", image: "/assets/recipes/generated/co-green-coconut-smoothie-editorial-4k.avif" },
  { title: "Coconut Energy Balls", category: "Snack", time: "15 min", image: publicAssets.recipes.energyBites }
];

function RecipesSnapshot({ recipes }: { recipes: ContentRecipe[] }) {
  const approvedFoodOnlyImages = [
    publicAssets.recipes.seasonalBowl,
    "/assets/recipes/generated/co-green-coconut-smoothie-editorial-4k.avif",
    publicAssets.recipes.veggieCurry
  ] as const;
  const cards = recipes.length ? recipes.slice(0, 3).map((recipe, index) => ({
    slug: recipe.slug,
    title: recipe.title,
    category: recipe.category,
    time: recipe.time,
    // Homepage recipe photography is deliberately food-only so legacy or
    // unapproved packaging cannot re-enter the current nine-packshot system.
    image: approvedFoodOnlyImages[index]
  })) : recipeCards.slice(0, 3).map((recipe, index) => ({ ...recipe, slug: `recipe-${index}` }));
  return (
    <section className="co-lower-recipes" aria-labelledby="co-recipes-title">
      <div className="co-lower-recipes__intro">
          <p className="co-sequence-eyebrow">Made with coconut</p>
          <h2 id="co-recipes-title">Recipes for<br />real life.</h2>
          <p>Simple, nourishing recipes made with ingredients you trust.</p>
          <Link href="/recipes">Explore recipes <ArrowRight size={14} /></Link>
      </div>
      <div className="co-lower-recipes__cards">
          {cards.map((recipe) => (
            <motion.article key={recipe.title} whileHover={{ y: -3 }} transition={{ duration: 0.28, ease }} className="co-lower-recipes__card">
              <Link href={`/recipes/${recipe.slug}`}><span><Image src={recipe.image} alt={recipe.title} fill sizes="(min-width: 901px) 24vw, 78vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-cover" /></span><h3>{recipe.title}</h3><p>{recipe.category} · Ready in {recipe.time}</p></Link>
            </motion.article>
          ))}
      </div>
    </section>
  );
}

const fallbackDisplayTestimonials = [
  { quote: "The coconut water is incredibly refreshing and pure. You can really taste the difference!", name: "Priya S.", initials: "PS" },
  { quote: "Melt.CO ice cream is now our guilt-free indulgence. Creamy, delicious and natural!", name: "Arjun M.", initials: "AM" },
  { quote: "Love the brand's values and sustainable approach. Happy to support .CO!", name: "Neha R.", initials: "NR" }
];

function TestimonialsSection({ testimonials }: { testimonials: ContentTestimonial[] }) {
  const displayTestimonials = testimonials.length ? testimonials.slice(0, 4).map((item) => ({
    quote: item.quote,
    name: item.name,
    initials: item.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    role: item.role
  })) : fallbackDisplayTestimonials.map((item) => ({ ...item, role: "Development placeholder — not verified" }));

  return (
    <section className="co-testimonial-ribbon" aria-label="Life with coconut">
      <button type="button" aria-label="Previous quote"><ArrowLeft size={14} /></button>
      <div>{displayTestimonials.map((testimonial) => <TestimonialCard key={testimonial.name} testimonial={testimonial} highlighted />)}</div>
      <button type="button" aria-label="Next quote"><ArrowRight size={14} /></button>
    </section>
  );
}

function TestimonialCard({ testimonial, highlighted }: { testimonial: { quote: string; name: string; initials: string; role: string }; highlighted: boolean }) {
  return (
    <motion.article animate={{ y: highlighted ? 0 : 0 }}>
      <span aria-hidden="true">{testimonial.initials}</span>
      <div><blockquote>“{testimonial.quote}”</blockquote><p><strong>{testimonial.name}</strong><small>{testimonial.role}</small></p></div>
    </motion.article>
  );
}

function SustainabilityBanner() {
  return (
    <section className="co-lower-sustainability">
      <div className="co-lower-sustainability__scene">
        <FarmEnvironmentalMedia />
        <div className="co-lower-sustainability__wash" />
        <div className="co-lower-sustainability__content">
          <div className="co-lower-sustainability__copy">
            <p className="co-sequence-eyebrow">Sustainability, in action</p>
            <h2>Small choices.<br />Big impact.</h2>
            <p>Every choice adds up. Here&apos;s what 10,000 units can look like.</p>
            <Link href="/sustainability">Our sustainability <ArrowRight size={15} /></Link>
          </div>
          <ImpactCounters config={sustainabilityImpact} />
        </div>
      </div>
    </section>
  );
}

function CoNewsletterSection() {
  const benefits = [
    [Leaf, "Real ingredients.", "No shortcuts."],
    [Heart, "Crafted for living.", "Rooted in care."],
    [ShieldCheck, "Better for you.", "Better for Earth."],
  ] as const;
  return <section className="co-lower-newsletter" aria-labelledby="co-newsletter-title">
    <div className="co-lower-newsletter__copy">
      <p className="co-sequence-eyebrow">Stay in the loop</p>
      <h2 id="co-newsletter-title">Good things, straight to <em>you.</em></h2>
      <span>Recipes, new drops, and real stories from our coconut world.</span>
      <div className="co-lower-newsletter__benefits">{benefits.map(([Icon, title, detail]) => <p key={title}><i><Icon size={15} strokeWidth={1.35} /></i><span><strong>{title}</strong><small>{detail}</small></span></p>)}</div>
    </div>
    <NewsletterForm compact className="co-lower-newsletter__form" />
  </section>;
}

const faqItems = [
  ["Are your products 100% natural?", "Yes! All our products are 100% natural with no artificial colors, flavors or preservatives."],
  ["Do you ship internationally?", "We currently deliver across India and are preparing selected international delivery routes."],
  ["What is your return policy?", "Unopened products can be returned within 14 days of delivery. Contact our support team and we'll help."],
  ["How should I store coconut water?", "Keep unopened bottles in a cool, dry place. Refrigerate after opening and enjoy promptly."],
  ["How long does delivery take?", "Most orders arrive within 3–7 working days, depending on your location."]
] as const;

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const remembered = window.sessionStorage.getItem("co-home-faq");
    if (remembered !== null) setOpenIndex(Number(remembered));
  }, []);

  const toggle = (index: number) => {
    const next = openIndex === index ? -1 : index;
    setOpenIndex(next);
    window.sessionStorage.setItem("co-home-faq", String(next));
  };

  return (
    <section className="px-4 py-9 md:px-8 md:py-12">
      <div className="mx-auto grid max-w-[1320px] gap-8 md:grid-cols-[.72fr_1.28fr] md:items-start">
        <div className="relative min-h-[230px] overflow-hidden px-2 md:min-h-[310px] md:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#305a34]">FAQ&apos;s</p>
          <h2 className="mt-3 font-['Cormorant_Garamond'] text-[38px] leading-[.95] md:text-[48px]">Got questions?<br />We&apos;ve got answers.</h2>
        </div>
        <div className="space-y-2">
          {faqItems.map(([question, answer], index) => {
            const isOpen = openIndex === index;
            return (
              <article key={question} className="overflow-hidden rounded-[16px] border border-[#35271e]/7 bg-white/48 shadow-[0_8px_28px_rgba(53,39,30,.035)]">
                <button type="button" onClick={() => toggle(index)} aria-expanded={isOpen} className="flex min-h-14 w-full items-center justify-between gap-4 px-5 text-left text-xs font-semibold md:min-h-16 md:px-6">
                  {question}<motion.span animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown size={17} /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }}>
                      <p className="px-5 pb-5 text-[11px] leading-6 text-[#655c53] md:px-6">{answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MobileReferenceExtras({ products }: { products: DisplayProduct[] }) {
  const serviceItems = [
    [Truck, "Free Delivery", "On orders over ₹699"],
    [Headphones, "24/7 Support", "We're here anytime"],
    [RotateCcw, "Hassle-free Returns", "14-day easy returns"],
    [LockKeyhole, "Secure Payments", "100% safe & secure"],
    [Recycle, "Sustainable Packaging", "Good for you, good for Earth"]
  ] as const;

  return (
    <div className="space-y-7 px-4 pb-8 md:hidden">
      <section>
        <p className="text-[10px] font-semibold text-[#305a34]">More from our kitchen</p>
        <h2 className="mt-3 font-['Cormorant_Garamond'] text-[34px] leading-none">Quick bites. Big delight.</h2>
        <div className="mt-5 flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {recipeCards.slice(3).map((recipe) => (
            <article key={recipe.title} className="min-w-[62%] overflow-hidden rounded-[20px] border border-[#35271e]/8 bg-white/55">
              <div className="relative aspect-[4/3]"><Image src={recipe.image} alt={recipe.title} fill sizes="62vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-cover" /></div>
              <div className="p-3"><p className="text-[8px] uppercase text-[#7b7168]">{recipe.category} · {recipe.time}</p><h3 className="mt-2 text-xs font-medium leading-5">{recipe.title}</h3></div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative min-h-[225px] overflow-hidden rounded-[26px] bg-white/55 p-5 shadow-[0_15px_38px_rgba(53,39,30,.06)]">
        <div className="relative z-10 max-w-[48%]"><h2 className="font-['Cormorant_Garamond'] text-[30px]">Bundle &amp; Save</h2><p className="mt-2 text-xs leading-5">Up to 15% off on selected bundles.</p><Link href="/shop" className="mt-5 inline-flex items-center gap-2 border-b border-[#35271e] pb-1 text-[10px] font-semibold uppercase">Shop bundles <ArrowRight size={14} /></Link></div>
        <div className="absolute bottom-0 right-0 h-[205px] w-[58%]"><Image src={publicAssets.ecosystem.kitchenGroup} alt=".CO coconut product bundle" fill sizes="58vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-cover object-left [mask-image:linear-gradient(to_right,transparent_0%,black_28%)]" /></div>
      </section>

      <section className="rounded-[24px] border border-[#35271e]/7 bg-white/45 px-4">
        {serviceItems.map(([Icon, title, detail]) => (
          <div key={title} className="grid grid-cols-[42px_1fr_20px] items-center gap-3 border-b border-[#35271e]/8 py-4 last:border-0"><span className="grid size-10 place-items-center rounded-full bg-[#f1ede4]"><Icon size={19} strokeWidth={1.45} /></span><span><span className="block text-xs font-semibold">{title}</span><span className="mt-1 block text-[10px] text-[#6b6259]">{detail}</span></span><ChevronRight size={16} /></div>
        ))}
      </section>

      <section className="relative min-h-[215px] overflow-hidden rounded-[26px] bg-white/55 p-5">
        <div className="relative z-10 max-w-[60%]"><h2 className="font-['Cormorant_Garamond'] text-[30px]">The .CO Journal</h2><p className="mt-2 text-xs leading-5">Stories, tips &amp; inspiration for a better you.</p><Link href="/journal" className="mt-5 inline-flex items-center gap-2 border-b border-[#35271e] pb-1 text-[10px] font-semibold uppercase">Explore journal <ArrowRight size={14} /></Link></div>
      </section>

      <section>
        <h2 className="font-['Cormorant_Garamond'] text-[31px]">Join the .CO Community</h2><p className="mt-2 text-xs leading-5">Share your moments with #COCoconut and get featured.</p>
        <div className="mt-4 grid grid-cols-3 gap-2">{[publicAssets.water.lifestyle, publicAssets.campaign.breakfastRitual, publicAssets.recipes.seasonalBowl].map((image, index) => <div key={image} className="relative aspect-square overflow-hidden rounded-[14px]"><Image src={image} alt={`.CO community moment ${index + 1}`} fill sizes="33vw" quality={90} placeholder="blur" blurDataURL={blurDataURL} className="object-cover" /></div>)}</div>
        <a href="https://www.instagram.com/cothecoconutcompany" target="_blank" rel="noreferrer" className="co-primary-cta mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#304f2c] px-5 text-[9px] font-semibold uppercase text-white">Follow us @cococonutcompany <Instagram size={14} /></a>
      </section>

    </div>
  );
}

export { NewsletterSection } from "@/components/launch/NewsletterSection";

export function MobileBottomNav() {
  const pathname = usePathname();
  const homeShell = pathname === "/";
  const items = [[Leaf, "Home", "/"], [ShoppingBag, "Shop", "/shop"], [Grid2X2, "Recipes", "/recipes"], [Heart, "Wishlist", "/wishlist"], [CircleUserRound, "Account", "/account"]] as const;
  return (
    <nav className={cn("co-mobile-bottom-nav fixed inset-x-0 bottom-0 z-[105] grid grid-cols-5 border-t px-2 pb-[max(6px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden", homeShell ? "border-[#e09f52]/15 bg-[rgba(25,13,8,.92)] text-[#e8d6bd]" : "border-[#35271e]/10 bg-[rgba(250,247,240,.94)]")} aria-label="Mobile quick navigation">
      {items.map(([Icon, label, href]) => { const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)); return <Link key={label} href={href} prefetch={href === "/" ? false : undefined} aria-current={active ? "page" : undefined} className={cn("flex flex-col items-center gap-1 rounded-2xl py-1 text-[8px] transition", active && (homeShell ? "co-nav-active bg-[#e09f52]/15 font-bold text-[#f7f4ef]" : "co-nav-active bg-white/70 font-bold text-[#305a34]"))}><Icon size={17} strokeWidth={1.6} /><span>{label}</span></Link>; })}
    </nav>
  );
}

export function ReferenceFooter() {
  const currentYear = new Date().getFullYear();
  const columns = [
    { title: "Products", icon: PackageCheck, links: ["All Products", ".CO Water", ".CO Kitchen", "BOTANICA", "MELT"] },
    { title: "Company", icon: Leaf, links: ["About Us", "Our Journey", "Sustainability", "Careers", "Press"] },
    { title: "Support", icon: Headphones, links: ["Help & FAQs", "Shipping & Returns", "Track Your Order", "Contact Us"] },
    { title: "Legal", icon: ShieldCheck, links: ["Privacy Policy", "Terms & Conditions"] }
  ];

  return (
    <footer className="co-reference-footer">
      <div className="co-reference-footer__layout">
        <div className="co-reference-footer__brand">
          <span className="relative block h-[70px] w-[110px]">
            <Image src="/images/logo.svg" alt=".CO The Coconut Company" fill sizes="110px" className="object-contain object-left" />
          </span>
          <p>Made for living.</p>
          <span>Honest coconut essentials crafted for a better you and a better planet.</span>
          <div className="co-reference-footer__social"><a href="https://www.instagram.com/cothecoconutcompany" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={14} /></a></div>
        </div>
        <div className="co-reference-footer__mobile-columns">
          {columns.map((column) => {
            const ColumnIcon = column.icon;
            return <details key={column.title} className="group border-b border-[#35271e]/8 py-1">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-[10px] font-semibold uppercase"><span><ColumnIcon size={14} />{column.title}</span><b className="text-lg font-normal transition group-open:rotate-45">+</b></summary>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 pb-4">
                {column.links.map((label) => <Link key={label} href={footerLink(label)}>{label}</Link>)}
              </div>
            </details>;
          })}
        </div>
        <div className="co-reference-footer__columns">
          {columns.map((column) => {
            const ColumnIcon = column.icon;
            return <div key={column.title}>
              <p><ColumnIcon size={14} />{column.title}</p>
              <div>
                {column.links.map((label) => (
                  <Link key={label} href={footerLink(label)}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>;
          })}
        </div>
      </div>
      <div className="co-reference-footer__utility"><span><MapPin size={14} /> India (IN) <ChevronDown size={13} /></span><b>© {currentYear} .CO The Coconut Company. All rights reserved.</b><span><Leaf size={14} /> Rooted in nature. Made for living.</span><CookiePreferencesButton /></div>
    </footer>
  );
}

function footerLink(label: string) {
  const routes: Record<string, string> = {
    "All Products": "/shop", ".CO Water": "/shop?category=Coconut%20Water", ".CO Kitchen": "/shop?category=Food", BOTANICA: "/shop?category=Cosmetics", MELT: "/shop?category=Ice%20Cream",
    "About Us": "/about", "Our Journey": "/about#journey", Sustainability: "/sustainability", Careers: "/careers", Press: "/journal", "Contact Us": "/contact",
    "Help & FAQs": "/faqs", "Shipping & Returns": "/shipping-delivery", "Track Your Order": "/account/orders", "Terms & Conditions": "/terms-and-conditions", "Privacy Policy": "/privacy-policy"
  };
  return routes[label] || "/";
}

export function ReferenceHomePage({ homepage, products, recipes, testimonials }: { homepage: HomepageContent; products: ContentProduct[]; recipes: ContentRecipe[]; testimonials: ContentTestimonial[] }) {
  return (
    <div className="co-reference-home min-h-screen overflow-x-clip bg-[#0e0906] font-['Inter'] text-[#f7f4ef]">
      <ReferenceHeader />
      <CinematicHomeSequence homepage={homepage} products={products} recipes={recipes} testimonials={testimonials} />
      <ReferenceFooter />
      <MobileBottomNav />
    </div>
  );
}
