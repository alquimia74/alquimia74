import "server-only";
import { config } from "@/lib/config";
export function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
export function mutationAllowed(req: Request) {
  if (req.headers.get("content-type")?.split(";")[0] !== "application/json")
    return false;
  const origin = req.headers.get("origin"),
    host = req.headers.get("host");
  if (!origin || req.headers.get("sec-fetch-site") === "cross-site")
    return false;
  if (process.env.NODE_ENV === "production") {
    try {
      return (
        origin === new URL(process.env.APP_ORIGIN || config.siteUrl).origin
      );
    } catch {
      return false;
    }
  }
  try {
    const u = new URL(origin);
    return (
      ["localhost", "127.0.0.1", "[::1]"].includes(u.hostname) &&
      u.host === host &&
      u.protocol === "http:"
    );
  } catch {
    return false;
  }
}
export async function body(req: Request, maxBytes = 32768): Promise<unknown> {
  if (Number(req.headers.get("content-length") || 0) > maxBytes)
    throw Error("body");
  const reader = req.body?.getReader();
  if (!reader) throw Error("body");
  let length = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxBytes) {
      await reader.cancel();
      throw Error("body");
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export function identity(req: Request) {
  // Trust a forwarding header only when the deployment's trusted proxy is configured.
  return process.env.TRUST_PROXY === "1"
    ? req.headers.get("x-forwarded-for")?.split(",")[0].trim().slice(0, 100) ||
        "unknown"
    : "shared";
}
