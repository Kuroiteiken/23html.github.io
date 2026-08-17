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

- **Oyuncu panelindeki efekt şeridi ŞANS okumasına biniyor.** Ölçümle doğrulandı: ilk
  ikondan itibaren ve on efektte metni tamamen kapatıyor. Kaçacak boş yer yok —
  panel sabit 310px ve akıştaki kolon şeridin bandına zaten değiyor — yani dürtme
  değil, bilinçli bir düzen kararı gerekiyor.
- **`chss.bsmnthm1.data.gets`** iki girdi taşıyor ama üçüncü keşif sonucu `gets[2]`
  yazıyor; o buluş "alındı" olarak hiç kilitlenmiyor.
- **`global.flags.bsmntchck`** bodrumdaki "Etrafını incele" seçeneğinin koşulu ve
  hiçbir yerde atanmıyor.
- **Silah ustalığı ünvanları.** `srd3`, `srd4`, `lnc3`, `hmr3`, `axc3`, `sld3`–`sld5`
  verilme yolu yok. Öldürme sayısı eşikleri istiyorlar; v476'da eklenen eşik tablosu
  bunu zaten ifade edebiliyor.
- **Rütbe 9'un üstü rütbe düşmesi almıyor.** `ar = ((rnk - 1) / 3) << 0`,
  `global.rdrop` içinde yalnızca 0–2 kademeleri dolu olan bir diziyi indeksliyor; yani
  her derin yaratık tamamen kendi düşme tablosuna bağlı.
- **`item.svila1`/`item.svial1`** içinde iskelet olan tek kullanımlık bir alan kuruyor.
  Bitmiş mi terk edilmiş mi belirsiz.
- **`vendor[*].dfl`** beş satıcının dördünde atanıyor ve hiçbir yerde okunmuyor.
- **On dört kalkanın on biri hâlâ taslak** — `qad`, `crc`, `rnd`, `twr`, `spk`, iki
  `kit` girdisi, `htr`, `ovl` ve `jrt`; hepsinde `str = 0` ve hiç direnç yok, yani
  herhangi biri boş elden fazla korumaz. Dojonun verdiği üçü bitti; bunların zaten
  hiçbir kaynağı yok, dolayısıyla hata değil, satıcı ya da düşme bekleyen içerik.
- **Stat puanı havuzu diye bir şey yok.** `js/` içinde harcanmamış puan tutan hiçbir
  yer yok; yani "birkaç seviyede bir stata puan harca" bir bağlama işi değil, yeni
  bir sistem olur. `levelGrants` içindeki eşik kazanımları bunun ucuz sürümü ve
  hâlihazırda eklendi.
