// app/(main)/product/page.tsx
"use client";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Filter, Search, TrendingUp, BookOpen } from "lucide-react";
import { Product, CATEGORIES, CATEGORY_DESCRIPTIONS } from "@/types/product";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal";
import { useMidtransSnap } from "@/lib/hooks/useMidtransSnap";

/* ─── Category Filters ───────────────────────────────────────────────── */

function CategoryFilters({
  selectedCategory, onCategoryChange, products,
}: {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  products: Product[];
}) {
  const categoriesWithCount = CATEGORIES.map((cat) => ({
    ...cat,
    count: cat.value === "all" ? products.length : products.filter((p) => p.category === cat.value).length,
  }));

  return (
    <div className="mb-14">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Filter berdasarkan kategori</h3>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {categoriesWithCount.map((cat) => (
          <Button key={cat.value} onClick={() => onCategoryChange(cat.value)}
            variant={selectedCategory === cat.value ? "default" : "outline"}
            className={`relative transition-all duration-300 border-2 rounded-full ${selectedCategory === cat.value ? 'shadow-md scale-105 bg-primary border-primary text-primary-foreground' : 'hover:scale-105 hover:shadow-sm border-border/50 text-foreground/70 hover:text-primary'}`}
          >
            {cat.label}
            <Badge variant="secondary" className={`ml-2 text-xs rounded-full ${selectedCategory === cat.value ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
              {cat.count}
            </Badge>
          </Button>
        ))}
      </div>
      {selectedCategory !== "all" && CATEGORY_DESCRIPTIONS[selectedCategory] && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {CATEGORY_DESCRIPTIONS[selectedCategory]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Product Page ───────────────────────────────────────────────────── */

export default function ProductPage() {
  const [products, setProducts]                     = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts]     = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory]     = useState<string>("all");
  const [loading, setLoading]                       = useState<boolean>(true);
  const [viewMode]                                  = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery]               = useState<string>("");
  const [selectedProduct, setSelectedProduct]       = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen]               = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const snap = useMidtransSnap();

  const [user, setUser]               = useState<User | null>(null);
  const [isAuthLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handlePayment = async (product: Product) => {
    if (isAuthLoading) return;
    if (!user) {
      alert("Anda harus login terlebih dahulu untuk mendaftar.");
      router.push('/login');
      return;
    }

    setIsModalOpen(false);
    await new Promise(resolve => setTimeout(resolve, 300));

    setIsProcessingPayment(true);
    try {
      const response = await fetch('/api/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          productName: product.title,
          price: product.price,
          classId: product.supabaseClassId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create transaction.");
      }

      const { token } = await response.json();

      snap.pay(token, {
        onSuccess: (result: any) => { alert("Pembayaran berhasil!"); window.location.href = '/dashboard/kelas'; },
        onPending: (result: any) => { alert("Pembayaran Anda sedang diproses."); },
        onError: (result: any) => { alert("Pembayaran gagal."); },
        onClose: () => { console.log('customer closed the popup'); },
      });
    } catch (error: any) {
      console.error("Payment Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = groq`*[_type == "product"] | order(order asc, _createdAt asc) {
          ..., supabaseClassId, "gallery": gallery[]{ asset, alt }
        }`;
        const fetchedProducts: Product[] = await client.fetch(query);
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    const checkUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthLoading(false);
    };
    checkUser();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== "all") filtered = filtered.filter((p) => p.category === selectedCategory);
    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-foreground/70">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        className="relative pt-32 pb-24 px-4 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/5"
      >
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full pointer-events-none bg-secondary/10 blur-3xl" />

        <div className="container mx-auto text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20 bg-primary/10 text-primary">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-secondary" />
            Program Bimbingan
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold leading-tight max-w-4xl mx-auto text-foreground">
            Program <span className="text-primary">Unggulan</span> Kami
          </h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed text-foreground/70">
            Temukan paket bimbingan belajar yang paling sesuai untuk mencapai target akademik Anda.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-primary" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari program..."
              className="w-full pl-14 pr-6 py-4 rounded-full border border-border/50 outline-none transition-all focus:border-primary focus:shadow-sm focus:ring-2 focus:ring-primary/20 bg-card text-foreground placeholder:text-foreground/40"
            />
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-background/50">
        <div className="container mx-auto">
          <CategoryFilters
            selectedCategory={selectedCategory}
            onCategoryChange={(c) => setSelectedCategory(c)}
            products={products}
          />

          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} viewMode={viewMode}
              selectedCategory={selectedCategory} onProductClick={handleProductClick} />
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-primary/20" />
              <p className="text-foreground/50 font-medium">Tidak ada produk ditemukan.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── MODAL ─────────────────────────────────────────────────────── */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedProduct(null); }}
          onPayment={handlePayment}
          isProcessingPayment={isProcessingPayment}
        />
      )}
    </main>
  );
}
