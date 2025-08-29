// FILE: components/ProductModal.tsx
'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { urlForImage } from '@/sanity/lib/image';
import { Product } from '@/types/product';
import { 
  X, 
  Star, 
  ImageIcon, 
  CheckCircle,
  Tag,
  FileText,
  Sparkles,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CreditCard
} from 'lucide-react';

// Props Interface yang sudah diperbarui untuk menerima fungsi pembayaran
interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onPayment: (product: Product) => void;
  isProcessingPayment: boolean;
}

// Sub-komponen untuk seksi informasi
const InfoSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div>
    <h3 className="flex items-center gap-2 text-sm font-semibold mb-3 uppercase tracking-wider" style={{color: 'rgb(0,75,173)'}}>
      {icon}
      <span>{title}</span>
    </h3>
    {children}
  </div>
);


const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  isOpen, 
  onClose,
  onPayment,
  isProcessingPayment
}) => {
  if (!product) return null;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = [
    ...(product.featuredImage ? [{ asset: product.featuredImage, alt: product.title }] : []),
    ...(product.gallery || [])
  ].filter(img => img.asset);

  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);

  const formatPrice = (price: number): string => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(price);

  // Fungsi sederhana untuk merender portable text (bisa diganti dengan library jika lebih kompleks)
  const renderDescription = (description: any): string => {
    if (!description) return product.shortDescription || "Informasi detail tentang program ini.";
    if (typeof description === 'string') return description;
    if (Array.isArray(description)) {
      return description
        .map(block => block._type === 'block' && block.children ? block.children.map((child: any) => child.text || '').join('') : '')
        .join('\n\n');
    }
    return '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 flex flex-col lg:flex-row overflow-hidden rounded-xl shadow-2xl">
        
        {/* Kolom Kiri: Gambar */}
        <div className="w-full lg:w-1/2 bg-gray-100 flex items-center justify-center p-4 relative">
          {allImages.length > 0 ? (
            <div className="relative w-full h-64 lg:h-full">
              <Image
                src={urlForImage(allImages[currentImageIndex].asset).width(800).url()}
                alt={allImages[currentImageIndex].alt || product.title}
                fill
                className="object-contain rounded-lg"
              />
              {allImages.length > 1 && (
                <>
                  <Button onClick={prevImage} variant="outline" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                  <Button onClick={nextImage} variant="outline" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{currentImageIndex + 1} / {allImages.length}</div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500"><ImageIcon className="mx-auto h-12 w-12" /><p>Gambar tidak tersedia</p></div>
          )}
        </div>
        
        {/* Kolom Kanan: Informasi & Aksi */}
        <div className="flex-1 flex flex-col bg-white min-h-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-20"><X className="h-6 w-6" /></button>
          
          {/* Header yang memenuhi syarat aksesibilitas */}
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-bold" style={{color: 'rgb(0,75,173)'}}>
              {product.title}
            </DialogTitle>
          </DialogHeader>
          
          {/* Konten yang bisa di-scroll */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            <InfoSection title="Harga & Status" icon={<Tag size={14} />}>
              <div className="p-4 rounded-lg text-white" style={{backgroundColor: 'rgb(0,75,173)'}}>
                <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
                <div className="flex items-center gap-2 mt-2 text-sm"><Star size={14} className="fill-current text-yellow-400" /><span>Program Unggulan</span></div>
              </div>
            </InfoSection>

            <InfoSection title="Deskripsi" icon={<FileText size={14} />}>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {renderDescription(product.description)}
              </p>
            </InfoSection>

            {product.features && product.features.length > 0 && (
              <InfoSection title="Fitur Termasuk" icon={<Sparkles size={14} />}>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </InfoSection>
            )}
          </div>

          {/* Footer Aksi */}
          <div className="flex-shrink-0 p-6 border-t bg-gray-50">
            <Button 
              onClick={() => onPayment(product)}
              disabled={isProcessingPayment}
              className="w-full h-12 text-base font-bold group rounded-lg text-white"
              style={{backgroundColor: 'rgb(209,51,19)'}}
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Daftar & Bayar Sekarang
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;