import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TripForm from "./TripForm";
import Navbar from "@/app/components/Navbar";

export default async function NewTripPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-14">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full mb-4">
            ✨ AI-Powered
          </div>
          <h1 className="text-4xl font-bold mb-2">Plan Your Trip</h1>
          <p className="text-slate-400">
            Fill in the details and we&apos;ll generate a full itinerary for you.
          </p>
        </div>
        <TripForm />
      </main>
    </>
  );
}
