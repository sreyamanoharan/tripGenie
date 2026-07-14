import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const firstName = session.user?.name?.split(" ")[0] ?? "Traveler";

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-indigo-400 text-sm font-medium mb-1">Welcome back</p>
          <h1 className="text-4xl font-bold mb-2">
            Hey, {firstName} 👋
          </h1>
          <p className="text-slate-400">{session.user?.email}</p>
        </div>
<Link href="/dashboard/profile">
  Profile
</Link>
        {/* Quick actions */}
        <div className="grid md:grid-cols-2 gap-5">
          <Link
            href="/dashboard/new-trip"
            className="group bg-gradient-to-br from-indigo-600/30 to-violet-600/20 border border-indigo-500/30 hover:border-indigo-400/60 rounded-2xl p-8 transition"
          >
            <div className="text-4xl mb-4">🗺️</div>
            <h2 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition">
              Plan a New Trip
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Enter your destination, budget and interests — get a full AI-generated
              itinerary in seconds.
            </p>
            <div className="mt-6 text-indigo-400 text-sm font-medium">
              Start planning →
            </div>
          </Link>

          <Link
            href="/dashboard/trips"
            className="group bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-8 transition"
          >
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-xl font-bold mb-2 group-hover:text-white transition">
              My Trips
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              View, manage and export all your saved travel itineraries in one place.
            </p>
            <div className="mt-6 text-slate-400 text-sm font-medium group-hover:text-white transition">
              View trips →
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}
