# Fork entegrasyon yol haritası

[English](ROADMAP.md)

Bu yol haritası, üstkaynak Proto23 projesinin üç bağımsız fork'undan nelerin
alınacağını ve bunların bu deponun kendi yapısına nasıl uygulanacağını planlar.
Planlama belgesidir; bunun için henüz hiçbir kaynak değişikliği yapılmamıştır.

Yalnızca git üzerindeki hâlleriyle örnek alınan fork'lar:

- [`tioluko/23html.github.io`](https://github.com/tioluko/23html.github.io)
- [`lgxnders/proto-homage`](https://github.com/lgxnders/proto-homage)
- [`MercuriusXeno/23html.github.io`](https://github.com/MercuriusXeno/23html.github.io)

## Planı belirleyen kararlar

Bu kararlar kesinleşmiştir ve aşağıdaki her faz bunlara uyar.

- **Güç enflasyonu yok.** `MercuriusXeno` deposundaki Kasım 2024 ayarının
  commit'lerinden birinin adı "Cheater edition". Yalnızca açık düzeltmeler
  alınır. Hedef, ne cezalandırıcı ne de sıkıcı olan bir oyundur.
- **Başlangıç olduğu gibi kalır.** `lgxnders` girişi alınmaz. Onun sonraki hikâye
  ilerleyişi, mevcut açılıştan sonra gelen içerik için bağlam olarak uyarlanabilir.
- **Önce hikâye, sonra içerik.** Varlıkların çoğu zaten mevcut; etraflarındaki
  hikâye akışı değil. Aktarım bu boşluğa yöneliktir.
- **Fork'lar referanstır, üstkaynak değil.** Hiçbir şey birleştirilmez. Git
  üzerindeki yayımlanmış hâlleri tek kaynaktır ve üçü de artık hareketsizdir.
- **Atıf changelog'a yazılır.** Bu ailedeki hiçbir depoda lisans dosyası yok; bu
  yüzden alınan her düzeltme ve ekleme, kaynak fork'unu ve commit'ini
  `CHANGELOG.md` içinde anar.
- **Yayım en sona kalır.** Depo herkese açık ve oynanabilir durumda, ancak henüz
  duyurulmadı. Duyuru, bu yol haritası tamamlandığında yapılacak.

## Projenin bulunduğu nokta

Dört depo da Ekim 2022 tarihli aynı iki üstkaynak commit'inden geliyor ve
sonrasında tamamen ayrışıyor. Ortak geçmiş yalnızca bu iki commit olduğu için
`git merge` ve `git cherry-pick` kullanılamaz. Buradaki her aktarım, bu deponun
kendi yapısına elle yapılacaktır.

| Depo                 | Mimari                     |        Kod | Commit | Son     | Karakter                   |
| -------------------- | -------------------------- | ---------: | -----: | ------- | -------------------------- |
| `23html` (üstkaynak) | tek `index.html`           |     14.768 |      2 | 2022-10 | Terk edilmiş               |
| `tioluko`            | `index.html` artı CSS      |     14.840 |     14 | 2025-05 | Hata düzeltme kopyası      |
| `lgxnders`           | Vite ve ESM `src/`         |     22.791 |    108 | 2026-06 | Yeni hikâye, tamamlanmamış |
| `MercuriusXeno`      | TypeScript ve esbuild      |     18.837 |    106 | 2026-07 | Yeniden yapılandırma       |
| **Bu depo**          | **JS modülleri, i18n, CI** | **~34,5k** | **12** | 2026-08 | **Altyapı öncelikli**      |

Yerelleştirmesi, regresyon testleri, derleme hattı ve sürekli dağıtımı olan tek
depo bu. Üç fork'un hiçbirinde bunların hiçbiri yok.

### Asıl dengesizlik

Mevcut kaynakların sayımı, toplamlardan daha kesin bir tablo veriyor.

| Boyut              | Mevcut durum                                           | Değerlendirme    |
| ------------------ | ------------------------------------------------------ | ---------------- |
| Eşyalar            | `js/data/items.js`, 7.434 satır                        | Zengin           |
| Konumlar           | `js/world/locations.js`, 5.331 satır, 69 sahne         | Zengin           |
| Yaratıklar         | `js/data/creatures.js`, 776 satır                      | Yeterli          |
| Unvanlar           | 108 tanımlı, **4 tanesinde mekanik etki var**          | Büyük kısmı atıl |
| Görevler           | **Toplam 5**                                           | Neredeyse yok    |
| Callback kancaları | `callbackManager` var, **yalnızca `callback.onDeath`** | Asgari düzeyde   |

Oyun içerik açısından zengin, hikâye açısından yoksul. Fork'ların kapanmasına
yardım edebileceği boşluk bu; Faz 5'in bölüm uzunluğundan daha önemli olmasının
sebebi de bu.

## Bu depoda hâlâ duran doğrulanmış hatalar

Güncel çalışma ağacına göre doğrulandı. Hiçbiri yerelleştirme maliyeti taşımıyor.

| #   | Belirti                                            | Konum                          | Sebep                                                                                                                                  | Kaynak      |
| --- | -------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 1   | AGL çarpanı her kayıt ve yüklemede 1'e dönüyor     | `js/core/bootstrap.js:391`     | `aglm: you.agml` özellik adını yanlış yazıyor, `undefined` kaydediliyor; `:672` satırındaki yükleyici `1` değerine düşüyor             | `lgxnders`  |
| 2   | Alan boyutları yüklemede kayıyor                   | `js/core/bootstrap.js:962`     | `if (a5[xx])`, boyutu `0` olan alanda hem atamayı hem sayacı atlıyor; `:503` satırındaki kaydetme tarafı sayacı her zaman ilerletiyor  | `mercurius` |
| 3   | Yok etme ve parçalama diyalogları bozuk            | `js/ui/interface.js:5726,5887` | Birimsiz CSS değerleri, sabit `1300 / 2` merkezi, `absolute` konumlandırma ve yığılma bağlamının olmaması                              | `lgxnders`  |
| 4   | "Pause next battle" etiketi yükleme sonrası yanlış | `js/core/bootstrap.js:1001`    | `global.flags = a1.e` bayrağı geri yüklüyor, ancak `dom.d8m1` ve `btl` durumu yeniden eşitlenmiyor                                     | `mercurius` |
| 5   | Bozuk kayıtta temel statların varsayılanı yok      | `js/core/bootstrap.js:660-690` | Toplamsal ve çarpan alanlar `\|\| 0` ve `\|\| 1` ile korunuyor; `str`, `agl`, `int`, `spd`, `luck`, `wealth` temel alanları korunmuyor | `lgxnders`  |
| 6   | Ölümde tokluk cezası beceriyle birlikte artıyor    | `js/core/player.js:139`        | `sat *= 0.55 * (1 - skl.dth.use())` yüksek Ölüm becerisini cezalandırıyor                                                              | `tioluko`   |
| 7   | `detachCallback` yanlış kancayı siliyor            | `js/data/titles.js:674-678`    | `splice(callback.hooks[a], 1)` indeks yerine kanca nesnesini geçiyor; nesne `0` değerine dönüştüğü için ilk kanca siliniyor            | **kendi**   |

Beşinci madde bu kod tabanına göre yeniden ifade edildi. `lgxnders` düzeltmesi
kendi yeniden yazılmış yükleyicilerini hedefliyor; buradaki eşdeğer risk
toplamsal alanlarda değil, temel stat alanlarında.

Yedinci madde, Faz 4 için callback sistemi incelenirken bulundu. Bir fork bulgusu
değildir. Şu anda `detachCallback` işlevinin tek çağıranı olan
`quest.lmfstkil1.rwd()` işlevini etkiliyor.

Altıncı madde alınmak üzere onaylandı: ölmek Ölüm becerisini cezalandırmamalı ve
diriliş sonrası karakter tok kalabilir.

## Yerelleştirme geçidi

Fork'ların tamamı oyuncuya görünen metni kaynak içinde tutuyor. Bu depo tutmuyor.
Bu nedenle alınan her satır üç yerde iş demek: kaynak, `locales/en.json`
içindeki İngilizce anahtar ve `locales/tr.json` içindeki Türkçe çeviri. Eksik bir
anahtar `npm run check` adımını başarısız kılar.

Anahtarlar `content.<tür>.<id>.<alan>` desenini izler, örneğin
`content.wpn.stk1.name`. Kayıtlı türler: `creature`, `effect`, `wpn`, `eqp`,
`sld`, `acc`, `furniture`, `item`, `quest`, `skl`, `ttl`, `weather`, `abl`,
`act`, `rcp`, `vendor`, `mastery` ve `area`.

### Hikâye çalışmasını engelleyen iki mevcut boşluk

İkisi de Faz 5'ten önce kapatılmalı; aksi hâlde yeni görevler sorunu katlar.

- **Görev hedef metni i18n'i atlıyor.** `js/data/quests.js` içindeki `goals()` ve
  `goalsf()` işlevleri koda gömülü İngilizce döndürüyor, örneğin
  `"Firewood collected: …"` ve `"Wolves killed: …"`.
- **Unvan yetenek metni i18n'i atlıyor.** `js/data/titles.js` içindeki `tdesc`
  değerleri koda gömülü İngilizce, örneğin
  `"Running consumes 5% less energy"`.

İkisi de `tests/check-i18n.js` tarafından yakalanmıyor; bu betik diller arasında
anahtar yapısını karşılaştırıyor ve hiç anahtara dönüşmemiş bir metni göremiyor.

## GitHub Pages

Mevcut akış baştan sona incelendi. `.github/workflows/deploy-pages.yml`, `main`
dalına push geldiğinde derliyor, `npm run check` ve `npm run test:browser`
çalıştırıyor, ardından `dist/` dizinini yükleyip dağıtıyor. İzinler asgari
düzeyde ve eşzamanlılık ayarı bir dağıtımın yarıda kesilmemesini sağlıyor.

Şu anda düzgün çalışan ve değişiklik gerektirmeyenler:

- **Önbellek kırma sağlam.** `scripts/build-site.js`; `css/game.css`,
  `js/game.js`, `js/i18n-loader.js` ve her yerel ayar dosyasını tek bir varlık
  sürümüne özetliyor, sonra `index.html` dosyasını yeniden yazıyor.
  `js/i18n-loader.js` bu sürümü kendi betik adresinden okuyup oyun paketine,
  manifest'e ve her yerel ayar isteğine aktarıyor; böylece bir sürüm önbellekteki
  varlıkları karıştıramıyor.
- **`.nojekyll` dosyası** `dist/` içine yazılıyor.
- **Duman testi sessizce atlamak yerine yüksek sesle başarısız oluyor**; ayrıca
  `ubuntu-latest` üzerinde aday listesinde bulunan `/usr/bin/google-chrome`
  hazır geliyor.

Oyun duyurulmadan önce kapatılması gereken üç boşluk:

| Boşluk                        | Ayrıntı                                                                                                                                                     | Ne zaman       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Pull request doğrulaması yok  | Akış yalnızca `main` dalına push ve `workflow_dispatch` ile tetikleniyor. Başkalarının fork'layabileceği açık bir depoda gelen değişiklikler test edilmiyor | Faz 0          |
| Paylaşım meta etiketleri yok  | `index.html` içinde `description`, Open Graph veya `theme-color` etiketi yok. Paylaşılan bağlantı yalın bir başlık olarak görünüyor                         | Duyurudan önce |
| Dağıtım çıktısı denetlenmiyor | `npm run check` kaynakları doğruluyor; `dist/` dizininin kendisinin yüklendiğini hiçbir şey doğrulamıyor. Duman testi yerel sunucuya karşı çalışıyor        | Faz 1          |

## Faz 0 — Hazırlık

Kaynak değişikliği ve sürüm artışı yok.

- Üç fork'u salt okunur uzak depo olarak ekle ki `git log` ve `git show` referans
  olarak kullanılabilsin. Asla birleştirme veya çekme yapma.
- `MercuriusXeno` deposunun kurtarılan denge çalışmasını sabitle. Kasım 2024 dal
  ucu `fe96bc0^`; çalışma Haziran 2025'te "Putting everything back to vanilla"
  commit'iyle geri alındı ancak hâlâ erişilebilir. Faz 2'nin başvuracağı tek
  kaynak budur.
- Akışa, dağıtım yapmadan derleyip denetleyen bir `pull_request` tetikleyicisi
  ekle.
- `scripts/` dizininden `tests/` dizinine taşıma dâhil, mevcut çalışma ağacı
  değişikliklerini commit'le ki sonraki aktarım farkları okunabilir kalsın.

## Faz 1 — Hata düzeltmeleri

Düşük risk, yerelleştirme maliyeti yok, hedef sürüm 475. Yukarıdaki yedi hatanın
tamamı.

- **1 ve 2 ile başla.** İkisi de kayıt biçimini değiştirmiyor, yalnızca yükleme
  davranışını düzeltiyor; ayrıca 2 numara hâlihazırda tutarsız olan kayıtları
  onarıyor.
- **Üçüncü hata mevcut olanı yeniden kullanır.** Bu depoda zaten düzgün bir modal
  var: `dom.save_delete_modal`, `showModal()` kullanan yerel bir `<dialog>`;
  `game-modal` sınıf ailesi, ARIA bağlantıları, arka plana tıklayarak kapatma ve
  odak geri yükleme içeriyor. Yapılacak iş, bundan yeniden kullanılabilir bir
  `showConfirmModal({ title, message, confirmLabel, onConfirm })` yardımcısı
  çıkarmak ve hem yok etme hem parçalama diyaloğunu bunun üzerinden geçirmek.
  Yalnızca satır içi stilleri onaran `lgxnders` yamasına gerek yok.
- **Yedinci hata diğerlerinden bağımsızdır** ve uygun görülürse en başta
  yapılabilir.
- `AGENTS.md` gereği her düzeltme, dağıtımdan önce
  `tests/check-game-regressions.js` veya `tests/browser-smoke-test.js` dosyasını
  genişletir.

Bu fazın geride bıraktığı yeniden kullanılabilir parça, çıkarılan modal
yardımcısıdır; sonraki fazlar onay gereken her yerde bunu kullanır.

## Faz 2 — Düzeltmeler ve ölçülü denge

Orta risk, düşük yerelleştirme maliyeti, hedef sürüm 476. Kurtarılan Kasım 2024
çalışmasından, güç enflasyonu yok kararına göre süzülerek alınır.

### Alınacaklar — açık düzeltmeler

| Değişiklik               | Ayrıntı                                                                                          | Neden uygun                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Düşme oranı yazım hatası | `lckl` için `global.wdrop`, `.0000048` yerine `.000048`                                          | Eksik bir sıfır; ayar tercihi değil                                           |
| Nadir düşme kapsamı      | `global.rdrop` içine `mnblm` ve `stthbm1`–`4`                                                    | Moon Bloom'un tek alana bağımlılığını kaldırır                                |
| Ölümde tokluk            | `0.55 * (1 - dth)` yerine `0.45 * (1 + dth)`                                                     | Altıncı hata; mevcut formül ödüllendirmesi gereken beceriyi cezalandırıyor    |
| INT ölçekli iyileştirme  | `hrb1`, `hlpd`, `hptn1`–`4` eşyalarına bağlanan ortak `healingEfficacy()` ve `healingFunction()` | INT'i zanaat dışında da anlamlı kılar ve araç ipucunda gerçek sayıyı gösterir |

Buradaki tek yerelleştirme maliyeti iyileştirme değişikliğinde: açıklamalar
hesaplanan miktarı bildiren fonksiyonlara dönüşüyor, dolayısıyla anahtarlarının
interpolation yer tutucularına ihtiyacı var. Yükleyici bunu zaten destekliyor.

### Tek tek değerlendirilecekler — önce ölç, sonra karar ver

Bunların hiçbiri fork'un otoritesine dayanarak alınmaz. Her biri ayrı ve
ölçülebilir bir değişikliktir.

| Değişiklik                  | Ayrıntı                                                               | Dikkat edilecek                                                  |
| --------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Eğitim kuklası düşme sınırı | `you.lvl <= 20` yerine `50`                                           | Sayıları yükseltmeden erken oyun darboğazını azaltır             |
| Alan boyutları              | `frstn1a2` 60→20, `frstn2a2` 50→20, `frstn9a1` 48→28, `hmbsmnt` 10→50 | Tekrar döngülerini kısaltır; ikinci hata düzeltilmeden ölçülemez |
| `creature.tdummy.id`        | `103` yerine `102`                                                    | Yalnızca gerçek bir çakışma doğrulanırsa alınır                  |

### Alınmayacaklar

Beceri deneyim eğrisi değişikliği, `log(9 * lvl + 1)` yerine
`log(6 * lvl + 1)`, dışarıda bırakılır. Bu, tüm becerilerin aynı anda küresel
olarak hızlanması demektir; bu planın dışladığı güç enflasyonunun ta kendisi.

## Faz 3 — İçerik ve ilerleme derinliği

Orta risk, yüksek yerelleştirme maliyeti, hedef sürümler 477 ve 478. Maliyeti
artan sırayla üç adım.

### Faz 3a — Unvan etkileri

En düşük riskle en yüksek değer, üstelik yeni bir altyapı gerektirmiyor. Yetenek
sistemi zaten kurulu ve bağlı: `bootstrap.js:1119` ile `simulation.js:1270`
`talent()` işlevini uyguluyor, `interface.js:3522` ise `tdesc` değerini
`ui.itemDescription.talentEffect` üzerinden gösteriyor.

108 unvanın yalnızca 4'ünde etki var. Kalan 104'ü, oyuncunun zaten kazandığı
kilometre taşları için yalnızca anlatı metni. Bunlara ölçülü ve temaya uygun
etkiler vermek, mevcut ilerlemeyi şişirmek yerine ödüllendirir; bu da güç
enflasyonu yok kuralına herhangi bir sayısal ayardan daha iyi uyar.

Ön koşul: mevcut `tdesc` metinlerini `locales/` altına taşı, sonra her yeni
yetenekle birlikte anahtarlarını ekle.

### Faz 3b — Patchwork setini tamamla

`eqp.ptchhd`, `eqp.ptchglv`, `rcp.ptchhd` ve `rcp.ptchglv` eklenir; `item.bfsnwt`
defteri yeni tarifleri de öğretir. Bu, zaten var olan bir setteki boşlukları
kapatır; yeni bir sistem gerektirmez ve mevcut ilerleme eğrisine oturur.

Aynı fork'taki `wpn.axe1` **alınmaz**; setin ihtiyaç duymadığı, ilgisiz bir
silah.

Set tamamlandıktan sonra, tüm parçalar birlikte kuşanıldığında bir **set etkisi**
düşünülebilir. Bu, bir aktarım değil bu projenin kendi tasarımı olur ve
tamamlanmış sete tek tek statlarının ötesinde bir var olma sebebi verir.

### Faz 3c — Beceri kilometre taşı tablolarını doldur

`MercuriusXeno`, burada hâlâ boş olan kilometre taşı tablolarını doldurmuş:
`skl.mdt`, `skl.crft`, `skl.thr`, `skl.ntst` ve genişletilmiş `skl.alch`. Boş
tablo, o becerilerin şu anda hiçbir ödül vermeden seviye atlaması demek;
dolayısıyla bunları doldurmak güç eklemek değil, bir eksiği gidermektir.

Aynı çalışma, hâlihazırda girdisi olan tablolara 3, 4, 6, 9 ve 12. seviyelerde
ara basamaklar da ekliyor. Bunlar erteleniyor: zaten ödül veren becerilere daha
sık ödül eklemek, güç enflasyonunun devreye gireceği yer.

Her basamağın bir `p:` etiketi var, bu yüzden yol haritasının çeviri yükü en ağır
maddesi budur. Önce boş tabloları doldur ve orada dur.

## Faz 4 — Mimari

Fork'ların kendi yapısına göre değil, bu kod tabanına göre yeniden değerlendirildi.
İlk taslaktaki üç maddenin ikisi bu incelemeden geçemedi.

### Mevcut callback sistemini genişlet

`js/data/titles.js` içinde `callbackManager`, `attachCallback` ve
`detachCallback` zaten tanımlı, ancak tek bir kanca var: dört çağrı noktasıyla
`callback.onDeath`. Bu, kod tabanının kendi olay mekanizması.

`MercuriusXeno` olay veri yolu **alınmaz**. Onu almak, bunun yanına ikinci ve
paralel bir dağıtım sistemi kurmak olurdu. Eşdeğer kazanç, hâlihazırda var olana
kanca eklemekten gelir; seviye atlama, alana giriş, zanaat ve görev tamamlama
gibi noktalar Faz 5'in ihtiyaç duyacağı şeyler.

Önce yedinci hatayı düzelt; ayırma yolu yanlış girdiyi silen bir dağıtıcıyı
genişletmek hatayı yayardı.

### Yalnızca yeni içerik için sahne yardımcısı ekle

`lgxnders` deposundaki seçenek nesnesi kalıbı, `new Chs({ id, sl })`, ilk
taslakta olduğundan fazla değerlendirilmişti. Bu depoya göre ölçüldüğünde, sahne
başına şablon kod 69 sahnede yaklaşık dört satır; yani `js/world/locations.js`
dosyasındaki 5.331 satırın 300'ünün altında. Dosyanın büyük kısmı sahne
içeriğidir ve kalıp ona dokunmaz.

Bu yüzden mevcut 69 sahne **yeniden yazılmaz**. Etkin biçimde düzenlenen bir
dosyada büyük ve mekanik bir fark, inceleme zamanı harcar ve neredeyse hiçbir şey
kazandırmaz. Kalıp yalnızca Faz 5'in ekleyeceği yeni sahneler için bir yardımcı
olarak alınmaya değer; orada okunabilirliği gerçekten artırır.

### CSS değişkenleri ve anlamlı sınıf adları

Bu madde geçerliliğini koruyor. `MercuriusXeno` deposu,
`docs/frontend-refactoring.md` ve `docs/CLASS_MAP.md` dosyalarını içeriyor;
bunlar `inv_slot`, `crf_lg` ve `opt_c` gibi kapalı adları anlamlı karşılıklarına
eşleyen hazır tablolar. Doğrudan `css/game.css` dosyasına uygulanabilirler ve iş
mekanik ve test edilebilir.

### Alınmayacaklar

Tam bir TypeScript göçü; derlemenin, yerel ayar yükleyicisinin, test paketinin ve
dağıtımın yeniden yazılmasını gerektirir. `AGENTS.md` ayrıca modül kapsamını ve
katı modu ayrı ve bilinçli bir göç olarak ele alıyor, çünkü paket küresel işlev
yukarı taşımasına ve `scripts/build.js` içindeki kaynak sırasına bağlı. `checkJs`
ile JSDoc, maliyetin küçük bir kısmıyla ileride hâlâ kullanılabilir.

## Faz 5 — Hikâye

En büyük faz ve projenin asıl ihtiyaç duyduğu şey. Başlangıca dokunulmaz.

### Hikâye şu anda nerede duruyor

Beş görev var. Bunlardan üçü — `fwd1`, `hnt1` ve `lmfstkil1` — **Western Woods,
Hunter's Lodge** konumuna bağlı; `grds1` Village Center pazar kapısında; `test`
ise bir yer tutucu. `lmfstkil1` sonrasında ip ucu tamamen kopuyor; oysa dünya,
eşyalar ve yaratıklar çok daha ileriye devam ediyor.

### `lgxnders` neden tam buraya oturuyor

Onların Western Woods genişlemesi aynı kulübeye bağlanıyor. Oyuncunun bulduğu not
_"Head Hunter, Yamato"_ imzalı ve kulübenin kapısına asılı — yani bu deponun üç
görevinin zaten etrafında döndüğü binanın kapısına. O avcıya bir isim, ortadan
kaybolması için bir sebep ve gittiği bir yön veriyorlar.

Bu, anlatı açısından hiçbir bedeli olmayan kullanılabilir bir kanca: başlangıca
dokunmuyor, kurulmuş hiçbir şeyle çelişmiyor ve mevcut bir görev merkezini devam
eden bir ip ucuna dönüştürüyor. Nehir, nehir adamı ve kulübe dizisi aynı
güzergâhın ilerisinde duruyor ve sonraki bağlam olarak uyarlanabilir.

Öneri, **ip ucunu ve bağlanma noktalarını** uyarlamak; çeviri yerine Türkçe ve
İngilizce olarak doğrudan yazmak; onların düzyazısını, yer tutucularını ve
`@Todo` işaretlerini geride bırakmak.

### Ön koşullar

- Yukarıda adı geçen iki yerelleştirme boşluğunu kapat; aksi hâlde yeni görevler
  koda gömülü İngilizceyi katlar.
- Faz 4 callback kancalarını devreye al; görev ilerleyişi `onDeath` kancasından
  fazlasını gerektiriyor.
- Yeni konumlar için sahne yardımcısını hazır bulundur.

## Bilinçli olarak dışarıda bırakılanlar

Bunların her biri ilgili fork'un kendi dalında bilinen bir sorundur ve toplu bir
aktarımda fark edilmeden içeri sızardı.

| Madde                          | Gerekçe                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `skl.fdpnr` 1. seviye          | `MercuriusXeno` `exp_t += 0.3` yazmış ama etiket hâlâ `+3%` diyor; test sırasında kalmış on kat sapma        |
| Beceri deneyim eğrisi          | Tüm becerilerin küresel hızlanması; güç enflasyonu yok kararıyla dışlandı                                    |
| Ara kilometre taşları          | Zaten ödül veren becerilere daha sık ödül; aynı gerekçeyle ertelendi                                         |
| `wpn.axe1`                     | Patchwork setiyle ilgisiz ve gereksiz                                                                        |
| `You.rank()` ölçek katsayısı   | `lgxnders` `50000000000000` değerini gerekçe belirtmeden `850727696967670912` yapmış                         |
| `skl.sleep.use`                | `lgxnders` `5 * lvl * x.sq` ifadesini `5 * this.level` yapmış ve `//@Todo fix errors with x` notunu bırakmış |
| Şömine işleyişi                | `lgxnders` `/* @Todo fix fire */` ile tamamen yorum satırına almış                                           |
| `lgxnders` başlangıcı          | Mevcut başlangıç kalır; yalnızca sonraki hikâye bağlamı uyarlanır                                            |
| `lgxnders` hikâye eşyaları     | `item.sp4` 185.000.000 EXP veriyor; onların açılışına göre ayarlanmış ve o olmadan dengesiz                  |
| `MercuriusXeno` olay veri yolu | Mevcut `callbackManager` yapısını tekrarlardı                                                                |
| 69 sahnenin yeniden yazılması  | Büyük ve mekanik fark, ihmal edilebilir kazanç                                                               |
| Tam TypeScript göçü            | Derleme, yerel ayar yükleyicisi, testler ve dağıtımın yeniden yazılmasını gerektirir                         |
| `tioluko` deposunun tamamı     | Bir değişiklik burada zaten uygulanmış, biri Faz 2'ye alındı, CSS ayrımı ise bizimkinden zayıf               |

## Atıf

Bu ailedeki hiçbir depoda lisans dosyası yok ve üç fork da artık hareketsiz.
Alınan her düzeltme ve ekleme, kaynak fork'unu ve commit'ini `CHANGELOG.md`
içinde anar. Bu hem doğru davranış hem de bir aktarımı sonradan izlemenin tek
yoludur.
