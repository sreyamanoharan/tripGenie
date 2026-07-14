import { auth } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✈️</span>
          <span className="font-bold text-xl tracking-tight">
            AI Travel Planner
          </span>
        </div>
        <div className="flex gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-lg text-sm font-medium"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-300 hover:text-white transition px-4 py-2 rounded-lg text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-lg text-sm font-medium"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm px-4 py-1.5 rounded-full mb-6">
          <span>✨</span> Powered by Gemini AI
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Plan Your Dream Trip<br />in Seconds
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Tell us your destination, budget, and interests — our AI builds a
          complete day-by-day itinerary tailored just for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {session ? (
            <Link
              href="/dashboard/new-trip"
              className="bg-indigo-600 hover:bg-indigo-500 transition px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-indigo-500/25"
            >
              Plan a New Trip →
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-500 transition px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-indigo-500/25"
              >
                Start for Free →
              </Link>
              <Link
                href="/login"
                className="bg-white/5 hover:bg-white/10 border border-white/10 transition px-8 py-4 rounded-xl text-lg font-semibold"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🗺️",
              title: "Smart Itineraries",
              desc: "Day-by-day plans with places, food, costs and local tips — all generated instantly.",
            },
            {
              icon: "💰",
              title: "Budget Aware",
              desc: "Set your budget and the AI builds a plan that actually fits, with cost estimates per day.",
            },
            {
              icon: "📄",
              title: "Export to PDF",
              desc: "Download your itinerary as a PDF to take offline or share with travel companions.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/40 transition"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-slate-600 text-sm py-6 border-t border-white/5">
        © {new Date().getFullYear()} AI Travel Planner · Built with Next.js &amp; Gemini
      </footer>
    </main>
  );
}
