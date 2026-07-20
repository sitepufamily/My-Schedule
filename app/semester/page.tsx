"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Tilt from "@/components/Tilt";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthProvider";
import { Kegiatan, Kehadiran, Matkul, Semester } from "@/lib/types";
import { motion } from "framer-motion";

export default function SemesterPage() {
  const { session } = useAuth();
  const [semesterList, setSemesterList] = useState<Semester[]>([]);
  const [matkul, setMatkul] = useState<Matkul[]>([]);
  const [kehadiran, setKehadiran] = useState<Kehadiran[]>([]);
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [namaBaru, setNamaBaru] = useState("");

  async function load() {
    if (!session) return;
    const uid = session.user.id;
    const [s, m, h, k] = await Promise.all([
      supabase.from("semester").select("*").eq("user_id", uid).order("created_at"),
      supabase.from("matkul").select("*").eq("user_id", uid),
      supabase.from("kehadiran").select("*").eq("user_id", uid),
      supabase.from("kegiatan").select("*").eq("user_id", uid),
    ]);
    setSemesterList((s.data as Semester[]) || []);
    setMatkul((m.data as Matkul[]) || []);
    setKehadiran((h.data as Kehadiran[]) || []);
    setKegiatan((k.data as Kegiatan[]) || []);
  }

  useEffect(() => {
    load();
  }, [session]);

  async function tambahSemester(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !namaBaru) return;
    await supabase.from("semester").insert({ user_id: session.user.id, nama: namaBaru });
    setNamaBaru("");
    load();
  }

  function rekapUntuk(semesterKe: number) {
    const mkList = matkul.filter((m) => m.semester === semesterKe);
    const mkIds = mkList.map((m) => m.id);
    const hadirList = kehadiran.filter((h) => mkIds.includes(h.matkul_id));
    const hadir = hadirList.filter((h) => h.status === "hadir").length;
    const persenHadir = hadirList.length ? Math.round((hadir / hadirList.length) * 100) : 0;
    const totalSks = mkList.reduce((a, m) => a + m.sks, 0);
    return { mkList, persenHadir, totalSks, totalPertemuan: hadirList.length };
  }

  const semesterAngka = Array.from(new Set(matkul.map((m) => m.semester))).sort((a, b) => a - b);

  return (
    <AppShell>
      <p className="eyebrow mb-1">06 · Arsip</p>
      <h1
        className="font-display italic text-4xl mb-8"
        style={{
          background: "linear-gradient(100deg, #F6F3EC, #A6A9FF 55%, #38E1B5)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Rekap Semester
      </h1>

      <form onSubmit={tambahSemester} className="jk-glass rounded-2xl p-5 mb-8 flex gap-3" style={{ boxShadow: "0 24px 50px -24px rgba(0,0,0,0.7)" }}>
        <input
          placeholder="Beri label semester (mis. Semester 3 — Ganjil 2026)"
          value={namaBaru}
          onChange={(e) => setNamaBaru(e.target.value)}
          className="flex-1"
        />
        <button className="btn-primary shrink-0">Simpan label</button>
      </form>

      {semesterList.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {semesterList.map((s) => (
            <span key={s.id} className="text-xs px-3 py-1.5 rounded-full border border-ink-line text-paper/50">
              {s.nama}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {semesterAngka.map((sk) => {
          const rekap = rekapUntuk(sk);
          return (
            <Tilt strength={5} key={sk} className="jk-glass rounded-2xl p-6" style={{ boxShadow: "0 24px 50px -24px rgba(0,0,0,0.7)" }}>
              <p className="eyebrow mb-1">Semester {sk}</p>
              <p className="font-display italic text-2xl text-paper mb-4">
                {rekap.totalSks} SKS · {rekap.mkList.length} mata kuliah
              </p>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-paper/50">Rata-rata kehadiran</span>
                <span className="font-mono text-indigo-soft">{rekap.persenHadir}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-ink-line overflow-hidden mb-4">
                <div
                  className="h-full bg-indigo transition-all duration-700"
                  style={{ width: `${rekap.persenHadir}%` }}
                />
              </div>
              <ul className="flex flex-col gap-1.5">
                {rekap.mkList.map((m) => (
                  <li key={m.id} className="text-xs text-paper/50 flex justify-between">
                    <span>{m.nama}</span>
                    <span className="font-mono">{m.sks} sks</span>
                  </li>
                ))}
              </ul>
            </Tilt>
          );
        })}
        {semesterAngka.length === 0 && (
          <p className="text-paper/30 text-sm">
            Tambahkan mata kuliah dengan nomor semester untuk melihat rekap di sini.
          </p>
        )}
      </div>
    </AppShell>
  );
}
