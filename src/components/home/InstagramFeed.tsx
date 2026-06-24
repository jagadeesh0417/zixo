"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { FaInstagram, FaHeart } from "react-icons/fa";

const posts = [
  { emoji: "🍪", likes: "2,847", gradient: "from-amber-200 to-orange-300" },
  { emoji: "🍫", likes: "3,124", gradient: "from-amber-800 to-brown-900" },
  { emoji: "❤️", likes: "1,956", gradient: "from-red-200 to-rose-300" },
  { emoji: "🍪", likes: "4,231", gradient: "from-yellow-200 to-amber-300" },
  { emoji: "⭐", likes: "2,563", gradient: "from-purple-200 to-pink-300" },
  { emoji: "🎁", likes: "3,789", gradient: "from-green-200 to-emerald-300" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function InstagramFeed() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-24 bg-dark-card">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Follow Us On Instagram</h2>
          <div className="gold-divider" />
          <Link
            href="https://www.instagram.com/zixo_cookies"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold hover:text-cream font-semibold text-lg transition-colors"
          >
            <FaInstagram size={22} />
            @zixo_cookies
          </Link>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
        >
          {posts.map((post, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className={`relative group rounded-xl overflow-hidden glass-card border-gold/10 ${
                idx === 0 ? "row-span-2 col-span-2" : ""
              } ${idx === 3 ? "col-span-2" : ""}`}
            >
              <div
                className={`w-full ${
                  idx === 0 ? "h-80 md:h-96" : "h-48 md:h-56"
                } bg-gradient-to-br ${post.gradient} flex items-center justify-center`}
              >
                <span className="text-5xl md:text-6xl opacity-60 select-none group-hover:scale-110 transition-transform duration-300">
                  {post.emoji}
                </span>
              </div>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-cream">
                  <FaInstagram size={32} className="mx-auto mb-2 text-gold" />
                  <div className="flex items-center justify-center gap-1 text-cream">
                    <FaHeart size={16} className="text-gold" />
                    <span className="text-sm font-semibold">{post.likes}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            href="https://www.instagram.com/zixo_cookies"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3"
          >
            <FaInstagram size={18} />
            Follow @zixo_cookies
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
