# Jurnal Kuliah

Aplikasi web (bisa diinstal sebagai PWA di HP & laptop) untuk melacak aktivitas
perkuliahan mingguan (Senin–Minggu) secara real-time: daftar mata kuliah,
kegiatan/tugas/PR, kalender hari penting, statistik kehadiran & tugas, dan
rekap per semester. Mendukung banyak pengguna (login terpisah), data
tersimpan di cloud (Supabase) dan sinkron otomatis antar perangkat.

## 1. Siapkan Supabase (gratis)

1. Buat akun & project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor** → jalankan seluruh isi file `supabase/schema.sql`
   (ini membuat semua tabel, keamanan baris/RLS, dan realtime).
3. Buka **Project Settings → API** → salin `Project URL` dan `anon public key`.
4. (Opsional) di **Authentication → Providers**, matikan "Confirm email" saat
   development supaya tidak perlu verifikasi email tiap daftar akun baru.

## 2. Jalankan di komputer

```bash
npm install
cp .env.example .env.local
# isi .env.local dengan URL & anon key dari Supabase
npm run dev
```

Buka `http://localhost:3000`.

## 3. Deploy (Vercel — gratis)

1. Push folder ini ke GitHub.
2. Import repo di [vercel.com](https://vercel.com/new).
3. Saat setup, isi Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. Setelah selesai, buka link Vercel-nya lewat HP → menu browser →
   **"Add to Home Screen" / "Install App"** agar tampil seperti aplikasi asli.
   Di laptop (Chrome/Edge), klik ikon install di address bar.

## Struktur data

- `matkul` — daftar mata kuliah (hari, jam, dosen, ruangan, semester)
- `kegiatan` — kegiatan, tugas, dan PR per hari, dengan status belum/proses/selesai
- `kehadiran` — catatan hadir/izin/sakit/alpa per pertemuan mata kuliah
- `kalender` — hari-hari penting (ujian, deadline, libur, acara)
- `semester` — label semester untuk rekap

Semua tabel dilindungi Row Level Security: setiap pengguna hanya bisa
melihat & mengubah datanya sendiri, walau memakai satu database yang sama.
Perubahan data langsung tersinkron ke semua perangkat yang sedang login
lewat Supabase Realtime — tanpa perlu refresh halaman.

## Struktur halaman

- `/` — Ringkasan mingguan (ledger Senin–Minggu)
- `/matkul` — Kelola daftar mata kuliah
- `/kegiatan` — Kelola kegiatan, tugas, dan PR
- `/kalender` — Hari-hari penting
- `/statistik` — Persentase kehadiran & penyelesaian tugas/PR
- `/semester` — Rekap per semester
