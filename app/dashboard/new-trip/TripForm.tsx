"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const interestOptions = [
  { label: "Beaches", icon: "🏖️" },
  { label: "Mountains", icon: "⛰️" },
  { label: "Food", icon: "🍜" },
  { label: "Adventure", icon: "🧗" },
  { label: "Nature", icon: "🌿" },
  { label: "Historical Sites", icon: "🏛️" },
];

export default function TripForm() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(10000);
  const [travelers, setTravelers] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, days, budget, travelers, interests }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate trip");
      }

      router.push(`/dashboard/trips/${data.trip.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Destination */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Destination
        </label>
        <input
          type="text"
          placeholder="e.g. Kerala, Rajasthan, Goa…"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
          required
        />
      </div>

      {/* Days + Travelers */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Number of Days
          </label>
          <input
            type="number"
            value={days}
            min={1}
            max={30}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Travelers
          </label>
          <input
            type="number"
            value={travelers}
            min={1}
            onChange={(e) => setTravelers(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
            required
          />
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Total Budget (₹)
        </label>
        <input
          type="number"
          value={budget}
          min={0}
          step={500}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
          required
        />
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Interests
        </label>
        <div className="grid grid-cols-3 gap-3">
          {interestOptions.map(({ label, icon }) => {
            const selected = interests.includes(label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleInterest(label)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                  selected
                    ? "bg-indigo-600/30 border-indigo-500 text-indigo-200"
                    : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20"
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition py-4 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Generating your itinerary…
          </>
        ) : (
          "✨ Generate Trip"
        )}
      </button>
    </form>
  );
}
