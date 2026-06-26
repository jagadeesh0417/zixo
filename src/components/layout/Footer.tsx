"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

const policies = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

const INSTAGRAM_URL = "https://www.instagram.com/zixo_cookies";
const YOUTUBE_URL = "https://youtube.com/@subhani-04";
const WHATSAPP_URL = "https://wa.me/918096697748?text=Hi%20Zixo%20Cookies!%20I'm%20interested%20in%20your%20cookies.%20Please%20share%20more%20details.";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Footer() {
  return (
    <footer className="bg-[#060302]">
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-8">
          {/* Brand */}
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center mb-3 md:mb-4 group">
              <Image
                src="/images/logo.png"
                alt="Zixo Cookies"
                width={36}
                height={36}
                className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]"
              />
            </Link>
            <p className="text-[#F8F4EE]/50 text-xs md:text-sm leading-relaxed max-w-xs">
              Freshly baked happiness delivered to your door. Premium handcrafted
              cookies made with love and the finest ingredients.
            </p>
            <div className="flex items-center gap-3 mt-4 md:mt-5">
              <Link
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0503] transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </Link>
              <Link
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0503] transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                aria-label="YouTube"
              >
                <FaYoutube size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-playfair text-[#F8F4EE] font-semibold text-base md:text-lg mb-3 md:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#F8F4EE]/50 hover:text-[#D4AF37] text-sm transition-colors flex items-center gap-2 group"
                  >
                    <FaArrowRight className="text-[#D4AF37] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[10px] transition-all duration-300" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Policies */}
          <motion.div variants={itemVariants}>
            <h3 className="font-playfair text-[#F8F4EE] font-semibold text-base md:text-lg mb-3 md:mb-4">
              Policies
            </h3>
            <ul className="space-y-3">
              {policies.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#F8F4EE]/50 hover:text-[#D4AF37] text-sm transition-colors flex items-center gap-2 group"
                  >
                    <FaArrowRight className="text-[#D4AF37] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[10px] transition-all duration-300" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="font-playfair text-[#F8F4EE] font-semibold text-base md:text-lg mb-3 md:mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+918096697748"
                  className="flex items-center gap-3 text-[#F8F4EE]/50 hover:text-[#D4AF37] text-sm transition-colors group"
                >
                  <span className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#0A0503] transition-all shrink-0">
                    <FaPhone size={12} />
                  </span>
                  <span>+91 80966 97748</span>
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#F8F4EE]/50 hover:text-[#D4AF37] text-sm transition-colors group"
                >
                  <span className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#0A0503] transition-all shrink-0">
                    <FaPhone size={12} />
                  </span>
                  <span>WhatsApp Support</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@zixocookies.com"
                  className="flex items-center gap-3 text-[#F8F4EE]/50 hover:text-[#D4AF37] text-sm transition-colors group"
                >
                  <span className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#0A0503] transition-all shrink-0">
                    <FaEnvelope size={12} />
                  </span>
                  <span>support@zixocookies.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-[#F8F4EE]/50 text-sm">
                <span className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <FaMapMarkerAlt size={12} />
                </span>
                <span>Maharashtra, India</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* Copyright */}
      <div className="border-t border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-center text-[#F8F4EE]/30 text-xs md:text-sm">
            &copy; {new Date().getFullYear()} Zixo Cookies. All rights reserved.
            Crafted with <span className="text-[#D4AF37]">&hearts;</span> and the finest ingredients.
          </p>
        </div>
      </div>
    </footer>
  );
}
