"use client";
import { useState } from "react";
import { getAllUsers, getOrdersByUser, setUserBlocked, setUserRole } from "@/lib/db";
import { formatINR, dateFmt } from "@/lib/site";
import { useAuth } from "@/store/auth";

export default function AdminCustomers() {
  const [, setGen] = useState(0);
  const me = useAuth((s) => s.user);
  const adminSetBlocked = useAuth((s) => s.adminSetBlocked);
  const adminSetRole = useAuth((s) => s.adminSetRole);
  const [selected, setSelected] = useState<string | null>(null);
  const users = getAllUsers().filter((u) => u.role === "customer");
  const sel = users.find((u) => u.id === selected);
  const selOrders = sel ? getOrdersByUser(sel.id) : [];

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-1">Customers</h1>
      <p className="text-navy/50 text-sm mb-6">{users.length} customers</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-navy/5">
          <div className="space-y-2">
            {users.length === 0 && <p className="text-navy/50 text-sm text-center py-8">No customers yet.</p>}
            {users.map((u) => (
              <button key={u.id} onClick={() => setSelected(u.id)} className={`w-full text-left border rounded-xl p-3 transition ${selected === u.id ? "border-gold bg-gold/5" : "border-navy/10 hover:border-gold/50"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-navy text-ivory flex items-center justify-center font-bold">{u.name[0]?.toUpperCase()}</div>
                  <div className="flex-1">
                    <div className="font-medium text-navy text-sm">{u.name}</div>
                    <div className="text-xs text-navy/50">{u.email || u.phone}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${u.blocked ? "bg-red-50 text-red-600" : "bg-emerald/10 text-emerald"}`}>{u.blocked ? "Blocked" : "Active"}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-navy/5 h-fit">
          {!sel ? <p className="text-navy/50 text-sm text-center py-16">Select a customer</p> : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-navy text-ivory flex items-center justify-center text-xl font-bold">{sel.name[0]?.toUpperCase()}</div>
                <div>
                  <div className="font-medium text-navy">{sel.name}</div>
                  <div className="text-xs text-navy/50">{sel.email || "—"} · {sel.phone || "—"}</div>
                </div>
              </div>
              <div className="text-xs text-navy/60 mb-2">Joined {dateFmt(sel.created_at)} · via {sel.provider}</div>
              <div className="bg-navy/5 rounded-xl p-3 mb-4 text-sm text-navy">
                Total orders: <b>{selOrders.length}</b><br />Total spent: <b>{formatINR(selOrders.filter((o) => o.payment_status === "approved").reduce((a, o) => a + o.total, 0))}</b>
              </div>
              <div className="space-y-2">
                <button onClick={() => { adminSetBlocked(sel.id, !sel.blocked); setGen((g) => g + 1); }} className={`w-full py-2.5 rounded-full text-sm font-semibold border ${sel.blocked ? "border-emerald text-emerald hover:bg-emerald/5" : "border-red-300 text-red-600 hover:bg-red-50"}`}>
                  {sel.blocked ? "Unblock Customer" : "Block Customer"}
                </button>
                {me?.id !== sel.id && (
                  <button onClick={() => { adminSetRole(sel.id, "admin"); setGen((g) => g + 1); }} className="w-full py-2.5 rounded-full text-sm font-semibold border border-gold text-gold-700 hover:bg-gold/5">
                    Promote to Admin
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
