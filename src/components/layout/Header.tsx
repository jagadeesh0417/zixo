"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaHeart,
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaInstagram,
  FaYoutube,
  FaUser,
} from "react-icons/fa";
import { useCartStore } from "@/store/cart";
import { classNames } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

const INSTAGRAM_URL = "https://www.instagram.com/zixo_cookies";
const YOUTUBE_URL = "https://youtube.com/@subhani-04";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const wishlist = useCartStore((state) => state.wishlist);
  const cartCount = useCartStore((state) => state.getCartCount());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={classNames(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#0A0503] border-b",
          scrolled
            ? "border-[#D4AF37]/10 shadow-lg shadow-black/50"
            : "border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#F8F4EE] hover:text-[#D4AF37] transition-colors"
              aria-label="Open menu"
            >
              <FaBars size={22} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <Image
                src="/images/general/logo.svg"
                alt="Zixo Cookies"
                width={140}
                height={50}
                className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#F8F4EE]/70 hover:text-[#D4AF37] font-medium text-sm tracking-wide transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#F8F4EE]/70 hover:text-[#D4AF37] transition-colors"
                aria-label="Search"
              >
                <FaSearch size={18} />
              </button>

              <Link
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2 text-[#F8F4EE]/70 hover:text-[#D4AF37] transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </Link>

              <Link
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2 text-[#F8F4EE]/70 hover:text-[#D4AF37] transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={18} />
              </Link>

              <Link
                href="/account"
                className="hidden sm:flex p-2 text-[#F8F4EE]/70 hover:text-[#D4AF37] transition-colors"
                aria-label="Account"
              >
                <FaUser size={18} />
              </Link>

              <Link
                href="/wishlist"
                className="relative p-2 text-[#F8F4EE]/70 hover:text-[#D4AF37] transition-colors"
                aria-label="Wishlist"
              >
                <FaHeart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-[#0A0503] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_6px_rgba(212,175,55,0.5)]">
                    {wishlist.length > 9 ? "9+" : wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative p-2 text-[#F8F4EE]/70 hover:text-[#D4AF37] transition-colors"
                aria-label="Cart"
              >
                <FaShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-[#0A0503] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_6px_rgba(212,175,55,0.5)]">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#0A0503]/95 backdrop-blur-xl z-50 border-r border-[#D4AF37]/20 shadow-2xl shadow-[#D4AF37]/5"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#D4AF37]/10">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <Image
                    src="/images/general/logo.svg"
                    alt="Zixo Cookies"
                    width={100}
                    height={36}
                    className="h-7 w-auto"
                  />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-[#F8F4EE]/50 hover:text-[#D4AF37] transition-colors"
                  aria-label="Close menu"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <nav className="p-4 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#F8F4EE]/70 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all font-medium"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#D4AF37]/10">
                <div className="flex items-center justify-center gap-4">
                  <Link
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 text-[#F8F4EE]/50 hover:text-[#D4AF37] transition-colors"
                  >
                    <FaInstagram size={20} />
                  </Link>
                  <Link
                    href={YOUTUBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 text-[#F8F4EE]/50 hover:text-[#D4AF37] transition-colors"
                  >
                    <FaYoutube size={20} />
                  </Link>
                </div>
                <p className="text-center text-xs text-[#F8F4EE]/40 mt-2">
                  +91 80966 97748
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-24 md:pt-32 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-0 rounded-2xl bg-[#0A0503]/60 backdrop-blur-xl border border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.1)]" />
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]/60 text-lg z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cookies, gifts, combos..."
                  autoFocus
                  className="relative z-10 w-full pl-14 pr-14 py-4 rounded-2xl bg-transparent text-[#F8F4EE] text-lg placeholder:text-[#F8F4EE]/30 border-2 border-transparent focus:border-[#D4AF37] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#F8F4EE]/40 hover:text-[#D4AF37] transition-colors z-10"
                  aria-label="Close search"
                >
                  <FaTimes size={20} />
                </button>
              </form>
              <p className="text-[#F8F4EE]/40 text-sm text-center mt-4">
                Press Enter to search &bull; Esc to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20" />
    </>
  );
}
