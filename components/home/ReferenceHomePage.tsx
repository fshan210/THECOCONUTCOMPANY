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
  Facebook,
  Gift,
  Grid2X2,
  Headphones,
  Heart,
  IceCreamBowl,
  Instagram,
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
  Youtube,
  X,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { CartButton } from "@/components/cart/CartDrawer";
import { useCustomerSession } from "@/components/auth/CustomerAuthProvider";
import { customerGreeting } from "@/lib/customer/display-name";
import { NewsletterForm } from "@/components/launch/NewsletterForm";
import { CookiePreferencesButton } from "@/components/launch/CookiePreferencesButton";
import { useCart } from "@/lib/cart/cart-context";
import { getScrollTrigger, prefersReducedMotion } from "@/lib/animation/gsap-scrolltrigger";
import type { ContentProduct, ContentRecipe, ContentTestimonial, HomepageContent } from "@/lib/content/types";
import { publicAssets } from "@/lib/public-assets";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/lib/ui/use-body-scroll-lock";

const ease = [0.16, 1, 0.3, 1] as const;
const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSczMCc+PGZpbHRlciBpZD0nYic+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nNicvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyNmN2YyZTgnLz48L3N2Zz4=";

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
  { label: "Food", icon: CookingPot, href: "/shop?product=co-kitchen-coconut-oil" },
  { label: "Cosmetics", icon: Sparkles, href: "/shop?product=co-botanica-coconut-care" },
  { label: "Utensils", icon: Utensils, href: "/shop?product=co-lifestyle" },
  { label: "Bundles & Gifts", icon: Gift, href: "/shop?category=bundles" }
];

const productPresentation: Record<string, Partial<DisplayProduct>> = {
  "co-water": {
    name: ".CO Water",
    shortName: ".CO Water 330ml",
    subtitle: "100% Organic Coconut Water",
    detail: "Clean tender coconut water with a calm, refreshing finish.",
    image: "/assets/shop/products/IndividualProduct_CO-Water.png",
    price: "₹120.00"
  },
  "melt-co-mango-coconut": {
    name: "Melt.CO",
    shortName: "Mango + Coconut 350ml",
    subtitle: "Coconut Ice Cream",
    detail: "Creamy coconut ice cream with real fruit. Pure indulgence in every spoon.",
    image: "/assets/shop/products/IndividualProduct_MeltCO.png",
    price: "₹220.00"
  },
  "co-kitchen-coconut-oil": {
    name: ".CO Foods",
    shortName: ".CO Coconut Oil",
    subtitle: "Cold-pressed Coconut Oil",
    detail: "A versatile coconut pantry staple for everyday cooking and mindful rituals.",
    image: "/assets/shop/products/IndividualProduct_CoconutOil.png",
    price: "₹160.00"
  },
  "co-botanica-coconut-care": {
    name: ".CO Botanica",
    shortName: "Botanica Face Wash",
    subtitle: "Coconut Face Wash",
    detail: "A gentle, refreshing coconut care ritual made for everyday cleansing.",
    image: "/assets/shop/products/IndividualProduct_FaceWash.png",
    price: "₹499.00"
  }
};

function toDisplayProducts(products: ContentProduct[]): DisplayProduct[] {
  const order = ["co-water", "melt-co-mango-coconut", "co-kitchen-coconut-oil", "co-botanica-coconut-care"];

  return order.map((slug) => {
    const product = products.find((item) => item.slug === slug);
    const presentation = productPresentation[slug];

    return {
      slug,
      name: presentation.name ?? product?.name ?? slug,
      shortName: presentation.shortName ?? product?.name ?? slug,
      subtitle: presentation.subtitle ?? product?.shortDescription ?? "",
      detail: presentation.detail ?? product?.longDescription ?? product?.shortDescription ?? "",
      image: presentation.image ?? product?.image ?? publicAssets.water.floating,
      price: product?.price ? `₹${product.price.toFixed(2)}` : presentation.price ?? "Coming soon"
    };
  });
}

function toPopupProducts(products: DisplayProduct[]): DisplayProduct[] {
  const extras: DisplayProduct[] = [
    { slug: "coconut-milk", shopSlug: "co-kitchen-coconut-oil", name: "Coconut Milk", shortName: "Coconut Milk", subtitle: "Creamy kitchen staple", detail: "A rich coconut base for curries, drinks and desserts.", image: "/assets/Ecosystem_Assets/Kitchen-group ecosystem.png", price: "Coming soon" },
    { slug: "coconut-oil", shopSlug: "co-kitchen-coconut-oil", name: "Coconut Oil", shortName: "Coconut Oil", subtitle: "Cold-pressed kitchen oil", detail: "A versatile coconut pantry ritual for everyday cooking.", image: "/assets/shop/products/IndividualProduct_CoconutOil.png", price: "Coming soon" },
    { slug: "coconut-sugar", shopSlug: "co-kitchen-coconut-oil", name: "Coconut Sugar", shortName: "Coconut Sugar", subtitle: "Naturally inspired sweetness", detail: "A warm coconut-world pantry preview.", image: "/assets/shop/products/IndividualProduct_CoconutSugar.png", price: "Coming soon" },
    { slug: "coconut-vinegar", shopSlug: "co-kitchen-coconut-oil", name: "Coconut Vinegar", shortName: "Coconut Vinegar", subtitle: "Bright pantry essential", detail: "A crisp coconut vinegar direction for dressings and marinades.", image: "/assets/Ecosystem_Assets/coconut vinegar-lifestyle scene.png", price: "Coming soon" },
    { slug: "coconut-aminos", shopSlug: "co-kitchen-coconut-oil", name: "Coconut Aminos", shortName: "Coconut Aminos", subtitle: "Savoury coconut seasoning", detail: "A versatile seasoning preview for everyday recipes.", image: "/assets/shop/products/IndividualProduct_CoconutAminos.png", price: "Coming soon" },
    { slug: "face-wash", shopSlug: "co-botanica-coconut-care", name: "Face Wash", shortName: "Face Wash", subtitle: "Gentle coconut care", detail: "A calm daily cleanse inspired by coconut botanicals.", image: "/assets/shop/products/IndividualProduct_FaceWash.png", price: "Coming soon" },
    { slug: "body-lotion", shopSlug: "co-botanica-coconut-care", name: "Body Lotion", shortName: "Body Lotion", subtitle: "Everyday coconut moisture", detail: "A soft botanical body-care ritual.", image: "/assets/shop/products/IndividualProduct_BodyLotion.png", price: "Coming soon" },
    { slug: "gift-boxes", shopSlug: "co-lifestyle", name: "Gift Boxes", shortName: "Gift Boxes", subtitle: "Curated .CO rituals", detail: "A thoughtful collection of coconut favourites.", image: "/assets/shop/products/IndividualProduct_GiftBox.png", price: "Coming soon" }
  ];

  return [...products, ...extras];
}

export function ReferenceHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const session = useCustomerSession();
  const greeting = customerGreeting(session);
  const accountHref = session ? "/account" : "/login?redirect=%2Faccount";
  useBodyScrollLock(menuOpen);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const next = window.scrollY > 80;
      setScrolled((current) => current === next ? current : next);
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  const links = [
    ["About", "/about"],
    ["Products", "/shop#all-products"],
    ["Shop", "/shop"],
    ["Recipes", "/recipes"],
    ["Sustainability", "/sustainability"],
    ["Founders", "/founders"],
    ["Journal", "/journal"]
  ];

  return (
    <>
      <div className="h-[72px] md:h-[86px]" aria-hidden="true" />
      <AnimatePresence>
        {menuOpen ? <motion.button type="button" aria-label="Close mobile navigation" onClick={() => setMenuOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#211812]/18 backdrop-blur-[2px] lg:hidden" /> : null}
      </AnimatePresence>
      <motion.header
        initial={false}
        animate={{ width: scrolled ? "min(1280px, calc(100% - 28px))" : "100%", top: scrolled ? 12 : 0, borderTopLeftRadius: scrolled ? 34 : 0, borderTopRightRadius: scrolled ? 34 : 0, borderBottomLeftRadius: scrolled ? 34 : 28, borderBottomRightRadius: scrolled ? 34 : 28, minHeight: scrolled ? 68 : 86, backgroundColor: scrolled ? "rgba(247,242,232,.76)" : "rgba(247,242,232,.96)", boxShadow: scrolled ? "0 20px 60px rgba(53,39,30,.14)" : "0 12px 36px rgba(53,39,30,.07)" }}
        transition={{ duration: 0.42, ease }}
        style={{ backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)" }}
        className="co-glass-header fixed left-1/2 top-0 z-[110] flex min-h-[72px] w-full -translate-x-1/2 items-center rounded-b-[28px] border border-[rgba(53,39,30,.07)] bg-[rgba(247,242,232,.96)] px-5 shadow-[0_12px_36px_rgba(53,39,30,.07)] md:min-h-[86px] md:px-8"
      >
        <div className="relative mx-auto flex w-full max-w-[1500px] items-center justify-between gap-5">
          <Link href="/" className="relative ml-10 block h-[52px] w-[86px] md:ml-0 md:h-[58px] md:w-[88px]" aria-label=".CO home">
            <Image src="/images/logo.svg" alt=".CO The Coconut Company" fill priority sizes="88px" className="object-contain object-left" />
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-[clamp(20px,2vw,38px)] whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.04em] text-[#17130f] lg:flex" aria-label="Primary navigation">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-[#305a34] after:transition-transform hover:text-[#305a34] hover:after:scale-x-100">
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 text-[#17130f] md:gap-1.5">
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
              {links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-[#35271e]/8 px-4 py-3 text-xs font-semibold uppercase tracking-[.08em] last:border-0"
                >
                  {label}
                </Link>
              ))}
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

const trustBadgeIcons = { leaf: Leaf, drop: Milk, cold: Sparkles, palm: Leaf } as const;

function HeroSection({ homepage }: { homepage: HomepageContent }) {
  const headline = homepage.heroHeadline.length ? homepage.heroHeadline : ["From our palms", "to your life."];
  const lastLine = headline.at(-1) ?? "to your life.";
  const lastWord = lastLine.trim().split(/\s+/).at(-1) ?? "life.";
  const lastPrefix = lastLine.slice(0, Math.max(0, lastLine.length - lastWord.length));
  return (
    <section className="relative isolate min-h-[445px] overflow-hidden bg-[#f7f2e8] md:min-h-[720px]">
      <Image
        src="/assets/about/co-about-hero-editorial-4k.avif"
        alt=".CO Coconut Water and Melt.CO mango coconut ice cream on travertine with fresh coconuts"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={90}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className="object-cover object-[66%_center] md:hidden"
      />
      <Image
        src="/assets/hero/co-home-hero-solid-products.avif"
        alt=".CO Coconut Water and Melt.CO mango coconut ice cream on travertine with fresh coconuts"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={90}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className="hidden object-cover object-center md:block"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,242,232,.98)_0%,rgba(247,242,232,.86)_44%,rgba(247,242,232,.08)_76%)] md:bg-[linear-gradient(90deg,rgba(247,242,232,.97)_0%,rgba(247,242,232,.82)_38%,rgba(247,242,232,.03)_72%)]" />

      <div className="relative mx-auto grid min-h-[445px] max-w-[1500px] grid-cols-1 px-5 pb-8 pt-8 md:min-h-[720px] md:grid-cols-[.95fr_1.05fr] md:px-[clamp(44px,6vw,90px)] md:pb-24 md:pt-16">
        <div className="relative z-20 max-w-[620px]">
          <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35271e]">
            <span className="md:hidden">Rooted in nature</span>
            <span className="hidden md:inline">{homepage.heroEyebrow}</span>
          </motion.p>
          <motion.h1 initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.08, ease }} className="mt-3 max-w-[10ch] font-['Cormorant_Garamond'] text-[39px] font-normal leading-[.92] tracking-[-.035em] text-[#16120e] md:mt-4 md:max-w-[12ch] md:text-[clamp(48px,5.1vw,82px)] md:leading-[.88] md:tracking-[-.04em]">
            <span className="md:hidden">Good for you.<br />Good for the <em className="font-normal text-[#305a34]">planet.</em></span>
            <span className="hidden md:inline">{headline.slice(0, -1).map((line) => <span key={line}>{line}<br /></span>)}{lastPrefix}<em className="font-normal text-[#305a34]">{lastWord}</em></span>
          </motion.h1>
          <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.18, ease }} className="mt-5 max-w-[185px] text-[12px] leading-5 text-[#27211c] md:mt-6 md:max-w-[350px] md:text-[17px] md:leading-7">
            <span className="md:hidden">Premium coconut products, crafted with care for a healthier you and a better planet.</span>
            <span className="hidden md:inline">{homepage.heroSubheadline}</span>
          </motion.p>
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.26, ease }}>
            <Link href={homepage.heroCtaLink} className="co-primary-cta mt-5 inline-flex min-h-11 items-center gap-4 rounded-full bg-[#304f2c] px-5 text-[9px] font-semibold uppercase text-white shadow-[0_15px_35px_rgba(48,79,44,.24)] md:mt-7 md:min-h-14 md:gap-6 md:px-7 md:text-[11px]">
              {homepage.heroCtaText}
              <span className="grid size-8 place-items-center rounded-full bg-[#efe8db] text-[#304f2c] md:size-9">
                <ArrowRight size={18} />
              </span>
            </Link>
          </motion.div>
          <Link href={homepage.secondaryCtaLink} className="mt-4 inline-flex items-center gap-2 border-b border-[#35271e] pb-1 text-[10px] font-semibold uppercase md:hidden">
            <PlayCircle size={17} /> {homepage.secondaryCtaText}
          </Link>

          <div className="mt-9 hidden grid-cols-3 gap-5 md:grid">
            {homepage.trustBadges.slice(0, 3).map(({ icon, title, body: subtitle }) => {
              const FeatureIcon = trustBadgeIcons[icon];
              return (
                <div key={title} className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#35271e]/12">
                    <FeatureIcon size={17} strokeWidth={1.5} />
                  </span>
                  <span>
                    <span className="block text-[11px] font-semibold">{title}</span>
                    <span className="mt-1 block text-[10px] text-[#5f554b]">{subtitle}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

function CategoryRail({ products }: { products: DisplayProduct[] }) {
  return (
    <section className="relative z-30 px-3 pb-4 md:-mt-14 md:px-8 md:pb-0">
      <div className="mx-auto grid max-w-[1320px] grid-cols-3 items-stretch rounded-[22px] border border-white/70 bg-[rgba(255,255,255,.63)] px-2 py-3 shadow-[0_22px_60px_rgba(53,39,30,.1),inset_0_1px_0_rgba(255,255,255,.85)] backdrop-blur-[22px] md:flex md:min-h-[118px] md:rounded-[28px] md:px-6 md:py-4">
        {categoryItems.map(({ label, icon: Icon, href }) => (
          <Link key={label} href={href} className="flex min-h-[92px] flex-1 flex-col items-center justify-center gap-3 border-[#35271e]/10 px-2 text-center max-md:border-b max-md:border-r max-md:[&:nth-child(3n)]:border-r-0 max-md:[&:nth-last-child(-n+3)]:border-b-0 md:min-w-0 md:border-r md:px-3 md:last:border-r-0">
            <Icon size={23} strokeWidth={1.35} />
            <span className="text-[9px] font-semibold uppercase leading-4 md:text-[10px]">{label}</span>
          </Link>
        ))}
        <div className="hidden shrink-0 items-center pl-5 md:flex">
          <MoreProductsDialog products={products} />
        </div>
      </div>
    </section>
  );
}

function MobileHeroBenefits() {
  const items = [
    [Leaf, "100% Natural", "No additives"],
    [Recycle, "Sustainably Sourced", "From trusted farms"],
    [Sparkles, "Made for Living", "Better for you"]
  ] as const;

  return (
    <section className="grid grid-cols-3 gap-2 bg-[#faf7f0] px-4 py-5 md:hidden">
      {items.map(([Icon, title, detail]) => (
        <div key={title} className="text-center">
          <span className="mx-auto grid size-10 place-items-center rounded-full bg-[#f0ede5]"><Icon size={19} strokeWidth={1.4} /></span>
          <p className="mt-3 text-[10px] font-semibold leading-4">{title}</p>
          <p className="mt-1 text-[9px] leading-4 text-[#6a6158]">{detail}</p>
        </div>
      ))}
    </section>
  );
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
            <h2 className="font-['Cormorant_Garamond'] text-[30px] leading-[.98] tracking-[-.025em] md:text-[46px]">
              Good for you,
              <br />
              good for the planet.
            </h2>
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

        <div className="mt-8 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4 md:gap-4">
          {bentoCards.map((card, index) => (
            <motion.article
              key={card.title}
              whileHover={index === 3 ? { scale: 1.015, filter: "brightness(1.035)" } : { y: -5 }}
              transition={{ duration: 0.4, ease }}
              className={cn(
                "group relative min-h-[220px] overflow-hidden rounded-[20px] border border-[#35271e]/8 transition-shadow duration-500 md:min-h-[350px] md:rounded-[28px]",
                card.tone === "dark" ? "bg-[#24421f] text-white hover:shadow-[0_24px_55px_rgba(24,53,21,.24)]" : "bg-[#f2eee5] text-[#35271e]"
              )}
            >
              <Image src={card.image} alt="" fill sizes="(min-width: 768px) 24vw, 48vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className={cn("object-cover object-center transition-transform duration-700", card.tone === "dark" ? "group-hover:scale-[1.025]" : "group-hover:scale-[1.035]")} />
              <div className={cn("absolute inset-0", card.tone === "dark" ? "bg-[linear-gradient(180deg,rgba(14,38,13,.82)_0%,rgba(20,42,18,.42)_46%,rgba(20,42,18,.12)_100%)]" : "bg-[linear-gradient(180deg,rgba(247,242,232,.96)_0%,rgba(247,242,232,.82)_38%,rgba(247,242,232,.04)_72%)]")} />
              <div className="relative z-10 flex h-full min-h-[220px] flex-col p-4 md:min-h-[350px] md:p-7">
                <h3 className="max-w-[170px] font-['Cormorant_Garamond'] text-[23px] leading-[.95] md:text-[31px]">{card.title}</h3>
                <p className={cn("mt-5 max-w-[150px] text-xs leading-6", card.tone === "dark" ? "text-white/78" : "text-[#5e554d]")}>{card.body}</p>
                <Link href={index === 3 ? "/recipes" : index === 2 ? "/sustainability" : "/about"} aria-label={`Explore ${card.title}`} className={cn("mt-auto grid size-10 place-items-center rounded-full border", card.tone === "dark" ? "border-white/35 text-white" : "border-[#35271e]/16 bg-white/55")}>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.article>
          ))}
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
  const cards = recipes.length ? recipes.slice(0, 5).map((recipe) => ({
    slug: recipe.slug,
    title: recipe.title,
    category: recipe.category,
    time: recipe.time,
    image: recipe.image
  })) : recipeCards.map((recipe, index) => ({ ...recipe, slug: `recipe-${index}` }));
  return (
    <section className="px-4 pb-9 md:px-8 md:pb-12">
      <div className="mx-auto max-w-[1320px] rounded-[30px] bg-white/48 p-4 shadow-[0_18px_55px_rgba(53,39,30,.045)] md:grid md:grid-cols-[300px_1fr] md:gap-5 md:p-6">
        <div className="flex flex-col justify-center px-1 py-3 md:px-2">
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#305a34]">Recipes we love</p>
          <h2 className="mt-3 font-['Cormorant_Garamond'] text-[30px] leading-[.95] tracking-[-.025em] md:text-[42px]"><span className="whitespace-nowrap">Delicious. Easy.</span><br /><span className="whitespace-nowrap">Made with .CO</span></h2>
          <p className="mt-4 max-w-[250px] text-xs leading-6 text-[#5f564d]">Explore wholesome recipes made with real ingredients.</p>
          <Link href="/recipes" className="mt-5 inline-flex w-fit items-center gap-3 border-b border-[#305a34] pb-1 text-[10px] font-semibold uppercase text-[#305a34]">Explore recipes <ArrowRight size={14} /></Link>
        </div>
        <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] md:mt-0 md:grid md:grid-cols-5 md:overflow-visible [&::-webkit-scrollbar]:hidden">
          {cards.map((recipe) => (
            <motion.article key={recipe.title} whileHover={{ y: -5 }} transition={{ duration: 0.35, ease }} className="group min-w-[72%] snap-start overflow-hidden rounded-[19px] border border-[#35271e]/8 bg-white/60 sm:min-w-[43%] md:min-w-0">
              <Link href={`/recipes/${recipe.slug}`} className="relative block aspect-[4/3] overflow-hidden md:aspect-[4/4.35]">
                <Image src={recipe.image} alt={recipe.title} fill sizes="(min-width: 768px) 190px, 72vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-cover transition duration-700 group-hover:scale-[1.04] group-hover:brightness-[1.03]" />
                <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/70 backdrop-blur-md"><Heart size={14} strokeWidth={1.5} /></span>
              </Link>
              <div className="p-3">
                <p className="text-[8px] font-medium uppercase tracking-[.09em] text-[#71675f]">{recipe.category} · {recipe.time}</p>
                <h3 className="mt-2 text-[11px] font-medium leading-[1.45] md:text-xs">{recipe.title}</h3>
              </div>
            </motion.article>
          ))}
        </div>
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
  const displayTestimonials = testimonials.length ? testimonials.slice(0, 3).map((item) => ({
    quote: item.quote,
    name: item.name,
    initials: item.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    role: item.role
  })) : fallbackDisplayTestimonials.map((item) => ({ ...item, role: "Verified Buyer" }));
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return undefined;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % displayTestimonials.length), 7000);
    return () => window.clearInterval(timer);
  }, [paused, displayTestimonials.length]);

  return (
    <section className="px-4 pb-9 md:px-8 md:pb-12" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto max-w-[1320px] rounded-[30px] bg-white/48 p-5 shadow-[0_18px_55px_rgba(53,39,30,.045)] md:grid md:grid-cols-[300px_1fr] md:gap-6 md:p-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#305a34]">What our customers say</p>
          <h2 className="mt-3 font-['Cormorant_Garamond'] text-[31px] leading-[.98] tracking-[-.025em] md:text-[46px]">Loved by 1000+ happy<br className="hidden md:block" /> coconut lovers.</h2>
        </div>
        <div className="mt-6 md:mt-0">
          <div className="hidden gap-4 md:grid md:grid-cols-3">
            {displayTestimonials.map((testimonial, index) => <TestimonialCard key={testimonial.name} testimonial={testimonial} highlighted={active === index} />)}
          </div>
          <div className="md:hidden">
            <motion.div key={active} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease }}>
              <TestimonialCard testimonial={displayTestimonials[active]} highlighted />
            </motion.div>
            <div className="mt-2 flex justify-center gap-0">{displayTestimonials.map((item, index) => <button type="button" aria-label={`Show testimonial from ${item.name}`} key={item.name} onClick={() => setActive(index)} className="grid size-8 place-items-center rounded-full"><span className={cn("size-2 rounded-full", active === index ? "bg-[#305a34]" : "bg-[#35271e]/20")} /></button>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, highlighted }: { testimonial: { quote: string; name: string; initials: string; role: string }; highlighted: boolean }) {
  return (
    <motion.article animate={{ y: highlighted ? -2 : 0 }} className={cn("rounded-[22px] border border-white/75 bg-white/45 p-5 shadow-[0_14px_38px_rgba(53,39,30,.06)] backdrop-blur-lg transition-shadow", highlighted && "shadow-[0_20px_48px_rgba(53,39,30,.1)]")}>
      <div className="text-[14px] tracking-[.1em] text-[#e0a51d]" aria-label="Five stars">★★★★★</div>
      <blockquote className="mt-4 text-sm leading-7">“{testimonial.quote}”</blockquote>
      <div className="mt-5 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-[linear-gradient(145deg,#d9c6a7,#f4ecdf)] text-[10px] font-semibold text-[#305a34]" aria-hidden="true">{testimonial.initials}</span>
        <span><span className="block text-xs font-semibold">{testimonial.name}</span><span className="mt-1 block text-[9px] text-[#72685e]">{testimonial.role}</span></span>
      </div>
    </motion.article>
  );
}

function Counter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || !numberRef.current) return undefined;
    if (prefersReducedMotion()) {
      numberRef.current.textContent = String(target);
      return undefined;
    }
    const { gsap, ScrollTrigger } = getScrollTrigger();
    const state = { value: 0 };
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 60%",
      once: true,
      onEnter: () => {
        gsap.to(state, {
          value: target,
          duration: 2.25,
          ease: "expo.out",
          onUpdate: () => {
            if (numberRef.current) numberRef.current.textContent = String(Math.round(state.value));
          }
        });
      }
    });
    return () => {
      trigger.kill();
    };
  }, [target]);

  return (
    <div ref={ref}>
      <p className="font-['Space_Grotesk'] text-[36px] font-medium leading-none md:text-[48px]"><span ref={numberRef}>0</span>{suffix}</p>
      <p className="mt-2 max-w-[100px] text-[11px] leading-4 text-white/82 md:text-xs md:leading-5">{label}</p>
    </div>
  );
}

function SustainabilityBanner() {
  return (
    <section className="px-4 pb-8 md:px-8 md:pb-12">
      <div className="relative mx-auto min-h-[360px] max-w-[1320px] overflow-hidden rounded-[30px] bg-[#1c3518] text-white shadow-[0_22px_55px_rgba(30,50,24,.18)] md:min-h-[230px] md:rounded-[34px]">
        <Image src="/assets/backgrounds/kerala-groves/co-kerala-grove-editorial-4k.avif" alt="Kerala coconut groves" fill sizes="100vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(19,37,16,.88),rgba(19,37,16,.3)_52%,rgba(19,37,16,.72))]" />
        <div className="relative z-10 grid min-h-[360px] gap-8 p-7 md:min-h-[230px] md:grid-cols-[1fr_1.05fr] md:items-center md:p-10">
          <div>
            <h2 className="max-w-[500px] font-['Cormorant_Garamond'] text-[38px] leading-[.95] md:text-[48px]">
              Be part of the change.
              <br />
              Choose better. Live better.
            </h2>
            <Link href="/sustainability" className="mt-6 inline-flex min-h-12 items-center gap-5 rounded-full bg-[#f7f2e8] px-6 text-[10px] font-semibold uppercase text-[#35271e]">
              Our sustainability <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <Counter target={50} suffix="+" label="Partner Farms" />
            <Counter target={100} suffix="%" label="Sustainable Packaging" />
            <Counter target={1} suffix="M+" label="Coconuts Saved" />
          </div>
        </div>
      </div>
    </section>
  );
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
          <div className="absolute bottom-0 left-[15%] h-[120px] w-[230px] md:h-[165px] md:w-[315px]">
            <Image src="/assets/transparent/co-tender-coconut.png" alt="Fresh coconut and palm leaves" fill sizes="315px" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-contain drop-shadow-[0_18px_24px_rgba(53,39,30,.13)]" />
          </div>
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
        <div className="absolute bottom-[-24px] right-[-12px] h-[180px] w-[52%]"><Image src="/assets/transparent/co-tender-coconut.png" alt="Coconut" fill sizes="52vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-contain" /></div>
      </section>

      <section>
        <h2 className="font-['Cormorant_Garamond'] text-[31px]">Join the .CO Community</h2><p className="mt-2 text-xs leading-5">Share your moments with #COCoconut and get featured.</p>
        <div className="mt-4 grid grid-cols-4 gap-2">{[publicAssets.water.lifestyle, publicAssets.campaign.breakfastRitual, publicAssets.recipes.seasonalBowl, publicAssets.brand.tenderCoconut].map((image, index) => <div key={image} className="relative aspect-square overflow-hidden rounded-[14px]"><Image src={image} alt={`.CO community moment ${index + 1}`} fill sizes="24vw" quality={90} placeholder="blur" blurDataURL={blurDataURL} className="object-cover" /></div>)}</div>
        <a href="https://www.instagram.com/cothecoconutcompany" target="_blank" rel="noreferrer" className="co-primary-cta mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#304f2c] px-5 text-[9px] font-semibold uppercase text-white">Follow us @cococonutcompany <Instagram size={14} /></a>
      </section>

      <div className="flex justify-end"><MoreProductsDialog products={products} /></div>
    </div>
  );
}

export function NewsletterSection() {
  return (
    <section className="px-4 pb-4 md:px-8 md:pb-6">
      <div className="relative mx-auto grid max-w-[1400px] overflow-hidden rounded-[28px] bg-[linear-gradient(115deg,#0f3418,#204b23_58%,#102d16)] px-6 py-8 text-white shadow-[0_20px_55px_rgba(19,55,26,.18)] md:grid-cols-[330px_1fr_290px] md:items-center md:px-10">
        <div className="relative z-10"><h2 className="font-['Cormorant_Garamond'] text-[32px] leading-none md:text-[36px]">Stay in the loop</h2><p className="mt-2 text-[10px] leading-5 text-white/68">Get updates on new products, recipes &amp; offers.</p></div>
        <NewsletterForm className="relative z-10 mt-5 md:mt-0" />
        <div className="absolute bottom-[-36px] right-[-28px] h-[190px] w-[230px] md:relative md:bottom-auto md:right-auto md:h-[120px] md:w-auto"><Image src="/assets/transparent/co-tender-coconut.png" alt="Fresh coconut and palm leaves" fill sizes="290px" quality={95} className="object-contain" /></div>
      </div>
    </section>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const items = [[Leaf, "Home", "/"], [ShoppingBag, "Shop", "/shop"], [Grid2X2, "Recipes", "/recipes"], [Heart, "Wishlist", "/wishlist"], [CircleUserRound, "Account", "/account"]] as const;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-[105] grid grid-cols-5 border-t border-[#35271e]/10 bg-[rgba(250,247,240,.94)] px-2 pb-[max(6px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden" aria-label="Mobile quick navigation">
      {items.map(([Icon, label, href]) => <Link key={label} href={href} className={cn("flex flex-col items-center gap-1 text-[8px]", (pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))) && "text-[#305a34]")}><Icon size={17} strokeWidth={1.6} /><span>{label}</span></Link>)}
    </nav>
  );
}

export function ReferenceFooter() {
  const columns = [
    { title: "Shop", links: ["All Products", "Coconut Water", "Ice Cream", "Food", "Cosmetics", "Utensils"] },
    { title: "Company", links: ["About Us", "Sustainability", "Our Farmers", "Careers", "Contact Us"] },
    { title: "Help", links: ["FAQs", "Shipping & Delivery", "Returns", "Terms & Conditions", "Privacy Policy"] }
  ];

  return (
    <footer className="bg-[#f7f2e8] px-6 pb-10 pt-6 text-[#35271e] md:px-10 md:pb-12">
      <div className="mx-auto grid max-w-[1320px] gap-10 md:grid-cols-[1.05fr_1.7fr_1fr]">
        <div>
          <span className="relative block h-[70px] w-[110px]">
            <Image src="/images/logo.svg" alt=".CO The Coconut Company" fill sizes="110px" className="object-contain object-left" />
          </span>
          <p className="mt-2 font-['Cormorant_Garamond'] text-2xl">Made for living.</p>
          <p className="mt-6 text-[11px] leading-5 text-[#685e54]">© 2026 .CO The Coconut Company.<br />All rights reserved.</p>
        </div>
        <div className="space-y-1 border-t border-[#35271e]/8 pt-4 md:hidden">
          {columns.map((column) => (
            <details key={column.title} className="group border-b border-[#35271e]/8 py-1">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-[10px] font-semibold uppercase">{column.title}<span className="text-lg font-normal transition group-open:rotate-45">+</span></summary>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 pb-4">
                {column.links.map((label) => <Link key={label} href={footerLink(label)} className="flex min-h-11 items-center text-[11px] text-[#655b52]">{label}</Link>)}
              </div>
            </details>
          ))}
        </div>
        <div className="hidden grid-cols-3 gap-4 md:grid md:gap-6">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[10px] font-semibold uppercase">{column.title}</p>
              <div className="mt-4 space-y-2.5">
                {column.links.map((label) => (
                  <Link key={label} href={footerLink(label)} className="block text-[11px] text-[#655b52] transition hover:text-[#305a34]">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[#35271e]/8 pt-6 md:border-t-0 md:pt-0">
          <p className="text-[10px] font-semibold uppercase">Stay connected</p>
          <p className="mt-4 text-[11px] leading-5 text-[#655b52]">Get updates on new products, recipes & more.</p>
          <NewsletterForm compact className="mt-5" />
          <CookiePreferencesButton className="mt-3 min-h-11 text-[10px] font-semibold underline underline-offset-4 text-[#655b52] transition hover:text-[#305a34]" />
          <div className="mt-5 flex gap-2">
            <a href="https://www.instagram.com/cothecoconutcompany" target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-9 place-items-center rounded-full border border-[#35271e]/12">
              <Instagram size={15} />
            </a>
            <a href="https://www.linkedin.com/company/dotcolife" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid size-9 place-items-center rounded-full border border-[#35271e]/12 font-['Space_Grotesk'] text-xs font-semibold">
              in
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="grid size-9 place-items-center rounded-full border border-[#35271e]/12"><Facebook size={14} /></a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="grid size-9 place-items-center rounded-full border border-[#35271e]/12"><Youtube size={14} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function footerLink(label: string) {
  const routes: Record<string, string> = {
    "All Products": "/shop", "Coconut Water": "/shop?category=Coconut%20Water", "Ice Cream": "/shop?category=Ice%20Cream", Food: "/shop?category=Food", Cosmetics: "/shop?category=Cosmetics", Utensils: "/shop?category=Utensils",
    "About Us": "/about", Sustainability: "/sustainability", "Our Farmers": "/sustainability#journey", Careers: "/careers", "Contact Us": "/contact",
    FAQs: "/faqs", "Shipping & Delivery": "/shipping-delivery", Returns: "/returns", "Terms & Conditions": "/terms-and-conditions", "Privacy Policy": "/privacy-policy"
  };
  return routes[label] || "/";
}

export function ReferenceHomePage({ homepage, products, recipes, testimonials }: { homepage: HomepageContent; products: ContentProduct[]; recipes: ContentRecipe[]; testimonials: ContentTestimonial[] }) {
  const displayProducts = useMemo(() => toDisplayProducts(products), [products]);
  const popupProducts = useMemo(() => toPopupProducts(displayProducts), [displayProducts]);

  return (
    <div className="co-reference-home min-h-screen overflow-hidden bg-[#f7f2e8] font-['Inter'] text-[#35271e]">
      <ReferenceHeader />
      <div>
        <HeroSection homepage={homepage} />
        <MobileHeroBenefits />
        <CategoryRail products={popupProducts} />
        <DeliveryMarquee />
        <PlanetBentoSection products={popupProducts} />
        <ProductsSection products={displayProducts} />
        <RecipesSnapshot recipes={recipes} />
        <TestimonialsSection testimonials={testimonials} />
        <SustainabilityBanner />
        <FAQSection />
        <MobileReferenceExtras products={displayProducts} />
        <NewsletterSection />
      </div>
      <ReferenceFooter />
      <MobileBottomNav />
    </div>
  );
}
