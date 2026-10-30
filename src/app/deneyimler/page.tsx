import { Suspense } from "react";
import { generateMeta } from "@/lib/seo";
import DeneyimlerClient from "./DeneyimlerClient";

export const metadata = generateMeta({
  title: "Çalışan Deneyimleri ve Bildirimler",
  description:
    "Yetiş+ Çarşı, Hızır Global A.Ş. ve ilgili faaliyetlerdeki çalışan deneyimlerinin listelendiği bağımsız platform.",
  path: "/deneyimler",
});

export default function DeneyimlerPage() {
  return (
    <Suspense fallback={<div className="container-main py-20 text-center text-subtle">Yükleniyor…</div>}>
      <DeneyimlerClient />
    </Suspense>
  );
}
