"use client";
import { create } from "zustand";
import { useCart } from "./cart";

interface UIState {
  loading: boolean;
  setLoading: (v: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  flyToCart: { key: number; productId?: string } | null;
  triggerFly: () => void;
  toast: string | null;
  showToast: (msg: string | null) => void;
}

export const useUI = create<UIState>((set, get) => ({
  loading: true,
  setLoading: (v) => set({ loading: v }),
  cartOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  menuOpen: false,
  setMenuOpen: (v) => set({ menuOpen: v }),
  flyToCart: null,
  triggerFly: () => {
    const c = useCart.getState();
    c.load("guest");
    set({ flyToCart: { key: Date.now() }, cartOpen: true });
    setTimeout(() => set({ flyToCart: null }), 700);
  },
  toast: null,
  showToast: (msg) => set({ toast: msg })
}));

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function toast(msg: string) {
  const ui = useUI.getState();
  ui.showToast(msg);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ui.showToast(null), 2600);
}
