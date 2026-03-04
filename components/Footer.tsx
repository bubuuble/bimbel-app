'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const menuLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/product', label: 'Produk' },
    { href: '/about', label: 'Tentang Kami' },
    { href: '/privacy', label: 'Kebijakan Privasi' },
  ];

  const socialLinks = [
    { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
    { href: 'https://wa.me/', icon: MessageCircle, label: 'WhatsApp' },
  ];

  return (
    <footer className="text-foreground border-t border-primary/10">
      <div className="container mx-auto px-6 pt-16 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-14">

          {/* Column 1: Brand */}
          <div className="space-y-5 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-primary/20">
                <Image src="/image/logo/logo1.png" alt="Logo" width={36} height={36} className="opacity-90" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-extrabold text-lg leading-tight text-foreground">
                  Bimbel<span className="text-secondary">Master</span>
                </span>
                <span className="font-sans text-[10px] tracking-widest uppercase text-foreground/60 font-semibold">
                  Get The Simple Learning
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-foreground/70">
              Platform bimbingan belajar terpercaya untuk membantu siswa meraih impian masuk sekolah favorit.
            </p>
          </div>

          {/* Column 2: Kantor Pusat */}
          <div className="md:col-span-1">
            <h4 className="font-sans font-bold text-base mb-5 text-primary">Kantor Pusat</h4>
            <div className="font-sans text-sm space-y-1.5 leading-relaxed text-foreground/70">
              <p>Jl. Agus Salim No 30 A-B</p>
              <p>Sawahan</p>
              <p>Padang, Sumatera Barat</p>
            </div>
          </div>

          {/* Column 3: Menu */}
          <div className="md:col-span-1">
            <h4 className="font-sans font-bold text-base mb-5 text-primary">Menu</h4>
            <ul className="space-y-3 font-sans text-sm text-foreground/70">
              {menuLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Media Sosial */}
          <div className="md:col-span-1">
            <h4 className="font-sans font-bold text-base mb-5 text-primary">Media Sosial</h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground hover:scale-110 shadow-sm"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-primary/10 mt-4">
          <p className="font-sans text-xs text-foreground/50">
            &copy; {currentYear} Bimbel Master. All rights reserved.
          </p>
          <div className="flex gap-4 font-sans text-xs text-foreground/50">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privasi</Link>
            <Link href="/about" className="hover:text-primary transition-colors">Tentang</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
