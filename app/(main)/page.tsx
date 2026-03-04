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
import { motion } from 'framer-motion';
import { TestimonialWithImage } from '@/types/testimonial';

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
  supportersSubtitle?: StyledTextData | string;
  supporters?: Array<{ _key: string; name: string; logo: any }>;
  featuresSubtitle?: StyledTextData | string;
  featuresList?: Array<{ _key: string; label: string; icon: string }>;
  productsSubtitle?: StyledTextData | string;
  productsTitle?: StyledTextData | string;
  productsDescription?: string;
  whySubtitle?: StyledTextData | string;
  whyTitle?: StyledTextData | string;
  whyDescription?: string;
  whyList?: Array<{ _key: string; title: string; description: string; icon: string }>;
  testimonialsSubtitle?: StyledTextData | string;
  testimonialsTitle?: StyledTextData | string;
  testimonialsDescription?: string;
  ctaSubtitle?: StyledTextData | string;
  ctaTitle?: StyledTextData | string;
  ctaDescription?: string;
  ctaButtons?: Array<{ _key: string; label: string; url: string; style: string }>;
}
interface Product {
  _id: string; title: string; category: string; shortDescription: string;
  price: number; originalPrice?: number;
  featuredImage: { asset: any; alt?: string };
  duration?: string; targetAudience?: string;
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
  supportersSubtitle, supporters[]{ _key, name, logo },
  featuresSubtitle, featuresList[]{ _key, label, icon },
  productsSubtitle, productsTitle, productsDescription,
  whySubtitle, whyTitle, whyDescription, whyList[]{ _key, title, description, icon },
  testimonialsSubtitle, testimonialsTitle, testimonialsDescription,
  ctaSubtitle, ctaTitle, ctaDescription, ctaButtons[]{ _key, label, url, style }
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
  { Icon: BookOpen,      label: 'Bimbingan Privat', bg: 'var(--primary)', color: 'var(--primary-foreground)' },
  { Icon: Target,        label: 'Try Out Rutin',    bg: 'var(--secondary)', color: 'var(--secondary-foreground)' },
  { Icon: GraduationCap, label: 'Akses Materi',     bg: 'var(--primary)', color: 'var(--primary-foreground)' },
  { Icon: Zap,           label: 'Konsultasi Guru',  bg: 'var(--secondary)', color: 'var(--secondary-foreground)' },
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
              className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.4)' }}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextHero}
              className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.4)' }}
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-white" />
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
          FIRST GROUP (Logos, Features, Products)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden">
        <div className="relative z-10 w-full">
          {/* ══════════════════════════════════════════════════════════════
              2.  LOGO STRIP  —  greyscale on white
          ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-8 border-y border-border/50"
          >
            <StyledText
              as="p"
              data={landing?.supportersSubtitle || "Alumni kami diterima di"}
              wrapperClass="text-center text-[10px] font-bold tracking-widest mb-5 uppercase text-foreground/50"
            />
            <div
              className="flex items-center animate-infinite-scroll"
              style={{ animationDuration: '30s', width: 'max-content', gap: '4rem' }}
            >
              {[...Array(3)].flatMap((_, rep) => {
                const logs = landing?.supporters?.length ? landing.supporters : STATIC_LOGOS;
                return logs.map((logo: any, idx) => (
                  <div key={`${rep}-${logo._key || idx}`} className="flex-shrink-0 flex items-center justify-center" style={{ height: 48 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo.logo?.asset ? urlForImage(logo.logo).width(200).url() : logo.src} alt={logo.name} style={{ maxWidth: '100%', height: '100%', objectFit: 'contain', opacity: 0.55, filter: 'grayscale(1)' }} />
                  </div>
                ));
              })}
            </div>
          </motion.section>

      {/* ══════════════════════════════════════════════════════════════
          3.  FEATURE STRIP  —  “Fitur Prioritas”
      ══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="py-14"
      >
        <div className="container mx-auto px-6">
          <StyledText
            as="p"
            data={landing?.featuresSubtitle || "Fitur Prioritas"}
            wrapperClass="text-center text-[10px] font-bold tracking-widest uppercase mb-8 text-foreground/50"
          />
          <div className="flex flex-wrap justify-center gap-4">
            {(landing?.featuresList?.length ? landing.featuresList : FEATURES as any).map((f: any, i: number) => {
              const DynamicIcon = getIcon(f.icon?.trim()) || BookOpen;
              const bgColor = FEATURES[i % FEATURES.length]?.bg || 'var(--primary)';
              const color = FEATURES[i % FEATURES.length]?.color || 'var(--primary-foreground)';
              return (
                <div key={f._key || i} className="flex items-center gap-3 px-6 py-4 rounded-full shadow-sm hover:shadow-md transition-shadow" style={{ background: bgColor, minWidth: 190 }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white/20">
                    <DynamicIcon className="w-5 h-5" style={{ color }} />
                  </div>
                  <span className="font-semibold text-sm" style={{ color }}>{f.label}</span>
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
            <StyledText as="p" data={landing?.productsSubtitle || "Program Kami"} wrapperClass="text-xs font-bold tracking-widest uppercase text-secondary" />
            <StyledText
              as="h2"
              data={landing?.productsTitle || { text: 'Program Spesialisasi', highlightText: 'Eksklusif', highlightColor: 'text-primary' }}
              wrapperClass="font-sans font-extrabold text-4xl md:text-5xl text-foreground"
            />
            <p className="text-lg max-w-xl mx-auto text-foreground/70">
              {landing?.productsDescription || "Dirancang khusus untuk membantu siswa Indonesia meraih hasil terbaik dalam ujian dan seleksi masuk."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => {
              const pal = CARD_PALETTES[i % CARD_PALETTES.length];
              return (
                <div key={p._id} className={`group rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col ${pal.bg}`}>
                  {p.featuredImage?.asset && (
                    <div className="relative h-48 overflow-hidden rounded-t-[2rem]">
                      <Image src={urlForImage(p.featuredImage).width(500).height(300).url()} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-8 flex flex-col flex-1 gap-4">
                    <span className={`inline-block self-start px-3 py-1 text-xs font-bold rounded-full shadow-sm ${pal.badge} text-foreground`}>
                      {getCategoryLabel(p.category)}
                    </span>
                    <h3 className="font-sans font-bold text-xl leading-snug text-foreground group-hover:text-primary transition-colors">{p.title}</h3>
                    {p.shortDescription && (
                      <p className="text-sm line-clamp-2 text-foreground/70">{p.shortDescription}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs font-medium text-foreground/60">
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" style={{ color: pal.iconColor }} /> 1.200+ Siswa</span>
                      {p.duration && <span className="flex items-center gap-1"><Clock className="w-4 h-4" style={{ color: pal.iconColor }} /> {p.duration}</span>}
                    </div>
                    <div className="flex items-center justify-between pt-6 mt-auto border-t border-foreground/10">
                      <div>
                        {p.originalPrice && <span className="block text-xs line-through text-foreground/40">{formatPrice(p.originalPrice)}</span>}
                        <span className="font-bold text-xl" style={{ color: pal.iconColor }}>{formatPrice(p.price)}</span>
                      </div>
                      <Link href={`/pembayaran?product_id=${p._id}`} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/60 hover:bg-white transition-all shadow-sm" style={{ color: pal.iconColor }}>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
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
            <StyledText as="p" data={landing?.whySubtitle || "Kenapa Kami?"} wrapperClass="text-xs font-bold tracking-widest uppercase text-secondary" />
            <StyledText as="h2" data={landing?.whyTitle || { text: 'Kenapa', highlightText: 'Bimbel Master?' }} wrapperClass="font-sans font-extrabold text-4xl md:text-5xl text-foreground" />
            <p className="text-lg max-w-xl mx-auto text-foreground/70">
              {landing?.whyDescription || "Kombinasi pendekatan tradisional dan teknologi modern untuk pengalaman belajar yang optimal."}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {(landing?.whyList?.length ? landing.whyList : WHY_ITEMS as any).map((item: any, i: number) => {
              const DynamicIcon = getIcon(item.icon?.trim()) || BookOpen;
              const bg = item.bg || WHY_ITEMS[i % WHY_ITEMS.length].bg;
              const iconColor = item.iconColor || WHY_ITEMS[i % WHY_ITEMS.length].iconColor;
              return (
                <div key={item._key || i} className={`p-10 rounded-[2.5rem] space-y-5 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 ${bg}`}>
                  <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center bg-white/60">
                    <DynamicIcon className="w-8 h-8" style={{ color: iconColor }} />
                  </div>
                  <h4 className="font-sans font-bold text-xl text-foreground">{item.title}</h4>
                  <p className="text-sm leading-relaxed text-foreground/70">{item.desc || item.description}</p>
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
                <TestimonialGrid testimonials={testimonials.map(t => ({
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
          <StyledText as="p" data={landing?.ctaSubtitle || "Tanya Dulu Biar Yakin!"} wrapperClass="text-[10px] font-bold tracking-widest uppercase text-secondary" />
          <StyledText as="h2" data={landing?.ctaTitle || "Siap Mulai Perjalanan Belajarmu?"} wrapperClass="font-sans font-extrabold text-4xl md:text-5xl leading-tight text-foreground" />
          <p className="text-lg text-foreground/80">
            {landing?.ctaDescription || "Bergabunglah dengan 1.200+ siswa yang telah mempercayakan bimbingan mereka kepada kami."}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {landing?.ctaButtons?.length ? landing.ctaButtons.map((btn) => (
              <Link key={btn._key} href={btn.url || "#"} className={btn.style === 'outline' ? "inline-flex items-center gap-2 border-2 border-primary/30 rounded-full px-8 py-4 font-bold text-primary hover:bg-primary/10 transition-all" : "inline-flex items-center gap-2 bg-primary rounded-full px-8 py-4 font-bold text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-md"}>
                {btn.label} {btn.style !== 'outline' && <ArrowRight className="w-5 h-5" />}
              </Link>
            )) : (
              <>
                <Link href="/product" className="inline-flex items-center gap-2 bg-primary rounded-full px-8 py-4 font-bold text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-md">
                  Daftar Sekarang <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/about" className="inline-flex items-center gap-2 border-2 border-primary/30 rounded-full px-8 py-4 font-bold text-primary hover:bg-primary/10 transition-all">
                  Pelajari Lebih
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.section>
        </div>
      </section>

    </main>
  );
}