# Budget Keluarga — WebApp + APK (Capacitor)

1 file HTML modern yang sudah jadi PWA, siap build APK via GitHub Actions.

## Struktur
```
budget-keluarga-webapp/
  www/
    index.html      ← file utama (dari Downloads/Budget Keluarga.html)
    manifest.json
    sw.js
    icon-192.png / icon-512.png
  capacitor.config.json
  package.json
  .github/workflows/android.yml
```

## Cara build APK di GitHub (kayak project kamu biasa)

1. **Buat repo baru di GitHub** (misal `budget-keluarga`)
2. **Push folder ini:**
   ```bash
   cd budget-keluarga-webapp
   git init
   git add .
   git commit -m "init budget keluarga"
   git branch -M main
   git remote add origin https://github.com/USERNAME/budget-keluarga.git
   git push -u origin main
   ```
3. Buka tab **Actions** → workflow **Build APK - Budget Keluarga** akan jalan otomatis
4. Setelah selesai → **Artifacts** → download `budget-keluarga-debug.apk` → install di HP

> Tidak perlu Android Studio lokal. Semua build jalan di Ubuntu runner GitHub.

## Test lokal (opsional)
```bash
cd budget-keluarga-webapp
npm install
npx cap add android
npx cap sync
npx cap open android   # buka di Android Studio kalau ada
```

## PWA
Sudah ada `manifest.json` + `sw.js` jadi bisa **Install** dari Chrome → Add to Home Screen, jalan offline.

## Ganti icon / warna
Edit `manifest.json` (theme_color) dan ganti `icon-*.png`. Config appId ada di `capacitor.config.json`.

## Signed Release (Play Store)
Tambahkan Secrets di GitHub: `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD` lalu uncomment step signed release di `android.yml`.
