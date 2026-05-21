"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMessageCircle, FiThumbsUp } from "react-icons/fi";
import SectionHeading from "@/components/common/SectionHeading";
import IdeaCard from "@/components/ideas/IdeaCard";
import SkeletonCard from "@/components/common/SkeletonCard";
import IdeaThumbnail from "@/components/common/IdeaThumbnail";
import apiClient from "@/lib/apiClient";
import { formatNumber } from "@/lib/utils";

export default function TrendingIdeasSection({ compact = false }) {
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadTrending = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/ideas/trending");
        if (mounted) {
          setTrending(response?.data?.data || []);
        }
      } catch (error) {
        if (mounted) {
          console.error("Failed to load trending ideas:", error);
          setTrending([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTrending();
    return () => {
      mounted = false;
    };
  }, []);

  if (compact) {
    return (
      <section className="mt-12 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-main font-space text-xl font-semibold">Trending Ideas</h3>
          <Link href="/ideas" className="text-sm font-medium text-cyan-500 hover:text-cyan-400">
            See All
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)
              : trending.map((idea) => (
                <article key={idea._id} className="surface-card flex h-full flex-col rounded-xl p-2.5">
                  <IdeaThumbnail
                    title={idea.title}
                    imageURL={idea.imageURL}
                    className="relative h-20 rounded-lg bg-linear-to-br from-violet-500/40 to-cyan-500/30"
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 16vw"
                  />
                  <div className="flex flex-1 flex-col">
                    <h4 className="text-main mt-2 line-clamp-2 text-sm font-semibold">{idea.title}</h4>
                    <p className="mt-1 text-[11px] text-cyan-500">{idea.category || "General"}</p>
                    <div className="text-subtle mt-2 flex items-center gap-2 text-[11px]">
                      <span className="inline-flex items-center gap-1">
                        <FiThumbsUp /> {formatNumber(idea.likesCount || 0)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FiMessageCircle /> {formatNumber(idea.commentsCount || 0)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/ideas/${idea._id}`}
                    className="btn-secondary mt-3 inline-flex w-full items-center justify-center rounded-md px-2.5 py-1.5 text-xs font-semibold"
                  >
                    View Details
                  </Link>
                </article>
              ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-20 space-y-8">
      <SectionHeading
        eyebrow="Trending Ideas"
        title="Trending Ideas"
        subtitle="Discover founder-driven concepts with real interaction data and rapid validation cycles."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)
          : trending.map((idea) => <IdeaCard key={idea._id} idea={idea} />)}
      </div>
      {!loading && trending.length === 0 ? (
        <div className="surface-card text-subtle rounded-2xl p-5 text-center">
          No trending ideas yet. Be the first to publish and start momentum.
        </div>
      ) : null}
    </section>
  );
}
