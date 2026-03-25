"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "", password: "", displayName: "", company: "", phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const err = await register(form);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-500">⚡ RAYCUS</h1>
          <p className="text-slate-400 mt-2">Create your account</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Full Name</label>
            <Input value={form.displayName} onChange={(e) => update("displayName", e.target.value)} required placeholder="John Smith" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Company</label>
            <Input value={form.company} onChange={(e) => update("company", e.target.value)} required placeholder="Acme Corp" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Phone</label>
            <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+48 123 456 789" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="you@company.com" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={6} placeholder="Min 6 characters" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">Sign In</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
