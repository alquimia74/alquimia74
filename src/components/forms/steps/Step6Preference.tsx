import { type FormData } from "../SubmissionForm";
import { Choice, StepShell } from "./StepShell";

const OPTIONS = [
  {
    value: "alias",
    label: "Takma adımla yayımlansın",
    description: "Anlatımınız bir takma ad veya 'Anonim' ibaresiyle yayımlanır.",
  },
  {
    value: "name_allowed",
    label: "Adımın görünmesine izin veriyorum",
    description: "Adınızı açıklamanızı talep edebiliriz; onayınız olmadan yayımlanmaz.",
  },
  {
    value: "editor_only",
    label: "Şimdilik yalnızca editör incelemesine açık kalsın",
    description: "Başvurunuz incelemeye alınır, henüz kamuya açılmaz.",
  },
];

interface Props {
  data: FormData;
  update: (patch: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step6Preference({ data, update, onNext, onBack }: Props) {
  return (
    <StepShell
      title="Nasıl yayımlansın?"
      description="Anlatımının nasıl yayımlanmasını istediğini seç. Bu tercih ileride değiştirilebilir."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!data.publishPreference}
      nextLabel="Önizlemeye Geç"
    >
      <fieldset className="space-y-3">
        <legend className="sr-only">Yayın tercihi seçin</legend>
        {OPTIONS.map((opt) => (
          <Choice
            key={opt.value}
            name="publishPreference"
            value={opt.value}
            label={opt.label}
            description={opt.description}
            checked={data.publishPreference === opt.value}
            onChange={(v) => update({ publishPreference: v })}
          />
        ))}
      </fieldset>
    </StepShell>
  );
}
