# Hikaye durumu

[English](STORY.md)

Bu belge hikayenin şu anda ne olduğunu, nerede durduğunu ve kaynaklarda hazır
olduğu hâlde erişilemeyen içeriği kaydeder. Hikayeyi sürdürmenin temelidir ve
hikaye içeriği eklendiğinde veya daha önce erişilemeyen bir sistem bağlandığında
güncellenmelidir.

Aşağıdakilerin tamamı kaynaklar üzerinde doğrulanmıştır;
[Hikayeyi sürdürmek](#hikayeyi-sürdürmek) başlığı altındakiler dışında hiçbiri
plan veya temenni değildir.

## Görev zinciri

`js/data/quests.js` içinde sekiz görev tanımlı. Yedisi erişilebilir.

| Görev       | Ad                | Nereden alınır                     | Gerekenler                                                     | Ödül                                            |
| ----------- | ----------------- | ---------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| `test`      | yer tutucu        | hiçbir yer — `giveQst` çağrısı yok | —                                                              | —                                               |
| `fwd1`      | Odun Toplama      | Avcı Kulübesi iş panosu            | Kulübeye ulaşmak; köy kapısı 6. seviye ister                   | 100 servet, `sld.bkl`, 15.000 exp, karma        |
| `hnt1`      | İlk Av            | Avcı Kulübesi iş panosu            | yok, `fwd1` ile paralel                                        | 130 servet, 10× `item.jrk1`, 12.000 exp, karma  |
| `grds1`     | Nöbet Görevi      | Pazar yeri kontrol noktası         | 4. ilan panosu yazısı (`fwd1` + `hnt1` ister); 7–10 saat arası | 65 servet, 3.000 exp, tekrarlanabilir           |
| `lmfstkil1` | Canavar Temizliği | Avcı Kulübesi iş panosu            | `fwd1` + `hnt1`, 20. seviye ve dojo Golem 4'ün yenilmesi       | 300 servet, `wpn.gsprw`, `eqp.nkgd`, 18.000 exp |
| `pckld1`    | Sürü Lideri       | Avcı Kulübesi iş panosu            | `lmfstkil1` tamamlanmış ve üzerinden bir oyun günü geçmiş      | 600 servet, `eqp.amsk`, 26.000 exp              |
| `undcty1`   | Köyün Altında     | Genel dükkândaki yaşlı esnaf       | `pckld1` tamamlanmış; `global.flags.undercity1` kurulur        | 250 servet, 9.000 exp ve aşağı inen yol         |
| `undcty2`   | Yolculuğun Sonu   | Avcı Kulübesi iş panosu            | `undcty1` tamamlanmış                                          | 1.400 servet, `acc.rmedlon`, 52.000 exp         |

`fwd1` ve `hnt1` birlikte tamamlandığında kulübede bir sahne tetiklenir;
`wpn.dgknf` ve `item.htrsvr` çantasını verir, köy ilan panosunu ve şifacıyı açan
bayrakları kurar.

### Bağımlılık sırası

```
dojo eğitimi  ─────────────► dojo golemleri ──► trne4e1 bayrağı
                                                     │
köy kapısı (6. seviye) ──► Batı Ormanı ──► Avcı Kulübesi
                                                     │
                        ┌────────────────────────────┴────────────────┐
                        ▼                                             ▼
                  fwd1 Odun Toplama                             hnt1 İlk Av
                        └──────────────► ikisi de bitti ◄───────────┘
                                             │
                    ┌────────────────────────┼──────────────────────┐
                    ▼                        ▼                      ▼
              ilan panosu              çanta yan zinciri       lmfstkil1
                    │                                          (20. seviye
                    ▼                                           + trne4e1)
              grds1 (tekrarlanabilir)                               │
                                                                    ▼
                                                          Güney Ormanı açılır
                                                          35 × kurt öldürme
                                                                    │
                                                     Yamato haber salacağı günü
                                                     kaydeder
                                                                    │
                                                        bir oyun günü sonra
                                                                    ▼
                                                          pckld1 Sürü Lideri
                                                          çalılığın ötesindeki çukur
                                                          1 × creature.wolfa1
                                                                    │
                                                      flags.undercity1 kurulur
                                                                    │
                                                                    ▼
                                                          undcty1 Köyün Altında
                                                          3 iz, herhangi bir sırada:
                                                            esnafın anlattıkları
                                                            pazar yeri
                                                            kendi bodrum duvarın
                                                                    │
                                                          Yamato'ya rapor
                                                      flags.undercity2 kurulur
                                                                    │
                                                                    ▼
                                                          duvarı kır
                                                          chss.bsmnthm1 ──► chss.catamn
                                                          26 oda
                                                                    │
                                                                    ▼
                                                          undcty2 Yolculuğun Sonu
                                                          batı koridoru
                                                          1 × creature.dcrps1
                                                                    │
                                                          kesilmiş bir duvar, ılık
                                                          hava ve bir mevsimlik
                                                          avcı işareti
                                                                    │
                                                          Yamato'ya rapor
                                                       flags.deintrail kurulur
                                                                    │
                                                                    ▼
                                                    ── HİKAYE BURADA, DEIN'DE
                                                       DURUYOR ──
```

## Hikaye nerede duruyor

Birinci ve ikinci bölüm uygulandı. Otuz beşinci kurt ölümü oyuncuyu hâlâ Güney
Ormanı kapısına taşıyor ve kulübeye dönüp rapor vermek `lmfstkil1` görevini
tamamlıyor; artık bu ödül aynı zamanda `quest.lmfstkil1.data.rday` değerini,
yani Yamato'nun haber salmaya söz verdiği oyun gününü kaydediyor. Bir gün sonra
iş panosu boş bir başlık göstermek yerine onun ikinci işini taşıyor.

`pckld1`, çalılığın ötesinde üçüncü bir güney sahnesi olan `chss.frstn10main`'i
açar. Çukur önce zemine yazılmış olanı anlatır — çatlamış bir kurt kafatası,
hiçbir kurdun uzanamayacağı yükseklikteki pençe izleri, kayadan yukarı vuran
soğuk hava — ve dövüşü bilinçli bir "Çukuru ara" seçeneğinin arkasında tutar,
çünkü Yamato oyuncudan öldürmeden önce bakmasını ister. `creature.wolfa1`,
oyundaki _Zayıflamış Kurt_ olmayan tek kurttur; `wolf1`'in mevcut açıklaması
zaten o kurtların "bir hastalıktan etkilendiğini" ve "sağlıklı muadili" kadar
tehlikeli olmadığını söylüyor, yani lider tam olarak o muadildir ve çenesinde
haftalar öncesine dayanan bir çürüme taşır.

Onu öldürmek aynı sahneyi kendi sonrasına çevirir: lider sana değil, yarığa dönük
ölmüştür. Yamato'nun raporu avın karşılığını verir, Kurt Maskesi'ni teslim eder,
bir aydır köyün altının kazıldığını söyleyen esnafı işaret eder ve doğuya haber
salacağını belirtir.

### Üçüncü bölüm — Köyün Altında

`quest.undcty1` olarak uygulandı. Çukurun altındaki yarık takip edilemeyecek kadar
dar, o yüzden aşağı inen yol, diyaloğun bir aydır işaret ettiği yol oldu.

Yamato'nun raporu `global.flags.undercity1` bayrağını kuruyor ve bu, genel
dükkândaki yaşlı esnafla bir konuşma açıyor. Bunun anlatı kadar mekanik bir önemi
de var: onun "yeraltında bir şey doğrudan insanların evlerine doğru kazıyor"
cümlesi yalnızca istila teklifinin içinde vardı ve o teklif
`area.hmbsmnt.size >= 1000` koşulunun arkasındaydı — yani kabaca yüz oyun günü
sonra açılan bir kapı. Hikaye artık ona Yamato'nun sözüyle ulaşıyor.

Görev üç izin soruşturması; izler herhangi bir sırada toplanıyor ve adla
kaydediliyor, böylece hiçbir sahne aynı izi iki kez veremiyor:

| İz       | Nerede              | Ne kuruyor                                                                                                                                  |
| -------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `cellar` | esnaf, `chss.gens1` | kemirmiyor, kazıyor; eski duvarın dibinde başlamış, kuyuya doğru yayılmış; kaybolanlar yiyecek değil, alet ve bir fener                     |
| `market` | `chss.mrktvg1`      | üç yetişkin birbiriyle çelişiyor ve yaşlı adamla alay ediyor; bir çocuk babasının keskilerinin **kilitli** bir bodrumdan gittiğini söylüyor |
| `home`   | `chss.bsmnthm1`     | içeriden itilmiş iki taş, oyuncunun tarafına dökülmüş toz olmuş harç, mevsimden soğuk ve kımıldayan hava                                    |

Yamato'ya rapor vermek görevi tamamlıyor ve `global.flags.undercity2` bayrağını
kuruyor; duvarın yıkılmasını açan da bu, çünkü Yamato dokunmadan önce haber
verilmesini istemişti. O konuşma aynı zamanda oyunun, köyün altına ışıksız inmenin
bir plan olmadığını ilk kez açıkça söylediği yer ve oyuncuya mum almasını
söylüyor — çünkü karanlığı başka hiçbir şey anlatmıyor.

### Şimdi nerede duruyor

Üst katakomplarda. `chss.catamn` bodrumdan erişilebilir ve kendi çıkışı — ki eskiden
köy merkezine açılıyordu, bölgenin yarım değil sahipsiz olduğunun en net işareti buydu
— artık oyuncunun girdiği bodruma dönüyor.

Yirmi altı odanın on ikisi iki kademe hâlinde dolu. Giriş odaları
(`cata1`–`cata5`) `area.cata1a`'yı çalıştırıyor: mağara yarasaları, stirge'ler ve
aşağıdaki, bir zamanlar insan olan ilk şey. Örümcek Ağı Koridoru'nun ötesindeki doğu
çevrimi (`cata6`–`cata12`) ise `area.cata2a`'yı çalıştırıyor; oraya hâlâ nasıl
dövüşüldüğünü hatırlayanlar ekleniyor.

Artık aşağıda arama da işliyor, çünkü `sector.cata1` 11.000 puanlık takibi için
yazılmış keşif tablosuna kavuştu. Bulduğu şeyler köyün kaybettikleri — esnafın feneri
dâhil. Bunun bedeli mum süresi: `scoutGeneric` de her şey gibi karanlıkta çalışmayı
reddediyor.

### Dördüncü bölüm — Yolculuğun Sonu

Yirmi altı odanın tamamı artık dolu; dört kademe hâlinde ve her kademe tek bir
popülasyonun güçlendirilmesi değil ayrı bir alan: giriş odaları, doğu çevrimi, batı
koridoru (`area.cata3a` — burayı inşa eden tarikat bu koridor boyunca gömülü, o
yüzden orada yürüyen şeyler hâlâ düzen içinde dövüşmeyi ve büyü yapmayı biliyor) ve
sondan önceki iki oda (`area.cata4a`, tarikattan bile eski).

`chss.cata25`, yani Yolculuğun Sonu, haritanın hep son düğümü olmuştu; artık
bölümün indiği yer. Üç durumda okunuyor: oyuncu bir şey aramaya başlamadan önceki
ortam koridoru, aradığında ortada duran `creature.dcrps1`, ve sonrasında onun
durduğu yerin arkasındaki şey.

Felaket Cesedi "neden şimdi?" sorusunu cevaplıyor ve cevap zaten oyunun içinde
yazılıydı: kendi açıklaması bunların yalnızca ölüm ki'sinden belirdiğini, karanlık
ki'nin çoktan aşırı yoğunlaştığı yerlerde çıktığını söylüyor. Bir şey onu
biriktirmiyorsa orada olamaz. Aynı düşünce koridorun iskeletlerini de açıklıyor:
`unsctn` kendi açıklamasına göre kimseye zarar vermez — **ta ki** ölüm ki'si
üzerinde yeterince uzun çalışana kadar.

Onun arkasındaki duvar öbür taraftan kesilmiş, tozu hâlâ solgun ve ötesindeki
geçitten yükselen hava soğuk değil, ılık. Köyün altını kazan şey buradan
başlamamış; buradan geçmiş.

Açıklığın yanında bir avcı işareti var: üç çizik ve bir çapraz kesik, yalnızca tek
kenarı yıpranmış, yani bir yağış mevsimlik. Altındaki çatlakta, oyuncunun sahip
olduğundan iyi bir çelikten kırılmış bir kılıç ucu sıkışmış.

Bunu anlatmak, Yamato'nun kontrolünü bıraktığı yer. Üç-ve-çapraz bir yol işareti
değil: yardımcısının, tek başına ilerlediğini ve aynı yoldan dönmeyeceğini söylemek
için kazıdığı şey — yarısı öğretilmiş, yarısı da Yamato onun olduğunu ve
başkasının olmadığını bilsin diye uydurulmuş. Dein on dört aydır ayaklarının
altındaydı ve Yamato aramayı bırakmıştı. O gece doğuya haber salıyor ve bu kez bunun
bir nezaket olmadığını söylüyor.

### Diğer çıkmazlar

- `chss.frstn9a1m` hâlâ yeniden doğan bir tekrar alanı ama artık son düğüm değil:
  `pckld1` başlatıldığında çukura giden seçeneği taşıyor.
- `chss.cata25` katakomp haritasının son düğümüdür; bölge zaten erişilemez.
- Üçüncü bölümün dayandığı esnaf cümlesi `chss.gens1` içinde
  `area.hmbsmnt.size >= 1000` koşulunun arkasında duruyor. Bodrum 10 tabanından
  günde `rand(5, 15)` kadar doluyor, yani o koşulun açılması yüz oyun günü
  mertebesinde sürüyor. Üçüncü bölüm bu kancaya güvenmek yerine onu düzgünce
  gün yüzüne çıkarmak zorunda.

## Kelle Avcısı

Yamato hikayenin tek sürekli karakteri ve doğal omurgasıdır. Batı Ormanı
kulübesini işletir, erişilebilir beş görevin dördünü verir ve G'den SSS'ye kadar
canavar rütbelerini ve altı yaratık kategorisini anlatan bir bilgi merkezi
barındırır.

Diyaloğu üç söz vermişti. İkisi artık tutuluyor:

1. **"İleride başka canavar temizlikleri için seninle iletişime geçilmesini
   bekle."** Tutuldu: sözün verildiği gün kaydediliyor ve `pckld1` bir gün sonra
   panoda görünüyor.
2. **"Yakında doğuya gidiyoruz."** Hâlâ ödenmedi. Doğuya ait hiçbir sektör, alan
   veya sahne yok. Sürü lideri raporunda bunu artık bir niyet olarak söylüyor —
   iki avcı yetmeyeceği için doğuya haber salacak — ki bu borcu kapatmıyor,
   keskinleştiriyor.
3. **"Sürünün lideri olabilir, adamlarının ölümüne öfkelenmiş. Bu meselenin
   hızlıca çözülmesi gerekecek."** Tutuldu: `creature.wolfa1` çukurda barınıyor
   ve bölgesini neden terk ettiği, üçüncü bölümün devraldığı soru.

Ayrıca kayıp yardımcı şef Dein'e ait işaretli bir kılıç etrafında kendi içinde
kapalı bir kolu vardır; kılıcın el konulması ve bir arama sözü verilmesiyle
biter. O arama da hiç sonuçlanmaz.

Bilgi anlatımlarında karşılığı olmayan 24 yaratık türü sayılır: yaban domuzu,
mimikler, ogreler, harpiler, minotorlar, hayvan-adamlar, orklar, goblinler,
haydutlar, iblisler, imler, ele geçirilmiş silah ve zırhlar, gremlinler,
şeytanlar, periler, elementaller, hayaletler, nekromantlar, diriltilmiş
hayvanlar, ejderhalar, wyvernler, wyrmler, kertenkele-adamlar ve drakonidler.
Öğrettiği canavar rütbe ölçeği, `item.bstr` bir bestiyer açtığını iddia etmesine
rağmen arayüzün hiçbir yerinde görünmez.

## Var olan ama erişilemeyen içerik

Asıl önemli kısım burası. Oyunun içeriği eksik değil; bağlantıları eksik.

| Varlık                 | Miktar               | Durum                                                                                                                                                                                                                                                                                                                      |
| ---------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Katakomplar**        | 26 tamamlanmış sahne | **Tamamen erişilebilir ve tamamen dolu**, dört kademe hâlinde: `cata1a` giriş odaları, `cata2a` doğu çevrimi, `cata3a` batı koridoru, `cata4a` derin odalar, artı sondaki karşılaşma için `cata5a`. `sector.cata1`'in 11.000 puanlık takibi çalışıyor.                                                                     |
| **Ölümsüz bestiyeri**  | 20'nin 9'u           | On biri statlandırıldı, Ölümsüz türüne alındı ve erişilebilir: `cbat`, `stirge`, `zomb1`, `zmbf`, `ghl`, `zmbm`, `ght`, `zmbk`, `mumy`, `unsctn`, `dcrps1`. Kalanlar bebek ve kukla ailesi — `puppet`, `bpuppet`, `doll`, `ndoll`, `cdoll` — artı statlı ama hiçbir alana ait olmayan `lrck`, `lsprt`, `kksh` ve `ngtmr1`. |
| **Rutubetli mahzen**   | 1 alan               | `area.clg` doludur ama hiç başlatılmaz.                                                                                                                                                                                                                                                                                    |
| **Pazar yeri sektörü** | 1 sektör             | `sector.vmain1` yedi sahneye bağlı ama tüm keşif tablosu ve işleyicisi yorum satırında.                                                                                                                                                                                                                                    |
| **Unvanlar**           | 108'in 22'si         | Verilme yolu yok. Kalanların neredeyse tamamı silah ustalığı kademeleri (`srd3`, `srd4`, `lnc3`, `hmr3`, `axc3`, `sld3`–`sld5`); bunlar hikaye çalışması değil, öldürme sayacı eşikleri ister.                                                                                                                             |
| **Eşya ve ekipman**    | 544'ün ~309'u        | Hiçbir düşme, tarif veya satıcı kaynağı yok. 7 anahtar, 6 öz, kalan 5 maske, 6 madalya, 16 element tılsımı, 14 kalkanın 13'ü, ~35 silah ve yaklaşık 150 yiyecek dâhil.                                                                                                                                                     |

Bu kümelerin birbirine oturması tesadüf okumakta zorlanacağımız kadar düzenli:
karanlık 26 odalı bir zindan, hiçbir yerde satılmayan bir meşale, kilidi olmayan
yedi anahtar ve doğacak yeri olmayan eksiksiz bir ölümsüz bestiyeri. Bunlar tek
bir bölge olarak hazırlanmış ve hiç bağlanmamış.

### Katakomplarda asıl eksik olan

Dördüncü bölümün büyüklüğünü değiştirdiği için tam olarak yazmaya değer. 26 oda
eksiksiz yazılmış ve eksiksiz bağlanmış — her iç kenar karşılıklı, `cata1` merkez,
doğuda bir çevrim (`5→6→7→8→9→10→11→12→5`) ve batıda bir koridor (`13`→`25`) — ama:

- **Hiçbir oda `area_init` çağırmıyor ve onlar için tanımlı bir alan yok.** Zindanın
  dövüş popülasyonu sıfır. Yalnızca bir giriş bağlamak 26 boş oda açardı.
- Hiçbir oda `effectors`, `onEnter`, `onScout`, `scout` veya `data` tanımlamıyor.
  Karanlık yalnızca `sector.cata1`'den geliyor.
- `chss.catamn`'in çıkışı zaten `chss.lsmain1`'e (köy merkezi) gidiyor ve geri
  dönen bir bağlantı yok; bölgenin yarım değil de sahipsiz görünmesinin sebebi bu.

## Hikaye kodundaki hatalar

Bunlar tasarım boşluğu değil, hataydı. Hepsi artık düzeltildi; liste, her biri
etrafındaki içeriği biçimlendirdiği için tutuluyor.

- `js/world/areas.js` — bir `area.trn.id` ataması `area.trnf` bloğunun içinde
  duruyordu. Eğitim alanının id'sini eziyor ve `area.trnf.id` değerini 0
  bırakıyordu.
- `js/data/quests.js` — nöbet görevinin tamamlanması `global.stat.jcom` yerine
  var olmayan `global.flags.jcom` değerini artırıyordu. Sonuç `NaN` oluyor ve
  arayüzün zaten gösterdiği iş sayacı hiç ilerlemiyordu.
- `js/world/areas.js` — `area.clg.onEnd`, tanımlı olmayan `chss.q1lwn` ve
  `chss.q1l` sahnelerini çağırıyordu. Alan erişilebilir olsaydı hata fırlatırdı.
- `chss.jbgd1`'in çıkış seçeneği yoktu; oyuncu saat 20 olana kadar tutuluyordu.
- `js/data/creatures.js` — `creature.wolf1.battle_ai`, var olmayan `abl.scratch`
  ile saldırıyordu. `attack()` tanımsız bir yetenek için `abl.default`'a
  düştüğünden, oyuncunun otuz beş tanesini öldürdüğü kurt, tırmalamasının kanama
  şansını ve hasar çarpanını sessizce kaybediyordu; `abl.scrtch` ise hiçbir
  yaratığın ulaşmadığı ölü koddu.

### Hâlâ açık olanlar

- `chss.bsmnthm1.data.gets` iki girdi taşıyor ama üçüncü keşif sonucu `gets[2]`
  değerini yazıyor, yani o buluş "zaten alındı" olarak hiç kilitlenmiyor.
- Bodrumdaki "Etrafını incele" seçeneğinin koşulu olan `global.flags.bsmntchck`
  hiçbir yerde atanmıyor.
- `sector.cata1.data.scoutm` 11.000 ama sektörün ne `scout` tablosu ne de
  `onScout` işleyicisi var; takip hiç ilerleyemiyor.

## Hikayeyi sürdürmek

En ucuz devam yolu yeni bir bölge icat etmeyi gerektirmiyor. Hâlihazırda
tamamlanmış olanı bağlamayı ve diyaloğun çoktan verdiği sözleri ödemeyi
gerektiriyor.

### Adım 1 — Oyuncunun zaten yaptığı işin karşılığı — **tamam**

Kurt Katili artık `lmfstkil1` tarafından veriliyor. İş unvanları, tamamlanan iş
sayacı arayüzün okuduğu alanı artırmaya başladığı için istatistik eşiklerinden
veriliyor. Alan id çakışması, `area.clg` çökmesi, eksik nöbet çıkışı ve kurdun
tanımsız tırmalaması düzeltildi. Yorum satırındaki pazar yeri sektörü hâlâ yorumda.

### Adım 2 — Sürü lideri — **tamam (birinci ve ikinci bölüm)**

`quest.pckld1`, `creature.wolfa1`, `area.frstn10a1` ve `chss.frstn10main` olarak
uygulandı. Bkz. [Hikaye nerede duruyor](#hikaye-nerede-duruyor). Bu adım bilinçli
olarak yeraltı şehrinin önüne alındı: sürü liderini yan bir ayak işi değil ilk
belirti yapmak kurtlara bir sebep veriyor ve o sebep, üçüncü bölümün araştırdığı
şey oluyor.

Güney sahneleri hâlâ bir sektöre bağlı değil, yani güneyin keşif veya ortam
katmanı yok.

### Adım 3 — Yeraltı şehri — **açıldı (üçüncü bölüm)**

Aşağı inen yol var: `quest.undcty1`, üç iz ve oyuncunun kendi bodrumundaki duvar.
Bkz. [Üçüncü bölüm](#üçüncü-bölüm--köyün-altında).

Bölümün tamamını şekillendiren şey, karanlığın ne olduğunun ortaya çıkmasıydı:

- `cansee()` şu: `(global.flags.isdark && you.mods.light > 0) || skl.ntst.lvl >= 12`.
  Işık yoksa oyuncunun isabeti `0.3 + skl.ntst.lvl * 0.07` ile çarpılıyor, keşif
  çalışmayı reddediyor ve bodrum kendini bile tarif etmiyor.
- `mods.light` veren yalnızca iki şey var. Meşale `wpn.trch`'in **oyunda hiçbir
  kaynağı yoktu** — artık üst katakomplardan düşüyor ve bu aynı zamanda esnafın
  "bir fener kayboldu" cümlesinin karşılığı. `effect.cdlt` ise genel dükkânın zaten
  sattığı mum `item.cndl`'den geliyor ve 360 tik sürüyor.
- Yani amaçlanan giriş yolu, sayaçlı ve tükenen bir ışık: sinir bozucu bir ayrıntı
  değil, gerçek bir kısıt. Ve bunu oyunda hiçbir şey anlatmıyordu. Yamato'nun
  brifinginin bunu açıkça söylemesinin sebebi bu.

### Adım 3b — Katakompların kalanı

Giriş odaları ve doğu çevrimi bitti. Derinlik, tek bir popülasyonu güçlendirerek
değil odanın hangi alanı başlattığıyla anlatılıyor; bu yüzden iki bölüm farklı
yerler gibi okunuyor: çevrime `zmbf` ekleniyor — takas edilemeyecek kadar sağlam —
ve `ghl` — sıkıştırılamayacak kadar hızlı; hiçbiri diğerinin şartlarıyla
karşılanamıyor.

`sector.cata1`'in keşif takibi artık çalışıyor. Dört bulgusu köyün kaybettiği
şeyler: mumlar, mezar sikkeleri, kemik ve bez yığınının içinde bir keski sapı ve
esnafın alındığını söylediği fener — yani `wpn.trch`. Arama mum süresine mal oluyor,
çünkü `scoutGeneric` karanlıkta çalışmayı reddediyor.

Kalanlar:

- On dört odalık batı koridoru: `cata13`'ten `cata25`'e, Yolculuğun Sonu'nda
  bitiyor. Ona uyan taslaklar `ght`, `zmbk`, `zmbm` ve `mumy`; bunlar oyunun
  tanımladığı en derin rütbeler.
- O taslakların istatistikleri `rnk`'a göre değil oyuncunun ilerleyişine göre
  kurulmalı — çünkü `rnk` Yamato'nun tehlike sınıflandırması, güç eğrisi değil:
  `creature.skl` rütbe 7 ve 132 can, `wolf1` rütbe 4 ve 400 can — ve `type = 2`
  olmalı ki bestiyer onları Ölümsüz diye dosyalasın.
- Statlandırmadan önce bilinmesi gereken: `rnk`, `ar = ((rnk - 1) / 3) << 0`
  üzerinden `global.rdrop` içindeki rütbe düşme kademesini belirliyor ve yalnızca
  0, 1 ve 2. kademeler dolu. Rütbe 10 ile 21 arasındaki hiçbir şey rütbe düşmesi
  almıyor; yani derin bir kademe ödülünü kendi düşme tablosunda taşımak zorunda.
- Yedi anahtarın hâlâ kilidi yok. İsimlendirilmiş odalardan oluşan bir zindan, tam
  olarak onların yeri.

### Oda adları üzerine bir not

Yirmi altı oda hiç erişilebilir olmadığı için Türkçelerini kimse okumamıştı. On bir
başlık makine çevirisi hatasıydı ve düzeltildi: _Web Corridor_ örümcek ağı yerine
internet, _Forgotten Post_ nöbet yeri yerine mektup, _The Stone Plate_ taş levha
yerine tabak olarak okunmuş; _The Brittle Turn_ "gevrek" olmuş ve _Son's Last Visit_
İngilizcede olmayan bir iyelik kazanarak oyuncunun kendi oğluna dönüşmüştü.

### Adım 4 — Doğu ve Dein

Yamato'nun "yakında doğuya gidiyoruz" sözü — sürü lideri raporunda artık geçici
bir laf değil, açık bir niyet olarak duruyor — ile Dein için sonuçlanmamış arama,
gerçekten yeni içerik gerektiren iki iptir. Yukarıdaki hazır içerik bağlandıktan
sonra özgün bir kol yazmak için doğru yer burasıdır.

### Bu çalışmanın kuralları

- Başlangıç değiştirilmez. Buradaki her şey mevcut içeriğin ardına eklenir.
- Oyuncuya görünen yeni metinler `locales/en.json` ve `locales/tr.json` içine
  girer; Türkçe metin çeviri yerine doğrudan Türkçe yazılır.
- Bir boşluğu kapatmak için güç eklenmez. Sayıları yükseltmek yerine mevcut
  içeriği bağlamak tercih edilir.
- Yukarıdaki bir bölüm doğruluğunu yitirdiğinde bu belge güncellenir.
