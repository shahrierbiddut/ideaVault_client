"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PageTransition from "@/components/common/PageTransition";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import CommentsPanel from "@/components/details/CommentsPanel";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/apiClient";
import { formatNumber } from "@/lib/utils";

export default function IdeaDetailsPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const ideaId = params?.id;
  const [loading, setLoading] = useState(true);
  const [idea, setIdea] = useState(null);

  const ensureAuth = () => {
    if (user?.email) return true;
    toast.error("Please login to continue");
    router.push(`/login?redirect=/ideas/${ideaId}`);
    return false;
  };

  const saveInteraction = async (type) => {
    if (!idea?._id) return;
    if (!ensureAuth()) return;

    try {
      await apiClient.post("/interactions", { ideaId: idea._id, type });
      if (type === "like") {
        setIdea((prev) => ({ ...prev, likesCount: (prev?.likesCount || 0) + 1 }));
      }
      toast.success(type === "like" ? "Liked idea" : "Bookmarked idea");
    } catch (error) {
      const message = error?.response?.data?.error || error?.response?.data?.message || `Failed to add ${type}`;
      toast.error(message);
    }
  };

  useEffect(() => {
    if (!ideaId) return;

    let mounted = true;
    const loadIdea = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/ideas/${ideaId}`);
        if (mounted) {
          setIdea(response?.data?.data || null);
        }
      } catch {
        if (mounted) {
          setIdea(null);
          toast.error("Failed to load idea details");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadIdea();
    return () => {
      mounted = false;
    };
  }, [ideaId]);

  const tags = useMemo(() => {
    if (!idea?.tags) return [];
    if (Array.isArray(idea.tags)) return idea.tags;
    return [];
  }, [idea?.tags]);

  if (loading) {
    return <LoadingSpinner label="Loading idea details..." />;
  }

  if (!idea) {
    return (
      <section className="py-14">
        <div className="surface-card rounded-2xl p-8 text-center">
          <h2 className="text-main font-space text-2xl">Idea not found</h2>
          <p className="text-subtle mt-2 text-sm">This idea may have been removed or is unavailable.</p>
        </div>
      </section>
    );
  }

  return (
    <PageTransition>
      <section className="space-y-6 py-10">
        <div className="surface-card overflow-hidden rounded-3xl p-3">
          <div
            className="h-72 rounded-2xl bg-gradient-to-br from-violet-500/40 to-cyan-500/30"
            style={{
              backgroundImage: idea.imageURL ? `url(${idea.imageURL})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_.38fr]">
          <article className="surface-card rounded-2xl p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-main font-space text-3xl font-semibold">{idea.title}</h1>
              <span className="tag-chip">{idea.category}</span>
            </div>
            <p className="text-subtle mt-3">{idea.detailedDescription}</p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="meta-card">
                <h3>Budget</h3>
                <p>{idea.estimatedBudget || "N/A"}</p>
              </div>
              <div className="meta-card">
                <h3>Target Audience</h3>
                <p>{idea.targetAudience || "N/A"}</p>
              </div>
              <div className="meta-card md:col-span-2">
                <h3>Problem Statement</h3>
                <p>{idea.problemStatement || "N/A"}</p>
              </div>
              <div className="meta-card md:col-span-2">
                <h3>Proposed Solution</h3>
                <p>{idea.proposedSolution || "N/A"}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-violet-400/35 bg-violet-500/10 px-2 py-1 text-xs text-violet-500">
                  #{tag}
                </span>
              ))}
            </div>
          </article>

          <aside className="space-y-4">
            <div className="surface-card rounded-2xl p-4">
              <p className="text-subtle text-sm">Created by</p>
              <p className="text-main font-medium">{idea.creatorName}</p>
              <p className="text-muted text-xs">{idea.creatorEmail}</p>
            </div>
            <div className="surface-card rounded-2xl p-4">
              <p className="text-subtle text-sm">Engagement</p>
              <p className="text-main mt-2">{formatNumber(idea.likesCount || 0)} Likes</p>
              <p className="text-main">{formatNumber(idea.commentsCount || 0)} Comments</p>
              <div className="mt-3 flex gap-2">
                <button className="btn-secondary" type="button" onClick={() => saveInteraction("like")}>
                  Like
                </button>
                <button className="btn-secondary" type="button" onClick={() => saveInteraction("bookmark")}>
                  Bookmark
                </button>
              </div>
            </div>
          </aside>
        </div>

        <CommentsPanel ideaId={idea._id} />
      </section>
    </PageTransition>
  );
}
