"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaTrash, FaMinus, FaPlus, FaRupeeSign } from "react-icons/fa";
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
      className="glass-card flex items-center gap-3 md:gap-4 p-3 md:p-4 border-gold/20"
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden">
        {item.product.images?.[0] ? (
          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="80px" />
        ) : (
          <Image src={`/images/products/${item.product.slug}.svg`} alt={item.product.name} fill className="object-cover" sizes="80px" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-cream font-playfair font-semibold text-xs md:text-base truncate">
          {item.product.name}
        </h3>
        <p className="text-gold text-xs md:text-sm font-medium mt-0.5">
          <FaRupeeSign size={10} className="inline" />
          {formatPrice(price)}
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="quantity-selector flex items-center rounded-full overflow-hidden border border-gold/30" style={{ height: "32px" }}>
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            className="hover:bg-gold hover:text-dark transition-colors text-gold w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
          >
            <FaMinus size={10} />
          </button>
          <span className="w-8 md:w-10 text-center text-xs md:text-sm font-semibold text-gold bg-dark/50">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className="hover:bg-gold hover:text-dark transition-colors text-gold w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
          >
            <FaPlus size={10} />
          </button>
        </div>

        <div className="text-right min-w-[60px] md:min-w-[80px]">
          <p className="text-xs md:text-sm font-bold text-gold">
            <FaRupeeSign size={10} className="inline" />
            {formatPrice(lineTotal)}
          </p>
        </div>

        <button
          onClick={() => onRemove(item.productId)}
          className="p-1.5 md:p-2 text-red-400/70 hover:text-red-400 rounded-full transition-all"
          title="Remove item"
        >
          <FaTrash size={12} />
        </button>
      </div>
    </motion.div>
  );
}
