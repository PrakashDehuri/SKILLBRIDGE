"use client";

import { useEffect, useState } from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../lib/api";

import Sidebar from "../components/layout/Sidebar";
import DashboardHome from "../components/dashboard/DashboardHome";

type User = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
};

export default function Home() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [user, setUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("skillbridge_token");

    if (!token) {
      return;
    }

    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch(() => {
        localStorage.removeItem("skillbridge_token");
      });
  }, []);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setSuccess("");

      await loginUser(email, password);

      const currentUser = await getCurrentUser();

      setUser(currentUser);
      setPassword("");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();

    const cleanName = name.trim();

    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(cleanName)) {
      setMessage(
        "Name can contain only English letters and spaces."
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setSuccess("");

      await registerUser(
        cleanName,
        email.trim(),
        password
      );

      setSuccess(
        "Registration successful! Please login."
      );

      setMode("login");

      setName("");
      setPassword("");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("skillbridge_token");

    setUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setMessage("");
    setSuccess("");
    setMode("login");
  }

  function switchMode(newMode: "login" | "register") {
    setMode(newMode);
    setMessage("");
    setSuccess("");
  }

  if (user) {
    return (
      <div className="min-h-screen bg-[#070b17] text-white">
        <Sidebar onLogout={handleLogout} />

        <main className="ml-[250px] min-h-screen p-8">
          <div className="page-enter">
            <DashboardHome
              user={{
                name: user.name,
                email: user.email,
              }}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b17] px-5 py-10 text-white">

      {/* Background Glow */}

      <div className="pointer-events-none absolute left-[-120px] top-[-120px] h-[350px] w-[350px] rounded-full bg-blue-600/20 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-[-150px] right-[-100px] h-[400px] w-[400px] rounded-full bg-violet-600/20 blur-[130px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[100px]" />

      {/* Authentication Card */}

      <section className="page-enter relative w-full max-w-[440px]">

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl">

          {/* Logo */}

          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-2xl font-black shadow-lg shadow-blue-500/20">
              S
            </div>

            <p className="text-xs font-semibold tracking-[0.35em] text-blue-400">
              SKILLBRIDGE
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              {mode === "login"
                ? "Welcome Back"
                : "Create Account"}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {mode === "login"
                ? "Continue your career journey."
                : "Start building your career today."}
            </p>

          </div>

          {/* Login / Register Switch */}

          <div className="mb-6 grid grid-cols-2 rounded-xl border border-slate-800 bg-slate-950/70 p-1">

            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                mode === "register"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Register
            </button>

          </div>

          {/* Form */}

          <form
            onSubmit={
              mode === "login"
                ? handleLogin
                : handleRegister
            }
            className="grid gap-4"
          >

            {/* Name */}

            {mode === "register" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (/^[A-Za-z ]*$/.test(value)) {
                      setName(value);
                    }
                  }}
                  required
                  autoComplete="name"
                  pattern="[A-Za-z]+( [A-Za-z]+)*"
                  title="Name can contain only English letters and spaces"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            )}

            {/* Email */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                autoComplete="email"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Password */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                minLength={6}
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="premium-button mt-2 rounded-xl px-5 py-3.5 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Login →"
                  : "Create Account →"}
            </button>

          </form>

          {/* Error Message */}

          {message && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-400">
              {message}
            </div>
          )}

          {/* Success Message */}

          {success && (
            <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-emerald-400">
              {success}
            </div>
          )}

          {/* Footer */}

          <p className="mt-7 text-center text-xs text-slate-500">
            Build Skills • Shape Your Career •{" "}
            <span className="text-slate-400">
              SkillBridge
            </span>
          </p>

        </div>

      </section>
    </main>
  );
}