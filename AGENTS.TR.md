# Ajan talimatları

[Canonical English version](AGENTS.md)

Bu dosya `AGENTS.md` kanonik proje referansının Türkçe çevirisidir. Bu repository
üzerinde çalışan tüm ajanlar `AGENTS.md` dosyasını izlemelidir. Alt klasörlerde ek
`AGENTS.md` oluşturmayın. Talimat değişikliklerini önce kanonik dosyada yapın,
ardından bu çeviriyi eşitleyin.

## Proje sınırları

- `changelog/changelog.html` yalnızca oyuncuya dönük oyun sürümlerini, içerik
  eklemelerini ve oyun değişikliklerini tutar.
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
- `scripts/`: build ve yayın çıktısı araçları.

## Zorunlu çalışma akışı

1. Düzenlemeyi üretilen dosyada değil ilgili kaynak dosyada yapın.
2. Oyuncuya veya geliştiriciye dönük değişikliği doğru changelog'a ekleyin.
3. İngilizce Markdown dosyalarıyla `.TR.md` çevirilerini eşit tutun.
4. `npm run format` çalıştırın.
5. `npm run build` ile bundle ve `dist/` çıktısını yeniden üretin.
6. `npm run check` çalıştırın.
7. Mümkünse `dist/index.html` dosyasını gerçek bir tarayıcıda açarak runtime
   hatalarını kontrol edin.

## Uyumluluk kuralları

- Kayıt anahtarı, kayıt veri sırası ve Base64 uyumluluğu açık bir migration
  olmadan değiştirilmez.
- Kaynak dosyaların `scripts/build.js` içindeki sırası korunur; eski oyun global
  function-hoisting davranışına bağımlıdır.
- Global değişkenleri module scope'a taşımak veya strict mode açmak ayrı ve
  planlı bir migration gerektirir.
- Dosyaları UTF-8 tutun ve bozuk karakter kodlaması üretmeyin.
- Davranış değişikliklerini yalnızca kullanıcı talebi kapsamındaysa yapın.

## Deployment

- GitHub Pages kaynağı GitHub Actions olmalıdır.
- `main` dalına push, `.github/workflows/deploy-pages.yml` akışını tetikler.
- Yalnızca `dist/` Pages artifact'i olarak yüklenir.
