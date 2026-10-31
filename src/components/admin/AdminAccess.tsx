"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { config } from "@/lib/config";
export function AdminAccess({ ready }: { ready: boolean }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, action: "login" }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bağlantı kurulamadı.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-5">
      <section className="card w-full max-w-sm p-7">
        <div className="mb-5 grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <p className="text-xs font-bold text-subtle">yetişikayet.com</p>
        <h1 className="mt-2 text-2xl font-black text-navy">Yönetici girişi</h1>
        {!ready && (
          <p className="mt-3 text-sm leading-6 text-muted">
            Yönetici bağlantısı henüz yapılandırılmadı. Projenin Supabase
            ayarları tamamlandığında giriş açılacak.
          </p>
        )}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="field-label">
            E-posta
            <input
              disabled={!ready}
              name="email"
              type="email"
              defaultValue={config.contactEmail}
              maxLength={200}
              autoComplete="username"
              className="input mt-2"
              required
            />
          </label>
          <label className="field-label">
            Şifre
            <input
              disabled={!ready}
              name="password"
              type="password"
              maxLength={256}
              autoComplete="current-password"
              className="input mt-2"
              required
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <button className="btn btn-primary w-full" disabled={!ready || busy}>
            {busy ? "Lütfen bekle…" : "Giriş yap"}
          </button>
        </form>
      </section>
    </div>
  );
}
