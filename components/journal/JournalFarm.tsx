"use client";
import { useState } from "react";
import Image from "next/image";
import { transparentProductAssets } from "@/lib/website-assets";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Leaf,
  Lightbulb,
  Users,
  Sprout,
  FlaskConical,
  ChefHat,
  Clock3,
  Bookmark,
} from "lucide-react";
import { faqs, topics } from "./journal-data";
import {
  dishes,
  forms,
  processes,
  resolveCoconut,
  type CoconutConfig,
} from "./journal-config";
import { ease, Label, Photo, Reveal, Save } from "./JournalPrimitives";
export function JournalFarm() {
  const [topic, setTopic] = useState("Farming");
  const [question, setQuestion] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();
  const mail = `mailto:hello@cothecoconutcompany.com?subject=${encodeURIComponent(`Ask the Farm — ${topic}`)}&body=${encodeURIComponent(question.trim())}`;
  return (
    <>
      <Reveal id="ask" className="jn-farm jn-panel">
        <div className="jn-farm-intro">
          <Photo src="people" position="85% center" />
          <div>
            <Label>Ask the Farm</Label>
            <h2>
              Curious about
              <br />
              something? Ask
              <br />
              <em>the people who know.</em>
            </h2>
            <p>
              Our farmers and experts
              <br />
              answer questions
              <br />
              from people like you.
            </p>
            <ul>
              {[
                [Users, "Real people,", "real experience"],
                [Lightbulb, "Questions shape", "what we do"],
                [Leaf, "Answers shared", "for everyone"],
              ].map(([Icon, a, b]) => {
                const I = Icon as typeof Leaf;
                return (
                  <li key={String(a)}>
                    <I />
                    <span>
                      {String(a)}
                      <br />
                      {String(b)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <form
          className="jn-question jn-panel"
          onSubmit={(e) => {
            e.preventDefault();
            if (question.trim().length >= 10) setPrepared(true);
          }}
        >
          <h3>Submit your question</h3>
          <fieldset>
            <legend>Choose a topic</legend>
            <div className="jn-chips">
              {topics.map((t) => (
                <button
                  type="button"
                  className="jn-chip"
                  aria-pressed={topic === t}
                  key={t}
                  onClick={() => {
                    setTopic(t);
                    setPrepared(false);
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>
          <label htmlFor="farm-question">Your question</label>
          <textarea
            id="farm-question"
            required
            minLength={10}
            maxLength={2000}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              setPrepared(false);
            }}
            placeholder="What would you like to ask about coconuts, farming, processing, or sustainability?"
          />
          <small>Be specific—it helps us give you a better answer.</small>
          <button className="jn-button" type="submit">
            {prepared ? "Question ready" : "Prepare your question"}{" "}
            {prepared ? <Check /> : <ArrowRight />}
          </button>
          {prepared ? (
            <div role="status" className="jn-form-status">
              <p>
                Your question is ready. Send it through your email app to reach
                the farm.
              </p>
              <a href={mail} className="jn-button jn-button--quiet">
                Open email to send <ArrowRight />
              </a>
            </div>
          ) : (
            <p className="jn-note">
              <Leaf />
              We’ll prepare an email for you to review and send.
            </p>
          )}
        </form>
      </Reveal>
      <Reveal className="jn-answers">
        <Label>Answers from the field</Label>
        <h2>Real questions. Real answers.</h2>
        <p>Notes on growing, processing and cooking with coconuts.</p>
        <div>
          {faqs.map((faq, i) => {
            const Icon = [Sprout, FlaskConical, ChefHat][i];
            return (
              <article
                className={`jn-answer jn-panel ${open === i ? "is-open" : ""}`}
                key={faq.title}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`faq-${i}`}
                >
                  <Icon className="jn-answer-icon" />
                  <span>
                    <strong>{faq.title}</strong>
                    <small>{faq.by}</small>
                  </span>
                  <span className="jn-answer-summary">{faq.summary}</span>
                  <ChevronDown className="jn-chevron" />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0.01 : 0.3, ease }}
                    >
                      <p>{faq.body}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </Reveal>
    </>
  );
}
export function CoconutConfigurator({ explain }: { explain: () => void }) {
  const [config, setConfig] = useState<CoconutConfig>({
    form: "Milk",
    process: "Fresh",
    dish: "Curry",
  });
  const [replay, setReplay] = useState(0);
  const reduced = useReducedMotion();
  const result = resolveCoconut(config);
  return (
    <Reveal className="jn-config" id="coconut-config">
      <div>
        <Label>One coconut, many possibilities</Label>
        <h2>
          Change one thing.
          <br />
          See what the coconut becomes.
        </h2>
        <div className="jn-config-controls jn-panel">
          {(
            [
              {
                key: "form",
                title: "1. Coconut form",
                hint: "What’s your starting point?",
                options: forms,
              },
              {
                key: "process",
                title: "2. Processing style",
                hint: "How is it prepared?",
                options: processes,
              },
              {
                key: "dish",
                title: "3. What are you making?",
                hint: "Pick your dish type",
                options: dishes,
              },
            ] as const
          ).map((group) => (
            <fieldset key={group.key}>
              <legend>{group.title}</legend>
              <p>{group.hint}</p>
              <div className="jn-chips">
                {group.options.map((option) => (
                  <button
                    className="jn-chip"
                    key={option}
                    aria-pressed={config[group.key] === option}
                    onClick={() =>
                      setConfig((v) => ({ ...v, [group.key]: option }))
                    }
                  >
                    {group.key === "form" && <FlaskConical />}
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
          <button
            className="jn-button"
            onClick={() => {
              setReplay((n) => n + 1);
              document
                .getElementById("coconut-result")
                ?.focus({ preventScroll: true });
            }}
          >
            Show me the result <ArrowRight />
          </button>
          <p className="jn-note">
            <Leaf />
            Try another combination to discover a different starting point.
          </p>
        </div>
      </div>
      <svg className="jn-connector" viewBox="0 0 80 20" aria-hidden="true">
        <motion.path
          key={result.key}
          d="M0 10 H70"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduced ? 0 : 0.5 }}
        />
        <circle cx="72" cy="10" r="3" />
      </svg>
      <div
        id="coconut-result"
        tabIndex={-1}
        className="jn-result jn-panel"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={result.key + replay}
            initial={{ opacity: 0, y: reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.24, ease }}
          >
            <Photo src={result.image} />
            <div className="jn-result-copy">
              <Label>{result.matchLabel}</Label>
              <h3>{result.title}</h3>
              <div className="jn-meta">
                <span>
                  <Clock3 />
                  {result.minutes} min
                </span>
                <span>Recipe collection</span>
              </div>
              <h4>Why this coconut format works</h4>
              <p>{result.explanation}</p>
              <p className="jn-config-note">{result.note}</p>
              <div className="jn-product">
                {config.form !== "Sugar" && (
                  <Image
                    src={
                      transparentProductAssets[
                        {
                          Milk: "kitchen-milk",
                          Cream: "kitchen-milk",
                          Oil: "kitchen-oil",
                          Flour: "kitchen-flour",
                          Water: "water",
                          Sugar: "kitchen-milk",
                        }[config.form]
                      ].src
                    }
                    alt={result.product.name}
                    width={54}
                    height={78}
                    className="jn-product-image"
                  />
                )}
                <span>
                  Explore the coconut format
                  <strong>{result.product.name}</strong>
                </span>
                <a
                  href={
                    result.product.slug
                      ? `/shop/${result.product.slug}`
                      : "/shop"
                  }
                  className="jn-chip"
                >
                  View products <ArrowRight />
                </a>
              </div>
              <div className="jn-actions">
                <a className="jn-button" href={`/recipes/${result.slug}`}>
                  View recipe <ArrowRight />
                </a>
                <button
                  className="jn-button jn-button--quiet"
                  onClick={explain}
                >
                  Read how it’s made <Bookmark />
                </button>
                <Save id={result.slug} title={result.title} kind="recipe" />
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </Reveal>
  );
}
