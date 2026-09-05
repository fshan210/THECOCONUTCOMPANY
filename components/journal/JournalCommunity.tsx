"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronDown,
  Leaf,
  Moon,
  Plus,
  Sun,
  Sunrise,
  X,
} from "lucide-react";
import {
  community,
  explainers,
  J,
  periods,
  referenceStories,
  rituals,
  type Period,
  type Ritual,
} from "./journal-data";
import { ease, Label, Photo, Rail, Reveal } from "./JournalPrimitives";
export function JournalExplainers() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Reveal className="jn-side" id="explainers">
      <div>
        <Label>The coconut explained</Label>
        <h2>
          Some questions
          <br />
          deserve more than
          <br />a caption.
        </h2>
        <p>
          A library of honest answers to the questions we hear most—from how
          things are made to why it matters.
        </p>
        <button
          className="jn-button jn-button--quiet"
          onClick={() => setOpen(open === null ? 0 : null)}
        >
          {open === null ? "Browse all explainers" : "Close explainer"}{" "}
          <ArrowRight />
        </button>
      </div>
      <div className="jn-explainers jn-panel">
        {explainers.map((item, i) => (
          <article key={item.title}>
            <button
              aria-expanded={open === i}
              aria-controls={`explainer-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <Leaf />
              <span>
                {item.title}
                <small>{item.summary}</small>
              </span>
              <ArrowRight />
            </button>
            {open === i && <p id={`explainer-${i}`}>{item.body}</p>}
          </article>
        ))}
      </div>
    </Reveal>
  );
}
export function JournalCommunity({
  share,
  read,
}: {
  share: () => void;
  read: (id: string) => void;
}) {
  const [front, setFront] = useState(0);
  const reduced = useReducedMotion();
  const stack = [
    referenceStories[0],
    referenceStories[4],
    referenceStories[7],
    referenceStories[2],
    referenceStories[5],
  ];
  return (
    <>
      <Reveal className="jn-side jn-community">
        <div>
          <Label>From the community</Label>
          <h2>
            .CO, out in the
            <br />
            <em>real world.</em>
          </h2>
          <p>
            Stories from kitchens, farms, studios, and everyday routines—shared
            by people like you.
          </p>
          <button className="jn-button jn-button--quiet" onClick={share}>
            Share your story <ArrowRight />
          </button>
        </div>
        <div>
          <Rail label="community stories" className="jn-coverflow" dots>
            {community.map((s, i) => (
              <button
                className="jn-community-card"
                key={s.name}
                onClick={() => read(referenceStories[[2, 4, 7, 0, 6][i]].id)}
              >
                <Photo src={s.image} />
                <div>
                  <Label>{s.tag}</Label>
                  <h3>{s.name}</h3>
                  <p>{s.title}</p>
                  <small>{s.place}</small>
                </div>
              </button>
            ))}
          </Rail>
          <p className="jn-note">
            Illustrative community stories · reference collection
          </p>
        </div>
      </Reveal>
      <Reveal className="jn-side jn-husk" id="husk-stack">
        <div>
          <Label>The Husk Stack</Label>
          <h2>
            Small stories.
            <br />
            Big impact.
          </h2>
          <p>Swipe through quick reads from the community and the team.</p>
          <button
            className="jn-button jn-button--quiet"
            onClick={() => read(stack[front].id)}
          >
            Explore the stack <ArrowRight />
          </button>
          <div className="jn-stack-controls">
            <button
              className="jn-icon"
              aria-label="Previous stack story"
              onClick={() =>
                setFront((v) => (v - 1 + stack.length) % stack.length)
              }
            >
              ←
            </button>
            <span aria-live="polite">
              {front + 1} / {stack.length}
            </span>
            <button
              className="jn-icon"
              aria-label="Next stack story"
              onClick={() => setFront((v) => (v + 1) % stack.length)}
            >
              →
            </button>
          </div>
        </div>
        <div
          className="jn-deck"
          role="region"
          aria-label="Husk story stack"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setFront((v) => (v + 1) % stack.length);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              setFront((v) => (v - 1 + stack.length) % stack.length);
            }
          }}
        >
          {stack.map((s, i) => {
            const offset = (i - front + stack.length) % stack.length;
            return (
              <motion.article
                className="jn-deck-card"
                key={s.id}
                style={{ zIndex: stack.length - offset }}
                animate={{
                  x: reduced ? 0 : `${offset * 35}%`,
                  y: reduced ? 0 : offset * 14,
                  scale: reduced ? 1 : 1 - offset * 0.035,
                  opacity: offset === 0 ? 1 : reduced ? 0 : 0.7,
                }}
                transition={{ duration: reduced ? 0.01 : 0.6, ease }}
                drag={offset === 0 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > 45)
                    setFront(
                      (v) =>
                        (v + (info.offset.x < 0 ? 1 : stack.length - 1)) %
                        stack.length,
                    );
                }}
                aria-hidden={offset !== 0}
              >
                <Photo src={s.image} position={s.position} />
                <div>
                  <Label>{s.kind}</Label>
                  <h3>{i === 0 ? "Turning husk into habitat." : s.title}</h3>
                  <p>{s.excerpt}</p>
                  <button
                    tabIndex={offset === 0 ? 0 : -1}
                    className="jn-button jn-button--quiet"
                    onClick={() => read(s.id)}
                  >
                    Read story <ArrowRight />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Reveal>
    </>
  );
}
const storageKey = "co-journal-day-v1";
type Board = { id: string; period: Period }[];
export function validBoard(value: unknown): value is Board {
  return (
    Array.isArray(value) &&
    value.length <= rituals.length &&
    value.every(
      (v, i) =>
        v &&
        typeof v === "object" &&
        rituals.some((r) => r.id === v.id) &&
        periods.includes(v.period) &&
        value.findIndex((x) => x.id === v.id) === i,
    )
  );
}
export function RitualPlanner() {
  const [board, setBoard] = useState<Board>(
    rituals.slice(0, 6).map(({ id, period }) => ({ id, period })),
  );
  const [saved, setSaved] = useState<string[]>([]);
  const [view, setView] = useState("My day");
  const [adding, setAdding] = useState<Period | null>(null);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const reduced = useReducedMotion();
  useEffect(() => {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (validBoard(value?.board)) setBoard(value.board);
      if (Array.isArray(value?.saved))
        setSaved(
          value.saved.filter(
            (id: unknown) =>
              typeof id === "string" && rituals.some((r) => r.id === id),
          ),
        );
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(storageKey, JSON.stringify({ board, saved }));
      } catch {
        setNotice(
          "Your day is available for this visit. Browser storage is unavailable.",
        );
      }
  }, [board, saved, ready]);
  const move = (id: string, period: Period) => {
    setBoard((v) =>
      v.some((r) => r.id === id)
        ? v.map((r) => (r.id === id ? { ...r, period } : r))
        : [...v, { id, period }],
    );
    setNotice(`Ritual moved to ${period.toLowerCase()}.`);
  };
  const renderCard = (r: Ritual, period: Period) => (
    <motion.article
      layout
      key={r.id}
      className="jn-ritual"
      draggable
      onDragStartCapture={(e) => e.dataTransfer.setData("text/plain", r.id)}
      transition={{ duration: reduced ? 0.01 : 0.4, ease }}
    >
      <Photo src={J + r.image + ".webp"} />
      <div>
        <h4>{r.title}</h4>
        <small>{r.minutes} min</small>
        <label>
          <span className="sr-only">Move {r.title}</span>
          <select
            aria-label={`Move ${r.title}`}
            value={period}
            onChange={(e) => move(r.id, e.target.value as Period)}
          >
            {periods.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>
      <button
        className="jn-icon"
        aria-label={`Save ritual ${r.title}`}
        aria-pressed={saved.includes(r.id)}
        onClick={() =>
          setSaved((v) =>
            v.includes(r.id) ? v.filter((x) => x !== r.id) : [...v, r.id],
          )
        }
      >
        <Bookmark fill={saved.includes(r.id) ? "currentColor" : "none"} />
      </button>
      {view === "My day" && (
        <button
          className="jn-remove"
          aria-label={`Remove ${r.title} from my day`}
          onClick={() => setBoard((v) => v.filter((x) => x.id !== r.id))}
        >
          <X />
        </button>
      )}
    </motion.article>
  );
  return (
    <Reveal className="jn-side jn-planner" id="rituals">
      <div>
        <Label>Build your day</Label>
        <h2>Borrow a ritual.</h2>
        <p>
          Save what inspires you and build a day that feels good, naturally.
        </p>
        <nav aria-label="Ritual views" className="jn-planner-nav jn-panel">
          {["Browse all rituals", "Saved rituals", "My day"].map((name, i) => (
            <button
              key={name}
              aria-pressed={view === name}
              onClick={() => setView(name)}
            >
              {i === 0 ? <Sun /> : i === 1 ? <Bookmark /> : <Leaf />}
              {name}
              <span>
                {i === 0
                  ? rituals.length
                  : i === 1
                    ? saved.length
                    : board.length}
              </span>
            </button>
          ))}
        </nav>
        <p className="jn-note">
          Your planner stays in this browser. Use each card’s menu to move it
          between columns.
        </p>
        <p className="sr-only" role="status">
          {notice}
        </p>
      </div>
      <div className="jn-board jn-panel">
        {periods.map((period, i) => {
          const Icon = [Sunrise, Sun, Moon][i];
          const cards =
            view === "My day"
              ? board
                  .filter((r) => r.period === period)
                  .map((r) => rituals.find((v) => v.id === r.id)!)
              : rituals.filter(
                  (r) =>
                    r.period === period &&
                    (view !== "Saved rituals" || saved.includes(r.id)),
                );
          return (
            <div
              className="jn-period"
              key={period}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                if (rituals.some((r) => r.id === id)) move(id, period);
              }}
            >
              <header>
                <div>
                  <h3>{period}</h3>
                  <p>
                    {["Start with intention", "Stay nourished", "Wind down"][i]}
                  </p>
                </div>
                <Icon />
              </header>
              <div className="jn-ritual-list">
                <AnimatePresence initial={false}>
                  {cards.map((r) => renderCard(r, period))}
                </AnimatePresence>
                {!cards.length && (
                  <p className="jn-note">
                    {view === "Saved rituals"
                      ? "Bookmark a ritual to find it here."
                      : "Make a little space for something good."}
                  </p>
                )}
              </div>
              <button
                className="jn-add"
                onClick={() => setAdding(adding === period ? null : period)}
                aria-expanded={adding === period}
              >
                <Plus />
                Add a ritual
              </button>
              {adding === period && (
                <div className="jn-picker">
                  <p>Add to {period.toLowerCase()}</p>
                  {rituals
                    .filter((r) => !board.some((b) => b.id === r.id))
                    .map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          move(r.id, period);
                          setView("My day");
                          setAdding(null);
                        }}
                      >
                        {r.title}
                        <Plus />
                      </button>
                    ))}
                  {board.length === rituals.length && (
                    <p>All rituals are in your day. Move one using its menu.</p>
                  )}
                  <button onClick={() => setAdding(null)}>
                    Done <Check />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
