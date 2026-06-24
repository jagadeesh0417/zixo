"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaShoppingBag, FaTrash, FaArrowLeft, FaArrowRight, FaTag, FaCookieBite, FaRupeeSign,
} from "react-icons/fa";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";
import CartItem from "@/components/cart/CartItem";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = getCartTotal();
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = 0;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    setCouponApplied(true);
    toast.success("Coupon applied! 10% discount");
  };

  if (items.length === 0) {
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
            <h1 className="section-title">Your Cart</h1>
            <p className="text-cream/70 text-lg">Items you love, waiting for you</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto px-4 py-20 text-center"
        >
          <div className="text-8xl mb-6 opacity-20 text-gold">🛒</div>
          <h2 className="font-playfair text-2xl font-semibold text-cream mb-2">
            Your cart is empty
          </h2>
          <p className="text-cream/70 mb-8">
            Looks like you haven&apos;t added any cookies yet. Browse our collection and find your favorites!
          </p>
          <Link href="/shop" className="btn-primary inline-flex">
            <FaShoppingBag size={16} />
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="relative py-12 md:py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-gold/5 text-8xl">🍪</div>
          <div className="absolute bottom-10 right-10 text-gold/5 text-8xl">✨</div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="section-title">Your Cart</h1>
          <p className="text-cream/70">
            {items.reduce((sum, i) => sum + i.quantity, 0)} items in your cart
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 lg:w-[60%]">
            <div className="glass-card p-6 border-gold/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-xl font-semibold text-cream">
                  Cart Items ({items.length})
                </h2>
                <button
                  onClick={() => {
                    clearCart();
                    toast.success("Cart cleared");
                  }}
                  className="text-sm text-red-400/70 hover:text-red-400 flex items-center gap-1.5 transition-colors"
                >
                  <FaTrash size={12} />
                  Clear All
                </button>
              </div>

              <AnimatePresence mode="popLayout">
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              </AnimatePresence>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors mt-6"
            >
              <FaArrowLeft size={12} />
              Continue Shopping
            </Link>
          </div>

          <div className="lg:w-[40%]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 border-gold/10 sticky top-24"
            >
              <h2 className="font-playfair text-xl font-semibold text-cream mb-6">
                Order Summary
              </h2>

              <div className="glass p-4 rounded-xl border-gold/20 mb-6">
                <label className="block text-sm font-medium text-cream/70 mb-2">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    disabled={couponApplied}
                    className="input-field flex-1 disabled:opacity-50"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponApplied}
                    className="btn-primary px-4 py-2.5 text-sm disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <FaTag size={12} />
                    {couponApplied ? "Applied" : "Apply"}
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
                    <FaTag size={10} /> Coupon applied! 10% discount
                  </p>
                )}
              </div>

              <div className="space-y-3 text-sm border-t border-gold/10 pt-4">
                <div className="flex justify-between text-cream/70">
                  <span>Subtotal</span>
                  <span className="font-medium text-cream">
                    <FaRupeeSign size={11} className="inline" />
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount (10%)</span>
                    <span className="font-medium">-<FaRupeeSign size={11} className="inline" />{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-cream/70">
                  <span>Shipping</span>
                  <span className="flex items-center gap-1.5">
                    <span className="bg-gold/10 text-gold border border-gold/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      FREE
                    </span>
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gold border-t border-gold/10 pt-3 mt-3">
                  <span>Total</span>
                  <span><FaRupeeSign size={13} className="inline" />{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-primary w-full justify-center mt-6"
              >
                <FaArrowRight size={14} />
                Proceed to Checkout
              </Link>

              <Link
                href="/shop"
                className="block text-center text-sm text-gold/70 hover:text-gold transition-colors mt-3"
              >
                <FaArrowLeft size={12} className="inline mr-1" />
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
