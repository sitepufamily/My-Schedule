"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

const NAV = [
  { href: "/", label: "Ringkasan", num: "01" },
  { href: "/matkul", label: "Mata Kuliah", num: "02" },
  { href: "/kegiatan", label: "Kegiatan & Tugas", num: "03" },
  { href: "/kalender", label: "Kalender", num: "04" },
  { href: "/statistik", label: "Statistik", num: "05" },
  { href: "/semester", label: "Rekap Semester", num: "06" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="jk-glass w-full md:w-64 shrink-0 md:h-screen md:sticky md:top-0 px-5 py-6 flex md:flex-col justify-between relative z-10" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderBottom: "none" }}>
      <div>
        <div className="flex items-center gap-3 mb-9">
          <div style={{ position: "relative", width: 38, height: 38 }}>
            <div className="jk-orb-c" style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1px dashed rgba(110,115,245,0.4)" }} />
            <div style={{
              position: "absolute", inset: 0, borderRadius: 12,
              background: "linear-gradient(135deg, #6E73F5, #38E1B5)",
              boxShadow: "0 8px 24px -6px rgba(110,115,245,0.6)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <CalendarDays size={19} color="#F6F3EC" strokeWidth={1.8} />
            </div>
          </div>
          <div>
            <p className="text-[0.6rem] tracking-widest uppercase font-mono" style={{ color: "#A6A9FF" }}>My</p>
            <h1 className="font-display text-xl italic text-paper leading-none">Schedule</h1>
          </div>
        </div>
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="relative">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all"
                  style={{
                    background: active ? "linear-gradient(90deg, rgba(110,115,245,0.2), transparent)" : "transparent",
                    color: active ? "#A6A9FF" : "rgba(246,243,236,0.55)",
                    borderLeft: active ? "2px solid #A6A9FF" : "2px solid transparent",
                    boxShadow: active ? "0 0 30px -10px rgba(110,115,245,0.5)" : "none",
                  }}
                >
                  <span className="font-mono text-[0.62rem] opacity-60">{item.num}</span>
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        onClick={logout}
        className="hidden md:block text-left text-sm mt-8 transition-colors"
        style={{ color: "rgba(246,243,236,0.4)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#FF7A93")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(246,243,236,0.4)")}
      >
        Keluar
      </button>
    </aside>
  );
}
