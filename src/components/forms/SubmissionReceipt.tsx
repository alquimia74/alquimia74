import { CheckCircle2 } from "lucide-react";
import { config } from "@/lib/config";
export function SubmissionReceipt({
  title,
  id,
  kind,
}: {
  title: string;
  id: string;
  kind: "complaint" | "reply";
}) {
  return (
    <section
      className="card submission-preview space-y-4 p-5 sm:p-7"
      role="status"
    >
      <CheckCircle2 className="h-9 w-9 text-brand" />
      <h2 className="text-lg font-extrabold text-navy">
        {kind === "complaint"
          ? "Şikâyetin incelemeye alındı"
          : "Yanıtınız incelemeye alındı"}
      </h2>
      <p className="text-sm leading-7 text-muted">
        Belgelerini <strong>{title}</strong> başlığıyla{" "}
        <a
          className="font-bold text-brand"
          href={
            "mailto:" +
            config.contactEmail +
            "?subject=" +
            encodeURIComponent(title + " — " + id)
          }
        >
          {config.contactEmail}
        </a>{" "}
        adresine gönder. İçerik, belgeler incelenip onaylandıktan sonra
        yayımlanır.
      </p>
      <p className="text-xs text-subtle">Başvuru numarası: {id}</p>
    </section>
  );
}
