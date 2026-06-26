"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const collections = [
  {
    title: "Chocolate Lovers Collection",
    subtitle: "For the true chocoholic",
    description:
      "Dive into our richest, most indulgent chocolate cookies. Made with Belgian dark chocolate, cocoa nibs, and chocolate chunks for an intense experience that every chocolate lover dreams of.",
    image: "/images/chocolate.png",
    align: "left",
  },
  {
    title: "Oreo Special Collection",
    subtitle: "Crunchy, creamy, irresistible",
    description:
      "Our signature take on the classic favorite. Crushed Oreo pieces folded into our buttery cookie dough, topped with a creamy white chocolate drizzle. A crunchy, creamy delight in every bite.",
    image: "/images/oreo.png",
    align: "right",
  },
  {
    title: "Premium Gift Box",
    subtitle: "The ultimate cookie gifting experience",
    description:
      "Our beautifully curated gift boxes featuring a handpicked selection of our finest cookies. Perfect for birthdays, holidays, or any occasion that deserves something special.",
    image: "/images/giftbox.png",
    align: "left",
  },
];

export default function SignatureCollections() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
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

        <div ref={ref} className="space-y-10 md:space-y-24">
          {collections.map((collection, idx) => {
            const isLeft = collection.align === "left";

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
                className={`flex flex-col ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                } gap-6 md:gap-12 items-center`}
              >
                <div className="w-full md:w-1/2">
                  <div className="relative h-56 md:h-96 overflow-hidden rounded-xl md:rounded-none">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                  </div>
                </div>

                <div className="w-full md:w-1/2 space-y-3 md:space-y-4 px-1 md:px-0">
                  <span className="text-gold text-[10px] md:text-sm font-semibold uppercase tracking-widest">
                    Collection {idx + 1}
                  </span>
                  <h3 className="font-playfair text-xl sm:text-2xl md:text-4xl font-bold text-cream leading-tight">
                    {collection.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gold font-medium italic">
                    {collection.subtitle}
                  </p>
                  <p className="text-cream/70 leading-relaxed text-sm md:text-base">
                    {collection.description}
                  </p>
                  <Link
                    href="/shop"
                    className="btn-outline inline-flex items-center gap-2 mt-1 md:mt-2 text-sm md:text-base"
                  >
                    Shop Collection <FaArrowRight size={12} />
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
