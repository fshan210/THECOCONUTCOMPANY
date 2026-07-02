"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChefHat, Clock3, Heart, Printer, Share2, Timer, UtensilsCrossed } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { MobileBottomNav, ReferenceFooter, ReferenceHeader } from "@/components/home/ReferenceHomePage";
import { DietaryVersions, ProductsUsed } from "./ReferenceRecipesPage";
import { recipes, type RecipeItem } from "./recipe-data";

const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCc+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0nI2YzZWVlNCcvPjwvc3ZnPg==";

export function RecipeDetailPage({ recipe }: { recipe: RecipeItem }) {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: .001 });
  const related = recipes.filter((item) => item.slug !== recipe.slug).slice(0, 3);

  useEffect(() => {
    const value = window.localStorage.getItem(`co-recipe-${recipe.slug}`);
    setSaved(value === "saved");
  }, [recipe.slug]);

  const toggleSave = () => {
    const next = !saved;
    setSaved(next);
    window.localStorage.setItem(`co-recipe-${recipe.slug}`, next ? "saved" : "");
  };

  const share = async () => {
    if (navigator.share) await navigator.share({ title: recipe.title, url: window.location.href });
    else await navigator.clipboard.writeText(window.location.href);
    setShared(true);
    window.setTimeout(() => setShared(false), 1600);
  };

  return <div className="min-h-screen bg-[#f8f4ec] font-['Inter'] text-[#2a1b13]">
    <motion.div style={{scaleX}} className="fixed inset-x-0 top-0 z-[200] h-1 origin-left bg-[#214d2b]" />
    <ReferenceHeader />
    <main className="px-4 pb-14 pt-5 md:px-8 md:pt-9">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-between"><Link href="/recipes" className="inline-flex min-h-10 items-center gap-2 text-[10px] font-semibold"><ArrowLeft size={15}/> Back to Recipes</Link><div className="flex gap-2"><button type="button" onClick={toggleSave} aria-label="Save recipe" className="grid size-10 place-items-center rounded-full border border-black/8"><Heart size={17} fill={saved?"currentColor":"none"}/></button><button type="button" onClick={share} aria-label="Share recipe" className="grid size-10 place-items-center rounded-full border border-black/8">{shared?<Check size={17}/>:<Share2 size={17}/>}</button><button type="button" onClick={()=>window.print()} aria-label="Print recipe" className="hidden size-10 place-items-center rounded-full border border-black/8 md:grid"><Printer size={17}/></button></div></div>
        <section className="mt-5 grid gap-8 md:grid-cols-[1.08fr_.92fr] md:items-center"><div className="relative aspect-[4/5] overflow-hidden rounded-[30px] md:aspect-[5/4]"><Image src={recipe.image} alt={recipe.title} fill priority sizes="(min-width:768px) 55vw, 94vw" quality={95} placeholder="blur" blurDataURL={blurDataURL} className="object-cover"/></div><div><p className="text-[9px] font-semibold uppercase tracking-[.14em] text-[#214d2b]">{recipe.category} recipe</p><h1 className="mt-4 font-['Cormorant_Garamond'] text-[50px] leading-[.9] tracking-[-.03em] md:text-[68px]">{recipe.title}</h1><p className="mt-6 max-w-[480px] text-sm leading-7 text-[#5f554d]">{recipe.description}</p><div className="mt-7 grid grid-cols-3 gap-3"><Stat icon={Clock3} title={`${recipe.time} min`} body="Prep time"/><Stat icon={Timer} title={recipe.difficulty} body="Difficulty"/><Stat icon={UtensilsCrossed} title="2 servings" body="Yield"/></div><div className="mt-7 flex gap-3"><button type="button" onClick={()=>document.getElementById("method")?.scrollIntoView({behavior:"smooth"})} className="inline-flex min-h-12 items-center gap-4 rounded-full bg-[#214d2b] px-6 text-[9px] font-semibold uppercase text-white">Start cooking <ArrowRight size={14}/></button><button type="button" onClick={toggleSave} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#214d2b]/35 px-5 text-[9px] font-semibold uppercase"><Heart size={14} fill={saved?"currentColor":"none"}/>{saved?"Saved":"Save recipe"}</button></div></div></section>

        <section id="method" className="mt-12 grid gap-5 md:grid-cols-[1fr_1fr_.78fr]"><div className="rounded-[28px] border border-black/6 bg-white/58 p-6"><p className="text-[9px] font-semibold uppercase tracking-[.14em] text-[#214d2b]">Ingredients</p><h2 className="mt-3 font-['Cormorant_Garamond'] text-4xl">Everything you need.</h2><ul className="mt-6 divide-y divide-black/6">{recipe.ingredients.map((item)=><li key={item} className="flex items-center gap-3 py-3 text-xs"><span className="grid size-6 place-items-center rounded-full border border-[#214d2b]/18"><Check size={12}/></span>{item}</li>)}</ul></div><div className="rounded-[28px] border border-black/6 bg-white/58 p-6"><p className="text-[9px] font-semibold uppercase tracking-[.14em] text-[#214d2b]">Preparation</p><h2 className="mt-3 font-['Cormorant_Garamond'] text-4xl">Make it beautifully.</h2><ol className="mt-6 space-y-5">{recipe.steps.map((step,index)=><li key={step} className="grid grid-cols-[34px_1fr] gap-3"><span className="grid size-8 place-items-center rounded-full bg-[#214d2b] text-[10px] font-semibold text-white">{index+1}</span><p className="pt-1 text-xs leading-6">{step}</p></li>)}</ol></div><div className="space-y-5"><div className="rounded-[28px] bg-[#193a20] p-6 text-white"><ChefHat size={24}/><h2 className="mt-5 font-['Cormorant_Garamond'] text-3xl">Goodness at a glance.</h2><div className="mt-5 space-y-3">{recipe.nutrition.map((item)=><p key={item} className="flex items-center gap-2 text-[10px]"><Check size={13}/>{item}</p>)}</div></div><ProductsUsed products={recipe.products}/></div></section>
        <section className="mt-5"><DietaryVersions items={recipe.variations}/></section>
        <section className="mt-14"><p className="text-[9px] font-semibold uppercase tracking-[.14em] text-[#214d2b]">More recipes you’ll love</p><h2 className="mt-3 font-['Cormorant_Garamond'] text-4xl">Keep the goodness going.</h2><div className="mt-6 grid gap-3 md:grid-cols-3">{related.map((item)=><Link href={`/recipes/${item.slug}`} key={item.slug} className="group grid grid-cols-[120px_1fr] gap-4 rounded-[22px] border border-black/6 bg-white/55 p-3"><span className="relative aspect-square overflow-hidden rounded-[16px]"><Image src={item.image} alt={item.title} fill sizes="120px" quality={90} className="object-cover transition duration-500 group-hover:scale-105"/></span><span className="flex flex-col justify-center"><b className="font-['Cormorant_Garamond'] text-2xl leading-none">{item.title}</b><span className="mt-3 text-[9px] text-[#6f655d]">{item.time} min · {item.difficulty}</span></span></Link>)}</div></section>
      </div>
    </main>
    <button type="button" onClick={()=>document.getElementById("method")?.scrollIntoView({behavior:"smooth"})} className="fixed bottom-[58px] left-4 right-4 z-[104] min-h-12 rounded-full bg-[#214d2b] text-[9px] font-semibold uppercase text-white shadow-[0_14px_35px_rgba(33,77,43,.28)] md:hidden">View full recipe <ArrowRight className="ml-2 inline" size={14}/></button>
    <ReferenceFooter /><MobileBottomNav />
  </div>;
}

function Stat({icon:Icon,title,body}:{icon:typeof Clock3;title:string;body:string}){return <div className="rounded-[18px] border border-black/6 bg-white/48 p-3"><Icon size={16}/><b className="mt-3 block text-[10px]">{title}</b><span className="mt-1 block text-[8px] text-[#73685f]">{body}</span></div>}
