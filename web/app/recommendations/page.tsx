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

type Recommendation = {
  icon: string;
  title: string;
  description: string;
  priority: string;
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

const skillColors = [
  {
    border: "border-[#ff7f6e]/25",
    bg: "bg-[#ff7f6e]/10",
    text: "text-[#ff9b8d]",
    icon: "bg-[#ff7f6e]/15",
  },
  {
    border: "border-[#4169e1]/25",
    bg: "bg-[#4169e1]/10",
    text: "text-[#7090ff]",
    icon: "bg-[#4169e1]/15",
  },
  {
    border: "border-[#20c9b0]/25",
    bg: "bg-[#20c9b0]/10",
    text: "text-[#55e0ca]",
    icon: "bg-[#20c9b0]/15",
  },
  {
    border: "border-[#a8e63d]/25",
    bg: "bg-[#a8e63d]/10",
    text: "text-[#c3f46d]",
    icon: "bg-[#a8e63d]/15",
  },
  {
    border: "border-[#9b59b6]/25",
    bg: "bg-[#9b59b6]/10",
    text: "text-[#c07bdd]",
    icon: "bg-[#9b59b6]/15",
  },
  {
    border: "border-[#ffb38a]/25",
    bg: "bg-[#ffb38a]/10",
    text: "text-[#ffc19e]",
    icon: "bg-[#ffb38a]/15",
  },
];

export default function RecommendationsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
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

  const targetCareer =
    profile?.target_career || "Data Analyst";

  const requiredSkills =
    roadmapSkills[targetCareer] ||
    roadmapSkills["Data Analyst"];

  const userSkillNames = skills.map((skill) =>
    skill.skill_name.trim().toLowerCase()
  );

  const missingSkills = requiredSkills.filter(
    (skill) =>
      !userSkillNames.includes(skill.toLowerCase())
  );

  function createRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];

    missingSkills.forEach((skill, index) => {
      recommendations.push({
        icon:
          index === 0
            ? "🔥"
            : index === 1
              ? "⭐"
              : "📚",

        title: `Learn ${skill}`,

        description:
          `Improve your ${skill} knowledge because it is required for a ${targetCareer} career.`,

        priority:
          index === 0
            ? "High Priority"
            : index < 3
              ? "Medium Priority"
              : "Recommended",
      });
    });

    recommendations.push({
      icon: "💻",
      title: "Build Real Projects",
      description:
        `Build practical ${targetCareer} projects to apply your skills and strengthen your portfolio.`,
      priority: "Recommended",
    });

    recommendations.push({
      icon: "📄",
      title: "Improve Your Resume",
      description:
        "Add your projects, technical skills, education and achievements to create a stronger resume.",
      priority: "Recommended",
    });

    recommendations.push({
      icon: "🎤",
      title: "Prepare for Interviews",
      description:
        `Practice ${targetCareer} interview questions, SQL, programming fundamentals and project-based questions.`,
      priority: "Recommended",
    });

    return recommendations;
  }

  const recommendations = createRecommendations();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b17] text-white">
        <div className="text-center">
          <div className="relative mx-auto mb-5 h-16 w-16">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-[#9b59b6]/20" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl shadow-2xl">
              🎯
            </div>
          </div>

          <p className="text-sm font-bold text-slate-300">
            Loading Recommendations...
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Creating your personalized career path
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b17] px-5 py-8 text-white lg:px-10">
      {/* Background */}

      <div className="pointer-events-none absolute -left-40 -top-40 h-[430px] w-[430px] rounded-full bg-[#ff7f6e]/10 blur-[150px]" />

      <div className="pointer-events-none absolute right-[-160px] top-[15%] h-[450px] w-[450px] rounded-full bg-[#4169e1]/10 blur-[150px]" />

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

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Personalized{" "}
            <span className="bg-gradient-to-r from-[#ff7f6e] via-[#9b59b6] to-[#4169e1] bg-clip-text text-transparent">
              Recommendations
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
            Personalized recommendations based on your current skills
            and career goal.
          </p>
        </header>

        {/* Target Career */}

        <section className="relative mb-7 overflow-hidden rounded-[2rem] border border-[#20c9b0]/20 bg-[#20c9b0]/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-7">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#20c9b0]/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#55e0ca]">
                Your Target Career
              </p>

              <div className="mt-3 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#20c9b0]/10 text-xl">
                  🎯
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    {targetCareer}
                  </h2>

                  <p className="mt-1 text-xs text-slate-600">
                    Career-focused recommendations
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#20c9b0]/15 bg-black/10 px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                Skills To Learn
              </p>

              <p className="mt-1 text-2xl font-black text-[#55e0ca]">
                {missingSkills.length}
              </p>
            </div>
          </div>
        </section>

        {/* Current Skills */}

        <section className="mb-8 rounded-[2rem] border border-[#4169e1]/20 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-7">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4169e1]/10 text-xl">
                💻
              </div>

              <div>
                <h2 className="text-lg font-black">
                  Your Current Skills
                </h2>

                <p className="text-[10px] font-bold uppercase tracking-widest text-[#7090ff]">
                  Skill Profile
                </p>
              </div>
            </div>

            <span className="rounded-full border border-[#4169e1]/20 bg-[#4169e1]/10 px-3 py-1 text-xs font-black text-[#7090ff]">
              {skills.length}
            </span>
          </div>

          {skills.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-8 text-center">
              <div className="mb-3 text-3xl">
                🔍
              </div>

              <p className="text-sm font-semibold text-slate-400">
                No skills have been added yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => {
                const color =
                  skillColors[index % skillColors.length];

                return (
                  <div
                    key={skill.id}
                    className={`rounded-xl border ${color.border} ${color.bg} px-4 py-3 transition-all duration-300 hover:-translate-y-1`}
                  >
                    <span className={`text-xs font-bold ${color.text}`}>
                      {skill.skill_name}
                    </span>

                    <span className="ml-2 text-[10px] font-bold text-slate-600">
                      {skill.skill_level}/5
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Recommendations */}

        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#9b59b6]/10 text-xl">
                  🚀
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Personalized Recommendations
                  </h2>

                  <p className="mt-1 text-xs text-slate-600">
                    Your next career-focused actions
                  </p>
                </div>
              </div>
            </div>

            <span className="hidden rounded-full border border-[#9b59b6]/20 bg-[#9b59b6]/10 px-4 py-2 text-xs font-bold text-[#c07bdd] md:block">
              {recommendations.length} Actions
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((recommendation, index) => {
              const color =
                skillColors[index % skillColors.length];

              return (
                <article
                  key={index}
                  className={`group relative overflow-hidden rounded-[2rem] border ${color.border} bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.05]`}
                  style={{
                    animationDelay: `${index * 70}ms`,
                  }}
                >
                  <div
                    className={`absolute -right-14 -top-14 h-36 w-36 rounded-full ${color.icon} opacity-40 blur-3xl`}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color.icon} text-xl transition-transform duration-300 group-hover:scale-110`}
                      >
                        {recommendation.icon}
                      </div>

                      <span
                        className={`rounded-full border ${color.border} ${color.bg} px-3 py-1.5 text-[10px] font-black ${color.text}`}
                      >
                        {recommendation.priority}
                      </span>
                    </div>

                    <h3 className="mt-6 text-lg font-black text-white">
                      {recommendation.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {recommendation.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">
                        Action {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={`text-lg ${color.text} transition-transform duration-300 group-hover:translate-x-1`}
                      >
                        →
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Next Step */}

        <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-[#ffb38a]/20 bg-[#ffb38a]/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#ffb38a]/10 blur-[80px]" />

          <div className="relative">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffb38a]/10 text-xl">
                🧭
              </div>

              <div>
                <h2 className="text-xl font-black">
                  Your Next Step
                </h2>

                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#ffc19e]">
                  Career Action
                </p>
              </div>
            </div>

            {missingSkills.length > 0 ? (
              <div className="mt-6 rounded-2xl border border-[#ffb38a]/15 bg-black/10 p-5">
                <p className="text-sm leading-7 text-slate-400">
                  Start by learning{" "}
                  <strong className="text-[#ffc19e]">
                    {missingSkills[0]}
                  </strong>
                  . After gaining confidence in this skill, continue
                  with the remaining skills in your Skill Gap.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-[#a8e63d]/20 bg-[#a8e63d]/5 p-5">
                <p className="text-sm leading-7 text-[#c3f46d]">
                  🎉 You have completed the required skills. Focus on
                  projects, portfolio development and interview
                  preparation.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Color System */}

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">
            SkillBridge Color System
          </p>

          <div className="flex flex-wrap gap-3">
            <ColorDot color="bg-[#ff7f6e]" name="Coral" />
            <ColorDot color="bg-[#4169e1]" name="Cobalt" />
            <ColorDot color="bg-[#20c9b0]" name="Teal" />
            <ColorDot color="bg-[#a8e63d]" name="Lime" />
            <ColorDot color="bg-[#9b59b6]" name="Plum" />
            <ColorDot color="bg-[#ffb38a]" name="Peach" />
          </div>
        </section>
      </div>
    </main>
  );
}

function ColorDot({
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