"use client";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CakeSlice,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  Dumbbell,
  Globe2,
  Heart,
  Leaf,
  Search,
  Sparkles,
  SunMedium,
  UtensilsCrossed,
} from "lucide-react";
import {
  ButtonLink,
  Eyebrow,
  Scene,
} from "@/components/reference/DarkReference";
import {
  MobileBottomNav,
  ReferenceFooter,
  ReferenceHeader,
} from "@/components/home/ReferenceHomePage";
import { NewsletterSection } from "@/components/launch/NewsletterSection";
import { useSavedContent } from "@/lib/customer/use-saved-content";
import { transparentProductAssets } from "@/lib/website-assets";
import { useRecipesMotion } from "./useRecipesMotion";
import type { RecipeItem } from "./recipe-data";

const A = "/assets/redesign/recipes/",
  B = `${A}backgrounds/`;
type Recipe = {
  slug: string;
  title: string;
  image: string;
  time: number;
  difficulty: "Easy" | "Medium";
  servings: number;
  cuisine: string;
  meal: string;
  dietary: string[];
  product: string;
  description: string;
  ingredients: string[];
};
const recipes: Recipe[] = [
  {
    slug: "tropical-coconut-chia-pudding",
    title: "Coconut Breakfast Bowl",
    image: `${A}coconut breakfast bowl.png`,
    time: 10,
    difficulty: "Easy",
    servings: 2,
    cuisine: "Global",
    meal: "Breakfast",
    dietary: ["Vegan", "Gluten Free", "High Protein"],
    product: ".CO Water",
    description:
      "Fruit, toasted coconut and a cool coconut base for easy mornings.",
    ingredients: ["coconut water", "banana", "berries", "chia"],
  },
  {
    slug: "coconut-thai-veggie-curry",
    title: "Thai Green Coconut Curry",
    image: `${A}THAILAND GREEN COCONUT CURRY.png`,
    time: 20,
    difficulty: "Medium",
    servings: 4,
    cuisine: "Thailand",
    meal: "Dinner",
    dietary: ["Vegan", "Gluten Free"],
    product: ".CO Coconut Milk",
    description:
      "Garden vegetables and basil simmered in a fragrant coconut base.",
    ingredients: ["coconut milk", "spinach", "vegetables", "tofu"],
  },
  {
    slug: "coconut-lime-rice-bowl",
    title: "Kerala Vegetable Stew",
    image: `${A}Kerala Vegetable Stew.png`,
    time: 25,
    difficulty: "Easy",
    servings: 4,
    cuisine: "Kerala",
    meal: "Dinner",
    dietary: ["Vegan", "Gluten Free"],
    product: ".CO Coconut Milk",
    description:
      "A gentle coconut stew with vegetables, curry leaves and pepper.",
    ingredients: ["coconut milk", "potato", "carrot", "curry leaves"],
  },
  {
    slug: "green-coconut-detox-smoothie",
    title: "Coconut Matcha Smoothie",
    image: `${A}coconut matcha smoothie.png`,
    time: 5,
    difficulty: "Easy",
    servings: 1,
    cuisine: "Global",
    meal: "Drink",
    dietary: ["Vegan", "Gluten Free", "High Protein"],
    product: ".CO Water",
    description: "A cool green blend with coconut water, matcha and lime.",
    ingredients: ["coconut water", "matcha", "lime", "spinach"],
  },
  {
    slug: "chocolate-coconut-pudding",
    title: "Coconut Flour Pancakes",
    image: `${A}coconut flour pancackes.png`,
    time: 20,
    difficulty: "Easy",
    servings: 2,
    cuisine: "Global",
    meal: "Breakfast",
    dietary: ["Gluten Free"],
    product: ".CO Coconut Flour",
    description: "Soft breakfast pancakes finished with toasted coconut.",
    ingredients: ["coconut flour", "milk", "maple"],
  },
  {
    slug: "melt-co-mango-nice-cream",
    title: "Baked Coconut Donuts",
    image: `${A}BAKED COCONUT DONUTS.png`,
    time: 35,
    difficulty: "Medium",
    servings: 6,
    cuisine: "Global",
    meal: "Dessert",
    dietary: ["Vegetarian"],
    product: ".CO Coconut Flour",
    description: "Oven-baked coconut donuts with a crisp toasted finish.",
    ingredients: ["coconut flour", "coconut milk", "coconut flakes"],
  },
  {
    slug: "coconut-energy-balls",
    title: "Jamaican Toto",
    image: `${A}JAMAICAN TOTO – TRADITIONAL CARIBBEAN COCONUT CAKE.png`,
    time: 45,
    difficulty: "Medium",
    servings: 8,
    cuisine: "Caribbean",
    meal: "Dessert",
    dietary: ["Vegetarian"],
    product: ".CO Coconut Sugar",
    description: "A deeply toasted coconut cake with warm spice.",
    ingredients: ["coconut", "coconut sugar", "spice"],
  },
  {
    slug: "chocolate-coconut-pudding",
    title: "Brazilian Coconut Pudding",
    image: `${A}MANJAR DE COCO – BRAZILIAN COCONUT PUDDING RECIPE.png`,
    time: 30,
    difficulty: "Medium",
    servings: 6,
    cuisine: "Brazil",
    meal: "Dessert",
    dietary: ["Gluten Free", "Vegetarian"],
    product: ".CO Coconut Milk",
    description: "Silky coconut pudding with a dark fruit glaze.",
    ingredients: ["coconut milk", "fruit", "coconut sugar"],
  },
];
const destinations = [
  { region: "Kerala", recipe: recipes[2] },
  { region: "Thailand", recipe: recipes[1] },
  {
    region: "Middle East",
    recipe: {
      ...recipes[5],
      title: "Coconut Basbousa",
      cuisine: "Middle East",
      image: `${A}Basbousa Recipe Dessert (Middle Eastern Coconut Semolina Cake).png`,
    },
  },
  { region: "Caribbean", recipe: recipes[6] },
  { region: "Brazil", recipe: recipes[7] },
];
const moods = [
  ["Running Late", "Under 15 min", "RUNNING LATE-under 15 mins.png", "quick"],
  ["Feeding Everyone", "Family favourites", "feeding everyone.png", "family"],
  ["Gym Done", "High protein", "gym done.png", "protein"],
  ["Friends Over", "Share & impress", "friends over.png", "sharing"],
  ["Something Sweet", "Desserts & treats", "something sweet.png", "dessert"],
  ["Slow Sunday", "Take your time", "slow sunday.png", "slow"],
] as const;
const rail = [
  [SunMedium, "Breakfast"],
  [Clock3, "15 min"],
  [UtensilsCrossed, "Dinner"],
  [CakeSlice, "Dessert"],
  [Coffee, "Drink"],
  [Leaf, "Vegan"],
  [Dumbbell, "High Protein"],
  [Globe2, "Global Favourites"],
] as const;
const variations = {
  "Vegan Version": [
    "Keep the coconut base, use tofu and add more seasonal vegetables.",
    [
      "Tofu in place of paneer",
      "Extra garden vegetables",
      "Plant-based finishing sauce",
    ],
  ],
  "High-Protein Version": [
    "Add tofu and chickpeas while keeping the curry balanced and fragrant.",
    ["Firm tofu", "Cooked chickpeas", "Toasted seeds to finish"],
  ],
  "Lighter Version": [
    "Use a lighter coconut-milk ratio and brighten the bowl with herbs and lime.",
    ["More vegetables", "Lighter coconut base", "Fresh lime and basil"],
  ],
} as const;
type Filters = {
  cuisine: string;
  meal: string;
  time: string;
  difficulty: string;
  dietary: string;
  product: string;
};
type Lab = {
  ingredients: string[];
  meal: string;
  time: string;
  cuisine: string;
  diet: string;
  product: string;
};
const blankFilters: Filters = {
  cuisine: "All",
  meal: "All",
  time: "All",
  difficulty: "All",
  dietary: "All",
  product: "All",
};
function score(r: Recipe, l: Lab) {
  return (
    (r.meal === l.meal ? 4 : 0) +
    (r.cuisine === l.cuisine ? 4 : 0) +
    (r.dietary.includes(l.diet) ? 3 : 0) +
    (r.product.toLowerCase().includes(l.product) ? 4 : 0) +
    (r.time <= parseInt(l.time) ? 3 : 0) +
    l.ingredients.filter((x) => r.ingredients.some((i) => i.includes(x)))
      .length *
      2
  );
}

export function ReferenceRecipesPage() {
  const saved = useSavedContent("recipe"),
    discover = useRef<HTMLElement>(null),
    pageRef = useRef<HTMLDivElement>(null),
    worldTouchStart = useRef<number | null>(null),
    communityRef = useRef<HTMLDivElement>(null);
  const [destination, setDestination] = useState(1),
    [variation, setVariation] =
      useState<keyof typeof variations>("Vegan Version"),
    [query, setQuery] = useState(""),
    [filters, setFilters] = useState<Filters>(blankFilters),
    [mood, setMood] = useState(""),
    [labIndex, setLabIndex] = useState(0),
    [debouncedQuery, setDebouncedQuery] = useState(""),
    [category, setCategory] = useState("Global Favourites"),
    [labAnimating, setLabAnimating] = useState(false),
    [productPulse, setProductPulse] = useState(0),
    [threeWorld, setThreeWorld] = useState(0);
  useRecipesMotion(pageRef);
  const [lab, setLab] = useState<Lab>({
    ingredients: ["coconut milk", "spinach", "tomatoes"],
    meal: "Dinner",
    time: "30 min",
    cuisine: "Kerala",
    diet: "Vegan",
    product: "milk",
  });
  const ranked = useMemo(
    () =>
      [...recipes]
        .filter((r) => r.dietary.includes(lab.diet))
        .sort((a, b) => score(b, lab) - score(a, lab)),
    [lab],
  );
  const result = ranked[labIndex % Math.max(ranked.length, 1)] ?? recipes[0];
  const visible = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    return recipes.filter(
      (r) =>
        (!q ||
          [r.title, r.description, r.cuisine, r.product, ...r.ingredients]
            .join(" ")
            .toLowerCase()
            .includes(q)) &&
        (filters.cuisine === "All" || r.cuisine === filters.cuisine) &&
        (filters.meal === "All" || r.meal === filters.meal) &&
        (filters.time === "All" || r.time <= +filters.time) &&
        (filters.difficulty === "All" || r.difficulty === filters.difficulty) &&
        (filters.dietary === "All" || r.dietary.includes(filters.dietary)) &&
        (filters.product === "All" || r.product === filters.product),
    );
  }, [debouncedQuery, filters]);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);
  const moveWorld = (step: number) =>
    setDestination(
      (current) => (current + step + destinations.length) % destinations.length,
    );
  const chooseCategory = (label: string) => {
    setCategory(label);
    setFilters({
      ...blankFilters,
      meal:
        label === "Breakfast" ||
        label === "Dinner" ||
        label === "Dessert" ||
        label === "Drink"
          ? label
          : "All",
      time: label === "15 min" ? "15" : "All",
      dietary: label === "Vegan" || label === "High Protein" ? label : "All",
    });
    window.setTimeout(
      () =>
        discover.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      80,
    );
  };
  const runLab = (surprise: boolean) => {
    if (labAnimating) return;
    setLabAnimating(true);
    window.setTimeout(() => {
      setLabIndex((current) => (surprise ? current + 1 : 0));
      setLabAnimating(false);
    }, 360);
  };
  const scrollCommunity = (direction: number) =>
    communityRef.current?.scrollBy({
      left: direction * 270,
      behavior: "smooth",
    });
  const chooseMood = (id: string) => {
    setMood(id);
    setFilters({
      ...blankFilters,
      meal: id === "dessert" ? "Dessert" : "All",
      time: id === "quick" ? "15" : "All",
      dietary: id === "protein" ? "High Protein" : "All",
    });
    setTimeout(
      () => discover.current?.scrollIntoView({ behavior: "smooth" }),
      80,
    );
  };
  return (
    <div ref={pageRef} className="rd-page rd-recipes">
      <ReferenceHeader />
      <div className="recipes-scenes">
        <section className="recipe-hero">
          <Scene
            priority
            src={`${A}RECIPIE HERO IMAGE.png`}
            alt=".CO products with curry, rice and coconut dishes"
          />
          <div className="recipe-hero-copy">
            <Eyebrow>The .CO table</Eyebrow>
            <h1>
              <span>One coconut.</span>
              <span>A world of ways</span>
              <span>
                <em>to cook.</em>
              </span>
            </h1>
            <p>
              From Kerala to kitchens around the world, real ingredients and
              recipes made for living.
            </p>
            <div>
              <ButtonLink href="#discover">Explore recipes</ButtonLink>
              <ButtonLink href="#lab" ghost>
                Make me something
              </ButtonLink>
            </div>
          </div>
        </section>
        <nav
          className="recipe-categories rd-glass"
          aria-label="Recipe categories"
        >
          {rail.map(([Icon, label]) => (
            <button
              type="button"
              aria-pressed={category === label}
              onClick={() => chooseCategory(label)}
              key={label}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <section className="recipe-culture">
          <Scene
            src={`${A}RECIPIE BRINGS CULTURE TOGETHER.png`}
            alt="Kerala backwaters with .CO kitchen products and shared dishes"
          />
          <div>
            <Eyebrow>From one place to many tables</Eyebrow>
            <h2>
              Recipes that bring
              <br />
              cultures <em>together.</em>
            </h2>
            <p>Curated by people. Inspired by places. Made in your kitchen.</p>
            <blockquote>
              “Good food has no borders.
              <br />
              It only travels.”
            </blockquote>
          </div>
          <aside className="rd-glass">
            {[
              ["Kerala", "Where the coconut story begins"],
              ["Across tables", "Recipes shaped by place"],
              ["Real kitchens", "Ingredients you can recognise"],
              ["One coconut", "At the heart of the journey"],
            ].map(([a, b]) => (
              <span key={a}>
                <b>{a}</b>
                <small>{b}</small>
              </span>
            ))}
          </aside>
        </section>
        <section className="rd-section world-section">
          <Bg n="2" />
          <svg
            className="world-route"
            viewBox="0 0 1200 520"
            aria-hidden="true"
          >
            <path
              className="world-route__base"
              d="M80 360 C260 110 430 420 600 245 S930 80 1120 310"
            />
            <path
              key={destination}
              className="world-route__active"
              d="M80 360 C260 110 430 420 600 245 S930 80 1120 310"
            />
            {[80, 340, 600, 860, 1120].map((cx, index) => (
              <circle
                key={cx}
                className={index === destination ? "active" : ""}
                cx={cx}
                cy={index % 2 ? 205 : index === 2 ? 245 : 330}
                r="5"
              />
            ))}
          </svg>
          <Eyebrow>The .CO table</Eyebrow>
          <h2>
            Around the world.
            <br />
            <em>Passed across the table.</em>
          </h2>
          <p>Coconut. Culture. Connected.</p>
          <div className="world-stage">
            <button onClick={() => moveWorld(-1)} aria-label="Previous cuisine">
              <ArrowLeft />
            </button>
            <div
              className="world-cards"
              role="group"
              aria-label="Around the world recipes"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") moveWorld(-1);
                if (event.key === "ArrowRight") moveWorld(1);
              }}
              onTouchStart={(event) =>
                (worldTouchStart.current = event.touches[0]?.clientX ?? null)
              }
              onTouchEnd={(event) => {
                const start = worldTouchStart.current;
                const end = event.changedTouches[0]?.clientX;
                if (
                  start !== null &&
                  end !== undefined &&
                  Math.abs(end - start) > 45
                ) {
                  moveWorld(end < start ? 1 : -1);
                }
                worldTouchStart.current = null;
              }}
            >
              {destinations.map((x, i) => (
                <button
                  aria-pressed={i === destination}
                  className={i === destination ? "active" : ""}
                  onClick={() => setDestination(i)}
                  key={x.region}
                >
                  <Scene
                    src={x.recipe.image}
                    alt={`${x.region} coconut dish`}
                  />
                  <span>{x.region}</span>
                </button>
              ))}
            </div>
            <button onClick={() => moveWorld(1)} aria-label="Next cuisine">
              <ArrowRight />
            </button>
          </div>
          <article className="world-active rd-glass">
            <Eyebrow>{destinations[destination].region}</Eyebrow>
            <h3>{destinations[destination].recipe.title}</h3>
            <Meta r={destinations[destination].recipe} />
            <p>Uses {destinations[destination].recipe.product}</p>
            <ButtonLink
              href={`/recipes/${destinations[destination].recipe.slug}`}
            >
              Cook this
            </ButtonLink>
            <Save
              slug={destinations[destination].recipe.slug}
              label={destinations[destination].recipe.title}
              saved={saved}
            />
          </article>
        </section>
        <section className="rd-section moment rd-glass">
          <h2>Recipe of the Moment</h2>
          <div className="rd-split">
            <Scene
              src={`${A}RED THAI COCONUT CURRY.png`}
              alt="Thai coconut red curry"
            />
            <div className="moment-copy">
              <Eyebrow>Thailand</Eyebrow>
              <h3>
                Thai Coconut Red Curry
                <br />
                <em>with Vegetables</em>
              </h3>
              <p>
                A comforting bowl of spice, creaminess and warmth with
                vegetables, red chilli and fragrant basil.
              </p>
              <Meta r={{ ...recipes[1], time: 25, difficulty: "Easy" }} />
              <p>.CO Coconut Milk · .CO Coconut Oil</p>
              <ButtonLink href="/recipes/coconut-thai-veggie-curry">
                Start cooking
              </ButtonLink>
              <Save
                slug="coconut-thai-veggie-curry"
                label="Thai Coconut Red Curry"
                saved={saved}
              />
            </div>
          </div>
          <div
            className="variation-tabs"
            style={
              {
                "--variation-index": Object.keys(variations).indexOf(variation),
              } as CSSProperties
            }
          >
            {Object.keys(variations).map((v) => (
              <button
                aria-pressed={variation === v}
                onClick={() => setVariation(v as keyof typeof variations)}
                key={v}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="variation-copy" key={variation}>
            <p>{variations[variation][0]}</p>
            {variations[variation][1].map((x) => (
              <span key={x}>
                <Check /> {x}
              </span>
            ))}
          </div>
        </section>
        <section id="lab" className="rd-section recipe-lab">
          <Bg n="3" />
          <div>
            <Eyebrow>.CO recipe lab</Eyebrow>
            <h2>
              What are we
              <br />
              making?
            </h2>
            <p>
              Add what you have, choose your vibe, and we’ll match something
              delicious.
            </p>
            <div className="lab-controls rd-glass">
              <fieldset>
                <legend>I have…</legend>
                <div className="rd-pills">
                  {[
                    "coconut milk",
                    "spinach",
                    "tomatoes",
                    "tofu",
                    "banana",
                    "lime",
                  ].map((x) => (
                    <button
                      className="rd-pill"
                      aria-pressed={lab.ingredients.includes(x)}
                      onClick={() =>
                        setLab((v) => ({
                          ...v,
                          ingredients: v.ingredients.includes(x)
                            ? v.ingredients.filter((i) => i !== x)
                            : [...v.ingredients, x],
                        }))
                      }
                      key={x}
                    >
                      {x} {lab.ingredients.includes(x) ? "×" : "+"}
                    </button>
                  ))}
                </div>
              </fieldset>
              <Choice
                label="I want…"
                value={lab.meal}
                items={["Breakfast", "Dinner", "Dessert", "Drink"]}
                set={(meal) => setLab((v) => ({ ...v, meal }))}
              />
              <Choice
                label="I have…"
                value={lab.time}
                items={["10 min", "20 min", "30 min", "45 min"]}
                set={(time) => setLab((v) => ({ ...v, time }))}
              />
              <Choice
                label="Take me to…"
                value={lab.cuisine}
                items={["Kerala", "Thailand", "Caribbean", "Brazil", "Global"]}
                set={(cuisine) => setLab((v) => ({ ...v, cuisine }))}
              />
              <Choice
                label="Made it…"
                value={lab.diet}
                items={["Vegan", "Gluten Free", "High Protein", "Vegetarian"]}
                set={(diet) => setLab((v) => ({ ...v, diet }))}
              />
              <fieldset>
                <legend>.CO products</legend>
                <div className="lab-products">
                  {[
                    ["water", transparentProductAssets.water.src],
                    ["oil", transparentProductAssets["kitchen-oil"].src],
                    ["milk", transparentProductAssets["kitchen-milk"].src],
                    ["flour", transparentProductAssets["kitchen-flour"].src],
                  ].map(([id, src]) => (
                    <button
                      aria-label={`Use ${id}`}
                      aria-pressed={lab.product === id}
                      onClick={() => {
                        setLab((v) => ({ ...v, product: id }));
                        setProductPulse((value) => value + 1);
                      }}
                      key={id}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="70px"
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
          <article
            className={`lab-result rd-glass ${labAnimating ? "is-generating" : ""}`}
            aria-busy={labAnimating}
          >
            {productPulse > 0 ? (
              <span
                key={productPulse}
                className="lab-connection"
                aria-hidden="true"
              />
            ) : null}
            <Scene src={result.image} alt={result.title} />
            <Save slug={result.slug} label={result.title} saved={saved} />
            <div>
              <h2>{result.title}</h2>
              <Meta r={result} />
              <p>{result.description}</p>
              <div className="lab-details">
                <div>
                  <Eyebrow>Ingredients preview</Eyebrow>
                  {result.ingredients.map((x) => (
                    <span key={x}>
                      <Check /> {x}
                    </span>
                  ))}
                </div>
                <div>
                  <Eyebrow>.CO product in use</Eyebrow>
                  <b>{result.product}</b>
                </div>
              </div>
              <button
                className="lab-primary"
                onClick={() => runLab(false)}
                disabled={labAnimating}
              >
                <Sparkles /> Make me something
              </button>
              <button
                className="lab-secondary"
                onClick={() => runLab(true)}
                disabled={labAnimating}
              >
                Surprise me <Sparkles />
              </button>
              <Link className="lab-secondary" href={`/recipes/${result.slug}`}>
                View full recipe <ArrowRight />
              </Link>
            </div>
          </article>
        </section>
        <section className="rd-section three-worlds rd-glass">
          <div className="three-worlds-head">
            <div>
              <h2>
                One product.
                <br />
                Three worlds.
              </h2>
              <p>
                The same .CO Coconut Milk moving through three distinct
                kitchens.
              </p>
            </div>
            <span className="product-spotlight">
              <Image
                src={transparentProductAssets["kitchen-milk"].src}
                alt=".CO Kitchen Coconut Milk"
                fill
                sizes="170px"
                className="object-contain"
              />
            </span>
            <aside>
              <Eyebrow>Why coconut milk?</Eyebrow>
              <p>
                It brings a smooth base to curries, stews and desserts without
                overpowering the ingredients around it.
              </p>
            </aside>
          </div>
          <div className="rd-grid-3 three-worlds-grid">
            {[destinations[0], destinations[1], destinations[4]].map(
              (x, index) => (
                <Card
                  r={x.recipe}
                  saved={saved}
                  active={index === threeWorld}
                  onActivate={() => setThreeWorld(index)}
                  key={x.region}
                />
              ),
            )}
          </div>
        </section>
        <section className="rd-section lifestyle">
          <Bg n="4" />
          <h2>
            Cook by the life
            <br />
            you’re <em>living.</em>
          </h2>
          <p>Recipes for every mood, moment and kind of day.</p>
          <div className="mood-grid">
            {moods.map(([title, sub, image, id]) => (
              <button
                className={mood === id ? "active" : ""}
                onClick={() => chooseMood(id)}
                key={title}
              >
                <Scene src={`${A}${image}`} alt={title} />
                <span>
                  <b>{title}</b>
                  <small>{sub}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
        <section
          id="discover"
          ref={discover}
          className="rd-section recipe-index rd-glass"
        >
          <Bg n="6" />
          <h2>Find your next one.</h2>
          <p>Search, filter and discover recipes made for real kitchens.</p>
          <label className="recipe-search">
            <Search />
            <span className="sr-only">Search recipes</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a dish, ingredient or .CO product…"
            />
          </label>
          <div className="recipe-filters">
            <Select
              label="Cuisine"
              value={filters.cuisine}
              items={[
                "All",
                ...Array.from(new Set(recipes.map((r) => r.cuisine))),
              ]}
              set={(v) => setFilters((f) => ({ ...f, cuisine: v }))}
            />
            <Select
              label="Meal type"
              value={filters.meal}
              items={["All", "Breakfast", "Dinner", "Dessert", "Drink"]}
              set={(v) => setFilters((f) => ({ ...f, meal: v }))}
            />
            <Select
              label="Time"
              value={filters.time}
              items={["All", "10", "15", "20", "30", "45"]}
              set={(v) => setFilters((f) => ({ ...f, time: v }))}
            />
            <Select
              label="Difficulty"
              value={filters.difficulty}
              items={["All", "Easy", "Medium"]}
              set={(v) => setFilters((f) => ({ ...f, difficulty: v }))}
            />
            <Select
              label="Dietary"
              value={filters.dietary}
              items={[
                "All",
                "Vegan",
                "Gluten Free",
                "High Protein",
                "Vegetarian",
              ]}
              set={(v) => setFilters((f) => ({ ...f, dietary: v }))}
            />
            <Select
              label="Product used"
              value={filters.product}
              items={[
                "All",
                ...Array.from(new Set(recipes.map((r) => r.product))),
              ]}
              set={(v) => setFilters((f) => ({ ...f, product: v }))}
            />
          </div>
          <p className="result-count">
            Showing {visible.length}{" "}
            {visible.length === 1 ? "recipe" : "recipes"}
          </p>
          <div className="rd-grid-3 recipe-grid">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((r) => (
                <Card r={r} saved={saved} key={`${r.slug}-${r.title}`} />
              ))}
            </AnimatePresence>
          </div>
          {!visible.length && (
            <div className="recipe-empty">
              <BookOpen />
              <h3>No recipes match those choices.</h3>
              <button
                onClick={() => {
                  setQuery("");
                  setFilters(blankFilters);
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
        <section className="rd-section community-recipes">
          <Bg n="7" />
          <div>
            <Eyebrow>Community</Eyebrow>
            <h2>
              Made by us.
              <br />
              Made <em>yours.</em>
            </h2>
            <p>Real kitchens. Shared recipes. Everyday .CO cooking.</p>
          </div>
          <div className="community-controls">
            <button
              type="button"
              onClick={() => scrollCommunity(-1)}
              aria-label="Previous community recipe"
            >
              <ArrowLeft />
            </button>
            <button
              type="button"
              onClick={() => scrollCommunity(1)}
              aria-label="Next community recipe"
            >
              <ArrowRight />
            </button>
          </div>
          <div
            ref={communityRef}
            className="community-rail"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") scrollCommunity(-1);
              if (event.key === "ArrowRight") scrollCommunity(1);
            }}
          >
            {moods.slice(0, 5).map(([title, , image], i) => (
              <article className="rd-card" key={title}>
                <Scene src={`${A}${image}`} alt={`${title} cooking moment`} />
                <div>
                  <Eyebrow>
                    Community kitchen {String(i + 1).padStart(2, "0")}
                  </Eyebrow>
                  <h3>{title}</h3>
                  <p>Shared coconut recipe</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="rd-section passed-around">
          <Scene
            src={`${A}GOOD FOOD GETS PASSED AROUND.png`}
            alt="Hands passing a coconut dish"
          />
          <div>
            <Eyebrow>Together, we cook</Eyebrow>
            <h2>
              Good food
              <br />
              gets passed
              <br />
              <em>around.</em>
            </h2>
            <p>Cook it. Share it. Pass it on.</p>
            <ButtonLink href="/community">Share your recipe</ButtonLink>
            <ButtonLink href="/shop" ghost>
              Explore products
            </ButtonLink>
          </div>
        </section>
        <section className="recipes-newsletter" aria-label="Stay in the loop">
          <NewsletterSection />
        </section>
      </div>
      <ReferenceFooter />
      <MobileBottomNav />
    </div>
  );
}
function Bg({ n }: { n: string }) {
  return (
    <div
      className="section-bg"
      style={{ backgroundImage: `url('${B}${n}.png')` }}
    />
  );
}
function Meta({ r }: { r: Recipe }) {
  return (
    <div className="rd-meta">
      <span>
        <Clock3 /> {r.time} min
      </span>
      <span>{r.difficulty}</span>
      <span>Serves {r.servings}</span>
    </div>
  );
}
function Save({
  slug,
  label,
  saved,
}: {
  slug: string;
  label: string;
  saved: ReturnType<typeof useSavedContent>;
}) {
  const on = saved.saved.has(slug);
  return (
    <button
      className={`save-text ${on ? "active" : ""}`}
      aria-label={`${on ? "Remove" : "Save"} ${label}`}
      aria-pressed={on}
      onClick={() => void saved.toggle(slug)}
    >
      <Heart fill={on ? "currentColor" : "none"} />
      <span>{on ? "Saved" : "Save"}</span>
    </button>
  );
}
function Card({
  r,
  saved,
  active,
  onActivate,
}: {
  r: Recipe;
  saved: ReturnType<typeof useSavedContent>;
  active?: boolean;
  onActivate?: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{
        opacity: active === false ? 0.78 : 1,
        scale: active === false ? 0.975 : 1,
      }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`rd-card ${active ? "active-world" : ""}`}
      tabIndex={onActivate ? 0 : undefined}
      onPointerEnter={onActivate}
      onFocusCapture={onActivate}
      onClick={onActivate}
    >
      <div className="recipe-card-image">
        <Scene src={r.image} alt={r.title} />
        <Save slug={r.slug} label={r.title} saved={saved} />
      </div>
      <div className="rd-card-copy">
        <Eyebrow>{r.cuisine}</Eyebrow>
        <h3>{r.title}</h3>
        <p>{r.description}</p>
        <Meta r={r} />
        <small>{r.product}</small>
        <Link href={`/recipes/${r.slug}`}>
          View recipe <ArrowRight />
        </Link>
      </div>
    </motion.article>
  );
}
function Choice({
  label,
  value,
  items,
  set,
}: {
  label: string;
  value: string;
  items: string[];
  set: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <div className="rd-pills">
        {items.map((x) => (
          <button
            className="rd-pill"
            aria-pressed={value === x}
            onClick={() => set(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
function Select({
  label,
  value,
  items,
  set,
}: {
  label: string;
  value: string;
  items: string[];
  set: (v: string) => void;
}) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)}>
        {items.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
      <ChevronDown />
    </label>
  );
}
export function ProductsUsed({
  products,
}: {
  products: RecipeItem["products"];
}) {
  return (
    <div className="rd-glass recipe-detail-products">
      <Eyebrow>.CO products used</Eyebrow>
      {products.map((p) => (
        <Link href={`/shop?product=${p.slug}`} key={p.slug}>
          <span>
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="54px"
              className="object-contain"
            />
          </span>
          <span>
            <b>{p.name}</b>
            <small>{p.detail}</small>
          </span>
        </Link>
      ))}
    </div>
  );
}
export function DietaryVersions({
  items,
}: {
  items: RecipeItem["variations"];
}) {
  return (
    <div className="rd-glass recipe-detail-versions">
      <Eyebrow>Dietary versions</Eyebrow>
      <div className="rd-grid-3">
        {items.map((x) => (
          <article key={x.name}>
            <h3>{x.name}</h3>
            <p>{x.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
