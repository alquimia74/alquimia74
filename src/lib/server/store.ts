import "server-only";
import { createHmac } from "node:crypto";
import {
  publicSupabase,
  sessionSupabase,
  submissionSupabase,
  supabaseConfigured,
} from "./supabase";
import { defaultMusic, playlistSchema } from "@/lib/playlist";
import type { ModerationRecord, MusicSettings } from "@/types/moderation";
import type { WorkerDraft, ReplyDraft } from "@/types/submission";

export async function listRecords(): Promise<ModerationRecord[]> {
  const client = await sessionSupabase();
  const { data, error } = await client.rpc("ys_admin_list_records");
  if (error) throw error;
  return (data || []) as ModerationRecord[];
}
export async function getRecord(
  id: string,
): Promise<ModerationRecord | undefined> {
  const client = await sessionSupabase();
  const { data, error } = await client.rpc("ys_admin_get_record", { p_id: id });
  if (error) throw error;
  return data ? (data as ModerationRecord) : undefined;
}
export async function publishedRecords(
  slug?: string,
): Promise<ModerationRecord[]> {
  const { data, error } = await publicSupabase().rpc("ys_read_published", {
    p_slug: slug || null,
  });
  if (error) throw error;
  return (data || []) as ModerationRecord[];
}
export async function submitWorker(input: WorkerDraft) {
  const { data, error } = await submissionSupabase().rpc("ys_submit_content", {
    p_kind: "complaint",
    p_payload: input,
    p_parent_id: null,
  });
  if (error) throw error;
  return data as string;
}
export async function submitReply(parentId: string, input: ReplyDraft) {
  const { data, error } = await submissionSupabase().rpc("ys_submit_content", {
    p_kind: "reply",
    p_payload: input,
    p_parent_id: parentId,
  });
  if (error) throw error;
  return data as string;
}
export async function saveRecord(
  next: ModerationRecord,
  expectedVersion: number,
): Promise<ModerationRecord | null> {
  const client = await sessionSupabase();
  const { data, error } = await client.rpc("ys_admin_save_record", {
    p_id: next.id,
    p_expected_version: expectedVersion,
    p_changes: next,
  });
  if (error?.code === "40001") return null;
  if (error) throw error;
  return data as ModerationRecord;
}
export async function musicSettings(): Promise<MusicSettings> {
  if (!supabaseConfigured()) return defaultMusic;
  const { data, error } = await publicSupabase().rpc("ys_read_playlist");
  if (error) throw error;
  return playlistSchema.parse(data);
}
export async function saveMusic(value: MusicSettings) {
  const client = await sessionSupabase();
  const { error } = await client.rpc("ys_admin_save_playlist", {
    p_tracks: value.tracks,
  });
  if (error) throw error;
}
export async function rateLimit(
  scope: string,
  identity: string,
  max: number,
  milliseconds: number,
) {
  const secret = process.env.RATE_LIMIT_SALT || process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw Error("SUPABASE_NOT_CONFIGURED");
  const hash = createHmac("sha256", secret)
    .update(scope + ":" + identity)
    .digest("hex");
  const { data, error } = await submissionSupabase().rpc("ys_take_rate_limit", {
    p_key: hash,
    p_limit: max,
    p_window_seconds: Math.ceil(milliseconds / 1000),
  });
  if (error) throw error;
  return data === true;
}
