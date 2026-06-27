"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar, FaEye, FaHeart } from "react-icons/fa";
import { useCartStore } from "@/store/cart";
import { toast } from "react-hot-toast";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { ProductType } from "@/types";

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isInWishlist = useCartStore((s) => s.isInWishlist);
  const [wishlistState, setWishlistState] = useState(isInWishlist(product.id));
  const [imgError, setImgError] = useState(false);

  const discountPct = product.discountPrice
    ? getDiscountPercentage(product.price, product.discountPrice)
    : 0;

  const imageSrc = product.images?.[0] && !imgError ? product.images[0] : `/images/products/${product.slug}.svg`;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/checkout?product=${product.id}&qty=1`);
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
      className="group glass-card overflow-hidden cursor-pointer flex flex-col"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </div>

        {discountPct > 0 && (
          <span className="absolute top-3 left-3 bg-gold text-dark text-xs font-bold px-2.5 py-1 rounded-full">
            -{discountPct}%
          </span>
        )}

        <div className="absolute inset-0 bg-dark/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 md:gap-3">
          <button
            onClick={handleBuyNow}
            className="btn-primary p-2 md:p-3 rounded-full"
            title="Buy Now"
          >
            <FaStar size={14} />
          </button>
          <button
            onClick={handleQuickView}
            className="glass border border-gold/30 text-gold p-2 md:p-3 rounded-full hover:border-gold/60 transition-all"
            title="Quick View"
          >
            <FaEye size={14} />
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`p-2 md:p-3 rounded-full transition-all ${
              wishlistState
                ? "bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-sm"
                : "glass border border-gold/20 text-cream/70 hover:border-gold/50 hover:text-cream"
            }`}
            title="Wishlist"
          >
            <FaHeart size={14} />
          </button>
        </div>
      </div>

      <div className="p-3 md:p-5 flex flex-col flex-1">
        <p className="text-[10px] md:text-xs text-gold/80 font-medium uppercase tracking-wider mb-1">
          {product.category.name}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-playfair text-sm md:text-lg font-semibold text-cream mb-1 md:mb-2 hover:text-gold transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-1 md:mb-2">
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

        <div className="flex items-center gap-2 mt-2 md:mt-3 mb-2 md:mb-4">
          <span className="text-base md:text-xl font-bold text-gold">
            {formatPrice(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-[11px] md:text-sm text-cream/50 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <button
          onClick={handleBuyNow}
          className="w-full btn-primary mt-auto justify-center text-xs md:text-sm py-2 md:py-2.5"
        >
          <FaStar size={12} />
          Buy Now
        </button>
      </div>
    </motion.div>
  );
}
