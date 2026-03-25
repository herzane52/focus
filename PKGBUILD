# Maintainer: Herzane <trkaraca@proton.me>
pkgname=focus
pkgver=1.2.0
pkgrel=1
pkgdesc="Profesyonel Takip ve Odaklanma Uygulaması"
arch=('x86_64')
url="https://github.com/herzane/focus"
license=('MIT')
depends=(
    'gtk3'
    'webkit2gtk-4.1'
    'libayatana-appindicator'
    'librsvg'
)
provides=("$pkgname")
conflicts=("$pkgname")

# Yerel binary'den paket oluşturur (önceden `npm run build:prep` komutu çalıştırılmış olmalı)
source=()
sha256sums=()

build() {
    : # Derleme adımı yok - binary zaten oluşturuldu
}

package() {
    local _srcdir="$startdir/build/target/release"
    local _bundledir="$_srcdir/bundle"

    # Ana binary
    install -Dm755 "$_srcdir/focus-app" "$pkgdir/usr/bin/focus"

    # .desktop dosyası (DEB paketinden alınır)
    if [ -d "$_bundledir/deb" ]; then
        local _deb="$_bundledir/deb/Focus_${pkgver}_amd64.deb"
        if [ -f "$_deb" ]; then
            mkdir -p "$srcdir/deb-extract"
            ar x "$_deb" --output="$srcdir/deb-extract"
            tar -xf "$srcdir/deb-extract/data.tar"* -C "$srcdir/deb-extract"
            # desktop dosyası
            if find "$srcdir/deb-extract" -name "*.desktop" | grep -q .; then
                find "$srcdir/deb-extract" -name "*.desktop" -exec install -Dm644 {} \
                    "$pkgdir/usr/share/applications/focus.desktop" \;
                sed -i "s/^Exec=.*/Exec=focus/g" "$pkgdir/usr/share/applications/focus.desktop"
            fi
            # ikonlar
            if [ -d "$srcdir/deb-extract/usr/share/icons" ]; then
                cp -r "$srcdir/deb-extract/usr/share/icons" "$pkgdir/usr/share/"
            fi
        fi
    fi

    # Fallback: basit .desktop dosyası
    if [ ! -f "$pkgdir/usr/share/applications/focus.desktop" ]; then
        install -Dm644 /dev/stdin "$pkgdir/usr/share/applications/focus.desktop" <<EOF
[Desktop Entry]
Name=Focus
Comment=Profesyonel Takip ve Odaklanma Uygulaması
Exec=focus
Icon=focus
Terminal=false
Type=Application
Categories=Office;Productivity;
EOF
    fi
}
