"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FaStar, FaHeart, FaShoppingCart, FaMinus, FaPlus, FaShare,
  FaArrowLeft, FaChevronDown, FaCookieBite, FaCheck, FaTruck,
  FaShieldAlt, FaExchangeAlt, FaLeaf,
} from "react-icons/fa";
import { useCartStore } from "@/store/cart";
import { toast } from "react-hot-toast";
import { formatPrice, getDiscountPercentage, truncate } from "@/lib/utils";
import { ProductType } from "@/types";
import ProductCard from "@/components/shop/ProductCard";

const reviews = [
  { id: "r1", name: "Priya Sharma", rating: 5, comment: "Absolutely delicious! The cookies were fresh and perfectly baked. Will definitely order again.", date: "2025-05-15" },
  { id: "r2", name: "Rahul Verma", rating: 4, comment: "Great quality and taste. The packaging was excellent too. Perfect for gifting.", date: "2025-05-10" },
  { id: "r3", name: "Ananya Patel", rating: 5, comment: "Best cookies I have ever had! The delivery was prompt and the cookies were still warm.", date: "2025-04-28" },
  { id: "r4", name: "Vikram Singh", rating: 4, comment: "Loved the variety in the mixed box. Each cookie had its own unique flavor.", date: "2025-04-20" },
];

const allProducts: ProductType[] = [
  {
    id: "cc-001", name: "Classic Chocolate Chip Cookie", slug: "classic-chocolate-chip", sku: "CC-001",
    description: "Our signature classic chocolate chip cookie baked to golden perfection. Made with premium Belgian chocolate chips and a secret family recipe that makes every bite irresistible. Each cookie is handcrafted with love, using the finest ingredients sourced from around the world. The result is a perfectly balanced cookie — crispy on the edges, chewy in the center, and loaded with rich, melted chocolate in every bite.\n\nWhether you enjoy it with a glass of cold milk or a hot cup of coffee, our Classic Chocolate Chip Cookie is the timeless treat that never goes out of style.",
    ingredients: "Wheat flour, Butter, Sugar, Belgian chocolate chips (35%), Brown sugar, Eggs, Vanilla extract, Baking soda, Sea salt",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (60g)", calories: 280, totalFat: "14g", saturatedFat: "8g", carbohydrates: "36g", sugar: "20g", protein: "4g", fiber: "1g", sodium: "120mg" }),
    price: 199, discountPrice: null, stockQuantity: 50, images: [], categoryId: "cat-1",
    category: { id: "cat-1", name: "Chocolate", slug: "chocolate", image: null },
    isFeatured: true, isBestSeller: true, isActive: true, rating: 4.8, reviewCount: 124,
    seoTitle: "Classic Chocolate Chip Cookie | Zixo Cookies", seoDescription: "Our signature chocolate chip cookie with premium Belgian chocolate.",
    createdAt: "2025-01-15", updatedAt: "2025-06-01",
  },
  {
    id: "od-002", name: "Oreo Delight Cookie", slug: "oreo-delight", sku: "OD-002",
    description: "A crunchy, creamy explosion of Oreo goodness in every cookie. Loaded with crushed Oreo pieces and white chocolate chunks for the ultimate cookie experience. Each bite delivers that nostalgic Oreo flavor you love, elevated with premium ingredients and our signature baking technique.\n\nPerfect for Oreo lovers looking for a new way to enjoy their favorite cookie.",
    ingredients: "Wheat flour, Butter, Sugar, Oreo pieces (30%), White chocolate chunks, Eggs, Vanilla extract, Baking powder",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (65g)", calories: 310, totalFat: "16g", saturatedFat: "9g", carbohydrates: "40g", sugar: "24g", protein: "5g", fiber: "1g", sodium: "150mg" }),
    price: 249, discountPrice: 199, stockQuantity: 35, images: [], categoryId: "cat-2",
    category: { id: "cat-2", name: "Oreo", slug: "oreo", image: null },
    isFeatured: true, isBestSeller: true, isActive: true, rating: 4.9, reviewCount: 98,
    seoTitle: "Oreo Delight Cookie | Zixo Cookies", seoDescription: "Loaded with Oreo pieces and white chocolate chunks.",
    createdAt: "2025-02-10", updatedAt: "2025-06-01",
  },
  {
    id: "rv-003", name: "Red Velvet Cookie", slug: "red-velvet", sku: "RV-003",
    description: "A stunning red velvet cookie with a soft, chewy texture and a hint of cocoa. Topped with creamy white chocolate chips that melt in your mouth. Our red velvet cookie is a feast for both the eyes and the palate, with its vibrant color and rich, buttery flavor.\n\nMade with real buttermilk and a touch of cocoa, this cookie captures the essence of the classic red velvet cake in a convenient, portable form.",
    ingredients: "Wheat flour, Butter, Sugar, Cocoa powder, Buttermilk, Eggs, Red food coloring, White chocolate chips, Vanilla extract, Baking soda, Vinegar",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (60g)", calories: 270, totalFat: "13g", saturatedFat: "7g", carbohydrates: "35g", sugar: "19g", protein: "3g", fiber: "1g", sodium: "110mg" }),
    price: 229, discountPrice: null, stockQuantity: 40, images: [], categoryId: "cat-3",
    category: { id: "cat-3", name: "Red Velvet", slug: "red-velvet", image: null },
    isFeatured: true, isBestSeller: true, isActive: true, rating: 4.7, reviewCount: 87,
    seoTitle: "Red Velvet Cookie | Zixo Cookies", seoDescription: "Soft red velvet cookie with white chocolate chips.",
    createdAt: "2025-01-20", updatedAt: "2025-06-01",
  },
  {
    id: "gb-004", name: "Golden Butter Cookie", slug: "golden-butter", sku: "GB-004",
    description: "A melt-in-your-mouth buttery cookie that's simple yet absolutely divine. Made with European butter and a touch of vanilla for that perfect golden crisp. Sometimes the simplest things are the most extraordinary — our Golden Butter Cookie is proof of that.\n\nWith its delicate crumb and rich, buttery flavor, this cookie pairs beautifully with tea or coffee and makes for an elegant treat any time of day.",
    ingredients: "European butter (40%), Wheat flour, Sugar, Eggs, Vanilla bean, Salt",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (50g)", calories: 240, totalFat: "14g", saturatedFat: "9g", carbohydrates: "28g", sugar: "14g", protein: "3g", fiber: "0g", sodium: "90mg" }),
    price: 179, discountPrice: null, stockQuantity: 60, images: [], categoryId: "cat-4",
    category: { id: "cat-4", name: "Butter", slug: "butter", image: null },
    isFeatured: false, isBestSeller: true, isActive: true, rating: 4.6, reviewCount: 65,
    seoTitle: "Golden Butter Cookie | Zixo Cookies", seoDescription: "Melt-in-your-mouth buttery cookie with European butter.",
    createdAt: "2025-03-05", updatedAt: "2025-06-01",
  },
  {
    id: "dc-005", name: "Double Chocolate Fudge Cookie", slug: "double-chocolate-fudge", sku: "DC-005",
    description: "For the ultimate chocolate lover — a rich, fudgy double chocolate cookie loaded with dark and milk chocolate chunks. Perfectly gooey on the inside with a slight crackle on top. This is our most indulgent chocolate creation, made with two types of premium chocolate for a deep, complex flavor.\n\nThe dark chocolate provides a rich intensity while the milk chocolate adds creamy sweetness, creating a perfectly balanced cookie that chocolate lovers dream about.",
    ingredients: "Wheat flour, Butter, Dark chocolate (40%), Sugar, Eggs, Cocoa powder, Milk chocolate chunks, Vanilla extract, Baking soda, Salt",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (65g)", calories: 330, totalFat: "18g", saturatedFat: "11g", carbohydrates: "38g", sugar: "22g", protein: "5g", fiber: "2g", sodium: "130mg" }),
    price: 259, discountPrice: null, stockQuantity: 30, images: [], categoryId: "cat-1",
    category: { id: "cat-1", name: "Chocolate", slug: "chocolate", image: null },
    isFeatured: true, isBestSeller: true, isActive: true, rating: 4.9, reviewCount: 112,
    seoTitle: "Double Chocolate Fudge Cookie | Zixo Cookies", seoDescription: "Rich fudgy double chocolate cookie with chocolate chunks.",
    createdAt: "2025-02-14", updatedAt: "2025-06-01",
  },
  {
    id: "mb-006", name: "Signature Mixed Box", slug: "signature-mixed-box", sku: "MB-006",
    description: "Our best-selling assortment featuring 6 handpicked cookie flavors. The perfect gift for any occasion, beautifully packed in a premium gift box. Each box contains a curated selection of our most popular flavors, carefully arranged to provide a delightful variety of tastes and textures.\n\nPerfect for parties, corporate gifting, or simply treating yourself to a taste of everything we have to offer.",
    ingredients: "Assorted cookies: Chocolate Chip, Oreo Delight, Red Velvet, Golden Butter, Double Chocolate, Salted Caramel",
    nutritionInfo: JSON.stringify({ servingSize: "1 box (360g)", calories: 1680, totalFat: "84g", saturatedFat: "52g", carbohydrates: "210g", sugar: "120g", protein: "24g", fiber: "6g", sodium: "720mg" }),
    price: 599, discountPrice: 549, stockQuantity: 25, images: [], categoryId: "cat-5",
    category: { id: "cat-5", name: "Mixed Boxes", slug: "mixed-boxes", image: null },
    isFeatured: true, isBestSeller: true, isActive: true, rating: 4.8, reviewCount: 203,
    seoTitle: "Signature Mixed Box | Zixo Cookies", seoDescription: "Assorted 6-cookie gift box with our best-selling flavors.",
    createdAt: "2025-01-10", updatedAt: "2025-06-01",
  },
];

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
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

const gradients = [
  "from-amber-200 to-orange-300",
  "from-purple-200 to-pink-300",
  "from-red-200 to-rose-300",
  "from-yellow-200 to-amber-300",
];

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isInWishlist = useCartStore((s) => s.isInWishlist);

  const product = allProducts.find((p) => p.id === id) || allProducts[0];
  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const discountPct = product.discountPrice
    ? getDiscountPercentage(product.price, product.discountPrice)
    : 0;

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const inWishlist = isInWishlist(product.id);

  const thumbnails = product.images.length > 0
    ? product.images
    : ["", "", "", ""];

  const gradientIdx = parseInt(product.id.replace(/\D/g, ""), 10) % gradients.length || 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    toast.success("Proceeding to checkout...");
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
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
    if (product.nutritionInfo) {
      nutrition = JSON.parse(product.nutritionInfo);
    }
  } catch {}

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
                  className="w-full h-full bg-cover bg-center transition-transform duration-200"
                  style={{
                    backgroundImage: `url(${product.images[selectedImage]})`,
                    transform: isZoomed ? "scale(1.5)" : "scale(1)",
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  }}
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${gradients[gradientIdx]} flex items-center justify-center`}
                >
                  <FaCookieBite size={120} className="text-white/50" />
                </div>
              )}
              {discountPct > 0 && (
                <span className="absolute top-4 left-4 bg-gold text-dark text-sm font-bold px-3 py-1.5 rounded-full">
                  -{discountPct}%
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {thumbnails.map((img, idx) => (
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
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center`}>
                      <FaCookieBite size={24} className="text-white/50" />
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
              <FaCookieBite size={12} />
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
                {product.ingredients?.split(",").map((ing, i) => (
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
              {reviews.map((review) => (
                <div key={review.id} className="pb-4 border-b border-gold/10 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-cream text-sm">{review.name}</span>
                    <span className="text-xs text-cream/40">{review.date}</span>
                  </div>
                  <StarRating rating={review.rating} size={13} />
                  <p className="text-sm text-cream/70 mt-1.5">{review.comment}</p>
                </div>
              ))}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
