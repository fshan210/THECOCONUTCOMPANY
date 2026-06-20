import { Appear } from "@/components/motion/Appear";

type SectionHeaderProps = {
  kicker: string;
  title: string;
  body?: string;
};

export function SectionHeader({ kicker, title, body }: SectionHeaderProps) {
  return (
    <Appear className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
      <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">{kicker}</p>
      <h2 className="font-display text-4xl font-light leading-tight text-coconut md:text-6xl lg:text-7xl">{title}</h2>
      {body ? <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-coconut/70">{body}</p> : null}
    </Appear>
  );
}
