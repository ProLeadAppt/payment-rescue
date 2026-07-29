import type { Metadata } from "next";

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
  description: "Automated payment reminders for Australian tradies and small businesses",
  areaServed: "AU",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Payment Rescue work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Payment Rescue connects to your existing tools (Square, Xero, QuickBooks) and automatically sends SMS reminders to customers with overdue invoices. You set the schedule, we handle the rest.",
      },
    },
    {
      "@type": "Question",
      name: "How much does it cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Plans start from $29/month with no lock-in contract. All plans include a 14-day free trial.",
      },
    },
    {
      "@type": "Question",
      name: "Is it only for tradies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No! Any Australian small business can use Payment Rescue. It's built for tradies but works for cleaners, landscapers, builders, consultants, and more.",
      },
    },
  ],
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
