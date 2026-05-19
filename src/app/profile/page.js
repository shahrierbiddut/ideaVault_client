"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import PageTransition from "@/components/common/PageTransition";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import SectionHeading from "@/components/common/SectionHeading";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
    const { user, updateProfile, extractApiError } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            await updateProfile({ name, photoURL });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(extractApiError(error, "Failed to update profile"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <ProtectedRoute>
            <PageTransition>
                <section className="space-y-6 py-10">
                    <SectionHeading eyebrow="Private" title="Profile Management" subtitle="Update your display information used across IdeaVault." />

                    <form onSubmit={handleSubmit} className="glass-panel max-w-2xl space-y-4 rounded-2xl p-6">
                        <label className="block space-y-1">
                            <span className="text-subtle text-sm">Full Name</span>
                            <input value={name} onChange={(event) => setName(event.target.value)} className="field" placeholder="Enter your full name" required />
                        </label>

                        <label className="block space-y-1">
                            <span className="text-subtle text-sm">Photo URL</span>
                            <input value={photoURL} onChange={(event) => setPhotoURL(event.target.value)} className="field" placeholder="https://example.com/avatar.png" />
                        </label>

                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </section>
            </PageTransition>
        </ProtectedRoute>
    );
}