# Echoes Beneath

[English](README.md)

Echoes Beneath, herhangi bir backend gerektirmeden tarayıcıda çalışan erken
aşama bir oyundur. Repository aynı zamanda GitHub Pages üzerinden yayınlanacak
statik siteyi içerir.

Proje, üstkaynak `Proto23` oyununun bir fork'u olarak başladı ve repository bu
adı koruyor. `Proto23`, npm paket adı ve saklanan dil tercihi anahtarı gibi
teknik tanımlayıcılarda hâlâ geçiyor; mevcut kayıtlar ve tercihler çalışmaya
devam etsin diye bunlar bilinçli olarak değiştirilmedi.

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
- `js/systems/`: aksiyon, üretim, savaş, efekt, simülasyon ve planlama sistemleri
- `js/ui/`: arayüz ve render kodu, yüzeyine göre bölünmüş — paneller, imleç
  açıklamaları ve mesaj günlüğü ayrı dosyalarda
- `js/world/`: bölgeler, sektörler ve konumlar
- `js/utils/`: genel yardımcılar — DOM kurulumu, nesne kopyalama, rastgele sayı ve
  kayıt kodlaması
- `locales/`: dil kayıt listesi ve JSON çeviri dosyaları
- `scripts/`: bundle ve yayın çıktısı araçları

Eski oyun, tüm fonksiyon bildirimlerinin başlangıçtan önce erişilebilir olmasına
bağımlıdır. Bu nedenle `js/game.js` üretilen tarayıcı bundle'ıdır.
`scripts/sources.js` kaynak dosyaları birleştirilme sırasına göre listeler ve bu sıra
yükleme sırasıdır: `function` bildirimi tüm bundle boyunca hoist edilir, `const`
edilmez — dolayısıyla sabitleri başka bir dosyanın tanım anındaki kodu tarafından
okunan bir dosya önce gelmek zorundadır. Bunu yapan dosya `js/ui/tooltip.js`. Kaynak dosyaları
düzenledikten sonra bundle ve GitHub Pages çıktısını yeniden oluşturun:

```sh
npm run build
```

Kod kontrolleri:

```sh
npm run check
npm run test:browser
```

`npm run check`, `scripts/check.js` içindeki on yedi adımı en ucuzdan başlayarak çalıştırır ve
ilk hatada hangi adım olduğunu söyleyip durur. Bir adım üzerinde çalışırken:

```sh
npm run check -- --only=combat
```

Tarayıcı regresyon testleri geciken assetleri, tutarlı önbellek sürümlerini,
Türkçe başlangıcı, önbellekli profille yeniden yüklemeyi, bozuk kayıt kurtarmayı,
ekrana sığdırmayı, alt kayıt çubuğu yerleşimini, dilden bağımsız takvim davranışını
ve proje-alt-yolu changelog bağlantısını kapsar. Tema ölçeğini, mesaj günlüğü
kontrol sınırlarını, birbirinden ayrılmış arka plan hazır ayarı kontrollerini ve
onaylı güvenli kayıt silmeyi de doğrular. Hata düzeltmeleriyle davranış
değişiklikleri deployment öncesinde ilgili regresyon kapsamını genişletmelidir.
Kayıt silme modalı testleri yerelleştirme, odağı geri getirme, Escape, arka plana
tıklayarak vazgeçme, ekran sınırlarına sığma ve tercihleri korumayı kapsar.

Tam sayı oyun sürümü hata düzeltmeleri, özellikler veya oyuncuya dönük eklemeler
içeren anlamlı yayın kilometre taşlarında artırılır. Birbiriyle ilişkili küçük
düzeltmeler ve arayüz iyileştirmeleri ayrı sürümler almak yerine mevcut sürüm
kaydında biriktirilir. `changelog/changelog.html` içindeki en yeni aralığın sonu
aynı sürüm olmalıdır; otomatik kontroller uyumsuzluğu reddeder. Yalnızca
formatlama veya dokümantasyon değişiklikleri sürüm artışı gerektirmez.

Kaynakları formatlamak için:

```sh
npm run format
```

İlişkili değişiklikler biriktirilebilir. Commit oluşturmadan veya push yapmadan
önce repository sahibinden açık onay isteyin; iki işlem de otomatik değildir.

`js/game.js` ve `dist/` doğrudan düzenlenmemelidir.

## Diller

İngilizce metinler `locales/en.json`, eksiksiz Türkçe çeviri `locales/tr.json`,
kullanılabilir diller ise `locales/manifest.json` içinde tutulur. Dil, Ayarlar
ekranından değiştirilebilir ve oyun kayıtlarından bağımsız olarak saklanır. Dil
doğrulaması, kayıtlı her dilin İngilizce anahtar yapısını, değişken yer tutucuları
ve HTML biçimlendirme parçalarını eksiksiz korumasını zorunlu tutar.

Makine destekli çeviriler, dili bilen bir ajan tarafından bağlamsal olarak
denetlenmelidir. Kısaltmalar ile kısa veya çok anlamlı etiketler gerçek arayüz
anlamını korumalıdır; örneğin gün listesindeki İngilizce `Sun.`, astronomik güneşi
değil Sunday yani Pazar gününü belirtir. Diyalog ve eylem etiketleri çevredeki
sahne, komşu mesajlar ve ortaya çıkan oyun davranışıyla birlikte kontrol
edilmeli; yüksek riskli düzeltmeler `tests/translation-expectations.tr.json`
dosyasına eklenmelidir.

Bir dili doğrudan test etmek veya paylaşmak için `?lang=tr` gibi `lang` sorgu
parametresini kullanın. Geçerli sorgu seçimi o sayfa yüklemesinde uygulanır;
Ayarlar üzerinden yapılan değişiklik kalıcı tercih olarak saklanır.

Almanca gibi başka bir dil eklemek için:

1. `locales/en.json` dosyasını `locales/de.json` olarak kopyalayın ve anahtarları
   değiştirmeden değerleri çevirin.
2. Dil kodunu, görünen adını ve dosyasını `locales/manifest.json` içine ekleyin.
3. `npm run format`, `npm run build` ve `npm run check` çalıştırın.

Başka bir dilde eksik kalan anahtarlar İngilizceye geri döner.

## Değişiklik günlükleri

- `changelog/changelog.html`: oyun sürümleri, içerik eklemeleri ve oyuncuya dönük
  değişiklikler
- `docs/CHANGELOG.md`: kod, mimari, araçlar, dokümantasyon ve deployment
  değişiklikleri

## GitHub Pages

`main` dalına gönderilen değişiklikler `.github/workflows/deploy-pages.yml`
tarafından build edilir, kontrol edilir ve `dist/` klasörü yayınlanır. Repository
ayarlarında bir kez **Pages → Build and deployment → Source → GitHub Actions**
seçilmelidir.

Deployment build'i CSS, JavaScript ve dil isteklerine içerik özeti ekler; böylece
yeni sürüm, eski sürümden önbellekte kalan dosyalarla karışarak askıda kalmaz.

Bakımı yapılan yayın
[`https://kuroiteiken.github.io/Echoes-Beneath/`](https://kuroiteiken.github.io/Echoes-Beneath/)
adresindedir. Upstream proje ayrıca
[`https://23html.github.io/`](https://23html.github.io/) adresinde çalışır. Forklar
ve proje Pages siteleri repository alt yolunda yayınlanabileceği için dahili
bağlantılar göreli olmalı veya `document.baseURI` üzerinden çözülmelidir;
`/changelog/...` gibi köke göre yollar taşınabilir değildir.

## Dokümantasyon

Referans belgeler `docs/` altında tutulur; kökte yalnızca bu rehber ve Türkçe
çevirisi kalır.

- `docs/AGENTS.md`: projede çalışan ajanlar için kanonik geliştirme kuralları.
  Kökteki `AGENTS.md`, dosyayı kökte arayan ajan araçları çalışmaya devam etsin
  diye bırakılmış bir yönlendirmedir.
- `docs/STORY.md`: görev zincirinin mevcut durumu, hikayenin bittiği nokta ve
  yazılmış ama henüz erişilemeyen içerik.
- `docs/CHANGELOG.md`: repository değişiklikleri.

Her belgenin senkron tutulması gereken bir `.TR.md` Türkçe karşılığı vardır.
