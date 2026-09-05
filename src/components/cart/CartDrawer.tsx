"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/store/ui";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { getProductById } from "@/lib/db";
import { formatINR } from "@/lib/site";

export default function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const setOpen = useUI((s) => s.setCartOpen);
  const user = useAuth((s) => s.user);
  const { items, updateQty, remove } = useCart();
  const uid = user ? user.id : "guest";

  const subtotal = items.reduce((a, i) => {
    const p = getProductById(i.product_id);
    return a + (p ? p.price : 0) * i.quantity;
  }, 0);

  const vkey = (i: (typeof items)[0]) =>
    i.product_id + "::" + (i.variant ? i.variant.type + ":" + i.variant.value : "");

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-navy-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-ivory shadow-2xl flex flex-col"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-navy/10 bg-white">
              <h3 className="font-serif text-xl text-navy">Your Cart</h3>
              <button onClick={() => setOpen(false)} className="text-navy/60 text-2xl">&times;</button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 rounded-full bg-navy/5 flex items-center justify-center mb-5">
                  <svg className="w-12 h-12 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l2 12h11l2-8H6M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                </div>
                <p className="text-navy font-medium mb-1">Your cart is empty</p>
                <p className="text-sm text-navy/50 mb-6">Add some premium timepieces &amp; eyewear.</p>
                <Link href="/shop" onClick={() => setOpen(false)} className="btn-gold px-6 py-3 rounded-full text-sm font-medium">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {items.map((i) => {
                    const p = getProductById(i.product_id);
                    if (!p) return null;
                    return (
                      <div key={vkey(i)} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-navy/5 shrink-0">
                          {p.images[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-navy truncate">{p.name}</p>
                          {i.variant && <p className="text-xs text-navy/50">{i.variant.type}: {i.variant.value}</p>}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-navy/15 rounded-full">
                              <button onClick={() => updateQty(uid, i.product_id, i.variant ? i.variant.type + ":" + i.variant.value : "", i.quantity - 1)} className="px-2.5 py-1 text-navy">−</button>
                              <span className="w-6 text-center text-sm">{i.quantity}</span>
                              <button onClick={() => updateQty(uid, i.product_id, i.variant ? i.variant.type + ":" + i.variant.value : "", i.quantity + 1)} className="px-2.5 py-1 text-navy">+</button>
                            </div>
                            <span className="text-sm font-semibold text-navy">{formatINR(p.price * i.quantity)}</span>
                          </div>
                        </div>
                        <button onClick={() => remove(uid, i.product_id, i.variant ? i.variant.type + ":" + i.variant.value : "")} className="self-start text-navy/30 hover:text-red-500 text-lg" aria-label="Remove">
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 border-t border-navy/10 bg-white">
                  <div className="flex justify-between text-navy mb-1">
                    <span>Subtotal</span><span className="font-semibold">{formatINR(subtotal)}</span>
                  </div>
                  <p className="text-xs text-navy/50 mb-3">Shipping &amp; discounts calculated at checkout.</p>
                  <Link href="/checkout" onClick={() => setOpen(false)} className="btn-gold block w-full text-center py-3 rounded-full font-semibold">
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
