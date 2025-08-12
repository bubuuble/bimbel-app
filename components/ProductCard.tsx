// FILE: components/product/ProductCard.tsx
"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { urlForImage } from '@/sanity/lib/image';
import { Product, ViewMode, CATEGORY_DESCRIPTIONS } from '@/types/product';
import { Grid, Clock, Star, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  viewMode?: ViewMode;
  onClick?: () => void; // Add click handler
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  viewMode = "grid",
  onClick
}) => {
  // Get the main image (prioritize featuredImage, fallback to pricelistImage)
  const getMainImage = () => {
    if (product.featuredImage) {
      return {
        asset: product.featuredImage,
        alt: product.featuredImage.alt || product.title
      };
    }
    if (product.pricelistImage) {
      return {
        asset: product.pricelistImage,
        alt: product.altText || product.title
      };
    }
    return null;
  };

  const mainImage = getMainImage();
  // Format harga ke Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Map category ke label yang readable
  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      "online": "Online Class",
      "private": "Private Exclusive", 
      "regular": "Regular Class",
      "responsive": "Responsive Class"
    };
    return categoryMap[category] || category;
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      "online": "rgb(34, 197, 94)", // green
      "private": "rgb(168, 85, 247)", // purple
      "regular": "rgb(59, 130, 246)", // blue
      "responsive": "rgb(245, 158, 11)" // amber
    };
    return colorMap[category] || "rgb(107, 114, 128)";
  };

  if (viewMode === "list") {
    return (
      <div 
        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:scale-[1.01] cursor-pointer" 
        style={{borderColor: 'rgba(0,75,173,0.1)'}}
        onClick={onClick}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative md:w-1/3">
            {mainImage ? (
              <Image 
                src={urlForImage(mainImage.asset).width(400).height(300).url()}
                alt={mainImage.alt || product.title || 'Product image'}
                width={400}
                height={300}
                className="w-full h-48 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-48 md:h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge 
                className="text-xs font-semibold shadow-lg"
                style={{
                  backgroundColor: getCategoryColor(product.category),
                  color: 'white'
                }}
              >
                {getCategoryLabel(product.category)}
              </Badge>
            </div>
          </div>

          {/* Content Section */}
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-3" style={{color: 'rgb(0,75,173)'}}>
                {product.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {product.shortDescription || CATEGORY_DESCRIPTIONS[product.category] || "Program bimbingan berkualitas tinggi"}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Program Unggulan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    {product.duration || "Fleksibel"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <p className="text-2xl font-bold" style={{color: 'rgb(209,51,19)'}}>
                  {formatPrice(product.price)}
                </p>
              </div>
              <Button 
                asChild 
                className="hover:shadow-xl transition-all duration-300 border-2 group" 
                style={{
                  backgroundColor: 'rgb(0,75,173)', 
                  borderColor: 'rgb(0,75,173)', 
                  color: 'white'
                }}
              >
                <Link href={`/pembayaran?product_id=${product._id}`} className="flex items-center gap-2">
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer" 
      style={{borderColor: 'rgba(0,75,173,0.1)'}}
      onClick={onClick}
    >
      
      {/* Header dengan kategori badge */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Badge 
            className="text-xs font-semibold shadow-lg"
            style={{
              backgroundColor: getCategoryColor(product.category),
              color: 'white'
            }}
          >
            {getCategoryLabel(product.category)}
          </Badge>
        </div>
        
        {/* Brand accent */}
        <div className="absolute top-4 right-4 z-10">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" 
               style={{backgroundColor: 'rgb(0,75,173)'}}>
            <Grid className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Gambar produk */}
        <div className="relative overflow-hidden">
          {mainImage ? (
            <Image 
              src={urlForImage(mainImage.asset).width(800).height(600).url()}
              alt={mainImage.alt || product.title || 'Product image'}
              width={800}
              height={600}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300" 
              style={{color: 'rgb(0,75,173)'}}>
            {product.title}
          </h3>
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'rgb(209,51,19)'}} />
            <p className="text-lg font-semibold" style={{color: 'rgb(209,51,19)'}}>
              {formatPrice(product.price)}
            </p>
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'rgb(209,51,19)'}} />
          </div>
        </div>

        <Button 
          asChild 
          className="w-full hover:shadow-xl transition-all duration-300 border-2 hover:scale-105 group/button" 
          style={{
            backgroundColor: 'rgb(0,75,173)', 
            borderColor: 'rgb(0,75,173)', 
            color: 'white'
          }}
        >
          <Link href={`/pembayaran?product_id=${product._id}`} className="flex items-center justify-center gap-2">
            <span>Daftar & Bayar</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
