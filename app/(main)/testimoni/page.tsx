// FILE: app/(main)/testimoni/page.tsx

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";
import TestimonialSection from '@/components/landing/TestimonialSection';

// Query GROQ untuk mengambil data testimonials
const TESTIMONIALS_QUERY = groq`*[_type == "landingPage"][0] {
  testimonials[]{
    _key,
    name,
    testimonial,
    image
  }
}`;

export default async function TestimoniPage() {
  const data = await client.fetch(TESTIMONIALS_QUERY);

  // Transformasi data untuk testimonials
  const testimonialsWithUrls = data?.testimonials?.map((t: any) => ({
      ...t,
      imageUrl: urlForImage(t.image).width(400).url(),
      imageAlt: t.name || 'Testimonial Image',
  })) || [];

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
          </div>
        </section>

        {/* Testimonial Section */}
        <TestimonialSection testimonials={testimonialsWithUrls} />
      </main>
    </>
  );
}

export const metadata = {
  title: 'Testimoni Siswa - Bimbel Master',
  description: 'Baca testimoni dan pengalaman nyata dari siswa-siswa Bimbel Master yang telah meraih prestasi gemilang.',
};
