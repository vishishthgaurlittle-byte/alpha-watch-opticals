"use client";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-navy font-medium">No products match your filters.</p>
        <p className="text-navy/50 text-sm mt-1">Try clearing the search or filters.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </div>
  );
}
