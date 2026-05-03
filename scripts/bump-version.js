import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const packageJsonPath = path.join(rootDir, 'package.json');
const tauriConfPath = path.join(rootDir, 'src-tauri', 'tauri.conf.json');
const cargoTomlPath = path.join(rootDir, 'src-tauri', 'Cargo.toml');
const pkgbuildPath = path.join(rootDir, 'PKGBUILD');
const settingsModalPath = path.join(rootDir, 'src', 'components', 'SettingsModal.jsx');

const newVersion = process.argv[2];

if (!newVersion) {
  console.error("Lutfen yeni surumu belirtin. Ornek kullanim: npm run bump-version 1.3.5");
  process.exit(1);
}

console.log(`Surum guncelleniyor: ${newVersion}`);

try {
  // 1. Update package.json
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    pkg.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log("Guncellendi: package.json");
  } else {
    console.warn("Bulunamadi: package.json");
  }

  // 2. Update tauri.conf.json
  if (fs.existsSync(tauriConfPath)) {
    const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf-8'));
    tauriConf.version = newVersion;
    fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');
    console.log("Guncellendi: src-tauri/tauri.conf.json");
  } else {
    console.warn("Bulunamadi: src-tauri/tauri.conf.json");
  }

  // 3. Update Cargo.toml
  if (fs.existsSync(cargoTomlPath)) {
    let cargoToml = fs.readFileSync(cargoTomlPath, 'utf-8');
    cargoToml = cargoToml.replace(/^version\s*=\s*".*"/m, `version = "${newVersion}"`);
    fs.writeFileSync(cargoTomlPath, cargoToml);
    console.log("Guncellendi: src-tauri/Cargo.toml");
  } else {
    console.warn("Bulunamadi: src-tauri/Cargo.toml");
  }

  // 4. Update PKGBUILD
  if (fs.existsSync(pkgbuildPath)) {
    let pkgbuild = fs.readFileSync(pkgbuildPath, 'utf-8');
    pkgbuild = pkgbuild.replace(/^pkgver=.*$/m, `pkgver=${newVersion}`);
    fs.writeFileSync(pkgbuildPath, pkgbuild);
    console.log("Guncellendi: PKGBUILD");
  } else {
    console.warn("Bulunamadi: PKGBUILD");
  }

  // 5. Update SettingsModal.jsx
  if (fs.existsSync(settingsModalPath)) {
    let settings = fs.readFileSync(settingsModalPath, 'utf-8');
    settings = settings.replace(/v\d+\.\d+\.\d+/g, `v${newVersion}`);
    fs.writeFileSync(settingsModalPath, settings);
    console.log("Guncellendi: src/components/SettingsModal.jsx");
  } else {
    console.warn("Bulunamadi: src/components/SettingsModal.jsx");
  }

  // 6. Update lockfiles
  console.log("Kilit dosyalari (lockfiles) senkronize ediliyor...");
  try {
    execSync('npm install --package-lock-only', { cwd: rootDir, stdio: 'ignore' });
    console.log("Guncellendi: package-lock.json");
  } catch (err) {
    console.warn("Uyari: package-lock.json guncellenemedi.");
  }

  try {
    execSync('cargo check', { cwd: path.join(rootDir, 'src-tauri'), stdio: 'ignore' });
    console.log("Guncellendi: src-tauri/Cargo.lock");
  } catch (err) {
    console.warn("Uyari: src-tauri/Cargo.lock guncellenemedi.");
  }

  console.log("Tum dosyalar basariyla guncellendi.");
} catch (error) {
  console.error("Guncelleme sirasinda bir hata olustu:", error);
  process.exit(1);
}
