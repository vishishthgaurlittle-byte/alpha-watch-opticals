"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import CartDrawer from "@/components/cart/CartDrawer";
import Toast from "@/components/ui/Toast";
import PwaRegister from "@/components/PwaRegister";
import { mergeGuestCart } from "@/store/cart";

export default function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useAuth((s) => s.hydrate);
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);
  const load = useCart((s) => s.load);
  const loading = useUI((s) => s.loading);
  const pathname = usePathname();
  const [showLoad, setShowLoad] = useState(false);

  // hydrate auth + cart
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    mergeGuestCart(user ? user.id : "guest");
    load(user ? user.id : "guest");
  }, [user, hydrated, load]);

  // show the premium loading screen only once per browser session (first visit)
  const isAdmin = pathname?.startsWith("/admin");
  useEffect(() => {
    if (isAdmin) return;
    let seen = false;
    try { seen = sessionStorage.getItem("aw_loading_seen") === "1"; } catch {}
    if (!seen) {
      setShowLoad(true);
      try { sessionStorage.setItem("aw_loading_seen", "1"); } catch {}
      const t = setTimeout(() => setShowLoad(false), 1200);
      return () => clearTimeout(t);
    }
  }, [isAdmin]);

  // reset scroll state
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <>
      <PwaRegister />
      {showLoad && !isAdmin && <LoadingScreen />}
      <Header />
      <main className="min-h-screen flex flex-col">{children}</main>
      <Footer />
      <MobileNav />
      <CartDrawer />
      <Toast />
    </>
  );
}
