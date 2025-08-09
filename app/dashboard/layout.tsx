// src/app/dashboard/layout.tsx
import React from 'react';

// Setiap layout di Next.js App Router HARUS menerima 'children' sebagai props
// dan me-render 'children' tersebut.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Anda bisa menambahkan elemen pembungkus di sini jika perlu,
    // seperti header atau footer khusus dashboard.
    // Untuk sekarang, kita cukup me-render children-nya saja.
    <section>{children}</section>
  );
}