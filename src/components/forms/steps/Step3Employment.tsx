import { type FormData } from "../SubmissionForm";
import { Choice, StepShell } from "./StepShell";

interface Props {
  data: FormData;
  update: (patch: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const STATUSES = [
  { value: "former", label: "Eski Çalışan" },
  { value: "current", label: "Mevcut Çalışan" },
  { value: "other", label: "Diğer" },
];

export function Step3Employment({ data, update, onNext, onBack }: Props) {
  const isValid = !!data.employmentStart && !!data.employmentStatus;

  return (
    <StepShell
      title="Çalışma bilgilerin"
      description="Bu bilgiler deneyiminin bağlamını anlamak için kullanılır."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!isValid}
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="employmentStart" className="field-label">
              Çalışma başlangıcı <span className="text-red-500">*</span>
            </label>
            <input
              type="month"
              id="employmentStart"
              value={data.employmentStart}
              onChange={(e) => update({ employmentStart: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="employmentEnd" className="field-label">
              Bitiş <span className="field-hint">(devam ediyorsa boş bırak)</span>
            </label>
            <input
              type="month"
              id="employmentEnd"
              value={data.employmentEnd}
              onChange={(e) => update({ employmentEnd: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <div>
          <p className="field-label">
            Çalışma durumu <span className="text-red-500">*</span>
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {STATUSES.map((opt) => (
              <Choice
                key={opt.value}
                name="employmentStatus"
                value={opt.value}
                label={opt.label}
                checked={data.employmentStatus === opt.value}
                onChange={(v) => update({ employmentStatus: v })}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="role" className="field-label">
              Görev / Departman <span className="field-hint">(isteğe bağlı)</span>
            </label>
            <input
              type="text"
              id="role"
              placeholder="Örn: Kasiyer, Depo Görevlisi, Kurye..."
              value={data.role}
              onChange={(e) => update({ role: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="city" className="field-label">
              Çalışılan il <span className="field-hint">(isteğe bağlı)</span>
            </label>
            <input
              type="text"
              id="city"
              placeholder="Örn: İstanbul, Ankara, İzmir..."
              value={data.city}
              onChange={(e) => update({ city: e.target.value })}
              className="input"
            />
          </div>
        </div>
      </div>
    </StepShell>
  );
}
