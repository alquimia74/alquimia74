import { authenticated } from "@/lib/server/auth";
import { saveMusic } from "@/lib/server/store";
import { body, json, mutationAllowed } from "@/lib/server/http";
import { playlistInputSchema } from "@/lib/playlist";
export async function PATCH(req: Request) {
  if (!mutationAllowed(req))
    return json({ error: "İstek doğrulanamadı." }, 403);
  if (!(await authenticated()))
    return json({ error: "Yönetici oturumu gerekli." }, 401);
  try {
    const result = playlistInputSchema.safeParse(await body(req, 131072));
    if (!result.success)
      return json(
        {
          error:
            "Parça adlarını, YouTube bağlantılarını ve başlangıç saniyelerini kontrol et.",
        },
        400,
      );
    await saveMusic(result.data);
    return json({ music: result.data });
  } catch {
    return json({ error: "Çalma listesi kaydedilemedi. Tekrar dene." }, 503);
  }
}
