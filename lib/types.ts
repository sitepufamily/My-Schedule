export type Matkul = {
  id: string;
  nama: string;
  dosen: string | null;
  sks: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  ruangan: string | null;
  warna: string;
  semester: number;
};

export type Kegiatan = {
  id: string;
  matkul_id: string | null;
  judul: string;
  jenis: "kegiatan" | "tugas" | "pr";
  hari: string;
  tanggal: string | null;
  deadline: string | null;
  status: "belum" | "proses" | "selesai";
  catatan: string | null;
};

export type Kehadiran = {
  id: string;
  matkul_id: string;
  tanggal: string;
  status: "hadir" | "izin" | "sakit" | "alpa";
  pertemuan_ke: number | null;
  semester: number;
};

export type KalenderItem = {
  id: string;
  judul: string;
  tanggal: string;
  kategori: "umum" | "ujian" | "deadline" | "libur" | "acara";
  deskripsi: string | null;
};

export type Semester = {
  id: string;
  nama: string;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  aktif: boolean;
};

export const HARI_LIST = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];
