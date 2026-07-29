import type { Metadata } from "next";
import { marketingFaqs } from "@/lib/marketing-content";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.paymentrescue.com.au/",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Payment Rescue",
  url: "https://www.paymentrescue.com.au",
  description: "Invoice tracking and SMS payment reminders for Australian tradies and small businesses",
  areaServed: "AU",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: marketingFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
