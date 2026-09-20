
"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Profile = {
  headline: string | null;
  target_career: string | null;
};

type Skill = {
  skill_name: string;
  skill_level: number;
};

export default function AssistantPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [skills, setSkills] = useState<Skill[]>([]);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! 👋 I am SkillBridge AI Assistant. Ask me about your career, skills, roadmap, projects, resume, or interview preparation.",
    },
  ]);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const token =
        localStorage.getItem("skillbridge_token");

      if (!token) {
        return;
      }

      const profileResponse = await fetch(
        `${API_URL}/api/profile/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const skillsResponse = await fetch(
        `${API_URL}/api/skills/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (profileResponse.ok) {
        const profileData =
          await profileResponse.json();

        setProfile(profileData);
      }

      if (skillsResponse.ok) {
        const skillsData =
          await skillsResponse.json();

        setSkills(skillsData);
      }
    } catch (error) {
      console.error(
        "Failed to load user data:",
        error
      );
    }
  }

  async function sendMessage() {
    const text = message.trim();

    if (!text || loading) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: text,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setMessage("");
    setLoading(true);

    try {
      const token =
        localStorage.getItem("skillbridge_token");

      const context = {
        profile: profile,
        skills: skills,
      };

      const response = await fetch(
        `${API_URL}/api/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify({
            message: text,
            context: context,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "AI request failed"
        );
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("AI error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Sorry, I could not connect to the AI server. Please make sure the SkillBridge backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">

        <div>
          <h1 className="text-3xl font-bold">
            AI Assistant
          </h1>

          <p className="mt-2 text-slate-400">
            Your personal SkillBridge career assistant
          </p>

          {profile?.target_career && (
            <p className="mt-2 text-sm text-blue-400">
              Career Goal: {profile.target_career}
            </p>
          )}
        </div>

        <div className="flex min-h-[500px] flex-col rounded-2xl border border-slate-800 bg-slate-900">

          <div className="flex-1 space-y-4 overflow-y-auto p-5">

            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 ${
                    item.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-100"
                  }`}
                >
                  {item.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-800 px-4 py-3 text-slate-400">
                  AI is thinking...
                </div>
              </div>
            )}

          </div>

          <div className="border-t border-slate-800 p-4">

            <div className="flex gap-3">

              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask SkillBridge AI anything..."
                rows={2}
                disabled={loading}
                className="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500 disabled:opacity-50"
              />

              <button
                onClick={sendMessage}
                disabled={
                  loading || !message.trim()
                }
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Sending..."
                  : "Send"}
              </button>

            </div>

            <p className="mt-2 text-xs text-slate-500">
              Press Enter to send • Shift + Enter for a new line
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}

