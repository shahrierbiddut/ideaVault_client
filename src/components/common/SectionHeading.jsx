import { cn } from "@/lib/utils";

export default function SectionHeading({ eyebrow, title, subtitle, className }) {
  return (
    <div className={cn("space-y-3", className)}>
      {eyebrow ? (
        <span className="inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[.15em] text-violet-500">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-main text-balance font-space text-3xl font-semibold md:text-4xl">{title}</h2>
      {subtitle ? <p className="text-subtle max-w-2xl text-sm leading-relaxed md:text-base">{subtitle}</p> : null}
    </div>
  );
}
