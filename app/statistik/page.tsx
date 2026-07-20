"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Tilt from "@/components/Tilt";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthProvider";
import { Kegiatan, Kehadiran, Matkul } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function StatistikPage() {
  const { session } = useAuth();
  const [matkul, setMatkul] = useState<Matkul[]>([]);
  const [kehadiran, setKehadiran] = useState<Kehadiran[]>([]);
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [form, setForm] = useState({ matkul_id: "", tanggal: "", status: "hadir" as Kehadiran["status"] });

  async function load() {
    if (!session) return;
    const uid = session.user.id;
    const [m, h, k] = await Promise.all([
      supabase.from("matkul").select("*").eq("user_id", uid),
      supabase.from("kehadiran").select("*").eq("user_id", uid),
      supabase.from("kegiatan").select("*").eq("user_id", uid),
    ]);
    setMatkul((m.data as Matkul[]) || []);
    setKehadiran((h.data as Kehadiran[]) || []);
    setKegiatan((k.data as Kegiatan[]) || []);
  }

  useEffect(() => {
    load();
  }, [session]);

  async function catatKehadiran(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !form.matkul_id || !form.tanggal) return;
    await supabase.from("kehadiran").insert({ ...form, user_id: session.user.id });
    setForm({ ...form, tanggal: "" });
    load();
  }

  const dataKehadiran = matkul.map((m) => {
    const catatan = kehadiran.filter((h) => h.matkul_id === m.id);
    const hadir = catatan.filter((c) => c.status === "hadir").length;
    const persen = catatan.length ? Math.round((hadir / catatan.length) * 100) : 0;
    return { nama: m.nama, persen, warna: m.warna, total: catatan.length };
  });

  const tugasList = kegiatan.filter((k) => k.jenis === "tugas" || k.jenis === "pr");
  const tugasSelesai = tugasList.filter((k) => k.status === "selesai").length;
  const persenTugas = tugasList.length ? Math.round((tugasSelesai / tugasList.length) * 100) : 0;

  const prList = kegiatan.filter((k) => k.jenis === "pr");
  const prSelesai = prList.filter((k) => k.status === "selesai").length;
  const persenPr = prList.length ? Math.round((prSelesai / prList.length) * 100) : 0;

  return (
    <AppShell>
      <p className="eyebrow mb-1">05 · Analisis</p>
      <h1
        className="font-display italic text-4xl mb-8"
        style={{
          background: "linear-gradient(100deg, #F6F3EC, #A6A9FF 55%, #38E1B5)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Statistik Perkuliahan
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <RingCard label="Tugas & PR selesai" persen={persenTugas} sub={`${tugasSelesai}/${tugasList.length}`} color="#F2B84B" />
        <RingCard label="PR selesai" persen={persenPr} sub={`${prSelesai}/${prList.length}`} color="#2FCBA3" />
        <RingCard
          label="Kehadiran rata-rata"
          persen={
            dataKehadiran.length
              ? Math.round(dataKehadiran.reduce((a, b) => a + b.persen, 0) / dataKehadiran.length)
              : 0
          }
          sub={`${kehadiran.filter((k) => k.status === "hadir").length}/${kehadiran.length} pertemuan`}
          color="#5B5FEF"
        />
      </div>

      <div className="jk-glass rounded-2xl p-6 mb-8" style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.7)" }}>
        <p className="eyebrow mb-4">Kehadiran per mata kuliah</p>
        <ResponsiveContainer width="100%" height={Math.max(200, dataKehadiran.length * 46)}>
          <BarChart data={dataKehadiran} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fill: "#F6F3EC55", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="nama" type="category" width={120} tick={{ fill: "#F6F3EC99", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#171A28", border: "1px solid #262A3D", borderRadius: 12, color: "#F6F3EC" }}
              formatter={(v: any) => [`${v}%`, "Kehadiran"]}
            />
            <Bar dataKey="persen" radius={[0, 8, 8, 0]}>
              {dataKehadiran.map((d, i) => (
                <Cell key={i} fill={d.warna} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {dataKehadiran.length === 0 && <p className="text-paper/30 text-sm">Belum ada data. Catat kehadiran di bawah.</p>}
      </div>

      <div className="jk-glass rounded-2xl p-5" style={{ boxShadow: "0 24px 50px -24px rgba(0,0,0,0.7)" }}>
        <p className="eyebrow mb-4">Catat kehadiran</p>
        <form onSubmit={catatKehadiran} className="flex flex-col md:flex-row gap-3">
          <select
            required
            value={form.matkul_id}
            onChange={(e) => setForm({ ...form, matkul_id: e.target.value })}
            className="flex-1"
          >
            <option value="">Pilih mata kuliah</option>
            {matkul.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nama}
              </option>
            ))}
          </select>
          <input
            type="date"
            required
            value={form.tanggal}
            onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
          />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
            <option value="hadir">Hadir</option>
            <option value="izin">Izin</option>
            <option value="sakit">Sakit</option>
            <option value="alpa">Alpa</option>
          </select>
          <button className="btn-primary shrink-0">Simpan</button>
        </form>
      </div>
    </AppShell>
  );
}

function RingCard({ label, persen, sub, color }: { label: string; persen: number; sub: string; color: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <Tilt strength={6} className="jk-glass rounded-2xl p-5 flex items-center gap-4" style={{ boxShadow: "0 20px 40px -20px rgba(0,0,0,0.6)" }}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} stroke="#262A3D" strokeWidth="8" fill="none" />
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (persen / 100) * c}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text x="40" y="45" textAnchor="middle" fill="#F6F3EC" fontSize="16" fontFamily="JetBrains Mono">
          {persen}%
        </text>
      </svg>
      <div>
        <p className="text-sm text-paper">{label}</p>
        <p className="text-xs text-paper/40 font-mono mt-1">{sub}</p>
      </div>
    </Tilt>
  );
}
