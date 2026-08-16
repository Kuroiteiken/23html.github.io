# ROLE

Bu projede kıdemli bir **game narrative designer + quest designer + JavaScript developer** olarak çalış.

Görevin mevcut oyunun hikâyesini yeniden yazmak değil, **mevcut hikâyenin bittiği noktadan organik biçimde devam ettirmek**, açık bırakılmış hikâye bağlarını geliştirmek ve repository içerisinde hâlihazırda bulunan ancak erişilemeyen içerikleri hikâyeye dahil etmektir.

Yeni hikâye oluştururken mevcut oyunun:

- karakterlerini,
- dünyasını,
- lore'unu,
- quest geçmişini,
- NPC ilişkilerini,
- item açıklamalarını,
- dialogue hook'larını,
- yarım kalmış bölgelerini

**canon** kabul et.

Yeni içerik mevcut evrenin doğal devamı gibi hissettirmeli.

---

# SOURCE OF TRUTH

Öncelikle repository içindeki mevcut kodu ve özellikle hikâye durumunu anlatan:

`STORY.md`

ve varsa:

`STORY.TR.md`

dosyalarını incele.

Ardından hikâyeyle ilişkili kaynakları tara:

- `js/data/quests.js`
- `js/world/areas.js`
- `js/world/locations.js`
- sector tanımları
- creature/enemy verileri
- item verileri
- title sistemi
- locale dosyaları
- Yamato diyalogları
- Hunter's Lodge
- Southern Forest
- Catacombs
- basement
- marketplace
- mevcut NPC tanımları

Kodda ve mevcut metinlerde bulunan gerçek içerik **canon** kabul edilir.

Yeni bir hikâye yazmadan önce mevcut bağlantıları ve unresolved hook'ları çıkar.

---

# TEMEL TASARIM PRENSİBİ

Hikâyeyi sıfırdan başka bir yöne götürme.

Öncelik sırası:

1. Mevcut hikâye bağlarını devam ettir.
2. Mevcut fakat kullanılmayan içerikleri bağla.
3. Mevcut karakterleri derinleştir.
4. Mevcut item/enemy/area/sector sistemlerini kullan.
5. Açık bırakılmış olaylara payoff ver.
6. Ancak gerçekten gerekiyorsa yeni karakter, bölge veya sistem oluştur.

Yeni ana hikâye, oyuncunun şimdiye kadar yaşadığı olayların sonuçlarından doğmalı.

---

# MEVCUT HİKÂYENİN BİTTİĞİ NOKTA

Oyuncu şu ana kadar:

1. Village Gate'i geçmiştir.
2. Western Woods'a ulaşmıştır.
3. Hunter's Lodge ile tanışmıştır.
4. Yamato'dan görevler almıştır.
5. `Firewood Gathering` görevini tamamlamıştır.
6. `First Hunt` görevini tamamlamıştır.
7. Lodge ilerlemesi sonucunda yeni ekipmanlar edinmiştir.
8. Guarding Duty sistemi açılmıştır.
9. Dojo/Golem ilerlemesini tamamlayarak gerekli combat yeterliliğine ulaşmıştır.
10. `Monster Eradication` görevini açmıştır.
11. Southern Forest'a ulaşmıştır.
12. 35 wolf öldürmüştür.
13. Görevi Yamato'ya teslim etmiştir.

Yamato'nun son önemli sözü:

> "Expect to be contacted later for further monster subjugation."

Ancak mevcut oyunda bu temas gerçekleşmemektedir.

**Hikâye tam olarak buradan devam edecek.**

---

# AÇIK HİKÂYE BAĞLARI

Repository'yi inceleyerek tüm unresolved story thread'leri doğrula.

Özellikle aşağıdaki mevcut bağları ana hikâyenin temel parçaları olarak değerlendir:

## 1. Wolf Pack Leader

Yamato daha önce öldürülen kurtların ardından daha güçlü bir yaratığın:

- sürünün lideri olabileceğini,
- altındaki kurtların ölümüne öfkelenmiş olabileceğini,
- meselenin hızlı şekilde çözülmesi gerektiğini

belirtmiştir.

Fakat bu olayın devamı yoktur.

Pack leader hikâyesine gerçek bir payoff oluştur.

Ancak boss'u sadece "daha güçlü wolf" yapma.

Bu olay ileride ortaya çıkacak daha büyük problemin ilk belirtisi olabilir.

Örneğin kurtlar yalnızca saldırganlaşmamış olabilir.

**Bir şey onları doğal bölgelerinden çıkmaya zorluyor olabilir.**

---

## 2. Yamato'nun sözü

Yamato'nun:

> "Expect to be contacted later for further monster subjugation."

sözü mutlaka karşılığını bulmalı.

Monster Eradication tamamlandıktan bir süre sonra oyuncu yeniden çağrılmalı.

Bu yeni ana quest chain'in başlangıç noktası olabilir.

Oyuncu artık başlangıç seviyesinde bir hunter değildir.

Yamato'nun oyuncuya yaklaşımı bunu yansıtmalıdır.

---

## 3. Village Altındaki Sesler

Mevcut basement/shopkeeper diyaloglarında insanların evlerinin altından bir şeylerin kazdığına dair bir hikâye bağı bulunmaktadır.

Bu hook'u kullan.

Başlangıçta olay küçük belirtiler halinde ortaya çıksın:

- geceleri zeminin altından sesler,
- cellar duvarlarında çatlaklar,
- kaybolan eşyalar,
- garip titreşimler,
- bazı evlerin altından gelen kokular,
- marketplace çevresindeki söylentiler.

İlk başta bunun monster activity olup olmadığı bile kesin olmasın.

---

## 4. Catacombs

Repository içerisinde zaten büyük ölçüde hazırlanmış bir Catacombs bölgesi bulunmaktadır.

Yaklaşık 26 scene bulunmaktadır.

Bunu atlama ve yerine yeni dungeon üretme.

**Var olan Catacombs'u ana hikâyeye bağla.**

Oyuncunun kendi basement'ı veya village altındaki başka doğal bir bağlantı Catacombs girişine dönüşebilir.

Catacombs yalnızca combat alanı değil, aynı zamanda environmental storytelling bölgesi olmalıdır.

---

## 5. Undead

Repository içerisinde tanımlı fakat aktif olarak kullanılmayan undead creature'ları incele.

Catacombs için uygun olan mevcut yaratıkları kullan.

Yeni creature oluşturmadan önce mevcut bestiary'deki seçenekleri değerlendir.

---

## 6. Dein

Yamato'nun kayıp deputy chief'i Dein'e ait mevcut hikâye zincirini ayrıntılı incele.

Oyuncunun Dein'e ait işaretli bir sword bulması ve Yamato'nun araştırma sözü vermesi önemli bir unresolved hook'tur.

Dein'i hemen ortaya çıkarma.

Bu hikâyeyi uzun vadeli bir mystery arc olarak geliştir.

Oyuncu zaman içinde:

- Dein'e ait izler,
- eski hunter işaretleri,
- terk edilmiş kamp alanları,
- kırılmış ekipman,
- tanık anlatıları,
- çelişkili bilgiler,
- yanlış ipuçları

bulabilir.

Bazı ipuçları onun öldüğünü düşündürürken bazıları hâlâ hayatta olabileceğine işaret edebilir.

---

## 7. Eastern Expedition

Yamato'nun mevcut diyaloglarından biri:

> "We're going east soon."

şeklinde gelecekteki bir seferi işaret etmektedir.

Bu söz de payoff almalıdır.

Ancak East Region'a hemen geçme.

Önce mevcut unfinished içerikleri kullan.

Doğu seferi bir sonraki büyük chapter'ın başlangıcı olabilir.

---

# ÖNERİLEN ANA HİKÂYE YAPISI

Repository incelemesinden sonra isimleri ve detayları değiştirebilirsin fakat genel progression şu yapıda ilerleyebilir:

### CHAPTER I — After the Hunt

Monster Eradication sonrası gelişmeler.

### CHAPTER II — The Pack Leader

Southern Forest'taki anomalilerin araştırılması.

### CHAPTER III — Beneath the Village

Village altındaki olayların büyümesi.

### CHAPTER IV — The Catacombs

Yeraltındaki eski yapının keşfi.

### CHAPTER V — Echoes of Dein

Catacombs ve Dein arasındaki olası bağlantı.

### CHAPTER VI — The Eastern Trail

İpuçlarının doğuya uzanması.

### CHAPTER VII — The Eastern Expedition

Yamato'nun daha önce bahsettiği doğu seferinin gerçekten başlaması.

Bu yapıyı kesin kabul etme.

Repository'deki lore daha iyi bir progression sağlıyorsa onu tercih et.

---

# YAN HİKÂYELER

Ana hikâyenin yanında dünya yaşayan bir yer gibi hissettirmeli.

En az **8 güçlü side quest / side story** tasarla.

Yan görevlerin tamamı grind görevi olmamalı.

Şu türleri karıştır:

- investigation
- hunt
- exploration
- NPC drama
- moral choice
- mystery
- retrieval
- survival
- dungeon event
- village problem
- hunter story
- marketplace incident

Her side quest için:

- Quest adı
- Başlangıç NPC'si
- Hook
- Objective
- Twist
- Reward
- Ana hikâyeyle ilişkisi
- Daha sonra kullanılabilecek story hook

belirt.

Bazı yan görevler ana hikâyeye bağlanabilir.

Bazıları tamamen bağımsız olup yalnızca worldbuilding yapabilir.

---

# WORLD REACTIVITY

Oyuncunun yaptığı şeyler dünyada iz bırakmalıdır.

Örneğin 35 wolf öldürdüyse ve mevcut `Wolf Slayer` title'ı varsa bunu gerçekten grant et.

NPC diyaloglarında oyuncunun ününe küçük referanslar eklenebilir.

Ancak herkes oyuncuyu övmemeli.

Bazı NPC'ler:

- abartabilir,
- şüphe edebilir,
- kıskanabilir,
- alay edebilir,
- oyuncudan çekinebilir.

Böylece village yaşayan bir yer gibi hissetsin.

---

# YAMATO

Yamato ana hikâyenin en önemli recurring karakterlerinden biri olarak kalmalı.

Fakat yalnızca quest giver olmaktan çıkmalı.

Karakter gelişimi oluştur.

Başlangıç:

`rookie`

↓

`useful hunter`

↓

`trusted hunter`

↓

`someone Yamato relies on`

↓

`potential equal`

Bu geçiş level üzerinden değil olaylar ve diyaloglar üzerinden gösterilmeli.

Özellikle Dein konusu Yamato'nun normalde kontrollü karakterinin zayıf noktası olabilir.

---

# MYSTERY STRUCTURE

Ana hikâyeyi tek seferde açıklama.

Oyuncunun önüne art arda sorular koy:

1. Kurtlar neden saldırganlaştı?
2. Pack leader neden bölgesini terk etti?
3. Kurtlar neyin etkisi altındaydı?
4. Village'ın altında ne var?
5. Catacombs neden unutuldu veya kapatıldı?
6. Undead activity neden şimdi başladı?
7. Dein Catacombs'a geldi mi?
8. Dein ne arıyordu?
9. Yeraltındaki olayların Southern Forest ile bağlantısı ne?
10. Doğu neden önemli?
11. Yamato'nun eski seferlerinde ne yaşandı?

Her chapter:

**birkaç soruya cevap vermeli fakat en az bir yeni soru açmalıdır.**

---

# ÖNCE ANALİZ, SONRA IMPLEMENTATION

Doğrudan kod değiştirmeye başlama.

Önce repository'yi analiz et ve şu raporu oluştur:

## 1. CURRENT CANON

Mevcut hikâyeyi kronolojik olarak çıkar.

## 2. OPEN THREADS

Çözülmemiş tüm hikâye bağlarını listele.

## 3. UNUSED CONTENT

Hikâyeye bağlanabilecek mevcut:

- quests
- scenes
- areas
- sectors
- creatures
- items
- titles
- NPCs
- dialogue hooks
- mechanics

listele.

## 4. PROPOSED MAIN STORY

Yeni ana hikâyeyi chapter bazında tasarla.

Her chapter için:

- başlangıç
- ana olay
- conflict
- reveal
- climax
- sonraki chapter hook

ver.

## 5. SIDE STORIES

En az 8 yan hikâye oluştur.

## 6. QUEST GRAPH

Ana ve yan görevlerin dependency yapısını ASCII graph olarak göster.

## 7. EXISTING CONTENT REUSE

Hangi mevcut içeriğin nerede kullanılacağını listele.

## 8. NEW CONTENT

Gerçekten eklenmesi gereken yeni:

- scenes
- NPCs
- quests
- enemies
- items
- dialogue

varsa ayrı göster.

## 9. CODE CHANGE PLAN

Dosya bazında yapılacak değişiklikleri çıkar.

---

# IMPLEMENTATION

Analiz tamamlandıktan sonra ayrıca izin beklemeden makul kararlarla implementasyona geç.

Öncelik:

1. story-blocking bug'ları düzelt
2. unreachable mevcut content'i bağla
3. mevcut story hook'lara payoff ver
4. ana quest continuation oluştur
5. side quest'leri bağla
6. world reaction ekle
7. localization ekle
8. documentation güncelle

---

# LOCALIZATION

Tüm player-facing text:

`locales/en.json`

ve

`locales/tr.json`

içinde tutulmalı.

Türkçe metin doğal Türkçe yazılmalı.

İngilizce ve Türkçe aynı olay ve karakter niyetini taşımalı ancak kelime kelime çeviri olmak zorunda değildir.

---

# STORY DOCUMENTATION

Her major implementation sonrasında:

`STORY.md`

ve varsa

`STORY.TR.md`

güncellenecek.

Özellikle şunlar her zaman doğru kalmalı:

- current story endpoint
- reachable quest chain
- unresolved threads
- connected content
- future hooks
- dependency graph

---

# SON KURAL

Amaç dünyayı gereksiz yere büyütmek değil.

Amaç:

**mevcut dünyanın içinde zaten bulunan parçaları birbirine bağlayarak daha derin, devam eden ve yaşayan bir RPG hikâyesi oluşturmak.**

Yeni içerik üretmeden önce her zaman repository'de bunun için hazırlanmış bir şey olup olmadığını kontrol et.
