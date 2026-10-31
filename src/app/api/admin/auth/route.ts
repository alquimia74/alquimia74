import { z } from "zod";
import { signIn, closeSession } from "@/lib/server/auth";
import { backendConfigured } from "@/lib/server/supabase";
import { rateLimit } from "@/lib/server/store";
import { body, json, mutationAllowed, identity } from "@/lib/server/http";
const schema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("login"),
    email: z.string().email().max(200),
    password: z.string().min(1).max(256),
  }),
  z.object({ action: z.literal("logout") }),
]);
export async function POST(req: Request) {
  if (!mutationAllowed(req))
    return json({ error: "İstek doğrulanamadı." }, 403);
  if (!backendConfigured())
    return json({ error: "Yönetici bağlantısı henüz yapılandırılmadı." }, 503);
  try {
    const input = schema.safeParse(await body(req));
    if (!input.success)
      return json({ error: "Giriş bilgilerini kontrol et." }, 400);
    if (input.data.action === "logout") {
      await closeSession();
      return json({ ok: true });
    }
    if (!(await rateLimit("login", identity(req), 10, 15 * 60 * 1000)))
      return json(
        { error: "Çok fazla deneme. Daha sonra tekrar deneyin." },
        429,
      );
    if (!(await signIn(input.data.email, input.data.password)))
      return json(
        { error: "E-posta, şifre veya yönetici yetkisi doğrulanamadı." },
        401,
      );
    return json({ ok: true });
  } catch {
    return json({ error: "Giriş hizmetine şu anda ulaşılamıyor." }, 503);
  }
}
