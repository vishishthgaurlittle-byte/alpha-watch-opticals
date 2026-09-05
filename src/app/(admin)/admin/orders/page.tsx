"use client";
import { useMemo, useState } from "react";
import { getAllOrders, getAllUsers, getProofForOrder, getDB, updateOrder, setProofStatus, fmtStatus, fmtPayment } from "@/lib/db";
import { formatINR, dateFmt, timeFmt } from "@/lib/site";

const statuses: { value: string; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "packed", label: "Packed" },
  { value: "ready_for_pickup", label: "Ready for Pickup" },
  { value: "dispatched", label: "Dispatched" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" }
];

export default function AdminOrders() {
  const [gen, setGen] = useState(0);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const { orders, users } = useMemo(() => ({ orders: getAllOrders(), users: getAllUsers() }), [gen]);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const sel = orders.find((o) => o.id === selected);
  const proof = sel ? getProofForOrder(sel.id) : undefined;

  const changeStatus = (o: any, status: string) => {
    updateOrder(o.id, { status: status as any });
    setGen((g) => g + 1);
  };

  const approve = (o: any) => {
    if (!proof) return;
    setProofStatus(proof.id, "approved");
    setGen((g) => g + 1);
  };
  const reject = (o: any) => {
    if (!proof) return;
    setProofStatus(proof.id, "rejected", rejectNote || "Payment not verified");
    setGen((g) => g + 1);
  };

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-1">Orders</h1>
      <p className="text-navy/50 text-sm mb-6">{orders.length} total orders</p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* list */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-navy/5 h-fit">
          <div className="flex gap-2 flex-wrap mb-4">
            <FilterBtn active={filter === "all"} onClick={() => setFilter("all")} label="All" />
            {statuses.map((s) => <FilterBtn key={s.value} active={filter === s.value} onClick={() => setFilter(s.value)} label={s.label} />)}
          </div>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {filtered.length === 0 && <p className="text-navy/50 text-sm py-6 text-center">No orders in this filter.</p>}
            {filtered.map((o) => {
              const u = users.find((x) => x.id === o.user_id);
              return (
                <button key={o.id} onClick={() => setSelected(o.id)} className={`w-full text-left border rounded-xl p-3 transition ${selected === o.id ? "border-gold bg-gold/5" : "border-navy/10 hover:border-gold/50"}`}>
                  <div className="flex justify-between">
                    <span className="font-medium text-navy text-sm">#{o.order_number}</span>
                    <span className="text-xs text-navy/50">{o.delivery_method === "pickup" ? "🏬 Pickup" : "🚚 Delivery"}</span>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-navy/60">
                    <span>{u?.name || "—"} · {dateFmt(o.created_at)}</span>
                    <span className="font-semibold text-navy">{formatINR(o.total)}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${o.payment_status === "approved" ? "bg-emerald/10 text-emerald" : o.payment_status === "proof_submitted" ? "bg-gold/10 text-gold-700" : o.payment_status === "rejected" ? "bg-red-50 text-red-600" : "bg-navy/5 text-navy"}`}>{fmtPayment(o.payment_status)}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy/5 text-navy">{fmtStatus(o.status)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* detail */}
        <div className="bg-white rounded-2xl p-5 border border-navy/5 h-fit">
          {!sel ? <p className="text-navy/50 text-sm text-center py-16">Select an order to view details.</p> : (
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-serif text-lg text-navy">#{sel.order_number}</h3>
                  <div className="text-xs text-navy/50">{timeFmt(sel.created_at)} · {sel.delivery_method === "pickup" ? "Pickup" : "Delivery"}</div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full ${sel.payment_status === "approved" ? "bg-emerald/10 text-emerald" : sel.payment_status === "proof_submitted" ? "bg-gold/10 text-gold-700" : sel.payment_status === "rejected" ? "bg-red-50 text-red-600" : "bg-navy/5 text-navy"}`}>{fmtPayment(sel.payment_status)}</span>
              </div>

              <div className="text-xs text-navy/60 mb-3">Customer: {users.find((x) => x.id === sel.user_id)?.name || "—"}</div>
              {sel.address && <div className="text-xs text-navy/60 mb-3 bg-navy/5 rounded-lg p-2">📍 {sel.address.address}, {sel.address.city} {sel.address.pincode} · 📞 {sel.address.phone}</div>}

              <div className="space-y-2 text-sm mb-4">
                {sel.items.map((it, i) => <div key={i} className="flex justify-between"><span className="text-navy/70">{it.name} ×{it.quantity}</span><span className="font-medium">{formatINR(it.total)}</span></div>)}
                <div className="flex justify-between border-t border-navy/10 pt-2 text-navy"><span className="font-semibold">Total</span><span className="font-bold">{formatINR(sel.total)}</span></div>
              </div>

              {/* payment proof */}
              {proof && (
                <div className="mb-4 border rounded-xl p-3">
                  <div className="text-xs font-semibold text-navy mb-2">UPI Payment Proof</div>
                  <img src={proof.image_url} alt="proof" className="max-h-40 rounded-lg mb-2 bg-navy/5 mx-auto" />
                  <div className="text-xs text-navy/50 mb-2">{timeFmt(proof.created_at)} · {fmtPayment(proof.status)}</div>
                  {proof.status === "proof_submitted" && (
                    <div className="space-y-2">
                      <button onClick={() => approve(sel)} className="btn-gold w-full py-2 rounded-full text-sm font-semibold">✓ Approve Proof</button>
                      <input value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} placeholder="Rejection reason" className="input-premium text-xs" />
                      <button onClick={() => reject(sel)} className="w-full py-2 rounded-full text-sm font-semibold border border-red-300 text-red-600 hover:bg-red-50">Reject Proof</button>
                    </div>
                  )}
                  {proof.status === "approved" && <div className="text-emerald text-xs font-medium">✓ Approved</div>}
                  {proof.status === "rejected" && <div className="text-red-500 text-xs">✗ Rejected: {proof.admin_note}</div>}
                </div>
              )}

              {/* status control */}
              <div>
                <div className="text-xs font-semibold text-navy mb-2">Set Order Status</div>
                <div className="flex flex-wrap gap-1.5">
                  {statuses.map((s) => (
                    <button key={s.value} onClick={() => changeStatus(sel, s.value)}
                      className={`px-2.5 py-1.5 rounded-full text-xs border transition ${sel.status === s.value ? "border-gold bg-gold text-white" : "border-navy/15 text-navy hover:border-gold"}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return <button onClick={onClick} className={`px-3 py-1.5 rounded-full text-xs border transition ${active ? "border-gold bg-gold text-white" : "border-navy/15 text-navy hover:border-gold"}`}>{label}</button>;
}
