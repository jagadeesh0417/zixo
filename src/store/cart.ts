import { create } from "zustand";

interface CartState {
  wishlist: string[];
  hydrated: boolean;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  hydrate: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  wishlist: [],
  hydrated: false,
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
        set({ wishlist: parsed.wishlist || [], hydrated: true });
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
  localStorage.setItem("zixo-cart", JSON.stringify({ wishlist: state.wishlist }));
}

useCartStore.subscribe(() => {
  persistCart();
});
