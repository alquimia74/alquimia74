# YetişVar

> **Yetiş'e dair anlatacaklar var.**

YetişVar, Yetiş+ Çarşı, Hızır Global A.Ş. ve ilgili faaliyetlerdeki çalışma deneyimlerinin
paylaşıldığı bağımsız bir frontend platformudur.

> **⚠️ Demo Aşaması:** Bu sürüm yalnızca frontend ve mock veri içermektedir.
> Gerçek başvuru, veritabanı veya kimlik doğrulama altyapısı bulunmamaktadır.

---

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

---

## Ortam Değişkenleri

`.env.local.example` dosyasını kopyalayıp `.env.local` oluşturun:

```bash
cp .env.local.example .env.local
```

| Değişken | Açıklama | Varsayılan |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Site URL'si (canonical için) | `http://localhost:3000` |
| `PUBLIC_INDEXING_ENABLED` | `true` olunca arama motorlarına açılır | `false` |

> **Önemli:** `PUBLIC_INDEXING_ENABLED=false` olduğu sürece tüm site `noindex` olarak işaretlenir.
> Gerçek domain ve içerik yayınlanınca `true` yapın.

---

## Logo Dosyası

Logo dosyasını aşağıdaki konuma ekleyin:

```
public/
  brand/
    logo.png   ← Buraya ekleyin
```

- Önerilen boyut: **400×100px** veya orantılı
- Format: **PNG** (şeffaf arka plan önerilir)
- Dosya adı kesinlikle `logo.png` olmalıdır

Logo bulunmazsa header ve footer'da tipografik fallback gösterilir.

---

## Proje Yapısı

```
src/
  app/                    ← Next.js App Router sayfaları
    page.tsx              ← Ana Sayfa
    deneyimler/           ← Deneyim listesi + detay
    deneyimini-paylas/    ← 7 adımlı form
    kurumlar/             ← Kurum dizini + detay
    hakkimizda/
    nasil-calisir/
    yayin-ilkeleri/
    sikca-sorulan-sorular/
    iletisim/
    gizlilik/
    kvkk-aydinlatma/
    demo/admin/           ← Moderasyon demo (noindex)
    sitemap.ts
    robots.ts

  components/
    layout/               ← Header, Footer, MobileMenu
    home/                 ← HeroSection, HowItWorks, vb.
    experiences/          ← ExperienceCard, DemoBadge, vb.
    forms/                ← SubmissionForm + 7 adım
    seo/                  ← JsonLd
    admin/                ← Admin demo bileşenleri

  data/
    mock-experiences.ts   ← 3 demo deneyim (isDemo: true)
    mock-entities.ts      ← 6 kurum kaydı
    mock-admin.ts         ← 4 demo başvuru

  types/                  ← TypeScript interface'leri
  lib/                    ← config, seo, utils, validations
  services/               ← mock-experience-repository, mock-submission-service
```

---

## Mock Veri Düzenleme

### Deneyim eklemek / düzenlemek

`src/data/mock-experiences.ts` dosyasını düzenleyin.

> **Kural:** Her mock deneyimde `isDemo: true` olmalı ve içerikte gerçek kişi adı,
> doğrulanmış olay veya mahkeme kararı bulunmamalıdır.

### Kurum eklemek

`src/data/mock-entities.ts` dosyasını düzenleyin.

---

## SEO Konfigürasyonu

Her sayfada `generateMeta()` helper'ı ile meta veriler otomatik oluşturulur:

```ts
// src/lib/seo.ts
export function generateMeta({ title, description, path, noindex }) { ... }
```

Yapılandırılmış veri (JSON-LD) için `<JsonLd data={...} />` bileşenini kullanın.

---

## Gerçek Backend'e Geçiş Notları

Bu sürüm tamamen frontend + mock data üzerinde çalışır. Gerçek sisteme geçmek için:

1. **Supabase kurulumu** → `mock-experience-repository.ts` ve `mock-submission-service.ts` dosyalarını Supabase client ile değiştirin
2. **Kimlik doğrulama** → `/demo/admin` route'unu gerçek auth ile güvenli hale getirin
3. **Dosya yükleme** → `Step5Documents.tsx` içindeki upload mantığını Supabase Storage ile tamamlayın
4. **E-posta bildirimi** → Yeni başvuru geldiğinde bildirim için sunucu tarafı işlem ekleyin
5. **KVKK & Gizlilik** → Metinleri hukukçuya inceletin ve güncelleyin
6. **`PUBLIC_INDEXING_ENABLED=true`** → Domain yayınlanınca `.env.local`'ı güncelleyin

---

## Sayfalar

| Route | Açıklama |
|---|---|
| `/` | Ana Sayfa |
| `/deneyimler` | Deneyim listesi (arama + filtre) |
| `/deneyimler/[slug]` | Tekil deneyim detayı |
| `/deneyimini-paylas` | 7 adımlı form |
| `/kurumlar` | Kurum dizini |
| `/kurumlar/[slug]` | Kurum detayı + deneyimler |
| `/hakkimizda` | Platform hakkında |
| `/nasil-calisir` | Başvuru süreci |
| `/yayin-ilkeleri` | Yayın politikası |
| `/sikca-sorulan-sorular` | SSS |
| `/iletisim` | İletişim |
| `/gizlilik` | Gizlilik politikası (taslak) |
| `/kvkk-aydinlatma` | KVKK metni (taslak) |
| `/demo/admin` | Moderasyon paneli demosu (noindex) |

---

## Lisans

Bu proje özel kullanım içindir.
