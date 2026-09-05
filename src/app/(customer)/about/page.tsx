import Link from "next/link";
import { SITE } from "@/lib/site";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="pt-24 md:pt-28 bg-ivory">
      {/* hero */}
      <section className="relative overflow-hidden bg-navy-950 text-ivory">
        <img src="/images/shop/storefront-sign.jpg" alt="store" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 to-navy-950" />
        <div className="relative max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="uppercase tracking-[0.3em] text-xs text-gold mb-3">Our Story</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold">About {SITE.name}</h1>
          <p className="text-ivory/70 mt-4 max-w-2xl mx-auto">
            Serving Chowdhary Complex, Degree College Chauraha, Raebareli with premium branded watches and precision optical care since {SITE.founded}.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden shadow-card">
          <img src="/images/shop/showroom-main.jpg" alt="Alpha Watch and Opticals showroom" className="w-full aspect-[4/3] object-cover" />
        </div>
        <div>
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">A Legacy of Time &amp; Vision</h2>
          <p className="text-navy/70 leading-relaxed mb-4">
            Founded and led by <strong>{SITE.owner}</strong>, {SITE.name} has grown to become Raebareli's
            trusted destination for luxury timepieces and computerized optical solutions.
            Located at Chowdhary Complex, Degree College Chauraha, we are authorized retailers for Titan, Casio, Timex, Fastrack, Sonata, Maxima, Titan Eyewear, SKINN Perfumes, and Fire-Boltt smartwatches.
          </p>
          <p className="text-navy/70 leading-relaxed mb-6">
            We combine genuine brands with heartfelt service — certified computerized eye testing, expert mechanical and quartz watch repair, custom lens cutting, and free strap adjustments.
          </p>
          <div className="flex gap-6 text-navy">
            <div><div className="font-serif text-3xl text-gold-700">{new Date().getFullYear() - SITE.founded}+</div><div className="text-xs text-navy/50">Years of Trust</div></div>
            <div><div className="font-serif text-3xl text-gold-700">10,000+</div><div className="text-xs text-navy/50">Happy Customers</div></div>
            <div><div className="font-serif text-3xl text-gold-700">100%</div><div className="text-xs text-navy/50">Authorized &amp; Genuine</div></div>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeading eyebrow="What We Stand For" title="Our Values" />
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { i: "💎", t: "Genuine & Authentic", d: "Every watch, frame and lens is sourced through authorised channels. No copies, period." },
              { i: "👁", t: "Care You Can See", d: "Certified eye testing and honest recommendations that put your vision first." },
              { i: "🤝", t: "Service That Lasts", d: "Free fittings, adjustments and after-sales support for as long as you own your piece." }
            ].map((v) => (
              <div key={v.t} className="rounded-2xl border border-navy/5 p-6 bg-ivory">
                <div className="text-3xl mb-3">{v.i}</div>
                <h3 className="font-serif text-lg text-navy mb-2">{v.t}</h3>
                <p className="text-sm text-navy/60">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-4 text-center">
        <div className="rounded-3xl bg-navy-950 text-ivory p-10">
          <h2 className="font-serif text-3xl font-bold mb-3">Come Visit Us</h2>
          <p className="text-ivory/60 mb-6">{SITE.address}</p>
          <Link href="/contact" className="btn-gold px-8 py-3.5 rounded-full font-semibold inline-block">Get Directions</Link>
        </div>
      </section>
    </div>
  );
}
