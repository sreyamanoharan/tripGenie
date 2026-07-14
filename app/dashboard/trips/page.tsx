import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default async function TripsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/login");

  const trips = await prisma.trip.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const totalBudget = trips.reduce((sum, t) => sum + t.budget, 0);
  const totalDestinations = new Set(trips.map((t) => t.destination)).size;

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Trips</h1>
            <p className="text-slate-400 text-sm">All your AI-generated travel plans</p>
          </div>
          <Link
            href="/dashboard/new-trip"
            className="bg-indigo-600 hover:bg-indigo-500 transition px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/20"
          >
            + New Trip
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Trips", value: trips.length, icon: "🗺️" },
            { label: "Total Budget", value: `₹${totalBudget.toLocaleString()}`, icon: "💰" },
            { label: "Destinations", value: totalDestinations, icon: "📍" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Trips list */}
        {trips.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
            <div className="text-5xl mb-4">✈️</div>
            <p className="text-slate-400 mb-5">No trips yet. Start planning your first one!</p>
            <Link
              href="/dashboard/new-trip"
              className="bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 rounded-xl text-sm font-medium"
            >
              Plan a Trip
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {trips.map((trip) => (
              <Link
                href={`/dashboard/trips/${trip.id}`}
                key={trip.id}
                className="group bg-white/5 border border-white/10 hover:border-indigo-500/40 rounded-2xl overflow-hidden transition"
              >
                {/* Color bar */}
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500" />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-bold group-hover:text-indigo-300 transition">
                      {trip.destination}
                    </h2>
                    <span className="text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                      {trip.days}d
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-slate-400 mb-4">
                    <span>👥 {trip.travelers} traveler{trip.travelers !== 1 ? "s" : ""}</span>
                    <span>💰 ₹{trip.budget.toLocaleString()}</span>
                  </div>

                  {trip.interests?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {trip.interests.map((i) => (
                        <span
                          key={i}
                          className="text-xs bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded-full"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-slate-500">
                    Created {trip.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
