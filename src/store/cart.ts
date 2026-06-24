import { create } from "zustand";
import { CartItemType, ProductType } from "@/types";

interface CartState {
  items: CartItemType[];
  wishlist: string[];
  hydrated: boolean;
  addToCart: (product: ProductType, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  hydrate: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  wishlist: [],
  hydrated: false,
  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((item) => item.productId === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { id: product.id, productId: product.id, product, quantity }],
      };
    });
  },
  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  getCartTotal: () => {
    return get().items.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  },
  getCartCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
  toggleWishlist: (productId) => {
    set((state) => ({
      wishlist: state.wishlist.includes(productId)
        ? state.wishlist.filter((id) => id !== productId)
        : [...state.wishlist, productId],
    }));
  },
  isInWishlist: (productId) => {
    return get().wishlist.includes(productId);
  },
  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("zixo-cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ items: parsed.items || [], wishlist: parsed.wishlist || [], hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },
}));

export function persistCart() {
  if (typeof window === "undefined") return;
  const state = useCartStore.getState();
  localStorage.setItem("zixo-cart", JSON.stringify({ items: state.items, wishlist: state.wishlist }));
}

useCartStore.subscribe(() => {
  persistCart();
});
