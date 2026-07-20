"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Tilt from "@/components/Tilt";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthProvider";
import { HARI_LIST, Matkul } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

const WARNA_PILIHAN = ["#5B5FEF", "#F2B84B", "#2FCBA3", "#FB7185", "#8B8EF5"];

export default function MatkulPage() {
  const { session } = useAuth();
  const [list, setList] = useState<Matkul[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    dosen: "",
    sks: 2,
    hari: "Senin",
    jam_mulai: "08:00",
    jam_selesai: "09:40",
    ruangan: "",
    warna: WARNA_PILIHAN[0],
    semester: 1,
  });

  async function load() {
    if (!session) return;
    const { data } = await supabase
      .from("matkul")
      .select("*")
      .eq("user_id", session.user.id)
      .order("hari");
    setList((data as Matkul[]) || []);
  }

  useEffect(() => {
    load();
  }, [session]);

  async function tambah(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    await supabase.from("matkul").insert({ ...form, user_id: session.user.id });
    setForm({ ...form, nama: "", dosen: "", ruangan: "" });
    setShowForm(false);
    load();
  }

  async function hapus(id: string) {
    await supabase.from("matkul").delete().eq("id", id);
    load();
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="eyebrow mb-1">02 · Daftar</p>
          <h1
            className="font-display italic text-4xl"
            style={{
              background: "linear-gradient(100deg, #F6F3EC, #A6A9FF 55%, #38E1B5)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Mata Kuliah
          </h1>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Batal" : "+ Tambah"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={tambah}
            className="jk-glass p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl"
            style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.7)" }}
          >
            <input
              required
              placeholder="Nama mata kuliah"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
            />
            <input
              placeholder="Dosen"
              value={form.dosen}
              onChange={(e) => setForm({ ...form, dosen: e.target.value })}
            />
            <input
              placeholder="Ruangan"
              value={form.ruangan}
              onChange={(e) => setForm({ ...form, ruangan: e.target.value })}
            />
            <select value={form.hari} onChange={(e) => setForm({ ...form, hari: e.target.value })}>
              {HARI_LIST.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
            <input
              type="time"
              value={form.jam_mulai}
              onChange={(e) => setForm({ ...form, jam_mulai: e.target.value })}
            />
            <input
              type="time"
              value={form.jam_selesai}
              onChange={(e) => setForm({ ...form, jam_selesai: e.target.value })}
            />
            <input
              type="number"
              min={1}
              max={6}
              placeholder="SKS"
              value={form.sks}
              onChange={(e) => setForm({ ...form, sks: Number(e.target.value) })}
            />
            <input
              type="number"
              min={1}
              max={14}
              placeholder="Semester"
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
            />
            <div className="flex items-center gap-2">
              {WARNA_PILIHAN.map((w) => (
                <button
                  type="button"
                  key={w}
                  onClick={() => setForm({ ...form, warna: w })}
                  className="w-6 h-6 rounded-full"
                  style={{
                    background: w,
                    outline: form.warna === w ? "2px solid #F6F3EC" : "none",
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
            <button className="btn-primary md:col-span-3">Simpan</button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map((m) => (
          <Tilt
            key={m.id}
            strength={7}
            className="jk-glass rounded-2xl p-5 flex items-start justify-between"
            style={{ boxShadow: `0 24px 50px -24px rgba(0,0,0,0.7), inset 3px 0 0 ${m.warna}` }}
          >
            <div>
              <p className="font-display text-lg text-paper">{m.nama}</p>
              <p className="text-xs text-paper/40 mt-1 font-mono">
                {m.hari} · {m.jam_mulai.slice(0, 5)}–{m.jam_selesai.slice(0, 5)}
              </p>
              <p className="text-xs text-paper/40 mt-1">
                {m.dosen || "—"} {m.ruangan ? `· ${m.ruangan}` : ""} · {m.sks} SKS · Sem {m.semester}
              </p>
            </div>
            <button onClick={() => hapus(m.id)} className="text-paper/30 hover:text-rose text-sm">
              Hapus
            </button>
          </Tilt>
        ))}
        {list.length === 0 && (
          <p className="text-paper/30 text-sm col-span-2">Belum ada mata kuliah. Tambahkan yang pertama.</p>
        )}
      </div>
    </AppShell>
  );
}
