"use client";

import { Droplets, Grid2X2, IceCreamBowl, PackageOpen, ShoppingBasket, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const shopCategories = [
  { label: "All Products", value: "All Products", description: "View everything", icon: Grid2X2 },
  { label: ".CO Water", value: "Coconut Water", description: "Hydration", icon: Droplets },
  { label: ".CO Kitchen", value: "Kitchen", description: "Kitchen staples", icon: ShoppingBasket },
  { label: "BOTANiCA", value: "BOTANiCA", description: "Personal care", icon: Sparkles },
  { label: "MELT", value: "Ice Cream", description: "Indulgence", icon: IceCreamBowl },
  { label: "Bundles & Gifts", value: "Bundles & Gifts", description: "Curated sets", icon: PackageOpen },
] as const;

export function ShopCategorySlab({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <section className="co-shop-categories">
      <div className="co-shop-categories__scroller">
        <div className="co-shop-categories__grid">
          {shopCategories.map(({ label, value: category, description, icon: Icon }, index) => (
            <button
              type="button"
              key={category}
              aria-pressed={value === category}
              onClick={() => onChange(category)}
              className={cn(
                "co-shop-category group",
                value === category && "is-active",
              )}
            >
              <Icon className="mx-auto transition-transform duration-200 group-active:translate-y-px" size={22} strokeWidth={1.5} />
              <span className="mt-2 block text-[11px] font-semibold">{label}</span>
              <span className="mt-1 block text-[8px] text-[#d7b491]/68">{description}</span>
              <span className="sr-only">Category {index + 1} of {shopCategories.length}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
