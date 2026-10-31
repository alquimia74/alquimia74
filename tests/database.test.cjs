const { PGlite } = require("@electric-sql/pglite");
const fs = require("fs"),
  assert = require("node:assert/strict");
const root = require("path").resolve(__dirname, "..");
const test = require("node:test");
const adminId = "10000000-0000-4000-8000-000000000001",
  outsiderId = "20000000-0000-4000-8000-000000000002";
test("Supabase SQL: private data, roles, moderation, playlist and rate limiting", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role; create schema auth;
 create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 insert into auth.users values('${adminId}','yetisikayet@proton.me',now()),('${outsiderId}','other@example.test',now());`);
    const migration = fs.readFileSync(
      root + "/supabase/migrations/202610310001_yetisikayet.sql",
      "utf8",
    );
    await db.exec(migration);
    await db.exec(migration); // idempotent on the same project
    await db.exec(
      fs.readFileSync(root + "/supabase/bootstrap-admin.sql", "utf8"),
    );
    const scalar = async (sql, params = []) =>
      Object.values((await db.query(sql, params)).rows[0])[0];
    async function role(name, id = "") {
      await db.exec("reset role");
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
        id,
      ]);
      await db.exec("set role " + name);
    }
    const forbidden = async (sql, params = []) => {
      await assert.rejects(() => db.query(sql, params));
    };
    await role("anon");
    assert.deepEqual(await scalar("select public.ys_read_published()"), []);
    assert.equal(
      (await scalar("select public.ys_read_playlist()")).tracks[0].videoId,
      "5ftitAfWgWI",
    );
    await forbidden("select * from yetisikayet_private.records");
    await forbidden("select public.ys_admin_list_records()");
    await forbidden("select public.ys_submit_content($1,$2::jsonb,null)", [
      "complaint",
      JSON.stringify({}),
    ]);
    await forbidden("select public.ys_take_rate_limit($1,1,60)", [
      "a".repeat(64),
    ]);
    await role("authenticated", outsiderId);
    assert.equal(await scalar("select public.ys_is_moderator()"), false);
    await forbidden("select public.ys_admin_list_records()");
    const worker = {
      title: "Formdan gelen başvuru metni",
      narrative:
        "Bu kayıt sadece SQL akışını test etmek için hazırlanmıştır. ".repeat(
          4,
        ),
      city: "Ankara",
      staffType: "headquarters",
      period: "2026",
      status: "published",
      evidenceReviewed: true,
      isExample: true,
      adminNotes: [{ text: "inject", public: true }],
    };
    await role("service_role");
    const id = await scalar(
      "select public.ys_submit_content($1,$2::jsonb,null)",
      ["complaint", JSON.stringify(worker)],
    );
    await forbidden("select public.ys_submit_content($1,$2::jsonb,null)", [
      "complaint",
      JSON.stringify({ ...worker, city: "invalid" }),
    ]);
    for (let i = 0; i < 3; i++)
      assert(
        await scalar("select public.ys_take_rate_limit($1,3,60)", [
          "a".repeat(64),
        ]),
      );
    assert.equal(
      await scalar("select public.ys_take_rate_limit($1,3,60)", [
        "a".repeat(64),
      ]),
      false,
    );
    await role("anon");
    assert.deepEqual(await scalar("select public.ys_read_published()"), []);
    await role("authenticated", adminId);
    let record = await scalar("select public.ys_admin_get_record($1)", [id]);
    assert.equal(record.status, "pending");
    assert.equal(record.isExample, false);
    assert.equal(record.evidenceReviewed, false);
    assert.deepEqual(record.adminNotes, []);
    await forbidden("select public.ys_admin_save_record($1,1,$2::jsonb)", [
      id,
      JSON.stringify({ ...record, status: "published" }),
    ]);
    const notes = [
      {
        id: "public-note",
        text: "Açık not",
        url: "https://example.com/belge.pdf",
        public: true,
      },
      {
        id: "private-note",
        text: "NEVER_PUBLISH_THIS_NOTE",
        url: "",
        public: false,
      },
    ];
    record = await scalar(
      "select public.ys_admin_save_record($1,1,$2::jsonb)",
      [
        id,
        JSON.stringify({
          ...record,
          status: "published",
          evidenceReviewed: true,
          adminNotes: notes,
          title: "Yönetici tarafından düzenlenen başlık",
          kind: "reply",
          id: outsiderId,
          isExample: true,
        }),
      ],
    );
    assert.equal(record.id, id);
    assert.equal(record.kind, "complaint");
    assert.equal(record.isExample, false);
    assert.equal(record.version, 2);
    await forbidden("select public.ys_admin_save_record($1,1,$2::jsonb)", [
      id,
      JSON.stringify(record),
    ]);
    await role("anon");
    let published = await scalar("select public.ys_read_published()");
    assert.equal(published.length, 1);
    assert.equal(published[0].adminNotes.length, 1);
    assert(!JSON.stringify(published).includes("NEVER_PUBLISH_THIS_NOTE"));
    await role("service_role");
    const reply = await scalar(
      "select public.ys_submit_content($1,$2::jsonb,$3)",
      [
        "reply",
        JSON.stringify({
          name: "Yetkili",
          role: "İnsan Kaynakları",
          reply: "SQL testi için verilen açıklama metni.",
        }),
        id,
      ],
    );
    await role("anon");
    assert.equal((await scalar("select public.ys_read_published()")).length, 1);
    await role("authenticated", adminId);
    let r = await scalar("select public.ys_admin_get_record($1)", [reply]);
    r = await scalar("select public.ys_admin_save_record($1,1,$2::jsonb)", [
      reply,
      JSON.stringify({ ...r, evidenceReviewed: true, status: "published" }),
    ]);
    const tracks = [
      {
        id: "00000000-0000-4000-8000-000000000001",
        videoId: "5ftitAfWgWI",
        title: "Birinci",
        startSeconds: 45,
      },
      {
        id: "00000000-0000-4000-8000-000000000002",
        videoId: "jfKfPfyJRdk",
        title: "İkinci",
        startSeconds: 120,
      },
      {
        id: "00000000-0000-4000-8000-000000000003",
        videoId: "5ftitAfWgWI",
        title: "Üçüncü",
        startSeconds: 7,
      },
    ];
    await db.query("select public.ys_admin_save_playlist($1::jsonb)", [
      JSON.stringify(tracks),
    ]);
    for (const invalid of [
      [],
      [{ ...tracks[0], startSeconds: -1 }],
      [{ ...tracks[0], startSeconds: 1.2 }],
      [{ ...tracks[0], videoId: "bad" }],
      [tracks[0], tracks[0]],
    ])
      await forbidden("select public.ys_admin_save_playlist($1::jsonb)", [
        JSON.stringify(invalid),
      ]);
    await role("anon");
    published = await scalar("select public.ys_read_published()");
    assert.equal(published.length, 2);
    assert.deepEqual(
      (await scalar("select public.ys_read_playlist()")).tracks,
      tracks,
    );
    await role("authenticated", adminId);
    record = await scalar(
      "select public.ys_admin_save_record($1,2,$2::jsonb)",
      [id, JSON.stringify({ ...record, status: "pending" })],
    );
    await role("anon");
    assert.deepEqual(await scalar("select public.ys_read_published()"), []);
    await role("authenticated", adminId);
    await forbidden("select public.ys_admin_save_record($1,2,$2::jsonb)", [
      reply,
      JSON.stringify(r),
    ]);
    await role("postgres");
    assert.equal(
      await scalar(
        "select count(*)::integer from yetisikayet_private.provinces",
      ),
      81,
    );
    assert.equal(
      (
        await scalar(
          "select original_data from yetisikayet_private.records where id=$1",
          [id],
        )
      ).title,
      worker.title,
    );
    assert.equal(
      await scalar(
        "select count(*)::integer from yetisikayet_private.revisions where record_id=$1",
        [id],
      ),
      2,
    );
    console.log(
      "PASS PostgreSQL: migration rerun, least-privilege RPC grants, private schema/RLS, admin identity, pending-only submission, review gate, immutable identity/originals, optimistic edits, private notes, reply/parent visibility, playlist order/start validation, and persistent rate limiting.",
    );
  } finally {
    await db.close();
  }
});
