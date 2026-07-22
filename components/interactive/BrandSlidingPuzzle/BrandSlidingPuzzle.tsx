"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Eye, Images, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { motionEase, useMotionQuality } from "@/lib/motion";
import {
  createSolvedBoard,
  getLegalMoves,
  isSolved,
  moveTile,
  shuffleSolvable,
  tileBackgroundPosition,
  tileForArrow,
} from "./puzzle-engine";
import { defaultPuzzleImages } from "./puzzle-images";
import { trackPuzzleEvent } from "./puzzle-analytics";
import {
  beginPuzzlePreview,
  createPuzzlePreviewState,
  endPuzzlePreview,
} from "./puzzle-session";
import type {
  PuzzleBoard,
  PuzzleGrid,
  PuzzleImage,
  PuzzlePromotion,
  PuzzleResult,
  PuzzleStatus,
} from "./puzzle-types";

const desktopGrid: PuzzleGrid = { columns: 4, rows: 4 };
const mobileGrid: PuzzleGrid = { columns: 3, rows: 4 };
const defaultPromotion: PuzzlePromotion = {
  eyebrow: "Puzzle complete",
  title: "Every part has a purpose.",
  body: "See how .CO is building a more thoughtful coconut ecosystem.",
  ctaLabel: "Explore our approach",
  ctaHref: "/sustainability",
};

export interface BrandSlidingPuzzleProps {
  images?: PuzzleImage[];
  imageSrc?: string;
  imageAlt?: string;
  grid?: PuzzleGrid;
  promotion?: PuzzlePromotion;
  logoSrc?: string;
  initialShuffleMoves?: number;
  onSolved?: (result: PuzzleResult) => void;
  className?: string;
}

export function BrandSlidingPuzzle({
  images,
  imageSrc,
  imageAlt = "Exploded coconut showing how every layer can be used",
  grid: requestedGrid,
  promotion = defaultPromotion,
  initialShuffleMoves,
  onSolved,
  className = "",
}: BrandSlidingPuzzleProps = {}) {
  const quality = useMotionQuality();
  const imageOptions = useMemo<PuzzleImage[]>(() => {
    if (images?.length) return images;
    if (imageSrc) {
      return [{ id: "custom", title: ".CO Coconut", subtitle: "Every part has a purpose", src: imageSrc, alt: imageAlt }];
    }
    return defaultPuzzleImages;
  }, [imageAlt, imageSrc, images]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = imageOptions[activeImageIndex] ?? imageOptions[0];
  const [grid, setGrid] = useState<PuzzleGrid>(requestedGrid ?? desktopGrid);
  const [board, setBoard] = useState<PuzzleBoard>(() => createSolvedBoard(requestedGrid ?? desktopGrid));
  const [status, setStatus] = useState<PuzzleStatus>("ready");
  const [moves, setMoves] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [preview, setPreview] = useState(createPuzzlePreviewState);
  const startedAt = useRef(Date.now());
  const previewTimer = useRef<number | null>(null);
  const requestedColumns = requestedGrid?.columns;
  const requestedRows = requestedGrid?.rows;
  const activeImageSrc = grid.columns === 3 ? activeImage.thumbnailSrc ?? activeImage.src : activeImage.src;

  const restart = (nextGrid = grid, imageId = activeImage?.id) => {
    const next = shuffleSolvable(nextGrid, initialShuffleMoves);
    if (previewTimer.current) window.clearTimeout(previewTimer.current);
    setGrid(nextGrid);
    setBoard(next);
    setMoves(0);
    setElapsedSeconds(0);
    setPreview(createPuzzlePreviewState());
    setStatus("playing");
    startedAt.current = Date.now();
    trackPuzzleEvent({
      event: status === "complete" ? "puzzle_replay" : "puzzle_start",
      grid: nextGrid,
      moves: 0,
      elapsedMs: 0,
      imageId,
      previewsRemaining: 3,
    });
  };

  useEffect(() => {
    if (requestedColumns && requestedRows) {
      restart({ columns: requestedColumns, rows: requestedRows });
      return;
    }
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => restart(media.matches ? mobileGrid : desktopGrid);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
    // Restart intentionally owns a fresh board when responsive mode changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedColumns, requestedRows]);

  useEffect(() => {
    if (status !== "playing") return;
    const timer = window.setInterval(() => setElapsedSeconds(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => () => {
    if (previewTimer.current) window.clearTimeout(previewTimer.current);
  }, []);

  const available = useMemo(() => new Set(getLegalMoves(board, grid)), [board, grid]);
  const play = (tile: number) => {
    if (!available.has(tile) || status === "complete" || preview.visible) return;
    const next = moveTile(board, tile, grid);
    const nextMoves = moves + 1;
    const elapsedMs = Date.now() - startedAt.current;
    setBoard(next);
    setMoves(nextMoves);
    trackPuzzleEvent({ event: "puzzle_move", grid, moves: nextMoves, elapsedMs, imageId: activeImage.id, previewsRemaining: preview.remaining });
    if (isSolved(next, grid)) {
      const result = { moves: nextMoves, elapsedMs, grid, imageId: activeImage.id };
      setStatus("complete");
      trackPuzzleEvent({ event: "puzzle_complete", ...result, previewsRemaining: preview.remaining });
      onSolved?.(result);
    }
  };

  const handleBoardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!event.key.startsWith("Arrow") || preview.visible) return;
    const tile = tileForArrow(board, grid, event.key);
    if (tile == null) return;
    event.preventDefault();
    play(tile);
  };

  const showPreview = () => {
    const next = beginPuzzlePreview(preview);
    if (next === preview) return;
    setPreview(next);
    trackPuzzleEvent({ event: "puzzle_preview", grid, moves, elapsedMs: Date.now() - startedAt.current, imageId: activeImage.id, previewsRemaining: next.remaining });
    previewTimer.current = window.setTimeout(() => {
      setPreview((current) => endPuzzlePreview(current));
      previewTimer.current = null;
    }, 3000);
  };

  const hidePreview = () => {
    if (previewTimer.current) window.clearTimeout(previewTimer.current);
    previewTimer.current = null;
    setPreview((current) => endPuzzlePreview(current));
  };

  const chooseImage = (index: number) => {
    const normalizedIndex = (index + imageOptions.length) % imageOptions.length;
    const nextImage = imageOptions[normalizedIndex];
    setActiveImageIndex(normalizedIndex);
    restart(grid, nextImage.id);
    trackPuzzleEvent({ event: "puzzle_image_change", grid, moves: 0, elapsedMs: 0, imageId: nextImage.id, previewsRemaining: 3 });
  };

  return (
    <section className={`px-3 pb-7 md:px-8 md:pb-8 ${className}`} aria-labelledby="brand-puzzle-title">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {status === "complete" ? `Puzzle complete in ${moves} moves and ${elapsedSeconds} seconds.` : `Puzzle in progress. ${moves} moves.`}
      </p>
      <div className="mx-auto max-w-[1320px] rounded-[28px] border border-[#35271e]/7 bg-white/42 p-4 shadow-[0_18px_55px_rgba(53,39,30,.045)] md:grid md:grid-cols-[.72fr_1.28fr] md:gap-8 md:p-7">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#305a34]">02 <span className="ml-3">Interactive brand story</span></p>
          <h2 id="brand-puzzle-title" className="mt-3 font-['Cormorant_Garamond'] text-[34px] leading-[.95] md:text-[44px]">Put every part<br />back with purpose.</h2>
          <p className="mt-4 max-w-md text-[12px] leading-6 text-[#625950]">Slide a complete row or column toward the open space. Restore the photograph to reveal another part of the .CO product world.</p>

          <div className="mt-5 rounded-[22px] border border-white/80 bg-white/58 p-3 shadow-[0_12px_30px_rgba(53,39,30,.05)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-2">
              <button type="button" onClick={() => chooseImage(activeImageIndex - 1)} aria-label="Previous puzzle image" className="grid size-11 shrink-0 place-items-center rounded-full border border-[#305a34]/15 text-[#305a34] transition-colors hover:bg-[#305a34] hover:text-white"><ChevronLeft size={16} /></button>
              <div className="min-w-0 text-center"><p className="truncate font-['Cormorant_Garamond'] text-xl leading-none">{activeImage.title}</p><p className="mt-1 truncate text-[9px] uppercase tracking-[.08em] text-[#6c6258]">{activeImage.subtitle}</p></div>
              <button type="button" onClick={() => chooseImage(activeImageIndex + 1)} aria-label="Next puzzle image" className="grid size-11 shrink-0 place-items-center rounded-full border border-[#305a34]/15 text-[#305a34] transition-colors hover:bg-[#305a34] hover:text-white"><ChevronRight size={16} /></button>
            </div>
            <div className="mt-3 flex justify-center gap-2 overflow-x-auto pb-1" aria-label="Choose a product photograph">
              {imageOptions.map((image, index) => <button key={image.id} type="button" aria-label={`Use ${image.title}`} aria-pressed={index === activeImageIndex} onClick={() => chooseImage(index)} className={`relative size-12 shrink-0 overflow-hidden rounded-[14px] border-2 transition ${index === activeImageIndex ? "border-[#305a34] shadow-[0_5px_14px_rgba(48,90,52,.18)]" : "border-white/80 opacity-65 hover:opacity-100"}`}><ResponsiveImage src={image.thumbnailSrc ?? image.src} alt="" fill sizes="48px" className="object-cover" /></button>)}
            </div>
          </div>

          <p className="sr-only">Focus the puzzle board and use the arrow keys, or activate any tile in the open row or column.</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[.1em]"><span>{moves} moves</span><span className="h-3 w-px bg-[#35271e]/16" /><span>{grid.columns} × {grid.rows}</span><span className="h-3 w-px bg-[#35271e]/16" /><span>{elapsedSeconds}s</span></div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => restart()} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#305a34]/25 px-4 text-[10px] font-semibold uppercase text-[#305a34]"><RotateCcw size={14} /> Shuffle</button>
            <button type="button" onClick={showPreview} disabled={preview.remaining === 0 || preview.visible || status === "complete"} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#305a34] px-4 text-[10px] font-semibold uppercase text-white shadow-[0_8px_18px_rgba(48,90,52,.18)] disabled:cursor-not-allowed disabled:opacity-45"><Eye size={14} /> Preview · {preview.remaining}</button>
          </div>
        </div>

        <div className="mt-6 md:mt-0">
          <div
            className="relative mx-auto w-full max-w-[680px] overflow-hidden rounded-[26px] border border-white/80 bg-[#efe4d0] p-1.5 shadow-[0_24px_70px_rgba(53,39,30,.11)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#305a34]"
            role="group"
            aria-label={`${grid.columns} by ${grid.rows} sliding puzzle. ${moves} moves.`}
            tabIndex={0}
            onKeyDown={handleBoardKeyDown}
            style={{ aspectRatio: `${grid.columns} / ${grid.rows}` }}
          >
            <LayoutGroup id={`brand-puzzle-${activeImage.id}`}>
              <div className="grid size-full gap-1.5" style={{ gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))` }}>
                {board.map((tile, index) => tile === 0 ? <span key="empty" aria-hidden="true" className="rounded-[12px] bg-white/15" /> : (
                  <motion.button
                    layout={quality === "full"}
                    key={tile}
                    type="button"
                    disabled={!available.has(tile) || preview.visible}
                    onClick={() => play(tile)}
                    aria-label={`Move tile ${tile}${available.has(tile) ? "" : ", unavailable"}`}
                    className="relative overflow-hidden rounded-[12px] border border-white/75 bg-[#e7d5b7] shadow-[0_7px_18px_rgba(53,39,30,.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#305a34] disabled:cursor-default"
                    style={{ backgroundImage: `url('${activeImageSrc}')`, backgroundSize: `${grid.columns * 100}% ${grid.rows * 100}%`, backgroundPosition: tileBackgroundPosition(tile, grid) }}
                    transition={{ type: "spring", stiffness: 410, damping: 36, mass: 0.72 }}
                    whileTap={available.has(tile) && quality === "full" ? { scale: .97 } : undefined}
                  ><span className="sr-only">Tile {tile}, position {index + 1}</span></motion.button>
                ))}
              </div>
            </LayoutGroup>

            <AnimatePresence>
              {preview.visible ? <motion.div key="preview" className="absolute inset-1.5 z-20 overflow-hidden rounded-[22px] bg-[#e9dbc2]" initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(6px)" }} transition={{ duration: .3, ease: motionEase }}>
                <ResponsiveImage src={activeImageSrc} alt={`Preview: ${activeImage.alt}`} fill sizes="(max-width: 767px) 94vw, 680px" className="object-cover" priority />
                <motion.span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left bg-[#305a34]" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 3, ease: "linear" }} />
                <button type="button" onClick={hidePreview} className="absolute right-3 top-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/80 bg-white/78 px-4 text-[10px] font-semibold uppercase text-[#305a34] backdrop-blur-xl"><Eye size={13} /> Back to puzzle</button>
              </motion.div> : null}

              {status === "complete" ? <motion.div className="absolute inset-1.5 z-30 grid place-items-center overflow-hidden rounded-[22px] bg-cover bg-center" style={{ backgroundImage: `url('${activeImageSrc}')` }} initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .62, ease: motionEase }} aria-label={`${activeImage.alt}. Puzzle complete.`}>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_36%,rgba(24,47,25,.88))]" />
                <div className="relative mt-auto w-full p-5 text-white md:p-7"><span className="grid size-10 place-items-center rounded-full bg-white/18 backdrop-blur"><Check size={20} /></span>{promotion.eyebrow ? <p className="mt-3 text-[9px] font-semibold uppercase tracking-[.13em] text-white/72">{promotion.eyebrow}</p> : null}<h3 className="mt-2 font-['Cormorant_Garamond'] text-3xl">{promotion.title}</h3>{promotion.body ? <p className="mt-2 max-w-md text-xs text-white/82">{promotion.body}</p> : null}<p className="mt-2 text-xs text-white/82">Completed in {moves} moves.</p>{promotion.couponCode ? <p className="mt-2 font-mono text-xs">Code: {promotion.couponCode}</p> : null}<div className="mt-4 flex flex-wrap gap-3"><Link href={promotion.ctaHref} className="co-primary-cta inline-flex min-h-11 items-center gap-3 rounded-full bg-[#f7f2e8] px-5 text-[10px] font-semibold uppercase text-[#305a34]">{promotion.ctaLabel} <ArrowRight size={14} /></Link><button type="button" onClick={() => restart()} className="min-h-11 rounded-full border border-white/50 px-5 text-[10px] font-semibold uppercase">Replay</button>{imageOptions.length > 1 ? <button type="button" onClick={() => chooseImage(activeImageIndex + 1)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/50 px-5 text-[10px] font-semibold uppercase"><Images size={14} /> Change product</button> : null}</div></div>
              </motion.div> : null}
            </AnimatePresence>
          </div>
          <p className="sr-only" aria-live="polite">{status === "complete" ? `Puzzle complete in ${moves} moves.` : `${moves} moves. ${available.size} tiles can move.`}</p>
        </div>
      </div>
    </section>
  );
}
