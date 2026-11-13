# Petunjuk Install (Vercel + GitHub)

Website daftar tautan ini dihosting di Vercel, dan datanya disimpan di file `links.json` di repo GitHub. Tidak perlu database.

Alurnya: Anda mengubah daftar di halaman `/admin`, server kecil di Vercel menyimpan perubahan ke `links.json` di GitHub, lalu Vercel otomatis deploy ulang. Token GitHub disimpan di Vercel, tidak pernah tampil di halaman, jadi Anda tidak perlu mengisi user, repo, atau token di halaman admin. Cukup satu password.

## Isi paket

| File | Fungsi |
|------|--------|
| `index.html` | Halaman utama yang dilihat pengunjung |
| `admin/index.html` | Halaman admin, dibuka lewat `/admin` |
| `api/links.js` | Fungsi server yang menyimpan data ke GitHub |
| `links.json` | Data tautan (berisi contoh) |

Pertahankan struktur foldernya persis seperti di atas.

## 1. Upload ke GitHub

1. Buat repo baru di GitHub, misalnya `tautan` (boleh Private).
2. Upload semua file di atas, termasuk folder `admin` dan `api`.
3. Catat username GitHub, nama repo, dan nama branch (biasanya `main`).

## 2. Buat token GitHub

1. GitHub, lalu **Settings**, **Developer settings**, **Personal access tokens**, **Fine-grained tokens**, **Generate new token**.
2. **Repository access**: pilih **Only select repositories**, lalu pilih repo tadi saja.
3. **Repository permissions**: ubah **Contents** menjadi **Read and write**.
4. Klik **Generate token** dan salin tokennya. Token hanya tampil sekali.

Jangan tempel token di file mana pun dan jangan kirim ke siapa pun.

## 3. Hubungkan ke Vercel

1. Di [vercel.com](https://vercel.com), klik **Add New**, **Project**, lalu pilih repo tadi dan klik **Import**.
2. Sebelum klik **Deploy**, buka **Environment Variables** dan isi:

| Nama | Isi |
|------|-----|
| `GITHUB_TOKEN` | token dari langkah 2 |
| `GITHUB_OWNER` | username GitHub Anda |
| `GITHUB_REPO` | nama repo |
| `ADMIN_PASSWORD` | password admin buatan Anda (panjang dan sulit ditebak) |
| `GITHUB_BRANCH` | opsional, isi bila branch bukan `main` |
| `GITHUB_PATH` | opsional, isi bila nama file bukan `links.json` |

3. Klik **Deploy**.

Kalau Environment Variables diubah setelah deploy, buka **Deployments**, lalu **Redeploy** agar nilai baru terbaca.

## 4. Pakai halaman admin

1. Buka `https://NAMA-PROJECT.vercel.app/admin`.
2. Tambah atau ubah tautan, isi password admin, lalu klik **Simpan**.
3. Tunggu sekitar 1 menit sampai Vercel selesai deploy, lalu muat ulang halaman utama (Ctrl+F5).

Password disimpan di browser yang Anda pakai, jadi di browser lain Anda perlu mengetiknya sekali.

## Fitur halaman

- **Kategori**: isi kolom Kategori di admin. Di halaman utama muncul tab penyaring dan tautan dikelompokkan per kategori. Kolom boleh dikosongkan.
- **Logo website**: kartu menampilkan logo website tujuan, dan memakai huruf pertama kalau logo tidak bisa dimuat.
- **Urutan**: di admin, seret ikon titik di kiri baris, atau pakai tombol panah (cocok untuk HP). Panel Pratinjau di sebelah kanan ikut berubah.
- **Pintasan**: tekan `/` untuk langsung mencari, Enter untuk membuka hasil pertama, Esc untuk menghapus pencarian.
- **Sering dibuka**: empat tautan yang paling sering diklik muncul di bagian atas. Datanya tersimpan di browser masing-masing pengunjung, bukan di server.

## Masalah yang sering muncul

- **"Environment Variables di Vercel belum lengkap"**: ada variabel yang belum diisi, atau belum Redeploy setelah mengisi.
- **"Password salah"**: password tidak sama dengan `ADMIN_PASSWORD`.
- **"Gagal membaca repo (kode 404)"**: `GITHUB_OWNER` atau `GITHUB_REPO` salah, atau token belum diberi akses ke repo itu.
- **"Gagal menyimpan ke GitHub (kode 403)"**: izin **Contents** pada token belum **Read and write**, atau token sudah kedaluwarsa.
- **Perubahan belum tampil**: tunggu deploy Vercel selesai (lihat tab **Deployments**), lalu Ctrl+F5.
- **Halaman `/admin` tidak terbuka**: pastikan filenya ada di `admin/index.html`.

## Keamanan

- Alamat `/admin` bisa dibuka siapa saja, tetapi tanpa password tidak ada yang bisa menyimpan perubahan.
- Setelah beberapa kali salah password, server menahan respons agar sulit ditebak, tetapi tetap pakai password yang panjang.
- Kalau token pernah bocor, hapus di GitHub dan buat baru, lalu ganti nilai `GITHUB_TOKEN` di Vercel dan Redeploy.
- Kalau Anda ingin halaman admin tidak bisa dilihat orang lain sama sekali, aktifkan **Deployment Protection** di pengaturan Vercel, atau minta saya menambahkan kunci lain.
