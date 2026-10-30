import { Lightbulb } from "lucide-react";
import { type FormData } from "../SubmissionForm";
import { Notice, StepShell } from "./StepShell";

interface Props {
  data: FormData;
  update: (patch: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step4Narrative({ data, update, onNext, onBack }: Props) {
  const titleLen = data.title.length;
  const narrativeLen = data.narrative.length;
  const isValid = titleLen >= 10 && narrativeLen >= 100;

  return (
    <StepShell
      title="Deneyimini anlat"
      description={
        <>
          Lütfen yalnızca <strong className="text-ink">bizzat yaşadığın</strong> olayları aktar.
          Üçüncü şahıs bilgileri, tahminler veya genel iddialar yayın ilkelerimizle bağdaşmaz.
        </>
      }
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!isValid}
    >
      <Notice>
        <span className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 shrink-0" />
          Tarihler, tutarlar ve yazışmalar gibi somut ayrıntılar anlatımını güçlendirir.
        </span>
      </Notice>

      <div className="mt-5 space-y-5">
        <div>
          <label htmlFor="exp-title" className="field-label">
            Başlık <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="exp-title"
            placeholder="Deneyimini özetleyen kısa bir başlık (10–120 karakter)"
            value={data.title}
            onChange={(e) => update({ title: e.target.value })}
            maxLength={120}
            className="input"
          />
          <p className="mt-1 text-right text-xs text-subtle">{titleLen} / 120</p>
        </div>

        <div>
          <label htmlFor="narrative" className="field-label">
            Ayrıntılı anlatım <span className="text-red-500">*</span>
          </label>
          <textarea
            id="narrative"
            placeholder="Ne yaşandı, ne zaman, nasıl bir süreç izledi?"
            value={data.narrative}
            onChange={(e) => update({ narrative: e.target.value })}
            rows={9}
            maxLength={5000}
            className="input"
          />
          <div className="mt-1 flex justify-between">
            {narrativeLen < 100 && <p className="text-xs text-red-500">En az 100 karakter gerekli</p>}
            <p className="ml-auto text-xs text-subtle">{narrativeLen} / 5000</p>
          </div>
        </div>

        <div>
          <label htmlFor="approximateDates" className="field-label">
            Olayların yaklaşık tarihleri <span className="field-hint">(isteğe bağlı)</span>
          </label>
          <input
            type="text"
            id="approximateDates"
            placeholder="Örn: Mart – Haziran 2024 arası"
            value={data.approximateDates}
            onChange={(e) => update({ approximateDates: e.target.value })}
            className="input"
          />
        </div>
      </div>
    </StepShell>
  );
}
