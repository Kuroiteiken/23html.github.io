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

> **Bu maddeler araştırılıyor.** Her biri, sahibinin kuralı gereği önce buraya yazılıyor,
> sonra kodla karşılaştırılıp doldurulacak: üzerine kurulacak neyin zaten var olduğu,
> gerçekten yeni yazılması gerekenin ne olduğu ve ölçülen sayılar. Bir madde bu ayrıntıyı
> taşımadığı sürece onu bir plan değil, kaydedilmiş bir istek say.

**Önce cevap, sonra yapım.** 5. madde bir özellik değil bir soru ve aşağıdaki iki madde
onun cevabına bağlı: bir direnç alanının hiç okunmadığı çıkarsa, yanma debuff'ı (12.
madde) ve kalkan değerleri (7. madde) başka türlü tasarlanmak zorunda. Cevaplanmamış bir
soruya dayanan iş iki kez yapılır.

### 5. Direnç alanları dövüşte gerçekten okunuyor mu?

**Durum:** soru, ölçülüyor.

Sahibi, ağrı direnci, ölümsüz direnci ve karanlık savunma gibi dirençlerin hasar
azaltmada dikkate alınıp alınmadığını soruyor. Bu tartışılacak değil cevaplanacak bir şey:
`res` nesnesinin her alanı çıkarılır, her birinin okunduğu her yer bulunur ve etki
`tests/harness.js` ile kanıtlanır — bir alan değiştirilip `dmg_calc` ölçülür. Alan başına
sonuç üç şeyden biri: okunuyor ve etkili, okunuyor ama etkisiz, hiç okunmuyor.

### 6. Unvanlar: yorumda bırakılmış verme kodu

**Durum:** kabul edildi — bu bir düzeltme, ekleme değil.

`js/data/equipment.js:2730-2731` `ttl.mone2` ve `ttl.mone3` için yoruma alınmış iki verme
işlevi tutuyor ve ikisi de `ttl.mone1`'in zaten kullandığı `global.stat.moneyg >= GOLD`
koşulunu deniyor — yani yorumdan çıkarılsalar bile birlikte tetiklenirlerdi. `shpt2`,
`shpt3` ve `mone3`'ün dil kayıtları da boş. Sahibinin "unvanlarda iyileştirme ve arttırım"
isteği buradan başlıyor, çünkü hiçbir şeyin veremediği bir unvan içerik değildir.

### 7. Kalkanlar: taslakları, değerleri ve rütbeleri

**Durum:** kabul edildi — eklemeden önce bir düzeltme.

**Daha önce kaydedilen öncül eskimiş.** "On dört kalkanın on biri `str 0` ile geldi"
artık doğru değil: on yedi kalkan var ve hiçbirinin `str`'si 0 değil — harness ile
ölçüldü, `csr`'de 4'ten `drd`'de 23'e uzanıyorlar ve `aff[0]` ile `cls` baştan sona
dolu. Yani değerler var; gerçekten gözden geçirilecek olan bu merdivenin doğru olup
olmadığı — ki sahibinin istediğinin öbür yarısı da bu.

Eski notun kaçırdığı ve ölçümün bulduğu bir şey: **her kalkanın `int`'i 0**, on yedisinin
de. `dmg_calc`'ın büyü dalında bir kalkan `you.eqp[1].int` üzerinden katkı yapıyor,
dolayısıyla oyundaki hiçbir kalkan bir büyüye karşı hiç savunma yapmıyor. İlgili ve aynı geçişte yapılmaya değer: `you.eqp[5]` her zaman paylaşılan
`eqp.dummy` ve o, `creature.wolfa1`'in içine yazdığı `cls [9,10,9]` ile `aff[0] 14`'ü
taşıyor — [status.md](status.md) kuyruk 6. madde. Bu temizlenmeden "kalkan her zaman
hasarı azaltır" doğru hâle getirilemez.

### 8. Kaynağı olmayan şifa iksirleri

**Durum:** kabul edildi — düzeltme.

Sahibi yalnızca en küçük şifa eşyasının üretilebildiğini bildiriyor. Her iyileştirme
eşyasının kaynağı saptanmalı — tarif, satıcı ya da düşme — ve hiçbiri olmayanlara bir
kaynak verilmeli. Bu, projenin kendi kuralının uygulanması: daha fazla icat etmeden önce
var olanı bağla.

### 9. Üretim: çeşitlendirme ve işe yaramayan yıldız tozu

**Durum:** önerildi.

Tek bir sorunun iki yarısı. `item.stdst` üretiliyor ve gidecek bir yeri yok; tarif
listesinin tamamı da tek yöne eğilimli. İkisi için de bir şey eklenmeden önce mevcut şekil
ölçülmeli, ki "çeşitlendirme" denetlenebilir bir anlam taşısın.

### 10. Her yeteneğe 15. seviyeye kadar avantaj

**Durum:** önerildi.

60 yetenekten 37'sinde hiç kilometre taşı yok ve bunların yalnızca beşi eğitilemiyor —
yani 32 eğitilebilir yetenek hiçbir şey vermiyor. Ayrıntısı [status.md](status.md) kuyruk 3. maddede, yanındaki tek satırlık düzeltmeyle birlikte:
`js/data/skills.js:2277` `skl.hvt.type`'ı `skl.hst` bloğunun içinde ikinci kez ayarlıyor,
dolayısıyla `skl.hst.type` hiç ayarlanmıyor.

Tasarımı belirleyen kısıt: bir kilometre taşının `f()`'i bir kez çalışıyor ve yüklemede
tekrarlanmıyor, o yüzden yalnızca kendisi kaydedilen alanlara yazabilir — `stra`, `agla`,
`inta`, `spda`, `hpa`, `sata`.

### 11. Silah ustalığı unvanları ve takılıyken hızlanan ustalık

**Durum:** önerildi.

İkinci yarının nasıl yazılacağını belirleyen bir kısıt var: ekipman yüklemede registry'den
yeniden kuruluyor ve yalnızca `dp` ile `data` geri kopyalanıyor, dolayısıyla `str`'ye
yazılan bir bonus yok oluyor. Başka yerde kullanılan desen `oneq`/`onuneq` ile
`you.mods`'a yazmak; yükleme yolu onu yeniden uyguluyor.

### 12. Ateş hasarında yanma debuff'ı

**Durum:** önerildi, 5. maddeye bağlı.

Ateş hasarının bir yaratığı bir süre yanık bırakma şansı. Önce saptanması gerekenler:
yaratıkların efekt taşıyıp taşıyamadığı, ve oyuncuya değil bir yaratığa karşı çalışan bir
zamana yayılı hasarın zaten var olup olmadığı.

### 13. Mobilya: birkaç tane daha, ve anlamı olan bir yatak

**Durum:** önerildi.

Daha fazla mobilya, ve bir yatak varsa "yere çök ve biraz kestir" başka bir şey demeli.
Sade yataklar dinlenirken iyileşme hızını yükseltmeli, derecesine göre artımlı.

### 14. Yakmaya değer bir şömine

**Durum:** önerildi.

Şömine yandığı sürece: daha yüksek iyileşme hızı ve hafif bir enerji kazanımı. Yanında
uyumak bir süre sonra "dinlendin" buff'ı veriyor — saldırı hızı, saldırı hasarı, yetenek
kazanımı — belirli bir süre için. Buff, her şeyle birlikte tiklesin ve sona ersin diye
`giveEff` üzerinden gerçek bir efekt olmak zorunda.

### 15. Yeterince temizlenmiş bir bölgede sınırsız temizleme

**Durum:** önerildi, kayıt göçü gerekiyor.

Alan boyutları kaydın parçası ve konumsal; son alan `area.mine3` (id 131), dolayısıyla
bölge başına bir sayaç ancak sona eklenebilir. Kuyruk 8. maddedeki aksesuar yuvalarıyla
birleştirmeye değer: ikisi de bir v479 göçü gerektiriyor ve bir göç iki göçten ucuzdur.

### 16. "Araştır"ın tek yer dışında da kullanılması

**Durum:** önerildi.

Araştırma eylemi var ve tek bir konumda sunuluyor. İstek, uyacağı yerleri bulmak — ki bu
yeni mekanik değil içerik bağlamak, yani bu projenin izin verdiği en ucuz ekleme türü.

### 17. Yan hikâyelere devam

**Durum:** önerildi. Aşağıdaki "Hâlâ borçlu olunan yan hikâyeler" bölümü onları zaten
listeliyor.

Sahibinin bir kararı bekleyen değil **kapanmış** olarak kaydedildi: oyuncu panelindeki
efekt şeridinin ŞANS okumasına binmesi **olduğu gibi kabul edildi** — bilgi olarak
okunuyor ve bu yeterli. Değişiklik yok.

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

**Yeni yazılması gereken:** bir `.ct_bts:focus-visible` kuralı, `chs()` satırları için
yeniden çizim boyunca geçerli bir odak stratejisi, ve 4. maddenin ikinci yarısı için bir
karar — o bir yeniden stillendirme değil, satırın yeniden kurulması.

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
