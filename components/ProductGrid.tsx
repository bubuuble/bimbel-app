// FILE: components/product/ProductGrid.tsx
"use client"

import React from 'react';
import { Product, ViewMode } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  viewMode: ViewMode;
  selectedCategory: string;
  onProductClick: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  viewMode, 
  selectedCategory,
  onProductClick
}) => {
  const gridClasses = viewMode === "grid" 
    ? "flex flex-wrap justify-center gap-6 md:gap-8" 
    : "space-y-6";

  return (
    <div className={gridClasses}>
      {products.map((product, index) => (
        <div
          key={`${product._id}-${selectedCategory}`}
          className={`animate-fade-in-up ${viewMode === "grid" ? "w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]" : "w-full"}`}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationFillMode: 'both'
          }}
        >
          <ProductCard 
            product={product} 
            viewMode={viewMode} 
            onClick={() => onProductClick(product)}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
