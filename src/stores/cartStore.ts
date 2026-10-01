import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT, PRICE_MULTIPLIER } from '@constants/student';

export interface CartItem {
  id: string | number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: { id: string | number; title: string; price: number; image: string }) => void;
  removeItem: (id: string | number) => void;
  changeQty: (id: string | number, delta: number) => void;
  clearCart: () => void;
  totalQuantity: () => number;
  totalAmount: () => number;
}

/**
 * Zustand Store quản lý Giỏ hàng + Persist AsyncStorage (Câu 3a)
 * Key persist bắt buộc: ktxgo-cart-{mssv}
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => String(item.id) === String(product.id));

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex].quantity += 1;
          set({ items: updated });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1,
              },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => String(item.id) !== String(id)),
        });
      },

      changeQty: (id, delta) => {
        const currentItems = get().items;
        const updated = currentItems
          .map((item) => {
            if (String(item.id) === String(id)) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter((item): item is CartItem => item !== null);

        set({ items: updated });
      },

      clearCart: () => {
        set({ items: [] });
      },

      totalQuantity: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalAmount: () => {
        return get().items.reduce((sum, item) => {
          const itemPriceVND = Math.round(item.price * PRICE_MULTIPLIER);
          return sum + itemPriceVND * item.quantity;
        }, 0);
      },
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCartStore;
