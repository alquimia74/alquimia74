"use client";

import { useState } from "react";
import { Eye, Clock, CheckCircle, XCircle, FileText, ChevronRight, AlertTriangle } from "lucide-react";
import { mockAdminApplications, type AdminApplication, type AdminStatus } from "@/data/mock-admin";
import { Avatar } from "@/components/common/Avatar";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<AdminStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: "Bekliyor",    color: "bg-accent-soft text-[#7a5200] border-accent/50", icon: <Clock className="h-3.5 w-3.5" /> },
  reviewing: { label: "İnceleniyor", color: "bg-navy-soft text-navy border-navy/20",          icon: <Eye className="h-3.5 w-3.5" /> },
  published: { label: "Yayınlandı",  color: "bg-brand-soft text-brand-dark border-brand-line", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  rejected:  { label: "Reddedildi",  color: "bg-red-50 text-red-700 border-red-200",          icon: <XCircle className="h-3.5 w-3.5" /> },
};

export default function AdminDemoPage() {
  const [applications, setApplications] = useState(mockAdminApplications);
  const [selected, setSelected] = useState<AdminApplication | null>(null);
  const [activeTab, setActiveTab] = useState<AdminStatus | "all">("all");

  const filtered = activeTab === "all" ? applications : applications.filter((a) => a.status === activeTab);

  const changeStatus = (id: string, newStatus: AdminStatus) => {
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus } : a));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status: newStatus } : null);
  };

  const counts: Record<AdminStatus | "all", number> = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    published: applications.filter((a) => a.status === "published").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const tabs: { value: AdminStatus | "all"; label: string }[] = [
    { value: "all", label: "Tümü" },
    { value: "pending", label: "Bekleyen" },
    { value: "reviewing", label: "İncelenen" },
    { value: "published", label: "Yayınlanan" },
    { value: "rejected", label: "Reddedilen" },
  ];

  return (
    <div className="container-main mt-6">
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-accent/50 bg-accent-soft p-4 text-[#7a5200]">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-extrabold">DEMO MODERASYON PANELİ</p>
          <p className="mt-1 text-xs leading-5">
            Bu sayfa gerçek bir admin paneli değildir. Tüm veriler demo/temsilidir. Yapılan değişiklikler
            gerçek kayıtlara yansımaz ve sayfa yenilendiğinde sıfırlanır. Gerçek admin kimlik doğrulaması
            veya güvenlik altyapısı içermez.
          </p>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-black text-navy">Moderasyon Paneli</h1>
        <span className="demo-badge">DEMO</span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {(["pending", "reviewing", "published", "rejected"] as AdminStatus[]).map((s) => (
          <div key={s} className="card flex items-center gap-4 p-4">
            <span className={cn("grid h-10 w-10 place-items-center rounded-full border", STATUS_CONFIG[s].color)}>
              {STATUS_CONFIG[s].icon}
            </span>
            <div>
              <p className="text-2xl font-black text-navy">{counts[s]}</p>
              <p className="text-xs text-subtle">{tabs.find((t) => t.value === s)?.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                data-active={activeTab === tab.value}
                className="chip"
              >
                {tab.label} ({counts[tab.value]})
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((app) => {
              const sc = STATUS_CONFIG[app.status];
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => setSelected(app)}
                  className={cn(
                    "card w-full p-4 text-left transition-colors",
                    selected?.id === app.id ? "!border-brand bg-brand-soft" : "hover:border-brand-line"
                  )}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-sm font-bold leading-snug text-navy">{app.title}</p>
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-subtle" />
                  </div>
                  <p className="mb-2 text-xs text-subtle">{app.relatedEntity}</p>
                  <div className="flex items-center gap-2">
                    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold", sc.color)}>
                      {sc.icon} {sc.label}
                    </span>
                    {app.hasDocuments && (
                      <span className="inline-flex items-center gap-1 text-xs text-subtle">
                        <FileText className="h-3 w-3" /> Belge
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-subtle">Bu durumda başvuru yok</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="card">
              <div className="flex items-start gap-3 border-b border-line p-5">
                <Avatar name={selected.displayName} size={40} />
                <div className="min-w-0 flex-1">
                  <h2 className="font-extrabold text-navy">{selected.title}</h2>
                  <p className="text-sm text-subtle">{selected.relatedEntity} · {selected.displayName}</p>
                </div>
                <span className={cn("inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold", STATUS_CONFIG[selected.status].color)}>
                  {STATUS_CONFIG[selected.status].icon}
                  {STATUS_CONFIG[selected.status].label}
                </span>
              </div>

              <div className="p-5">
                <p className="rounded-lg bg-page p-4 text-sm leading-6 text-muted">{selected.summary}</p>

                {selected.reviewNote && (
                  <p className="mt-4 rounded-lg border border-brand-line bg-brand-soft p-3 text-xs text-brand-dark">
                    <strong>İnceleme Notu:</strong> {selected.reviewNote}
                  </p>
                )}

                <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-wider text-subtle">Durum Değiştir</p>
                <div className="flex flex-wrap gap-2">
                  {(["pending", "reviewing", "published", "rejected"] as AdminStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => changeStatus(selected.id, s)}
                      disabled={selected.status === s}
                      className={cn(
                        "rounded-full border px-4 py-2 text-xs font-bold transition-opacity disabled:cursor-not-allowed disabled:opacity-40",
                        STATUS_CONFIG[s].color
                      )}
                    >
                      {STATUS_CONFIG[s].label} Olarak İşaretle
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <FileText className="mx-auto mb-3 h-10 w-10 text-line" />
              <p className="text-sm text-subtle">İncelemek için sol listeden bir başvuru seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
