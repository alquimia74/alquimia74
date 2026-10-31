import { getAllExperiences } from "@/lib/server/experiences";
import { Suspense } from "react";
import { generateMeta } from "@/lib/seo";
import DeneyimlerClient from "./DeneyimlerClient";

export const metadata = generateMeta({
  title: "Yetiş+ Çarşı Çalışan Şikâyetleri",
  description:
    "Hızır Global A.Ş. bünyesindeki Yetiş+ Çarşı hakkında çalışan şikâyetleri ve belgeye dayalı anlatımlar.",
  path: "/deneyimler",
});

export default async function DeneyimlerPage() {
  const experiences = await getAllExperiences();
  return (
    <Suspense
      fallback={
        <div className="container-main py-20 text-center text-subtle">
          Yükleniyor…
        </div>
      }
    >
      <DeneyimlerClient experiences={experiences} />
    </Suspense>
  );
}
