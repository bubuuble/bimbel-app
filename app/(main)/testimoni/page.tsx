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
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Testimoni Siswa
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
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
