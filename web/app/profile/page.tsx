"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../lib/api";

type Profile = {
  id: number;
  user_id: number;
  headline: string | null;
  target_career: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [headline, setHeadline] = useState("");
  const [targetCareer, setTargetCareer] = useState("");

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const token = localStorage.getItem("skillbridge_token");

    if (!token) {
      setMessage("Please login first.");
      setLoading(false);
      return;
    }

    try {
      const data = await getProfile();

      setProfile(data);
      setHeadline(data.headline || "");
      setTargetCareer(data.target_career || "");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Failed to load profile.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const token = localStorage.getItem("skillbridge_token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const data = await updateProfile(
        headline.trim(),
        targetCareer.trim()
      );

      setProfile(data);

      setHeadline(data.headline || "");
      setTargetCareer(data.target_career || "");

      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Failed to update profile.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#070b17] text-white">
        <BackgroundGlow />

        <div className="relative flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-5">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-red-500 border-r-violet-500" />

            <p className="animate-pulse text-sm font-medium text-slate-400">
              Loading profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#070b17] text-white">
        <BackgroundGlow />

        <div className="relative flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-[#0c1222]/90 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
              ⚠️
            </div>

            <h2 className="text-xl font-bold text-white">
              Profile Not Found
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              {message || "Unable to load your profile."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b17] px-5 py-8 text-white lg:px-10">
      <BackgroundGlow />

      <div className="relative mx-auto max-w-6xl">
        {/* HEADER */}
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-lg shadow-red-500/50" />

            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
              SkillBridge
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Manage your career profile and personalize your SkillBridge
            experience.
          </p>
        </header>

        {/* TOP STATS */}
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <ProfileSummaryCard
            icon="✦"
            label="Headline"
            value={profile.headline || "Not added yet"}
            accent="red"
          />

          <ProfileSummaryCard
            icon="🎯"
            label="Target Career"
            value={profile.target_career || "Not added yet"}
            accent="violet"
          />
        </div>

        {/* CAREER PROFILE */}
        <section className="premium-card mb-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0b1120]/80 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="border-b border-white/10 bg-gradient-to-r from-red-500/[0.07] via-violet-500/[0.05] to-blue-500/[0.07] px-6 py-5 sm:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-lg">🚀</span>

                  <h2 className="text-lg font-bold text-white">
                    Career Profile
                  </h2>
                </div>

                <p className="text-xs text-slate-500">
                  Keep your career information updated.
                </p>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(true);
                    setMessage("");
                  }}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500 via-violet-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/30 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ✏️ Edit Profile
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>

                  <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                </button>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {!editing ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <ProfileField
                    label="Headline"
                    value={profile.headline || "Not added yet"}
                    icon="✦"
                  />

                  <ProfileField
                    label="Target Career"
                    value={profile.target_career || "Not added yet"}
                    icon="🎯"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-6">
                  {/* HEADLINE INPUT */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                      <span>✦</span>
                      Headline
                    </label>

                    <input
                      type="text"
                      value={headline}
                      onChange={(event) =>
                        setHeadline(event.target.value)
                      }
                      placeholder="Example: BCA Student | Python & Data Analysis"
                      maxLength={255}
                      className="w-full rounded-xl border border-white/10 bg-[#080d1a] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-700 focus:border-violet-500/60 focus:bg-[#0b1120] focus:ring-4 focus:ring-violet-500/10"
                    />

                    <p className="mt-2 text-right text-[10px] text-slate-600">
                      {headline.length}/255
                    </p>
                  </div>

                  {/* TARGET CAREER INPUT */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                      <span>🎯</span>
                      Target Career
                    </label>

                    <input
                      type="text"
                      value={targetCareer}
                      onChange={(event) =>
                        setTargetCareer(event.target.value)
                      }
                      placeholder="Example: Data Analyst"
                      maxLength={120}
                      className="w-full rounded-xl border border-white/10 bg-[#080d1a] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-700 focus:border-blue-500/60 focus:bg-[#0b1120] focus:ring-4 focus:ring-blue-500/10"
                    />

                    <p className="mt-2 text-right text-[10px] text-slate-600">
                      {targetCareer.length}/120
                    </p>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500 via-violet-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {saving ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Saving...
                        </>
                      ) : (
                        <>
                          ✓ Save Profile
                          <span className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </>
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setHeadline(profile.headline || "");
                      setTargetCareer(profile.target_career || "");
                      setMessage("");
                    }}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] hover:text-white active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* MESSAGE */}
            {message && (
              <div
                className={`mt-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                  message.includes("successfully")
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-red-500/20 bg-red-500/10 text-red-400"
                }`}
              >
                <span>
                  {message.includes("successfully") ? "✓" : "⚠️"}
                </span>

                <span>{message}</span>
              </div>
            )}
          </div>
        </section>

        {/* PROFILE INFORMATION */}
        <section className="premium-card overflow-hidden rounded-3xl border border-white/10 bg-[#0b1120]/80 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="border-b border-white/10 bg-gradient-to-r from-blue-500/[0.07] via-violet-500/[0.05] to-red-500/[0.07] px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
                🔐
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  Profile Information
                </h2>

                <p className="text-xs text-slate-500">
                  Account information connected to your profile.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            <ProfileField
              label="Profile ID"
              value={String(profile.id)}
              icon="#"
            />

            <ProfileField
              label="User ID"
              value={String(profile.user_id)}
              icon="👤"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================
   PROFILE SUMMARY CARD
========================================= */

function ProfileSummaryCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  accent: "red" | "violet";
}) {
  const accentClass =
    accent === "red"
      ? "from-red-500/15 via-red-500/5"
      : "from-violet-500/15 via-violet-500/5";

  const iconClass =
    accent === "red"
      ? "bg-red-500/10 text-red-400"
      : "bg-violet-500/10 text-violet-400";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${accentClass} to-[#0b1120] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-xl hover:shadow-black/20`}
    >
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/[0.02] blur-2xl transition-all duration-500 group-hover:scale-150" />

      <div className="relative flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass} text-lg transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            {label}
          </p>

          <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-200">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   PROFILE FIELD
========================================= */

function ProfileField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/5 bg-[#080d1a]/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/20 hover:bg-[#0a1020]">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/10 to-violet-500/10 text-sm text-violet-400 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-200">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   BACKGROUND
========================================= */

function BackgroundGlow() {
  return (
    <>
      <div className="pointer-events-none absolute left-[10%] top-[-100px] h-72 w-72 rounded-full bg-red-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute right-[10%] top-[20%] h-80 w-80 rounded-full bg-violet-600/10 blur-[130px]" />

      <div className="pointer-events-none absolute bottom-[-120px] left-[35%] h-80 w-80 rounded-full bg-blue-600/10 blur-[130px]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.025),transparent_35%)]" />
    </>
  );
}