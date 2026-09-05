import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

const docs: Record<string, { title: string; content: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    content: [
      "At Alpha Watch & Opticals, we respect your privacy and are committed to protecting your personal information. This policy explains what we collect and how we use it.",
      "Information we collect: when you create an account or place an order, we collect your name, email address, phone number, delivery address and order history. If you sign in with Google, we store your Google profile name, email and picture.",
      "How we use your information: to process and deliver your orders, manage your account, provide customer support, send order notifications and, with your consent, promotional offers.",
      "Payments: we accept UPI payments. Payment screenshots you upload as proof are stored securely and used only to verify and approve your order.",
      "We never sell your personal data to third parties. Your information is stored via our secure backend (Insforge) and protected by industry-standard measures.",
      "You may request access, correction or deletion of your personal data at any time by contacting us over WhatsApp, phone or email."
    ]
  },
  "privacy-policy": {
    title: "Privacy Policy",
    content: [
      "At Alpha Watch & Opticals, we respect your privacy and are committed to protecting your personal information. This policy explains what we collect and how we use it.",
      "Information we collect: when you create an account or place an order, we collect your name, email address, phone number, delivery address and order history. If you sign in with Google, we store your Google profile name, email and picture.",
      "How we use your information: to process and deliver your orders, manage your account, provide customer support, send order notifications and, with your consent, promotional offers.",
      "Payments: we accept UPI payments. Payment screenshots you upload as proof are stored securely and used only to verify and approve your order.",
      "We never sell your personal data to third parties. Your information is stored via our secure backend (Insforge) and protected by industry-standard measures.",
      "You may request access, correction or deletion of your personal data at any time by contacting us over WhatsApp, phone or email."
    ]
  },
  terms: {
    title: "Terms & Conditions",
    content: [
      "By browsing or purchasing from our website, you agree to these terms and conditions.",
      "Orders: all orders are subject to confirmation. An order is considered placed only after successful submission, and payment confirmation where applicable.",
      "Pricing: all prices are in Indian Rupees (INR) and inclusive of applicable taxes. We reserve the right to correct any pricing errors.",
      "Payment: we accept UPI payments. For home delivery, full payment via UPI is required before dispatch. For shop pickup, you may pay at the store.",
      "Account responsibility: you are responsible for maintaining the confidentiality of your login credentials.",
      "We reserve the right to refuse or cancel any order at our discretion for reasons including stock unavailability or suspected fraud."
    ]
  },
  "terms-and-conditions": {
    title: "Terms & Conditions",
    content: [
      "By browsing or purchasing from our website, you agree to these terms and conditions.",
      "Orders: all orders are subject to confirmation. An order is considered placed only after successful submission, and payment confirmation where applicable.",
      "Pricing: all prices are in Indian Rupees (INR) and inclusive of applicable taxes. We reserve the right to correct any pricing errors.",
      "Payment: we accept UPI payments. For home delivery, full payment via UPI is required before dispatch. For shop pickup, you may pay at the store.",
      "Account responsibility: you are responsible for maintaining the confidentiality of your login credentials.",
      "We reserve the right to refuse or cancel any order at our discretion for reasons including stock unavailability or suspected fraud."
    ]
  },
  shipping: {
    title: "Shipping Policy",
    content: [
      "We offer two delivery options: Pickup from Shop (Indira Nagar, Raebareli) and Home Delivery.",
      "Home Delivery: orders are dispatched after UPI payment proof is approved. Delivery typically takes 3–5 business days within Raebareli and nearby areas.",
      "Delivery charges: free on orders above ₹999; a flat ₹49 fee applies otherwise. Exact charges are shown at checkout.",
      "Shop Pickup: your order will be marked 'Ready for Pickup' once processed. You can pay at the shop when collecting, or pay in advance online.",
      "We'll notify you via in-app notifications and SMS/WhatsApp about your order status at every stage."
    ]
  },
  "shipping-and-delivery": {
    title: "Shipping Policy",
    content: [
      "We offer two delivery options: Pickup from Shop (Indira Nagar, Raebareli) and Home Delivery.",
      "Home Delivery: orders are dispatched after UPI payment proof is approved. Delivery typically takes 3–5 business days within Raebareli and nearby areas.",
      "Delivery charges: free on orders above ₹999; a flat ₹49 fee applies otherwise. Exact charges are shown at checkout.",
      "Shop Pickup: your order will be marked 'Ready for Pickup' once processed. You can pay at the shop when collecting, or pay in advance online.",
      "We'll notify you via in-app notifications and SMS/WhatsApp about your order status at every stage."
    ]
  },
  returns: {
    title: "Return & Refund Policy",
    content: [
      "We want you to be completely satisfied with your purchase.",
      "Return Window: you may request a return or exchange within 7 days of delivery for unworn, unused items in original packaging with tags intact.",
      "Non-returnable: contact lenses and custom prescription lenses, and any item that shows signs of use or damage, cannot be returned for hygiene and safety reasons.",
      "Exchanges & Repairs: watch repairs come with a service warranty as stated on your receipt. If an item is defective on arrival, we'll replace it free of charge.",
      "Refunds: eligible refunds are processed to the original UPI payment method within 5–7 business days after the item is received and inspected.",
      "To initiate a return, contact us via WhatsApp, phone or support ticket with your order number."
    ]
  },
  "returns-and-refunds": {
    title: "Return & Refund Policy",
    content: [
      "We want you to be completely satisfied with your purchase.",
      "Return Window: you may request a return or exchange within 7 days of delivery for unworn, unused items in original packaging with tags intact.",
      "Non-returnable: contact lenses and custom prescription lenses, and any item that shows signs of use or damage, cannot be returned for hygiene and safety reasons.",
      "Exchanges & Repairs: watch repairs come with a service warranty as stated on your receipt. If an item is defective on arrival, we'll replace it free of charge.",
      "Refunds: eligible refunds are processed to the original UPI payment method within 5–7 business days after the item is received and inspected.",
      "To initiate a return, contact us via WhatsApp, phone or support ticket with your order number."
    ]
  }
};

export default function LegalPage({ params }: { params: { slug: string } }) {
  const doc = docs[params.slug];
  if (!doc) notFound();
  return (
    <div className="pt-24 md:pt-28 bg-ivory">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="uppercase tracking-[0.3em] text-xs text-gold-700 mb-3">{SITE.name}</div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-8">{doc.title}</h1>
        <div className="space-y-5">
          {doc.content.map((p, i) => <p key={i} className="text-navy/70 leading-relaxed text-sm md:text-base">{p}</p>)}
        </div>
        <div className="mt-10">
          <Link href="/" className="text-gold-700 text-sm font-medium underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
