"use client";
import { useState } from "react";
import { SITE } from "@/lib/site";
import { toast } from "@/store/ui";

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [booked, setBooked] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Message sent ✓ We'll get back to you soon.");
    setForm({ name: "", phone: "", email: "", message: "" });
  };

  const book = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Appointment booked ✓ We'll confirm on phone.");
    setBooked(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
      <div>
        <div className="uppercase tracking-[0.3em] text-xs font-semibold text-gold-700 mb-3">Contact</div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">Get in Touch</h1>
        <p className="text-navy/70 mb-6">Visit our store, call us, or drop a message — we're here to help.</p>

        <div className="space-y-4 mb-8">
          <ContactLine icon="📍" label="Address" value={SITE.address} />
          <ContactLine icon="📞" label="Phone" value={SITE.phone} href={`tel:${SITE.phoneHref}`} />
          <ContactLine icon="💬" label="WhatsApp" value={`+${SITE.whatsapp}`} href={`https://wa.me/${SITE.whatsapp}`} />
          <ContactLine icon="✉️" label="Email" value={SITE.email} href={`mailto:${SITE.email}`} />
          <ContactLine icon="🕙" label="Timings" value={SITE.timings} />
        </div>

        <a href={SITE.justdial} target="_blank" rel="noreferrer" className="inline-block text-sm text-gold-700 font-medium underline mb-6">View us on Justdial →</a>

        <div className="rounded-2xl overflow-hidden border border-navy/10 shadow-card">
          <iframe src={SITE.mapEmbed} title="Map" className="w-full h-64 border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>

      <div className="space-y-6">
        <form onSubmit={submit} className="bg-white rounded-2xl p-6 border border-navy/5">
          <h3 className="font-serif text-lg text-navy mb-4">Send a Message</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <input required value={form.name} onChange={(e) => setForm((f)=>({...f, name: e.target.value}))} placeholder="Name" className="input-premium" />
            <input required value={form.phone} onChange={(e) => setForm((f)=>({...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10)}))} placeholder="Phone" className="input-premium" />
            <input value={form.email} onChange={(e) => setForm((f)=>({...f, email: e.target.value}))} placeholder="Email" className="input-premium sm:col-span-2" />
            <textarea required value={form.message} onChange={(e) => setForm((f)=>({...f, message: e.target.value}))} placeholder="Your message" className="input-premium sm:col-span-2 min-h-[90px]" />
          </div>
          <button className="btn-gold w-full mt-4 py-3 rounded-full font-semibold">Send Message</button>
        </form>

        <form onSubmit={book} className="bg-navy-950 text-ivory rounded-2xl p-6">
          <h3 className="font-serif text-lg mb-4">Book an Eye Test Appointment</h3>
          {booked ? (
            <div className="bg-emerald/20 text-emerald rounded-xl p-4 text-sm">✓ Appointment requested! We'll confirm on your phone.</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              <input required placeholder="Name" className="input-premium bg-white/10 border-white/20 text-ivory placeholder:text-ivory/40 sm:col-span-2" />
              <input required placeholder="Phone" className="input-premium bg-white/10 border-white/20 text-ivory placeholder:text-ivory/40" />
              <input required placeholder="Preferred date" className="input-premium bg-white/10 border-white/20 text-ivory placeholder:text-ivory/40" />
              <select className="input-premium bg-white/10 border-white/20 text-ivory sm:col-span-2">
                <option>Eye Test</option><option>Contact Lens Fitting</option><option>Watch Repair</option>
              </select>
              <button className="btn-gold w-full sm:col-span-2 mt-2 py-3 rounded-full font-semibold">Book Appointment</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function ContactLine({ icon, label, value, href }: { icon: string; label: string; value: string; href?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-lg shrink-0">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-wider text-navy/40">{label}</div>
        {href ? <a href={href} className="text-navy font-medium hover:text-gold-700">{value}</a> : <div className="text-navy font-medium">{value}</div>}
      </div>
    </div>
  );
}
