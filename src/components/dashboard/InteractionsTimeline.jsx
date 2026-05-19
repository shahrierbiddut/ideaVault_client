"use client";

import { useEffect, useMemo, useState } from "react";
import { FiHeart, FiMessageCircle, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/apiClient";

const iconMap = {
  comment: FiMessageCircle,
  bookmark: FiStar,
  like: FiHeart,
};

function getRelativeTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "Unknown";

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return "1 week ago";
  return `${diffWeeks} weeks ago`;
}

function getActionLabel(type) {
  if (type === "comment") return "Commented on";
  if (type === "bookmark") return "Bookmarked";
  if (type === "like") return "Liked";
  return "Interacted with";
}

export default function InteractionsTimeline() {
  const { user } = useAuth();
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    let mounted = true;
    const loadInteractions = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/interactions/${encodeURIComponent(user.email)}`);
        if (mounted) {
          const incoming = response?.data?.data || [];
          const enriched = incoming.map((item) => ({
            ...item,
            actionLabel: getActionLabel(item.type),
            relativeTime: getRelativeTime(item.createdAt),
          }));
          setInteractions(enriched);
        }
      } catch {
        if (mounted) {
          setInteractions([]);
          toast.error("Failed to load interactions");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInteractions();
    return () => {
      mounted = false;
    };
  }, [user?.email]);

  const stats = useMemo(() => {
    const comments = interactions.filter((item) => item.type === "comment").length;
    const ideasCommented = new Set(
      interactions.filter((item) => item.type === "comment").map((item) => item.ideaId?._id || item.ideaId)
    ).size;
    const bookmarks = interactions.filter((item) => item.type === "bookmark").length;
    const likes = interactions.filter((item) => item.type === "like").length;

    return { comments, ideasCommented, bookmarks, likes };
  }, [interactions]);

  return (
    <section className="surface-elevated text-subtle space-y-3 rounded-2xl p-4 sm:p-5">
      <div className="inline-flex rounded-md bg-violet-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.12em] text-white shadow-[0_8px_20px_rgba(124,58,237,0.35)]">
        14. My Interactions Page
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Comments", value: stats.comments },
          { label: "Ideas Commented", value: stats.ideasCommented },
          { label: "Bookmarks", value: stats.bookmarks },
          { label: "Likes", value: stats.likes },
        ].map((stat) => (
          <div key={stat.label} className="surface-muted rounded-xl p-3.5 text-center">
            <p className="text-main font-space text-[1.9rem] leading-none">{stat.value}</p>
            <p className="text-muted mt-1 text-[10px] font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="surface-muted rounded-xl p-4 sm:p-[18px]">
        <h3 className="text-main font-space text-[1.45rem] font-semibold">Recent Interactions</h3>
        <div className="mt-3 space-y-2.5">
          {loading ? (
            <p className="text-muted text-sm">Loading interactions...</p>
          ) : interactions.length ? (
            interactions.map((item) => {
              const Icon = iconMap[item.type] || FiMessageCircle;
              const colorClass = item.type === "like" ? "text-rose-500" : item.type === "bookmark" ? "text-amber-500" : "text-cyan-500";
              return (
                <div key={item._id} className="surface-card flex min-h-[58px] items-center justify-between rounded-lg px-3 py-2">
                  <div className="text-subtle flex items-center gap-2.5 text-sm">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--surface-hover)]">
                      <Icon className={colorClass} />
                    </span>
                    <div>
                      <p className="text-muted text-[11px] font-medium tracking-[.01em]">{item.actionLabel || "Interacted with"}</p>
                      <p className="text-main line-clamp-1 text-[15px] font-semibold">{item.ideaId?.title || "an idea"}</p>
                    </div>
                  </div>
                  <span className="text-muted text-[11px]">{item.relativeTime || "Unknown"}</span>
                </div>
              );
            })
          ) : (
            <p className="text-muted text-sm">No interaction found yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
