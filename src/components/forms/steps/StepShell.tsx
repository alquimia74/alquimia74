import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepShellProps {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  /** Son adımdaki gibi özel buton gerektiğinde */
  actions?: React.ReactNode;
}

export function StepShell({
  title,
  description,
  children,
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Devam Et",
  actions,
}: StepShellProps) {
  return (
    <div>
      <h2 className="text-xl font-black text-navy">{title}</h2>
      {description && <div className="mt-1.5 text-sm leading-6 text-muted">{description}</div>}

      <div className="mt-6">{children}</div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
        {onBack ? (
          <button type="button" onClick={onBack} className="btn btn-secondary">
            <ArrowLeft className="h-4 w-4" /> Geri
          </button>
        ) : <span className="hidden sm:block" />}
        {actions ?? (onNext && (
          <button type="button" onClick={onNext} disabled={nextDisabled} className="btn btn-primary flex-1 sm:flex-none">
            {nextLabel} <ArrowRight className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function Choice({
  checked,
  name,
  value,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  name: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="choice" data-checked={checked}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
      <span className="choice-dot" aria-hidden />
      <span>
        <span className={`block text-sm font-bold ${checked ? "text-brand-dark" : "text-ink"}`}>{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-5 text-muted">{description}</span>}
      </span>
    </label>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn"; children: React.ReactNode }) {
  return (
    <div
      className={
        tone === "warn"
          ? "rounded-lg border border-accent/50 bg-accent-soft p-3 text-xs leading-5 text-[#7a5200]"
          : "rounded-lg border border-brand-line bg-brand-soft p-3 text-xs leading-5 text-brand-dark"
      }
    >
      {children}
    </div>
  );
}
