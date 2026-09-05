"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatINR, discountPct } from "@/lib/site";
import TiltCard from "@/components/ui/TiltCard";
import RatingStars from "@/components/ui/RatingStars";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const off = discountPct(product.price, product.mrp);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
    >
      <TiltCard>
        <div className="card-shine bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-card transition-shadow">
          <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-navy/5 group">
            {product.images[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-navy/20">No image</div>
            )}
            {/* badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.badges.includes("Best Seller") && <span className="bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Best Seller</span>}
              {product.badges.includes("New") && <span className="bg-emerald text-white text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>}
              {off > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{off}% OFF</span>}
            </div>
          </Link>
          <div className="p-3">
            <div className="text-[10px] uppercase tracking-wider text-navy/40 mb-1">{product.brand}</div>
            <Link href={`/product/${product.slug}`} className="font-medium text-sm text-navy leading-snug line-clamp-2 hover:text-gold-700">
              {product.name}
            </Link>
            <div className="flex items-center gap-1.5 mt-1.5">
              <RatingStars value={product.rating} size={12} />
              <span className="text-[11px] text-navy/40">({product.reviews_count})</span>
            </div>
            <div className="flex items-center justify-between mt-2 gap-1">
              <div>
                <span className="font-bold text-navy">{formatINR(product.price)}</span>
                {product.mrp > product.price && <span className="text-xs text-navy/40 line-through ml-1">{formatINR(product.mrp)}</span>}
              </div>
              <AddToCartButton productId={product.id} shape="icon" className="text-navy bg-navy/5 hover:bg-gold hover:text-white" />
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
