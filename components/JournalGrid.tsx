import { journalEntries } from "@/lib/content";

export function JournalGrid() {
  return (
    <div className="grid gap-px bg-shell md:grid-cols-4">
      {journalEntries.map((entry) => (
        <article key={entry.title} className="min-h-72 bg-porcelain p-7 transition hover:bg-paper">
          <p className="mb-8 text-[0.7rem] uppercase tracking-editorial text-grove">{entry.category}</p>
          <h3 className="mb-5 font-display text-3xl leading-tight text-ink">{entry.title}</h3>
          <p className="text-sm leading-7 text-muted">{entry.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
