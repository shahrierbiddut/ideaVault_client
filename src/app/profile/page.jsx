"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import PageTransition from "@/components/common/PageTransition";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import SectionHeading from "@/components/common/SectionHeading";
import { useAuth } from "@/context/AuthContext";

const MAX_BIO_LENGTH = 500;

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, updateProfile, changePassword, deleteAccount, extractApiError } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

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
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(extractApiError(error, "Failed to update profile"));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    try {
      setChangingPassword(true);
      await changePassword({ currentPassword, newPassword });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSection(false);
    } catch (error) {
      toast.error(extractApiError(error, "Failed to update password"));
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async (event) => {
    event.preventDefault();

    if (isLocalAuth && !deletePassword.trim()) {
      toast.error("Password is required to delete your account");
      return;
    }

    try {
      setDeletingAccount(true);
      await deleteAccount({ password: deletePassword || undefined });
      toast.success("Your account has been deleted");
      setShowDeleteModal(false);
      setDeletePassword("");
    } catch (error) {
      toast.error(extractApiError(error, "Failed to delete account"));
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <PageTransition>
      <section className="py-10">
        <SectionHeading eyebrow="Private" title="Profile Management" subtitle="Update your display information and account settings used across IdeaVault." />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="mb-4 text-lg font-semibold">Profile Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <label className="block space-y-1">
                <span className="text-subtle text-sm">Full Name</span>
                <input value={name} onChange={(event) => setName(event.target.value)} className="field" placeholder="Enter your full name" required />
              </label>

              <label className="block space-y-1">
                <span className="text-subtle text-sm">Photo URL</span>
                <input value={photoURL} onChange={(event) => setPhotoURL(event.target.value)} className="field" placeholder="https://example.com/avatar.png" type="url" />
              </label>

              <label className="block space-y-1">
                <span className="text-subtle text-sm">
                  Bio ({bio.length}/{MAX_BIO_LENGTH})
                </span>
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value.slice(0, MAX_BIO_LENGTH))}
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

          <div className="space-y-6">
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

            <div className="glass-panel rounded-2xl p-6">
              <h2 className="mb-4 text-lg font-semibold">Security</h2>

              {isLocalAuth && (
                <div className="space-y-4">
                  {!showPasswordSection ? (
                    <button type="button" onClick={() => setShowPasswordSection(true)} className="btn-secondary inline-block">
                      Change Password
                    </button>
                  ) : (
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <label className="block space-y-1">
                        <span className="text-subtle text-sm">Current Password</span>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(event) => setCurrentPassword(event.target.value)}
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
                          onChange={(event) => setNewPassword(event.target.value)}
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
                          onChange={(event) => setConfirmPassword(event.target.value)}
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
                          className="btn-secondary">
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
                <button type="button" onClick={() => setShowDeleteModal(true)} className="btn-danger inline-block">
                  Delete Account
                </button>
                <p className="mt-2 text-xs text-subtle">This action cannot be undone. Please be certain before proceeding.</p>
              </div>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl p-6 max-w-md mx-4">
              <h3 className="mb-2 text-lg font-semibold">Delete Account?</h3>
              <p className="mb-4 text-subtle text-sm">This will permanently delete your account and all associated data. This action cannot be undone.</p>

              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <label className="block space-y-1">
                  <span className="text-subtle text-sm">{isLocalAuth ? "Enter your password to confirm" : "Type DELETE to confirm"}</span>
                  <input
                    type={isLocalAuth ? "password" : "text"}
                    value={deletePassword}
                    onChange={(event) => setDeletePassword(event.target.value)}
                    className="field"
                    placeholder={isLocalAuth ? "Your password" : "DELETE"}
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
                    className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn-danger flex-1" disabled={deletingAccount || (!isLocalAuth && deletePassword !== "DELETE")}>
                    {deletingAccount ? "Deleting..." : "Delete Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </PageTransition>
  );
}
