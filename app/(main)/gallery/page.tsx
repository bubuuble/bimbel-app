// app/(main)/gallery/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { urlForImage } from '@/sanity/lib/image'
import { Loader2, X, Camera, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'

interface GalleryItem {
  _id: string
  title: string
  image: { asset: any; alt?: string }
  category: string
  description?: string
  publishedAt?: string
}

const GALLERY_QUERY = groq`*[_type == "gallery"] | order(publishedAt desc) {
  _id, title, image{ asset, alt }, category, description, publishedAt
}`

const CATEGORIES = [
  { value: 'all', label: 'Semua' },
  { value: 'kegiatan', label: 'Kegiatan' },
  { value: 'fasilitas', label: 'Fasilitas' },
  { value: 'prestasi', label: 'Prestasi' },
  { value: 'event', label: 'Event' },
  { value: 'lainnya', label: 'Lainnya' },
]

const DUMMY_ITEMS: any[] = Array.from({ length: 6 }).map((_, i) => ({
  _id: `dummy-${i}`,
  title: `Placeholder Foto ${i + 1}`,
  category: CATEGORIES[(i % (CATEGORIES.length - 1)) + 1].value,
  description: 'Ini adalah foto placeholder untuk melihat tampilan grid & detail.',
  imageUrl: `https://picsum.photos/seed/${i + 10}/600/400`,
}))

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const bannerImages = [
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop"
  ]

  const scrollToIndex = (index: number) => {
    if (sliderRef.current && sliderRef.current.children[0]) {
      const slider = sliderRef.current;
      const slideElement = slider.children[0] as HTMLElement;
      // slideElement.offsetWidth doesn't include the gap, assuming gap-4 (16px)
      const slideWidth = slideElement.offsetWidth + 16;
      slider.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
      setActiveSlide(index);
    }
  }

  const scrollSlider = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' 
      ? (activeSlide > 0 ? activeSlide - 1 : bannerImages.length - 1)
      : (activeSlide < bannerImages.length - 1 ? activeSlide + 1 : 0);
    scrollToIndex(newIndex);
  }

  // Automatically track scroll position for dots
  const handleScroll = () => {
    if (sliderRef.current && sliderRef.current.children[0]) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const slideElement = sliderRef.current.children[0] as HTMLElement;
      const slideWidth = slideElement.offsetWidth + 16; // Add gap
      const newIndex = Math.round(scrollPosition / slideWidth);
      if (newIndex !== activeSlide && newIndex >= 0 && newIndex < bannerImages.length) {
        setActiveSlide(newIndex);
      }
    }
  }

  useEffect(() => {
    client.fetch(GALLERY_QUERY)
      .then((data) => { setItems(data?.length > 0 ? data : DUMMY_ITEMS); setLoading(false) })
      .catch(() => { setItems(DUMMY_ITEMS); setLoading(false) })
  }, [])

  const filtered = selectedCategory === 'all'
    ? items
    : items.filter(i => i.category === selectedCategory)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevLightbox = () => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length)
  }
  const nextLightbox = () => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % filtered.length)
  }

  return (
    <main className="overflow-x-hidden min-h-screen bg-background">
      {/* Title */}
      <section className="pt-24 md:pt-32 pb-2 px-2 md:px-4 text-center">
        <h1 className="font-extrabold text-3xl md:text-5xl text-primary font-sans tracking-tight uppercase drop-shadow-sm">Master Gallery</h1>
        <p className="text-foreground/70 text-xs md:text-lg font-medium mt-1 md:mt-2 max-w-2xl mx-auto px-4">
          Lihat momen-momen berharga dari kegiatan belajar mengajar, fasilitas, dan prestasi siswa Bimbel Master.
        </p>
      </section>

      {/* Hero Banner Slider */}
      <section className="pt-4 pb-4 px-1 md:px-4 relative group/slider">
        <div className="container mx-auto max-w-6xl relative">
          
          {/* Navigation Buttons (Desktop only or hidden on mobile) */}
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

          {/* Slider Container */}
          <div 
            ref={sliderRef} 
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 scroll-smooth" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {bannerImages.map((src, index) => (
              <div 
                key={index} 
                className="relative w-[88%] md:w-[92%] flex-shrink-0 snap-start rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/10] md:aspect-[21/9] lg:aspect-[21/8] shadow-md border border-border/50"
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

          {/* Slider Dots */}
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
      </section>

      {/* Filter and Title */}
      <section className="py-4 px-2 md:px-4 pb-2">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex justify-between items-center w-full px-1 md:px-0">
            <h2 className="text-2xl md:text-3xl font-bold font-sans text-foreground drop-shadow-sm">All Photos</h2>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full bg-secondary/20 hover:bg-secondary/40 text-foreground transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </button>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="flex flex-wrap justify-end gap-2 w-full mt-2 md:mt-0 animate-in fade-in slide-in-from-top-2 px-1 md:px-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-1.5 rounded-full font-semibold text-xs transition-all duration-300 border shadow-sm ${
                    selectedCategory === cat.value
                      ? 'bg-primary border-primary text-primary-foreground shadow-md'
                      : 'bg-background border-border/60 text-foreground/80 hover:text-primary hover:border-primary/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20 px-1 md:px-2 pt-2">
        <div className="container mx-auto">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {filtered.map((item, index) => (
                <div
                  key={item._id}
                  className="relative rounded-2xl overflow-hidden shadow-sm cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 aspect-[4/5] sm:aspect-[3/4]"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={item.image?.asset ? urlForImage(item.image).width(600).url() : (item as any).imageUrl}
                    alt={item.image?.alt || item.title}
                    fill
                    unoptimized={!(item.image?.asset)}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay Gradient: dark at top for tag readability, dark at bottom for title */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {/* Top Tag */}
                  <div className="absolute top-3 left-3 md:top-4 md:left-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-bold bg-white/20 backdrop-blur-md text-white uppercase tracking-wide shadow-sm border border-white/20">
                      {item.category}
                    </span>
                  </div>

                  {/* Bottom Title */}
                  <div className="absolute bottom-0 left-0 w-full p-3 md:p-5">
                    <p className="font-bold text-base md:text-xl text-white drop-shadow-md truncate">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Camera className="w-16 h-16 mx-auto mb-4 text-primary/30" />
              <p className="text-foreground/60 font-medium">Belum ada foto di gallery.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all z-10"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Navigation Controls */}
          {filtered.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevLightbox() }}
                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all z-10"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextLightbox() }}
                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all z-10"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </>
          )}

          {/* Modal Content */}
          <div 
            className="w-full max-w-5xl relative flex flex-col items-center animate-in zoom-in-95 duration-300" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl bg-black/50">
              <Image
                src={filtered[lightboxIndex].image?.asset ? urlForImage(filtered[lightboxIndex].image).width(1200).url() : (filtered[lightboxIndex] as any).imageUrl}
                alt={filtered[lightboxIndex].image?.alt || filtered[lightboxIndex].title}
                fill
                unoptimized={!(filtered[lightboxIndex].image?.asset)}
                className="object-contain"
              />
            </div>
            
            {/* Detail Texts */}
            <div className="text-center mt-4 md:mt-6 text-white w-full max-w-3xl">
              <span className="inline-block mb-2 px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground uppercase tracking-wider">
                {filtered[lightboxIndex].category}
              </span>
              <h3 className="font-bold text-xl md:text-3xl lg:text-4xl drop-shadow-md">
                {filtered[lightboxIndex].title}
              </h3>
              {filtered[lightboxIndex].description && (
                <p className="text-white/80 text-sm md:text-base mt-2 leading-relaxed">
                  {filtered[lightboxIndex].description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
