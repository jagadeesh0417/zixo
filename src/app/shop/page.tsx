"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCookieBite, FaArrowRight } from "react-icons/fa";
import ProductFilters, { FilterState } from "@/components/shop/ProductFilters";
import ProductCard from "@/components/shop/ProductCard";
import { ProductType } from "@/types";

const ITEMS_PER_PAGE = 8;

export default function ShopPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    priceRange: "",
    sortBy: "",
  });
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) =>
        filters.categories.includes(p.category.slug)
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter((p) => {
        const effective = p.discountPrice || p.price;
        return effective >= min && effective <= max;
      });
    }

    switch (filters.sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case "price-desc":
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [filters, products]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-dark">
      <div className="relative bg-dark py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-gold/5 text-8xl">🍪</div>
          <div className="absolute bottom-10 right-10 text-gold/5 text-8xl">✨</div>
          <div className="absolute top-1/2 right-1/4 text-gold/5 text-6xl">⭐</div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gold/10 backdrop-blur-sm text-gold text-sm font-medium px-4 py-1.5 rounded-full border border-gold/30 mb-4"
          >
            <FaCookieBite size={14} /> Premium Selection
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-3">
            Our Cookie Collection
          </h1>
          <p className="text-cream/70 text-lg max-w-xl mx-auto">
            Explore our range of handcrafted gourmet cookies
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <ProductFilters onChange={setFilters} />

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-cream/60">
            {loading
              ? "Loading products..."
              : filteredProducts.length === 0
              ? "No products found"
              : `Showing ${visibleProducts.length} of ${filteredProducts.length} products`}
          </p>
          {filters.search && (
            <p className="text-sm text-cream/50">
              Search: &ldquo;{filters.search}&rdquo;
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-pulse">🍪</div>
            <p className="text-cream/60">Loading cookies...</p>
          </div>
        ) : visibleProducts.length > 0 ? (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
              }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>

            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-12"
              >
                <button
                  onClick={handleLoadMore}
                  className="btn-primary"
                >
                  Load More
                  <FaArrowRight size={14} />
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🍪</div>
            <h3 className="font-playfair text-2xl font-semibold text-cream mb-2">
              No cookies found
            </h3>
            <p className="text-cream/60 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() =>
                setFilters({ search: "", categories: [], priceRange: "", sortBy: "" })
              }
              className="btn-primary"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
