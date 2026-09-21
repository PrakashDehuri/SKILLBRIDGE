
"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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
    <main className="min-h-screen overflow-hidden bg-[#070b17] p-4 text-white sm:p-6">

      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#4169e1]/15 blur-3xl" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-[#20c9b0]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#9b59b6]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6">

        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#20c9b0]/30 bg-[#20c9b0]/10 px-3 py-1 text-xs font-semibold text-[#20c9b0]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#a8e63d]" />
                AI CAREER COPILOT
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                SkillBridge{" "}
                <span className="bg-gradient-to-r from-[#ff7f6e] via-[#ffb38a] to-[#20c9b0] bg-clip-text text-transparent">
                  AI Assistant
                </span>
              </h1>

              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                Your personal career assistant for skills,
                roadmap, projects, resume and interviews.
              </p>

              {profile?.target_career && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#4169e1]/30 bg-[#4169e1]/10 px-4 py-2 text-sm">
                  <span className="text-[#ffb38a]">
                    Career Goal
                  </span>
                  <span className="font-semibold text-white">
                    {profile.target_career}
                  </span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:w-64">
              <div className="rounded-2xl border border-[#4169e1]/20 bg-[#4169e1]/10 p-4">
                <p className="text-xs text-slate-400">
                  Your Skills
                </p>
                <p className="mt-1 text-2xl font-black text-[#4169e1]">
                  {skills.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[#a8e63d]/20 bg-[#a8e63d]/10 p-4">
                <p className="text-xs text-slate-400">
                  Messages
                </p>
                <p className="mt-1 text-2xl font-black text-[#a8e63d]">
                  {messages.length}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Chat */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl backdrop-blur-xl">

          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#4169e1]/10 via-[#20c9b0]/5 to-[#9b59b6]/10 px-5 py-4">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4169e1] to-[#20c9b0] text-xl shadow-lg shadow-[#4169e1]/20">
                ✦
              </div>

              <div>
                <p className="font-bold">
                  SkillBridge AI
                </p>
                <p className="text-xs text-slate-400">
                  Career guidance powered by AI
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#a8e63d]" />
              <span className="text-xs text-slate-400">
                Online
              </span>
            </div>

          </div>

          {/* Messages */}
          <div className="flex min-h-[500px] flex-col space-y-5 overflow-y-auto p-5 sm:p-6">

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
                  className={`max-w-[88%] rounded-2xl px-5 py-4 shadow-lg sm:max-w-[75%] ${
                    item.role === "user"
                      ? "rounded-br-md bg-gradient-to-r from-[#4169e1] to-[#20c9b0] text-white shadow-[#4169e1]/10"
                      : "rounded-bl-md border border-white/10 bg-white/[0.06] text-slate-100"
                  }`}
                >
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                    {item.role === "user"
                      ? "You"
                      : "SkillBridge AI"}
                  </div>

                  <div className="whitespace-pre-wrap text-sm leading-7">
                    {item.content}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-[#9b59b6]/20 bg-[#9b59b6]/10 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#ff7f6e]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#ffb38a] [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#20c9b0] [animation-delay:300ms]" />
                    <span className="ml-2 text-sm text-slate-400">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Input */}
          <div className="border-t border-white/10 bg-black/10 p-4 sm:p-5">

            <div className="flex flex-col gap-3 sm:flex-row">

              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask SkillBridge AI about your career..."
                rows={2}
                disabled={loading}
                className="min-h-[64px] flex-1 resize-none rounded-2xl border border-white/10 bg-[#070b17] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#20c9b0]/60 focus:ring-2 focus:ring-[#20c9b0]/10 disabled:opacity-50"
              />

              <button
                onClick={sendMessage}
                disabled={
                  loading || !message.trim()
                }
                className="rounded-2xl bg-gradient-to-r from-[#ff7f6e] via-[#ffb38a] to-[#20c9b0] px-7 py-3 font-bold text-[#070b17] shadow-lg shadow-[#ff7f6e]/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[120px]"
              >
                {loading
                  ? "Sending..."
                  : "Send →"}
              </button>

            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-600">
                Enter to send • Shift + Enter for a new line
              </p>

              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#ff7f6e]" />
                <span className="h-2 w-2 rounded-full bg-[#20c9b0]" />
                <span className="h-2 w-2 rounded-full bg-[#4169e1]" />
                <span className="h-2 w-2 rounded-full bg-[#a8e63d]" />
                <span className="h-2 w-2 rounded-full bg-[#9b59b6]" />
                <span className="h-2 w-2 rounded-full bg-[#ffb38a]" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}

