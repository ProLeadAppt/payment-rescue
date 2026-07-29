import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  metadataBase: new URL("https://www.paymentrescue.com.au"),
  title: "Payment Rescue — Get Paid Faster, Chase Less, Lose Less",
  description: "Payment Rescue helps Australian tradies and small businesses get paid faster with automated SMS reminders, invoice tracking, and chargeback protection. Start free today.",
  keywords: ["payment reminders", "invoice chasing", "small business payments", "tradie tools", "get paid faster", "late payments", "chargeback protection", "Australian small business"],
  openGraph: {
    title: "Payment Rescue — Get Paid Faster, Chase Less, Lose Less",
    description: "Automated SMS payment reminders for Australian tradies. Stop chasing invoices. Start getting paid.",
    type: "website",
    locale: "en_AU",
    url: "https://www.paymentrescue.com.au/",
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
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
