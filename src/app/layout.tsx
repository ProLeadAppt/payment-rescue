import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Payment Rescue — Get Paid Faster, Chase Less, Lose Less",
  description: "Payment Rescue helps Australian tradies and small businesses get paid faster with automated SMS reminders, invoice tracking, and chargeback protection. Start free today.",
  keywords: ["payment reminders", "invoice chasing", "small business payments", "tradie tools", "get paid faster", "late payments", "chargeback protection", "Australian small business"],
  openGraph: {
    title: "Payment Rescue — Get Paid Faster, Chase Less, Lose Less",
    description: "Automated SMS payment reminders for Australian tradies. Stop chasing invoices. Start getting paid.",
    type: "website",
    locale: "en_AU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Payment Rescue",
              "url": "https://paymentrescue.com.au",
              "description": "Automated payment reminders for Australian tradies and small businesses",
              "areaServed": "AU",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How does Payment Rescue work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Payment Rescue connects to your existing tools (Square, Xero, QuickBooks) and automatically sends SMS reminders to customers with overdue invoices. You set the schedule, we handle the rest.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "How much does it cost?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Plans start from $29/month with no lock-in contract. All plans include a 14-day free trial.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "Is it only for tradies?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No! Any Australian small business can use Payment Rescue. It's built for tradies but works for cleaners, landscapers, builders, consultants, and more.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
