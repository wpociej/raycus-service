"use client";

import { useEffect, useState } from "react";
import { Machine } from "@/lib/types";
import { MachineCard } from "@/components/machines/machine-card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/machines").then((r) => r.json()).then((data) => {
      setMachines(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Machines</h1>
        <Link href="/machines/register"><Button>+ Register Machine</Button></Link>
      </div>
      {machines.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">You haven&apos;t registered any machines yet.</p>
          <Link href="/machines/register"><Button>Register Your First Machine</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {machines.map((machine) => (<MachineCard key={machine.id} machine={machine} />))}
        </div>
      )}
    </div>
  );
}
