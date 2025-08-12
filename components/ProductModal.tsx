// FILE: components/ProductModal.tsx
"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { urlForImage } from '@/sanity/lib/image';
import { Product } from '@/types/product';
import { 
  X, 
  Star, 
  ArrowRight, 
  ImageIcon, 
  CheckCircle,
  Tag,
  FileText,
  Sparkles,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

/**
 * Sub-komponen untuk membuat seksi informasi yang terstruktur dan rapi.
 * Menggunakan brand colors untuk konsistensi visual.
 */
const InfoSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div>
    <h3 className="flex items-center gap-2 text-sm font-semibold mb-3 uppercase tracking-wider" style={{color: 'rgb(0,75,173)'}}>
      {icon}
      <span>{title}</span>
    </h3>
    {children}
  </div>
);

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  isOpen, 
  onClose 
}) => {
  // Jangan render apapun jika tidak ada produk yang dipilih.
  if (!product) return null;

  // State untuk image slider
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Gabungkan semua gambar yang tersedia
  const allImages = [
    ...(product.featuredImage ? [{ asset: product.featuredImage, alt: product.title }] : []),
    ...(product.gallery || []),
    ...(product.pricelistImage ? [{ asset: product.pricelistImage, alt: `${product.title} - Price List` }] : [])
  ].filter(img => img.asset); // Filter hanya yang memiliki asset

  // Fungsi navigasi gambar
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Fungsi helper untuk mendapatkan label kategori.
  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      'sd': 'SD', 'smp': 'SMP', 'sma': 'SMA', 'sbmptn': 'SBMPTN',
      'cpns': 'CPNS', 'toefl': 'TOEFL', 'umum': 'Umum'
    };
    return labels[category] || 'Umum';
  };

  // Fungsi helper untuk memformat harga ke Rupiah.
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Fungsi untuk render rich text dari Sanity
  const renderDescription = (description: any): string => {
    if (typeof description === 'string') {
      return description;
    }
    
    if (Array.isArray(description)) {
      return description
        .map(block => {
          if (block._type === 'block' && block.children) {
            return block.children
              .map((child: any) => child.text || '')
              .join('');
          }
          return '';
        })
        .join(' ');
    }
    
    return '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] h-auto p-0 bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl md:rounded-3xl shadow-2xl border-0 flex flex-col lg:flex-row overflow-hidden">
        
        <DialogTitle className="sr-only">{product.title}</DialogTitle>

        {/* KOLOM KIRI: VISUAL GAMBAR PRODUK */}
        <div className="w-full lg:w-1/2 xl:w-3/5 flex-shrink-0 bg-gradient-to-br from-blue-100 via-slate-50 to-red-100 overflow-hidden relative">
          {/* Brand watermark */}
          <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-1.5 md:p-2 shadow-lg">
            <GraduationCap className="w-4 h-4 md:w-5 md:h-5" style={{color: 'rgb(0,75,173)'}} />
          </div>
          
          <div className="w-full h-[40vh] md:h-[50vh] lg:h-full p-3 md:p-6 lg:p-8">
            <div className="w-full h-full shadow-2xl rounded-xl md:rounded-2xl overflow-hidden ring-1 ring-white/50" style={{boxShadow: '0 25px 50px -12px rgba(0,75,173,0.25)'}}>
              {allImages.length > 0 ? (
                <div className="relative h-full">
                  {/* Main Image */}
                  <Image
                    src={urlForImage(allImages[currentImageIndex].asset).width(1200).url()}
                    alt={allImages[currentImageIndex].alt || product.title}
                    fill
                    className="object-contain p-2 md:p-4"
                    priority
                  />
                  
                  {/* Navigation Arrows - Only show if more than 1 image */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-1 md:left-2 lg:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200"
                      >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" style={{color: 'rgb(0,75,173)'}} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-1 md:right-2 lg:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200"
                      >
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" style={{color: 'rgb(0,75,173)'}} />
                      </button>
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 px-2 py-1 md:px-4 md:py-2 bg-black/70 backdrop-blur-sm rounded-full">
                        <span className="text-white text-xs md:text-sm font-medium">
                          {currentImageIndex + 1} / {allImages.length}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {/* Thumbnail Strip - Only show if more than 1 image and on larger screens */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-2 left-2 right-16 md:bottom-4 md:left-4 md:right-20 hidden sm:block">
                      <div className="flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide">
                        {allImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => goToImage(index)}
                            className={`relative flex-shrink-0 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-md lg:rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                              index === currentImageIndex 
                                ? 'border-white scale-105 shadow-lg' 
                                : 'border-white/50 hover:border-white hover:scale-105'
                            }`}
                          >
                            <Image
                              src={urlForImage(image.asset).width(100).height(100).url()}
                              alt={image.alt || `${product.title} - Image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-blue-200 rounded-xl md:rounded-2xl">
                  <div className="text-center" style={{color: 'rgb(0,75,173)'}}>
                    <ImageIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2" />
                    <p className="font-medium text-sm md:text-base">Gambar tidak tersedia</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* KOLOM KANAN: INFORMASI & AKSI */}
        <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm">
          {/* Header dengan judul dan tombol close */}
          <div className="px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8 pb-3 md:pb-4 flex-shrink-0">
            <div className="flex justify-between items-start gap-3 md:gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold truncate" style={{color: 'rgb(0,75,173)'}}>
                  {product.title}
                </h1>
                <div className="flex items-center gap-2 mt-1 md:mt-2">
                  <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-white text-white border" style={{backgroundColor: 'rgb(209,51,19)', borderColor: 'rgb(209,51,19)'}}>
                    <GraduationCap className="w-3 h-3 mr-1" />
                    {getCategoryLabel(product.category)}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white hover:bg-red-50 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 hover:border-red-300 flex-shrink-0 group"
                aria-label="Tutup modal"
              >
                <X className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>
          
          {/* Konten utama yang bisa di-scroll */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 space-y-4 md:space-y-6 lg:space-y-8">
            <InfoSection title="Harga & Status" icon={<Tag size={14} />}>
              <div className="p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl border shadow-lg text-white" style={{backgroundColor: 'rgb(0,75,173)', borderColor: 'rgb(0,75,173)'}}>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                  {formatPrice(product.price)}
                </p>
                <div className="flex items-center gap-2 mt-2 md:mt-3 text-xs md:text-sm font-medium bg-white/20 rounded-full px-2 md:px-3 py-1 w-fit" style={{color: 'rgb(255,255,255)'}}>
                  <Star size={14} className="fill-current" style={{color: 'rgb(255,215,0)'}} />
                  <span>Program Unggulan</span>
                </div>
              </div>
            </InfoSection>

            <InfoSection title="Deskripsi" icon={<FileText size={14} />}>
              <div className="bg-white/60 backdrop-blur-sm p-3 md:p-4 rounded-lg md:rounded-xl border shadow-sm" style={{borderColor: 'rgb(0,75,173,0.2)'}}>
                <p className="text-gray-700 leading-relaxed text-xs md:text-sm">
                  {renderDescription(product.description) || product.shortDescription || "Informasi detail tentang program ini."}
                </p>
              </div>
            </InfoSection>

            {product.features && product.features.length > 0 && (
              <InfoSection title="Fitur Termasuk" icon={<Sparkles size={14} />}>
                <div className="bg-white/60 backdrop-blur-sm p-3 md:p-4 rounded-lg md:rounded-xl border shadow-sm" style={{borderColor: 'rgb(0,75,173,0.2)'}}>
                  <ul className="space-y-2 md:space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 md:gap-3 text-xs md:text-sm text-gray-800">
                        <div className="rounded-full p-0.5 md:p-1 flex-shrink-0 mt-0.5" style={{backgroundColor: 'rgb(209,51,19)'}}>
                          <CheckCircle className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                        </div>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </InfoSection>
            )}

            {/* Mobile Image Gallery - Show thumbnails on mobile if multiple images */}
            {allImages.length > 1 && (
              <div className="block sm:hidden">
                <InfoSection title="Galeri" icon={<ImageIcon size={14} />}>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide p-1">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'border-red-500 scale-105 shadow-lg' 
                            : 'border-gray-300 hover:border-red-300 hover:scale-105'
                        }`}
                      >
                        <Image
                          src={urlForImage(image.asset).width(100).height(100).url()}
                          alt={image.alt || `${product.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </InfoSection>
              </div>
            )}
          </div>

          {/* Footer Aksi yang "Sticky" */}
          <div className="flex-shrink-0 px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6 bg-white/90 backdrop-blur-sm border-t" style={{borderColor: 'rgb(0,75,173,0.2)'}}>
            <Button 
              asChild
              className="w-full h-12 md:h-14 text-sm md:text-base font-bold group rounded-xl md:rounded-2xl text-white shadow-xl border-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style={{
                backgroundColor: 'rgb(209,51,19)', 
                boxShadow: '0 20px 25px -5px rgba(209,51,19,0.25), 0 10px 10px -5px rgba(209,51,19,0.1)'
              }}
            >
              <Link href={`/pembayaran?product_id=${product._id}`} className="flex items-center justify-center gap-2 md:gap-3">
                <GraduationCap className="w-4 h-4 md:w-5 md:h-5" />
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;