  "use client";

  import { client } from "@/sanity/lib/client";
  import { groq } from "next-sanity";
  import { useState, useEffect } from "react";
  import { useRouter } from 'next/navigation';
  import { createClient } from '@/lib/supabase/client';
  import { User } from '@supabase/supabase-js';
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Loader2, Filter, Grid, List, Search, TrendingUp } from "lucide-react";
  import { Product, CATEGORIES, CATEGORY_DESCRIPTIONS } from "@/types/product";
  import ProductGrid from "@/components/ProductGrid";
  import ProductModal from "@/components/ProductModal";
  import { useMidtransSnap } from "@/lib/hooks/useMidtransSnap";

  // Komponen CategoryFilters (Tidak berubah)
  function CategoryFilters({ 
      selectedCategory, onCategoryChange, products 
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
          <div className="mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                  <Filter className="w-5 h-5" style={{ color: "rgb(0,75,173)" }} />
                  <h3 className="text-lg font-semibold" style={{ color: "rgb(0,75,173)" }}>
                      Filter berdasarkan kategori
                  </h3>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                  {categoriesWithCount.map((category) => (
                      <Button key={category.value} onClick={() => onCategoryChange(category.value)} variant={selectedCategory === category.value ? "default" : "outline"}
                          className={`relative transition-all duration-300 hover:shadow-lg border-2 ${selectedCategory === category.value ? "shadow-lg scale-105" : "hover:scale-102"}`}
                          style={{
                              backgroundColor: selectedCategory === category.value ? "rgb(209,51,19)" : "transparent",
                              borderColor: selectedCategory === category.value ? "rgb(209,51,19)" : "rgb(0,75,173)",
                              color: selectedCategory === category.value ? "white" : "rgb(0,75,173)",
                          }}
                      >
                          {category.label}
                          <Badge variant="secondary" className="ml-2 text-xs" style={{
                                  backgroundColor: selectedCategory === category.value ? "rgba(255,255,255,0.2)" : "rgba(0,75,173,0.1)",
                                  color: selectedCategory === category.value ? "white" : "rgb(0,75,173)",
                              }}
                          >
                              {category.count}
                          </Badge>
                      </Button>
                  ))}
              </div>
              {selectedCategory !== "all" && CATEGORY_DESCRIPTIONS[selectedCategory] && (
                  <div className="mt-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: "rgba(0,75,173,0.1)" }}>
                          <TrendingUp className="w-4 h-4" style={{ color: "rgb(0,75,173)" }} />
                          <span className="text-sm" style={{ color: "rgb(0,75,173)" }}>
                              {CATEGORY_DESCRIPTIONS[selectedCategory]}
                          </span>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  export default function ProductPage() {
      const [products, setProducts] = useState<Product[]>([]);
      const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
      const [selectedCategory, setSelectedCategory] = useState<string>("all");
      const [loading, setLoading] = useState<boolean>(true);
      const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
      const [searchQuery, setSearchQuery] = useState<string>("");
      const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isProcessingPayment, setIsProcessingPayment] = useState(false);
      const snap = useMidtransSnap();
      
      // --- [PERBAIKAN 1] --- Inisialisasi state & hooks yang hilang
      const [user, setUser] = useState<User | null>(null);
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
                      classId: product.supabaseClassId, // Menggunakan arsitektur baru
                  }),
              });

              if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.error || "Failed to create transaction.");
              }

              const { token } = await response.json();
              
              snap.pay(token, {
                  onSuccess: (result: any) => {
                      alert("Pembayaran berhasil!");
                      window.location.href = '/dashboard/kelas'; // Arahkan ke halaman pilih kelas
                  },
                  onPending: (result: any) => { alert("Pembayaran Anda sedang diproses."); },
                  onError: (result: any) => { alert("Pembayaran gagal."); },
                  onClose: () => { console.log('customer closed the popup'); }
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
                  // --- [PERBAIKAN 2] --- Pastikan supabaseClassId diambil dari Sanity
                  const query = groq`*[_type == "product"] | order(order asc, _createdAt asc) {
                      ..., // Ambil semua field yang ada
                      supabaseClassId, // Ambil field spesifik ini
                      "gallery": gallery[]{ asset, alt }
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

          // --- [PERBAIKAN 3] --- Tambahkan logika untuk memeriksa sesi pengguna
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
          if (selectedCategory !== "all") {
              filtered = filtered.filter((product) => product.category === selectedCategory);
          }
          if (searchQuery.trim()) {
              filtered = filtered.filter(
                  (product) =>
                      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      product.category.toLowerCase().includes(searchQuery.toLowerCase())
              );
          }
          setFilteredProducts(filtered);
      }, [products, selectedCategory, searchQuery]);

      const handleCategoryChange = (category: string) => {
          setSelectedCategory(category);
      };

      if (loading) {
          return (
              <section className="py-20 min-h-screen flex items-center justify-center">
                  <div className="text-center">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: "rgb(0,75,173)" }} />
                      <p className="text-lg" style={{ color: "rgb(0,75,173)" }}>Memuat produk...</p>
                  </div>
              </section>
          );
      }

      return (
          <section className="py-20 min-h-screen" style={{ background: "linear-gradient(135deg, rgba(0,75,173,0.03) 0%, rgba(209,51,19,0.03) 100%)" }}>
              <div className="container mx-auto px-6">
                  {/* ... (Header dan UI lainnya tidak berubah) ... */}
                  <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgb(209,51,19)" }}><Grid className="w-6 h-6 text-white" /></div>
                          <h1 className="text-4xl md:text-5xl font-extrabold" style={{ color: "rgb(0,75,173)" }}>Program Bimbingan</h1>
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgb(0,75,173)" }}><List className="w-6 h-6 text-white" /></div>
                      </div>
                      <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "rgb(0,75,173)", opacity: 0.8 }}>Temukan paket bimbingan belajar yang paling sesuai untuk mencapai target akademik Anda.</p>
                  </div>

                  {filteredProducts.length > 0 ? (
                      <ProductGrid products={filteredProducts} viewMode={viewMode} selectedCategory={selectedCategory} onProductClick={handleProductClick} />
                  ) : (
                      <div className="text-center py-16"><p>Tidak ada produk ditemukan.</p></div>
                  )}
              </div>

              {selectedProduct && (
                  <ProductModal
                      product={selectedProduct}
                      isOpen={isModalOpen}
                      onClose={() => {
                          setIsModalOpen(false);
                          setSelectedProduct(null);
                      }}
                      onPayment={handlePayment}
                      isProcessingPayment={isProcessingPayment}
                  />
              )}
          </section>
      );
  }