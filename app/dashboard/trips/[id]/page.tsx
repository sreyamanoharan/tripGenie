import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import ExportPDFButton from "./ExportPDFButton";
import WeatherCard from "./WeatherCard";
import RegenerateButton from "./RegenerateButton";

type ItineraryDay = {
  day: number;
  places: { name: string; type: string; description: string }[];
  food: { meal: string; description: string; costEstimate: number }[];
  estimatedCost: number;
  tips: string;
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TripDetailsPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/login");

  const trip = await prisma.trip.findFirst({
    where: { id, userId: user.id },
  });

  if (!trip) notFound();

  const itinerary = trip.itinerary as { days: ItineraryDay[] } | null;

  const totalCost = itinerary?.days.reduce((s, d) => s + d.estimatedCost, 0) ?? 0;

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Hero header */}
      <div className="relative bg-gradient-to-br from-indigo-900/60 via-[#0f1117] to-[#0f1117] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Link
            href="/dashboard/trips"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-6 transition"
          >
            ← Back to trips
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{trip.destination}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                <span>📅 {trip.days} day{trip.days !== 1 ? "s" : ""}</span>
                <span>👥 {trip.travelers} traveler{trip.travelers !== 1 ? "s" : ""}</span>
                <span>💰 ₹{trip.budget.toLocaleString()} budget</span>
                {totalCost > 0 && (
                  <span className="text-green-400">
                    ✅ Est. total: ₹{totalCost.toLocaleString()}
                  </span>
                )}
              </div>
              {trip.interests?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {trip.interests.map((i) => (
                    <span
                      key={i}
                      className="text-xs bg-white/5 border border-white/10 text-slate-300 px-2.5 py-0.5 rounded-full"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">
              <ExportPDFButton destination={trip.destination} itinerary={itinerary} />
              <RegenerateButton tripId={trip.id} />
              <DeleteButton tripId={trip.id} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <WeatherCard destination={trip.destination} />

        {!itinerary ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <div className="text-5xl mb-4">🤖</div>
            <p className="text-slate-400 mb-5">No itinerary yet. Try regenerating this trip.</p>
            <RegenerateButton tripId={trip.id} />
          </div>
        ) : (
          <div className="space-y-6 mt-8">
            {itinerary.days.map((day) => (
              <div
                key={day.day}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                {/* Day header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.03]">
                  <h2 className="text-lg font-bold">Day {day.day}</h2>
                  <span className="text-sm text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    ₹{day.estimatedCost.toLocaleString()}
                  </span>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-6">
                  {/* Places */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-1.5 mb-3">
                      📍 Places to Visit
                    </h3>
                    <div className="space-y-3">
                      {day.places?.map((place, i) => (
                        <div
                          key={i}
                          className="bg-white/5 border border-white/10 rounded-xl p-4"
                        >
                          <p className="font-semibold text-sm">{place.name}</p>
                          <p className="text-indigo-400 text-xs mt-0.5">{place.type}</p>
                          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                            {place.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Food */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-1.5 mb-3">
                      🍽️ Food Recommendations
                    </h3>
                    <div className="space-y-3">
                      {day.food?.map((food, i) => (
                        <div
                          key={i}
                          className="bg-white/5 border border-white/10 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="font-semibold text-sm">{food.meal}</p>
                            <span className="text-green-400 text-xs font-semibold">
                              ₹{food.costEstimate}
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            {food.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tips */}
                {day.tips && (
                  <div className="mx-6 mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex gap-2">
                    <span className="text-amber-400 text-sm mt-0.5">💡</span>
                    <p className="text-amber-200 text-sm leading-relaxed">{day.tips}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
