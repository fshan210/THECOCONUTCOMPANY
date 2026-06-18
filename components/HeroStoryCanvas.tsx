"use client";

import Link from "next/link";
import { ArrowUpRight, Droplets } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

const storyStages = [
  { label: "Whole Coconut", detail: "A fresh tender coconut from origin." },
  { label: "Coconut Water", detail: "It dissolves into a clean liquid ritual." },
  { label: ".CO Bottle", detail: "The drink resolves into our first product." }
];

const particles = Array.from({ length: 82 }, (_, index) => {
  const seed = Math.sin(index * 91.7) * 10000;
  const seedTwo = Math.sin(index * 37.3) * 10000;
  return {
    x: seed - Math.floor(seed),
    y: seedTwo - Math.floor(seedTwo),
    size: 1.4 + ((index * 7) % 9) * 0.36,
    delay: (index % 17) / 18
  };
});

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function easeInOut(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function loadStoryImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

type StoryImageSource = HTMLImageElement | HTMLCanvasElement;

function drawContainedImage(
  context: CanvasRenderingContext2D,
  image: StoryImageSource,
  centerX: number,
  centerY: number,
  maxWidth: number,
  maxHeight: number
) {
  const sourceWidth = image.width;
  const sourceHeight = image.height;
  const imageRatio = sourceWidth / sourceHeight;
  const boundsRatio = maxWidth / maxHeight;
  const width = imageRatio > boundsRatio ? maxWidth : maxHeight * imageRatio;
  const height = imageRatio > boundsRatio ? maxWidth / imageRatio : maxHeight;
  context.drawImage(image, centerX - width / 2, centerY - height / 2, width, height);
}

function createKeyedCanvas(image: HTMLImageElement, mode: "coconut" | "bottle") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return image;

  if (mode === "bottle") {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
  } else {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
  }

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const average = (red + green + blue) / 3;
    const spread = Math.max(red, green, blue) - Math.min(red, green, blue);

    if (mode === "coconut") {
      const paleGreenBackground = average > 174 && green > red && green > blue && spread < 72;
      const nearWhite = average > 236 && spread < 42;
      if (nearWhite || paleGreenBackground) data[index + 3] = 0;
      else if (average > 220 && spread < 58) data[index + 3] = Math.round(data[index + 3] * 0.2);
    } else {
      const edgeLike = red > 224 && green > 206 && blue > 162 && spread < 72;
      const farEdge = index / 4 % canvas.width < 80 || index / 4 % canvas.width > canvas.width - 80;
      if (edgeLike && farEdge) data[index + 3] = 0;
      else if (red > 236 && green > 222 && blue > 184 && spread < 58) data[index + 3] = Math.round(data[index + 3] * 0.12);
    }
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
}

function drawRippleField(context: CanvasRenderingContext2D, width: number, height: number, progress: number, time: number) {
  const liquid = easeInOut((progress - 0.22) / 0.46);
  if (liquid <= 0.01) return;

  context.save();
  context.globalAlpha = 0.14 + liquid * 0.34;
  context.strokeStyle = "#4A6F4A";
  context.lineWidth = Math.max(1.2, width * 0.0022);
  context.lineCap = "round";

  for (let row = 0; row < 7; row += 1) {
    const y = height * (0.34 + row * 0.055) + Math.sin(time * 0.001 + row) * 5;
    context.beginPath();
    for (let x = width * 0.2; x <= width * 0.82; x += 10) {
      const wave = Math.sin(x * 0.018 + time * 0.002 + row * 0.8) * (5 + liquid * 10);
      if (x === width * 0.2) context.moveTo(x, y + wave);
      else context.lineTo(x, y + wave);
    }
    context.stroke();
  }

  context.restore();
}

function drawLiquidParticles(context: CanvasRenderingContext2D, width: number, height: number, progress: number, time: number) {
  const dissolve = easeInOut((progress - 0.08) / 0.58);
  const resolve = easeInOut((progress - 0.58) / 0.34);
  if (dissolve <= 0.01 || resolve >= 0.99) return;

  const centerX = width * 0.52;
  const centerY = height * 0.48;
  const bottleX = width * 0.55;
  const bottleY = height * 0.5;
  const radius = Math.min(width, height) * (0.18 + dissolve * 0.13);

  context.save();
  for (const particle of particles) {
    const angle = particle.x * Math.PI * 2 + Math.sin(time * 0.0007 + particle.delay * 6) * 0.34;
    const drift = (particle.y - 0.5) * radius * (1.3 + dissolve);
    const orbitX = centerX + Math.cos(angle) * radius + drift * 0.35;
    const orbitY = centerY + Math.sin(angle) * radius * 0.58 + drift * 0.22;
    const streamX = bottleX + (particle.x - 0.5) * width * 0.18;
    const streamY = bottleY + (particle.y - 0.5) * height * 0.48;
    const stream = easeInOut((progress - 0.42 - particle.delay * 0.05) / 0.32);
    const x = orbitX + (streamX - orbitX) * stream;
    const y = orbitY + (streamY - orbitY) * stream + Math.sin(time * 0.002 + particle.x * 9) * 7;
    const alpha = (1 - resolve) * (0.25 + dissolve * 0.55);

    context.globalAlpha = alpha;
    context.fillStyle = particle.y > 0.48 ? "#D8C07A" : "#4A6F4A";
    context.beginPath();
    context.arc(x, y, particle.size * (1 + dissolve * 0.35), 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function drawStoryFrame(
  context: CanvasRenderingContext2D,
  coconut: StoryImageSource,
  bottle: StoryImageSource,
  width: number,
  height: number,
  progress: number,
  time: number,
  reduceMotion: boolean
) {
  context.clearRect(0, 0, width, height);

  const background = context.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "#fffdf8");
  background.addColorStop(0.42, "#F5EBD7");
  background.addColorStop(1, "#dce0be");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalAlpha = 0.1;
  context.strokeStyle = "#3E2E1F";
  context.lineWidth = 1;
  for (let x = width * 0.06; x < width; x += width * 0.1) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + width * 0.08, height);
    context.stroke();
  }
  context.restore();

  const dissolve = easeInOut((progress - 0.06) / 0.46);
  const bottleReveal = easeInOut((progress - 0.5) / 0.42);
  const liquid = easeInOut((progress - 0.22) / 0.42);
  const coconutAlpha = clamp(1 - easeInOut((progress - 0.16) / 0.42));
  const coconutScale = 1.08 - dissolve * 0.24;
  const pulse = reduceMotion ? 0 : Math.sin(time * 0.0012) * 3;

  context.save();
  context.globalAlpha = 0.22;
  context.fillStyle = "#3E2E1F";
  context.filter = "blur(18px)";
  context.beginPath();
  context.ellipse(width * 0.52, height * 0.78, width * 0.2, height * 0.035, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.save();
  context.globalAlpha = coconutAlpha;
  context.translate(width * 0.5, height * 0.49);
  context.rotate((reduceMotion ? 0 : Math.sin(time * 0.0004) * 0.018) + dissolve * -0.08);
  context.translate(-width * 0.5, -height * 0.49);
  context.filter = `contrast(${1 + dissolve * 0.14}) saturate(${1 + dissolve * 0.18})`;
  drawContainedImage(context, coconut, width * 0.5, height * 0.48 + pulse, width * 0.48 * coconutScale, height * 0.58 * coconutScale);
  context.restore();

  if (dissolve > 0.02) {
    context.save();
    context.globalCompositeOperation = "destination-out";
    context.globalAlpha = dissolve * 0.72;
    for (let i = 0; i < 22; i += 1) {
      const angle = i * 1.77 + time * 0.0008;
      const radius = Math.min(width, height) * (0.08 + (i % 8) * 0.018) * dissolve;
      context.beginPath();
      context.arc(width * 0.5 + Math.cos(angle) * radius, height * 0.48 + Math.sin(angle) * radius, 8 + (i % 6) * 2.4, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }

  drawRippleField(context, width, height, progress, time);
  drawLiquidParticles(context, width, height, progress, time);

  if (liquid > 0.04) {
    context.save();
    context.globalAlpha = liquid * (1 - bottleReveal * 0.38);
    context.fillStyle = "#edf3de";
    context.strokeStyle = "#4A6F4A";
    context.lineWidth = Math.max(1.5, width * 0.0024);
    context.beginPath();
    const streamTop = height * (0.36 - liquid * 0.04);
    const streamBottom = height * (0.72 + liquid * 0.03);
    context.moveTo(width * 0.34, streamTop);
    context.bezierCurveTo(width * 0.44, height * 0.48, width * 0.62, height * 0.42, width * 0.68, streamBottom);
    context.bezierCurveTo(width * 0.58, height * 0.7, width * 0.42, height * 0.64, width * 0.34, streamTop);
    context.closePath();
    context.fill();
    context.globalAlpha = liquid * 0.42;
    context.stroke();
    context.restore();
  }

  context.save();
  context.globalAlpha = bottleReveal;
  context.filter = `drop-shadow(0 ${18 + bottleReveal * 12}px ${28 + bottleReveal * 18}px rgba(62,46,31,${0.12 + bottleReveal * 0.12}))`;
  context.beginPath();
  const maskTop = height * (0.18 + (1 - bottleReveal) * 0.54);
  context.rect(0, maskTop, width, height - maskTop);
  context.clip();
  drawContainedImage(context, bottle, width * 0.56, height * 0.51, width * 0.5, height * 0.72);
  context.restore();

  if (bottleReveal > 0.75) {
    context.save();
    context.globalAlpha = (bottleReveal - 0.75) / 0.25;
    context.strokeStyle = "#3E2E1F";
    context.lineWidth = 1.2;
    context.beginPath();
    context.ellipse(width * 0.56, height * 0.78, width * 0.14, height * 0.025, 0, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }
}

function useCanvasStory(progress: number, reduceMotion: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<{ coconut: StoryImageSource; bottle: StoryImageSource } | null>(null);
  const progressRef = useRef(progress);
  const drawRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    progressRef.current = progress;
    if (reduceMotion) drawRef.current?.(window.performance.now());
  }, [progress, reduceMotion]);

  useEffect(() => {
    let frame = 0;
    let cancelled = false;

    async function setup() {
      const [coconut, bottle] = await Promise.all([
        loadStoryImage("/assets/transparent/co-tender-coconut.webp"),
        loadStoryImage("/assets/transparent/co-water-bottle.webp")
      ]);
      imagesRef.current = { coconut: createKeyedCanvas(coconut, "coconut"), bottle: createKeyedCanvas(bottle, "bottle") };

      const draw = (time: number) => {
        const canvas = canvasRef.current;
        const images = imagesRef.current;
        if (!canvas || !images || cancelled) return;

        const rect = canvas.getBoundingClientRect();
        const pixelRatio = reduceMotion ? 1 : Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(320, Math.floor(rect.width * pixelRatio));
        const height = Math.max(360, Math.floor(rect.height * pixelRatio));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        const context = canvas.getContext("2d");
        if (context) {
          drawStoryFrame(context, images.coconut, images.bottle, width, height, progressRef.current, time, reduceMotion);
        }
        if (!reduceMotion) frame = window.requestAnimationFrame(draw);
      };

      drawRef.current = draw;
      if (reduceMotion) draw(window.performance.now());
      else frame = window.requestAnimationFrame(draw);
    }

    setup();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return canvasRef;
}

function FloatingDoodles() {
  const doodles = useMemo(
    () => [
      { className: "left-[3%] top-[14%] h-24 w-24 text-coconut/45", delay: 0, rotate: -7, type: "coconut" },
      { className: "right-[6%] top-[10%] h-32 w-32 text-grove/42", delay: 0.6, rotate: 8, type: "palm" },
      { className: "bottom-[18%] left-[8%] h-28 w-28 text-palm/55", delay: 1.1, rotate: 4, type: "waves" },
      { className: "bottom-[12%] right-[8%] h-20 w-20 text-coconut/35", delay: 1.6, rotate: -5, type: "sun" }
    ],
    []
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {doodles.map((doodle) => (
        <motion.div
          key={`${doodle.type}-${doodle.delay}`}
          className={`absolute ${doodle.className}`}
          initial={{ opacity: 0, y: 12, rotate: doodle.rotate }}
          animate={{ opacity: 1, y: [0, -10, 0], rotate: [doodle.rotate, doodle.rotate + 2, doodle.rotate] }}
          transition={{ opacity: { duration: 0.9, delay: doodle.delay }, y: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: doodle.delay }, rotate: { duration: 11, repeat: Infinity, ease: "easeInOut", delay: doodle.delay } }}
        >
          <DoodleShape type={doodle.type} />
        </motion.div>
      ))}
    </div>
  );
}

function DoodleShape({ type }: { type: string }) {
  if (type === "palm") {
    return (
      <svg viewBox="0 0 180 120" fill="none" className="h-full w-full">
        <path d="M18 101C56 51 105 21 165 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M45 72c4-24 12-42 29-61M66 58c12-22 28-38 50-50M88 45c22-19 43-30 70-36M42 76c23 2 42 10 60 26M66 58c25 5 45 15 63 33M90 44c24 4 45 11 65 25" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "waves") {
    return (
      <svg viewBox="0 0 160 100" fill="none" className="h-full w-full">
        <path d="M8 30c18-14 34-14 52 0s34 14 52 0 30-13 40-4M8 52c18-14 34-14 52 0s34 14 52 0 30-13 40-4M8 74c18-14 34-14 52 0s34 14 52 0 30-13 40-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "sun") {
    return (
      <svg viewBox="0 0 120 120" fill="none" className="h-full w-full">
        <circle cx="60" cy="60" r="22" stroke="currentColor" strokeWidth="3" />
        <path d="M60 10v18M60 92v18M10 60h18M92 60h18M24 24l13 13M83 83l13 13M96 24 83 37M37 83 24 96" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 140 140" fill="none" className="h-full w-full">
      <path d="M45 47 65 18l30 31" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 62c7-20 39-28 64-18 26 10 34 38 22 61-12 24-49 33-73 17-22-15-23-42-13-60Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 70c22 11 45 11 72-1M55 55c6 26 4 47-6 66M78 52c8 30 6 54-3 75M99 66c0 19-4 35-13 52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function HeroStoryCanvas() {
  const ref = useRef<HTMLElement>(null);
  const { shouldReduce, isMobile } = useCoconutMotionMode();
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const springProgress = useSpring(scrollYProgress, { stiffness: isMobile ? 130 : 90, damping: isMobile ? 34 : 28, mass: 0.35 });
  const canvasRef = useCanvasStory(progress, shouldReduce);
  const storyOpacity = useTransform(springProgress, [0, 0.5, 1], [1, 0.94, 1]);
  const bottleCopyOpacity = useTransform(springProgress, [0.55, 0.82], [0, 1]);

  useMotionValueEvent(springProgress, "change", (latest) => {
    setProgress(latest);
  });

  const activeStage = progress < 0.36 ? 0 : progress < 0.7 ? 1 : 2;

  return (
    <section ref={ref} className="relative min-h-[260vh] overflow-clip bg-[linear-gradient(135deg,#3E2E1F_0%,#4A6F4A_46%,#F5EBD7_100%)] md:min-h-[320vh]">
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <filter id="co-liquid-displacement">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.025" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="10" />
        </filter>
      </svg>
      <FloatingDoodles />
      <div className="sticky top-0 grid min-h-svh items-center px-5 py-8 md:px-8 md:py-24">
        <motion.div style={{ opacity: storyOpacity }} className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="relative z-10 max-w-xl text-paper">
            <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-paper/68">Whole coconut to .CO water</p>
            <h1 className="font-display text-4xl leading-[0.98] md:text-7xl lg:text-8xl">The coconut becomes the drink.</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-paper/72 md:mt-7 md:text-lg md:leading-8">
              Scroll through the first .CO story: tender coconut, clean coconut water, and the bottle made for everyday living.
            </p>
            <div className="mt-6 hidden gap-3 md:grid">
              {storyStages.map((stage, index) => (
                <motion.div
                  key={stage.label}
                  animate={{ opacity: activeStage === index ? 1 : 0.46, x: activeStage === index ? 0 : -4 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="co-glass-dark flex items-center gap-4 p-4"
                >
                  <span className={`grid h-9 w-9 place-items-center rounded-full ${activeStage === index ? "bg-sun text-coconut" : "bg-paper/10 text-paper/72"}`}>
                    {index === 1 ? <Droplets size={17} /> : index + 1}
                  </span>
                  <span>
                    <span className="block text-sm uppercase tracking-editorial text-paper">{stage.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-paper/62">{stage.detail}</span>
                  </span>
                </motion.div>
              ))}
            </div>
            <motion.div style={{ opacity: bottleCopyOpacity }} className="mt-8 hidden flex-wrap gap-3 md:flex">
              <Link href="/shop/co-water" className="co-button-soft inline-flex min-h-12 items-center gap-3 bg-paper px-6 py-4 text-sm text-coconut">
                See .CO Water <ArrowUpRight size={16} />
              </Link>
              <Link href="/products" className="inline-flex min-h-12 items-center gap-3 border border-paper/30 px-6 py-4 text-sm text-paper">
                Explore the ecosystem
              </Link>
            </motion.div>
          </div>
          <div className="relative z-10 min-h-[300px] overflow-hidden rounded-[1.5rem] border border-paper/18 bg-paper/18 shadow-[0_34px_110px_rgba(62,46,31,0.26)] backdrop-blur-xl md:min-h-[640px] md:rounded-[2rem]">
            <canvas ref={canvasRef} aria-label="Scroll animation showing a tender coconut dissolving into coconut water and forming a .CO bottle" className="h-full min-h-[300px] w-full md:min-h-[640px] [filter:url(#co-liquid-displacement)]" />
            <div className="pointer-events-none absolute inset-x-8 bottom-8 h-px bg-gradient-to-r from-transparent via-paper/50 to-transparent" />
            <div className="pointer-events-none absolute left-6 top-6 rounded-full border border-paper/20 bg-paper/10 px-4 py-2 text-[0.62rem] uppercase tracking-editorial text-paper/72 backdrop-blur-md">
              {Math.round(progress * 100)}% story progress
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
