"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bannerImages = [
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop"
];

export default function GalleryHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (sliderRef.current && sliderRef.current.children[0]) {
      const slider = sliderRef.current;
      const slideElement = slider.children[0] as HTMLElement;
      // slideElement.offsetWidth doesn't include the gap, assuming gap-4 (16px)
      const slideWidth = slideElement.offsetWidth + 16;
      const targetLeft = index * slideWidth;

      // Custom smooth scroll animation for slower speed
      const startLeft = slider.scrollLeft;
      const distance = targetLeft - startLeft;
      let startTime: number | null = null;
      const duration = 600; // Duration in ms

      // Temporarily disable CSS snap and smooth scroll
      slider.style.scrollBehavior = 'auto';
      slider.style.scrollSnapType = 'none';

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // easeInOutQuad: smooth acceleration and deceleration
        const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        slider.scrollLeft = startLeft + distance * ease;

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          // Restore CSS behaviors
          slider.style.scrollBehavior = '';
          slider.style.scrollSnapType = '';
        }
      };

      requestAnimationFrame(animation);
      setActiveSlide(index);
    }
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' 
      ? (activeSlide > 0 ? activeSlide - 1 : bannerImages.length - 1)
      : (activeSlide < bannerImages.length - 1 ? activeSlide + 1 : 0);
    scrollToIndex(newIndex);
  };

  const handleScroll = () => {
    if (sliderRef.current && sliderRef.current.children[0]) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const slideElement = sliderRef.current.children[0] as HTMLElement;
      const slideWidth = slideElement.offsetWidth + 16; // Add gap
      if (slideWidth > 0) {
        const newIndex = Math.round(scrollPosition / slideWidth);
        if (newIndex !== activeSlide && newIndex >= 0 && newIndex < bannerImages.length) {
          setActiveSlide(newIndex);
        }
      }
    }
  };

  return (
    <div className="relative group/slider">
      <div className="container mx-auto max-w-6xl relative">
        <button 
          onClick={() => scrollSlider('left')}
          className="absolute left-2 md:-left-6 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-primary hover:bg-white hover:scale-110 transition-all opacity-0 group-hover/slider:opacity-100 hidden sm:flex border border-border/50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => scrollSlider('right')}
          className="absolute right-2 md:-right-6 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-primary hover:bg-white hover:scale-110 transition-all opacity-0 group-hover/slider:opacity-100 hidden sm:flex border border-border/50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div 
          ref={sliderRef} 
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 scroll-smooth px-1 md:px-0" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {bannerImages.map((src, index) => (
            <div 
              key={index} 
              className="relative w-[88%] md:w-[92%] flex-shrink-0 snap-start snap-always rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/10] md:aspect-[21/9] lg:aspect-[21/8] shadow-md border border-border/50"
            >
              <style jsx>{`
                div::-webkit-scrollbar { display: none; }
              `}</style>
              <Image
                src={src}
                alt={`Banner promo ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {bannerImages.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => scrollToIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === activeSlide ? 'w-6 bg-primary' : 'w-2 bg-border/50 hover:bg-primary/50'}`} 
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}