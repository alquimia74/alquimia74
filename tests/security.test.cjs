const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createRequire}=require('node:module');
// This file lives in the project tests/ directory after installation.
const project=path.resolve(__dirname,'..');
const projectRequire=createRequire(path.join(project,'package.json'));
const ts=projectRequire('typescript');
function load(relative){const module={exports:{}};const code=ts.transpileModule(fs.readFileSync(path.join(project,relative),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;new Function('exports','require','module',code)(module.exports,(name)=>name.startsWith("@/")?load("src/"+name.slice(2)+".ts"):projectRequire(name),module);return module.exports;}
const security=load('src/lib/security.ts');
const origin=new URL('https://yetişikayet.com').origin;
test('document links reject executable schemes, external URLs and unreviewed locations',()=>{
 for(const url of ['javascript:alert(1)','data:text/html,<script>alert(1)</script>','https://evil.example/documents/a.pdf','//evil.example/documents/a.pdf','https://user:pass@'+new URL(origin).hostname+'/documents/a.pdf','/documents/a.pdf?download=1','/documents/a.svg','/documents/../private/a.pdf','/documents/%2e%2e/private/a.pdf','/documents/a%0a.pdf','/documents/a.pdf#javascript:alert(1)','/documents/%ZZ.pdf','/documents/a\\b.pdf'])assert.equal(security.safeDocumentUrl(url,origin),null,url);
 assert.equal(security.safeDocumentUrl('/documents/redacted/record-1.pdf',origin),origin+'/documents/redacted/record-1.pdf');
});
test('filename controls cannot insert extra lines or reverse displayed extensions',()=>{
 assert.equal(security.cleanFilename('file\nname\r\u202Efdp.exe'),'filenamefdp.exe');
});
test('evidence rejects a spoofed PDF, empty files, MIME mismatch and count/size overflow',async()=>{
 const pdf=new File(['%PDF-1.7\nrecord'],'record.pdf',{type:'application/pdf'});
 assert.equal(await security.checkEvidenceFile(pdf,[]),null);
 assert(await security.checkEvidenceFile(new File(['<script>bad</script>'],'record.pdf',{type:'application/pdf'}),[]));
 assert(await security.checkEvidenceFile(new File([''],'empty.pdf',{type:'application/pdf'}),[]));
 assert(await security.checkEvidenceFile(new File(['%PDF-1.7'],'record.png',{type:'image/png'}),[]));
 assert(await security.checkEvidenceFile(pdf,Array(10).fill(pdf)));
 assert(await security.checkEvidenceFile({size:security.evidenceLimits.fileBytes+1},[]));
 assert(await security.checkEvidenceFile(pdf,[{size:security.evidenceLimits.totalBytes}]));
 const png=new File([Uint8Array.from([137,80,78,71,13,10,26,10,0])],'record.png',{type:'image/png'});
 assert.equal(await security.checkEvidenceFile(png,[]),null);
});
test('JSON-LD cannot break out of its script tag',()=>{
 const {renderToStaticMarkup}=projectRequire('react-dom/server');
 const {createElement}=projectRequire('react');
 const {JsonLd}=load('src/components/seo/JsonLd.tsx');
 const attack='</script><img src=x onerror=alert(1)>';
 const html=renderToStaticMarkup(createElement(JsonLd,{data:{name:attack}}));
 assert(!html.includes('</script><img'));
 const json=html.match(/<script[^>]*>([\s\S]*)<\/script>/)[1];
 assert.equal(JSON.parse(json).name,attack);
});
test('production headers block framing, plugins and inline event handlers without eval',async()=>{
 const before=process.env.NODE_ENV;process.env.NODE_ENV='production';
 try { const config=load('next.config.ts').default;const rules=await config.headers();const headers=Object.fromEntries(rules[0].headers.map(h=>[h.key,h.value]));
  assert.equal(config.poweredByHeader,false);assert.equal(headers['X-Frame-Options'],'DENY');assert.equal(headers['X-Content-Type-Options'],'nosniff');
  for(const rule of ["frame-ancestors 'none'","object-src 'none'","script-src-attr 'none'","base-uri 'none'"])assert(headers['Content-Security-Policy'].includes(rule));
  assert(!headers['Content-Security-Policy'].includes('unsafe-eval'));assert(headers['Strict-Transport-Security']);
  assert(rules.find(r=>r.source==='/documents/:path*').headers.some(h=>h.key==='Content-Disposition'&&h.value==='attachment'));
 } finally {if(before===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=before;}
});

test('active minimal forms accept only bounded worker and employer content',()=>{
 const {workerSubmissionSchema:worker,employerReplySchema:employer}=load('src/lib/validations.ts');
 assert(worker.safeParse({title:'Ödeme kaydı hakkında',narrative:'a'.repeat(100),city:'İstanbul',staffType:'affiliate'}).success);
 assert(!worker.safeParse({title:'kısa',narrative:'a'.repeat(100),city:'İstanbul',staffType:'affiliate'}).success);
 assert(!worker.safeParse({title:'Ödeme kaydı hakkında',narrative:'a'.repeat(5001),city:'İstanbul',staffType:'affiliate'}).success);
 const valid={role:'Şirket yetkilisi',name:'Yetkili Temsilci',reply:'Bu yanıt ilgili kaydın dayanağını açıklamaktadır.'};
 assert(employer.safeParse(valid).success);
 assert(!employer.safeParse({...valid,role:' '}).success);
 assert(!employer.safeParse({...valid,reply:'a'.repeat(5001)}).success);
 assert.deepEqual(Object.keys(employer.parse({...valid,company:'unneeded',email:'unneeded'})),['role','name','reply']);
});

test('city, staff and moderation gates remain consistent',()=>{
 const {PROVINCES}=load('src/data/provinces.ts');assert.equal(PROVINCES.length,81);assert.equal(new Set(PROVINCES).size,81);
 const schema=load('src/lib/validations.ts').workerSubmissionSchema;
 const data={title:'Ödeme kaydı hakkında',narrative:'a'.repeat(100),city:'İstanbul',staffType:'headquarters'};assert(schema.safeParse(data).success);assert(!schema.safeParse({...data,city:'Not a province'}).success);assert(!schema.safeParse({...data,staffType:'other'}).success);assert(!('status' in schema.parse({...data,status:'published'})));
 const {mayPublish,mayLinkDocument}=load('src/lib/editorial-rules.ts');
 for(const kind of ['complaint','reply']){assert(!mayPublish({kind,status:'awaiting_evidence',evidenceReviewed:false}));assert(mayPublish({kind,status:'reviewing',evidenceReviewed:true}));assert(!mayPublish({kind,status:'rejected',evidenceReviewed:true}));}
 assert(!mayLinkDocument({redacted:true,publicationApproved:false}));assert(!mayLinkDocument({redacted:false,publicationApproved:true}));assert(mayLinkDocument({redacted:true,publicationApproved:true}));
});
