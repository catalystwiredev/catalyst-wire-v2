"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bear-dim)", color: "var(--bear)", border: "1px solid var(--bear-border)", padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
    >
      <LogOut size={14} /> Sign out
    </button>
  );
}
