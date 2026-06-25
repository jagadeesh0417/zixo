"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiBox,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast("Search coming soon", { icon: "🔍" });
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-20 bg-[#120A07] border-b border-[#D4AF37]/10">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-[#F8F4EE]/50 hover:text-[#F8F4EE] hover:bg-white/5 transition-all"
            aria-label="Toggle sidebar"
          >
            <FiMenu size={20} />
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <FiBox className="text-[#D4AF37] text-lg" />
            <span className="text-sm text-[#F8F4EE]/40">/</span>
            <span className="text-sm font-medium text-[#F8F4EE]/60">Admin Panel</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <AnimatePresence>
            {searchOpen ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSearch}
                className="relative"
              >
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F8F4EE]/40 text-sm" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false);
                  }}
                  className="w-full pl-9 pr-4 py-2 bg-[#0A0503] border border-[#D4AF37]/20 rounded-lg text-sm text-[#F8F4EE] placeholder:text-[#F8F4EE]/40 focus:outline-none focus:border-[#D4AF37] focus:bg-[#120A07] transition-all"
                />
              </motion.form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-[#F8F4EE]/40 hover:text-[#F8F4EE] hover:bg-white/5 transition-all"
                aria-label="Search"
              >
                <FiSearch size={18} />
              </button>
            )}
          </AnimatePresence>

          <button className="relative p-2 rounded-lg text-[#F8F4EE]/40 hover:text-[#F8F4EE] hover:bg-white/5 transition-all">
            <FiBell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4AF37] ring-2 ring-[#0A0503]" />
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#F8F4EE] text-sm font-bold">
                A
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-[#F8F4EE]/80 leading-tight">Admin</p>
                <p className="text-xs text-[#F8F4EE]/40 leading-tight">Super Admin</p>
              </div>
              <FiChevronDown
                size={16}
                className={`text-[#F8F4EE]/40 transition-transform ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-48 bg-[#120A07] rounded-xl shadow-lg border border-[#D4AF37]/10 py-1 z-20"
                  >
                    <div className="px-4 py-2 border-b border-[#D4AF37]/10">
                      <p className="text-sm font-medium text-[#F8F4EE]/80">Admin</p>
                      <p className="text-xs text-[#F8F4EE]/40">zixocookies@gmail.com</p>
                    </div>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/admin/settings");
                      }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#F8F4EE]/60 hover:bg-white/5 transition-colors"
                    >
                      <FiSettings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
