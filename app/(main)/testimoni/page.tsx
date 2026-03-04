// app/(main)/testimoni/page.tsx

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";
import { Testimonial, TestimonialWithImage } from "@/types/testimonial";
import TestimonialGrid from '@/components/TestimonialGrid';
import { Star } from 'lucide-react';

const TESTIMONIALS_QUERY = groq`*[_type == "testimonial"] | order(publishedAt desc) {
  _id, name, testimonial, image, school, program, achievement, rating, featured, publishedAt
}`;

export default async function TestimoniPage() {
  const testimonials: Testimonial[] = await client.fetch(TESTIMONIALS_QUERY);

  const testimonialsWithUrls: TestimonialWithImage[] = testimonials.map((t) => ({
    ...t,
    imageUrl: t.image ? urlForImage(t.image).width(400).url() : undefined,
    imageAlt: t.image?.alt || t.name || 'Testimonial Image',
  }));

  const avgRating = testimonialsWithUrls.length > 0
    ? (testimonialsWithUrls.reduce((s, t) => s + t.rating, 0) / testimonialsWithUrls.length).toFixed(1)
    : '0.0';

  return (
    <main className="overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        className="relative pt-32 pb-24 px-4 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/5"
      >
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full pointer-events-none bg-secondary/10 blur-3xl" />

        <div className="container mx-auto text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20 bg-primary/10 text-primary">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-secondary" />
            Testimoni Terpercaya
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold leading-tight max-w-4xl mx-auto text-foreground">
            <span className="text-primary">Testimoni</span> Siswa
          </h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed text-foreground/70 font-sans">
            Dengarkan langsung pengalaman dan pencapaian siswa-siswa kami yang telah merasakan transformasi pembelajaran berkualitas.
          </p>

          {/* Stats strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            {[
              { value: `${testimonialsWithUrls.length}+`, label: 'Testimoni Siswa', bg: 'bg-primary/10', color: 'text-primary' },
              { value: `${testimonialsWithUrls.filter(t => t.featured).length}+`, label: 'Prestasi Unggulan', bg: 'bg-secondary/10', color: 'text-secondary' },
              { value: avgRating, label: 'Rating Rata-rata', bg: 'bg-accent/20', color: 'text-accent' },
            ].map((s, i) => (
              <div key={i} className={`rounded-[2rem] p-6 text-center shadow-sm border border-border/50 ${s.bg}`}>
                <div className={`text-3xl font-sans font-extrabold mb-1 ${s.color}`}>{s.value}</div>
                <div className="text-sm font-bold text-foreground/70 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRID ──────────────────────────────────────────────────────── */}
      <TestimonialGrid testimonials={testimonialsWithUrls} />

    </main>
  );
}

export const metadata = {
  title: 'Testimoni Siswa - Bimbel Master',
  description: 'Baca testimoni dan pengalaman nyata dari siswa-siswa Bimbel Master yang telah meraih prestasi gemilang.',
};
