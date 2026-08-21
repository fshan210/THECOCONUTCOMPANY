"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ResponsiveImage as Image } from "@/components/media/ResponsiveImage";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/lib/ui/use-body-scroll-lock";
import { useSavedContent } from "@/lib/customer/use-saved-content";
import {
  MobileBottomNav,
  NewsletterSection,
  ReferenceFooter,
  ReferenceHeader,
} from "@/components/home/ReferenceHomePage";
import { StatePanel } from "@/components/launch/StatePanel";
import type { ContentProduct } from "@/lib/content/types";
import { ProductConfigurator } from "@/components/shop/ProductConfigurator";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopCategorySlab, shopCategories } from "@/components/shop/ShopCategorySlab";
import { ShopBundleBuilder } from "@/components/shop/ShopBundleBuilder";
import type { ShopViewProduct } from "@/components/shop/shop-types";
import {
  galleryForShopSlug,
  type ProductGalleryAsset,
} from "@/lib/website-assets";

const ease = [0.16, 1, 0.3, 1] as const;
const imageRoot = "/assets/shop/products";
const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCc+PGZpbHRlciBpZD0nYic+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nNicvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyNmOGY0ZWMnLz48L3N2Zz4=";

type Product = ShopViewProduct;

const transparentProductImages: Record<string, string> = {
  "co-water": "/assets/products/transparent-current/co-coconut-water-v1.webp",
  "melt-co-mango-coconut": "/assets/products/transparent-current/co-melt-coconut-mango-v1.webp",
  "co-kitchen-coconut-oil": "/assets/products/transparent-current/co-kitchen-coconut-oil-v1.webp",
  "co-kitchen-coconut-flour": "/assets/products/transparent-current/co-kitchen-coconut-flour-v1.webp",
  "co-kitchen-coconut-milk": "/assets/products/transparent-current/co-kitchen-coconut-milk-v1.webp",
  "co-botanica-shampoo": "/assets/products/transparent-current/co-botanica-shampoo-v1.webp",
  "co-botanica-face-wash": "/assets/products/transparent-current/co-botanica-face-wash-v1.webp",
  "co-botanica-hair-serum": "/assets/products/transparent-current/co-botanica-hair-serum-v1.webp",
  "co-botanica-body-moisturizer": "/assets/products/transparent-current/co-botanica-body-moisturizer-v1.webp",
};

const fallbackShopProducts: Product[] = [
  {
    slug: "co-water",
    cartSlug: "co-water",
    name: ".CO Coconut Water 200ml",
    subtitle: "Chilled bottle",
    category: "Coconut Water",
    price: 60,
    image: `${imageRoot}/IndividualProduct_CO-Water.png`,
    collection: ["Featured", "Coming soon"],
    description:
      "Clean tender coconut water with a light, naturally refreshing finish.",
    benefits: [
      "Naturally hydrating",
      "Nothing unnecessary",
      "Best served chilled",
    ],
    nutrition:
      "Tender coconut water. Final nutrition panel will be published with the retail pack.",
  },
  {
    slug: "melt-co-mango-coconut",
    cartSlug: "melt-co-mango-coconut",
    name: "MELT.CO Mango Coconut",
    subtitle: "Frozen dessert",
    category: "Ice Cream",
    price: 220,
    image: `${imageRoot}/IndividualProduct_MeltCO.png`,
    collection: ["Featured", "Coming soon"],
    description:
      "A creamy coconut-led frozen dessert lifted with bright mango.",
    benefits: ["Coconut creaminess", "Mango-forward", "Dairy free"],
    nutrition:
      "Coconut base and mango. Final nutrition panel will be published before launch.",
  },
  {
    slug: "co-kitchen-coconut-oil",
    cartSlug: "co-kitchen-coconut-oil",
    name: ".CO Kitchen Coconut Oil",
    subtitle: "Kitchen staple",
    category: "Kitchen",
    price: 250,
    image: `${imageRoot}/IndividualProduct_CoconutOil.png`,
    collection: ["Featured", "Product previews"],
    description:
      "A versatile coconut oil for simple cooking and everyday rituals.",
    benefits: ["Kitchen-friendly", "Multipurpose", "Simple ingredient"],
    nutrition:
      "Coconut-derived oil. Final nutrition and usage details will appear on the pack.",
  },
  {
    slug: "co-kitchen-coconut-flour",
    cartSlug: "co-kitchen-coconut-flour",
    name: ".CO Kitchen Coconut Flour",
    subtitle: "Pantry staple",
    category: "Kitchen",
    price: 180,
    image: `${imageRoot}/IndividualProduct_CoconutFlour.png`,
    collection: ["Product previews"],
    description:
      "Finely milled coconut flour for baking, breakfast bowls, and everyday pantry use.",
    benefits: ["Baking friendly", "Naturally versatile", "Pantry ready"],
    nutrition:
      "Coconut flour. Final nutrition panel will be published before release.",
  },
  {
    slug: "co-kitchen-coconut-milk",
    cartSlug: "co-kitchen-coconut-milk",
    name: ".CO Kitchen Coconut Milk",
    subtitle: "Cooking essential",
    category: "Kitchen",
    price: 180,
    image: `${imageRoot}/IndividualProduct_CoconutMilk.png`,
    collection: ["Product previews"],
    description:
      "A smooth coconut milk direction for curries, desserts, drinks, and daily cooking.",
    benefits: [
      "Creamy coconut base",
      "Cooking friendly",
      "Everyday pantry ritual",
    ],
    nutrition:
      "Coconut milk. Final nutrition panel will be published before release.",
  },
  {
    slug: "co-botanica-shampoo",
    cartSlug: "co-botanica-shampoo",
    name: ".CO BOTANiCA Coconut Shampoo",
    subtitle: "Hair care preview",
    category: "BOTANiCA",
    price: 399,
    image: `${imageRoot}/IndividualProduct_Shampoo.png`,
    collection: ["Product previews"],
    description:
      "A gentle coconut-led shampoo direction for a clean, balanced wash ritual.",
    benefits: ["Gentle cleanse", "Coconut-led care", "Daily ritual"],
    nutrition:
      "Cosmetic product. Final INCI list and directions will appear on the retail pack.",
  },
  {
    slug: "co-botanica-face-wash",
    cartSlug: "co-botanica-face-wash",
    name: ".CO BOTANiCA Coconut Face Wash",
    subtitle: "Face care preview",
    category: "BOTANiCA",
    price: 399,
    image: `${imageRoot}/IndividualProduct_FaceWash.png`,
    collection: ["Product previews"],
    description: "A calm daily cleanse inspired by coconut botanicals.",
    benefits: ["Gentle cleanse", "Daily ritual", "Coconut botanical direction"],
    nutrition:
      "Cosmetic product. Final INCI list and patch-test directions will appear on the retail pack.",
  },
  {
    slug: "co-botanica-hair-serum",
    cartSlug: "co-botanica-hair-serum",
    name: ".CO BOTANiCA Coconut Hair Serum",
    subtitle: "Hair care preview",
    category: "BOTANiCA",
    price: 499,
    image: `${imageRoot}/IndividualProduct_HairOil.png`,
    collection: ["Product previews"],
    description:
      "A lightweight coconut botanical serum direction for an easy finishing ritual.",
    benefits: ["Light finish", "Coconut-led care", "Everyday ritual"],
    nutrition:
      "Cosmetic product. Final INCI list and directions will appear on the retail pack.",
  },
  {
    slug: "co-botanica-body-moisturizer",
    cartSlug: "co-botanica-body-moisturizer",
    name: ".CO BOTANiCA Coconut Body Moisturizer",
    subtitle: "Body care preview",
    category: "BOTANiCA",
    price: 499,
    image: `${imageRoot}/IndividualProduct_BodyLotion.png`,
    collection: ["Product previews"],
    description:
      "A soft coconut botanical moisturizer direction for daily body care.",
    benefits: ["Daily moisture", "Soft finish", "Coconut botanical direction"],
    nutrition:
      "Cosmetic product. Final INCI list and patch-test directions will appear on the retail pack.",
  },
];

const categoryOptions = shopCategories.map((category) => category.value);
const collectionOptions = ["Featured", "Product previews"];
const sortOptions = [
  "Featured",
  "Price Low to High",
  "Price High to Low",
  "Alphabetical",
];

function ProductImage({
  product,
  sizes,
  priority = false,
}: {
  product: Product;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={product.image}
      alt={product.name}
      fill
      priority={priority}
      sizes={sizes}
      quality={95}
      placeholder="blur"
      blurDataURL={blurDataURL}
      className="object-contain p-3 transition duration-700 group-hover:scale-[1.025] md:p-5"
    />
  );
}

function Quantity({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="co-shop-quantity inline-flex h-9 items-center rounded-full px-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="grid size-8 place-items-center"
      >
        <Minus size={13} />
      </button>
      <span className="w-5 text-center text-xs font-semibold">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className="grid size-8 place-items-center"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

function FilterContent({
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
  collections,
  toggleCollection,
  availability,
  toggleAvailability,
  formats,
  selectedFormats,
  toggleFormat,
  clearAll,
}: {
  category: string;
  setCategory: (value: string) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  collections: Set<string>;
  toggleCollection: (value: string) => void;
  availability: Set<string>;
  toggleAvailability: (value: string) => void;
  formats: string[];
  selectedFormats: Set<string>;
  toggleFormat: (value: string) => void;
  clearAll: () => void;
}) {
  return (
    <div className="co-shop-filter-content space-y-7">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[.14em]">Filters</p>
        <button type="button" onClick={clearAll} className="min-h-9 text-[9px] font-semibold uppercase text-[#214d2b] underline underline-offset-4">Clear all</button>
      </div>
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.12em]">
          Categories
        </p>
        {categoryOptions.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setCategory(item)}
            className={cn(
              "co-shop-filter-option block w-full rounded-lg px-3 py-2 text-left text-xs",
              category === item && "is-active font-semibold",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="border-t border-black/6 pt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[.12em]">
          Price
        </p>
        <input
          aria-label="Maximum price"
          type="range"
          min="0"
          max="1000"
          step="50"
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="co-shop-price-range mt-4 w-full"
        />
        <div className="mt-1 flex justify-between text-[10px]">
          <span>₹0</span>
          <span>₹{maxPrice}</span>
        </div>
      </div>
      <FilterChecks
        title="Collection"
        options={collectionOptions}
        selected={collections}
        onToggle={toggleCollection}
      />
      <FilterChecks
        title="Availability"
        options={["Coming soon", "Product preview"]}
        selected={availability}
        onToggle={toggleAvailability}
      />
      <FilterChecks
        title="Size / type"
        options={formats}
        selected={selectedFormats}
        onToggle={toggleFormat}
      />
      <div className="co-shop-filter-promo overflow-hidden rounded-[22px] p-4">
        <p className="font-['Cormorant_Garamond'] text-2xl">BOTANiCA rituals</p>
        <p className="mt-2 text-[11px] leading-5 text-[#685b50]">
          Explore the distinct coconut care previews.
        </p>
        <button
          type="button"
          onClick={() => setCategory("BOTANiCA")}
          className="mt-4 inline-flex items-center gap-2 text-[9px] font-semibold uppercase"
        >
          Explore care <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function FilterChecks({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="border-t border-black/6 pt-6">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.12em]">
        {title}
      </p>
      {options.map((item) => (
        <label
          key={item}
          className="flex cursor-pointer items-center gap-2 py-2 text-xs"
        >
          <input
            type="checkbox"
            checked={selected.has(item)}
            onChange={() => onToggle(item)}
            className="co-shop-checkbox size-4"
          />
          {item}
        </label>
      ))}
    </div>
  );
}

function mergeProductCatalog(contentProducts: ContentProduct[]) {
  return fallbackShopProducts.map((fallback) => {
    const source = contentProducts.find(
      (item) => item.slug === fallback.cartSlug || item.slug === fallback.slug,
    );
    const approved =
      galleryForShopSlug(fallback.slug) ??
      galleryForShopSlug(fallback.cartSlug);
    const approvedImage = approved?.primary;
    const gallery = approved?.gallery ?? [];
    const transparentImage = transparentProductImages[fallback.slug] ?? transparentProductImages[fallback.cartSlug];
    if (!source)
      return { ...fallback, image: transparentImage ?? approvedImage ?? fallback.image, gallery };
    return {
      ...fallback,
      cartSlug: source.slug,
      name: source.name || fallback.name,
      subtitle: source.subtitle || source.shortDescription || fallback.subtitle,
      category: source.category || fallback.category,
      price: source.price ?? fallback.price,
      currency: source.currency || "INR",
      status: source.status,
      availabilityStatus: source.availabilityStatus,
      featured: source.featured,
      format: source.format,
      image: transparentImage ?? approvedImage ?? source.image ?? fallback.image,
      gallery,
      description:
        source.longDescription ||
        source.shortDescription ||
        fallback.description,
      benefits: source.benefits.length ? source.benefits : fallback.benefits,
      nutrition: source.nutritionHighlights.length
        ? source.nutritionHighlights.join(" · ")
        : fallback.nutrition,
      collection: [
        ...(source.featured ? ["Featured"] : []),
        source.status === "coming-soon" ? "Coming soon" : "Product previews",
      ],
      badge: source.featured ? ("Featured" as const) : undefined,
    };
  });
}

export function ReferenceShopPage({
  contentProducts = [],
}: {
  contentProducts?: ContentProduct[];
}) {
  const cart = useCart();
  const products = useMemo(
    () => mergeProductCatalog(contentProducts),
    [contentProducts],
  );
  const [category, setCategory] = useState("All Products");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [collections, setCollections] = useState(new Set<string>());
  const [availability, setAvailability] = useState(new Set<string>());
  const [formats, setFormats] = useState(new Set<string>());
  const [sort, setSort] = useState("Featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const wishlist = useSavedContent("product");
  const recentProducts = useSavedContent("recent");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const formatOptions = useMemo(() => Array.from(new Set(products.map((product) => product.format || product.subtitle))), [products]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("product");
    const requestedCategory = params.get("category");
    const aliases: Record<string, string> = { Food: "Kitchen", Cosmetics: "BOTANiCA" };
    const resolvedCategory = requestedCategory ? (aliases[requestedCategory] ?? requestedCategory) : null;
    if (resolvedCategory && categoryOptions.includes(resolvedCategory as (typeof categoryOptions)[number])) setCategory(resolvedCategory);
    const requestedSort = params.get("sort");
    if (requestedSort && sortOptions.includes(requestedSort)) setSort(requestedSort);
    const requestedQuery = params.get("q");
    if (requestedQuery) setSearch(requestedQuery.slice(0, 120));
    const requestedPriceValue = params.get("maxPrice");
    const requestedPrice = Number(requestedPriceValue);
    if (requestedPriceValue && Number.isFinite(requestedPrice) && requestedPrice >= 0 && requestedPrice <= 1000) setMaxPrice(requestedPrice);
    if (requested) {
      const match = products.find((item) => item.slug === requested || item.cartSlug === requested);
      if (match) setSearch(match.name);
    }
  }, [products]);

  useEffect(() => {
    const syncFromHistory = () => {
      const params = new URLSearchParams(window.location.search);
      const aliases: Record<string, string> = { Food: "Kitchen", Cosmetics: "BOTANiCA" };
      const nextCategory = aliases[params.get("category") ?? ""] ?? params.get("category") ?? "All Products";
      setCategory(categoryOptions.includes(nextCategory as (typeof categoryOptions)[number]) ? nextCategory : "All Products");
      const nextSort = params.get("sort") ?? "Featured";
      setSort(sortOptions.includes(nextSort) ? nextSort : "Featured");
      setSearch((params.get("q") ?? "").slice(0, 120));
      const nextPriceValue = params.get("maxPrice");
      const nextPrice = Number(nextPriceValue);
      setMaxPrice(nextPriceValue && Number.isFinite(nextPrice) && nextPrice >= 0 && nextPrice <= 1000 ? nextPrice : 1000);
    };
    window.addEventListener("popstate", syncFromHistory);
    return () => window.removeEventListener("popstate", syncFromHistory);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (search.trim()) params.set("q", search.trim()); else params.delete("q");
      if (maxPrice < 1000) params.set("maxPrice", String(maxPrice)); else params.delete("maxPrice");
      window.history.replaceState(null, "", `${window.location.pathname}${params.size ? `?${params.toString()}` : ""}${window.location.hash}`);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [maxPrice, search]);

  const commitShopParam = (key: "category" | "sort", value: string, defaultValue: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value === defaultValue) params.delete(key); else params.set(key, value);
    window.history.pushState(null, "", `${window.location.pathname}${params.size ? `?${params.toString()}` : ""}${window.location.hash}`);
  };
  const chooseCategory = (value: string) => { setCategory(value); commitShopParam("category", value, "All Products"); };
  const chooseSort = (value: string) => { setSort(value); commitShopParam("sort", value, "Featured"); };
  const clearFilters = () => {
    chooseCategory("All Products");
    setCollections(new Set());
    setAvailability(new Set());
    setFormats(new Set());
    setMaxPrice(1000);
    setSearch("");
  };

  const toggleSet = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string,
  ) =>
    setter((current) => {
      const next = new Set(current);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (category !== "All Products" && product.category !== category)
        return false;
      if (product.price > maxPrice) return false;
      if (
        collections.size &&
        !Array.from(collections).some((item) =>
          product.collection.includes(item),
        )
      )
        return false;
      const availabilityLabel = product.status === "coming-soon" ? "Coming soon" : "Product preview";
      if (availability.size && !availability.has(availabilityLabel)) return false;
      if (formats.size && !formats.has(product.format || product.subtitle)) return false;
      if (
        query &&
        !`${product.name} ${product.subtitle} ${product.category}`
          .toLowerCase()
          .includes(query)
      )
        return false;
      return true;
    });
    return [...filtered].sort((a, b) =>
      sort === "Price Low to High"
        ? a.price - b.price
        : sort === "Price High to Low"
          ? b.price - a.price
          : sort === "Alphabetical"
              ? a.name.localeCompare(b.name)
              : Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
    );
  }, [availability, category, collections, formats, maxPrice, products, search, sort]);
  const suggestions = useMemo(
    () =>
      products
        .filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase()),
        )
        .slice(0, 5),
    [products, search],
  );

  const addProduct = (product: Product) => {
    const quantity = quantities[product.slug] ?? 1;
    for (let index = 0; index < quantity; index += 1)
      cart.addItem(product.cartSlug);
  };
  const toggleWishlist = (slug: string) => void wishlist.toggle(slug);
  const openQuickView = (product: Product) => {
    setQuickView(product);
    void recentProducts.save(product.slug);
  };

  return (
    <div className="co-shop-page min-h-screen overflow-x-clip font-['Inter']">
      <ReferenceHeader />
      <div>
        <ShopHero products={products} search={search} onSearch={setSearch} />
        <ShopCategorySlab
          value={category}
          onChange={(nextCategory) => {
            chooseCategory(nextCategory);
            window.setTimeout(() => document.getElementById(nextCategory === "Bundles & Gifts" ? "bundle-builder" : "all-products")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
          }}
        />

        <section id="all-products" className="co-shop-commerce px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto max-w-[1320px]">
            <div className="co-shop-toolbar sticky top-[84px] z-30 mb-6 flex items-center gap-4 overflow-visible rounded-[22px] p-3 backdrop-blur-xl md:relative md:top-auto">
              <div className="relative min-w-0 flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  size={16}
                />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setActiveSuggestion(0);
                  }}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() =>
                    window.setTimeout(() => setSearchFocused(false), 150)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setSearchFocused(false);
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setActiveSuggestion((value) =>
                        Math.min(
                          value + 1,
                          Math.max(0, suggestions.length - 1),
                        ),
                      );
                    }
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setActiveSuggestion((value) => Math.max(value - 1, 0));
                    }
                    if (
                      event.key === "Enter" &&
                      suggestions[activeSuggestion]
                    ) {
                      setSearch(suggestions[activeSuggestion].name);
                      setSearchFocused(false);
                    }
                  }}
                  placeholder="Search .CO products"
                  aria-label="Search products"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={searchFocused}
                  aria-controls="shop-search-results"
                  className="co-shop-toolbar__search h-11 w-full rounded-full pl-11 pr-11 text-xs outline-none"
                />
                {search ? <button type="button" onClick={() => { setSearch(""); setSearchFocused(false); }} aria-label="Clear search" className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-[#5f554d] hover:bg-white"><X size={14} /></button> : null}
                <AnimatePresence>
                  {searchFocused && (
                    <motion.div
                      id="shop-search-results"
                      role="listbox"
                      data-lenis-prevent
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="co-shop-search-results absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-[min(52dvh,360px)] overflow-y-auto overscroll-contain rounded-[20px] p-2 backdrop-blur-2xl [touch-action:pan-y]"
                    >
                      <p className="px-3 py-2 text-[9px] font-semibold uppercase text-[#75695f]">
                        {search ? "Suggestions" : "Popular products"}
                      </p>
                      {(search ? suggestions : products.slice(0, 4)).map(
                        (item, index) => (
                          <button
                            type="button"
                            role="option"
                            aria-selected={activeSuggestion === index}
                            key={item.slug}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              setSearch(item.name);
                              setSearchFocused(false);
                            }}
                            className={cn(
                              "flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs",
                              activeSuggestion === index && "bg-white/[.08]",
                            )}
                          >
                            <span className="relative size-10 overflow-hidden rounded-lg">
                              <ProductImage product={item} sizes="40px" />
                            </span>
                            {item.name}
                          </button>
                        ),
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="co-shop-toolbar__button inline-flex h-11 items-center gap-2 rounded-full px-4 text-[10px] font-semibold uppercase md:hidden"
              >
                <SlidersHorizontal size={15} /> Filters
              </button>
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setSortOpen((value) => !value)}
                  className="co-shop-toolbar__button inline-flex h-11 min-w-[180px] items-center justify-between rounded-full px-5 text-[10px] font-semibold uppercase"
                >
                  Sort by:{" "}
                  <span className="normal-case font-normal">{sort}</span>
                  <ChevronDown size={14} />
                </button>
                <SortMenu
                  open={sortOpen}
                  setOpen={setSortOpen}
                  value={sort}
                  onChange={chooseSort}
                />
              </div>
            </div>

            {(collections.size > 0 || availability.size > 0 || formats.size > 0 || maxPrice < 1000) ? (
              <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label="Active filters">
                {Array.from(collections).map((item) => <button type="button" key={item} onClick={() => toggleSet(setCollections, item)} className="co-shop-filter-chip">{item}<X size={11} /></button>)}
                {Array.from(availability).map((item) => <button type="button" key={item} onClick={() => toggleSet(setAvailability, item)} className="co-shop-filter-chip">{item}<X size={11} /></button>)}
                {Array.from(formats).map((item) => <button type="button" key={item} onClick={() => toggleSet(setFormats, item)} className="co-shop-filter-chip">{item}<X size={11} /></button>)}
                {maxPrice < 1000 ? <button type="button" onClick={() => setMaxPrice(1000)} className="co-shop-filter-chip">Up to ₹{maxPrice}<X size={11} /></button> : null}
              </div>
            ) : null}

            <div className="grid items-start gap-5 md:grid-cols-[minmax(190px,22%)_1fr]">
              <aside className="co-shop-filter-panel sticky top-24 hidden rounded-[24px] p-4 backdrop-blur-xl md:block">
                <FilterContent
                  category={category}
                  setCategory={chooseCategory}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  collections={collections}
                  toggleCollection={(value) => toggleSet(setCollections, value)}
                  availability={availability}
                  toggleAvailability={(value) => toggleSet(setAvailability, value)}
                  formats={formatOptions}
                  selectedFormats={formats}
                  toggleFormat={(value) => toggleSet(setFormats, value)}
                  clearAll={clearFilters}
                />
              </aside>
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-xs text-[#cdb092]">
                    Showing{" "}
                    <motion.span
                      key={visible.length}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-block font-semibold text-[#f0bc7e]"
                    >
                      {visible.length}
                    </motion.span>{" "}
                    of {products.length} products
                  </p>
                  <div className="relative md:hidden">
                    <button
                      type="button"
                      onClick={() => setSortOpen((value) => !value)}
                      className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase"
                    >
                      Sort by:{" "}
                      <span className="normal-case font-normal">{sort}</span>
                      <ChevronDown size={13} />
                    </button>
                    <SortMenu
                      open={sortOpen}
                      setOpen={setSortOpen}
                      value={sort}
                      onChange={chooseSort}
                    />
                  </div>
                </div>
                <motion.div
                  layout
                  className="grid grid-cols-2 gap-3 lg:grid-cols-4"
                >
                  {visible.map((product, index) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      index={index}
                      quantity={quantities[product.slug] ?? 1}
                      setQuantity={(value) =>
                        setQuantities((current) => ({
                          ...current,
                          [product.slug]: value,
                        }))
                      }
                      wished={wishlist.saved.has(product.slug)}
                      toggleWishlist={() => toggleWishlist(product.slug)}
                      onQuickView={() => openQuickView(product)}
                      onAdd={() => product.cartSlug === "co-water" ? setConfiguratorOpen(true) : addProduct(product)}
                      actionLabel={product.cartSlug === "co-water" ? "Configure" : "Add to cart"}
                    />
                  ))}
                </motion.div>
                {!visible.length && (
                  <StatePanel
                    kind="empty"
                    eyebrow="Nothing matched"
                    title="No products found."
                    body="Try a broader category or clear the current search and filter choices."
                    onPrimary={{
                      label: "Reset filters",
                      action: clearFilters,
                    }}
                    secondary={{ label: "Browse recipes", href: "/recipes" }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <ShopBundleBuilder products={products} />

        <section className="co-shop-trust px-4 pb-8 md:px-8">
          <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-3 rounded-[28px] p-4 md:grid-cols-4 md:p-5">
            {[
              [PackageCheck, "Real catalog", "Prices and product routes use current data"],
              [Heart, "Account wishlist", "Saved products use the existing account flow"],
              [ShoppingBag, "Persistent cart", "Your shelf remains after refresh"],
              [Gift, "Honest bundles", "Exact product sum with no invented savings"],
            ].map(([Icon, title, body]) => {
              const TrustIcon = Icon as typeof Truck;
              return (
                <motion.div
                  whileHover={{ y: -3 }}
                  key={String(title)}
                  className="flex items-center gap-3 rounded-[18px] p-3"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#214d2b]/18">
                    <TrustIcon size={19} strokeWidth={1.5} />
                  </span>
                  <span>
                    <span className="block text-[10px] font-semibold">
                      {String(title)}
                    </span>
                    <span className="mt-1 block text-[9px] leading-4 text-[#b99c80]">
                      {String(body)}
                    </span>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="co-shop-newsletter-shell"><NewsletterSection /></section>
      </div>
      <ReferenceFooter />
      <MobileBottomNav />

      <Dialog.Root open={filtersOpen} onOpenChange={setFiltersOpen}>
        <AnimatePresence>
          {filtersOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-sm"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.4, ease }}
                  className="co-shop-filter-sheet fixed inset-y-0 right-0 z-[160] max-h-[100dvh] w-[min(92vw,410px)] overflow-y-auto overscroll-contain p-6 [scrollbar-gutter:stable] [touch-action:pan-y]"
                >
                  <div className="co-shop-filter-sheet__header sticky top-0 z-20 -mx-6 -mt-6 mb-7 flex items-center justify-between px-6 pb-4 pt-6">
                    <Dialog.Title className="co-shop-filter-sheet__title font-['Cormorant_Garamond'] text-3xl">
                      Filters
                    </Dialog.Title>
                    <Dialog.Close
                      aria-label="Close filters"
                      className="co-shop-filter-sheet__close grid size-11 place-items-center rounded-full"
                    >
                      <X size={18} />
                    </Dialog.Close>
                  </div>
                  <FilterContent
                    category={category}
                    setCategory={chooseCategory}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    collections={collections}
                    toggleCollection={(value) =>
                      toggleSet(setCollections, value)
                    }
                    availability={availability}
                    toggleAvailability={(value) => toggleSet(setAvailability, value)}
                    formats={formatOptions}
                    selectedFormats={formats}
                    toggleFormat={(value) => toggleSet(setFormats, value)}
                    clearAll={clearFilters}
                  />
                  <Dialog.Close className="co-shop-filter-sheet__apply sticky bottom-3 mt-8 min-h-12 w-full rounded-full text-xs font-semibold uppercase text-white">
                    Show {visible.length} products
                  </Dialog.Close>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
      <QuickView
        catalog={products}
        product={quickView}
        open={Boolean(quickView)}
        onOpenChange={(open) => !open && setQuickView(null)}
        quantity={quickView ? (quantities[quickView.slug] ?? 1) : 1}
        setQuantity={(value) =>
          quickView &&
          setQuantities((current) => ({ ...current, [quickView.slug]: value }))
        }
        wished={quickView ? wishlist.saved.has(quickView.slug) : false}
        toggleWishlist={() => quickView && toggleWishlist(quickView.slug)}
        onAdd={() => quickView && (quickView.cartSlug === "co-water" ? setConfiguratorOpen(true) : addProduct(quickView))}
      />
      <Dialog.Root open={configuratorOpen} onOpenChange={setConfiguratorOpen}>
        <AnimatePresence>
          {configuratorOpen ? (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[190] bg-[#211812]/55 backdrop-blur-sm" /></Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .98 }} className="fixed inset-x-2 bottom-2 z-[200] max-h-[calc(100dvh-16px)] overflow-y-auto rounded-[30px] bg-[#f8f4ec] shadow-[0_30px_90px_rgba(0,0,0,.32)] md:inset-x-8 md:bottom-6 md:mx-auto md:max-w-[1180px]">
                  <Dialog.Title className="sr-only">Configure .CO Coconut Water</Dialog.Title>
                  <Dialog.Description className="sr-only">Choose the available coconut water size, processing and pulp options.</Dialog.Description>
                  <Dialog.Close aria-label="Close Coconut Water configurator" className="sticky left-full top-3 z-20 mr-3 grid size-11 place-items-center rounded-full border border-black/8 bg-white/85 shadow-sm"><X size={18} /></Dialog.Close>
                  <div className="-mt-11"><ProductConfigurator /></div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          ) : null}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}

function SortMenu({
  open,
  setOpen,
  value,
  onChange,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          className="co-shop-sort-menu absolute right-0 top-[calc(100%+8px)] z-50 w-52 rounded-[20px] p-2 backdrop-blur-2xl"
        >
          {sortOptions.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs",
                value === item && "bg-white/[.08] font-semibold text-[#f0bc7e]",
              )}
            >
              {item}
              {value === item && <Check size={14} />}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProductCard({
  product,
  index,
  quantity,
  setQuantity,
  wished,
  toggleWishlist,
  onQuickView,
  onAdd,
  actionLabel,
}: {
  product: Product;
  index: number;
  quantity: number;
  setQuantity: (value: number) => void;
  wished: boolean;
  toggleWishlist: () => void;
  onQuickView: () => void;
  onAdd: () => void;
  actionLabel: string;
}) {
  return (
    <motion.article
      data-product-slug={product.cartSlug}
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.025, 0.2), ease }}
      whileHover={{ y: -8 }}
      className="co-shop-product-card group relative flex min-w-0 flex-col overflow-hidden rounded-[20px] p-2.5 transition-shadow md:p-3"
    >
      <Link
        href={`/shop/${product.cartSlug}`}
        aria-label={`View ${product.name}`}
        className="co-shop-product-card__image relative aspect-[.92] overflow-hidden rounded-[16px] md:rounded-[18px]"
      >
        <ProductImage product={product} sizes="(min-width:1024px) 19vw, 48vw" />
        {product.badge && (
          <span className="absolute bottom-2 left-2 rounded-full bg-[#e8ecdf] px-2 py-1 text-[7px] font-semibold uppercase text-[#214d2b]">
            {product.badge}
          </span>
        )}
      </Link>
      <button
        type="button"
        onClick={toggleWishlist}
        aria-label={`${wished ? "Remove" : "Add"} ${product.name} ${wished ? "from" : "to"} wishlist`}
        className={cn(
          "co-shop-product-card__wish absolute right-5 top-5 grid size-9 place-items-center rounded-full transition",
          wished && "is-active",
        )}
      >
        <motion.span animate={wished ? { scale: [1, 1.25, 1] } : { scale: 1 }}>
          <Heart size={16} fill={wished ? "currentColor" : "none"} />
        </motion.span>
      </button>
      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <Link href={`/shop/${product.cartSlug}`} className="text-left">
          <h2 className="text-[11px] font-semibold leading-5 md:text-[13px]">
            {product.name}
          </h2>
          <p className="mt-1 text-[9px] text-[#c2a789] md:text-[10px]">
            {product.subtitle}
          </p>
          <p className="mt-3 text-xs font-semibold md:text-sm">
            ₹{product.price.toFixed(2)}
          </p>
        </Link>
        <div className="mt-2 flex items-center gap-3 text-[8px] font-semibold uppercase text-[#e4ad73]">
          <Link href={`/shop/${product.cartSlug}`} className="border-b border-[#e4ad73]/45 pb-0.5">View product</Link>
          <button type="button" onClick={onQuickView} className="border-b border-[#e4ad73]/25 pb-0.5">Quick view</button>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <Quantity value={quantity} onChange={setQuantity} />
          <button
            type="button"
            onClick={onAdd}
            aria-label={actionLabel === "Configure" ? `Configure ${product.name}` : `Add ${product.name} to cart`}
            className="co-shop-card-cta co-primary-cta grid size-9 shrink-0 place-items-center rounded-full text-white transition md:hidden"
          >
            <ShoppingBag size={15} />
          </button>
          <button
            type="button"
            onClick={onAdd}
            className="co-shop-card-cta co-primary-cta hidden min-h-9 flex-1 rounded-full px-3 text-[8px] font-semibold uppercase text-white transition md:block"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function useDialogScrollLock(open: boolean) {
  useBodyScrollLock(open);
}

function QuickViewGallery({ product }: { product: Product }) {
  const slides = product.gallery?.length
    ? product.gallery
    : [
        {
          src: product.image,
          alt: product.name,
          view: "Primary",
          width: 1200,
          height: 1200,
        },
      ];
  const [active, setActive] = useState(0);
  const pointerStart = useRef<number | null>(null);
  useEffect(() => setActive(0), [product.slug]);
  const move = (direction: number) =>
    setActive(
      (current) => (current + direction + slides.length) % slides.length,
    );
  const current = slides[active];
  return (
    <div
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }}
    >
      <div
        className="relative aspect-square touch-pan-y overflow-hidden rounded-[26px] bg-[#f3eee4]"
        onPointerDown={(event) => {
          pointerStart.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (pointerStart.current === null) return;
          const delta = event.clientX - pointerStart.current;
          pointerStart.current = null;
          if (Math.abs(delta) > 42) move(delta > 0 ? -1 : 1);
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.src}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.28, ease }}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              priority
              sizes="(min-width:768px) 48vw, 90vw"
              quality={95}
              placeholder="blur"
              blurDataURL={blurDataURL}
              className="object-contain p-5 md:p-8"
            />
          </motion.div>
        </AnimatePresence>
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous product image"
              className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/72 shadow-sm backdrop-blur"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next product image"
              className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/72 shadow-sm backdrop-blur"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        Image {active + 1} of {slides.length}: {current.view}
      </p>
      <div
        className="mt-3 grid grid-cols-4 gap-2"
        aria-label="Product image gallery"
      >
        {slides.slice(0, 8).map((item, index) => (
          <button
            type="button"
            key={`${item.src}-${index}`}
            onClick={() => setActive(index)}
            aria-label={`Show ${item.view} image`}
            aria-current={active === index ? "true" : undefined}
            className={cn(
              "relative aspect-square overflow-hidden rounded-[14px] border bg-white/55",
              active === index ? "border-[#214d2b]" : "border-transparent",
            )}
          >
            <Image
              src={item.src}
              alt=""
              fill
              sizes="120px"
              className="object-contain p-2"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function QuickView({
  catalog,
  product,
  open,
  onOpenChange,
  quantity,
  setQuantity,
  wished,
  toggleWishlist,
  onAdd,
}: {
  catalog: Product[];
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quantity: number;
  setQuantity: (value: number) => void;
  wished: boolean;
  toggleWishlist: () => void;
  onAdd: () => void;
}) {
  useDialogScrollLock(open);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && product && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[170] bg-[#211812]/42 backdrop-blur-[3px]"
              />
            </Dialog.Overlay>
            <div className="pointer-events-none fixed inset-0 z-[180] grid items-end p-3 md:place-items-center md:p-6">
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 22 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 22 }}
                  transition={{ duration: 0.38, ease }}
                  className="pointer-events-auto max-h-[calc(100dvh-24px)] w-full overflow-y-auto overscroll-contain rounded-[30px] border border-white/70 bg-[rgba(248,244,236,.97)] p-4 shadow-[0_30px_90px_rgba(22,15,10,.26)] [scrollbar-gutter:stable] [touch-action:pan-y] md:max-h-[88dvh] md:w-[min(980px,calc(100vw-48px))] md:p-7"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Dialog.Title className="font-['Cormorant_Garamond'] text-3xl md:text-4xl">
                        {product.name}
                      </Dialog.Title>
                      <Dialog.Description className="mt-2 text-xs text-[#6b6057]">
                        Quick view · {product.category}
                      </Dialog.Description>
                    </div>
                    <Dialog.Close
                      aria-label="Close dialog"
                      className="grid size-10 place-items-center rounded-full border border-black/8 bg-white/60"
                    >
                      <X size={18} />
                    </Dialog.Close>
                  </div>
                  <div className="mt-5 grid gap-6 md:grid-cols-[1fr_.9fr]">
                    <QuickViewGallery product={product} />
                    <div className="flex flex-col">
                      <p className="text-sm leading-7 text-[#594d43]">
                        {product.description}
                      </p>
                      <div className="mt-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[.12em]">
                          Benefits
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {product.benefits.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-black/7 bg-white/55 px-3 py-2 text-[10px]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-5 rounded-[18px] bg-white/48 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[.12em]">
                          Product information
                        </p>
                        <p className="mt-2 text-[11px] leading-6 text-[#6a6057]">
                          {product.nutrition}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <p className="text-xl font-semibold">
                          ₹{product.price.toFixed(2)}
                        </p>
                        <button
                          type="button"
                          aria-label="Toggle wishlist"
                          onClick={toggleWishlist}
                          className="grid size-11 place-items-center rounded-full border border-black/8"
                        >
                          <Heart
                            size={18}
                            fill={wished ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <Quantity value={quantity} onChange={setQuantity} />
                        <button
                          type="button"
                          onClick={onAdd}
                          className="co-primary-cta min-h-11 flex-1 rounded-full bg-[#214d2b] text-[10px] font-semibold uppercase text-white"
                        >
                          Add to cart
                        </button>
                      </div>
                      <Link
                        href={`/shop/${product.cartSlug}`}
                        className="mt-3 inline-flex min-h-10 items-center justify-center rounded-full border border-[#214d2b]/25 px-5 text-[9px] font-semibold uppercase text-[#214d2b]"
                      >
                        View full product
                      </Link>
                      <div className="mt-6">
                        <p className="text-[10px] font-semibold uppercase tracking-[.12em]">
                          Related products
                        </p>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {catalog
                            .filter(
                              (item) =>
                                item.category === product.category &&
                                item.slug !== product.slug,
                            )
                            .slice(0, 3)
                            .map((item) => (
                              <div
                                key={item.slug}
                                className="rounded-[14px] bg-white/55 p-2"
                              >
                                <div className="relative aspect-square overflow-hidden rounded-[10px]">
                                  <ProductImage product={item} sizes="120px" />
                                </div>
                                <p className="mt-2 line-clamp-2 text-[8px] font-medium">
                                  {item.name}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
