-- =========================================================
-- SKEMA DATABASE: JURNAL KULIAH
-- Jalankan file ini di Supabase SQL Editor (Project > SQL Editor)
-- =========================================================

-- Ekstensi UUID
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------
-- 1. MATA KULIAH
-- ---------------------------------------------------------
create table if not exists matkul (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  nama text not null,
  dosen text,
  sks int default 2,
  hari text not null check (hari in ('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu')),
  jam_mulai time not null,
  jam_selesai time not null,
  ruangan text,
  warna text default '#5B5FEF',
  semester int default 1,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- 2. KEGIATAN / TUGAS / PR (per hari, terhubung opsional ke matkul)
-- ---------------------------------------------------------
create table if not exists kegiatan (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  matkul_id uuid references matkul(id) on delete set null,
  judul text not null,
  jenis text not null check (jenis in ('kegiatan','tugas','pr')),
  hari text not null check (hari in ('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu')),
  tanggal date,
  deadline timestamptz,
  status text not null default 'belum' check (status in ('belum','proses','selesai')),
  catatan text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- 3. KEHADIRAN (presensi per pertemuan matkul)
-- ---------------------------------------------------------
create table if not exists kehadiran (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  matkul_id uuid references matkul(id) on delete cascade not null,
  tanggal date not null,
  status text not null check (status in ('hadir','izin','sakit','alpa')),
  pertemuan_ke int,
  semester int default 1,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- 4. KALENDER (hari-hari penting: UTS, UAS, deadline, libur, dll)
-- ---------------------------------------------------------
create table if not exists kalender (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  judul text not null,
  tanggal date not null,
  kategori text default 'umum' check (kategori in ('umum','ujian','deadline','libur','acara')),
  deskripsi text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- 5. SEMESTER (untuk rekap & label periode)
-- ---------------------------------------------------------
create table if not exists semester (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  nama text not null,
  tanggal_mulai date,
  tanggal_selesai date,
  aktif boolean default false,
  created_at timestamptz default now()
);

-- =========================================================
-- ROW LEVEL SECURITY: setiap pengguna hanya bisa akses datanya sendiri
-- =========================================================
alter table matkul enable row level security;
alter table kegiatan enable row level security;
alter table kehadiran enable row level security;
alter table kalender enable row level security;
alter table semester enable row level security;

create policy "matkul_own" on matkul for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "kegiatan_own" on kegiatan for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "kehadiran_own" on kehadiran for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "kalender_own" on kalender for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "semester_own" on semester for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- REALTIME: aktifkan broadcast perubahan tabel (untuk sinkron real-time)
-- =========================================================
alter publication supabase_realtime add table matkul;
alter publication supabase_realtime add table kegiatan;
alter publication supabase_realtime add table kehadiran;
alter publication supabase_realtime add table kalender;
alter publication supabase_realtime add table semester;
