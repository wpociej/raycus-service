"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const customerNav = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/machines", label: "My Machines", icon: "🔧" },
  { href: "/catalog", label: "Product Catalog", icon: "📖" },
];

const adminNav = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/machines", label: "All Machines", icon: "🔧" },
  { href: "/catalog", label: "Product Catalog", icon: "📖" },
  { href: "/admin/catalog", label: "Manage Catalog", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { profile, logout } = useAuth();
  const router = useRouter();
  const nav = profile?.role === "admin" ? adminNav : customerNav;

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-slate-900 border-r border-slate-800 flex flex-col z-10">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-500">⚡ RAYCUS</h1>
        <p className="text-xs text-slate-500 mt-1">
          {profile?.role === "admin" ? "Admin Panel" : "Service Platform"}
        </p>
      </div>

      <nav className="flex-1 px-3">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                active
                  ? "bg-blue-500/15 text-blue-400"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div className="px-3 py-2 text-sm text-slate-500 truncate">
          {profile?.displayName}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 w-full transition-colors cursor-pointer"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
