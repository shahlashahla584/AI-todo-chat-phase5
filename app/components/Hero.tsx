"use client";

import Link from "next/link";
import { useAuth } from "@/src/lib/auth";

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-24 sm:py-32 text-white">
      {/* Background glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] right-[-120px] w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-120px] left-[-120px] w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="block text-slate-200">
              Organize Your Work
            </span>
            <span className="block mt-3 bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              With Focus & Clarity
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-300">
            A modern task management platform designed for productivity,
            simplicity, and speed. Stay focused and get things done.
          </p>

          {/* Features */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Secure by Design",
                desc: "Enterprise-grade authentication and data protection",
                color: "indigo",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                ),
              },
              {
                title: "Fast Workflow",
                desc: "Create, update, and track tasks instantly",
                color: "sky",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                ),
              },
              {
                title: "Minimal Interface",
                desc: "Clean UI focused on what matters most",
                color: "violet",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/10 transition-all shadow-lg"
              >
                <div
                  className={`w-12 h-12 mb-4 mx-auto rounded-xl bg-${item.color}-500/20 flex items-center justify-center`}
                >
                  <svg
                    className={`w-6 h-6 text-${item.color}-400`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-9 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-90 transition shadow-xl"
              >
                Open Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center px-9 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-90 transition shadow-xl"
                >
                  Get Started Free →
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center px-9 py-3 rounded-xl text-base font-medium border border-white/20 text-slate-200 hover:bg-white/10 transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
