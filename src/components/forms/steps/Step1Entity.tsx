import { type FormData } from "../SubmissionForm";
import { Choice, StepShell } from "./StepShell";

const ENTITIES = [
  "Yetiş+ Çarşı",
  "Hızır Global A.Ş.",
  "Yetiş+ Yemek",
  "İB-Bor",
  "YETON",
  "TOKX",
  "Diğer ilgili faaliyet",
];

interface Props {
  data: FormData;
  update: (patch: Partial<FormData>) => void;
  onNext: () => void;
}

export function Step1Entity({ data, update, onNext }: Props) {
  return (
    <StepShell
      title="Hangi kurumla ilgili?"
      description="Deneyiminle en çok ilişkilendirdiğin kurumu seç. Bu seçim, işvereninin o marka olduğu anlamına gelmez."
      onNext={onNext}
      nextDisabled={!data.entity}
    >
      <fieldset>
        <legend className="sr-only">İlgili kurumu seçin</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {ENTITIES.map((entity) => (
            <Choice
              key={entity}
              name="entity"
              value={entity}
              label={entity}
              checked={data.entity === entity}
              onChange={(v) => update({ entity: v })}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="contractualEmployer" className="field-label">
          İş sözleşmende yazan işveren unvanı <span className="field-hint">(isteğe bağlı)</span>
        </label>
        <input
          type="text"
          id="contractualEmployer"
          placeholder="Sözleşmedeki işveren adı"
          value={data.contractualEmployer}
          onChange={(e) => update({ contractualEmployer: e.target.value })}
          className="input"
        />
      </div>
    </StepShell>
  );
}
