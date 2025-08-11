// FILE: components/landing/TestimonialSection.tsx
"use client";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';

export interface Testimonial { _key: string; _id: string; name: string; testimonial: string; imageUrl: string; imageAlt: string; }

export default function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return (
        <section className="py-20 px-6 bg-neutral-50">
            <div className="container mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm text-neutral-600 font-medium">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    Testimoni siswa
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">Cerita sukses dari siswa kami</h2>
                <p className="text-lg text-neutral-600">Testimoni akan segera ditampilkan.</p>
            </div>
        </section>
    );
  }

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  
  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 px-6 bg-neutral-50">
      <div className="container mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm text-neutral-600 font-medium">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            Testimoni siswa
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight max-w-4xl mx-auto">
            Cerita sukses dari para siswa yang telah merasakan pembelajaran bersama kami
          </h2>
        </div>

        {/* Testimonial content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-200">
            
            {/* Quote icon */}
            <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-8">
              <Quote className="w-6 h-6 text-neutral-600" />
            </div>
            
            {/* Testimonial text */}
            <blockquote className="text-xl md:text-2xl text-neutral-900 leading-relaxed mb-8 font-medium">
              "{currentTestimonial.testimonial}"
            </blockquote>
            
            {/* Author info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                  <Image 
                    src={currentTestimonial.imageUrl}
                    alt={currentTestimonial.imageAlt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">{currentTestimonial.name}</div>
                  <div className="text-sm text-neutral-600">Siswa Bimbel Master</div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrev} 
                  className="p-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
                >
                  <ChevronLeft className="w-5 h-5 text-neutral-600" />
                </button>
                <button 
                  onClick={handleNext} 
                  className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white transition-colors duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Dots indicator */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button 
                    key={index} 
                    onClick={() => setCurrentIndex(index)} 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-neutral-900 w-8' 
                        : 'bg-neutral-300 w-2 hover:bg-neutral-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};