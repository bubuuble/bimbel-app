// FILE: components/Footer.tsx

'use client'
import Link from 'next/link';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto px-6 py-22">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    {/* Logo */}
                    <div className="md:col-span-3">
                        <div className="flex items-center gap-2 mb-6">
                            <img 
                                src="/image/logo/24.jpg" 
                                alt="Bimbel Master Logo" 
                                className="w-40 h-40 object-contain"
                            />
                        </div>
                    </div>

                    {/* Company Address */}
                    <div className="md:col-span-4">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-primary">Kantor Pusat</h4>
                            <address className="text-muted-foreground text-sm not-italic leading-relaxed">
                                Jl. Agus Salim No 30 A-B<br />
                                Sawahan<br />
                                Padang, Sumatera Barat<br />
                            </address>
                        </div>
                    </div>
                        
                    {/* Navigation & Social Media */}
                    <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Navigation Menu */}
                        <div>
                            <h4 className="font-semibold mb-4 text-foreground uppercase tracking-wider text-sm">
                                Menu
                            </h4>
                            <nav className="space-y-3">
                                <Link 
                                    href="/" 
                                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Beranda
                                </Link>
                                <Link 
                                    href="/produk" 
                                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Produk
                                </Link>
                                <Link 
                                    href="/tentang-kami" 
                                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Tentang Kami
                                </Link>
                                <Link 
                                    href="/kebijakan-privasi" 
                                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Kebijakan Privasi
                                </Link>
                            </nav>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h4 className="font-semibold mb-4 text-foreground uppercase tracking-wider text-sm">
                                Media Sosial
                            </h4>
                            <div className="flex gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    asChild
                                >
                                    <a 
                                        href="#" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        aria-label="Facebook"
                                    >
                                        <Facebook className="h-6 w-6" />
                                    </a>
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    asChild
                                >
                                    <a 
                                        href="#" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        aria-label="Instagram"
                                    >
                                        <Instagram className="h-6 w-6" />
                                    </a>
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    asChild
                                >
                                    <a 
                                        href="#" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        aria-label="WhatsApp"
                                    >
                                        <MessageCircle className="h-6 w-6" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Copyright */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                     © {new Date().getFullYear()} by Bimbel Master
                    </p>
                </div>
            </div>
        </footer>
    );
}