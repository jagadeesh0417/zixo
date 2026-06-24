"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { FaCookieBite, FaArrowRight } from "react-icons/fa";

const collections = [
  {
    title: "Chocolate Lovers Collection",
    subtitle: "For the true chocoholic",
    description:
      "Dive into our richest, most indulgent chocolate cookies. Made with Belgian dark chocolate, cocoa nibs, and chocolate chunks for an intense experience that every chocolate lover dreams of.",
    gradient: "from-amber-800 to-brown-900",
    image: "🍫",
    align: "left",
  },
  {
    title: "Oreo Special Collection",
    subtitle: "Crunchy, creamy, irresistible",
    description:
      "Our signature take on the classic favorite. Crushed Oreo pieces folded into our buttery cookie dough, topped with a creamy white chocolate drizzle. A crunchy, creamy delight in every bite.",
    gradient: "from-blue-900 to-purple-900",
    image: "🍪",
    align: "right",
  },
  {
    title: "Red Velvet Collection",
    subtitle: "Elegance in every bite",
    description:
      "Beautiful crimson cookies with a hint of cocoa, studded with white chocolate chips. Topped with a cream cheese drizzle, these cookies are as stunning as they are delicious.",
    gradient: "from-red-800 to-rose-900",
    image: "❤️",
    align: "left",
  },
];

export default function SignatureCollections() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Signature Collections</h2>
          <div className="gold-divider mx-auto mb-4" />
          <p className="section-subtitle">
            Curated cookie boxes for every craving
          </p>
        </motion.div>

        <div ref={ref} className="space-y-16 md:space-y-24">
          {collections.map((collection, idx) => {
            const isLeft = collection.align === "left";
            const isOdd = idx % 2 === 1;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
                className={`flex flex-col ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 md:gap-12 items-center`}
              >
                <div className="w-full md:w-1/2">
                  <div
                    className={`w-full h-72 md:h-96 rounded-2xl bg-gradient-to-br ${collection.gradient} flex items-center justify-center shadow-xl overflow-hidden relative`}
                  >
                    <span className="text-8xl md:text-9xl opacity-40 select-none">
                      {collection.image}
                    </span>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-4 right-4 w-16 h-16 border border-gold/40 rounded-full flex items-center justify-center">
                      <FaCookieBite className="text-gold/60" size={28} />
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/2 space-y-4">
                  <span className="text-gold text-sm font-semibold uppercase tracking-widest">
                    Collection {idx + 1}
                  </span>
                  <h3 className="font-playfair text-3xl md:text-4xl font-bold text-cream leading-tight">
                    {collection.title}
                  </h3>
                  <p className="text-lg text-gold font-medium italic">
                    {collection.subtitle}
                  </p>
                  <p className="text-cream/70 leading-relaxed">
                    {collection.description}
                  </p>
                  <Link
                    href="/shop"
                    className="btn-outline inline-flex items-center gap-2 mt-2"
                  >
                    Shop Collection <FaArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
