import { AdminAccess } from "@/components/admin/AdminAccess";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { authenticated } from "@/lib/server/auth";
import { backendConfigured } from "@/lib/server/supabase";
import { listRecords, musicSettings } from "@/lib/server/store";
import { generateMeta } from "@/lib/seo";
export const metadata = generateMeta({
  title: "Yayın yönetimi",
  description: "Yönetici oturumu.",
  path: "/admin",
  noindex: true,
});
export default async function Page() {
  if (!(await authenticated()))
    return <AdminAccess ready={backendConfigured()} />;
  const [records, music] = await Promise.all([listRecords(), musicSettings()]);
  return <AdminPanel initialRecords={records} initialMusic={music} />;
}
