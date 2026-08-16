# Ajan talimatları

[Canonical English version](AGENTS.md)

Bu dosya `AGENTS.md` kanonik proje referansının Türkçe çevirisidir. Bu repository
üzerinde çalışan tüm ajanlar `AGENTS.md` dosyasını izlemelidir. Kökteki
`AGENTS.md`, dosyayı kökte arayan ajan araçları çalışmaya devam etsin diye
bırakılmış bir yönlendirmedir. Başka bir `AGENTS.md` oluşturmayın. Talimat
değişikliklerini önce kanonik dosyada yapın, ardından bu çeviriyi eşitleyin.

## Proje sınırları

- Referans belgeler `docs/` altında tutulur. Kökte yalnızca `README.md`,
  `README.TR.md` ve `AGENTS.md` yönlendirmesi kalır.
- `changelog/changelog.html` yalnızca oyuncuya dönük oyun sürümlerini, içerik
  eklemelerini ve oyun değişikliklerini tutar. Oyun genelinde yapılan her
  geliştirme için buraya bir kayıt ekleyin.
- `docs/CHANGELOG.md` kod, mimari, araç, dokümantasyon ve deployment
  değişikliklerini tutar.
- `docs/ROADMAP.md` fork entegrasyon yol haritasını ve fazlarını tutar.
- `docs/STORY.md` görev zincirini, hikayenin bittiği noktayı ve yazılmış ama
  henüz erişilemeyen içeriği kaydeder. Hikaye içeriği eklendiğinde veya daha önce
  erişilemeyen bir sistem bağlandığında bu dosyayı güncelleyin.
- `README.md` İngilizce geliştirici rehberidir; `README.TR.md` Türkçe çevirisidir.
- `js/game.js` ve `dist/` üretilen çıktılardır; doğrudan düzenlenmez.

## Kaynak yapısı

- `css/`: kaynak stiller.
- `js/core/`: başlangıç, kayıt/yükleme ve oyuncu durumu.
- `js/data/`: oyun içeriği tanımları.
- `js/systems/`: oyun sistemleri.
- `js/ui/`: DOM ve render kodu.
- `js/utils/`: genel yardımcılar.
- `js/world/`: alanlar, sektörler ve konumlar.
- `locales/`: dil kayıt listesi ve JSON çeviri dosyaları.
- `scripts/`: build ve yayın çıktısı araçları.

## Zorunlu çalışma akışı

1. Düzenlemeyi üretilen dosyada değil ilgili kaynak dosyada yapın.
2. Oyuncuya veya geliştiriciye dönük değişikliği doğru changelog'a ekleyin.
3. İngilizce Markdown dosyalarıyla `.TR.md` çevirilerini eşit tutun.
4. `changelog/changelog.html` dahil desteklenen tüm repository dosyalarını
   Prettier ile biçimlendirmek için `npm run format` çalıştırın.
5. `npm run build` ile bundle ve `dist/` çıktısını yeniden üretin.
6. `npm run check` çalıştırın.
7. Chrome veya Chromium kullanılabiliyorsa `npm run test:browser` çalıştırın.
8. Her commit ve push öncesinde yayınlanan değişiklikler için hem oyuncuya dönük
   HTML changelog'u hem İngilizce/Türkçe repository changelog'larını güncelleyin.
9. Uygun olduğunda ilişkili değişiklikleri biriktirin. Kapsamlı veya yüksek riskli
   bir geliştirme aşamasına başlamadan önce mevcut kararlı partiyi tamamlayın,
   changelog dosyalarını güncelleyin, zorunlu testleri çalıştırın ve açıklayıcı bir
   checkpoint commit'i oluşturun. Bu, temiz checkpoint commit'leri için sürekli
   yetkidir. Repository sahibi son ve açık talimatını vermeden push yapmayın.
10. Her hata düzeltmesi ve davranış değişikliği için regresyon testi ekleyin veya
    güncelleyin. İlgili yükleme, önbellek, kayıt, dil veya arayüz senaryoları test
    edilmeden ya da testleri geçmeden deployment yapmayın.
11. Oyuncuya dönük metinler eklendiğinde veya değiştirildiğinde kalan ham
    metinler için ilgili kaynak grubunun tamamını tarayın, bunları
    `locales/en.json` ve `locales/tr.json` üzerinden geçirin ve taşınan kapsam
    için regresyon testi ekleyin.

## Uyumluluk kuralları

- Kayıt anahtarı, kayıt veri sırası ve Base64 uyumluluğu açık bir migration
  olmadan değiştirilmez.
- Kaynak dosyaların `scripts/build.js` içindeki sırası korunur; eski oyun global
  function-hoisting davranışına bağımlıdır.
- Global değişkenleri module scope'a taşımak veya strict mode açmak ayrı ve
  planlı bir migration gerektirir.
- Dosyaları UTF-8 tutun ve bozuk karakter kodlaması üretmeyin.
- Oyuncuya dönük her yeni veya değişen metin `locales/en.json` ve
  `locales/tr.json` üzerinden gelmeli, `i18n.t()` veya `i18n.get()` ile
  kullanılmalı ve çeviri anahtarı diller arasında korunmalıdır. JavaScript veya
  HTML içine oyuncuya dönük ham metin eklemeyin.
- Makine destekli çevirileri; özellikle kısaltmalar, takvim terimleri, yönler,
  istatistikler, ekipmanlar ve kısa ya da çok anlamlı etiketler için dili bilen bir
  ajana bağlamsal olarak denetletin. Kaynak kısaltmanın bağlamdaki anlamını çevirin;
  onu ilgisiz bir sözlük anlamına genişletmeyin.
- Yalnızca toplu makine destekli çevirileri değil, her yeni veya değişen dil
  anahtarını dili bilen bir ajana bağlamsal olarak denetletin.
- Yerleşik Türkçe oyun terimlerini sabit tutun. `perk` terimini “Avantaj” olarak
  çevirin; beceriler panelinin zaten kullandığı “Yetenek” karşılığını kullanmayın.
- Türkçe eylem etiketlerini isim-fiil değil, emir kipiyle yazın. Türkçede
  `-ma`/`-me` eki hem isim-fiil hem olumsuz emir olduğu için, isim-fiil olarak
  çevrilen bir menü girdisi “bunu yapma” talimatı gibi okunur: “Satın alma”
  ifadesi “satın alma!” diye anlaşılır, doğrusu “Satın al” olur. Her eylem
  etiketini, düğmeyi ve seçeneği bu çakışmaya karşı kontrol edin.
- Diyalog ve eylem etiketlerini kaynak koddaki sahne, komşu mesajlar ve eylemin
  oyun içindeki sonucuyla birlikte inceleyin. Etkileşim ifadeye daha dar bir anlam
  veriyorsa tek başına sözlük çevirisini onaylamayın; yüksek riskli düzeltmeleri
  çeviri beklentisi testlerine sabitleyin.
- Cümle yapısını da bu bağlamsal denetimin parçası olarak değerlendirin: özne ve
  nesne rollerini, sözcük sırasını, tonu ve placeholder'ların çevresindeki metinle
  nasıl birleştiğini doğrulayın. Bir token'ı korumak, ekranda oluşan cümle dil
  bilgisi açısından bozuksa yeterli değildir. Örneğin `{fuel}` içeren bir şömine
  mesajı, yerine eklenen her yakıt değeriyle doğal okunmalıdır; bu yaklaşımı
  yalnızca bu örneğe değil placeholder kullanan tüm metinlere uygulayın.
- Bir çeviri anahtarının arayüzde, mesaj günlüğünde, tooltip'te, hover içeriğinde
  veya oyuncuya dönük başka bir yüzeyde olduğu gibi görünmesini hata kabul edin.
  Bunu fallback testleri, dil şeması/anahtar eşliği testleri ve etkilenen yüzeyi
  çalıştıran tarayıcı testleriyle engelleyin.
- Tamamlanmış geniş bir yerelleştirme denetimi yalnızca o anın görüntüsüdür.
  Sonraki her kaynak veya dil değişikliği, etkilediği kapsamın denetlenmiş
  durumunu geçersiz kılar; bu kapsamı yeniden tarayın ve bağlamıyla inceleyin.
  Önceki 2.177 dil girdisi ve 255 ham metin denetimi kalıcı bir tamamlanma
  kilometre taşı değil, bu tekrar eden iş akışının gerekçesidir.
- Yeni dil dosyalarını `locales/manifest.json` içine kaydedin; eksik çeviriler
  İngilizce fallback kullanabilir.
- Davranış değişikliklerini yalnızca kullanıcı talebi kapsamındaysa yapın.
- Hata düzeltmeleri, özellikler veya oyuncuya dönük eklemeler içeren anlamlı yayın
  kilometre taşlarında tam sayı oyun sürümünü artırın ve
  `changelog/changelog.html` başına eşleşen bir `öncekiーgüncel` bölümü ekleyin.
  Her küçük değişiklik için yeni sürüm oluşturmak yerine birbiriyle ilişkili ufak
  düzeltmeleri ve arayüz iyileştirmelerini mevcut sürüm kaydında biriktirin. Basit
  dokümantasyon, formatlama veya yalnızca ifade değişiklikleri sürüm artışı
  gerektirmez.
- Arayüz değişikliklerini mümkün olduğunca sabit yerleşimli oyunun tamamını
  ekranda tutacak şekilde tasarlayın ve küçük ekran boyutlarında test edin.
- Repository sahibine Türkçe cevap verin. Forklarda mevcut kullanıcının dil
  tercihini izleyin.

- Türkçe oyun sözlüğünü tutarlı kullanın: oynanıştaki `perk` terimini adlarda,
  açıklamalarda ve kilit açma mesajlarında `avantaj` değil `yetenek` olarak
  çevirin.

## Deployment

- GitHub Pages kaynağı GitHub Actions olmalıdır.
- `main` dalına push, `.github/workflows/deploy-pages.yml` akışını tetikler.
- Yalnızca `dist/` Pages artifact'i olarak yüklenir.
- Bakımı yapılan yayın `https://kuroiteiken.github.io/23html.github.io/`, upstream
  yayın ise `https://23html.github.io/` adresindedir.
- Dahili bağlantılar hem alan adı kökünde hem GitHub Pages proje alt yolunda
  çalışmalıdır. `/changelog/...` gibi köke göre yolları sabit kodlamayın; belge
  tabanını dikkate alan veya göreli bir URL kullanın.
- Tarayıcı önbelleğinin farklı sürümlere ait HTML, JavaScript, CSS ve dil
  dosyalarını karıştırmaması için deployment asset sürümlemesini koruyun.
