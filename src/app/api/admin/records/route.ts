import { z } from "zod";
import { authenticated } from "@/lib/server/auth";
import {
  listRecords,
  getRecord,
  saveRecord,
  musicSettings,
} from "@/lib/server/store";
import { body, json, mutationAllowed } from "@/lib/server/http";
import { workerSubmissionSchema, employerReplySchema } from "@/lib/validations";
import { safeExternalLink } from "@/lib/music";
import { revalidatePath } from "next/cache";
const note = z
  .object({
    id: z.string().min(1).max(100),
    text: z.string().trim().max(3000),
    url: z.string().trim().max(2000),
    public: z.boolean(),
  })
  .refine((n) => !!n.text || !!n.url)
  .refine((n) => !n.url || !!safeExternalLink(n.url));
const update = z.object({
  id: z.string().uuid(),
  version: z.number().int().min(1),
  title: z.string().trim().min(10).max(120),
  narrative: z.string().trim().max(5000),
  city: z.string().optional(),
  staffType: z.enum(["affiliate", "headquarters"]).optional(),
  period: z.string().max(100).optional(),
  name: z.string().max(120).optional(),
  role: z.string().max(120).optional(),
  status: z.enum(["pending", "published", "rejected"]),
  evidenceReviewed: z.boolean(),
  adminNotes: z.array(note).max(20),
});
export async function GET() {
  if (!(await authenticated()))
    return json({ error: "Yönetici oturumu gerekli." }, 401);
  try {
    const [records, music] = await Promise.all([
      listRecords(),
      musicSettings(),
    ]);
    return json({ records, music });
  } catch {
    return json({ error: "Yönetim kayıtları yüklenemedi." }, 503);
  }
}
export async function PATCH(req: Request) {
  if (!mutationAllowed(req))
    return json({ error: "İstek doğrulanamadı." }, 403);
  if (!(await authenticated()))
    return json({ error: "Yönetici oturumu gerekli." }, 401);
  try {
    const input = update.parse(await body(req, 524288)),
      old = await getRecord(input.id);
    if (!old) return json({ error: "Kayıt bulunamadı." }, 404);
    if (old.kind === "complaint") workerSubmissionSchema.parse(input);
    else
      employerReplySchema.parse({
        name: input.name,
        role: input.role,
        reply: input.narrative,
      });
    if (
      input.status === "published" &&
      !input.evidenceReviewed &&
      !old.isExample
    )
      return json(
        { error: "Belgeleri inceleyip doğrulamadan yayımlayamazsın." },
        400,
      );
    if (input.status === "published" && old.kind === "reply") {
      const parent = old.parentId && (await getRecord(old.parentId));
      if (!parent || parent.status !== "published")
        return json({ error: "İlgili şikâyet yayında değil." }, 400);
    }
    const next = { ...old, ...input };
    const saved = await saveRecord(next, input.version);
    if (!saved)
      return json(
        {
          error:
            "Bu kayıt başka bir sekmede değişti. Listeyi yenileyip tekrar aç.",
        },
        409,
      );
    revalidatePath("/", "layout");
    return json({ record: saved });
  } catch {
    return json(
      {
        error:
          "Alanları ve belge bağlantılarını kontrol et. Bağlantılar https:// ile başlamalı.",
      },
      400,
    );
  }
}
