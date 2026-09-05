"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import {
  categories,
  featured,
  fieldNotes,
  filterStories,
  today,
  type Story,
} from "./journal-data";
import {
  ease,
  Label,
  Meta,
  Photo,
  Rail,
  Reveal,
  Save,
} from "./JournalPrimitives";
export function JournalOpening({ read }: { read: (id: string) => void }) {
  return (
    <div className="jn-world jn-world--one">
      <section className="jn-hero" aria-labelledby="journal-title">
        <picture className="jn-hero-media">
          <source
            media="(max-width:600px)"
            srcSet="/assets/redesign/journal/cinematic/hero-mobile.webp"
          />
          <img
            src="/assets/redesign/journal/cinematic/hero.webp"
            alt="A field notebook, coconut oil and kitchen notes on a wooden desk"
            width="1448"
            height="1086"
            fetchPriority="high"
          />
        </picture>
        <div className="jn-hero-copy">
          <Label>The .CO Journal</Label>
          <h1 id="journal-title">
            <span>Stories from</span>
            <span>the coconut and</span>
            <span>
              <em>everything</em> around it.
            </span>
          </h1>
          <p>
            Field notes, kitchen discoveries, <br />
            people, places and ideas from <br />
            inside the world of .CO.
          </p>
          <div className="jn-actions">
            <a className="jn-button" href="#journal-index">
              Explore the Journal <ArrowRight />
            </a>
            <a className="jn-button jn-button--quiet" href="#ask">
              Ask the Farm <span>♧</span>
            </a>
          </div>
        </div>
      </section>
      <div className="jn-today jn-panel">
        <Label>
          Today in the
          <br />
          Journal
        </Label>
        <Rail label="today’s stories">
          {today.map((item) => (
            <button key={item.id} onClick={() => read(item.id)}>
              <span>{item.title}</span>
              <small>{item.label}</small>
            </button>
          ))}
        </Rail>
      </div>
      <Reveal className="jn-editors">
        <div className="jn-heading">
          <div>
            <Label>From the editor’s desk</Label>
            <h2>
              What matters most,
              <br />
              starts at the <em>source.</em>
            </h2>
          </div>
          <p>
            Our journal is where we share what we’re learning,
            <br />
            what we’re trying, and what we believe in. Straight
            <br />
            from the field, the kitchen, and our community.
          </p>
        </div>
        <article className="jn-feature jn-panel">
          <Photo
            src={featured.image}
            position={featured.position}
            alt="Coconut processing, with a worker holding fresh coconut halves"
          />
          <div className="jn-feature-copy">
            <Label>
              People & culture <span>·</span> 12 May 2025 <span>·</span> 7 min
              read
            </Label>
            <h3>
              The people behind
              <br />
              <em>every coconut</em> we source.
            </h3>
            <p>{featured.excerpt}</p>
            <div className="jn-actions">
              <button
                className="jn-button jn-button--quiet"
                onClick={() => read(featured.id)}
              >
                Read the story <ArrowRight />
              </button>
              <Save id={featured.id} title="editor story" />
            </div>
          </div>
        </article>
      </Reveal>
    </div>
  );
}
export function JournalArchive({
  stories,
  category,
  setCategory,
  query,
  setQuery,
  read,
}: {
  stories: Story[];
  category: string;
  setCategory: (v: string) => void;
  query: string;
  setQuery: (v: string) => void;
  read: (id: string) => void;
}) {
  const [debounced, setDebounced] = useState(query);
  const [sort, setSort] = useState("Newest");
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(timer);
  }, [query]);
  const filtered = useMemo(
    () => filterStories(stories, category, debounced, sort),
    [stories, category, debounced, sort],
  );
  return (
    <div className="jn-world jn-world--two">
      <Reveal id="journal-index">
        <div className="jn-heading">
          <div>
            <Label>Explore the Journal</Label>
            <h2>
              Follow what
              <br />
              <em>interests you.</em>
            </h2>
          </div>
          <p>
            Stories, research, recipes and field notes—
            <br />
            organised around what .CO cares about.
            <br />
            Curate your own reading path through
            <br />
            coconuts, communities and climate.
          </p>
        </div>
        <div className="jn-index-panel jn-panel">
          <div className="jn-toolbar">
            <div className="jn-categories" aria-label="Story categories">
              {categories.map((c) => (
                <button
                  className="jn-chip"
                  key={c}
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="jn-search">
              <Search />
              <input
                aria-label="Search the Journal"
                placeholder="Search the Journal…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <select
              aria-label="Sort stories"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>A–Z</option>
            </select>
          </div>
          <p className="sr-only" role="status">
            {filtered.length} stories found
          </p>
          <motion.div
            layout
            className={`jn-masonry ${category !== "All" || debounced || expanded || sort !== "Newest" ? "jn-masonry--filtered" : ""}`}
          >
            <AnimatePresence mode="popLayout">
              {(expanded || category !== "All" || debounced || sort !== "Newest"
                ? filtered
                : filtered.slice(0, 8)
              ).map((s) => (
                <motion.article
                  className={`jn-story jn-story--${s.id}`}
                  layout
                  key={s.id}
                  initial={reduced ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: reduced ? 0.01 : 0.5, ease }}
                >
                  <Photo src={s.image} position={s.position} />
                  <div className="jn-story-copy">
                    <Label>{s.kind}</Label>
                    <h3>
                      <button onClick={() => read(s.id)}>{s.title}</button>
                    </h3>
                    <p>{s.excerpt}</p>
                    <Meta story={s} />
                  </div>
                  <Save id={s.id} title={s.title} />
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
          {!expanded &&
            category === "All" &&
            !debounced &&
            sort === "Newest" &&
            filtered.length > 8 && (
              <button
                className="jn-button jn-load-more"
                onClick={() => setExpanded(true)}
              >
                Explore all {filtered.length} stories <ArrowRight />
              </button>
            )}
          {!filtered.length && (
            <div className="jn-empty">
              <h3>No stories on that page yet.</h3>
              <p>Try another word or explore the whole Journal.</p>
              <button
                className="jn-button"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Show all stories <ArrowRight />
              </button>
            </div>
          )}
        </div>
        <p className="jn-note">
          Reference collection shown alongside published stories. Open a story
          for its editorial status.
        </p>
      </Reveal>
      <Reveal className="jn-field">
        <div className="jn-heading">
          <div>
            <Label>From the field</Label>
            <h2>
              <em>Small moments. Real impact.</em>
            </h2>
          </div>
          <p>
            Field notes from our team and partner farmers.
            <br />
            Little updates that add up to big change.
          </p>
        </div>
        <Rail label="field notes">
          {fieldNotes.map((note) => (
            <article className="jn-field-card jn-panel" key={note.time}>
              <time>{note.time}</time>
              <p>{note.place}</p>
              <p>{note.note}</p>
              <div className="jn-byline">
                <Photo src={note.image} />
                <span>
                  {note.name}
                  <small>{note.role}</small>
                </span>
              </div>
            </article>
          ))}
        </Rail>
        <p className="jn-note">
          Illustrative field notes from the reference collection.
        </p>
      </Reveal>
    </div>
  );
}
