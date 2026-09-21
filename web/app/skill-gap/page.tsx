"use client";

import { useEffect, useState } from "react";
import { getProfile, getSkills } from "../../lib/api";

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

const skillColors: Record<string, string> = {
  Python: "cobalt",
  SQL: "teal",
  Excel: "peach",
  Statistics: "plum",
  Pandas: "lime",
  NumPy: "lime",
  "Data Visualization": "coral",
  "Power BI": "teal",

  HTML: "coral",
  CSS: "cobalt",
  JavaScript: "peach",
  React: "teal",
  Git: "lime",
  GitHub: "plum",
  APIs: "coral",

  OOP: "plum",
  FastAPI: "teal",
  Django: "lime",
};

const colorClasses = {
  coral: {
    border: "border-[#ff7f6e]/30",
    bg: "bg-[#ff7f6e]/10",
    text: "text-[#ff9b8d]",
    solid: "bg-[#ff7f6e]",
    glow: "shadow-[#ff7f6e]/20",
  },
  cobalt: {
    border: "border-[#4169e1]/30",
    bg: "bg-[#4169e1]/10",
    text: "text-[#7090ff]",
    solid: "bg-[#4169e1]",
    glow: "shadow-[#4169e1]/20",
  },
  teal: {
    border: "border-[#20c9b0]/30",
    bg: "bg-[#20c9b0]/10",
    text: "text-[#55e0ca]",
    solid: "bg-[#20c9b0]",
    glow: "shadow-[#20c9b0]/20",
  },
  lime: {
    border: "border-[#a8e63d]/30",
    bg: "bg-[#a8e63d]/10",
    text: "text-[#c3f46d]",
    solid: "bg-[#a8e63d]",
    glow: "shadow-[#a8e63d]/20",
  },
  plum: {
    border: "border-[#9b59b6]/30",
    bg: "bg-[#9b59b6]/10",
    text: "text-[#c07bdd]",
    solid: "bg-[#9b59b6]",
    glow: "shadow-[#9b59b6]/20",
  },
  peach: {
    border: "border-[#ffb38a]/30",
    bg: "bg-[#ffb38a]/10",
    text: "text-[#ffc19e]",
    solid: "bg-[#ffb38a]",
    glow: "shadow-[#ffb38a]/20",
  },
};

export default function SkillGapPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkillGap();
  }, []);

  async function loadSkillGap() {
    const token = localStorage.getItem("skillbridge_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const profileData = await getProfile();
      const skillsData = await getSkills();

      setProfile(profileData);
      setSkills(skillsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const targetCareer = profile?.target_career || "Data Analyst";

  const requiredSkills =
    roadmapSkills[targetCareer] ||
    roadmapSkills["Data Analyst"];

  const userSkillNames = skills.map((skill) =>
    skill.skill_name.trim().toLowerCase()
  );

  const matchedSkills = requiredSkills.filter((skill) =>
    userSkillNames.includes(skill.toLowerCase())
  );

  const missingSkills = requiredSkills.filter(
    (skill) =>
      !userSkillNames.includes(skill.toLowerCase())
  );

  const matchPercentage =
    requiredSkills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length / requiredSkills.length) * 100
        );

  const getSkillColor = (skill: string) => {
    const color = skillColors[skill] || "cobalt";
    return colorClasses[color as keyof typeof colorClasses];
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b17] text-white">
        <div className="text-center">
          <div className="relative mx-auto mb-5 h-16 w-16">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-[#4169e1]/20" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl shadow-2xl">
              📊
            </div>
          </div>

          <p className="text-sm font-bold text-slate-300">
            Loading Skill Gap...
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Analyzing your career skills
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b17] px-5 py-8 text-white lg:px-10">
      {/* Background Glow */}

      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#ff7f6e]/10 blur-[140px]" />

      <div className="pointer-events-none absolute right-[-150px] top-[10%] h-[450px] w-[450px] rounded-full bg-[#4169e1]/10 blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-180px] left-[30%] h-[450px] w-[450px] rounded-full bg-[#9b59b6]/10 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}

        <header className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#ff7f6e] shadow-lg shadow-[#ff7f6e]/50" />

            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ff9b8d]">
              SkillBridge Intelligence
            </span>
          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Skill Gap{" "}
                <span className="bg-gradient-to-r from-[#ff7f6e] via-[#9b59b6] to-[#4169e1] bg-clip-text text-transparent">
                  Analysis
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
                Identify the skills you already have and discover what
                you need to learn for your target career.
              </p>
            </div>

            {/* Career Card */}

            <div className="group rounded-3xl border border-[#20c9b0]/20 bg-[#20c9b0]/5 p-5 shadow-xl shadow-[#20c9b0]/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#20c9b0]/40">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#55e0ca]">
                Target Career
              </p>

              <div className="mt-2 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#20c9b0]/10 text-xl">
                  🎯
                </span>

                <p className="text-lg font-black text-white">
                  {targetCareer}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Hero */}

        <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#4169e1]/10 blur-[70px]" />

          <div className="relative">
            <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a8e63d]/10">
                    📈
                  </span>

                  <h2 className="text-xl font-black">
                    Career Skill Progress
                  </h2>
                </div>

                <p className="text-xs text-slate-600">
                  {matchedSkills.length} of {requiredSkills.length} required
                  skills matched
                </p>
              </div>

              <div className="text-right">
                <div className="text-4xl font-black text-white">
                  {matchPercentage}
                  <span className="text-xl text-slate-600">%</span>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  Skill Match
                </p>
              </div>
            </div>

            {/* Progress */}

            <div className="h-4 overflow-hidden rounded-full bg-white/5">
              <div
                className="relative h-full rounded-full bg-gradient-to-r from-[#ff7f6e] via-[#9b59b6] to-[#4169e1] shadow-lg shadow-[#9b59b6]/20 transition-all duration-1000"
                style={{ width: `${matchPercentage}%` }}
              >
                <div className="absolute right-0 top-0 h-full w-20 animate-pulse bg-white/20 blur-md" />
              </div>
            </div>

            <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-700">
              <span>Starting Point</span>
              <span>Career Ready</span>
            </div>
          </div>
        </section>

        {/* Skill Cards */}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Your Skills */}

          <section className="group relative overflow-hidden rounded-[2rem] border border-[#a8e63d]/20 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#a8e63d]/35 md:p-7">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#a8e63d]/5 blur-3xl" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#a8e63d]/10 text-xl">
                    ✅
                  </div>

                  <div>
                    <h2 className="text-lg font-black">
                      Your Skills
                    </h2>

                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#a8e63d]">
                      Matched Skills
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-[#a8e63d]/20 bg-[#a8e63d]/10 px-3 py-1 text-xs font-black text-[#c3f46d]">
                  {matchedSkills.length}
                </span>
              </div>

              {matchedSkills.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-8 text-center">
                  <div className="mb-3 text-3xl">🔍</div>

                  <p className="text-sm font-semibold text-slate-400">
                    No required skills matched yet.
                  </p>

                  <p className="mt-1 text-xs text-slate-700">
                    Add skills from your Profile page.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {matchedSkills.map((skill) => {
                    const colors = getSkillColor(skill);

                    return (
                      <span
                        key={skill}
                        className={`rounded-xl border ${colors.border} ${colors.bg} px-4 py-2.5 text-xs font-bold ${colors.text} shadow-lg ${colors.glow} transition-all duration-300 hover:-translate-y-1`}
                      >
                        ✓ {skill}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Missing Skills */}

          <section className="group relative overflow-hidden rounded-[2rem] border border-[#ff7f6e]/20 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#ff7f6e]/35 md:p-7">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#ff7f6e]/5 blur-3xl" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff7f6e]/10 text-xl">
                    ⚠️
                  </div>

                  <div>
                    <h2 className="text-lg font-black">
                      Missing Skills
                    </h2>

                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff9b8d]">
                      Skills To Learn
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-[#ff7f6e]/20 bg-[#ff7f6e]/10 px-3 py-1 text-xs font-black text-[#ff9b8d]">
                  {missingSkills.length}
                </span>
              </div>

              {missingSkills.length === 0 ? (
                <div className="rounded-2xl border border-[#a8e63d]/20 bg-[#a8e63d]/5 p-8 text-center">
                  <div className="mb-3 text-3xl">🎉</div>

                  <p className="text-sm font-bold text-[#c3f46d]">
                    You have all required skills!
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {missingSkills.map((skill) => {
                    const colors = getSkillColor(skill);

                    return (
                      <span
                        key={skill}
                        className={`rounded-xl border ${colors.border} ${colors.bg} px-4 py-2.5 text-xs font-bold ${colors.text} transition-all duration-300 hover:-translate-y-1`}
                      >
                        ○ {skill}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Learning Roadmap */}

        <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-[#9b59b6]/20 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8">
          <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-[#9b59b6]/5 blur-[90px]" />

          <div className="relative">
            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#9b59b6]/10 text-xl">
                🚀
              </div>

              <div>
                <h2 className="text-xl font-black">
                  What You Should Learn
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  Focus on these skills to reduce your career skill gap.
                </p>
              </div>
            </div>

            {missingSkills.length === 0 ? (
              <div className="rounded-2xl border border-[#a8e63d]/20 bg-[#a8e63d]/5 p-6">
                <p className="text-sm leading-6 text-slate-300">
                  🎉 You have completed all the required skills for this
                  career roadmap. Start building projects and preparing
                  for interviews.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {missingSkills.map((skill, index) => {
                  const colors = getSkillColor(skill);

                  return (
                    <div
                      key={skill}
                      className={`group/item flex items-center gap-4 rounded-2xl border ${colors.border} ${colors.bg} p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${colors.glow}`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.solid} text-sm font-black text-[#070b17]`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0">
                        <p className={`text-sm font-black ${colors.text}`}>
                          {skill}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          Learn & practice this skill
                        </p>
                      </div>

                      <span className="ml-auto text-slate-700 transition-transform duration-300 group-hover/item:translate-x-1">
                        →
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Color Legend */}

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">
            SkillBridge Color System
          </p>

          <div className="flex flex-wrap gap-3">
            <ColorLegend
              color="bg-[#ff7f6e]"
              name="Coral"
            />

            <ColorLegend
              color="bg-[#4169e1]"
              name="Cobalt"
            />

            <ColorLegend
              color="bg-[#20c9b0]"
              name="Teal"
            />

            <ColorLegend
              color="bg-[#a8e63d]"
              name="Lime"
            />

            <ColorLegend
              color="bg-[#9b59b6]"
              name="Plum"
            />

            <ColorLegend
              color="bg-[#ffb38a]"
              name="Peach"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function ColorLegend({
  color,
  name,
}: {
  color: string;
  name: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-3 py-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />

      <span className="text-[10px] font-bold text-slate-500">
        {name}
      </span>
    </div>
  );
}