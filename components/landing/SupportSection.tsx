// FILE: components/landing/SupportSection.tsx
'use client';
import React from "react";
import Image from "next/image";

export interface Supporter { _key: string; _id: string; name: string; logoUrl: string; alt: string; }

export default function SupportSection({ supporters }: { supporters: Supporter[] }) {
  if (!supporters || supporters.length === 0) {
    return (
        <section className="py-20 px-6" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.02) 0%, rgba(209,51,19,0.02) 100%)'}}>
            <div className="container mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium border shadow-sm" 
                     style={{borderColor: 'rgb(0,75,173)', color: 'rgb(0,75,173)'}}>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: 'rgb(209,51,19)'}} />
                    Partner terpercaya
                </div>
                <h2 className="text-3xl md:text-4xl font-bold" style={{color: 'rgb(0,75,173)'}}>Didukung institusi terkemuka</h2>
                <p className="text-lg" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>Daftar partner akan segera ditampilkan.</p>
            </div>
        </section>
    );
  }

  // Untuk infinite scroll yang smooth, kita tidak perlu duplikasi berlebihan
  // Cukup gunakan data asli saja, karena kita akan menduplikasi di JSX
  const supportersToShow = supporters;

  return (
    <section className="py-20 px-6 border-t-2" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.02) 0%, rgba(209,51,19,0.02) 100%)', borderColor: 'rgba(0,75,173,0.1)'}}>
      <div className="container mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium border shadow-sm" 
               style={{borderColor: 'rgb(0,75,173)', color: 'rgb(0,75,173)'}}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: 'rgb(209,51,19)'}} />
            Partner terpercaya
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold max-w-3xl mx-auto leading-tight" style={{color: 'rgb(0,75,173)'}}>
            Didukung oleh institusi pendidikan terkemuka di Indonesia
          </h2>
          
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
            Kemitraan strategis dengan berbagai universitas dan lembaga pendidikan untuk memastikan kualitas pembelajaran terbaik.
          </p>
        </div>

        {/* Partners scroll */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl" style={{background: 'linear-gradient(to right, rgba(255,255,255,0.5), rgba(255,255,255,0.8), rgba(255,255,255,0.5))'}}>
            <div className="flex w-full animate-infinite-scroll py-4">
              {/* Create enough duplicates for seamless infinite scroll */}
              {[...Array(3)].map((_, setIndex) => (
                <div key={`set-${setIndex}`} className="flex flex-shrink-0">
                  {supportersToShow.map((supporter, index) => (
                    <div key={`supporter-${setIndex}-${index}`} className="flex-shrink-0 mx-6">
                      <div className="group w-40 h-24 bg-white rounded-2xl p-6 flex items-center justify-center hover:shadow-xl transition-all duration-300 border-2" 
                           style={{borderColor: 'rgba(0,75,173,0.1)'}}
                           onMouseEnter={(e) => {
                             e.currentTarget.style.borderColor = 'rgb(0,75,173)';
                             e.currentTarget.style.transform = 'translateY(-2px)';
                           }}
                           onMouseLeave={(e) => {
                             e.currentTarget.style.borderColor = 'rgba(0,75,173,0.1)';
                             e.currentTarget.style.transform = 'translateY(0)';
                           }}>
                        <Image 
                          src={supporter.logoUrl} 
                          width={120} 
                          height={60} 
                          alt={supporter.alt} 
                          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105" 
                        />
                        {/* Brand accent dot */}
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                             style={{backgroundColor: 'rgb(209,51,19)'}} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Enhanced gradient overlays with brand colors */}
          <div className="absolute left-0 top-0 w-24 h-full pointer-events-none z-10" 
               style={{background: 'linear-gradient(to right, rgba(0,75,173,0.03), transparent)'}} />
          <div className="absolute right-0 top-0 w-24 h-full pointer-events-none z-10" 
               style={{background: 'linear-gradient(to left, rgba(209,51,19,0.03), transparent)'}} />
        </div>
        
        {/* Enhanced bottom text */}
        <div className="text-center mt-12">
          <p className="text-sm" style={{color: 'rgb(0,75,173)', opacity: 0.7}}>
            Dan masih banyak institusi lainnya yang telah mempercayai kami sebagai partner pendidikan
          </p>
          
          {/* Decorative line */}
          <div className="flex justify-center mt-6">
            <div className="w-24 h-px" style={{background: 'linear-gradient(to right, transparent, rgb(0,75,173), transparent)'}} />
          </div>
        </div>
      </div>
    </section>
  );
}