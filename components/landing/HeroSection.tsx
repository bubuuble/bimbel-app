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
    <section className="relative bg-neutral-50 min-h-screen flex items-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.05),transparent_50%)]" />
      
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content - 1 column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-sm border border-neutral-200 rounded-full text-sm text-neutral-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Buka pendaftaran gelombang baru
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-[1.1] tracking-tight">
                {title || "Raih prestasi terbaikmu bersama mentor berpengalaman"}
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-xl">
                {description || "Bergabunglah dengan ribuan siswa yang telah merasakan metode pembelajaran inovatif dan bimbingan personal yang terbukti efektif."}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-6 rounded-xl font-medium">
                <Link href="/dashboard">Mulai Belajar</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 px-8 py-6 rounded-xl font-medium">
                <Link href="/about">Pelajari Lebih Lanjut</Link>
              </Button>
            </div>
            
            {/* Stats row */}
            <div className="flex items-center gap-8 pt-8 border-t border-neutral-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">1200+</div>
                <div className="text-sm text-neutral-600">Siswa aktif</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">95%</div>
                <div className="text-sm text-neutral-600">Tingkat kelulusan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">50+</div>
                <div className="text-sm text-neutral-600">Program kelas</div>
              </div>
            </div>
          </div>

          {/* Image - 1 column */}
          <div className="lg:col-span-1 relative">
            <div className="relative h-[400px] md:h-[480px] lg:h-[520px] w-full">
              {(heroImages || []).map((image, index) => {
                if (!image.src) return null; 
                return (
                  <Image
                    key={`hero-image-${index}-${image.asset._id}`}
                    src={image.src}
                    alt={image.alt || 'Hero Image'}
                    fill
                    className={`rounded-2xl object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    priority={index === 0}
                  />
                );
              })}

              {/* Image overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent" />

              {/* Carousel controls */}
              {heroImages && heroImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-105"
                  >
                    <ChevronLeft className="h-5 w-5 text-neutral-700" />
                  </button>
                  <button 
                    onClick={nextImage} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-105"
                  >
                    <ChevronRight className="h-5 w-5 text-neutral-700" />
                  </button>
                  
                  {/* Dots indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {heroImages.map((_, index) => (
                      <button 
                        key={index} 
                        onClick={() => setCurrentIndex(index)} 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-white w-8' 
                            : 'bg-white/50 w-2 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}