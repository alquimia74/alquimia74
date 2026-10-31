import { LockKeyhole } from "lucide-react";
export function AdminLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-5">
      <section className="card w-full max-w-sm p-7">
        <div className="mb-5 grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <p className="text-xs font-bold text-subtle">yetişikayet.com</p>
        <h1 className="mt-2 text-2xl font-black text-navy">Yönetici girişi</h1>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-navy">
            E-posta
            <input
              type="email"
              className="input mt-2"
              autoComplete="username"
              disabled
            />
          </label>
          <label className="block text-sm font-bold text-navy">
            Şifre
            <input
              type="password"
              className="input mt-2"
              autoComplete="current-password"
              disabled
            />
          </label>
          <button type="button" className="btn btn-primary w-full" disabled>
            Giriş yap
          </button>
          <p className="text-xs leading-6 text-subtle">
            Giriş sistemi henüz etkin değil. Bu ekran yönetim verisi göstermez
            veya kullanıcı bilgisi toplamaz.
          </p>
        </div>
      </section>
    </div>
  );
}
