# Echoes Beneath — oturum devir özeti

Son güncelleme: 2026-08-19. Bir önceki oturumun devir notlarını, o notlardan
sonra yapılan işi ve [`refactorplan.md`](refactorplan.md) ile birlikte
değerlendirilmiş sırayı taşır.

## Proje

Kuroiteiken/23html.github.io fork'u, çalışma dizini `d:\GitRepos\23html.github.io`,
adı Echoes Beneath. Tarayıcı RPG'si. `scripts/build.js` 25 kaynağı `js/game.js`'e
birleştiriyor — `js/game.js` üretilmiş dosya, asla okuma/düzenleme. Gerçek
kaynaklar `scripts/sources.js`'te listeli.

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

Faz 4 tamamlandı. Sıradaki **Faz 5**: P3.1 kademe 2 (`locales/manifest.json`'a yerel
başına `complete` bayrağı → Türkçe oyuncu için 348 KB daha az indirme) ve P3.2
(`index.html`'e `<link rel="preload" as="script">`, `build-site.js` içinde `?v=` ile
damgalanmalı).

Ardından Faz 6 (P1.3 `interface.js` bölünmesi, P4.3 renk token'ları) ve Faz 7
(P4.1 oyuncu adı `textContent`, P4.4 klavye erişimi, P4.5 hijyen, P1.4 simülasyon
DOM'u, P2.2 `defineItem`, P3.3 minify).

Refactor planı bittiğinde içerik kuyruğuna geçilecek — sıra kuyruğun kendi
numaralandırması: #7 zırh çift sayımı ve #6 `eqp.dummy` ilk ikisi, çünkü ikisi de
savaş dosyasında ve P0.2 sayesinde artık ölçülebilir.

## Kuyruk — araştırılmış bulgularla

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
   öbek göndermek gerekecek. `skills.js:2238`'de `skl.hvt.type = 8` yanlışlıkla
   `skl.hst` bloğunun içinde.

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
   `a = 2 + rand(4)` vuruşların %25'ini oraya gönderiyor → Kalkan 25'te kalkan
   yeteneğini eğitmek %30 daha fazla hasar (312 → 406). Ayrıca bütün kalkanların
   `int = 0` olması ve dummy'nin `aff[0] 14`'ü yüzünden büyü dalında ve `dp = 0`'da
   kalkansız daha iyi. Kullanıcının "kalkan her zaman hasarı azaltır" kuralı bu
   temizlenmeden sağlanamaz. **Not:** `check-combat.js` artık dört zırh yuvasını
   da ölçtüğü için bu düzeltmenin etkisi denetimde görünür olacak.

7. **Zırh çift sayımı.** Dört yer: `interface.js:5021, 5027, 5073, 5079`.
   `100 - global.target.cls[...]` yerine sabit. `K = 70` kullan — `K = 65`
   kalkansız hasarı `def.str` 140'ta %6.5 arttırıyor. Sonuç: kalkan vuruş başına
   4.56 hasara mal olmaktan 23.69 kazandırmaya geçiyor, Prostasia monotonlaşıyor
   (352/415/517 → 280/245/205). **Artık güvenli:** P0.2 tamamlandığı için denetim
   gerçek formülü ölçüyor.

8. **Aksesuar yuvaları.** `you.eqp` zaten 10 girdi; 7/8/9 aksesuar konumları,
   ikisi "Kilitli" etiketli ve erişilemez. Statlar diziyi dolaşarak hesaplanıyor →
   dolan yuvalar kendiliğinden sayılır. Kapı tek yerde: 85 aksesuarın hepsi
   `slot = 8` ve `equip` `you.eqp[w.slot - 1]` yapıyor. `interface.js:5890`
   civarında yazarın yorumda bıraktığı çok-yuvalı mantık var. Kuşanılan yuva
   `data`'ya yazılmalı (kayıt onu taşır). Kural: 1. seviyede 1, 20'de 2., 40'ta 3.
   yuva; kilitli etiket gereken seviyeyi söylesin. v479 göçü gerekir.

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
