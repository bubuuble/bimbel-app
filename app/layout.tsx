// src/app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800']
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800']
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: "Bimbel Master",
  description: "Solusi Pembelajaran Terbaik untuk Siswa Indonesia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} ${montserrat.variable} ${playfair.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}