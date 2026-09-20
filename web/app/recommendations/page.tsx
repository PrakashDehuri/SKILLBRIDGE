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

export default function RecommendationsPage() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [skills, setSkills] =
    useState<Skill[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
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

  const missingSkills =
    requiredSkills.filter(
      (skill) =>
        !userSkillNames.includes(
          skill.toLowerCase()
        )
    );

  function createRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];

    missingSkills.forEach(
      (skill, index) => {
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
      }
    );

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

  const recommendations =
    createRecommendations();

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
        <h2>
          Loading Recommendations...
        </h2>
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
            🎯 Recommendations
          </h1>

          <p
            style={{
              opacity: 0.6,
            }}
          >
            Personalized recommendations based on
            your skills and career goal.
          </p>
        </div>

        {/* Career */}

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
            Your Target Career
          </p>

          <h2
            style={{
              margin: "8px 0",
            }}
          >
            🎯 {targetCareer}
          </h2>

          <p
            style={{
              marginBottom: 0,
              opacity: 0.6,
            }}
          >
            Recommendations are generated from
            your current skills and required career
            skills.
          </p>
        </section>

        {/* Current Skills */}

        <section
          style={{
            background: "#fff",
            padding: 25,
            borderRadius: 18,
            border: "1px solid #e5e5e5",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            💻 Your Current Skills
          </h2>

          {skills.length === 0 ? (
            <p
              style={{
                opacity: 0.6,
              }}
            >
              No skills have been added yet.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  style={{
                    padding: "9px 14px",
                    borderRadius: 20,
                    background: "#f0f0f0",
                    border: "1px solid #ddd",
                  }}
                >
                  {skill.skill_name} —{" "}
                  {skill.skill_level}/5
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Recommendations */}

        <section>
          <h2>
            🚀 Personalized Recommendations
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
              marginTop: 20,
            }}
          >
            {recommendations.map(
              (recommendation, index) => (
                <div
                  key={index}
                  style={{
                    background: "#fff",
                    padding: 25,
                    borderRadius: 18,
                    border:
                      "1px solid #e5e5e5",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                      gap: 15,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 30,
                      }}
                    >
                      {recommendation.icon}
                    </span>

                    <span
                      style={{
                        fontSize: 12,
                        padding:
                          "5px 9px",
                        borderRadius: 20,
                        background:
                          "#f0f0f0",
                      }}
                    >
                      {
                        recommendation.priority
                      }
                    </span>
                  </div>

                  <h3
                    style={{
                      margin:
                        "18px 0 10px",
                    }}
                  >
                    {
                      recommendation.title
                    }
                  </h3>

                  <p
                    style={{
                      opacity: 0.65,
                      lineHeight: 1.6,
                      marginBottom: 0,
                    }}
                  >
                    {
                      recommendation.description
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Next Step */}

        <section
          style={{
            marginTop: 25,
            background: "#fff",
            padding: 25,
            borderRadius: 18,
            border: "1px solid #e5e5e5",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            🧭 Your Next Step
          </h2>

          {missingSkills.length > 0 ? (
            <p
              style={{
                lineHeight: 1.7,
                marginBottom: 0,
              }}
            >
              Start by learning{" "}
              <strong>
                {missingSkills[0]}
              </strong>
              . After gaining confidence in this
              skill, continue with the remaining
              skills in your Skill Gap.
            </p>
          ) : (
            <p
              style={{
                lineHeight: 1.7,
                marginBottom: 0,
              }}
            >
              🎉 You have completed the required
              skills. Focus on projects, portfolio
              development and interview preparation.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
