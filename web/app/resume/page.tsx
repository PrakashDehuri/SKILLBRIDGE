"use client";

import { useState } from "react";

import Sidebar from "../../components/layout/Sidebar";

import {
  uploadResume,
  getResumeDownloadUrl,
} from "../../lib/api";


type RoadmapStep = {
  step: number;
  title: string;
  skills: string[];
  description: string;
};


type Analysis = {
  career?: {
    title?: string;
    reason?: string;
  };

  resume_summary?: string;

  skills_found?: string[];

  skills_recommended?: string[];

  skill_gap?: string[];

  strengths?: string[];

  improvement_areas?: string[];

  roadmap?: RoadmapStep[];
};


type ResumeInfo = {
  id?: number;
  filename?: string;
  file_type?: string;
  file_size?: number;
  created_at?: string;
};


export default function ResumePage() {

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [analysis, setAnalysis] =
    useState<Analysis | null>(null);

  const [resumeInfo, setResumeInfo] =
    useState<ResumeInfo | null>(null);


  async function handleUpload() {

    if (!file) {

      setError(
        "Please select a PDF or DOCX resume."
      );

      return;
    }


    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();


    if (
      extension !== "pdf" &&
      extension !== "docx"
    ) {

      setError(
        "Only PDF and DOCX files are allowed."
      );

      return;
    }


    if (
      file.size >
      10 * 1024 * 1024
    ) {

      setError(
        "Resume file must be 10 MB or smaller."
      );

      return;
    }


    setLoading(true);
    setError("");
    setAnalysis(null);


    try {

      const data =
        await uploadResume(file);


      setResumeInfo(
        data.resume
      );


      setAnalysis(
        data.analysis
      );


    } catch (err: any) {

      setError(
        err?.message ||
        "Resume upload failed."
      );


    } finally {

      setLoading(false);

    }
  }


  return (

    <div className="min-h-screen bg-[#070b17] text-white">

      <Sidebar />


      <main className="ml-[250px] min-h-screen p-8">

        {/* HEADER */}

        <div className="mb-8">

          <p className="text-sm text-red-400 font-semibold tracking-wider">

            AI CAREER ANALYZER

          </p>


          <h1 className="mt-2 text-4xl font-bold">

            Resume Analyzer

          </h1>


          <p className="mt-2 text-gray-400 max-w-2xl">

            Upload your resume and let AI identify
            your career direction, skills, skill gaps
            and personalized learning roadmap.

          </p>

        </div>


        {/* UPLOAD CARD */}

        <div className="premium-card p-6 mb-8">

          <div className="flex flex-col lg:flex-row gap-5 items-center">

            <div className="flex-1 w-full">

              <label className="block text-sm text-gray-400 mb-2">

                Upload Resume

              </label>


              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => {

                  setFile(
                    e.target.files?.[0] ||
                    null
                  );

                  setError("");

                  setAnalysis(null);

                }}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-gray-300 cursor-pointer"
              />


              {file && (

                <p className="mt-2 text-sm text-gray-400">

                  Selected: {file.name}

                </p>

              )}

            </div>


            <button
              onClick={handleUpload}
              disabled={loading}
              className="premium-button px-7 py-4 rounded-xl font-semibold min-w-[190px] disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {loading
                ? "Analyzing..."
                : "Analyze Resume"}

            </button>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="mt-5 rounded-xl bg-violet-500/10 border border-violet-500/20 p-4">

              <p className="text-violet-300">

                🤖 AI is reading your resume and
                creating your personalized roadmap...

              </p>

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="mt-5 rounded-xl bg-red-500/10 border border-red-500/20 p-4">

              <p className="text-red-300">

                ⚠️ {error}

              </p>

            </div>

          )}

        </div>


        {/* UPLOADED RESUME */}

        {resumeInfo && (

          <div className="premium-card p-6 mb-8">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>

                <p className="text-sm text-gray-400">

                  Uploaded Resume

                </p>


                <h2 className="text-xl font-semibold mt-1">

                  📄 {resumeInfo.filename}

                </h2>


                <p className="text-sm text-gray-500 mt-1">

                  {resumeInfo.file_type?.toUpperCase()}

                  {" • "}

                  {resumeInfo.file_size
                    ? Math.round(
                        resumeInfo.file_size /
                        1024
                      )
                    : 0}

                  {" KB"}

                </p>

              </div>


              <a
                href={getResumeDownloadUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button px-5 py-3 rounded-xl text-center"
              >

                ⬇️ Download Resume

              </a>

            </div>

          </div>

        )}


        {/* AI ANALYSIS */}

        {analysis && (

          <div className="space-y-6">

            {/* CAREER */}

            <div className="premium-card p-6">

              <p className="text-sm text-red-400 font-semibold">

                🎯 CAREER DETECTED

              </p>


              <h2 className="text-3xl font-bold mt-2">

                {analysis.career?.title ||
                  "Career not detected"}

              </h2>


              {analysis.career?.reason && (

                <p className="text-gray-400 mt-3 leading-7">

                  {analysis.career.reason}

                </p>

              )}

            </div>


            {/* SUMMARY */}

            <div className="premium-card p-6">

              <h2 className="text-xl font-bold">

                📋 Resume Summary

              </h2>


              <p className="text-gray-400 mt-3 leading-7">

                {analysis.resume_summary ||
                  "No summary available."}

              </p>

            </div>


            {/* SKILLS */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* FOUND SKILLS */}

              <div className="premium-card p-6">

                <h2 className="text-xl font-bold">

                  ✅ Skills You Have

                </h2>


                <div className="flex flex-wrap gap-3 mt-5">

                  {analysis.skills_found?.length ? (

                    analysis.skills_found.map(
                      (skill, index) => (

                        <span
                          key={index}
                          className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300"
                        >

                          {skill}

                        </span>

                      )
                    )

                  ) : (

                    <p className="text-gray-500">

                      No skills detected.

                    </p>

                  )}

                </div>

              </div>


              {/* REQUIRED SKILLS */}

              <div className="premium-card p-6">

                <h2 className="text-xl font-bold">

                  💡 Skills You Need

                </h2>


                <div className="flex flex-wrap gap-3 mt-5">

                  {analysis.skills_recommended?.length ? (

                    analysis.skills_recommended.map(
                      (skill, index) => (

                        <span
                          key={index}
                          className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300"
                        >

                          {skill}

                        </span>

                      )
                    )

                  ) : (

                    <p className="text-gray-500">

                      No additional skills suggested.

                    </p>

                  )}

                </div>

              </div>

            </div>


            {/* SKILL GAP */}

            <div className="premium-card p-6">

              <h2 className="text-xl font-bold">

                ⚠️ Skill Gap

              </h2>


              <div className="grid md:grid-cols-2 gap-4 mt-5">

                {analysis.skill_gap?.length ? (

                  analysis.skill_gap.map(
                    (skill, index) => (

                      <div
                        key={index}
                        className="rounded-xl bg-red-500/5 border border-red-500/10 p-4"
                      >

                        <span className="text-red-300">

                          {skill}

                        </span>

                      </div>

                    )
                  )

                ) : (

                  <p className="text-gray-500">

                    No major skill gaps detected.

                  </p>

                )}

              </div>

            </div>


            {/* STRENGTHS */}

            <div className="premium-card p-6">

              <h2 className="text-xl font-bold">

                💪 Your Strengths

              </h2>


              <div className="space-y-3 mt-5">

                {analysis.strengths?.length ? (

                  analysis.strengths.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="flex gap-3 text-gray-300"
                      >

                        <span className="text-green-400">

                          ✓

                        </span>


                        <span>

                          {item}

                        </span>

                      </div>

                    )
                  )

                ) : (

                  <p className="text-gray-500">

                    No strengths detected.

                  </p>

                )}

              </div>

            </div>


            {/* IMPROVEMENT AREAS */}

            <div className="premium-card p-6">

              <h2 className="text-xl font-bold">

                📈 Improvement Areas

              </h2>


              <div className="space-y-3 mt-5">

                {analysis.improvement_areas?.length ? (

                  analysis.improvement_areas.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="flex gap-3 text-gray-300"
                      >

                        <span className="text-yellow-400">

                          →

                        </span>


                        <span>

                          {item}

                        </span>

                      </div>

                    )
                  )

                ) : (

                  <p className="text-gray-500">

                    No improvement areas detected.

                  </p>

                )}

              </div>

            </div>


            {/* ROADMAP */}

            <div className="premium-card p-6">

              <div className="mb-7">

                <p className="text-sm text-violet-400 font-semibold">

                  PERSONALIZED CAREER PLAN

                </p>


                <h2 className="text-3xl font-bold mt-2">

                  🛣️ Your Roadmap

                </h2>

              </div>


              <div className="space-y-5">

                {analysis.roadmap?.length ? (

                  analysis.roadmap.map(
                    (step) => (

                      <div
                        key={step.step}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                      >

                        <div className="flex gap-5">

                          <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-red-500 via-violet-600 to-blue-600 flex items-center justify-center font-bold">

                            {step.step}

                          </div>


                          <div className="flex-1">

                            <h3 className="text-xl font-bold">

                              {step.title}

                            </h3>


                            <p className="text-gray-400 mt-2 leading-7">

                              {step.description}

                            </p>


                            <div className="flex flex-wrap gap-2 mt-4">

                              {step.skills?.map(
                                (skill, index) => (

                                  <span
                                    key={index}
                                    className="px-3 py-1 rounded-lg bg-violet-500/10 text-violet-300 text-sm"
                                  >

                                    {skill}

                                  </span>

                                )
                              )}

                            </div>

                          </div>

                        </div>

                      </div>

                    )
                  )

                ) : (

                  <p className="text-gray-500">

                    No roadmap generated.

                  </p>

                )}

              </div>

            </div>

          </div>

        )}

      </main>

    </div>

  );
}