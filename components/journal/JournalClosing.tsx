"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Leaf, MapPin, Pause, Play, Search, X } from "lucide-react";
import { people, quotes, searchTags, series } from "./journal-data";
import { Label, Photo, Reveal } from "./JournalPrimitives";
export function ShareStory({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="jn-modal-shade" />
        <Dialog.Content className="jn-modal jn-share">
          <Dialog.Close
            className="jn-icon jn-modal-close"
            aria-label="Close share story"
          >
            <X />
          </Dialog.Close>
          <Label>Your turn</Label>
          <Dialog.Title>Something worth sharing?</Dialog.Title>
          <Dialog.Description>
            A recipe, a moment, or a story from the farm. We’d love to hear it.
          </Dialog.Description>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim().length >= 10) setReady(true);
            }}
          >
            <label htmlFor="share-story">Your story</label>
            <textarea
              id="share-story"
              required
              minLength={10}
              maxLength={4000}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setReady(false);
              }}
              placeholder="It all started with a coconut…"
            />
            <button className="jn-button">
              Prepare your story <ArrowRight />
            </button>
            {ready && (
              <div role="status">
                <p>Your story is ready to send through your email app.</p>
                <a
                  className="jn-button"
                  href={`mailto:hello@cothecoconutcompany.com?subject=${encodeURIComponent("A story for the .CO Journal")}&body=${encodeURIComponent(text)}`}
                >
                  Open email to send <ArrowRight />
                </a>
              </div>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
function CommunityLove() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || paused || hover) return;
    const timer = setInterval(
      () => setIndex((v) => (v + 1) % quotes.length),
      9000,
    );
    return () => clearInterval(timer);
  }, [paused, hover, reduced]);
  return (
    <article
      className="jn-love jn-panel"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setHover(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHover(false);
      }}
    >
      <Label>Notes people left us</Label>
      <h2>Community Love</h2>
      <p>Words from the reference collection.</p>
      <div className="jn-quote-space">
        <AnimatePresence mode="wait" initial={false}>
          <motion.blockquote
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.45 }}
          >
            <span>“</span>
            {quotes[index].quote}
            <span>”</span>
            <cite>
              — {quotes[index].name}
              <small>{quotes[index].place}</small>
            </cite>
          </motion.blockquote>
        </AnimatePresence>
      </div>
      <div className="jn-quote-controls">
        <div className="jn-dots">
          {quotes.map((q, i) => (
            <button
              key={q.name}
              aria-label={`Show quote ${i + 1}`}
              aria-current={index === i ? "true" : undefined}
              onClick={() => {
                setIndex(i);
                setPaused(true);
              }}
            >
              <i />
            </button>
          ))}
        </div>
        <button
          className="jn-icon"
          aria-label={paused ? "Play quotes" : "Pause quotes"}
          onClick={() => setPaused((v) => !v)}
        >
          {paused ? <Play /> : <Pause />}
        </button>
      </div>
      <small className="jn-note">
        Illustrative quotes; not verified testimonials.
      </small>
    </article>
  );
}
export function JournalClosing({
  read,
  filter,
  search,
  share,
}: {
  read: (id: string) => void;
  filter: (category: string) => void;
  search: (q: string) => void;
  share: () => void;
}) {
  const [archive, setArchive] = useState("");
  return (
    <div className="jn-world jn-world--five">
      <Reveal className="jn-side jn-people">
        <div>
          <Label>People of .CO</Label>
          <h2>
            Products move.
            <br />
            <em>People</em> make them possible.
          </h2>
          <p>
            Behind every .CO product is a person with purpose. Meet a few of the
            people who turn coconuts into change.
          </p>
        </div>
        <div>
          <div className="jn-people-grid jn-panel">
            {people.map((p) => (
              <article className="jn-person" key={p.name}>
                <Photo src={p.image} position={p.position} />
                <div>
                  <blockquote>“{p.quote}”</blockquote>
                  <h3>{p.name}</h3>
                  <p>{p.role}</p>
                  <small>
                    <MapPin />
                    {p.place}
                  </small>
                </div>
              </article>
            ))}
          </div>
          <p className="jn-note">
            Farmer and processing profiles are illustrative. Founder portraits
            and words are from the .CO archive.
          </p>
        </div>
      </Reveal>
      <Reveal className="jn-closing">
        <article className="jn-series jn-panel">
          <Label>Follow a series</Label>
          <h2>Journal Series</h2>
          <p>Follow our ongoing stories, one series at a time.</p>
          {series.map((item) => (
            <button
              key={item.title}
              className="jn-series-row"
              onClick={() => filter(item.category)}
            >
              <Leaf />
              <span>
                {item.title}
                <small>{item.subtitle}</small>
              </span>
              <ArrowRight />
            </button>
          ))}
        </article>
        <article className="jn-most-read jn-panel">
          <Label>Readers keep coming back to</Label>
          <h2>Most Read</h2>
          <p>A reading list from the editor’s desk.</p>
          {[
            [
              "people-behind-every-coconut",
              "The people behind every coconut we source.",
            ],
            ["breakfast", "Kerala coconut milk: a slower breakfast."],
            ["rain", "Inside our farms: a day in the rhythm."],
            ["soil", "What does your coconut leave behind?"],
          ].map(([id, title], i) => (
            <button key={id} onClick={() => read(id)}>
              <span>0{i + 1}</span>
              {title}
            </button>
          ))}
          <small className="jn-note">
            Curated order; not live readership analytics.
          </small>
        </article>
        <CommunityLove />
        <article className="jn-your-turn jn-panel">
          <div>
            <Label>Your turn</Label>
            <h2>
              Something worth
              <br />
              sharing?
            </h2>
            <p>
              We’d love to hear your story,
              <br />
              share a recipe, or answer a<br />
              question from the farm.
            </p>
            <button className="jn-button" onClick={share}>
              Share your story <ArrowRight />
            </button>
            <a className="jn-button jn-button--quiet" href="#ask">
              Ask the Farm <ArrowRight />
            </a>
          </div>
          <Photo src="hero" position="65% center" />
        </article>
        <article className="jn-archive jn-panel">
          <Label>Search & archive</Label>
          <h2>Find a story</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              search(archive);
            }}
          >
            <label className="jn-search">
              <input
                aria-label="Search the archive"
                value={archive}
                onChange={(e) => setArchive(e.target.value)}
                placeholder="Search articles, people, places…"
              />
              <button className="jn-icon" aria-label="Search archive">
                <Search />
              </button>
            </label>
          </form>
          <p>Popular searches</p>
          <div className="jn-chips">
            {searchTags.map((t) => (
              <button
                className="jn-chip"
                key={t}
                onClick={() => {
                  setArchive(t);
                  search(t);
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </article>
      </Reveal>
    </div>
  );
}
