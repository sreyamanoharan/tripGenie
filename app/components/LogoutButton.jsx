"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-slate-400 hover:text-red-400 text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition"
    >
      Logout
    </button>
  );
}
