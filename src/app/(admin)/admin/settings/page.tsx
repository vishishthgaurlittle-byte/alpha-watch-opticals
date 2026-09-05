"use client";
import { useState } from "react";
import { getDB, saveDB } from "@/lib/db";
import { toast } from "@/store/ui";

export default function AdminSettings() {
  const [, setGen] = useState(0);
  const db = getDB();
  const s = db.settings;
  const [form, setForm] = useState({
    phone: s.phone || "+91 98765 43210",
    whatsapp: s.whatsapp || "919876543210",
    email: s.email || "alpha.watch.opticals@gmail.com",
    timings: s.timings || "Monday – Sunday, 10:00 AM – 9:00 PM",
    address: s.address || "Near Good Morning Bakery, Indira Nagar, Raebareli, Uttar Pradesh 229001",
    upiId: s.upiId || "alphawatch@upi",
    deliveryThreshold: s.deliveryThreshold || "999",
    deliveryCharge: s.deliveryCharge || "49"
  });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(form).forEach(([k, v]) => { db.settings[k] = v; });
    saveDB();
    setGen((g) => g + 1);
    toast("Settings saved ✓");
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-1">Store Settings</h1>
      <p className="text-navy/50 text-sm mb-6">Shop details, UPI config &amp; delivery charges</p>

      <form onSubmit={save} className="bg-white rounded-2xl p-6 border border-navy/5 grid sm:grid-cols-2 gap-4 max-w-2xl">
        <label className="text-xs text-navy/60">Phone<input value={form.phone} onChange={set("phone")} className="input-premium mt-1" /></label>
        <label className="text-xs text-navy/60">WhatsApp (with country code)<input value={form.whatsapp} onChange={set("whatsapp")} className="input-premium mt-1" /></label>
        <label className="text-xs text-navy/60">Email<input value={form.email} onChange={set("email")} className="input-premium mt-1" /></label>
        <label className="text-xs text-navy/60">Timings<input value={form.timings} onChange={set("timings")} className="input-premium mt-1" /></label>
        <label className="text-xs text-navy/60 sm:col-span-2">Address<textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-premium mt-1 min-h-[60px]" /></label>
        <label className="text-xs text-navy/60">UPI ID<input value={form.upiId} onChange={set("upiId")} className="input-premium mt-1" /></label>
        <label className="text-xs text-navy/60">Free delivery above (₹)<input type="number" value={form.deliveryThreshold} onChange={set("deliveryThreshold")} className="input-premium mt-1" /></label>
        <label className="text-xs text-navy/60">Delivery charge (₹)<input type="number" value={form.deliveryCharge} onChange={set("deliveryCharge")} className="input-premium mt-1" /></label>
        <button className="btn-gold sm:col-span-2 mt-2 py-3 rounded-full font-semibold">Save Settings</button>
        <p className="text-xs text-navy/50 sm:col-span-2">Note: public pages currently read defaults from the site config; these saved values will be wired to the store pages on production/hard refresh.</p>
      </form>
    </div>
  );
}
