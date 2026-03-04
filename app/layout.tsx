// src/app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: "Bimbel Master",
  description: "Solusi Pembelajaran Terbaik untuk Siswa Indonesia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}