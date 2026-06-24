"use client";

import { motion } from "framer-motion";
import { FaTrash, FaMinus, FaPlus, FaCookieBite, FaRupeeSign } from "react-icons/fa";
import { formatPrice } from "@/lib/utils";
import { CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const price = item.product.discountPrice || item.product.price;
  const lineTotal = price * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" as const }}
      className="glass-card flex items-center gap-4 p-4 border-gold/20"
    >
      <div className="img-placeholder w-20 h-20 flex-shrink-0 rounded-lg flex items-center justify-center overflow-hidden">
        <FaCookieBite size={36} className="text-gold/40" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-cream font-playfair font-semibold text-base truncate">
          {item.product.name}
        </h3>
        <p className="text-gold text-sm font-medium mt-0.5">
          <FaRupeeSign size={11} className="inline" />
          {formatPrice(price)} <span className="text-cream/40 text-xs">per unit</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="quantity-selector flex items-center rounded-full overflow-hidden border border-gold/30">
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            className="hover:bg-gold hover:text-dark transition-colors text-gold"
          >
            <FaMinus size={12} />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-gold bg-dark/50">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className="hover:bg-gold hover:text-dark transition-colors text-gold"
          >
            <FaPlus size={12} />
          </button>
        </div>

        <div className="text-right min-w-[80px]">
          <p className="text-sm font-bold text-gold">
            <FaRupeeSign size={11} className="inline" />
            {formatPrice(lineTotal)}
          </p>
        </div>

        <button
          onClick={() => onRemove(item.productId)}
          className="p-2 text-red-400/70 hover:text-red-400 bg-glass rounded-full transition-all"
          title="Remove item"
        >
          <FaTrash size={14} />
        </button>
      </div>
    </motion.div>
  );
}
