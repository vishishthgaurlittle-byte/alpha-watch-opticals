import { getDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://alpha-watch-opticals.vercel.app";
  const db = getDB();
  const published = db.products.filter((p) => p.status === "published");

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    ...published.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: new Date(p.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
