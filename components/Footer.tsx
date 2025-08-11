// FILE: components/landing/Footer.tsx (REVISED)

'use client'
import Link from 'next/link';
import { Facebook, Instagram, MessageCircle } from 'lucide-react'; // Impor ikon WhatsApp

export default function Footer() {
    return (
        <footer className="text-black">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    {/* Bagian Kiri: Info & Alamat */}
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">BM</div>
                            <span className="font-bold text-xl">Bimbel Master</span>
                        </div>
                        <h4 className="font-semibold mt-6 mb-2 text-blue-600">Kantor Pusat</h4>
                        <p className="text-black text-sm max-w-xs">
                            Pakuwon Tower 26-J<br />
                            Jl. Casablanca Raya No.88<br />
                            Jakarta Selatan, DKI Jakarta 12960
                        </p>
                    </div>

                    {/* Spacer */}
                    <div className="md:col-span-2"></div>

                    {/* Bagian Kanan: Menu & Media Sosial */}
                    <div className="md:col-span-5 grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-semibold mb-4 text-black uppercase tracking-wider">Menu</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/" className="text-black hover:text-gray-600">Beranda</Link></li>
                                <li><Link href="/produk" className="text-black hover:text-gray-600">Produk</Link></li>
                                <li><Link href="/tentang-kami" className="text-black hover:text-gray-600">Tentang Kami</Link></li>
                                <li><Link href="/kebijakan-privasi" className="text-black hover:text-gray-600">Kebijakan Privasi</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-black uppercase tracking-wider">Media Sosial</h4>
                            <div className="flex gap-4">
                                <a href="#" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600">
                                    <Facebook size={24} />
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600">
                                    <Instagram size={24} />
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600">
                                    <MessageCircle size={24} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Copyright di Bawah */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-black text-sm">
                    <p>Copyrighted © {new Date().getFullYear()} by Bimbel Master</p>
                </div>
            </div>
        </footer>
    );
}