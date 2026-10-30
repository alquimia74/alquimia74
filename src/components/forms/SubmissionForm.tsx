"use client";

import { useRef, useState } from "react";
import { AlertCircle, Check } from "lucide-react";
import { Step1Entity } from "./steps/Step1Entity";
import { Step3Employment } from "./steps/Step3Employment";
import { Step4Narrative } from "./steps/Step4Narrative";
import { Step5Documents } from "./steps/Step5Documents";
import { Step6Preference } from "./steps/Step6Preference";
import { Step7Preview } from "./steps/Step7Preview";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Kurum" },
  { id: 2, label: "Çalışma Bilgileri" },
  { id: 3, label: "Anlatım" },
  { id: 4, label: "Belgeler" },
  { id: 5, label: "Yayın Tercihi" },
  { id: 6, label: "Önizleme" },
];

export interface FormData {
  entity: string;
  contractualEmployer: string;
  employmentStart: string;
  employmentEnd: string;
  role: string;
  employmentStatus: string;
  city: string;
  title: string;
  narrative: string;
  approximateDates: string;
  files: File[];
  publishPreference: string;
}

const INITIAL_DATA: FormData = {
  entity: "",
  contractualEmployer: "",
  employmentStart: "",
  employmentEnd: "",
  role: "",
  employmentStatus: "",
  city: "",
  title: "",
  narrative: "",
  approximateDates: "",
  files: [],
  publishPreference: "",
};

export function SubmissionForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [submitted, setSubmitted] = useState(false);

  const updateData = (patch: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const topRef = useRef<HTMLDivElement>(null);
  // Adım değişince formun başına kaydır (mobilde butonlar sayfanın altında kalıyor)
  const scrollTop = () => {
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = () => { setStep((s) => Math.min(s + 1, 6)); scrollTop(); };
  const back = () => { setStep((s) => Math.max(s - 1, 1)); scrollTop(); };

  const handleSubmit = () => {
    // Demo modu: hiçbir şey sunucuya gönderilmez
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card px-6 py-14 text-center">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-accent-soft">
          <AlertCircle className="h-8 w-8 text-[#7a5200]" />
        </div>
        <span className="demo-badge">DEMO MODU</span>
        <h2 className="mt-4 text-2xl font-black text-navy">Başvurunuz Sunucuya Gönderilmedi</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          Site henüz demo aşamasında olduğundan başvurunuz herhangi bir sunucuya iletilmedi ve
          kaydedilmedi. Gerçek başvuru sistemi aktif olduğunda bu ekran başarı mesajı gösterecektir.
        </p>
        <p className="mx-auto mt-5 max-w-md rounded-lg bg-page p-4 text-left text-xs leading-5 text-muted">
          <strong className="text-ink">Demo modu:</strong> Kişisel verileriniz tarayıcı dışında hiçbir yere iletilmedi.
        </p>
        <button
          type="button"
          onClick={() => { setSubmitted(false); setStep(1); setFormData(INITIAL_DATA); }}
          className="btn btn-primary mt-6"
        >
          Formu Yenile
        </button>
      </div>
    );
  }

  const current = STEPS[step - 1];

  return (
    <div ref={topRef} className="card scroll-mt-20 overflow-hidden md:scroll-mt-32">
      {/* İlerleme */}
      <nav aria-label="Form adımları" className="border-b border-line px-4 pb-4 pt-4 sm:px-6 sm:pt-5">
        <div className="flex items-center justify-between text-sm">
          <p className="font-extrabold text-navy">{current.label}</p>
          <p className="font-semibold text-subtle">
            Adım <span className="text-brand">{step}</span> / {STEPS.length}
          </p>
        </div>
        <ol className="mt-3 flex gap-1.5">
          {STEPS.map((s) => (
            <li
              key={s.id}
              aria-current={step === s.id ? "step" : undefined}
              title={s.label}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                step >= s.id ? "bg-brand" : "bg-line"
              )}
            >
              <span className="sr-only">
                {s.label} {step > s.id ? "(tamamlandı)" : ""}
              </span>
            </li>
          ))}
        </ol>
        <ol className="mt-3 hidden justify-between md:flex">
          {STEPS.map((s) => (
            <li
              key={s.id}
              className={cn(
                "flex items-center gap-1 text-[11px] font-semibold",
                step === s.id ? "text-brand" : step > s.id ? "text-ink" : "text-subtle"
              )}
            >
              {step > s.id && <Check className="h-3 w-3 text-brand" />}
              {s.label}
            </li>
          ))}
        </ol>
      </nav>

      <div className="p-4 sm:p-6 md:p-8">
        {step === 1 && <Step1Entity data={formData} update={updateData} onNext={next} />}
        {step === 2 && <Step3Employment data={formData} update={updateData} onNext={next} onBack={back} />}
        {step === 3 && <Step4Narrative data={formData} update={updateData} onNext={next} onBack={back} />}
        {step === 4 && <Step5Documents data={formData} update={updateData} onNext={next} onBack={back} />}
        {step === 5 && <Step6Preference data={formData} update={updateData} onNext={next} onBack={back} />}
        {step === 6 && <Step7Preview data={formData} onBack={back} onSubmit={handleSubmit} />}
      </div>
    </div>
  );
}
