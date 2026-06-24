"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaCookieBite, FaHeart } from "react-icons/fa";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-24 bg-dark-card">
      <div className="max-w-7xl mx-auto px-4">
        <div ref={ref} className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="w-full md:w-1/2"
          >
            <div className="w-full h-72 md:h-96 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent" />
              <div className="flex flex-col items-center gap-3">
                <FaCookieBite size={80} className="text-gold/50" />
                <span className="text-4xl font-playfair font-bold text-gold/30">
                  Zixo
                </span>
              </div>
              <motion.div
                className="absolute"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FaHeart className="text-gold/30" size={60} />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full md:w-1/2 space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-cream leading-tight">
              Crafted With Passion,{" "}
              <span className="text-gold">Shared With Love</span>
            </h2>

            <div className="w-16 h-1 bg-gold rounded-full" />

            <p className="text-cream/70 leading-relaxed text-lg">
              Zixo Cookies started as a home-based bakery with a simple mission:
              to craft the most delicious, premium gourmet cookies using the
              finest ingredients from around the world.
            </p>

            <p className="text-cream/60 leading-relaxed">
              Every batch is baked fresh with love, using real butter, Belgian
              chocolate, and carefully sourced ingredients. We believe that a
              great cookie can turn any moment into a celebration — and we are
              committed to delivering that joy to your doorstep.
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <div className="text-center">
                <span className="block text-3xl font-bold text-gold">
                  50+
                </span>
                <span className="text-sm text-cream/60">Cookie Varieties</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-bold text-gold">
                  10K+
                </span>
                <span className="text-sm text-cream/60">Happy Customers</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-bold text-gold">
                  15+
                </span>
                <span className="text-sm text-cream/60">Cities Delivered</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
