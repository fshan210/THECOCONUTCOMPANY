"use client";
import Image from "next/image";
import { createContext, useContext } from "react";
import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  X,
  Clock3,
  MapPin,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import { J, type Story } from "./journal-data";
import { useSavedContent } from "@/lib/customer/use-saved-content";
export const ease = [0.22, 1, 0.36, 1] as const;
export function Photo({
  src,
  alt = "",
  className = "",
  position = "center",
  priority = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  position?: string;
  priority?: boolean;
}) {
  return (
    <div className={`jn-photo ${className}`}>
      <Image
        src={
          src.startsWith("/") || src.startsWith("http")
            ? src
            : J + src + ".webp"
        }
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 650px"
        style={{ objectFit: "cover", objectPosition: position }}
      />
    </div>
  );
}
export function Label({ children }: { children: ReactNode }) {
  return <p className="jn-label">{children}</p>;
}
export function Reveal({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      id={id}
      className={`jn-section ${className}`}
      initial={reduce ? false : { opacity: 0.65, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: reduce ? 0 : 0.7, ease }}
    >
      {children}
    </motion.section>
  );
}
export function Meta({ story }: { story: Story }) {
  return (
    <div className="jn-meta">
      <span>
        <Clock3 />
        {story.minutes} min read
      </span>
      <time dateTime={/^\d{4}-/.test(story.date) ? story.date : undefined}>
        {story.displayDate ||
          new Date(story.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          })}
      </time>
      <span>
        <MapPin />
        {story.location}
      </span>
    </div>
  );
}
type SavedState = ReturnType<typeof useSavedContent>;
const JournalSavedContext = createContext<{
  journal: SavedState;
  recipe: SavedState;
} | null>(null);
export function JournalSavedProvider({ children }: { children: ReactNode }) {
  const journal = useSavedContent("journal");
  const recipe = useSavedContent("recipe");
  return (
    <JournalSavedContext.Provider value={{ journal, recipe }}>
      {children}
    </JournalSavedContext.Provider>
  );
}
export function Save({
  id,
  title,
  kind = "journal",
}: {
  id: string;
  title: string;
  kind?: "journal" | "recipe";
}) {
  const context = useContext(JournalSavedContext);
  if (!context)
    throw new Error("Journal save controls require JournalSavedProvider");
  const saved = context[kind];
  return (
    <button
      className="jn-icon"
      aria-label={`Save ${title}`}
      aria-pressed={saved.saved.has(id)}
      disabled={saved.pending.has(id)}
      onClick={() => void saved.toggle(id)}
    >
      <Bookmark fill={saved.saved.has(id) ? "currentColor" : "none"} />
    </button>
  );
}
export function Rail({
  children,
  label,
  className = "",
  dots = false,
}: {
  children: ReactNode;
  label: string;
  className?: string;
  dots?: boolean;
}) {
  const reduced = useReducedMotion();
  const [ref, api] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    duration: reduced ? 0 : 30,
    skipSnaps: false,
  });
  const [active, setActive] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  useEffect(() => {
    if (!api) return;
    const update = () => {
      setActive(api.selectedScrollSnap());
      setSnaps(api.scrollSnapList());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);
  return (
    <div
      className={`jn-carousel ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          api?.scrollNext();
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          api?.scrollPrev();
        }
      }}
    >
      <div className="jn-rail" ref={ref}>
        <div className="jn-track">
          {Children.map(children, (child, index) => (
            <div
              className={`jn-slide ${active === index ? "is-active" : ""}`}
              role="group"
              aria-label={`${index + 1} of ${Children.count(children)}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      <div className="jn-rail-controls">
        <button
          className="jn-icon"
          aria-label={`Previous ${label}`}
          disabled={active === 0}
          onClick={() => api?.scrollPrev()}
        >
          <ArrowLeft />
        </button>
        {dots && (
          <div className="jn-dots">
            {snaps.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to ${label} ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => api?.scrollTo(i)}
              >
                <i />
              </button>
            ))}
          </div>
        )}
        <button
          className="jn-icon"
          aria-label={`Next ${label}`}
          disabled={active === snaps.length - 1}
          onClick={() => api?.scrollNext()}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
export function Reader({
  story,
  close,
}: {
  story: Story | null;
  close: () => void;
}) {
  const previous = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (story) previous.current = document.activeElement as HTMLElement;
  }, [story]);
  return (
    <Dialog.Root
      open={!!story}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="jn-modal-shade" />
        <Dialog.Content
          className="jn-modal"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            previous.current?.focus();
          }}
        >
          <Dialog.Close
            className="jn-icon jn-modal-close"
            aria-label="Close story"
          >
            <X />
          </Dialog.Close>
          {story && (
            <>
              <Photo src={story.image} position={story.position} />
              <div className="jn-modal-copy">
                <Label>
                  {story.reference
                    ? "Editorial preview · " + story.kind
                    : story.kind}
                </Label>
                <Dialog.Title>{story.title}</Dialog.Title>
                <Dialog.Description>{story.excerpt}</Dialog.Description>
                <Meta story={story} />
                {story.reference && (
                  <p className="jn-note">
                    Illustrative reference content. People, quotes and field
                    reports are awaiting editorial verification.
                  </p>
                )}
                <div className="jn-story-body">
                  {story.body
                    .replace(/<[^>]*>/g, "")
                    .split(/\n\s*\n/)
                    .map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                </div>
                <Save id={story.id} title={story.title} />
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
