"use client";

import { useEffect, useMemo, useState } from "react";
import {
getSkills,
createSkill,
deleteSkill,
getMarketSkills,
} from "../../lib/api";

type Skill = {
id: number;
user_id: number;
skill_name: string;
skill_level: number;
};

type MarketSkill = {
skill: string;
job_count: number;
};

const levelNames = [
"",
"Beginner",
"Basic",
"Intermediate",
"Advanced",
"Expert",
];

export default function SkillsPage() {
const [skills, setSkills] = useState<Skill[]>([]);
const [marketSkills, setMarketSkills] = useState<MarketSkill[]>([]);

const [skillName, setSkillName] = useState("");
const [skillLevel, setSkillLevel] = useState(1);

const [loading, setLoading] = useState(true);
const [marketLoading, setMarketLoading] = useState(true);
const [saving, setSaving] = useState(false);

const [message, setMessage] = useState("");
const [marketError, setMarketError] = useState("");

useEffect(() => {
loadSkills();
loadMarketSkills();
}, []);

async function loadSkills() {
try {
const data = await getSkills();


  setSkills(
    Array.isArray(data)
      ? data
      : []
  );
} catch (error) {
  setMessage(
    error instanceof Error
      ? error.message
      : "Failed to load skills."
  );
} finally {
  setLoading(false);
}


}

async function loadMarketSkills() {
try {
setMarketLoading(true);
setMarketError("");


  const data = await getMarketSkills(
    "IN",
    undefined,
    5
  );

  console.log(
    "MARKET SKILLS RESPONSE:",
    data
  );

  setMarketSkills(
    Array.isArray(data?.skills)
      ? data.skills
      : []
  );
} catch (error) {
  console.error(
    "MARKET SKILLS ERROR:",
    error
  );

  setMarketError(
    error instanceof Error
      ? error.message
      : "Failed to load market skills."
  );
} finally {
  setMarketLoading(false);
}


}

async function handleAddSkill(
event: React.FormEvent
) {
event.preventDefault();


if (!skillName.trim()) {
  setMessage(
    "Please enter a skill name."
  );
  return;
}

await addSkill(
  skillName.trim(),
  skillLevel
);


}

async function addSkill(
name: string,
level: number = 1
) {
try {
setSaving(true);
setMessage("");


  const newSkill = await createSkill(
    name,
    level
  );

  setSkills((current) => [
    ...current,
    newSkill,
  ]);

  setSkillName("");
  setSkillLevel(1);

  setMessage(
    `${name} added successfully.`
  );
} catch (error) {
  setMessage(
    error instanceof Error
      ? error.message
      : "Failed to add skill."
  );
} finally {
  setSaving(false);
}


}

async function handleDeleteSkill(
skillId: number
) {
try {
setMessage("");


  await deleteSkill(skillId);

  setSkills((current) =>
    current.filter(
      (skill) => skill.id !== skillId
    )
  );

  setMessage(
    "Skill deleted successfully."
  );
} catch (error) {
  setMessage(
    error instanceof Error
      ? error.message
      : "Failed to delete skill."
  );
}


}

const existingSkillNames = useMemo(
() =>
new Set(
skills.map((skill) =>
skill.skill_name
.trim()
.toLowerCase()
)
),
[skills]
);

const recommendedSkills = useMemo(
() =>
marketSkills.filter(
(marketSkill) =>
!existingSkillNames.has(
marketSkill.skill
.trim()
.toLowerCase()
)
),
[marketSkills, existingSkillNames]
);

if (loading) {
return ( <main className="min-h-screen bg-[#070b17] text-white"> <div className="flex min-h-screen items-center justify-center"> <div className="text-center"> <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-red-500 border-r-violet-500" />


        <p className="text-slate-400">
          Loading your skills...
        </p>
      </div>
    </div>
  </main>
);


}

return ( <main className="relative min-h-screen overflow-hidden bg-[#070b17] px-5 py-8 text-white lg:px-10">


  <div className="pointer-events-none absolute left-[-150px] top-[-150px] h-[400px] w-[400px] rounded-full bg-red-600/10 blur-[140px]" />

  <div className="pointer-events-none absolute right-[-150px] top-[20%] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[140px]" />

  <div className="pointer-events-none absolute bottom-[-200px] left-[30%] h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[150px]" />

  <div className="relative mx-auto max-w-7xl">

    {/* HEADER */}

    <header className="mb-8 page-enter">
      <p className="text-xs font-bold tracking-[0.3em] text-red-400">
        SKILLBRIDGE
      </p>

      <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
        My{" "}
        <span className="bg-gradient-to-r from-red-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
          Skills
        </span>
      </h1>

      <p className="mt-3 max-w-3xl text-slate-400">
        Build your skill profile and discover
        skills currently appearing in live job
        market data.
      </p>
    </header>

    {/* ADD SKILL */}

    <section className="premium-card mb-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8">

      <div className="mb-6 flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-violet-500/20 text-xl">
          +
        </div>

        <div>
          <h2 className="text-xl font-bold">
            Add New Skill
          </h2>

          <p className="text-sm text-slate-500">
            Add any skill from your own experience.
          </p>
        </div>

      </div>

      <form
        onSubmit={handleAddSkill}
        className="grid gap-4 md:grid-cols-[1fr_220px_160px]"
      >

        <input
          type="text"
          placeholder="Example: Python"
          value={skillName}
          onChange={(event) =>
            setSkillName(
              event.target.value
            )
          }
          maxLength={120}
          className="rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
        />

        <select
          value={skillLevel}
          onChange={(event) =>
            setSkillLevel(
              Number(event.target.value)
            )
          }
          className="rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3.5 text-white outline-none focus:border-violet-500/50"
        >

          {[1, 2, 3, 4, 5].map(
            (level) => (
              <option
                key={level}
                value={level}
                className="bg-[#0b1020]"
              >
                {level} -{" "}
                {levelNames[level]}
              </option>
            )
          )}

        </select>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-red-500 via-violet-600 to-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Adding..."
            : "Add Skill"}
        </button>

      </form>

    </section>

    {/* MESSAGE */}

    {message && (
      <div
        className={`mb-6 rounded-xl border px-4 py-3 text-sm font-semibold ${
          message.includes(
            "successfully"
          )
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            : "border-red-500/20 bg-red-500/10 text-red-400"
        }`}
      >
        {message}
      </div>
    )}

    {/* MARKET */}

    <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl md:p-8">

      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-violet-400">
            LIVE MARKET
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Trending Market Skills
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Skills extracted from current live job
            descriptions.
          </p>
        </div>

        <button
          type="button"
          onClick={loadMarketSkills}
          disabled={marketLoading}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-violet-500/30 hover:bg-violet-500/10"
        >
          {marketLoading
            ? "Analyzing..."
            : "Refresh Market"}
        </button>

      </div>

      {marketError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {marketError}
        </div>
      )}

      {marketLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl border border-white/5 bg-white/[0.03]"
              />
            )
          )}

        </div>
      ) : marketSkills.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">

          <p className="font-semibold text-slate-300">
            No market skills found.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Try refreshing the market data.
          </p>

        </div>

      ) : (

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          {marketSkills.map(
            (marketSkill, index) => (
              <MarketSkillCard
                key={`${marketSkill.skill}-${index}`}
                marketSkill={marketSkill}
                exists={existingSkillNames.has(
                  marketSkill.skill
                    .trim()
                    .toLowerCase()
                )}
                onAdd={() =>
                  addSkill(
                    marketSkill.skill,
                    1
                  )
                }
                saving={saving}
              />
            )
          )}

        </div>

      )}

    </section>

    {/* RECOMMENDED */}

    <section className="mb-8 rounded-3xl border border-violet-500/10 bg-violet-500/[0.025] p-6 backdrop-blur-xl md:p-8">

      <div className="mb-6">

        <p className="text-xs font-bold tracking-[0.25em] text-blue-400">
          PERSONAL GAP
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Recommended Skills
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Market skills you have not added to your
          profile yet.
        </p>

      </div>

      {recommendedSkills.length === 0 ? (

        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-8 text-center">

          <p className="font-semibold text-emerald-400">
            Your profile already covers the current
            market skill signals.
          </p>

        </div>

      ) : (

        <div className="flex flex-wrap gap-3">

          {recommendedSkills
            .slice(0, 12)
            .map(
              (marketSkill, index) => (
                <button
                  key={`${marketSkill.skill}-${index}`}
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    addSkill(
                      marketSkill.skill,
                      1
                    )
                  }
                  className="group rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-left transition hover:-translate-y-1 hover:border-violet-500/30 hover:bg-violet-500/10 disabled:opacity-50"
                >

                  <div className="flex items-center gap-3">

                    <span className="font-semibold text-slate-200">
                      {marketSkill.skill}
                    </span>

                    <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[11px] font-bold text-violet-300">
                      {marketSkill.job_count}{" "}
                      {marketSkill.job_count === 1
                        ? "job"
                        : "jobs"}
                    </span>

                    <span className="text-violet-400 opacity-60 transition group-hover:opacity-100">
                      +
                    </span>

                  </div>

                </button>
              )
            )}

        </div>

      )}

    </section>

    {/* MY SKILLS */}

    <section>

      <div className="mb-6">

        <p className="text-xs font-bold tracking-[0.25em] text-red-400">
          YOUR PROFILE
        </p>

        <h2 className="mt-2 text-2xl font-black">
          My Skills
        </h2>

      </div>

      {skills.length === 0 ? (

        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] p-12 text-center">

          <div className="mb-4 text-5xl">
            +
          </div>

          <h2 className="text-xl font-bold">
            No skills added yet
          </h2>

          <p className="mt-2 text-slate-500">
            Add your first skill above or select
            one from the live market.
          </p>

        </div>

      ) : (

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {skills.map(
            (skill, index) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                index={index}
                onDelete={
                  handleDeleteSkill
                }
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

function MarketSkillCard({
marketSkill,
exists,
onAdd,
saving,
}: {
marketSkill: MarketSkill;
exists: boolean;
onAdd: () => void;
saving: boolean;
}) {
return ( <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.045]">


  <div className="absolute right-[-30px] top-[-30px] h-24 w-24 rounded-full bg-violet-500/10 blur-3xl" />

  <div className="relative">

    <div className="mb-4 flex items-start justify-between gap-3">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/15 via-violet-500/15 to-blue-500/15">
        #
      </div>

      <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[11px] font-bold text-violet-300">
        {marketSkill.job_count}{" "}
        {marketSkill.job_count === 1
          ? "job"
          : "jobs"}
      </span>

    </div>

    <h3 className="min-h-[48px] font-bold text-white">
      {marketSkill.skill}
    </h3>

    {exists ? (

      <div className="mt-4 rounded-xl bg-emerald-500/10 px-3 py-2 text-center text-xs font-bold text-emerald-400">
        Already in your skills
      </div>

    ) : (

      <button
        type="button"
        onClick={onAdd}
        disabled={saving}
        className="mt-4 w-full rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2.5 text-xs font-bold text-violet-300 transition hover:bg-violet-500/20 disabled:opacity-50"
      >
        + Add to My Skills
      </button>

    )}

  </div>

</article>


);
}

function SkillCard({
skill,
index,
onDelete,
}: {
skill: Skill;
index: number;
onDelete: (skillId: number) => void;
}) {
const percentage =
skill.skill_level * 20;

return (
<section
className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-500/30 hover:bg-white/[0.055] hover:shadow-2xl hover:shadow-violet-500/10"
style={{
animationDelay: `${index * 80}ms`,
}}
>


  <div className="absolute right-[-40px] top-[-40px] h-28 w-28 rounded-full bg-violet-500/10 blur-3xl transition-all duration-500 group-hover:bg-red-500/20" />

  <div className="relative">

    <div className="mb-5 flex items-start justify-between">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/15 via-violet-500/15 to-blue-500/15 text-lg">
        #
      </div>

      <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-300">
        Level {skill.skill_level}
      </span>

    </div>

    <h2 className="text-xl font-bold text-white">
      {skill.skill_name}
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      {levelNames[skill.skill_level]}
    </p>

    <div className="mt-6">

      <div className="mb-2 flex justify-between text-xs">

        <span className="text-slate-500">
          Skill Progress
        </span>

        <span className="font-bold text-slate-300">
          {percentage}%
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/5">

        <div
          className="h-full rounded-full bg-gradient-to-r from-red-500 via-violet-500 to-blue-500 shadow-lg shadow-violet-500/20 transition-all duration-1000"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>

    <div className="mt-5 flex gap-1">

      {[1, 2, 3, 4, 5].map(
        (level) => (
          <span
            key={level}
            className={`h-1.5 flex-1 rounded-full ${
              level <= skill.skill_level
                ? "bg-gradient-to-r from-red-500 to-violet-500"
                : "bg-white/10"
            }`}
          />
        )
      )}

    </div>

    <button
      type="button"
      onClick={() =>
        onDelete(skill.id)
      }
      className="mt-6 w-full rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-400 transition hover:-translate-y-0.5 hover:border-red-500/30 hover:bg-red-500/10"
    >
      Delete Skill
    </button>

  </div>

</section>


);
}
