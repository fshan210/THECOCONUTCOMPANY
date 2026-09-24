# Final Gate C: mobile LCP root cause

Measurement date: 2026-09-24. The immutable baseline is source `05ce63e6d574dcd4078c708ee87c282583a53a64`, Preview `dpl_EXWmwtXBC9uZq5Gsot7oWstrWBMj`. Each baseline route was run three times with Lighthouse 13.5.0, a 390 × 844 mobile viewport, and the same default mobile throttling. LCP below is Lighthouse's simulated lab metric; the insight timing breakdown is observed trace timing and is not additive to that simulated value.

| Route | Baseline LCP runs (ms) | Median | Median transfer | Candidate element |
| --- | --- | ---: | ---: | --- |
| Home | 7,370 / 6,360 / 4,443 | 6,360 ms | 2.67 MB | `CinematicHomePage` hero coconut image |
| Recipes | 5,556 / 5,331 / 5,031 | 5,331 ms | 1.86 MB | `recipe-hero-copy h1 > span` (“One coconut.”) |
| Journal | 4,268 / 2,110 / 2,017 | 2,110 ms | 1.68 MB | `JournalOpening` hero `<picture><img>` |

## Home

**Before.** The exact LCP image was `/assets/home/co-hero-coconut-transparent-v1.webp`, a 1920 × 1080 transparent WebP. The median trace transferred 307,692 bytes. Its request started around 770 ms and ended around 1,060 ms; the observed resource load duration was 291 ms and render delay 159 ms. It was present in initial HTML, eager, preloaded once, and `fetchpriority=high`. Document TTFB was 79–84 ms across runs. Neither server response nor late discovery explains the simulated 6.36 s median. The image's encoding was an avoidable byte cost on the critical path. A full video was not loaded eagerly.

**Change and local evidence.** Re-encoded the same 1920 × 1080 artwork as a separate 69 KB WebP and pointed only the active cinematic hero at it. The original stays in the repository. Flattened onto the actual dark hero background, decoded-image PSNR is 40.2 dB. On two side-by-side local production builds from the exact base and candidate source, three Lighthouse runs each gave Home medians of 10,512 ms before and 7,763 ms after (−2,749 ms, −26%). The LCP candidate remained the hero image, now 70,294 transferred bytes; total transfer fell by about 0.24 MB. This is a local comparison, not an immutable Preview after measurement.

**Residual.** The simulated lab median still exceeds 3 s. No claim of field Core Web Vitals compliance or Production readiness follows from the local result.

## Recipes

**Before.** The LCP candidate was the first hero heading span. Its text exists in server HTML. The image transfer was already optimized and was not LCP. The heading had `animation: recipe-rise ... both`, whose initial keyframe set `opacity: 0`; the median Preview trace attributed 1,739 ms to element render delay. The editorial font requests also completed near the observed text paint, so the delay cannot be assigned entirely to animation without a trace experiment. Document TTFB was 79–92 ms.

**Change and local evidence.** The heading now translates into place while remaining opaque from its first frame. Lower-page reveal behavior and reduced-motion behavior remain intact. Two side-by-side local production builds yielded three-run Recipes medians of 5,695 ms before and 4,892 ms after (−803 ms, −14%). Candidate trace render delay was about 63–72 ms in those local runs; transfer stayed near 1.88 MB. This shows the reveal was a real bottleneck without claiming it was the only one.

**Residual.** Simulated LCP remains above 3 s. The page is client-owned, though its critical heading is server-rendered and paintable before hydration. Further major gains likely need a separate, controlled examination of CSS/font priority and noncritical route work; no broad client-boundary change was made in this gate.

## Journal

**Before.** The LCP candidate is the hero image in `JournalOpening`. At 390 px the `<picture>` selects `/assets/redesign/journal/cinematic/hero-mobile.webp`, 80,821 transferred bytes in the median trace. It starts around 944 ms, ends around 1,385 ms, and paints with about 77 ms render delay. The image is in initial server HTML, eager by default, and high priority. Intrinsic dimensions are 1448 × 1086 on the fallback `<img>`; CSS reserves the hero frame, and observed CLS was below 0.002.

**Change.** None. The three-run median is already under 2.5 s. One 4.27 s outlier remains; a single outlier does not justify changing its image or animation. Repeat on a fresh Preview before declaring the gate closed.

## Measurement limits

The local comparison and immutable Preview baseline have different origin and cache conditions. Use a fresh exact-SHA Preview for final after measurements. Authenticated endpoints cannot be inferred from these public Lighthouse reports. Do not mix simulated LCP with observed trace subparts or claim that a low trace paint timestamp proves the throttled target.
