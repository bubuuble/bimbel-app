// FILE: app/(main)/page.tsx (KODE LENGKAP)

import { client } from "@/sanity/lib/client"; // <-- Pastikan path ini benar
import { groq } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";

// Impor semua komponen section
import Header from '@/components/Header';
import HeroSection from '@/components/landing/HeroSection';
import CompanyStatsSection from '@/components/landing/CompanyStatsSection';
import SupportSection from '@/components/landing/SupportSection';
import ValuePropositionSection from '@/components/landing/ValuePropositionSection';
import ProgramOutcomesSection from '@/components/landing/ProgramOutcomesSection';
import TestimonialSection from '@/components/landing/TestimonialSection';
// Query GROQ lengkap untuk mengambil semua data landing page
const LANDING_PAGE_QUERY = groq`*[_type == "landingPage"][0] {
  heroTitle,
  heroDescription,
  heroImages[]{ asset, alt },
  heroFloatingObjects,
  companyStats,
  supporters[]{ name, logo, alt },
  valuePropositionTitle,
  valuePropositionBenefits,
  programOutcomes,
  pricingPackages,
  testimonials,
  ctaTitle,
  ctaDescription
}`;

export default async function HomePage() {
  const data = await client.fetch(LANDING_PAGE_QUERY);

  // Jika tidak ada data sama sekali dari Sanity, tampilkan pesan
  if (!data) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Konten landing page belum di-publish di Sanity Studio.</p>
        </div>
    );
  }
  
  // Transformasi data untuk komponen, pastikan ada fallback yang aman
  const heroImagesWithUrls = data.heroImages?.map((img: any) => ({
      src: urlForImage(img).width(1200).url(),
      alt: img.alt || 'Bimbel Master Hero Image', // Fallback alt
  })) || [];

  const supportersWithUrls = data.supporters?.map((s: any) => ({
      ...s,
      logoUrl: urlForImage(s.logo).width(150).url(),
      alt: s.alt || s.name, // Fallback alt
  })) || [];

  const testimonialsWithUrls = data.testimonials?.map((t: any) => ({
      ...t,
      imageUrl: urlForImage(t.image).width(400).url(),
      imageAlt: t.name || 'Testimonial Image', // Fallback alt
  })) || [];

  return (
    <>
      <main>
        <HeroSection
          title={data.heroTitle || "Selamat Datang di Bimbel Master"}
          description={data.heroDescription || "Deskripsi default untuk hero section."}
          heroImages={heroImagesWithUrls}
          floatingObjects={data.heroFloatingObjects || []}
        />
        
        <CompanyStatsSection stats={data.companyStats || []} />
        <SupportSection supporters={supportersWithUrls} />
        <ValuePropositionSection 
            title={data.valuePropositionTitle || "Keuntungan Bergabung Bersama Kami"}
            benefits={data.valuePropositionBenefits || []} 
        />
        <ProgramOutcomesSection outcomes={data.programOutcomes || []} />
      </main>
    </>
  );
}