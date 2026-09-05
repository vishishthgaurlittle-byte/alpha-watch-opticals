"use client";
import { useState } from "react";
import { getDB, saveDB, getProductById } from "@/lib/db";
import type { Review } from "@/lib/types";
import { dateFmt } from "@/lib/site";

export default function AdminReviews() {
  const [, setGen] = useState(0);
  const db = getDB();
  const reviews = db.reviews;

  const setStatus = (id: string, status: Review["status"]) => {
    const r = db.reviews.find((x) => x.id === id);
    if (r) {
      r.status = status;
      saveDB();
      setGen((g) => g + 1);
    }
  };

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-1">Reviews</h1>
      <p className="text-navy/50 text-sm mb-6">Moderate customer reviews &amp; ratings</p>

      <div className="bg-white rounded-2xl p-5 border border-navy/5">
        {reviews.length === 0 ? <p className="text-navy/50 text-sm text-center py-10">No reviews yet.</p> :
          <div className="space-y-4">
            {reviews.map((r) => {
              const p = getProductById(r.product_id);
              return (
                <div key={r.id} className="border border-navy/10 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-navy text-sm">{r.user_name} on {p?.name || "product"}</div>
                      <div className="text-gold text-sm mt-0.5">{Array.from({ length: r.rating }).map((_, i) => <span key={i}>★</span>)}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === "approved" ? "bg-emerald/10 text-emerald" : r.status === "rejected" ? "bg-red-50 text-red-600" : "bg-gold/10 text-gold-700"}`}>{r.status}</span>
                  </div>
                  {r.title && <div className="font-medium text-navy text-sm mt-2">{r.title}</div>}
                  <p className="text-sm text-navy/70 mt-1">{r.comment}</p>
                  <div className="text-xs text-navy/40 mt-2">{dateFmt(r.created_at)}</div>
                  <div className="flex gap-2 mt-3">
                    {r.status !== "approved" && <button onClick={() => setStatus(r.id, "approved")} className="text-emerald text-xs font-medium hover:underline">Approve</button>}
                    {r.status !== "rejected" && <button onClick={() => setStatus(r.id, "rejected")} className="text-red-500 text-xs font-medium hover:underline">Reject</button>}
                  </div>
                </div>
              );
            })}
          </div>}
      </div>
    </div>
  );
}
