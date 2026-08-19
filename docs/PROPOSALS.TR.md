# Öneriler

[English](PROPOSALS.md)

Yapılmaya değer ama henüz yapılmamış şeyler. Buradaki hiçbir şey oyunda yok — bu
dosyanın bütün amacı da bu. Bir öneri hayata geçtiğinde buradan çıkar ve olgu olarak
[docs/STORY.md](STORY.TR.md) belgesine geçer.

Her madde üç şey söyler: nedir, üzerine kurulacak ne zaten var, ve gerçekten yeni
olması gereken ne. İkinci kısım önemli: projenin kuralı, yeni içerik icat etmeden
önce tamamlanmış içeriği bağlamak — yani çok yeni malzeme isteyen bir önerinin bunu
gerekçelendirmesi gerekiyor.

Durum şunlardan biri: **önerildi** (yazıldı, karar verilmedi), **kabul** (yapmaya
karar verdik) veya **devam ediyor**.

---

> **Kırsal bölge ve maden tasarlandı.** Her birini neyin açtığı, oyuncunun ne alması
> beklendiği ve neyin kapattığı için [REGIONS.TR.md](REGIONS.TR.md). Korkuluk ve kandil
> ruhu artık engelli değil; orada programlandı.

## Sahibinin sıraya aldığı işler

Sahibinin istediği ve henüz bitmemiş her şey, oturumlar arasında hiçbir şey kaybolmasın
diye işe başlanmadan önce buraya kaydedilir. Bir madde yayına girdiğinde bu listeden
çıkar; ne yaptığı changelog'a, hikâyeye dokunuyorsa [STORY.md](STORY.md) dosyasına girer.

> **Bu maddeler kaydedildikten sonra kodla karşılaştırıldı ve araştırma birkaçını
> değiştirdi.** İkisinin zaten yayınlanmış olduğu çıktı. Dördü, ölçümün çürüttüğü bir öncüle
> dayanıyordu. Yol boyunca bulunan iki tek-kelimelik hata v478.30'da düzeltildi. Aşağıdaki
> her madde ölçümün ne bulduğunu söylüyor, çünkü akıldan yazılmış bir istek ile koddan
> yazılmış bir istek aynı istek değildir.

### 5. Dirençler dövüşte okunuyor mu? — **cevap: çoğunlukla hayır**

**Durum:** cevaplandı. Ondan çıkan şey bir karar.

`res` nesnesinin 12 alanı var; oyuncuda (`js/core/player.js:89-102`) ve her yaratıkta
birebir aynı. **On ikisinden on biri `dmg_calc` tarafından hiç okunmuyor.** Bir efektin
uygulanıp uygulanmayacağını belirliyorlar, ne kadar hasar geçtiğini değil — `giveEff` onlara
danışıyor, hasar yolu danışmıyor.

Ve isteğin saydığı üç şey üç farklı sistemde yaşıyor; yalnızca biri bir `res` alanı:

- **Ağrı direnci** `res.ph`, ve canlı bir okuyucusu olan tek alan.
- **Ölümsüz direnci** bir `res` alanı değil. Yaratığın `type`'ına göre indekslenen
  `you.maff` / `you.cmaff`, ki `dmg_calc` onu okuyor.
- **Karanlık savunma** da bir `res` alanı değil. Yakınlık dizilerindeki karanlık element
  yuvası, `aff[6]`.

Dürüst cevap şu: dirençler hasarı azaltmıyor, bir istisna dışında; ve sayılan üç şeyin ikisi
direnç değil. **Azaltmalı mı** sorusu bir karar ve 4. maddeyle etkileşiyor — hasar azaltma
terimi formüldeki baskın sayı zaten.

**Ölçüm sırasında bulunan net bir hata:** `js/data/skills.js:499`, `you.res.ph += 0.01` yazan
bir kilometre taşı. İşaret, `res.ph`'ın tüketilme yönüne göre ters. Değiştirmeden önce yönü
doğrula; her hâlükârda tek satır.

### 6. Unvanlar: 26'sı yazılmış, çevrilmiş ve hiç verilmiyor

**Durum:** kabul edildi, ve göründüğünden ucuz.

İstek "unvanlarda iyileştirme ve arttırım" idi. Ölçüm sorunun ekleme olmadığını söylüyor:
**108 unvanın 23'ünün hiçbir verme yolu yok** — `npm run pending` ile ölçüldü, ki buraya elle yazılmış herhangi bir sayıdan çok ona güvenilmeli. En büyük dört
aile zaten canlı, kaydedilen sayaçlar taşıyor, dolayısıyla bunları bağlamak tasarım değil
kablolama. `js/data/equipment.js:2730-2731` bunun parçası: yorumda bırakılmış iki verme
işlevi, ikisi de `ttl.mone1`'in zaten kullandığı `moneyg >= GOLD` koşulunu deniyor, yani
oldukları gibi yorumdan çıkarılsalar üçü birden tetiklenirdi.

Bu, projenin kendi kuralı, üzerine hiçbir şey eklenmemiş hâli: daha fazlasını yazmadan önce
biteni bağla.

### 7. Kalkanlar: rütbeler, kaynağı olmayan yedisi ve `eqp.dummy`

**Durum:** kabul edildi. Taslak öncülü eskimiş; `eqp.dummy` yarısı tam isabet.

"On dört kalkanın on biri `str 0` ile geldi" hiçbir zaman tam olarak bu şekilde değildi ve
artık hiç doğru değil: **on yedi** kalkan var, hiçbiri `str 0` değil, `csr`'de 4'ten `drd`'de
23'e uzanıyorlar ve `aff[0]` ile `cls` baştan sona dolu — `ee65ee8` commit'inde bitirilmiş.

Gerçekten kalan:

- **On yedinin on birinin hiç kaynağı yok** — ne tarif, ne satıcı, ne düşme: `bkl`, `plt`,
  `twr`, `spk`, `kit`, `csr`, `ovl`, `knt` ve üç tane daha.
- **On yedisinin de `int`'i 0**, dolayısıyla `dmg_calc`'ın büyü dalında, bir kalkanın
  `you.eqp[1].int` üzerinden katkı yaptığı yerde, oyundaki hiçbir kalkan bir büyüye karşı
  savunma yapmıyor.
- [status.md](status.md) kuyruk 6. maddedeki `eqp.dummy` sorunu kaydedildiği gibi duruyor ve
  "kalkan her zaman hasarı azaltır" o temizlenmeden doğru hâle getirilemez.

### 8. Tekrarlanabilir kaynağı olmayan iyileştirme eşyaları

**Durum:** kabul edildi — düzeltme.

352 eşyanın tamamı üzerinde ölçüldü: altı anlık iyileştirme eşyası, üçü azami HP'yi yükselten,
ve oyunda **hiç** HP yenilenme efekti yok. İsteğin işaret ettiği açık gerçek ve tek bir eşyadan büyük: **dört iyileştirme eşyasının hiç
kaynağı yok** — `lifedr`, `hptn2`, `hptn3` ve `hptn4`. `hptn1` ve gerisi erişilebilir. Dört
tarif ya da bir satıcı satırı bunu kapatıyor.

### 9. Üretim: kimsenin öğrenemediği 19 bitmiş tarif, ve yıldız tozu

**Durum:** kabul edildi.

62 tarif var. Ölçüm, çeşitlendirme sorununun isteğin koyduğu yerde olmadığını buldu: **19
bitmiş, tamamen çevrilmiş tarifin oyuncunun öğrenebileceği hiçbir yolu yok.** Önce onları
bağla — yine projenin kendi kuralı — ve kalan açık yaklaşık dokuz gündelik yemek satırı.

`item.stdst` "boş kalıyor"dan kötü durumda: **62 tarifin sıfırı ona dokunuyor** ve `use()`'unun
tamamı bir mesaj. En ucuz doğru düzeltme, zaten var olan `effect.cdlt`'yi yeniden kullanıyor.

### 10. Her yeteneğe 15. seviyeye kadar avantaj — **kapsam için karar gerekiyor**

**Durum:** karar gerekiyor. Yanındaki iki hata zaten düzeltildi.

Öncül, en çok önem taşıyan biçimde kısmen yanlış: **15. seviye mütevazı bir taban değil, derin
endgame.** `expnext()` 60 yeteneğin hepsinde aynı ve kümülatif deneyim 5. seviyede 716, 10.
seviyede 47.986, **15. seviyede 1.151.201** — eylem başına 0,2 ile 0,6 arası tipik kazançlara
karşı. Mevcut tasarım bunu zaten biliyor: seviye ≤ 15'teki 143 kilometre taşı girdisinin
69'u 1-5 seviyelerinde ve yalnızca 6'sı 12-14 arasında bir yerde.

Maliyet tamamen okumaya bağlı, o yüzden burada sahibinin birini seçmesi gerekiyor:

| Okuma                                               | Yeni girdi | Yeni dil dizgesi |
| --------------------------------------------------- | ---------- | ---------------- |
| Yetenek başına 15. seviyeye kadar en az bir avantaj | 32         | ~64              |
| Boş yeteneklerde mevcut yoğunluğu tutmak            | ~230       | ~460             |
| Zaten bir kısmı olan 23'te 1-15 arasını doldurmak   | 202        | ~404             |
| 60 yeteneğin hepsinde her seviyede bir avantaj      | 757        | ~1.514           |

Son okuma bir içerik değirmeni ve projenin kendi ölçütüne göre kendini haklı çıkarmıyor.

**Ayrıca ölçüldü:** beş yetenek 0. seviyeden hiç çıkamıyor (`bwc`, `hvt`, `glg`, `mntnc`,
`swm`) ve dördü `skills.js` dışında hiçbir yerde referans edilmiyor — atıl tanımlar. `bwc`'nin
deneyim _oranı_ beş yerde yükseltiliyor ve hepsi sıfırı çarpıyor. Bu beşine deneyim yolu
vermeden avantaj vermek, hiçbir şeyin tetikleyemeyeceği avantaz yazmak olurdu.

**v478.30'da düzeltildi, ikisi de burada bulundu:** `skl.hvt.type` `skl.hst` bloğunun içine
yazılmıştı, `skl.hst.type` ayarsız kalıyordu — Harvesting tek type 0 yetenekti ve tek başına
sıralanıyordu. Ve iki kilometre taşı var olmayan `you.eqp_t`'ye yazıyordu, dolayısıyla
Oburluk'un 10. ve Ölüm'ün 5. seviyesi EXP bonusu vaat edip NaN veriyordu.

**Yukarıda kaydedilen kısıta düzeltme:** bir kilometre taşının yazabileceği alanların listesi
`stra`/`agla`/`inta`/`spda`/`hpa`/`sata`'dan geniş. `exp_t`, `luck` ve `mods` nesnesinin
tamamı da kaydediliyor — 146 girdideki ölçülen yazımlar: `exp_t` 43, `hpa` 38, `stra` 32,
`agla` 25, `sata` 23, `mods.sbonus` 7, `inta` 6, `mods.cpwr` 3, `luck` 2, `spda` 1.

### 11. Silah ustalığı unvanları — **çoğu zaten kurulu**

**Durum:** yeni olan tek parça için karar gerekiyor.

İsteğin iki yarısı da zaten var. **22 silah ustalığı unvanı oyunda ve 13'ü zaten bir ustalık
kazanç oranı bonusu taşıyor.** Var **olmayan** şey, isteğin ima ettiği koşul: o bonusu unvanın
**takılı olmasına** bağlamak. Yeni olan tek parça bu, ve bir eksik değil bir tasarım kararı.

### 12. ~~Ateş hasarında yanma debuff'ı~~ — **zaten yayınlandı**

**Durum:** kapalı. Yapılacak bir şey yok.

`c19c781` commit'inde yayınlandı: "Let fire actually burn: a real burning effect, and a chance
to catch". Bir ateş vuruşu, yaratığın sağlığını zamanla düşüren bir yanma efekti uygulama
şansı atıyor — tam olarak isteğin tarif ettiği şey. İki dilde baştan sona doğrulandı. Açık kalan
tek ayrıntı efektin kendi kodundaki bir `?? 1` koruması, ki o bir özellik değil sağlamlık notu.

### 13. Mobilya — **üçte ikisi zaten yayınlandı**

**Durum:** kalan üçte bir için kabul edildi.

`ea8fa22` commit'inde yayınlandı (2026-08-18, "Notice which bed you own, and make a lit fire
worth sleeping beside"): yataklar var, `furniture.bed1` ve üstü, ve oyuncu bir yatağa sahip
olduğunda "yere çök" satırı zaten değişiyor, iyileşme hızı da derecesine göre yükseliyor.

Kalan, isteğin de sorduğu üçte bir: **hiçbir oyuncunun elde edemediği, bitmiş ve adı konmuş
iki mobilya parçası.** Onları bağlamak işin tamamı.

### 14. ~~Yakmaya değer bir şömine~~ — **zaten yayınlandı**

**Durum:** kapalı. Yapılacak bir şey yok.

Bu isteğin her cümlesi oyunda, ikisi de 2026-08-18 tarihli iki commit'te: yanan ateşin
iyileşmesi ve enerji kazancı için `ea8fa22`, yanında uyuduktan sonraki süreli buff için
`00295f7` ("Leave a night by the fire on the player: the Rested effect"). İki dilde çalışıyor.
Açık kalan tek şey yanlış bir yorum.

### 15. Sınırsız temizleme — **kaldırılacak sınır çoğunlukla yok**

**Durum:** karar gerekiyor, ve göründüğünden küçük.

31 alanın tamamı üzerinde ölçüldü: **31'in 21'i temizlenince kendini yeniliyor**, dolayısıyla
dünyanın büyük kısmı için temizleme zaten sınırsız. Ve isteğin sorduğu "N kez temizle, sonra
açılır" deseni oyunun başka yerinde **zaten iki kez yayınlanmış**.

Yani iş yeni bir mekanizma değil. Kalan 10 alandan hangilerinin 21'i gibi davranması gerektiğine
ve mevcut açılma deseninin hangileri için yeniden kullanılacağına karar vermek. Bu bir içerik
kararı ve kayıt göçü gerektirmiyor — ki bu, bu maddenin aksesuar yuvalarıyla eşleştirilme
sebebini ortadan kaldırıyor.

### 16. Araştırmanın başka yerlerde kullanılması — **12 yerde bağlı, iki hatayla**

**Durum:** hatalar için kabul edildi; genişletme, söylendiğinden küçük bir iş.

"Başka hiçbir yerde kullanılmıyor" yanlış: araştırma **12 yere** bağlı — 7 konum ve 5 sektör
araştırma tablosu taşıyor ve yeni bir oyunda kayıtlı 82 sahnenin 52'si birine ulaşabiliyor.

Yanlış öncülün altında, hiçbir tasarım sorusu bağlı olmayan iki gerçek hata var:

- tablosu hiç olmadığı hâlde kendini "arandı" bildiren bir orman, ve
- araştırma yolu tamamlanamayan bir kömür madeni.

Önce bu ikisini düzelt; araştırmayı daha ileri götürmek ondan sonra bir mekanik değil içerik
seçimi.

### 17. Yan hikâyelere devam

**Durum:** önerildi. Kancalar aşağıdaki "Hâlâ borçlu olduğumuz yan hikayeler" bölümünde
listeli; brief'in sekiz sayısı ona göre ölçülüyor.

Sahibinin bir kararı burada bekleyen değil **kapanmış** olarak kaydedildi: oyuncu panelindeki
efekt şeridinin ŞANS okumasına binmesi **olduğu gibi kabul edildi** -- bilgi olarak okunuyor ve
bu yeterli. Değişiklik yok. Yazıya geçirilmesinin sebebi şu: aksi hâlde sonraki bir okuyucu
binmeyi görüp kimsenin fark etmediği bir hata sanır.

### 18. Karanlık tasarımın atladığı yüzeyler

**Durum:** kabul edildi — sahibi bunu doğrudan istedi ve bir maddesi v478.29'da zaten
yayına girdi (kayıt aktarma diyalogları ve `#save-bar-restore`).

`css/game.css` ve `js/ui/` beş mercekle denetlendi — palet, elle kurulmuş overlay'ler,
klavye erişimi, hover/focus halleri, yapı — ve her aday bulgu, onu çürütmekle görevli ayrı
bir geçiş tarafından yeniden okundu. On dokuzu ayakta kaldı. Sıra, oyuncunun gördüğü
etkiye göre.

1. **İpucu panelinin çerçevesi** (`css/game.css:974-989` `#dscr`, `730-733` `#d_l`).
   İçi çoktan `#333`/`#111`'e karartılmış bir panelin etrafında `5px lightgrey` kenarlık ve
   onun dışında siyah outline. Bu, oyunda en sık görünen yüzey ve ekranda kalan en geniş
   açık gri bant. Çerçeve sırasını `.game-modal` ile eşitle
   (`border: 3px solid #050912; outline: 2px solid #6676bd`), `color: white` →
   `rgb(188 254 254)`, `#d_l` ayırıcısı `darkgrey` → `#526988`. Dikkat: `#dscr` üzerinde
   `box-sizing` yok, 5px → 3px paneli 4px daraltır; `positionDescription` `offsetWidth`
   ölçtüğü için kendiliğinden uyum sağlar.
2. **Ana navigasyon** (`css/game.css:308-314`): `orchid` kenarlıklı beş üst düzey panel
   butonu; `tabIndex` yok, `role` yok, `keydown` yok, `.ct_bts:focus-visible` kuralı yok.
   Kenarlık → `#3848c0`; klavye yarısı `dom.sl_kill`'in zaten kullandığı deseni izler.
3. **Başlık seçme penceresi** (`js/ui/interface.js:58-99`): sabit `top: 50px / left: 81px`
   konumunda elle kurulmuş bir `div`, içinde `--list-row` değerinin literal kopyası, ve
   **vazgeçme yolu yok** — pencereyi kapatan tek şey aynı zamanda `you.title`'ı yazıyor.
   `createGameModal` ile yeniden kur. Yanında gerçek bir hata taşıyor:
   `js/core/bootstrap.js:1503` yükleme sırasında `global.flags.ttlscrnopn` bayrağını
   sıfırlıyor ama DOM düğümünü kaldırmıyor, yani ne kapanabilen ne yeniden açılabilen bir
   pencere kalıyor.
4. **Envanter satırı çipleri** (`.del_b`, `.dss_b`, `.eq_l`/`.eq_r`, `.spc_a`). Kümenin
   tamamı redesign öncesinden — `#f80` altında `royalblue`, `lime` hover kenarlığı, ve
   `.dss_b:hover` çipi açık griye çevirip yazısını gri yapıyor. İki ayrı iş: palet (düşük
   risk, ama `royalblue`/`crimson` değerleri JS'te satır içi yazılıyor —
   `js/ui/interface.js:5037/5042/5062/5067` — dolayısıyla yalnızca CSS tutmaz) ve klavye
   erişimi (yüksek risk — çipler `mouseenter`'da kurulup `mouseleave`'de yok ediliyor, yani
   erişilebilir kılmak satır mekanizmasını yeniden kurmak demek).
5. **Envanter panelinin `grey` çizgileri** (`css/game.css:1208-1212`, `1219-1225`,
   `136-140`): diğer her çizgisi `#3848c0`/`#44c`/`#249` olan bir paneli çerçeveleyen düz
   `grey` kenarlıklar. `.bts_b` beceri penceresiyle paylaşılıyor, yani değişiklik ikisinde
   birden görünür — istenen sonuç bu.
6. **Ayarlar paneli**, üç küçük şey: dil `<select>`'i karanlık panelin üstüne beyaz bir
   liste düşürüyor (`css/game.css:340-343`; not: yazar tarafından verilen `option` renkleri
   Windows'ta Chromium/Firefox tarafından uygulanır, macOS'un yerel menüsünde yok sayılır);
   Dışa/İçe aktar satırının iki yarısı, v478.29'da değiştirilen pencerelerden kalan satır
   içi `1px lightgrey solid` kenarlığı taşıyor (`js/ui/interface.js:2590`, `2664`) — ve onu
   kaldırmak `.opt_va`'nın `border-left` sütun ayırıcısını geri koymayı gerektirir; ve arka
   plan ön ayarı çiplerinin kendi hover/focus hâli yok, ama dolguları **uygulanacak rengin
   önizlemesi** olduğu için dokunulmamalı.
7. **Okunan kitaplar penceresi** (`js/ui/interface.js:1767-1776`): `solid lime 1px`
   kenarlık arkasında `#210445`, başlık çubuğu yok, kapatma kontrolü yok, Escape yok —
   içindeki herhangi bir tıklama listeyi kapatıyor. `createGameModal` ile yeniden kur;
   satırlarındaki nadirlik renkleri anlamsaldır, aynen taşınır.
8. **`chs()` seçim satırları** (`js/ui/interface.js:5255`): oyun baştan sona bunlarla
   oynanıyor — `js/world/locations.js`'te yaklaşık 706 çağrı — ve bir satırı etkinleştirmenin
   tek yolu fare tıklaması. Görsel geçiş bunlara ulaştı, klavye ulaşmadı. Bunu tek satırlık
   bir düzeltme değil orta-yüksek riskli yapan iki şey: fabrikanın kendi `click`
   dinleyicisi eylem yolu değil (her çağıran kendi bağlıyor), dolayısıyla Enter/Space
   gerçek bir `click` olayı göndermek zorunda; ve `clr_chs()` satırları sürekli yıkıp
   yeniden kuruyor, yani odak için bir strateji gerekiyor, yoksa klavye kullanıcısı her
   seçimden sonra baştan başlar.
9. **Durum efekti ikonları** (`css/game.css:300-307`): görünmez `black` taban kenarlığı ve
   `lime` hover; redesign `#71e6b1`'e yerleşmişti. Yalnızca palet — doğrulama geçişi bunların
   kontrol olmadığını saptadı: düşman paneli kopyalarında hiç dinleyici yok, oyuncu
   panelindeki ise `e.onClick()` çağırıyor ve bu oyundaki her efekt için işlemsiz.
10. **`#rptbn:hover`** (`css/game.css:1409-1421`): `lightgrey`, ve **ölü** — kontrol kendi
    arka planını hem kurulurken hem her tıklamada satır içi yazıyor, dolayısıyla kural hiç
    boyamıyor. Oyuncu açık griyi hiç görmüyor, ama kontrolün komşuları hover'a yanıt
    verirken kendisinde hiçbir geri bildirim yok.
11. **`input:focus { outline: none }`** (`css/game.css:104-106`): `:focus-visible` var
    olmadan önce yazılmış, niteliksiz bir tür seçici oyundaki her girdinin odak halkasını
    kaldırıyor. Redesign bunun üstüne eleman eleman tırmanmak zorunda kaldı. `#nch` ve
    `.opt_v`'nin ne kenarlığı ne arka planı var, yani klavye kullanıcısı hangi alanda
    olduğunu hiç göremiyor. Silmek yerine daralt.
12. **`.i18n-load-error`** (`css/game.css:16-24`): `#900` yazılı beyaz bir kart, ve tam
    yanında karanlık hata paletine çevrilmiş `#save-unreadable` duruyor (`#3a1a18` /
    `#a32219` / `#ffb4ae`). En sona konmasının nedeni pratikte görünmez olması: yükleyici
    açılış katmanını hiç kaldırmıyor ve `z-index: 9997` ile `#loading-overlay` kartın
    üstünü kapatıyor — ki bu, kaydedilmeye değer ayrı bir hata: yerel dosyaları
    yüklenemeyen bir oyuncu mesajı değil takılı kalmış bir açılış ekranı görüyor.

**Bilinçli olarak değiştirilmeyenler:** `positionDescription`'ın ölçümü ve piksel yazımı;
sapma değil projenin yazı yüzü olan `MS Gothic`; bütün nadirlik, kademe, dayanıklılık ve
düşme şansı renkleri ile durum ikonlarının efekt başına satır içi renkleri — hepsi veri
kodlaması; aç/kapa ve "bu elde ekipli" durumunu taşıyan `#rptbn`'in `#a11`/`green` çifti ve
`.eq_*`'in `crimson`'u; arka plan ön ayarı dolguları; ve yorum içindeki her şey.

**Zaten var:** `createGameModal`, üç `--list-*` belirteci, krom için referans olan kaydetme
çubuğunun kenarlık/gradyan/hover'ı, ve bir `span`'a klavye erişimi vermek için referans
olan `dom.sl_kill`.

**v478.30’da uygulanan:** yukarıdaki 1, 5, 6a, 6b, 7, 9, 10 ve 12. maddeler; her biri
`tests/check-game-regressions.js` içinde sabitlenmiş hâlde, kural geri gelemesin diye. 7.
madde palet dışında davranış da kazandı: okunan kitaplar listesi içindeki herhangi bir
tıklamada kapanıyordu, ve yükleme anındaki yıkımı bayrağı sıfırlarken düğümü elle
kaldırıyordu -- ne kapanan ne yeniden açılan bir pencere böyle kalıyordu.

Kalanlar 2, 3, 4, 8 ve 11 -- başlık seçme penceresi (bir karar gerekiyor, çünkü ona vazgeçme
yolu vermek akışı değiştiriyor), renkleri JavaScript'te satır içi yazılmış envanter çip
kümesi, ve `chs()` dâhil klavye erişimine dair her şey.

**Yeni yazılması gereken:** bir `.ct_bts:focus-visible` kuralı, `chs()` satırları için
yeniden çizim boyunca geçerli bir odak stratejisi, ve 4. maddenin ikinci yarısı için bir
karar — o bir yeniden stillendirme değil, satırın yeniden kurulması.

### 19. Büyücüler tek vuruşta öldürüyor ve onlara karşı hiçbir savunma yok

**Durum:** karar gerekiyor. Ölçüm bitti; düzeltme bir denge değişikliği.

`scripts/check-combat.js`, bir yaratığın `battle_ai`'sinin gerçekten ulaşabildiği yetenekleri
ölçecek şekilde genişletilerek bulundu; daha önce yalnızca `abl.default`'a bakıyordu. Bunun sağ
kalma sebebi de o.

**Ölçülenler**, hepsi gerçek `dmg_calc` ve her yeteneğin kendi `f()`'i üzerinden:

| Yaratık  | Yetenek     | Seviye | Vuruş | Bütçe |
| -------- | ----------- | ------ | ----- | ----- |
| `zmbm`   | `abl.spark` | 18     | 935   | 337   |
| `zmbm`   | `abl.spark` | 22     | 1063  | 412   |
| `dcrps1` | `abl.spark` | 26     | 792   | 487   |
| `dcrps1` | `abl.spark` | 28     | 833   | 525   |
| `zmbk`   | `abl.dstab` | 19     | 396   | 356   |
| `zmbf`   | `abl.bash`  | 14     | 270   | 262   |

20. seviye bir oyuncunun **421 canı** var. `creature.zmbm.battle_ai` vuruşlarının **%40'ında**
    `abl.spark` atıyor ve `zmbm`, katakompların ortası olan `area.cata3a`'nın popülasyonunun %30'u.
    `creature.dcrps1` %30'unda atıyor ve `area.cata5a`'nın popülasyonunun tamamı.

**Sayı nereden geliyor.** `abl.spark` `affp 25` taşıyor ve `dmg_calc`'ın büyü dalı `atk.affp`'yi
fiziksel dalın on ile çarptığı yerde **on beş** ile çarpıyor. Ardından `abl.spark.f` sonucu `1.2`
ile ölçekliyor. Yani `(100 + 25 * 15) / 100`, ölçeklemeden önce 4,75 katlık bir çarpan.

**Ve oyuncu tarafında buna cevap veren hiçbir şey yok.** O dalda bir kalkan `you.eqp[1].int`
üzerinden katkı yapıyor ve on yedi kalkanın hepsinin `int`'i 0. Hoplit'e `int 18` vermek 487'yi
473'e taşıyor -- %3. Yani 7. maddedeki kalkan açığı gerçek ama buradaki kaldıraç o değil.

**Karar.** Üç aday ve birbirlerini dışlamıyorlar:

1. `abl.spark.affp`'yi 25'ten fiziksel yeteneklerin aralığına düşürmek. En küçük tek düzenleme
   bu ve oyundaki her büyücüyü birden etkiliyor.
2. Büyü dalındaki `affp * 15`'i fiziksel dalın `* 10`'una indirmek; bu bir denge argümanı olduğu
   kadar bir tutarlılık argümanı.
3. Kalkanlara ve zırhlara gerçek `int` değerleri vermek, ki bu her hâlükârda yapılmaya değer ama
   tek başına yeterli değil.

Biri seçilene kadar çiftler `scripts/check-combat.js` içindeki `KNOWN_OVER_BUDGET`'ta kayıtlı;
böylece denetim bilineni bildiriyor ve yeni olan her şeyde düşmeye devam ediyor. Yeni bir
yaratığı geçirmek için o listeye ekleme yapılmamalı.

## Bölgeler

### 1. Yarığın altı — Dein'in indiği yer

**Durum:** önerildi ve sıradaki bölge olarak tavsiye ediliyor.

Dördüncü bölüm, katakompların sonunda öbür taraftan kesilmiş bir duvarda bitiyor;
ötesindeki geçitten ılık hava yükseliyor ve açıklığın yanında bir yağış mevsimlik bir
avcı işareti var. Oyuncu şu an oraya inemiyor.

Bu, elimizdeki en az "icat" gerektiren bölge, çünkü oyun onu iki kez birden vaat etti:

- Kesik duvar ve ılık geçit `chss.cata25` içinde yazılı metin olarak duruyor.
- Pazardaki gergin adam az önce aşağı inen **ikinci** bir yolu adlandırdı —
  değirmenin yanındaki eski su yolu — ve Dein'in ona sorduğu şey buydu. Yani bölgenin
  iki ayrı yönden iki girişi zaten diyalogda kurulu.
- Dein'in kolu tam olarak brief'in istediği şeyi istiyor: açığa çıkarma değil izler.
  Terk edilmiş kamplar, kırılmış ekipman, birbiriyle çelişen işaretler; bazıları
  öldüğünü bazıları ölmediğini düşündüren.

**Zaten var:** kesik duvar, değirmen su yolu, işaret, kırık kılıç ucu,
`global.flags.deintrail` ve lore panelinde bunun cevaplayacağı ya da keskinleştireceği
dört açık soru (`whatDeinSought`, `catacombsForgotten`, `underTheSouth`, `whyTheEast`).

**Yeni olması gereken:** sahnelerin kendisi, bir iki yaratık kademesi ve dipte ne
olduğu. Kalan yaratık taslakları — bebek ve kukla ailesi, duvar taklidi yapan mimik
`lrck`, maden kandillerine musallat olan `lsprt` — hepsi tematik olarak yeraltına ait
ve hepsi şu an erişilemez; yani popülasyonun icat edilmesi hiç gerekmeyebilir.

**Neden önce bu:** girişleri, kancaları ve bestiyerinin çoğu kaynaklarda hazır
duruyor. Hikayenin şu an üzerinde durduğu Dein ipini kapatıyor.

### 2. Doğu

**Durum:** önerildi, sonrası için.

Yamato "yakında doğuya gidiyoruz" sözünü bu fork'tan çok önce beri söylüyor ve artık
iki kez doğuya haber saldı — biri sürü liderinden sonra, biri de yardımcısının köyün
altına indiğini öğrendiği gece. Borç açık ve sesi yükseliyor.

**Zaten var:** söz; kendi diyaloğunda, üç kez.

**Yeni olması gereken:** neredeyse her şey. Yeni bir bölge, yeni bir kadro, kendi
ekonomisi ve kendi görev zinciri. Bu bir bağlantı değil, bölüm büyüklüğünde bir iş; o
yüzden Dein kolunu kesmek yerine ondan sonra gelmeli.

---

## Sistemler

### 3. Demirci

**Durum:** yarısı girdi. Onarım ve keskinleştirme tamam —
[STORY.TR.md](STORY.TR.md). Kalan iş madencilik yarısı ve kurtarma.

Oyuncunun kurtardığı, sonrasında kalıcı bir hizmete dönüşen bir demirci. Kurtarma
görev, hizmet ödül — bu, baştan beri orada duran bir demirciden daha iyi bir biçim.

Demircinin yapacakları:

- **Onarım.** Dayanıklılık (`dp`/`dpmax`) her ekipman parçasında zaten var, oyun
  içinde aşınıyor ve onu geri getiren **hiçbir şey yok**. Dayanıklılığı biten bir
  silah öylece tükenmiş oluyor. Önerinin en güçlü kısmı bu: oyunun zaten sahip olduğu
  bir çıkmazı kapatıyor.
- **Malzeme alımı.** Oyuncu kemik, bez, kömür ve maden benzeri artık biriktiriyor ve
  alıcısı yok.
- **Örs satışı** (mobilya olarak). Mobilya sistemi var (`furn`, `giveFurniture`;
  saklama kutusu ve şömine ikisi de mobilya) ve şömine zaten yakıt tüketiyor — yani
  kömür yiyen bir örsün kopyalayacağı çalışan bir emsal mevcut.

Var olmayan ve gereken:

- Bir **demircilik becerisi** ve onu besleyecek bir **madencilik becerisi**.
- Bir **kazma** ve onu kullanacak bir yer. Not: `item.coal1` ve `item.coal2` zaten var
  ve katakomplar kaya dolu, yani madencilik yarısının yeni bir bölgeye ihtiyacı yok.

**Zaten var:** hiçbir yerde onarımı olmayan dayanıklılık, mobilya ve yakıt sistemi,
eşya olarak kömür ve odun kömürü, yakıt tüketen bir şömine, genişletilebilir bir
`skl` kaydı ve bir demircinin kaynağı olabileceği yaklaşık 35 erişilemez silah.

**Yeni olması gereken:** iki beceri, demircinin sahneleri ve diyalogları, kazma,
örsün tarifleri ve kurtarma görevi.

**Kapsam notu:** bu tek bir palto giymiş üç özellik — onarım, madencilik ve örste
üretim. Onarım tek başına yayınlanmaya değer ve yeni bir kapı açmak yerine var olan
bir çıkmazı kapatan parça o. Önce onu yapıp madencilik ile örsü ikinci adım olarak
ele almayı öneriyorum.

---

## Denge kararları, hata düzeltmesi değil

### 4. Zırhın sınıf direnci zıt işaretlerle iki kez sayılıyor

**Durum:** önerildi, yama değil karar gerekiyor.

`dmg_calc` içinde bir yaratık oyuncuya saldırdığında çalışan dalda, isabet alan
zırhın sınıf direnci hasar azaltmanın içinde
`100 + armour.cls[ctype] * 5 * ta` olarak, dışında ise
`100 - armour.cls[ctype] * 5 * shdc * ta` olarak geçiyor; buradaki `shdc`,
`1 + skl.shdc.lvl / 20`. İkisi büyük ölçüde birbirini götürüyor ve dıştaki, Kalkan
becerisiyle ölçekleniyor — oysa o becerinin zırhı ölçeklemesinin hiçbir gerekçesi yok.

O dıştaki çarpanın kalkan yarısı düpedüz hataydı ve düzeltildi: bir kalkanın direnci
artık kalkanın kendi payını ölçekliyor. Zırh yarısı ise bilinçli olarak öyle
bırakıldı, çünkü gerçek bir iş yapıyor: dövüşü tehlikeli tutan tek şey o.

`tests/harness.js` ile gerçek `dmg_calc` üzerinden yeniden ölçüldü; bu notun baştan
yazıldığı karakterde — GÜÇ 50, göğüs zırhı GÜÇ 12 ve dayanıklılığı tam, fiziksel
yakınlık 5 ve kesici direnci 4, Kalkan becerisi 10, `sld.hpt` (Hoplit Kalkanı, GÜÇ 18),
saldırı terimi 100:

| Dıştaki çarpan          | Kalkansız alınan hasar | Hoplit Kalkanı ile |
| ----------------------- | ---------------------- | ------------------ |
| Bugünkü hâli (zırh `-`) | 37,0                   | 27,0               |
| Düzeltilmiş (zırh `+`)  | 0,0                    | 0,0                |

**Burada daha önce kayıtlı olan düzeltilmiş sayılar yanlıştı ve yanlış olmaları kararı
değiştiriyordu.** 9,9 ve 1,0 diyorlardı — yaklaşık dört kat daha dayanıklı. Ölçüm sıfır
ve sıfır diyor: işaret düzeltildiğinde hasar azaltma terimi saldırının tamamını aşıyor ve
sonuç tabana kırpılıyor, yani bu yaratık bu oyuncuya hiç hasar veremez hâle geliyor.
`minimumLandedDamage` bilinçli olarak yalnızca oyuncunun **verdiği** hasara uygulanıyor,
dolayısıyla gelen bir yaratık vuruşunu asgari bir değerde tutan hiçbir şey yok.

Yani bu, tartılacak bir yeniden dengeleme değil, tek başına yapılamayacak bir
değişiklik. Ancak hasar azaltmayı asıl domine eden düz `def.str * eff` terimini
düşürmekle birlikte mümkün hâle geliyor — ve o düşüşün miktarı tahmin edilmek yerine bu
ölçümden türetilmek zorunda.

Yeniden üretmek için: senaryo `dmg_calc(yaratık, you, abl.default)` çağrısına karşı bir
sonda, `global.target` vurulan parçaya ayarlanmış hâlde; işareti çevirmek
`js/systems/combat.js` içindeki iki `100 - global.target.cls[att.ctype]` noktasında tek
karakterlik bir düzenleme.

**Zaten var:** iki terim ve kalkan yarısını sabitleyen, sessizce geri dönmesini
engelleyen bir regresyon testi.

**Yeni olması gereken:** bir karar ve alınırsa yaratık hasarları üzerinden bir geçiş.

---

## Hâlâ borçlu olduğumuz yan hikayeler

Brief en az sekiz istiyor. Üçü girdi: **Hiçbir Şey Söylemeyen Adam** (pazardaki gergin
adam), **Kâbus** ([STORY.TR.md](STORY.TR.md)) ve pazarın kendi keşif tablosu.
Kaynaklarda hâlâ duran kancalar şunlar:

| Kanca            | Zaten var olan                                                                                                                           | İhtiyacı                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Kandil ruhu**  | `creature.lsprt`, statlı, madenlerdeki kandillere musallat olduğu yazılı.                                                                | Madenler — demirci önerisine bakın.                             |
| **Bebekler**     | `puppet`, `bpuppet`, `doll`, `ndoll`, `cdoll`: ele geçirilme ve karanlık ritüellerle ilgili beş yaratık, hepsi taslak, hepsi erişilemez. | İstatistikler ve ritüelleri yapan biri.                         |
| **Yedi anahtar** | Oyunda hiçbir kilidi olmayan yedi anahtar eşyası.                                                                                        | Kilitler. İsimlendirilmiş odalardan oluşan bir zindan bariz ev. |

---

## Kaybetmemek için küçük notlar

- **Mesaj panosundaki heykel karşılaşması hâlâ yalnızca envantere bakıyor.** Dört heykel
  artık mobilya, ve `chss.mbrd` `inv`'i gövdesi karşılaşmanın _kendisi_ olan bir `for`
  döngüsü içinde tarıyor; yerleştirilmiş olanı da kapsaması için koşulu değiştirmek
  yetmiyor, döngünün yapısını değiştirmek gerekiyor. Evde duran bir heykel şu an zümrüt
  yeşili gözlü kız için sayılmıyor, taşınan sayılıyor. Xiao Xiao ikisini de kabul ediyor.

- **`chss.bsmnthm1.data.gets`** iki girdi taşıyor ama üçüncü keşif sonucu `gets[2]`
  yazıyor; o buluş "alındı" olarak hiç kilitlenmiyor.
- **Rütbe 9'un üstü rütbe düşmesi almıyor.** `ar = ((rnk - 1) / 3) << 0`,
  `global.rdrop` içinde yalnızca 0–2 kademeleri dolu olan bir diziyi indeksliyor; yani
  her derin yaratık tamamen kendi düşme tablosuna bağlı.
- **`item.svila1`/`item.svial1`** içinde iskelet olan tek kullanımlık bir alan kuruyor.
  Bitmiş mi terk edilmiş mi belirsiz.
- **`vendor[*].dfl`** beş satıcının dördünde atanıyor ve hiçbir yerde okunmuyor.
- **Statlar seviye atlarken ve belirli eşyaların kullanımında artıyor, tasarım bu.**
  `js/` içinde harcanmamış puan havuzu yok ve istenmiyor; dolayısıyla `levelGrants`
  içindeki eşik kazanımları bu işin aldığı biçim.
