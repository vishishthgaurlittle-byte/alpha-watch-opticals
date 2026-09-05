"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/store/auth";
import { toast } from "@/store/ui";
import { getOrderById, getProofForOrder, addPaymentProof, getOrdersByUser, fmtStatus, fmtPayment } from "@/lib/db";
import { formatINR, dateFmt, timeFmt } from "@/lib/site";
import { SITE } from "@/lib/site";

const orderSteps = ["pending", "confirmed", "packed", "ready_for_pickup", "dispatched", "out_for_delivery", "delivered"];

function OrdersContent() {
  const router = useRouter();
  const params = useSearchParams();
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);
  const orderId = params.get("o");
  const [selectedId, setSelectedId] = useState<string | null>(orderId);
  const [gen, setGen] = useState(0);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login?next=/account/orders");
  }, [user, hydrated, router]);

  if (!hydrated || !user) return <div className="pt-32 bg-ivory min-h-screen" />;

  const orders = getOrdersByUser(user.id);
  const targetOrder = (selectedId ? orders.find((x) => x.id === selectedId) : null) || orders[0];
  const proof = targetOrder ? getProofForOrder(targetOrder.id) : undefined;

  const uploadProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !targetOrder) return;
    const reader = new FileReader();
    reader.onload = () => {
      addPaymentProof(targetOrder.id, user.id, reader.result as string);
      setGen((g) => g + 1);
      toast("Payment proof uploaded ✓");
    };
    reader.readAsDataURL(f);
  };

  return (
    <div className="pt-24 md:pt-28 bg-ivory min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl font-bold text-navy">My Orders</h1>
          <Link href="/account" className="text-sm text-navy/50 hover:text-gold-700">← Back to Account</Link>
        </div>

        {/* order selector */}
        {orders.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
            {orders.map((o) => (
              <button key={o.id} onClick={() => setSelectedId(o.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border ${targetOrder?.id === o.id ? "border-gold bg-gold text-white" : "border-navy/15 text-navy"}`}>
                #{o.order_number}
              </button>
            ))}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-navy/5">
            <p className="text-navy font-medium">No orders yet.</p>
            <Link href="/shop" className="btn-gold px-6 py-3 rounded-full inline-block mt-4 font-semibold">Start Shopping</Link>
          </div>
        ) : targetOrder ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-navy/5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-semibold text-navy">#{targetOrder.order_number}</div>
                  <div className="text-xs text-navy/50 mt-0.5">{dateFmt(targetOrder.created_at)}</div>
                </div>
                <div className="text-right text-sm">
                  <span className={`px-2.5 py-0.5 rounded-full ${targetOrder.payment_status === "approved" ? "bg-emerald/10 text-emerald" : targetOrder.payment_status === "proof_submitted" ? "bg-gold/10 text-gold-700" : targetOrder.payment_status === "rejected" ? "bg-red-50 text-red-600" : "bg-navy/5 text-navy"}`}>{fmtPayment(targetOrder.payment_status)}</span>
                </div>
              </div>

              {/* order status timeline */}
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-navy/50 mb-3">Order Status</div>
                <div className="flex items-center gap-1">
                  {orderSteps.map((step, i) => {
                    const idx = orderSteps.indexOf(targetOrder.status);
                    const done = i <= idx || ["cancelled", "refunded"].includes(targetOrder.status);
                    const current = i === idx;
                    return (
                      <div key={step} className="flex-1 flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${done ? "bg-gold" : "bg-navy/10"} ${current ? "ring-4 ring-gold/30" : ""}`} />
                        <div className="mt-1.5 text-[8px] sm:text-[9px] text-navy/60 capitalize leading-tight text-center">{step.replace(/_/g, " ")}</div>
                        {i < orderSteps.length - 1 && <div className={`h-0.5 w-full ${done && i < idx ? "bg-gold" : "bg-navy/10"}`} style={{ marginTop: "-6px" }} />}
                      </div>
                    );
                  })}
                </div>
                {["cancelled", "refunded"].includes(targetOrder.status) && (
                  <div className="mt-3 text-sm text-red-500 font-medium">This order was {targetOrder.status}.</div>
                )}
              </div>

              <div className="space-y-3">
                {targetOrder.items.map((it, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-navy/5 shrink-0">{it.image ? <img src={it.image} alt="" className="w-full h-full object-cover" /> : null}</div>
                    <div className="flex-1 text-sm text-navy">{it.name} {it.variant && <span className="text-navy/40">({it.variant.value})</span>} ×{it.quantity}</div>
                    <div className="font-medium text-navy">{formatINR(it.total)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-navy/10 mt-5 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-navy/60">Subtotal</span><span>{formatINR(targetOrder.subtotal)}</span></div>
                {targetOrder.discount > 0 && <div className="flex justify-between text-emerald"><span>Discount</span><span>−{formatINR(targetOrder.discount)}</span></div>}
                <div className="flex justify-between"><span className="text-navy/60">Delivery</span><span>{targetOrder.shipping === 0 ? "Free / Pickup" : formatINR(targetOrder.shipping)}</span></div>
                <div className="flex justify-between text-lg pt-1"><span className="font-semibold">Total</span><span className="font-bold">{formatINR(targetOrder.total)}</span></div>
              </div>
              <div className="text-xs text-navy/50 mt-3">Delivery: {targetOrder.delivery_method === "pickup" ? "Pickup from shop · " + SITE.address : "Home delivery"}</div>
            </div>

            {/* payment proof section */}
            <div className="bg-white rounded-2xl p-6 border border-navy/5">
              <h3 className="font-serif text-lg text-navy mb-3">Payment Status</h3>
              {targetOrder.payment_status === "approved" && <div className="bg-emerald/10 text-emerald rounded-xl p-4 text-sm">✓ Payment approved. Thank you!</div>}
              {targetOrder.payment_status === "pending" && (
                targetOrder.delivery_method === "pickup" ?
                <div className="bg-navy/5 text-navy rounded-xl p-4 text-sm">You can pay at the shop when you collect your order.</div> :
                <div className="bg-navy/5 text-navy rounded-xl p-4 text-sm">Pay via UPI to <b>{SITE.upiId}</b> and upload the screenshot below.</div>
              )}
              {targetOrder.payment_status === "proof_submitted" && proof && (
                <div className="bg-gold/10 text-gold-700 rounded-xl p-4 text-sm">
                  Proof submitted {timeFmt(proof.created_at)}, awaiting admin approval.
                  <img src={proof.image_url} alt="proof" className="mt-3 max-h-40 rounded-lg bg-navy/5" />
                </div>
              )}
              {targetOrder.payment_status === "rejected" && proof && (
                <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">
                  Proof rejected. Reason: {proof.admin_note || "Not clear."} Please re-upload below.
                  <img src={proof.image_url} alt="rejected proof" className="mt-3 max-h-40 rounded-lg bg-navy/5" />
                </div>
              )}
              {(targetOrder.delivery_method === "delivery" || targetOrder.payment_status === "rejected" || (targetOrder.payment_status === "pending")) && targetOrder.payment_status !== "approved" && (
                <div className="mt-4">
                  {targetOrder.delivery_method === "pickup" && targetOrder.payment_status !== "rejected" ? (
                    <p className="text-xs text-navy/50">Optional: you may still pay online in advance.</p>
                  ) : null}
                  <label className="btn-gold inline-block px-6 py-3 rounded-full font-semibold cursor-pointer mt-2">
                    {targetOrder.payment_status === "pending" && targetOrder.delivery_method === "delivery" ? "Upload UPI Proof" : targetOrder.payment_status === "rejected" ? "Re-upload Proof" : "Upload UPI Proof"}
                    <input type="file" accept="image/*" className="hidden" onChange={uploadProof} />
                  </label>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return <Suspense fallback={<div className="pt-32 bg-ivory min-h-screen" />}><OrdersContent /></Suspense>;
}
