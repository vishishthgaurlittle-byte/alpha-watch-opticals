import Link from "next/link";

export default function Logo({ light = false, small = false }: { light?: boolean; small?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <img
        src="/icons/logo.svg"
        alt="Alpha Watch & Opticals"
        className={`${small ? "w-8 h-8" : "w-10 h-10"} transition-transform group-hover:rotate-6`}
      />
      <div className="leading-none">
        <div className={`font-serif font-bold tracking-wide ${small ? "text-lg" : "text-xl"} ${light ? "text-ivory" : "text-navy"}`}>
          ALPHA
        </div>
        <div className={`uppercase tracking-[0.2em] text-[9px] mt-0.5 ${light ? "text-gold" : "text-navy/60"}`}>
          Watch &amp; Opticals
        </div>
      </div>
    </Link>
  );
}
