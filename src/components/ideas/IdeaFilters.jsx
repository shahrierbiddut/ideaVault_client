"use client";

export default function IdeaFilters({ filters, setFilters, categories = [] }) {
  return (
    <div className="surface-card grid gap-3 rounded-2xl p-4 md:grid-cols-2 lg:grid-cols-3">
      <input
        value={filters.search}
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        placeholder="Search ideas by title"
        className="field"
      />
      <select
        value={filters.category}
        onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
        className="select-field"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={filters.sort}
        onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
        className="select-field"
      >
        <option value="newest">Newest</option>
        <option value="popular">Most Popular</option>
        <option value="commented">Most Commented</option>
      </select>
    </div>
  );
}
