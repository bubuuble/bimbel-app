// FILE: components/landing/TestimonialSection.tsx
"use client";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export interface Testimonial { _key: string; _id: string; name: string; testimonial: string; imageUrl: string; imageAlt: string; }

export default function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return (
        <section className="py-20 px-4 bg-gray-50">
            <div className="container mx-auto text-center">
                 <h2 className="text-3xl font-bold text-gray-900">Testimoni Siswa</h2>
                 <p className="mt-4 text-lg text-gray-600">Testimoni akan segera ditampilkan.</p>
            </div>
        </section>
    );
  }

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  
  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="relative py-20 px-4 bg-gray-50">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative w-full h-80 md:h-96">
            <Image 
                src={currentTestimonial.imageUrl}
                alt={currentTestimonial.imageAlt}
                fill
                className="object-cover rounded-2xl shadow-lg"
                key={currentTestimonial._id}
            />
        </div>
        <div>
            <div className="bg-white p-8 rounded-lg shadow-md relative">
                <span className="absolute top-4 left-4 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Testimoni Terverifikasi</span>
                <blockquote className="mt-8 text-gray-700 italic text-lg">
                    "{currentTestimonial.testimonial}"
                </blockquote>
                <p className="mt-4 font-semibold text-gray-900 text-right">- {currentTestimonial.name}</p>
            </div>
            <div className="flex justify-end gap-4 mt-4">
                 <button onClick={handlePrev} className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100">
                    <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>
                 <button onClick={handleNext} className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100">
                    <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
            </div>
        </div>
      </div>
    </section>
  );
};