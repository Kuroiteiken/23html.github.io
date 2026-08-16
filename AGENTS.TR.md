# Ajan talimatları

[Canonical English version](AGENTS.md)

Bu dosya `AGENTS.md` kanonik proje referansının Türkçe çevirisidir. Bu repository
üzerinde çalışan tüm ajanlar `AGENTS.md` dosyasını izlemelidir. Alt klasörlerde ek
`AGENTS.md` oluşturmayın. Talimat değişikliklerini önce kanonik dosyada yapın,
ardından bu çeviriyi eşitleyin.

## Proje sınırları

- `changelog/changelog.html` yalnızca oyuncuya dönük oyun sürümlerini, içerik
  eklemelerini ve oyun değişikliklerini tutar. Oyun genelinde yapılan her
  geliştirme için buraya bir kayıt ekleyin.
- Kök `CHANGELOG.md` kod, mimari, araç, dokümantasyon ve deployment
  değişikliklerini tutar.
- `README.md` İngilizce geliştirici rehberidir; `README.TR.md` Türkçe çevirisidir.
- `js/game.js` ve `dist/` üretilen çıktılardır; doğrudan düzenlenmez.

## Kaynak yapısı

- `css/`: kaynak stiller.
- `js/core/`: başlangıç, kayıt/yükleme ve oyuncu durumu.
- `js/data/`: oyun içeriği tanımları.
- `js/systems/`: oyun sistemleri.
- `js/ui/`: DOM ve render kodu.
- `js/utils/`: genel yardımcılar.
- `js/world/`: alanlar, sektörler ve konumlar.
- `locales/`: dil kayıt listesi ve JSON çeviri dosyaları.
- `scripts/`: build ve yayın çıktısı araçları.

## Zorunlu çalışma akışı

1. Düzenlemeyi üretilen dosyada değil ilgili kaynak dosyada yapın.
2. Oyuncuya veya geliştiriciye dönük değişikliği doğru changelog'a ekleyin.
3. İngilizce Markdown dosyalarıyla `.TR.md` çevirilerini eşit tutun.
4. `changelog/changelog.html` dahil desteklenen tüm repository dosyalarını
   Prettier ile biçimlendirmek için `npm run format` çalıştırın.
5. `npm run build` ile bundle ve `dist/` çıktısını yeniden üretin.
6. `npm run check` çalıştırın.
7. Chrome veya Chromium kullanılabiliyorsa `npm run test:browser` çalıştırın.
8. Her commit ve push öncesinde yayınlanan değişiklikler için hem oyuncuya dönük
   HTML changelog'u hem İngilizce/Türkçe repository changelog'larını güncelleyin.
9. Devam eden geliştirmelerde gerekli changelog güncellemeleri ve doğrulamalar
   başarılı olduktan sonra periyodik kilometre taşı commit'leri oluşturup pushlayın.
10. Her hata düzeltmesi ve davranış değişikliği için regresyon testi ekleyin veya
    güncelleyin. İlgili yükleme, önbellek, kayıt, dil veya arayüz senaryoları test
    edilmeden ya da testleri geçmeden deployment yapmayın.

## Uyumluluk kuralları

- Kayıt anahtarı, kayıt veri sırası ve Base64 uyumluluğu açık bir migration
  olmadan değiştirilmez.
- Kaynak dosyaların `scripts/build.js` içindeki sırası korunur; eski oyun global
  function-hoisting davranışına bağımlıdır.
- Global değişkenleri module scope'a taşımak veya strict mode açmak ayrı ve
  planlı bir migration gerektirir.
- Dosyaları UTF-8 tutun ve bozuk karakter kodlaması üretmeyin.
- Oyuncuya dönük yeni ortak arayüz metinlerini `locales/en.json` içine ekleyin,
  `i18n.t()` veya `i18n.get()` üzerinden kullanın ve çeviri anahtarlarını diller
  arasında koruyun.
- Yeni dil dosyalarını `locales/manifest.json` içine kaydedin; eksik çeviriler
  İngilizce fallback kullanabilir.
- Davranış değişikliklerini yalnızca kullanıcı talebi kapsamındaysa yapın.
- Hata düzeltmeleri, özellikler ve oyuncuya dönük eklemelerde tam sayı oyun
  sürümünü artırın ve `changelog/changelog.html` başına eşleşen bir
  `öncekiーgüncel` bölümü ekleyin. Basit dokümantasyon, formatlama veya yalnızca
  ifade değişikliklerinde sürümü artırmayın.
- Arayüz değişikliklerini mümkün olduğunca sabit yerleşimli oyunun tamamını
  ekranda tutacak şekilde tasarlayın ve küçük ekran boyutlarında test edin.
- Repository sahibine Türkçe cevap verin. Forklarda mevcut kullanıcının dil
  tercihini izleyin.

## Deployment

- GitHub Pages kaynağı GitHub Actions olmalıdır.
- `main` dalına push, `.github/workflows/deploy-pages.yml` akışını tetikler.
- Yalnızca `dist/` Pages artifact'i olarak yüklenir.
- Bakımı yapılan yayın `https://kuroiteiken.github.io/23html.github.io/`, upstream
  yayın ise `https://23html.github.io/` adresindedir.
- Dahili bağlantılar hem alan adı kökünde hem GitHub Pages proje alt yolunda
  çalışmalıdır. `/changelog/...` gibi köke göre yolları sabit kodlamayın; belge
  tabanını dikkate alan veya göreli bir URL kullanın.
- Tarayıcı önbelleğinin farklı sürümlere ait HTML, JavaScript, CSS ve dil
  dosyalarını karıştırmaması için deployment asset sürümlemesini koruyun.
