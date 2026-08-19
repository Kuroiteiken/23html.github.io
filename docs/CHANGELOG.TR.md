# Repository değişiklik günlüğü

[English](CHANGELOG.md)

Bu dosya kod tabanı, mimari, araç, dokümantasyon ve deployment değişikliklerini
kaydeder. Oyuncuya dönük oyun içeriği ve sürüm notları
`changelog/changelog.html` dosyasında tutulur.

## [Yayınlanmamış]

### v478 — sessizce bozulamayan statlandırma

- `chss.smith`'e bir satıcı verildi. Hiç yoktu: oyuncunun sahip olduğu şeyi onarıp
  keskinleştiriyor, hiçbir şey satmıyordu; oysa oyundaki on yedi kalkanın on ikisinin
  hiçbir kaynağı yoktu — ne satıcı, ne düşürme, ne tarif. Dört hafif kalkan artı bir
  heater, bir eldiven, bir başlık, `item.coal1` ve `item.cq` artık tezgâhında; fiyatlar
  bakkalın üstünde değil onunla aynı seviyede. `item.coal1` özellikle anılmaya değer:
  kendi tarifi uzun süre yandığını söylerken ve şömine onu yakıt olarak zaten kabul
  ederken, oyunda hiçbir kaynağı olmayan tek eşyaydı.
- Satıcı durumu konumsal değil anahtarla kaydediliyor (`a10[obj]`) ve geri yükleme
  `a10[obj] && a10[obj].stock` ile korumalı; yani yeni bir satıcı mevcut bir kaydı
  bozamıyor, ve `onDayPass` `for (const vnd in vendor)` üzerinde döndüğü için kayıt
  adımı olmadan stok yeniliyor. İkisi de eklemeden önce doğrulandı.
- `dfl` demirciye bilinçli olarak konmadı. Dört satıcı onu kuruyor ve oyunda hiçbir yer
  okumuyor; çiftin okuyucusu olan tek üyesi `repsc`. Deseni taklit etmek için ölü alan
  kopyalamak, ölü alanların yayılma biçimi.
- Tarayıcı takımı artık her satıcının stoğunu yenileyip her satırın sonlu ve pozitif bir
  fiyata çözüldüğünü doğruluyor. Vendor yapıcısı, enflasyon çarpanı olmadığı için her
  fiyatının NaN'a çözüldüğü çocuk tüccar hakkında zaten bir yorum taşıyor — ve NaN
  karşılaştırmaları false olduğu için parayı yetirme kontrolü geçiyor ve ödeme oyuncunun
  kesesini NaN yapıyordu. Kontrol yalnızca yeni satıcıyı değil hepsini kapsıyor.
- `docs/REGIONS.md` ve `docs/REGIONS.TR.md` eklendi: kırsal bölge ile madenin tasarım
  sözleşmesi; her adımı açan ölçütler, oyuncunun ne alması gerektiği ve her yayın neyle
  kapandığı. İki öneri dosyasından da bağlandı.

- `creature.lrck`'ye eksik on bir alanı verildi ve oyuna `chss.cata17`, yani Taş
  Levha'da bir yalancı duvar olarak kondu; `sector.cata1.data.gets[3]`'e bağlı — yani
  oyuncunun eline bir keski sapı veren keşif bulgusuna. `area.lrck1` (id 125) yeni ve en
  sona eklendi, çünkü `save()` alan boyutlarını `for...in` sırasıyla yazıyor ve
  `load()` onları konumsal okuyor.
- `creature.lrck.battle_ai`'nin false döndürmesi korundu. Kendi tarifi dövüş
  kabiliyetinin sıfıra yakın olduğunu ve yolları duvarı taklit ederek kapattığını
  söylüyor; yani tur almaması gözden kaçma değil, yazılmış niyet. Bozuk olan
  `stat_p[0]`'ı 1.5 iken `hp_r = 9000` olmasıydı; o koridorun bandında bu, bedelsiz ve
  ganimetsiz binlerce tur demek. Artık bir set parçası: 1400 can, bir yapının büyümesi
  ve `ctype = 2`.
- `cls`'si ters çevrildi. Yazılı [90, 120, 60] bir kayanın çekiçleri mızraklardan daha
  iyi savuşturmasını sağlıyordu; [10, 70, 90] ise balyozun geçtiği, keskin kenarın
  sıyırıp geçtiği ve ucun açacak bir şey bulamadığı anlamına geliyor. Yanlış silahı olan
  oyuncu durdurulmuyor, yavaşlatılıyor; çünkü en-az-inen-hasar tabanı her vuruşun bir
  şey ifade etmesini garanti ediyor.
- `toolMarks` (id 26, ipucu) ve `whoseHand` (id 27, soru) eklendi; ikisi de Bölüm IV.
  Bilinçli olarak `threeAndAcross` üzerine yazılmadılar: o, iyi bir bıçakla kesilmiş bir
  avcı rota işareti; bunlar ise savurmaya yer olmayan bir darlıkta tek elle atılmış keski
  darbeleri. İki imza, iki el, ve tarayıcı probe'u metinlerin tek bir şeye çökmediğini
  doğruluyor.
- `__test-stone-plate.html` probe'u eklendi: kapı, levha, dövüş, çekilme seçeneği, geçit
  ve iki lore girdisi; ayrıca yeni alanın kayıtta son olduğu ve `area.clg`'nin yuvasını
  koruduğu doğrulanıyor. Sonuncusu ilk seferde başarısız oldu — `clg` altıncı değil
  yedinci tanım — ki doğrulamanın varlık sebebi tam olarak bu.

- `npm run check` zincirine `scripts/check-flags.js` eklendi. Koşul olarak okunup
  hiçbir yerde yazılmayan her `global.flags` girdisinde hata veriyor. Başlangıç durumu
  temiz, yani muafiyet gerekmiyor: listenin yeniden büyümesini engellemek için var.
- Bodrumdaki "çevreni incele" seçeneğindeki `if (!global.flags.bsmntchck)` kapısı
  kaldırıldı. Bu deponun tarihinde o bayrak hiç yazılmamış, yani dal her zaman
  alınıyordu — doğru olduğu için değil, şans eseri. Oyunun tamamındaki tek
  `giveAction(act.scout)` çağrısı o dalın içinde; yani bayrağı ilk incelemede kurmak,
  depo sandığını alıp çıkan her oyuncuyu kalıcı olarak mahsur bırakırdı: araştır eylemi
  yok, dolayısıyla pazar keşif tablosu ve katakomp buluntuları da yok. Dalın içindeki
  iki tek seferlik seçenek kendi bayraklarını taşıyor; bir-kerelik davranışın yeri de
  orası. Davranış değişmiyor; bir tuzak kaldırılıyor.
- `chss.bsmnthm1.data.gets`, üç keşif girdisiyle eşleşecek şekilde üç yuva bildiriyor.
  Üçüncüsü, iki yuvayla bildirilmiş bir diziye `gets[2]` yazıyordu. Çalışıyordu —
  eksik indeks undefined okunuyor, hem `canScout` hem `scoutGeneric` `!== true` ile
  test ediyor ve bu `data` konumsal bir bölüm değil JSON nesnesi olarak kaydediliyor —
  ama `sector.vmain1` bir yuva aşağıda aynı kusuru taşıyordu, o yüzden bildirimin
  kodun yaptığını söylemesi değerli.
- `stripComments`, `scripts/check-refs.js`'ten `scripts/strip-comments.js`'e çıkarıldı
  ve yeni bayrak kontrolüyle paylaşıldı; böylece ikisi neyin canlı kod saydığı
  konusunda ayrışamıyor.
- Planın teknik düzeltmeler listesindeki üçüncü madde doğrulandı: `sector.cata1`'in
  keşif tablosu dört girdi ve `onScout` ile canlı, ve `docs/STORY.md`'nin bu konuda
  yazdığı doğru. Değişiklik gerekmedi.

- `area.clg`, yani nemli bodrum, Bölüm III'ün kayıp keskiler ipinin yakın ucu olarak
  oyuna bağlandı; pazardan, çocuğun anlattıkları okunduktan sonra ulaşılıyor.
  `quest.chsls1` (id 10) ve `chss.clgmn` (id 173) yeni; alanın kendisi, popülasyonu ve
  bitiş işleyicisi dışında ellenmedi, çünkü zaten bitmiş içerikti. Yeni alan
  tanımlanmadığı için kayıt biçimindeki konumsal alan-boyutu yuvaları değişmedi.
- `area.clg.pop` düzeltildi: iki girdinin hiçbiri `c` bildirmiyordu, bu yüzden
  `z_bake` undefined biriktirip `popc`'yi `[[0, NaN], [NaN, 1]]` olarak pişiriyordu.
  `area_init` içindeki her NaN karşılaştırması false olduğu için hiçbir dal
  eşleşemezdi — hiçbir şey doğmaz, `global.flags.btl` hiç kurulmaz ve iniş sessizce
  düşerdi. Alan hiç erişilebilir olmadığı için bu hiç görünmedi; ama olduğu anda
  oyuncunun karşılaştığı ilk şey olurdu.
- İnişin uzunluğu alanda yazılı olmak yerine görev kabul edilirken belirleniyor, çünkü
  alan boyutları konumsal olarak geri yükleniyor ve mevcut her kayıt o yuvada zaten
  yazılı 33'ü taşıyor.
- `towardTheWell` eklendi (lore id 25, Bölüm III ipucu). Bodruma inmenin amacı bu:
  yaşlı adamın saydıkları, marangozun bodrumu ve bulanık kuyu dört nokta ediyor ve
  bunları birleştirmek oyuncuya bırakılıyor.
- `__test-cellar-story.html` probe'u ve yan hikayeyi baştan sona oynayan bir tarayıcı
  kontrolü eklendi — lore kapısı, çalınan lambanın yerine geçen karanlık, iniş, duvar
  ve teslim — ayrıca hiçbir alanın `popc`'ye NaN pişirmediğine dair bir doğrulama.
  Kaynağın doğru göründüğüne güvenmek yerine, popülasyon düzeltmesi geri alınıp
  probe'un `noNaNWeights,fightStarts,rightCreature` adlarını verdiği doğrulandı.

- `npm run check` içine `scripts/check-combat.js` eklendi. Orijinal oyunun getirdiği
  yaratıklardan iki bütçe ölçüyor -- seviye başına hasar azaltma ve seviye başına
  saldırı -- ve sonradan eklenmiş, bunlardan birini %15 payla aşan her yaratıkta hata
  veriyor. Oyuncunun becerilerini, ekipmanını ya da ünvanlarını modellemiyor; hiçbir
  statik kontrol bunları dürüstçe belirleyemez. Yayınlanmış ve oynanabilir içeriğe
  dayanması, bir hatanın "bu yanlış statlanmış" demesini sağlıyor, "model karamsar"
  demesini değil. İki bütçe de şu an batı ormanındaki 7. seviye `wolf1`'den çıkıyor:
  16,0 ve 13,4.
- Bütçe ölçümü `area.tst` alanını ve 4'ün altındaki seviyeleri dışarıda bırakıyor.
  İlk deneme ikisini de içeriyordu ve 1. seviye bir iskeletin belirlediği 39,1'lik bir
  saldırı tavanı üretiyordu; bu da hiçbir şeyi yakalamıyordu.
- `npm run check` içine `scripts/check-refs.js` eklendi. Verme çağrılarına geçen her
  kayıt referansını -- `giveItem`, `giveQuest`, `smove`, `area_init` ve beş tanesi
  daha -- o kayıtların tanımladığı anahtarlara karşı çözüyor. Hatalı bir referans
  diyalog tıklama işleyicisinin içinde patlıyor, yani tek belirti sahnenin hiç
  ilerlememesi ve seçeneğin tekrar tıklanabilmesi oluyor; dojo ödülünün aynı kalkanı
  sınırsız vermesi tam böyle oldu. Kontrol yorumları küçük bir durum makinesiyle
  ayıklıyor, çünkü bu kaynaklarda yoruma alınmış sahneler her yerde ve referansları
  canlı değil.
- Paketin kaynak listesi `scripts/sources.js` dosyasına taşındı; `scripts/build.js` ve
  kontroller artık tek kopyayı paylaşıyor.
- Mevcut bir karakteri yeni seviye eşiklerinin borçlu olduğu HIZ ve ŞANS'a tamamlayan
  bir v478 kayıt göçü eklendi. "Toplamı ekle" değil "toplama tamamla" olarak yazıldı;
  yani iki kez çalışsa da katlamıyor ve ekipmanla öne geçmiş bir karakteri geriye
  çekmiyor. `migrateSave` artık yalnızca ayrıştırılmış globalleri ve `you.mods`'u değil,
  `you` nesnesinin kendisini de alıyor.
- `callback.onLevel`, callback kaydı yazıldığından beri ilk abonesine kavuştu. Ayrıca
  kaç seviye kazanıldığını taşıyor: 1. seviye bir yaratık `lvlup` üzerinden `t === 0`
  ile üretiliyor ve bir şey veren abonenin bunu gerçek bir seviye atlamadan ayırt
  etmesi gerekiyor.
- Bir beceriye eklenen seviye eşikleri, seviye sırasına sokulmak yerine `mlstn`
  dizisinin sonuna ekleniyor. `save()` verilme bayraklarını
  `a6[obj].mst[m] = mlstn[m].g` olarak konumsal yazıyor; araya ekleme sonrasındaki her
  bayrağı kaydırır ve oyuncunun zaten sahip olduğu eşikleri tekrar tetikler.
- Popülasyon tavanları artık getter olabiliyor. `mon_gen` bir yaratık üretirken
  `lvlmin` ve `lvlmax` değerlerini canlı popülasyon girdisinden okuyor ve `z_bake`
  yalnızca doğma ağırlıklarını önceden hesaplıyor; yani bir bant ikisine de dokunmadan
  oyuncuyu takip edebiliyor.
- `docs/AGENTS.md` ve Türkçe eşi yaratık statlandırma kuralını kazandı ve bir çelişkiyi
  kaybetti: `perk` terimini "yetenek" olarak çevirmeyi söyleyen satır, on beş satır
  aşağıda "Avantaj olarak çevir, asla Yetenek olmasın" diyen satırın üzerindeydi.
- Seviye eşiği kazanımları ve konumsal sıralamaları, silah ustalığı verilme yolları ve
  yetenekleri, kalkanın hasar azaltma terimi, dünya seviye bantları ve ölçeklenmemesi
  gereken sabit karşılaşma, satış değerlemesi ile alış tarafının altında kalma sınırı,
  ve hiçbir kalkanın `str = 0` bırakılmaması için regresyon testleri eklendi. Kayıt
  formatı davranış testleri artık `levelGrants` ve `levelGrantTotal` tanımlarını
  `js/systems/simulation.js` içinden çıkarıyor; böylece göç gerçek sayılarla sınanıyor.
- `Vendor()` fiyat çarpanına varsayılan veriyor. Bir satıcı hiç atamıyordu ve varsayılan
  yoktu; o dükkândaki her fiyat `NaN` çözülüyor, `NaN` karşılaştırması false döndüğü
  için "param yetiyor mu" kontrolü geçiyor ve harcama oyuncunun kesesini `NaN`
  yapıyordu.
- Kaydet çubuğu artık kendisine yer ayırmak için oyunu küçültmüyor; bunu sabitleyen
  tarayıcı senaryosu da asıl önemli olanı doğruluyor -- çubuk oyunun alt sırasını
  kapatmamalı -- bir piksel toleransla, çünkü ikisi buluşmak üzere ve gövde
  yakınlaştırmasından gelen alt-piksel yuvarlaması çakışma diye okunmamalı.
- `docs/PROPOSALS.TR.md` artık sahibinin bekleyen bütün taleplerini işe başlamadan önce
  taşıyor, ve bu çalışmanın bilinçli olarak almadığı denge kararını da: zırhın sınıf
  direnci hasar azaltma teriminde zıt işaretlerle iki kez sayılıyor ve kalkan yarısıyla
  birlikte düzeltmek kalkansız bir oyuncunun aldığı hasarı 36,9'dan 9,9'a indiriyor.
- Pages dağıtımı yalnızca Markdown içeren push'ları atlıyor. `scripts/build-site.js`
  `index.html` dosyasını, üç kök varlığı ve `changelog/`, `css/`, `icons/`, `locales/`
  dizinlerini kopyalıyor -- hiçbir `.md` dosyası `dist/` içine girmiyor, dolayısıyla bir
  dokümantasyon push'u bayt bayt aynı siteyi yeniden kuruyor, denetliyor ve yeniden
  dağıtıyordu. `paths-ignore` hem `**.md` hem `**.MD` kalıbını listeliyor, çünkü yol
  süzgeçleri büyük/küçük harfe duyarlı ve `docs/` içinde uzantısı büyük harfle yazılmış
  iki dosya duruyor. `workflow_dispatch` değişmedi; dağıtım hâlâ elle tetiklenebilir.
- `docs/refactorplan.md` eklendi: deponun ölçüme dayalı bir refactor incelemesi. İlk
  bulgusu, `scripts/check-combat.js` dosyasının `dmg_calc` çağırmak yerine hasar
  formülünü yeniden yazdığı -- yani bu yönergelerin kritik ilan ettiği denetimin,
  oyundan sessizce ayrışabilecek bir kopyayı doğruladığı.

- `tests/harness.js` gerçek paketi bir Node `vm` bağlamına yükleyip global kapsamı
  döndürüyor; böylece bir denetim kaynağın nasıl göründüğünü değil, oyunun ne
  yaptığını sorabiliyor. Maliyeti 57 ms ve oyun başlamıyor: `bootstrap.js`
  `document.readyState` değerini "loading" görüp `load` dinleyicisini kaydediyor ve
  orada duruyor, dolayısıyla registry'ler kuruluyor ama `load()`, tik ve kayıt geri
  yüklemesi çalışmıyor. Belgelediği tek tuzak, bulunması en pahalı olanı: Node'un
  yerleşiklerini (`Math`, `Date`, `Number`) bağlama geçirmek bir kolaylık değil,
  hatanın kendisi -- bir `vm` realm'ının kendi intrinsic'leri var ve paket içinde
  üretilen bir sayı `a[0].constructor === Number` karşılaştırmasında düşüyor.
  `js/utils/random.js`'teki Mersenne Twister tam da buna dallanıyor ve yığın bitene
  kadar `setSeed`'e özyineleniyor.
- `scripts/check-combat.js` artık hasar formülünü yeniden yazmıyor. Kopya çoktan
  oyundan ayrışmıştı: `dmg_calc` bir vuruşu salınımın bir oranında tabanlıyor ve
  silah ustalığının sınıf direncini delmesine izin veriyor, kopya ikisini de
  bilmiyordu -- yani ajan yönergelerinin kritik ilan ettiği denetim, oyunun
  kullanmayı bıraktığı bir formülü doğruluyor ve bunu yeşil yanarak yapıyordu, çünkü
  karşılaştırmanın iki yarısı da aynı eski aritmetiği paylaşıyordu. Hasar azaltma
  terimi artık gerçek `dmg_calc`'tan okunuyor: yaratığa inen bir vuruş ile aynı
  yaratığın zırhı sökülmüş hâline inen aynı vuruş arasındaki fark. İki çağrı yalnızca
  zırhta ayrıldığı için fark tam olarak çıkarılan terimdir ve bir oyuncu modeline
  ihtiyaç kalmaz: yaratığa ait olmayan her şey birbirini götürür. Kalibrasyon
  değişmedi ve kanıt da bu -- eski denetim `wolf1` seviye 7'de seviye başına 16.0
  hasar azaltma ve 18.4 bütçe ölçüyordu, yenisi de aynısını ölçüyor. Saldırı terimi
  13.4'ten 14.7'ye çıktı, çünkü eskisi kalkan katkısını hiç saymıyordu.
- Bu listeyi gerçek registry'ye karşı doğrulamak, `ORIGINAL` içindeki on yedi addan
  beşinin hiçbir yaratığa karşılık gelmediğini hemen ortaya çıkardı -- `rat1`, `rat2`,
  `bat1`, `zmb1`, `gho1` -- altıncısı olan `skl1` ise test tezgâhının iskeleti, yanlış
  yazılmış. Hiçbir şeyle eşleşmeyen bir `Set` girdisi hiçbir şeyi muaf tutmaz ve bunu
  sessizce yapar, dolayısıyla bu adlar hiç iş görmüyordu. `skl1` düzeltildi; kalanlar
  tahmin edilmek yerine uyarı olarak bildiriliyor, çünkü eskimiş bir adın hangi
  yaratığı kastettiği bir içerik kararı. Denetim ayrıca artık 15 değil 20 eklenen
  yaratığı kapsıyor; fazlası, düzenli ifadenin göremedikleri.
- `espree` `devDependencies` altında bildirildi. Dört test dosyası onu `require`
  ediyor ve yalnızca eslint'in geçişli bağımlılığı olarak bulunuyordu; onu bırakan bir
  eslint sürümü ya da daha katı bir paket yöneticisiyle kurulum, test paketinin üçte
  birini ve onunla birlikte dağıtımı düşürürdü.
- Pages workflow'u yalnızca Markdown içeren push'ları atlıyor ve sınırlandırıldı.
  `paths-ignore` hem `**.md` hem `**.MD` kalıbını listeliyor, çünkü yol süzgeçleri
  büyük/küçük harfe duyarlı; build ve deploy işleri `timeout-minutes` taşıyor, böylece
  takılan bir başsız Chrome altı saat runner yakmak yerine dakikalar içinde bitiyor;
  ve checkout artık kimlik bilgisi saklamıyor, çünkü burada hiçbir şey depoya geri
  yazmıyor.
- Artık var olmayan `docs/ROADMAP.md` dosyasına yapılan dört referans kaldırıldı.
- `docs/refactorplan.md` eklendi (ölçüme dayalı bir refactor incelemesi) ve
  `docs/status.md`, ikisini birlikte okuyan bir oturum devir belgesi olarak yeniden
  yazıldı.

- Savaş arayüzün dışına taşındı. `js/systems/combat.js` artık `allbuff`, `fght`,
  `attack`, `tattack`, `dmg_calc`, inen vuruş tabanını, `hit_calc`'ı ve iki silah
  aşınma yardımcısını tutuyor -- `js/ui/interface.js` içinde envanter çizimi ile
  tarif paneli arasında duran 691 satır. Ajan yönergelerinin hasar formülünü "8.000
  satırlık bir arayüz dosyasının içinde bir yerde" diye tarif etmek zorunda
  kalmasının sebebi buydu. Arayüz artık 8.013 satır.
  `dumb` ve `mf` yerinde kaldı: ikisi de yüzen bir sayı çiziyor, yani aritmetiğin ne
  kadar yanında dursalar da arayüz işi.
- `addElement` ve `empty` `js/utils/dom.js` içinde, `deepCopy` ve `copy`
  `js/utils/object.js` içinde. `js/systems/planner.js`'in dibinde, günlük planlarla
  test haritaları arasında duruyorlardı -- bütün arayüzün kendisiyle inşa edildiği
  yardımcıyı kimsenin arayacağı bir yer değil.
- İki taşıma da güvenilmedi, doğrulandı. `tests/fingerprint.js` paketin davranışını
  bir metne indiriyor -- her global fonksiyon adı, her registry'nin anahtarları, her
  eşyanın, silahın, ekipmanın ve yaratığın sayısal şekli, ve hasar yolunun yaratık,
  seviye ve silah sınıfı boyunca çıktısı -- ve her taşımadan önceki ile sonraki çıktı
  birebir aynı, 1.440 satır. Bilerek bir test değil: saklanacak bir beklenen çıktı
  yok, çünkü davranış meşru olarak değiştiğinde sayılar da değişmeli. Tek bir soruyu,
  karşılaştırarak yanıtlıyor.
- Savaş taşıması `check-game-regressions.js` içindeki beş iddiayı kırdı ve hiçbiri
  oyuncunun görebileceği bir şeye dair değildi: `js/ui/interface.js`'in metnini
  okuyorlardı ve metin taşınmıştı. Artık yeni bir `bundleSource` üzerinden paketin
  tamamına bağlılar; yanlarındaki yasaklar da öyle. Bir yasak ancak her yerde
  geçerliyse yasaktır -- tek dosyaya karşı denetlenirse yalnızca "hata bu dosyada
  değil" demiş olur -- ve bir davranış sözleşmesi, fonksiyonun şu an hangi dosyada
  durduğuna değil, programa dairdir. Sonraki taşımalar bunları kırmayacak.
- İki yerel dosya art arda değil, birlikte isteniyor. Türkçe oyuncu, Türkçe isteği
  daha yapılmadan önce İngilizce için tam bir gidiş-dönüş ödüyordu; oysa dosyaların
  hiçbiri diğerine bağlı değil. İngilizce isteğini tamamen kaldırmak ayrı bir
  değişiklik: manifest'te yerel başına bir tamlık bayrağı gerekiyor -- `check-i18n`
  bunu haklı çıkaracak pariteyi zaten kanıtlıyor olsa bile.

- Yüz seksen altı yiyecek maddesi yeme handler'ının kendi kopyasını taşımayı bıraktı.
  Artık hepsi `item.brd.use = eatUse(2);` ve `js/data/items.js` 7.639 yerine 5.437
  satır. On iki satırın 186 yere kopyalanmış olması, yemenin nasıl işlediğine dair bir
  değişikliğin 186 kez yapılması gerektiği anlamına geliyordu; birini atlamak risk
  değil, neredeyse kesinlikti.
- Sayı, incelemenin öngördüğü 221 değil 186; çünkü hiçbir şey yeniden yazılmadan önce
  şekiller espree ile envanterlendi, doygunluk satırı grep'lenerek sayılmadı. O satırı
  taşıyan otuz ayrı şekil var; ikisi 119 ve 67 madde tutuyor, kalan 35 madde ise her
  biri kendine ait bir şey yapan 28 şekle dağılmış. Onlara dokunulmadı. Dönüşüm,
  hiçbir şeye dokunmadan önce iki grubun üye sayısını doğruluyor; böylece o günden
  bu yana kaymış bir şekil, körlemesine yeniden yazılmak yerine işlemi durduruyor.
- İki büyük şekil yalnızca `this.amount--`'ın panel güncellemesi ile mesajdan önce mi
  sonra mı geldiğinde ayrılıyordu ve bu fark "muhtemelen zararsız" değil, doğrudan
  gözlemlenemez: `dom.d5_3_1.update()` yalnızca `you.sat`, `you.satmax` ve
  `you.efficiency()` okuyor, yiyeceğin geldiği yığına hiç bakmıyor; mesaj da
  `this.val` okuyor. İki yazım artık tek fonksiyon.
- `tests/fingerprint.js` artık `use` handler'larını da kapsıyor; dönüşümü "makul"
  olmaktan çıkarıp denetlenebilir yapan şey bu. Her eşyanın `use`'u sabit bir oyuncuya
  karşı çağrılıyor ve ne değiştirdiği kaydediliyor: oyuncunun sayıları, tükettiği
  yığın, arttırdığı istatistik sayaçları, enerji göstergesini yenileyip yenilemediği,
  ve log'a yazdığı satırın metni. 352 handler, sıfır hata, ve dönüşüm öncesi ile
  sonrası çıktı tam olarak bir satırda ayrılıyor: global fonksiyon listesine eklenen
  yeni `eatUse`. Log her çağrı öncesi boşaltılıyor, çünkü `msgs_max` ile sınırlı ve
  dolu bir log'da satır sayısı anlamsızlaşıyor.

- On altı tarayıcı probu artık `scripts/serve.js` içindeki şablon dizeleri değil,
  `tests/probes/` altındaki dosyalar; sunucu da 1.961 yerine 193 satır. Problar o
  dosyanın %93'üydü: her biri `index.html` okuyup tek bir şablon kuran ve onu enjekte
  eden, birbirinin neredeyse aynısı on altı blok. Artık bunu tek bir genel route
  yapıyor; adı yoldan, enjeksiyon noktasını probun kendi başlığından alıyor.
- Mesele satır sayısı değil. Şablon dizesi `node --check`'e ve eslint'e görünmez, yani
  bir probdaki yazım hatası ancak çalıştırılınca bulunabiliyordu -- ve bir prob yalnızca
  tarayıcı takımı ona ulaştığında çalışıyor. Dosya olarak hepsi diğer her şeyle birlikte
  lint'leniyor ve biçimlendiriliyor; sözdizimi hatası denetimi düşürüyor.
- Mekanik olarak çıkarmak güvenliydi, çünkü şekiller önce envanterlendi: on altı
  şablonun hiçbiri interpolasyon yapmıyor ve her blok aynı beş ifadeden oluşuyordu. Tek
  istisna `boot-screen`; oyunun hiçbir kodu çalışmadan önce neyin var olduğunu kaydetmek
  zorunda olduğu için `</body>` yerine yükleyici etiketinden önce enjekte ediliyor. Bu
  artık başlığındaki bir `// inject: before-loader` satırı ve route onu okuyor.
- Her probun üstünde yazılı gerekçe onunla birlikte taşındı. Çıkarma betiği her bloğun
  içindeki ama şablonunun dışındaki yorumları toplayıp dosyanın başına koydu; bir probun
  neyi neden ölçtüğünü açıklayan hiçbir şey geride kalmadı.
- Prob adı bir dosya yoluna giriyor, bu yüzden çözülüp sonra kontrol edilmek yerine
  küçük harf, rakam ve tireyle sınırlandırıldı. Oradaki izin verici bir kural, bu
  route'u diskteki herhangi bir dosyayı okuma yoluna çevirirdi.
- `/__test/corrupt-save` ve `/__test/unreadable-save` `serve.js` içinde kaldı. İkisi de
  `index.html` kullanmıyor -- her biri kendi küçük belgesini döndürüyor -- dolayısıyla
  ikisi de genel route'a uymuyor.

### v477 — tick, günlük ve katakomplar

- Eylem ilerleyişi `ontick()` üzerine taşındı. Koşma ve keşif kendi zamanlayıcılarıyla
  ilerliyordu; tarayıcı bunları arkaplan sekmesinde yaklaşık dakikada bire kısıyor,
  yani dünyanın geri kalanı yakalanırken onlar sessizce ilerlemeyi bırakıyordu. Bir
  eylem kendi zamanlayıcısını çalıştırmamalı; `tests/actions.test.js` bunu doğruluyor.
- Tick, sekiz saatlik birikim üst sınırı ve kare başına 12 ms bütçesi olan bir yakalama
  döngüsü olarak yeniden yazıldı; böylece arkaplan sekmesine dönmek aradaki süreyi
  dakikada bir yerine makinenin izin verdiği hızda oynatıyor. Oyuncu uzaktayken
  öldüyse kalan süre bir cesetten dövüşülmek yerine atılıyor.
- Koşmanın enerji maliyeti `mods.sdrate` üzerine biriktirilmek yerine eylemden
  türetiliyor. Başlangıçta yüklemek ve bitişte geri ödemek, bir ünvan koşu sırasında
  `mods.runerg` değerini düşürdüğünde artık bırakıyordu ve `save()` bunu kalıcı
  kılıyordu. Bir v477 göçü saklanan değeri temizliyor; artık yapısı gereği 0.
- Pakete `js/data/lore.js` eklendi ve `global.lore`, `a1` globaller nesnesinde
  saklanıyor. `learnLore()` idempotent ve günlük açılana kadar sessiz.
- `windowPanelHeight(share)` eklendi. Yükseklik tanımlamayan bir kabın içindeki yüzde
  yükseklik `auto` gibi davranıyor; mağazanın stok listesinin stokla birlikte büyüyüp
  altlığının hiçe çökmesinin sebebi buydu. Payı pencereden almak kolona bölüşecek
  belirli bir şey veriyor.
- Kayıttan ayrı tutulan bir görülen-sürüm anahtarı, `proto23.seenversion`, eklendi;
  böylece dönen bir oyuncuya Kaydet'e hiç basmasa da neyin değiştiği söyleniyor, ilk
  kez oynayana ise söylenmiyor.
- Altı yaratık taslağı statlandırılıp Ölümsüz türüne alındı, katakomplar için
  `js/world/areas.js` sonuna beş alan eklendi ve `sector.cata1` keşif tablosu
  dolduruldu. Alanlar sona ekleniyor, çünkü boyutları konumsal geri yükleniyor.
- Türkçe: tek bir adı paylaşan yedi ayrı şey çifti ve hiç erişilebilir olmadığı için
  hiç okunmamış katakomp oda başlıklarının on bir makine çevirisi hatası düzeltildi.

### v476 — kararlılık ve sözü tutma

- Ustalık seviyeleri kaydediliyor. Hiç kayda yazılmıyorlardı, bu yüzden oyuncunun
  aldığı her seviye yenilemede kayboluyordu. Yalnızca seviye saklanıyor:
  `onlevel` işlevinin verdiği stat bonusları kaydedilen toplamsal statların
  içinde zaten var, tekrar uygulamak onları ikiye katlardı. JSON olduğu ve bu
  yüzden segment sırasını bozmadan genişletilebildiği için `a1` globaller
  nesnesine eklendi.
- Ustalık ağacı tamamlandı. Gözlem ve Refleksler seviye alıyordu ama ne açıklaması
  ne `onlevel` işlevi vardı; yani seviye tüketip hiçbir şey vermiyorlardı. İkisi
  de artık kendini anlatıyor ve stat veriyor; kilitli her düğüm `????????` yerine
  koşulunu açıklıyor.
- Hiçbir şeyin gizliliğini kaldırmadığı, bu yüzden diğer dalları açan `linkfrom`
  kuralının hiç ulaşamadığı `hstr1` dalı ortaya çıkarıldı. Artık adı İkinci Nefes
  ve Beden Eğitimi ile Atletizm tam ustalaşıldığında görünüyor; kayıt geri
  yüklendiğinde yeniden denetleniyor.
- Adı olan, açıklaması boş ve kazanılma yolu bulunmayan on unvan verilebilir hale
  geldi; oysa oyun tam olarak anlattıkları şeyi zaten sayıyordu.
  `statMilestones` tamamlanan işleri üç iş unvanına, toplanan eşyaları dört
  toplama unvanına ve alınan hasarı üç dayanıklılık unvanına bağlıyor ve onunun
  da açıklamasını yazıyor.
- Ortak dağıtıcı üzerine sekiz davranış testi içeren `tests/callbacks.test.js`
  eklendi: kanca kimliği, argüman aktarımı, konuma göre değil id'ye göre ayırma,
  aynı id'yi paylaşan tüm kancaları ayırma, var olmayan id, kancaların
  birbirinden bağımsızlığı ve bir kancanın yayılım sırasında kendini ayırdığında
  kalanların atlanmaması — görev kancalarının fiilen yaptığı şey.
- Kaydın biçimi, hiçbir parçası geri yüklenmeden önce doğrulanıyor. Format
  konumsal — 18. sırada `savevalid` sabiti bulunan, boruyla ayrılmış segmentler —
  bu yüzden kayan veya kırpılmış bir kayıt yanlış veri olarak yükleniyor ya da
  yarı yolda hata fırlatıp oyunu yarım bırakıyordu. `describeSaveProblems` artık
  segment sayısını, sabiti ve 0–17 arasının JSON olarak ayrıştığını denetliyor;
  başarısızlıkta özgün veri olduğu gibi yedeklenip bildiriliyor, hiçbir şey
  uygulanmıyor. Sonradan eklenen 19. segment isteğe bağlı kalıyor.
- Sürüme göre anahtarlanmış bir migrasyon tablosu (`saveMigrations`) eklendi; bir
  kayıt bir değişiklikten önceye aitse ayrıştırılmış globallere uygulanıyor. Şu an
  boş; amaç, bir alanın anlamını değiştiren ilk sürümün bunu yükleme anında tahmin
  etmek yerine bildirebileceği bir yeri olması.
- Paketteki ilk davranış testi olan `tests/save-format.test.js` eklendi. Kayıt
  biçimi yardımcılarını paketten çıkarıp gerçek kayıt dizgileriyle çalıştırıyor;
  kaynağın nasıl yazıldığını değil ne yaptığını doğruluyor. Dokuz durum
  kapsanıyor: düzgün kayıt, isteğe bağlı son segment, eksik sabit, kırpılma, tek
  ve çok bozuk segment, ve migrasyonların yalnızca kayıttan yeni olduğunda ve
  sırayla çalışması. `npm run check` içine bağlandı.
- Bozuk kayıt tarayıcı senaryosu, artık hata fırlatarak ulaştığı açılış hatası
  yerine geri yükleme öncesi reddi doğruluyor.

- Yaratık rehberine okunacak bir şey verildi. Her kayıt artık üzerine gelindiğinde
  yaratığın kendi çevrilmiş açıklamasını gösteriyor; panel önceden yalnızca ad,
  rütbe ve öldürme sayısı listeliyordu, oysa kilidi açan eşya bir ansiklopedi
  vadediyor.
- Kurucu varsayılanı `0` değerinde kalan 16 yaratığa rütbe atandı; rehber bu
  değeri `???` olarak gösteriyordu. Rütbeler mevcut ölçeğe göre verildi: jölelerin
  1–4, dojo golemlerinin 10–11 aralığında olduğu ölçek. Bu, kadronun neredeyse
  yarısıydı ve tamamı katakomp ölümsüzleri.
- Mesaj günlüğü üst sınırı 120'den 50'ye indirildi. Daha uzun bir günlük,
  depolama ve DOM işi olarak geri verdiğinden fazlasına mal oluyordu; varsayılan
  36 olarak kalıyor.

### Eklenenler

- Yerel `<dialog>` öğesi ve mevcut `game-modal` stili üzerine kurulu ortak onay
  diyaloğu `showConfirmModal` eklendi; Escape ve arka plana tıklayarak kapanma,
  odak geri yükleme ve kapanışta DOM'dan silinme içeriyor.
- Mevcut `callbackManager` yapısına `onLevel`, `onEnterArea`, `onCraft` ve
  `onQuestComplete` kancaları eklendi ve değişken argümanlı bir `fire` verildi;
  böylece oyun sistemleri ikinci bir dağıtım mekanizması kurmadan abone olabiliyor.
- Kaydı yazan oyun sürümü kayıt içeriğine eklendi ve yüklemede
  `global.save_ver` değerine okunuyor; böylece ileride kayıtlar bilinçli olarak
  taşınabilir. Daha yeni bir sürümün yazdığı kayıt artık sessizce yorumlanmak
  yerine bildiriliyor.
- `index.html` dosyasına sayfa açıklaması, tema rengi ve Open Graph etiketleri
  eklendi; paylaşılan bağlantı artık yalın bir başlıktan fazlasını gösteriyor.
- Görev zincirini, hikayenin nerede durduğunu ve şu anda erişilemeyen tamamlanmış
  içeriği kaydeden `docs/STORY.md` ve `docs/STORY.TR.md` eklendi.
- `css/game.css` içinde zaten kullanılan paletten türetilmiş üç favicon önerisi
  `docs/favicon/` altına eklendi.
- Mesaj günlüğü kontrol sınırları, boş durum göstergelerinin gizlenmesi, tema
  ölçeğinin korunması, çevrilmiş ıskalama mesajları ve stilli kayıt silme modalı
  için tarayıcı regresyon kapsamı eklendi. Modal kapsamında vazgeçme, Escape, arka
  plan, odak, ekran sınırı, yerelleştirme ve dil tercihini koruma denetleniyor.
- Birbirinden ayrılmış arka plan hazır ayarı kontrolleri ile yerelleştirilmiş
  yemek, okuma ilerlemesi ve bodrum metinleri için kaynak ve tarayıcı regresyon
  kapsamı eklendi.
- Bağlamsal Türkçe gün kısaltmaları için dil doğrulaması ve dilden bağımsız pazar
  günü oyun davranışı için tarayıcı kapsamı eklendi.
- Alt kayıt çubuğu kontrollerinin üst üste binmesini veya taşmasını reddeden
  Türkçe tarayıcı yerleşim kapsamı eklendi.
- Normal konumda ve ekran kenarlarında imleci izleyen hover açıklamaları için
  tarayıcı regresyon kapsamı eklendi.
- Dil JSON'u dışında doğrudan statik ekipman açıklamalarını reddeden kaynak
  regresyon kontrolü eklendi.
- İki savaş panelini görünür yapıp render edilmiş dikdörtgenlerinin çakışmadığını
  doğrulayan tarayıcı yerleşim regresyon senaryosu eklendi.
- Moon Bloom alan boyutu güncellemesini düzeltilmiş çıkarma davranışına sabitleyen
  regresyon kontrolü eklendi.
- Responsive HTML changelog yapısı ve proje-alt-yoluna uyumlu navigasyonu için
  yapısal regresyon doğrulaması eklendi.
- Geciken asset, önbellekli profil yenileme, bozuk kayıt kurtarma, sürüm
  tutarlılığı ve ekranda gösterilen sürüm için regresyon kapsamı eklendi.
- Tam sayı oyun sürümüyle en yeni HTML changelog sürüm aralığının eşleşmesini
  denetleyen otomatik kontrol eklendi.
- Ustalık adları, sahneye özgü eylemler, çok anlamlı içerik adları ve bağlama
  duyarlı diğer riskli çevirilerin gerilemesini önleyen gözden geçirilmiş Türkçe
  terim beklentileri eklendi.
- CSS, JavaScript ve dil dosyaları için deployment sırasında içerik özetiyle
  sürümleme eklendi.
- İsteğe bağlı `lang` sorgu parametresiyle doğrudan dil seçimi ve eksiksiz Türkçe
  başlangıç için tarayıcı testi eklendi.
- Oyun HTML changelog'u dahil repository genelinde Prettier kontrolü eklendi.
- Arayüz, oyun içeriği, açıklamalar, diyaloglar ve çalışma zamanı mesajlarının
  tamamını kapsayan eksiksiz Türkçe dil dosyası eklendi.
- Kayıtlı her İngilizce dışı dil için dil şeması ve biçimlendirme parçaları
  doğrulaması eklendi.
- `locales/en.json`, dil keşfi, İngilizce fallback ve Settings altında kalıcı dil
  seçimiyle JSON tabanlı uluslararasılaştırma eklendi.
- JSON ile yüklenen build'leri test etmek için dil doğrulaması ve yerel HTTP
  sunucusu eklendi.
- Tüm ajanlar için tek kanonik proje referansı olarak `AGENTS.md` eklendi.
- README, ajan talimatları ve repository değişiklik günlüğü için `.TR.md` Türkçe
  çeviri dosyaları eklendi.
- Kaynak formatlama ve doğrulama için Prettier, Stylelint ve ESLint eklendi.
- Otomatik GitHub Pages build, doğrulama ve deployment workflow'u eklendi.
- Yayına hazır statik dosyaları `dist/` altında hazırlayan build adımı eklendi.

### Değiştirilenler

- Çevrilmiş etiketlerin birbirine değmemesi için dört arka plan hazır ayarı
  kontrolü sınırlandırılmış grid hücrelerine ayrıldı.
- Tarayıcının yerleşik kayıt silme istemi, oyun arayüzüne uygun stillendirilmiş,
  erişilebilir ve klavye destekli bir onay modalıyla değiştirildi.
- Ücretsiz yemek sesleri ve tepkileri, kitap okuma ilerlemesi ve süre metinleriyle
  bodrum eylemleri `locations.js` dosyasından eşlenmiş dil değerlerine taşındı.
- 56 statik aksesuar açıklaması ve biçimlendirilmiş 52 bonus ayrıntısı
  JavaScript'ten eşlenmiş İngilizce ve Türkçe dil değerlerine taşındı.
- Alt çubuk daraltma kontrolü doğrudan Kaydet ve Yükle'nin arkasına taşınırken
  otomatik kaydetme, sürüm ve silme sondaki eylem grubunda tutuldu.
- Sabit kodlanmış İngilizce ıskalama günlüğü birleştirmesi, değişken yerleştiren dil
  mesajıyla değiştirildi.
- Haftalık oyun olaylarında çevrilmiş gün metni karşılaştırmaları, dilden bağımsız
  gün indeksi yardımcısıyla değiştirildi.
- Kısaltmalar ile kısa veya çok anlamlı makine destekli çeviriler için dili bilen
  ajan denetimi zorunlu hale getirildi.
- 2.177 Türkçe içerik, çalışma zamanı ve konum değeri İngilizce kaynaklarıyla kod
  içindeki kullanımlarına göre denetlendi; 255 yüksek güvenli literal, ters
  anlamlı, çok anlamlı, terim ve anlatıcı hitabı hatası düzeltildi.
- Diyalog ve eylem denetimlerinin tek başına sözlük anlamı yerine çevredeki sahne,
  komşu mesajlar ve ortaya çıkan oyun davranışıyla birlikte yapılması zorunlu
  hâle getirildi.
- Repository akışı, ilişkili çalışmaların kilometre taşları arasında
  biriktirilebilmesi ve her commit/push öncesinde sahip onayı alınması şartıyla
  güncellendi.
- Alt kayıt çubuğu, çevrilmiş etiketlerle çakışan sabit koordinatlar yerine açık
  bir esnek kontrol grubu etrafında yeniden kuruldu.
- Sürüm politikası, her küçük değişiklikte sürüm artırmak yerine ilişkili ufak
  düzeltmeleri ve arayüz iyileştirmelerini mevcut changelog sürümünde gruplayacak
  şekilde güncellendi.
- Hover açıklaması konumlandırma ve ekipman yerelleştirme düzeltmeleri için oyun
  v474'e yükseltildi.
- Kalan 83 statik silah, zırh ve kalkan açıklaması ile biçimlendirilmiş sekiz
  bonus etiketi JavaScript'ten eşlenmiş İngilizce ve Türkçe dil anahtarlarına
  taşındı.
- Savaş paneli konumlandırma düzeltmesi için oyun v473'e yükseltildi.
- Yinelenen savaş paneli kimlikleri açık oyuncu/düşman kimlikleri ve ortak stil
  sınıfıyla değiştirildi.
- Moon Bloom hata düzeltmesi için oyun v472'ye yükseltildi.
- `changelog/changelog.html`; sürüm, tarih, uyarı ve navigasyon hiyerarşisi daha
  belirgin olan responsive ve erişilebilir sürüm kartları zaman çizelgesi olarak
  yeniden tasarlandı.
- Oyun v471'e yükseltildi; hata düzeltmeleri, özellikler ve eklemelerde ne zaman
  sürüm artırılması gerektiği belgelendi.
- Silah ustalıkları, çok anlamlı eşya adları, unvanlar ve istatistik etiketleri
  dahil makine çevirisi yapılmış 123 Türkçe kayıt bağlamsal olarak incelenip
  düzeltildi.
- Davranış değişikliklerinin ilgili regresyon kapsamı olmadan yayınlanamaması için
  zorunlu çalışma akışı genişletildi.
- Türkçe, Ayarlar dil seçicisine kaydedildi; changelog güncellemesinin commit ve
  push işlemlerinden önce yapılması ve periyodik gönderim kuralları belgelendi.
- Sabit yerleşimli arayüz, küçük tarayıcı ekranlarına otomatik küçülerek sığacak
  şekilde değiştirildi.
- Bakımı yapılan ve upstream GitHub Pages adresleri, taşınabilir dahili bağlantı
  gereksinimleri, ekran beklentileri, changelog politikası ve cevap dili tercihi
  belgelendi.
- Ortak arayüz etiketleri, yeniden kullanılan 22 oyun metni koleksiyonu, 1.242
  içerik adı/açıklaması ve 726 yeniden kullanılabilir çalışma zamanı mesajı
  JavaScript'ten İngilizce dil dosyasına taşındı.
- Tek parça `index.html`; CSS, işlevsel JavaScript kaynakları ve küçük bir HTML
  giriş dosyası olarak ayrıştırıldı.
- JavaScript kaynakları `core`, `data`, `systems`, `ui`, `utils` ve `world`
  sorumluluklarına göre gruplandırıldı.
- Eski CSS formatlandı; geçersiz ölçüler, yazım hataları ve standart dışı
  bildirimler düzeltildi.
- JavaScript ve CSS kaynakları davranışı koruyan modern sözdizimiyle güncellendi.

### Düzeltilenler

- Çeviklik çarpanının yanlış yazılmış bir özellikten kaydedilmesi düzeltildi; bu
  hata her kayıt ve yüklemede çarpanı sessizce `1` değerine düşürüyordu.
  `lgxnders/proto-homage` fork'unda tespit edildi.
- Alan boyutlarının geri yüklenmesinde, boyutu `0` olan bir alanda sayacın
  ilerlememesi düzeltildi; bu hata sonraki tüm alanlara yanlış boyut atıyordu.
  `MercuriusXeno/23html.github.io` fork'unda tespit edildi.
- Ölümdeki tokluk cezası ters çevrildi ve sınırlandırıldı; artık yüksek Ölüm
  becerisi daha fazla tokluk koruyor. Önceki formül, Ölüm becerisi 10. seviyede
  tokluğun tamamını siliyor, sonrasında ise negatife düşürüyordu. Yön
  `tioluko/23html.github.io` fork'undan alındı; fork'un formülü 12. seviyeden
  sonra tokluk kazandırdığı için sınırlama burada eklendi.
- Kayıt yüklenirken "sonraki savaşı duraklat" etiketi, geri yüklenen bayrakla
  yeniden eşitlendi. `MercuriusXeno/23html.github.io` fork'unda tespit edildi.
- Yükleme sırasında temel istatistikler, tokluk ve can için varsayılan değerler
  eklendi; böylece hasarlı bir kayıt tanımsız değerler geri yükleyemiyor.
- Callback ayırma işleminde `splice` çağrısına indeks yerine kanca nesnesinin
  geçilmesi düzeltildi; bu hata eşleşen kanca yerine ilk kancayı siliyordu. Hem
  `detachCallback` içinde hem de yükleme sırasındaki görev kancası temizliğinde
  giderildi.
- Kayıt içe aktarma, kullanılmayan `v0.2a` anahtarı yerine güncel `v0.3`
  anahtarına yönlendirildi; böylece içe aktarılan kayıt yeniden yüklemeden sonra
  da kalıyor.
- Okunamayan bir kayıt yedek anahtar altında saklanıp oyuncuya bildiriliyor;
  önceden üzerine sessizce yeni oyun başlatılıyordu.
- Yerelleştirme taraması tamamlandı. Görev hedefleri ve konumları, bonus
  satırlarıyla birlikte altı mobilya açıklaması, dört unvan yeteneği, üç eylem
  açıklaması, ustalık paneli ve kalan birkaç alan adı artık dil dosyalarından
  okunuyor. Canlı kaynakta oyuncuya görünen tek bir İngilizce metin kalmadı;
  geriye yalnızca konsol çıktıları ve tanımı gereği diller yüklenmeden önce
  çalışan `js/i18n-loader.js` kaldı.
- İsim-fiil olarak yazıldığı için olumsuz emir gibi okunan sekiz Türkçe seçenek
  etiketi düzeltildi. Mağaza eylemindeki `"Satın alma"` hem "satın alma işlemi"
  hem "satın alma!" anlamına geliyordu; aynı kalıp ödül alma, ilan panosu ve beş
  tıklanabilir seçenekte daha vardı. Bunların beşi ayrıca, oyunun geri kalanı
  tekil kullanırken çoğul-nazik kipteydi.
- Güç ve çeviklik ustalıkları aynı işaretlemeyi tekrarladığı için
  `masteryDescription` ve `masteryStatLine` çıkarıldı. Bir ustalık artık
  verdiği statları bildiriyor ve satır ortak HUD kısaltmalarından kuruluyor.
- Var olmayan `mastery.agl1.onlevel` yazıldı; çeviklik ustalığı seviye
  atladığında hiçbir şey vermiyordu. Açıklaması da gücün bonuslarını listeliyor
  ve gücün seviyesini okuyordu. Artık ÇEV ve TOKLUK veriyor ve kendini anlatıyor.
- Pazar tezgâhlarındaki gergin adama bir işlev verildi. Sahnenin tek bir satırı
  ve tek bir çıkışı vardı; üstelemek artık Sabır becerisini geliştiriyor, geri
  çekilmek ise bir kez karma kazandırıyor. Kendisi bir görev vereni değil,
  ileriki hikâye çalışması için bir kanca olmayı sürdürüyor.
- Gergin adamın kendi diyaloğunda "Sinirli Adam" olarak anılması düzeltildi;
  sahneyi açan seçenek onu "Gergin Adam" diye adlandırıyordu.
- Oyun tikleri, geri çağrım saymak yerine geçen gerçek süreden türetiliyor.
  Tarayıcılar arka plandaki zamanlayıcıları kısıtlıyor ve birkaç dakika sonra
  dakikada bire düşürüyor; bu yüzden dünya yalnızca daha seyrek çizilmiyor,
  gerçekten duruyordu. Kaçırılan tikler dönüşte oynatılıyor; uzun bir yokluğun
  oyunu kilitlememesi için hem kare başına hem toplamda sınırlandırıldı. Kitap
  okuma da aynı şekilde ilerliyor.
- `area.trnf` alanının hiç kimlik almaması düzeltildi: atama `area.trn` adını
  kullanıyor, eğitim alanının kendi kimliğini eziyor ve bu alanı kurucu
  varsayılanında bırakıyordu.
- `area.clg.onEnd` kaldırıldı; oyuncuyu var olmayan iki sahneye taşıyordu ve alan
  erişilebilir olur olmaz hata fırlatacaktı. Alan, tamamlanmamış içerik olarak
  duruyor; `docs/STORY.md` dosyasına bakın.
- Kurt avı görevi tamamlandığında `ttl.wsl` unvanı veriliyor. Unvan vardı ama
  hiçbir verilme yolu yoktu; üstelik tam da kurt sürüsü avlamayla ilgili görevde.
- Tamamlanan iş sayacının, gerçek `global.stat.jcom` yanında var olmayan
  `global.flags.jcom` değerini artırıp `NaN` üretmesi düzeltildi.
- Nöbet görevinde ok fonksiyonu içinde `clearInterval(this)` çağrılması
  düzeltildi; `this` zamanlayıcı tanıtıcısı olmadığı için vardiya zamanlayıcısı
  sonrasında da çalışmaya devam ediyordu.
- Nöbet noktasına çıkış eklendi. Hiçbir çıkış seçeneği yoktu, bu yüzden oyuncu
  saat 20:00'ye kadar orada tutuluyordu.
- Otomatik kayıt yapılandırılabilir hale getirildi ve `proto23.autosave`
  tercihine taşındı. Aralık, hem düğmede hem yükleme yolunda tekrarlanan bir
  `30000` sabitiydi, bu yüzden hiçbir şey onu değiştiremiyordu; düğme ayrıca
  öncekini temizlemeden ikinci bir zamanlayıcı kuruyor ve yükleme yolu kutuyu
  yalnızca işaretliyordu. Artık tek bir `restartAutosave` yardımcısı, ayarlarda
  bir aralık satırı ve 15 saniyelik bir varsayılan var.
- Envanter listesinin altında, üzerine konumlanan sıralama çubuğu için yer
  ayrıldı; uzun bir envanterin son satırları artık çubuğun altında kalmıyor.
- Dayanıklılık göstergesi etiket, ölçek ve sayı yan yana gelecek şekilde yeniden
  kuruldu. Sayı, renkli dolgu çubuğunun içine çiziliyordu; sarı ve yeşil
  seviyelerde okunmuyor ve çubuk kısaldıkça kayıyordu. Etiket, makine tarafından
  çıkarılmış `runtime.*` kısaltması "DP" yerine çevrilmiş
  `ui.itemDescription.durability` anahtarına taşındı.
- Talebe beceri kitapları, öğrettikleri ustalıkların adıyla yeniden adlandırıldı;
  böylece bir eşya ile beceri panelindeki karşılığı aynı kelimeleri kullanıyor.
- "Shady Kid" ifadesinin Türkçesi düzeltildi; kelimenin gölge anlamı yerine
  şüpheli anlamı kullanılmalıydı. "Gölgeli Yol" ise gölge anlamını koruyor,
  orada doğru olan bu.
- Mesaj günlüğüne, sayfa yenilemesinden sağ çıkan bir geçmiş verildi. Günlük
  doğrudan DOM'a çiziliyordu, arkasında hiçbir veri yapısı yoktu ve her yüklemede
  boşaltılıyordu; bu yüzden hiçbir şey yenilemeden sonra kalmıyordu. Çizilen
  satırlar artık `proto23.messagelog` anahtarı altında saklanıyor, `load()`
  sonunda geri yükleniyor ve günlüğün kendi temizleme kontrolüyle siliniyor.
  Mevcut mesaj günlüğü sınırı hem ekranda kalan hem de saklanan satır sayısını
  yönetiyor ve üst sınırı 100'den 120'ye çıkarıldı. Geri yüklenen satırlar düz
  biçimlendirmedir; canlı bir mesaja bağlı hover açıklamaları taşınmaz.
- Geliştirme sunucusunun izleme döngüsü altında derleme betikleri sessizleştirildi;
  her kayıtta yeniden çalışıyorlardı. İkisi de `--quiet` kabul ediyor ve
  `scripts/dev.js` bunu geçiyor.
- Head Hunter unvanı Türkçede "Kelle Avcısı" olarak yeniden adlandırıldı; bağlama
  göre gereken iyelik ekleriyle birlikte.
- Arka plan tercihi kendi `proto23.theme` anahtarına taşındı ve tüm hazır
  ayarlar ile sürgüler ortak bir `setBackground` yardımcısından geçirildi. Tercih
  önceden yalnızca kayıt içeriğinde duruyordu, bu yüzden ancak değişiklikten
  sonra kaydedilirse hatırlanıyordu; sayısal göstergeler de yüklemede hiç
  eşitlenmiyordu. Saklanan tercih artık kaydın taşıdığı değerin önüne geçiyor.
- Changelog'dan oyuna dönerken sayfaya gitmek yerine sekme kapatılıyor; önceki
  davranış, otomatik kaydı birbiriyle yarışan ikinci bir oyun kopyası açıyordu.
  Oyuncunun doğrudan açtığı changelog düz bağlantıyı koruyor.
- Ayar satırlarına dikey boşluk verildi ve kontroller dikeyde ortalandı.
- `tests/translation-expectations.tr.json`, HUD etiketlerinin gözden geçirilmiş
  büyük harf kullanımıyla eşitlendi.
- Çıplak sayı atayan 104 stil satırına `px` birimi eklendi. Birimsiz bir CSS
  uzunluğu geçersizdir ve sessizce atılır, yani bu tanımların hiçbiri işe
  yaramıyordu. Görünmeyen yok etme onayı, ürün adının üstüne binen market
  düğmeleri ve okunamayan dayanıklılık göstergesi hep bu tek hata sınıfındandı.
  Kalan beş çıplak atama geçerli: `skl.sp` zaten `".66em"` tutuyor, `chs()`
  işlevinin `size` ve `slimsize` parametreleri hiçbir çağıran tarafından
  geçilmiyor ve biri yorum satırında.
- `js/ui/map-and-mastery.js` içindeki tekrarlanmış ipucu konumlandırması
  `positionDescription` çağrısıyla değiştirildi. Kopya birimsiz değer atadığı
  için ipucunu hiç hareket ettirmiyordu.
- `js/data/skills.js` içinde kalan tüm gömülü metinler dil dosyalarına taşındı:
  134 avantaj etiketi, 36 açıklama ve 10 ustalık adı; dil başına 216 anahtar
  eklendi. Kilometre taşı etiketleri `content.skl.<id>.mlstn.lv<N>` deseniyle
  anahtarlandı.
- Üst bardaki stat kısaltmaları yerelleştirildi; kaynakta İngilizce sabit
  değerlerdi, oysa avantaj metinleri Türkçe kısaltmaları kullanıyordu.
- Kritik şans satırının yanına Şans göstergesi eklendi. Şans, unvanlar ve beceri
  kilometre taşlarıyla artıyor ve kritik ile düşme atışlarını besliyordu, ancak
  arayüzün hiçbir yerinde gösterilmiyordu.
- Bir kayıt çözülemediğinde yükleme ekranının hiç kalkmaması düzeltildi.
  Bildir-ve-devam et yolu, açılış temizliği çalışmadan geri dönüyordu.
  Çözülemeyen bir kaydı kapsayan tarayıcı senaryosu eklendi; mevcut bozuk kayıt
  senaryosu bu yola ulaşmıyordu, çünkü onun verisi sorunsuz çözülüp yalnızca
  ayrıştırmada başarısız oluyor.
- "Degradeleri yok et" ayarının, kutu yerine kayıtlı bayraktan hareket etmesi
  düzeltildi; kayıt yüklendiğinde hem kontrol hem de çizilen degradeler geri
  getiriliyor.
- Degrade ve otomatik kayıt kutularına temaya uygun bir kontrol verildi;
  öncesinde `<select>` için yazılmış sınıfı taşıyan yerel bir checkbox'tı.
- Oyun, oyuncuya görünen her yüzeyde **Echoes Beneath** olarak yeniden
  adlandırıldı: sayfa başlığı, paylaşım meta etiketleri, changelog sayfası ve dışa
  aktarılan kayıt dosyası adı. Bu fork, üstkaynak `Proto23` oyununun fork'u olarak
  başladı ve repository adını koruyor. `Proto23` ayrıca teknik tanımlayıcılarda
  kalıyor: npm paket adı, `proto23.locale` tercih anahtarı, canlı yeniden yükleme
  betiğinin id'si ve test dizini önekleri. Böylece mevcut kayıtlar ve saklanan dil
  tercihleri çalışmaya devam ediyor.
- Yer tutucu favicon, `assets/icon.png` dosyasından üretilen ikonla değiştirildi;
  ayrıca `icons/` altına 192 piksellik ikon, Apple dokunma ikonu ve paylaşım
  görseli eklendi ve bunlar artık dağıtımda yayınlanıyor.
- Yok etme ve parçalama onaylarının arkasındaki elle konumlandırılmış katmanlar
  ortak modalla değiştirildi. İkisi de birimsiz CSS değerleri ve sabit 1300
  piksellik bir merkez kullanıyordu, bu yüzden ekran dışında veya hiç boyutsuz
  çiziliyorlardı.
- Referans dokümantasyon `docs/` altına taşındı; kökte geliştirici rehberi ve
  ajan araçlarının bulmaya devam ettiği bir `AGENTS.md` yönlendirmesi kaldı.
- Tüm direnç hasar azaltmaları ortak bir `resistanceFactor` yardımcısıyla
  sınırlandırıldı. Direnç becerileri doğrusal ölçeklendiği için önceki
  `1 - use()` çarpanları sıfırı geçip işaret değiştiriyordu: yiyecek zehri ve
  yozlaşma direnci 20. seviyeden sonra hasarı negatife çevirip kaybı azaltmak
  yerine tokluk ve can kazandırıyordu.
- Boş mesaj günlüğü durum göstergeleri gizlendi, etkin durumları düğmelerin içine
  hizalandı ve temizleme kontrolü mesaj paneli sınırları içinde tutuldu.
- Arka plan sürgülerinin ve hazır temaların, arayüzü ekrana sığdıran body zoom
  değerini kaldırması önlendi.
- Kayıt silmeden önce yerelleştirilmiş onay eklendi; dil tercihinin korunması için
  silme işlemi yalnızca oyun kaydıyla sınırlandı.
- `Sun.` ifadesinin Pazar günü kısaltması olan “Paz.” yerine astronomik “Güneş”
  olarak çevrilmesi düzeltildi.
- Yalnızca pazar günü sunulan dojo yemeği davranışının İngilizce görünüm etiketine
  bağlı olması düzeltildi.
- Sabit kodlanmış haftalık dojo yemeği duyurusu eşlenmiş İngilizce ve Türkçe dil
  değerlerine taşındı.
- Otomatik kaydetme etiketi, daraltma kontrolü, sürüm bağlantısı ve kayıt silme
  eyleminin alt bilgi çubuğunda birleşmesi düzeltildi.
- Türkçe kayıt silindi onay metni düzeltildi.
- Standards mode'da birimsiz CSS koordinatları reddedildiği için karakter
  panosunun üzerinde sabitlenen hover açıklamaları düzeltildi.
- Hover açıklamalarının arayüz ölçeğini hesaba katması, imleci izlemesi ve görünür
  ekranın dışına taşmadan kenarlardan ters yöne açılması sağlandı.
- Düşman panelinin HTML5 standards mode'da oyuncunun sol üst konumuna düşmesi,
  koordinatlarına piksel birimi eklenerek düzeltildi.
- Moon Bloom alanından ayrılma işleyicisindeki rastgele boyut güncellemesi
  `rand(5) + 20` yerine `rand(5) - 20` kullanacak şekilde düzeltildi.
- Kayıt çözümleme işlemi eski yükleyicinin kendi hata panelini oluşturmasından
  önce başarısız olduğunda gösterilen yerelleştirilmiş kurtarma mesajı eklendi.
- Eski veya hatalı oyun kaydı başlangıç sırasında hata verdiğinde yükleme
  katmanının süresiz olarak ekranda kalması engellendi.
- Pages deployment sonrasında tarayıcının eski çalışma zamanı ve dil dosyalarını
  yeni sürümle karıştırması engellendi.
- Repository proje alt yolunda yayınlanan GitHub Pages dağıtımlarındaki oyun içi
  changelog bağlantısı düzeltildi.
- Ayrılmış kaynaklardan tek bir tarayıcı bundle'ı üretilerek eski global
  function-hoisting davranışı korundu.
- Geliştirme bağımlılıklarının GitHub Pages artifact'ine eklenmesi engellendi.
