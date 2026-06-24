"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const token = localStorage.getItem("admin_token");
      if (!token && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    }
  }, [mounted, pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!mounted) {
    return null;
  }

  const token = localStorage.getItem("admin_token");
  if (!token) {
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
