// FILE: types/product.ts

export interface Product {
  _id: string;
  title: string;
  category: 'online' | 'private' | 'regular' | 'responsive';
  // New fields
  shortDescription?: string;
  description?: any[]; // Rich text blocks
  features?: string[];
  duration?: string;
  targetAudience?: string;
  featuredImage?: any; // Sanity image type
  gallery?: Array<{
    _key: string;
    asset: any;
    alt: string;
    caption?: string;
  }>;
  originalPrice?: number;
  // Existing fields
  pricelistImage?: any; // Legacy - Sanity image type
  altText?: string; // Legacy
  price: number;
  order?: number;
}

export interface Category {
  value: string;
  label: string;
  count: number;
}

export type ViewMode = 'grid' | 'list';

export const CATEGORIES: Omit<Category, 'count'>[] = [
  { value: "all", label: "Semua Program" },
  { value: "online", label: "Online Class" },
  { value: "private", label: "Private Exclusive" },
  { value: "regular", label: "Regular Class" },
  { value: "responsive", label: "Responsive Class" },
];

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  online: "Pembelajaran fleksibel dari rumah dengan teknologi terdepan",
  private: "Bimbingan personal eksklusif dengan mentor terbaik",
  regular: "Program bimbingan klasikal dengan metode proven",
  responsive: "Program adaptif yang menyesuaikan kebutuhan siswa",
};
