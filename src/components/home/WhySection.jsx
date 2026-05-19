import { FiCpu, FiLayers, FiUsers, FiZap } from "react-icons/fi";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/common/SectionHeading";

const icons = [FiUsers, FiLayers, FiZap, FiCpu];

export default function WhySection({ whyItems = [], compact = false, className }) {
  if (compact) {
    return (
      <section className={cn("surface-card space-y-4 rounded-2xl p-4", className)}>
        <h3 className="text-main font-space text-xl font-semibold">Why IdeaVault?</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {whyItems.map((item, idx) => {
            const Icon = icons[idx];
            return (
              <article key={item.title} className="surface-muted rounded-xl p-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/25 to-cyan-400/25 text-cyan-500">
                  <Icon />
                </span>
                <h4 className="text-main mt-2 text-base font-semibold">{item.title}</h4>
                <p className="text-subtle mt-1 text-xs leading-relaxed">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("mt-20 space-y-8", className)}>
      <SectionHeading
        eyebrow="Why IdeaVault"
        title="Built for founders who move with clarity"
        subtitle="From collaboration to validation, everything is designed to turn startup thinking into actionable progress."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {whyItems.map((item, idx) => {
          const Icon = icons[idx];
          return (
            <article
              key={item.title}
              className="surface-card group rounded-2xl p-5 transition hover:border-violet-300/45 hover:bg-[var(--surface-hover)]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-400/30 text-cyan-500">
                <Icon />
              </span>
              <h3 className="text-main mt-4 font-space text-xl font-semibold">{item.title}</h3>
              <p className="text-subtle mt-2 text-sm leading-relaxed">{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
