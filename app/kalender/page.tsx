"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Tilt from "@/components/Tilt";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthProvider";
import { KalenderItem } from "@/lib/types";
import { motion } from "framer-motion";

const KATEGORI_WARNA: Record<string, string> = {
  umum: "#8B8EF5",
  ujian: "#FB7185",
  deadline: "#F2B84B",
  libur: "#2FCBA3",
  acara: "#5B5FEF",
};

export default function KalenderPage() {
  const { session } = useAuth();
  const [list, setList] = useState<KalenderItem[]>([]);
  const [form, setForm] = useState({
    judul: "",
    tanggal: "",
    kategori: "umum" as KalenderItem["kategori"],
    deskripsi: "",
  });

  async function load() {
    if (!session) return;
    const { data } = await supabase
      .from("kalender")
      .select("*")
      .eq("user_id", session.user.id)
      .order("tanggal");
    setList((data as KalenderItem[]) || []);
  }

  useEffect(() => {
    load();
  }, [session]);

  async function tambah(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !form.judul || !form.tanggal) return;
    await supabase.from("kalender").insert({ ...form, user_id: session.user.id });
    setForm({ judul: "", tanggal: "", kategori: "umum", deskripsi: "" });
    load();
  }

  async function hapus(id: string) {
    await supabase.from("kalender").delete().eq("id", id);
    load();
  }

  const akanDatang = list.filter((k) => new Date(k.tanggal) >= new Date(new Date().toDateString()));
  const lewat = list.filter((k) => new Date(k.tanggal) < new Date(new Date().toDateString()));

  return (
    <AppShell>
      <p className="eyebrow mb-1">04 · Penanda</p>
      <h1
        className="font-display italic text-4xl mb-8"
        style={{
          background: "linear-gradient(100deg, #F6F3EC, #A6A9FF 55%, #38E1B5)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Kalender Penting
      </h1>

      <form onSubmit={tambah} className="jk-glass rounded-2xl p-5 mb-8 grid grid-cols-1 md:grid-cols-4 gap-3" style={{ boxShadow: "0 24px 50px -24px rgba(0,0,0,0.7)" }}>
        <input
          required
          placeholder="Judul (mis. UTS Kalkulus)"
          value={form.judul}
          onChange={(e) => setForm({ ...form, judul: e.target.value })}
          className="md:col-span-2"
        />
        <input
          type="date"
          required
          value={form.tanggal}
          onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
        />
        <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value as any })}>
          <option value="umum">Umum</option>
          <option value="ujian">Ujian</option>
          <option value="deadline">Deadline</option>
          <option value="libur">Libur</option>
          <option value="acara">Acara</option>
        </select>
        <input
          placeholder="Deskripsi singkat (opsional)"
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          className="md:col-span-3"
        />
        <button className="btn-primary">Tambah</button>
      </form>

      <p className="eyebrow mb-3">Akan datang</p>
      <div className="flex flex-col gap-2 mb-8">
        {akanDatang.map((item) => (
          <Tilt
            key={item.id}
            strength={4}
            className="jk-glass rounded-2xl px-4 py-3 flex items-center justify-between"
            style={{ boxShadow: `0 16px 32px -18px rgba(0,0,0,0.6), inset 3px 0 0 ${KATEGORI_WARNA[item.kategori]}` }}
          >
            <div>
              <p className="text-sm text-paper">{item.judul}</p>
              <p className="text-[0.65rem] text-paper/30 font-mono mt-0.5">
                {new Date(item.tanggal).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                · {item.kategori}
              </p>
            </div>
            <button onClick={() => hapus(item.id)} className="text-paper/20 hover:text-rose text-xs">
              Hapus
            </button>
          </Tilt>
        ))}
        {akanDatang.length === 0 && <p className="text-paper/30 text-sm">Tidak ada agenda mendatang.</p>}
      </div>

      {lewat.length > 0 && (
        <>
          <p className="eyebrow mb-3">Sudah lewat</p>
          <div className="flex flex-col gap-2 opacity-40">
            {lewat.map((item) => (
              <div key={item.id} className="jk-glass rounded-2xl px-4 py-3 flex items-center justify-between">
                <p className="text-sm line-through">{item.judul}</p>
                <button onClick={() => hapus(item.id)} className="text-xs hover:text-rose">
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
