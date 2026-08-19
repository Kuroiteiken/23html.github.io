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

- Türkçe oyuncu artık `en.json` indirmiyor. `locales/manifest.json` içindeki her yerel
  bir `complete` bayrağı taşıyor ve yükleyici, bu bayrağa sahip bir yerel için geri
  düşüş dosyasını tamamen atlıyor -- oyuncunun beklediği ama tek bir anahtarını bile
  okumadığı 348 KB, çünkü `check-i18n.js` her zaman tam parite zorunlu kılıyordu.
- `complete` bir söz değil, denetlenen bir olgu: `check-i18n.js`, bunu iddia eden bir
  yerelde tek bir anahtar eksikse yapıyı düşürüyor ve ne yapılacağını söylüyor --
  çevirin ya da bayrağı kaldırın; bayrağı kaldırmak yükleyiciyi yeniden İngilizce
  indirmeye döndürüyor.
- Bu aynı zamanda bir çelişkiyi de çözdü. Ajan yönergeleri, İngilizce olmayan yerellerin
  çevirileri tamamlanana kadar İngilizce geri düşüşe dayanabileceğini söylüyor; ama
  `check-i18n` her yerelden tam parite istiyordu, dolayısıyla bu izin kullanılamıyordu.
  Ayrım artık doğru yerden geçiyor: İngilizce'de olmayan bir anahtar her zaman hatadır --
  onu kimse okumaz, ya yazım hatasıdır ya artıktır -- İngilizce'de olup bir yerelde
  olmayan anahtar ise yalnızca o yerel kendini tam ilan ediyorsa hatadır.
- `index.html` paketi önyüklüyor. Yükleyici `js/game.js`'i ancak yerel dosyalar
  geldikten sonra enjekte edebiliyor, çünkü içerik modülleri kendilerini tanımlarken
  `i18n.t()` çağırıyor; yani sayfanın yüklediği en büyük dosya aynı zamanda en son
  istenendi. Önyükleme çalıştırmadan indirdiği için bu sırayı bozmuyor ve 1,2 MB'lık
  transferi yerel isteklerle üst üste bindiriyor.
- `build-site.js` önyükleme ipucunu diğer her şeyle aynı `?v=` ile damgalıyor ve bu bir
  ayrıntı değil: ipucu ile yükleyicinin kendi isteği aynı URL olmazsa tarayıcı bunları
  iki ayrı kaynak sayar ve paketi iki kez indirir -- ki bu hiç önyüklememekten kötüdür.
- İki değişiklik de sunucunun gerçekten gördüğü isteklere bakan tarayıcı iddialarıyla
  korunuyor; çünkü her iki durumda da doğrulanacak şey gerçekleşmeyen ya da yalnızca bir
  kez gerçekleşen bir istek ve hiçbiri sayfanın çıktısında görünmüyor. Her iki iddianın
  da tarif ettiği koruma kaldırıldığında kırıldığı doğrulandı.

- Oyundaki her listenin kurulduğu üç yüzey artık `css/game.css`'te bir kez tanımlanan
  custom property: listenin kapsayıcısı için `--list-well`, içindeki bir satır için
  `--list-row`, oyuncunun karşılayamadığı satır için `--list-row-denied`. İki dosyada
  yirmi kez ve aynı rengin iki yazımıyla -- `rgb(10,30,54)` ve `rgb(10, 30, 54)` --
  yazılmışlardı; yeterli zaman verildiğinde tekrarlanan bir sabitin dönüştüğü şey tam
  olarak bu. JavaScript bunları `style.backgroundColor = "var(--list-row)"` olarak
  atıyor; satır içi stilde custom property geçerli.
- Yalnızca bu üçü. `rgb(255,192,5)`, `rgb(0,235,255)` ve `rgb(44,255,44)` bir eşyanın
  `stype` değerine göre seçilen bir skala, `#e8421c` ise hava durumu göstergesinin arka
  planı; ne anlama geldiklerini saptamadan isim vermek adı yanlış bir token üretme riski
  taşıyor ve yanlış isimli bir token sabit renkten kötüdür, çünkü sonraki okuyucuyu
  yanlış yönlendirir ve ardından yanlış yerde kullanılır.
- Bunun iki yarısı da korunuyor, çünkü bu değişiklik görünmez biçimde bozuluyor.
  Çözülmeyen bir custom property bildirimi geçersiz kılıyor; satır yanlış renk almıyor,
  hiç arka plan almıyor ve hiçbir şey hata vermiyor -- kimsenin eklemediği bir stil
  kazası gibi okunurdu. `check-game-regressions.js` üç tanımı zorunlu kılıyor ve altı
  sabit yazımdan biri geri gelirse düşüyor; eski bir panelden kopyalanan yeni bir panel
  onları tam olarak böyle geri getirirdi. `tests/probes/list-surfaces.js` her token'ı
  oyunun uyguladığı gibi uygulayıp `getComputedStyle` ile geri okuyor. İkisinin de bir
  token adı yanlış yazıldığında kırıldığı doğrulandı.
- `js/ui/interface.js` 8.689 yerine 6.075 satır. Baloncuklar `js/ui/tooltip.js`'te,
  mesaj günlüğü `js/ui/message-log.js`'te, dükkân/demirci/satış/mobilya/sandık satırları
  `js/ui/panels.js`'te, savaş `js/systems/combat.js`'te.
- `tooltip.js` diğerlerinin tersine `interface.js`'ten **sonra değil önce** birleştiriliyor
  ve buradaki tek gerçek sıra kuralı bu: `function` bildirimi tüm birleşik kapsam boyunca
  hoist edilir ama `const` edilmez. `addDesc` arayüz kurulurken yirmi altı kez çağrılıyor
  ve dosya iki `const` etiket tablosu taşıyor; önceki bir dosyanın tanım anındaki kodu
  tarafından okunan bir `const` `ReferenceError` olurdu.
- Tercih bloğu aynı sebeple yerinde kaldı -- sonradan keşfedilmek yerine baştan yazıldı:
  `autosaveSeconds`, `applyBackground` ve `restoreBackgroundPreference` bitişik değil,
  aralarında DOM kurulumu çalışıyor, `restoreBackgroundPreference` tanım anında çağrılıyor
  ve blok `const themeStorageKey` ile `const autosaveStorageKey`'i taşıyor. Ayırmak DOM
  kurulumunu da bölmek demek.

- Depo sahibinin sıraya aldığı istekler `docs/PROPOSALS.md` ve Türkçe karşılığında, hiçbiri
  başlanmadan önce yazıldı; kuralı sahibi koydu: her şey önce PROPOSALS'a girer, yayına
  girdiğinde çıkar, ne yaptığı changelog'a ve hikâyeye dokunduysa `STORY.md`'ye gider. Her
  biri kodla karşılaştırılıp doldurulana kadar plan değil kaydedilmiş istek olarak
  duruyorlar ve dosya bunu söylüyor.
- Bunlardan biri bir özellik değil bir soru -- direnç alanlarının dövüşte hiç okunup
  okunmadığı -- ve ilk sıraya kondu, çünkü diğer iki madde onun cevabına bağlı.
  Cevaplanmamış bir soruya dayanan iş iki kez yapılır.
- Biri bekleyen değil kapanmış olarak kaydedildi: oyuncu panelinde efekt şeridinin ŞANS
  okumasına binmesi olduğu gibi kabul edildi.
- `docs/status.md` sahibinin yapıştırdığı listeyi madde başına durumu olan bir kuyruğa
  çeviriyor, ve sırası yazılma sırası değil bağımlılık ile risk: önce soru, sonra hâlihazırda
  var olan içeriğe yapılan düzeltmeler, sonra kayıt biçimine dokunmayan eklemeler, en sonda
  v479 göçü gerektiren ikisi -- ki onları birleştirmeye değer, çünkü bir göç iki göçten
  ucuzdur.
- O dosyadaki satır referansları bu oturumun taşımalarından sonra yeniden ölçüldü, çünkü
  dördü `js/ui/interface.js` içinde artık `js/systems/combat.js`'te olan koda işaret
  ediyordu. İki madde numarasından fazlasını değiştirdi. Zırh çift sayımı, daha önce
  kaydedilen dört ilgisiz satır değil, her birinde iki görünüm olan iki dal:
  `combat.js:438/444` ve `490/496`. Ve yetenek türü hatası yazıldığı şey değil:
  `skl.hvt.type` iki kez ayarlanıyor -- `skills.js:2050`'de doğru şekilde ve 2277'de
  `skl.hst` bloğunun içinde yeniden -- yani asıl yanlış olan, `skl.hst.type`'ın hiç
  ayarlanmaması. Her madde artık satırın yanında bir `grep` kalıbı da taşıyor, çünkü kalıp
  bir taşımadan sağ çıkar, numara çıkmaz.
- `README.md` ve `README.TR.md` kaynak yapısını bugünkü hâliyle anlatıyor;
  `scripts/sources.js` sırasının neden yükleme sırası olduğu ve bu yüzden hangi dosyanın
  önce gelmek zorunda olduğu da dâhil.

- Karanlık tasarımın atladığı yüzeyler için bir denetim yapıldı; sahibi bunu doğrudan
  istemişti. `css/game.css` ve `js/ui/` üzerinde beş mercek -- palet, elle kurulmuş
  overlay'ler, klavye erişimi, hover ve focus halleri, yapı -- ve her aday bulgu, görevi onu
  çürütmek olan ayrı bir geçiş tarafından yeniden okundu. On dokuzu ayakta kaldı ve
  `docs/PROPOSALS.md` 18. madde olarak, her birinin oyuncuya ne kadar göründüğüne göre
  sıralı duruyor.
- En büyüğü ipucu panelinin çerçevesi: içi çoktan karartılmış bir panelin etrafında
  `5px lightgrey` kenarlık ve onun dışında siyah outline. Oyunda en sık görünen yüzey.
  Ardından: `orchid` kenarlıklı ve klavyeye kapalı beş navigasyon butonu, diyalog olması
  gereken iki elle kurulmuş pencere daha, atlanmış tek bir çip değil göç etmemiş bir küme
  olarak envanter satırı çipleri, ve `:focus-visible` var olmadan önce yazılmış, redesign'ın
  eleman eleman üstüne tırmandığı bir `input:focus { outline: none }`.
- İki bulgu renk dışındaki sebeplerle de değerli. Başlık seçme penceresinin vazgeçme yolu
  yok -- onu kapatan tek şey aynı zamanda `you.title`'ı yazıyor -- ve `bootstrap.js:1503`
  yükleme sırasında açık bayrağını sıfırlarken düğümü kaldırmıyor, yani ne kapanabilen ne
  yeniden açılabilen bir pencere kalıyor. Ve `#rptbn:hover` ölü: kontrol kendi arka planını
  hem kurulurken hem her tıklamada satır içi yazıyor, dolayısıyla kural hiç boyamıyor --
  yani kontrolde yanlış bir hover değil, hiç hover yok.
- `PROPOSALS.md` içindeki zırh çift sayımı sayıları yanlıştı ve yanlış olmaları, bilgi
  vermek için kaydedildikleri kararı değiştiriyordu. İşareti düzeltmenin kalkansız bir
  oyuncuyu yaklaşık dört kat dayanıklı yaptığını söylüyorlardı: alınan 36,9 hasar 9,9'a,
  kalkanla 1,0'a. `tests/harness.js` ile gerçek `dmg_calc` üzerinden, notun kendi tarif
  ettiği senaryoda ölçüldüğünde 37,0 → 0,0 ve Hoplit ile 27,0 → 0,0. İşaret
  düzeltildiğinde hasar azaltma saldırının tamamını aşıyor ve sonuç tabana kırpılıyor, yani
  yaratık oyuncuya hiç hasar veremiyor; `minimumLandedDamage` bilinçli olarak yalnızca
  oyuncunun verdiği hasara uygulanıyor, dolayısıyla gelen bir vuruşu asgaride tutan hiçbir
  şey yok. Bu tartılacak bir yeniden dengeleme değil, tek başına yapılamayacak bir
  değişiklik.
- Kalkan öncülü de eskimişti. "On dört kalkanın on biri `str 0` ile geldi" artık doğru
  değil: on yedi kalkan var ve hiçbirinin `str`'si 0 değil, 4'ten 23'e uzanıyorlar ve
  `aff[0]` ile `cls` dolu. Ölçümün bulduğu şey ise hepsinin `int`'inin 0 olması --
  dolayısıyla `dmg_calc`'ın büyü dalında oyundaki hiçbir kalkan bir büyüye karşı savunma
  yapmıyor.

- Denetimin en görünür yedi maddesi uygulandı. İpucu paneli (`#dscr`) `.game-modal`'ın
  çerçeve sırasını aldı -- `3px #050912` kenarlık, dışında `2px #6676bd` outline -- metni
  `rgb(188 254 254)`, gölgesi palet moru, iç ayırıcısı `#526988`. Oyunun en sık gösterdiği
  yüzeydi ve ekranda kalan en geniş açık gri banttı. `positionDescription` `offsetWidth`
  ölçtüğü için 5px → 3px başka hiçbir değişiklik gerektirmedi.
- Durum efekti ikonlarının taban kenarlığı karanlık panelde görünmeyen siyahtan `#526988`'e,
  hover'ı `lime`'dan `#71e6b1`'e geçti. Her ikonun efekt başına satır içi rengi veri
  kodlaması, dokunulmadı.
- Dil seçicinin açtığı liste `background: white; color: black` yerine `var(--list-well)` ve
  `rgb(188 254 254)` kullanıyor. Yazar tarafından verilen `option` renklerinin Windows'ta
  uygulandığı ama macOS'un yerel menüsünde yok sayıldığı kayda geçirildi -- düzeltme doğru
  yerde ama her platformda garanti edilemez.
- Dışa/İçe aktar satırının iki yarısı `.opt_transfer` sınıfını taşıyor. Satır içi
  `1px lightgrey solid` kenarlıkları, v478.29'da değiştirilen pencerelerden kalmıştı ve
  `.opt_va`'nın sütun ayırıcısını da eziyordu; sınıf hem paleti hem ayırıcıyı geri getiriyor.
- `#rptbn:hover` artık bir arka plan değil kenarlık ve outline veriyor. Kontrol kendi arka
  planını hem kurulurken hem her tıklamada satır içi yazıyor, dolayısıyla eski kural hiç
  boyamıyordu: oyuncu açık griyi hiç görmedi ama düğmenin hiç hover geri bildirimi de yoktu.
- `.i18n-load-error` kartı, tam yanında duran `#save-unreadable`'ın karanlık hata paletini
  aldı.
- Yedisi de yalnızca düzeltilmedi, **yasaklandı**: `check-game-regressions.js` bu kuralların
  her birinin geri gelmesini kontrol ediyor, çünkü geri gelme yolu eski bir panelden
  kopyalanan yeni bir panel -- ilk başta böyle yayıldılar. Yasağın kırıldığı doğrulandı.

- Okunan kitaplar listesi, `left: 445px / top: 370px` konumuna sabitlenmiş ve lime bir saç
  teliyle çerçevelenmiş bir `div` değil, paylaşılan iskelet üzerine kurulu bir diyalog. Bir
  başlık, kapatma düğmesi, Escape, odak yönetimi ve kayan bir gövde kazanıyor; satırlarındaki
  nadirlik renkleri anlamsaldır ve aynen taşındı. Kazandığı davranış görünümünden daha
  önemli: eskiden içindeki **herhangi** bir tıklamada kapanıyordu, yani bir satırı okumak ve
  listeyi kapatmak aynı hareketti.
- Yükleme sırasındaki yıkımı artık `if (dom.bkssttbd?.open) dom.bkssttbd.close()`. Eskiden
  bayrağı sıfırlayıp düğümü `document.body`'den elle kaldırıyordu ki bu, ne kapanan ne
  yeniden açılan bir pencere bırakmanın yolu — diyalog kendi kaldırılmasının sahibi,
  dolayısıyla onu kapatmak yıkımın tamamı.
- Envanter panelini çerçeveleyen iki çubuk ve alttaki çubuğun buton ayırıcısı düz `grey`
  iken, o panelin diğer her çizgisi `#3848c0` / `#44c` / `#249`. Hiçbir durum taşımıyorlar —
  `nograd()` yalnızca bir arka planı değiştiriyor, hiçbir kenarlığa dokunmuyor. `.bts_b`
  beceri penceresiyle paylaşılıyor, yani değişiklik ikisinde birden görünüyor; istenen bu.
- İkisi de sabitlendi. Okunan kitaplar diyaloğu bir probla değil statik olarak sabitlendi,
  çünkü liste ancak bir kitap okunmuşsa var oluyor ve prob bunu güvenilir biçimde
  kuramıyordu; iskeletin kendi davranışını `tests/probes/save-transfer-modal.js` zaten
  kapsıyor. Hangisinin hangisi olduğunu söylemek, test sayısından önemli.

- Sahibinin sıraya aldığı on üç istek, PROPOSALS'a plan olarak geçmeden önce kodla
  karşılaştırıldı — harness ile ölçülerek, akıldan değil. Araştırma birkaç maddeyi değiştirdi
  ve ikisini tamamen kapattı.
- **İkisi zaten yayınlanmıştı.** Ateş hasarında yanma debuff'ı `c19c781`'de yapılmış; şöminenin
  iyileşme hızı, enerji kazancı ve yanında uyuduktan sonraki "dinlendin" buff'ı `ea8fa22` ile
  `00295f7`'de, ikisi de 2026-08-18'de. Mobilya isteğinin üçte ikisi de aynı commit'te.
  Ölçmeden PROPOSALS'a plan olarak yazmak, var olan üç şeyi yeniden yapmak olurdu.
- **Dört öncül ölçümle çürütüldü.** "Her yeteneğe 15. seviyeye kadar avantaj": 15. seviye
  1.151.201 kümülatif deneyim, eylem başına 0,2-0,6 kazançla — mütevazı bir taban değil derin
  endgame, ve mevcut tasarım bunu zaten biliyor (143 kilometre taşının 69'u 1-5 seviyelerinde).
  "Bölge sınırsız temizleme": 31 alanın 21'i temizlenince kendini yeniliyor ve açılma deseni
  başka yerde iki kez var. "Araştır tek yerde": 12 yerde bağlı. "Silah ustalığı unvanları":
  22'si zaten var ve 13'ünde kazanç bonusu var.
- **Asıl iş, isteklerin işaret ettiği yerde değil, bitmiş ama bağlanmamış içerikte.** 26 unvan
  iki dilde yazılmış ve hiç verilmiyor. 19 tarif bitmiş, çevrilmiş ve öğrenilemiyor. `hptn2`
  dengelenmiş ve tekrarlanabilir kaynağı yok. On yedi kalkanın yedisinin hiç kaynağı yok, ve
  hepsinin `int`'i 0 olduğu için `dmg_calc`'ın büyü dalında hiçbir kalkan savunma yapmıyor.
  `item.stdst`'ye 62 tarifin sıfırı dokunuyor. Projenin kendi kuralı zaten bunu söylüyor.
- **Direnç sorusu cevaplandı ve cevap "hayır".** `res` nesnesinin 12 alanından 11'i `dmg_calc`
  tarafından hiç okunmuyor — bir efektin uygulanıp uygulanmayacağını belirliyorlar, ne kadar
  hasar geçtiğini değil. Ayrıca sahibinin saydığı üç şeyden ikisi `res` alanı bile değil:
  ölümsüz direnci `you.maff`/`you.cmaff`, karanlık savunma ise `aff[6]`. Yalnızca ağrı direnci
  (`res.ph`) bir `res` alanı ve canlı okuyucusu olan tek alan.
- **`CLAUDE.md`'deki kısıt listesi eksikti.** Bir kilometre taşının yazabileceği kaydedilen
  alanlar yalnızca `stra`/`agla`/`inta`/`spda`/`hpa`/`sata` değil; `exp_t`, `luck` ve `mods`
  nesnesinin tamamı da kaydediliyor. 146 girdide ölçülen yazımlar: `exp_t` 43, `hpa` 38,
  `stra` 32, `agla` 25, `sata` 23, `mods.sbonus` 7, `inta` 6, `mods.cpwr` 3, `luck` 2,
  `spda` 1.

- Depo artık `Kuroiteiken/Echoes-Beneath`; `23html.github.io` adından değiştirildi, dolayısıyla
  bakımı yapılan yayın adresi `https://kuroiteiken.github.io/Echoes-Beneath/`. `docs/AGENTS.md`,
  Türkçe karşılığı ve iki README güncellendi. Upstream adresi `https://23html.github.io/` başka
  bir depo ve değişmedi; bu dosyanın aşağısındaki fork atıfları da öyle -- onlar bir düzeltmenin
  nerede tespit edildiğini kaydediyor, bir bağımlılığı değil.
- Kodda hiçbir şeyin değişmesi gerekmedi ve bunu sonuç olarak değil sebep olarak kaydetmeye
  değer. Projede köke göre tek bir yol yok: changelog bağlantısı
  `new URL("changelog/changelog.html", document.baseURI)` ile kuruluyor, yükleyici her URL'i
  kendi script `src`'inden türetiyor, `changelog.html` ise `href="../"` ile bağlanıyor.
  `docs/AGENTS.md`'deki `/changelog/...` biçiminde sabit yol yazmayı yasaklayan kural, bir ad
  değişikliğini bir dokümantasyon düzenlemesine indiren şey. Kayıtlar da sağ çıkıyor:
  `localStorage` origin'e göre anahtarlanıyor ve origin değişmedi -- yalnızca altındaki yol.

- `Creature()` her yaratığa kendi ekipmanını veriyor. Önceden `this.eqp = [eqp.dummy,
eqp.dummy]` idi -- tek bir paylaşılan nesneye referans -- dolayısıyla
  `js/data/creatures.js` içindeki her `creature.X.eqp[0].aff = [...]` o yaratığı kuşandırmak
  yerine o nesneyi yeniden yazıyordu. 39 yaratığın hepsi en son bildirilen silahı paylaşıyordu:
  ölçüldü, `creature.bat` ile `creature.cbat` birebir aynı nesneydi, ikisi de
  `aff [14,26,4,-14,34,-48,66]` ve `cls [9,10,9]` taşıyordu.
- Aynı hata oyuncuya da uzanıyordu ve önemli olan yarısı bu. Oyuncunun boş ekipman yuvaları da
  `eqp.dummy` ve `dmg_calc` vurulan yuvanın `aff` ile `cls`'ini hasar azaltmaya okuyor --
  yani boş bir yuva, bir yaratık silahının yakınlıklarını oyuncunun kendi savunmasına
  katıyordu. Saldırı terimi 100'e karşı ölçüldü: vurulan boş bir yuva 50 hasarın 9'unu
  emiyordu. Bir silah saldırıyı yükseltmeli ve alınan hasarı hiç etkilememeli; boş bir yuva ise
  hiçbir şey yapmamalı.
- Savaş bütçesi korundu ve bu, bunun bir yeniden dengeleme değil düzeltme olarak yayınlanmasının
  sebebi. `scripts/check-combat.js` iki terimi de gerçek `dmg_calc` üzerinden ölçüyor: seviye
  başına hasar azaltma 16,0'da değişmedi, saldırı 14,7'den 14,2'ye indi ve en dik yaratık
  `wolf1` seviye 7'den `wolfa1` seviye 12'ye geçti -- yaratıklar artık herhangi birinin
  bildirdiği en güçlü silahı değil kendi silahlarını kullanıyor. Eklenen 20 yaratığın hepsi
  bütçe içinde kaldı.
- `check-game-regressions.js` içinde sabitlendi, yorumları sıyrılmış kaynak üzerinde --
  düzeltmeyi açıklayan yorum bozuk satırı alıntılıyor, ki bu oturumda beni ikinci kez yakalayan
  şey bu ve `scripts/strip-comments.js`'in var olma sebebi.

- `tests/check-shared-state.js`, paylaşılan `eqp.dummy`'nin ait olduğu hata sınıfını kapatıyor —
  yalnızca o tek örneği değil. 21 registry'yi dolaşıp mutable alanları **kimlik** üzerinden
  karşılaştırıyor: aynı diziyi ya da nesneyi tutan iki girdi, kaynak nasıl görünürse görünsün,
  hatanın kendisi. `Creature()` düzeltmesinden sonra tarandı: tek bir paylaşım kaldı ve o
  kasıtlı — oyuncunun on boş ekipman yuvasının hepsi `eqp.dummy`'yi tutuyor, "hiçbir şey takılı
  değil"in yerine geçen tek bir nesne. Bu, süzgeçle sessizce gizlenmek yerine denetimde izinli
  bir durum olarak adlandırıldı; ve yalnızca dummy atıl kaldığı sürece güvenli olduğu için
  denetimin ikinci yarısı `eqp.dummy`'nin `str` 0, `int` 0 ve `aff` ile `cls`'inin sıfır
  olmasını zorunlu kılıyor.
- Taramanın **bulamadığını** da söylemeye değer, çünkü endişe bunun yaygın olmasıydı:
  `Creature()`'dan sonra başka hiçbir registry girdisi bir diğeriyle mutable nesne paylaşmıyor.
  Eşyaların, ekipmanların, yeteneklerin, efektlerin ve gerisinin yapıcıları kendi dizilerini
  kuruyor. Hata tek satırdı, ve denetim orada, çünkü tek satır yeterli.
- `npm run check` artık `package.json` içinde `&&` ile birleştirilmiş on yedi komut değil,
  `scripts/check.js`. O satır 492 karakterdi ve maliyeti düzenlilikten fazlaydı: bir adım
  eklemek bir dizgeyi düzenlemek demekti, bir hata on yediden hangisi olduğuna dair hiçbir şey
  söylemiyordu, ve zamanın nereye gittiğini kimse bildirmiyordu. Artık her adımın bir adı ve
  tek satırlık bir gerekçesi var, koşucu başarısız adımı adıyla söylüyor ve yalnızca onu
  yeniden çalıştıracak komutu yazıyor, özet de en yavaş üçünü bildiriyor. On yedi adım, 15,3
  saniye, bunun 8,1'i Prettier.
- Sıra bilinçli ve dosyada yazılı: paket, onu yükleyecek hiçbir şeyden önce ayrıştırılabilmeli;
  sonra oyunu okuyan denetimler en ucuzdan başlayarak, ki bozuk bir registry yavaş bir adım
  başlamadan bildirilsin; sonra davranış testleri; ve en sonda lint ile biçimlendirme — gerçek
  bir kusur, eksik bir noktalı virgülden **sonra** bildirilmemeli.
  `npm run check -- --only=combat` adı eşleşen adımları çalıştırıyor.
- Eski zincirin çağırdığı dört `test:*` script'i `package.json`'dan kalktı. Zincirlenmek için
  vardılar; koşucu doğrudan `node --test` çağırıyor ve ne dokümanlar ne workflow onlara referans
  veriyordu.

- Pages workflow'unda `actions/setup-node` v6'dan v7'ye alındı. Bir sürüm geride kalmasının bir
  sebebi yoktu: `checkout`, `configure-pages`, `upload-pages-artifact` ve `deploy-pages` zaten
  en son major'daydı, `setup-node` öylece kalmıştı. Değiştirmeden önce kontrol edildi, varsayılmadı
  -- `git ls-remote`'tan gelen gerçek etiket listesi v7'nin güncel olduğunu doğruluyor ve v7
  README'sindeki tek göç notu içeride ESM'e geçiş; `node-version: 24` ile `cache: npm` aynen
  davranıyor.

- Kaydet çubuğu depoya bağlantı veriyor; changelog'u açan sürüm numarasının yanında. Bir `<a>`,
  `target="_blank"` ve `rel="noopener noreferrer"` ile -- ikinci yarı önemli, çünkü bu bağlantı
  siteden çıkıyor ve referrer, oyuncunun bulunduğu sayfanın yayın yolunu üçüncü bir tarafa
  verirdi. Yeni sekmede açılması da süs değil: yerinde takip etmek kaydedilmemiş bir oyunu
  terk etmek olurdu.
- URL pakete yazıldı, çünkü sayfa onu türetemiyor -- `document.baseURI` GitHub değil Pages
  sunucusunu veriyor -- bu yüzden `package.json` bir `repository` alanı kazandı ve
  `check-game-regressions.js` ikisinin uyuşmasını zorunlu kılıyor. Depo yeniden adlandırıldığında
  yayın URL'inin sahip olmadığı koruma tam bu: dört doküman elle bulunup düzenlendi ve biri
  atlanmış olsa hiçbir şey hata vermezdi.
- İki bağlantı artık altı çizili olmak için `.sl_link` sınıfını paylaşıyor; sürüm bağlantısı bunu
  satır içi stil olarak taşıyordu -- tek örnek olmaktan çıkan bir şeyin başına gelen şey.
- İki taraftan da korunuyor. Statik denetim URL'i `package.json`'a karşı sabitliyor ve `rel` ile
  `target`'ı zorunlu kılıyor; `tests/probes/save-bar-links.js` bağlantının çubuğun içinde,
  onunla birlikte görünür, odaklanabilir, altı çizili ve ham bir çeviri anahtarı değil oyuncunun
  dilinde etiketli olduğunu kontrol ediyor. İki yarının da bozulduğunda kırıldığı doğrulandı.

- `scripts/report-pending.js`, `PROPOSALS.md` ve `status.md` içinde kayıtlı bekleyen işin hâlâ
  bekliyor olup olmadığını ölçüyor — belgeyi okuyarak değil, oyuna sorarak. `npm run pending`.
  Var olma sebebi: sahibinin iki isteğinin aylar önce yayınlanmış olduğu çıktı ve bu yalnızca
  koda önce bakıldığı için yakalandı. Kayıtlı bir liste sessizce çürür ve bedeli bir işi iki kez
  yapmaktır.
- Bir denetim değil rapor: bekleyen iş bir başarısızlık değil, o yüzden iş bulduğu için asla
  sıfırdan farklı çıkmıyor. Yalnızca bir iddia hiç ölçülemediğinde çıkıyor, çünkü raporun artık
  değerlendiremediği bir iddia, listenin yeniden çürümesinin tam yolu.
- Kayıtlı on iki iddianın tamamına karşı çalıştırıldı ve hepsi hâlâ doğru — yani liste güncel.
  Ama aynı zamanda **yanlış kaydedilmiş dört sayıyı** yakaladı, ki bu da onun öbür işi. Verme
  yolu olmayan unvan: 108'in 23'ü, 26 değil. Kaynağı olmayan kalkan: 17'nin 11'i, 7 değil.
  Kaynağı olmayan iyileştirme eşyası: dört tane — `lifedr`, `hptn2`, `hptn3`, `hptn4` — yalnızca
  `hptn2` değil. Hiçbir şey vermeyen eğitilebilir yetenek: 29, 32 değil. Dördü de iki dilde
  düzeltildi.
- Kendi ölçümlerinden ikisi ilk seferde yanlıştı ve bunu böyle kaydetmeye değer. `recipe.give`
  ile `vendor.stock` okuyordu; oyunun alanları `recipe.res` ve `vendor.items` -- `stock`,
  yeniden stoklamanın çalışma anında doldurduğu şey ve yeni yüklenmiş bir oyunda boş. Bu, ilk
  çalıştırmanın 17 kalkanın ve altı iyileştirme eşyasının hiç kaynağı olmadığını iddia etmesine
  yol açtı; birini var olmayan bir sorunu düzeltmeye gönderecek bir iddia. Alan adlarını
  anlamlarından tahmin etmek yerine nesnelere karşı kontrol etmek düzeltti.

- `.gitattributes` başka bir projeyi tarif ediyordu. `dist/bundle.js` ve `dist/bundle.js.map`
  için attribute tanımlıyordu, ikisi de burada yok; yorumu "dist/ commit ediliyor, böylece oyun
  build adımı olmadan sunulabiliyor" diyordu, oysa `dist/` `.gitignore`'da ve CI tarafından
  yeniden kuruluyor; esbuild'e ve 730 KB minify edilmiş çıktıya atıf yapıyordu, bu proje ne
  minify ediyor ne esbuild kullanıyor; ve depoda olmayan bir dizin olan `resources/js/HackTimer/`
  için kurallar taşıyordu. Bu satırların hepsi hiçbir şey yapmıyordu.
- Yerine gelen şey, aynı dosyanın bu depoya karşı ölçülmüş hâli. `* text=auto eol=lf` satırı
  kalıyor ve artık burada neden önemli olduğunu söylüyor: geliştirme Windows'ta
  `core.autocrlf=true` ile yapılıyor, yani o satır olmadan checkout Prettier ile çelişiyor.
  Binary listesi gerçekten mevcut olan png, jpg, ico ve wav'ı kapsıyor; artı jpeg, gif, webp ve
  svg -- bu dördü bilinçli olarak listeli, çünkü sonradan eklenen bir görsel aksi hâlde
  normalizasyon kuralı tarafından sessizce bozulurdu ve bunu sonradan öğrenmek dört kullanılmayan
  satırdan pahalıdır. Fontlar kalktı: hiç yok.
- `package-lock.json` `-diff linguist-generated`'i koruyor ve artık attribute'u olan tek
  üretilmiş dosya; yanında `js/game.js` ile `dist/`'in neden hiçbirine ihtiyacı olmadığını
  söyleyen bir not var: ikisi de üretilmiş, ama ikisi de gitignore'lu.
- Varsayılmadı, doğrulandı: `git check-attr` bir stil sayfası, bir png, bir jpg ve lock dosyası
  için `text`/`diff`/`linguist-generated`'i doğru çözüyor, ve `git add --renormalize .` yeni
  kurallarla satır sonu çelişen hiçbir dosya bildirmiyor.

- Güney ormanı ile kuzey tarlaları süresiz av sahalarına kavuştu. `area.frstn9a2` ve `area.nfld3`,
  ikisi de `size -1` ve `protected`, `area.frstn9a1` ya da `area.nfld1` bir kez temizlenince
  açılıyor -- batı ormanının `area.frstn1a3` ve `global.flags.frstn1a3u` ile baştan beri sahip
  olduğu şeklin aynısı. Şimdiye kadar batı, oyunda tükenmeyen tek bölgeydi.
- Popülasyonları, sınırlı kardeşlerinin popülasyonları; değiştirilmedi. Bu tembellik değil bilinçli:
  süresiz bir alan oyuncunun grind yaptığı yer, dolayısıyla sunduğu dövüş bölgenin zaten kurduğu
  dövüş olmak zorunda. `check-combat.js` ikisini de aynı bütçeye karşı ölçüyor ve artık 66 değil
  71 popülasyon girdisi bildiriyor, hepsi bütçe içinde.
- İkisi de diğer bütün alanlardan **sonra** eklendi ve haklarındaki değiştirilmesi serbest olmayan
  tek şey bu: `save()` alan boyutlarını registry'yi `for...in` sırasıyla dolaşarak konumsal yazıyor,
  `load()` da indeksle geri okuyor. Sona değil başka bir yere eklenen bir alan, kendisinden sonraki
  her alanın kayıtlı boyutunu kaydırır -- var olan her kayıtta -- ve kaymış bir sayının hiçbir yeri
  yanlış görünmez. `tests/check-shared-state.js` bu yüzden artık registry'nin kuyruğunu adlarıyla
  sabitliyor; eklemek yerine araya sokmak, kayıtları sessizce bozmak yerine bir denetimi düşürüyor.
- Aynı denetim `size -1` olan her alanın `protected` olmasını zorunlu kılıyor, çünkü korumasız
  olan yeniden kurulabilir ve süresiz olmaktan çıkar. `area.tst`, `scripts/check-combat.js`'in onu
  dışlamasıyla aynı sebeple dışlandı: geliştirici tezgâhı.
- Kaynak olarak değil akış olarak doğrulandı: her sınırlı alanın `onEnd`'ini harness üzerinden
  çağırmak kilit bayrağını `false`'tan `true`'ya çeviriyor, ve iki süresiz alan da `z_bake`'ten
  spawn ağırlıkları kurulmuş hâlde çıkıyor.

- Üç süresiz saha daha: bağlanmış korkulukların arasında `area.nfld4`, işlenmiş damarda
  `area.mine4`, ve katakompların orta koridorlarında `area.cata6a`. v478.33'ten gelen ikisiyle
  birlikte, tükenmeyen bir yeri olan altı bölge -- haftanın başındaki bire karşı.
- Katakompların sahası bilinçli olarak sonlarına kurulmadı ve gerekçesi saklanmaya değer. Beş
  alanı 9-15, 13-19, 18-24, 21-27 ve 26-28 aralıklarında: ilk odadan son odaya on dokuz seviyelik
  bir tırmanış. En derinin üzerine kurulmuş bir saha yalnızca orayı çoktan bitirmiş bir oyuncuya
  hizmet ederdi; ilkinin üzerine kurulmuş olan birkaç seviyede değersizleşirdi. `area.cata6a`,
  `area.cata3a`'nın popülasyonunu (18-24) taşıyor ve katakomplar bitirildiğinde değil o koridor
  temizlendiğinde açılıyor -- yani ortaya ulaşmak onu kazandırıyor.
- Madenin sahası aynı gerekçeyi daha küçük ölçekte izliyor. Üç seviyesi 13-26 aralığında,
  dolayısıyla `area.mine4` `area.mine2`'nin popülasyonunu (16-24) taşıyor ve derin kesit
  temizlenince açılıyor: madeni bitirmek onu kazandırıyor, ama sunduğu dövüş bir üstteki
  seviyenin dövüşü, böylece yalnızca tepede değil dönüş yolunda da işe yarıyor.
- `area.nfld4` var, çünkü korkuluklar kendi başına bir dövüş. Tarlaların genel süresiz sahası olan
  `area.nfld3`'ün popülasyonunda hiç korkuluk yok -- yani "korkuluklara karşı süresiz avlanacak
  bir yer" tarlaların değil uzak tarlanın popülasyonunu gerektiriyordu.
- Akış olarak doğrulandı: beş sınırlı alanın her birinin `onEnd`'ini harness üzerinden çağırmak
  kilit bayrağını `false`'tan `true`'ya çeviriyor, ve `check-shared-state` registry'nin sonunda
  duran yedi süresiz alanı bildiriyor, hepsi `protected`.
- Kaydedilmeye değer bir hata, çünkü denetim onu mümkün olan en yararlı şekilde yakaladı. İki yeni
  sahne `sector.catacombs` ve `sector.mine`'a kaydedilmişti, ikisi de yok -- gerçek adlar
  `sector.cata1` ve `sector.north`. `addtosector` paket yüklenirken hata verdi, dolayısıyla oyunu
  yükleyen her denetim bir anda düştü ve `scripts/check.js` adımı adıyla söyledi. Bir registry
  anahtarını registry'yi okumak yerine anlamından tahmin etmek, bekleyen iş raporunun bir saat
  önce `vendor.stock` ile yaptığı hatanın aynısı.

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
