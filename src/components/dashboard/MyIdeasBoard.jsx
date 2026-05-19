"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiClock, FiHeart, FiMessageCircle } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/apiClient";

const initialEdit = {
  _id: "",
  title: "",
  shortDescription: "",
  category: "",
};

export default function MyIdeasBoard() {
  const { user } = useAuth();
  const [view, setView] = useState("grid");
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIdea, setEditIdea] = useState(initialEdit);
  const [deleteId, setDeleteId] = useState("");

  const loadMyIdeas = async () => {
    if (!user?.email) return;
    try {
      const response = await apiClient.get(`/ideas/my-ideas/${encodeURIComponent(user.email)}`);
      setIdeas(response?.data?.data || []);
    } catch {
      setIdeas([]);
      toast.error("Failed to load your ideas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    loadMyIdeas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const onSaveEdit = async (event) => {
    event.preventDefault();
    try {
      await apiClient.patch(`/ideas/${editIdea._id}`, {
        title: editIdea.title,
        shortDescription: editIdea.shortDescription,
        category: editIdea.category,
      });
      toast.success("Idea updated");
      setEditIdea(initialEdit);
      await loadMyIdeas();
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to update idea";
      toast.error(message);
    }
  };

  const onDelete = async () => {
    try {
      await apiClient.delete(`/ideas/${deleteId}`);
      toast.success("Idea deleted");
      setDeleteId("");
      await loadMyIdeas();
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to delete idea";
      toast.error(message);
    }
  };

  const formatRowDate = (value) => {
    const date = value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  };

  return (
    <section className="surface-elevated text-subtle space-y-3 rounded-2xl p-4 sm:p-5">
      <div className="inline-flex rounded-md bg-violet-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.12em] text-white shadow-[0_8px_20px_rgba(124,58,237,0.35)]">
        13. My Ideas Page
      </div>

      <div className="theme-divider flex flex-wrap items-center justify-between gap-2 border-b pb-2">
        <div className="inline-flex items-center gap-1.5 text-sm font-medium">
          <button
            className={`h-8 rounded-md px-3 text-[13px] transition ${view === "grid" ? "bg-violet-500/15 text-violet-500" : "text-muted hover:bg-[var(--surface-hover)]"}`}
            onClick={() => setView("grid")}
            type="button"
          >
            Card View
          </button>
          <button
            className={`h-8 rounded-md px-3 text-[13px] transition ${view === "table" ? "bg-violet-500/15 text-violet-500" : "text-muted hover:bg-[var(--surface-hover)]"}`}
            onClick={() => setView("table")}
            type="button"
          >
            Table View
          </button>
        </div>

        <Link href="/add-idea" className="btn-primary inline-flex h-8 items-center rounded-md px-3 text-[13px] font-semibold">
          + Add Idea
        </Link>
      </div>

      {loading ? (
        <div className="surface-muted text-muted rounded-xl p-8 text-center text-sm">Loading ideas...</div>
      ) : view === "grid" ? (
        <div className="space-y-2.5">
          {ideas.length === 0 ? (
            <p className="text-muted rounded-xl border border-dashed border-[var(--border-base)] bg-[var(--surface-3)] p-6 text-center text-sm">
              You have not created any ideas yet.
            </p>
          ) : null}

          {ideas.map((idea) => (
            <article
              key={idea._id}
              className="surface-muted grid min-h-[106px] gap-2.5 rounded-xl p-2.5 transition hover:border-violet-300 md:grid-cols-[90px_1fr_auto]"
            >
              <div
                className="h-[72px] rounded-lg bg-gradient-to-br from-indigo-200 to-violet-300"
                style={{
                  backgroundImage: idea.imageURL ? `url(${idea.imageURL})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-main font-space line-clamp-1 text-[1rem] font-semibold leading-tight">{idea.title}</h3>
                  <span className="tag-chip inline-flex min-w-[86px] justify-center px-2 py-0.5 text-[11px] font-semibold">
                    {idea.category}
                  </span>
                </div>

                <p className="text-muted line-clamp-1 text-[13px]">{idea.shortDescription}</p>

                <div className="text-muted flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="inline-flex items-center gap-1">
                    <FiClock /> {formatRowDate(idea.createdAt)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiHeart /> {idea.likesCount || 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiMessageCircle /> {idea.commentsCount || 0}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 md:flex-col md:items-end md:justify-center">
                <button
                  className="btn-secondary inline-flex h-8 min-w-[64px] items-center justify-center rounded-md px-2.5 text-xs font-semibold"
                  type="button"
                  onClick={() =>
                    setEditIdea({
                      _id: idea._id,
                      title: idea.title,
                      shortDescription: idea.shortDescription,
                      category: idea.category,
                    })
                  }
                >
                  Edit
                </button>
                <button
                  className="inline-flex h-8 min-w-[64px] items-center justify-center rounded-md border border-rose-400/40 bg-rose-500/10 px-2.5 text-xs font-semibold text-rose-500 transition hover:bg-rose-500/15"
                  type="button"
                  onClick={() => setDeleteId(idea._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="table-shell">
          <table className="text-left text-[13px]">
            <thead>
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Likes</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ideas.length === 0 ? (
                <tr>
                  <td className="text-muted px-4 py-6 text-center text-sm" colSpan={4}>
                    You have not created any ideas yet.
                  </td>
                </tr>
              ) : null}

              {ideas.map((idea) => (
                <tr key={idea._id} className="table-row-hover">
                  <td className="text-main px-4 py-3">{idea.title}</td>
                  <td className="px-4 py-3">
                    <span className="tag-chip rounded-full px-2 py-0.5 text-xs">{idea.category}</span>
                  </td>
                  <td className="px-4 py-3">{idea.likesCount || 0}</td>
                  <td className="px-4 py-3">
                    <button
                      className="btn-secondary inline-flex h-8 min-w-[64px] items-center justify-center rounded-md px-2.5 text-xs font-semibold"
                      type="button"
                      onClick={() =>
                        setEditIdea({
                          _id: idea._id,
                          title: idea.title,
                          shortDescription: idea.shortDescription,
                          category: idea.category,
                        })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="ml-2 inline-flex h-8 min-w-[64px] items-center justify-center rounded-md border border-rose-400/40 bg-rose-500/10 px-2.5 text-xs font-semibold text-rose-500 transition hover:bg-rose-500/15"
                      type="button"
                      onClick={() => setDeleteId(idea._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editIdea._id ? (
        <form onSubmit={onSaveEdit} className="panel-accent space-y-3 rounded-xl p-4">
          <h3 className="text-main font-space text-lg">Update Idea</h3>
          <input
            className="field"
            value={editIdea.title}
            onChange={(e) => setEditIdea((p) => ({ ...p, title: e.target.value }))}
            required
          />
          <input
            className="field"
            value={editIdea.shortDescription}
            onChange={(e) => setEditIdea((p) => ({ ...p, shortDescription: e.target.value }))}
            required
          />
          <input
            className="field"
            value={editIdea.category}
            onChange={(e) => setEditIdea((p) => ({ ...p, category: e.target.value }))}
            required
          />
          <div className="flex gap-2">
            <button className="btn-primary" type="submit">
              Save
            </button>
            <button className="btn-secondary" type="button" onClick={() => setEditIdea(initialEdit)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {deleteId ? (
        <div className="modal-surface space-y-3 rounded-xl border-rose-400/45 bg-rose-500/10 p-4">
          <h3 className="font-space text-lg text-rose-600">Delete Idea</h3>
          <p className="text-sm text-rose-600">Are you sure you want to delete this idea? This action cannot be undone.</p>
          <div className="flex gap-2">
            <button className="btn-secondary rounded-md px-3 py-1.5 text-sm font-semibold" type="button" onClick={() => setDeleteId("")}>
              Cancel
            </button>
            <button className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white" type="button" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
