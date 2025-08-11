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
            <Button className="border-2 hover:shadow-lg transition-all duration-300" 
                    style={{
                        backgroundColor: 'rgb(209,51,19)', 
                        borderColor: 'rgb(209,51,19)', 
                        color: 'white'
                    }}>
                Semua Program
            </Button>
            {/* Tombol filter lain bisa ditambahkan di sini */}
        </div>
    );
}

// Komponen untuk satu kartu pricelist
function PricelistCard({ product }: { product: Product }) {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border-2 hover:-translate-y-1" 
             style={{borderColor: 'rgba(0,75,173,0.1)'}}>
            <div className="relative">
                <Image 
                    src={urlForImage(product.pricelistImage).width(800).height(800).url()}
                    alt={product.altText}
                    width={800}
                    height={800}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                />
                {/* Brand accent overlay */}
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full" 
                     style={{backgroundColor: 'rgb(209,51,19)'}} />
            </div>
            <div className="p-6 text-center">
                <h3 className="text-xl font-bold" style={{color: 'rgb(0,75,173)'}}>{product.title}</h3>
                <p className="text-sm capitalize mt-1" style={{color: 'rgb(209,51,19)'}}>{product.category} Class</p>
                <Button asChild className="mt-4 w-full hover:shadow-lg transition-all duration-300 border-2" 
                        style={{
                            backgroundColor: 'rgb(0,75,173)', 
                            borderColor: 'rgb(0,75,173)', 
                            color: 'white'
                        }}>
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
        <section className="py-20" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.03) 0%, rgba(209,51,19,0.03) 100%)'}}>
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold" style={{color: 'rgb(0,75,173)'}}>Pricelist Program</h1>
                    <p className="mt-4 text-lg" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
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
                        <p style={{color: 'rgb(0,75,173)', opacity: 0.8}}>Belum ada produk yang tersedia saat ini.</p>
                    </div>
                )}
            </div>
        </section>
    );
}