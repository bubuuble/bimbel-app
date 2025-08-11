// FILE: components/landing/SupportSection.tsx
'use client';
import React from "react";
import Image from "next/image";

export interface Supporter { _key: string; _id: string; name: string; logoUrl: string; alt: string; }

export default function SupportSection({ supporters }: { supporters: Supporter[] }) {
  if (!supporters || supporters.length === 0) {
    // Tampilkan placeholder jika tidak ada data dari Sanity
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                 <h2 className="text-3xl font-bold text-gray-900">Partner Kami</h2>
                 <p className="mt-4 text-lg text-gray-600">Daftar partner belum tersedia.</p>
            </div>
        </section>
    );
  }

  const duplicatedSupporters = supporters.length > 3 ? [...supporters, ...supporters] : supporters;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Didukung oleh Partner Terpercaya
        </h2>
        <div className="w-full inline-flex flex-nowrap overflow-hidden mt-12 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll">
                {duplicatedSupporters.map((supporter, index) => (
                    <li key={supporter._key || `${supporter._id}-${index}`}>
                        <Image src={supporter.logoUrl} width={120} height={50} alt={supporter.alt} className="max-h-12 w-auto object-contain" />
                    </li>
                ))}
            </ul>
             <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll" aria-hidden="true">
                {duplicatedSupporters.map((supporter, index) => (
                    <li key={`${supporter._key || supporter._id}-${index}-clone`}>
                        <Image src={supporter.logoUrl} width={120} height={50} alt={supporter.alt} className="max-h-12 w-auto object-contain" />
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </section>
  );
}