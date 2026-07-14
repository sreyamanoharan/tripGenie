"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this trip? This cannot be undone.");
    if (!confirmed) return;

    setLoading(true);

    const response = await fetch(`/api/trips/${tripId}`, { method: "DELETE" });

    if (response.ok) {
      router.push("/dashboard/trips");
      router.refresh();
    } else {
      setLoading(false);
      alert("Failed to delete trip.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/60 text-red-400 disabled:opacity-60 disabled:cursor-not-allowed transition px-4 py-2.5 rounded-xl text-sm font-medium"
    >
      {loading ? "Deleting…" : "🗑️ Delete"}
    </button>
  );
}
