"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegenerateButton({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRegenerate = async () => {
    setLoading(true);

    const response = await fetch(`/api/trips/${tripId}/regenerate`, {
      method: "POST",
    });

    setLoading(false);

    if (response.ok) {
      router.refresh();
    } else {
      alert("Failed to regenerate trip. Please try again.");
    }
  };

  return (
    <button
      onClick={handleRegenerate}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition px-4 py-2.5 rounded-xl text-sm font-medium"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Regenerating…
        </>
      ) : (
        <>🔄 Regenerate</>
      )}
    </button>
  );
}
