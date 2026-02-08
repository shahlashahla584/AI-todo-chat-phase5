"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/lib/auth";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <>
      

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
        {/* Background glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-120px] right-[-120px] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-[-120px] left-[-120px] w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        {/* Frosted glass login card */}
        <div className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-extrabold text-white text-center mb-6">
            Sign in to your account
          </h2>

          {error && (
            <div className="bg-red-600/20 border border-red-500 text-red-100 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 rounded-md bg-white/30 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent border border-white/20"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 rounded-md bg-white/30 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent border border-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-200">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
