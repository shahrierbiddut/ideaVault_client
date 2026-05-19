"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import apiClient from "@/lib/apiClient";

const steps = ["Basic Info", "Problem & Solution", "Additional Info", "Review & Submit"];

const initialForm = {
  title: "",
  shortDescription: "",
  description: "",
  category: "Tech",
  tags: "",
  imageUrl: "",
  budget: "",
  audience: "",
  problem: "",
  solution: "",
};

const categories = ["Tech", "AI", "Health", "Education", "Environment", "Social", "Agriculture"];

export default function AddIdeaWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const validateStep = () => {
    if (step === 0) {
      if (!form.title.trim() || !form.shortDescription.trim()) {
        toast.error("Please fill Idea Title and Short Description");
        return false;
      }
    }

    if (step === 1) {
      if (!form.problem.trim() || !form.solution.trim()) {
        toast.error("Please fill Problem and Solution");
        return false;
      }
    }

    if (step === 2) {
      if (!form.description.trim()) {
        toast.error("Please add Detailed Description");
        return false;
      }
    }

    return true;
  };

  const onNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(steps.length - 1, s + 1));
  };

  const onPrev = () => setStep((s) => Math.max(0, s - 1));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      setSubmitting(true);
      const payload = {
        title: form.title,
        shortDescription: form.shortDescription,
        detailedDescription: form.description,
        category: form.category,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        imageURL: form.imageUrl,
        estimatedBudget: form.budget,
        targetAudience: form.audience,
        problemStatement: form.problem,
        proposedSolution: form.solution,
      };

      await apiClient.post("/ideas", payload);
      toast.success("Idea submitted successfully");
      router.push("/ideas");
    } catch (error) {
      const message = error?.response?.data?.error || error?.response?.data?.message || "Failed to submit idea";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="surface-elevated text-main space-y-4 rounded-2xl p-5 md:p-7">
      <div className="inline-flex rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white">6. ADD IDEA PAGE (STEP FORM)</div>

      <div className="theme-divider grid gap-2 border-b pb-4 md:grid-cols-4">
        {steps.map((label, idx) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                idx <= step ? "bg-violet-600 text-white" : "bg-[var(--surface-hover)] text-[var(--text-muted)]"
              }`}
            >
              {idx + 1}
            </span>
            <span className={`text-sm ${idx <= step ? "font-semibold text-violet-500" : "text-muted"}`}>{label}</span>
          </div>
        ))}
      </div>

      <div className="surface-muted space-y-4 rounded-xl p-4 md:p-5">
        <h3 className="text-main text-lg font-semibold">Basic Information</h3>
        <p className="text-muted text-sm">Tell us about your startup idea</p>

        {step === 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-subtle text-sm font-medium">Idea Title</span>
              <input
                className="field"
                placeholder="Enter idea title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
            </label>

            <label className="space-y-2">
              <span className="text-subtle text-sm font-medium">Short Description</span>
              <textarea
                className="field min-h-20"
                placeholder="Write a short description"
                value={form.shortDescription}
                onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
              />
            </label>

            <label className="space-y-2">
              <span className="text-subtle text-sm font-medium">Category</span>
              <select
                className="select-field"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-subtle text-sm font-medium">Tags (optional)</span>
              <input
                className="field"
                placeholder="Enter tags separated by commas"
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              />
            </label>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-4">
            <label className="space-y-2">
              <span className="text-subtle text-sm font-medium">Problem Statement</span>
              <textarea
                className="field min-h-28"
                placeholder="Describe the problem"
                value={form.problem}
                onChange={(e) => setForm((p) => ({ ...p, problem: e.target.value }))}
              />
            </label>

            <label className="space-y-2">
              <span className="text-subtle text-sm font-medium">Proposed Solution</span>
              <textarea
                className="field min-h-28"
                placeholder="Describe your solution"
                value={form.solution}
                onChange={(e) => setForm((p) => ({ ...p, solution: e.target.value }))}
              />
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-subtle text-sm font-medium">Image URL (optional)</span>
              <input
                className="field"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              />
            </label>

            <label className="space-y-2">
              <span className="text-subtle text-sm font-medium">Estimated Budget</span>
              <input
                className="field"
                placeholder="e.g. $10,000"
                value={form.budget}
                onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-subtle text-sm font-medium">Target Audience</span>
              <input
                className="field"
                placeholder="Who will use it?"
                value={form.audience}
                onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))}
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-subtle text-sm font-medium">Detailed Description</span>
              <textarea
                className="field min-h-32"
                placeholder="Explain the idea in detail"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="surface-card text-subtle space-y-3 rounded-lg p-4 text-sm">
            <p><strong>Idea:</strong> {form.title}</p>
            <p><strong>Category:</strong> {form.category}</p>
            <p><strong>Short Description:</strong> {form.shortDescription}</p>
            <p><strong>Budget:</strong> {form.budget || "N/A"}</p>
            <p><strong>Audience:</strong> {form.audience || "N/A"}</p>
            <p><strong>Problem:</strong> {form.problem}</p>
            <p><strong>Solution:</strong> {form.solution}</p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="btn-secondary rounded-md px-4 py-2 text-sm font-medium disabled:opacity-60"
          onClick={onPrev}
          disabled={step === 0 || submitting}
        >
          Previous
        </button>

        {step === steps.length - 1 ? (
          <button
            className="btn-primary rounded-md px-5 py-2 text-sm font-semibold disabled:opacity-60"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Idea"}
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary rounded-md px-5 py-2 text-sm font-semibold disabled:opacity-60"
            onClick={onNext}
            disabled={submitting}
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
}
