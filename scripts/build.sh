#!/bin/bash
set -e

COMMAND=$1

case $COMMAND in
  prep)
    npm run build:frontend
    export CARGO_TARGET_DIR="$PWD/build/target"
    cargo build --release --manifest-path src-tauri/Cargo.toml
    ;;
  deb)
    export CARGO_TARGET_DIR="$PWD/build/target"
    npm run tauri -- build --bundles deb
    mkdir -p build/packages
    cp build/target/release/bundle/deb/*.deb build/packages/
    ;;
  appimage)
    export CARGO_TARGET_DIR="$PWD/build/target"
    export APPIMAGE_EXTRACT_AND_RUN=1
    export NO_STRIP=1
    npm run tauri -- build --bundles appimage
    mkdir -p build/packages
    cp build/target/release/bundle/appimage/*.AppImage build/packages/
    ;;
  arch)
    export BUILDDIR="$PWD/build/makepkg"
    makepkg -sf --noconfirm
    mkdir -p build/packages
    mv *.pkg.tar.zst build/packages/
    ;;
  flatpak)
    # Require deb package to exist first
    if [ ! -f build/target/release/bundle/deb/*.deb ]; then
      echo "Debian paketi bulunamadı. Önce build:deb çalıştırılıyor..."
      $0 deb
    fi
    mkdir -p build/flatpak
    DEB_PATH=$(ls build/target/release/bundle/deb/*.deb | head -n 1)
    cp "$DEB_PATH" build/flatpak/application.deb
    flatpak-builder --state-dir=build/flatpak/.flatpak-builder --force-clean --repo=build/flatpak/repo build/flatpak/build-dir tr.herzane.focus.yml
    VERSION=$(node -p "require('./package.json').version")
    flatpak build-bundle build/flatpak/repo build/packages/Focus-v${VERSION}.flatpak tr.herzane.focus
    ;;
  all)
    $0 prep
    export CARGO_TARGET_DIR="$PWD/build/target"
    export APPIMAGE_EXTRACT_AND_RUN=1
    export NO_STRIP=1
    npm run tauri -- build --bundles deb,appimage
    mkdir -p build/bin build/packages
    cp build/target/release/focus-app build/bin/
    cp build/target/release/bundle/deb/*.deb build/packages/
    cp build/target/release/bundle/appimage/*.AppImage build/packages/
    $0 arch
    $0 flatpak
    ;;
  *)
    echo "Kullanım: $0 {prep|deb|appimage|arch|flatpak|all}"
    exit 1
    ;;
esac
