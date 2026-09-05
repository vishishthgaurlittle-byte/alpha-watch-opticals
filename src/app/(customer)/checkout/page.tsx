"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";
import { toast } from "@/store/ui";
import { getProductById, getCoupon, getAddresses, saveAddress, createOrder, addPaymentProof, getSetting } from "@/lib/db";
import { SITE, formatINR } from "@/lib/site";

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);
  const { items, clear, subtotal } = useCart();
  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  const [addr, setAddr] = useState({ type: "home", address: "", city: "Raebareli", state: "Uttar Pradesh", pincode: "", landmark: "", phone: "", default: false });
  const [coupon, setCoupon] = useState("");
  const [couponInfo, setCouponInfo] = useState<{ code: string; discount: number; id: string } | null>(null);
  const [proof, setProof] = useState<string | null>(null);
  const [savedAddrs, setSavedAddrs] = useState<ReturnType<typeof getAddresses>>([]);
  const [placing, setPlacing] = useState(false);

  const uid = user ? user.id : "guest";

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/login?next=/checkout");
    } else {
      setSavedAddrs(getAddresses(user.id));
    }
  }, [user, hydrated, router]);

  // compute totals
  const itemsList = useMemo(
    () =>
      items.map((i) => {
        const p = getProductById(i.product_id);
        return { ...i, p };
      }),
    [items]
  );

  const baseSubtotal = itemsList.reduce((a, x) => a + (x.p ? x.p.price : 0) * x.quantity, 0);
  const shipping = method === "delivery" ? (baseSubtotal >= 999 ? 0 : 49) : 0;
  const discount = couponInfo?.discount || 0;
  const total = Math.max(0, baseSubtotal - discount) + shipping;

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const c = getCoupon(coupon);
    if (!c) { toast("Invalid coupon code"); return; }
    if (c.used >= c.usage_limit) { toast("Coupon usage limit reached"); return; }
    const now = new Date().toISOString().slice(0, 10);
    if (c.expires_at < now) { toast("Coupon expired"); return; }
    if (baseSubtotal < c.min_cart) { toast(`Min. order ₹${c.min_cart} for this coupon`); return; }
    const d = c.type === "percent" ? Math.round((baseSubtotal * c.value) / 100) : c.value;
    const dd = c.max_discount ? Math.min(d, c.max_discount) : d;
    setCouponInfo({ code: c.code, discount: dd, id: c.id });
    toast(`Coupon ${c.code} applied (−${formatINR(dd)})`);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setProof(reader.result as string);
    reader.readAsDataURL(f);
  };

  const placeOrder = () => {
    if (placing) return;
    if (!user) { toast("Please login to place an order"); router.push("/login?next=/checkout"); return; }
    if (items.length === 0) { toast("Your cart is empty"); return; }
    if (method === "delivery") {
      if (!addr.address.trim() || addr.pincode.length !== 6 || !addr.phone.trim()) { toast("Please complete the delivery address & pin code"); return; }
    }
    setPlacing(true);

    let savedAddr;
    if (method === "delivery") {
      savedAddr = {
        id: "a-" + Date.now().toString(36),
        user_id: user.id,
        ...addr,
        default: false
      };
      saveAddress(savedAddr);
    }

    const order = createOrder(user, items, {
      delivery_method: method,
      address: savedAddr,
      subtotal: baseSubtotal,
      discount,
      shipping,
      coupon_id: couponInfo?.id
    });

    if (proof) {
      addPaymentProof(order.id, user.id, proof);
    }

    clear(uid);
    router.push(`/order-confirmation/${order.id}`);
  };

  if (!user) {
    return (
      <div className="pt-32 pb-20 bg-ivory min-h-screen text-center px-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-navy/5 flex items-center justify-center text-3xl mb-4">🔒</div>
        <h1 className="font-serif text-2xl font-bold text-navy mb-2">Login Required</h1>
        <p className="text-navy/60 mb-6 max-w-md mx-auto">Please login or register to continue to checkout. Your cart will be saved.</p>
        <Link href="/login?next=/checkout" className="btn-gold px-8 py-3 rounded-full font-semibold">Login / Register</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 bg-ivory min-h-screen">
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* delivery method */}
            <div className="bg-white rounded-2xl p-6 border border-navy/5">
              <h3 className="font-serif text-lg text-navy mb-4">Delivery Method</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setMethod("pickup")} className={`rounded-xl p-4 text-left border-2 transition ${method === "pickup" ? "border-gold bg-gold/5" : "border-navy/10"}`}>
                  <div className="text-2xl mb-1">🏬</div>
                  <div className="font-semibold text-navy text-sm">Pickup from Shop</div>
                  <div className="text-xs text-navy/50 mt-1">Pay at shop · Indira Nagar, Raebareli</div>
                </button>
                <button onClick={() => setMethod("delivery")} className={`rounded-xl p-4 text-left border-2 transition ${method === "delivery" ? "border-gold bg-gold/5" : "border-navy/10"}`}>
                  <div className="text-2xl mb-1">🚚</div>
                  <div className="font-semibold text-navy text-sm">Home Delivery</div>
                  <div className="text-xs text-navy/50 mt-1">UPI payment before dispatch</div>
                </button>
              </div>
            </div>

            {/* address */}
            {method === "delivery" && (
              <div className="bg-white rounded-2xl p-6 border border-navy/5">
                <h3 className="font-serif text-lg text-navy mb-4">Shipping Address</h3>
                {savedAddrs.filter((a) => a.default).length > 0 && !addr.address && (
                  <div className="mb-4">
                    <div className="text-xs text-navy/50 mb-2">Quick pick</div>
                    <div className="flex gap-2 flex-wrap">
                      {savedAddrs.map((a) => (
                        <button key={a.id} onClick={() => setAddr({ ...a, type: a.type })} className="border border-navy/15 rounded-full px-3 py-1.5 text-xs text-navy hover:border-gold">
                          {a.address.slice(0, 30)}…
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <input value={addr.address} onChange={(e) => setAddr((f)=>({...f, address: e.target.value}))} placeholder="House / Street / Area" className="input-premium sm:col-span-2" />
                  <input value={addr.pincode} onChange={(e) => setAddr((f)=>({...f, pincode: e.target.value.replace(/\D/g, "").slice(0, 6)}))} placeholder="Pincode" className="input-premium" />
                  <input value={addr.phone} onChange={(e) => setAddr((f)=>({...f, phone: e.target.value.slice(0, 10)}))} placeholder="Contact phone" className="input-premium" />
                  <input value={addr.landmark} onChange={(e) => setAddr((f)=>({...f, landmark: e.target.value}))} placeholder="Landmark (optional)" className="input-premium sm:col-span-2" />
                </div>
              </div>
            )}

            {/* UPI payment */}
            <div className="bg-white rounded-2xl p-6 border border-navy/5">
              <h3 className="font-serif text-lg text-navy mb-2">Payment (UPI)</h3>
              {method === "pickup" ? (
                <div className="text-sm text-navy/60">
                  <p className="mb-2">You can <b>pay at the shop</b> when you collect your order — no online payment needed. Prefer to pay now? Pay via UPI to the ID below.</p>
                </div>
              ) : (
                <p className="text-sm text-navy/60 mb-3">Full payment via UPI is required <b>before dispatch</b>. Pay to the shop UPI ID below and upload the screenshot as proof.</p>
              )}
              <div className="flex items-center gap-4 bg-navy-950 rounded-2xl p-4 text-ivory">
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">QR</div>
                <div>
                  <div className="text-xs text-ivory/50 uppercase tracking-wider mb-1">Pay to UPI ID</div>
                  <div className="text-lg font-bold text-gold">{SITE.upiId}</div>
                  <div className="text-xs text-ivory/60 mt-1">{SITE.name}</div>
                </div>
              </div>
              <div className="mt-5">
                <label className="text-xs uppercase tracking-wider text-navy/50 mb-2 block">Upload UPI payment screenshot (proof)</label>
                <div className="border-2 border-dashed border-navy/15 rounded-xl p-6 text-center">
                  {proof ? (
                    <div>
                      <img src={proof} alt="payment proof" className="max-h-40 mx-auto rounded-lg mb-3" />
                      <button onClick={() => setProof(null)} className="text-red-500 text-sm">Remove</button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input type="file" accept="image/*" className="hidden" onChange={onFile} />
                      <div className="text-3xl mb-2">📤</div>
                      <div className="text-sm text-navy font-medium">Tap to upload screenshot</div>
                      <div className="text-xs text-navy/50 mt-1">PNG or JPG · after paying via the UPI ID above</div>
                    </label>
                  )}
                </div>
              </div>
              <p className="text-xs text-navy/40 mt-3">* Payment proof is verified by the store before order dispatch.</p>
            </div>
          </div>

          {/* summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-navy/5 sticky top-24">
              <h3 className="font-serif text-lg text-navy mb-4">Your Order</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {itemsList.map((x, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-navy/5 shrink-0">
                      {x.p?.images[0] ? <img src={x.p.images[0]} alt="" className="w-full h-full object-cover" /> : null}
                    </div>
                    <div className="flex-1 text-sm text-navy truncate">{x.p?.name} <span className="text-navy/40">×{x.quantity}</span></div>
                    <div className="text-sm font-medium text-navy">{x.p ? formatINR(x.p.price * x.quantity) : ""}</div>
                  </div>
                ))}
              </div>

              {/* coupon */}
              <form onSubmit={applyCoupon} className="mt-5 flex gap-2">
                <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className="input-premium flex-1 text-sm" />
                <button className="btn-gold px-4 rounded-full text-sm font-medium">Apply</button>
              </form>

              <div className="border-t border-navy/10 my-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-navy/60">Subtotal</span><span>{formatINR(baseSubtotal)}</span></div>
                {couponInfo && <div className="flex justify-between text-emerald"><span>Coupon ({couponInfo.code})</span><span>−{formatINR(couponInfo.discount)}</span></div>}
                <div className="flex justify-between"><span className="text-navy/60">Delivery</span><span>{shipping === 0 ? (method === "pickup" ? "Pickup" : "Free") : formatINR(shipping)}</span></div>
              </div>
              <div className="flex justify-between text-xl mb-5"><span className="text-navy">Total</span><span className="text-navy font-bold">{formatINR(total)}</span></div>

              <button onClick={placeOrder} disabled={placing} className="btn-gold w-full py-4 rounded-full font-bold text-base disabled:opacity-60">
                {placing ? "Placing order…" : method === "pickup" ? "Place Order (Pay at Shop)" : "Place Order & Submit Proof"}
              </button>
              {!user && <p className="text-xs text-navy/50 text-center mt-2">Please login to place your order.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
