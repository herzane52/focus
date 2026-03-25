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

4. **Paketleri derlemek için:**

   **Hepsi bir arada (Tam build):**
   ```bash
   npm run build:all
   ```

   **İki aşamalı yapı:** Önce hazırlık yap, sonra istediğin paketi üret:
   ```bash
   # Aşama 1: Frontend + Rust hazırlığı (bir kez yap)
   npm run build:prep

   # Aşama 2: İstediyin paketi seç
   npm run build:deb        # Debian paketi
   npm run build:appimage   # AppImage
   npm run build:arch       # Arch Linux paketi
   ```

> [!TIP]
> Derleme çıktıları `build/` klasörü altında toplanır:
> - `build/dist/`: Frontend çıktıları
> - `build/bin/`: Ana çalıştırılabilir dosya
> - `build/target/`: Rust ara derleme dosyaları
> - `build/makepkg/`: Arch paketi geçici dosyaları
> - `build/packages/`: `.deb`, `.AppImage`, `.pkg.tar.zst`

## 📦 Kurulum Paketleri

Uygulamayı indirmek için [Releases](https://github.com/herzane/focus/releases) sayfasını kullanabilirsiniz.

- 🐧 **Debian/Ubuntu:** `.deb` uzantılı dosyayı indirin.
- 📦 **AppImage:** Herhangi bir kurulum gerektirmeden çalıştırılabilir sürüm.
- 🏔️ **Arch Linux:** `PKGBUILD` kullanarak veya AUR (ekleme planım var müsait bir zamanda) üzerinden kurabilirsiniz.

### İndirilen Dosyaları Kurma
- **.deb:** `sudo apt install ./dosya-adi.deb` komutuyla veya çift tıklayarak kurabilirsiniz(Genelde mağzaya yönlendirir kurulum için).
- **.AppImage:** Doğrudan çift tıklayarak çalıştırabilirsiniz. Eğer çalışmazsa; sağ tıklayıp Özellikler > İzinler > "Dosyayı bir program gibi çalıştırmaya izin ver" kutucuğunu işaretlemeniz yeterlidir.
- **.pkg.tar.zst (Arch):** `sudo pacman -U ./dosya-adi.pkg.tar.zst` komutuyla kurabilirsiniz.

### AUR Üzerinden Kurulum (Yakında)
> [!IMPORTANT]
> Şu an için sadece manuel derleme ve Github Releases üzerinden kurulum seçenekleri mevcuttur. AUR desteği test aşamasındadır.

```bash
# AUR'a eklendiğinde: müsait bir zaman olurda :)
yay -S focus
```

### Arch Linux (PKGBUILD) ile Kurulum
```bash
git clone https://github.com/herzane/focus.git
cd focus
makepkg -si
```

## Katkıda Bulunun

Bu benim Rust/Tauri ile ilk projem olduğu için geri bildirimleriniz ve katkılarınız çok değerlidir. Bir hata fark ederseniz veya bir özellik eklemek isterseniz lütfen bir çekme isteği (PR) gönderin veya bir hata kaydı (Issue) açın.
