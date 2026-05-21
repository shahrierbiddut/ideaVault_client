"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import PageTransition from "@/components/common/PageTransition";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import SectionHeading from "@/components/common/SectionHeading";
import { useAuth } from "@/context/AuthContext";

<<<<<<< HEAD
const MAX_BIO_LENGTH = 500;

export default function ProfilePage() {
    const { user, updateProfile, changePassword, deleteAccount, extractApiError } = useAuth();

    // Profile Information
    const [name, setName] = useState(user?.name || "");
    const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [savingProfile, setSavingProfile] = useState(false);

    // Password Change (local auth only)
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    // Delete Account
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deletingAccount, setDeletingAccount] = useState(false);

    const isLocalAuth = user?.provider === "local";
    const createdDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown";

    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        if (!name.trim()) {
            toast.error("Full name is required");
            return;
        }

        try {
            setSavingProfile(true);
            await updateProfile({ name, photoURL, bio });
=======
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
>>>>>>> 5d92f019daa869af3ad776687834343031034445
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(extractApiError(error, "Failed to update profile"));
        } finally {
<<<<<<< HEAD
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();

        if (!currentPassword) {
            toast.error("Current password is required");
            return;
        }

        if (!newPassword) {
            toast.error("New password is required");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setChangingPassword(true);
            await changePassword({ currentPassword, newPassword });
            toast.success("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowPasswordSection(false);
        } catch (error) {
            toast.error(extractApiError(error, "Failed to change password"));
        } finally {
            setChangingPassword(false);
        }
    };

    const handleDeleteAccount = async (event) => {
        event.preventDefault();

        if (!deletePassword) {
            toast.error("Password is required to delete account");
            return;
        }

        try {
            setDeletingAccount(true);
            await deleteAccount({ password: deletePassword });
            toast.success("Account deleted successfully");
            // Redirect will be handled by the app after logout
            window.location.href = "/";
        } catch (error) {
            toast.error(extractApiError(error, "Failed to delete account"));
        } finally {
            setDeletingAccount(false);
=======
            setSaving(false);
>>>>>>> 5d92f019daa869af3ad776687834343031034445
        }
    };

    return (
        <ProtectedRoute>
            <PageTransition>
<<<<<<< HEAD
                <section className="py-10">
                    <SectionHeading eyebrow="Private" title="Profile Management" subtitle="Update your display information and account settings used across IdeaVault." />

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* LEFT COLUMN: Profile Information */}
                        <div className="glass-panel rounded-2xl p-6">
                            <h2 className="mb-4 text-lg font-semibold">Profile Information</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <label className="block space-y-1">
                                    <span className="text-subtle text-sm">Full Name</span>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="field"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </label>

                                <label className="block space-y-1">
                                    <span className="text-subtle text-sm">Photo URL</span>
                                    <input
                                        value={photoURL}
                                        onChange={(e) => setPhotoURL(e.target.value)}
                                        className="field"
                                        placeholder="https://example.com/avatar.png"
                                        type="url"
                                    />
                                </label>

                                <label className="block space-y-1">
                                    <span className="text-subtle text-sm">
                                        Bio ({bio.length}/{MAX_BIO_LENGTH})
                                    </span>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value.slice(0, MAX_BIO_LENGTH))}
                                        className="field min-h-24 resize-none"
                                        placeholder="Tell us about yourself (max 500 characters)..."
                                        maxLength={MAX_BIO_LENGTH}
                                    />
                                </label>

                                <button type="submit" className="btn-primary" disabled={savingProfile}>
                                    {savingProfile ? "Saving..." : "Save Profile"}
                                </button>
                            </form>
                        </div>

                        {/* RIGHT COLUMN: Account Info + Security */}
                        <div className="space-y-6">
                            {/* Account Information Section */}
                            <div className="glass-panel rounded-2xl p-6">
                                <h2 className="mb-4 text-lg font-semibold">Account Information</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between border-b border-subtle/20 pb-3">
                                        <span className="text-subtle text-sm">Email</span>
                                        <span className="font-medium">{user?.email}</span>
                                    </div>

                                    <div className="flex items-center justify-between border-b border-subtle/20 pb-3">
                                        <span className="text-subtle text-sm">Account Type</span>
                                        <span className="font-medium capitalize">{user?.provider || "local"}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-subtle text-sm">Member Since</span>
                                        <span className="font-medium">{createdDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Section */}
                            <div className="glass-panel rounded-2xl p-6">
                        <h2 className="mb-4 text-lg font-semibold">Security</h2>

                        {isLocalAuth && (
                            <div className="space-y-4">
                                {!showPasswordSection ? (
                                    <button
                                        onClick={() => setShowPasswordSection(true)}
                                        className="btn-secondary inline-block"
                                    >
                                        Change Password
                                    </button>
                                ) : (
                                    <form onSubmit={handleChangePassword} className="space-y-4">
                                        <label className="block space-y-1">
                                            <span className="text-subtle text-sm">Current Password</span>
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="field"
                                                placeholder="Enter your current password"
                                                required
                                            />
                                        </label>

                                        <label className="block space-y-1">
                                            <span className="text-subtle text-sm">New Password</span>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="field"
                                                placeholder="Enter your new password"
                                                required
                                            />
                                        </label>

                                        <label className="block space-y-1">
                                            <span className="text-subtle text-sm">Confirm New Password</span>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="field"
                                                placeholder="Confirm your new password"
                                                required
                                            />
                                        </label>

                                        <div className="flex gap-3">
                                            <button type="submit" className="btn-primary" disabled={changingPassword}>
                                                {changingPassword ? "Changing..." : "Update Password"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowPasswordSection(false);
                                                    setCurrentPassword("");
                                                    setNewPassword("");
                                                    setConfirmPassword("");
                                                }}
                                                className="btn-secondary"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {isLocalAuth && <hr className="my-6 border-subtle/20" />}

                        <div>
                            <h3 className="mb-2 text-sm font-semibold text-red-500">Danger Zone</h3>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="btn-danger inline-block"
                            >
                                Delete Account
                            </button>
                            <p className="mt-2 text-xs text-subtle">
                                This action cannot be undone. Please be certain before proceeding.
                            </p>
                        </div>
                    </div>
                        </div>
                    </div>

                    {/* Delete Account Modal */}
                    {showDeleteModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="glass-panel rounded-2xl p-6 max-w-md mx-4">
                                <h3 className="mb-2 text-lg font-semibold">Delete Account?</h3>
                                <p className="mb-4 text-subtle text-sm">
                                    This will permanently delete your account and all associated data. This action cannot be undone.
                                </p>

                                <form onSubmit={handleDeleteAccount} className="space-y-4">
                                    <label className="block space-y-1">
                                        <span className="text-subtle text-sm">Enter your password to confirm</span>
                                        <input
                                            type="password"
                                            value={deletePassword}
                                            onChange={(e) => setDeletePassword(e.target.value)}
                                            className="field"
                                            placeholder="Your password"
                                            required
                                        />
                                    </label>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowDeleteModal(false);
                                                setDeletePassword("");
                                            }}
                                            className="btn-secondary flex-1"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-danger flex-1"
                                            disabled={deletingAccount}
                                        >
                                            {deletingAccount ? "Deleting..." : "Delete Account"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
=======
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
>>>>>>> 5d92f019daa869af3ad776687834343031034445
                </section>
            </PageTransition>
        </ProtectedRoute>
    );
}