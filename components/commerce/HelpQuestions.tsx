"use client";
import { useState } from "react";
import { Search } from "lucide-react";
export function HelpQuestions({
  questions,
}: {
  questions: Array<{ title: string; body: string }>;
}) {
  const [query, setQuery] = useState("");
  const shown = questions.filter((q) =>
    `${q.title} ${q.body}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="cm-panel cm-faq">
      <p className="cm-eyebrow">Frequently asked questions</p>
      <h2>
        You ask, <em>we answer.</em>
      </h2>
      <label className="cm-search-field">
        <Search size={18} />
        <input
          aria-label="Search help"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for help…"
        />
      </label>
      <p className="cm-help-count" role="status">
        {query
          ? `${shown.length} answers`
          : "Find answers to common questions."}
      </p>
      {shown.map((q) => (
        <details key={q.title}>
          <summary>
            {q.title}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{q.body}</p>
        </details>
      ))}
      {!shown.length && (
        <p>
          Try another keyword, or{" "}
          <a href="mailto:hello@cothecoconutcompany.com">email our team</a>.
        </p>
      )}
    </section>
  );
}
