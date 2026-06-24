"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FaCookieBite, FaArrowRight } from "react-icons/fa";
import ProductFilters, { FilterState } from "@/components/shop/ProductFilters";
import ProductCard from "@/components/shop/ProductCard";
import { ProductType } from "@/types";

const placeholderProducts: ProductType[] = [
  {
    id: "cc-001", name: "Classic Chocolate Chip Cookie", slug: "classic-chocolate-chip", sku: "CC-001",
    description: "Our signature classic chocolate chip cookie baked to golden perfection. Made with premium Belgian chocolate chips and a secret family recipe that makes every bite irresistible.",
    ingredients: "Wheat flour, Butter, Sugar, Belgian chocolate chips (35%), Brown sugar, Eggs, Vanilla extract, Baking soda, Sea salt",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (60g)", calories: 280, totalFat: "14g", saturatedFat: "8g", carbohydrates: "36g", sugar: "20g", protein: "4g" }),
    price: 199, discountPrice: null, stockQuantity: 50, images: ["/images/products/classic-chocolate-chip.svg"], categoryId: "cat-1",
    category: { id: "cat-1", name: "Chocolate", slug: "chocolate", image: null },
    isFeatured: true, isBestSeller: true, isActive: true, rating: 4.8, reviewCount: 124,
    seoTitle: null, seoDescription: null, createdAt: "2025-01-15", updatedAt: "2025-06-01",
  },
  {
    id: "od-002", name: "Oreo Delight Cookie", slug: "oreo-delight", sku: "OD-002",
    description: "A crunchy, creamy explosion of Oreo goodness in every cookie. Loaded with crushed Oreo pieces and white chocolate chunks for the ultimate cookie experience.",
    ingredients: "Wheat flour, Butter, Sugar, Oreo pieces (30%), White chocolate chunks, Eggs, Vanilla extract, Baking powder",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (65g)", calories: 310, totalFat: "16g", saturatedFat: "9g", carbohydrates: "40g", sugar: "24g", protein: "5g" }),
    price: 249, discountPrice: 199, stockQuantity: 35, images: ["/images/products/oreo-delight.svg"], categoryId: "cat-2",
    category: { id: "cat-2", name: "Oreo", slug: "oreo", image: null },
    isFeatured: true, isBestSeller: true, isActive: true, rating: 4.9, reviewCount: 98,
    seoTitle: null, seoDescription: null, createdAt: "2025-02-10", updatedAt: "2025-06-01",
  },
  {
    id: "rv-003", name: "Red Velvet Cookie", slug: "red-velvet", sku: "RV-003",
    description: "A stunning red velvet cookie with a soft, chewy texture and a hint of cocoa. Topped with creamy white chocolate chips that melt in your mouth.",
    ingredients: "Wheat flour, Butter, Sugar, Cocoa powder, Buttermilk, Eggs, Red food coloring, White chocolate chips, Vanilla extract, Baking soda, Vinegar",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (60g)", calories: 270, totalFat: "13g", saturatedFat: "7g", carbohydrates: "35g", sugar: "19g", protein: "3g" }),
    price: 229, discountPrice: null, stockQuantity: 40, images: ["/images/products/red-velvet.svg"], categoryId: "cat-3",
    category: { id: "cat-3", name: "Red Velvet", slug: "red-velvet", image: null },
    isFeatured: true, isBestSeller: true, isActive: true, rating: 4.7, reviewCount: 87,
    seoTitle: null, seoDescription: null, createdAt: "2025-01-20", updatedAt: "2025-06-01",
  },
  {
    id: "gb-004", name: "Golden Butter Cookie", slug: "golden-butter", sku: "GB-004",
    description: "A melt-in-your-mouth buttery cookie that's simple yet absolutely divine. Made with European butter and a touch of vanilla for that perfect golden crisp.",
    ingredients: "European butter (40%), Wheat flour, Sugar, Eggs, Vanilla bean, Salt",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (50g)", calories: 240, totalFat: "14g", saturatedFat: "9g", carbohydrates: "28g", sugar: "14g", protein: "3g" }),
    price: 179, discountPrice: null, stockQuantity: 60, images: ["/images/products/golden-butter.svg"], categoryId: "cat-4",
    category: { id: "cat-4", name: "Butter", slug: "butter", image: null },
    isFeatured: false, isBestSeller: true, isActive: true, rating: 4.6, reviewCount: 65,
    seoTitle: null, seoDescription: null, createdAt: "2025-03-05", updatedAt: "2025-06-01",
  },
  {
    id: "dc-005", name: "Double Chocolate Fudge Cookie", slug: "double-chocolate-fudge", sku: "DC-005",
    description: "For the ultimate chocolate lover — a rich, fudgy double chocolate cookie loaded with dark and milk chocolate chunks. Perfectly gooey on the inside with a slight crackle on top.",
    ingredients: "Wheat flour, Butter, Dark chocolate (40%), Sugar, Eggs, Cocoa powder, Milk chocolate chunks, Vanilla extract, Baking soda, Salt",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (65g)", calories: 330, totalFat: "18g", saturatedFat: "11g", carbohydrates: "38g", sugar: "22g", protein: "5g" }),
    price: 259, discountPrice: null, stockQuantity: 30, images: ["/images/products/double-chocolate.svg"], categoryId: "cat-1",
    category: { id: "cat-1", name: "Chocolate", slug: "chocolate", image: null },
    isFeatured: true, isBestSeller: true, isActive: true, rating: 4.9, reviewCount: 112,
    seoTitle: null, seoDescription: null, createdAt: "2025-02-14", updatedAt: "2025-06-01",
  },
  {
    id: "mb-006", name: "Signature Mixed Box", slug: "signature-mixed-box", sku: "MB-006",
    description: "Our best-selling assortment featuring 6 handpicked cookie flavors. The perfect gift for any occasion, beautifully packed in a premium gift box.",
    ingredients: "Assorted cookies: Chocolate Chip, Oreo Delight, Red Velvet, Golden Butter, Double Chocolate, Salted Caramel",
    nutritionInfo: JSON.stringify({ servingSize: "1 box (360g)", calories: 1680, totalFat: "84g", saturatedFat: "52g", carbohydrates: "210g", sugar: "120g", protein: "24g" }),
    price: 599, discountPrice: 549, stockQuantity: 25, images: ["/images/products/mixed-box.svg"], categoryId: "cat-5",
    category: { id: "cat-5", name: "Mixed Boxes", slug: "mixed-boxes", image: null },
    isFeatured: true, isBestSeller: true, isActive: true, rating: 4.8, reviewCount: 203,
    seoTitle: null, seoDescription: null, createdAt: "2025-01-10", updatedAt: "2025-06-01",
  },
  {
    id: "sc-007", name: "Salted Caramel Crunch", slug: "salted-caramel-crunch", sku: "SC-007",
    description: "Sweet and salty perfection. A buttery cookie base topped with house-made salted caramel drizzle and a sprinkle of sea salt flakes.",
    ingredients: "Wheat flour, Butter, Brown sugar, Sugar, Eggs, Caramel sauce, Sea salt flakes, Vanilla extract, Baking soda",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (60g)", calories: 290, totalFat: "15g", saturatedFat: "9g", carbohydrates: "37g", sugar: "21g", protein: "3g" }),
    price: 219, discountPrice: null, stockQuantity: 45, images: ["/images/products/salted-caramel-crunch.svg"], categoryId: "cat-4",
    category: { id: "cat-4", name: "Butter", slug: "butter", image: null },
    isFeatured: false, isBestSeller: false, isActive: true, rating: 4.5, reviewCount: 42,
    seoTitle: null, seoDescription: null, createdAt: "2025-04-01", updatedAt: "2025-06-01",
  },
  {
    id: "pb-008", name: "Peanut Butter Bliss", slug: "peanut-butter-bliss", sku: "PB-008",
    description: "Rich and nutty peanut butter cookie with a soft, chewy center. Made with all-natural peanut butter and topped with crushed peanuts for extra crunch.",
    ingredients: "Wheat flour, Natural peanut butter (35%), Butter, Brown sugar, Sugar, Eggs, Crushed peanuts, Vanilla extract, Baking soda",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (60g)", calories: 300, totalFat: "17g", saturatedFat: "7g", carbohydrates: "32g", sugar: "17g", protein: "7g" }),
    price: 209, discountPrice: 179, stockQuantity: 38, images: ["/images/products/peanut-butter-bliss.svg"], categoryId: "cat-1",
    category: { id: "cat-1", name: "Chocolate", slug: "chocolate", image: null },
    isFeatured: false, isBestSeller: false, isActive: true, rating: 4.4, reviewCount: 33,
    seoTitle: null, seoDescription: null, createdAt: "2025-03-20", updatedAt: "2025-06-01",
  },
  {
    id: "wc-009", name: "White Chocolate Macadamia", slug: "white-chocolate-macadamia", sku: "WC-009",
    description: "A luxuriously soft cookie loaded with creamy white chocolate chunks and buttery macadamia nuts. A premium cookie experience.",
    ingredients: "Wheat flour, Butter, White chocolate chunks (30%), Macadamia nuts (20%), Sugar, Eggs, Vanilla extract, Baking soda, Salt",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (65g)", calories: 320, totalFat: "19g", saturatedFat: "10g", carbohydrates: "34g", sugar: "20g", protein: "5g" }),
    price: 269, discountPrice: null, stockQuantity: 28, images: ["/images/products/white-chocolate-macadamia.svg"], categoryId: "cat-4",
    category: { id: "cat-4", name: "Butter", slug: "butter", image: null },
    isFeatured: false, isBestSeller: false, isActive: true, rating: 4.7, reviewCount: 56,
    seoTitle: null, seoDescription: null, createdAt: "2025-02-28", updatedAt: "2025-06-01",
  },
  {
    id: "ob-010", name: "Oreo Birthday Blast", slug: "oreo-birthday-blast", sku: "OB-010",
    description: "Celebration-worthy cookie packed with Oreo pieces and colorful sprinkles. A fun, festive twist on our classic Oreo cookie.",
    ingredients: "Wheat flour, Butter, Sugar, Oreo pieces (25%), Rainbow sprinkles, White chocolate chips, Eggs, Vanilla extract, Baking powder",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (65g)", calories: 300, totalFat: "15g", saturatedFat: "8g", carbohydrates: "38g", sugar: "23g", protein: "4g" }),
    price: 259, discountPrice: 219, stockQuantity: 20, images: ["/images/products/oreo-birthday-blast.svg"], categoryId: "cat-2",
    category: { id: "cat-2", name: "Oreo", slug: "oreo", image: null },
    isFeatured: false, isBestSeller: false, isActive: true, rating: 4.6, reviewCount: 28,
    seoTitle: null, seoDescription: null, createdAt: "2025-05-01", updatedAt: "2025-06-01",
  },
  {
    id: "rv-011", name: "Red Velvet Cheesecake", slug: "red-velvet-cheesecake", sku: "RV-011",
    description: "The best of both worlds — a red velvet cookie stuffed with a creamy cheesecake center. Decadently delicious and utterly unique.",
    ingredients: "Wheat flour, Butter, Cream cheese, Sugar, Cocoa powder, Buttermilk, Eggs, Red food coloring, White chocolate chips, Vanilla extract, Baking soda",
    nutritionInfo: JSON.stringify({ servingSize: "1 cookie (75g)", calories: 350, totalFat: "20g", saturatedFat: "12g", carbohydrates: "38g", sugar: "22g", protein: "5g" }),
    price: 289, discountPrice: null, stockQuantity: 25, images: ["/images/products/red-velvet-cheesecake.svg"], categoryId: "cat-3",
    category: { id: "cat-3", name: "Red Velvet", slug: "red-velvet", image: null },
    isFeatured: false, isBestSeller: false, isActive: true, rating: 4.8, reviewCount: 49,
    seoTitle: null, seoDescription: null, createdAt: "2025-04-15", updatedAt: "2025-06-01",
  },
  {
    id: "gx-012", name: "Gourmet Gift Box", slug: "gourmet-gift-box", sku: "GX-012",
    description: "Our premium gift box featuring 12 assorted gourmet cookies in an elegant presentation box. The perfect corporate gift or special occasion surprise.",
    ingredients: "Assorted premium cookies: Chocolate Chip, Oreo Delight, Red Velvet, Golden Butter, Double Chocolate, Salted Caramel, Peanut Butter, White Chocolate Macadamia, Coconut Dream, Matcha Green Tea, Blueberry Bliss, Almond Crisp",
    nutritionInfo: JSON.stringify({ servingSize: "1 box (720g)", calories: 3360, totalFat: "168g", saturatedFat: "104g", carbohydrates: "420g", sugar: "240g", protein: "48g" }),
    price: 1199, discountPrice: 999, stockQuantity: 15, images: ["/images/products/gourmet-gift-box.svg"], categoryId: "cat-5",
    category: { id: "cat-5", name: "Mixed Boxes", slug: "mixed-boxes", image: null },
    isFeatured: true, isBestSeller: false, isActive: true, rating: 4.9, reviewCount: 78,
    seoTitle: null, seoDescription: null, createdAt: "2025-01-05", updatedAt: "2025-06-01",
  },
];

const ITEMS_PER_PAGE = 8;

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    priceRange: "",
    sortBy: "",
  });
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filteredProducts = useMemo(() => {
    let result = [...placeholderProducts];

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
  }, [filters]);

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
            {filteredProducts.length === 0
              ? "No products found"
              : `Showing ${visibleProducts.length} of ${filteredProducts.length} products`}
          </p>
          {filters.search && (
            <p className="text-sm text-cream/50">
              Search: &ldquo;{filters.search}&rdquo;
            </p>
          )}
        </div>

        {visibleProducts.length > 0 ? (
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
