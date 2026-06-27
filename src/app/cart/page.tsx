"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-dark">
      <div className="relative py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-gold/5 text-8xl">🍪</div>
          <div className="absolute bottom-10 right-10 text-gold/5 text-8xl">🛒</div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="section-title">Cart</h1>
          <p className="text-cream/70 text-lg">Fast checkout, no cart needed</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto px-4 py-20 text-center"
      >
        <div className="text-8xl mb-6 opacity-20 text-gold">🛒</div>
        <h2 className="font-playfair text-2xl font-semibold text-cream mb-2">
          Cart is no longer available
        </h2>
        <p className="text-cream/70 mb-8">
          We&apos;ve simplified the experience — just pick a cookie and buy it directly. Browse our collection and find your favorites!
        </p>
        <Link href="/shop" className="btn-primary inline-flex">
          <FaShoppingBag size={16} />
          Shop Now
        </Link>
      </motion.div>
    </div>
  );
}
