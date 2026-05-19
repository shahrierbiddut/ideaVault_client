import Link from "next/link";

export default function NotFoundPageContent() {
  return (
    <section className="relative grid min-h-[74vh] place-items-center py-10">
      <div className="absolute left-6 top-10 h-36 w-36 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="glass-panel relative w-full max-w-5xl overflow-hidden rounded-3xl p-6 sm:p-10">
        <div className="pointer-events-none absolute left-8 top-8 h-2 w-2 rounded-full bg-white/80" />
        <div className="pointer-events-none absolute left-[22%] top-14 h-1.5 w-1.5 rounded-full bg-white/70" />
        <div className="pointer-events-none absolute right-[18%] top-12 h-1.5 w-1.5 rounded-full bg-cyan-300/70" />
        <div className="pointer-events-none absolute right-8 top-24 h-2 w-2 rounded-full bg-violet-300/70" />
        <div className="pointer-events-none absolute right-[30%] bottom-16 h-1.5 w-1.5 rounded-full bg-white/75" />

        <div className="grid items-center gap-8 md:grid-cols-[1.15fr_.85fr]">
          <div>
            <span className="inline-flex rounded-lg border border-violet-400/35 bg-violet-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[.16em] text-violet-500">
              Lost in orbit
            </span>
            <h1 className="text-main mt-4 font-space text-6xl font-bold leading-none sm:text-7xl">404</h1>
            <p className="text-main mt-3 text-2xl font-semibold">Page Not Found</p>
            <p className="text-subtle mt-3 max-w-lg text-sm sm:text-base">
              Oops. The page you are looking for drifted out of this galaxy. Try heading back to the main station and
              continue exploring ideas.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/" className="btn-primary">
                Go Home
              </Link>
              <Link href="/ideas" className="btn-secondary">
                Explore Ideas
              </Link>
            </div>
          </div>

          <div className="surface-card relative mx-auto h-64 w-full max-w-xs rounded-[2rem] bg-gradient-to-b from-violet-400/20 via-indigo-500/15 to-cyan-400/10 p-4">
            <div className="absolute left-1/2 top-5 h-5 w-5 -translate-x-1/2 rounded-full bg-white/90 shadow-[0_0_18px_rgba(255,255,255,.35)]" />
            <div className="absolute left-1/2 top-16 h-32 w-32 -translate-x-1/2 rounded-full border border-[var(--border-base)] bg-[var(--surface-1)]" />
            <div className="absolute left-1/2 top-28 h-20 w-28 -translate-x-1/2 rounded-[999px] border border-cyan-200/35 bg-cyan-300/10" />
            <div className="absolute bottom-5 left-1/2 h-10 w-40 -translate-x-1/2 rounded-full bg-indigo-900/55" />
            <div className="absolute left-8 top-24 h-2 w-2 rounded-full bg-indigo-300/85" />
            <div className="absolute right-9 top-24 h-2 w-2 rounded-full bg-indigo-300/85" />
          </div>
        </div>
      </div>
    </section>
  );
}
