// FILE: components/landing/HeroSection.tsx

'use client';
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { urlForImage } from "@/sanity/lib/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Image as SanityImage } from 'sanity'; // <-- IMPOR TIPE IMAGE RESMI

// Tipe data yang cocok dengan skema Sanity
export interface HeroImageSanity extends SanityImage { // <-- GUNAKAN 'extends'
    alt?: string; 
}
export interface FloatingObjectData { 
    _key: string;
    text: string; 
    label: string; 
    image: SanityImage; // <-- GUNAKAN TIPE RESMI
    position: string; 
}
interface HeroSectionProps { 
  title: string; 
  description: string; 
  heroImages: HeroImageSanity[];
  floatingObjects: FloatingObjectData[];
}

export default function HeroSection({ title, description, heroImages, floatingObjects }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <section className="bg-white py-20 px-4 overflow-hidden">
      <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="text-center lg:text-left z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
                dangerouslySetInnerHTML={{ __html: title.replace(/potensimu|karirmu/g, '<span class="text-blue-600">$&</span>') }}
            ></h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
              {description}
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/register">Daftar Sekarang</Link>
              </Button>
            </div>
        </div>

        {/* Image Content */}
        <div className="relative flex justify-center items-center h-[500px]">
          {/* Carousel Image */}
          {(heroImages || []).map((image, index) => {
                            // Cek apakah 'asset' ada sebelum merender
                            if (!image.asset) return null; 

                            return (
                                <Image
                                    // Gunakan _key dari image jika ada, atau _ref, atau index sebagai fallback
                                    key={(image as any)._key || image.asset._ref || index}
                                    src={urlForImage(image).width(800).height(1000).url()}
                                    alt={image.alt || 'Hero Image'}
                                    fill
                                    className={`rounded-3xl object-cover shadow-2xl transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                                    priority={index === 0}
                                />
                            );
                        })}
                        {/* --- AKHIR PERUBAIKAN --- */}

          {/* Carousel Controls */}
          {heroImages && heroImages.length > 1 && (
            <>
                <button onClick={prevImage} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 p-2 rounded-full shadow-md hover:bg-white transition">
                    <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>
                <button onClick={nextImage} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 p-2 rounded-full shadow-md hover:bg-white transition">
                    <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
                <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
                    {heroImages.map((_, index) => (
                        <button key={index} onClick={() => setCurrentIndex(index)} className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-blue-600 w-6' : 'bg-white/70 w-2'}`}></button>
                    ))}
                </div>
            </>
          )}

          {/* Floating Objects */}
          {(floatingObjects || []).map((obj) => (
            <div key={obj._key} className={`absolute ${obj.position} bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-3 flex items-center gap-3 animate-float z-20`}>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <Image src={urlForImage(obj.image).width(40).height(40).url()} alt={obj.label} width={28} height={28} />
              </div>
              <div>
                <p className="font-bold text-md text-gray-900">{obj.text}</p>
                <p className="text-xs text-gray-600 -mt-1">{obj.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}