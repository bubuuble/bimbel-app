// FILE: types/product.ts

export interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  duration?: string;
  shortDescription: string;
  description: any; // Tipe 'any' atau tipe Portable Text yang lebih spesifik
  features?: string[];
  featuredImage?: { asset: any; alt?: string };
  gallery?: { asset: any; alt: string }[];
  // --- [TAMBAHKAN BARIS INI] ---
  supabaseClassId?: string; // Jadikan opsional (?) untuk keamanan
  educationLevel?: 'sd' | 'smp' | 'sma' | 'all'; // Untuk filter jenjang

  // Field legacy (jika masih ada di tipe Anda)
  pricelistImage?: { asset: any };
  altText?: string;
  publishedAt?: string;
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
