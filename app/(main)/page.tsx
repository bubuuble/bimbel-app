"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  BookOpen,
  Users,
  Award,
  UserCheck,
  GraduationCap,
  Zap,
  Target,
  Clock,
  MessageCircle,
  CheckCircle,
  Globe,
  Shield,
  TrendingUp,
  Heart,
  AlertCircle,
  X,
} from "lucide-react";

const IconMap: Record<string, any> = {
  BookOpen,
  Users,
  Award,
  UserCheck,
  GraduationCap,
  Zap,
  Target,
  CheckCircle,
  Globe,
  Shield,
  TrendingUp,
  Heart,
};
const getIcon = (name?: string) =>
  IconMap[name as keyof typeof IconMap] || Star;
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";
import TestimonialGrid from "@/components/TestimonialGrid";
import ProductGrid from "@/components/ProductGrid";
import { motion } from "framer-motion";
import { TestimonialWithImage } from "@/types/testimonial";
import { Product } from "@/types/product";

/* --- Types --- */
interface StyledTextData {
  text?: string;
  highlightText?: string;
  highlightColor?: string;
  fontSize?: string;
  fontFamily?: string;
  highlightPosition?: "start" | "end";
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
  _id: string;
  _type?: "testimonial";
  name: string;
  testimonial: string;
  image?: { asset: any; alt?: string };
  school?: string;
  program?: string;
  rating?: number;
  featured?: boolean;
  publishedAt?: string;
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
const PRESTASI_QUERY = groq`*[_type == "prestasiSiswa" && featured == true][0..5]{
  _id, _type, name, achievementTitle, universityAccepted, competitionWon, description, image{ asset, alt }, school, program, year, featured, publishedAt
}`;

/* ─────────── Static logos ─────────── */
const STATIC_LOGOS = [
  { name: "Universitas Gadjah Mada", src: "/image/supporters/ugm.png", w: 120 },
  { name: "Universitas Indonesia", src: "/image/supporters/ui.png", w: 120 },
  {
    name: "Institut Teknologi Bandung",
    src: "/image/supporters/itb.png",
    w: 120,
  },
  { name: "IPB University", src: "/image/supporters/ipb.png", w: 120 },
  {
    name: "Universitas Padjadjaran",
    src: "/image/supporters/unpad.png",
    w: 120,
  },
  {
    name: "Universitas Hasanuddin",
    src: "/image/supporters/Unhas.png",
    w: 120,
  },
  { name: "Universitas Airlangga", src: "/image/supporters/unair.png", w: 120 },
  { name: "Universitas Brawijaya", src: "/image/supporters/braw.png", w: 120 },
  {
    name: "Universitas Diponegoro",
    src: "/image/supporters/undip.png",
    w: 120,
  },
  {
    name: "Institut Teknologi Sepuluh Nopember",
    src: "/image/supporters/its.png",
    w: 120,
  },
];

/* ─────────── Feature strip ─────────── */
const FEATURES = [
  {
    Icon: Star,
    label: "Metode Belajar Terbaik",
    bg: "var(--primary)",
    color: "var(--primary-foreground)",
  },
  {
    Icon: Users,
    label: "Pengajar 100% Alumni UI & PTN Favorit",
    bg: "var(--secondary)",
    color: "var(--secondary-foreground)",
  },
  {
    Icon: Target,
    label: "Try-Out Rutin Basis Komputer",
    bg: "var(--primary)",
    color: "var(--primary-foreground)",
  },
  {
    Icon: Zap,
    label: "Cara Termudah & Tercepat",
    bg: "var(--secondary)",
    color: "var(--secondary-foreground)",
  },
  {
    Icon: BookOpen,
    label: "Modul Lengkap, Sistematis & Prediktif",
    bg: "var(--primary)",
    color: "var(--primary-foreground)",
  },
  {
    Icon: Award,
    label: "Harga Termurah & Kualitas Terbaik",
    bg: "var(--secondary)",
    color: "var(--secondary-foreground)",
  },
];

/* ─────────── Facility images ─────────── */
const FACILITY_IMAGES = [
  {
    src: "/image/reference/1.jpeg",
    alt: "Kelas Tatap Muka",
  },
  {
    src: "/image/reference/2.jpeg",
    alt: "Ruang Belajar A",
  },
  {
    src: "/image/reference/3.jpeg",
    alt: "Lounge Siswa",
  },
  {
    src: "/image/reference/4.jpeg",
    alt: "Ruang Konsultasi",
  },
];

/* ─────────── Why cards ─────────── */
const WHY_ITEMS = [
  {
    Icon: BookOpen,
    title: "Kurikulum Adaptif",
    desc: "Materi disesuaikan dengan kemampuan dan kecepatan belajar setiap siswa secara individual.",
    bg: "bg-blue-100",
    iconColor: "#1D4ED8",
  },
  {
    Icon: Users,
    title: "Mentor Terpilih",
    desc: "Instruktur bersertifikat dengan track record mengajar yang terbukti di berbagai institusi pendidikan terkemuka.",
    bg: "bg-rose-300",
    iconColor: "#BE123C",
  },
  {
    Icon: Award,
    title: "Hasil Terukur",
    desc: "Sistem evaluasi komprehensif dengan laporan progres real-time untuk memantau perkembangan belajar.",
    bg: "bg-violet-100",
    iconColor: "#6D28D9",
  },
];

/* ─────────── Product card palettes ─────────── */
const CARD_PALETTES = [
  { bg: "bg-blue-100", badge: "bg-blue-200", iconColor: "#1D4ED8" },
  { bg: "bg-rose-300", badge: "bg-rose-200", iconColor: "#BE123C" },
  { bg: "bg-violet-100", badge: "bg-violet-200", iconColor: "#6D28D9" },
  { bg: "bg-emerald-100", badge: "bg-emerald-200", iconColor: "#065F46" },
];

function StyledText({
  data,
  defaultClass = "",
  as: Component = "span",
  wrapperClass = "",
}: {
  data?: StyledTextData | string;
  defaultClass?: string;
  as?: any;
  wrapperClass?: string;
}) {
  if (!data) return null;
  if (typeof data === "string")
    return <Component className={wrapperClass}>{data}</Component>;
  const {
    text,
    highlightText,
    highlightColor,
    fontSize,
    fontFamily,
    highlightPosition = "end",
  } = data;
  const isHex = highlightColor?.startsWith("#");
  const colorClass = isHex ? "" : highlightColor || "text-primary";
  const styleObj = isHex ? { color: highlightColor } : {};
  const highlightCls =
    `${colorClass} ${fontSize || ""} ${fontFamily || ""}`.trim();
  return (
    <Component className={wrapperClass}>
      {highlightPosition === "start" && highlightText && (
        <span className={highlightCls} style={styleObj}>
          {highlightText}{" "}
        </span>
      )}
      {text && <span className={defaultClass}>{text}</span>}
      {highlightPosition === "end" && highlightText && (
        <span className={highlightCls} style={styleObj}>
          {" "}
          {highlightText}
        </span>
      )}
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "80px 0px" },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
    };
  }, [threshold]);
  return { ref, inView };
}

export default function HomePage() {
  const [landing, setLanding] = useState<LandingData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [prestasi, setPrestasi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [facilityIndex, setFacilityIndex] = useState(0);
  const [thumbOffset, setThumbOffset] = useState(0);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    Promise.all([
      client.fetch(LANDING_QUERY),
      client.fetch(PRODUCTS_QUERY),
      client.fetch(TESTIMONIALS_QUERY),
      client.fetch(PRESTASI_QUERY),
    ])
      .then(([l, p, t, pr]) => {
        setLanding(l);
        setProducts(p || []);
        setTestimonials(t || []);
        setPrestasi(pr || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const heroImages = (landing?.heroImages ?? []).map((img) => ({
    src: urlForImage(img).width(1920).height(1080).url(),
    alt: img.alt || "Hero",
  }));

  const nextHero = useCallback(() => {
    if (heroImages.length > 1) setHeroIndex((p) => (p + 1) % heroImages.length);
  }, [heroImages.length]);

  const prevHero = useCallback(() => {
    if (heroImages.length > 1)
      setHeroIndex((p) => (p - 1 + heroImages.length) % heroImages.length);
  }, [heroImages.length]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const t = setTimeout(nextHero, 5000);
    return () => clearTimeout(t);
  }, [heroIndex, heroImages.length, nextHero]);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(p);

  const getCategoryLabel = (cat: string) =>
    ({
      online: "Online",
      private: "Private",
      regular: "Regular",
      responsive: "Responsive",
    })[cat] ?? cat;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Image
              src="/image/logo/logo1.png"
              alt="Loading"
              width={48}
              height={48}
              className="animate-pulse"
            />
          </div>
          <div className="w-48 h-1.5 rounded-full bg-primary/20 overflow-hidden">
            <div className="h-full rounded-full bg-primary animate-loading-bar" />
          </div>
        </div>
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
        {heroImages.length > 0 ? (
          heroImages.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{
                opacity: i === heroIndex ? 1 : 0,
                zIndex: i === heroIndex ? 1 : 0,
              }}
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
        ) : (
          <div className="absolute inset-0" style={{ background: "#C3D4FF" }} />
        )}

        {/* Prev / Next arrows */}
        {heroImages.length > 1 && (
          <>
            <button
              onClick={prevHero}
              className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.4)",
              }}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </button>
            <button
              onClick={nextHero}
              className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.4)",
              }}
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
                  width: i === heroIndex ? 28 : 8,
                  height: 8,
                  background:
                    i === heroIndex ? "#E84040" : "rgba(255,255,255,0.5)",
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════════
          1.5  LEAD CAPTURE / SECONDARY HERO
      ══════════════════════════════════════════════════════════════ */}
      <>
  <motion.section
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px 0px -60px 0px" }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="relative w-full z-10 overflow-visible"
  >
    {/* Colored Background */}
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-blue-100/90 via-rose-100/90 to-amber-100/90 z-0" />

    {/* Soft floating background blobs */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4 pointer-events-none z-0" />
    <div className="absolute bottom-1/2 left-0 w-[400px] h-[400px] bg-rose-400/20 dark:bg-rose-600/10 rounded-full blur-3xl -translate-x-1/3 pointer-events-none z-0" />

    {/* Hero content — extra pb to make room for overlapping menu */}
    <div className="container mx-auto px-4 sm:px-8 lg:px-12 relative z-30 pt-16 md:pt-24 pb-24 md:pb-28 lg:pb-32 flex flex-col md:flex-row items-center gap-10 md:gap-16">
      
      {/* Left Column: Text & Form */}
      <div className="flex-1 space-y-4 md:space-y-6 text-left w-full z-10 pl-10">
        <h2 className="font-extrabold text-3xl md:text-4xl lg:text-[44px] leading-[1.2] text-foreground drop-shadow-sm max-w-2xl">
          Bimbel Online & Offline Terbesar, Terlengkap, dan Terbukti di Indonesia
        </h2>
        
        <div className="pt-2">
          <form
            className="w-full max-w-lg relative z-20"
            onSubmit={(e) => {
              e.preventDefault();
              if (!phone || phone.length < 9) {
                setPhoneError('ERROR: Cannot read "phone input" (nomor HP harus minimal 9 digit). Mohon periksa kembali.');
                return;
              }
              setPhoneError(null);
              window.open(`https://wa.me/6281282641074?text=Halo%20saya%20tertarik%20dengan%20diskon%20spesial.%20Nomor%20HP:%20%2B62${phone}`);
            }}
          >
            <label className="block text-foreground/90 font-bold text-sm md:text-base mb-3 drop-shadow-sm">
              Diskon spesial untukmu dengan isi nomor HP sekarang
            </label>
            
            <div className="flex items-center bg-white dark:bg-card rounded-full p-1.5 shadow-xl shadow-primary/5 w-full hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border border-border/40">
              <div className="pl-4 pr-3 font-extrabold text-foreground/80 border-r border-border/40">
                +62
              </div>
              <input
                type="tel"
                name="phone"
                id="phone"
                minLength={9}
                maxLength={16}
                placeholder="812xxxx"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError(null);
                }}
                className="flex-1 px-4 py-3 w-full bg-transparent text-foreground placeholder:text-foreground/40 text-sm md:text-base focus:outline-none font-semibold"
              />
              <button
                type="submit"
                className="flex-shrink-0 bg-[#F97316] hover:bg-[#EA580C] text-white px-5 md:px-7 py-3 rounded-full font-bold text-sm md:text-base transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
              >
                Dapatkan Diskon <ArrowRight className="w-4 h-4 hidden sm:block" />
              </button>
            </div>

            {phoneError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 relative"
              >
                <div className="bg-white dark:bg-card border border-red-200 dark:border-red-900 rounded-2xl px-5 py-4 shadow-lg shadow-red-500/5 dark:shadow-red-900/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm leading-relaxed">
                        <span className="font-bold text-red-500">ERROR:</span>{" "}
                        <span className="text-foreground/70">Cannot read</span>{" "}
                        <span className="font-semibold text-foreground bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded">&quot;{phone}&quot;</span>
                      </p>
                      <p className="font-mono text-sm leading-relaxed mt-0.5">
                        <span className="text-foreground/70">(nomor HP harus minimal 9 digit).</span>{" "}
                        <span className="text-foreground font-medium">Mohon periksa kembali.</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setPhoneError(null)}
                      className="text-foreground/30 hover:text-foreground/60 transition-colors flex-shrink-0 mt-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </div>

      {/* Right Column: Dynamic Image */}
      <div className="flex-1 w-full flex justify-center md:justify-end relative z-40 mt-8 md:mt-0 pointer-events-none">
        <picture className="w-full max-w-[320px] md:max-w-[420px] lg:max-w-xl drop-shadow-2xl relative block">
          <source srcSet="https://roboguru-forum-cdn.ruangguru.com/image/faf3c4c1-14cd-45bd-aa59-f8017155be37.png" media="(max-width: 768px)" />
          <img 
            src="https://roboguru-forum-cdn.ruangguru.com/image/c8d6923b-c6f1-4a02-a7ad-b7e9d268b138.png" 
            className="w-full h-auto block relative z-10 hover:scale-[1.03] transition-transform duration-500 ease-out" 
            alt="Student Success" 
            loading="lazy" 
          />
        </picture>
      </div>
    </div>

    {/* ── Action Menu Desktop: absolute di bottom, overlap ke bawah ── */}
    <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 px-6 lg:px-12 z-50 hidden lg:block">
      <div className="container mx-auto">
        <div className="bg-white dark:bg-card rounded-3xl shadow-2xl shadow-black/10 border border-border/50 p-2 flex items-stretch overflow-hidden w-full divide-x divide-border/20">
          
          <Link href="/product" className="group flex-1 flex items-center justify-center py-4 px-2 hover:bg-gray-50 dark:hover:bg-foreground/5 transition-all rounded-l-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <Target className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left leading-tight hidden xl:block">
                <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">Persiapan</p>
                <p className="text-sm font-bold text-foreground">UTBK-SNBT</p>
              </div>
            </div>
          </Link>

          <Link href="/product" className="group flex-1 flex items-center justify-center py-4 px-2 hover:bg-gray-50 dark:hover:bg-foreground/5 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left leading-tight hidden xl:block">
                <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">Bimbel</p>
                <p className="text-sm font-bold text-foreground">Tatap Muka</p>
              </div>
            </div>
          </Link>
          
          <Link href="/product" className="group flex-1 flex items-center justify-center py-4 px-2 hover:bg-gray-50 dark:hover:bg-foreground/5 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="text-left leading-tight hidden xl:block">
                <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">Bimbel Online</p>
                <p className="text-sm font-bold text-foreground">Interaktif</p>
              </div>
            </div>
          </Link>

          <Link href="/product" className="group flex-1 flex items-center justify-center py-4 px-2 hover:bg-gray-50 dark:hover:bg-foreground/5 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <BookOpen className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="text-left leading-tight hidden xl:block">
                <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">Video Belajar</p>
                <p className="text-sm font-bold text-foreground">& Soal</p>
              </div>
            </div>
          </Link>

          <Link href="/product" className="group flex-1 flex items-center justify-center py-4 px-2 hover:bg-gray-50 dark:hover:bg-foreground/5 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-left leading-tight hidden xl:block">
                <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">English</p>
                <p className="text-sm font-bold text-foreground">Academy</p>
              </div>
            </div>
          </Link>

          <Link href="/product" className="group flex-1 flex items-center justify-center py-4 px-2 hover:bg-gray-50 dark:hover:bg-foreground/5 transition-all rounded-r-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="text-left leading-tight hidden xl:block">
                <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">Semua</p>
                <p className="text-sm font-bold text-foreground">Program</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </motion.section>

  {/* Spacer desktop: dorong konten berikutnya ke bawah sesuai setengah tinggi menu (~40px) */}
  <div className="hidden lg:block h-16" />

  {/* Mobile menu — di luar section, normal flow */}
  <div className="lg:hidden px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 py-6">
    <Link href="/product" className="bg-white dark:bg-card p-3 rounded-2xl shadow-sm border border-border/40 flex flex-col items-center text-center gap-2 hover:bg-gray-50 dark:hover:bg-foreground/5 hover:scale-105 transition-all">
      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex flex-shrink-0 items-center justify-center"><Target className="w-5 h-5 text-red-600 dark:text-red-400" /></div>
      <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">UTBK-SNBT</span>
    </Link>
    <Link href="/product" className="bg-white dark:bg-card p-3 rounded-2xl shadow-sm border border-border/40 flex flex-col items-center text-center gap-2 hover:bg-gray-50 dark:hover:bg-foreground/5 hover:scale-105 transition-all">
      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex flex-shrink-0 items-center justify-center"><Users className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
      <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">Tatap Muka</span>
    </Link>
    <Link href="/product" className="bg-white dark:bg-card p-3 rounded-2xl shadow-sm border border-border/40 flex flex-col items-center text-center gap-2 hover:bg-gray-50 dark:hover:bg-foreground/5 hover:scale-105 transition-all">
      <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-500/20 flex flex-shrink-0 items-center justify-center"><Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /></div>
      <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">Online Interaktif</span>
    </Link>
    <Link href="/product" className="bg-white dark:bg-card p-3 rounded-2xl shadow-sm border border-border/40 flex flex-col items-center text-center gap-2 hover:bg-gray-50 dark:hover:bg-foreground/5 hover:scale-105 transition-all">
      <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/20 flex flex-shrink-0 items-center justify-center"><BookOpen className="w-5 h-5 text-rose-600 dark:text-rose-400" /></div>
      <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">Video Belajar</span>
    </Link>
    <Link href="/product" className="bg-white dark:bg-card p-3 rounded-2xl shadow-sm border border-border/40 flex flex-col items-center text-center gap-2 hover:bg-gray-50 dark:hover:bg-foreground/5 hover:scale-105 transition-all">
      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex flex-shrink-0 items-center justify-center"><GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
      <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">English Academy</span>
    </Link>
    <Link href="/product" className="bg-white dark:bg-card p-3 rounded-2xl shadow-sm border border-border/40 flex flex-col items-center text-center gap-2 hover:bg-gray-50 dark:hover:bg-foreground/5 hover:scale-105 transition-all">
      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-500/20 flex flex-shrink-0 items-center justify-center"><TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" /></div>
      <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">Semua Program</span>
    </Link>
  </div>
</>

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
              data={"17.836 ALUMNI KAMI DITERIMA DI PTN FAVORIT"}
              wrapperClass="text-center text-[10px] font-bold tracking-widest mb-5 uppercase text-foreground/50"
            />
            <div
              className="flex items-center animate-infinite-scroll hover:[animation-play-state:paused]"
              style={{
                animationDuration: "60s",
                width: "max-content",
                gap: "2.5rem",
              }}
            >
              {[...Array(10)].flatMap((_, rep) => {
                const logs = STATIC_LOGOS;
                return logs.map((logo: any, idx) => (
                  <div
                    key={`${rep}-${idx}`}
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ height: 64 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.src}
                      alt={logo.name}
                      style={{
                        maxWidth: "100%",
                        height: "100%",
                        objectFit: "contain",
                        opacity: 1,
                      }}
                    />
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
                    0: UserCheck, // Metode Belajar Terbaik
                    1: Target, // Pengajar Alumni
                    2: BookOpen, // Try-Out Rutin
                    3: Zap, // Cara Termudah
                    4: BookOpen, // Modul Lengkap
                    5: Award, // Harga Termurah
                  };

                  const DynamicIcon =
                    iconMap[i] || f.Icon || getIcon(f.icon?.trim()) || BookOpen;

                  // Gradient backgrounds with white icons
                  const colorSchemes = [
                    {
                      bg: "#FFF8E8",
                      color: "#B8934A",
                      iconGradient: "linear-gradient(135deg, #F59E0B, #D97706)",
                    },
                    {
                      bg: "#E8F8F3",
                      color: "#5BA08A",
                      iconGradient: "linear-gradient(135deg, #10B981, #059669)",
                    },
                    {
                      bg: "#FEF0EE",
                      color: "#D4806A",
                      iconGradient: "linear-gradient(135deg, #F87171, #DC2626)",
                    },
                    {
                      bg: "#E8F4F8",
                      color: "#4A8FA8",
                      iconGradient: "linear-gradient(135deg, #38BDF8, #0284C7)",
                    },
                    {
                      bg: "#EBF4FF",
                      color: "#5B8FC4",
                      iconGradient: "linear-gradient(135deg, #6366F1, #4F46E5)",
                    },
                    {
                      bg: "#F3EEFF",
                      color: "#9B7EC8",
                      iconGradient: "linear-gradient(135deg, #A855F7, #7C3AED)",
                    },
                  ];

                  const scheme = colorSchemes[i % colorSchemes.length];

                  return (
                    <div
                      key={f._key || i}
                      className="flex items-center gap-3 md:gap-4 p-3.5 md:p-6 rounded-2xl md:rounded-3xl transition-all hover:-translate-y-1"
                      style={{
                        backgroundColor: scheme.bg,
                        boxShadow:
                          "0 4px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div
                        className="w-9 h-9 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                        style={{
                          background: scheme.iconGradient,
                          boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                        }}
                      >
                        <DynamicIcon
                          className="w-4 h-4 md:w-7 md:h-7 text-white"
                        />
                      </div>
                      <span
                        className="font-bold text-xs md:text-lg leading-snug"
                        style={{ color: scheme.color }}
                      >
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
            className="pt-10 pb-14"
          >
            <div className="container mx-auto px-6">
              <div className="text-center mb-14 space-y-3">
                <StyledText
                  as="h2"
                  data={
                    landing?.productsTitle || {
                      text: "Program",
                      highlightText: "Eksklusif",
                      highlightColor: "text-primary",
                    }
                  }
                  wrapperClass="font-sans font-extrabold text-4xl md:text-5xl text-foreground"
                />
                <p className="text-lg max-w-xl mx-auto text-foreground/70">
                  {landing?.productsDescription ||
                    "Dirancang khusus untuk membantu siswa Indonesia meraih hasil terbaik dalam ujian dan seleksi masuk."}
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
                <Link
                  href="/product"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold border-2 border-primary/30 text-primary hover:bg-primary/10 transition-all"
                >
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
          {/* Section heading — outside the blue container */}
          <div className="text-center mb-8 md:mb-10 space-y-3 px-4">
            <StyledText as="h2" data={{ text: 'Kenapa', highlightText: 'Bimbel Master?' }} wrapperClass="font-sans font-extrabold text-4xl md:text-5xl text-foreground" />
            <p className="text-lg max-w-xl mx-auto text-foreground/70">
              Kombinasi pendekatan tradisional dan teknologi modern untuk pengalaman belajar yang optimal.
            </p>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pb-12"
          >
            <div className="w-full overflow-hidden px-4 md:px-12">
              <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
                
                {/* Left: checklist + button */}
                <div className="space-y-6 md:space-y-8 order-2 md:order-1">
                  <div className="space-y-4">
                    <h2 className="font-extrabold text-3xl md:text-4xl text-foreground leading-snug">
                      Fasilitas Bimbel Master
                    </h2>
                    <ul className="space-y-3 md:space-y-4">
                      {WHY_ITEMS.map((item: any, i: number) => (
                        <li key={i} className="flex items-start gap-4 p-3 -mx-3 rounded-2xl hover:bg-foreground/5 border border-transparent transition-all">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 pt-0.5">
                            <span className="block font-bold text-foreground text-lg mb-1">{item.title}</span>
                            <span className="block text-foreground/70 text-sm md:text-base leading-relaxed">
                              {item.desc || item.description}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/product"
                      className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-8 rounded-full transition-all hover:scale-105 shadow-xl shadow-blue-500/20 text-white text-base bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    >
                      Mulai Belajar Sekarang <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Right: main image + thumbnails */}
                <div className="space-y-6 order-1 md:order-2 relative">
                  <div className="absolute -inset-4 md:-inset-8 bg-gradient-to-tr from-blue-100/40 to-rose-100/40 rounded-[3rem] -z-10 blur-2xl opacity-70"></div>
                  
                  <div className="mx-auto rounded-[1.5rem] overflow-hidden w-full flex items-center justify-center bg-white shadow-2xl border border-border/40 p-2 md:p-3 relative group">
                    <div className="w-full relative rounded-xl overflow-hidden bg-gray-50/50">
                      <img
                        key={facilityIndex}
                        src={FACILITY_IMAGES[facilityIndex].src}
                        alt={FACILITY_IMAGES[facilityIndex].alt}
                        className="w-full aspect-[4/3] md:aspect-auto md:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="mx-auto max-w-sm flex items-center justify-center gap-4">
                    <button
                      onClick={() => setThumbOffset((o) => Math.max(0, o - 1))}
                      disabled={thumbOffset === 0}
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white border border-border/50 shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all text-foreground"
                      aria-label="Previous thumbnails"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex gap-3">
                      {FACILITY_IMAGES.slice(thumbOffset, thumbOffset + 3).map((img, j) => {
                        const i = thumbOffset + j;
                        return (
                          <button
                            key={i}
                            onClick={() => setFacilityIndex(i)}
                            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 w-16 h-12 md:w-20 md:h-14 ${i === facilityIndex
                                ? "border-primary scale-110 shadow-md z-10"
                                : "border-transparent opacity-60 hover:opacity-100"
                              }`}
                            aria-label={img.alt}
                          >
                            <img
                              src={img.src}
                              alt={img.alt}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setThumbOffset((o) => Math.min(FACILITY_IMAGES.length - 3, o + 1))}
                      disabled={thumbOffset >= FACILITY_IMAGES.length - 3}
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white border border-border/50 shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all text-foreground"
                      aria-label="Next thumbnails"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

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
            className="pt-12 pb-14"
          >
            <div className="container mx-auto px-6">
              <div className="text-center mb-14 space-y-3">
                <StyledText
                  as="p"
                  data={landing?.testimonialsSubtitle || "Testimoni Nyata"}
                  wrapperClass="text-xs font-bold tracking-widest uppercase text-secondary"
                />
                <StyledText
                  as="h2"
                  data={
                    landing?.testimonialsTitle || {
                      text: "Bukan Sekadar Testimoni, Tapi",
                      highlightText: "Bukti Nyata",
                    }
                  }
                  wrapperClass="font-sans font-extrabold text-4xl md:text-5xl text-foreground"
                />
                <p className="text-lg max-w-xl mx-auto text-foreground/70">
                  {landing?.testimonialsDescription ||
                    "Cerita sukses dari siswa-siswa terbaik kami."}
                </p>
              </div>

              <div className="space-y-16">
                {/* Prestasi Siswa Map (New Schema) */}
                {prestasi.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
                      Prestasi Gemilang Siswa Kami
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <TestimonialGrid
                          tilted
                          testimonials={prestasi.map((p) => ({
                            _id: p._id,
                            _type: "testimonial", // map to testimonial for UI grid compatibility
                            name: p.name,
                            testimonial: p.description || `${p.achievementTitle} ${p.universityAccepted ? 'di ' + p.universityAccepted : ''} ${p.competitionWon ? 'pada ' + p.competitionWon : ''}`,
                            imageUrl: p.image
                              ? urlForImage(p.image).width(400).url()
                              : undefined,
                            imageAlt: p.image?.alt || p.name,
                            school: p.school,
                            program: p.program || p.year,
                            rating: 5,
                            featured: p.featured || false,
                            publishedAt: p.publishedAt || new Date().toISOString(),
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Original Testimonials Map */}
                {testimonials.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
                      Apa Kata Siswa Tentang Bimbel Master?
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <TestimonialGrid
                          tilted
                          testimonials={testimonials.map((t) => ({
                            ...t,
                            imageUrl: t.image
                              ? urlForImage(t.image).width(400).url()
                              : undefined,
                            imageAlt: t.image?.alt || t.name,
                            _type: t._type || "testimonial",
                            featured: t.featured || false,
                            publishedAt: t.publishedAt || new Date().toISOString(),
                            rating: t.rating || 5,
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center mt-10">
                <Link
                  href="/testimoni"
                  className="inline-flex items-center gap-2 text-sm font-semibold hover:underline text-primary"
                >
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
              <StyledText
                as="p"
                data={"Tanya Dulu Biar Yakin!"}
                wrapperClass="text-[10px] font-bold tracking-widest uppercase text-secondary"
              />
              <StyledText
                as="h2"
                data={"Siap Mulai Perjalanan Belajarmu?"}
                wrapperClass="font-sans font-extrabold text-4xl md:text-5xl leading-tight text-foreground"
              />
              <p className="text-lg text-foreground/80">
                Bergabunglah dengan 1.200+ siswa yang telah mempercayakan
                bimbingan mereka kepada kami.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <>
                  <Link
                    href="/product"
                    className="inline-flex items-center gap-2 bg-primary rounded-full px-8 py-4 font-bold text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-md"
                  >
                    Daftar Sekarang <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 border-2 border-primary/30 rounded-full px-8 py-4 font-bold text-primary hover:bg-primary/10 transition-all"
                  >
                    Pelajari Lebih
                  </Link>
                </>
              </div>
            </div>
          </motion.section>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FLOATING WHATSAPP BUTTON
      ══════════════════════════════════════════════════════════════ */}
      <a
        href="https://wa.me/6281282641074?text=Halo%20Bimbel%20Master%2C%20saya%20ingin%20bertanya%20tentang%20program%20bimbingan%20belajar."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Chat WhatsApp"
      >
        <div className="relative">
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
          {/* Button */}
          <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-xl shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
            <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white rounded-xl px-4 py-2 shadow-lg border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            <p className="text-sm font-semibold text-foreground">Chat dengan kami!</p>
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-border/50" />
          </div>
        </div>
      </a>
    </main>
  );
}
