import { coconutScrollAssets } from "@/lib/experience/coconut-scroll-config";

export function CoconutBottleFallback({ compact = false }: { compact?: boolean }) {
  const frame = coconutScrollAssets.final;

  return (
    <section
      className={compact ? "relative min-h-[78svh] overflow-hidden bg-[#e9dbc2]" : "relative min-h-[100svh] overflow-hidden bg-[#e9dbc2]"}
      aria-label="From coconut to .CO bottle"
    >
      <picture>
        <source media="(min-width: 768px)" srcSet={frame.desktop.avif} type="image/avif" />
        <source media="(min-width: 768px)" srcSet={frame.desktop.jpeg} type="image/jpeg" />
        <source srcSet={frame.mobile.avif} type="image/avif" />
        <img
          src={frame.mobile.jpeg}
          alt={frame.alt}
          width={frame.mobile.width}
          height={frame.mobile.height}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      </picture>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,239,224,.05),transparent_55%,rgba(37,65,33,.22))]" />
      <div className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-4 rounded-full border border-white/55 bg-white/38 px-4 py-2 text-[9px] font-semibold uppercase tracking-[.16em] text-[#274b2b] shadow-[0_12px_35px_rgba(53,39,30,.12)] backdrop-blur-xl md:left-8 md:text-[10px]">
        From nature to .CO
      </div>
    </section>
  );
}
