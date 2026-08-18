# Bölge tasarımı: kuzey ve maden

[English](REGIONS.md) · [Hikaye](STORY.TR.md) · [Öneriler](PROPOSALS.TR.md)

Sahibiyle kararlaştırılan iki yeni bölge: köyün kuzeyinde kırsal bir bölge, ve oradan
ulaşılan bir maden. Bu dosya ikisinin de sözleşmesi — her birini neyin açtığı,
oyuncunun ondan ne alması beklendiği, ve neyin kapattığı. Buraya yazılmadan hiçbir şey
kurulmuyor; çünkü yazılı bir bitişi olmadan giren son iki bölge, bu dosyanın tekrar
etmemek için var olduğu şey.

## İkisi için de geçerli kurallar

1. **Mevcut hiçbir şey yerinden oynamıyor.** Batı ve güney ormanları, köy, katakomplar
   ve sahneleri bitmiş durumda ve dokunulmuyor. Doğu ayrılmış kalıyor: Yamato doğu
   seferini üç kez vaat etti, o bir bölüm — bölge değil.
2. **Yeni alanlar araya değil sona ekleniyor.** `save()` her alanın boyutunu `for...in`
   sırasıyla yazıyor, `load()` konumsal okuyor; yani mevcut bir alanın üstüne eklenen
   bir alan, kendinden sonraki her alanın boyutunu sessizce kaydırıyor.
3. **Her popülasyon girdisi `c` bildiriyor.** Bildirmemek `z_bake`'in undefined
   biriktirip `popc`'ye `NaN` pişirmesine yol açıyor, ve `area_init`'in NaN ile yaptığı
   her karşılaştırma false; yani hiçbir şey doğamıyor. Bu varsayım değil: nemli bodrumu
   projenin bütün ömrü boyunca boş tutan şey tam olarak buydu.
4. **Her sahne kendi çıkışlarını çiziyor.** `smove`'da, bir sahne ne dövüş ne tek bir
   seçenek bıraktığında oyuncuya dönüş yolu veren bir ağ var, ve tarayıcı takımı o ağın
   hiç tetiklenmediğini doğruluyor. O bir ağ, politika değil.
5. **Ödül erişim ve bilgi; sayı değil.** Yeni bir bölge alet, bir yeteneğin verilme
   yolu, tarif ya da ipucu verebilir. Mevcut oyunu önemsizleştiren bir silah vermez.
6. **İlerleyiş seviyeye değil oyuncunun yaptığı şeye açılıyor.** Aşağıdaki her kapı bir
   lore girdisi, görev durumu, yetenek eşiği ya da eşya — kazanılmış ve günlükte
   görünen bir şey — böylece oyuncu bir kapının neden kapalı olduğunu her zaman biliyor.

## Neden kuzey

Batı ve güney orman, ikisi de bitmiş. Doğu ayrılmış. Köy ise hiç sahip olmadığı bir
kırsaldan zaten söz ediyor: bir **değirmen** (`nervous_guy_second_way`), bir **tahıl
ambarı** ve **içindeki kurtlar** (`market_rumours`), yaralanan **hayvanlar** (mesaj
tahtası), üç haftadır bulanık gelen bir **kuyu**, ve bir **hasat**. Bunların dördü,
oyunun hiçbir haritasında var olmayan yerlerin tek satırlık anılışı.

Kuzey harcanmamış tek yön, ve tarlalar köyün yiyeceğiyle suyunun geldiği yer. Bu aynı
zamanda bölgeye "artık yeni bir alan var" dışında bir açılma sebebi veriyor: kuyu
bozulunca köy yukarı, kaynağa bakar.

## Bölge 1 — Kuzey Tarlaları

### Açılış

| Kapı                                | Gereken                                                                    |
| ----------------------------------- | -------------------------------------------------------------------------- |
| Kuzey yolu köy merkezinde görünüyor | `knowsLore(25)` — `towardTheWell`, marangozun bodrumuna inerek kazanılıyor |
| İş teklif ediliyor                  | Mesaj tahtasında bir ilan: hasat işçileri gelmeyi bıraktı                  |

Bodrum yan hikayesi, oyuncunun elinde dört nokta bırakarak bitiyor — yaşlı adamın
bodrumu, iki kapı öteki aile, kuyunun yanındaki evler, ve marangozun bodrumu — artı
kuyunun üç haftadır bulanık geldiği gözlemi. Köyün suyunun oyuncunun taşıdığı bir soru
hâline geldiği an tam orası. Kuzey yolu ona açılıyor, seviyeye değil.

### Sahneler

| Sahne              | Ne olduğu                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Kuyu Yolu          | Köyden kuzeye çıkış, ve kuyunun kendisi. Dövüş değil — suya bakılacak bir yer              |
| Anız Tarlaları     | İlk av alanı. Alçak bant, biçilmiş ve toplanmış, arkasına saklanacak hiçbir şey yok        |
| Değirmen           | Bir yer ve bir insan. Değirmenci, çark, ve gergin adamın Dein'e söylediği **eski su yolu** |
| Korkuluğun Tarlası | Saman figürlerinin olduğu yer. `creature.kksh`                                             |
| Tahıl Ambarı       | Tahıl ambarındaki kurtlar, nihayet bir yerde                                               |
| Alçak Tepeler      | En uç, ve madene giden yol                                                                 |

### Beklentiler

Oyuncu kuzeyden şunlarla çıkmalı:

- Tarlaların bozulmasının yerel bir sorun değil **ana hikaye** olduğu bilgisi.
  `creature.kksh`'nin kendi tarifi onun **bir zamanlar tarlaların koruyucusu** olduğunu
  ve **Karanlığın etkisiyle kötüye döndüğünü** söylüyor. Köyün altında biriken ölüm
  ki'si (`deathKiPooling`, id 12) köklere ulaştı. Bölge, oyuncunun zaten peşinde olduğu
  şeyin bir belirtisi.
- Avcı olmayan bir insanla kurulmuş bir ilişki. Değirmenci, geçimi köyün ekmeği olan bir
  zanaatkâr; ve marangozdan sonra oyuncuya pazarın fikirlerinden daha çok işe yarayan
  ikinci kişi.
- Değirmenin eski su yolu — madenin erişilebilir olmasının tek sebebi.
- Yeni güç yok. Kuzey erişimle ve bir tarif kadar yiyecekle ödüyor.

### Bitiş

Tarlalar hasadı içeri alacak kadar güvenli hâle geliyor, ve bu ima edilmek yerine açıkça
söyleniyor. Oyuncunun oradan aldığı şey, köyün altındaki şeyin **köyün altında
kalmadığı**: tarlalara ulaştı, ve tarlalar herkesin içtiği kuyunun yukarısı.

Kuzey, bunu **yapanın kim olduğunu cevaplamıyor**. O soru günlükte `whoseHand` (id 27)
olarak zaten açık ve cevaplandığı yer maden.

## Bölge 2 — Maden

Maden de bir icat değil. Oyunda hâlihazırda yazılı iki metin doğrudan onu gösteriyor:

- `secondWayIn` (id 24): Dein _"aşağıya inen ikinci bir yol sordu — mezarlıktan
  geçmeyen bir yol. Katakompların orada olduğunu zaten biliyordu ve etrafından dolanmak
  istiyordu."_
- `nervous_guy_second_way`: _"Ona değirmenin yanındaki eski su yolunu söyledim, çünkü
  bildiğim tek delik oydu."_ Ve `nervous_guy_confession`'da Dein'in aldıkları:
  _"Halat. Lamba yağı. Bir kutu tebeşir."_

Lamba yağı bir madenin istediği şey. Değirmen tarlalarda. Yani değirmenin yanındaki su
yolu iki yeni bölgenin birleştiği yer, ve maden Dein'in gitmekte olduğu yer. Oyuncu on
dört aylık bir alışveriş listesini takip ediyor.

### Açılış

| Kapı                          | Gereken                                   |
| ----------------------------- | ----------------------------------------- |
| Tepeler yolu görünüyor        | Kuzeyin hasat yayı kapandı                |
| Maden ağzı açılabiliyor       | Demirciden alınmış bir **kazma**          |
| Oyuncu taşı hiç işleyebiliyor | `skl.mng`, ilk başarılı kazmada veriliyor |

`skl.mng` — "Madencilik", _"Taşlardan ve dağlardan malzeme çıkarma yeteneği"_ —
`js/data/skills.js`'te zaten var; verilme yolu ve oyunda hiçbir okuyucusu yok. Maden,
onun için yazılmış şey. Kazma yeni ve demirciden geliyor; bu da demirciye baştan beri
borçlu olduğumuz ikinci yarıyı veriyor.

### İçindeki ilerleyiş

Her biri bir öncekine açılan üç derinlik. Sahibin istediği "ilerleyiş" bu: maden, seviye
aralığı olan tek bir alan değil; sırayla kazanılması gereken üç yer.

| Derinlik          | Neye açılıyor        | Aşağıda ne var                                                                                               | Ne ödüyor                                                          |
| ----------------- | -------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| **Galeri Ağzı**   | Kazmaya sahip olmak  | Tükenmiş üst kat. Kömür — `item.coal1` ve `item.coal2` zaten var ve zaten şöminede yanıyor                   | Madencilik yeteneğinin ilk seviyeleri, ve eve taşımaya değer yakıt |
| **Su Basmış Kat** | Bir Madencilik eşiği | Durgun su. Madenin suyu ile köyün bulanık kuyusu aynı su, ve oyuncunun bunu kendi gözüyle gördüğü yer burası | İki bölge arasındaki bağ, ve bir lore ipucu                        |
| **Derin Kesit**   | Suyu geçmek          | Cevher, eski lambalardaki kandil ruhları, ve en dipte katın **aşağıdan** kırılıp açıldığı yer                | `whoseHand`'in cevabı, ve Dein'in kendi işaretleri                 |

### Kandil ruhu

`creature.lsprt` — _"Madenlerde ve insan hareketinin az olduğu diğer yerlerde yağ
lambalarının içinde beliren küçük ateş ruhları. Doğaları kötü olmasa da insanlara şaka
yapmaktan hoşlanırlar."_

Şu anda korkuluğun stat bloğunun bire bir kopyası; yani hiç tasarımı yok. Tarifi ise
tasarımın kendisi: **kötü değil, ve şaka yapıyor.** Yani düşman bir öğütme değil. Işığını
söndürüyor. Maden karanlık, `cansee()` zaten ışık taşımaya bağlı, ve marangozun bodrumu
oyuncuya yerin altında karanlıkta kalmanın kozmetik değil gerçek bir durum olduğunu çoktan
öğretti. Bütün kişiliği lambanı söndürmek olan bir yaratık, bir can çubuğundan çok
etrafından dolaşmaya değer bir tehlike.

### Bitiş

Oyuncu derin kesitin dibinde, öte taraftan açılmış bir deliğin başında duruyor ve parası
olan bir avcının neden bir turp satıcısına köyün altından mezarlıktan geçmeyen bir yol
sorduğunu anlıyor.

Maden, Dein'e ne olduğunu **cevaplamıyor**. O bilinçli olarak açık kalıyor — doğuya açılan
kapı o, ve doğu bir bölüm.

## Bunun kapattıkları

| Önceden borçlu olan                                                        | Kapatan                 |
| -------------------------------------------------------------------------- | ----------------------- |
| Korkuluğun oyunda tarlası, çiftliği, çayırı ya da kırsal sektörü yoktu     | Bölge 1                 |
| Kandil ruhunun oyunda madeni, kuyusu, cevheri ya da kazması yoktu          | Bölge 2                 |
| `skl.mng` verilme yolu ve okuyucusu olmadan duruyordu                      | Bölge 2, Galeri Ağzı    |
| Demircinin ikinci yarısı — madencilik, kazma, örs                          | Bölge 2'nin açılışı     |
| `market_rumours`'ın tahıl ambarı, mesaj tahtasının hayvanları, değirmen    | Bölge 1                 |
| `secondWayIn`, var olmayan bir değirmenin yanındaki su yolunu gösteriyordu | İkisinin birleştiği yer |

## Bilinçli olarak dokunulmayanlar

- **Doğu.** Ayrılmış, bölüm boyutunda, ve diyalogda üç kez vaat edilmiş.
- **Katakompların batı koridoru.** Sahibin `cata13`–`cata25` için oda oda yazılmış bir
  tasarımı var; maden aynı taşa öbür taraftan ulaşıp orada duruyor.
- **Dein'e ne olduğu.** Sahibin kendi planında sınır dışı olarak adlandırılmış.
- **Bebekler.** Beş yaratık tamamen yapıcı varsayılanlarıyla çalışıyor ve henüz
  hizalanacakları bir kademe yok. Hâlâ borçlu, hâlâ programsız.
