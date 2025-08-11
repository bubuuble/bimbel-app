// FILE: app/(main)/produk/page.tsx
import { client } from "@/sanity/lib/client"; // <-- Pastikan path ini benar
import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { urlForImage } from "@/sanity/lib/image"; // <-- Pastikan path ini benar


// Tipe data untuk produk dari Sanity
type Product = {
    _id: string;
    title: string;
    category: string;
    pricelistImage: any; // Tipe Sanity image
    altText: string;
    price: number;
};

// Komponen untuk menampilkan filter kategori
function CategoryFilters() {
    // Logika filter bisa ditambahkan di sini nanti jika diperlukan
    // Untuk sekarang, kita tampilkan semua
    return (
        <div className="flex justify-center gap-4 mb-12">
            <Button>Semua Program</Button>
            {/* Tombol filter lain bisa ditambahkan di sini */}
        </div>
    );
}

// Komponen untuk satu kartu pricelist
function PricelistCard({ product }: { product: Product }) {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
            <div className="relative">
                <Image 
                    src={urlForImage(product.pricelistImage).width(800).height(800).url()}
                    alt={product.altText}
                    width={800}
                    height={800}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800">{product.title}</h3>
                <p className="text-gray-500 text-sm capitalize">{product.category} Class</p>
                <Button asChild className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                    {/* Link ini nantinya akan ke halaman pembayaran */}
                    <Link href={`/pembayaran?product_id=${product._id}`}>Daftar & Bayar</Link>
                </Button>
            </div>
        </div>
    );
}


export default async function ProdukPage() {
    const query = groq`*[_type == "product"] | order(order asc, _createdAt asc) {
        _id,
        title,
        category,
        pricelistImage,
        altText,
        price
    }`;

    const products: Product[] = await client.fetch(query);

    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900">Pricelist Program</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Temukan paket bimbingan belajar yang paling sesuai untuk Anda.
                    </p>
                </div>

                <CategoryFilters />

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map(product => (
                            <PricelistCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500">Belum ada produk yang tersedia saat ini.</p>
                    </div>
                )}
            </div>
        </section>
    );
}