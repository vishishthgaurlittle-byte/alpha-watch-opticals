import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, relatedProducts } from "@/lib/db";
import { SITE } from "@/lib/site";
import ProductDetail from "@/components/product/ProductDetail";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProductBySlug(params.slug);
  if (!p) return { title: "Product Not Found" };
  return {
    title: p.seo_title || p.name,
    description: p.seo_description || p.description.slice(0, 160),
    openGraph: {
      title: p.seo_title || p.name,
      description: p.seo_description || p.description.slice(0, 160),
      images: p.images[0] ? [p.images[0]] : []
    }
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();
  const related = relatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images[0],
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating: product.reviews_count
      ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviews_count }
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} related={related} />
    </>
  );
}
