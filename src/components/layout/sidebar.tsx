"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n, LanguageSwitcher } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const customerNav = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: "📊" },
  { href: "/machines", labelKey: "nav.myMachines", icon: "🔧" },
  { href: "/tickets", labelKey: "nav.tickets", icon: "🎫" },
  { href: "/catalog", labelKey: "nav.catalog", icon: "📖" },
  { href: "/kb", labelKey: "nav.kb", icon: "📚" },
];

const adminNav = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: "📊" },
  { href: "/admin/tickets", labelKey: "nav.allTickets", icon: "🎫" },
  { href: "/admin/customers", labelKey: "nav.customers", icon: "👥" },
  { href: "/admin/machines", labelKey: "nav.allMachines", icon: "🔧" },
  { href: "/catalog", labelKey: "nav.catalog", icon: "📖" },
  { href: "/kb", labelKey: "nav.kb", icon: "📚" },
  { href: "/admin/catalog", labelKey: "nav.manageCatalog", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { profile, logout } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = profile?.role === "admin" ? adminNav : customerNav;

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  const sidebarContent = (
    <>
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-500">⚡ RAYCUS</h1>
        <p className="text-xs text-slate-500 mt-1">
          {profile?.role === "admin" ? t("nav.adminPanel") : t("nav.servicePlatform")}
        </p>
      </div>

      <nav className="flex-1 px-3">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                active ? "bg-blue-500/15 text-blue-400" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}>
              <span>{item.icon}</span>
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div className="px-3 py-2 flex items-center justify-between">
          <span className="text-sm text-slate-500 truncate">{profile?.displayName}</span>
          <LanguageSwitcher />
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 w-full transition-colors cursor-pointer">
          <span>🚪</span>
          <span>{t("nav.logout")}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        aria-label="Open menu">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col animate-slide-in-left">
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer" aria-label="Close menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-56 bg-slate-900 border-r border-slate-800 flex-col z-10">
        {sidebarContent}
      </aside>
    </>
  );
}
