export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
  light = false
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`mb-10 ${center ? "text-center max-w-2xl mx-auto" : ""}`}>
      {eyebrow && (
        <div className={`uppercase tracking-[0.3em] text-xs font-semibold mb-3 ${light ? "text-gold" : "text-gold-700"}`}>
          {eyebrow}
        </div>
      )}
      <h2 className={`font-serif text-3xl md:text-4xl font-bold ${light ? "text-ivory" : "text-navy"}`}>{title}</h2>
      {subtitle && <p className={`mt-3 text-sm md:text-base ${light ? "text-ivory/60" : "text-navy/60"}`}>{subtitle}</p>}
    </div>
  );
}
