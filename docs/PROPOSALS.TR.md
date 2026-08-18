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

## Sahibinin sıraya aldığı işler

Sahibinin istediği ve henüz bitmemiş her şey, işe başlamadan önce buraya
yazılıyor; böylece oturumlar arasında hiçbir şey kaybolmuyor. Bir madde
tamamlandığında bu listeden çıkıyor, yaptığı iş changelog'a ve hikayeye
dokunuyorsa [STORY.TR.md](STORY.TR.md) dosyasına geçiyor.

### 9. Mobilya: daha fazlası ve bir anlamı olan yataklar

- Genel olarak daha fazla mobilya.
- Yatak varken dinlenme hâlâ "yere çök ve biraz kestir" diye anlatılmamalı. Kendi
  metnine ihtiyacı var.
- Yatak, dinlenirken canın geri gelme hızını yükseltmeli; kademesine göre — sade
  bir yatak iyi bir yataktan daha az.

### 10. Şöminenin bir işe yaraması

- Yanarken: daha hızlı iyileşme ve hafif bir enerji kazanımı.
- Şömine yanarken uyumak, sonrasında bir süre **Dinlenmiş** etkisi vermeli —
  saldırı hızı, saldırı hasarı ve ustalık kazanımı.

### 11. Kâbusun bir çıkışı olmalı

`chss.hbed.onStay` içinde tamamen yazılmış bir kâbus yorum satırında duruyor;
çünkü `creature.ngtmr1`'in 100.000.000 canı var ve hiç saldırmıyor, yani dövüş ne
kazanılabiliyor ne kaybedilebiliyor. Kazanılabilir olması gerekmiyor: bir
**uyan** seçeneğine ihtiyacı var. Uyanmayı denemek ve uyanmak, çıkışın kendisi.
İçinde kalmak bir beceriyi geliştirebilir; bu da kalmak için bir sebep verir.

### 12. Araştır eylemi daha fazla yerde kullanılmalı

`global.flags.bsmntchck` sorunlu değil — araştırma açıldıktan sonra araştır eylemi
onu atıyor, yani bodrumdaki "Etrafını incele" amaçlandığı gibi çalışıyor. Asıl
eksik, araştır eyleminin tam olarak tek bir yerde kullanılması. Başka yerlerde de
mantıklı olurdu.

### 13. Açılış için yükleme ekranı ve kayıt göçü sırasında bir not — **devam ediyor**

Oyuncu bütün açılış boyunca yalnızca CSS arkaplanını görüyor ve kayıt göçü kendini
sadece konsola bildiriyor. index.html'in gövdesi boş, yani 1,7 MB dil dosyası ve
paket inip çalışana kadar hiçbir şey görünemiyor.

---

### 16. Demirci: onarım ve silahı +9'a kadar keskinleştirme

**Durum:** devam ediyor.

Sahibinin kılıcının dayanıklılığı bitti ve oyunda onu geri getiren hiçbir şey yok --
tükenmiş bir silahın hasara katkısı, formülün düştüğü düz 0.1'e çöküyor ve bundan
çıkış yok. Var olan bir çıkmazı kapatan kısım onarım, o yüzden önce o geliyor.

Üstüne: keskinleştirme, +1'den +9'a, her adımı ücretli ve şansa bağlı; silahın
saldırısını yükseltiyor ve eşyanın adında ve renginde kendini gösteriyor.

**Zaten var:** her ekipman parçasında `dp`/`dpmax` ve hiçbir yerde onları geri
getiren bir şey yok; `js/systems/crafting.js` içinde `repairCost` ve
`repairableInventory`; demircinin kendi listesi için şablon olarak satış panelinin
`chs_spec` durumu; ekipman örneğinde kaydın koruduğu `data` alanı.

**Yeni olması gereken:** demircinin sahnesi ve diyalogları, yükseltme zarı ve renk
kademeleri.

**Kayıt okunurken bulunan kısıt:** bonus `str` içine yazılamaz. Bir eşya geri
yüklenirken kayıttan değil kayıttaki tanımdan yeniden kuruluyor ve üzerine yalnızca
`dp` ile `data` kopyalanıyor (`js/core/bootstrap.js:1148-1156`), yani `str`'ye
yazılan her şey bir sonraki yüklemede kayboluyor. Hasarın hesaplandığı yerde
`data.plus` üzerinden türetilmesi gerekiyor.

---

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

**Durum:** önerildi.

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

35. seviye civarı bir karakterde ölçüldü — GÜÇ 50, göğüs zırhı GÜÇ 12 ve dayanıklılığı
    tam, fiziksel yakınlık 5 ve kesici direnci 4, Kalkan becerisi 10, saldırı terimi 100:

| Dıştaki çarpan          | Kalkansız alınan hasar | Hoplit Kalkanı ile |
| ----------------------- | ---------------------- | ------------------ |
| Bugünkü hâli (zırh `-`) | 36,9                   | 26,9               |
| Düzeltilmiş (zırh `+`)  | 9,9                    | 1,0                |

Yani bunu da düzeltmek, kalkansız bir oyuncuyu yaklaşık dört kat daha dayanıklı
yapıyor ve kalkan taşıyan herkes için hasarı 1'e sabitliyor. Bu bir düzeltme değil,
oyundaki her dövüşün yeniden dengelenmesi; o yüzden bilinçli bir tercih olmalı — ve
muhtemelen hasar azaltmayı asıl domine eden düz `def.str * eff` terimini düşürmekle
birlikte ele alınmalı.

**Zaten var:** iki terim ve kalkan yarısını sabitleyen, sessizce geri dönmesini
engelleyen bir regresyon testi.

**Yeni olması gereken:** bir karar ve alınırsa yaratık hasarları üzerinden bir geçiş.

---

## Hâlâ borçlu olduğumuz yan hikayeler

Brief en az sekiz istiyor. Biri girdi (**Hiçbir Şey Söylemeyen Adam**, pazardaki
gergin adam). Kaynaklarda hazır duran kancalar şunlar:

| Kanca                  | Zaten var olan                                                                                                                                                                                     | İhtiyacı                                                                                                                                                                                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kâbus**              | `chss.hbed.onStay` içinde tamamen yazılmış ve yorum satırına alınmış: kendi yatağında uyurken `creature.ngtmr1`'e karşı bir kâbus alanına çekilebiliyordun, mesajı "Günahların üstüne tırmanıyor". | Olduğu gibi geri açmak oyuncuyu kilitler — yaratığın 100.000.000 canı var ve `battle_ai`'si hiç saldırmıyor, yani dövüş ne kazanılabilir ne kaybedilebilir. Gerçek bir çıkış gerekiyor; artık var olmak için bir sebebi de var: oyuncu ölüm ki'si soluyor. |
| **Rutubetli mahzen**   | `area.clg` tanımlı, dolu ve bir kez bile başlatılmıyor. Bitiş işleyicisi var olmayan iki sahneyi çağırıyordu, yani görevi kesilmiş.                                                                | Ona ulaşacak bir sahne ve yeni bir bitiş işleyicisi.                                                                                                                                                                                                       |
| **Korkuluk**           | `creature.kksh`, tamamen statlı, karanlıkla bozulmuş, pusu kurduğu yazılı — ve hiçbir alanda yok.                                                                                                  | Tarlaların olduğu bir yer.                                                                                                                                                                                                                                 |
| **Mimik**              | `creature.lrck`, 9000 can, `battle_ai` false döndürüyor, mağara ve zindanlarda duvar taklidi yaptığı yazılı.                                                                                       | Yeraltında, olacağı bir duvar.                                                                                                                                                                                                                             |
| **Kandil ruhu**        | `creature.lsprt`, statlı, madenlerdeki kandillere musallat olduğu yazılı.                                                                                                                          | Madenler — demirci önerisine bakın.                                                                                                                                                                                                                        |
| **Bebekler**           | `puppet`, `bpuppet`, `doll`, `ndoll`, `cdoll`: ele geçirilme ve karanlık ritüellerle ilgili beş yaratık, hepsi taslak, hepsi erişilemez.                                                           | İstatistikler ve ritüelleri yapan biri.                                                                                                                                                                                                                    |
| **Yedi anahtar**       | Oyunda hiçbir kilidi olmayan yedi anahtar eşyası.                                                                                                                                                  | Kilitler. İsimlendirilmiş odalardan oluşan bir zindan bariz ev.                                                                                                                                                                                            |
| **Pazar yeri sektörü** | `sector.vmain1` yedi sahneye bağlı ve tüm keşif tablosu yorum satırında.                                                                                                                           | Yorumdan çıkarıp tamamlamak.                                                                                                                                                                                                                               |

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
