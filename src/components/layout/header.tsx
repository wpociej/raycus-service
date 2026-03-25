"use client";

import { useAuth } from "@/lib/auth-context";

export function Header({ title }: { title?: string }) {
  const { profile } = useAuth();
  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400">{profile?.company}</span>
      </div>
    </header>
  );
}
