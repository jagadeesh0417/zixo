"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaCookieBite, FaLeaf, FaTruck } from "react-icons/fa";

const features = [
  {
    icon: FaCookieBite,
    title: "Freshly Baked Daily",
    description:
      "Every cookie is baked fresh on the day of delivery, ensuring you get the perfect taste and texture every time.",
  },
  {
    icon: FaLeaf,
    title: "Premium Ingredients",
    description:
      "Only the finest ingredients, sourced globally. We use real butter, Belgian chocolate, and natural flavors.",
  },
  {
    icon: FaTruck,
    title: "Fast Delivery",
    description:
      "Free delivery within 24 hours in your city. Our cookies are carefully packed to arrive fresh and intact.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function WhyChoose() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-24 bg-dark-card">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Why Choose Zixo</h2>
          <div className="gold-divider mx-auto mb-4" />
          <p className="section-subtitle">We bake happiness with every batch</p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="glass-card rounded-2xl p-6 md:p-8 text-center"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                  <Icon size={28} className="text-gold" />
                </div>
                <h3 className="font-playfair text-lg md:text-xl font-semibold text-cream mb-2 md:mb-3">
                  {feature.title}
                </h3>
                <p className="text-cream/70 leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
