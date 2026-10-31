# yetişikayet.com

Next.js sitesi + Supabase PostgreSQL/Auth. Ziyaretçi ve yönetici ekranları Next.js API katmanından Supabase'e bağlanır. Uygulama sunucusu veri dosyası veya yerel şifre saklamaz; SQLite aktif koddan çıkarılmıştır.

## Kurulum

1. `npm install` ve `.env.example` dosyasını temel alarak `.env.local` oluştur.
2. Supabase SQL Editor'da `supabase/migrations/202610310001_yetisikayet.sql` dosyasını çalıştır.
3. Supabase Authentication ekranından yönetici hesabını oluştur, e-postasını doğrula. Ardından `supabase/bootstrap-admin.sql` dosyasını çalıştır.
4. Supabase URL, publishable key ve **yalnızca sunucuda tutulacak** secret key değerlerini ayarlara ekle.
5. `npm run dev`; yönetim adresi `/admin`. Üretimde `npm run build` ve `npm run start` veya Next.js destekleyen hosting kullan.

Tam kurulum, API sözleşmesi, yetki sınırları ve deploy adımları: [docs/backend.md](docs/backend.md).

Supabase bağlanmadığında geliştirme ortamında iki etiketli örnek gösterilir; sunucu kayıt almış gibi davranmaz. Üretim verisine otomatik örnek eklenmez. İstenirse `supabase/seed-examples.sql` ile yalnızca işaretli örnekler ayrıca eklenebilir.

Kontroller:

- `npm run lint`
- `npx tsc --noEmit`
- `npm run test:security`
- `npm run test:database`
- `npm run build`

Müzik sekmesi 1–30 YouTube parçası, sıra ve her parça için başlangıç saniyesini yönetir. Oynatma ziyaretçinin düğmeye basmasıyla başlar; sonraki düğmesi ve parça sonu sıradaki kayda geçer.
