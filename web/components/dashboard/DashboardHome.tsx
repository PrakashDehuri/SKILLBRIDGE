"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getProfile,
  getSkills,
} from "../../lib/api";

type Skill = {
  id: number;
  user_id: number;
  skill_name: string;
  skill_level: number;
};

type Profile = {
  id: number;
  user_id: number;
  headline: string | null;
  target_career: string | null;
};

type DashboardUser = {
  name: string;
  email: string;
};

const roadmapSkills: Record<string, string[]> = {
  "Data Analyst": [
    "Python",
    "SQL",
    "Excel",
    "Statistics",
    "Pandas",
    "NumPy",
    "Data Visualization",
    "Power BI",
  ],

  "Web Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Git",
    "GitHub",
    "APIs",
  ],

  "Python Developer": [
    "Python",
    "OOP",
    "Git",
    "SQL",
    "APIs",
    "FastAPI",
    "Django",
  ],
};

export default function DashboardHome({ user }: { user?: DashboardUser }) {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [skills, setSkills] =
    useState<Skill[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const token =
      localStorage.getItem("skillbridge_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const profileData =
        await getProfile();

      const skillsData =
        await getSkills();

      setProfile(profileData);
      setSkills(skillsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070b17] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-red-500" />

            <h2 className="text-xl font-semibold">
              Loading Dashboard...
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Preparing your career dashboard
            </p>
          </div>
        </div>
      </main>
    );
  }

  const targetCareer =
    profile?.target_career ||
    "Data Analyst";

  const requiredSkills =
    roadmapSkills[targetCareer] ||
    roadmapSkills["Data Analyst"];

  const userSkillNames =
    skills.map((skill) =>
      skill.skill_name.toLowerCase()
    );

  const matchedSkills =
    requiredSkills.filter((skill) =>
      userSkillNames.includes(
        skill.toLowerCase()
      )
    );

  const missingSkills =
    requiredSkills.filter(
      (skill) =>
        !userSkillNames.includes(
          skill.toLowerCase()
        )
    );

  const skillProgress =
    requiredSkills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length /
            requiredSkills.length) *
            100
        );

  const averageSkillLevel =
    skills.length === 0
      ? 0
      : Math.round(
          (skills.reduce(
            (total, skill) =>
              total + skill.skill_level,
            0
          ) /
            skills.length) *
            20
        );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b17] px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* Background Glow */}

      <div className="pointer-events-none fixed left-[10%] top-[-180px] h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[140px]" />

      <div className="pointer-events-none fixed right-[-100px] top-[20%] h-[400px] w-[400px] rounded-full bg-red-600/10 blur-[140px]" />

      <div className="pointer-events-none fixed bottom-[-200px] left-[40%] h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-[1250px]">

        {/* Header */}

        <header className="mb-8">

          <div className="mb-3 flex items-center gap-3">

            <div className="h-1 w-10 rounded-full bg-gradient-to-r from-red-500 to-violet-500" />

            <p className="text-xs font-bold tracking-[0.35em] text-red-400">
              SKILLBRIDGE
            </p>

          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back{" "}
            <span className="inline-block animate-pulse">
              👋
            </span>
          </h1>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Your personalized career dashboard
          </p>

        </header>

        {/* Profile Hero */}

        <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-[#10182b] to-[#111827] p-6 shadow-2xl shadow-black/30 sm:p-8">

          <div className="absolute right-[-60px] top-[-80px] h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />

          <div className="relative">

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

              <div>

                <p className="text-sm text-slate-500">
                  Hello,
                </p>

                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                  {profile?.headline ||
                    "SkillBridge User"}
                </h2>

                <div className="mt-4 flex flex-wrap items-center gap-2">

                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400">
                    🎯 Target Career
                  </span>

                  <span className="font-semibold text-slate-200">
                    {targetCareer}
                  </span>

                </div>

              </div>

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-3xl shadow-lg shadow-red-500/10">
                🎯
              </div>

            </div>

          </div>

        </section>

        {/* Statistics */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            icon="💻"
            title="My Skills"
            value={skills.length.toString()}
            description="Skills added"
            iconClass="bg-blue-500/10 text-blue-400 border-blue-500/20"
          />

          <StatCard
            icon="📈"
            title="Skill Progress"
            value={`${skillProgress}%`}
            description={`${matchedSkills.length} of ${requiredSkills.length} matched`}
            iconClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          />

          <StatCard
            icon="⚠️"
            title="Skill Gap"
            value={missingSkills.length.toString()}
            description="Skills to learn"
            iconClass="bg-red-500/10 text-red-400 border-red-500/20"
            danger
          />

          <StatCard
            icon="⭐"
            title="Skill Level"
            value={`${averageSkillLevel}%`}
            description="Average proficiency"
            iconClass="bg-violet-500/10 text-violet-400 border-violet-500/20"
          />

        </div>

        {/* Main Grid */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* Career Progress */}

          <section className="premium-dashboard-card">

            <SectionTitle
              icon="🧭"
              title="Career Progress"
              subtitle={targetCareer}
            />

            <div className="mt-7">

              <div className="mb-3 flex items-end justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Overall completion
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {skillProgress}%
                  </p>
                </div>

                <span className="text-sm text-slate-500">
                  {matchedSkills.length}/
                  {requiredSkills.length}
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-red-500 shadow-lg shadow-violet-500/20 transition-all duration-700"
                  style={{
                    width: `${skillProgress}%`,
                  }}
                />

              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                {matchedSkills.length} required skills
                matched out of{" "}
                {requiredSkills.length}.
              </p>

              <Link
                href="/roadmap"
                className="mt-5 inline-flex items-center rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20 hover:text-blue-300"
              >
                View Roadmap →
              </Link>

            </div>

          </section>

          {/* Skill Gap */}

          <section className="premium-dashboard-card border-red-500/10">

            <SectionTitle
              icon="⚠️"
              title="Skill Gap"
              subtitle="Skills you should learn"
            />

            {missingSkills.length === 0 ? (

              <div className="mt-7 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">

                <div className="text-3xl">
                  🎉
                </div>

                <h3 className="mt-3 font-bold text-emerald-400">
                  Excellent progress!
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  You have all the required skills.
                </p>

              </div>

            ) : (

              <>

                <div className="mt-6 flex flex-wrap gap-2">

                  {missingSkills
                    .slice(0, 6)
                    .map((skill) => (
                      <span
                        key={skill}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:border-red-500/40 hover:bg-red-500/15"
                      >
                        ● {skill}
                      </span>
                    ))}

                </div>

                <Link
                  href="/skill-gap"
                  className="mt-6 inline-flex items-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 hover:shadow-red-500/30"
                >
                  View Skill Gap →
                </Link>

              </>

            )}

          </section>

          {/* Current Skills */}

          <section className="premium-dashboard-card">

            <SectionTitle
              icon="💻"
              title="Current Skills"
              subtitle="Your current technical skills"
            />

            {skills.length === 0 ? (

              <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-6 text-center">

                <div className="text-3xl">
                  💻
                </div>

                <p className="mt-3 text-sm text-slate-400">
                  No skills added yet.
                </p>

              </div>

            ) : (

              <div className="mt-6 grid gap-3">

                {skills
                  .slice(0, 5)
                  .map((skill) => {

                    const percentage =
                      skill.skill_level * 20;

                    return (
                      <div
                        key={skill.id}
                        className="rounded-xl border border-white/5 bg-slate-950/50 p-4"
                      >

                        <div className="mb-2 flex items-center justify-between">

                          <span className="font-semibold text-slate-200">
                            {skill.skill_name}
                          </span>

                          <span className="text-xs font-bold text-blue-400">
                            {skill.skill_level}/5
                          </span>

                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">

                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  })}

              </div>

            )}

            <Link
              href="/skills"
              className="mt-5 inline-flex items-center rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
            >
              Manage Skills →
            </Link>

          </section>

          {/* Recommendation */}

          <section className="premium-dashboard-card border-violet-500/10">

            <SectionTitle
              icon="🎯"
              title="Next Recommendation"
              subtitle="Your next learning step"
            />

            {missingSkills.length > 0 ? (

              <div className="mt-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-2xl">
                    🚀
                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                      Recommended Skill
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      Learn {missingSkills[0]}
                    </h3>

                  </div>

                </div>

                <p className="mt-5 text-sm leading-6 text-slate-400">
                  This skill is part of your{" "}
                  <span className="font-semibold text-slate-200">
                    {targetCareer}
                  </span>{" "}
                  roadmap. Learning it will help
                  reduce your current skill gap.
                </p>

              </div>

            ) : (

              <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">

                <div className="text-3xl">
                  🎉
                </div>

                <h3 className="mt-2 font-bold text-emerald-400">
                  Great progress!
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Continue building projects and
                  preparing for interviews.
                </p>

              </div>

            )}

            <Link
              href="/recommendations"
              className="mt-5 inline-flex items-center rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-400 transition hover:bg-violet-500/20"
            >
              View Recommendations →
            </Link>

          </section>

        </div>

        {/* Quick Actions */}

        <section className="premium-dashboard-card mt-5">

          <SectionTitle
            icon="⚡"
            title="Quick Actions"
            subtitle="Jump directly to a SkillBridge module"
          />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">

            <QuickAction
              href="/skills"
              icon="💻"
              text="Add Skills"
            />

            <QuickAction
              href="/roadmap"
              icon="🧭"
              text="Roadmap"
            />

            <QuickAction
              href="/skill-gap"
              icon="⚠️"
              text="Skill Gap"
              red
            />

            <QuickAction
              href="/recommendations"
              icon="🎯"
              text="Recommendations"
            />

            <QuickAction
              href="/jobs"
              icon="💼"
              text="Jobs"
            />

            <QuickAction
              href="/resume"
              icon="📄"
              text="Resume"
            />

            <QuickAction
              href="/assistant"
              icon="🤖"
              text="AI Assistant"
              purple
            />

          </div>

        </section>

      </div>
    </main>
  );
}

/* ==========================================
   SECTION TITLE
========================================== */

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-800/70 text-lg">
        {icon}
      </div>

      <div>

        <h2 className="font-bold text-slate-100">
          {title}
        </h2>

        <p className="mt-0.5 text-xs text-slate-500">
          {subtitle}
        </p>

      </div>

    </div>
  );
}

/* ==========================================
   STAT CARD
========================================== */

function StatCard({
  icon,
  title,
  value,
  description,
  iconClass,
  danger = false,
}: {
  icon: string;
  title: string;
  value: string;
  description: string;
  iconClass: string;
  danger?: boolean;
}) {
  return (
    <div
      className={`group rounded-2xl border bg-slate-900/70 p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-slate-900 ${
        danger
          ? "border-red-500/10 hover:border-red-500/30"
          : "border-white/10 hover:border-blue-500/20"
      }`}
    >

      <div className="flex items-start justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl ${iconClass}`}
        >
          {icon}
        </div>

        {danger && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
        )}

      </div>

      <p className="mt-5 text-xs font-medium uppercase tracking-wider text-slate-500">
        {title}
      </p>

      <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">
        {value}
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}

/* ==========================================
   QUICK ACTION
========================================== */

function QuickAction({
  href,
  icon,
  text,
  red = false,
  purple = false,
}: {
  href: string;
  icon: string;
  text: string;
  red?: boolean;
  purple?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col items-center justify-center rounded-xl border p-3 text-center transition duration-300 hover:-translate-y-1 ${
        red
          ? "border-red-500/15 bg-red-500/5 hover:border-red-500/30 hover:bg-red-500/10"
          : purple
            ? "border-violet-500/15 bg-violet-500/5 hover:border-violet-500/30 hover:bg-violet-500/10"
            : "border-white/10 bg-slate-950/40 hover:border-blue-500/25 hover:bg-blue-500/10"
      }`}
    >

      <span className="text-xl transition duration-300 group-hover:scale-110">
        {icon}
      </span>

      <span className="mt-2 text-[11px] font-semibold text-slate-400 group-hover:text-white">
        {text}
      </span>

    </Link>
  );
}
