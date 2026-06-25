"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar, FaShoppingCart, FaEye, FaHeart } from "react-icons/fa";
import { useCartStore } from "@/store/cart";
import { toast } from "react-hot-toast";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { ProductType } from "@/types";

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isInWishlist = useCartStore((s) => s.isInWishlist);
  const [wishlistState, setWishlistState] = useState(isInWishlist(product.id));
  const [imgError, setImgError] = useState(false);

  const discountPct = product.discountPrice
    ? getDiscountPercentage(product.price, product.discountPrice)
    : 0;

  const imageSrc = product.images?.[0] && !imgError ? product.images[0] : `/images/products/${product.slug}.svg`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${product.id}`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    const next = !wishlistState;
    setWishlistState(next);
    toast.success(next ? "Added to wishlist!" : "Removed from wishlist");
  };

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="group glass-card overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <div className="relative w-full h-48 md:h-56 lg:h-64">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgError(true)}
          />
        </div>

        {discountPct > 0 && (
          <span className="absolute top-3 left-3 bg-gold text-dark text-xs font-bold px-2.5 py-1 rounded-full">
            -{discountPct}%
          </span>
        )}

        <div className="absolute inset-0 bg-dark/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleAddToCart}
            className="btn-primary p-3 rounded-full"
            title="Add to Cart"
          >
            <FaShoppingCart size={18} />
          </button>
          <button
            onClick={handleQuickView}
            className="glass border border-gold/30 text-gold p-3 rounded-full hover:border-gold/60 transition-all"
            title="Quick View"
          >
            <FaEye size={18} />
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`p-3 rounded-full transition-all ${
              wishlistState
                ? "bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-sm"
                : "glass border border-gold/20 text-cream/70 hover:border-gold/50 hover:text-cream"
            }`}
            title="Wishlist"
          >
            <FaHeart size={18} />
          </button>
        </div>
      </div>

      <div className="p-3 md:p-5">
        <p className="text-xs text-gold/80 font-medium uppercase tracking-wider mb-1">
          {product.category.name}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-playfair text-lg font-semibold text-cream mb-2 hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < Math.floor(product.rating) ? "text-gold" : "text-cream/20"}
              size={14}
            />
          ))}
          <span className="text-xs text-cream/50 ml-1">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

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
          onClick={handleAddToCart}
          className="w-full btn-primary"
        >
          <FaShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
