"use client";
import { create } from "zustand";
import type { CartItem } from "@/lib/types";
import { getCart, setCart, getProductById } from "@/lib/db";
import { useAuth } from "./auth";

interface CartState {
  items: CartItem[];
  load: (userId: string) => void;
  add: (userId: string, product_id: string, variant?: CartItem["variant"], qty?: number) => void;
  updateQty: (userId: string, product_id: string, variantKey: string, qty: number) => void;
  remove: (userId: string, product_id: string, variantKey: string) => void;
  clear: (userId: string) => void;
  count: () => number;
  subtotal: () => number;
}

const vkey = (it: Partial<CartItem>) =>
  it.product_id! + "::" + (it.variant ? it.variant.type + ":" + it.variant.value : "");

export const useCart = create<CartState>((set, get) => ({
  items: [],

  load: (userId) => {
    set({ items: getCart(userId) });
  },

  add: (userId, product_id, variant, qty = 1) => {
    const items = [...get().items];
    const key = vkey({ product_id, variant });
    const existing = items.find((i) => vkey(i) === key);
    if (existing) existing.quantity += qty;
    else items.push({ product_id, variant, quantity: qty, addedAt: Date.now() });
    set({ items });
    setCart(userId, items);
  },

  updateQty: (userId, product_id, variantKey, qty) => {
    let items = get().items.map((i) =>
      vkey(i) === product_id + "::" + (variantKey ? variantKey : "") ? { ...i, quantity: Math.max(1, qty) } : i
    );
    set({ items });
    setCart(userId, items);
  },

  remove: (userId, product_id, variantKey) => {
    const items = get().items.filter((i) => vkey(i) !== product_id + "::" + variantKey);
    set({ items });
    setCart(userId, items);
  },

  clear: (userId) => {
    set({ items: [] });
    setCart(userId, []);
  },

  count: () => get().items.reduce((a, i) => a + i.quantity, 0),
  subtotal: () =>
    get().items.reduce((a, i) => {
      const p = getProductById(i.product_id);
      return a + (p ? p.price : 0) * i.quantity;
    }, 0)
}));

// Convenience: merge guest cart into user cart on login
export function mergeGuestCart(userId: string) {
  // For a guest there is nothing to merge into — just load the guest cart.
  if (!userId || userId === "guest") {
    useCart.getState().load("guest");
    return;
  }
  const guestItems = getCart("guest");
  if (guestItems.length) {
    const ui = useCart.getState();
    const current = getCart(userId);
    const merged = [...current];
    guestItems.forEach((g) => {
      const key = vkey(g);
      const ex = merged.find((i) => vkey(i) === key);
      if (ex) ex.quantity += g.quantity;
      else merged.push(g);
    });
    setCart(userId, merged);
    setCart("guest", []);
    ui.load(userId);
  }
}
