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

`js/data/quests.js` içinde beş görev tanımlı. Dördü erişilebilir.

| Görev       | Ad                | Nereden alınır                     | Gerekenler                                                     | Ödül                                            |
| ----------- | ----------------- | ---------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| `test`      | yer tutucu        | hiçbir yer — `giveQst` çağrısı yok | —                                                              | —                                               |
| `fwd1`      | Odun Toplama      | Avcı Kulübesi iş panosu            | Kulübeye ulaşmak; köy kapısı 6. seviye ister                   | 100 servet, `sld.bkl`, 15.000 exp, karma        |
| `hnt1`      | İlk Av            | Avcı Kulübesi iş panosu            | yok, `fwd1` ile paralel                                        | 130 servet, 10× `item.jrk1`, 12.000 exp, karma  |
| `grds1`     | Nöbet Görevi      | Pazar yeri kontrol noktası         | 4. ilan panosu yazısı (`fwd1` + `hnt1` ister); 7–10 saat arası | 65 servet, 3.000 exp, tekrarlanabilir           |
| `lmfstkil1` | Canavar Temizliği | Avcı Kulübesi iş panosu            | `fwd1` + `hnt1`, 20. seviye ve dojo Golem 4'ün yenilmesi       | 300 servet, `wpn.gsprw`, `eqp.nkgd`, 18.000 exp |

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
                                                          ── HİKAYE BURADA BİTER ──
```

## Hikaye nerede duruyor

Otuz beşinci kurt ölümü bir callback tetikleyip oyuncuyu Güney Ormanı kapısına
taşır. Kulübeye dönüp rapor vermek `lmfstkil1` görevini tamamlar ve oyuncuyu
Batı Ormanı kapısına geri gönderir. Yamato'nun kapanış cümlesi şudur:

> "…Sana gelince, git ve hak ettiğin bir dinlenmeyi çıkar, çok iyi iş
> başardın. İleride başka canavar temizlikleri için seninle iletişime
> geçilmesini bekle."

O iletişim hiç gerçekleşmez. Bir son, bir sonsöz veya bir bitiş bayrağı yoktur.
O noktadan sonra iş panosu yalnızca başlığını ve tek bir "Dön" seçeneğini
gösterir, çünkü bütün ilan koşulları yanlıştır. **Kalıcı olarak boş bir iş
panosu, oyunun gerçek sonudur.**

Son görevin açtığı bölge iki sahne derinliğindedir: Güney Ormanı kapısı ve
yeniden doğan tek bir av alanı. İkisi de hiçbir sektöre bağlı değildir, bu yüzden
güneyin keşif veya ortam katmanı hiç yoktur.

### Diğer çıkmazlar

- Nöbet noktası `chss.jbgd1`'in **hiçbir çıkış seçeneği yok**. Saat 20 olana
  kadar oyuncu orada tutulur.
- `chss.frstn9a1m` sonsuza kadar yeniden doğan bir tekrar alanıdır.
- `chss.cata25` katakomp haritasının son düğümüdür; bölge zaten erişilemez.

## Baş Avcı

Yamato hikayenin tek sürekli karakteri ve doğal omurgasıdır. Batı Ormanı
kulübesini işletir, erişilebilir dört görevin üçünü verir ve G'den SSS'ye kadar
canavar rütbelerini ve altı yaratık kategorisini anlatan bir bilgi merkezi
barındırır.

Diyaloğu oyunun tutmadığı üç söz verir:

1. **"İleride başka canavar temizlikleri için seninle iletişime geçilmesini
   bekle."** Başka bir temizlik görevi yok.
2. **"Yakında doğuya gidiyoruz."** Doğuya ait hiçbir sektör, alan veya sahne yok.
3. **"Sürünün lideri olabilir, adamlarının ölümüne öfkelenmiş. Bu meselenin
   hızlıca çözülmesi gerekecek."** Bir sürü lideri yok.

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

| Varlık                 | Miktar               | Durum                                                                                                                                                                                  |
| ---------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Katakomplar**        | 26 tamamlanmış sahne | `sector.cata1`, `chss.catamn` ve `cata1`–`cata25`. İsimlendirilmiş odalar, 14 ortam metni, karanlık effector'ı, 11.000 puanlık keşif takibi. **Oyunda hiçbir şey buraya bağlanmıyor.** |
| **Ölümsüz bestiyeri**  | 20 yaratık           | Zombiler, gulyabaniler, ghast'lar, mumyalar, kuklalar, bebekler, mağara yarasaları, stirge'ler. Hiçbiri hiçbir alan popülasyonunda yer almıyor.                                        |
| **Rutubetli mahzen**   | 1 alan               | `area.clg` doludur ama hiç başlatılmaz. Bitiş işleyicisi var olmayan iki sahneyi çağırır.                                                                                              |
| **Pazar yeri sektörü** | 1 sektör             | `sector.vmain1` yedi sahneye bağlı ama tüm keşif tablosu ve işleyicisi yorum satırında.                                                                                                |
| **Unvanlar**           | 108'in 32'si         | Verilme yolu yok. **Kurt Katili** ve üç iş unvanı dâhil; oysa oyun tamamlanan işleri zaten sayıyor.                                                                                    |
| **Eşya ve ekipman**    | 544'ün 310'u         | Hiçbir düşme, tarif veya satıcı kaynağı yok. 7 anahtar, 6 öz, 6 maske, 6 madalya, 16 element tılsımı, 14 kalkanın 13'ü, ~35 silah ve yaklaşık 150 yiyecek dâhil.                       |

Bu kümelerin birbirine oturması tesadüf okumakta zorlanacağımız kadar düzenli:
karanlık 26 odalı bir zindan, hiçbir yerde satılmayan bir meşale, kilidi olmayan
yedi anahtar ve doğacak yeri olmayan eksiksiz bir ölümsüz bestiyeri. Bunlar tek
bir bölge olarak hazırlanmış ve hiç bağlanmamış.

## Hikaye kodundaki hatalar

Bunlar tasarım boşluğu değil, hatadır ve hikaye çalışmasından bağımsız olarak
düzeltilmelidir.

- `js/world/areas.js` — bir `area.trn.id` ataması `area.trnf` bloğunun içinde
  duruyor. Eğitim alanının id'sini eziyor ve `area.trnf.id` değerini 0 bırakıyor.
- `js/world/locations.js` — nöbet görevinin tamamlanması `global.stat.jcom`
  yerine var olmayan `global.flags.jcom` değerini artırıyor. Sonuç `NaN` oluyor
  ve arayüzün zaten gösterdiği iş sayacı hiç ilerlemiyor.
- `js/world/areas.js` — `area.clg.onEnd`, tanımlı olmayan `chss.q1lwn` ve
  `chss.q1l` sahnelerini çağırıyor. Alan erişilebilir olsaydı hata fırlatırdı.
- `chss.jbgd1`'in çıkış seçeneği yok.

## Hikayeyi sürdürmek

En ucuz devam yolu yeni bir bölge icat etmeyi gerektirmiyor. Hâlihazırda
tamamlanmış olanı bağlamayı ve diyaloğun çoktan verdiği sözleri ödemeyi
gerektiriyor.

### Adım 1 — Oyuncunun zaten yaptığı işin karşılığı

Yeni içerik ve yeni sahne yok. Oyunun zaten hak ettirdiği unvanları ver: kurt
görevi için **Kurt Katili**, `NaN` hatası düzeltildikten sonra mevcut tamamlanan
iş sayacından üç iş unvanı. Alan id çakışmasını, `area.clg` çökmesini düzelt ve
nöbet görevine bir çıkış ekle. Yorum satırındaki pazar yeri sektörünü geri getir.

### Adım 2 — Yeraltı şehri

Kanca zaten yazılmış. Bodrumdaki dükkâncı şöyle diyor:

> "Yeraltında bir şey doğrudan insanların evlerine doğru kazıyor… Bazıları
> yakınlarda bir canavar mağarası olduğunu düşünüyor ama henüz bir şey
> bulunamadı."

Yamato'nun söz verdiği iletişim budur. Oyuncunun kendi bodrumu doğal giriştir ve
`chss.bsmnthm1`'den `chss.catamn`'e tek bir bağlantı, bir anda 26 odayı, bir
karanlık mekaniğini ve 20 atıl yaratığı açar. Ayrıca meşaleye satılma, anahtarlara
var olma sebebi verir.

Anlatı açısından bu, başlangıca hiç dokunmadan döngüyü kapatır: oyuncuyla söz
verildiği gibi iletişime geçilir, köyün altında bir şeyin kazdığı söylenir ve
cevap kendi evinin altındadır.

### Adım 3 — Sürü lideri

Son görev zaten bu kancayla bitiyor. Güney Ormanı'nın sonuna bir patron yaratık
ve bir alan eklemek bunu çözer ve iki sahnelik güney bölgesine bir varış noktası
verir. Güney sahnelerinin ayrıca bir sektöre bağlanması gerekiyor ki bölge keşif
katmanı kazansın.

### Adım 4 — Doğu ve Dein

Yamato'nun "yakında doğuya gidiyoruz" sözü ile Dein için sonuçlanmamış arama,
gerçekten yeni içerik gerektiren iki iptir. Yukarıdaki hazır içerik bağlandıktan
sonra özgün bir kol yazmak için doğru yer burasıdır.

### Bu çalışmanın kuralları

- Başlangıç değiştirilmez. Buradaki her şey mevcut içeriğin ardına eklenir.
- Oyuncuya görünen yeni metinler `locales/en.json` ve `locales/tr.json` içine
  girer; Türkçe metin çeviri yerine doğrudan Türkçe yazılır.
- Bir boşluğu kapatmak için güç eklenmez. Sayıları yükseltmek yerine mevcut
  içeriği bağlamak tercih edilir.
- Yukarıdaki bir bölüm doğruluğunu yitirdiğinde bu belge güncellenir.
