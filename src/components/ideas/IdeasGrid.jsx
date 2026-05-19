"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import IdeaCard from "@/components/ideas/IdeaCard";
import IdeaFilters from "@/components/ideas/IdeaFilters";
import SkeletonCard from "@/components/common/SkeletonCard";
import apiClient from "@/lib/apiClient";

const PAGE_SIZE = 6;

export default function IdeasGrid() {
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    sort: "newest",
  });

  const categories = useMemo(() => {
    const all = ideas.map((item) => item.category).filter(Boolean);
    return [...new Set(all)];
  }, [ideas]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters.search, filters.category, filters.sort]);

  useEffect(() => {
    let mounted = true;

    const loadIdeas = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: PAGE_SIZE,
          sort: filters.sort,
        };
        if (filters.search) params.search = filters.search;
        if (filters.category !== "all") params.category = filters.category;

        const response = await apiClient.get("/ideas", { params });
        const payload = response?.data?.data;

        if (mounted) {
          setIdeas(payload?.items || []);
          setTotalPages(payload?.meta?.totalPages || 1);
        }
      } catch (error) {
        if (mounted) {
          setIdeas([]);
          setTotalPages(1);
          const message = error?.response?.data?.error || "Failed to load ideas";
          toast.error(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadIdeas();
    return () => {
      mounted = false;
    };
  }, [filters.category, filters.search, filters.sort, page]);

  return (
    <section className="space-y-6">
      <IdeaFilters filters={filters} setFilters={setFilters} categories={categories} />

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : ideas.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} />
          ))}
        </div>
      ) : (
        <div className="surface-card rounded-2xl border-dashed py-16 text-center">
          <p className="text-main font-space text-2xl">No ideas matched your filters</p>
          <p className="text-subtle mt-2 text-sm">Try changing category or search keywords.</p>
        </div>
      )}

      <div className="flex items-center justify-center gap-2">
        <button
          className="btn-secondary"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          type="button"
        >
          Prev
        </button>
        <span className="surface-muted text-subtle rounded-full px-3 py-2 text-sm">
          {page} / {totalPages}
        </span>
        <button
          className="btn-secondary"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          type="button"
        >
          Next
        </button>
      </div>
    </section>
  );
}
