import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Payment Rescue — Get Paid Faster, Chase Less",
  description: "SMS payment reminders for Australian tradies and service businesses. Connect Xero or Square. Free beta access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
