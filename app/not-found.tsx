import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return <section className="grid min-h-[70vh] place-items-center bg-[#f8f4ec] px-5 py-16 text-center"><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#214d2b]">404 · Lost in the grove</p><h1 className="mt-5 font-['Cormorant_Garamond'] text-[72px] leading-[.82] md:text-[104px]">This coconut<br/>rolled away.</h1><p className="mx-auto mt-7 max-w-md text-sm leading-7 text-[#655a52]">The page is not here, but the rest of the .CO world is close by.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/" className="co-primary-cta inline-flex min-h-12 items-center gap-3 rounded-full bg-[#214d2b] px-6 text-[10px] font-semibold uppercase text-white">Back home <ArrowRight size={14}/></Link><Link href="/search" className="inline-flex min-h-12 items-center gap-3 rounded-full border border-[#214d2b]/25 px-6 text-[10px] font-semibold uppercase"><Search size={14}/>Search .CO</Link></div></div></section>;
}
