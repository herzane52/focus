# Focus 🎯

![Focus Logo](image.png)

Focus, Rust (Tauri) ve React kullanılarak geliştirilmiş, modern ve yüksek performanslı bir çalışma takip uygulamasıdır. Ders çalışma sürelerinizi, çözdüğünüz soru sayılarını ve günlük hedeflerinizi şık bir arayüzle takip etmenizi sağlar.

> [!NOTE]
> Bu proje, Electron'un ağır bellek kullanımına alternatif olarak Rust'ın gücünü kullanan bir performans denemesidir.

## Neden Rust & Tauri?

Geleneksel Electron uygulamaları (Visual Studio Code, Discord vb.) tipik olarak **1.2 GB+** RAM tüketirken, Rust(Tauri) aynı işlevi **~500 MB** civarında bir bellek kullanımıyla sunar. Bu, %50'den fazla performans artışı ve daha düşük sistem kaynağı tüketimi anlamına gelir.Her neyse projeye geri dönelim.

##  Özellikler

- 📅 **Gelişmiş Takvim:** Günlük çalışma verilerini görselleştirin.
- 📊 **İstatistikler:** Ders ve konu bazlı soru sayıları ve ilerleme raporları.
- 📋 **Planlama:** Gelecek günler için ders programı ve hedef belirleme.
- 🎨 **Modern Arayüz:** Şeffaf TitleBar, akıcı animasyonlar ve şık tasarım.
- ⚙️ **Kişiselleştirme:** Ayarlar menüsü üzerinden uygulama deneyimini yönetin.

## 🛠️ Kurulum ve Geliştirme

### Gereksinimler

- [Node.js](https://nodejs.org/) (npm ile birlikte)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)

### Kurulum

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/herzane52/focus.git
   cd focus
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Geliştirme modunda çalıştırın:
   ```bash
   npm run tauri dev
   ```

4. Üretim sürümünü (build) oluşturun:
   ```bash
   npm run tauri build
   ```
> [!IMPORTANT]
> Şu an için sadece **.deb** paketi (Debian/Ubuntu tabanlı sistemler için) desteği mevcuttur. Diğer platformlar için destek ileride eklenecektir.(Tamamen keyfi olarak belki eklemeyedebilirim.)



## Katkıda Bulunun

Bu benim Rust/Tauri ile ilk projem olduğu için geri bildirimleriniz ve katkılarınız çok değerlidir. Bir hata fark ederseniz veya bir özellik eklemek isterseniz lütfen bir çekme isteği (PR) gönderin veya bir hata kaydı (Issue) açın.
