"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaCookieBite, FaArrowRight } from "react-icons/fa";
import ProductCard from "@/components/shop/ProductCard";
import { ProductType } from "@/types";

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full aspect-[4/3] bg-dark-card" />
      <div className="p-3 md:p-5 space-y-3">
        <div className="h-3 w-16 bg-dark-card rounded" />
        <div className="h-4 w-3/4 bg-dark-card rounded" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-3 bg-dark-card rounded" />
          ))}
        </div>
        <div className="h-5 w-20 bg-dark-card rounded" />
        <div className="h-10 w-full bg-dark-card rounded-full" />
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function BestSellers() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=999")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="best-sellers" className="py-16 md:py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Our Premium Cookies</h2>
          <div className="gold-divider mx-auto mb-4" />
          <p className="section-subtitle">
            Freshly baked gourmet cookies delivered to your doorstep
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <FaCookieBite className="text-gold/30 mx-auto mb-4" size={48} />
            <p className="text-cream/60 text-lg">No products available yet.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              href="/shop"
              className="btn-primary inline-flex items-center gap-2 text-xs md:text-base"
            >
              View All Products
              <FaArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
