import "server-only";
import { connection } from "next/server";
import { sessionSupabase, supabaseConfigured } from "./supabase";

export async function authenticated() {
  await connection();
  if (!supabaseConfigured()) return false;
  const client = await sessionSupabase();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) return false;
  const { data, error: roleError } = await client.rpc("ys_is_moderator");
  return !roleError && data === true;
}
export async function signIn(email: string, password: string) {
  const client = await sessionSupabase();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) return false;
  const { data, error: roleError } = await client.rpc("ys_is_moderator");
  if (roleError || data !== true) {
    await client.auth.signOut({ scope: "local" });
    return false;
  }
  return true;
}
export async function closeSession() {
  const client = await sessionSupabase();
  const { error } = await client.auth.signOut({ scope: "local" });
  if (error) throw error;
}
