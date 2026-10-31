import { generateMeta } from "@/lib/seo";
import { SubmissionForm } from "@/components/forms/SubmissionForm";
import { SubmissionLayout } from "@/components/forms/SubmissionLayout";
export const metadata = generateMeta({
  title: "Yetiş+ Çarşı Şikâyet Başvurusu",
  description:
    "Yaşadığını anlat. Belgelerini şikâyet başlığıyla e-postadan ilet.",
  path: "/deneyimini-paylas",
  noindex: true,
});
export default function Page() {
  return (
    <SubmissionLayout
      title="Şikâyetini yaz"
      description="Yaşadığını anlat. Belgelerini şikâyet başlığını belirterek e-postayla gönder."
    >
      <SubmissionForm />
    </SubmissionLayout>
  );
}
