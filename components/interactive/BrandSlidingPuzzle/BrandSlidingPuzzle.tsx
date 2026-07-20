"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { motionEase, motionSpring, useMotionQuality } from "@/lib/motion";
import {
  createSolvedBoard,
  getLegalMoves,
  isSolved,
  moveTile,
  shuffleSolvable,
  tileBackgroundPosition,
  tileForArrow,
} from "./puzzle-engine";
import { trackPuzzleEvent } from "./puzzle-analytics";
import type { PuzzleBoard, PuzzleGrid, PuzzlePromotion, PuzzleResult, PuzzleStatus } from "./puzzle-types";

const defaultImage = "/assets-optimized/about/co-zero-waste-coconut-split-9b06439b2c-desktop.avif";
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
  imageSrc = defaultImage,
  imageAlt = "Exploded coconut showing how every layer can be used",
  grid: requestedGrid,
  promotion = defaultPromotion,
  initialShuffleMoves,
  onSolved,
  className = "",
}: BrandSlidingPuzzleProps = {}) {
  const quality = useMotionQuality();
  const [grid, setGrid] = useState<PuzzleGrid>(requestedGrid ?? desktopGrid);
  const [board, setBoard] = useState<PuzzleBoard>(() => createSolvedBoard(requestedGrid ?? desktopGrid));
  const [status, setStatus] = useState<PuzzleStatus>("ready");
  const [moves, setMoves] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startedAt = useRef(Date.now());
  const requestedColumns = requestedGrid?.columns;
  const requestedRows = requestedGrid?.rows;

  const restart = (nextGrid = grid) => {
    const next = shuffleSolvable(nextGrid, initialShuffleMoves);
    setGrid(nextGrid);
    setBoard(next);
    setMoves(0);
    setElapsedSeconds(0);
    setStatus("playing");
    startedAt.current = Date.now();
    trackPuzzleEvent({ event: status === "complete" ? "puzzle_replay" : "puzzle_start", grid: nextGrid, moves: 0, elapsedMs: 0 });
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
    // Restart intentionally owns a fresh board when the responsive mode changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedColumns, requestedRows]);

  useEffect(() => {
    if (status !== "playing") return;
    const timer = window.setInterval(() => setElapsedSeconds(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  const available = useMemo(() => new Set(getLegalMoves(board, grid)), [board, grid]);
  const play = (tile: number) => {
    if (!available.has(tile) || status === "complete") return;
    const next = moveTile(board, tile, grid);
    const nextMoves = moves + 1;
    const elapsedMs = Date.now() - startedAt.current;
    setBoard(next);
    setMoves(nextMoves);
    trackPuzzleEvent({ event: "puzzle_move", grid, moves: nextMoves, elapsedMs });
    if (isSolved(next, grid)) {
      const result = { moves: nextMoves, elapsedMs, grid };
      setStatus("complete");
      trackPuzzleEvent({ event: "puzzle_complete", ...result });
      onSolved?.(result);
    }
  };

  const handleBoardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!event.key.startsWith("Arrow")) return;
    const tile = tileForArrow(board, grid, event.key);
    if (tile == null) return;
    event.preventDefault();
    play(tile);
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
          <p className="mt-4 max-w-md text-[12px] leading-6 text-[#625950]">Move the coconut tiles using legal sliding moves. The completed image reveals how every layer can become part of a more thoughtful coconut ecosystem.</p>
          <p className="sr-only">Focus the puzzle board and use the arrow keys, or activate any adjacent tile.</p>
          <div className="mt-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.1em]"><span>{moves} moves</span><span className="h-3 w-px bg-[#35271e]/16" /><span>{grid.columns} × {grid.rows}</span><span className="h-3 w-px bg-[#35271e]/16" /><span>{elapsedSeconds}s</span></div>
          <button type="button" onClick={() => restart()} className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-full border border-[#305a34]/25 px-5 text-[10px] font-semibold uppercase text-[#305a34]"><RotateCcw size={14} /> Shuffle again</button>
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
            <div className="grid size-full gap-1.5" style={{ gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))` }}>
              {board.map((tile, index) => tile === 0 ? <span key="empty" aria-hidden="true" className="rounded-[12px] bg-white/15" /> : (
                <motion.button
                  layout={quality === "full"}
                  key={tile}
                  type="button"
                  disabled={!available.has(tile)}
                  onClick={() => play(tile)}
                  aria-label={`Move tile ${tile}${available.has(tile) ? "" : ", unavailable"}`}
                  className="relative overflow-hidden rounded-[12px] border border-white/75 bg-[#e7d5b7] shadow-[0_7px_18px_rgba(53,39,30,.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#305a34] disabled:cursor-default"
                  style={{ backgroundImage: `url('${imageSrc}')`, backgroundSize: `${grid.columns * 100}% ${grid.rows * 100}%`, backgroundPosition: tileBackgroundPosition(tile, grid) }}
                  transition={motionSpring.responsive}
                  whileTap={available.has(tile) ? { scale: .96 } : undefined}
                ><span className="sr-only">Tile {tile}, position {index + 1}</span></motion.button>
              ))}
            </div>
            <AnimatePresence>
              {status === "complete" ? <motion.div className="absolute inset-1.5 grid place-items-center overflow-hidden rounded-[22px] bg-cover bg-center" style={{ backgroundImage: `url('${imageSrc}')` }} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, ease: motionEase }} aria-label={`${imageAlt}. Puzzle complete.`}>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(24,47,25,.82))]" />
                {quality === "full" ? [...Array(10)].map((_, index) => <motion.i key={index} className="absolute size-1.5 rounded-full bg-[#eacb66]" initial={{ opacity: 1, x: 0, y: 0 }} animate={{ opacity: 0, x: Math.cos(index) * 120, y: Math.sin(index) * 110 }} transition={{ duration: 1.1, delay: index * .025 }} />) : null}
                <div className="relative mt-auto w-full p-5 text-white md:p-7"><span className="grid size-10 place-items-center rounded-full bg-white/18 backdrop-blur"><Check size={20} /></span>{promotion.eyebrow ? <p className="mt-3 text-[9px] font-semibold uppercase tracking-[.13em] text-white/72">{promotion.eyebrow}</p> : null}<h3 className="mt-2 font-['Cormorant_Garamond'] text-3xl">{promotion.title}</h3>{promotion.body ? <p className="mt-2 max-w-md text-xs text-white/82">{promotion.body}</p> : null}<p className="mt-2 text-xs text-white/82">Completed in {moves} moves.</p>{promotion.couponCode ? <p className="mt-2 font-mono text-xs">Code: {promotion.couponCode}</p> : null}<div className="mt-4 flex flex-wrap gap-3"><Link href={promotion.ctaHref} className="co-primary-cta inline-flex min-h-11 items-center gap-3 rounded-full bg-[#f7f2e8] px-5 text-[10px] font-semibold uppercase text-[#305a34]">{promotion.ctaLabel} <ArrowRight size={14} /></Link><button type="button" onClick={() => restart()} className="min-h-11 rounded-full border border-white/50 px-5 text-[10px] font-semibold uppercase">Replay</button></div></div>
              </motion.div> : null}
            </AnimatePresence>
          </div>
          <p className="sr-only" aria-live="polite">{status === "complete" ? `Puzzle complete in ${moves} moves.` : `${moves} moves. ${available.size} tiles can move.`}</p>
        </div>
      </div>
    </section>
  );
}
