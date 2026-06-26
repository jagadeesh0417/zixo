"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_URL =
  "https://wa.me/918096697748?text=Hi%20Zixo%20Cookies!%20I'm%20interested%20in%20your%20cookies.%20Please%20share%20more%20details.";

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-[#120A07] text-cream text-xs md:text-sm font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow-lg whitespace-nowrap"
          >
            Chat with us
          </motion.span>
        )}
      </AnimatePresence>
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="whatsapp-pulse w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-white text-2xl md:text-3xl" />
      </motion.a>
    </div>
  );
}
