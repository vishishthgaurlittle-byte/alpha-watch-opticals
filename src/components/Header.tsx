"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useUI } from "@/store/ui";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" }
];

export default function Header() {
  const pathname = usePathname();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const count = useCart((s) => s.count());
  const setCartOpen = useUI((s) => s.setCartOpen);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [wishCount, setWishCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setAccountOpen(false);
  }, [pathname]);

  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "glass-light shadow-card py-2" : "bg-transparent py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                pathname === l.href ? "text-gold-700" : "text-navy hover:text-gold-700"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-full text-navy hover:bg-navy/5 transition"
            aria-label="Cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M3 3h2l2 12h11l2-8H6" />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="17" cy="20" r="1.5" fill="currentColor" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-white text-[11px] flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </button>

          {user ? (
            user.role === "admin" ? (
              <Link href="/admin" className="btn-gold text-sm px-4 py-2 rounded-full font-medium">
                Admin
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center bg-navy text-ivory text-sm font-semibold`}
                >
                  {user.name?.[0]?.toUpperCase() || "U"}
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-52 card-shine bg-white rounded-xl shadow-card border border-navy/10 overflow-hidden">
                    <div className="px-4 py-3 border-b border-navy/10">
                      <div className="font-semibold text-sm text-navy">{user.name}</div>
                      <div className="text-xs text-navy/50">{user.email}</div>
                    </div>
                    <Link href="/account" className="block px-4 py-2.5 text-sm hover:bg-navy/5">My Account</Link>
                    <Link href="/account/orders" className="block px-4 py-2.5 text-sm hover:bg-navy/5">My Orders</Link>
                    <Link href="/account/wishlist" className="block px-4 py-2.5 text-sm hover:bg-navy/5">Wishlist</Link>
                    <button
                      onClick={() => logout()}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )
          ) : (
            <Link href="/login" className="text-sm font-medium text-navy hover:text-gold-700 px-2">
              Login
            </Link>
          )}

          {/* mobile menu */}
          <MobileMenuToggle />
        </div>
      </div>
    </header>
  );
}

function MobileMenuToggle() {
  const open = useUI((s) => s.menuOpen);
  const setOpen = useUI((s) => s.setMenuOpen);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="md:hidden p-2.5 rounded-full text-navy hover:bg-navy/5"
      aria-label="Menu"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {open ? (
          <path strokeLinecap="round" strokeWidth="1.8" d="M6 6l12 12M18 6L6 18" />
        ) : (
          <path strokeLinecap="round" strokeWidth="1.8" d="M4 7h16M4 12h16M4 17h16" />
        )}
      </svg>
    </button>
  );
}
