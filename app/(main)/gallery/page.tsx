// app/(main)/gallery/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { urlForImage } from '@/sanity/lib/image'
import { Loader2, X, Camera, ChevronLeft, ChevronRight } from 'lucide-react'
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

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    client.fetch(GALLERY_QUERY)
      .then((data) => { setItems(data || []); setLoading(false) })
      .catch(() => setLoading(false))
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-foreground/70">Memuat gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full pointer-events-none bg-secondary/10 blur-3xl" />

        <div className="container mx-auto text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20 bg-primary/10 text-primary">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-secondary" />
            Galeri Foto
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold leading-tight max-w-4xl mx-auto text-foreground">
            <span className="text-primary">Gallery</span> Bimbel Master
          </h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed text-foreground/70">
            Lihat momen-momen berharga dari kegiatan belajar mengajar, fasilitas, dan prestasi siswa Bimbel Master.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 border-2 ${
                  selectedCategory === cat.value
                    ? 'bg-primary border-primary text-primary-foreground shadow-md scale-105'
                    : 'border-border/50 text-foreground/70 hover:text-primary hover:border-primary/30 hover:scale-105'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          {filtered.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filtered.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="break-inside-avoid group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-border/50">
                    <Image
                      src={urlForImage(item.image).width(600).url()}
                      alt={item.image?.alt || item.title}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white font-bold text-sm">{item.title}</p>
                      {item.description && (
                        <p className="text-white/80 text-xs mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-primary uppercase">
                      {item.category}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Camera className="w-16 h-16 mx-auto mb-4 text-primary/20" />
              <p className="text-foreground/50 font-medium">Belum ada foto di gallery.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevLightbox() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextLightbox() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
            <Image
              src={urlForImage(filtered[lightboxIndex].image).width(1200).url()}
              alt={filtered[lightboxIndex].image?.alt || filtered[lightboxIndex].title}
              width={1200}
              height={800}
              className="rounded-2xl max-h-[75vh] w-auto h-auto object-contain mx-auto"
            />
            <div className="text-center mt-4 text-white">
              <p className="font-bold text-lg">{filtered[lightboxIndex].title}</p>
              {filtered[lightboxIndex].description && (
                <p className="text-white/70 text-sm mt-1">{filtered[lightboxIndex].description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
