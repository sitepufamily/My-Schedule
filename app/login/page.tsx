"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthProvider";
import Backdrop from "@/components/Backdrop";
import Tilt from "@/components/Tilt";
import { Sparkles, CalendarDays } from "lucide-react";

const ink = "#0A0B12";
const paper = "#F6F3EC";
const indigo = "#6E73F5";
const indigoSoft = "#A6A9FF";
const teal = "#38E1B5";
const inkLine = "rgba(255,255,255,0.09)";

function AuthPopup({
  label,
  accent,
  mode,
  onSubmit,
  busy,
  error,
}: {
  label: string;
  accent: string;
  mode: "masuk" | "daftar";
  onSubmit: (data: { nama?: string; email: string; password: string }) => void;
  busy: boolean;
  error: string;
}) {
  const [open, setOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function confirm() {
    if (!email || !password) return;
    onSubmit({ nama, email, password });
  }

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ position: "relative", width: 140 }}
    >
      <button
        onClick={() => (open ? confirm() : setOpen(true))}
        disabled={busy}
        className="relative w-full overflow-hidden rounded-full py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
        style={{
          background: accent,
          color: label === "Masuk" ? paper : ink,
          opacity: busy ? 0.7 : 1,
          boxShadow: open ? `0 18px 36px -10px ${accent}cc` : `0 14px 30px -12px ${accent}aa`,
        }}
      >
        {label}
      </button>

      <div style={{ position: "absolute", top: "calc(100% + 14px)", left: "50%", transform: "translateX(-50%)", width: 240, zIndex: 30 }}>
        <div
          className="jk-glass"
          style={{
            borderRadius: 18,
            padding: 18,
            position: "relative",
            transformOrigin: "top center",
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.94)",
            pointerEvents: open ? "auto" : "none",
            transition: "opacity 0.28s cubic-bezier(.22,1,.36,1), transform 0.28s cubic-bezier(.22,1,.36,1)",
            boxShadow: `0 30px 60px -20px rgba(0,0,0,0.9), 0 0 40px -14px ${accent}66`,
            background: "rgba(14,15,24,0.97)",
          }}
        >
          <div style={{
            position: "absolute", top: -6, left: "50%", transform: "translateX(-50%) rotate(45deg)",
            width: 12, height: 12, background: "rgba(14,15,24,0.97)",
            borderLeft: `1px solid ${inkLine}`, borderTop: `1px solid ${inkLine}`,
          }} />
          <p className="text-xs uppercase tracking-widest mb-3 font-mono" style={{ color: accent }}>
            {mode === "masuk" ? "Masuk ke akun" : "Buat akun baru"}
          </p>
          <div className="flex flex-col gap-2.5">
            {mode === "daftar" && (
              <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama lengkap"
                className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${inkLine}`, color: paper }} />
            )}
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email"
              className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${inkLine}`, color: paper }} />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Kata sandi" type="password"
              className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${inkLine}`, color: paper }} />
            {error && <p className="text-xs" style={{ color: "#FF7A93" }}>{error}</p>}
            <button onClick={confirm} disabled={busy}
              className="rounded-full py-2.5 text-sm font-semibold mt-1"
              style={{ background: mode === "masuk" ? teal : indigo, color: mode === "masuk" ? ink : paper, opacity: busy ? 0.7 : 1 }}>
              {busy ? "Memproses…" : mode === "masuk" ? "Konfirmasi & masuk" : "Konfirmasi & daftar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!loading && session) router.replace("/");
  }, [loading, session, router]);

  async function handleMasuk({ email, password }: { email: string; password: string }) {
    setBusy(true);
    setError("");
    setInfo("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.replace("/");
    setBusy(false);
  }

  async function handleDaftar({ nama, email, password }: { nama?: string; email: string; password: string }) {
    setBusy(true);
    setError("");
    setInfo("");
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { nama } } });
    if (error) setError(error.message);
    else setInfo("Akun dibuat. Cek email untuk verifikasi, lalu masuk.");
    setBusy(false);
  }

  return (
    <div className="min-h-screen relative">
      <Backdrop />
      <div className="min-h-screen flex items-center justify-center px-5 py-24 relative z-10">
        <div className="w-full max-w-3xl flex flex-col items-center gap-6">
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10">
            {/* tombol Masuk — di kiri kartu sapaan */}
            <div className="relative z-20 order-2 md:order-1">
              <AuthPopup label="Masuk" accent={indigo} mode="masuk" onSubmit={handleMasuk} busy={busy} error={error} />
            </div>

            {/* kartu sapaan — di tengah */}
            <Tilt strength={4} className="jk-glass jk-rise rounded-3xl p-9 text-center order-1 md:order-2 shrink-0" style={{ width: 300, boxShadow: `0 40px 80px -30px rgba(0,0,0,0.8), 0 0 70px -20px ${indigo}33` }}>
              <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto 20px" }}>
                <div className="jk-orb-c" style={{ position: "absolute", inset: -10, borderRadius: "50%", border: `1px dashed ${indigo}55` }} />
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 18,
                  background: `linear-gradient(135deg, ${indigo}, ${teal})`,
                  boxShadow: `0 14px 34px -8px ${indigo}bb`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <CalendarDays size={28} color={paper} strokeWidth={1.8} />
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4" style={{ background: `${indigo}22`, border: `1px solid ${indigo}44` }}>
                <Sparkles size={12} color={indigoSoft} />
                <span className="text-[0.65rem] uppercase tracking-widest font-mono" style={{ color: indigoSoft }}>My Schedule</span>
              </div>
              <h1 className="text-4xl mb-1" style={{
                fontFamily: "Fraunces, serif",
                background: `linear-gradient(100deg, ${paper}, ${indigoSoft} 55%, ${teal})`,
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
              }}>
                Selamat Datang
              </h1>
            </Tilt>

            {/* tombol Daftar — di kanan kartu sapaan */}
            <div className="relative z-20 order-3">
              <AuthPopup label="Daftar" accent={teal} mode="daftar" onSubmit={handleDaftar} busy={busy} error={error} />
            </div>
          </div>

          {info && <p className="text-sm" style={{ color: teal }}>{info}</p>}
        </div>
      </div>
    </div>
  );
}
