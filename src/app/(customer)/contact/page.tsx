import type { Metadata } from "next";
import ContactClient from "@/components/ContactClient";

export const metadata: Metadata = { title: "Contact & Visit Us" };

export default function ContactPage() {
  return (
    <div className="pt-24 md:pt-28 bg-ivory">
      <ContactClient />
    </div>
  );
}
