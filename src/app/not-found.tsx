"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="pt-28 min-h-[80vh] bg-navy-950 text-ivory flex flex-col items-center justify-center text-center px-4">
      <motion.div
        animate={{ rotate: [0, -8, 8, -5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
        className="text-7xl mb-4"
      >
        ⌚
      </motion.div>
      <div className="uppercase tracking-[0.3em] text-xs text-gold mb-2">Page not found</div>
      <h1 className="font-serif text-5xl font-bold">404</h1>
      <p className="text-ivory/60 mt-4 max-w-md">
        Looks like this timepiece is missing from the display. The page you're looking for doesn't exist.
      </p>
      <div className="flex gap-3 mt-8">
        <Link href="/" className="btn-gold px-6 py-3 rounded-full font-semibold">Back to Home</Link>
        <Link href="/shop" className="px-6 py-3 rounded-full font-semibold border border-gold/50 text-gold hover:bg-gold/10 transition">Shop</Link>
      </div>
    </div>
  );
}
