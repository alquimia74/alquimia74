const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { createRequire } = require("node:module");
const project = path.resolve(__dirname, ".."),
  req = createRequire(path.join(project, "package.json")),
  ts = req("typescript"),
  cache = new Map();
function load(relative) {
  const file = path.resolve(project, relative);
  if (cache.has(file)) return cache.get(file).exports;
  const m = { exports: {} };
  cache.set(file, m);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  new Function("exports", "require", "module", code)(
    m.exports,
    (name) => {
      if (name === "server-only") return {};
      if (name.startsWith("@/")) return load("src/" + name.slice(2) + ".ts");
      if (name.startsWith("."))
        return load(
          path.relative(
            project,
            path.resolve(path.dirname(file), name + ".ts"),
          ),
        );
      return req(name);
    },
    m,
  );
  return m.exports;
}
test("playlist preserves order, supports repeated videos and validates each start second", () => {
  const { playlistInputSchema, playlistSchema, nextTrackIndex, musicEmbedUrl } =
    load("src/lib/playlist.ts");
  const first = {
    id: "00000000-0000-4000-8000-000000000001",
    url: "https://www.youtube.com/watch?v=5ftitAfWgWI&list=RD5ftitAfWgWI",
    title: "Birinci",
    startSeconds: 45,
  };
  const second = {
    ...first,
    id: "00000000-0000-4000-8000-000000000002",
    title: "İkinci",
    startSeconds: 120,
  };
  const parsed = playlistInputSchema.parse({ tracks: [first, second] });
  assert.equal(parsed.tracks[0].startSeconds, 45);
  assert.equal(parsed.tracks[1].startSeconds, 120);
  assert.equal(parsed.tracks[0].videoId, "5ftitAfWgWI");
  assert(playlistSchema.safeParse(parsed).success);
  for (const startSeconds of [-1, 0.5, 86401, NaN])
    assert(
      !playlistInputSchema.safeParse({ tracks: [{ ...first, startSeconds }] })
        .success,
    );
  assert(!playlistInputSchema.safeParse({ tracks: [] }).success);
  assert(!playlistInputSchema.safeParse({ tracks: [first, first] }).success);
  assert(
    !playlistInputSchema.safeParse({
      tracks: [{ ...first, url: "https://evil.test/watch?v=5ftitAfWgWI" }],
    }).success,
  );
  assert.equal(nextTrackIndex(0, 3), 1);
  assert.equal(nextTrackIndex(2, 3), 0);
  assert.equal(nextTrackIndex(0, 1), 0);
  const url = new URL(musicEmbedUrl(parsed.tracks[1], "https://example.com"));
  assert.equal(url.searchParams.get("start"), "120");
  assert.equal(url.searchParams.get("origin"), "https://example.com");
  assert.equal(url.hostname, "www.youtube-nocookie.com");
});
test("deployed data access has no filesystem store or public admin setup path", () => {
  const store = fs.readFileSync(
    path.join(project, "src/lib/server/store.ts"),
    "utf8",
  );
  const auth = fs.readFileSync(
    path.join(project, "src/lib/server/auth.ts"),
    "utf8",
  );
  const route = fs.readFileSync(
    path.join(project, "src/app/api/admin/auth/route.ts"),
    "utf8",
  );
  for (const source of [store, auth]) {
    assert(!source.includes("node:sqlite"));
    assert(!source.includes("node:fs"));
    assert(!source.includes("scryptSync"));
  }
  assert(store.includes("ys_admin_save_record"));
  assert(store.includes("submissionSupabase"));
  assert(auth.includes(".auth.getUser()"));
  assert(auth.includes("ys_is_moderator"));
  assert(!route.includes('"setup"'));
  assert(!route.includes("createAdmin"));
});
test("server secrets stay outside client modules; empty configuration fails closed", () => {
  function files(dir) {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .flatMap((e) =>
        e.isDirectory()
          ? files(path.join(dir, e.name))
          : [path.join(dir, e.name)],
      );
  }
  for (const file of files(path.join(project, "src")).filter((f) =>
    /\.(ts|tsx)$/.test(f),
  )) {
    const source = fs.readFileSync(file, "utf8");
    if (source.startsWith('"use client"'))
      assert(!source.includes("SUPABASE_SECRET_KEY"), file);
  }
  const supabase = load("src/lib/server/supabase.ts");
  const names = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_SECRET_KEY",
  ];
  const saved = Object.fromEntries(names.map((k) => [k, process.env[k]]));
  try {
    names.forEach((k) => delete process.env[k]);
    assert(!supabase.supabaseConfigured());
    assert(!supabase.backendConfigured());
    assert.throws(() => supabase.submissionSupabase(), /NOT_CONFIGURED/);
  } finally {
    for (const name of names)
      if (saved[name] === undefined) delete process.env[name];
      else process.env[name] = saved[name];
  }
});
test("cross-site mutations and oversized form bodies remain blocked", async () => {
  const http = load("src/lib/server/http.ts"),
    before = process.env.NODE_ENV,
    origin = process.env.APP_ORIGIN;
  process.env.NODE_ENV = "production";
  process.env.APP_ORIGIN = "https://yetişikayet.com";
  try {
    const canonical = new URL(process.env.APP_ORIGIN).origin;
    assert(
      http.mutationAllowed(
        new Request(canonical + "/api", {
          method: "POST",
          headers: { Origin: canonical, "Content-Type": "application/json" },
        }),
      ),
    );
    assert(
      !http.mutationAllowed(
        new Request(canonical + "/api", {
          method: "POST",
          headers: {
            Origin: "https://evil.test",
            "Content-Type": "application/json",
          },
        }),
      ),
    );
    await assert.rejects(() =>
      http.body(
        new Request(canonical + "/api", {
          method: "POST",
          body: "x".repeat(33000),
        }),
      ),
    );
  } finally {
    if (before === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = before;
    if (origin === undefined) delete process.env.APP_ORIGIN;
    else process.env.APP_ORIGIN = origin;
  }
});
