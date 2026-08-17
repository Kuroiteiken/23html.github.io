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

`js/data/quests.js` içinde altı görev tanımlı. Beşi erişilebilir.

| Görev       | Ad                | Nereden alınır                     | Gerekenler                                                     | Ödül                                            |
| ----------- | ----------------- | ---------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| `test`      | yer tutucu        | hiçbir yer — `giveQst` çağrısı yok | —                                                              | —                                               |
| `fwd1`      | Odun Toplama      | Avcı Kulübesi iş panosu            | Kulübeye ulaşmak; köy kapısı 6. seviye ister                   | 100 servet, `sld.bkl`, 15.000 exp, karma        |
| `hnt1`      | İlk Av            | Avcı Kulübesi iş panosu            | yok, `fwd1` ile paralel                                        | 130 servet, 10× `item.jrk1`, 12.000 exp, karma  |
| `grds1`     | Nöbet Görevi      | Pazar yeri kontrol noktası         | 4. ilan panosu yazısı (`fwd1` + `hnt1` ister); 7–10 saat arası | 65 servet, 3.000 exp, tekrarlanabilir           |
| `lmfstkil1` | Canavar Temizliği | Avcı Kulübesi iş panosu            | `fwd1` + `hnt1`, 20. seviye ve dojo Golem 4'ün yenilmesi       | 300 servet, `wpn.gsprw`, `eqp.nkgd`, 18.000 exp |
| `pckld1`    | Sürü Lideri       | Avcı Kulübesi iş panosu            | `lmfstkil1` tamamlanmış ve üzerinden bir oyun günü geçmiş      | 600 servet, `eqp.amsk`, 26.000 exp              |

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
                                                                    ▼
                                                    ── HİKAYE BURADA, ÇUKURUN
                                                       ALTINDAKİ YARIKTA DURUYOR ──
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

**Hikaye artık boş bir panoda değil, bir soruda duruyor:** yarık takip edilemeyecek
kadar dar. Altındakine ulaşmak üçüncü bölümdür ve girişin oyuncunun kendi bodrumu
olması amaçlanıyor.

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

| Varlık                 | Miktar               | Durum                                                                                                                                                                                                                                                                      |
| ---------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Katakomplar**        | 26 tamamlanmış sahne | `sector.cata1`, `chss.catamn` ve `cata1`–`cata25`, id 132–157. İsimlendirilmiş odalar, 14 ortam metni, sektördeki karanlık effector'ı, 11.000 puanlık takip. Hâlâ **içeriye bağlanan hiçbir şey yok** ve aşağıya bakın: odalarda hiç dövüş yok.                            |
| **Ölümsüz bestiyeri**  | 20 yaratık           | Zombiler, gulyabaniler, ghast'lar, mumyalar, kuklalar, bebekler, mağara yarasaları, stirge'ler. Hiçbiri hiçbir alan popülasyonunda yer almıyor ve çoğu **taslak**: `hp_r` yok, istatistik yok, düşen eşya yok ve `type = 2` (Ölümsüz) yerine `type = 3` (Kötü) bırakılmış. |
| **Rutubetli mahzen**   | 1 alan               | `area.clg` doludur ama hiç başlatılmaz.                                                                                                                                                                                                                                    |
| **Pazar yeri sektörü** | 1 sektör             | `sector.vmain1` yedi sahneye bağlı ama tüm keşif tablosu ve işleyicisi yorum satırında.                                                                                                                                                                                    |
| **Unvanlar**           | 108'in 22'si         | Verilme yolu yok. Kalanların neredeyse tamamı silah ustalığı kademeleri (`srd3`, `srd4`, `lnc3`, `hmr3`, `axc3`, `sld3`–`sld5`); bunlar hikaye çalışması değil, öldürme sayacı eşikleri ister.                                                                             |
| **Eşya ve ekipman**    | 544'ün ~309'u        | Hiçbir düşme, tarif veya satıcı kaynağı yok. 7 anahtar, 6 öz, kalan 5 maske, 6 madalya, 16 element tılsımı, 14 kalkanın 13'ü, ~35 silah ve yaklaşık 150 yiyecek dâhil.                                                                                                     |

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

### Adım 3 — Yeraltı şehri

Kanca zaten yazılmış. Bodrumdaki dükkâncı şöyle diyor:

> "Yeraltında bir şey doğrudan insanların evlerine doğru kazıyor… Bazıları
> yakınlarda bir canavar mağarası olduğunu düşünüyor ama henüz bir şey
> bulunamadı."

Yamato'nun raporu artık oyuncuyu doğrudan ona yönlendiriyor; bu önemli, çünkü
cümlenin kendi koşulu (`area.hmbsmnt.size >= 1000`) neredeyse erişilemez.

Oyuncunun kendi bodrumu doğal giriştir: `chss.bsmnthm1`'den `chss.catamn`'e tek
bir bağlantı 26 odayı ve karanlık mekaniğini açar. Ayrıca meşaleye satılma,
anahtarlara var olma sebebi verir.

İkinci adımın aksine bu adım yalnızca bağlantı işi değil. Odalarda dövüş yok;
yani ölümsüzlere gerçek istatistikler, `type = 2` ve düşen eşya tabloları
verilmeli ve onları barındıracak en az bir alan tanımlanmalı. `sector.cata1`'in
11.000 puanlık takibi de, odaların açıkça yazıldığı keşif katmanına dönüşmek için
bir `scout` tablosu istiyor.

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
