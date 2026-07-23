"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ResponsiveImage as Image } from "@/components/media/ResponsiveImage";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Gift,
  Heart,
  IceCreamBowl,
  Leaf,
  LockKeyhole,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Recycle,
  RotateCcw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Truck,
  Utensils,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/lib/ui/use-body-scroll-lock";
import { useSavedContent } from "@/lib/customer/use-saved-content";
import { MobileBottomNav, NewsletterSection, ReferenceFooter, ReferenceHeader } from "@/components/home/ReferenceHomePage";
import { StatePanel } from "@/components/launch/StatePanel";
import type { ContentProduct } from "@/lib/content/types";
import { ProductConfigurator } from "@/components/shop/ProductConfigurator";

const ease = [0.16, 1, 0.3, 1] as const;
const imageRoot = "/assets/shop/products";
const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCc+PGZpbHRlciBpZD0nYic+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nNicvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyNmOGY0ZWMnLz48L3N2Zz4=";

type Product = {
  slug: string;
  cartSlug: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  badge?: "Bestseller" | "New" | "Limited";
  image: string;
  dietary: string[];
  collection: string[];
  description: string;
  benefits: string[];
  nutrition: string;
};

const fallbackShopProducts: Product[] = [
  { slug: "co-water", cartSlug: "co-water", name: ".CO Coconut Water 330ml", subtitle: "100% Organic", category: "Coconut Water", price: 120, rating: 4.9, reviews: 128, badge: "Bestseller", image: `${imageRoot}/IndividualProduct_CO-Water.png`, dietary: ["Vegan", "Gluten Free", "No Added Sugar", "Dairy Free"], collection: ["Bestsellers"], description: "Clean tender coconut water with a light, naturally refreshing finish.", benefits: ["Naturally hydrating", "Nothing unnecessary", "Best served chilled"], nutrition: "Tender coconut water. Final nutrition panel will be published with the retail pack." },
  { slug: "melt-co", cartSlug: "melt-co-mango-coconut", name: "Melt.CO Mango + Coconut Ice Cream 350ml", subtitle: "Coconut + Mango", category: "Ice Cream", price: 220, rating: 4.8, reviews: 96, badge: "New", image: `${imageRoot}/IndividualProduct_MeltCO.png`, dietary: ["Vegan", "Gluten Free", "Dairy Free"], collection: ["New Arrivals"], description: "A creamy coconut-led frozen dessert lifted with bright mango.", benefits: ["Coconut creaminess", "Mango-forward", "Dairy free"], nutrition: "Coconut base and mango. Final nutrition panel will be published before launch." },
  { slug: "coconut-chips", cartSlug: "co-kitchen-coconut-oil", name: ".CO Toasted Coconut Chips 150g", subtitle: "Golden + crisp", category: "Food", price: 160, rating: 4.8, reviews: 72, badge: "Bestseller", image: `${imageRoot}/IndividualProduct_CoconutChips.png`, dietary: ["Vegan", "Gluten Free", "Dairy Free"], collection: ["Bestsellers"], description: "Crisp toasted coconut chips for snacking, bowls and baking.", benefits: ["Toasted coconut", "Crisp texture", "Pantry ready"], nutrition: "Toasted coconut. Final pack information will confirm seasoning and serving values." },
  { slug: "body-lotion", cartSlug: "co-botanica-coconut-care", name: ".CO Coconut Body Lotion 200ml", subtitle: "Coconut botanical care", category: "Cosmetics", price: 499, rating: 4.7, reviews: 32, badge: "New", image: `${imageRoot}/IndividualProduct_BodyLotion.png`, dietary: ["Vegan"], collection: ["New Arrivals"], description: "A soft everyday body-care ritual inspired by coconut botanicals.", benefits: ["Daily moisture", "Soft finish", "Cruelty free"], nutrition: "Cosmetic product. Full INCI list and patch-test directions will appear on the final pack." },
  { slug: "coconut-sugar", cartSlug: "co-kitchen-coconut-oil", name: ".CO Coconut Sugar 250g", subtitle: "Warm pantry sweetness", category: "Food", price: 150, rating: 4.7, reviews: 39, image: `${imageRoot}/IndividualProduct_CoconutSugar.png`, dietary: ["Vegan", "Gluten Free", "Dairy Free"], collection: ["New Arrivals"], description: "A warm, caramel-toned coconut-world pantry staple.", benefits: ["Pantry friendly", "Easy to use", "Coconut origin"], nutrition: "Coconut sugar. Final nutrition panel will be published before retail release." },
  { slug: "coconut-oil", cartSlug: "co-kitchen-coconut-oil", name: ".CO Cold Pressed Coconut Oil 200ml", subtitle: "Kitchen + ritual", category: "Food", price: 250, rating: 4.8, reviews: 45, image: `${imageRoot}/IndividualProduct_CoconutOil.png`, dietary: ["Vegan", "Gluten Free", "No Added Sugar", "Dairy Free"], collection: ["Bestsellers"], description: "A versatile coconut oil for simple cooking and everyday rituals.", benefits: ["Cold-pressed direction", "Multipurpose", "Simple ingredient"], nutrition: "Coconut-derived oil. Final nutrition and usage details will appear on the pack." },
  { slug: "bowls", cartSlug: "co-lifestyle", name: ".CO Coconut Bowl Set", subtitle: "Set of 2", category: "Utensils", price: 350, rating: 4.9, reviews: 31, badge: "Limited", image: `${imageRoot}/IndividualProduct_Bowls.png`, dietary: [], collection: ["New Arrivals"], description: "Two polished coconut-shell bowls with matching spoons.", benefits: ["Natural shell", "Hand-finished", "Giftable"], nutrition: "Homeware item. Hand wash and dry fully after use." },
  { slug: "utensils", cartSlug: "co-lifestyle", name: ".CO Coconut Utensil Set", subtitle: "Three-piece set", category: "Utensils", price: 299, rating: 4.7, reviews: 24, image: `${imageRoot}/IndividualProduct_Utensils.png`, dietary: [], collection: ["New Arrivals"], description: "A tactile coconut-shell serving set for everyday tables.", benefits: ["Natural material", "Hand-finished", "Made for living"], nutrition: "Homeware item. Hand wash and dry fully after use." },
  { slug: "coconut-vinegar", cartSlug: "co-kitchen-coconut-oil", name: ".CO Coconut Vinegar 200ml", subtitle: "Bright pantry essential", category: "Food", price: 220, rating: 4.6, reviews: 28, image: `${imageRoot}/IndividualProduct_CoconutVinegar.png`, dietary: ["Vegan", "Gluten Free", "No Added Sugar", "Dairy Free"], collection: ["New Arrivals"], description: "A clean, bright coconut vinegar direction for dressings and marinades.", benefits: ["Bright finish", "Kitchen versatile", "Small-batch direction"], nutrition: "Coconut vinegar. Final acidity and nutrition details will appear on the retail pack." },
  { slug: "coconut-aminos", cartSlug: "co-kitchen-coconut-oil", name: ".CO Coconut Aminos 200ml", subtitle: "Savoury coconut seasoning", category: "Food", price: 280, rating: 4.7, reviews: 34, badge: "New", image: `${imageRoot}/IndividualProduct_CoconutAminos.png`, dietary: ["Vegan", "Gluten Free", "Dairy Free"], collection: ["New Arrivals"], description: "A savoury coconut seasoning preview for everyday recipes.", benefits: ["Savoury finish", "Recipe friendly", "Coconut origin"], nutrition: "Final ingredients and sodium values will be published before release." },
  { slug: "face-wash", cartSlug: "co-botanica-coconut-care", name: ".CO Coconut Face Wash 150ml", subtitle: "Gentle daily cleanse", category: "Cosmetics", price: 399, rating: 4.8, reviews: 41, badge: "Bestseller", image: `${imageRoot}/IndividualProduct_FaceWash.png`, dietary: ["Vegan"], collection: ["Bestsellers"], description: "A calm daily cleanse inspired by coconut botanicals.", benefits: ["Gentle cleanse", "Daily ritual", "Cruelty free"], nutrition: "Cosmetic product. Full INCI list and patch-test directions will appear on the final pack." },
  { slug: "soap", cartSlug: "co-botanica-coconut-care", name: ".CO Coconut Soap 100g", subtitle: "Simple botanical cleanse", category: "Cosmetics", price: 180, rating: 4.6, reviews: 29, image: `${imageRoot}/IndividualProduct_Soap.png`, dietary: ["Vegan"], collection: ["New Arrivals"], description: "A tactile coconut soap bar for a simple everyday cleanse.", benefits: ["Simple ritual", "Palm-conscious direction", "Cruelty free"], nutrition: "Cosmetic product. Final INCI list and usage directions will appear on pack." },
  { slug: "hair-oil", cartSlug: "co-botanica-coconut-care", name: ".CO Coconut Hair Oil 100ml", subtitle: "Coconut botanical ritual", category: "Cosmetics", price: 320, rating: 4.8, reviews: 52, badge: "Bestseller", image: `${imageRoot}/IndividualProduct_HairOil.png`, dietary: ["Vegan"], collection: ["Bestsellers"], description: "A coconut-led pre-wash and finishing hair ritual.", benefits: ["Coconut-led", "Pre-wash ritual", "Soft finish"], nutrition: "Cosmetic product. Final INCI list and usage directions will appear on pack." },
  { slug: "gift-box", cartSlug: "co-lifestyle", name: ".CO Coconut Gift Box", subtitle: "Curated coconut favourites", category: "Bundles & Gifts", price: 899, rating: 4.9, reviews: 18, badge: "Limited", image: `${imageRoot}/IndividualProduct_GiftBox.png`, dietary: [], collection: ["On Sale"], description: "A considered gift box built around the wider .CO coconut world.", benefits: ["Gift ready", "Curated selection", "Limited edition"], nutrition: "Contents vary by edition. Product-specific information is included inside each box." },
];

const categoryOptions = ["All Products", "Coconut Water", "Ice Cream", "Food", "Cosmetics", "Utensils", "Bundles & Gifts"];
const dietaryOptions = ["Vegan", "Gluten Free", "No Added Sugar", "Dairy Free"];
const collectionOptions = ["Bestsellers", "New Arrivals", "On Sale"];
const sortOptions = ["Featured", "Newest", "Price Low to High", "Price High to Low", "Best Selling", "Rating", "Alphabetical"];

function ProductImage({ product, sizes, priority = false }: { product: Product; sizes: string; priority?: boolean }) {
  return <Image src={product.image} alt={product.name} fill priority={priority} sizes={sizes} quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-cover transition duration-700 group-hover:scale-105" />;
}

function Quantity({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="inline-flex h-9 items-center rounded-full bg-[#f4efe7] px-1">
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(Math.max(1, value - 1))} className="grid size-8 place-items-center"><Minus size={13} /></button>
      <span className="w-5 text-center text-xs font-semibold">{value}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(value + 1)} className="grid size-8 place-items-center"><Plus size={13} /></button>
    </div>
  );
}

function FilterContent({ category, setCategory, maxPrice, setMaxPrice, dietary, toggleDietary, collections, toggleCollection }: {
  category: string; setCategory: (value: string) => void; maxPrice: number; setMaxPrice: (value: number) => void; dietary: Set<string>; toggleDietary: (value: string) => void; collections: Set<string>; toggleCollection: (value: string) => void;
}) {
  return (
    <div className="space-y-7 text-[#2a1b13]">
      <div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[.12em]">Categories</p>{categoryOptions.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={cn("block w-full rounded-lg px-3 py-2 text-left text-xs", category === item && "bg-[#e7e8df] font-semibold text-[#214d2b]")}>{item}</button>)}</div>
      <div className="border-t border-black/6 pt-6"><p className="text-[10px] font-semibold uppercase tracking-[.12em]">Price</p><input aria-label="Maximum price" type="range" min="100" max="1000" step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="mt-4 w-full accent-[#214d2b]" /><div className="mt-1 flex justify-between text-[10px]"><span>₹100</span><span>₹{maxPrice}</span></div></div>
      <FilterChecks title="Dietary" options={dietaryOptions} selected={dietary} onToggle={toggleDietary} />
      <FilterChecks title="Collection" options={collectionOptions} selected={collections} onToggle={toggleCollection} />
      <div className="overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#f2e4d1,#f8f4ec)] p-4"><p className="font-['Cormorant_Garamond'] text-2xl">Bundle & Save</p><p className="mt-2 text-[11px] leading-5 text-[#685b50]">Up to 15% off selected bundles.</p><button type="button" onClick={() => setCategory("Bundles & Gifts")} className="mt-4 inline-flex items-center gap-2 text-[9px] font-semibold uppercase">Shop bundles <ArrowRight size={13} /></button></div>
    </div>
  );
}

function FilterChecks({ title, options, selected, onToggle }: { title: string; options: string[]; selected: Set<string>; onToggle: (value: string) => void }) {
  return <div className="border-t border-black/6 pt-6"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[.12em]">{title}</p>{options.map((item) => <label key={item} className="flex cursor-pointer items-center gap-2 py-2 text-xs"><input type="checkbox" checked={selected.has(item)} onChange={() => onToggle(item)} className="size-4 accent-[#214d2b]" />{item}</label>)}</div>;
}

function mergeProductCatalog(contentProducts: ContentProduct[]) {
  return fallbackShopProducts.map((fallback) => {
    const source = contentProducts.find((item) => item.slug === fallback.cartSlug || item.slug === fallback.slug);
    if (!source) return fallback;
    return {
      ...fallback,
      cartSlug: source.slug,
      name: source.name || fallback.name,
      subtitle: source.subtitle || source.shortDescription || fallback.subtitle,
      category: source.category || fallback.category,
      price: source.price ?? fallback.price,
      image: source.image || fallback.image,
      description: source.longDescription || source.shortDescription || fallback.description,
      benefits: source.benefits.length ? source.benefits : fallback.benefits,
      nutrition: source.nutritionHighlights.length ? source.nutritionHighlights.join(" · ") : fallback.nutrition,
      badge: source.featured ? "Bestseller" as const : fallback.badge
    };
  });
}

export function ReferenceShopPage({ contentProducts = [] }: { contentProducts?: ContentProduct[] }) {
  const cart = useCart();
  const products = useMemo(() => mergeProductCatalog(contentProducts), [contentProducts]);
  const [category, setCategory] = useState("All Products");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [dietary, setDietary] = useState(new Set<string>());
  const [collections, setCollections] = useState(new Set<string>());
  const [sort, setSort] = useState("Featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const wishlist = useSavedContent("product");
  const recentProducts = useSavedContent("recent");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("product");
    if (!requested) return;
    const match = products.find((item) => item.slug === requested || item.cartSlug === requested);
    if (match) setSearch(match.name);
  }, [products]);

  const toggleSet = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) => setter((current) => { const next = new Set(current); if (next.has(value)) next.delete(value); else next.add(value); return next; });
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (category !== "All Products" && product.category !== category) return false;
      if (product.price > maxPrice) return false;
      if (dietary.size && !Array.from(dietary).every((item) => product.dietary.includes(item))) return false;
      if (collections.size && !Array.from(collections).some((item) => product.collection.includes(item))) return false;
      if (query && !`${product.name} ${product.subtitle} ${product.category}`.toLowerCase().includes(query)) return false;
      return true;
    });
    return [...filtered].sort((a, b) => sort === "Price Low to High" ? a.price - b.price : sort === "Price High to Low" ? b.price - a.price : sort === "Rating" ? b.rating - a.rating : sort === "Alphabetical" ? a.name.localeCompare(b.name) : sort === "Best Selling" ? b.reviews - a.reviews : sort === "Newest" ? Number(Boolean(b.badge === "New")) - Number(Boolean(a.badge === "New")) : 0);
  }, [category, collections, dietary, maxPrice, products, search, sort]);
  const suggestions = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5), [products, search]);

  const addProduct = (product: Product) => { const quantity = quantities[product.slug] ?? 1; for (let index = 0; index < quantity; index += 1) cart.addItem(product.cartSlug); };
  const toggleWishlist = (slug: string) => void wishlist.toggle(slug);
  const openQuickView = (product: Product) => {
    setQuickView(product);
    void recentProducts.save(product.slug);
  };

  return (
    <div className="co-shop-page min-h-screen overflow-x-clip bg-[#f8f4ec] font-['Inter'] text-[#2a1b13]">
      <ReferenceHeader />
      <main>
        <section className="relative min-h-[520px] overflow-hidden bg-[#f3eee4] md:min-h-[540px]">
          <Image src="/assets/about/co-about-hero-editorial-4k.avif" alt=".CO coconut water and Melt.CO products with fresh coconuts" fill priority sizes="100vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-cover object-[62%_center] md:object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,244,236,.98)_0%,rgba(248,244,236,.88)_43%,rgba(248,244,236,.08)_72%)]" />
          <div className="relative mx-auto flex min-h-[520px] max-w-[1500px] items-center px-6 py-12 md:min-h-[540px] md:px-[clamp(48px,6vw,92px)]">
            <div className="max-w-[560px]"><p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#214d2b]">Shop</p><h1 className="mt-5 font-['Cormorant_Garamond'] text-[52px] leading-[.9] tracking-[-.04em] md:text-[74px]">Good for you,<br />good for the <em className="font-normal text-[#214d2b]">planet.</em></h1><p className="mt-6 max-w-[360px] text-sm leading-7 text-[#5e5045]">Explore our range of coconut goodness, made with care for you and the Earth.</p>
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">{[[Leaf,"Natural Ingredients"],[Recycle,"Sustainably Sourced"],[Sparkles,"No Artificial Additives"],[Heart,"Cruelty Free"]].map(([Icon,label]) => { const FeatureIcon=Icon as typeof Leaf; return <div key={String(label)} className="flex items-center gap-2"><span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#214d2b]/25 bg-white/35"><FeatureIcon size={17} strokeWidth={1.5} /></span><span className="text-[9px] font-semibold leading-4">{String(label)}</span></div>; })}</div>
            </div>
          </div>
        </section>

        <ProductConfigurator />

        <section id="all-products" className="px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-[1320px]">
            <div className="relative z-30 mb-6 flex items-center gap-4 overflow-visible rounded-[22px] border border-black/6 bg-[rgba(255,255,255,.88)] p-3 shadow-[0_12px_40px_rgba(42,27,19,.08)] backdrop-blur-xl md:bg-white/72">
              <div className="relative min-w-0 flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2" size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setActiveSuggestion(0); }} onFocus={() => setSearchFocused(true)} onBlur={() => window.setTimeout(() => setSearchFocused(false), 150)} onKeyDown={(event) => { if (event.key === "Escape") setSearchFocused(false); if (event.key === "ArrowDown") { event.preventDefault(); setActiveSuggestion((value) => Math.min(value + 1, Math.max(0, suggestions.length - 1))); } if (event.key === "ArrowUp") { event.preventDefault(); setActiveSuggestion((value) => Math.max(value - 1, 0)); } if (event.key === "Enter" && suggestions[activeSuggestion]) { setSearch(suggestions[activeSuggestion].name); setSearchFocused(false); } }} placeholder="Search .CO products" aria-label="Search products" role="combobox" aria-autocomplete="list" aria-expanded={searchFocused} aria-controls="shop-search-results" className="h-11 w-full rounded-full bg-[#f8f4ec] pl-11 pr-4 text-xs outline-none" />
                <AnimatePresence>{searchFocused && <motion.div id="shop-search-results" role="listbox" data-lenis-prevent initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-[min(52dvh,360px)] overflow-y-auto overscroll-contain rounded-[20px] border border-white/70 bg-[rgba(248,244,236,.98)] p-2 shadow-[0_28px_80px_rgba(42,27,19,.24)] backdrop-blur-2xl [touch-action:pan-y]"><p className="px-3 py-2 text-[9px] font-semibold uppercase text-[#75695f]">{search ? "Suggestions" : "Popular products"}</p>{(search ? suggestions : products.slice(0,4)).map((item,index)=><button type="button" role="option" aria-selected={activeSuggestion===index} key={item.slug} onMouseDown={(event)=>{event.preventDefault();setSearch(item.name);setSearchFocused(false);}} className={cn("flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs",activeSuggestion===index&&"bg-white/75")}><span className="relative size-10 overflow-hidden rounded-lg"><ProductImage product={item} sizes="40px" /></span>{item.name}</button>)}</motion.div>}</AnimatePresence>
              </div>
              <button type="button" onClick={() => setFiltersOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-full border border-black/8 px-4 text-[10px] font-semibold uppercase md:hidden"><SlidersHorizontal size={15} /> Filters</button>
              <div className="relative hidden md:block"><button type="button" onClick={() => setSortOpen((value)=>!value)} className="inline-flex h-11 min-w-[180px] items-center justify-between rounded-full bg-[#f8f4ec] px-5 text-[10px] font-semibold uppercase">Sort by: <span className="normal-case font-normal">{sort}</span><ChevronDown size={14} /></button><SortMenu open={sortOpen} setOpen={setSortOpen} value={sort} onChange={setSort} /></div>
            </div>

            <div className="mb-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] md:hidden">{categoryOptions.map((item)=><button type="button" key={item} onClick={()=>setCategory(item)} className={cn("shrink-0 rounded-full border px-4 py-2 text-[10px] font-semibold",category===item?"border-[#214d2b] bg-[#214d2b] text-white":"border-black/8 bg-white/45")}>{item}</button>)}</div>

            <div className="grid items-start gap-5 md:grid-cols-[190px_1fr]">
              <aside className="sticky top-24 hidden rounded-[24px] border border-black/6 bg-white/52 p-4 shadow-[0_18px_50px_rgba(42,27,19,.05)] backdrop-blur-xl md:block"><FilterContent category={category} setCategory={setCategory} maxPrice={maxPrice} setMaxPrice={setMaxPrice} dietary={dietary} toggleDietary={(value)=>toggleSet(setDietary,value)} collections={collections} toggleCollection={(value)=>toggleSet(setCollections,value)} /></aside>
              <div><div className="mb-5 flex items-center justify-between"><p className="text-xs text-[#665b52]">Showing <motion.span key={visible.length} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} className="inline-block font-semibold text-[#214d2b]">{visible.length}</motion.span> of {products.length} products</p><div className="relative md:hidden"><button type="button" onClick={()=>setSortOpen((value)=>!value)} className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase">Sort by: <span className="normal-case font-normal">{sort}</span><ChevronDown size={13}/></button><SortMenu open={sortOpen} setOpen={setSortOpen} value={sort} onChange={setSort} /></div></div>
                <motion.div layout className="grid grid-cols-2 gap-3 lg:grid-cols-4">{visible.map((product,index)=><ProductCard key={product.slug} product={product} index={index} quantity={quantities[product.slug]??1} setQuantity={(value)=>setQuantities((current)=>({...current,[product.slug]:value}))} wished={wishlist.saved.has(product.slug)} toggleWishlist={()=>toggleWishlist(product.slug)} onQuickView={()=>openQuickView(product)} onAdd={()=>addProduct(product)} />)}</motion.div>
                {!visible.length && <StatePanel kind="empty" eyebrow="Nothing matched" title="No products found." body="Try a broader category or clear the current search and filter choices." onPrimary={{label:"Reset filters",action:()=>{setCategory("All Products");setDietary(new Set());setCollections(new Set());setMaxPrice(1000);setSearch("");}}} secondary={{label:"Browse recipes",href:"/recipes"}} />}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 md:px-8"><div className="mx-auto grid max-w-[1320px] gap-4 md:grid-cols-3">{[["Bestsellers","Loved by thousands of coconut lovers.",products[1],"Bestsellers"],["New Arrivals","Discover our latest coconut creations.",products[0],"New Arrivals"],["Build Your Bundle","Mix and match your favourites & save more.",products[13],"Bundles & Gifts"]].map(([title,body,product,filter],index)=><motion.button type="button" whileHover={{y:-5}} onClick={()=>{ if(String(filter)==="Bundles & Gifts") setCategory("Bundles & Gifts"); else toggleSet(setCollections,String(filter)); document.getElementById("all-products")?.scrollIntoView({behavior:"smooth"}); }} key={String(title)} className={cn("group relative min-h-[220px] overflow-hidden rounded-[28px] p-6 text-left shadow-[0_18px_50px_rgba(42,27,19,.07)]",index===0?"bg-[#183b20] text-white":"bg-[#eee3d4]")}><div className="relative z-10 max-w-[48%]"><h2 className="font-['Cormorant_Garamond'] text-3xl">{String(title)}</h2><p className="mt-3 text-xs leading-6 opacity-75">{String(body)}</p><span className="mt-6 inline-flex items-center gap-2 border-b pb-1 text-[9px] font-semibold uppercase">Shop now <ArrowRight size={13}/></span></div><div className="absolute bottom-0 right-0 h-[92%] w-[55%]"><ProductImage product={product as Product} sizes="430px" /></div></motion.button>)}</div></section>

        <section className="px-4 pb-8 md:px-8"><div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-3 rounded-[28px] border border-black/6 bg-white/48 p-4 md:grid-cols-4 md:p-6">{[[Truck,"Free Shipping","On orders over ₹699"],[RotateCcw,"Easy Returns","14-day return policy"],[LockKeyhole,"Secure Payments","100% secure checkout"],[Gift,"Earn Rewards","Collect points with every order"]].map(([Icon,title,body])=>{const TrustIcon=Icon as typeof Truck;return <motion.div whileHover={{y:-3}} key={String(title)} className="flex items-center gap-3 rounded-[18px] p-3"><span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#214d2b]/18"><TrustIcon size={19} strokeWidth={1.5}/></span><span><span className="block text-[10px] font-semibold">{String(title)}</span><span className="mt-1 block text-[9px] leading-4 text-[#6c625a]">{String(body)}</span></span></motion.div>})}</div></section>

        <section className="overflow-hidden border-y border-black/6 bg-[#faf7f1] px-4 py-8 md:px-8"><div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-5 md:grid-cols-4">{[[Leaf,"100% Natural","Nothing artificial. Ever."],[Recycle,"Sustainably Sourced","From trusted partner farms."],[Sparkles,"Made with Care","Thoughtfully crafted for you."],[PackageCheck,"Better for Earth","Committed to a greener tomorrow."]].map(([Icon,title,body])=>{const BenefitIcon=Icon as typeof Leaf;return <div key={String(title)} className="flex gap-3"><BenefitIcon className="shrink-0 text-[#214d2b]" size={24}/><span><span className="block text-[10px] font-semibold">{String(title)}</span><span className="mt-1 block text-[9px] leading-4 text-[#6c625a]">{String(body)}</span></span></div>})}</div></section>
        <NewsletterSection />
      </main>
      <ReferenceFooter />
      <MobileBottomNav />

      <Dialog.Root open={filtersOpen} onOpenChange={setFiltersOpen}><AnimatePresence>{filtersOpen&&<Dialog.Portal forceMount><Dialog.Overlay asChild><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-sm"/></Dialog.Overlay><Dialog.Content asChild><motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{duration:.4,ease}} className="fixed inset-y-0 right-0 z-[160] max-h-[100dvh] w-[min(88vw,390px)] overflow-y-auto overscroll-contain bg-[#f8f4ec] p-6 shadow-[-24px_0_70px_rgba(42,27,19,.2)] [scrollbar-gutter:stable] [touch-action:pan-y]"><div className="mb-7 flex items-center justify-between"><Dialog.Title className="font-['Cormorant_Garamond'] text-3xl">Filters</Dialog.Title><Dialog.Close aria-label="Close filters" className="grid size-11 place-items-center rounded-full border border-black/8"><X size={18}/></Dialog.Close></div><FilterContent category={category} setCategory={setCategory} maxPrice={maxPrice} setMaxPrice={setMaxPrice} dietary={dietary} toggleDietary={(value)=>toggleSet(setDietary,value)} collections={collections} toggleCollection={(value)=>toggleSet(setCollections,value)} /><Dialog.Close className="sticky bottom-3 mt-8 min-h-12 w-full rounded-full bg-[#214d2b] text-xs font-semibold uppercase text-white">Show {visible.length} products</Dialog.Close></motion.div></Dialog.Content></Dialog.Portal>}</AnimatePresence></Dialog.Root>
      <QuickView catalog={products} product={quickView} open={Boolean(quickView)} onOpenChange={(open)=>!open&&setQuickView(null)} quantity={quickView?quantities[quickView.slug]??1:1} setQuantity={(value)=>quickView&&setQuantities((current)=>({...current,[quickView.slug]:value}))} wished={quickView?wishlist.saved.has(quickView.slug):false} toggleWishlist={()=>quickView&&toggleWishlist(quickView.slug)} onAdd={()=>quickView&&addProduct(quickView)} />
    </div>
  );
}

function SortMenu({ open, setOpen, value, onChange }: { open: boolean; setOpen: (value:boolean)=>void; value:string; onChange:(value:string)=>void }) {
  return <AnimatePresence>{open&&<motion.div initial={{opacity:0,y:-8,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-8,scale:.98}} className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 rounded-[20px] border border-white/70 bg-[rgba(248,244,236,.96)] p-2 shadow-[0_22px_60px_rgba(42,27,19,.16)] backdrop-blur-2xl">{sortOptions.map((item)=><button type="button" key={item} onClick={()=>{onChange(item);setOpen(false);}} className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs",value===item&&"bg-white/75 font-semibold text-[#214d2b]")}>{item}{value===item&&<Check size={14}/>}</button>)}</motion.div>}</AnimatePresence>;
}

function ProductCard({ product, index, quantity, setQuantity, wished, toggleWishlist, onQuickView, onAdd }: { product:Product; index:number; quantity:number; setQuantity:(value:number)=>void; wished:boolean; toggleWishlist:()=>void; onQuickView:()=>void; onAdd:()=>void }) {
  return <motion.article layout initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.45,delay:Math.min(index*.025,.2),ease}} whileHover={{y:-8}} className="group relative flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-black/6 bg-white/58 p-2.5 shadow-[0_12px_35px_rgba(42,27,19,.045)] transition-shadow hover:shadow-[0_24px_60px_rgba(42,27,19,.12)] md:rounded-[28px] md:p-3"><button type="button" onClick={onQuickView} aria-label={`Quick view ${product.name}`} className="relative aspect-square overflow-hidden rounded-[18px] bg-[#f3eee4] md:rounded-[23px]"><ProductImage product={product} sizes="(min-width:1024px) 19vw, 48vw" />{product.badge&&<span className="absolute bottom-2 left-2 rounded-full bg-[#e8ecdf] px-2 py-1 text-[7px] font-semibold uppercase text-[#214d2b]">{product.badge}</span>}</button><button type="button" onClick={toggleWishlist} aria-label={`${wished?"Remove":"Add"} ${product.name} ${wished?"from":"to"} wishlist`} className={cn("absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-white/78 shadow-sm transition",wished&&"text-[#214d2b]")}><motion.span animate={wished?{scale:[1,1.25,1]}:{scale:1}}><Heart size={16} fill={wished?"currentColor":"none"}/></motion.span></button><div className="flex flex-1 flex-col px-1 pb-1 pt-4"><button type="button" onClick={onQuickView} className="text-left"><h2 className="text-[11px] font-semibold leading-5 md:text-[13px]">{product.name}</h2><p className="mt-1 text-[9px] text-[#6a6057] md:text-[10px]">{product.subtitle}</p><div className="mt-3 flex items-center gap-1 text-[9px]"><span className="tracking-[.08em] text-[#d79b17]">★★★★★</span><span className="text-[#786d64]">({product.reviews})</span></div><p className="mt-3 text-xs font-semibold md:text-sm">₹{product.price.toFixed(2)}</p></button><div className="mt-auto flex items-center justify-between gap-2 pt-4"><Quantity value={quantity} onChange={setQuantity}/><button type="button" onClick={onAdd} aria-label={`Add ${product.name} to cart`} className="co-primary-cta grid size-9 shrink-0 place-items-center rounded-full bg-[#214d2b] text-white transition md:hidden"><ShoppingBag size={15}/></button><button type="button" onClick={onAdd} className="co-primary-cta hidden min-h-9 flex-1 rounded-full bg-[#214d2b] px-3 text-[8px] font-semibold uppercase text-white shadow-[0_10px_24px_rgba(33,77,43,.2)] transition hover:bg-[#183b20] md:block">Add to cart</button></div></div></motion.article>;
}

function useDialogScrollLock(open:boolean){
  useBodyScrollLock(open);
}

function QuickView({ catalog, product, open, onOpenChange, quantity, setQuantity, wished, toggleWishlist, onAdd }: { catalog:Product[]; product:Product|null; open:boolean; onOpenChange:(open:boolean)=>void; quantity:number; setQuantity:(value:number)=>void; wished:boolean; toggleWishlist:()=>void; onAdd:()=>void }) {
  useDialogScrollLock(open);
  return <Dialog.Root open={open} onOpenChange={onOpenChange}><AnimatePresence>{open&&product&&<Dialog.Portal forceMount><Dialog.Overlay asChild><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[170] bg-[#211812]/40 backdrop-blur-[8px]"/></Dialog.Overlay><Dialog.Content asChild><motion.div initial={{opacity:0,scale:.94,y:18}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.94,y:18}} transition={{duration:.42,ease}} className="fixed inset-3 z-[180] overflow-y-auto overscroll-contain rounded-[30px] [scrollbar-gutter:stable] [touch-action:pan-y] border border-white/70 bg-[rgba(248,244,236,.94)] p-4 shadow-[0_35px_110px_rgba(22,15,10,.3)] backdrop-blur-2xl md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[88vh] md:w-[min(980px,calc(100vw-48px))] md:-translate-x-1/2 md:-translate-y-1/2 md:p-7"><div className="flex items-start justify-between"><div><Dialog.Title className="font-['Cormorant_Garamond'] text-3xl md:text-4xl">{product.name}</Dialog.Title><Dialog.Description className="mt-2 text-xs text-[#6b6057]">Quick view · {product.category}</Dialog.Description></div><Dialog.Close aria-label="Close dialog" className="grid size-10 place-items-center rounded-full border border-black/8"><X size={18}/></Dialog.Close></div><div className="mt-5 grid gap-6 md:grid-cols-[1fr_.9fr]"><div><div className="relative aspect-square overflow-hidden rounded-[26px] bg-[#f3eee4]"><ProductImage product={product} sizes="(min-width:768px) 48vw, 90vw" priority/></div><div className="mt-3 grid grid-cols-3 gap-2">{[product,catalog[(catalog.indexOf(product)+1)%catalog.length],catalog[(catalog.indexOf(product)+2)%catalog.length]].map((item)=><button type="button" key={item.slug} onClick={()=>item===product?undefined:onOpenChange(false)} className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-white/55"><ProductImage product={item} sizes="150px"/></button>)}</div></div><div className="flex flex-col"><p className="text-sm leading-7 text-[#594d43]">{product.description}</p><div className="mt-5"><p className="text-[10px] font-semibold uppercase tracking-[.12em]">Benefits</p><div className="mt-3 flex flex-wrap gap-2">{product.benefits.map((item)=><span key={item} className="rounded-full border border-black/7 bg-white/55 px-3 py-2 text-[10px]">{item}</span>)}</div></div><div className="mt-5 rounded-[18px] bg-white/48 p-4"><p className="text-[10px] font-semibold uppercase tracking-[.12em]">Product information</p><p className="mt-2 text-[11px] leading-6 text-[#6a6057]">{product.nutrition}</p></div><div className="mt-6 flex items-center justify-between"><p className="text-xl font-semibold">₹{product.price.toFixed(2)}</p><button type="button" aria-label="Toggle wishlist" onClick={toggleWishlist} className="grid size-11 place-items-center rounded-full border border-black/8"><Heart size={18} fill={wished?"currentColor":"none"}/></button></div><div className="mt-4 flex gap-3"><Quantity value={quantity} onChange={setQuantity}/><button type="button" onClick={onAdd} className="co-primary-cta min-h-11 flex-1 rounded-full bg-[#214d2b] text-[10px] font-semibold uppercase text-white">Add to cart</button></div><div className="mt-6"><p className="text-[10px] font-semibold uppercase tracking-[.12em]">Related products</p><div className="mt-3 grid grid-cols-3 gap-2">{catalog.filter((item)=>item.category===product.category&&item.slug!==product.slug).slice(0,3).map((item)=><div key={item.slug} className="rounded-[14px] bg-white/55 p-2"><div className="relative aspect-square overflow-hidden rounded-[10px]"><ProductImage product={item} sizes="120px"/></div><p className="mt-2 line-clamp-2 text-[8px] font-medium">{item.name}</p></div>)}</div></div></div></div></motion.div></Dialog.Content></Dialog.Portal>}</AnimatePresence></Dialog.Root>;
}
