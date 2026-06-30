"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CircleUserRound,
  CookingPot,
  Grid2X2,
  IceCreamBowl,
  Instagram,
  Milk,
  Leaf,
  Menu,
  Plus,
  Recycle,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { CartButton } from "@/components/cart/CartDrawer";
import { useCustomerSession } from "@/components/auth/CustomerAuthProvider";
import { useCart } from "@/lib/cart/cart-context";
import { getScrollTrigger, prefersReducedMotion } from "@/lib/animation/gsap-scrolltrigger";
import type { ContentProduct, HomepageContent } from "@/lib/content/types";
import { publicAssets } from "@/lib/public-assets";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

type DisplayProduct = {
  slug: string;
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
  { label: "Utensils", icon: Utensils, href: "/shop?product=co-lifestyle" }
];

const productPresentation: Record<string, Partial<DisplayProduct>> = {
  "co-water": {
    name: ".CO Water",
    shortName: ".CO Water 330ml",
    subtitle: "100% Organic Coconut Water",
    detail: "Clean tender coconut water with a calm, refreshing finish.",
    image: "/assets/transparent/co-water-bottle.png",
    price: "₹120.00"
  },
  "melt-co-mango-coconut": {
    name: "Melt.CO",
    shortName: "Mango + Coconut 350ml",
    subtitle: "Coconut Ice Cream",
    detail: "Creamy coconut ice cream with real fruit. Pure indulgence in every spoon.",
    image: "/assets/transparent/co-coconut-icecream.png",
    price: "₹220.00"
  },
  "co-kitchen-coconut-oil": {
    name: ".CO Foods",
    shortName: ".CO Coconut Oil",
    subtitle: "Cold-pressed Coconut Oil",
    detail: "A versatile coconut pantry staple for everyday cooking and mindful rituals.",
    image: "/assets/Ecosystem_Assets/coconut oil individual product-2.png",
    price: "₹160.00"
  },
  "co-botanica-coconut-care": {
    name: ".CO Botanica",
    shortName: "Botanica Face Wash",
    subtitle: "Coconut Face Wash",
    detail: "A gentle, refreshing coconut care ritual made for everyday cleansing.",
    image: "/assets/Ecosystem_Assets/Botanica-Face Wash.png",
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

function ReferenceHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const session = useCustomerSession();

  useEffect(() => {
    if (!headerRef.current || prefersReducedMotion()) {
      return undefined;
    }

    const { gsap, ScrollTrigger } = getScrollTrigger();
    const context = gsap.context(() => {
      gsap.to(headerRef.current, {
        width: "min(1120px, calc(100% - 28px))",
        minHeight: 66,
        top: 12,
        borderRadius: 34,
        backgroundColor: "rgba(247,242,232,.88)",
        boxShadow: "0 18px 55px rgba(53,39,30,.13)",
        backdropFilter: "blur(22px)",
        ease: "power3.out",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top -80",
          end: "top -220",
          scrub: 0.55
        }
      });
    }, headerRef);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, []);

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
      <header
        ref={headerRef}
        className="fixed left-1/2 top-0 z-[110] flex min-h-[72px] w-full -translate-x-1/2 items-center rounded-b-[28px] border border-[rgba(53,39,30,.07)] bg-[rgba(247,242,232,.96)] px-5 shadow-[0_12px_36px_rgba(53,39,30,.07)] md:min-h-[86px] md:px-8"
      >
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-5">
          <Link href="/" className="relative block h-[48px] w-[72px] md:h-[58px] md:w-[88px]" aria-label=".CO home">
            <Image src="/images/logo.svg" alt=".CO The Coconut Company" fill priority sizes="88px" className="object-contain object-left" />
          </Link>

          <nav className="hidden items-center gap-[clamp(22px,2.2vw,42px)] text-[11px] font-medium uppercase tracking-[0.04em] text-[#17130f] lg:flex" aria-label="Primary navigation">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="transition-colors hover:text-[#305a34]">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 text-[#17130f]">
            <Link href="/shop" aria-label="Search products" className="grid size-10 place-items-center rounded-full transition hover:bg-white/70">
              <Search size={19} strokeWidth={1.7} />
            </Link>
            <Link href={session ? "/account" : "/login"} aria-label={session ? "My account" : "Sign in"} className="hidden size-10 place-items-center rounded-full transition hover:bg-white/70 sm:grid">
              <CircleUserRound size={19} strokeWidth={1.6} />
            </Link>
            <CartButton showZero className="!size-10 !rounded-full !border-0 !bg-transparent !shadow-none hover:!bg-white/70" />
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              className="grid size-10 place-items-center rounded-full lg:hidden"
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
              className="absolute left-3 right-3 top-[calc(100%+8px)] rounded-[26px] border border-white/70 bg-[rgba(247,242,232,.96)] p-3 shadow-[0_24px_65px_rgba(53,39,30,.16)] backdrop-blur-[22px] lg:hidden"
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
              <Link href={session ? "/account" : "/login"} onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-xs font-semibold uppercase tracking-[.08em] text-[#305a34]">
                {session ? "My account" : "Sign in"}
              </Link>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>
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
      top: Math.min(rect.bottom + 18, window.innerHeight - 590),
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
          type="button"
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
            <Dialog.Content asChild onEscapeKeyDown={close} onPointerDownOutside={close}>
              <motion.div
                ref={contentRef}
                layoutId="more-products-cloud"
                className="fixed z-[150] overflow-y-auto border border-white/65 bg-[rgba(247,242,232,.72)] text-[#35271e] shadow-[0_28px_90px_rgba(25,20,16,.24)] backdrop-blur-[26px]"
                style={
                  isMobile
                    ? { inset: "78px 12px 12px", borderRadius: 28 }
                    : { top: desktopPosition.top, left: desktopPosition.left, width: "min(820px, calc(100vw - 48px))", maxHeight: "calc(100vh - 80px)", borderRadius: 36 }
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
                            <Image src={selected.image} alt={selected.name} fill sizes="calc(100vw - 72px)" className="object-contain p-5" />
                          </div>
                          <h3 className="mt-5 font-['Cormorant_Garamond'] text-[34px] leading-none">{selected.name}</h3>
                          <p className="mt-3 text-sm font-medium">{selected.subtitle}</p>
                          <p className="mt-3 text-sm leading-6 text-[#625950]">{selected.detail}</p>
                          <p className="mt-5 font-['Space_Grotesk'] text-lg font-semibold">{selected.price}</p>
                          <Link href={`/shop/${selected.slug}`} className="mt-5 flex min-h-12 items-center justify-between rounded-full bg-[#304f2c] px-5 text-xs font-semibold uppercase text-white">
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
                                  <Image src={product.image} alt="" fill sizes="86px" className="object-contain p-1" />
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
                                <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 170px, 110px" className="object-contain p-1 md:p-3" />
                              </button>
                              <div className="md:mt-3">
                                <button type="button" onClick={() => isMobile && setSelected(product)} className="text-left font-['Cormorant_Garamond'] text-[25px] leading-none md:text-[22px]">
                                  {product.name}
                                </button>
                                <p className="mt-2 text-xs leading-5 text-[#625950]">{product.subtitle}</p>
                                <Link href={`/shop/${product.slug}`} className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase">
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
  );
}

function HeroSection() {
  return (
    <section className="relative isolate min-h-[610px] overflow-hidden bg-[#f7f2e8] md:min-h-[720px]">
      <Image
        src="/assets/hero/co-home-hero-background-v2.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center] md:object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,242,232,.96)_0%,rgba(247,242,232,.8)_38%,rgba(247,242,232,.05)_72%)] md:bg-[linear-gradient(90deg,rgba(247,242,232,.97)_0%,rgba(247,242,232,.82)_38%,rgba(247,242,232,.03)_72%)]" />

      <div className="relative mx-auto grid min-h-[610px] max-w-[1500px] grid-cols-1 px-7 pb-20 pt-10 md:min-h-[720px] md:grid-cols-[.95fr_1.05fr] md:px-[clamp(44px,6vw,90px)] md:pb-24 md:pt-16">
        <div className="relative z-20 max-w-[620px]">
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#35271e]">
            Pure by nature. Made for living.
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.08, ease }} className="mt-4 max-w-[12ch] font-['Cormorant_Garamond'] text-[clamp(48px,5.1vw,82px)] font-normal leading-[.88] tracking-[-.04em] text-[#16120e]">
            From our palms
            <br />
            to your <em className="font-normal text-[#305a34]">life.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.18, ease }} className="mt-6 max-w-[350px] text-[15px] leading-7 text-[#27211c] md:text-[17px]">
            We craft premium coconut products that nourish you and care for our planet.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.26, ease }}>
            <Link href="/shop" className="mt-7 inline-flex min-h-14 items-center gap-6 rounded-full bg-[#304f2c] px-7 text-[11px] font-semibold uppercase text-white shadow-[0_15px_35px_rgba(48,79,44,.24)]">
              Shop now
              <span className="grid size-9 place-items-center rounded-full bg-[#efe8db] text-[#304f2c]">
                <ArrowRight size={18} />
              </span>
            </Link>
          </motion.div>

          <div className="mt-9 hidden grid-cols-3 gap-5 md:grid">
            {[
              [Leaf, "100% Natural", "No additives"],
              [Recycle, "Sustainably Sourced", "From trusted farms"],
              [Sparkles, "Made for Living", "Better for you"]
            ].map(([Icon, title, subtitle]) => {
              const FeatureIcon = Icon as typeof Leaf;
              return (
                <div key={String(title)} className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#35271e]/12">
                    <FeatureIcon size={17} strokeWidth={1.5} />
                  </span>
                  <span>
                    <span className="block text-[11px] font-semibold">{String(title)}</span>
                    <span className="mt-1 block text-[10px] text-[#5f554b]">{String(subtitle)}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-8 top-[205px] z-10 md:inset-y-0 md:left-[43%] md:right-0">
          <motion.div initial={{ opacity: 0, y: 30, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1, delay: 0.16, ease }} className="absolute bottom-0 left-[36%] h-[74%] w-[36%] min-w-[142px] md:left-[21%] md:h-[73%] md:w-[31%]">
            <Image src="/assets/transparent/co-water-bottle.png" alt=".CO organic coconut water bottle" fill priority sizes="(min-width: 768px) 28vw, 36vw" className="object-contain drop-shadow-[0_30px_34px_rgba(53,39,30,.2)]" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 36, rotate: 1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1, delay: 0.26, ease }} className="absolute bottom-[1%] left-[58%] h-[58%] w-[40%] min-w-[148px] md:left-[48%] md:h-[55%] md:w-[36%]">
            <Image src="/assets/transparent/co-coconut-icecream.png" alt="Melt.CO coconut mango ice cream" fill priority sizes="(min-width: 768px) 32vw, 40vw" className="object-contain drop-shadow-[0_28px_34px_rgba(53,39,30,.18)]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CategoryRail({ products }: { products: DisplayProduct[] }) {
  return (
    <section className="relative z-30 -mt-9 px-4 md:-mt-14 md:px-8">
      <div className="mx-auto flex max-w-[1320px] items-stretch overflow-x-auto rounded-[28px] border border-white/70 bg-[rgba(255,255,255,.63)] px-2 py-3 shadow-[0_22px_60px_rgba(53,39,30,.1),inset_0_1px_0_rgba(255,255,255,.85)] backdrop-blur-[22px] [scrollbar-width:none] md:min-h-[138px] md:overflow-visible md:rounded-[36px] md:px-6 md:py-5 [&::-webkit-scrollbar]:hidden">
        {categoryItems.map(({ label, icon: Icon, href }) => (
          <Link key={label} href={href} className="flex min-w-[68px] flex-1 flex-col items-center justify-center gap-3 border-r border-[#35271e]/10 px-2 text-center last:border-r-0 md:min-w-0 md:px-3">
            <Icon size={25} strokeWidth={1.35} />
            <span className="text-[9px] font-semibold uppercase leading-4 md:text-[10px]">{label}</span>
          </Link>
        ))}
        <div className="hidden min-w-[260px] items-center justify-center md:flex">
          <MoreProductsDialog products={products} />
        </div>
      </div>
    </section>
  );
}

const bentoCards = [
  {
    title: "Naturally Hydrating",
    body: "Clean hydration straight from nature.",
    image: publicAssets.water.ingredients,
    tone: "light"
  },
  {
    title: "Made with Care",
    body: "Thoughtful ingredients, honest and pure.",
    image: publicAssets.water.flatLay,
    tone: "light"
  },
  {
    title: "Sustainably Yours",
    body: "Ethical sourcing for a better tomorrow.",
    image: publicAssets.brand.grove,
    tone: "light"
  },
  {
    title: "Recipes to Inspire",
    body: "Simple, delicious recipes for every moment.",
    image: publicAssets.recipes.bowl,
    tone: "dark"
  }
];

function PlanetBentoSection({ products }: { products: DisplayProduct[] }) {
  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-14 md:px-8 md:pb-12 md:pt-24">
      <div className="relative mx-auto max-w-[1320px]">
        <div className="grid gap-8 md:grid-cols-[.78fr_1.22fr] md:items-center">
          <div className="ml-auto max-w-[360px] pr-3 md:ml-0 md:pl-[8%]">
            <h2 className="font-['Cormorant_Garamond'] text-[38px] leading-[.98] tracking-[-.025em] md:text-[46px]">
              Good for you,
              <br />
              good for the planet.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#5e554d]">Every .CO product is a step towards a healthier you and a happier Earth.</p>
            <Link href="/sustainability" className="mt-6 inline-flex items-center gap-3 border-b border-[#305a34] pb-1 text-[11px] font-semibold uppercase text-[#305a34]">
              Our promise <ArrowRight size={15} />
            </Link>
          </div>
          <div className="flex justify-end md:hidden">
            <MoreProductsDialog products={products} />
          </div>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4 md:gap-4">
          {bentoCards.map((card, index) => (
            <motion.article
              key={card.title}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, ease }}
              className={cn(
                "group relative min-h-[255px] overflow-hidden rounded-[24px] border border-[#35271e]/8 md:min-h-[350px] md:rounded-[28px]",
                card.tone === "dark" ? "bg-[#24421f] text-white" : "bg-[#f2eee5] text-[#35271e]",
                index % 2 === 1 && "md:translate-y-4"
              )}
            >
              <Image src={card.image} alt="" fill sizes="(min-width: 768px) 24vw, 48vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]" />
              <div className={cn("absolute inset-0", card.tone === "dark" ? "bg-[linear-gradient(180deg,rgba(28,50,24,.36),rgba(20,42,18,.12)_48%,rgba(20,42,18,.18))]" : "bg-[linear-gradient(180deg,rgba(247,242,232,.96)_0%,rgba(247,242,232,.82)_38%,rgba(247,242,232,.04)_72%)]")} />
              <div className="relative z-10 flex h-full min-h-[255px] flex-col p-5 md:min-h-[350px] md:p-7">
                <h3 className="max-w-[170px] font-['Cormorant_Garamond'] text-[26px] leading-[.95] md:text-[31px]">{card.title}</h3>
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
            <h2 className="mt-3 font-['Cormorant_Garamond'] text-[36px] leading-[.95] tracking-[-.025em] md:text-[48px]">
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

        <div className="mt-7 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:grid-cols-4 md:overflow-visible [&::-webkit-scrollbar]:hidden">
          {products.map((product) => (
            <motion.article key={product.slug} whileHover={{ y: -5 }} transition={{ duration: 0.35, ease }} className="min-w-[47%] rounded-[22px] border border-[#35271e]/8 bg-[rgba(255,255,255,.62)] p-3 md:min-w-0 md:rounded-[26px] md:p-4">
              <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-[18px] bg-[#f8f4ec]">
                <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 280px, 46vw" className="object-contain p-3 md:p-5" />
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

function Counter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return undefined;
    const { gsap, ScrollTrigger } = getScrollTrigger();
    const animation = gsap.fromTo(ref.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
    const trigger = ScrollTrigger.create({ trigger: ref.current, start: "top 88%", once: true, animation });
    return () => {
      trigger.kill();
      animation.kill();
    };
  }, []);

  return (
    <div ref={ref}>
      <p className="font-['Space_Grotesk'] text-[36px] font-medium leading-none md:text-[48px]">{value}</p>
      <p className="mt-2 max-w-[100px] text-[11px] leading-4 text-white/82 md:text-xs md:leading-5">{label}</p>
    </div>
  );
}

function SustainabilityBanner() {
  return (
    <section className="px-4 pb-8 md:px-8 md:pb-12">
      <div className="relative mx-auto min-h-[360px] max-w-[1320px] overflow-hidden rounded-[30px] bg-[#1c3518] text-white shadow-[0_22px_55px_rgba(30,50,24,.18)] md:min-h-[230px] md:rounded-[34px]">
        <Image src={publicAssets.campaign.groveOrigin} alt="Kerala coconut groves" fill sizes="100vw" className="object-cover" />
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
            <Counter value="50+" label="Partner Farms" />
            <Counter value="100%" label="Sustainable Packaging" />
            <Counter value="1M+" label="Coconuts Saved" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ReferenceFooter() {
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
        <div className="grid gap-6 border-t border-[#35271e]/8 pt-6 sm:grid-cols-3 md:border-t-0 md:pt-0">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[10px] font-semibold uppercase">{column.title}</p>
              <div className="mt-4 space-y-2.5">
                {column.links.map((label) => (
                  <Link key={label} href={label === "Sustainability" ? "/sustainability" : label === "About Us" ? "/about" : "/shop"} className="block text-[11px] text-[#655b52] transition hover:text-[#305a34]">
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
          <div className="mt-5 flex min-h-12 items-center rounded-full border border-[#35271e]/12 bg-white/55 pl-5">
            <input type="email" aria-label="Email address" placeholder="Enter your email" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#766d64]" />
            <button type="button" aria-label="Subscribe" className="mr-1 grid size-10 place-items-center rounded-full bg-[#304f2c] text-white">
              <Send size={15} />
            </button>
          </div>
          <div className="mt-5 flex gap-2">
            <a href="https://www.instagram.com/cothecoconutcompany" target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-9 place-items-center rounded-full border border-[#35271e]/12">
              <Instagram size={15} />
            </a>
            <a href="https://www.linkedin.com/company/dotcolife" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid size-9 place-items-center rounded-full border border-[#35271e]/12 font-['Space_Grotesk'] text-xs font-semibold">
              in
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function ReferenceHomePage({ homepage, products }: { homepage: HomepageContent; products: ContentProduct[] }) {
  const displayProducts = useMemo(() => toDisplayProducts(products), [products]);

  return (
    <div className="co-reference-home min-h-screen overflow-hidden bg-[#f7f2e8] font-['Inter'] text-[#35271e]">
      <ReferenceHeader />
      <div>
        <HeroSection />
        <CategoryRail products={displayProducts} />
        <PlanetBentoSection products={displayProducts} />
        <ProductsSection products={displayProducts} />
        <SustainabilityBanner />
      </div>
      <ReferenceFooter />
      <span className="sr-only">{homepage.heroSubheadline}</span>
    </div>
  );
}
