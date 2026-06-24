"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaStar, FaShoppingCart, FaEye, FaHeart } from "react-icons/fa";
import { useCartStore } from "@/store/cart";
import { toast } from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

const products = [
  {
    id: "cc-001",
    name: "Classic Chocolate Chip Cookie",
    image: "/images/products/classic-chocolate-chip.svg",
    price: 199,
    discountPrice: null,
    rating: 4.8,
    reviews: 124,
    slug: "classic-chocolate-chip",
  },
  {
    id: "od-002",
    name: "Oreo Delight Cookie",
    image: "/images/products/oreo-delight.svg",
    price: 249,
    discountPrice: 199,
    rating: 4.9,
    reviews: 98,
    slug: "oreo-delight",
  },
  {
    id: "rv-003",
    name: "Red Velvet Cookie",
    image: "/images/products/red-velvet.svg",
    price: 229,
    discountPrice: null,
    rating: 4.7,
    reviews: 87,
    slug: "red-velvet",
  },
  {
    id: "gb-004",
    name: "Golden Butter Cookie",
    image: "/images/products/golden-butter.svg",
    price: 179,
    discountPrice: null,
    rating: 4.6,
    reviews: 65,
    slug: "golden-butter",
  },
  {
    id: "dc-005",
    name: "Double Chocolate Fudge Cookie",
    image: "/images/products/double-chocolate.svg",
    price: 259,
    discountPrice: null,
    rating: 4.9,
    reviews: 112,
    slug: "double-chocolate-fudge",
  },
  {
    id: "mb-006",
    name: "Signature Mixed Box",
    image: "/images/products/mixed-box.svg",
    price: 599,
    discountPrice: 549,
    rating: 4.8,
    reviews: 203,
    slug: "signature-mixed-box",
    tag: "6 cookies assorted",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={i < full ? "text-gold" : "text-gold/20"}
            size={14}
          />
        ))}
      </div>
      <span className="text-sm text-cream/70 ml-1">{rating}</span>
      <span className="text-xs text-cream/40">({rating * 25})</span>
    </div>
  );
}

export default function BestSellers() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isInWishlist = useCartStore((s) => s.isInWishlist);
  const [wishlistStates, setWishlistStates] = useState<Record<string, boolean>>({});

  const handleAddToCart = (product: (typeof products)[0]) => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.id,
      description: "",
      ingredients: null,
      nutritionInfo: null,
      price: product.price,
      discountPrice: product.discountPrice,
      stockQuantity: 50,
      images: [],
      categoryId: "cat-1",
      category: { id: "cat-1", name: "Cookies", slug: "cookies", image: null },
      isFeatured: true,
      isBestSeller: true,
      isActive: true,
      seoTitle: null,
      seoDescription: null,
      rating: product.rating,
      reviewCount: product.reviews,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addToCart(cartProduct);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (productId: string) => {
    toggleWishlist(productId);
    setWishlistStates((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
    if (!wishlistStates[productId]) {
      toast.success("Added to wishlist!");
    } else {
      toast("Removed from wishlist", { icon: "💔" });
    }
  };

  return (
    <section id="best-sellers" className="py-16 md:py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Our Best Sellers</h2>
          <div className="gold-divider mx-auto mb-4" />
          <p className="section-subtitle">
            Most loved cookies by our customers
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {products.map((product) => {
            const discountPct = product.discountPrice
              ? Math.round(
                  ((product.price - product.discountPrice) / product.price) * 100
                )
              : 0;
            const inWishlist =
              wishlistStates[product.id] !== undefined
                ? wishlistStates[product.id]
                : isInWishlist(product.id);

            return (
              <motion.div
                key={product.id}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="group glass-card rounded-2xl overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <div className="relative w-full h-48 md:h-72 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  {discountPct > 0 && (
                    <span className="absolute top-3 left-3 bg-gold text-dark text-xs font-bold px-2.5 py-1 rounded-full">
                      {discountPct}% OFF
                    </span>
                  )}

                  {product.tag && (
                    <span className="absolute top-3 right-3 bg-dark-card text-cream text-xs font-medium px-2.5 py-1 rounded-full border border-gold/20">
                      {product.tag}
                    </span>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-gold text-dark p-3 rounded-full hover:bg-gold/90 transition-colors"
                      title="Add to Cart"
                    >
                      <FaShoppingCart size={18} />
                    </button>
                    <Link
                      href={`/shop`}
                      className="bg-cream/90 text-dark p-3 rounded-full hover:bg-cream transition-colors"
                      title="Quick View"
                    >
                      <FaEye size={18} />
                    </Link>
                    <button
                      onClick={() => handleToggleWishlist(product.id)}
                      className={`p-3 rounded-full transition-colors ${
                        inWishlist
                          ? "bg-red-500 text-white"
                          : "bg-cream/90 text-dark hover:bg-cream"
                      }`}
                      title="Wishlist"
                    >
                      <FaHeart size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-4 md:p-5">
                  <Link href={`/shop`}>
                    <h3 className="font-playfair text-lg font-semibold text-cream mb-2 hover:text-gold transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <StarRating rating={product.rating} />

                  <div className="flex items-center gap-2 mt-3 mb-4">
                    <span className="text-xl font-bold text-gold">
                      {formatPrice(product.discountPrice || product.price)}
                    </span>
                    {product.discountPrice && (
                      <span className="text-sm text-cream/50 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gold/10 hover:bg-gold text-cream hover:text-dark font-semibold py-2.5 rounded-full border border-gold/30 hover:border-gold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart size={14} />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/shop" className="btn-primary">
            View All Cookies
            <span className="text-dark">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
