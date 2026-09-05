"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getOrderById, getProofForOrder, fmtStatus, fmtPayment } from "@/lib/db";
import { formatINR, dateFmt } from "@/lib/site";
import { useAuth } from "@/store/auth";

export default function Confirmation({ params }: { params: { id: string } }) {
  const user = useAuth((s) => s.user);
  const [order, setOrder] = useState(() => getOrderById(params.id));
  const [proof, setProof] = useState(() => getProofForOrder(params.id));

  useEffect(() => {
    const o = getOrderById(params.id);
    setOrder(o);
    setProof(getProofForOrder(params.id));
  }, [params.id, user]);

  if (!order) {
    return (
      <div className="pt-32 pb-20 bg-ivory min-h-screen text-center px-4">
        <h1 className="font-serif text-2xl text-navy mb-2">Order not found</h1>
        <Link href="/shop" className="btn-gold px-6 py-3 rounded-full inline-block mt-4 font-semibold">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 bg-ivory min-h-screen">
      <div className="max-w-2xl mx-auto px-4 pb-24">
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="w-20 h-20 rounded-full bg-emerald text-white flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
        </motion.div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy text-center">Order Confirmed!</h1>
        <p className="text-navy/60 text-center mt-2">Thank you for shopping with {user?.name || "us"}. Your order has been placed.</p>

        <div className="bg-white rounded-2xl p-6 mt-8 border border-navy/5">
          <div className="flex justify-between py-3 border-b border-navy/10">
            <span className="text-navy/60">Order ID</span>
            <span className="font-semibold text-navy">#{order.order_number}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-navy/10">
            <span className="text-navy/60">Date</span>
            <span className="text-navy">{dateFmt(order.created_at)}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-navy/10">
            <span className="text-navy/60">Delivery</span>
            <span className="text-navy">{order.delivery_method === "pickup" ? "Pickup from Shop" : "Home Delivery"}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-navy/10">
            <span className="text-navy/60">Order Status</span>
            <span className="px-2.5 py-0.5 rounded-full bg-navy/5 text-navy text-sm">{fmtStatus(order.status)}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-navy/10">
            <span className="text-navy/60">Payment</span>
            <span className={`px-2.5 py-0.5 rounded-full text-sm ${
              order.payment_status === "approved" ? "bg-emerald/10 text-emerald" :
              order.payment_status === "proof_submitted" ? "bg-gold/10 text-gold-700" :
              order.payment_status === "rejected" ? "bg-red-50 text-red-600" : "bg-navy/5 text-navy"
            }`}>{fmtPayment(order.payment_status)}</span>
          </div>

          {/* payment proof message */}
          {order.payment_status === "proof_submitted" && (
            <div className="mt-4 bg-gold/10 rounded-xl p-4 text-sm text-gold-700">
              <b>Payment proof submitted.</b> Your UPI payment receipt is under review. We'll notify you once approved.{" "}
              {proof && <img src={proof.image_url} alt="proof" className="mt-3 max-h-32 rounded-lg" />}
            </div>
          )}
          {proof && proof.status === "rejected" && (
            <div className="mt-4 bg-red-50 rounded-xl p-4 text-sm text-red-600">
              <b>Payment proof rejected.</b> {proof.admin_note || "Please re-upload a clear screenshot from your orders page."}{" "}
              {order.delivery_method === "delivery" && <Link href={`/account/orders`} className="underline">Upload again</Link>}
            </div>
          )}
          {order.payment_status === "approved" && (
            <div className="mt-4 bg-emerald/10 rounded-xl p-4 text-sm text-emerald">
              <b>Payment approved ✓</b> Your order is being processed.
            </div>
          )}
          {order.payment_status === "pending" && order.delivery_method === "pickup" && (
            <div className="mt-4 bg-navy/5 rounded-xl p-4 text-sm text-navy">
              You can pay at the shop when you pick up your order. You may also pay online in advance if you'd like.
            </div>
          )}

          {/* items */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-navy mb-3">Items Ordered</h4>
            <div className="space-y-3">
              {order.items.map((it, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-navy/5 shrink-0">{it.image ? <img src={it.image} alt="" className="w-full h-full object-cover" /> : null}</div>
                  <div className="flex-1 text-sm text-navy">{it.name} {it.variant && <span className="text-navy/40">({it.variant.value})</span>} ×{it.quantity}</div>
                  <div className="font-medium text-navy">{formatINR(it.total)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-navy/10 mt-5 pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-navy/60">Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-emerald"><span>Discount</span><span>−{formatINR(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-navy/60">Delivery</span><span>{order.shipping === 0 ? "Free / Pickup" : formatINR(order.shipping)}</span></div>
            <div className="flex justify-between text-lg pt-2"><span className="font-semibold text-navy">Total</span><span className="font-bold text-navy">{formatINR(order.total)}</span></div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-8">
          <Link href="/shop" className="btn-gold px-6 py-3 rounded-full font-semibold">Continue Shopping</Link>
          <Link href="/account/orders" className="px-6 py-3 rounded-full font-semibold border border-navy/15 text-navy hover:border-gold transition">View My Orders</Link>
        </div>
      </div>
    </div>
  );
}
