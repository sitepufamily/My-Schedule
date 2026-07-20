"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Tilt from "@/components/Tilt";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthProvider";
import { HARI_LIST, Kegiatan, Matkul } from "@/lib/types";
import { motion } from "framer-motion";

function hariIni() {
  const idx = new Date().getDay(); // 0 = Minggu
  return HARI_LIST[(idx + 6) % 7];
}

export default function DashboardPage() {
  const { session } = useAuth();
  const [matkul, setMatkul] = useState<Matkul[]>([]);
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const today = hariIni();

  useEffect(() => {
    if (!session) return;
    const uid = session.user.id;

    async function load() {
      const [m, k] = await Promise.all([
        supabase.from("matkul").select("*").eq("user_id", uid),
        supabase.from("kegiatan").select("*").eq("user_id", uid),
      ]);
      setMatkul((m.data as Matkul[]) || []);
      setKegiatan((k.data as Kegiatan[]) || []);
    }
    load();

    const channel = supabase
      .channel("dashboard-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "matkul", filter: `user_id=eq.${uid}` }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "kegiatan", filter: `user_id=eq.${uid}` }, load)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const kegiatanHariIni = kegiatan.filter((k) => k.hari === today);
  const belumSelesai = kegiatan.filter((k) => k.status !== "selesai").length;

  return (
    <AppShell>
      <p className="eyebrow mb-1">Ringkasan · {today}</p>
      <h1
        className="font-display italic text-4xl mb-8"
        style={{
          background: "linear-gradient(100deg, #F6F3EC, #A6A9FF 55%, #38E1B5)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Apa yang terjadi minggu ini
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <StatChip label="Mata kuliah" value={matkul.length} delay={0} />
        <StatChip label="Item aktif" value={belumSelesai} accent="amber" delay={60} />
        <StatChip label="Hari ini" value={kegiatanHariIni.length} accent="teal" delay={120} />
        <StatChip label="Total kegiatan" value={kegiatan.length} delay={180} />
      </div>

      {/* Ledger mingguan — elemen signature */}
      <Tilt strength={3} className="jk-glass rounded-2xl overflow-x-auto jk-scroll" style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.7)" }}>
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="text-left text-paper/40 font-mono text-xs uppercase tracking-wider">
              {HARI_LIST.map((h) => (
                <th key={h} className={`px-4 py-3 ${h === today ? "text-indigo-soft" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="align-top border-t border-ink-line">
              {HARI_LIST.map((h) => {
                const items = kegiatan.filter((k) => k.hari === h);
                const kelas = matkul.filter((m) => m.hari === h);
                return (
                  <td key={h} className={`px-4 py-4 ${h === today ? "bg-indigo/5" : ""}`}>
                    <div className="flex flex-col gap-2">
                      {kelas.map((m) => (
                        <motion.div
                          key={m.id}
                          whileHover={{ x: 2 }}
                          className="text-xs px-2 py-1.5 rounded-lg"
                          style={{ background: `${m.warna}26`, color: m.warna, boxShadow: `0 0 16px -6px ${m.warna}` }}
                        >
                          {m.jam_mulai.slice(0, 5)} · {m.nama}
                        </motion.div>
                      ))}
                      {items.map((k) => (
                        <div
                          key={k.id}
                          className={`text-xs px-2 py-1.5 rounded-lg border border-ink-line ${
                            k.status === "selesai" ? "line-through text-paper/30" : "text-paper/70"
                          }`}
                        >
                          {k.jenis === "pr" ? "PR" : k.jenis === "tugas" ? "Tugas" : "•"} {k.judul}
                        </div>
                      ))}
                      {kelas.length === 0 && items.length === 0 && (
                        <span className="text-paper/20 text-xs">—</span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </Tilt>
    </AppShell>
  );
}

function StatChip({
  label,
  value,
  accent,
  delay = 0,
}: {
  label: string;
  value: number;
  accent?: "amber" | "teal";
  delay?: number;
}) {
  const color = accent === "amber" ? "#F2B84B" : accent === "teal" ? "#38E1B5" : "#F6F3EC";
  return (
    <Tilt strength={8} className="jk-glass jk-rise rounded-2xl px-4 py-4" style={{ animationDelay: `${delay}ms`, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.6)" }}>
      <p className="font-display text-3xl" style={{ color, textShadow: accent ? `0 0 24px ${color}55` : "none" }}>{value}</p>
      <p className="text-xs text-paper/40 mt-1">{label}</p>
    </Tilt>
  );
}
