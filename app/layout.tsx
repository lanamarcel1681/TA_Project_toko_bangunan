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
  title: "Toko Bangunan Lumbung Jaya",
  description: "Toko Bangunan Lumbung Jaya",
};

import { ToastProvider } from "./components/Toast";
import WhatsAppFAB from "./components/WhatsAppFAB";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>
          {children}
          <WhatsAppFAB />
        </ToastProvider>
      </body>
    </html>
  );
}
