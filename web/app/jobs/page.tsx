
"use client";

import { useEffect, useMemo, useState } from "react";
import { getProfile, getSkills } from "../../lib/api";

type Skill = {
  id: number;
  user_id: number;
  skill_name: string;
  skill_level: number;
};

type Profile = {
  headline?: string;
  target_career?: string;
};

type MarketJob = {
  id: string;
  title: string;
  company: string;
  city?: string;
  location?: string;
  remote?: string;
  employment_type?: string;
  seniority?: string;
  posted_at?: string;
  status?: string;
  apply_url?: string;
  description?: string;
  category?: string;
};

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  skills: string[];
  description: string;
  salary: string;
  posted: string;
  applyUrl: string;
  remote: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const MARKET_SKILLS = [
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "C++",
  "C#",
  ".NET",
  "HTML",
  "CSS",
  "SCSS",
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Tailwind CSS",
  "Bootstrap",
  "Node.js",
  "Express.js",
  "FastAPI",
  "Django",
  "Flask",
  "SQL",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "SQLite",
  "Oracle",
  "SQL Server",
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Git",
  "GitHub",
  "GitLab",
  "CI/CD",
  "DevOps",
  "Excel",
  "Power BI",
  "Tableau",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Data Analysis",
  "Data Analytics",
  "Data Science",
  "AI",
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "scikit-learn",
  "Jest",
  "Vitest",
  "Playwright",
  "Cypress",
  "Selenium",
  "Unit Testing",
  "Integration Testing",
  "API Testing",
  "Automation Testing",
  "Software Testing",
  "Performance Testing",
  "Regression Testing",
  "Salesforce",
  "Salesforce Commerce Cloud",
  "SFCC",
  "SFRA",
  "ISML",
  "Apex",
  "SOQL",
  "SOSL",
  "LWC",
  "REST API",
  "GraphQL",
  "SOAP",
  "OCAPI",
  "SCAPI",
  "SEO",
  "CRM",
  "ERP",
  "SAP",
  "Figma",
  "Photoshop",
  "Illustrator",
  "Agile",
  "Scrum",
  "WCAG",
  "CMS",
  "Headless CMS",
  "A/B Testing",
];

export default function JobsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const jobsResponse = await fetch(
        `${API_URL}/api/market/jobs?country=IN&limit=20`,
        {
          cache: "no-store",
        }
      );

      if (!jobsResponse.ok) {
        throw new Error("Failed to load live jobs");
      }

      const jobsData = await jobsResponse.json();

      const marketJobs: MarketJob[] =
        jobsData.jobs || [];

      const formattedJobs: Job[] = marketJobs
        .filter(
          (job) =>
            job.status === "live" &&
            Boolean(job.apply_url)
        )
        .map((job) => {
          const description =
            job.description ||
            "Live opportunity. Open the official employer application page for complete job details.";

          return {
            id: job.id,

            title:
              job.title ||
              "Untitled Job",

            company:
              job.company ||
              "Company",

            location:
              job.location ||
              job.city ||
              "India",

            type:
              job.employment_type ||
              "Job",

            skills:
              extractSkills(
                [
                  job.title,
                  job.category,
                  description,
                ]
                  .filter(Boolean)
                  .join(" ")
              ),

            description,

            salary:
              "Not disclosed",

            posted:
              formatPostedDate(
                job.posted_at
              ),

            applyUrl:
              job.apply_url ||
              "",

            remote:
              job.remote ||
              "Not specified",
          };
        });

      setJobs(formattedJobs);

      try {
        const profileData =
          await getProfile();

        setProfile(profileData);
      } catch (profileError) {
        console.warn(
          "Profile could not be loaded:",
          profileError
        );

        setProfile(null);
      }

      try {
        const skillsData =
          await getSkills();

        setSkills(
          skillsData || []
        );
      } catch (skillsError) {
        console.warn(
          "Skills could not be loaded:",
          skillsError
        );

        setSkills([]);
      }
    } catch (error) {
      console.error(
        "Failed to load live jobs:",
        error
      );

      setError(
        "Unable to load live jobs. Please make sure the SkillBridge backend is running."
      );

      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  const userSkillNames = useMemo(
    () =>
      skills
        .map((skill) =>
          normalizeSkill(
            skill.skill_name
          )
        )
        .filter(Boolean),
    [skills]
  );

  function calculateMatch(job: Job) {
    if (
      !job.skills ||
      job.skills.length === 0
    ) {
      return 0;
    }

    if (
      userSkillNames.length === 0
    ) {
      return 0;
    }

    const matched =
      job.skills.filter(
        (skill) =>
          userSkillNames.includes(
            normalizeSkill(skill)
          )
      );

    return Math.round(
      (matched.length /
        job.skills.length) *
        100
    );
  }

  const locations = useMemo(() => {
    const values = jobs
      .map((job) => job.location)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(
        new Set(values)
      ),
    ];
  }, [jobs]);

  const jobTypes = useMemo(() => {
    const values = jobs
      .map((job) => job.type)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(
        new Set(values)
      ),
    ];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      const searchableText = [
        job.title,
        job.company,
        job.location,
        job.type,
        job.remote,
        job.description,
        ...job.skills,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchText ||
        searchableText.includes(
          searchText
        );

      const matchesLocation =
        locationFilter === "All" ||
        job.location ===
          locationFilter;

      const matchesType =
        typeFilter === "All" ||
        job.type === typeFilter;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType
      );
    });
  }, [
    jobs,
    search,
    locationFilter,
    typeFilter,
  ]);

  const recommendedJobs = useMemo(() => {
    return [...jobs]
      .sort(
        (a, b) =>
          calculateMatch(b) -
          calculateMatch(a)
      )
      .slice(0, 3);
  }, [
    jobs,
    userSkillNames,
  ]);

  function applyToJob(job: Job) {
    if (!job.applyUrl) {
      alert(
        "Official application link is not available."
      );

      return;
    }

    window.open(
      job.applyUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070b17] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="relative mx-auto mb-5 h-14 w-14">
              <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                💼
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-300">
              Loading live jobs...
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Finding current opportunities
              for you
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b17] px-5 py-8 text-white lg:px-10">
      <div className="pointer-events-none absolute left-[-180px] top-[-180px] h-[450px] w-[450px] rounded-full bg-red-600/10 blur-[150px]" />

      <div className="pointer-events-none absolute right-[-180px] top-[15%] h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-200px] left-[35%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl">
        <header className="page-enter mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-lg shadow-red-500/50" />

            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
              SkillBridge Live Opportunities
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Find Your{" "}
                <span className="bg-gradient-to-r from-red-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                  Next Job
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                Live India job opportunities
                from current employer and ATS
                listings.
              </p>
            </div>

            {profile?.target_career && (
              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
                  Target Career
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  🎯 {profile.target_career}
                </p>
              </div>
            )}
          </div>
        </header>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                🔎
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search live jobs, companies, skills or locations..."
                className="w-full rounded-xl border border-white/10 bg-[#0b1020] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
              />
            </div>

            <select
              value={locationFilter}
              onChange={(event) =>
                setLocationFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 focus:border-violet-500/50"
            >
              {locations.map(
                (location) => (
                  <option
                    key={location}
                    value={location}
                  >
                    📍 {location}
                  </option>
                )
              )}
            </select>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 focus:border-blue-500/50"
            >
              {jobTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  💼 {type}
                </option>
              ))}
            </select>
          </div>
        </section>

        {recommendedJobs.length > 0 && (
          <section className="mb-10">
            <div className="mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/15 via-violet-500/15 to-blue-500/15">
                  ✨
                </div>

                <div>
                  <h2 className="text-xl font-black">
                    Recommended For You
                  </h2>

                  <p className="mt-1 text-xs text-slate-600">
                    Based on your current
                    skills and live opportunities
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {recommendedJobs.map(
                (job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    match={calculateMatch(
                      job
                    )}
                    featured
                    index={index}
                    onApply={applyToJob}
                  />
                )
              )}
            </div>
          </section>
        )}

        <section>
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-black">
                Live India Opportunities
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                {filteredJobs.length} live
                opportunities found
              </p>
            </div>

            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent md:ml-6" />
          </div>

          {filteredJobs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] p-12 text-center">
              <div className="mb-4 text-5xl">
                🔎
              </div>

              <h3 className="text-xl font-bold">
                No live jobs found
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Try another search or filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setLocationFilter(
                    "All"
                  );
                  setTypeFilter("All");
                }}
                className="mt-6 rounded-xl bg-gradient-to-r from-red-500 via-violet-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-1"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredJobs.map(
                (job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    match={calculateMatch(
                      job
                    )}
                    index={index}
                    onApply={applyToJob}
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function JobCard({
  job,
  match,
  featured = false,
  index,
  onApply,
}: {
  job: Job;
  match: number;
  featured?: boolean;
  index: number;
  onApply: (job: Job) => void;
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 ${
        featured
          ? "border-violet-500/20 bg-gradient-to-br from-violet-500/[0.07] via-white/[0.035] to-red-500/[0.04] shadow-xl shadow-violet-500/5"
          : "border-white/10 bg-white/[0.035] hover:border-violet-500/25 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-violet-500/10"
      }`}
      style={{
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-red-500 via-violet-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/15 via-violet-500/15 to-blue-500/15 text-xl transition-transform duration-300 group-hover:scale-110">
              💼
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-white">
                {job.title}
              </h3>

              <p className="mt-1 text-xs font-medium text-slate-500">
                {job.company}
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold text-slate-500">
            {job.type}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-500">
            📍 {job.location}
          </span>

          <span className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-500">
            🌐 {job.remote}
          </span>

          <span className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-500">
            🕒 {job.posted}
          </span>
        </div>

        {job.skills.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {job.skills.slice(0, 8).map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-violet-500/10 bg-violet-500/5 px-2.5 py-1 text-[10px] font-semibold text-violet-300"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        )}

        <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-500">
          {job.description}
        </p>

        <div className="mt-6 rounded-2xl border border-white/5 bg-black/20 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Your Skill Match
            </span>

            <span
              className={`text-sm font-black ${
                match >= 70
                  ? "text-emerald-400"
                  : match >= 40
                    ? "text-violet-400"
                    : "text-red-400"
              }`}
            >
              {match}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 via-violet-500 to-blue-500 transition-all duration-1000"
              style={{
                width: `${Math.max(
                  match,
                  5
                )}%`,
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            onApply(job)
          }
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-red-500 via-violet-600 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl hover:shadow-red-500/20"
        >
          Apply Now

          <span className="ml-2">
            ↗
          </span>
        </button>

        <p className="mt-2 text-center text-[10px] text-slate-700">
          Opens the official employer
          application page
        </p>
      </div>
    </article>
  );
}

function normalizeSkill(
  skill: string
) {
  return skill
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function extractSkills(
  text: string
) {
  const normalizedText =
    text.toLowerCase();

  const found: string[] = [];

  for (const skill of MARKET_SKILLS) {
    const normalizedSkill =
      skill.toLowerCase();

    if (
      normalizedSkill === ".net"
    ) {
      if (
        /(^|[^a-z0-9])\.net([^a-z0-9]|$)/i.test(
          text
        )
      ) {
        found.push(skill);
      }

      continue;
    }

    const escaped =
      normalizedSkill.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    const pattern = new RegExp(
      `(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`,
      "i"
    );

    if (
      pattern.test(normalizedText)
    ) {
      found.push(skill);
    }
  }

  return Array.from(
    new Set(found)
  );
}

function formatPostedDate(
  date?: string
) {
  if (!date) {
    return "Recently posted";
  }

  const postedDate =
    new Date(date);

  if (
    Number.isNaN(
      postedDate.getTime()
    )
  ) {
    return "Recently posted";
  }

  const diff =
    Date.now() -
    postedDate.getTime();

  const minutes = Math.floor(
    diff / 60000
  );

  if (minutes < 60) {
    return `${Math.max(
      minutes,
      1
    )} min ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  return `${days} day${
    days === 1 ? "" : "s"
  } ago`;
}

