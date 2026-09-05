"use client";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";
import { getProductById, getCoupon } from "@/lib/db";
import { formatINR } from "@/lib/site";
import { toast } from "@/store/ui";

export default function CartPage() {
  const user = useAuth((s) => s.user);
  const uid = user ? user.id : "guest";
  const { items, updateQty, remove } = useCart();

  const subtotal = items.reduce((a, i) => {
    const p = getProductById(i.product_id);
    return a + (p ? p.price : 0) * i.quantity;
  }, 0);

  const vkey = (i: (typeof items)[0]) =>
    i.product_id + "::" + (i.variant ? i.variant.type + ":" + i.variant.value : "");

  return (
    <div className="pt-24 md:pt-28 bg-ivory min-h-screen">
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-navy/5">
            <div className="w-24 h-24 mx-auto rounded-full bg-navy/5 flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l2 12h11l2-8H6"/></svg>
            </div>
            <p className="text-navy font-semibold text-lg mb-1">Your cart is empty</p>
            <p className="text-navy/50 text-sm mb-6">Discover premium watches and eyewear.</p>
            <Link href="/shop" className="btn-gold px-8 py-3 rounded-full font-semibold">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((i) => {
                const p = getProductById(i.product_id);
                if (!p) return null;
                return (
                  <div key={vkey(i)} className="bg-white rounded-2xl p-4 flex gap-4 border border-navy/5">
                    <Link href={`/product/${p.slug}`} className="w-24 h-24 rounded-xl overflow-hidden bg-navy/5 shrink-0">
                      {p.images[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : null}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${p.slug}`} className="font-medium text-navy hover:text-gold-700">{p.name}</Link>
                      {i.variant && <div className="text-xs text-navy/50 mt-0.5">{i.variant.type}: {i.variant.value}</div>}
                      <div className="text-gold-700 font-semibold mt-1">{formatINR(p.price)}</div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-navy/15 rounded-full">
                          <button onClick={() => updateQty(uid, i.product_id, i.variant ? i.variant.type + ":" + i.variant.value : "", i.quantity - 1)} className="px-3 py-1">−</button>
                          <span className="w-8 text-center">{i.quantity}</span>
                          <button onClick={() => updateQty(uid, i.product_id, i.variant ? i.variant.type + ":" + i.variant.value : "", i.quantity + 1)} className="px-3 py-1">+</button>
                        </div>
                        <button onClick={() => remove(uid, i.product_id, i.variant ? i.variant.type + ":" + i.variant.value : "")} className="text-red-500 text-sm">Remove</button>
                      </div>
                    </div>
                    <div className="font-bold text-navy">{formatINR(p.price * i.quantity)}</div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-navy/5 h-fit">
              <h3 className="font-serif text-lg text-navy mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-navy/60">Subtotal</span><span className="text-navy font-medium">{formatINR(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-navy/60">Delivery</span><span className="text-navy/60">Calculated at checkout</span></div>
              </div>
              <div className="border-t border-navy/10 my-4" />
              <div className="flex justify-between text-lg"><span className="text-navy">Total</span><span className="text-navy font-bold">{formatINR(subtotal)}</span></div>
              <Link href="/checkout" className="btn-gold block w-full text-center py-3 rounded-full font-semibold mt-6">Proceed to Checkout</Link>
              <p className="text-xs text-navy/50 text-center mt-3">
                {user ? "You're logged in. Checkout is ready." : "Login required at checkout."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
