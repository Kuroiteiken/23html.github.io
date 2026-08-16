# Proto23

[English](README.md)

Proto23, herhangi bir backend gerektirmeden tarayıcıda çalışan erken aşama bir
oyundur. Repository aynı zamanda GitHub Pages üzerinden yayınlanacak statik siteyi
içerir.

## Başlangıç

Gereksinimler: Node.js 22 veya üzeri ve npm.

```sh
npm install
npm run build
```

Oluşturulan site `dist/index.html` üzerinden yerel olarak açılabilir.

## Kaynak yapısı

- `css/`: oyun stilleri
- `js/core/`: başlangıç, kayıt/yükleme ve oyuncu durumu
- `js/data/`: eşya, ekipman, yetenek, görev ve yaratık tanımları
- `js/systems/`: aksiyon, üretim, efekt, simülasyon ve planlama sistemleri
- `js/ui/`: arayüz ve render kodu
- `js/world/`: bölgeler, sektörler ve konumlar
- `js/utils/`: rastgele sayı ve kodlama yardımcıları
- `scripts/`: bundle ve yayın çıktısı araçları

Eski oyun, tüm fonksiyon bildirimlerinin başlangıçtan önce erişilebilir olmasına
bağımlıdır. Bu nedenle `js/game.js` üretilen tarayıcı bundle'ıdır. Kaynak dosyaları
düzenledikten sonra bundle ve GitHub Pages çıktısını yeniden oluşturun:

```sh
npm run build
```

Kod kontrolleri:

```sh
npm run check
```

Kaynakları formatlamak için:

```sh
npm run format
```

`js/game.js` ve `dist/` doğrudan düzenlenmemelidir.

## Değişiklik günlükleri

- `changelog/changelog.html`: oyun sürümleri, içerik eklemeleri ve oyuncuya dönük
  değişiklikler
- `CHANGELOG.md`: kod, mimari, araçlar, dokümantasyon ve deployment değişiklikleri

## GitHub Pages

`main` dalına gönderilen değişiklikler `.github/workflows/deploy-pages.yml`
tarafından build edilir, kontrol edilir ve `dist/` klasörü yayınlanır. Repository
ayarlarında bir kez **Pages → Build and deployment → Source → GitHub Actions**
seçilmelidir.

Projede çalışan ajanların kanonik geliştirme kuralları kökteki `AGENTS.md`
dosyasındadır.
