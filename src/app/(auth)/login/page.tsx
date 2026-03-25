"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n, LanguageSwitcher } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const err = await login(email, password);
    if (err) { setError(err); setLoading(false); } else { router.push("/dashboard"); }
  }

  return (
    <Card>
      <CardHeader>
        <div className="text-center">
          <div className="flex justify-center mb-3"><LanguageSwitcher /></div>
          <h1 className="text-2xl font-bold text-blue-500">⚡ RAYCUS</h1>
          <p className="text-slate-400 mt-2">{t("nav.servicePlatform")}</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div>
            <label className="block text-sm text-slate-400 mb-1">{t("auth.email")}</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@raycus-service.com" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">{t("auth.password")}</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="admin123" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? t("auth.signingIn") : t("auth.signIn")}</Button>
          <p className="text-center text-sm text-slate-500">
            {t("auth.noAccount")}{" "}
            <Link href="/register" className="text-blue-500 hover:underline">{t("auth.register")}</Link>
          </p>
          <div className="mt-4 p-3 bg-slate-800 rounded-lg text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">{t("auth.demoAccounts")}</p>
            <p>Admin: admin@raycus-service.com / admin123</p>
            <p>Customer: demo@acmecorp.com / demo123</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
