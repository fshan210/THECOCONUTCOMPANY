import { coconutScrollAssets } from "@/lib/experience/coconut-scroll-config";

export function CoconutBottleFallback({ compact = false }: { compact?: boolean }) {
  const desktop = coconutScrollAssets.desktop;
  const mobile = coconutScrollAssets.mobile;

  return (
    <section className="bg-[#f7f2e8] px-3 py-12 md:px-8 md:py-16" aria-label="From coconut to .CO bottle">
      <div className={`mx-auto grid max-w-[1200px] overflow-hidden rounded-[30px] border border-white/72 bg-white/50 p-3 shadow-[0_28px_75px_rgba(53,39,30,.12)] md:grid-cols-[.72fr_1.28fr] md:gap-5 md:rounded-[36px] md:p-5 ${compact ? "min-h-[520px]" : "min-h-[min(64svh,680px)]"}`}>
        <div className="flex flex-col justify-center px-5 py-7">
          <p className="text-[9px] font-semibold uppercase tracking-[.17em] text-[#305a34]">From origin to everyday</p>
          <h2 className="mt-5 font-['Cormorant_Garamond'] text-[42px] leading-[.94] tracking-[-.025em] text-[#35271e]">Made for living.</h2>
          <p className="mt-4 max-w-[300px] text-xs leading-6 text-[#665b51]">The final .CO bottle, resolved without motion for your accessibility preference.</p>
        </div>
        <div className="relative min-h-[52svh] overflow-hidden rounded-[24px] md:min-h-0 md:rounded-[28px]">
          <picture>
            <source media="(min-width: 768px)" srcSet={desktop.avif[11]} type="image/avif" />
            <source media="(min-width: 768px)" srcSet={desktop.jpeg[11]} type="image/jpeg" />
            <source srcSet={mobile.avif[11]} type="image/avif" />
            <img src={mobile.jpeg[11]} alt={coconutScrollAssets.alt} width={mobile.width} height={mobile.height} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
          </picture>
        </div>
      </div>
    </section>
  );
}
