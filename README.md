![Focus Logo](image.png)

<div align="center">
  <img src="https://img.shields.io/badge/Tauri-24C8DB?style=for-the-badge&logo=tauri&logoColor=white" alt="Tauri">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</div>

Focus, Rust (Tauri) ve Typescript (Vite, React, Tailwindcss) kullanılarak geliştirilmiş, ders çalışma takip uygulamasıdır. Çözdüğünüz soru sayılarını ve günlük hedeflerinizi şık bir arayüzle takip etmenizi sağlar.


##  Özellikler

- 📅 **Gelişmiş Takvim:** Günlük çalışma verilerini görselleştirin.
- 📊 **İstatistikler:** Ders ve konu bazlı soru sayıları ve ilerleme takibi.
- 📋 **Planlama:** Gelecek günler için ders programı ve girilen sınav tarihine kadar hedef belirleme.
- 🎨 **Modern Arayüz:** Akıcı animasyonlar ve şık tasarım.

## 📦 İndirme ve Kurulum

Programı kullanmaya başlamak için en kolay yol, derlenmiş paketleri indirmektir.

1. **GitHub Releases:** En güncel kararlı sürümleri [Releases](https://github.com/herzane52/focus/releases) sayfasından indirebilirsiniz. Kurulum talimatları sayfada yer almaktadır.

### Desteklenen Paketler
- 🐧 **Debian/Ubuntu:** `.deb` paketi.
- 📦 **Flatpak:** Tüm Linux dağıtımlarında çalışabilen `.flatpak` taşınabilir paket seçeneği. (Flatpak, uygulamanın çalışması için gerekli olan tüm bağımlılıkları kendi içinde barındırır.)
- 📦 **AppImage:** (Geçici olarak GitHub Releases üzerinden kaldırılmıştır. Çalışma sorunları çözülene kadar sadece yerel olarak derlenebilir.)
- 🏔️ **Arch Linux:** Hazır paketi indirebilir veya PKGBUILD ile kendiniz paketleyebilirsiniz.

## 🛠️ Geliştirme ve Kaynak Koddan Derleme

Eğer projeye katkıda bulunmak veya en güncel geliştirme sürümünü denemek isterseniz aşağıdaki adımları takip edebilirsiniz.

### Gereksinimler

- [Node.js](https://nodejs.org/) (npm ile birlikte)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)

### Kurulum ve Çalıştırma

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/herzane52/focus.git
   cd focus
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Test etmek amacıyla geliştirme modunda çalıştırın:
   ```bash
   npm run tauri dev
   ```

### Paketleme (Build)

Uygulamayı kendiniz paketlemek isterseniz iki yöntemden birini kullanabilirsiniz:

#### Yöntem A: İki Aşamalı Yapı (Önerilen)

Bu yöntemde önce **hazırlık** adımını **bir kez** çalıştırırsınız; ardından ihtiyacınıza göre sadece istediğiniz paketi üretirsiniz. Bu sayede aynı build'i birden fazla kez tekrarlamak zorunda kalmazsınız.

1.  **Aşama 1: Hazırlık (Bir kez yapılması yeterlidir)**
    ```bash
    npm run build:prep
    ```

> [!TIP]
> `build:deb`, `build:appimage` ve `build:arch` scriptleri `build:prep`'i **içermez**. Hazırlık adımını atlamamaya dikkat edin.

2.  **Aşama 2: İstediğiniz paketi ayrı ayrı üretin**
    - **Debian paketi:**
      ```bash
      npm run build:deb
      ```
    - **AppImage:**
      ```bash
      npm run build:appimage
      ```
    - **Arch Linux:**
      ```bash
      npm run build:arch
      ```
    - **Flatpak:**
      ```bash
      npm run build:flatpak
      ```



#### Yöntem B: Hepsi Bir Arada (Tam Build)

Tüm paketleri tek komutla üretmek için (hazırlık adımı dahil otomatik çalışır):
```bash
npm run build:all
```

> [!TIP]
> Derleme çıktıları `build/packages/` klasörü altında toplanır. Paketi oluşturduktan sonra kurulum için [Releases](https://github.com/herzane52/focus/releases) sayfasındaki talimatları takip edebilirsiniz.

## Katkıda Bulunun

Bu benim Rust/Tauri ile ilk projem olduğu için geri bildirimleriniz ve katkılarınız çok değerlidir. Bir hata fark ederseniz veya bir özellik eklemek isterseniz lütfen bir çekme isteği (PR) gönderin veya bir hata kaydı (Issue) açın.
