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
  title: "Payment Rescue | Invoice Tracking and SMS Reminders",
  description: "Track invoices, customer phone numbers, reminder history, and payment status. Send SMS payment reminders from one dashboard.",
  keywords: ["payment reminders", "invoice tracking", "SMS reminders", "tradie tools", "late payments", "Australian small business"],
  openGraph: {
    title: "Payment Rescue | Invoice Tracking and SMS Reminders",
    description: "Track invoices and send SMS payment reminders from one focused dashboard.",
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
      lang="en-AU"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
