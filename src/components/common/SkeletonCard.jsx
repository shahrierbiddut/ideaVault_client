export default function SkeletonCard() {
  return (
    <div className="surface-card animate-pulse rounded-2xl p-4">
      <div className="mb-4 h-40 rounded-xl bg-[var(--surface-hover)]" />
      <div className="mb-2 h-4 w-2/3 rounded bg-[var(--surface-hover)]" />
      <div className="mb-4 h-3 w-11/12 rounded bg-[var(--surface-hover)]" />
      <div className="h-3 w-1/3 rounded bg-[var(--surface-hover)]" />
    </div>
  );
}
