"use client";

import { useEffect, useMemo, useState } from "react";
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
  id?: number;
  user_id?: number;
  headline?: string;
  target_career?: string;
};

type CareerRoadmap = {
  title: string;
  icon: string;
  description: string;
  color: string;
  skills: string[];
  steps: string[];
};

const roadmapData: Record<string, CareerRoadmap> = {
  "Data Analyst": {
    title: "Data Analyst",
    icon: "📊",
    description:
      "Learn data analysis, SQL, statistics, visualization and business intelligence.",
    color: "from-red-500 via-violet-500 to-blue-500",
    skills: [
      "Python",
      "SQL",
      "Excel",
      "Statistics",
      "Pandas",
      "NumPy",
      "Data Visualization",
      "Power BI",
      "Tableau",
      "Git",
    ],
    steps: [
      "Build strong Python fundamentals",
      "Learn SQL and database querying",
      "Master Excel for data analysis",
      "Study statistics fundamentals",
      "Learn Pandas and NumPy",
      "Learn data visualization",
      "Learn Power BI or Tableau",
      "Build real-world data projects",
      "Create a professional portfolio",
      "Prepare for Data Analyst interviews",
    ],
  },

  "Web Developer": {
    title: "Web Developer",
    icon: "🌐",
    description:
      "Build modern responsive websites and interactive web applications.",
    color: "from-blue-500 via-violet-500 to-red-500",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Git",
      "GitHub",
      "REST API",
      "Responsive Design",
    ],
    steps: [
      "Learn HTML fundamentals",
      "Master CSS and responsive design",
      "Learn JavaScript",
      "Learn Git and GitHub",
      "Learn TypeScript",
      "Learn React",
      "Learn Next.js",
      "Work with REST APIs",
      "Build full-stack projects",
      "Create a web development portfolio",
    ],
  },

  "Python Developer": {
    title: "Python Developer",
    icon: "🐍",
    description:
      "Build powerful Python applications, APIs and backend systems.",
    color: "from-violet-500 via-blue-500 to-red-500",
    skills: [
      "Python",
      "OOP",
      "Git",
      "SQL",
      "REST API",
      "FastAPI",
      "Django",
      "PostgreSQL",
      "Testing",
      "Docker",
    ],
    steps: [
      "Master Python fundamentals",
      "Learn Object-Oriented Programming",
      "Learn data structures",
      "Learn SQL and databases",
      "Learn REST APIs",
      "Learn FastAPI or Django",
      "Build backend applications",
      "Learn testing",
      "Learn Docker basics",
      "Build production-ready projects",
    ],
  },

  "Frontend Developer": {
    title: "Frontend Developer",
    icon: "🎨",
    description:
      "Create beautiful, responsive and interactive user interfaces.",
    color: "from-red-500 via-blue-500 to-violet-500",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Git",
      "GitHub",
      "UI/UX",
    ],
    steps: [
      "Learn HTML",
      "Master CSS",
      "Learn responsive design",
      "Learn JavaScript",
      "Learn Git and GitHub",
      "Learn React",
      "Learn TypeScript",
      "Learn Tailwind CSS",
      "Build modern UI projects",
      "Create a frontend portfolio",
    ],
  },

  "Backend Developer": {
    title: "Backend Developer",
    icon: "⚙️",
    description:
      "Develop secure APIs, databases and server-side applications.",
    color: "from-blue-500 via-red-500 to-violet-500",
    skills: [
      "Python",
      "Java",
      "Node.js",
      "REST API",
      "SQL",
      "PostgreSQL",
      "MongoDB",
      "Git",
      "Docker",
      "Authentication",
    ],
    steps: [
      "Learn programming fundamentals",
      "Choose a backend language",
      "Learn SQL",
      "Learn database design",
      "Build REST APIs",
      "Learn authentication",
      "Learn Git and GitHub",
      "Learn Docker",
      "Build backend projects",
      "Deploy an API application",
    ],
  },

  "AI / ML Engineer": {
    title: "AI / ML Engineer",
    icon: "🤖",
    description:
      "Learn machine learning, artificial intelligence and model development.",
    color: "from-violet-500 via-red-500 to-blue-500",
    skills: [
      "Python",
      "NumPy",
      "Pandas",
      "Statistics",
      "Machine Learning",
      "Scikit-learn",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
      "Git",
    ],
    steps: [
      "Master Python",
      "Learn NumPy and Pandas",
      "Study statistics",
      "Learn machine learning fundamentals",
      "Learn Scikit-learn",
      "Study model evaluation",
      "Learn deep learning",
      "Explore TensorFlow or PyTorch",
      "Build AI/ML projects",
      "Create an AI portfolio",
    ],
  },

  "Data Scientist": {
    title: "Data Scientist",
    icon: "🧠",
    description:
      "Combine statistics, programming and machine learning to solve data problems.",
    color: "from-red-500 via-blue-500 to-violet-500",
    skills: [
      "Python",
      "SQL",
      "Statistics",
      "Pandas",
      "NumPy",
      "Machine Learning",
      "Scikit-learn",
      "Data Visualization",
      "Deep Learning",
      "Git",
    ],
    steps: [
      "Learn Python",
      "Master SQL",
      "Study statistics",
      "Learn data cleaning",
      "Learn exploratory data analysis",
      "Study machine learning",
      "Learn model evaluation",
      "Build machine learning projects",
      "Learn advanced analytics",
      "Build a data science portfolio",
    ],
  },

  "Cloud Engineer": {
    title: "Cloud Engineer",
    icon: "☁️",
    description:
      "Learn cloud infrastructure, deployment, networking and DevOps.",
    color: "from-blue-500 via-violet-500 to-red-500",
    skills: [
      "Linux",
      "Networking",
      "AWS",
      "Azure",
      "Docker",
      "Kubernetes",
      "Git",
      "CI/CD",
      "Python",
      "Cloud Security",
    ],
    steps: [
      "Learn Linux fundamentals",
      "Learn networking basics",
      "Learn Git",
      "Learn AWS or Azure",
      "Understand cloud services",
      "Learn Docker",
      "Learn CI/CD",
      "Learn Kubernetes",
      "Deploy cloud applications",
      "Build cloud projects",
    ],
  },

  "Cybersecurity Analyst": {
    title: "Cybersecurity Analyst",
    icon: "🔐",
    description:
      "Learn security fundamentals, networking, monitoring and threat analysis.",
    color: "from-red-500 via-violet-500 to-blue-500",
    skills: [
      "Networking",
      "Linux",
      "Python",
      "Cybersecurity",
      "Cryptography",
      "Ethical Hacking",
      "SIEM",
      "Cloud Security",
      "Web Security",
      "Git",
    ],
    steps: [
      "Learn computer networking",
      "Learn Linux",
      "Learn security fundamentals",
      "Learn Python scripting",
      "Study cryptography",
      "Learn web security",
      "Practice ethical hacking",
      "Learn security monitoring",
      "Study SIEM tools",
      "Build cybersecurity projects",
    ],
  },
};

const careerAliases: Record<string, string> = {
  "data analyst": "Data Analyst",
  "data analytics": "Data Analyst",
  "web developer": "Web Developer",
  "web development": "Web Developer",
  "frontend developer": "Frontend Developer",
  "front end developer": "Frontend Developer",
  "backend developer": "Backend Developer",
  "back end developer": "Backend Developer",
  "python developer": "Python Developer",
  "ai engineer": "AI / ML Engineer",
  "ml engineer": "AI / ML Engineer",
  "machine learning engineer": "AI / ML Engineer",
  "ai/ml engineer": "AI / ML Engineer",
  "data scientist": "Data Scientist",
  "cloud engineer": "Cloud Engineer",
  "cybersecurity analyst": "Cybersecurity Analyst",
  "cyber security analyst": "Cybersecurity Analyst",
};

export default function RoadmapPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedCareer, setSelectedCareer] =
    useState("Data Analyst");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRoadmapData();
  }, []);

  async function loadRoadmapData() {
    try {
      setLoading(true);
      setMessage("");

      const [profileData, skillsData] = await Promise.all([
        getProfile(),
        getSkills(),
      ]);

      setProfile(profileData);
      setSkills(skillsData);

      const targetCareer =
        profileData?.target_career?.trim() || "";

      const normalized =
        careerAliases[targetCareer.toLowerCase()];

      if (normalized && roadmapData[normalized]) {
        setSelectedCareer(normalized);
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load roadmap."
      );
    } finally {
      setLoading(false);
    }
  }

  const roadmap = roadmapData[selectedCareer];

  const userSkillNames = useMemo(() => {
    return skills.map((skill) =>
      skill.skill_name.trim().toLowerCase()
    );
  }, [skills]);

  const matchedSkills = useMemo(() => {
    return roadmap.skills.filter((skill) =>
      userSkillNames.includes(skill.toLowerCase())
    );
  }, [roadmap.skills, userSkillNames]);

  const missingSkills = useMemo(() => {
    return roadmap.skills.filter(
      (skill) =>
        !userSkillNames.includes(skill.toLowerCase())
    );
  }, [roadmap.skills, userSkillNames]);

  const matchPercentage =
    roadmap.skills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length / roadmap.skills.length) *
            100
        );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070b17] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="relative mx-auto mb-5 h-14 w-14">
              <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                🧭
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-300">
              Loading your career roadmap...
            </p>

            <p className="mt-1 text-xs text-slate-600">
              SkillBridge is preparing your path
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b17] px-5 py-8 text-white lg:px-10">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-[-180px] top-[-180px] h-[450px] w-[450px] rounded-full bg-red-600/10 blur-[150px]" />

      <div className="pointer-events-none absolute right-[-180px] top-[10%] h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-220px] left-[30%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <header className="page-enter mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
              SkillBridge Career System
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Career{" "}
            <span className="bg-gradient-to-r from-red-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              Roadmap
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Follow a structured learning path, identify the
            skills you need and build projects that move you
            closer to your target career.
          </p>
        </header>

        {message && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-400">
            {message}
          </div>
        )}

        {/* Career Selector */}
        <section className="premium-card mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-6">
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
                Choose Career
              </p>

              <h2 className="mt-1 text-lg font-bold">
                Select your learning path
              </h2>
            </div>

            {profile?.target_career && (
              <div className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300">
                🎯 Target: {profile.target_career}
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Object.values(roadmapData).map((career) => {
              const active =
                selectedCareer === career.title;

              return (
                <button
                  key={career.title}
                  type="button"
                  onClick={() =>
                    setSelectedCareer(career.title)
                  }
                  className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                    active
                      ? "border-red-500/30 bg-gradient-to-br from-red-500/15 via-violet-500/10 to-blue-500/10 shadow-xl shadow-violet-500/10"
                      : "border-white/10 bg-white/[0.025] hover:-translate-y-1 hover:border-violet-500/25 hover:bg-white/[0.05]"
                  }`}
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-transform duration-300 group-hover:scale-110 ${
                      active
                        ? "bg-gradient-to-br from-red-500/20 to-violet-500/20"
                        : "bg-slate-900"
                    }`}
                  >
                    {career.icon}
                  </div>

                  <p
                    className={`text-sm font-bold ${
                      active
                        ? "text-white"
                        : "text-slate-300"
                    }`}
                  >
                    {career.title}
                  </p>

                  <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-600">
                    {career.description}
                  </p>

                  {active && (
                    <div className="absolute right-3 top-3 h-2 w-2 animate-pulse rounded-full bg-red-400 shadow-lg shadow-red-400/50" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Career Hero */}
        <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8">
          <div
            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${roadmap.color}`}
          />

          <div className="absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full bg-violet-500/10 blur-[100px]" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
            <div>
              <div className="mb-5 flex items-center gap-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${roadmap.color} text-3xl shadow-xl shadow-violet-500/10`}
                >
                  {roadmap.icon}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                    Selected Career
                  </p>

                  <h2 className="mt-1 text-3xl font-black">
                    {roadmap.title}
                  </h2>
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-slate-400">
                {roadmap.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {roadmap.skills.slice(0, 6).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Match Circle */}
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
                Skill Match
              </p>

              <div className="relative mx-auto my-5 flex h-36 w-36 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-8 border-white/5" />

                <div
                  className="absolute inset-0 rounded-full border-8 border-transparent"
                  style={{
                    background: `conic-gradient(#ef4444 ${matchPercentage * 3.6}deg, transparent 0deg)`,
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    padding: "8px",
                  }}
                />

                <div>
                  <div className="text-3xl font-black">
                    {matchPercentage}%
                  </div>

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Ready
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                {matchedSkills.length} of{" "}
                {roadmap.skills.length} roadmap skills
                matched
              </p>
            </div>
          </div>
        </section>

        {/* Skill Overview */}
        <section className="mb-8 grid gap-5 md:grid-cols-3">
          <StatCard
            icon="✅"
            label="Skills Matched"
            value={matchedSkills.length}
            description="Skills you already have"
            gradient="from-emerald-500/20 to-blue-500/10"
          />

          <StatCard
            icon="📚"
            label="Skills To Learn"
            value={missingSkills.length}
            description="Skills remaining on roadmap"
            gradient="from-red-500/20 to-violet-500/10"
          />

          <StatCard
            icon="🚀"
            label="Roadmap Steps"
            value={roadmap.steps.length}
            description="Milestones to complete"
            gradient="from-violet-500/20 to-blue-500/10"
          />
        </section>

        {/* Skills Section */}
        <section className="mb-8">
          <SectionTitle
            icon="💻"
            title="Required Skills"
            subtitle="Track the skills needed for this career"
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {roadmap.skills.map((skill, index) => {
              const matched = userSkillNames.includes(
                skill.toLowerCase()
              );

              return (
                <div
                  key={skill}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/20 hover:bg-white/[0.05]"
                  style={{
                    animationDelay: `${index * 60}ms`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm transition-transform duration-300 group-hover:scale-110 ${
                        matched
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {matched ? "✓" : "→"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-bold text-slate-200">
                          {skill}
                        </p>

                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            matched
                              ? "text-emerald-400"
                              : "text-slate-600"
                          }`}
                        >
                          {matched
                            ? "Matched"
                            : "Learn"}
                        </span>
                      </div>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            matched
                              ? "w-full bg-gradient-to-r from-emerald-500 to-blue-500"
                              : "w-[15%] bg-gradient-to-r from-red-500 to-violet-500"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Roadmap Steps */}
        <section className="mb-8">
          <SectionTitle
            icon="🧭"
            title="Learning Roadmap"
            subtitle="Complete these milestones step by step"
          />

          <div className="relative">
            <div className="absolute bottom-5 left-[23px] top-5 hidden w-px bg-gradient-to-b from-red-500 via-violet-500 to-blue-500 opacity-30 md:block" />

            <div className="space-y-4">
              {roadmap.steps.map((step, index) => {
                const progress =
                  index === 0 && matchedSkills.length > 0
                    ? "current"
                    : index < matchedSkills.length
                      ? "completed"
                      : "locked";

                return (
                  <div
                    key={step}
                    className="group relative flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/20 hover:bg-white/[0.05] md:p-5"
                  >
                    <div
                      className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black transition-all duration-300 group-hover:scale-110 ${
                        progress === "completed"
                          ? "bg-emerald-500/15 text-emerald-400 shadow-lg shadow-emerald-500/10"
                          : progress === "current"
                            ? "bg-gradient-to-br from-red-500/20 to-violet-500/20 text-red-400 shadow-lg shadow-red-500/10"
                            : "bg-slate-900 text-slate-600"
                      }`}
                    >
                      {progress === "completed"
                        ? "✓"
                        : index + 1}
                    </div>

                    <div className="flex-1 pt-1">
                      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                        <h3
                          className={`text-sm font-bold md:text-base ${
                            progress === "locked"
                              ? "text-slate-500"
                              : "text-slate-200"
                          }`}
                        >
                          {step}
                        </h3>

                        <span
                          className={`w-fit rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                            progress === "completed"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : progress === "current"
                                ? "border-red-500/20 bg-red-500/10 text-red-400"
                                : "border-white/5 bg-white/[0.03] text-slate-600"
                          }`}
                        >
                          {progress === "completed"
                            ? "Completed"
                            : progress === "current"
                              ? "In Progress"
                              : "Upcoming"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-600">
                        {progress === "completed"
                          ? "Great work. Keep building your knowledge."
                          : progress === "current"
                            ? "Focus on this milestone next."
                            : "Complete the previous milestones first."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <section className="mb-8 overflow-hidden rounded-3xl border border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-violet-500/[0.04] to-blue-500/[0.06] p-6 backdrop-blur-xl md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10">
                    🎯
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                    Next Focus
                  </span>
                </div>

                <h2 className="text-2xl font-black">
                  Skills you should learn next
                </h2>

                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  These skills are currently missing from
                  your profile for the selected career
                  roadmap.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 md:max-w-md md:justify-end">
                {missingSkills.slice(0, 8).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-500/30 hover:text-red-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-center backdrop-blur-xl md:p-10">
          <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[80px]" />

          <div className="relative">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 via-violet-600 to-blue-600 text-2xl shadow-xl shadow-violet-500/20">
              🚀
            </div>

            <h2 className="text-2xl font-black">
              Build. Learn. Grow.
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Your roadmap is only the beginning. Build
              projects, improve your skills and keep your
              SkillBridge profile updated.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/skills"
                className="rounded-xl bg-gradient-to-r from-red-500 via-violet-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/20"
              >
                💻 Update My Skills
              </a>

              <a
                href="/skill-gap"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-bold text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.07] hover:text-white"
              >
                📊 View Skill Gap
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
  gradient,
}: {
  icon: string;
  label: string;
  value: number;
  description: string;
  gradient: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${gradient} p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-500/20 hover:shadow-2xl hover:shadow-violet-500/10`}
    >
      <div className="absolute right-[-30px] top-[-30px] h-24 w-24 rounded-full bg-white/5 blur-2xl transition duration-500 group-hover:scale-150" />

      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-lg">
            {icon}
          </div>

          <span className="text-3xl font-black text-white">
            {value}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-200">
          {label}
        </h3>

        <p className="mt-1 text-xs text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

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
    <div className="mb-5 flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg">
        {icon}
      </div>

      <div>
        <h2 className="text-xl font-black">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-600">
          {subtitle}
        </p>
      </div>
    </div>
  );
}