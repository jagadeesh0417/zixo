"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const verifyAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/verify");
      const data = await res.json();
      if (data.success) {
        setVerified(true);
      } else {
        localStorage.removeItem("admin_token");
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      }
    } catch {
      localStorage.removeItem("admin_token");
      if (pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    } finally {
      setChecking(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    if (mounted && pathname !== "/admin/login") {
      verifyAuth();
    } else if (pathname === "/admin/login") {
      setChecking(false);
    }
  }, [mounted, pathname, verifyAuth]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!mounted || checking) {
    return (
      <div className="min-h-screen bg-[#0A0503] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!verified) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0503]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
          className="flex-1 p-4 md:p-6 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
