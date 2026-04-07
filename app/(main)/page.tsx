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
import AchievementCard from "@/components/AchievementCard";
import SimpleAchievementCard from "@/components/SimpleAchievementCard";
import TestimonialCardV2 from "@/components/TestimonialCardV2";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ProductGrid from "@/components/ProductGrid";
import GalleryHero from "@/components/GalleryHero";
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [landing, setLanding] = useState<LandingData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [prestasi, setPrestasi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [facilityIndex, setFacilityIndex] = useState(0);
  const [prestasiIndex, setPrestasiIndex] = useState(0);
  const [thumbOffset, setThumbOffset] = useState(0);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const heroSliderRef = useRef<HTMLDivElement>(null);

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
        // Fallback mock data for Prestasi if empty, so user can see implementation
        const finalPrestasi = pr && pr.length > 0 ? pr : [
          { _id: 'm1', name: 'Khayla Putri Herlina', achievementTitle: 'Lolos SNBT 2026', universityAccepted: 'Universitas Indonesia', description: 'Metode belajarnya asik dan mudah dipahami.', school: 'SMAN 8 Jakarta', image: '/image/prestasi/1.jpeg' },
          { _id: 'm2', name: 'Precisia Rahaja', achievementTitle: 'Lolos SNBT 2026', universityAccepted: 'Universitas Indonesia', description: 'Mentor-mentornya sangat membantu dalam persiapan ujian.', school: 'SMAN 3 Bandung', image: '/image/prestasi/2.jpeg' },
        ];
        setPrestasi(finalPrestasi);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const heroImages = (landing?.heroImages ?? []).map((img) => ({
    src: urlForImage(img).width(1920).height(1080).url(),
    alt: img.alt || "Hero",
  }));

  const scrollHeroTo = useCallback(
    (index: number) => {
      if (heroSliderRef.current && heroImages.length > 0 && heroSliderRef.current.children[0]) {
        const el = heroSliderRef.current;
        const slideEl = el.children[0] as HTMLElement;
        const gap = window.innerWidth >= 768 ? 0 : 12; // gap-3 (12px) on mobile
        el.scrollTo({ left: index * (slideEl.offsetWidth + gap), behavior: "smooth" });
        setHeroIndex(index);
      }
    },
    [heroImages.length]
  );

  const handleHeroScroll = () => {
    if (heroSliderRef.current && heroSliderRef.current.children[0]) {
      const scrollPos = heroSliderRef.current.scrollLeft;
      const slideEl = heroSliderRef.current.children[0] as HTMLElement;
      const gap = window.innerWidth >= 768 ? 0 : 12;
      const w = slideEl.offsetWidth + gap;
      if (w > 0) {
        const newIdx = Math.round(scrollPos / w);
        if (newIdx !== heroIndex && newIdx >= 0 && newIdx < heroImages.length) {
          setHeroIndex(newIdx);
        }
      }
    }
  };

  const nextHero = useCallback(() => {
    if (heroImages.length > 1) {
      scrollHeroTo((heroIndex + 1) % heroImages.length);
    }
  }, [heroIndex, heroImages.length, scrollHeroTo]);

  const prevHero = useCallback(() => {
    if (heroImages.length > 1) {
      scrollHeroTo((heroIndex - 1 + heroImages.length) % heroImages.length);
    }
  }, [heroIndex, heroImages.length, scrollHeroTo]);

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
      <section className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-auto md:h-[100svh] md:min-h-[560px] pt-4 pb-2 md:p-0">
        <div className="relative w-full h-full">
          {/* Slides */}
          {heroImages.length > 0 ? (
            <div
              ref={heroSliderRef}
              onScroll={handleHeroScroll}
              className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth px-3 md:px-0 gap-3 md:gap-0 scroll-px-3 md:scroll-px-0 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {heroImages.map((img, i) => (
                <div
                  key={i}
                  className="relative w-[95%] sm:w-[96%] md:w-full h-full flex-shrink-0 snap-start snap-always rounded-[1.25rem] md:rounded-none overflow-hidden shadow-lg md:shadow-none"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 100vw"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 rounded-[1.25rem] md:rounded-none mx-3 md:mx-0" style={{ background: "#C3D4FF" }} />
          )}

          {/* Prev / Next arrows */}
          {heroImages.length > 1 && (
            <>
              <button
                onClick={prevHero}
                className="absolute hidden md:flex left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-11 md:h-11 rounded-full items-center justify-center transition-all hover:scale-110"
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
                className="absolute hidden md:flex right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-11 md:h-11 rounded-full items-center justify-center transition-all hover:scale-110"
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
            <div className="absolute bottom-4 md:bottom-7 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollHeroTo(i)}
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
        </div>
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
      {/* Background & Blobs (Original) */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/90 via-rose-100/90 to-amber-100/90 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-1/2 left-0 w-[400px] h-[400px] bg-rose-400/20 dark:bg-rose-600/10 rounded-full blur-3xl -translate-x-1/3 pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-8 lg:px-12 relative z-30 pt-10 md:pt-24 pb-16 md:pb-11 flex flex-col md:flex-row items-center">
        
        {/* Left Column: Teks & Form (Di mobile lebar dibatasi agar tidak tabrakan dengan gambar) */}
        <div className="w-full md:flex-1 space-y-4 md:space-y-6 text-left z-20 pr-[30%] md:pr-0 md:pl-10">
          <h2 className="font-extrabold text-2xl md:text-4xl lg:text-[44px] leading-relaxed drop-shadow-sm pb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-primary to-orange-600">
            Bimbel Online & Offline Terbesar, Terlengkap, dan Terbukti di Indonesia
          </h2>
          
          <div className="pt-2">
            <label className="block text-foreground/90 font-bold text-[11px] md:text-base mb-2 md:mb-3">
              Diskon spesial untukmu dengan isi nomor HP sekarang
            </label>
            
            <form
              className="w-full max-w-lg relative z-20"
              onSubmit={(e) => {
                e.preventDefault();
                if (!phone || phone.length < 9) {
                  setPhoneError('Nomor HP minimal 9 digit.');
                  return;
                }
                setPhoneError(null);
                window.open(`https://wa.me/6287786864036?text=Halo%20saya%20tertarik...`);
              }}
            >
              <div className="flex items-center bg-white dark:bg-card rounded-full p-1 shadow-lg border border-border/40 w-full max-w-[320px] md:max-w-full">
                <div className="pl-3 pr-2 font-bold text-foreground/70 border-r border-border/40 text-xs md:text-base">
                  +62
                </div>
                <input
                  type="tel"
                  placeholder="812xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-2 md:px-4 py-2 md:py-3 w-full bg-transparent text-foreground text-xs md:text-base focus:outline-none font-semibold"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/60 text-white px-3 md:px-7 py-2 md:py-3 rounded-full font-bold text-[10px] md:text-base transition-all active:scale-95"
                >
                  Dapatkan Diskon
                </button>
              </div>
              {/* Error logic tetap sama */}
            </form>
          </div>
        </div>

        {/* Right Column: Gambar (Mobile: Absolute ke kanan bawah | Desktop: Relative/Normal) */}
        <div className="absolute bottom-0 right-0 md:relative md:flex-1 w-[45%] md:w-full flex justify-end items-end z-10 pointer-events-none">
          <picture className="w-full max-w-[200px] md:max-w-[420px] lg:max-w-xl drop-shadow-2xl block translate-y-4 md:translate-y-0">
            <source srcSet="https://roboguru-forum-cdn.ruangguru.com/image/faf3c4c1-14cd-45bd-aa59-f8017155be37.png" media="(max-width: 768px)" />
            <img 
              src="https://roboguru-forum-cdn.ruangguru.com/image/c8d6923b-c6f1-4a02-a7ad-b7e9d268b138.png" 
              className="w-full h-auto block" 
              alt="Student Success" 
            />
          </picture>
        </div>
      </div>

      {/* Action Menu Desktop (Hanya muncul di Desktop) */}
      <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 px-6 lg:px-12 z-50 hidden lg:block">
        <div className="container mx-auto">
          <div className="bg-white dark:bg-card rounded-3xl shadow-2xl border border-border/50 p-2 flex items-stretch overflow-hidden w-full divide-x divide-border/20">
            {/* Menu Desktop Anda */}
            <Link href="/product" className="group flex-1 flex items-center justify-center py-4 px-2 hover:bg-gray-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><Target className="w-5 h-5 text-red-600" /></div>
                <div className="text-left hidden xl:block"><p className="text-[10px] font-bold uppercase">Persiapan</p><p className="text-sm font-bold">UTBK-SNBT</p></div>
              </div>
            </Link>
            {/* ... teruskan item menu desktop lainnya sesuai kode original Anda ... */}
            <Link href="/product" className="group flex-1 flex items-center justify-center py-4 px-2 hover:bg-gray-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div>
                <div className="text-left hidden xl:block"><p className="text-[10px] font-bold uppercase">Bimbel</p><p className="text-sm font-bold">Tatap Muka</p></div>
              </div>
            </Link>
            <Link href="/product" className="group flex-1 flex items-center justify-center py-4 px-2 hover:bg-gray-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center"><Globe className="w-5 h-5 text-cyan-600" /></div>
                <div className="text-left hidden xl:block"><p className="text-[10px] font-bold uppercase">Bimbel Online</p><p className="text-sm font-bold">Interaktif</p></div>
              </div>
            </Link>
            <Link href="/product" className="group flex-1 flex items-center justify-center py-4 px-2 hover:bg-gray-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center"><BookOpen className="w-5 h-5 text-rose-600" /></div>
                <div className="text-left hidden xl:block"><p className="text-[10px] font-bold uppercase">Video Belajar</p><p className="text-sm font-bold">& Soal</p></div>
              </div>
            </Link>
            <Link href="/product" className="group flex-1 flex items-center justify-center py-4 px-2 hover:bg-gray-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-indigo-600" /></div>
                <div className="text-left hidden xl:block"><p className="text-[10px] font-bold uppercase">English</p><p className="text-sm font-bold">Academy</p></div>
              </div>
            </Link>
            <Link href="/product" className="group flex-1 flex items-center justify-center py-4 px-2 hover:bg-gray-50 transition-all rounded-r-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-gray-600" /></div>
                <div className="text-left hidden xl:block"><p className="text-[10px] font-bold uppercase">Semua</p><p className="text-sm font-bold">Program</p></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.section>

      {/* Mobile Action Menu (Ruangguru Style: White Card) */}
      <div className="lg:hidden px-4 relative z-50 -mt-10">
        <div className="bg-white dark:bg-card rounded-2xl shadow-xl border border-border/40 p-4">
          <p className="text-[12px] font-bold text-foreground mb-4">
            Semua kebutuhan belajar ada di Bimbel Master
          </p>
          <div className="grid grid-cols-4 gap-2">
            <Link href="/product" className="flex flex-col items-center text-center gap-2">
              <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center"><Target className="w-5 h-5 text-red-600" /></div>
              <span className="text-[10px] font-bold text-foreground leading-tight">UTBK-SNBT</span>
            </Link>
            <Link href="/product" className="flex flex-col items-center text-center gap-2">
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div>
              <span className="text-[10px] font-bold text-foreground leading-tight">Tatap Muka</span>
            </Link>
            <Link href="/product" className="flex flex-col items-center text-center gap-2">
              <div className="w-11 h-11 rounded-full bg-cyan-100 flex items-center justify-center"><Globe className="w-5 h-5 text-cyan-600" /></div>
              <span className="text-[10px] font-bold text-foreground leading-tight">Online</span>
            </Link>
            <Link href="/product" className="flex flex-col items-center text-center gap-2">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-gray-600" /></div>
              <span className="text-[10px] font-bold text-foreground leading-tight">Semua</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="h-10 lg:h-20" />
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
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 pb-6 leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-primary to-orange-600">
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
              <div className="text-center mb-14 space-y-4">
                <StyledText
                  as="h2"
                  data={
                    landing?.productsTitle || {
                      text: "Program",
                      highlightText: "Eksklusif",
                      highlightColor: "text-blue-800 dark:text-blue-500",
                    }
                  }
                  wrapperClass="font-sans font-extrabold text-4xl md:text-[3.5rem] tracking-tight pb-2 leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-primary to-orange-600"
                />
                <p className="text-[1.15rem] md:text-2xl leading-relaxed max-w-3xl mx-auto text-slate-500 dark:text-slate-400 font-medium">
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
            <StyledText as="h2" data={{ text: 'Kenapa', highlightText: 'Bimbel Master?' }} wrapperClass="font-sans font-extrabold text-4xl md:text-5xl pb-6 leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-primary to-orange-600" />
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
                    <h2 className="font-extrabold text-3xl md:text-4xl leading-relaxed pb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-primary to-orange-600">
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
          7.  PRESTASI SISWA
      ══════════════════════════════════════════════════════════════ */}
          {prestasi.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="pt-16 pb-20 bg-background"
            >
              <div className="container mx-auto px-6">
                <div className="text-center mb-16 space-y-3">
                  <p className="text-xs font-bold tracking-widest uppercase text-secondary">
                    PRESTASI SISWA
                  </p>
                  <h2 className="font-sans font-extrabold text-4xl md:text-5xl leading-relaxed pb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-primary to-orange-600">
                    Lulusan Terbaik Bimbel Master
                  </h2>
                  <p className="text-lg max-w-xl mx-auto text-foreground/70">
                    Bukti nyata keberhasilan siswa kami dalam meraih kampus impian.
                  </p>
                </div>

                {/* Carousel Container */}
                <div className="relative max-w-2xl mx-auto">
                  {/* Card Display */}
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-border/20">
                    <div className="grid grid-cols-1">
                      {prestasi.map((p: any, i: number) => (
                        <div
                          key={p._id}
                          className={`transition-all duration-500 ease-in-out transform ${
                            i === prestasiIndex
                              ? "opacity-100 scale-100 pointer-events-auto"
                              : "absolute opacity-0 scale-95 pointer-events-none"
                          }`}
                        >
                          <div className="flex flex-col md:flex-row items-center gap-6 p-8 md:p-10">
                            {/* Image */}
                            <div className="w-full md:w-1/2 flex-shrink-0">
                              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                                <Image
                                  src={p.image || "/image/prestasi/1.jpg"}
                                  alt={p.name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                              </div>
                            </div>

                            {/* Content */}
                            <div className="w-full md:w-1/2 space-y-2 md:space-y-4">
                              <div className="space-y-1 md:space-y-2">
                                <p className="text-xs md:text-sm font-bold text-primary uppercase tracking-wider">
                                  {p.achievementTitle}
                                </p>
                                <h3 className="text-xl md:text-3xl font-bold text-foreground">
                                  {p.name}
                                </h3>
                                <p className="text-base md:text-lg text-secondary font-semibold">
                                  {p.universityAccepted}
                                </p>
                              </div>

                              <p className="text-sm md:text-base text-foreground/70 leading-relaxed md:leading-relaxed">
                                {p.description}
                              </p>

                              <div className="pt-2 md:pt-4 space-y-1 md:space-y-2">
                                <p className="text-xs md:text-sm text-foreground/60">
                                  <span className="font-semibold">Asal Sekolah:</span> {p.school}
                                </p>
                                {p.program && (
                                  <p className="text-xs md:text-sm text-foreground/60">
                                    <span className="font-semibold">Program:</span> {p.program}
                                  </p>
                                )}
                              </div>

                              <div className="pt-2 md:pt-4">
                                <a
                                  href="https://wa.me/6287786864036"
                                  className="inline-flex items-center gap-2 px-5 py-2 md:px-6 md:py-3 bg-primary text-primary-foreground text-sm md:text-base font-semibold rounded-full hover:bg-primary/90 transition-all hover:scale-105"
                                >
                                  Hubungi Kami <ArrowRight className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <button
                    onClick={() =>
                      setPrestasiIndex(
                        (prestasiIndex - 1 + prestasi.length) % prestasi.length
                      )
                    }
                    className="absolute left-0 top-[28%] md:top-1/2 -translate-y-1/2 translate-x-2 md:-translate-x-20 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 shadow-lg border-2 border-white/20 md:border-transparent"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  <button
                    onClick={() =>
                      setPrestasiIndex((prestasiIndex + 1) % prestasi.length)   
                    }
                    className="absolute right-0 top-[28%] md:top-1/2 -translate-y-1/2 -translate-x-2 md:translate-x-20 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 shadow-lg border-2 border-white/20 md:border-transparent"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {prestasi.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPrestasiIndex(i)}
                        className={`rounded-full transition-all duration-300 ${
                          i === prestasiIndex
                            ? "bg-primary w-8 h-3"
                            : "bg-primary/30 w-3 h-3 hover:bg-primary/50"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center mt-12">
                  <Link
                    href="/testimoni"
                    className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white bg-primary shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    Lihat Semua Siswa <ArrowRight className="w-6 h-6 ml-1" />
                  </Link>
                </div>
              </div>
            </motion.section>
          )}

          {/* ══════════════════════════════════════════════════════════════
          8.  TESTIMONIALS  —  Standard Grid
      ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pt-12 pb-24"
          >
            <div className="container mx-auto px-6">
              <div className="text-center mb-14 space-y-3">
                <p className="text-xs font-bold tracking-widest uppercase text-secondary">
                  TESTIMONI SISWA
                </p>
                <h2 className="font-sans font-extrabold text-4xl md:text-5xl leading-relaxed pb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-primary to-orange-600">
                  Apa Kata Mereka Tentang Kami?
                </h2>
                <p className="text-lg max-w-xl mx-auto text-foreground/70">
                  Cerita pengalaman belajar yang menyenangkan dan efektif.
                </p>
              </div>

              <Carousel opts={{ align: "start", loop: false }} className="w-full max-w-7xl mx-auto">
                <CarouselContent className="-ml-4">
                  {/* Dummy Data for Homepage Preview (Using structure from /testimoni) - Main Testimoni */}
                  {[
                    { id: 1, name: "Cover Story 1", image: "https://placehold.co/600x800/e2e8f0/94a3b8.png?text=Main+Testimoni+1" },
                    { id: 2, name: "Cover Story 2", image: "https://placehold.co/600x800/e2e8f0/94a3b8.png?text=Main+Testimoni+2" },
                    { id: 3, name: "Cover Story 3", image: "https://placehold.co/600x800/e2e8f0/94a3b8.png?text=Main+Testimoni+3" }
                  ].map((item) => (
                    <CarouselItem key={item.id} className="pl-4 basis-[75%] md:basis-1/2">
                      <div className="border-4 border-white shadow-xl overflow-hidden rounded-[2rem] h-[400px] md:h-[500px] flex items-center justify-center relative group transition-transform duration-300 hover:-translate-y-2 cursor-pointer">
                        <div className="p-0 flex items-center justify-center h-full w-full bg-slate-100">
                          <img 
                            src={item.image}
                            alt={item.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="relative z-10 flex flex-col items-center justify-end h-full pb-8 w-full gap-2">
                            <Award className="w-12 h-12 text-white/50" />
                            <div className="text-white font-bold text-xl tracking-wide uppercase">{item.name}</div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}

                  {/* Preview / Lihat Semua Card */}
                  <CarouselItem className="pl-4 basis-[75%] md:basis-1/2 py-4">
                    <div className="relative h-[400px] md:h-[500px] w-full rounded-[2rem] border-4 border-white overflow-hidden shadow-lg flex items-center justify-center group">
                      {/* Fake background for preview card */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-orange-50" />
                      
                      <div className="relative z-10 flex flex-col items-center justify-center p-6 gap-4 text-center h-full">
                        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-primary shadow-md group-hover:scale-110 transition-transform">
                          <ArrowRight className="h-8 w-8 text-primary group-hover:translate-x-1 transition-transform" />
                        </div>
                        <h3 className="font-bold text-xl text-slate-800">Masih Banyak Lagi!</h3>
                        <Link href="/testimoni" className="bg-primary text-white font-bold px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-1 shadow-md flex items-center gap-2 mt-2 text-sm">
                          Lihat Semua
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                
                <div className="flex justify-center gap-4 mt-8">
                  <CarouselPrevious className="static translate-y-0 translate-x-0 bg-white border border-slate-200 hover:bg-slate-50 hover:text-primary transition-colors text-slate-700 shadow-sm w-12 h-12" />
                  <CarouselNext className="static translate-y-0 translate-x-0 bg-white border border-slate-200 hover:bg-slate-50 hover:text-primary transition-colors text-slate-700 shadow-sm w-12 h-12" />
                </div>
              </Carousel>
            </div>
          </motion.section>

          {/* ══════════════════════════════════════════════════════════════
          8.5  GALLERY HERO
      ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pt-12 pb-24 bg-background"
          >
            <div className="container mx-auto px-6 mb-12">
              <div className="text-center space-y-3">
                <p className="text-xs font-bold tracking-widest uppercase text-secondary">
                  GALLERY MASTER
                </p>
                <h2 className="font-sans font-extrabold text-4xl md:text-5xl leading-relaxed pb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-primary to-orange-600">
                  Momen Berharga Kami
                </h2>
                <p className="text-lg max-w-xl mx-auto text-foreground/70">
                  Lihat kegiatan, fasilitas, dan momen-momen terbaik di Bimbel Master.
                </p>
              </div>
            </div>
            
            <GalleryHero />
            
            <div className="text-center mt-12">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white bg-primary shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Lihat Semua Gallery <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </div>
          </motion.section>

          {/* ══════════════════════════════════════════════════════════════
          9.  CTA BANNER
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
                wrapperClass="font-sans font-extrabold text-4xl md:text-5xl leading-relaxed pb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-primary to-orange-600"
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
        href="https://wa.me/6287786864036?text=Halo%20Bimbel%20Master%2C%20saya%20ingin%20bertanya%20tentang%20program%20bimbingan%20belajar."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-12 right-12 z-50 group"
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

      {/* Modal / Dialog for Image Preview */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent showCloseButton={false} className="max-w-[90vw] md:max-w-4xl p-0 bg-transparent border-0 shadow-none flex justify-center items-center pointer-events-none">
          <DialogTitle className="sr-only">Preview Gambar Testimoni</DialogTitle>
          {selectedImage && (
            <div className="relative inline-flex items-center justify-center max-w-full max-h-[85vh] pointer-events-auto">
              <img 
                src={selectedImage} 
                alt="Preview Testimoni" 
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 bg-white/70 hover:bg-white backdrop-blur-md p-2 rounded-full shadow-xl hover:scale-110 transition-all duration-300 z-50 group border border-white/50"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-slate-700 group-hover:text-rose-500 transition-colors" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
