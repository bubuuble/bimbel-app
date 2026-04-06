import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';

interface CartState {
  cartItem: Product | null;
  setCartItem: (item: Product) => void;
  clearCartItem: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItem: null,
      setCartItem: (item) => set({ cartItem: item }),
      clearCartItem: () => set({ cartItem: null }),
    }),
    {
      name: 'bimbel-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
