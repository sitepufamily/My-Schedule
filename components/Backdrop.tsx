"use client";

import { CalendarDays, ListChecks, TrendingUp, BookOpen, Clock3, Sparkles } from "lucide-react";

const indigo = "#6E73F5";
const indigoSoft = "#A6A9FF";
const amber = "#F2B84B";
const teal = "#38E1B5";
const rose = "#FF7A93";

const ICONS = [
  { Icon: CalendarDays, top: "14%", left: "10%", size: 30, cls: "jk-icon-a", color: indigo },
  { Icon: ListChecks, top: "68%", left: "6%", size: 24, cls: "jk-icon-b", color: teal },
  { Icon: BookOpen, top: "22%", left: "82%", size: 26, cls: "jk-icon-c", color: amber },
  { Icon: TrendingUp, top: "75%", left: "86%", size: 24, cls: "jk-icon-a", color: rose },
  { Icon: Clock3, top: "48%", left: "92%", size: 20, cls: "jk-icon-b", color: indigoSoft },
  { Icon: Sparkles, top: "8%", left: "48%", size: 18, cls: "jk-icon-c", color: teal },
];

export default function Backdrop() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "radial-gradient(1200px 800px at 15% -10%, #17193a 0%, #0A0B12 55%)" }}
    >
      <div className="jk-orb-a absolute -top-[10%] left-[5%] w-[420px] h-[420px] rounded-full" style={{ background: indigo, opacity: 0.28, filter: "blur(100px)" }} />
      <div className="jk-orb-b absolute -bottom-[15%] right-0 w-[460px] h-[460px] rounded-full" style={{ background: teal, opacity: 0.18, filter: "blur(110px)" }} />
      <div className="jk-orb-c absolute top-[35%] right-[20%] w-[260px] h-[260px] rounded-full" style={{ background: rose, opacity: 0.13, filter: "blur(90px)" }} />

      {ICONS.map(({ Icon, top, left, size, cls, color }, i) => (
        <div key={i} className={`${cls} absolute`} style={{ top, left, opacity: 0.16, color }}>
          <Icon size={size} strokeWidth={1.4} />
        </div>
      ))}

      <svg className="absolute top-[10%] right-[8%] w-[180px] h-[180px]" style={{ opacity: 0.25 }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke={indigoSoft} strokeWidth="0.6" strokeDasharray="2 6" className="jk-dash" />
      </svg>
      <svg className="absolute bottom-[12%] left-[6%] w-[140px] h-[140px]" style={{ opacity: 0.2 }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke={teal} strokeWidth="0.6" strokeDasharray="1 5" className="jk-dash" />
      </svg>

      <svg className="jk-grid-pulse absolute inset-0 w-full h-full">
        <defs>
          <pattern id="jk-grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M 42 0 L 0 0 0 42" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#jk-grid)" />
      </svg>
    </div>
  );
}
