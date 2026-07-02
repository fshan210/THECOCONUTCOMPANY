"use client";

import Link from "next/link";
import { ArrowRight, Check, Search, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import type { LaunchPage } from "@/lib/launch-pages";

const searchable = [
  ["Shop coconut products", "/shop", "Products"], ["Coconut recipes", "/recipes", "Recipes"], ["Our story", "/about", "Company"], ["Sustainability", "/sustainability", "Impact"], ["Founders", "/founders", "Company"], ["Journal", "/journal", "Stories"], ["Help and FAQs", "/faqs", "Support"]
] as const;

export function UtilityPage({ page }: { page: LaunchPage }) {
  const [query, setQuery] = useState("");
  const [trackingStatus, setTrackingStatus] = useState("");
  const results = useMemo(() => searchable.filter((item) => item.join(" ").toLowerCase().includes(query.toLowerCase())), [query]);

  return <div className="min-h-[70vh] bg-[#f8f4ec] px-4 pb-20 pt-8 md:px-8 md:pt-14"><div className="mx-auto max-w-[1180px]"><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#214d2b]">{page.eyebrow}</p><h1 className="mt-5 max-w-[15ch] font-['Cormorant_Garamond'] text-[52px] leading-[.9] tracking-[-.035em] text-[#2a1b13] md:text-[76px]">{page.title}</h1><p className="mt-6 max-w-[58ch] text-sm leading-7 text-[#62574e]">{page.intro}</p>
    {page.mode === "search" ? <div className="mt-10"><label htmlFor="site-search" className="sr-only">Search the .CO website</label><div className="flex min-h-14 items-center rounded-full border border-black/8 bg-white/65 px-5 shadow-sm"><Search size={18}/><input id="site-search" autoFocus value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Products, recipes, stories…" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"/></div><div className="mt-5 grid gap-3 md:grid-cols-2">{results.map(([title,href,type])=><Link key={href} href={href} className="flex min-h-20 items-center justify-between rounded-[22px] border border-black/6 bg-white/55 p-5"><span><b className="block text-sm">{title}</b><small className="mt-1 block text-[#6b6057]">{type}</small></span><ArrowRight size={17}/></Link>)}</div></div> : null}
    {page.mode === "track" ? <form className="mt-10 max-w-[620px] rounded-[28px] border border-black/6 bg-white/58 p-5 md:p-7" onSubmit={(event)=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;setTrackingStatus("Tracking activates when live ordering launches. No matching live order exists yet.");}}><label htmlFor="order-reference" className="text-xs font-semibold">Order reference</label><input id="order-reference" required minLength={4} autoComplete="off" className="mt-3 min-h-12 w-full rounded-[14px] border border-black/8 bg-white px-4 text-sm outline-none focus:border-[#214d2b]" placeholder="Example: CO-0000"/><button className="co-primary-cta mt-4 min-h-12 w-full rounded-full bg-[#214d2b] text-[10px] font-semibold uppercase text-white">Check status</button><p className="mt-4 text-xs leading-5 text-[#655a52]" role="status">{trackingStatus}</p></form> : null}
    {page.mode === "cart" ? <div className="mt-10 flex max-w-[620px] items-center gap-4 rounded-[28px] border border-black/6 bg-white/58 p-6"><span className="grid size-12 place-items-center rounded-full bg-[#e5ebdf] text-[#214d2b]"><ShoppingBag size={20}/></span><p className="text-sm leading-6">Your saved basket remains available from the bag button in the header.</p></div> : null}
    {page.sections.length ? <div className="mt-12 grid gap-4 md:grid-cols-3">{page.sections.map((section)=><article key={section.title} className="rounded-[26px] border border-black/6 bg-white/58 p-6 shadow-[0_15px_45px_rgba(42,27,19,.045)]"><span className="grid size-10 place-items-center rounded-full bg-[#e8ecdf] text-[#214d2b]"><Check size={16}/></span><h2 className="mt-6 font-['Cormorant_Garamond'] text-3xl leading-none">{section.title}</h2><p className="mt-4 text-xs leading-6 text-[#655a52]">{section.body}</p></article>)}</div> : null}
    {page.action ? <Link href={page.action.href} className="co-primary-cta mt-10 inline-flex min-h-12 items-center gap-4 rounded-full bg-[#214d2b] px-6 text-[10px] font-semibold uppercase text-white">{page.action.label}<ArrowRight size={14}/></Link> : null}
  </div></div>;
}
