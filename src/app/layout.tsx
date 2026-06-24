import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { Toaster } from "react-hot-toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zixo Cookies - Freshly Baked Happiness Delivered to Your Door",
  description:
    "Premium handcrafted cookies made with love. Order freshly baked cookies, gift boxes, and dessert combos online. Delivery across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-dark">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#120A07",
              color: "#F8F4EE",
              borderRadius: "12px",
              border: "1px solid rgba(212,175,55,0.2)",
              fontFamily: "var(--font-inter)",
            },
            success: {
              iconTheme: { primary: "#D4AF37", secondary: "#0A0503" },
            },
          }}
        />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
