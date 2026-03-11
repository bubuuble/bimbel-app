// FILE: components/product/ProductCard.tsx
"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Clock, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { urlForImage } from '@/sanity/lib/image';
import { Product, ViewMode, CATEGORY_DESCRIPTIONS } from '@/types/product';

interface ProductCardProps {
  product: Product;
  viewMode?: ViewMode;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = "grid",
  onClick
}) => {
  const getMainImage = () => {
    if (product.featuredImage) {
      return { asset: product.featuredImage, alt: product.featuredImage.alt || product.title };
    }
    if (product.pricelistImage) {
      return { asset: product.pricelistImage, alt: product.altText || product.title };
    }
    return null;
  };

  const mainImage = getMainImage();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      "online": "Online Class",
      "private": "Private Exclusive",
      "regular": "Regular Class",
      "responsive": "Responsive Class"
    };
    return categoryMap[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      "online": "var(--primary)",
      "private": "var(--secondary)",
      "regular": "var(--accent)",
      "responsive": "#F87171"
    };
    return colorMap[category] || "var(--muted-foreground)";
  };

  // ── List view ──────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <div
        onClick={onClick}
        className="group bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)] transition-all duration-300 cursor-pointer flex flex-col md:flex-row border border-gray-100"
      >
        {/* Image */}
        <div className="relative md:w-1/3 h-56 md:h-auto overflow-hidden flex-shrink-0 rounded-[2rem] m-4">
          {mainImage ? (
            <Image
              src={urlForImage(mainImage.asset).width(600).height(400).url()}
              alt={mainImage.alt || product.title || 'Product image'}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 rounded-[2rem]"
            />
          ) : (
            <div className="w-full h-full bg-[#F0F3FF] flex items-center justify-center rounded-[2rem]">
              <span className="text-gray-300">No Image</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge
              className="text-xs font-semibold shadow-md bg-white px-3 py-1"
              style={{ color: '#5B7C99' }}
            >
              {getCategoryLabel(product.category).toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col justify-between flex-1 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm font-medium text-foreground/70">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" />
                5,957 Siswa
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-secondary" />
                {product.duration || "Fleksibel"}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#5B7C99] group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <p className="text-foreground/70 line-clamp-2">
              {product.shortDescription || CATEGORY_DESCRIPTIONS[product.category] || "Program bimbingan berkualitas tinggi"}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
            <div className="flex items-center gap-3">
              {product.originalPrice && (
                <span className="text-sm text-foreground/40 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
            </div>
            <Link
              href={`/pembayaran?product_id=${product._id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-bold shadow-sm hover:opacity-90 hover:scale-105 transition-all"
            >
              Daftar Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Grid view ──────────────────────────────────────────────
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)] transition-all duration-300 cursor-pointer border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-40 md:h-64 overflow-hidden rounded-[1.25rem] md:rounded-[2rem] m-3 md:m-4">
        {mainImage ? (
          <Image
            src={urlForImage(mainImage.asset).width(600).url()}
            alt={mainImage.alt || product.title || 'Product image'}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 rounded-[1.25rem] md:rounded-[2rem]"
          />
        ) : (
          <div className="w-full h-full bg-[#F0F3FF] flex items-center justify-center rounded-[1.25rem] md:rounded-[2rem]">
            <span className="text-gray-300">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2 md:top-3 md:right-3">
          <Badge
            className="text-[10px] md:text-xs font-semibold shadow-md bg-white px-2 md:px-3 py-0.5 md:py-1"
            style={{ color: '#5B7C99' }}
          >
            {getCategoryLabel(product.category).toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="px-4 pb-4 md:px-6 md:pb-6 space-y-2 md:space-y-4">
        {/* Meta stats */}
        <div className="flex justify-between items-center text-xs md:text-sm font-medium text-foreground/70">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 md:w-4 md:h-4 text-secondary" />
            {product.duration || "Fleksibel"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm md:text-xl font-bold text-[#5B7C99] line-clamp-2 min-h-[36px] md:min-h-[56px] leading-snug group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {/* Short Description */}
        {(product.shortDescription || CATEGORY_DESCRIPTIONS[product.category]) && (
          <p className="text-xs md:text-sm text-foreground/60 line-clamp-2 leading-relaxed">
            {product.shortDescription || CATEGORY_DESCRIPTIONS[product.category]}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 md:pt-6 border-t border-foreground/10">
          <div>
            {product.originalPrice && (
              <span className="block text-[10px] md:text-xs text-foreground/40 line-through">{formatPrice(product.originalPrice)}</span>
            )}
            <p className="text-sm md:text-xl font-bold text-primary">{formatPrice(product.price)}</p>
          </div>
          <Link
            href={`/pembayaran?product_id=${product._id}`}
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;