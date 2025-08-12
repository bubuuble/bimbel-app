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
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8" 
    : "space-y-6";

  return (
    <div className={gridClasses}>
      {products.map((product, index) => (
        <div
          key={`${product._id}-${selectedCategory}`}
          className="animate-fade-in-up"
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
