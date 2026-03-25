"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@/lib/types";
import { Loading } from "@/components/ui/loading";

export default function CustomersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users").then((r) => r.json()).then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customers ({users.length})</h1>
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr_120px] gap-4 px-6 py-3 bg-slate-800/50 text-xs text-slate-500 uppercase font-semibold">
          <div>Name</div><div>Company</div><div>Email</div><div>Phone</div>
        </div>
        {users.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-500">No customers registered yet.</div>
        ) : (
          users.map((user) => (
            <div key={user.uid} className="grid grid-cols-[1fr_1fr_1fr_120px] gap-4 px-6 py-4 border-t border-slate-800 text-sm">
              <div className="text-slate-100">{user.displayName}</div>
              <div className="text-slate-400">{user.company}</div>
              <div className="text-slate-400">{user.email}</div>
              <div className="text-slate-400">{user.phone}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
