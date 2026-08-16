# Repository değişiklik günlüğü

[English](CHANGELOG.md)

Bu dosya kod tabanı, mimari, araç, dokümantasyon ve deployment değişikliklerini
kaydeder. Oyuncuya dönük oyun içeriği ve sürüm notları
`changelog/changelog.html` dosyasında tutulur.

## [Yayınlanmamış]

### Eklenenler

- CSS, JavaScript ve dil dosyaları için deployment sırasında içerik özetiyle
  sürümleme eklendi.
- İsteğe bağlı `lang` sorgu parametresiyle doğrudan dil seçimi ve eksiksiz Türkçe
  başlangıç için tarayıcı testi eklendi.
- Oyun HTML changelog'u dahil repository genelinde Prettier kontrolü eklendi.
- Arayüz, oyun içeriği, açıklamalar, diyaloglar ve çalışma zamanı mesajlarının
  tamamını kapsayan eksiksiz Türkçe dil dosyası eklendi.
- Kayıtlı her İngilizce dışı dil için dil şeması ve biçimlendirme parçaları
  doğrulaması eklendi.
- `locales/en.json`, dil keşfi, İngilizce fallback ve Settings altında kalıcı dil
  seçimiyle JSON tabanlı uluslararasılaştırma eklendi.
- JSON ile yüklenen build'leri test etmek için dil doğrulaması ve yerel HTTP
  sunucusu eklendi.
- Tüm ajanlar için tek kanonik proje referansı olarak `AGENTS.md` eklendi.
- README, ajan talimatları ve repository değişiklik günlüğü için `.TR.md` Türkçe
  çeviri dosyaları eklendi.
- Kaynak formatlama ve doğrulama için Prettier, Stylelint ve ESLint eklendi.
- Otomatik GitHub Pages build, doğrulama ve deployment workflow'u eklendi.
- Yayına hazır statik dosyaları `dist/` altında hazırlayan build adımı eklendi.

### Değiştirilenler

- Türkçe, Ayarlar dil seçicisine kaydedildi; changelog güncellemesinin commit ve
  push işlemlerinden önce yapılması ve periyodik gönderim kuralları belgelendi.
- Sabit yerleşimli arayüz, küçük tarayıcı ekranlarına otomatik küçülerek sığacak
  şekilde değiştirildi.
- Bakımı yapılan ve upstream GitHub Pages adresleri, taşınabilir dahili bağlantı
  gereksinimleri, ekran beklentileri, changelog politikası ve cevap dili tercihi
  belgelendi.
- Ortak arayüz etiketleri, yeniden kullanılan 22 oyun metni koleksiyonu, 1.242
  içerik adı/açıklaması ve 726 yeniden kullanılabilir çalışma zamanı mesajı
  JavaScript'ten İngilizce dil dosyasına taşındı.
- Tek parça `index.html`; CSS, işlevsel JavaScript kaynakları ve küçük bir HTML
  giriş dosyası olarak ayrıştırıldı.
- JavaScript kaynakları `core`, `data`, `systems`, `ui`, `utils` ve `world`
  sorumluluklarına göre gruplandırıldı.
- Eski CSS formatlandı; geçersiz ölçüler, yazım hataları ve standart dışı
  bildirimler düzeltildi.
- JavaScript ve CSS kaynakları davranışı koruyan modern sözdizimiyle güncellendi.

### Düzeltilenler

- Eski veya hatalı oyun kaydı başlangıç sırasında hata verdiğinde yükleme
  katmanının süresiz olarak ekranda kalması engellendi.
- Pages deployment sonrasında tarayıcının eski çalışma zamanı ve dil dosyalarını
  yeni sürümle karıştırması engellendi.
- Repository proje alt yolunda yayınlanan GitHub Pages dağıtımlarındaki oyun içi
  changelog bağlantısı düzeltildi.
- Ayrılmış kaynaklardan tek bir tarayıcı bundle'ı üretilerek eski global
  function-hoisting davranışı korundu.
- Geliştirme bağımlılıklarının GitHub Pages artifact'ine eklenmesi engellendi.
