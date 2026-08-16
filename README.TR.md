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

Dil JSON dosyaları `fetch` ile yüklendiği için `dist/index.html` dosyasını
doğrudan açmak yerine oluşturulan siteyi HTTP üzerinden çalıştırın:

```sh
npm run serve
```

Ardından `http://127.0.0.1:8080` adresini açın.

## Kaynak yapısı

- `css/`: oyun stilleri
- `js/core/`: başlangıç, kayıt/yükleme ve oyuncu durumu
- `js/data/`: eşya, ekipman, yetenek, görev ve yaratık tanımları
- `js/systems/`: aksiyon, üretim, efekt, simülasyon ve planlama sistemleri
- `js/ui/`: arayüz ve render kodu
- `js/world/`: bölgeler, sektörler ve konumlar
- `js/utils/`: rastgele sayı ve kodlama yardımcıları
- `locales/`: dil kayıt listesi ve JSON çeviri dosyaları
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
npm run test:browser
```

Kaynakları formatlamak için:

```sh
npm run format
```

`js/game.js` ve `dist/` doğrudan düzenlenmemelidir.

## Diller

İngilizce metinler `locales/en.json`, eksiksiz Türkçe çeviri `locales/tr.json`,
kullanılabilir diller ise `locales/manifest.json` içinde tutulur. Dil, Ayarlar
ekranından değiştirilebilir ve oyun kayıtlarından bağımsız olarak saklanır. Dil
doğrulaması, kayıtlı her dilin İngilizce anahtar yapısını, değişken yer tutucuları
ve HTML biçimlendirme parçalarını eksiksiz korumasını zorunlu tutar.

Almanca gibi başka bir dil eklemek için:

1. `locales/en.json` dosyasını `locales/de.json` olarak kopyalayın ve anahtarları
   değiştirmeden değerleri çevirin.
2. Dil kodunu, görünen adını ve dosyasını `locales/manifest.json` içine ekleyin.
3. `npm run format`, `npm run build` ve `npm run check` çalıştırın.

Başka bir dilde eksik kalan anahtarlar İngilizceye geri döner.

## Değişiklik günlükleri

- `changelog/changelog.html`: oyun sürümleri, içerik eklemeleri ve oyuncuya dönük
  değişiklikler
- `CHANGELOG.md`: kod, mimari, araçlar, dokümantasyon ve deployment değişiklikleri

## GitHub Pages

`main` dalına gönderilen değişiklikler `.github/workflows/deploy-pages.yml`
tarafından build edilir, kontrol edilir ve `dist/` klasörü yayınlanır. Repository
ayarlarında bir kez **Pages → Build and deployment → Source → GitHub Actions**
seçilmelidir.

Bakımı yapılan yayın
[`https://kuroiteiken.github.io/23html.github.io/`](https://kuroiteiken.github.io/23html.github.io/)
adresindedir. Upstream proje ayrıca
[`https://23html.github.io/`](https://23html.github.io/) adresinde çalışır. Forklar
ve proje Pages siteleri repository alt yolunda yayınlanabileceği için dahili
bağlantılar göreli olmalı veya `document.baseURI` üzerinden çözülmelidir;
`/changelog/...` gibi köke göre yollar taşınabilir değildir.

Projede çalışan ajanların kanonik geliştirme kuralları kökteki `AGENTS.md`
dosyasındadır.
