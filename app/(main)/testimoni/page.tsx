// FILE: app/(main)/testimoni/page.tsx

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";
import { Testimonial, TestimonialWithImage } from "@/types/testimonial";
import TestimonialGrid from '@/components/TestimonialGrid';

// Query GROQ untuk mengambil data testimonials dari collection testimonial
const TESTIMONIALS_QUERY = groq`*[_type == "testimonial"] | order(publishedAt desc) {
  _id,
  name,
  testimonial,
  image,
  school,
  program,
  achievement,
  rating,
  featured,
  publishedAt
}`;

export default async function TestimoniPage() {
  const testimonials: Testimonial[] = await client.fetch(TESTIMONIALS_QUERY);

  // Transformasi data untuk testimonials dengan image URLs
  const testimonialsWithUrls: TestimonialWithImage[] = testimonials.map((testimonial) => ({
    ...testimonial,
    imageUrl: testimonial.image ? urlForImage(testimonial.image).width(400).url() : undefined,
    imageAlt: testimonial.image?.alt || testimonial.name || 'Testimonial Image',
  }));

  return (
    <>
      <main>
        {/* Header Section */}
        <section className="py-16 px-4" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.05) 0%, rgba(209,51,19,0.05) 100%)'}}>
          <div className="container mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium border mb-6" 
                 style={{borderColor: 'rgb(0,75,173)', color: 'rgb(0,75,173)'}}>
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'rgb(209,51,19)'}} />
              Testimoni Terpercaya
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{color: 'rgb(0,75,173)'}}>
              Testimoni Siswa
            </h1>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
              Dengarkan langsung pengalaman dan pencapaian siswa-siswa kami yang telah merasakan transformasi pembelajaran berkualitas.
            </p>
            
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold mb-2" style={{color: 'rgb(209,51,19)'}}>
                  {testimonialsWithUrls.length}+
                </div>
                <div className="text-gray-600 font-medium">Testimoni Siswa</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold mb-2" style={{color: 'rgb(209,51,19)'}}>
                  {testimonialsWithUrls.filter(t => t.featured).length}+
                </div>
                <div className="text-gray-600 font-medium">Prestasi Unggulan</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold mb-2" style={{color: 'rgb(209,51,19)'}}>
                  {testimonialsWithUrls.length > 0 
                    ? (testimonialsWithUrls.reduce((sum, t) => sum + t.rating, 0) / testimonialsWithUrls.length).toFixed(1)
                    : '0.0'
                  }
                </div>
                <div className="text-gray-600 font-medium">Rating Rata-rata</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Grid */}
        <TestimonialGrid testimonials={testimonialsWithUrls} />
      </main>
    </>
  );
}

export const metadata = {
  title: 'Testimoni Siswa - Bimbel Master',
  description: 'Baca testimoni dan pengalaman nyata dari siswa-siswa Bimbel Master yang telah meraih prestasi gemilang.',
};
