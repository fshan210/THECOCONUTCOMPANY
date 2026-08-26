"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  Send,
} from "lucide-react";
import type { ContentJournalPost } from "@/lib/content/types";
import {
  ButtonLink,
  DarkShell,
  Eyebrow,
  Newsletter,
  RD,
  Scene,
} from "@/components/reference/DarkReference";
import { useSavedContent } from "@/lib/customer/use-saved-content";
const A = RD.journal,
  R = RD.recipe,
  S = RD.sustainability;
const visualStories = [
  [
    "Sourcing",
    "What actually happens to a coconut husk?",
    `${S}NOTHING WASTED EVERYTHING ACCOUNTED FOR-DESKTOP.png`,
  ],
  [
    "People",
    "Meet Lakshmi: twenty years among coconuts.",
    `${S}IMPACT SHOULD REACH PEOPLE TOO.png`,
  ],
  [
    "Recipes",
    "Kerala Coconut Breakfast Bowl",
    `${R}coconut breakfast bowl.png`,
  ],
  [
    "Sustainability",
    "Why traceability matters in Pollachi.",
    `${S}A BETTER COCONUT SYSTEM STARTS AT THE SOURCE.png`,
  ],
  ["Field note", "First rains, new growth.", `${S}COCONUT HERO IMAGE.png`],
  [
    "Behind .CO",
    "A day in our kitchen lab.",
    `${A}STORIES FROM THE COCONUT AND EVERYTHING AROUND IT.png`,
  ],
];
const qas = [
  [
    "How do you decide when to harvest coconuts?",
    "Age, water content and sound are checked. Each grove and harvest differs.",
  ],
  [
    "What happens to shells after the water is harvested?",
    "The intended circular pathway includes biochar and other material uses; production evidence will be published before claims are verified.",
  ],
  [
    "Can I replace fresh coconut with .CO products?",
    "Choose the format suited to your recipe and follow the product instructions.",
  ],
];
const people = [
  ["Raghavan Pillai", "Farmer", "COCONUT HERO IMAGE.png"],
  ["Meena Devi", "Processing lead", "IMPACT SHOULD REACH PEOPLE TOO.png"],
  ["Arjun Menon", "Food specialist", "GOOD FOOD GETS PASSED AROUND.png"],
  [
    "Ananya Krishnan",
    "Co-founder",
    "STORIES FROM THE COCONUT AND EVERYTHING AROUND IT.png",
  ],
];
export function ReferenceJournalPage({
  journalEntries = [],
}: {
  journalEntries?: ContentJournalPost[];
}) {
  const saved = useSavedContent("journal");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [open, setOpen] = useState(0);
  const [topic, setTopic] = useState("Farming");
  const [question, setQuestion] = useState("");
  const [notice, setNotice] = useState("");
  const [config, setConfig] = useState({
    form: "Milk",
    process: "Fresh",
    dish: "Curry",
  });
  const [rituals, setRituals] = useState([
    "Warm lemon + coconut water",
    "Hydrate with coconut water",
    "Coconut oil self massage",
  ]);
  const chooseConfig = (key: keyof typeof config, value: string) =>
    setConfig((v) => ({ ...v, [key]: value }));
  const posts = useMemo(() => {
    const source = journalEntries.length
      ? journalEntries.map(
          (e) => [e.category, e.title, e.image, e.slug] as const,
        )
      : visualStories.map((x, i) => [x[0], x[1], x[2], `story-${i}`] as const);
    return source
      .filter(
        (p) =>
          (category === "All" || p[0] === category) &&
          `${p[0]} ${p[1]}`.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => (sort === "A–Z" ? a[1].localeCompare(b[1]) : 0));
  }, [journalEntries, category, query, sort]);
  return (
    <DarkShell className="rd-journal">
      <section className="journal-hero">
        <Scene
          priority
          src={`${A}STORIES FROM THE COCONUT AND EVERYTHING AROUND IT.png`}
          alt="Editorial journal, coconut product and field notes on a warm wooden desk"
        />
        <div>
          <Eyebrow>The .CO journal</Eyebrow>
          <h1>
            Stories from
            <br />
            the coconut and
            <br />
            <em>everything around it.</em>
          </h1>
          <p>
            Field notes, kitchen discoveries and real people from inside the
            world of .CO.
          </p>
          <ButtonLink href="#journal-index">Explore the journal</ButtonLink>{" "}
          <ButtonLink href="#ask" ghost>
            Ask the farm
          </ButtonLink>
        </div>
      </section>
      <nav className="journal-ticker rd-glass">
        <Eyebrow>Today in the journal</Eyebrow>
        {[
          "Pollachi Harvest Notes",
          "Kitchen Coconut Milk Experiments",
          "CoCarbon Biochar Field Trial",
          "Community Morning Rituals",
        ].map((x) => (
          <a href="#journal-index" key={x}>
            {x}
          </a>
        ))}
      </nav>
      <section className="rd-section editors-desk">
        <div className="editor-heading">
          <Eyebrow>From the editor’s desk</Eyebrow>
          <h2>
            What matters most,
            <br />
            starts at the <em>source.</em>
          </h2>
          <p>
            Our journal shares what we’re learning in the field, the kitchen and
            our community.
          </p>
        </div>
        <article className="rd-glass">
          <Scene
            src={`${S}IMPACT SHOULD REACH PEOPLE TOO.png`}
            alt="People working with coconuts"
          />
          <div>
            <Eyebrow>People & culture · 7 min read</Eyebrow>
            <h3>
              The people behind
              <br />
              <em>every coconut we source.</em>
            </h3>
            <p>
              Meet the farmers, artisans and families who make our work
              possible.
            </p>
            <ButtonLink href="/about">Read the story</ButtonLink>
            <button
              aria-label="Save editor story"
              onClick={() => void saved.toggle("people-behind-every-coconut")}
            >
              <Bookmark
                fill={
                  saved.saved.has("people-behind-every-coconut")
                    ? "currentColor"
                    : "none"
                }
              />
            </button>
          </div>
        </article>
      </section>
      <section id="journal-index" className="rd-section journal-index">
        <div className="index-heading">
          <div>
            <Eyebrow>Explore the journal</Eyebrow>
            <h2>
              Follow what
              <br />
              <em>interests you.</em>
            </h2>
          </div>
          <p>
            Stories, research, recipes and field notes organised around what .CO
            cares about.
          </p>
        </div>
        <div className="journal-toolbar rd-glass">
          <div className="rd-pills">
            {[
              "All",
              "Sourcing",
              "Sustainability",
              "Recipes",
              "Behind .CO",
              "People",
              "Culture",
            ].map((c) => (
              <button
                className="rd-pill"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                key={c}
              >
                {c}
              </button>
            ))}
          </div>
          <label>
            <Search />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the journal"
            />
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>Newest</option>
            <option>A–Z</option>
          </select>
        </div>
        <div className="journal-masonry">
          {posts.slice(0, 8).map(([cat, title, image, slug], i) => (
            <article className={`rd-card item-${i}`} key={slug}>
              <Link href={`/journal?story=${encodeURIComponent(slug)}`}>
                <Scene src={image} alt={title} />
              </Link>
              <div className="rd-card-copy">
                <Eyebrow>{cat}</Eyebrow>
                <h3>{title}</h3>
                <div className="rd-meta">
                  {4 + i} min read · Pollachi / Kerala
                </div>
                <button
                  aria-label={`Save ${title}`}
                  onClick={() => void saved.toggle(slug)}
                >
                  <Heart
                    fill={saved.saved.has(slug) ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="rd-section field-notes">
        <div>
          <Eyebrow>From the field</Eyebrow>
          <h2>
            Small moments. <em>Real impact.</em>
          </h2>
        </div>
        <div className="field-rail">
          {[
            [
              "07:42",
              "Pollachi",
              "The morning harvest is in. Tender coconuts show strong water content.",
            ],
            [
              "14:10",
              "Coimbatore",
              "Testing a new husk-chip mix for moisture retention.",
            ],
            ["16:30", "Palakkad", "First rains over the western ghats."],
            ["11:05", "Kasaragod", "Community training on composting today."],
            [
              "18:20",
              "Ariyalur",
              "Biochar trial observations recorded for review.",
            ],
          ].map(([time, place, note]) => (
            <article className="rd-glass" key={time}>
              <b>{time}</b>
              <span>{place}</span>
              <p>{note}</p>
              <small>Field note · Evidence review pending</small>
            </article>
          ))}
        </div>
      </section>
      <section id="ask" className="rd-section ask-farm rd-glass">
        <div>
          <Eyebrow>Ask the farm</Eyebrow>
          <h2>
            Curious about
            <br />
            something? Ask
            <br />
            <em>the people who know.</em>
          </h2>
          <Scene
            src={`${S}IMPACT SHOULD REACH PEOPLE TOO.png`}
            alt="Coconut workers sharing their expertise"
          />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setNotice(
              "Your question is ready for the farm integration queue. It has not been submitted because no production endpoint is configured.",
            );
          }}
        >
          <h3>Submit your question</h3>
          <p>Choose a topic</p>
          <div className="rd-pills">
            {[
              "Farming",
              "Processing",
              "Sourcing",
              "Sustainability",
              "Coconut Science",
            ].map((t) => (
              <button
                type="button"
                className="rd-pill"
                aria-pressed={topic === t}
                onClick={() => setTopic(t)}
                key={t}
              >
                {t}
              </button>
            ))}
          </div>
          <label>
            Your question
            <textarea
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to ask?"
            />
          </label>
          <button className="rd-button">
            Send to the farm <Send />
          </button>
          {notice && <p role="status">{notice}</p>}
        </form>
      </section>
      <section className="rd-section answers">
        <Eyebrow>Answers from the field</Eyebrow>
        <h2>Real questions. Real answers.</h2>
        {qas.map(([q, a], i) => (
          <article className="rd-glass" key={q}>
            <button
              onClick={() => setOpen(i === open ? -1 : i)}
              aria-expanded={i === open}
            >
              <h3>{q}</h3>
              <ChevronDown />
            </button>
            {i === open && <p>{a}</p>}
          </article>
        ))}
      </section>
      <section className="rd-section coconut-config">
        <div>
          <Eyebrow>One coconut, many possibilities</Eyebrow>
          <h2>
            Change one thing.
            <br />
            See what the coconut becomes.
          </h2>
          <div className="config-controls rd-glass">
            {[
              [
                "form",
                "1. Coconut form",
                ["Milk", "Cream", "Oil", "Flour", "Water", "Sugar"],
              ],
              [
                "process",
                "2. Processing style",
                ["Fresh", "Cold-Pressed", "Fermented", "Dehydrated"],
              ],
              [
                "dish",
                "3. What are you making?",
                ["Curry", "Snack", "Drink", "Dessert", "Bake"],
              ],
            ].map(([key, title, items]) => (
              <fieldset key={String(key)}>
                <legend>{title}</legend>
                <div className="rd-pills">
                  {(items as string[]).map((x) => {
                    const field = String(key) as keyof typeof config;
                    return (
                      <button
                        type="button"
                        className="rd-pill"
                        aria-pressed={config[field] === x}
                        onClick={() => chooseConfig(field, x)}
                        key={x}
                      >
                        {x}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        </div>
        <article className="config-result rd-card">
          <Scene
            src={`${R}Kerala Vegetable Stew.png`}
            alt="Matched Kerala coconut vegetable stew"
          />
          <div className="rd-card-copy">
            <Eyebrow>New match</Eyebrow>
            <h3>
              {config.process} {config.form} {config.dish}
            </h3>
            <div className="rd-meta">35 min · Easy · Serves 3</div>
            <p>
              The recommendation updates as you change the coconut form,
              processing style and dish.
            </p>
            <ButtonLink href="/recipes/coconut-thai-veggie-curry">
              View recipe
            </ButtonLink>
          </div>
        </article>
      </section>
      <section className="rd-section explained">
        <div>
          <Eyebrow>The coconut explained</Eyebrow>
          <h2>Some questions deserve more than a caption.</h2>
          <p>
            A library of honest answers—from how things are made to why it
            matters.
          </p>
        </div>
        <div className="rd-glass">
          {[
            "Tender vs Mature Coconut",
            "How Coconut Milk Is Made",
            "What Happens to the Husk",
            "Virgin vs Refined Coconut Oil",
            "Why Coconut Flour Behaves Differently",
            "What Biochar Actually Does",
          ].map((x) => (
            <Link href="/journal" key={x}>
              {x}
              <span>→</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="rd-section community-stories">
        <div>
          <Eyebrow>From the community</Eyebrow>
          <h2>
            .CO, out in the
            <br />
            <em>real world.</em>
          </h2>
          <p>Stories from kitchens, farms, studios and daily routines.</p>
          <ButtonLink href="#your-turn">Share your story</ButtonLink>
        </div>
        <div className="story-rail" role="region" aria-label="Community stories carousel" tabIndex={-1}>
          {visualStories.slice(0, 5).map(([cat, title, image]) => (
            <article className="rd-card" key={title}>
              <Scene src={image} alt={title} />
              <div className="rd-card-copy">
                <Eyebrow>{cat}</Eyebrow>
                <h3>{title}</h3>
              </div>
            </article>
          ))}
        </div>
        <div className="story-rail-controls">
          <button type="button" className="story-rail__arrow story-rail__arrow--prev" aria-label="Previous story" onClick={() => document.querySelector('.story-rail')?.scrollBy({left:-340,behavior:'smooth'})}>&larr;</button>
          <button type="button" className="story-rail__arrow story-rail__arrow--next" aria-label="Next story" onClick={() => document.querySelector('.story-rail')?.scrollBy({left:340,behavior:'smooth'})}>&rarr;</button>
        </div>
      </section>
      <section className="rd-section husk-stack">
        <div>
          <Eyebrow>The husk stack</Eyebrow>
          <h2>
            Small stories.
            <br />
            Big impact.
          </h2>
          <p>Swipe through quick reads from the community and team.</p>
        </div>
        <div className="stack-cards">
          {visualStories.slice(0, 5).map(([cat, title, image], i) => (
            <article
              className="rd-card"
              style={{
                transform: `translateX(${i * 70}px) rotate(${i * 2}deg)`,
                zIndex: 5 - i,
              }}
              key={title}
            >
              <Scene src={image} alt={title} />
              <div className="rd-card-copy">
                <h3>{title}</h3>
                <Eyebrow>{cat}</Eyebrow>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="rd-section build-day">
        <div>
          <Eyebrow>Build your day</Eyebrow>
          <h2>Borrow a ritual.</h2>
          <p>
            Save what inspires you and build a day that feels good, naturally.
          </p>
        </div>
        <div className="day-board rd-glass">
          {["Morning", "Afternoon", "Evening"].map((period, i) => (
            <article key={period}>
              <h3>{period}</h3>
              <div className="ritual-card">
                <b>{rituals[i]}</b>
                <small>{[5, 20, 15][i]} min</small>
              </div>
              <button
                onClick={() =>
                  setRituals((r) =>
                    r.map((x, n) =>
                      n === i ? "Golden milk with coconut milk" : x,
                    ),
                  )
                }
              >
                + Add a ritual
              </button>
            </article>
          ))}
        </div>
      </section>
      <section className="rd-section journal-people">
        <div>
          <Eyebrow>People of .CO</Eyebrow>
          <h2>
            Products move.
            <br />
            <em>People make them possible.</em>
          </h2>
          <p>Behind every product is a person with purpose.</p>
        </div>
        <div>
          {people.map(([name, role, image], i) => (
            <article className="rd-card" key={name}>
              <Scene
                src={
                  image.startsWith("GOOD")
                    ? `${R}${image}`
                    : image.startsWith("STORIES")
                      ? `${A}${image}`
                      : `${S}${image}`
                }
                alt={`${name}, ${role}`}
              />
              <blockquote>
                “
                {
                  [
                    "I grow with the seasons, not shortcuts.",
                    "Clean process. Stronger future.",
                    "I test every batch like it’s for my family.",
                    "We grow together. We lead together.",
                  ][i]
                }
                ”
              </blockquote>
              <h3>{name}</h3>
              <p>{role}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="your-turn" className="rd-section journal-closing">
        <article className="rd-glass">
          <Eyebrow>Follow a series</Eyebrow>
          <h2>Journal Series</h2>
          {["Field Notes", "Inside .CO", "Coconut 101", "CoCarbon Notes"].map(
            (x) => (
              <Link href="/journal" key={x}>
                {x} →
              </Link>
            ),
          )}
        </article>
        <article className="rd-glass">
          <Eyebrow>Most read</Eyebrow>
          <h2>Readers keep coming back to</h2>
          {visualStories.slice(0, 4).map((x, i) => (
            <p key={x[1]}>
              <b>0{i + 1}</b>
              {x[1]}
            </p>
          ))}
        </article>
        <article className="rd-glass">
          <Eyebrow>Community love</Eyebrow>
          <blockquote>
            “.CO is a reminder that we can choose better every day.”
          </blockquote>
          <small>— Community reader, Coimbatore</small>
        </article>
        <article className="rd-glass your-turn">
          <Eyebrow>Your turn</Eyebrow>
          <h2>Something worth sharing?</h2>
          <p>Share a recipe, or an answer to a question from the farm.</p>
          <ButtonLink href="mailto:hello@cothecoconutcompany.com">
            Share your story
          </ButtonLink>
        </article>
        <article className="rd-glass archive">
          <Eyebrow>Search & archive</Eyebrow>
          <h2>Find a story</h2>
          <label>
            <Search />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, people, places…"
            />
          </label>
        </article>
      </section>
      <Newsletter />
    </DarkShell>
  );
}
