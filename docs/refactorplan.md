# Refactor ve İyileştirme Planı

Bu belge, depo üzerinde 2026-08-19 tarihinde yapılan bir kod incelemesinin
çıktısıdır. Her bulgu ölçülmüş bir kanıta dayanır; tahmin veya stil tercihi
olarak yazılmış madde yoktur. Öneriler `docs/AGENTS.md` içindeki uyumluluk
kurallarına (kayıt biçimi, kaynak sırası, global kapsam, yerelleştirme
zorunluluğu) uyacak şekilde sınırlandırılmıştır.

## Yöntem

- Kaynak ağacı: `js/`, `css/`, `scripts/`, `tests/`, `locales/`, `docs/`
- `js/game.js` ve `dist/` üretilmiş çıktılar olduğu için ölçümlerin dışında
  tutuldu.
- `npm run build` ve `npm run check` inceleme sırasında çalıştırıldı; **tamamı
  geçti**. Yani buradaki hiçbir madde "bozuk bir şeyi düzeltme" değil, çalışan bir
  sistemi daha ucuz taşınabilir hâle getirme önerisidir.

## Mevcut durumun ölçüsü

| Ölçü                                           | Değer                                             |
| ---------------------------------------------- | ------------------------------------------------- |
| Elle yazılan JavaScript                        | ~41.900 satır (25 kaynak dosya)                   |
| En büyük UI dosyası                            | `js/ui/interface.js` — 8.689 satır                |
| En büyük veri dosyası                          | `js/data/items.js` — 7.639 satır                  |
| Geliştirme sunucusu                            | `scripts/serve.js` — 1.960 satır, tek fonksiyon   |
| Yinelenen 8 satırlık blok grubu                | 503 grup, ~11.200 fazlalık satır                  |
| `interface.js` içindeki satır içi stil ataması | 923                                               |
| `interface.js` içindeki `innerHTML` kullanımı  | 611                                               |
| CSS'te farklı renk değeri                      | 123 (buna karşılık 12 satırda CSS değişkeni)      |
| Yerelleştirme anahtarı                         | 3.424 (en/tr tam parite, 5 anahtar referanssız)   |
| Dağıtılan paket                                | `game.js` 1,22 MB (gzip 235 KB), minify edilmemiş |
| Türkçe oyuncunun indirdiği yerel dosya         | 715 KB (en.json + tr.json, **seri**)              |

Genel değerlendirme: proje eski bir oyunun forku olmasına rağmen **beklenenden çok
daha disiplinli**. Yorumlar kararların gerekçesini yazıyor, yerelleştirme kapsaması
neredeyse tam, önyükleme ve önbellek sürümleme mantığı gerçek bir üretim sorununu
çözüyor, `scripts/check-*.js` denetimleri gerçek hataları yakalamak için yazılmış.
Aşağıdaki maddeler bu temelin üzerine kurulur.

---

## P0 — Önce bunlar

> **Durum: tamamlandı (2026-08-19).** Üç maddenin üçü de uygulandı ve
> `npm run check` sıfır çıkış koduyla geçiyor. Ayrıntılar her maddenin altında.

### P0.1 ✅ `espree` bildirilmemiş bir bağımlılık

**Kanıt:** [actions.test.js](../tests/actions.test.js),
[callbacks.test.js](../tests/callbacks.test.js),
[save-format.test.js](../tests/save-format.test.js) ve
[check-game-regressions.js](../tests/check-game-regressions.js) dosyalarının dördü
de `require("espree")` çağırıyor. [package.json](../package.json) içindeki
`devDependencies` yalnızca eslint, prettier, stylelint ve
stylelint-config-standard içeriyor. `espree` yalnızca eslint'in geçişli
bağımlılığı olarak kuruluyor.

**Etki:** eslint bir sürümde `espree`'yi bırakırsa ya da depo pnpm gibi katı bir
paket yöneticisiyle kurulursa test paketinin dört dosyası birden çalışmaz hâle
gelir. CI'da `npm run check` adımı çöker, bu da dağıtımı durdurur.

**Öneri:** `espree`'yi `devDependencies` altına açıkça ekle. Tek satırlık
düzeltme, sıfır risk.

**Yapıldı:** `espree` `^11.2.0` olarak `devDependencies` altına eklendi ve
`package-lock.json` doğrudan bağımlılık olarak güncellendi.

### P0.2 ✅ Hasar formülü iki yerde ayrı ayrı yazılmış

**Kanıt:** Oyunun gerçek formülü [interface.js:4928](../js/ui/interface.js#L4928)
içindeki `dmg_calc`. Aynı formülün ikinci bir kopyası
[check-combat.js:157-175](../scripts/check-combat.js#L157-L175) içinde
`strAtLevel`, `bestClassMultiplier` ve `mitigation` olarak yeniden yazılmış.

**Etki:** `docs/AGENTS.md` bu denetimi kritik ilan ediyor — gerekçesi de doğru:
fazla zırhlı bir yaratık sessizce öldürülemez hâle geliyor ve hiçbir yerde hata
üretmiyor. Ancak denetim oyunun formülünü değil, formülün bir kopyasını ölçüyor.
`dmg_calc` değiştiği gün denetim hâlâ yeşil yanar ve **yanlış şeyi doğrular**. Bu,
tüm savaş güvenlik ağının sessizce devre dışı kalması demektir.

**Öneri:** P0.3'teki test koşum ortamı kurulduktan sonra `check-combat.js`,
formülü yeniden yazmak yerine paketten yüklenen gerçek `dmg_calc`'ı çağırsın. Ara
adım olarak: formülü tek bir yerde (`js/systems/combat.js`) tut ve denetim o
dosyayı okuyup değerlendirsin.

**Yapıldı — ve bulgu, tahmin edilenden ağır çıktı.** Kopya çoktan ayrışmıştı:
gerçek `dmg_calc` artık bir vuruşu salınımın bir oranında tabanlıyor
(`minimumLandedDamage`) ve silah ustalığının sınıf direncini delmesine izin
veriyor; `check-combat.js`'in kopyası ikisini de bilmiyordu. Denetim yeşil
yanmaya devam ediyordu, çünkü karşılaştırmanın iki tarafı da aynı eski aritmetiği
kullanıyordu.

`scripts/check-combat.js` yeniden yazıldı. Formülü artık hiç hesaplamıyor;
`tests/harness.js` ile paketi yükleyip gerçek `dmg_calc`'ı **fark yöntemiyle**
ölçüyor:

```
hasar azaltma = (zırhı sökülmüş yaratığa aynı vuruş)
              - (olduğu gibi statlanmış yaratığa aynı vuruş)
```

İki çağrı yalnızca yaratığın zırhında farklı olduğundan, fark tam olarak
çıkarılan terimdir — `dmg_calc` etrafında ne yaparsa yapsın. Saldırı terimi de
aynı yolla, savunması sıfırlanmış bir hedefe vurularak okunuyor. Bu, bir oyuncu
modeline ihtiyaç duymaz: modele ait her şey iki çağrıda birbirini götürür.

**Kalibrasyon korundu, kanıtlı:** eski denetim `16.0 mitigation per level
(wolf1 at level 7 in area.frstn9a1)`, bütçe `18.4` diyordu. Yeni denetim aynı
yaratıkta, aynı seviyede **16.0** ve **18.4** ölçüyor. Saldırı tarafı `13.4` →
`14.7`'ye çıktı; eski ölçüm kalkan katkısını ve `shdc` çarpanını hiç saymıyordu,
yenisi gerçek dalın tamamını ölçüyor.

**İki yan bulgu:**

1. `ORIGINAL` listesindeki 17 addan **5'i var olmayan yaratıklara** işaret
   ediyor (`rat1`, `rat2`, `bat1`, `zmb1`, `gho1`); bir tanesi (`skl1`) gerçekte
   `skl` olarak tanımlıymış ve düzeltildi. Eşleşmeyen bir `Set` girdisi sessizce
   etkisizdir, dolayısıyla bu adlar hiçbir şey muaf tutmuyordu. Denetim artık
   bunları uyarı olarak bildiriyor; hangi yaratığın kastedildiği bir içerik
   kararı olduğu için tahmin edilmiyor.
2. Denetim artık 15 değil **20 eklenen yaratığı** kapsıyor — düzenli ifadenin
   kaçırdıkları da dâhil.

### P0.3 ✅ Testler kaynağı AST ile ayrıştırıp `vm` içinde çalıştırmak zorunda

**Kanıt:** [actions.test.js:34-60](../tests/actions.test.js#L34-L60) — tek bir
eylemi test edebilmek için dosya espree ile ayrıştırılıyor, `act.demo.drain` gibi
atama hedefleri AST düğümlerinden isimle bulunuyor, kesilip `vm` bağlamında
saplamalarla çalıştırılıyor. [check-refs.js](../scripts/check-refs.js) ve
[check-flags.js](../scripts/check-flags.js) düzenli ifadeyle kaynak metni tarıyor.
[check-game-regressions.js](../tests/check-game-regressions.js) 1.075 satır ve
içinde ~117 kaynak metni iddiası var — örneğin
[check-game-regressions.js:11](../tests/check-game-regressions.js#L11) bir
fonksiyon gövdesini boşluklarına kadar düzenli ifadeyle eşleştiriyor.

**Etki:** Üç ayrı maliyet var. Birincisi, bu testler davranışı değil **metni**
doğruluyor: aynı davranışı üreten bir yeniden yazım testi kırar, bozuk bir davranış
ise metin aynı kaldığı sürece testten geçer. İkincisi, Prettier'in bir satırı
yeniden sarması testi kırabilir — yani biçimlendirme aracı ile test paketi
birbirine sürtünüyor. Üçüncüsü ve en önemlisi: bu belgedeki her yapısal öneri
(P1.1, P1.2, P2.1) bu testler yüzünden gereğinden çok daha pahalı.

**Öneri:** `tests/harness.js` ekle. Görevi: [sources.js](../scripts/sources.js)
sırasına göre paketi okumak, minimal bir DOM saplaması (`document`,
`localStorage`, `requestAnimationFrame`, `Audio`) ile birlikte
`vm.createContext` içinde çalıştırmak ve elde edilen bağlamı döndürmek. Bu,
`docs/AGENTS.md`'nin koruduğu "tek global kapsam" kısıtını **bozmaz** — tam
tersine onu kullanır.

Bunun ardından:

- `check-refs.js` metinde `item.sp4` aramak yerine `context.item.sp4` var mı diye
  bakar; yanlış pozitif ve yanlış negatif ihtimali sıfırlanır.
- `check-combat.js` gerçek `dmg_calc`'ı çağırır (P0.2 çözülür).
- `check-game-regressions.js`'in düzenli ifade iddialarının çoğu gerçek çağrılara
  dönüşür; dosya büyük olasılıkla 1.075 satırdan birkaç yüz satıra iner.
- `actions.test.js` / `callbacks.test.js` içindeki espree makinesi tamamen kalkar
  (P0.1 de bu yolla ortadan kalkabilir).

**Risk:** Orta. Paketin Node içinde yan etkisiz yüklenebilmesi için hangi tarayıcı
API'lerine dokunduğunun tespit edilmesi gerekir. Ancak bu iş bir kere yapılır ve
sonrasında her denetimi ucuzlatır. Doğrulama: mevcut denetimler dönüştürülmeden
önce ve sonra aynı sonucu vermeli.

**Yapıldı.** `tests/harness.js` eklendi. `scripts/sources.js` sırasına göre
paketi birleştirip küçük bir DOM, `localStorage`, canvas ve gerçek `i18n`
sağlayan bir `vm` bağlamında çalıştırıyor; `loadGame()` o bağlamı döndürüyor.
`item`, `creature`, `area`, `chss`, `skl`, `you`, `dmg_calc` — hepsi doğrudan
erişilebilir. Yükleme **57 ms**, yani bir denetim için maliyeti yok.

Oyun kendiliğinden **başlamıyor**: `bootstrap.js` sonundaki
`document.readyState === "complete"` koşulu `"loading"` görünce yalnızca dinleyici
kaydediliyor. Tanımlar çalışır, `load()` ve tik çalışmaz. Başlatmak isteyen
`startGame(context)` çağırır.

**Kurulumda çıkan ve belgelenen tuzak:** `Math`, `Date`, `Number` gibi
yerleşikleri Node tarafından `vm` bağlamına geçirmek bir kolaylık değil, gerçek
bir tuzaktır. Bir `vm` realm'ının kendi intrinsic'leri vardır; paket içinde
üretilen bir sayının `constructor`'ı **bağlamın** `Number`'ıdır. Global'i Node'un
`Number`'ıyla ezmek `a[0].constructor === Number` karşılaştırmasını programdaki
her sayı için yanlış yapar. `js/utils/random.js` içindeki Mersenne Twister tam da
bu karşılaştırmaya dallanıyor ve başarısız olduğunda `setSeed`'e sonsuz
özyineleniyor — hata bu şekilde bulundu. Harness dosyasının başındaki not bunu
kaydediyor: o listeye yerleşik eklenmemeli.

### Taşımaların doğrulama aracı: `tests/fingerprint.js`

P1.1 ve P1.2 sırasında eklendi ve kalan her taşıma maddesinin (P1.3, P1.4, P2.1)
ön koşulu. Paketin davranışını 1.440 satırlık bir metne indiriyor: her global
fonksiyon adı, her registry'nin anahtar listesi, eşya/silah/ekipman/yaratıkların
sayısal şekli ve hasar yolunun yaratık × seviye × silah sınıfı boyunca çıktısı.

```
node tests/fingerprint.js > before.txt
# ... taşımayı yap, npm run build ...
node tests/fingerprint.js > after.txt
diff before.txt after.txt        # herhangi bir çıktı = taşıma saf değil
```

Bir test değil, bilerek: saklanacak bir beklenen çıktı yok, çünkü sayılar davranış
meşru olarak değiştiğinde değişmeli. Tek bir soruyu yanıtlıyor — "bu refactor bir
şey değiştirdi mi?" — ve karşılaştırarak yanıtlıyor.

---

## P1 — Yapısal ayrıştırma

### P1.1 ✅ Savaş motoru arayüz dosyasının içinde yaşıyor

**Kanıt:** [interface.js:4599-5332](../js/ui/interface.js#L4599-L5332) arası ~734
satır saf oyun mantığı: `allbuff`, `fght`, `attack`, `tattack`, `dmg_calc`,
`minimumLandedDamage`, `hit_calc`, `wpnhitstt`, `wpndiestt`. Bu blok, envanter
çizimi ile tarif paneli çiziminin tam ortasında duruyor.

**Etki:** Savaşla ilgili her değişiklik 8.689 satırlık bir DOM dosyasında
yapılıyor. `docs/AGENTS.md`'nin en uzun ve en sert kuralı (yaratık istatistikleri
ve hasar formülü) tam olarak burayı hedefliyor, ama kural metni "arayüz dosyasının
ortası" demek zorunda kalıyor. Ayrıca P0.2'deki formül kopyası kısmen bu yüzden
var: mantık ayrı bir dosyada olsaydı denetim onu doğrudan okuyabilirdi.

**Öneri:** `js/systems/combat.js` oluştur, bu bloğu taşı,
[sources.js](../scripts/sources.js) içinde **`js/ui/interface.js`'ten sonra,
`js/world/locations.js` öncesine** yerleştir. Sıra kritik: bu fonksiyonlar `msg`,
`addDesc`, `dscr` gibi arayüz yardımcılarını çağırıyor; ancak hepsi çalışma anında
çağrıldığı için fonksiyon hoisting'i sırayı zaten güvenli kılar. Yine de
`docs/AGENTS.md`'nin "kaynak sırasını koru" kuralı gereği taşıma sonrası
`npm run build && npm run check` zorunlu.

**Risk:** Düşük — dosyalar birleştirildiği için tek global kapsam değişmiyor.

**Yapıldı.** `js/systems/combat.js` oluşturuldu (691 satır) ve `scripts/sources.js`
içinde `js/ui/interface.js` ile `js/world/locations.js` arasına yerleştirildi.
`interface.js` 8.689 → **8.013** satıra indi.

Taşınanlar: `allbuff`, `fght`, `attack`, `tattack`, `dmg_calc`,
`MINIMUM_LANDED_SHARE`, `minimumLandedDamage`, `hit_calc`, `wpnhitstt`,
`wpndiestt`. **Taşınmayanlar:** `dumb` ve `mf` — plan bunları savaş bloğunun
parçası sayıyordu, ancak ikisi de yüzen hasar sayısı çizen görsel efekt, dolayısıyla
arayüzde kaldı.

**Saflık kanıtlandı.** `tests/fingerprint.js` (aşağıya bakın) taşımadan önce ve
sonra çalıştırıldı: **1.440 satırlık davranış parmak izi birebir aynı**.

**Beklenen maliyet gerçekleşti — ve P0.3 onu ucuzlattı.** Taşıma,
`check-game-regressions.js` içindeki **beş** iddiayı kırdı; hepsi
`interfaceSource` metnine bakıyordu: kalkan yakınlık terimi, kalkan ustalığı
kazanımları, "yavaş vuruş tikte çözülmeli", `weaponPower(att.eqp[0])` okuyucusu ve
yerelleştirilmiş ıskalama mesajı. Hiçbiri oyuncunun görebileceği bir şey değildi —
planın P0.3 maddesinde tarif edilen kırılganlığın tam örneği.

Düzeltme, iddiaları yeni dosyaya yönlendirmek **değil**: `bundleSource`
(tüm kaynakların birleşimi, `harness.bundleSource()`) eklendi ve bu iddialar ona
bağlandı. Gerekçe iki katmanlı. Bir **yasak** ("hiçbir yer silahın `str`'sine
atama yapmasın") ancak her yerde geçerliyse yasaktır; tek dosyada aranırsa yalnızca
"hata bu dosyada değil" demiş olur. Bir **davranış sözleşmesi** ("yavaş vuruş tikte
çözülür") ise programa dairdir, fonksiyonun hangi dosyada durduğuna değil. Aynı
sebeple `window.alert/confirm` ve `document.body.removeAttribute("style")` yasakları
da pakete bağlandı. Sonuç: bundan sonraki taşımalar bu iddiaları kırmayacak.

### P1.2 ✅ Genel amaçlı yardımcılar `planner.js` içinde

**Kanıt:** [planner.js:211-245](../js/systems/planner.js#L211-L245) —
`addElement`, `deepCopy`, `copy`, `empty`. Bunlardan `addElement` tüm arayüzün
temel yapı taşı, `empty` DOM temizliyor; ikisi de "planlayıcı" ile ilgisiz.

**Etki:** Yeni gelen biri `addElement`'i `js/ui/` altında arar, bulamaz.
[js/utils/](../js/utils/) dizini zaten var ve tam bu iş için tanımlanmış.

**Öneri:** `js/utils/dom.js` (`addElement`, `empty`) ve `js/utils/object.js`
(`deepCopy`, `copy`). `sources.js` sırasında `bootstrap.js`'ten hemen sonraya
konmalı, çünkü `interface.js` tanım anında `addElement` çağırıyor.

**Risk:** Düşük, ama sıra hatası doğrudan boş ekranla sonuçlanır — bu yüzden taşıma
sonrası tarayıcı testi (`npm run test:browser`) şart.

**Yapıldı.** `js/utils/dom.js` (`addElement`, `empty`) ve `js/utils/object.js`
(`deepCopy`, `copy`), `sources.js`'te `bootstrap.js`'ten hemen sonraya kondu.
Parmak izi yine birebir aynı, `npm run check` ve `npm run test:browser` geçiyor.

Not: `empty` plan metninde nesne yardımcılarıyla birlikte anılıyordu ama DOM işi
yapıyor, o yüzden `dom.js`'e alındı. Ayrıca `deepCopy`'nin fonksiyonları referansla
taşıdığı (`typeof o === "object"` kontrolü) yeni dosyada açıkça belgelendi — kopyalanan
bir yaratığın kendi `stat_r`'sini koruması buna dayanıyor ve `scripts/` altındaki
denetimler bunu kullanıyor.

### P1.3 ◐ `interface.js` yedi ayrı sorumluluğu taşıyor

**Kanıt:** Aynı dosyada: tema ve arka plan tercihi (2383-2500), otomatik kayıt
zamanlayıcısı (2286-2380), mesaj günlüğü ve kalıcılığı (4368-4540), savaş
(4599-5332), ekipman ve envanter (5871-6810), dükkân/sandık/demirci panelleri
(7515-8500), açıklama baloncukları (3591-4370).

**Öneri:** P1.1'den sonra kademeli bölme. Sıra önerisi (her adım ayrı commit, her
adımdan sonra tam denetim):

1. `js/ui/message-log.js` — en bağımsız blok, dışa yalnızca `msg` / `msg_add`
   veriyor.
2. `js/ui/preferences.js` — tema, arka plan, otomatik kayıt aralığı.
3. `js/ui/tooltip.js` — `dscr`, `addDesc`, `positionDescription`.
4. `js/ui/shops.js` — `rendershopitem`, `rendersellitem`, `renderrepairitem`,
   `rendersharpenitem`, `rendertrunkitem`.

Geriye kalan `interface.js` yaklaşık 4.000 satırda, tek konulu bir dosya olarak
kalır.

**Risk:** Düşük ama adım sayısı yüksek. Tek seferde yapılmamalı.

**İki adım yapıldı, biri bilinçli olarak atlandı.**

`js/ui/message-log.js` (190 satır) — `msg`, `msg_add`, kırpma, saklama, geri yükleme.
`js/ui/panels.js` (975 satır) — demirci tezgâhı, dükkân tezgâhı, satış listesi, mobilya
listesi ve sandığın iki yanı. Plan bu dosyaya `shops.js` diyordu; adı `panels.js`,
çünkü mobilya listesi aynı bloğun ortasında duruyor ve aynı işi yapıyor — onu ayırmak
bir adı tutturmak için yapılmış bir kesim olurdu.

`js/ui/tooltip.js` (795 satır) — `positionDescription`, `dscr`, `addDesc` ve iki etiket
tablosu. Bu dosya **`interface.js`'ten önce** geliyor ve bu, bu bölmedeki tek sıra
kısıtı: `addDesc` arayüz kurulurken yirmi altı kez çağrılıyor, ve iki etiket tablosu
`const`. Fonksiyon bildirimi tüm birleşik kapsam boyunca hoist edilir, `const`
edilmez — dolayısıyla önceki bir dosyanın tanım anındaki kodundan okunan bir `const`
doğrudan `ReferenceError` olur.

**`interface.js` 8.689 → 6.075 satır** (savaş, mesaj günlüğü, paneller ve baloncuklar
çıktıktan sonra; **%30**).

**Atlanan: `preferences.js`.** Tercih fonksiyonları (`autosaveSeconds`,
`applyBackground`, `restoreBackgroundPreference`, `setBackground`) bitişik değil — araya
DOM kurulum kodu girmiş ve `restoreBackgroundPreference()` tanım anında çağrılıyor.
Blok `const themeStorageKey` ve `const autosaveStorageKey` içeriyor; `const` bildirimi
`function` gibi hoist edilmez, dolayısıyla dosyayı çağrı yerinden sonraya koymak
doğrudan `ReferenceError` üretir. Ayırmak için DOM kurulumunu da bölmek gerekiyor ki bu
planın kapsamı dışında. Yapılırsa dosya `interface.js`'ten **önce** gelmeli.

Her iki adım da `tests/fingerprint.js` ile doğrulandı: parmak izi birebir aynı. Her
adım `check-game-regressions.js`'te birer iddia kırdı (mesaj günlüğü sözleşmesi, panel
yeniden çizim kuralı) ve ikisi de P1.1'de kurulan kurala göre `bundleSource`'a
bağlandı.

### P1.4 Simülasyon katmanı DOM'a yazıyor

**Kanıt:** [simulation.js](../js/systems/simulation.js) içinde 76 satır içi stil
ataması ve 30 `innerHTML`. Örneğin
[simulation.js:1685](../js/systems/simulation.js#L1685) — zaman göstergesi her
tikte HTML dizesi olarak yeniden kuruluyor.

**Öneri:** Bu, P1.3'ten sonra ele alınacak ikinci dalga. Simülasyon "ne değişti"
bilgisini bir olay/geri çağırım yüzeyine yazsın, çizimi arayüz yapsın. Yalnızca
saat, ay evresi ve doygunluk göstergesi ile başlanabilir — tikte çalışan tek
gerçek maliyet orası.

---

## P2 — Tekrarın kaldırılması

### P2.1 ✅ 221 yiyecek maddesi aynı 12 satırı kopyalıyor

**Kanıt:** [items.js](../js/data/items.js) içinde
`you.sat + this.val > you.satmax` kalıbı **221 kez** geçiyor. Her biri şu bloğun
birebir kopyası ([items.js:882-896](../js/data/items.js#L882-L896)):

```js
item.brd.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};
```

Tek fark `skl.glt.use()` argümanı. Bir fabrika fonksiyonu her tanımı tek satıra
indirir:

```js
item.brd.use = eatUse(2);
```

**Etki:** Yaklaşık **2.400 satır** kaybolur ve daha önemlisi: yeme davranışında bir
değişiklik (yeni bir istatistik, doygunluk formülü düzeltmesi, bir mesaj
değişikliği) bugün 221 yerde ayrı ayrı yapılmak zorunda. Bu, atlanan bir kopya
üretmesi neredeyse kaçınılmaz bir iş.

**Aynı sınıftan diğerleri:** 6 iyileştirme maddesi
(`you.hp + this.val > you.hpmax`) → `healUse()`. Toplamda 503 yinelenen blok grubu
ve ~11.200 fazlalık satır ölçüldü.

**Risk:** Düşük ama dikkat gerektirir. `this` bağlaması korunmalı (fabrika normal
`function` döndürmeli, ok fonksiyonu değil). Doğrulama: dönüştürme öncesi ve
sonrası `item` kaydının tüm `use` fonksiyonlarını aynı sahte durumla çağırıp
sonucu karşılaştıran tek seferlik bir betik — P0.3'teki koşum ortamı bunu mümkün
kılar.

**Yapıldı — ölçüm plandan farklı çıktı, önerinin lehine.** Kalıp 221 maddede
geçiyordu ama espree ile şekil envanteri çıkarıldığında **30 ayrı şekil** olduğu
görüldü. İkisi kalabalık: **119** ve **67** madde, toplam **186**. Kalan 35 madde 28
şekle dağılmış (çoğu tek üyeli, kendine özgü davranışlar) ve dokunulmadı.

İki büyük şekil arasındaki tek fark `this.amount--`'ın konumu: birinde panel
güncellemesi ve mesajdan **önce**, diğerinde **sonra**. Bu fark gözlemlenemez ve bu
varsayılmadı, kanıtlandı: `dom.d5_3_1.update()` yalnızca `you.sat`, `you.satmax` ve
`you.efficiency()` okuyor — eşyanın yığınına hiç bakmıyor — ve mesaj `this.val`
okuyor. Dolayısıyla iki yazım tek fonksiyona indi.

`item.brd.use = eatUse(2);` — 186 madde, her biri tek satır.
**`items.js` 7.639 → 5.437 satır (2.202 satır eksildi).**

Fabrika ok fonksiyonu değil normal `function` döndürüyor: `this` yenen eşya olmak
zorunda.

**Doğrulama:** `tests/fingerprint.js` bu iş için genişletildi — artık her eşyanın
`use` handler'ını sabit bir oyuncuya karşı çağırıp ne değiştirdiğini kaydediyor
(oyuncunun sayıları, tükettiği yığın, arttırdığı istatistik sayaçları, enerji
göstergesini yenileyip yenilemediği, log'a yazdığı son satırın metni). 352 handler,
sıfır hata. Dönüşüm öncesi ve sonrası çıktı **tek satır** dışında birebir aynı: yeni
`eatUse` global'inin fonksiyon listesine eklenmesi.

### P2.2 Nesne tanımları mutasyonla kuruluyor

**Kanıt:** 352 `new Item()`, 196 ekipman tanımı, 39 yaratık — hepsi
`item.x = new Item(); item.x.id = ...; item.x.name = ...` biçiminde, madde başına
8-30 satır.

**Öneri:** Bir `defineItem("brd", { id: 2, val: 14, stype: 4, use: eatUse(2) })`
yardımcısı. Ancak bu **P2.1'den sonra** ve isteğe bağlı: kazanç P2.1'e göre çok
daha küçük, dokunulan yüzey ise çok daha geniş. `check-refs.js`'in
`^\s*item\.([A-Za-z0-9_$]+)\s*=` düzenli ifadesi de bu biçime bağlı olduğundan
(P0.3 çözülmeden yapılırsa) denetimi kırar.

**Karar önerisi:** P0.3 tamamlanmadan bu maddeye girilmemeli.

### P2.3 ✅ Geliştirme sunucusu tarayıcı testlerinin gövdesini barındırıyor

**Kanıt:** [serve.js](../scripts/serve.js) 1.960 satır ve tamamı **tek bir
fonksiyon** (`createSiteServer`, 24. satırdan 1.960'a kadar). İçinde 16 adet gömülü
test sayfası var: `__test-boot-screen.html`, `__test-cellar-story.html`,
`__test-combat-layout.html`, `__test-ui-safety.html` ve diğerleri. Her biri şablon
dizesi içine yazılmış, sözdizimi denetiminden geçmeyen tarayıcı kodu.

**Etki:** Bir test probu içindeki yazım hatası ne eslint'e ne de `node --check`'e
yakalanır; yalnızca çalışma anında ortaya çıkar. Sunucunun kendi işi (dosya sunma,
canlı yeniden yükleme) ~150 satır; kalan %92 test verisi.

**Öneri:** Her probu `tests/probes/<ad>.js` dosyasına taşı. Sunucu genel bir kural
uygulasın: `/__test-<ad>.html` isteği geldiğinde `dist/index.html`'i oku,
`tests/probes/<ad>.js` içeriğini enjekte et, döndür. Enjeksiyon noktasının farklı
olması gereken tek durum `__test-boot-screen` (yükleyici etiketinden önce); bu,
prob dosyasının başındaki bir yorum yönergesiyle (`// inject: before-loader`)
çözülür.

Kazanç: `serve.js` ~150 satıra iner, prob dosyaları eslint ve Prettier kapsamına
girer, bir probu düzenlemek için sunucu dosyası açılmaz.

**Risk:** Düşük. `npm run test:browser` doğrudan doğrulama sağlar.

**Yapıldı. `scripts/serve.js` 1.961 → 193 satır.**

Envanter espree ile çıkarıldı ve çıkarmayı mekanik olarak güvenli kılan iki şey
buldu: on altı şablonun **hiçbiri interpolasyon yapmıyor**, ve her blok aynı şekle
sahip — `index.html` oku, tek şablon kur, başlığı yaz, enjekte et, dön. Tek istisna
`boot-screen`: `</body>` yerine yükleyici etiketinden önce enjekte ediyor ve etiketin
hâlâ orada olduğunu kontrol ediyor.

Her prob artık `tests/probes/<ad>.js`. Sunucudaki tek genel kural adı yoldan alıyor,
dosyayı okuyor, `<script>` içine sarıyor ve enjekte ediyor. Enjeksiyon noktası prob
dosyasının başlığındaki `// inject: before-loader` yönergesinden okunuyor.

Prob başlıklarındaki gerekçe yorumları korundu — çıkarma betiği blok içindeki, şablon
dışındaki yorumları toplayıp prob dosyasının başına taşıdı. Bilgi kaybı yok.

**Asıl kazanç satır sayısı değil:** şablon dizesi `node --check`'e ve eslint'e
görünmez, dolayısıyla bir probdaki yazım hatası ancak çalıştırılınca bulunabiliyordu.
Dosya olarak hepsi diğer her şeyle birlikte denetleniyor.

**Ek olarak bir güvenlik sıkılaştırması:** prob adı bir dosya yoluna giriyor, bu
yüzden `^[a-z0-9-]+$` ile sınırlandırıldı. Çözüp-sonra-kontrol etmek yerine baştan
kısıtlamak, bu route'un diskte herhangi bir dosyayı okuma yoluna dönüşmesini
engelliyor.

**Taşınmayanlar:** `/__test/corrupt-save` ve `/__test/unreadable-save` (22 satır).
İkisi de `index.html` kullanmıyor, kendi HTML'ini döndürüyor ve `__test-*.html`
biçiminde değil; genel kurala uymadıkları için yerlerinde kaldı.

**Doğrulama:** `npm run test:browser` 30 senaryonun tamamını geçiyor — probların
tamamı bu yolla çalışıyor, yani route'un dosyadan okuduğu davranış eskisiyle aynı.

---

## P3 — Yükleme başarımı

### P3.1 ✅ Türkçe oyuncu iki yerel dosyayı da, üstelik sırayla indiriyor

**Kanıt:** [i18n-loader.js:128-140](../js/i18n-loader.js#L128-L140) — önce
`fallbackMessages` (en.json, 348 KB) `await` ediliyor, **sonra** `selectedMessages`
(tr.json, 366 KB). İki fetch birbirini bekliyor.

Buna karşılık [check-i18n.js:59-78](../tests/check-i18n.js#L59-L78) her yerel dosya
için **tam anahtar paritesi** zorunlu kılıyor: eksik anahtar da fazla anahtar da
yapıyı çökertiyor. Yani `tr.json` yüklendiğinde `en.json`'a düşülecek tek bir
anahtar bile yok — 348 KB'lık indirme kanıtlanabilir biçimde gereksiz.

**Öneri, iki kademeli:**

1. **Hemen, sıfır riskli:** iki fetch'i `Promise.all` ile paralelleştir. Bir tur
   gecikmesi kazanılır.
2. **Asıl kazanç:** [manifest.json](../locales/manifest.json) içindeki her yerel
   tanımına `"complete": true` alanı ekle; bunu `check-i18n.js` yazsın veya
   doğrulasın. Yükleyici, seçili yerel `complete` ise geri düşüş dosyasını hiç
   istemesin. Türkçe oyuncu için **348 KB (gzip ~105 KB) tasarruf** ve bir fetch
   eksilir.

Eksik çeviriye izin veren yeni bir dil eklendiğinde `complete: false` yazılır ve
davranış bugünküne döner — `docs/AGENTS.md`'nin "İngilizce geri düşüşe dayanabilir"
kuralı korunur.

**Kademe 1 yapıldı.** İki `await` `Promise.all`'a çevrildi; Türkçe oyuncu artık
İngilizce için tam bir gidiş-dönüş beklemeden Türkçeyi istemeye başlıyor. Tarayıcı
takımının "Turkish startup" senaryosu doğruluyor. **Kademe 2 (manifest'te
`complete` bayrağı, 348 KB tasarruf) hâlâ bekliyor.**

**Kademe 2 de yapıldı.** `locales/manifest.json`'daki her yerel tanımı artık bir
`complete` bayrağı taşıyor. Yükleyici, seçili yerel tam işaretliyse geri düşüş
dosyasını **hiç istemiyor** — Türkçe oyuncu için 348 KB'lık `en.json` isteği tamamen
ortadan kalktı.

`complete` bir söz değil, denetlenen bir olgu: `tests/check-i18n.js` tam işaretli bir
yerelde tek bir eksik anahtar bulursa yapıyı düşürüyor ve hata mesajı ne yapılacağını
söylüyor (çevir ya da bayrağı kaldır).

**Bu arada mevcut bir tutarsızlık da düzeldi.** `docs/AGENTS.md` "İngilizce olmayan
yereller, çeviriler tamamlanana kadar İngilizce geri düşüşe dayanabilir" diyordu ama
`check-i18n` her yerelden **tam parite** istiyordu — yani kural yazılıydı, denetim onu
imkânsız kılıyordu. Ayrım artık doğru yerden geçiyor: İngilizce'de olmayan bir anahtar
her zaman hata (onu kimse okumuyor, ya yazım hatası ya artık), İngilizce'de olup
yerelde olmayan bir anahtar ise yalnızca yerel kendini tam ilan ediyorsa hata.

**Regresyon testi eklendi ve negatif kontrolü yapıldı.** Kazanç _gerçekleşmeyen_
istekte olduğu için sayfanın içeriğinden görülemez; test sunucunun gerçekten gördüğü
isteklere bakıyor. `tr`'nin `complete` bayrağı kaldırıldığında test kırılıyor —
doğrulandı.

### P3.2 ✅ Paket, yerel dosyalar inmeden indirilmeye başlamıyor

**Kanıt:** Yükleyici manifest → geri düşüş → seçili yerel zincirini bitirdikten
sonra `game.js` betiğini DOM'a ekliyor
([i18n-loader.js:167-172](../js/i18n-loader.js#L167-L172)). Paket 1,22 MB ile
sayfanın en büyük varlığı ve indirilmesi en sona bırakılmış durumda.

**Öneri:** [index.html](../index.html) dosyasına önyükleme ipucu ekle:

```html
<link rel="preload" as="script" href="js/game.js" />
```

`preload` yalnızca indirir, çalıştırmaz — dolayısıyla `i18n`'in paketten önce var
olması kuralı bozulmaz, ama indirme yerel dosyalarla **paralel** başlar. Sürüm
damgası gerektiği için bu satırın [build-site.js](../scripts/build-site.js) içinde
`?v=` ile işaretlenmesi gerekir; dosya zaten CSS ve yükleyici için tam olarak bunu
yapıyor.

**Risk:** Düşük. Ölçüm: Chrome'un ağ paneli veya `test:browser` içine eklenecek bir
zamanlama iddiası.

**Yapıldı.** `index.html` artık paketi önyüklüyor:

```html
<link rel="preload" as="script" href="js/game.js" />
```

`preload` yalnızca indiriyor, çalıştırmıyor — dolayısıyla `i18n`'in paketten önce var
olması kuralı bozulmuyor, ama 1,2 MB'lık transfer yerel isteklerle **paralel**
başlıyor.

`scripts/build-site.js` ipucunu `?v=` ile damgalıyor. Bu ihmal edilebilir bir ayrıntı
değil: ipucu ile yükleyicinin kendi isteği **birebir aynı URL** olmazsa tarayıcı bunu
iki ayrı kaynak sayar ve 1,2 MB iki kez inerdi — yani hiç önyüklememekten yavaş
olurdu. Tarayıcı testi tam bunu doğruluyor ve damgalama kaldırıldığında kırılıyor;
negatif kontrolü yapıldı.

### P3.3 Paket minify edilmiyor

**Kanıt:** `dist/js/game.js` 1.251.555 bayt, gzip sonrası 235 KB. Kaynak zaten
üretilmiş bir çıktı olduğundan minify etmek okunabilirlik kaybı yaratmaz.

**Öneri:** Yalnızca P3.1 ve P3.2 ölçüldükten sonra değerlendirilmeli. Bir minify
adımı yeni bir bağımlılık ve yeni bir hata sınıfı getirir (bu kod tabanı global
hoisting ve tek kapsam davranışına bağlı, agresif bir minifier bunu bozabilir).
Kazanç, P3.1'in kazancından küçük olacağı için **sıra sonuncudur**.

---

## P4 — Sağlamlaştırma ve hijyen

### P4.1 Oyuncu adı ve mesaj günlüğü `innerHTML` üzerinden çiziliyor

**Kanıt:** [interface.js:13-23](../js/ui/interface.js#L13-L23) — `you.name`
doğrudan bir `<input>` değerinden alınıp `dom.d2.innerHTML` içine yazılıyor;
doğrulama veya kaçış yok. Aynı ad savaş mesajlarına giriyor, mesajlar `msg_add`
içinde HTML olarak birleştiriliyor
([interface.js:4520-4536](../js/ui/interface.js#L4520-L4536)) ve
`restoreMessageLog` kayıtlı HTML'i `row.innerHTML` ile geri yüklüyor
([interface.js:4399](../js/ui/interface.js#L4399)).

**Etki:** Tek oyunculu, sunucusuz bir oyun olduğu için bu klasik anlamda bir
güvenlik açığı değil — oyuncu yalnızca kendi tarayıcısında kod çalıştırabilir.
Ancak [encoding.js](../js/utils/encoding.js) başlığı kayıtların **dışa aktarılan
dosyalar** olarak paylaşıldığını söylüyor. Başkasından alınan bir kayıt dosyası,
adı üzerinden rastgele JavaScript çalıştırabilir; üstelik yük `proto23.messagelog`
içinde kalıcı olduğu için oturumlar arası yaşar.

**Öneri:** İki küçük değişiklik yeterli:

- `dom.d2.innerHTML = you.name` → `dom.d2.textContent = you.name`.
- Ad girdisine uzunluk ve karakter sınırı (`maxlength` + `<` / `>` reddi).

Mesaj günlüğünün tamamını `textContent`'e çevirmek renk/gölge biçimlendirmesini
kaybettireceği için önerilmiyor; kaynak temizlenince günlük de temiz olur.

**Risk:** Çok düşük. Regresyon testi: adı `<b>x</b>` yapıp HUD'da birebir metin
olarak göründüğünü doğrula.

### P4.2 ✅ `docs/ROADMAP.md` dört yerde referans veriliyor ama yok

**Kanıt:** [AGENTS.md:20](AGENTS.md#L20), [AGENTS.TR.md:20](AGENTS.TR.md#L20),
[README.md:148](../README.md#L148), [README.TR.md:149](../README.TR.md#L149) bu
dosyayı tarif ediyor. `docs/` içinde böyle bir dosya yok.

**Öneri:** Ya dosya oluşturulmalı ya da dört referans da kaldırılmalı. Var olmayan
bir belgeye yönlendiren bir yönerge dosyası, yönergenin geri kalanının
güvenilirliğini de düşürür.

**Yapıldı.** Depo sahibi dosyayı bilerek sildiğini bildirdi; dört referansın
dördü de (`docs/AGENTS.md`, `docs/AGENTS.TR.md`, `README.md`, `README.TR.md`)
kaldırıldı.

**İlgili:** `docs/STORYPROGRESS.TR.MD` ve `docs/STORYPROGRESS-2.TR.MD` — uzantıları
büyük harf (`.MD`, diğerlerinde `.md`) ve İngilizce eşlenikleri yok; bu,
`docs/AGENTS.md`'nin kendi "İngilizce ve `.TR.md` eşleniklerini senkron tut"
kuralına aykırı. Uzantı düzeltmesi büyük/küçük harfe duyarsız dosya sistemlerinde
iki adımlı `git mv` gerektirir.

### P4.3 ◐ CSS renkleri kod ile stil sayfası arasında bölünmüş

**Kanıt:** [game.css](../css/game.css) içinde 123 farklı renk değeri, buna karşılık
yalnızca 12 satırda CSS değişkeni. Aynı zamanda `interface.js` 923 satır içi stil
ataması yapıyor; bunların çoğu `row.style.backgroundColor = "rgb(10,30,54)"` gibi
sabit renkler ([interface.js:7517](../js/ui/interface.js#L7517),
[interface.js:7593](../js/ui/interface.js#L7593) — aynı renk, farklı fonksiyon).

**Öneri:** Sabit renkleri `:root` altında adlandırılmış değişkenlere topla
(`--panel-row-bg`, `--panel-row-unaffordable-bg`, `--accent-danger` ...), JS
tarafında sabit yerine sınıf ata. Tam dönüşüm gerekmiyor; yalnızca birden fazla
yerde geçen renkler alınsa bile tema değiştirmek ya da kontrast düzeltmek tek
dosyalık bir işe döner.

**Risk:** Düşük ama görsel; her adımda ekran görüntüsü karşılaştırması gerekir.

**Kısmen yapıldı — bilinçli olarak dar tutuldu.**

Önce bir düzeltme: bu maddenin ölçüsü "CSS'te 12 satırda değişken" diyordu. Yanlıştı;
o sayı `--danger` gibi **sınıf adlarını** sayıyordu. `css/game.css`'te **hiç** custom
property yoktu.

Token'a çevrilenler, anlamı kaynaktan kesin olarak doğrulanabilen üç yüzey:

| Token               | Değer           | Ne                                                 |
| ------------------- | --------------- | -------------------------------------------------- |
| `--list-well`       | `rgb(0 20 44)`  | Bir listenin kapsayıcısı (`bst_entr_case`, `ch_1`) |
| `--list-row`        | `rgb(10 30 54)` | O listenin içindeki bir satır                      |
| `--list-row-denied` | `rgb(68 26 38)` | Oyuncunun karşılayamadığı satır                    |

Üçü tutarlı bir sistem: kapsayıcı en koyu, satır bir ton açık, karşılanamayan satır
kırmızıya kayıyor. **20 kullanım** değişti ve `rgb(10,30,54)` ile `rgb(10, 30, 54)`
yazımları birleşti — aynı rengin iki yazımı, tekrarlanan bir sabitin tam olarak
dönüştüğü şey.

JS tarafı `style.backgroundColor = "var(--list-row)"` yazıyor; satır içi stilde custom
property geçerli.

**Kalanlar bilinçli olarak bırakıldı.** `rgb(255,192,5)`, `rgb(0,235,255)`,
`rgb(44,255,44)` bir eşyanın `stype` değerine göre seçilen bir renk skalası; `#e8421c`
hava durumu göstergesinin arka planı. Anlamlarını doğrulamadan isim vermek, yanlış
isimli bir token üretme riski taşıyor — ve yanlış isimli bir token, sabit renkten
**kötüdür**: okuyucuyu yanlış yönlendirir ve yanlış yerde kullanılır.

**Sessiz bozulma riski iki katmanla kapatıldı**, çünkü bu değişikliğin bozulma şekli
görünmez: çözülmeyen bir custom property bildirimi geçersiz kılıyor, yani satır yanlış
renk almıyor — **hiç arka plan almıyor** ve hiçbir şey hata vermiyor. Kimsenin
eklemediği bir stil kazası gibi görünürdü.

1. `check-game-regressions.js`: `css/game.css` üç tanımı da içermeli **ve** paketin
   hiçbir yerinde o altı sabit yazım geri gelmemeli (eski bir panelden kopyalanan yeni
   bir panel tam olarak böyle geri getirir).
2. `tests/probes/list-surfaces.js`: her token oyunun uyguladığı gibi uygulanıp
   `getComputedStyle` ile geri okunuyor. Çözülmeyen bir token `rgba(0, 0, 0, 0)`
   dönüyor.

İkisinin de token adı bozulduğunda kırıldığı doğrulandı.

### P4.4 Klavye erişilebilirliği yok

**Kanıt:** `interface.js` ve `locations.js` toplam 545 `click` dinleyicisi
tanımlıyor. Buna karşılık tüm kod tabanında 6 `aria-*` / `role` kullanımı var,
`tabindex` hiç yok. Seçenekler (`chs`) `<div>` olarak üretiliyor.

**Etki:** Oyun yalnızca fare ile oynanabiliyor. `listen_k` bir kısayol katmanı
sağlıyor ama menü gezinmesini kapsamıyor.

**Öneri:** Kapsamlı bir erişilebilirlik çalışması bu belgenin dışında; ancak tek
bir düşük maliyetli adım anlamlı fark yaratır: `chs()` fabrikasının ürettiği her
seçeneğe `tabindex="0"` ve `role="button"` ekle, `Enter` / `Space` tuşunu `click`'e
bağla. `chs()` tek bir fonksiyon
([interface.js:6818](../js/ui/interface.js#L6818)), dolayısıyla değişiklik tek
noktada.

### P4.5 Küçük hijyen maddeleri

- **Ölü kod:** Kaynaklarda 99 satır yoruma alınmış kod, 12 `TODO` / `FIXME`.
  [strip-comments.js](../scripts/strip-comments.js)'in kendi yorumu bunu zaten
  kabul ediyor ("terk edilmiş sahneler, eski bir hasar formülü, hiç bitirilmemiş
  bir Pill Tower"). Git geçmişi var; bunlar silinebilir.
- **`.gitignore`:** Next.js, Vercel, TypeScript ve Yarn PnP girdileri bir şablondan
  kalmış; bu projede karşılıkları yok.
- **`for...in` kullanımı:** 310 kez, çoğu dizi üzerinde. Davranış bugün doğru ancak
  dizi üzerinde `for...in` hem sırayı garanti etmez hem de prototip kirliliğine
  açıktır. Yeni yazılan kodda `for...of` tercih edilmeli; mevcutları toplu
  değiştirmenin getirisi riskinden düşük.
- **`Base64`:** [encoding.js:13](../js/utils/encoding.js#L13) — 1998 tarihli
  webtoolkit.info uygulaması, 153 satır. `btoa` / `atob` + `TextEncoder` aynı
  çıktıyı üretir. Kayıt uyumluluğu gereği yalnızca birebir çıktı eşitliğini
  doğrulayan bir testle birlikte değiştirilmeli; kazanç küçük olduğu için önceliği
  en düşük.

---

## Önerilen sıra

Her faz kendi içinde tamamlanıp `npm run format && npm run build && npm run check`
ile doğrulanmalı, ardından `docs/AGENTS.md`'nin 9. maddesi uyarınca bir kontrol
noktası commit'i alınmalı.

| Faz  | İçerik                                                          | Beklenen sonuç                                           |
| ---- | --------------------------------------------------------------- | -------------------------------------------------------- |
| 1 ✅ | P0.1 (espree), P4.2 (ROADMAP), P3.1 kademe 1 (`Promise.all`)    | Tek oturumluk, sıfıra yakın riskli düzeltmeler           |
| 2 ✅ | **P0.3 — test koşum ortamı** (`tests/harness.js`)               | Sonraki her fazın maliyetini düşürür. Kritik yol burası. |
| 3 ◐  | P0.2 (formül) tamam — P1.1 (`combat.js`), P1.2 (utils) bekliyor | Savaş güvenlik ağı gerçekten çalışır hâle gelir          |
| 4    | P2.1 (yiyecek fabrikası), P2.3 (prob dosyaları)                 | ~4.000 satır eksilir, veri katmanı bakılabilir olur      |
| 5    | P3.1 kademe 2, P3.2 (preload)                                   | Türkçe oyuncu için ~348 KB daha az indirme               |
| 6    | P1.3 (`interface.js` bölünmesi), P4.3 (renk token'ları)         | Kademeli, her adım ayrı commit                           |
| 7    | P4.1, P4.4, P4.5, P1.4, P2.2, P3.3                              | İsteğe bağlı; getiri/risk oranına göre ayrı ayrı karar   |

**Kritik gözlem:** Faz 2 atlanırsa Faz 3 ve 4 çok daha pahalı ve riskli olur, çünkü
mevcut regresyon testleri kaynak metnine bağlı ve her taşıma işlemi onları kırar.
Sıra keyfi değil.

### Kaynak sırası — `tooltip.js` neden `interface.js`'ten önce

Bu kod tabanının gerçek tek sıra kuralı: **`function` bildirimi tüm birleşik kapsam
boyunca hoist edilir, `const` edilmez.**

- Çalışma anında çağrılan her şey nereye konursa konsun çalışır → `combat.js`,
  `message-log.js`, `panels.js` `interface.js`'ten **sonra**.
- Tanım anında çağrılan bir fonksiyon da çalışır (hoisting) → `dom.js`, `object.js`
  `bootstrap.js`'ten sonra, `interface.js`'ten önce ama bu bir zorunluluk değil.
- **Tanım anında okunan bir `const` çalışmaz.** `tooltip.js` iki `const` etiket
  tablosu taşıyor ve `addDesc` arayüz kurulurken 26 kez çağrılıyor → bu dosya
  `interface.js`'ten **önce** gelmek zorunda.
- Aynı sebeple `preferences.js` ayrılamadı: `const themeStorageKey` ve
  `const autosaveStorageKey`, tanım anında çağrılan `restoreBackgroundPreference()`
  tarafından okunuyor.

## Dokunulmayacaklar

Aşağıdakiler bilinçli tasarım kararlarıdır ve bu planın kapsamı dışındadır:

- **Kayıt biçimi.** Boru ile ayrılmış konumsal JSON parçaları kırılgan görünür,
  ancak `docs/AGENTS.md` açık bir göç olmadan değiştirilmesini yasaklıyor ve gerekçe
  geçerli: mevcut oyuncuların kayıtları.
- **Tek global kapsam ve `scripts/build.js` sırası.** Modül sistemine geçiş ayrı ve
  bilinçli bir göç konusu; bu plan onu varsaymaz, tam tersine mevcut yapıyı kullanır
  (bkz. P0.3).
- **`i18n.t()` zorunluluğu ve karma sonekli anahtarlar.** 3.424 anahtarın 1.043'ü
  `..._5ced966d` biçiminde otomatik üretilmiş adlar taşıyor; okunabilirliği düşük
  ama toplu yeniden adlandırma yüksek riskli ve sıfır oyuncu faydası olan bir iş.
- **`fitGameToViewport` yaklaşımı.** Sabit düzenli bir oyun için zoom tabanlı
  ölçekleme meşru bir tercih; medya sorgusuna geçiş oyunun düzen varsayımlarını
  baştan yazmak demektir.
