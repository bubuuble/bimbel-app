// FILE: components/landing/SupportSection.tsx
'use client';
import React from "react";
import Image from "next/image";

export interface Supporter { _key: string; _id: string; name: string; logoUrl: string; alt: string; }

export default function SupportSection({ supporters }: { supporters: Supporter[] }) {
  if (!supporters || supporters.length === 0) {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="container mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full text-sm text-neutral-600 font-medium">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    Partner terpercaya
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">Didukung institusi terkemuka</h2>
                <p className="text-lg text-neutral-600">Daftar partner akan segera ditampilkan.</p>
            </div>
        </section>
    );
  }

  // Untuk infinite scroll yang smooth, kita tidak perlu duplikasi berlebihan
  // Cukup gunakan data asli saja, karena kita akan menduplikasi di JSX
  const supportersToShow = supporters;

  return (
    <section className="py-20 px-6 bg-white border-t border-neutral-200">
      <div className="container mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full text-sm text-neutral-600 font-medium">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            Partner terpercaya
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 max-w-3xl mx-auto leading-tight">
            Didukung oleh institusi pendidikan terkemuka di Indonesia
          </h2>
          
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Kemitraan strategis dengan berbagai universitas dan lembaga pendidikan untuk memastikan kualitas pembelajaran terbaik.
          </p>
        </div>

        {/* Partners scroll */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex w-full animate-infinite-scroll">
              {/* Create enough duplicates for seamless infinite scroll */}
              {[...Array(3)].map((_, setIndex) => (
                <div key={`set-${setIndex}`} className="flex flex-shrink-0">
                  {supportersToShow.map((supporter, index) => (
                    <div key={`supporter-${setIndex}-${index}`} className="flex-shrink-0 mx-6">
                      <div className="group w-40 h-24 bg-neutral-50 rounded-2xl p-6 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all duration-300 border border-neutral-200">
                        <Image 
                          src={supporter.logoUrl} 
                          width={120} 
                          height={60} 
                          alt={supporter.alt} 
                          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>
        
        {/* Bottom text */}
        <div className="text-center mt-12">
          <p className="text-sm text-neutral-500">
            Dan masih banyak institusi lainnya yang telah mempercayai kami sebagai partner pendidikan
          </p>
        </div>
      </div>
    </section>
  );
}