"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { getAllOrders, getAllUsers, getAllProducts, getDB, fmtStatus, fmtPayment } from "@/lib/db";
import { formatINR, dateFmt } from "@/lib/site";

export default function AdminDashboard() {
  const [gen] = useState(0);
  const data = useMemo(() => {
    const orders = getAllOrders();
    const users = getAllUsers();
    const products = getAllProducts();
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter((o) => o.created_at.slice(0, 10) === today);
    const pendingProofs = getDB().payment_proofs.filter((p) => p.status === "proof_submitted");
    const approvedOrders = orders.filter((o) => o.payment_status === "approved");
    const revenue = approvedOrders.reduce((a, o) => a + o.total, 0);
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 8);
    const month = today.slice(0, 7);
    const monthOrders = orders.filter((o) => o.created_at.slice(0, 7) === month);
    // chart data last 7 days
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const daily = orders.filter((o) => o.created_at.slice(0, 10) === key);
      return { key, label: d.toLocaleDateString("en-IN", { weekday: "short" }), count: daily.length, rev: daily.filter((o) => o.payment_status === "approved").reduce((a, o) => a + o.total, 0) };
    });
    const maxRev = Math.max(1, ...days.map((d) => d.rev));
    return { orders, users, products, todayOrders, pendingProofs, revenue, lowStock, monthOrders, days, maxRev, approvedOrders };
  }, []);

  const cards = [
    { label: "Today's Sales", value: formatINR(data.todayOrders.reduce((a, o) => a + (o.payment_status === "approved" ? o.total : 0), 0)), icon: "💵", sub: `${data.todayOrders.length} orders` },
    { label: "Total Revenue", value: formatINR(data.revenue), icon: "💰", sub: `${data.approvedOrders?.length ?? 0}` },
    { label: "Total Orders", value: data.orders.length, icon: "🧾", sub: `${data.monthOrders.length} this month` },
    { label: "Customers", value: data.users.filter((u) => u.role === "customer").length, icon: "👥", sub: "registered" }
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-1">Dashboard</h1>
      <p className="text-navy/50 text-sm mb-6">Store overview &amp; analytics</p>

      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-navy/5">
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className="text-lg font-bold text-navy">{c.value}</div>
            <div className="text-xs text-navy/50">{c.label}</div>
            <div className="text-[11px] text-gold-700 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* pending proof alert */}
      {data.pendingProofs.length > 0 && (
        <Link href="/admin/orders" className="block mb-6 bg-gold/10 border border-gold/30 rounded-2xl p-4 text-gold-700 text-sm">
          ⚠️ <b>{data.pendingProofs.length}</b> UPI payment proof(s) awaiting your approval. <span className="underline">Review now →</span>
        </Link>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-navy/5">
          <h3 className="font-serif text-lg text-navy mb-4">Revenue · Last 7 Days</h3>
          <div className="flex items-end gap-2 h-44">
            {data.days.map((d) => (
              <div key={d.key} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="text-[10px] text-navy/50 mb-1">{d.rev > 0 ? "₹" + Math.round(d.rev / 1000) + "k" : ""}</div>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-gold-700 to-gold" style={{ height: `${Math.max(3, (d.rev / data.maxRev) * 100)}%` }} />
                <div className="text-[10px] text-navy/50 mt-1">{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* low stock */}
        <div className="bg-white rounded-2xl p-6 border border-navy/5">
          <h3 className="font-serif text-lg text-navy mb-4">Low Stock Alerts</h3>
          {data.lowStock.length === 0 ? <p className="text-navy/50 text-sm">All good! No low stock items.</p> :
            <div className="space-y-3">
              {data.lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-navy truncate pr-2">{p.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.stock <= 3 ? "bg-red-50 text-red-600" : "bg-gold/10 text-gold-700"}`}>{p.stock} left</span>
                </div>
              ))}
            </div>}
        </div>
      </div>

      {/* recent orders */}
      <div className="bg-white rounded-2xl p-6 border border-navy/5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-navy">Recent Orders</h3>
          <Link href="/admin/orders" className="text-sm text-gold-700 underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-navy/50 text-left border-b border-navy/10"><th className="py-2 font-medium">Order</th><th className="py-2 font-medium">Customer</th><th className="py-2 font-medium">Total</th><th className="py-2 font-medium">Payment</th><th className="py-2 font-medium">Status</th></tr></thead>
            <tbody>
              {data.orders.slice(0, 6).map((o) => {
                const u = data.users.find((x) => x.id === o.user_id);
                return (
                  <tr key={o.id} className="border-b border-navy/5">
                    <td className="py-3">#{o.order_number}</td>
                    <td className="py-3 text-navy/70">{u?.name || "—"}</td>
                    <td className="py-3 font-medium">{formatINR(o.total)}</td>
                    <td className="py-3">{fmtPayment(o.payment_status)}</td>
                    <td className="py-3">{fmtStatus(o.status)}</td>
                  </tr>
                );
              })}
              {data.orders.length === 0 && <tr><td colSpan={5} className="py-6 text-navy/50 text-center">No orders yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
