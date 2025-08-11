// FILE: components/landing/HeroSection.tsx

'use client';
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Image as SanityImage } from 'sanity';

// Tipe data dari Sanity (TIDAK DIUBAH)
export interface HeroImageData {
    src: string;
    alt?: string; 
    asset: SanityImage;
}

interface HeroSectionProps { 
  title: string; 
  description: string; 
  heroImages: HeroImageData[];
}

// Data floating objects dari Sanity (TIDAK DIUBAH)
const hardcodedFloatingObjects = [
  { _key: 'float1', text: '1200+', label: 'Siswa Aktif', image: '/image/dummy1.jpg', position: 'top-16 left-10' },
  { _key: 'float2', text: '95%', label: 'Tingkat Kelulusan', image: '/image/dummy1.jpg', position: 'bottom-20 right-16' },
  { _key: 'float3', text: '50+', label: 'Program Kelas', image: '/image/dummy1.jpg', position: 'top-32 right-20' }
];

export default function HeroSection({ title, description, heroImages }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Logika komponen (TIDAK DIUBAH)
  const nextImage = useCallback(() => {
    if (heroImages && heroImages.length > 1) {
        setCurrentIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }
  }, [heroImages]);

  const prevImage = () => {
    if (heroImages && heroImages.length > 1) {
        setCurrentIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
    }
  };
  
  useEffect(() => {
    if (heroImages && heroImages.length > 1) {
      const timer = setTimeout(nextImage, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, heroImages, nextImage]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.05) 0%, rgba(209,51,19,0.05) 100%)'}}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,75,173,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content - 1 column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-sm border rounded-full text-sm" style={{borderColor: 'rgb(0,75,173)', color: 'rgb(0,75,173)'}}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: 'rgb(209,51,19)'}} />
                Buka pendaftaran gelombang baru
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight" style={{color: 'rgb(0,75,173)'}}>
                {title || "Raih prestasi terbaikmu bersama mentor berpengalaman"}
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-xl">
                {description || "Bergabunglah dengan ribuan siswa yang telah merasakan metode pembelajaran inovatif dan bimbingan personal yang terbukti efektif."}
              </p>
            </div>
            
            {/* Stats row */}
            <div className="flex items-center gap-8 pt-8 border-t" style={{borderColor: 'rgb(0,75,173,0.2)'}}>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{color: 'rgb(0,75,173)'}}>1200+</div>
                <div className="text-sm text-gray-600">Siswa aktif</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{color: 'rgb(209,51,19)'}}>95%</div>
                <div className="text-sm text-gray-600">Tingkat kelulusan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{color: 'rgb(0,75,173)'}}>50+</div>
                <div className="text-sm text-gray-600">Program kelas</div>
              </div>
            </div>
          </div>

          {/* Image - 1 column */}
          <div className="lg:col-span-1 relative">
            <div className="relative h-[400px] md:h-[480px] lg:h-[520px] w-full group">
              {/* Main image container with enhanced effects */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] border-4" 
                   style={{
                     borderColor: 'rgba(0,75,173,0.1)',
                     boxShadow: '0 25px 50px -12px rgba(0,75,173,0.25), 0 0 0 1px rgba(0,75,173,0.05)'
                   }}>
                {(heroImages || []).map((image, index) => {
                  if (!image.src) return null; 
                  return (
                    <Image
                      key={`hero-image-${index}-${image.asset._id}`}
                      src={image.src}
                      alt={image.alt || 'Hero Image'}
                      fill
                      className={`object-cover transition-all duration-1000 ease-in-out group-hover:scale-105 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                      priority={index === 0}
                    />
                  );
                })}

                {/* Enhanced image overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                
                {/* Brand accent overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
              </div>

              {/* Carousel controls */}
              {heroImages && heroImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2"
                    style={{borderColor: 'rgba(0,75,173,0.1)'}}
                  >
                    <ChevronLeft className="h-5 w-5" style={{color: 'rgb(0,75,173)'}} />
                  </button>
                  <button 
                    onClick={nextImage} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2"
                    style={{borderColor: 'rgba(0,75,173,0.1)'}}
                  >
                    <ChevronRight className="h-5 w-5" style={{color: 'rgb(0,75,173)'}} />
                  </button>
                  
                  {/* Enhanced dots indicator */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border" 
                       style={{borderColor: 'rgba(255,255,255,0.3)'}}>
                    {heroImages.map((_, index) => (
                      <button 
                        key={index} 
                        onClick={() => setCurrentIndex(index)} 
                        className={`h-2.5 rounded-full transition-all duration-300 hover:scale-125 ${
                          index === currentIndex 
                            ? 'w-8 shadow-lg' 
                            : 'w-2.5 hover:w-4'
                        }`}
                        style={{
                          backgroundColor: index === currentIndex ? 'rgb(209,51,19)' : 'rgba(255,255,255,0.6)'
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {/* Enhanced decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl animate-pulse" 
                   style={{backgroundColor: 'rgba(209,51,19,0.15)'}} />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full blur-3xl animate-pulse" 
                   style={{backgroundColor: 'rgba(0,75,173,0.15)', animationDelay: '1s'}} />
              
              {/* Additional floating accent elements */}
              <div className="absolute top-1/4 -right-2 w-4 h-4 rounded-full animate-float" 
                   style={{backgroundColor: 'rgb(209,51,19)', boxShadow: '0 0 20px rgba(209,51,19,0.4)'}} />
              <div className="absolute bottom-1/3 -left-2 w-3 h-3 rounded-full animate-float-delayed" 
                   style={{backgroundColor: 'rgb(0,75,173)', boxShadow: '0 0 15px rgba(0,75,173,0.4)'}} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}