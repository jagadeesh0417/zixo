"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiPercent,
  FiImage,
  FiStar,
  FiBarChart2,
  FiBox,
  FiSettings,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: FiHome },
  { href: "/admin/products", label: "Products", icon: FiPackage },
  { href: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: FiUsers },
  { href: "/admin/coupons", label: "Coupons", icon: FiPercent },
  { href: "/admin/banners", label: "Banners", icon: FiImage },
  { href: "/admin/reviews", label: "Reviews", icon: FiStar },
  { href: "/admin/analytics", label: "Analytics", icon: FiBarChart2 },
  { href: "/admin/inventory", label: "Inventory", icon: FiBox },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/30 transition-colors">
            <FiBox className="text-[#D4AF37] text-lg" />
          </div>
          <span className="font-playfair text-xl font-bold text-[#D4AF37] tracking-wide">
            ZIXO
          </span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-cream/50 hover:text-cream hover:bg-white/5 transition-all"
        >
          <FiX size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]"
                  : "text-cream/60 hover:text-cream hover:bg-white/5 border-l-2 border-transparent"
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#F8F4EE] text-sm font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-cream truncate">Admin</p>
            <p className="text-xs text-cream/50 truncate">Super Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 admin-sidebar z-30 flex-col">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 admin-sidebar z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
