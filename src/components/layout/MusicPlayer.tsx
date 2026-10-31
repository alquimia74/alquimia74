"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Music2,
  X,
} from "lucide-react";
import {
  defaultMusic,
  playlistSchema,
  nextTrackIndex,
  musicEmbedUrl,
} from "@/lib/playlist";
import type { MusicSettings } from "@/types/moderation";
const youtubeOrigin = "https://www.youtube-nocookie.com";
export function MusicPlayer() {
  const [music, setMusic] = useState<MusicSettings>(defaultMusic),
    [index, setIndex] = useState(0),
    [iteration, setIteration] = useState(0);
  const [expanded, setExpanded] = useState(true),
    [mounted, setMounted] = useState(false),
    [playing, setPlaying] = useState(false),
    [muted, setMuted] = useState(false),
    [failed, setFailed] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null),
    ended = useRef(false),
    needsStart = useRef(true);
  const lastConfig = useRef(JSON.stringify(defaultMusic)),
    currentId = useRef(defaultMusic.tracks[0].id);
  const track = music.tracks[index] || music.tracks[0];
  useEffect(() => {
    currentId.current = track.id;
  }, [track.id]);
  const command = useCallback(
    (func: string, args: unknown[] = []) =>
      frame.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args }),
        youtubeOrigin,
      ),
    [],
  );
  const next = useCallback(() => {
    ended.current = true;
    setIndex((previous) => nextTrackIndex(previous, music.tracks.length));
    setIteration((previous) => previous + 1);
    setMounted(true);
    setPlaying(true);
    setFailed(false);
  }, [music.tracks.length]);
  useEffect(() => {
    let active = true;
    function load() {
      fetch("/api/music", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((value) => {
          const parsed = playlistSchema.safeParse(value);
          if (
            active &&
            parsed.success &&
            JSON.stringify(parsed.data) !== lastConfig.current
          ) {
            lastConfig.current = JSON.stringify(parsed.data);
            setMusic(parsed.data);
            setIndex(
              Math.max(
                0,
                parsed.data.tracks.findIndex((t) => t.id === currentId.current),
              ),
            );
          }
        })
        .catch(() => {});
    }
    load();
    window.addEventListener("focus", load);
    return () => {
      active = false;
      window.removeEventListener("focus", load);
    };
  }, []);
  useEffect(() => {
    function receive(event: MessageEvent) {
      if (
        event.origin !== youtubeOrigin ||
        event.source !== frame.current?.contentWindow
      )
        return;
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.event === "onError") {
          setFailed(true);
          setPlaying(false);
        }
        if (data.event === "onReady") {
          command("seekTo", [track.startSeconds, true]);
          needsStart.current = false;
          command(muted ? "mute" : "unMute");
          command(playing ? "playVideo" : "pauseVideo");
        }
        if (data.event === "onStateChange") {
          if (data.info === 1) {
            if (needsStart.current) {
              command("seekTo", [track.startSeconds, true]);
              needsStart.current = false;
            }
            setPlaying(true);
          }
          if (data.info === 2) setPlaying(false);
          if (data.info === 0 && !ended.current) next();
        }
      } catch {}
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [command, muted, next, playing, track.startSeconds]);
  function toggle() {
    setFailed(false);
    if (!mounted) {
      setMounted(true);
      setPlaying(true);
      return;
    }
    command(playing ? "pauseVideo" : "playVideo");
    setPlaying(!playing);
  }
  const iconButton =
    "grid h-8 w-8 shrink-0 place-items-center rounded-full text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-accent";
  return (
    <aside
      aria-label="Müzik oynatıcı"
      className="fixed bottom-[calc(80px+env(safe-area-inset-bottom))] right-4 z-[45] max-w-[calc(100vw-32px)] lg:bottom-6 lg:right-6"
    >
      {expanded ? (
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/85 px-3 py-3 text-white shadow-2xl backdrop-blur-md sm:gap-4 sm:px-5">
          <div className="mr-1 flex min-w-0 flex-1 flex-col sm:mr-2 sm:w-[150px]">
            <span className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:text-xs">
              Now Playing{" "}
              <span className="ml-1 text-gray-500">
                {index + 1}/{music.tracks.length}
              </span>
            </span>
            <span
              className="max-w-[115px] truncate text-xs font-semibold text-gray-100 sm:max-w-[150px] sm:text-sm"
              title={track.title}
            >
              {failed ? "Oynatma kullanılamıyor" : track.title}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1 border-l border-white/20 pl-2 sm:gap-2 sm:pl-4">
            <button
              onClick={toggle}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={playing ? "Müziği duraklat" : "Müziği oynat"}
            >
              {playing ? (
                <Pause className="h-[18px] w-[18px] fill-current" />
              ) : (
                <Play className="ml-0.5 h-[18px] w-[18px] fill-current" />
              )}
            </button>
            <button
              className={iconButton}
              onClick={next}
              aria-label="Sonraki parça"
              title="Sonraki parça"
            >
              <SkipForward className="h-4 w-4" />
            </button>
            <button
              className={iconButton}
              aria-label={muted ? "Sesi aç" : "Sesi kapat"}
              aria-pressed={muted}
              onClick={() => {
                command(muted ? "unMute" : "mute");
                setMuted(!muted);
              }}
            >
              {muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="ml-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-gray-400 hover:bg-white/10 hover:text-white sm:ml-2"
            aria-label="Oynatıcıyı küçült"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/85 text-brand-light shadow-2xl backdrop-blur-md"
          aria-label="Müzik oynatıcısını aç"
        >
          <Music2 className="h-5 w-5" />
        </button>
      )}
      {mounted && (
        <iframe
          ref={frame}
          key={
            track.id +
            ":" +
            track.videoId +
            ":" +
            track.startSeconds +
            ":" +
            iteration
          }
          width="1"
          height="1"
          className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
          title="Arka plan müziği"
          aria-hidden
          tabIndex={-1}
          src={musicEmbedUrl(track, window.location.origin)}
          sandbox="allow-scripts allow-same-origin allow-presentation"
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => {
            ended.current = false;
            needsStart.current = true;
            frame.current?.contentWindow?.postMessage(
              JSON.stringify({ event: "listening", id: "site-music" }),
              youtubeOrigin,
            );
            command("addEventListener", ["onReady"]);
            command("addEventListener", ["onStateChange"]);
            command("addEventListener", ["onError"]);
            command(muted ? "mute" : "unMute");
            command(playing ? "playVideo" : "pauseVideo");
          }}
        />
      )}
    </aside>
  );
}
