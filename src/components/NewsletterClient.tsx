"use client";
import { useState } from "react";

export default function NewsletterClient() {
  const [done, setDone] = useState(false);
  return (
    <section className="py-16 bg-navy-950 text-ivory">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl font-bold">Join the Alpha Circle</h2>
        <p className="text-ivory/60 mt-3 mb-6">Get early access to new arrivals, exclusive offers &amp; eye-care tips.</p>
        {done ? (
          <div className="bg-emerald/20 text-emerald rounded-xl p-4 text-sm max-w-md mx-auto">✓ Thanks for subscribing! Welcome to the Alpha Circle.</div>
        ) : (
          <form
            className="flex gap-2 max-w-md mx-auto"
            onSubmit={(e) => { e.preventDefault(); setDone(true); }}
          >
            <input type="email" required placeholder="Enter your email" className="input-premium bg-white/10 border-white/20 text-ivory placeholder:text-ivory/40 flex-1" />
            <button className="btn-gold px-6 py-3 rounded-full font-semibold whitespace-nowrap">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}
