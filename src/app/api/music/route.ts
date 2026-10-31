import { connection } from "next/server";
import { musicSettings } from "@/lib/server/store";
import { json } from "@/lib/server/http";
export async function GET() {
  await connection();
  try {
    return json(await musicSettings());
  } catch {
    return json({ error: "Çalma listesi yüklenemedi." }, 503);
  }
}
