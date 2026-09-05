"use client";
import { useState } from "react";
import { getDB, saveDB } from "@/lib/db";
import type { Coupon } from "@/lib/types";
import { toast } from "@/store/ui";

export default function AdminCoupons() {
  const [, setGen] = useState(0);
  const db = getDB();
  const coupons = db.coupons;
  const [form, setForm] = useState({ code: "", type: "percent" as "percent" | "fixed", value: 10, min_cart: 0, max_discount: 0, expires_at: "2026-12-31", usage_limit: 100 });

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) { toast("Enter a coupon code"); return; }
    coupons.push({
      id: "cp-" + Date.now().toString(36),
      code: form.code.toUpperCase().trim(),
      type: form.type,
      value: form.value,
      min_cart: form.min_cart,
      max_discount: form.max_discount || undefined,
      expires_at: form.expires_at,
      usage_limit: form.usage_limit,
      used: 0
    });
    saveDB();
    setGen((g) => g + 1);
    toast("Coupon created ✓");
    setForm({ code: "", type: "percent", value: 10, min_cart: 0, max_discount: 0, expires_at: "2026-12-31", usage_limit: 100 });
  };

  const del = (id: string) => {
    getDB().coupons = coupons.filter((c) => c.id !== id);
    saveDB();
    setGen((g) => g + 1);
    toast("Coupon deleted");
  };

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-1">Coupons</h1>
      <p className="text-navy/50 text-sm mb-6">Create and manage discount coupons</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-navy/5">
          <h3 className="font-serif text-lg text-navy mb-4">Existing Coupons</h3>
          {coupons.length === 0 ? <p className="text-navy/50 text-sm">No coupons yet.</p> :
            <div className="space-y-3">
              {coupons.map((c) => (
                <div key={c.id} className="flex items-center justify-between border border-navy/10 rounded-xl p-4">
                  <div>
                    <div className="font-bold text-navy text-sm">{c.code} <span className="text-navy/40 font-normal">· {c.type === "percent" ? c.value + "% off" : "₹" + c.value + " off"}</span></div>
                    <div className="text-xs text-navy/50 mt-0.5">Min {c.min_cart} · used {c.used}/{c.usage_limit} · expires {c.expires_at}</div>
                  </div>
                  <button onClick={() => del(c.id)} className="text-red-500 text-sm">Delete</button>
                </div>
              ))}
            </div>}
        </div>

        <form onSubmit={add} className="bg-white rounded-2xl p-6 border border-navy/5 h-fit">
          <h3 className="font-serif text-lg text-navy mb-4">Create Coupon</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="text-xs text-navy/60">Code<input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME10" className="input-premium mt-1 uppercase" /></label>
            <label className="text-xs text-navy/60">Type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="input-premium mt-1"><option value="percent">Percent %</option><option value="fixed">Fixed ₹</option></select></label>
            <label className="text-xs text-navy/60">Value<input type="number" required value={form.value} onChange={(e) => setForm({ ...form, value: +e.target.value })} className="input-premium mt-1" /></label>
            <label className="text-xs text-navy/60">Min cart<input type="number" value={form.min_cart} onChange={(e) => setForm({ ...form, min_cart: +e.target.value })} className="input-premium mt-1" /></label>
            <label className="text-xs text-navy/60">Max discount (optional)<input type="number" value={form.max_discount} onChange={(e) => setForm({ ...form, max_discount: +e.target.value })} className="input-premium mt-1" /></label>
            <label className="text-xs text-navy/60">Expiry<input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className="input-premium mt-1" /></label>
            <label className="text-xs text-navy/60">Usage limit<input type="number" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: +e.target.value })} className="input-premium mt-1" /></label>
          </div>
          <button className="btn-gold w-full mt-5 py-3 rounded-full font-semibold">Create Coupon</button>
        </form>
      </div>
    </div>
  );
}
