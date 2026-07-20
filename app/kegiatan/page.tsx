"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Tilt from "@/components/Tilt";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthProvider";
import { HARI_LIST, Kegiatan, Matkul } from "@/lib/types";
import { motion } from "framer-motion";

const JENIS_LABEL: Record<string, string> = { kegiatan: "Kegiatan", tugas: "Tugas", pr: "PR" };
const STATUS_COLOR: Record<string, string> = {
  belum: "text-paper/40 border-ink-line",
  proses: "text-amber border-amber/40",
  selesai: "text-teal border-teal/40",
};

export default function KegiatanPage() {
  const { session } = useAuth();
  const [list, setList] = useState<Kegiatan[]>([]);
  const [matkul, setMatkul] = useState<Matkul[]>([]);
  const [filterHari, setFilterHari] = useState<string>("Semua");
  const [form, setForm] = useState({
    judul: "",
    jenis: "kegiatan" as Kegiatan["jenis"],
    hari: "Senin",
    matkul_id: "",
  });

  async function load() {
    if (!session) return;
    const uid = session.user.id;
    const [k, m] = await Promise.all([
      supabase.from("kegiatan").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("matkul").select("*").eq("user_id", uid),
    ]);
    setList((k.data as Kegiatan[]) || []);
    setMatkul((m.data as Matkul[]) || []);
  }

  useEffect(() => {
    load();
  }, [session]);

  async function tambah(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !form.judul) return;
    await supabase.from("kegiatan").insert({
      user_id: session.user.id,
      judul: form.judul,
      jenis: form.jenis,
      hari: form.hari,
      matkul_id: form.matkul_id || null,
      status: "belum",
    });
    setForm({ ...form, judul: "" });
    load();
  }

  async function ubahStatus(item: Kegiatan) {
    const urutan: Kegiatan["status"][] = ["belum", "proses", "selesai"];
    const next = urutan[(urutan.indexOf(item.status) + 1) % urutan.length];
    await supabase.from("kegiatan").update({ status: next }).eq("id", item.id);
    load();
  }

  async function hapus(id: string) {
    await supabase.from("kegiatan").delete().eq("id", id);
    load();
  }

  const filtered = filterHari === "Semua" ? list : list.filter((k) => k.hari === filterHari);

  return (
    <AppShell>
      <p className="eyebrow mb-1">03 · Kerjakan</p>
      <h1
        className="font-display italic text-4xl mb-8"
        style={{
          background: "linear-gradient(100deg, #F6F3EC, #A6A9FF 55%, #38E1B5)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Kegiatan & Tugas
      </h1>

      <form onSubmit={tambah} className="jk-glass rounded-2xl p-5 mb-6 flex flex-col md:flex-row gap-3" style={{ boxShadow: "0 24px 50px -24px rgba(0,0,0,0.7)" }}>
        <input
          required
          placeholder="Tulis kegiatan, tugas, atau PR…"
          value={form.judul}
          onChange={(e) => setForm({ ...form, judul: e.target.value })}
          className="flex-1"
        />
        <select value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value as any })}>
          <option value="kegiatan">Kegiatan</option>
          <option value="tugas">Tugas</option>
          <option value="pr">PR</option>
        </select>
        <select value={form.hari} onChange={(e) => setForm({ ...form, hari: e.target.value })}>
          {HARI_LIST.map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>
        <select value={form.matkul_id} onChange={(e) => setForm({ ...form, matkul_id: e.target.value })}>
          <option value="">Tanpa mata kuliah</option>
          {matkul.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nama}
            </option>
          ))}
        </select>
        <button className="btn-primary shrink-0">Tambah</button>
      </form>

      <div className="flex gap-2 mb-5 overflow-x-auto">
        {["Semua", ...HARI_LIST].map((h) => (
          <button
            key={h}
            onClick={() => setFilterHari(h)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border ${
              filterHari === h
                ? "bg-indigo/15 border-indigo text-indigo-soft"
                : "border-ink-line text-paper/40"
            }`}
          >
            {h}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((item) => (
          <Tilt
            key={item.id}
            strength={3}
            className={`jk-glass rounded-2xl px-4 py-3 flex items-center justify-between border ${STATUS_COLOR[item.status]}`}
            style={{ boxShadow: "0 16px 32px -18px rgba(0,0,0,0.6)" }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => ubahStatus(item)}
                className="font-mono text-[0.65rem] uppercase px-2 py-1 rounded-md border border-current"
              >
                {item.status}
              </button>
              <div>
                <p className={`text-sm ${item.status === "selesai" ? "line-through text-paper/30" : "text-paper"}`}>
                  {item.judul}
                </p>
                <p className="text-[0.65rem] text-paper/30 font-mono mt-0.5">
                  {JENIS_LABEL[item.jenis]} · {item.hari}
                </p>
              </div>
            </div>
            <button onClick={() => hapus(item.id)} className="text-paper/20 hover:text-rose text-xs">
              Hapus
            </button>
          </Tilt>
        ))}
        {filtered.length === 0 && <p className="text-paper/30 text-sm">Tidak ada item.</p>}
      </div>
    </AppShell>
  );
}
