"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/apiClient";

export default function CommentsPanel({ ideaId }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isOwner = useMemo(() => {
    const email = user?.email;
    return (comment) => comment.userEmail && email && comment.userEmail === email;
  }, [user?.email]);

  const loadComments = async () => {
    try {
      const response = await apiClient.get(`/comments/${ideaId}`);
      setComments(response?.data?.data || []);
    } catch {
      toast.error("Failed to load comments");
    }
  };

  useEffect(() => {
    if (!ideaId) return;
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideaId]);

  const onAdd = async () => {
    if (!user?.email) {
      toast.error("Please login to post comments");
      router.push(`/login?redirect=${encodeURIComponent(pathname || "/ideas")}`);
      return;
    }
    if (!text.trim()) return;
    try {
      setSubmitting(true);
      await apiClient.post("/comments", { ideaId, commentText: text.trim() });
      setText("");
      await loadComments();
      toast.success("Comment added");
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to add comment";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    try {
      await apiClient.delete(`/comments/${id}`);
      await loadComments();
      toast.success("Comment deleted");
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to delete comment";
      toast.error(message);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditingText(comment.commentText);
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) return;
    try {
      await apiClient.patch(`/comments/${id}`, { commentText: editingText.trim() });
      setEditingId(null);
      setEditingText("");
      await loadComments();
      toast.success("Comment updated");
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to update comment";
      toast.error(message);
    }
  };

  return (
    <section className="surface-card space-y-4 rounded-2xl p-4">
      <h3 className="text-main font-space text-xl font-semibold">Comments ({comments.length})</h3>
      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your comment..."
          className="field min-h-20 flex-1"
        />
        <button className="btn-primary h-fit" onClick={onAdd} type="button" disabled={submitting}>
          Post
        </button>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <article key={comment._id} className="surface-muted rounded-xl p-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-main font-medium">{comment.userName}</p>
                <p className="text-muted text-xs">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
              {isOwner(comment) ? (
                <div className="text-subtle flex gap-2">
                  <button type="button" onClick={() => startEdit(comment)} className="icon-btn">
                    <FiEdit2 />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(comment._id)}
                    className="icon-btn border-rose-400/60 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ) : null}
            </div>
            {editingId === comment._id ? (
              <div className="mt-3 space-y-2">
                <textarea
                  className="field min-h-20"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <div className="flex gap-2">
                  <button className="btn-primary" type="button" onClick={() => saveEdit(comment._id)}>
                    Save
                  </button>
                  <button
                    className="btn-secondary"
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditingText("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-subtle mt-3 text-sm">{comment.commentText}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
