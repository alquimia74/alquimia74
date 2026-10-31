import { z } from "zod";
import { config } from "./config";
import { youtubeVideoId } from "./music";
import type { MusicSettings, MusicTrack } from "@/types/moderation";

export const defaultMusic: MusicSettings = {
  tracks: [
    {
      id: "00000000-0000-4000-8000-000000000001",
      videoId: config.musicVideoId,
      title: "Çalışma müziği",
      startSeconds: 0,
    },
  ],
};
export const trackSchema = z.object({
  id: z.string().uuid(),
  videoId: z.string().regex(/^[\w-]{11}$/),
  title: z.string().trim().min(1).max(100),
  startSeconds: z.number().int().min(0).max(86400),
});
export const playlistSchema = z
  .object({ tracks: z.array(trackSchema).min(1).max(30) })
  .refine(
    (value) =>
      new Set(value.tracks.map((t) => t.id)).size === value.tracks.length,
    "Parça kimlikleri farklı olmalı.",
  );
export const playlistInputSchema = z
  .object({
    tracks: z
      .array(
        z.object({
          id: z.string().uuid(),
          url: z.string().max(2048),
          title: z.string().trim().min(1).max(100),
          startSeconds: z.number().int().min(0).max(86400),
        }),
      )
      .min(1)
      .max(30),
  })
  .transform((value, context) => {
    const tracks: MusicTrack[] = [];
    for (const track of value.tracks) {
      const id = youtubeVideoId(track.url);
      if (!id) {
        context.addIssue({
          code: "custom",
          message: "Geçerli bir YouTube bağlantısı gir.",
        });
        return z.NEVER;
      }
      tracks.push({
        id: track.id,
        videoId: id,
        title: track.title,
        startSeconds: track.startSeconds,
      });
    }
    return { tracks };
  })
  .pipe(playlistSchema);

export function nextTrackIndex(current: number, total: number) {
  return total > 0 ? (current + 1) % total : 0;
}
export function musicEmbedUrl(
  track: MusicTrack,
  origin: string,
  autoplay = true,
) {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    playsinline: "1",
    enablejsapi: "1",
    rel: "0",
    start: String(track.startSeconds),
    origin,
  });
  return (
    "https://www.youtube-nocookie.com/embed/" + track.videoId + "?" + params
  );
}
