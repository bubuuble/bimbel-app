// FILE: app/(main)/product/page.tsx
"use client"

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Filter, Grid, List, Search, TrendingUp } from "lucide-react";
import { Product, CATEGORIES, CATEGORY_DESCRIPTIONS } from "@/types/product";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal"; // Pastikan ini adalah path yang benar untuk modal produk

// Komponen untuk menampilkan filter kategori
function CategoryFilters({ 
    selectedCategory, 
    onCategoryChange, 
    products 
}: { 
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    products: Product[];
}) {
    // Hitung jumlah produk per kategori
    const categoriesWithCount = CATEGORIES.map(cat => ({
        ...cat,
        count: cat.value === "all" 
            ? products.length 
            : products.filter(p => p.category === cat.value).length
    }));

    return (
        <div className="mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
                <Filter className="w-5 h-5" style={{color: 'rgb(0,75,173)'}} />
                <h3 className="text-lg font-semibold" style={{color: 'rgb(0,75,173)'}}>
                    Filter berdasarkan kategori
                </h3>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
                {categoriesWithCount.map((category) => (
                    <Button
                        key={category.value}
                        onClick={() => onCategoryChange(category.value)}
                        variant={selectedCategory === category.value ? "default" : "outline"}
                        className={`relative transition-all duration-300 hover:shadow-lg border-2 ${
                            selectedCategory === category.value 
                                ? "shadow-lg scale-105" 
                                : "hover:scale-102"
                        }`}
                        style={{
                            backgroundColor: selectedCategory === category.value 
                                ? 'rgb(209,51,19)' 
                                : 'transparent',
                            borderColor: selectedCategory === category.value 
                                ? 'rgb(209,51,19)' 
                                : 'rgb(0,75,173)',
                            color: selectedCategory === category.value 
                                ? 'white' 
                                : 'rgb(0,75,173)'
                        }}
                    >
                        {category.label}
                        <Badge 
                            variant="secondary" 
                            className="ml-2 text-xs"
                            style={{
                                backgroundColor: selectedCategory === category.value 
                                    ? 'rgba(255,255,255,0.2)' 
                                    : 'rgba(0,75,173,0.1)',
                                color: selectedCategory === category.value 
                                    ? 'white' 
                                    : 'rgb(0,75,173)'
                            }}
                        >
                            {category.count}
                        </Badge>
                    </Button>
                ))}
            </div>

            {/* Category Description */}
            {selectedCategory !== "all" && CATEGORY_DESCRIPTIONS[selectedCategory] && (
                <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" 
                         style={{backgroundColor: 'rgba(0,75,173,0.1)'}}>
                        <TrendingUp className="w-4 h-4" style={{color: 'rgb(0,75,173)'}} />
                        <span className="text-sm" style={{color: 'rgb(0,75,173)'}}>
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

    // Handle product click
    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Fetch products from Sanity
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const query = groq`*[_type == "product"] | order(order asc, _createdAt asc) {
                    _id,
                    title,
                    category,
                    pricelistImage,
                    altText,
                    price,
                    originalPrice,
                    duration,
                    shortDescription,
                    description,
                    features,
                    featuredImage,
                    gallery[]{
                        asset,
                        alt
                    }
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
    }, []);

    // Filter products berdasarkan kategori dan search
    useEffect(() => {
        let filtered = products;

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(product => 
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    }, [products, selectedCategory, searchQuery]);

    // Handle category change
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    // Loading state
    if (loading) {
        return (
            <section className="py-20 min-h-screen flex items-center justify-center" 
                     style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.05) 0%, rgba(209,51,19,0.05) 100%)'}}>
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{color: 'rgb(0,75,173)'}} />
                    <p className="text-lg" style={{color: 'rgb(0,75,173)'}}>Memuat produk...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 min-h-screen" 
                 style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.03) 0%, rgba(209,51,19,0.03) 100%)'}}>
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" 
                             style={{backgroundColor: 'rgb(209,51,19)'}}>
                            <Grid className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold" style={{color: 'rgb(0,75,173)'}}>
                            Program Bimbingan
                        </h1>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" 
                             style={{backgroundColor: 'rgb(0,75,173)'}}>
                            <List className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <p className="mt-4 text-lg max-w-2xl mx-auto" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                        Temukan paket bimbingan belajar yang paling sesuai untuk mencapai target akademik Anda. 
                        Pilih dari berbagai kategori program yang tersedia.
                    </p>
                    
                    {/* Statistics */}
                    <div className="flex flex-wrap justify-center gap-6 mt-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold" style={{color: 'rgb(209,51,19)'}}>
                                {products.length}
                            </div>
                            <div className="text-sm" style={{color: 'rgb(0,75,173)', opacity: 0.7}}>
                                Total Program
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold" style={{color: 'rgb(209,51,19)'}}>
                                {filteredProducts.length}
                            </div>
                            <div className="text-sm" style={{color: 'rgb(0,75,173)', opacity: 0.7}}>
                                Program Ditampilkan
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold" style={{color: 'rgb(209,51,19)'}}>
                                {new Set(products.map(p => p.category)).size}
                            </div>
                            <div className="text-sm" style={{color: 'rgb(0,75,173)', opacity: 0.7}}>
                                Kategori Tersedia
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                                style={{color: 'rgb(0,75,173)', opacity: 0.6}} />
                        <Input
                            type="text"
                            placeholder="Cari program..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-2 focus:ring-0 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <CategoryFilters 
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    products={products}
                />

                {/* View Mode Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 p-1 bg-white rounded-lg shadow-md border-2" 
                         style={{borderColor: 'rgba(0,75,173,0.1)'}}>
                        <Button
                            size="sm"
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            onClick={() => setViewMode("grid")}
                            className="transition-all duration-300"
                            style={{
                                backgroundColor: viewMode === "grid" ? 'rgb(0,75,173)' : 'transparent',
                                color: viewMode === "grid" ? 'white' : 'rgb(0,75,173)'
                            }}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant={viewMode === "list" ? "default" : "ghost"}
                            onClick={() => setViewMode("list")}
                            className="transition-all duration-300"
                            style={{
                                backgroundColor: viewMode === "list" ? 'rgb(0,75,173)' : 'transparent',
                                color: viewMode === "list" ? 'white' : 'rgb(0,75,173)'
                            }}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Products Grid/List */}
                {filteredProducts.length > 0 ? (
                    <ProductGrid 
                        products={filteredProducts}
                        viewMode={viewMode}
                        selectedCategory={selectedCategory}
                        onProductClick={handleProductClick}
                    />
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" 
                             style={{backgroundColor: 'rgba(0,75,173,0.1)'}}>
                            <Search className="w-12 h-12" style={{color: 'rgb(0,75,173)', opacity: 0.5}} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2" style={{color: 'rgb(0,75,173)'}}>
                            Tidak ada produk ditemukan
                        </h3>
                        <p style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                            {searchQuery.trim() 
                                ? `Tidak ada produk yang cocok dengan "${searchQuery}"`
                                : `Belum ada produk dalam kategori "${selectedCategory === "all" ? "semua" : selectedCategory}" saat ini.`
                            }
                        </p>
                        <div className="flex gap-2 justify-center mt-4">
                            {searchQuery.trim() && (
                                <Button 
                                    onClick={() => setSearchQuery("")}
                                    variant="outline"
                                    className="border-2"
                                    style={{
                                        borderColor: 'rgb(0,75,173)',
                                        color: 'rgb(0,75,173)'
                                    }}
                                >
                                    Hapus Pencarian
                                </Button>
                            )}
                            <Button 
                                onClick={() => {
                                    handleCategoryChange("all");
                                    setSearchQuery("");
                                }}
                                className="border-2"
                                style={{
                                    backgroundColor: 'rgb(209,51,19)',
                                    borderColor: 'rgb(209,51,19)',
                                    color: 'white'
                                }}
                            >
                                Lihat Semua Program
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedProduct(null);
                    }}
                />
            )}
        </section>
    );
}
