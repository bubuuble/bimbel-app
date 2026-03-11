'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, ArrowRight,
  Star, BookOpen, Users, Award, UserCheck,
  GraduationCap, Zap, Target, Clock, MessageCircle,
  CheckCircle, Globe, Shield, TrendingUp, Heart
} from 'lucide-react';

const IconMap: Record<string, any> = {
  BookOpen, Users, Award, UserCheck, GraduationCap, Zap, Target, CheckCircle, Globe, Shield, TrendingUp, Heart
};
const getIcon = (name?: string) => IconMap[name as keyof typeof IconMap] || Star;
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { urlForImage } from '@/sanity/lib/image';
import TestimonialGrid from '@/components/TestimonialGrid';
import ProductGrid from '@/components/ProductGrid';
import { motion } from 'framer-motion';
import { TestimonialWithImage } from '@/types/testimonial';
import { Product } from '@/types/product';

/* --- Types --- */
interface StyledTextData {
  text?: string;
  highlightText?: string;
  highlightColor?: string;
  fontSize?: string;
  fontFamily?: string;
  highlightPosition?: 'start' | 'end';
}

interface LandingData {
  heroTitle?: StyledTextData | string;
  heroDescription?: string;
  heroImages: Array<{ asset: any; alt?: string }>;
  productsSubtitle?: StyledTextData | string;
  productsTitle?: StyledTextData | string;
  productsDescription?: string;
  testimonialsSubtitle?: StyledTextData | string;
  testimonialsTitle?: StyledTextData | string;
  testimonialsDescription?: string;
}

interface Testimonial {
  _id: string; _type?: "testimonial"; name: string; testimonial: string;
  image?: { asset: any; alt?: string };
  school?: string; program?: string; rating?: number;
  featured?: boolean; publishedAt?: string;
}

/* --- Queries --- */
const LANDING_QUERY = groq`*[_type == "landingPage"][0]{
  heroTitle, heroDescription,
  heroImages[]{ asset, alt },
  productsSubtitle, productsTitle, productsDescription,
  testimonialsSubtitle, testimonialsTitle, testimonialsDescription
}`;
const PRODUCTS_QUERY = groq`*[_type == "product" && featured == true] | order(order asc) [0..5]{
  _id, title, category, shortDescription, price, originalPrice,
  featuredImage{ asset, alt }, duration, targetAudience
}`;
const TESTIMONIALS_QUERY = groq`*[_type == "testimonial" && featured == true][0..5]{
  _id, _type, name, testimonial, image{ asset, alt }, school, program, rating, featured, publishedAt
}`;

/* ─────────── Static logos ─────────── */
const STATIC_LOGOS = [
  { name: 'Universitas Indonesia',      src: '/image/supporters/ui.png',   w: 120 },
  { name: 'Institut Teknologi Bandung', src: '/image/supporters/itb.png',  w: 120 },
  { name: 'Universitas Brawijaya',      src: '/image/supporters/braw.png', w: 120 },
  { name: 'Universitas Gadjah Mada',    src: '/image/supporters/ugm1.png', w: 120 },
];

/* ─────────── Feature strip ─────────── */
const FEATURES = [
  { Icon: Star,          label: 'Metode Belajar Terbaik',                bg: 'var(--primary)', color: 'var(--primary-foreground)' },
  { Icon: Users,         label: 'Pengajar 100% Alumni UI & PTN Favorit', bg: 'var(--secondary)', color: 'var(--secondary-foreground)' },
  { Icon: Target,        label: 'Try-Out Rutin Basis Komputer',               bg: 'var(--primary)', color: 'var(--primary-foreground)' },
  { Icon: Zap,           label: 'Cara Termudah & Tercepat',              bg: 'var(--secondary)', color: 'var(--secondary-foreground)' },
  { Icon: BookOpen,      label: 'Modul Lengkap, Sistematis & Prediktif', bg: 'var(--primary)', color: 'var(--primary-foreground)' },
  { Icon: Award,         label: 'Harga Termurah & Kualitas Terbaik',     bg: 'var(--secondary)', color: 'var(--secondary-foreground)' },
];

/* ─────────── Why cards ─────────── */
const WHY_ITEMS = [
  {
    Icon: BookOpen,
    title: 'Kurikulum Adaptif',
    desc:  'Materi disesuaikan dengan kemampuan dan kecepatan belajar setiap siswa secara individual.',
    bg: 'bg-blue-100', iconColor: '#1D4ED8',
  },
  {
    Icon: Users,
    title: 'Mentor Terpilih',
    desc:  'Instruktur bersertifikat dengan track record mengajar yang terbukti di berbagai institusi pendidikan terkemuka.',
    bg: 'bg-rose-300', iconColor: '#BE123C',
  },
  {
    Icon: Award,
    title: 'Hasil Terukur',
    desc:  'Sistem evaluasi komprehensif dengan laporan progres real-time untuk memantau perkembangan belajar.',
    bg: 'bg-violet-100', iconColor: '#6D28D9',
  },
];

/* ─────────── Product card palettes ─────────── */
const CARD_PALETTES = [
  { bg: 'bg-blue-100',   badge: 'bg-blue-200',   iconColor: '#1D4ED8' },
  { bg: 'bg-rose-300',   badge: 'bg-rose-200',   iconColor: '#BE123C' },
  { bg: 'bg-violet-100', badge: 'bg-violet-200', iconColor: '#6D28D9' },
  { bg: 'bg-emerald-100',badge: 'bg-emerald-200',iconColor: '#065F46' },
];

function StyledText({ data, defaultClass = "", as: Component = "span", wrapperClass = "" }: { data?: StyledTextData | string, defaultClass?: string, as?: any, wrapperClass?: string }) {
  if (!data) return null;
  if (typeof data === 'string') return <Component className={wrapperClass}>{data}</Component>;
  const { text, highlightText, highlightColor, fontSize, fontFamily, highlightPosition = 'end' } = data;
  const isHex = highlightColor?.startsWith('#');
  const colorClass = isHex ? '' : (highlightColor || 'text-primary');
  const styleObj = isHex ? { color: highlightColor } : {};
  const highlightCls = `${colorClass} ${fontSize || ''} ${fontFamily || ''}`.trim();
  return (
    <Component className={wrapperClass}>
      {highlightPosition === 'start' && highlightText && <span className={highlightCls} style={styleObj}>{highlightText} </span>}
      {text && <span className={defaultClass}>{text}</span>}
      {highlightPosition === 'end' && highlightText && <span className={highlightCls} style={styleObj}> {highlightText}</span>}
    </Component>
  );
}

/* --- useInView hook --- */
function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold, rootMargin: '80px 0px' }
    );
    obs.observe(el);
    return () => { obs.disconnect(); };
  }, [threshold]);
  return { ref, inView };
}

export default function HomePage() {
  const [landing, setLanding]         = useState<LandingData | null>(null);
  const [products, setProducts]       = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading]         = useState(true);
  const [heroIndex, setHeroIndex]     = useState(0);

  useEffect(() => {
    Promise.all([
      client.fetch(LANDING_QUERY),
      client.fetch(PRODUCTS_QUERY),
      client.fetch(TESTIMONIALS_QUERY),
    ]).then(([l, p, t]) => {
      setLanding(l);
      setProducts(p || []);
      setTestimonials(t || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const heroImages = (landing?.heroImages ?? []).map(img => ({
    src: urlForImage(img).width(1920).height(1080).url(),
    alt: img.alt || 'Hero',
  }));

  const nextHero = useCallback(() => {
    if (heroImages.length > 1) setHeroIndex(p => (p + 1) % heroImages.length);
  }, [heroImages.length]);

  const prevHero = useCallback(() => {
    if (heroImages.length > 1) setHeroIndex(p => (p - 1 + heroImages.length) % heroImages.length);
  }, [heroImages.length]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const t = setTimeout(nextHero, 5000);
    return () => clearTimeout(t);
  }, [heroIndex, heroImages.length, nextHero]);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(p);

  const getCategoryLabel = (cat: string) =>
    ({ online: 'Online', private: 'Private', regular: 'Regular', responsive: 'Responsive' }[cat] ?? cat);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return (
    <main className="overflow-x-hidden font-sans text-foreground">

      {/* ══════════════════════════════════════════════════════════════
          1.  HERO  —  Full-image carousel, no text
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden w-full aspect-video md:aspect-auto md:h-[100svh] md:min-h-[560px]">

        {/* Slides */}
        {heroImages.length > 0
          ? heroImages.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: i === heroIndex ? 1 : 0, zIndex: i === heroIndex ? 1 : 0 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ))
          : <div className="absolute inset-0" style={{ background: '#C3D4FF' }} />
        }

        {/* Prev / Next arrows */}
        {heroImages.length > 1 && (
          <>
            <button
              onClick={prevHero}
              className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.4)' }}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </button>
            <button
              onClick={nextHero}
              className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.4)' }}
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width:  i === heroIndex ? 28 : 8,
                  height: 8,
                  background: i === heroIndex ? '#E84040' : 'rgba(255,255,255,0.5)',
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════════
          1.5  LEAD CAPTURE  —  CTA singkat + email form
      ══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="py-2 md:py-7"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center gap-3 md:gap-6 max-w-5xl mx-auto">

            {/* Headline + description */}
            <h2 className="font-extrabold text-2xl md:text-6xl leading-tight text-foreground drop-shadow-sm">
              Sudah Ikut Bimbel Tapi Masih Belum Ngerti?
              <br />
              <span className="text-secondary/80 drop-shadow-md text-3xl md:text-7xl">
                Master Solusinya!
              </span>
            </h2>
            <p className="text-foreground/60 text-xs md:text-lg leading-relaxed max-w-3xl">
              Belajar lebih mudah dengan metode <span className="font-semibold text-foreground/80 italic">The Simple Learning</span>, dibimbing tutor berpengalaman alumni UI & PTN favorit untuk meningkatkan nilai dan tembus PTN impian.
            </p>

            {/* Email form */}
            <form
              className="w-full max-w-xl"
              onSubmit={(e) => {
                e.preventDefault();
                const email = (e.currentTarget.elements[0] as HTMLInputElement).value;
                window.location.href = `/register?email=${encodeURIComponent(email)}`;
              }}
            >
              <div className="flex items-center bg-white rounded-full border border-border/40 shadow-sm p-1.5">
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  required
                  className="flex-1 px-4 py-2 bg-transparent text-foreground placeholder:text-foreground/40 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary/90 hover:scale-105 transition-all shadow-md whitespace-nowrap"
                >
                  Mulai Sekarang
                </button>
              </div>
            </form>

            {/* Trust badge */}
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500 flex-shrink-0" />
              <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-foreground/50">
                Konsultasi Gratis
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════════
          FIRST GROUP (Logos, Features, Products)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden">
        <div className="relative z-10 w-full">
          {/* ══════════════════════════════════════════════════════════════
              2.  LOGO STRIP  —  colored
          ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-4 border-y border-border/50"
          >
            <StyledText
              as="p"
              data={"Alumni kami diterima di"}
              wrapperClass="text-center text-[10px] font-bold tracking-widest mb-5 uppercase text-foreground/50"
            />
            <div
              className="flex items-center animate-infinite-scroll hover:[animation-play-state:paused]"
              style={{ animationDuration: '60s', width: 'max-content', gap: '2.5rem' }}
            >
              {[...Array(10)].flatMap((_, rep) => {
                const logs = STATIC_LOGOS;
                return logs.map((logo: any, idx) => (
                  <div key={`${rep}-${idx}`} className="flex-shrink-0 flex items-center justify-center" style={{ height: 48 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo.src} alt={logo.name} style={{ maxWidth: '100%', height: '100%', objectFit: 'contain', opacity: 1 }} />
                  </div>
                ));
              })}
            </div>
          </motion.section>

      {/* ══════════════════════════════════════════════════════════════
          3.  FEATURE STRIP  —  "Fitur Prioritas"
      ══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="py-8"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
            Keunggulan Master
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto">
            {FEATURES.map((f: any, i: number) => {
              // Definisi icon yang lebih sesuai
              const iconMap: Record<number, any> = {
                0: UserCheck,      // Metode Belajar Terbaik
                1: Target,         // Pengajar Alumni
                2: BookOpen,       // Try-Out Rutin
                3: Zap,            // Cara Termudah
                4: BookOpen,       // Modul Lengkap
                5: Award,          // Harga Termurah
              };
              
              const DynamicIcon = iconMap[i] || f.Icon || getIcon(f.icon?.trim()) || BookOpen;
              
              // Warna pastel lembut
              const colorSchemes = [
                { bg: '#FFF8E8', color: '#B8934A', iconBg: 'rgba(184, 147, 74, 0.10)' },
                { bg: '#E8F8F3', color: '#5BA08A', iconBg: 'rgba(91, 160, 138, 0.10)' },
                { bg: '#FEF0EE', color: '#D4806A', iconBg: 'rgba(212, 128, 106, 0.10)' },
                { bg: '#E8F4F8', color: '#4A8FA8', iconBg: 'rgba(74, 143, 168, 0.10)' },
                { bg: '#EBF4FF', color: '#5B8FC4', iconBg: 'rgba(91, 143, 196, 0.10)' },
                { bg: '#F3EEFF', color: '#9B7EC8', iconBg: 'rgba(155, 126, 200, 0.10)' },
              ];
              
              const scheme = colorSchemes[i % colorSchemes.length];
              
              return (
                <div 
                  key={f._key || i} 
                  className="flex items-center gap-3 md:gap-4 p-3.5 md:p-6 rounded-2xl md:rounded-3xl transition-all hover:-translate-y-1" 
                  style={{ backgroundColor: scheme.bg, boxShadow: '0 4px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)' }}
                >
                  <div 
                    className="w-9 h-9 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: scheme.iconBg, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                  >
                    <DynamicIcon className="w-4 h-4 md:w-7 md:h-7" style={{ color: scheme.color }} />
                  </div>
                  <span className="font-bold text-xs md:text-lg leading-snug" style={{ color: scheme.color }}>
                    {f.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════════
          4.  PRODUCTS  —  “Program Spesialisasi Eksklusif”
      ══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-20"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 space-y-3">
            <StyledText
              as="h2"
              data={landing?.productsTitle || { text: 'Program', highlightText: 'Eksklusif', highlightColor: 'text-primary' }}
              wrapperClass="font-sans font-extrabold text-4xl md:text-5xl text-foreground"
            />
            <p className="text-lg max-w-xl mx-auto text-foreground/70">
              {landing?.productsDescription || "Dirancang khusus untuk membantu siswa Indonesia meraih hasil terbaik dalam ujian dan seleksi masuk."}
            </p>
          </div>

          <div className="mt-8">
            <ProductGrid 
              products={products} 
              viewMode="grid" 
              selectedCategory="all" 
              onProductClick={(p) => { 
                window.location.href = `/product`; 
              }} 
            />
          </div>

          <div className="text-center mt-12">
            <Link href="/product" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold border-2 border-primary/30 text-primary hover:bg-primary/10 transition-all">
              Lihat Semua Program <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.section>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECOND GROUP (Why Us, Testimonials, CTA)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden">
        <div className="relative z-10 w-full">
          {/* ══════════════════════════════════════════════════════════════
              5.  WHY BIMBEL MASTER  —  light cards on white
          ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-20"
          >
            <div className="container mx-auto px-6">
          <div className="text-center mb-14 space-y-3">
            <StyledText as="p" data={"Kenapa Kami?"} wrapperClass="text-xs font-bold tracking-widest uppercase text-secondary" />
            <StyledText as="h2" data={{ text: 'Kenapa', highlightText: 'Bimbel Master?' }} wrapperClass="font-sans font-extrabold text-4xl md:text-5xl text-foreground" />
            <p className="text-lg max-w-xl mx-auto text-foreground/70">
              Kombinasi pendekatan tradisional dan teknologi modern untuk pengalaman belajar yang optimal.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {WHY_ITEMS.map((item: any, i: number) => {
              const DynamicIcon = item.Icon || getIcon(item.icon?.trim()) || BookOpen;
              const bg = item.bg || WHY_ITEMS[i % WHY_ITEMS.length].bg;
              const iconColor = item.iconColor || WHY_ITEMS[i % WHY_ITEMS.length].iconColor;
              return (
                <div key={i} className={`p-5 md:p-10 rounded-[1.75rem] md:rounded-[2.5rem] space-y-3 md:space-y-5 hover:scale-[1.02] transition-all duration-300 ${bg}`} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.25rem] flex items-center justify-center bg-white/60">
                    <DynamicIcon className="w-5 h-5 md:w-8 md:h-8" style={{ color: iconColor }} />
                  </div>
                  <h4 className="font-sans font-bold text-base md:text-xl text-foreground">{item.title}</h4>
                  <p className="text-xs md:text-sm leading-relaxed text-foreground/70">{item.desc || item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
          </motion.section>

      {/* ══════════════════════════════════════════════════════════════
          7.  TESTIMONIALS  —  chat-bubble style
      ══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-20"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 space-y-3">
            <StyledText as="p" data={landing?.testimonialsSubtitle || "Testimoni Nyata"} wrapperClass="text-xs font-bold tracking-widest uppercase text-secondary" />
            <StyledText as="h2" data={landing?.testimonialsTitle || { text: 'Bukan Sekadar Testimoni, Tapi', highlightText: 'Bukti Nyata' }} wrapperClass="font-sans font-extrabold text-4xl md:text-5xl text-foreground" />
            <p className="text-lg max-w-xl mx-auto text-foreground/70">
              {landing?.testimonialsDescription || "Cerita sukses dari siswa-siswa terbaik kami."}
            </p>
          </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <TestimonialGrid tilted testimonials={testimonials.map(t => ({
                  ...t,
                  imageUrl: t.image ? urlForImage(t.image).width(400).url() : undefined,
                  imageAlt: t.image?.alt || t.name,
                  _type: t._type || "testimonial",
                  featured: t.featured || false,
                  publishedAt: t.publishedAt || new Date().toISOString(),
                  rating: t.rating || 5
                }))} />
              </div>
            </div>

          <div className="text-center mt-10">
            <Link href="/testimoni" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline text-primary">
              Lihat Semua Testimoni <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════════
          8.  CTA BANNER
      ══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative py-24 mx-4 sm:mx-8 mb-16 rounded-[3rem] text-foreground text-center overflow-hidden bg-gradient-to-br from-blue-100/90 via-rose-100/90 to-amber-100/90 shadow-xl shadow-primary/5 backdrop-blur-sm"
      >
        <div className="absolute top-[-70px] left-[-70px] z-0 w-72 h-72 rounded-full pointer-events-none bg-white/40" />
        <div className="absolute bottom-[-70px] right-[-70px] w-80 h-80 rounded-full pointer-events-none bg-white/40" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 space-y-8">
          <StyledText as="p" data={"Tanya Dulu Biar Yakin!"} wrapperClass="text-[10px] font-bold tracking-widest uppercase text-secondary" />
          <StyledText as="h2" data={"Siap Mulai Perjalanan Belajarmu?"} wrapperClass="font-sans font-extrabold text-4xl md:text-5xl leading-tight text-foreground" />
          <p className="text-lg text-foreground/80">
            Bergabunglah dengan 1.200+ siswa yang telah mempercayakan bimbingan mereka kepada kami.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <>
              <Link href="/product" className="inline-flex items-center gap-2 bg-primary rounded-full px-8 py-4 font-bold text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-md">
                Daftar Sekarang <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/about" className="inline-flex items-center gap-2 border-2 border-primary/30 rounded-full px-8 py-4 font-bold text-primary hover:bg-primary/10 transition-all">
                Pelajari Lebih
              </Link>
            </>
          </div>
        </div>
      </motion.section>
        </div>
      </section>

    </main>
  );
}