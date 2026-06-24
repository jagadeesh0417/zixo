"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  FaStar, FaHeart, FaShoppingCart, FaMinus, FaPlus, FaShare,
  FaArrowLeft, FaChevronDown, FaCheck, FaTruck,
  FaShieldAlt, FaExchangeAlt, FaLeaf,
} from "react-icons/fa";
import { useCartStore } from "@/store/cart";
import { toast } from "react-hot-toast";
import { formatPrice, getDiscountPercentage, truncate } from "@/lib/utils";
import { ProductType } from "@/types";
import ProductCard from "@/components/shop/ProductCard";

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={i < full ? "text-gold" : "text-cream/20"}
            size={size}
          />
        ))}
      </div>
    </div>
  );
}

function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gold/10 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-playfair text-lg font-semibold text-cream">{title}</span>
        <FaChevronDown
          className={`text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          size={14}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[800px] opacity-100 pb-4" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isInWishlist = useCartStore((s) => s.isInWishlist);

  const [product, setProduct] = useState<ProductType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.product);
        }
      })
      .finally(() => setLoading(false));

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRelatedProducts(
            data.products
              .filter((p: ProductType) => p.id !== id)
              .slice(0, 4)
          );
        }
      });
  }, [id]);

  const discountPct = product?.discountPrice
    ? getDiscountPercentage(product.price, product.discountPrice)
    : 0;

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const inWishlist = product ? isInWishlist(product.id) : false;

  const productImages = product?.images ?? [];
  const thumbnails = productImages.length > 0
    ? productImages
    : ["", "", "", ""];

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success("Proceeding to checkout...");
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product.id);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product?.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  let nutrition: Record<string, string> = {};
  try {
    if (product?.nutritionInfo) {
      nutrition = JSON.parse(product.nutritionInfo);
    }
  } catch {}

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🍪</div>
          <p className="text-cream/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="font-playfair text-2xl font-bold text-cream mb-2">Product not found</h2>
          <Link href="/shop" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-cream/60 hover:text-gold transition-colors text-sm font-medium mb-6"
          >
            <FaArrowLeft size={14} />
            Back to Shop
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              className="relative w-full h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden cursor-crosshair mb-4"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {product.images && product.images[selectedImage] ? (
                <div
                  className="relative w-full h-full transition-transform duration-200"
                  style={{
                    transform: isZoomed ? "scale(1.5)" : "scale(1)",
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  }}
                >
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-amber-900/30 flex items-center justify-center">
                  <Image
                    src="/images/products/classic-chocolate-chip.svg"
                    alt={product.name}
                    fill
                    className="object-cover opacity-50"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              {discountPct > 0 && (
                <span className="absolute top-4 left-4 bg-gold text-dark text-sm font-bold px-3 py-1.5 rounded-full">
                  -{discountPct}%
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {thumbnails.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === idx
                      ? "border-gold ring-2 ring-gold/30"
                      : "border-gold/10 hover:border-gold/50"
                  }`}
                >
                  {img ? (
                    <div className="relative w-full h-full">
                      <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" sizes="80px" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-amber-900/30 flex items-center justify-center">
                      <Image src="/images/products/classic-chocolate-chip.svg" alt={product.name} fill className="object-cover opacity-50" sizes="80px" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-medium px-3 py-1 rounded-full border border-gold/20 w-fit mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
              {product.category.name}
            </div>

            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-cream leading-tight mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.rating} size={18} />
              <span className="text-cream font-medium">{product.rating}</span>
              <span className="text-cream/40">|</span>
              <span className="text-cream/60 text-sm">{product.reviewCount} Reviews</span>
            </div>

            <div className="flex items-end gap-3 mb-4">
              <span className="text-3xl md:text-4xl font-bold text-cream">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-lg text-cream/50 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-gold/20 text-gold text-xs font-bold px-2 py-1 rounded">
                    Save {formatPrice(product.price - product.discountPrice)}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6 text-sm text-cream/60">
              <span className="flex items-center gap-1.5">
                <FaCheck size={12} className="text-gold" />
                {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
              {product.isBestSeller && (
                <span className="flex items-center gap-1.5 text-gold font-medium">
                  <FaStar size={12} />
                  Best Seller
                </span>
              )}
              {product.ingredients?.includes("Butter") && (
                <span className="flex items-center gap-1.5">
                  <FaLeaf size={12} className="text-gold" />
                  Vegetarian
                </span>
              )}
            </div>

            <p className="text-cream/70 leading-relaxed mb-6">
              {truncate(product.description, 200)}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gold/30 rounded-full overflow-hidden quantity-selector">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border-r border-gold/20 text-cream hover:bg-gold hover:text-dark transition-colors"
                >
                  <FaMinus size={12} />
                </button>
                <span className="w-14 text-center font-medium text-cream text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center border-l border-gold/20 text-cream hover:bg-gold hover:text-dark transition-colors"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1"
              >
                <FaShoppingCart size={16} />
                Add to Cart &mdash; {formatPrice((product.discountPrice || product.price) * quantity)}
              </button>
              <button
                onClick={handleBuyNow}
                className="btn-outline flex-1"
              >
                Buy Now
              </button>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={handleToggleWishlist}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  inWishlist
                    ? "text-red-500"
                    : "text-cream/60 hover:text-red-500"
                }`}
              >
                <FaHeart size={16} className={inWishlist ? "fill-red-500" : ""} />
                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-sm font-medium text-cream/60 hover:text-gold transition-colors"
              >
                <FaShare size={14} />
                Share
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 glass rounded-xl border border-gold/10">
              {[
                { icon: FaTruck, label: "Free delivery", sub: "On orders above ₹499" },
                { icon: FaShieldAlt, label: "Secure payment", sub: "100% secure" },
                { icon: FaExchangeAlt, label: "Easy returns", sub: "7-day return" },
                { icon: FaLeaf, label: "Fresh baked", sub: "Made to order" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <item.icon className="mx-auto text-gold mb-1" size={18} />
                  <p className="text-xs font-medium text-cream">{item.label}</p>
                  <p className="text-[10px] text-cream/50">{item.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 md:mt-16 bg-dark-card rounded-2xl border border-gold/10 p-6 md:p-8"
        >
          <AccordionSection title="Description" defaultOpen>
            <p className="text-cream/70 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </AccordionSection>

          <AccordionSection title="Ingredients" defaultOpen>
            <div className="space-y-2">
              <p className="text-cream/70 text-sm mb-2">
                Here&apos;s what goes into making this cookie perfect:
              </p>
              <div className="flex flex-wrap gap-2">
                {product.ingredients?.split(",").map((ing: string, i: number) => (
                  <span
                    key={i}
                    className="bg-dark-card px-3 py-1.5 rounded-full text-xs text-cream/70 border border-gold/10"
                  >
                    {ing.trim()}
                  </span>
                ))}
              </div>
              <p className="text-xs text-cream/40 mt-3">
                * Contains gluten, dairy, and eggs. May contain traces of nuts.
              </p>
            </div>
          </AccordionSection>

          <AccordionSection title="Nutritional Information">
            {Object.keys(nutrition).length > 0 && (
              <div className="space-y-2">
                {Object.entries(nutrition).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-1.5 border-b border-gold/10 last:border-0"
                  >
                    <span className="text-sm text-cream/70 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-sm font-medium text-cream">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </AccordionSection>

          <AccordionSection title={`Reviews (${product.reviewCount})`}>
            <div className="space-y-5">
              <p className="text-sm text-cream/50">Reviews coming soon</p>
            </div>
          </AccordionSection>
        </motion.div>

        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 md:mt-16"
          >
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-cream mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
