"use client";
import { ResponsiveImage as Image } from "@/components/media/ResponsiveImage";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import {
  CommerceHero,
  CommerceSurface,
  CommerceTrust,
  CommerceLink,
} from "./Primitives";
export type SearchEntry = {
  id: string;
  title: string;
  description: string;
  kind: "Products" | "Recipes" | "Journal";
  category: string;
  image: string;
  href: string;
  price?: number;
  cartSlug?: string;
  availabilityStatus?: "preview" | "coming-soon" | "in-stock" | "out-of-stock";
};
export function SearchSurface({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [kind, setKind] = useState("All results");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("relevance");
  const cart = useCart();
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);
  const matched = useMemo(
    () =>
      entries.filter((x) =>
        `${x.title} ${x.description} ${x.category}`
          .toLowerCase()
          .includes(debounced.toLowerCase()),
      ),
    [entries, debounced],
  );
  const facets = useMemo(
    () =>
      Array.from(
        new Set(
          matched
            .filter((x) => kind === "All results" || x.kind === kind)
            .map((x) => x.category),
        ),
      ).sort(),
    [matched, kind],
  );
  const visible = useMemo(() => {
    const result = matched.filter(
      (x) =>
        (kind === "All results" || x.kind === kind) &&
        (!category || x.category === category),
    );
    if (sort === "name") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "price")
      result.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    return result;
  }, [matched, kind, category, sort]);
  return (
    <CommerceSurface>
      <CommerceHero
        eyebrow="Search"
        title={
          <>
            Find good
            <br />
            <em>in everything.</em>
          </>
        }
        body="Products, recipes and stories — discover your next coconut favourite."
      >
        <form
          className="cm-search-field"
          onSubmit={(e) => {
            e.preventDefault();
            setDebounced(query.trim());
          }}
        >
          <Search />
          <label className="sr-only" htmlFor="commerce-search">
            Search products, recipes and stories
          </label>
          <input
            id="commerce-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <X size={18} />
            </button>
          )}
          <button aria-label="Search">→</button>
        </form>
        <div className="cm-popular">
          {["Coconut milk", "Coconut oil", "Coconut water"].map((x) => (
            <button
              key={x}
              onClick={() => {
                setQuery(x);
                setCategory("");
              }}
            >
              {x}
            </button>
          ))}
        </div>
      </CommerceHero>
      <div className="cm-container">
        <div className="cm-tabs" role="group" aria-label="Result types">
          {["All results", "Products", "Recipes", "Journal"].map((x) => (
            <button
              key={x}
              aria-pressed={kind === x}
              onClick={() => {
                setKind(x);
                setCategory("");
              }}
            >
              {x}{" "}
              <small>
                (
                {x === "All results"
                  ? matched.length
                  : matched.filter((e) => e.kind === x).length}
                )
              </small>
            </button>
          ))}
        </div>
        <div className="cm-search-layout">
          <aside className="cm-panel cm-facets">
            <details open>
              <summary>Refine results</summary>
              <label>
                Category
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All categories</option>
                  {facets.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <button
                className="cm-text-button"
                onClick={() => {
                  setCategory("");
                  setKind("All results");
                  setQuery("");
                }}
              >
                Clear all filters
              </button>
            </details>
          </aside>
          <div>
            <div className="cm-results-heading">
              <h2 aria-live="polite">
                {visible.length} results
                {debounced ? ` for “${debounced}”` : " to explore"}
              </h2>
              <label>
                Sort by
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="relevance">Relevance</option>
                  <option value="name">Name A–Z</option>
                  {kind === "Products" && (
                    <option value="price">Price low to high</option>
                  )}
                </select>
              </label>
            </div>
            {visible.length ? (
              <div className="cm-result-groups">
                {["Products", "Recipes", "Journal"]
                  .filter((group) => visible.some((x) => x.kind === group))
                  .map((group) => (
                    <section className="cm-result-group" key={group}>
                      <div className="cm-group-heading">
                        <h3>
                          {group} (
                          {visible.filter((x) => x.kind === group).length})
                        </h3>
                        {kind === "All results" && (
                          <button
                            className="cm-text-button"
                            onClick={() => {
                              setKind(group);
                              setCategory("");
                            }}
                          >
                            View all →
                          </button>
                        )}
                      </div>
                      <div className="cm-results">
                        {visible
                          .filter((x) => x.kind === group)
                          .slice(0, kind === "All results" ? 3 : undefined)
                          .map((x) => (
                            <article
                              key={x.id}
                              className={`cm-result cm-result--${x.kind.toLowerCase()}`}
                            >
                              <Link href={x.href} className="cm-result-image">
                                <Image
                                  src={x.image}
                                  alt={x.title}
                                  fill
                                  sizes="(max-width:600px) 85vw, (max-width:1000px) 40vw, 320px"
                                />
                              </Link>
                              <div>
                                <p className="cm-eyebrow">
                                  {x.kind} · {x.category}
                                </p>
                                <h3>
                                  <Link href={x.href}>{x.title}</Link>
                                </h3>
                                <p>{x.description}</p>
                                {x.price != null && (
                                  <strong>
                                    ₹{x.price.toLocaleString("en-IN")}
                                  </strong>
                                )}
                                {x.cartSlug ? (
                                  <button
                                    className="cm-button"
                                    onClick={() =>
                                      cart.addItem(x.cartSlug!, {
                                        unitPrice: x.price,
                                      })
                                    }
                                  >
                                    Add to cart →
                                  </button>
                                ) : (
                                  <CommerceLink secondary href={x.href}>
                                    {x.kind === "Recipes"
                                      ? "View recipe"
                                      : x.kind === "Journal"
                                        ? "Read journal"
                                        : x.availabilityStatus === "out-of-stock"
                                          ? "Out of stock"
                                          : x.availabilityStatus === "coming-soon"
                                            ? "Coming soon"
                                            : "View product"}
                                  </CommerceLink>
                                )}
                              </div>
                            </article>
                          ))}
                      </div>
                    </section>
                  ))}
              </div>
            ) : (
              <section className="cm-panel">
                <h2>No matches yet.</h2>
                <p>
                  Try another keyword, clear your filters or browse our
                  collection.
                </p>
                <button
                  className="cm-button"
                  onClick={() => {
                    setQuery("");
                    setCategory("");
                    setKind("All results");
                  }}
                >
                  Clear search and filters
                </button>
                <CommerceLink href="/support" secondary>
                  Get help
                </CommerceLink>
              </section>
            )}
          </div>
        </div>
        <CommerceTrust />
      </div>
    </CommerceSurface>
  );
}
