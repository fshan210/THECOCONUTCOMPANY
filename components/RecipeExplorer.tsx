"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { BrandImage } from "@/components/BrandImage";
import { DoodleIcon } from "@/components/brand/BrandPrimitives";
import type { ContentRecipe } from "@/lib/content/types";
import { useCoconutMotionMode } from "@/lib/animations/coconut-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export function RecipeExplorer({ recipes }: { recipes: ContentRecipe[] }) {
  const recipeCategories = ["All recipes", ...Array.from(new Set(recipes.map((recipe) => recipe.category)))];
  const { shouldReduce } = useCoconutMotionMode();
  const [activeCategory, setActiveCategory] = useState("All recipes");
  const [query, setQuery] = useState("");

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return recipes.filter((recipe) => {
      const matchesCategory = activeCategory === "All recipes" || recipe.category === activeCategory;
      const searchable = [recipe.title, recipe.category, recipe.product, recipe.description, ...recipe.ingredients]
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [activeCategory, query, recipes]);

  return (
    <div>
      <div className="co-feature-grid p-4 md:p-5">
        <label className="relative block">
          <span className="sr-only">Search recipes</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--co-palm)]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search recipes or ingredients"
            className="co-input pl-14"
          />
        </label>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Recipe categories">
          {recipeCategories.map((category) => {
            const selected = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveCategory(category)}
                className={`co-press min-h-12 shrink-0 rounded-full border px-5 text-sm font-bold transition-colors ${
                  selected
                    ? "border-[var(--co-palm)] bg-[var(--co-palm)] text-white"
                    : "border-[var(--co-border)] bg-white text-[var(--co-brown)] hover:border-[var(--co-palm)]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7 flex items-end justify-between gap-4">
        <div>
          <p className="co-label">Recipe shelf</p>
          <h2 className="mt-3 text-[clamp(30px,4vw,58px)] font-bold leading-[0.94] text-[var(--co-brown)]">
            {activeCategory === "All recipes" ? "Made for real days." : activeCategory}
          </h2>
        </div>
        <p aria-live="polite" className="text-sm font-medium text-[var(--co-muted)]">
          {filteredRecipes.length} {filteredRecipes.length === 1 ? "recipe" : "recipes"}
        </p>
      </div>

      <motion.div layout className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredRecipes.map((recipe, index) => (
            <motion.article
              layout
              key={recipe.slug}
              id={recipe.slug}
              initial={shouldReduce ? false : { opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduce ? undefined : { opacity: 0, y: 10, scale: 0.985 }}
              transition={{ duration: shouldReduce ? 0 : 0.45, ease, delay: shouldReduce ? 0 : Math.min(index * 0.035, 0.2) }}
              className="co-press group grid min-w-0 overflow-hidden rounded-[32px] border border-[var(--co-border)] bg-white sm:grid-cols-[0.92fr_1.08fr] md:block"
            >
              <BrandImage
                src={recipe.image}
                alt={`${recipe.title}, a coconut recipe`}
                sizes="(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 42vw"
                aspect="landscape"
                fit="cover"
                hoverZoom
                className="h-full min-h-[190px] rounded-[0px] border-0 sm:rounded-r-[24px] md:min-h-0 md:rounded-[32px]"
              />
              <div className="flex min-w-0 flex-col p-5 md:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="co-label">{recipe.category}</span>
                  <DoodleIcon name={recipe.category === "Desserts" ? "cold" : "bowl"} className="h-7 w-7 text-[var(--co-palm)]" />
                </div>
                <h3 className="mt-4 text-[clamp(25px,2.8vw,38px)] font-bold leading-[0.98] text-[var(--co-brown)]">
                  {recipe.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-[var(--co-muted)]">{recipe.description}</p>
                <div className="mt-5 flex flex-wrap gap-2 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--co-brown)]">
                  <span className="rounded-full bg-[var(--co-cream)] px-3 py-2">{recipe.time}</span>
                  <span className="rounded-full bg-[var(--co-cream)] px-3 py-2">{recipe.difficulty}</span>
                  <span className="rounded-full bg-[var(--co-cream)] px-3 py-2">{recipe.nutrition}</span>
                </div>
                <div className="mt-auto pt-6">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--co-palm)]">Made with {recipe.product}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--co-muted)]">{recipe.ingredients.join(" · ")}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredRecipes.length === 0 ? (
        <div className="mt-6 rounded-[32px] border border-[var(--co-border)] bg-white p-10 text-center">
          <DoodleIcon name="bowl" className="mx-auto h-12 w-12 text-[var(--co-palm)]" />
          <h3 className="mt-5 text-2xl font-bold text-[var(--co-brown)]">No recipes on this shelf yet.</h3>
          <p className="mt-2 text-sm text-[var(--co-muted)]">Try another ingredient or clear the category filter.</p>
        </div>
      ) : null}
    </div>
  );
}
