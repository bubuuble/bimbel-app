// FILE: components/landing/TestimonialSection.tsx
"use client";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export interface Testimonial { _id: string; name: string; testimonial: string; image: { src: string; alt: string; }; }

const staticTestimonials: Testimonial[] = [
    { _id: '1', name: 'Nur Almahai', testimonial: 'Kebetulan dari dulu aku udah pengen belajar UI/UX. Awalnya aku gatau tentang UI/UX, tapi banyak pengetahuan yang bisa aku ambil dari bootcamp maxy academy. Pokoknya seru banget selama 12 hari, ki...', image: { src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop', alt: 'Nur Almahai' } },
    { _id: '2', name: 'Ahmad Maulana', testimonial: 'Program ini benar-benar membuka wawasan saya tentang industri digital. Sangat direkomendasikan!', image: { src: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop', alt: 'Ahmad Maulana' } },
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % staticTestimonials.length);
  const currentTestimonial = staticTestimonials[currentIndex];

  return (
    <section className="relative py-20 px-4" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.03) 0%, rgba(209,51,19,0.03) 100%)'}}>
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative w-full h-96">
            <Image 
                src={currentTestimonial.image.src}
                alt={currentTestimonial.image.alt}
                fill
                className="object-cover rounded-2xl shadow-lg"
                key={currentTestimonial._id}
            />
            {/* Image overlay decoration */}
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full" style={{backgroundColor: 'rgb(209,51,19)'}} />
            <div className="absolute -bottom-4 -right-4 w-6 h-6 rounded-full" style={{backgroundColor: 'rgb(0,75,173)'}} />
        </div>
        <div>
            <p className="text-lg mb-4" style={{color: 'rgb(0,75,173)'}}>
                <span className="font-bold text-xl" style={{color: 'rgb(209,51,19)'}}>2000+ Maxians</span> telah mendapatkan pekerjaan melalui MAXY Academy
            </p>
            <div className="bg-white p-8 rounded-lg shadow-lg relative border" style={{borderColor: 'rgba(0,75,173,0.1)'}}>
                <span className="absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-full" 
                      style={{backgroundColor: 'rgba(209,51,19,0.1)', color: 'rgb(209,51,19)'}}>
                  Testimoni Terverifikasi
                </span>
                <blockquote className="mt-8 italic" style={{color: 'rgb(0,75,173)'}}>
                    "{currentTestimonial.testimonial}"
                </blockquote>
                <p className="mt-4 font-semibold" style={{color: 'rgb(0,75,173)'}}>{currentTestimonial.name}</p>
            </div>
            <div className="flex justify-end mt-4">
                 <button onClick={handleNext} 
                         className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border"
                         style={{borderColor: 'rgb(0,75,173)', ':hover': {backgroundColor: 'rgba(0,75,173,0.05)'}}}>
                    <ChevronRight className="h-6 w-6" style={{color: 'rgb(0,75,173)'}} />
                </button>
            </div>
        </div>
      </div>
    </section>
  );
};
export default TestimonialSection;