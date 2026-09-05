"use client";
import { useEffect, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";
import type { ContentJournalPost } from "@/lib/content/types";
import {
  ReferenceHeader,
  ReferenceFooter,
} from "@/components/home/ReferenceHomePage";
import { NewsletterSection } from "@/components/launch/NewsletterSection";
import { featured, mergeStories, type Story } from "./journal-data";
import { Reader, JournalSavedProvider } from "./JournalPrimitives";
import { JournalArchive, JournalOpening } from "./JournalArchive";
import { CoconutConfigurator, JournalFarm } from "./JournalFarm";
import {
  JournalCommunity,
  JournalExplainers,
  RitualPlanner,
} from "./JournalCommunity";
import { JournalClosing, ShareStory } from "./JournalClosing";
export function ReferenceJournalPage({
  journalEntries = [],
}: {
  journalEntries?: ContentJournalPost[];
}) {
  const stories = useMemo(() => mergeStories(journalEntries), [journalEntries]);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Story | null>(null);
  const [sharing, setSharing] = useState(false);
  const read = (id: string) => {
    setSelected(
      id === featured.id ? featured : stories.find((s) => s.id === id) || null,
    );
    const url = new URL(window.location.href);
    url.searchParams.set("story", id);
    window.history.replaceState(null, "", url);
  };
  const close = () => {
    setSelected(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("story");
    window.history.replaceState(null, "", url);
  };
  useEffect(() => {
    const sync = () => {
      const id = new URL(window.location.href).searchParams.get("story");
      setSelected(
        id === featured.id
          ? featured
          : stories.find((s) => s.id === id) || null,
      );
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [stories]);
  const goIndex = () =>
    document.getElementById("journal-index")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  return (
    <MotionConfig reducedMotion="user">
      <JournalSavedProvider>
        <div className="rd-page jn-page">
          <ReferenceHeader />
          <JournalOpening read={read} />
          <JournalArchive
            stories={stories}
            category={category}
            setCategory={setCategory}
            query={query}
            setQuery={setQuery}
            read={read}
          />
          <div className="jn-world jn-world--three">
            <JournalFarm />
            <CoconutConfigurator
              explain={() =>
                document
                  .getElementById("explainers")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            />
          </div>
          <div className="jn-world jn-world--four">
            <JournalExplainers />
            <JournalCommunity read={read} share={() => setSharing(true)} />
            <RitualPlanner />
          </div>
          <JournalClosing
            read={read}
            share={() => setSharing(true)}
            filter={(c) => {
              setCategory(c);
              setQuery("");
              goIndex();
            }}
            search={(q) => {
              setCategory("All");
              setQuery(q);
              goIndex();
            }}
          />
          <div className="co-shop-newsletter-shell jn-newsletter">
            <NewsletterSection />
          </div>
          <ReferenceFooter />
          <Reader story={selected} close={close} />
          <ShareStory open={sharing} setOpen={setSharing} />
        </div>
      </JournalSavedProvider>
    </MotionConfig>
  );
}
