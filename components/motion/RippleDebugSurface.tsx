"use client";

import { useEffect, useRef, useState } from "react";

type Status = Record<string, string>;

const imageUrl = "/assets/sustainability/rc1/water-conservation-facility.png";

export function RippleDebugSurface() {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>({
    "plugin imported": "pending", "jQuery present": "pending", "element found": "pending",
    "background image": imageUrl, "background image loaded": "pending", "CORS status": "same-origin",
    "WebGL available": "pending", "OES_texture_float": "pending", "OES_texture_float_linear": "pending",
    "ripples initialized": "pending", "auto drop fired": "0", "pointer event received": "0",
    width: "0", height: "0",
  });

  useEffect(() => {
    const element = surfaceRef.current;
    if (!element) return undefined;
    let disposed = false;
    let timer = 0;
    let detach: (() => void) | undefined;
    let drops = 0;
    let pointers = 0;
    const write = (patch: Status) => !disposed && setStatus((current) => ({ ...current, ...patch }));
    const image = new Image();
    image.onload = () => write({ "background image loaded": "PASS" });
    image.onerror = () => write({ "background image loaded": "FAIL" });
    image.src = imageUrl;

    void (async () => {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
      const extensions = gl ? {
        "WebGL available": "PASS",
        "OES_texture_float": gl.getExtension("OES_texture_float") ? "PASS" : "FAIL",
        "OES_texture_float_linear": gl.getExtension("OES_texture_float_linear") ? "PASS" : "FAIL",
      } : { "WebGL available": "FAIL", "OES_texture_float": "N/A", "OES_texture_float_linear": "N/A" };
      write({ "element found": "PASS", width: String(element.clientWidth), height: String(element.clientHeight), ...extensions });
      if (!gl) return;
      try {
        const jqueryModule = await import("jquery");
        const $ = jqueryModule.default;
        window.jQuery = $; window.$ = $;
        write({ "jQuery present": "PASS" });
        await import("jquery.ripples");
        write({ "plugin imported": "PASS" });
        if (disposed) return;
        const surface = $(element);
        surface.ripples({ imageUrl, resolution: 256, dropRadius: 28, perturbance: .055, interactive: true, crossOrigin: "anonymous" });
        write({ "ripples initialized": "PASS" });
        const drop = (x: number, y: number) => {
          try { surface.ripples("drop", x, y, 34, .18); drops += 1; write({ "auto drop fired": String(drops) }); } catch (error) { write({ "ripples initialized": `FAIL: ${String(error)}` }); }
        };
        const autoDrops = [[.5, .5], [.2, .25], [.78, .74]] as const;
        let index = 0;
        drop(element.clientWidth * .5, element.clientHeight * .5);
        timer = window.setInterval(() => { const point = autoDrops[index++ % autoDrops.length]; drop(element.clientWidth * point[0], element.clientHeight * point[1]); }, 1100);
        const onPointer = () => { pointers += 1; write({ "pointer event received": String(pointers) }); };
        element.addEventListener("pointermove", onPointer, { passive: true });
        const resize = () => { surface.ripples("updateSize"); write({ width: String(element.clientWidth), height: String(element.clientHeight) }); };
        window.addEventListener("resize", resize, { passive: true });
        detach = () => { element.removeEventListener("pointermove", onPointer); window.removeEventListener("resize", resize); };
      } catch (error) {
        write({ "ripples initialized": `FAIL: ${error instanceof Error ? error.message : String(error)}` });
      }
      return undefined;
    })();
    return () => { disposed = true; window.clearInterval(timer); detach?.(); try { window.$?.(element).ripples("destroy"); } catch { /* Diagnostic route retains its image fallback. */ } };
  }, []);

  return <section data-ripple-debug-surface className="fixed inset-0 z-[999] grid h-[100svh] w-[100vw] place-items-end overflow-hidden bg-[#181713] p-5 text-[#fff8ea] md:p-8">
    <div ref={surfaceRef} className="absolute inset-0" style={{ backgroundImage: `url("${imageUrl}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
    <aside className="relative z-10 w-full max-w-sm rounded-2xl border border-white/35 bg-black/50 p-4 font-mono text-[11px] leading-5 shadow-2xl backdrop-blur-sm">
      <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[.14em]">.CO ripple diagnostic</p>
      {Object.entries(status).map(([label, value]) => <div key={label} className="flex justify-between gap-5 border-t border-white/10 py-1"><span className="text-white/65">{label}</span><strong className={value.startsWith("FAIL") ? "text-red-300" : value === "PASS" ? "text-emerald-300" : "text-[#fff0bc]"}>{value}</strong></div>)}
    </aside>
  </section>;
}
