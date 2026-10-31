# Başvuru sözleşmesi

Güncel API, Supabase kurulumu ve veri sınırları [backend.md](backend.md) içinde açıklanır.

Çalışan: title, narrative, city, staffType, isteğe bağlı period. İşveren: parentId, role, name, reply. Yayın/inceleme/örnek/not alanları başvurudan alınmaz. SQL fonksiyonu pending durumunu zorunlu kılar. Yönetici kimliği Supabase Auth ile doğrulanır; düzenleme yetkisi veritabanında kontrol edilir.
