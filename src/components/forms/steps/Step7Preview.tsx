import { AlertCircle, SendHorizonal } from "lucide-react";
import { type FormData } from "../SubmissionForm";
import { Avatar } from "@/components/common/Avatar";
import { StepShell } from "./StepShell";

interface Props {
  data: FormData;
  onBack: () => void;
  onSubmit: () => void;
}

const PREF_LABELS: Record<string, string> = {
  alias: "Takma adla yayımlansın",
  name_allowed: "Ad görünmesine izin veriyorum",
  editor_only: "Yalnızca editör incelemesine açık",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 border-b border-line py-2.5 last:border-0">
      <dt className="w-28 shrink-0 text-sm text-subtle sm:w-36">{label}</dt>
      <dd className="text-sm font-semibold text-ink">{value || "—"}</dd>
    </div>
  );
}

export function Step7Preview({ data, onBack, onSubmit }: Props) {
  const author = data.role || "Anonim Çalışan";

  return (
    <StepShell
      title="Önizleme"
      description="Göndermeden önce bilgilerini kontrol et."
      onBack={onBack}
      actions={
        <button type="button" onClick={onSubmit} className="btn btn-primary flex-1 sm:flex-none">
          <SendHorizonal className="h-4 w-4" />
          İncelemeye Gönder
        </button>
      }
    >
      {/* Kart önizlemesi */}
      <div className="rounded-xl border border-line p-5">
        <div className="flex items-center gap-3">
          <Avatar name={author} size={38} />
          <div>
            <p className="text-sm font-bold text-ink">{author}</p>
            <p className="text-xs text-subtle">{data.entity || "Kurum seçilmedi"}</p>
          </div>
        </div>
        <h3 className="mt-4 text-[17px] font-extrabold text-navy">{data.title || "Başlık girilmedi"}</h3>
        <p className="mt-2 line-clamp-5 whitespace-pre-line text-sm leading-6 text-muted">
          {data.narrative || "Anlatım girilmedi"}
        </p>
      </div>

      <div className="mt-5 rounded-xl bg-page p-5">
        <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-navy">Başvuru Özeti</h3>
        <dl>
          <Row label="İlgili Kurum" value={data.entity} />
          <Row label="İşveren (Sözleşme)" value={data.contractualEmployer} />
          <Row label="Çalışma Dönemi" value={`${data.employmentStart}${data.employmentEnd ? ` – ${data.employmentEnd}` : " (devam)"}`} />
          <Row label="Görev" value={data.role} />
          <Row label="Durum" value={data.employmentStatus === "former" ? "Eski Çalışan" : data.employmentStatus === "current" ? "Mevcut Çalışan" : "Diğer"} />
          <Row label="İl" value={data.city} />
          <Row label="Yayın Tercihi" value={PREF_LABELS[data.publishPreference] ?? data.publishPreference} />
          <Row label="Belgeler" value={data.files.length > 0 ? `${data.files.length} dosya seçildi` : "Belge eklenmedi"} />
        </dl>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-lg border border-accent/50 bg-accent-soft p-4 text-[#7a5200]">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-bold">Demo Modu Aktif</p>
          <p className="mt-0.5 text-xs leading-5">
            Bu platform henüz gerçek başvuru almamaktadır. Gönder butonuna bastığında hiçbir veri
            sunucuya iletilmeyecek ve kaydedilmeyecektir.
          </p>
        </div>
      </div>
    </StepShell>
  );
}
