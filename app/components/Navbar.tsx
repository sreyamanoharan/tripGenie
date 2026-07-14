import { auth } from "@/auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#0f1117]/80 backdrop-blur-sm sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
        <span className="text-xl">✈️</span>
        <span>TripGenie AI</span>
      </Link>

      <div className="flex items-center gap-2">
        {session ? (
          <>
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/trips"
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition"
            >
              My Trips
            </Link>
            <Link
              href="/dashboard/new-trip"
              className="bg-indigo-600 hover:bg-indigo-500 transition text-sm px-4 py-2 rounded-lg font-medium"
            >
              + New Trip
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 hover:bg-indigo-500 transition text-sm px-4 py-2 rounded-lg font-medium"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
