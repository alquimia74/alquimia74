import { notFound } from "next/navigation";
import { getExperienceBySlug } from "@/lib/server/experiences";
import { EmployerResponseForm } from "@/components/forms/EmployerResponseForm";
import { SubmissionLayout } from "@/components/forms/SubmissionLayout";
import { generateMeta } from "@/lib/seo";
import { config } from "@/lib/config";
interface Props {
  params: Promise<{ slug: string }>;
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return generateMeta({
    title: "İşveren Yanıtı",
    description: "İlgili şikâyete ilişkin işveren açıklaması.",
    path: "/isveren-yaniti/" + slug,
    noindex: true,
  });
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const exp = await getExperienceBySlug(slug);
  if (!exp) notFound();
  return (
    <SubmissionLayout
      title="İşveren yanıtı"
      backHref={"/deneyimler/" + slug}
      description={
        <>
          <span className="block font-semibold">{exp.title}</span>
          <span className="mt-2 block">
            İddialara karşı açıklamanızı somut belgelerle destekleyin. Belgesiz
            yanıt yayımlanmaz.
          </span>
        </>
      }
    >
      <EmployerResponseForm
        complaintId={exp.id}
        complaintSlug={exp.slug}
        complaintTitle={exp.title}
      />
      <p className="mt-5 text-xs leading-6 text-muted">
        İtiraz, düzeltme veya kaldırma talebinizi şikâyet bağlantısı ve
        dayanaklarıyla{" "}
        <a
          href={"mailto:" + config.contactEmail}
          className="font-bold text-brand"
        >
          {config.contactEmail}
        </a>{" "}
        adresine iletin. Somut hata ve hak ihlali bildirimleri incelenir. Resmî
        başvuru hakkınız saklıdır.
      </p>
    </SubmissionLayout>
  );
}
