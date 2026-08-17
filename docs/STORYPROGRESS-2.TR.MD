# CONTINUE FROM CURRENT STORY STATE

Önce mevcut:

`STORY.md`

ve varsa:

`STORY.TR.md`

dosyalarını tekrar oku.

Ardından mevcut repository kodunu kontrol et.

Bu dosyalardaki mevcut state'i başlangıç noktası olarak kabul et ancak **kod her zaman son source of truth'tur**.

Özellikle Catacombs scout sistemi konusunda STORY dokümanında eski/yeni state'in aynı anda kalmış olabileceği bir çelişki var:

- bir bölüm `sector.cata1` scout track'inin aktif olduğunu ve dört keşfin çalıştığını söylüyor,
- başka bir bölüm ise scout table/onScout olmadığını söylüyor.

Gerçek implementation'ı koddan doğrula ve STORY dokümanını buna göre temizle.

---

# CURRENT STORY POINT

Şu anda:

- `lmfstkil1` tamamlanabiliyor.
- `pckld1` — The Pack Leader tamamlanabiliyor.
- `undcty1` — Beneath the Village tamamlanabiliyor.
- oyuncunun basement'ından Catacombs'a giriş açılmış durumda.
- Catacombs upper section oynanabilir.
- `cata1`–`cata5` giriş tier'ı aktif.
- `cata6`–`cata12` eastern ring aktif.
- toplam 12 oda populate edilmiş durumda.
- Catacombs exploration/scouting sistemi en azından kısmen bağlanmış durumda.
- `wpn.trch` artık Catacombs üzerinden elde edilebiliyor.
- darkness/light sistemi gerçek gameplay etkisine sahip.
- `cata13`–`cata25` western corridor büyük ölçüde boş.
- `cata25` mevcut dungeon'ın son noktası.
- Dein'in hikâyesi hâlâ çözülmedi.
- Yamato'nun doğu seferi sözü hâlâ karşılık bekliyor.

**Hikâye burada durmamalı.**

Şimdi Chapter IV ve sonrasını geliştir.

---

# ANA HEDEF

Catacombs'u yalnızca bir dungeon grind alanı olmaktan çıkar.

Burayı:

- ana hikâye,
- çevresel anlatı,
- keşif,
- optional quest'ler,
- key mekanikleri,
- gizli odalar,
- mini boss'lar,
- lore,
- oyuncu seçimleri,
- tekrar village'a dönen sonuçlar

olan gerçek bir RPG bölgesine dönüştür.

Catacombs bittikten sonra oyun yeniden boş job board'a veya anlamsız grind'a dönmemeli.

Dungeon'ın sonunda hikâye doğrudan:

**Dein → Yamato → Eastern Expedition**

zincirine bağlanmalı.

---

# CHAPTER IV — DEEPER BENEATH

Catacombs'un ilk 12 odası artık "upper catacombs" olarak kabul edilebilir.

`cata13` sonrası oyuncunun gerçekten daha eski ve tehlikeli katmana geçtiği hissedilmeli.

Ancak bunu sadece enemy HP yükselterek yapma.

Atmosfer değişsin.

Örneğin upper Catacombs'ta görülen:

- village'dan yakın zamanda çalınmış eşyalar,
- yeni kazı izleri,
- bats,
- stirges,
- daha basit undead

yerini aşağı indikçe:

- eski mezarlara,
- hunter izlerine,
- kapatılmış geçitlere,
- savaş kalıntılarına,
- daha organize undead'e,
- kasıtlı olarak mühürlenmiş odalara

bırakmalı.

Oyuncu şu soruyu sormaya başlamalı:

> Burayı gerçekten undead mi açtı, yoksa birileri undead'i rahatsız edecek şekilde buraya mı girdi?

---

# WESTERN CORRIDOR

`cata13`–`cata25` zincirini doldur.

Ancak 13 odanın tamamını combat odası yapma.

Ritim oluştur.

Önerilen dağılım:

### Combat rooms

Yaklaşık %40–50.

### Exploration / environmental rooms

Yaklaşık %20–25.

### Story / clue rooms

Yaklaşık %15–20.

### Optional / secret content

Yaklaşık %15–20.

Bu oranları mevcut room layout'a göre adapte et.

---

# DEEP CATACOMB CREATURES

Repository içerisinde stat'ı eksik olan fakat Catacombs için hazırlanmış görünen creature'ları incele.

Özellikle:

- `ght`
- `zmbk`
- `zmbm`
- `mumy`
- doll / puppet family
- diğer unused Undead tanımları

öncelikli olarak değerlendir.

Bunları gerekiyorsa tamamla.

Ancak:

`rnk`

değerini doğrudan combat power olarak yorumlama.

Mevcut oyunda rank ile gerçek combat strength arasında doğrudan lineer ilişki olmadığı zaten görülüyor.

Stat'ları oyuncunun bu noktadaki gerçek progression'ına göre ayarla.

Ayrıca yüksek rank creature'larda mevcut `global.rdrop` sisteminin reward üretmediği tier'lar varsa:

**ödülleri creature'ın kendi drop table'ına koy.**

Yeni creature oluşturmadan önce mevcut creature'ları kullan.

---

# DUNGEON PROGRESSION

Catacombs aşağıdaki hissi vermeli:

```text
Basement
   │
   ▼
Upper Catacombs
cata1–cata5
   │
   ▼
Eastern Ring
cata6–cata12
   │
   ├──────── optional discoveries
   │
   ▼
Western Passage
cata13+
   │
   ├── locked rooms
   ├── side stories
   ├── minibosses
   ├── hunter clues
   └── shortcuts
   │
   ▼
Deep Catacombs
   │
   ▼
cata25
The End Of Journey
   │
   ▼
major story discovery
   │
   ▼
return to Yamato
   │
   ▼
Dein investigation
   │
   ▼
Eastern Expedition preparation
```

---

# THE SEVEN KEYS

Repository'de mevcut fakat kullanılmayan **7 key item'ı** incele.

Catacombs bunların doğal kullanım alanı.

Yeni key oluşturmadan önce mevcut key ID ve isimlerini çıkar.

Her key ana hikâyeyi zorunlu olarak bloklamamalı.

Daha iyi yapı:

### Main progression keys

1 veya maksimum 2 adet.

### Optional keys

Kalanları:

- secret room
- shortcut
- miniboss
- cache
- lore room
- hunter camp
- old crypt
- equipment room

gibi optional içeriklerde kullan.

Oyuncu:

> Anahtarı bul → iki oda sonra doğru kapıya tak

şeklinde düz bir puzzle yaşamamalı.

Bazı anahtarların hangi kapıya ait olduğu ilk anda belli olmayabilir.

---

# SHORTCUT SYSTEM

Catacombs büyük olduğu için exploration cezaya dönüşmemeli.

Deep section içerisinde en az 2 shortcut oluşturmayı değerlendir.

Örneğin:

```text
cata18
  │
  └──── unlock shortcut ────► cata6
```

veya

```text
cata22
  │
  └──── old stairway ───────► cata1
```

Gerçek topology'yi kontrol ederek uygun bağlantıları seç.

Shortcut ilk başta diğer taraftan açılmasın.

Oyuncunun dungeon progression'ının ödülü olsun.

---

# SIDE QUEST DESIGN — CATACOMBS

Catacombs içerisinde **en az 6–8 farklı side story / optional objective** oluştur.

Bunların tamamı quest board üzerinden verilmek zorunda değil.

Bazıları:

- bir room'u inceleyerek,
- bir item bularak,
- bir corpse/search sonucu,
- NPC diyaloğu,
- exploration discovery

üzerinden başlayabilir.

Dungeon'ın kendi içinde quest keşfedilebilsin.

---

# SIDE QUEST 1 — THE OLD MAN'S LANTERN

Shopkeeper'ın kaybolan lantern'ı hikâyede zaten kurulmuş durumda.

Eğer mevcut Catacombs scout reward'unda lantern/torch bulunuyorsa bunu kullan.

Oyuncu onu bulduğunda iki seçenek olabilir:

### Return it

Shopkeeper'a geri götürür.

Ödül:

- wealth
- karma
- dialogue
- ileride shop discount veya özel stock

gibi küçük ama anlamlı bir sonuç.

### Keep it

Oyuncu `wpn.trch` olarak kullanmaya devam eder.

Bu durumda shopkeeper farklı tepki verebilir.

Ancak oyuncunun Catacombs progression'ını ışık kaynağından mahrum bırakma.

Eğer item teknik olarak aynı object ise sistem açısından uygulanabilir çözüm üret.

Amaç mekanik ile hikâyeyi çarpıştırmak değil.

---

# SIDE QUEST 2 — THE MISSING CHISELS

Marketplace investigation sırasında geçen kayıp chisels olayını devam ettir.

Deep Catacombs'ta:

- kırılmış chisel,
- tool marks,
- yakın zamanda açılmış taş,
- village üretimi olduğu belli olan ekipman

bulunsun.

Twist:

İlk başta yaratıkların bunları çaldığı düşünülür.

Ancak tool marks bazı geçitlerin:

**bilinçli şekilde açıldığını**

göstersin.

Burada yeni mystery aç:

> Eğer undead kazmıyorsa, kim kazıyordu?

Bu ana hikâyeye küçük fakat önemli bir clue olmalı.

---

# SIDE QUEST 3 — FORGOTTEN POST

Catacombs'taki mevcut room isimlerinden ve özellikle eski sentry/hunter çağrışımı yapan odalardan yararlan.

Eski bir observation post / hunter post bulunabilir.

Burada:

- eski equipment,
- broken camp,
- notes,
- carved hunter signs

bulunsun.

Oyuncu buranın village tarafından bilinenden çok daha yakın tarihte kullanıldığını fark etsin.

Ödül yalnızca item olmasın.

**Lore + Dein mystery progression** sağlayabilir.

---

# SIDE QUEST 4 — THE LOCKED DEAD

Optional bir crypt oluştur.

Anahtar ile açılmalı.

İçeride güçlü bir undead bulunabilir.

Yeni monster taxonomy oluşturmak yerine:

- `zmbk`
- `mumy`
- veya mevcut uygun bir creature'ın named variant'ını

kullan.

Bu encounter oyuncuya:

- özel mevcut weapon
- mask
- medal
- shield
- key

gibi repository'de kaynağı olmayan mevcut item'lardan birini verebilir.

---

# SIDE QUEST 5 — THE DOLL IN THE DARK

Repository'deki doll / puppet undead family gerçekten kullanılabilir hale getirilebiliyorsa optional eerie side story olarak kullan.

Ancak bunu ana Catacombs temasının tamamına yayma.

Tek bir bölümün kendi küçük korku hikâyesi olabilir.

Örneğin oyuncu:

- aynı doll'u farklı odalarda görür,
- bir yerde bıraktığı halde başka yerde tekrar bulur,
- sonunda bunun gerçek enemy family'ye bağlandığını keşfeder.

Combat sistemi desteklemiyorsa karmaşık teleport AI yapma.

Scene state / flags ile anlat.

Bu tamamen optional olabilir.

---

# SIDE QUEST 6 — THE GRAVE COINS

Catacombs scout table'da mevcut "grave coins" veya benzeri discovery gerçekten varsa bunu basit vendor trash olmaktan çıkar.

Village'da veya Catacombs içinde bu coin'lerin anlamını öğrenebileceğimiz bir bağ oluştur.

Örneğin:

- burial tradition,
- forgotten guards,
- old expedition,
- Catacombs'u kullanan eski topluluk

ile ilişkili olabilir.

Fetch quest yapma.

Coin lore anahtarı olsun.

---

# SIDE QUEST 7 — A HUNTER WHO NEVER RETURNED

Mevcut hunter lore'unu kontrol et.

Uygun mevcut NPC/hook yoksa küçük bir yeni NPC eklenebilir.

Bir hunter Catacombs'u oyuncudan önce keşfetmeye çalışmış olabilir.

Oyuncu onu:

- hayatta,
- yaralı,
- delirious,
- veya ölü

bulabilir.

Tercihen direkt "rescue NPC" klişesine düşme.

Örneğin hunter hayatta olabilir fakat:

**geri dönmek istemiyor olabilir.**

Bir şey görmüştür.

Oyuncu:

- ikna edebilir,
- zorla götürebilir,
- Yamato'ya rapor edebilir,
- sırrını saklayabilir.

Sonuç daha sonra Lodge dialogue'unda karşılık bulabilir.

---

# SIDE QUEST 8 — MARKS IN THE STONE

Bu Dein arc'ına açılan optional ama güçlü side chain olsun.

Oyuncu birkaç Catacombs odasında aynı hunter işaretini fark eder.

İlk işaret önemsiz görünür.

Sonrakiler aynı kişinin rota işaretleri olduğunu gösterir.

Sonunda işaretlerden biri oyuncunun daha önce gördüğü:

- Dein'in sword mark'ı,
- deputy chief insignia,
- Hunter's Lodge işareti

ile bağlantı kurar.

Burada kesin olarak:

> Dein buradaydı.

sonucuna ulaşabiliriz.

Ama:

> Dein'e ne oldu?

sorusunu cevaplama.

---

# OPTIONAL ROOM DESIGN

Her optional oda mutlaka loot chest olmamalı.

Örnek ödüller:

- lore
- shortcut
- key
- title progress
- bestiary entry
- NPC dialogue unlock
- map knowledge
- hidden equipment
- alternative quest solution
- later chapter clue

kullan.

---

# LIGHT MECHANIC

Darkness Catacombs'un gerçek bir mechanic'i.

Bunu koru.

Ancak oyuncuyu sürekli candle farm'a zorlayan kötü UX'e dönüştürme.

Deep Catacombs ilerledikçe oyuncu ışık yönetiminde daha iyi hale gelebilsin.

Mevcut item/system'leri kontrol et.

Örneğin:

- torch
- candle
- existing charm
- lantern
- equipment

üzerinden progression yapılabilir.

Yeni permanent light item eklemeden önce mevcut unsourced item listesini araştır.

---

# REST / SAFE ROOM

26 room'luk dungeon için bir safe point mantıklı olabilir.

Mevcut sistem destekliyorsa deep section içerisinde:

- abandoned hunter camp,
- sealed shrine,
- old guard room

gibi bir alan oluştur.

Burada sınırsız full heal verme.

Ama oyuncuya:

- yeniden hazırlık,
- lore,
- light management,
- shortcut

açısından nefes alanı sağla.

---

# CATACOMBS MAIN QUEST

Yeni ana quest chain oluştur.

Quest isimlerini repository naming convention'ına göre belirle.

Örnek conceptual chain:

```text
undcty1
Beneath the Village
      │
      ▼
cata1
Into the Catacombs
      │
      ▼
cata2
The Western Passage
      │
      ▼
cata3
Marks of the Hunter
      │
      ▼
cata4
The End of Journey
      │
      ▼
dein1
Echoes of Dein
```

Bunlar örnek isimlerdir.

Repository'deki ID convention'a göre gerçek ID oluştur.

Tek bir quest içine bütün dungeon'ı sıkıştırma.

Dungeon ilerledikçe objective değişsin.

---

# CATACOMBS CLIMAX

`cata25` mevcut olarak:

**The End Of Journey**

adıyla dungeon'ın terminus'u.

Bunu güçlü bir story endpoint'e dönüştür.

Burada mutlaka final boss olmak zorunda değil.

Hatta sıradan:

> büyük undead boss öldür ve loot al

çözümünden kaçın.

Cata25'te oyuncu büyük bir **discovery** yapmalı.

Örneğin:

- aceleyle terk edilmiş hunter camp,
- Dein'e ait kesin bir işaret,
- sonradan kapatılmış eastern passage,
- village yönünden değil doğudan gelen izler,
- kırılmış expedition equipment,
- üzerinde Lodge işareti olan eşya

gibi kanıtlar.

Ana reveal:

**Dein Catacombs'a geldi.**

İkinci reveal:

**Catacombs onun son hedefi değildi.**

Üçüncü reveal:

**Buradan doğuya giden başka bir rota veya bağlantı vardı.**

Ancak:

- Dein hayatta mı?
- öldü mü?
- ne arıyordu?
- neden Yamato'ya dönmedi?

henüz açıklanmamalı.

---

# CATACOMBS BOSS / MINIBOSS

Dungeon içerisinde en az:

- 2 optional miniboss
- 1 major encounter

tasarla.

Major encounter doğrudan cata25'te olmak zorunda değil.

Named variant kullanabilirsin.

Örneğin mevcut:

`zmbk`

üzerinden eski bir guard/hunter,

veya:

`mumy`

üzerinden eski crypt guardian

oluşturulabilir.

Ancak yeni creature family icat etme.

Named creature existing template üzerine kurulmalı.

---

# CHAPTER V — ECHOES OF DEIN

Catacombs keşfi tamamlandıktan sonra oyuncu Yamato'ya dönmeli.

Bu çok önemli bir character scene olmalı.

Oyuncu bulduğu işareti/eşyayı gösterir.

Yamato bunu hemen tanır.

Yamato normalde:

- kontrollü,
- profesyonel,
- sakin

bir karakter.

Dein konusunda ilk kez bu kontrolünde çatlak görebiliriz.

Fakat melodrama yapma.

Örneğin kısa bir sessizlik bile yeterli olabilir.

Yamato:

> Where exactly did you find this?

gibi alışılmıştan daha doğrudan bir tepki verebilir.

Bu sahne oyuncuya Yamato ile Dein arasında yalnızca profesyonel bir bağ olmadığını hissettirmeli.

Ancak bunu uzun exposition ile anlatma.

---

# DEIN INVESTIGATION

Catacombs sonrası hemen doğuya ışınlanma.

Önce village ve Hunter's Lodge'da kısa investigation chapter oluştur.

Amaç Catacombs'taki clue'ları doğrulamak.

Kullanılabilecek mevcut yerler:

- Hunter's Lodge
- Marketplace
- General Store
- Village
- Western Woods
- Southern Forest
- Dojo

Yeni bölge eklemeden mevcut dünya tekrar kullanılsın.

Bu chapter dünyaya "Catacombs keşfedildi" sonucunu da yansıtmalı.

---

# VILLAGE REACTION

Catacombs'un keşfinden sonra village aynı kalmamalı.

Yeni ambient dialogue / conditional dialogue ekle.

NPC reaksiyonları farklı olsun.

Bazıları:

- korksun,
- inanmasın,
- söylentiyi büyütsün,
- evini terk etmek istesin,
- Catacombs'ta treasure olduğunu düşünsün,
- oyuncudan yardım istesin.

Marketplace'te söylentiler hızla yayılabilir.

Birisi:

> There's an entire city under us.

diye abartabilir.

Başka biri:

> It's a crypt, not a city.

diyebilir.

World reaction hikâyenin büyüdüğünü hissettirsin.

---

# MARKETPLACE

`sector.vmain1` hâlâ commented-out ise restore edilmesini yeniden değerlendir.

Catacombs sonrası village'ın değişimini anlatmak için Marketplace exploration çok uygun.

Marketplace'in restore edilmesi artık yalnızca teknik debt değil:

**story feature**

olarak değerlendirilmeli.

Buradan Catacombs keşfine bağlı yeni small events çıkabilir.

---

# NEW SIDE QUESTS AFTER CATACOMBS

Catacombs bittikten sonra en az 3–4 yeni side quest açılabilir.

Örneğin:

## Relic Seller

Bir tüccar Catacombs'tan getirilen eşyaları satın almak ister.

Ancak satın aldığı şeylerin bazılarının grave goods olduğu anlaşılır.

Oyuncu:

- satabilir,
- reddedebilir,
- başka NPC'ye gösterebilir.

---

## The Curious Children

Village çocukları Catacombs'u görmek ister.

Bunu escort quest'e çevirme.

Oyuncu onları basement girişinde yakalar.

Diyalog/choice based küçük bir worldbuilding event olabilir.

---

## The False Explorer

Bir NPC oyuncunun keşfini kendi başarısı gibi anlatmaya başlar.

Komik küçük bir side event olabilir.

Ama ileride gerçek danger ortaya çıktığında bu NPC başını belaya sokabilir.

---

## What Was Buried

Catacombs'tan çıkarılan bir item'i village'daki bir NPC tanır.

Bu eşya village'ın resmi tarihinin eksik veya yanlış olduğunu gösterir.

Bu ileride lore arc'a dönüşebilir.

---

# CHAPTER VI — EASTWARD

Dein investigation sonucunda oyuncu Catacombs'tan bulunan kanıtın:

**doğuya**

işaret ettiğini doğrulamalı.

Bu noktada Yamato'nun yıllardır/uzun süredir havada kalan:

> We're going east soon.

sözü karşılığını bulur.

Ancak bunu tek cümle ile yapma.

Eastern Expedition için hazırlık oluştur.

---

# EASTERN EXPEDITION PREPARATION

Yeni quest:

conceptually:

**Preparing the Expedition**

oluştur.

Oyuncudan klasik:

> 10 wood getir
> 5 food getir

şeklinde grind isteme.

Hazırlık birkaç kısa objective'ten oluşabilir:

### Information

Doğu rotası hakkında bilgi.

### Equipment

Mevcut inventory/item sisteminden expedition için gerekli bir şey.

### Personnel

Kimlerin gideceğinin belirlenmesi.

### Route

Catacombs yolu mu, yüzey yolu mu?

### Risk

Southern Forest'taki olayların doğuyla ilişkisi.

Bu chapter Yamato ve oyuncuyu artık:

**quest giver + rookie**

değil,

**iki expedition üyesi**

gibi konumlandırmaya başlamalı.

---

# EASTERN EXPEDITION PARTY

Repository'deki mevcut recurring NPC'leri kontrol et.

Ekibe yeni NPC gerekiyorsa maksimum birkaç güçlü karakter ekle.

Her biri farklı role sahip olsun.

Örneğin:

- tracker
- healer/herbalist
- veteran hunter
- scholar/cartographer

Ancak dört yeni karakteri sırf parti dolsun diye ekleme.

Mevcut NPC uygun ise onu kullan.

---

# DEIN MYSTERY RULE

Dein'i henüz bulma.

Eastern Expedition'ın motivasyonu:

> Dein'i kurtarmaya gidiyoruz.

kadar basit olmamalı.

Daha doğru:

> Dein'in izlediği yolu ve ne bulduğunu anlamamız gerekiyor.

Dein'in durumu belirsiz kalmalı.

Oyuncu şu üç ihtimali de makul görmeli:

1. Dein öldü.
2. Dein hayatta.
3. Dein isteyerek dönmedi.

Bu üç olasılığı destekleyen farklı kanıtlar olabilir.

---

# LARGER MYSTERY

Catacombs sonunda bütün olayları tek bir "ancient evil" sebebine bağlama.

Şu anda elimizde:

- diseased/weakened wolves,
- healthy pack leader,
- wolf pack'in bölgesinden sürülmesi,
- underground digging,
- stolen tools,
- undead disturbance,
- Catacombs,
- Dein,
- eastern route

var.

Bunların ilişkisi yavaş açıklansın.

Olası temel fikirleri repository lore'una göre değerlendir:

### Monster migration

Doğudaki bir olay creature'ları batıya itiyor.

### Human expedition

Birileri eski yeraltı yollarını açtı ve zincirleme sorun yarattı.

### Dein's expedition

Dein bir şeyi takip ederken yanlışlıkla veya bilinçli şekilde bazı mühürleri açtı.

### Competing faction

Başka bir insan/monster faction eski yolları kullanıyor.

### Combination

Birden fazla olay aynı anda gerçekleşiyor.

Tek açıklama her şeyi yapmasın.

Dünya daha doğal olur.

---

# WORLD STATE CHANGES

Chapter IV sonrası yeni global flags planla.

Flag spaghetti oluşturma.

Örneğin conceptual olarak:

```text
flags.cata_discovered
flags.cata_deep
flags.cata_completed
flags.dein_clue1
flags.east_prep
```

gibi açık state'ler kullan.

Ancak mevcut naming convention'a göre isimlendir.

Side quest state'lerini main flags ile karıştırma.

---

# QUEST JOURNAL

Catacombs içindeki objective metinlerini atmosferik fakat net yap.

Kötü:

> Kill 10 zombies.

Daha iyi:

> Search the western passage for signs of whoever opened the sealed chambers.

Combat gerekiyorsa narrative objective'in parçası olsun.

---

# REWARDS

Repository'de yaklaşık 300 adet unsourced item bulunuyor.

Yeni reward item yaratmadan önce bunları incele.

Özellikle:

- 7 keys
- masks
- medals
- shields
- weapons
- charms
- essences

kullanılabilir.

Ancak random güçlü item dağıtma.

Reward bulunduğu yere anlamlı gelsin.

Örneğin crypt'ten frying pan çıkmasın.

---

# TITLES

Catacombs için yeni title oluşturmadan önce mevcut 108 title'ı incele.

Uygun mevcut title varsa kullan.

Yeni title gerekiyorsa:

story milestone

veya:

significant optional achievement

karşılığı olsun.

Her quest title vermesin.

---

# SOUTHERN FOREST TECHNICAL DEBT

Southern Forest hâlâ sector'e bağlı değilse bunu düzelt.

Pack Leader ana hikâyenin parçası olduğuna göre Southern Forest artık geçici quest sahnesi gibi kalmamalı.

Minimum:

- sector attachment
- basic exploration
- ambient layer

ekle.

Ancak Catacombs çalışmasının önüne geçecek kadar büyütme.

---

# DAMP CELLAR

`area.clg` hâlâ reachable değilse incele.

Catacombs veya village side quest'lerinden biriyle doğal şekilde bağlanabiliyorsa kullan.

Sırf "unused content var" diye zorla ana hikâyeye sokma.

Ama uygun bir cellar side story için iyi aday.

---

# TECHNICAL FIXES

Mevcut STORY state'e göre aşağıdakileri doğrula:

## Basement scout latch

`chss.bsmnthm1.data.gets`

iki entry iken `gets[2]` yazılıyorsa düzelt.

## Basement examine flag

`global.flags.bsmntchck`

gerçekten hiç set edilmiyorsa intended behaviour'u belirle ve düzelt.

## Catacombs scouting

`sector.cata1`

scout table/onScout gerçek kod state'ini kontrol et.

STORY dokümanı burada muhtemelen stale bir bölüm içeriyor.

Kod ile dokümanı senkronize et.

---

# IMPLEMENTATION ORDER

Şu sırayla ilerle:

1. Current code/state verification.
2. Remaining technical bugs.
3. `cata13`–`cata25` design.
4. Deep Catacombs creature stats/populations.
5. Key/locked-room system.
6. Catacombs side quests.
7. Optional minibosses.
8. Main Catacombs progression.
9. Dein clue chain.
10. Catacombs climax.
11. Yamato return scene.
12. Village reactions.
13. Post-Catacombs side quests.
14. Dein investigation chapter.
15. Eastern Expedition preparation.
16. Southern Forest sector debt.
17. Marketplace restoration if appropriate.
18. Localization.
19. STORY.md / STORY.TR.md update.

---

# BEFORE CODING

Önce kısa ama somut bir implementation design çıkar:

## A. CATACOMBS ROOM PLAN

Şu formatta:

```text
cata13 — purpose
cata14 — purpose
cata15 — purpose
...
cata25 — purpose
```

Her oda için:

- combat?
- enemy?
- clue?
- key?
- side quest?
- loot?
- connection?

belirt.

## B. SIDE QUEST TABLE

Her Catacombs side quest için:

- ID
- name
- trigger
- objective
- choice
- reward
- flags
- later consequence

## C. KEY MAP

Her mevcut key için:

```text
item ID
found at
opens
mandatory/optional
reward
```

## D. MAIN QUEST GRAPH

Ana story dependency graph.

## E. POST-CATACOMBS FLOW

Catacombs tamamlandıktan sonra oyuncunun:

**ne yaptığı → nereye gittiği → kiminle konuştuğu → hangi quest'in açıldığı**

net olsun.

---

# THEN IMPLEMENT

Bu planı çıkardıktan sonra ayrıca onay bekleme.

Repository'nin mevcut architecture ve conventions'ına uygun şekilde implementation'a devam et.

Yeni sistem icat etmek yerine mevcut:

- `giveQst`
- quest state
- flags
- choices
- scene callbacks
- `area_init`
- sectors
- scout system
- creature drops
- locale system

üzerinden ilerle.

---

# COMPLETION CRITERIA

Bu çalışma tamamlandığında aşağıdakilerin hepsi doğru olmalı:

- `cata13`–`cata25` boş değil.
- Deep Catacombs'un kendi encounter identity'si var.
- En az 6 anlamlı Catacombs side story/optional objective var.
- Existing keys'in çoğu gerçek kullanım alanına sahip.
- Catacombs'ta optional content bulunuyor.
- En az 2 miniboss/major optional encounter var.
- Catacombs climax'i var.
- Dein konusunda gerçek fakat tamamlanmamış bir clue elde ediliyor.
- Oyuncu Catacombs sonrası Yamato'ya geri dönüyor.
- Yamato'nun character arc'ı ilerliyor.
- Village Catacombs keşfine tepki veriyor.
- Catacombs sonrası yeni side content açılıyor.
- Eastern Expedition artık soyut bir vaat değil, aktif quest chain'e dönüşüyor.
- Hikâye Catacombs çıkışında tekrar durmuyor.
- STORY.md ve STORY.TR.md yeni endpoint'i doğru şekilde gösteriyor.

---

# MOST IMPORTANT RULE

Catacombs'u:

> 26 odalık uzun bir monster corridor

haline getirme.

Oyuncu buradan çıktığında:

- yeni bir şey öğrenmiş,
- birkaç insanın hikâyesine dokunmuş,
- optional sırlar keşfetmiş,
- eski item'ların gerçek kullanımını görmüş,
- Yamato ile ilişkisini ilerletmiş,
- Dein hakkında somut bir iz bulmuş,
- doğuya gitmek için gerçek bir sebep kazanmış

olmalı.

Catacombs'un bitişi bir **dungeon sonu değil, oyunun daha büyük hikâyesinin kapısı** olmalı.
