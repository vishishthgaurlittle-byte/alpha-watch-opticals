import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://alpha-watch-opticals.vercel.app"),
  title: {
    default: "Alpha Watch & Opticals – Premium Watch House & Opticals in Raebareli",
    template: "%s | Alpha Watch & Opticals"
  },
  description:
    "Timeless watches, premium optical glasses, sunglasses & contact lenses in Indira Nagar, Raebareli. Eye tests, watch repair & genuine brands. Visit our store or order online.",
  keywords: [
    "watch shop Raebareli",
    "optical Raebareli",
    "sunglasses Raebareli",
    "eye test Raebareli",
    "watch repair",
    "contact lenses",
    "Alpha Watch and Opticals"
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-180.png"
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE.name,
    title: "Alpha Watch & Opticals",
    description: SITE.tagline,
    images: ["/images/shop/shop-front.jpg"]
  }
};

export const viewport: Viewport = {
  themeColor: "#0B1D33",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
