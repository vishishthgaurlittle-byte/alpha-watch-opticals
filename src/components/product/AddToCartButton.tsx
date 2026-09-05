"use client";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { toast } from "@/store/ui";
import type { CartItem } from "@/lib/types";

export default function AddToCartButton({
  productId,
  variant,
  className = "btn-gold",
  label = "Add to Cart",
  shape
}: {
  productId: string;
  variant?: CartItem["variant"];
  className?: string;
  label?: string;
  shape?: "pill" | "icon";
}) {
  const user = useAuth((s) => s.user);
  const add = useCart((s) => s.add);
  const uid = user ? user.id : "guest";

  const handle = () => {
    add(uid, productId, variant, 1);
    toast("Added to cart ✓");
  };

  if (shape === "icon") {
    return (
      <button onClick={handle} aria-label={label} className={`w-10 h-10 rounded-full flex items-center justify-center ${className} hover:scale-105 transition`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M3 3h2l2 12h11l2-8H6M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      </button>
    );
  }

  return (
    <button onClick={handle} className={`${className} px-4 py-2 rounded-full text-sm font-semibold`}>
      {label}
    </button>
  );
}
