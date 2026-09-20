"use client";

import { useEffect, useState } from "react";
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

export default function SkillGapPage() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [skills, setSkills] =
    useState<Skill[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadSkillGap();
  }, []);

  async function loadSkillGap() {
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

  const matchPercentage =
    requiredSkills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length /
            requiredSkills.length) *
            100
        );

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f5f5f5",
        }}
      >
        <h2>Loading Skill Gap...</h2>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* Header */}

        <div
          style={{
            marginBottom: 30,
          }}
        >
          <p
            style={{
              margin: 0,
              opacity: 0.6,
              letterSpacing: 2,
            }}
          >
            SKILLBRIDGE
          </p>

          <h1
            style={{
              fontSize: 36,
              margin: "10px 0",
            }}
          >
            📊 Skill Gap Analysis
          </h1>

          <p
            style={{
              opacity: 0.6,
            }}
          >
            Identify the skills you have and the
            skills you need for your target career.
          </p>
        </div>

        {/* Target Career */}

        <section
          style={{
            background: "#fff",
            padding: 25,
            borderRadius: 18,
            border: "1px solid #e5e5e5",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              margin: 0,
              opacity: 0.6,
            }}
          >
            Target Career
          </p>

          <h2
            style={{
              margin: "8px 0 0",
            }}
          >
            🎯 {targetCareer}
          </h2>
        </section>

        {/* Progress */}

        <section
          style={{
            background: "#fff",
            padding: 25,
            borderRadius: 18,
            border: "1px solid #e5e5e5",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <h2
              style={{
                margin: 0,
              }}
            >
              📈 Career Skill Progress
            </h2>

            <strong
              style={{
                fontSize: 22,
              }}
            >
              {matchPercentage}%
            </strong>
          </div>

          <div
            style={{
              width: "100%",
              height: 14,
              background: "#e5e5e5",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${matchPercentage}%`,
                height: "100%",
                background: "#111",
                borderRadius: 20,
              }}
            />
          </div>

          <p
            style={{
              marginBottom: 0,
              opacity: 0.6,
            }}
          >
            {matchedSkills.length} of{" "}
            {requiredSkills.length} required
            skills matched.
          </p>
        </section>

        {/* Skill Summary */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginBottom: 20,
          }}
        >
          {/* Matched */}

          <section
            style={{
              background: "#fff",
              padding: 25,
              borderRadius: 18,
              border:
                "1px solid #e5e5e5",
            }}
          >
            <h2
              style={{
                marginTop: 0,
              }}
            >
              ✅ Your Skills
            </h2>

            {matchedSkills.length === 0 ? (
              <p
                style={{
                  opacity: 0.6,
                }}
              >
                No required skills matched yet.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {matchedSkills.map(
                  (skill) => (
                    <span
                      key={skill}
                      style={{
                        padding:
                          "9px 13px",
                        borderRadius: 20,
                        background:
                          "#e8f5e9",
                        border:
                          "1px solid #c8e6c9",
                        fontSize: 14,
                      }}
                    >
                      ✅ {skill}
                    </span>
                  )
                )}
              </div>
            )}
          </section>

          {/* Missing */}

          <section
            style={{
              background: "#fff",
              padding: 25,
              borderRadius: 18,
              border:
                "1px solid #e5e5e5",
            }}
          >
            <h2
              style={{
                marginTop: 0,
              }}
            >
              ⚠️ Missing Skills
            </h2>

            {missingSkills.length === 0 ? (
              <p
                style={{
                  opacity: 0.6,
                }}
              >
                🎉 You have all required skills!
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {missingSkills.map(
                  (skill) => (
                    <span
                      key={skill}
                      style={{
                        padding:
                          "9px 13px",
                        borderRadius: 20,
                        background:
                          "#fff3e0",
                        border:
                          "1px solid #ffcc80",
                        fontSize: 14,
                      }}
                    >
                      ⭕ {skill}
                    </span>
                  )
                )}
              </div>
            )}
          </section>
        </div>

        {/* Recommendations */}

        <section
          style={{
            background: "#fff",
            padding: 25,
            borderRadius: 18,
            border:
              "1px solid #e5e5e5",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            🚀 What You Should Learn
          </h2>

          {missingSkills.length === 0 ? (
            <p>
              You have completed all the required
              skills for this career roadmap.
              Start building projects and
              preparing for interviews.
            </p>
          ) : (
            <>
              <p
                style={{
                  opacity: 0.6,
                }}
              >
                Focus on these skills to reduce
                your career skill gap:
              </p>

              <ol
                style={{
                  lineHeight: 2,
                }}
              >
                {missingSkills.map(
                  (skill) => (
                    <li key={skill}>
                      Learn and practice{" "}
                      <strong>
                        {skill}
                      </strong>
                    </li>
                  )
                )}
              </ol>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
