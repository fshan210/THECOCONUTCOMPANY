type SectionHeaderProps = {
  kicker: string;
  title: string;
  body?: string;
};

export function SectionHeader({ kicker, title, body }: SectionHeaderProps) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">{kicker}</p>
      <h2 className="font-display text-4xl leading-tight text-ink md:text-6xl">{title}</h2>
      {body ? <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted">{body}</p> : null}
    </div>
  );
}
