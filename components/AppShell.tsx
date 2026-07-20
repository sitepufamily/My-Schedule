"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthProvider";
import Sidebar from "@/components/Sidebar";
import Backdrop from "@/components/Backdrop";
import { motion } from "framer-motion";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [loading, session, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <p className="eyebrow animate-pulse">Memuat…</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-ink relative">
      <Backdrop />
      <Sidebar />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex-1 px-5 py-8 md:px-10 md:py-10 max-w-6xl"
      >
        {children}
      </motion.main>
    </div>
  );
}
