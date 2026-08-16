# Repository değişiklik günlüğü

[English](CHANGELOG.md)

Bu dosya kod tabanı, mimari, araç, dokümantasyon ve deployment değişikliklerini
kaydeder. Oyuncuya dönük oyun içeriği ve sürüm notları
`changelog/changelog.html` dosyasında tutulur.

## [Yayınlanmamış]

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
- Otomatik kayıt yapılandırılabilir hale getirildi ve `proto23.autosave`
  tercihine taşındı. Aralık, hem düğmede hem yükleme yolunda tekrarlanan bir
  `30000` sabitiydi, bu yüzden hiçbir şey onu değiştiremiyordu; düğme ayrıca
  öncekini temizlemeden ikinci bir zamanlayıcı kuruyor ve yükleme yolu kutuyu
  yalnızca işaretliyordu. Artık tek bir `restartAutosave` yardımcısı, ayarlarda
  bir aralık satırı ve 15 saniyelik bir varsayılan var.
- Envanter paneli esnek sütun olarak yeniden kuruldu. `#inv_ctx_b` için hiç kural
  yoktu, bu yüzden `#inv_con` üzerindeki `height: 86%` çözülecek kesin bir üst
  yükseklik bulamıyordu ve uzun bir eşya listesi, mutlak konumlanmış sıralama
  çubuğunun arkasına doğru büyüyordu. Liste artık filtre ve sıralama çubukları
  arasındaki alanı birebir kaplıyor.
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
