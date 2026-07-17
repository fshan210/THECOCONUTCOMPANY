"use client";

import Link from "next/link";
import { Heart, Search, Share2, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

export type SavedCard = { id: string; kind: "product" | "recipe" | "journal" | "community" | "recent"; title: string; detail: string; image: string; href: string; cartSlug?: string };

export function SavedContentGrid({ initialItems }: { initialItems: SavedCard[] }) {
  const cart = useCart();
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const visible = useMemo(() => items.filter((item) => `${item.title} ${item.detail}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  async function remove(item: SavedCard) {
    const response = await fetch("/api/customer/saved", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind: item.kind, itemId: item.id }) });
    if (response.ok) setItems((current) => current.filter((candidate) => candidate.id !== item.id || candidate.kind !== item.kind));
  }
  return <section className="bg-[var(--co-cream)] px-4 pb-20"><div className="mx-auto max-w-[1180px]">
    <label className="flex h-12 items-center gap-3 rounded-full border border-black/8 bg-white/70 px-5"><Search size={16}/><span className="sr-only">Search saved items</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search saved items" className="min-w-0 flex-1 bg-transparent text-sm outline-none"/></label>
    {visible.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visible.map((item)=><article key={`${item.kind}-${item.id}`} className="overflow-hidden rounded-[28px] border border-black/7 bg-white/70 shadow-[0_14px_38px_rgba(42,27,19,.06)]"><Link href={item.href} className="group relative block aspect-[4/3] overflow-hidden bg-[#f3eee4]"><ResponsiveImage src={item.image} alt={item.title} fill sizes="(min-width:1024px) 31vw, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.03]"/></Link><div className="p-5"><p className="text-[9px] font-semibold uppercase tracking-[.12em] text-[#214d2b]">{item.kind === "recent" ? "Recently viewed" : item.kind}</p><Link href={item.href} className="mt-2 block font-['Cormorant_Garamond'] text-3xl leading-none">{item.title}</Link><p className="mt-3 text-xs leading-5 text-[#695e55]">{item.detail}</p><div className="mt-5 flex gap-2">{item.cartSlug&&<button onClick={()=>cart.addItem(item.cartSlug!)} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#214d2b] px-4 text-xs font-semibold text-white"><ShoppingBag size={14}/>Move to cart</button>}<button onClick={()=>navigator.share?.({title:item.title,url:new URL(item.href,location.origin).href})} aria-label={`Share ${item.title}`} className="grid size-10 place-items-center rounded-full border border-black/10"><Share2 size={15}/></button><button onClick={()=>void remove(item)} aria-label={`Remove ${item.title}`} className="grid size-10 place-items-center rounded-full border border-black/10"><Trash2 size={15}/></button></div></div></article>)}</div> : <div className="mt-6 rounded-[28px] border border-black/7 bg-white/60 px-6 py-16 text-center"><Heart className="mx-auto text-[#214d2b]"/><h2 className="mt-4 font-['Cormorant_Garamond'] text-4xl">Nothing saved yet.</h2><p className="mt-3 text-sm text-[#695e55]">Use the heart on products, recipes, journal stories, and community posts to keep them here.</p></div>}
  </div></section>;
}
