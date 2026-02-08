"use client";

import Link from "next/link";
import { useAuth } from "@/src/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensure client-side rendering only to fix hydration
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!mounted) {
    // Prevent SSR/Client mismatch
    return null;
  }

  return (
    <nav className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 shadow-lg z-50">
      {/* Glow behind navbar */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] right-[-80px] w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-80px] left-[-80px] w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <span className="text-white font-bold text-xl">TodoApp</span>
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/components/features"
              className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Features
            </Link>
            {isAuthenticated ? (
              <>
                <span className="text-slate-300 text-sm">
                  Welcome, {user?.email}
                </span>
                <Link
                  href="/dashboard"
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/chat"
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ChatBot
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 rounded-md text-sm font-medium text-white shadow-md hover:opacity-90 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-md transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 space-y-2 bg-white/5 backdrop-blur-lg rounded-xl p-4 shadow-lg">
            <Link
              href="/components/features"
              className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/chat"
                  className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  ChatBot
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="block w-full text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block bg-gradient-to-r from-sky-500 to-indigo-600 px-3 py-2 rounded-md text-sm font-medium text-white shadow-md hover:opacity-90 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
