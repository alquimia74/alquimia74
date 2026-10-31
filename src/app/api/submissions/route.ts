import { z } from "zod";
import { workerSubmissionSchema, employerReplySchema } from "@/lib/validations";
import { submitWorker, submitReply, rateLimit } from "@/lib/server/store";
import { backendConfigured } from "@/lib/server/supabase";
import { body, json, mutationAllowed, identity } from "@/lib/server/http";
const requestSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("complaint"), data: workerSubmissionSchema }),
  z.object({
    kind: z.literal("reply"),
    parentId: z.string().uuid(),
    data: employerReplySchema,
  }),
]);
export async function POST(req: Request) {
  if (!mutationAllowed(req))
    return json({ error: "Başvuru kaynağı doğrulanamadı." }, 403);
  if (!backendConfigured())
    return json(
      {
        error:
          "Çevrimiçi başvurular henüz açılmadı. Belgelerin için iletişim adresimizi kullanabilirsin.",
      },
      503,
    );
  try {
    const parsed = requestSchema.safeParse(await body(req));
    if (!parsed.success)
      return json({ error: "Başvuru alanlarını kontrol edin." }, 400);
    if (!(await rateLimit("submission", identity(req), 20, 60 * 60 * 1000)))
      return json(
        { error: "Çok sayıda başvuru alındı. Daha sonra tekrar deneyin." },
        429,
      );
    const input = parsed.data;
    const id =
      input.kind === "complaint"
        ? await submitWorker(input.data)
        : await submitReply(input.parentId, input.data);
    return json({ id }, 201);
  } catch {
    return json(
      { error: "Başvuru kaydedilemedi. Lütfen tekrar deneyin." },
      503,
    );
  }
}
