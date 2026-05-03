import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/lib/cart";
import { CartBar } from "@/components/CartBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trig Showroom",
  description: "Trig Modern showroom quote builder",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#faf8f4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <CartProvider>
          <main className="pb-32">{children}</main>
          <CartBar />
        </CartProvider>
      </body>
    </html>
  );
}
