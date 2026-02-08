"use client";

import { useState, useEffect } from 'react';
import Hero from "./components/Hero";
import Features from "./components/features/page";
import Footer from "./components/Footer";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a minimal placeholder during SSR/hydration
    return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"></div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
