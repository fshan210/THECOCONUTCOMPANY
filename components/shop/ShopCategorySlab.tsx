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
    <section className="relative z-20 -mt-1 bg-[#23130c] px-4 pb-9 md:px-8 md:pb-12">
      <div className="mx-auto max-w-[1340px] overflow-x-auto rounded-[28px] border border-[#db9f65]/24 bg-[#492718]/68 p-2 shadow-[inset_0_1px_0_rgba(255,235,211,.08),0_22px_55px_rgba(0,0,0,.2)] backdrop-blur-xl [scrollbar-width:none]">
        <div className="grid min-w-[780px] grid-cols-6">
          {shopCategories.map(({ label, value: category, description, icon: Icon }, index) => (
            <button
              type="button"
              key={category}
              aria-pressed={value === category}
              onClick={() => onChange(category)}
              className={cn(
                "group min-h-[112px] border-r border-[#f4d0aa]/10 px-4 py-4 text-center text-[#e7c8a9] transition last:border-r-0 hover:bg-[#8c4f2e]/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#e0ae78]",
                value === category && "rounded-[20px] bg-[#774127]/48 text-[#fff1dd] shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_12px_26px_rgba(0,0,0,.16)]",
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
