# Supabase kurulumu ve deploy

## Mimari

Tarayıcı → Next.js `/api/*` → Supabase HTTPS API → PostgreSQL / Supabase Auth.

`/admin` ayrı, oturum korumalı yönetim ekranıdır. Supabase Auth kullanıcı kimliğini doğrular; veritabanındaki yönetici listesi yetkiyi belirler. Şikâyet yazan ziyaretçilerin hesabı olması gerekmez. Form kayıtları, belgelerin kendisi olmadan, onay bekleyen içerik olarak saklanır. Belgeler e-posta üzerinden insan tarafından incelenir.

Uygulamada SQLite, yerel yönetici oluşturma veya uygulamanın yazdığı veritabanı dosyası kullanılmaz. Önceki `data/yetisikayet.sqlite` dosyası varsa silinmemiştir; yeni sisteme otomatik aktarılmaz ve deploy edilmemelidir. Burada gerçek başvurular varsa canlıya geçmeden önce kontrollü veri aktarımı yapılmalıdır. Yeni Supabase veritabanına başlangıçta gerçek şikâyet eklenmez.

## 1. Supabase projesi

Supabase projesinde `supabase/migrations/202610310001_yetisikayet.sql` dosyasını SQL Editor ile çalıştır. Alternatif olarak Supabase CLI ile projeye bağlanıp `supabase db push` kullan. Bu migration yeni, yetişikayet.com'a ait isimleri oluşturur; mevcut başka uygulamanın tablolarını değiştirmez. Tekrar çalıştırılabilir.

Veriler `yetisikayet_private` şemasında kalır. Bu şemayı Supabase'in exposed schemas listesine **ekleme**. Tablolar RLS ile varsayılan kapalıdır; anonim ve authenticated rolleri tablo/şema erişimi almaz. Veriye yalnızca açıkça yetki verilen, sabit `search_path` kullanan RPC'ler ulaşır. Salt kullanıcı hesabına sahip olmak yönetici yetkisi vermez.

SQL dosyaları:

- `supabase/migrations/202610310001_yetisikayet.sql`: tablolar, indeksler, özel veri sınırları, yetkiler, başvuru/onay RPC'leri, çalma listesi ve kalıcı istek sınırı.
- `supabase/bootstrap-admin.sql`: önceden Supabase Auth'ta oluşturulmuş ve doğrulanmış `yetisikayet@proton.me` hesabını yönetici yapar. Şifre içermez.
- `supabase/seed-examples.sql`: isteğe bağlı iki örnek. Otomatik çalışmaz; örnek etiketi korunur.

## 2. Yönetici hesabı

Supabase Dashboard → Authentication → Users ekranında `yetisikayet@proton.me` hesabını oluştur ve e-postayı doğrula. Şifreyi dashboard'da belirle; kaynak koda veya SQL'e yazma. Ardından `bootstrap-admin.sql` çalıştır. Başka adres kullanacaksan o dosyadaki tek e-posta değerini değiştir.

Siteden yönetici hesabı oluşturma endpoint'i yoktur. Supabase Auth'ta genel kullanıcı kaydını kapat. Site URL ve izin verilen yönlendirme adreslerini kendi domainine ayarla; şifre sıfırlama/SMTP gibi henüz kurulmamış akışlar sitede çalışıyormuş gibi gösterilmez.

`@supabase/ssr` sunucu çerezlerini yönetir. `src/proxy.ts` yalnızca yönetici sayfalarında ve API'lerinde oturum yenilemeyi sağlar. Yetki kontrolü ayrıca her özel API'de ve veritabanı RPC'sinde tekrar yapılır. Kimlik doğrulama Auth sunucusundan `getUser()` ile yapılır; istemcideki `getSession()` verisine güvenilmez. Oturum çerezleri HttpOnly, SameSite=Strict ve üretimde Secure'dür. Çıkış yerel oturumu kapatır; JWT geçerlilik/yenileme süreleri Supabase Auth ayarlarıdır.

## 3. Ortam değişkenleri

`.env.example` şablonunu kullan. Değerleri yerel geliştirmede `.env.local`, üretimde hosting'in ortam değişkeni/sır ayarlarında tut.

| Değişken | Kullanım |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Proje HTTPS adresi |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `SUPABASE_SECRET_KEY` | Yalnızca sunucu. Anonim başvuru ve istek sınırı RPC'lerini çağırır. |
| `APP_ORIGIN` | Tam site kökeni; örneğin `https://yetişikayet.com` |
| `RATE_LIMIT_SALT` | İsteğe bağlı, sunucuya özel rastgele HMAC sırrı. Yoksa secret key kullanılır. |
| `TRUST_PROXY` | Yalnızca proxy dışarıdan gelen IP başlığını silip yeniden yazıyorsa `1` |
| `PUBLIC_INDEXING_ENABLED` | İçerik ve işletim hazır olduğunda `true` |

Secret key asla `NEXT_PUBLIC_` adıyla verilmez, tarayıcıya gönderilmez ve SQL dosyasına konmaz. Yönetici sorguları secret key ile değil, oturum açmış kullanıcının JWT'siyle yapılır. İstemcilerden doğrudan anonim INSERT yetkisi yoktur; başvuru RPC'si sadece sunucu anahtarına açılmıştır. Ortam değişkenlerini değiştirdikten sonra sunucuyu yeniden başlat veya yeniden deploy et.

## 4. API ve veri akışı

- `POST /api/submissions`: worker/reply şemalarını doğrular; aynı kaynak, JSON türü ve gövde boyutu kontrolü yapar. Kalıcı istek sınırından sonra Supabase'e başvuru gönderir. DB, istemcinin durum/inceleme/kimlik/not alanlarını yok sayıp her zaman `pending` ve `evidenceReviewed=false` oluşturur.
- `POST /api/admin/auth`: Supabase hesabıyla giriş/çıkış. `setup` işlemi desteklenmez.
- `GET/PATCH /api/admin/records`: onay bekleyenler, yayındakiler, düzenleme, özel/açık admin notları. İlk metin değişmez, eski sürümler ve düzenleyenin kimliği özel geçmişte tutulur. Sürüm uyuşmazlığı 409'dur.
- `PATCH /api/admin/settings`: sıralı `tracks` dizisi. Her öğe `id`, `title`, `url`, `startSeconds` alanlarını taşır. URL doğrulanıp yalnızca YouTube video kimliği saklanır.
- `GET /api/music`: yalnızca halka açık çalma listesini döndürür.

Belge incelemesi onaylanmadan gerçek içerik yayımlanamaz. Yayımlanmamış şikâyete yeni yanıt verilemez; şikâyet yayından alınınca bağlı yanıtları da kamuya açık sorgudan çıkar. Özel notlar, ilk gönderilen metin ve sürüm geçmişi public RPC'lere aktarılmaz. Dış belge bağlantıları HTTPS olur; dosyaların erişim izni ve kişisel veri gizleme işlemi dosyanın tutulduğu hizmette ayrıca yönetilir.

## 5. Çalma listesi

Panel → Müzik bölümünde en az 1, en fazla 30 parça tanımlanabilir. Oklar sırayı değiştirir, sil düğmesi parçayı çıkarır. `startSeconds` 0–86400 arasında tam sayıdır. Aynı YouTube videosu farklı başlangıçlarla birden fazla satıra eklenebilir; her satırın ayrı kimliği vardır.

Site ilk parçada bekler; ziyaretçi oynat düğmesine basmadan YouTube'a bağlanmaz. Sonraki parça düğmesi ve parça sonu sırayla ilerler, son parçadan ilk parçaya döner. Her yeni parça kendi başlangıç saniyesinden başlar. Ses ve oynatma durumu bileşende korunur; sayfalar arası gezinme oynatıcıyı kaldırmaz. Ayarlar pencereye tekrar odaklanınca yenilenir; aynı liste yeniden geldiğinde parça başa alınmaz. Kaydedilmiş ayar değişirse mevcut parça kimliği mümkün olduğunca korunur.

## 6. Deploy ve kontroller

Next.js sunucu/API desteği olan bir hizmete deploy et; statik export tek başına yetmez. `npm run build` ve `npm run start` kullanılır. Sunucu diski üzerinde kalıcı veritabanı gerekmez. HTTPS, doğru `APP_ORIGIN`, güvenilir proxy/IP ayarı ve Supabase ağ erişimi gerekir. Backend kaynak kodu ayrı barındırılan veri/Auth hizmetini HTTPS API ile kullanır; `/admin` aynı site içinde kalır.

Kurulum yokken geliştirme tasarımında iki etiketli örnek ve mevcut tek parça görünür. Gönderim API'leri 503 verir; başarı mesajı veya yerel kuyruk üretmez. Üretimde yapılandırılmamış veri kaynağı örnek şikâyet yayımlamaz. Yapılandırılmış bir Supabase bağlantısı hata verirse uygulama sessizce mock kaynağa dönmez.

`npm run test:database` PostgreSQL uyumlu PGlite üzerinde migration, yeniden çalıştırma, roller, özel veri, yayın/onay ve çalma listesi kurallarını test eder. Bu test gerçek Supabase Auth oturumunu veya canlı proje bağlantısını doğrulamaz. Proje anahtarları sağlandıktan sonra canlı olmayan bir Supabase projesinde ayrıca giriş–başvuru–onay–yayın duman testi yapılmalıdır.

İşletimde Supabase yedekleri, veri saklama/silme süreleri, SMTP/şifre kurtarma, erişim kayıtları ve kötüye kullanım önleme ayarları ayrıca belirlenir. Dışarıdan gelen IP başlıklarına güvenilmiyorsa istek sınırı ortak havuz kullanır; trafik arttığında dağıtımın güvenilir proxy düzenine göre ayarlanmalıdır.
