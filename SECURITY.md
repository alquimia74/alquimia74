# Güvenlik sınırları — Supabase sürümü

## Korunan sınırlar

- Yönetici kimliği Supabase Auth sunucusundan doğrulanır; yetki yalnızca özel yönetici tablosundaki kullanıcı kimliğine verilir. Siteden yönetici oluşturma yolu yoktur.
- Tüm uygulama tabloları exposed olmayan `yetisikayet_private` şemasında, RLS açık ve doğrudan anonim/authenticated erişimi kapalıdır. SECURITY DEFINER RPC'ler sabit boş search_path, tam nitelikli tablo adları, açık rol yetkileri ve yönetici kontrolleri kullanır. PUBLIC varsayılan fonksiyon yetkileri kaldırılır.
- Secret key yalnızca sunucuda, başvuru/istek sınırı için kullanılır. Yönetici veri işlemleri kendi JWT'siyle, kamuya açık okuma publishable key ile yapılır. Gizli anahtar istemci paketine aktarılmaz.
- Sunucu ve veritabanı alanları yeniden doğrular. Kullanıcının gönderdiği yayın/inceleme/örnek/not/kimlik alanları kabul edilmez. Başvuru daima onay bekler. Belge inceleme onayı olmadan gerçek içerik yayımlanamaz.
- Kamuya açık RPC yalnızca yayımlanmış şikâyet ve yayımlanmış yanıtları, açık admin notlarıyla döndürür. Bekleyen/reddedilen içerik, özel not, ilk metin ve sürüm geçmişi kapalı kalır. Ana şikâyet yayından alınırsa yanıtı da gizlenir.
- Aynı kaynak ve JSON türü, gövde boyutu, kalıcı istek sınırı, sürüm çakışması kontrolü vardır. İstemci IP bilgisi HMAC özetiyle sınırlama anahtarına dönüşür; proxy başlığı yalnızca açıkça yapılandırıldığında kabul edilir.
- Kullanıcı metni HTML olarak işlenmez. JSON-LD güvenli kaçış kullanır. YouTube URL'leri ve başlangıç saniyeleri doğrulanır; dış belge bağlantıları HTTPS ile sınırlıdır. URL doğrulaması dosya güvenilirliği veya erişim izni denetimi değildir.
- Yönetim cevapları no-store/noindex; CSP kaynak kısıtları, anti-framing, nosniff ve üretim HTTPS başlıkları sürer. Oturum yenileme proxy'si özel cevapların önbelleğe alınmasını engeller.

## İşletim ve test sınırı

SQL ve kaynak kod kontrolleri, PGlite üzerinde PostgreSQL rol/iş akışı testleri ve yerel tarayıcı kontrolleri yapılır. Gerçek Supabase projesi anahtarları verilmeden uzak bağlantı ve Auth uçtan uca testi tamamlanmış sayılamaz. Canlı altyapı sızma/DDoS testi ve hukuki uygunluk denetimi yapılmış değildir.

Next.js başlangıç betikleri nedeniyle CSP unsafe-inline içerir; nonce tabanlı sıkı politika değildir. Üretimde unsafe-eval yoktur. Secret key yönetimi, Supabase JWT süresi, Auth giriş sınırları, HTTPS, proxy, yedekler, veri saklama süreleri ve kurtarma kanalları dağıtımda ayarlanmalıdır. `npm run dev` üretime açılmaz.

Çıkış çerezi ve ilgili yerel yenileme oturumunu kapatır; Supabase erişim JWT'lerinin geçerlilik süreleri Auth ayarlarıyla yönetilir. İkinci faktör ve şifre sıfırlama ekranları bu aşamada eklenmemiştir. Belgeler kullanıcı formlarından yüklenmez; e-postadan incelenir. Ham belgeler public içine veya herkese açık dış alana konulmamalıdır.

Önceki SQLite dosyası varsa yalnızca korunmuş eski veridir; aktif uygulamada kullanılmaz ve deploy edilmez. Kurulum ve göç notları: [docs/backend.md](docs/backend.md).
