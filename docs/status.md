# Echoes Beneath — oturum devir özeti

Son güncelleme: 2026-08-19. Bir önceki oturumun devir notlarını, o notlardan
sonra yapılan işi ve [`refactorplan.md`](refactorplan.md) ile birlikte
değerlendirilmiş sırayı taşır.

## Proje

`Kuroiteiken/Echoes-Beneath` (2026-08-19'a kadar `23html.github.io` adındaydı; yayın adresi
artık `https://kuroiteiken.github.io/Echoes-Beneath/`). Yerel klasör adı bir tercih meselesi
ve depo adıyla aynı olmak zorunda değil — kodda köke göre hiçbir yol yok, `localStorage`
anahtarları origin bazlı, dolayısıyla ad değişikliği hiçbir şeyi kırmıyor. Tarayıcı RPG'si.
`scripts/build.js` 28 kaynağı `js/game.js`'e birleştiriyor — `js/game.js` üretilmiş dosya,
asla okuma/düzenleme. Gerçek kaynaklar `scripts/sources.js`'te listeli.

## Durum

Sürüm v478.28. Bu oturumda çalışma ağacında değişiklik var, henüz commit
edilmedi. `npm run check` sıfır çıkış koduyla geçiyor.

### Bu oturumda yapılanlar

- **Refactor incelemesi** yazıldı: [`refactorplan.md`](refactorplan.md). Ölçüme
  dayalı, önceliklendirilmiş, tamamlananlar `✅` ile işaretleniyor.
- **P0 tamamlandı** (üç madde birden, aşağıda ayrıntı).
- **P1.1 tamamlandı**: savaş `js/systems/combat.js`'e taşındı (691 satır).
  `interface.js` 8.689 → 8.013.
- **P1.2 tamamlandı**: `addElement`/`empty` → `js/utils/dom.js`,
  `deepCopy`/`copy` → `js/utils/object.js`. Her iki taşıma da parmak iziyle saf
  olduğu kanıtlandı.
- **P3.1 kademe 1 tamamlandı**: yerel dosyalar `Promise.all` ile paralel isteniyor.
- **`tests/fingerprint.js` eklendi** — taşımaların saflığını kanıtlayan araç.
- **P2.1 tamamlandı**: 186 yiyecek maddesi `eatUse()` fabrikasına indi,
  `items.js` 7.639 → 5.437 satır. Plan 221 madde diyordu; envanter 30 ayrı şekil
  buldu, yalnızca kalabalık ikisi (119 + 67) dönüştürüldü.
- **`tests/fingerprint.js` genişletildi**: artık her eşyanın `use` handler'ını da
- **P2.3 tamamlandı**: 16 gömülü tarayıcı probu `tests/probes/` altına taşındı.
  `scripts/serve.js` 1.961 → 193 satır. Prob kodu artık eslint ve prettier
  kapsamında; şablon dizesi içindeyken hiçbir denetim görmüyordu.
  ölçüyor (352 handler). Veri katmanı refactor'ları için zorunlu araç.
- **`check-game-regressions.js`'e `bundleSource` eklendi**: yasaklar ve davranış
  sözleşmeleri artık tek dosyaya değil paketin tamamına bağlı.
- **P4.2 tamamlandı**: `docs/ROADMAP.md` referansları dört dosyadan kaldırıldı
  (dosyayı depo sahibi sildi).
- **Pages workflow'u**: `.md`/`.MD` push'larında çalışmıyor (`paths-ignore`),
  `timeout-minutes` (build 20, deploy 10) ve `persist-credentials: false`
  eklendi.
- `docs/CHANGELOG.md` ve `.TR.md` güncellendi.
- **P3.1 kademe 2 tamamlandı**: `manifest.json`'a `complete` bayrağı; Türkçe oyuncu
  artık `en.json` (348 KB) indirmiyor. `check-i18n` bayrağı doğruluyor.
- **P3.2 tamamlandı**: `index.html` paketi `?v=` damgalı `preload` ile önyüklüyor.
- **P1.3 kısmen tamamlandı**: `message-log.js` (190), `panels.js` (975),
  `tooltip.js` (795) çıkarıldı. **`interface.js` 8.689 → 6.075 satır (%30).**
  `preferences.js` gerekçeli atlandı (DOM kurulumuyla iç içe + `const` TDZ).
- **P4.3 kısmen tamamlandı**: üç liste yüzeyi CSS custom property'sine çevrildi
  (20 kullanım, iki yazım birleşti). Kalan renkler anlamları doğrulanmadığı için
  bırakıldı.
- **Yeni prob**: `tests/probes/list-surfaces.js`.
- **P4.1 tamamlandı**: oyuncu adı iki noktada temizleniyor, HUD `textContent` yazıyor.
  Yeni prob `tests/probes/player-name-safety.js`. Negatif kontrolü yapıldı ve
  katmanların ayrı ayrı korunduğu doğrulandı.
- **P3.3 yapılmayacak**: depo sahibi minify istemiyor. Madde kapalı.
- **v478.29 yayına hazır** (ilk oyuncuya dönük sürüm bu oturumda): dışa/içe aktarma
  pencereleri `game-modal` iskeletine taşındı, kopyala/yapıştır eklendi,
  `#save-bar-restore` alt barın tasarımına uyarlandı, iki tutamağa klavye erişimi.
- **`createGameModal()` eklendi**: oyundaki her diyaloğun kurulduğu ortak iskelet.
  Esc, arka plan tıklaması, odak geri verme ve kapanınca DOM'dan silinme onda.
- **P4.5 kısmen**: `.gitignore` artıkları temizlendi. Ölü kod **silinmedi** —
  gerekçe aşağıda.
- **P4.4 kısmen**: alt barın iki tutamağı klavyeyle erişilebilir. `chs()` bekliyor.
- İki değişiklik de regresyon testli ve **negatif kontrolü yapılmış** (koruma
  kaldırıldığında test kırılıyor).

## Değişmez kurallar

- "Cheater edition" güç şişmesi yok. Yalnızca net düzeltmeler ve tematik, ölçülü
  etkiler.
- Oyunun açılışı değiştirilmiyor.
- `perk` → "Avantaj", asla "Yetenek".
- Türkçe eylem etiketleri emir kipi. Ve Türkçe **çeviri değil, doğrudan Türkçe
  yazılıyor** — bir önceki oturumda İngilizce deyimi birebir taşıyıp yedi metni
  yeniden yazmak gerekti ("yüz" = kömür damarı sanmak, "basamağı okumak" gibi).
- Teknik tanımlayıcılarda `proto23` değiştirilmiyor, yalnızca görünen metin.
- `changelog/changelog.html` her zaman güncellenir, asla atlanmaz.
- Tamamlanan işler `PROPOSALS`'tan çıkarılır.
- Onay beklemeden sürekli commit'lenir. Alt ajanlar ve workflow'lar yetkili.
- Her oyuncuya yansıyan değişiklik: `global.subver++`, `releaseNotes` girdisi, iki
  dilde `ui.releaseNotes.*`, changelog satırı. Yoksa `check-version` kırılır.

## Kayıt biçimi tuzakları (en pahalı bilgi)

- Alan boyutları konumsal → yeni alan yalnızca sona eklenir. Son alan şu an
  `area.mine3` (id 131).
- Kilometre taşı verilme bayrakları konumsal → yeni taş sona eklenir.
- Ekipman geri yüklemesi registry'den yeniden kurup yalnızca `dp` ve `data`'yı
  kopyalar → her bonus `data`'dan türetilmeli (`data.plus` keskinleştirme,
  `data.kills` rütbe). `str`'ye yazılan bonus yüklemede yok olur.
- Kilometre taşının `f()`'i bir kez çalışır, yüklemede tekrarlanmaz → yalnızca
  kendisi kaydedilen alanlara yaz: `stra`, `agla`, `inta`, `spda`, `hpa`, `sata`.
- `a1` JSON globals bloğu genişletmeye güvenli (`global.lore`, `global.regions`
  orada).
- Satıcı durumu anahtarla kaydediliyor (konumsal değil) → yeni satıcı eski
  kayıtları bozmaz.
- `global.ver` arttırmak geri dönüşsüz: yeni kayıt eski yapıya düşerse göç
  çalışmaz. Göç mekanizması `{globals, mods, player}` alıyor ve "toplama tamamla"
  biçiminde yazılır. **Kullanıcı sürüm arttırımına ve göçe izin verdi** — bu,
  `refactorplan.md`'nin "Dokunulmayacaklar" başlığındaki kayıt biçimi maddesini
  yumuşatır: kuyruk #8 zaten bir v479 göçü gerektiriyor.

## Tekrarlayan hata şekilleri

- `chs_spec` seçenek kolonunu boşaltır → çıkış **sonra** ve 8. argüman
  `ignore = true` ile çizilir. Bu şekil dört kez çarptı.
- `#ctrm_2` yükseklik bildirmez → panel: flex kolon, başlık `flexShrink 0`, gövde
  `flex 1` + `minHeight 0` + `overflowY auto`. Beş kez çarptı.
- Arayüz güncelleyicileri oyunu patlatmamalı (`updateInv`, satır silme,
  `onDegrade`) — çağıranlar `giveItem`/`reduce` gibi oyun fonksiyonları.
- Sahne asla sıfır seçenek + dövüşsüz dönmemeli. `smove`'da merkezi ağ var ve
  tetiklenmelerini `global.stat.strandc`'ye sayıyor; tarayıcı takımı bunun sıfır
  olduğunu doğruluyor — ağ yük taşımaya başlarsa test söyler.
- Popülasyon girdisi `c` bildirmezse `z_bake` `popc`'ye `NaN` pişirir ve o alanda
  hiçbir şey doğamaz. **Artık `check-combat.js` bunu ayrıca denetliyor.**

### Diyaloglar — `createGameModal()`

Oyundaki her diyalog bu iskelet üzerine kuruluyor: native `<dialog class="game-modal">`,
Esc ile kapanma, arka plan tıklaması, odağın açan öğeye dönmesi, kapanınca DOM'dan
silinme.

**Stil değil iskelet paylaşılıyor** ve bu bilinçli. Dışa/içe aktarma pencereleri elle
kurulmuş overlay'lerdi: `top: 370px; left: 330px`, siyah çerçeveli `lightgrey`, kendi
başlık çubuğundan sürüklenen. Yalnızca CSS'i paylaşan bir çözüm yeniden aynı şekilde
yazılabilirdi; iskeleti paylaşmak yeni bir diyaloğun hepsini birden almasını sağlıyor.

Kullanım:

```js
const panel = createGameModal({ title, wide: true, onClose });
panel.action(label, handler); // eylem butonu, ilki odağı alır
panel.danger(label, handler); // yıkıcı eylem
panel.close(label); // kapatma butonu
panel.open(); // showModal + odak
panel.dismiss(); // programatik kapatma
```

`wide: true` → `game-modal--wide` (`min(640px, 100vw - 32px)`), alan için
`game-modal__field`, gizli dosya seçici için `game-modal__file`.

### Ölü kod neden silinmedi

Plan P4.5'te "99 satır yoruma alınmış kod" siliniyor diyordu. Silinmedi ve
silinmemeli: `js/data/equipment.js:2730-2731`'deki yoruma alınmış iki satır tam olarak
**status.md kuyruk #2'nin konusu** —

```js
//  function(x){if(ttl.mone2.have===false){if(global.stat.moneyg>=GOLD){giveTitle(ttl.mone2)}}},
//  function(x){if(ttl.mone3.have===false){if(global.stat.moneyg>=GOLD){giveTitle(ttl.mone3)}}},
```

İkisi de `mone1` ile aynı `>= GOLD` koşulunu paylaşıyor; kuyruk bunu "gizli hata"
olarak kaydetmiş. Silmek bekleyen işin tek kaydını yok ederdi.

Genel kural olarak: bu depodaki yoruma alınmış kod tarihsel kayıt ya da bekleyen iş
olabiliyor (`scripts/strip-comments.js`'in kendi yorumu "terk edilmiş sahneler, eski bir
hasar formülü, hiç bitirilmemiş bir Pill Tower" diyor). Toplu silme, hangisinin hangisi
olduğunu tek tek incelemeden yapılmamalı. Bir düzeltme: plandaki "12 TODO/FIXME" sayısı
yanlıştı — kaynaklarda **sıfır** tane var.

## Kontroller

`check-game-regressions.js` artık `bundleSource` (tüm kaynakların birleşimi)
tanımlıyor. Yasak iddiaları ve davranış sözleşmeleri **tek dosyaya değil, pakete**
bağlanmalı; yoksa her dosya taşıması onları kırar — P1.1'de beş tanesi kırıldı ve
hiçbiri oyuncunun görebileceği bir şeye dair değildi. Yalnızca gerçekten konuma dair
olan iddialar `interfaceSource` gibi dosya değişkenlerini kullansın.

`npm run check` sekiz kontrol: `check-changelog`, `check-game-regressions`,
`check-i18n`, `check-refs`, `check-flags`, `check-economy`, `check-combat`,
`check-version` + node testleri + eslint/stylelint/prettier. Ayrıca
`npm run test:browser` — senaryolar `tests/probes/` altında birer dosya, `__test-*.html`
yolları üzerinden çağrılıyor.

`check-i18n` hesaplanmış dil anahtarını reddeder, metin tanım anında bağlanmalı.

### Tarayıcı probları — `tests/probes/`

Her `/__test-<ad>.html` route'u tek bir dosya: `tests/probes/<ad>.js`. Dosya yalnızca
tarayıcı kodunu tutuyor; `scripts/serve.js` onu `<script>` içine sarıp dağıtılan
`index.html`'e enjekte ediyor. Yeni bir senaryo eklemek için sunucu dosyasını açmak
gerekmiyor — dosyayı koy, `tests/browser-smoke-test.js` içinden route'u çağır.

Enjeksiyon noktası prob başlığındaki yönergeden okunuyor: `// inject: before-loader`
varsa yükleyici etiketinden önce, yoksa `</body>` öncesine. Oyunun hiçbir şeyi var
olmadan ölçüm yapması gereken tek prob `boot-screen`.

`/__test/corrupt-save` ve `/__test/unreadable-save` hâlâ `serve.js` içinde: ikisi de
`index.html` kullanmayıp kendi HTML'ini döndürüyor.

### `tests/fingerprint.js` — taşıma yapmadan önce oku

Paketin davranışını 1.440 satırlık bir metne indiriyor: her global fonksiyon adı,
her registry'nin anahtarları, eşya/silah/ekipman/yaratıkların sayısal şekli ve hasar
yolunun yaratık × seviye × silah sınıfı boyunca çıktısı. Her taşımadan önce ve sonra
çalıştırılır; `diff` boşsa taşıma saftır.

```
node tests/fingerprint.js > before.txt
# ... taşımayı yap, npm run build ...
node tests/fingerprint.js > after.txt
diff before.txt after.txt
```

Artık `use` handler'larını da kapsıyor: her eşyanın `use`'u sabit bir oyuncuya karşı
çağrılıyor ve ne değiştirdiği kaydediliyor. Log ölçümü için her çağrı öncesi
`clearMessageLog()` çağrılıyor — log `msgs_max` (36) ile sınırlı olduğundan dolu bir
log'da satır sayısı anlamsızlaşıyor.

`npm run fingerprint` de var ama npm kendi başlığını stdout'a yazıyor; karşılaştırma
için `--silent` ekle ya da doğrudan `node` çağır. P1.1 ve P1.2'nin saf olduğu bununla
kanıtlandı.

### `tests/harness.js` — bu oturumda eklendi

Paketi Node'da `vm` bağlamında çalıştırır ve global kapsamı döndürür. Bir denetim
artık kaynağın **nasıl göründüğünü** değil, oyunun **ne yaptığını** sorabilir.

```js
const { loadGame } = require("../tests/harness");
const game = loadGame(); // { locale: "tr" } da geçerli
game.item.brd.name; // "Bread"
game.dmg_calc(game.you, mob, game.abl.default);
```

- Yükleme **57 ms**. `item`, `creature`, `area`, `chss`, `skl`, `you`, `dmg_calc`
  hepsi doğrudan erişilebilir.
- Oyun **başlamaz**: `document.readyState` `"loading"` olduğu için
  `bootstrap.js` yalnızca `load` dinleyicisini kaydeder. Başlatmak için
  `startGame(context)`.
- Belirlenimcilik: `game.random = () => 0.5` her ruloyu orta noktaya sabitler.
- **Tuzak — harness başında da yazılı:** `vm` bağlamına Node'un yerleşiklerini
  (`Math`, `Date`, `Number`…) geçirme. Bağlamın kendi intrinsic'leri var;
  `a[0].constructor === Number` karşılaştırması yanlışa döner ve
  `js/utils/random.js`'teki Mersenne Twister `setSeed`'e sonsuz özyinelenir.

## Refactor planı ile kuyruğun birleşik değerlendirmesi

Kullanıcının kararı: **önce refactor planı, sonra içerik kuyruğu.** Bu sıra
doğru ve aşağıdaki iki sebeple bilinçli olarak korunmalı.

### Neden bu sıra doğru — kuyruk #7 ↔ P0.2 bağımlılığı

Kuyruk #7 (zırh çift sayımı) `interface.js`'te hasar azaltma terimini
değiştiriyor. Eğer bu, `check-combat.js` gerçek `dmg_calc`'ı çağırmaya
başlamadan önce yapılsaydı, denetim oyunun **eski** formülünün kopyasını ölçmeye
devam edecek, tüm yaratık bütçesi sessizce yanlış hesaplanacaktı — ve
`docs/AGENTS.md`'nin uyardığı felaket (öldürülemez yaratık) fark edilmeden
geçebilirdi. **P0.2 tamamlandığı için bu tuzak artık kapalı.** Kuyruk #7 şimdi
güvenle yapılabilir ve etkisi gerçek formül üzerinden ölçülür.

### Diğer kesişmeler

| Kuyruk                  | Refactor maddesi                  | İlişki                                                                                                                                                |
| ----------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| #6 `eqp.dummy`, #7 zırh | P1.1 `combat.js` taşıma           | İkisi de taşınacak blokta (`interface.js:4599-5332`). Önce **saf taşıma** (davranış değişmez, ayrı commit), sonra davranış düzeltmeleri yeni dosyada. |
| #8 aksesuar yuvaları    | P1.3 `interface.js` bölünmesi     | `interface.js:5890` civarı `equip` mantığı. P1.3'ün bölme listesinde bu blok yok, çakışma düşük.                                                      |
| #8 v479 göçü            | "Dokunulmayacaklar: kayıt biçimi" | Plan kayıt biçimini dokunulmaz saymıştı; kullanıcı göçe izin verdiği için bu varsayım gevşedi. Yukarıya not düşüldü.                                  |
| #4 balta, #1-#3 içerik  | P2.1/P2.2 `items.js` fabrikası    | Doğrudan çakışma yok. Ama P2.2 yapılırsa yeni içerik yeni biçimde yazılmalı — bu da kullanıcının "önce refactor" sırasını destekliyor.                |
| #9 md dosyaları eskimiş | P4.2                              | Kısmen kapandı: `ROADMAP` referansları kaldırıldı, `CHANGELOG.md`/`.TR.md` güncellendi. `REGIONS.md` ve `PROPOSALS` hâlâ eski.                        |
| Kontroller bölümü       | P2.3 prob dosyaları ✅            | Yapıldı: senaryolar artık `tests/probes/` altında ve bu belgenin Kontroller bölümü güncellendi.                                                       |

### Tek uyarı

Kuyruk #1, #2 ve #3 (dojo madalyaları, unvanlar, boş yeteneklere avantaj)
refactor planından **tamamen bağımsız**. Refactor uzarsa içerik donar. Bunlar
istenirse paralel yürütülebilir; hiçbir refactor maddesini beklemiyorlar.

## Sonraki adım

Refactor planının yedi fazından beşi kapandı, ikisi gerekçeli kısmi. Yayın
`https://kuroiteiken.github.io/Echoes-Beneath/` adresinde ayakta ve doğrulandı.

### Kararınızı bekleyen beş madde — bunlar iş kilitliyor

Bu maddeler "yapılacak" değil "karar verilecek", ve bir kısmı başka işin önünde duruyor.

| #                       | Karar                                     | Neden bekliyor                                                                                                                                                                |
| ----------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PROPOSALS 5             | Dirençler hasarı azaltmalı mı?            | Cevap ölçüldü: 12 `res` alanından 11'i `dmg_calc` tarafından okunmuyor. **Azaltmalı mı** sorusu sizin. Kalkan değerleri ve yanma tasarımı buna bağlı.                         |
| PROPOSALS 4 + kuyruk #7 | Zırh çift sayımı düzeltilsin mi?          | Ölçtüm: tek başına düzeltmek hasarı **sıfıra** indiriyor (37,0 → 0,0). Ancak `def.str * eff` teriminin düşürülmesiyle birlikte mümkün, ve o düşüşün miktarı bir denge kararı. |
| PROPOSALS 10            | Avantaj kapsamı hangi okuma?              | Dört okuma var: 32, ~230, 202 ya da 757 yeni girdi. Seçim yapılmadan maliyet belirsiz.                                                                                        |
| PROPOSALS 11            | Ustalık bonusu unvan takılıyken mi olsun? | 22 unvanın 13'ünde bonus **zaten var**; yeni olan tek şey koşulu takılı olmaya bağlamak.                                                                                      |
| PROPOSALS 15            | Kalan 10 alan sınırsız olsun mu?          | 31 alanın 21'i zaten kendini yeniliyor. Hangi 10'unun katılacağı içerik kararı.                                                                                               |

### Karar beklemeden yapılabilecekler — hepsi "bitmiş ama bağlanmamış"

Sıra, projenin kendi kuralına göre: daha fazlasını icat etmeden önce biteni bağla.

1. **26 unvan** iki dilde yazılmış ve hiçbir verme yolu yok (PROPOSALS 6, kuyruk #2).
   `equipment.js:2730-2731`'deki yorumdaki iki verme işlevi de bunun parçası.
2. **19 tarif** bitmiş, çevrilmiş, öğrenilemiyor; **`item.stdst`** 62 tarifin hiçbirinde
   kullanılmıyor (PROPOSALS 9).
3. **`hptn2`** dengelenmiş, tekrarlanabilir kaynağı yok (PROPOSALS 8).
4. **Yedi kalkanın** hiç kaynağı yok, ve **on yedisinin de `int`'i 0** — büyü dalında hiçbir
   kalkan savunma yapmıyor (PROPOSALS 7).
5. **İki araştırma hatası**: tablosu olmadığı hâlde kendini "arandı" bildiren bir orman, ve
   araştırma yolu tamamlanamayan bir kömür madeni (PROPOSALS 16).
6. **İki mobilya parçası** bitmiş, adı konmuş, elde edilemiyor (PROPOSALS 13).
7. **Dojo madalyaları** (kuyruk #1): `acc.otpin` iki yerden veriliyor, `locations.js:839`
   silinecek; `acc.medl1`-`medl6`'nın hiç statı yok, beşinin kaynağı yok.

### Kalan refactor maddeleri

| Madde                       | Durum | Not                                                                                                                                                                                                                                                                                                                               |
| --------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P4.4 `chs()` klavye erişimi | ◐     | **En büyük erişilebilirlik açığı.** Oyun `js/world/locations.js`'te ~706 `chs()` çağrısıyla oynanıyor ve tek etkinleştirme yolu fare. Orta-yüksek risk: fabrikanın kendi `click`'i eylem yolu değil, o yüzden Enter gerçek bir `click` göndermeli; ve `clr_chs()` satırları sürekli yıkıp kurduğu için odak stratejisi gerekiyor. |
| P1.3 `preferences.js`       | ◐     | Gerekçeli atlandı: tercih fonksiyonları DOM kurulumuyla iç içe ve `const` TDZ riski var. Ayırmak DOM kurulumunu bölmeyi gerektiriyor.                                                                                                                                                                                             |
| P4.3 kalan renkler          | ◐     | `rgb(255,192,5)` / `rgb(0,235,255)` / `rgb(44,255,44)` bir `stype` skalası, `#e8421c` hava durumu. Anlamları doğrulanmadan isim vermek yanlış isimli token üretir.                                                                                                                                                                |
| Denetimin kalan 11 maddesi  | ◐     | PROPOSALS 18: başlık seçme penceresi (karar gerekiyor — vazgeçme yolu akışı değiştirir), envanter çip kümesi (renkleri JS'te satır içi), `input:focus` daraltması.                                                                                                                                                                |
| P1.4 simülasyon DOM'u       | ⏳    | 76 satır içi stil, 30 `innerHTML`. Saat/ay evresi/doygunluk ile başlanabilir.                                                                                                                                                                                                                                                     |
| P2.2 `defineItem`           | ⏳    | Getirisi düşük; `check-refs`'in biçim varsayımına dokunuyor.                                                                                                                                                                                                                                                                      |
| P4.5 kalanı                 | ⏳    | Ölü kod **bilinçli** bırakıldı (kuyruk #2'nin kaydı). `for...in` ve `Base64` getirisi riskinden düşük.                                                                                                                                                                                                                            |
| P3.3 minify                 | ⛔    | Yapılmayacak, depo sahibi kararı.                                                                                                                                                                                                                                                                                                 |

### Kayıt göçü gerektiren tek iş

**Kuyruk #8 — aksesuar yuvaları.** v479 göçü gerekiyor. PROPOSALS 15 artık göç
gerektirmediği için (21 alan zaten kendini yeniliyor) bu maddeyi eşleştirecek başka bir iş
kalmadı; tek başına yapılacak.

## Kuyruk — araştırılmış bulgularla

> **Satır numaraları bu oturumda kaydı.** Savaş `js/ui/interface.js`'ten
> `js/systems/combat.js`'e, panellerin çizimi `js/ui/panels.js`'e, imleç açıklamaları
> `js/ui/tooltip.js`'e, mesaj günlüğü `js/ui/message-log.js`'e taşındı ve `interface.js`
> 8.689'dan 6.075 satıra indi. Aşağıdaki referanslar bu taşımalardan **sonra** yeniden
> ölçüldü. Yine de bir sonraki oturum için kural: **satır numarasına değil, verilen arama
> kalıbına güven.** Kalıp taşımadan sağ çıkar, numara çıkmaz.

1. **Dojo madalyaları.** `acc.otpin` "Kılıç Madalyası" iki yerden veriliyor:
   `locations.js:1182` (upstream, kalacak) ve `locations.js:839` (0a1bd4a
   commit'i, silinecek — üstündeki 837-838 gerekçe yorumuyla birlikte). Kademeyi
   `!trne2e1`'e bağlama. Yerine `acc.medl6` (kademe 2, kaynaksız). Altı
   madalyanın (`medl1`-`medl6`) hiç statı yok, açıklamaları proc/işlem yer
   tutucusu, ve beşinin hiç kaynağı yok. `acc.medl5` "Yeşim Derisi Madalyası" 45. kademede veriliyor ve etkisiz. Çürütülenler: `acc.aihomnt`'ın
   `oneq`/`onuneq`'i tamamen boş; `acc.coindct`/`acc.slchth` saf hasar ve kademe
   bloğunun `locations.js:783-788`'deki yazılı kuralını ihlal ediyor;
   `acc.mirgmirr`'ın yarısı ölü. Regresyon kontrolü kademe başına yazılmalı,
   yoksa `eqp.knkls`'in kasıtlı L/R çifti (684/685) yanlış alarm verir.

2. **Unvanlar.** 108 unvan, 39'unda yetenek var, kademe 2+ olup yeteneği olmayan
   31 tane (`hstr3` "Çene Kıran" dahil). Yetenek şekli:
   `ttl.X.talent = function(){}` + `ttl.X.tdesc`. Güvenli desenler: `skl.X.p += n`
   ya da kaydedilen stat alanı. `shpt2`, `shpt3`, `mone3`'ün dil kayıtları boş
   string ama onları veren kod `equipment.js:2730-2766`'da yorumda — yani gizli
   hata. Yorumdaki eşikler: `shpt2` 5000 alış, `shpt3` 10000, ve `mone2`/`mone3`
   aynı koşulu paylaşıyor (hata).

3. **Boş yeteneklere avantaj.** 60 yetenek, 23'ünde kilometre taşı var, 37'sinde
   yok. O 37'nin yalnızca beşi (`bwc`, `hvt`, `glg`, `mntnc`, `swm`) hiç
   eğitilemiyor → 32 yetenek eğitilebilir olduğu hâlde avantaj vermiyor. Öbek
   öbek göndermek gerekecek.

   **Yanında duran hata, yeniden ölçüldü ve tanısı değişti.** Kuyruk bunu
   "`skills.js:2238`'de `skl.hvt.type = 8` yanlışlıkla `skl.hst` bloğunun içinde" diye
   kaydetmişti. Doğrusu şu: `skl.hvt.type = 8` **iki kez** yazılmış —
   `js/data/skills.js:2050`'de kendi bloğunda doğru şekilde, ve
   `js/data/skills.js:2277`'de `skl.hst` bloğunun içinde yanlışlıkla. Yani `skl.hvt.type`
   iki kez aynı değere ayarlanıyor (etkisiz tekrar) ve **`skl.hst.type` hiç
   ayarlanmıyor** — yapıcı varsayılanında kalıyor. Düzeltme tek satır:
   2277'deki `skl.hvt.type` → `skl.hst.type`. Arama kalıbı: `grep -n "skl.hvt.type"`
   iki sonuç vermeli; ikincisi `skl.hst` bloğunun içindeki.

4. **Balta + ağaç kesme.** Oyunda hiç balta yok (`wtype = 2` boş). `wpn.pck`
   şablonu: tutulan yuva (`slot = 1` — yapıcı varsayılanı 0 silah yuvası değil),
   `you.mods` bayrağı `oneq`/`onuneq` ile, degrade, `repairable = true` (yoksa
   sıfırda yok olur), kendi `onDegrade`'i. Odun eşyaları: `item.wdc`, `item.fwd1`,
   `wpn.stk1`. Kesme `skl.hvt`'yi eğitsin.

5. **Debuff → direnç.** `global.fps = 1` — efektler saniyede bir kez, tek bir
   yerden (`ontick()`) tikliyor. Yani "saniyede +1" birebir uygulanabilir.

6. **`eqp.dummy` — zırhtan ÖNCE.** Hiçbir ekipman slot 6 tanımlamıyor, yani
   `you.eqp[5]` (sağ el) her zaman paylaşılan `eqp.dummy`, ve o
   `creature.wolfa1`'in yazdığı `cls [9,10,9]` + `aff[0] 14`'ü taşıyor.
   Vuruşların %25'ini oraya gönderen satır artık
   **`js/systems/combat.js:124`** (`const a = 2 + rand(4);`) → Kalkan 25'te kalkan
   yeteneğini eğitmek %30 daha fazla hasar (312 → 406). Ayrıca bütün kalkanların
   `int = 0` olması ve dummy'nin `aff[0] 14`'ü yüzünden büyü dalında ve `dp = 0`'da
   kalkansız daha iyi. Kullanıcının "kalkan her zaman hasarı azaltır" kuralı bu
   temizlenmeden sağlanamaz. **Not:** `check-combat.js` artık dört zırh yuvasını
   da ölçtüğü için bu düzeltmenin etkisi denetimde görünür olacak.

7. **Zırh çift sayımı.** Kuyruk "dört yer: `interface.js:5021, 5027, 5073, 5079`"
   diyordu; taşımadan sonra yeniden ölçüldü ve sayı da tanı da netleşti. **İki dal, her
   birinde iki görünüm**, hepsi `js/systems/combat.js` içinde:

   - Fiziksel dal: **`combat.js:438`** içteki `global.target.cls[att.ctype] * 5 * ta`
     (artı işaretiyle, hasar azaltmayı arttırıyor) ve **`combat.js:444`** dıştaki
     `(100 - global.target.cls[att.ctype] * 5 * shdc * ta)` (eksi işaretiyle, aynı şeyi
     geri alıyor).
   - Büyü dalı: **`combat.js:490`** ve **`combat.js:496`**, aynı çift.

   Arama kalıbı: `grep -n "100 - global.target.cls" js/systems/combat.js` → iki sonuç.

   `K = 70` kullan — `K = 65` kalkansız hasarı `def.str` 140'ta %6.5 arttırıyor.
   Sonuç: kalkan vuruş başına 4.56 hasara mal olmaktan 23.69 kazandırmaya geçiyor,
   Prostasia monotonlaşıyor (352/415/517 → 280/245/205). **Artık güvenli:** P0.2
   tamamlandığı için denetim gerçek formülü ölçüyor, formülün bir kopyasını değil.

8. **Aksesuar yuvaları.** `you.eqp` zaten 10 girdi; 7/8/9 aksesuar konumları,
   ikisi "Kilitli" etiketli ve erişilemez. Statlar diziyi dolaşarak hesaplanıyor →
   dolan yuvalar kendiliğinden sayılır. Kapı tek yerde: 85 aksesuarın hepsi
   `slot = 8` ve `equip` `you.eqp[w.slot - 1]` yapıyor. `equip` artık
   **`js/ui/interface.js:4308`**; yazarın yorumda bıraktığı çok-yuvalı mantık onun
   içinde (arama kalıbı: `grep -n "^function equip" js/ui/interface.js`). Kuşanılan yuva
   `data`'ya yazılmalı (kayıt onu taşır). Kural: 1. seviyede 1, 20'de 2., 40'ta 3.
   yuva; kilitli etiket gereken seviyeyi söylesin. v479 göçü gerekir — madde 7'nin
   bölge sayacıyla aynı göçte birleştirilebilir.

9. **md dosyaları.** `changelog.html` ve (bu oturumdan sonra) `CHANGELOG.md`/
   `.TR.md` güncel. `REGIONS.md`'nin yedi adımlı sözleşmesi kodda bitti ama
   doküman öyle demiyor. `PROPOSALS`'ın zırh notundaki sayılar (36.9→9.9) yanlış —
   doğrulama düzeltti.

**Bekleyen kararlar:** bebekler (5 yaratık yapıcı varsayılanıyla, `rnk` güç değil
tehlike sınıflandırması olduğu için seviye çıpası yok), doğu (bölüm boyutunda,
ayrılmış), mesaj tahtası heykel taraması yalnızca `inv`'e bakıyor.

## Araç tuzağı

Bash heredoc'ları ters eğik çizgileri yiyor, kesme işareti tek tırnaklı dizeyi
kapatıyor, şablon dizesi içindeki ters tırnak diziyi erken kapatıyor. **Bu
oturumda doğrulandı ve incelticek bir ayrım çıktı:** kısa ve ASCII bir heredoc
(YAML, kısa betik) sorunsuz çalışıyor; uzun Türkçe markdown içeren bir heredoc
bash'i `unexpected EOF` ile düşürdü. Kural: **çok satırlı veya Türkçe içerik için
`Write` aracını kullan**, heredoc'u yalnızca kısa ASCII için sakla. Var olan bir
dosyaya nokta atışı ekleme yapmak için `python - <<'PY'` bloğu güvenilir çalıştı.

**`git checkout <dosya>` ile geçici bir değişikliği geri alma.** Bu oturumda negatif
kontrol için `build-site.js`'e geçici bir bozma yapıldı ve `git checkout` ile geri
alındı — ama o dosyadaki **commit edilmemiş gerçek düzeltme de** silindi ve testler
kırıldı. Geçici bozmayı geri almanın doğru yolu: bozmayı ters yönde uygulamak ya da
önce dosyayı kopyalayıp sonra geri yazmak.

## Depo sahibinin sırası

Bu bölüm ham istek listesi değil, **işlenmiş bir kuyruk**. Kuralı depo sahibi koydu:

> Yazdığım tüm promptları başlamadan önce mutlaka `PROPOSALS.md` dosyalarına işle.
> Tamamlandığında da PROPOSALS'tan çıkar, uygun md dosyalarına ekle, `STORY.md`
> dosyasını kontrol et.

Yani her maddenin yolu şu: **buraya yazılır → `docs/PROPOSALS.md` + `.TR.md`'ye
araştırılmış hâliyle işlenir → yapılır → PROPOSALS'tan çıkarılır → changelog'a ve
gerekiyorsa `STORY.md`'ye girer.**

Maddelerin `PROPOSALS.md`'ye girmesi için önce kodda karşılıklarının araştırılması
gerekiyor (o dosyanın standardı: "ne olduğu, üzerine kurulacak neyin zaten var olduğu,
gerçekten yeni yazılması gerekenin ne olduğu"). Bu araştırma bir workflow ile yürütülüyor;
sonucu geldiğinde PROPOSALS'a işlenecek ve buradaki satırlar oraya işaret edecek.

### Durum tablosu

| #   | İstek                                                                                 | Durum                        | Not                                                                                                                                                                           |
| --- | ------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Atlanan tasarım yapıları mevcut tasarıma uyarlanacak (örnek: içe/dışa aktarma modalı) | ✅ **v478.29**               | Modal `game-modal` iskeletine taşındı, `#save-bar-restore` düzeltildi. Kalanı için tasarım denetimi workflow'u çalışıyor.                                                     |
| 2   | Yeteneklerin hepsinde 15. seviyeye kadar avantaj                                      | 🔍 araştırılıyor             | Kuyruk #3 ile aynı konu: 60 yetenekten 37'sinde kilometre taşı yok, 32'si eğitilebilir olduğu hâlde avantaj vermiyor.                                                         |
| 3   | Üretim çeşitlendirilmeli                                                              | 🔍 araştırılıyor             | Mevcut tarif dağılımı ölçülecek, "çeşitlendirme" bir şekle bağlanacak.                                                                                                        |
| 4   | Yıldız tozu gibi ürünler boş kalıyor                                                  | 🔍 araştırılıyor             | `item.stdst` ve onu tüketen tarifler taranıyor.                                                                                                                               |
| 5   | Ünvanlarda iyileştirme ve arttırım                                                    | 🔍 araştırılıyor             | Kuyruk #2: 108 unvan, 39'unda yetenek; `shpt2`/`shpt3`/`mone3` dil kayıtları boş ve veren kod yorumda.                                                                        |
| 6   | Sağlık iksirlerinin açılması; en küçük şifa iksiri dışındakiler üretim listesinde yok | 🔍 araştırılıyor             | Her iyileştirme eşyası için kaynak (tarif/satıcı/düşme) tek tek çıkarılıyor.                                                                                                  |
| 7   | Bir bölgeyi belli sayıda temizledikten sonra sınırsız temizleme                       | 🔍 araştırılıyor             | Kayıt biçimi kısıtı var: alan boyutları konumsal, son alan `area.mine3` (id 131).                                                                                             |
| 8   | Yan hikayelere devam                                                                  | ⏳ sırada                    | `PROPOSALS`'ın "Side stories still owed" bölümü zaten var.                                                                                                                    |
| 8b  | Oyuncu panelindeki efekt şeridi ŞANS okumasına biniyor                                | ✅ **kabul: değişiklik yok** | Depo sahibi kararı: bilgi olarak veriyor, yeterli. Madde kapalı.                                                                                                              |
| 9   | Silah ustalığı ünvanları + takılıysa ustalık hızı artışı                              | 🔍 araştırılıyor             | `oneq`/`onuneq` → `you.mods` deseni gerekiyor; kayıt yüklemede `str`'ye yazılan bonus yok olur.                                                                               |
| 10  | Kalkan taslakları, değerleri ve önceki rütbeleri                                      | 🔍 araştırılıyor             | Bilinen sorun: on dört kalkanın on biri `str 0` ile geldi. Kuyruk #6 (`eqp.dummy`) ile birlikte ele alınmalı.                                                                 |
| 11  | "Araştır" başka hiçbir yerde kullanılmıyor, mantıklı yerlerde kullanılabilir          | 🔍 araştırılıyor             | `canScout`/`scoutGeneric` nerede sunuluyor, nereye uyar.                                                                                                                      |
| 12  | Birkaç mobilya daha; yatak varsa mantıklı açıklama; yataklara dinlenmede sağlık hızı  | ◐ **üçte ikisi zaten var**   | `ea8fa22`'de yayınlandı. Kalan: hiçbir oyuncunun elde edemediği iki bitmiş mobilya parçası.                                                                                   |
| 13  | Şömine iyileşme + enerji + "dinlendin" buff'ı                                         | ⛔ **zaten var**             | `ea8fa22` ve `00295f7`. Madde kapalı; yapılacak bir şey yok.                                                                                                                  |
| 14  | Ateş hasarında yaratığa yanma debuff'u                                                | ⛔ **zaten var**             | `c19c781`. Madde kapalı.                                                                                                                                                      |
| 15  | Dirençler dövüşte dikkate alınıyor mu?                                                | ✅ **cevaplandı: hayır**     | 12 `res` alanından 11'i `dmg_calc` tarafından hiç okunmuyor. Sayılan üçten ikisi `res` alanı bile değil: ölümsüz `you.maff`, karanlık `aff[6]`. Ayrıntı `PROPOSALS` 5. madde. |

### Sıra mantığı

Yapılacak sıra istek sırası değil, **bağımlılık ve risk sırası**:

1. **Önce cevaplanacak soru:** madde 15. Dirençler etkisizse madde 14 (yanma debuff'u)
   ve madde 10 (kalkan değerleri) farklı tasarlanır. Bir soruya dayanan işi sorudan önce
   yapmak, işi iki kez yapmaktır.
2. **Sonra düzeltmeler:** madde 5'in gizli hatası (yorumda kalmış unvan verme kodu),
   madde 6 (kaynağı olmayan iksirler), madde 10 (`str 0` kalkanlar). Bunlar var olan
   içeriği çalışır hâle getiriyor — projenin "daha fazla icat etmeden önce biteni bağla"
   kuralı bunları öne alıyor.
3. **Sonra kayıt biçimine dokunmayan eklemeler:** madde 9, 12, 13, 14, 2.
4. **En son kayıt göçü gerektirenler:** madde 7 (bölge sayacı) ve kuyruk #8 (aksesuar
   yuvaları). İkisi birden bir v479 göçünde birleştirilebilir; ayrı ayrı iki göç
   yapmaktan iyidir.
