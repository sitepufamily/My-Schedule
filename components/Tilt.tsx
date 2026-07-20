"use client";

import { useRef, useState, ReactNode, CSSProperties } from "react";

export default function Tilt({
  children,
  className,
  style,
  strength = 8,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({ rx: (0.5 - py) * strength, ry: (px - 0.5) * strength, gx: px * 100, gy: py * 100 });
  }
  function onLeave() {
    setT({ rx: 0, ry: 0, gx: 50, gy: 50 });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        ...style,
        transform: `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
        transition: "transform 0.25s cubic-bezier(.22,1,.36,1)",
        position: "relative",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: `radial-gradient(320px circle at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.10), transparent 60%)` }}
      />
      {children}
    </div>
  );
}
