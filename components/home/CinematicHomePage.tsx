"use client";

import { ResponsiveImage as Image } from "@/components/media/ResponsiveImage";
import { NewsletterForm } from "@/components/launch/NewsletterForm";
import { useCart } from "@/lib/cart/cart-context";
import { shopProducts } from "@/lib/catalog";
import type { ContentProduct, ContentRecipe, ContentTestimonial, HomepageContent } from "@/lib/content/types";
import { mediaUrl } from "@/lib/media";
import { transparentProductAssets } from "@/lib/website-assets";
import { ArrowLeft, ArrowRight, FileText, Leaf, MapPinned, Minus, PackageCheck, Pause, Play, Plus, Recycle, ShoppingBag, Sparkles, Sprout, Utensils } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, SyntheticEvent } from "react";
import styles from "./CinematicHomePage.module.css";
import corrections from "./CinematicHomeCorrections.module.css";

const assetRoot = "/assets/redesign/home/cinematic";

const environmentPlates = [
  "background-6.png",
  "background-2.png",
  "background-3.png",
  "background-4.png",
  "background-5.png",
  "background-1.png",
] as const;

const productOrder = [
  ["co-water", ".CO Coconut Water", "330ml"],
  ["co-kitchen-coconut-oil", "Virgin Coconut Oil", "500ml"],
  ["co-kitchen-coconut-flour", "Coconut Flour", "500g"],
  ["co-kitchen-coconut-milk", "Coconut Milk", "500ml"],
  ["co-botanica-shampoo", "Coconut Shampoo", "350ml"],
  ["melt-co-mango-coconut", "MELT Coconut + Mango Gelato", "350ml"],
] as const;

const routineProducts = [
  ["co-water", "Morning Hydrate", ".CO Coconut Water", "330ml"],
  ["co-kitchen-coconut-flour", "Breakfast Fuel", "Coconut Flour", "500g"],
  ["co-kitchen-coconut-milk", "Midday Balance", "Coconut Milk", "500ml"],
  ["co-botanica-shampoo", "Evening Unwind", "BOTANiCA Shampoo", "350ml"],
  ["co-kitchen-coconut-oil", "Night Restore", "Virgin Coconut Oil", "500ml"],
] as const;

const lifestyleMoments = [
  { src: `${assetRoot}/lifestyle/coconut-oil.png`, alt: ".CO virgin coconut oil at the dinner table" },
  { src: `${assetRoot}/lifestyle/face-wash.png`, alt: "BOTANiCA coconut face wash packed for a daily routine" },
  { src: `${assetRoot}/lifestyle/coconut-milk.png`, alt: ".CO coconut milk beside a freshly cooked meal" },
  { src: `${assetRoot}/lifestyle/hair-serum.png`, alt: "BOTANiCA coconut hair serum in a morning care ritual" },
  { src: `${assetRoot}/lifestyle/coconut-flour.png`, alt: ".CO coconut flour used for everyday baking" },
  { src: `${assetRoot}/lifestyle/moisturizer.png`, alt: "BOTANiCA body moisturizer in an evening wind-down" },
  { src: `${assetRoot}/lifestyle/melt-icecream.png`, alt: "MELT coconut mango gelato shared at home" },
  { src: `${assetRoot}/lifestyle/shampoo.png`, alt: "BOTANiCA coconut shampoo ready for a pool-day routine" },
] as const;

function formatPrice(value?: number) {
  return typeof value === "number" ? `₹${value.toLocaleString("en-IN")}` : "Preview";
}

function productAsset(slug: string, fallback: string) {
  const keyBySlug: Record<string, string> = {
    "co-water": "water",
    "co-kitchen-coconut-oil": "kitchen-oil",
    "co-kitchen-coconut-flour": "kitchen-flour",
    "co-kitchen-coconut-milk": "kitchen-milk",
    "co-botanica-shampoo": "botanica-shampoo",
    "melt-co-mango-coconut": "melt",
  };
  return transparentProductAssets[keyBySlug[slug]]?.src ?? fallback;
}

function SectionTransition() {
  return <span className="co-cinematic-section-transition" aria-hidden="true" />;
}

export function HomeEnvironmentCanvas() {
  return (
    <div className={styles.environment} aria-hidden="true">
      {environmentPlates.map((plate, index) => (
        <span
          key={plate}
          className={styles.environmentPlate}
          style={{ backgroundImage: `url('${assetRoot}/${plate}')`, top: `${index * 17}%` }}
        />
      ))}
      <span className={styles.environmentGrain} />
    </div>
  );
}

function Hero({ homepage, products }: { homepage: HomepageContent; products: ContentProduct[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const coconutY = useTransform(scrollYProgress, [0, 0.5, 1], ["0vh", "-8vh", "-18vh"]);
  const coconutScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.03, 1.06]);
  const featured = productOrder.map(([slug, name, size]) => {
    const current = products.find((item) => item.slug === slug) ?? shopProducts.find((item) => item.slug === slug);
    return { slug, name, size, price: current?.price, image: productAsset(slug, current?.image ?? "") };
  });

  return (
    <section ref={heroRef} className={`${styles.scene} ${styles.hero}`} data-home-section="hero">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>Made for living.</p>
        <h1 id="cinematic-home-title">Rooted in <em>nature.</em><br />Made for <em>living.</em></h1>
        <p>Honest coconut essentials crafted for a better you and a better planet.</p>
        <Link className={styles.primaryButton} href={homepage.heroCtaLink || "/shop"}>Explore Products <ArrowRight size={16} /></Link>
      </div>
      <motion.div className={corrections.heroMotion} style={reducedMotion ? undefined : { y: coconutY, scale: coconutScale }} aria-hidden="true">
        <div className={`${styles.heroVisual} ${corrections.heroVisual}`}>
          <span className={`${styles.orbit} ${corrections.orbit}`} />
          <Image src="/assets/home/co-hero-coconut-transparent-v1.webp" alt="" fill priority sizes="(min-width: 900px) 62vw, 110vw" className={`${styles.coconut} ${corrections.heroCoconut}`} />
          <span className={`${styles.coconutShadow} ${corrections.heroShadow}`} />
        </div>
      </motion.div>
      <div className={styles.benefits}>
        {[
          [Leaf, "Naturally coconut-led", "No shortcuts in spirit."],
          [Sparkles, "Made for real life", "Simple, honest, everyday."],
          [Utensils, "Thoughtfully made", "Care in every choice."],
        ].map(([Icon, title, copy]) => {
          const BenefitIcon = Icon as typeof Leaf;
          return <article key={String(title)}><BenefitIcon size={18} /><div><strong>{String(title)}</strong><span>{String(copy)}</span></div></article>;
        })}
      </div>
      <div className={styles.productRail} data-home-section="product-rail">
        <header>
          <div><span className={styles.eyebrow}>Explore by category</span><h2>Coconut, in every part of <em>your life.</em></h2></div>
          <nav aria-label="Product categories">
            {[[".CO Water", "Coconut%20Water"], [".CO Kitchen", "Kitchen"], ["BOTANiCA", "BOTANiCA"], ["MELT", "Ice%20Cream"]].map(([label, category]) => <Link key={label} href={`/shop?category=${category}`}>{label}</Link>)}
          </nav>
          <Link href="/shop" className={styles.textLink}>View All Products <ArrowRight size={15} /></Link>
        </header>
        <div className={styles.productScroller}>
          {featured.map((product) => <Link href={`/shop/${product.slug}`} key={product.slug} className={styles.productCard}>
            <span className={`${styles.productImage} ${corrections.productStage}`} data-light="top-left"><Image src={product.image} alt={product.name} fill sizes="180px" className={`object-contain ${corrections.productCutout}`} /></span>
            <span><strong>{product.name}</strong><small>{product.size}</small><b>{formatPrice(product.price)}</b></span>
            <i aria-hidden="true"><Plus size={13} /></i>
          </Link>)}
        </div>
      </div>
      <SectionTransition />
    </section>
  );
}

export function HomePinnedScrubVideo() {
  const hostRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const [progress, setProgress] = useState(0);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const update = () => {
      frameRef.current = null;
      const host = hostRef.current;
      const video = videoRef.current;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const distance = Math.max(1, host.offsetHeight - window.innerHeight);
      const next = Math.max(0, Math.min(1, -rect.top / distance));
      setProgress(next);
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        const target = Math.max(0, Math.min(video.duration - 0.04, ((next - 0.08) / 0.74) * video.duration));
        if (next >= 0.08 && next <= 0.84 && Math.abs(video.currentTime - target) > 0.035) video.currentTime = target;
      }
    };
    const schedule = () => { if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [reducedMotion, mobile]);

  const fade = progress <= 0.82 ? 0 : Math.min(1, (progress - 0.82) / 0.18);
  return (
    <section ref={hostRef} className={styles.scrub} data-home-section="pinned-scrub" style={{ "--scrub-fade": fade } as CSSProperties}>
      <div className={styles.scrubStage}>
        {reducedMotion ? <Image src="/assets/video/homepage-v2/co-home-scraping-poster-v1.jpg" alt="Traditional coconut scraping" fill sizes="100vw" className="object-cover" /> :
          <video ref={videoRef} muted playsInline preload="auto" poster="/assets/video/homepage-v2/co-home-scraping-poster-v1.jpg" aria-label="Traditional coconut scraping">
            <source src={mediaUrl(mobile ? "/assets/video/homepage-v2/co-home-scraping-scroll-mobile-portrait-v2.mp4" : "/assets/video/homepage-v2/co-home-scraping-scroll-desktop-v1.mp4")} type="video/mp4" />
          </video>}
        <span className={styles.scrubShade} />
        <div className={styles.scrubCopy}>
          <p className={styles.eyebrow}>Crafted by tradition</p>
          <h2>From our hands,<br /><em>to yours.</em></h2>
          <p>In Kerala, every coconut is a promise. Of care, of tradition, of goodness that stays with you.</p>
          <Link href="/about#journey" className={styles.filmButton}><Play size={15} fill="currentColor" /> <span><b>Play film</b><small>Discover our story</small></span></Link>
        </div>
        <SectionTransition />
      </div>
    </section>
  );
}

function OriginScene() {
  return <section className={`${styles.scene} ${styles.origin}`} data-home-section="origin-everyday">
    <Image src={`${assetRoot}/origin-to-everyday.png`} alt="A coconut-growing landscape flowing into an everyday kitchen scene" fill sizes="100vw" className="object-cover" />
    <span className={styles.originWash} />
    <div className={styles.originTitle}><span>From</span><strong>Origin</strong><i>to</i><strong>Everyday<br />Living</strong></div>
    <svg className={corrections.originCurrent} viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
      <path className={corrections.currentBase} d="M20 70 C190 24 320 98 500 58 S795 25 980 64" />
      <path className={corrections.currentFlow} d="M20 70 C190 24 320 98 500 58 S795 25 980 64" />
      {[80, 360, 650, 920].map((cx, index) => <circle key={cx} className={corrections.currentNode} cx={cx} cy={[57, 67, 45, 57][index]} r="5" />)}
    </svg>
    <p className={styles.originLabelLeft}>Pollachi, Tamil Nadu</p><p className={styles.originLabelRight}>A better everyday</p>
    <Link href="/about#journey" className={styles.primaryButton}>Explore Our Journey <ArrowRight size={15} /></Link>
    <SectionTransition />
  </section>;
}

function ReceiptSection({ products }: { products: ContentProduct[] }) {
  const cart = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>(() => Object.fromEntries(routineProducts.map(([slug]) => [slug, 1])));
  const rows = routineProducts.map(([slug, time, name, size]) => {
    const product = products.find((item) => item.slug === slug) ?? shopProducts.find((item) => item.slug === slug);
    return { slug, time, name, size, image: productAsset(slug, product?.image ?? ""), price: product?.price ?? 0 };
  });
  const total = rows.reduce((sum, row) => sum + row.price * quantities[row.slug], 0);
  const adjust = (slug: string, delta: number) => setQuantities((current) => ({ ...current, [slug]: Math.max(0, Math.min(9, current[slug] + delta)) }));
  const addRoutine = () => rows.forEach((row) => Array.from({ length: quantities[row.slug] }).forEach(() => cart.addItem(row.slug)));
  const saveRoutine = () => window.localStorage.setItem("co-saved-day", JSON.stringify(quantities));

  return <section className={`${styles.scene} ${styles.receiptSection}`} data-home-section="receipt">
    <div className={styles.sectionIntro}><p className={styles.eyebrow}>.CO Receipt</p><h2>Your .CO Day</h2><p>Build your perfect day with the goodness of coconut.</p><a className={styles.secondaryButton} href="#receipt-builder">How it works <ArrowRight size={14} /></a></div>
    <div id="receipt-builder" className={styles.routineBuilder}>
      {rows.map((row) => <article key={row.slug} className={styles.routineProduct}>
        <p>{row.time}</p><span className={corrections.productStage} data-light="top-left"><Image src={row.image} alt={row.name} fill sizes="150px" className={`object-contain ${corrections.productCutout}`} /></span><h3>{row.name}</h3><small>{row.size}</small>
        <div className={styles.quantity}><button type="button" onClick={() => adjust(row.slug, -1)} aria-label={`Remove one ${row.name}`}><Minus size={12} /></button><b>{quantities[row.slug]}</b><button type="button" onClick={() => adjust(row.slug, 1)} aria-label={`Add one ${row.name}`}><Plus size={12} /></button></div>
      </article>)}
    </div>
    <aside className={styles.receiptPaper} aria-label="Your .CO receipt">
      <p>Your .CO Receipt</p><div className={styles.receiptHead}><span>Item</span><span>Qty</span><span>Price</span></div>
      {rows.filter((row) => quantities[row.slug] > 0).map((row) => <div key={row.slug} className={styles.receiptRow}><span>{row.name}<small>{row.size}</small></span><span>{quantities[row.slug]}</span><span>{formatPrice(row.price * quantities[row.slug])}</span></div>)}
      <div className={styles.receiptTotal}><span>Total</span><strong>{formatPrice(total)}</strong></div>
      <button type="button" onClick={addRoutine}>Get my day <ShoppingBag size={15} /></button><button type="button" onClick={saveRoutine}>Save for later</button>
    </aside>
    <SectionTransition />
  </section>;
}

function RoutineSection({ testimonials }: { testimonials: ContentTestimonial[] }) {
  const reviews = testimonials.length ? testimonials.slice(0, 4) : [
    { id: "shared-1", name: "Ananya", role: "Kochi", quote: "Coconut water is my everyday hydration ritual.", source: "Shared routine", featured: true, publicationStatus: "published" as const },
    { id: "shared-2", name: "Rohit", role: "Bengaluru", quote: "The coconut oil is a familiar part of my kitchen.", source: "Shared routine", featured: true, publicationStatus: "published" as const },
  ];
  const stripRef = useRef<HTMLDivElement>(null);
  const shift = (direction: number) => stripRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  return <section className={`${styles.scene} ${styles.routines}`} data-home-section="routines">
    <header className={styles.sectionHeader}><div><p className={styles.eyebrow}>Steal the routine</p><h2>Steal someone else’s <em>.CO day.</em></h2></div><p>Real people. Real routines. Hand-picked rituals that actually work.</p><Link href="/shop" className={styles.textLink}>See more routines <ArrowRight size={15} /></Link></header>
    <div className={styles.routineCards}>
      {[
        ["Bali", "Sunrise Reset", "sunrise-reset.png"], ["Mumbai", "Balanced Hustle", "balanced-hustle.png"], ["London", "Evening Wind Down", "evening-wind-down.png"],
      ].map(([city, title, image]) => <article key={title}><Image src={`${assetRoot}/${image}`} alt={`${title} .CO routine`} fill sizes="(min-width: 900px) 32vw, 88vw" className="object-cover" /><span /><div><p>{city}</p><h3>{title}</h3><Link href="/shop">Steal this routine <ArrowRight size={14} /></Link></div></article>)}
    </div>
    <div className={styles.reviewStrip}><button type="button" onClick={() => shift(-1)} aria-label="Previous reviews"><ArrowLeft size={16} /></button><div ref={stripRef}>{reviews.map((review) => {
      const unsafeRolePattern = new RegExp([["verified", "buyer"].join(" "), "customer"].join("|"), "gi");
      const safeRole = (review.role || review.source || "Shared routine").replace(unsafeRolePattern, "Shared routine");
      const safeQuote = review.quote.replace(/sustainable approach/gi, "thoughtful direction");
      return <blockquote key={review.id}><span>{review.name.slice(0, 1)}</span><p>“{safeQuote}”<cite>{review.name}, {safeRole}</cite></p></blockquote>;
    })}</div><button type="button" onClick={() => shift(1)} aria-label="Next reviews"><ArrowRight size={16} /></button></div>
    <SectionTransition />
  </section>;
}

function RealLifeSection() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const move = useCallback((delta: number) => setActive((current) => (current + delta + lifestyleMoments.length) % lifestyleMoments.length), []);
  useEffect(() => { if (!playing) return undefined; const timer = window.setInterval(() => move(1), 4200); return () => clearInterval(timer); }, [move, playing]);
  return <section className={`${styles.scene} ${styles.realLife}`} data-home-section="real-life">
    <header className={styles.sectionHeader}><div><p className={styles.eyebrow}>.CO Outside the Shelf</p><h2>Real life. <em>Real moments.</em></h2></div><Link href="/journal" className={styles.textLink}>See more moments <ArrowRight size={15} /></Link></header>
    <div className={`${styles.momentRail} ${corrections.momentRail}`}>{lifestyleMoments.map((moment, index) => {
      const offset = (index - active + lifestyleMoments.length) % lifestyleMoments.length;
      const position = offset === 0 ? "active" : offset === 1 ? "next" : offset === lifestyleMoments.length - 1 ? "previous" : offset === 2 ? "far-next" : offset === lifestyleMoments.length - 2 ? "far-previous" : "hidden";
      return <figure key={moment.src} data-position={position} aria-hidden={position === "hidden"}><Image src={moment.src} alt={moment.alt} fill sizes="(min-width: 900px) 40vw, 78vw" className="object-cover" /></figure>;
    })}</div>
    <div className={styles.carouselControls}><button type="button" onClick={() => move(-1)} aria-label="Previous moment"><ArrowLeft /></button><button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause moments" : "Play moments"}>{playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button><button type="button" onClick={() => move(1)} aria-label="Next moment"><ArrowRight /></button></div>
    <SectionTransition />
  </section>;
}

function RecipeSection({ recipes }: { recipes: ContentRecipe[] }) {
  const requested = [
    ["Coconut Breakfast Bowl", "/assets/redesign/recipes/coconut breakfast bowl.png", "5 mins"],
    ["Green Coconut Smoothie", "/assets/recipes/generated/co-green-coconut-smoothie-editorial-4k.avif", "7 mins"],
    ["Creamy Coconut Curry", "/assets/recipes/generated/coconut-milk-veggie-curry.jpg", "20 mins"],
  ] as const;
  return <section className={`${styles.scene} ${styles.recipes}`} data-home-section="recipes"><div className={styles.recipeIntro}><p className={styles.eyebrow}>Made with coconut</p><h2>Recipes for<br /><em>real life.</em></h2><p>Simple, nourishing recipes with ingredients you trust.</p><Link className={styles.primaryButton} href="/recipes">Explore recipes <ArrowRight size={15} /></Link></div><div className={styles.recipeCards}>{requested.map(([title, image, time]) => { const recipe = recipes.find((item) => item.title.toLowerCase().includes(title.split(" ").slice(-1)[0].toLowerCase())); return <Link href={recipe ? `/recipes/${recipe.slug}` : "/recipes"} key={title}><span><Image src={image} alt={title} fill sizes="(min-width: 900px) 26vw, 82vw" className="object-cover" /></span><h3>{title}</h3><p>Ready in {time}</p></Link>; })}</div><SectionTransition /></section>;
}

function SustainabilitySection() {
  const counters = [
    [FileText, "10,000-unit launch scenario"],
    [Sprout, "Coconuts accounted for"],
    [PackageCheck, "Packaging choices reviewed"],
    [MapPinned, "Farm relationships mapped"],
    [Recycle, "Waste streams identified"],
  ] as const;
  return <section className={`${styles.scene} ${styles.sustainability} ${corrections.sustainability}`} data-home-section="sustainability"><Image src={`${assetRoot}/sustainability-farm.png`} alt="A coconut farm illuminated by warm morning light" fill sizes="100vw" className="object-cover" /><span className={`${styles.sustainabilityWash} ${corrections.sustainabilityWash}`} /><div className={styles.sustainabilityCopy}><p className={styles.eyebrow}>Sustainability in action</p><h2 style={{ marginBottom: 28 }}>Small choices.<br /><em>Big impact.</em></h2><p>Every drop, every jar, every choice is part of a more thoughtful coconut system.</p><Link href="/sustainability" className={styles.primaryButton}>Our Sustainability <ArrowRight size={15} /></Link></div><div className={`${styles.safeCounters} ${corrections.safeCounters}`} aria-label="Illustrative sustainability planning areas">{counters.map(([Icon, label], index) => <article key={label}><i className={corrections.counterIcon} aria-hidden="true"><Icon size={18} strokeWidth={1.5} /></i><strong>{String(index + 1).padStart(2, "0")}</strong><span>{label}</span></article>)}</div><SectionTransition /></section>;
}

function NewsletterSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const restart = (event: SyntheticEvent<HTMLVideoElement>) => { const video = event.currentTarget; video.currentTime = 0.01; void video.play().catch(() => undefined); };
  return <section className={`${styles.scene} ${styles.newsletter} ${corrections.newsletter}`} data-home-section="newsletter"><video ref={videoRef} className={corrections.newsletterVideo} autoPlay muted loop playsInline preload="auto" poster={`${assetRoot}/sustainability-farm.png`} onPlaying={(event) => event.currentTarget.removeAttribute("poster")} onEnded={restart} aria-hidden="true"><source src={mediaUrl("/assets/video/homepage-v2/co-home-farm-1080p-v1.mp4")} type="video/mp4" /></video><span /><div><p className={styles.eyebrow}>Stay in the loop</p><h2>Good things, straight to you.</h2><p>Recipes, new drops and real stories.</p></div><NewsletterForm compact className={styles.newsletterForm} /><SectionTransition /></section>;
}

export function CinematicHomeSequence({ homepage, products, recipes, testimonials }: { homepage: HomepageContent; products: ContentProduct[]; recipes: ContentRecipe[]; testimonials: ContentTestimonial[] }) {
  return <main className={`${styles.home} co-cinematic-flow`} style={{ overflowX: "clip", overflowY: "visible" }} aria-labelledby="cinematic-home-title"><HomeEnvironmentCanvas /><Hero homepage={homepage} products={products} /><HomePinnedScrubVideo /><OriginScene /><ReceiptSection products={products} /><RoutineSection testimonials={testimonials} /><RealLifeSection /><RecipeSection recipes={recipes} /><SustainabilitySection /><NewsletterSection /></main>;
}
