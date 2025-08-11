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
        <section className="py-20 px-6" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.03) 0%, rgba(209,51,19,0.03) 100%)'}}>
            <div className="container mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium border" 
                     style={{borderColor: 'rgb(0,75,173)', color: 'rgb(0,75,173)'}}>
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'rgb(209,51,19)'}} />
                    Testimoni siswa
                </div>
                <h2 className="text-3xl md:text-4xl font-bold" style={{color: 'rgb(0,75,173)'}}>Cerita sukses dari siswa kami</h2>
                <p className="text-lg" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>Testimoni akan segera ditampilkan.</p>
            </div>
        </section>
    );
  }

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  
  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 px-6" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.03) 0%, rgba(209,51,19,0.03) 100%)'}}>
      <div className="container mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium border" 
               style={{borderColor: 'rgb(0,75,173)', color: 'rgb(0,75,173)'}}>
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'rgb(209,51,19)'}} />
            Testimoni siswa
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-4xl mx-auto" style={{color: 'rgb(0,75,173)'}}>
            Cerita sukses dari para siswa yang telah merasakan pembelajaran bersama kami
          </h2>
        </div>

        {/* Testimonial content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border-2" style={{borderColor: 'rgba(0,75,173,0.1)'}}>
            
            {/* Quote icon */}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8" style={{backgroundColor: 'rgba(209,51,19,0.1)'}}>
              <Quote className="w-6 h-6" style={{color: 'rgb(209,51,19)'}} />
            </div>
            
            {/* Testimonial text */}
            <blockquote className="text-xl md:text-2xl leading-relaxed mb-8 font-medium" style={{color: 'rgb(0,75,173)'}}>
              "{currentTestimonial.testimonial}"
            </blockquote>
            
            {/* Author info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2" style={{borderColor: 'rgba(0,75,173,0.2)'}}>
                  <Image 
                    src={currentTestimonial.imageUrl}
                    alt={currentTestimonial.imageAlt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold" style={{color: 'rgb(0,75,173)'}}>{currentTestimonial.name}</div>
                  <div className="text-sm" style={{color: 'rgb(209,51,19)'}}>Siswa Bimbel Master</div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrev} 
                  className="p-3 rounded-xl transition-all duration-200 border-2 hover:bg-opacity-90"
                  style={{backgroundColor: 'rgba(0,75,173,0.05)', borderColor: 'rgba(0,75,173,0.2)'}}
                >
                  <ChevronLeft className="w-5 h-5" style={{color: 'rgb(0,75,173)'}} />
                </button>
                <button 
                  onClick={handleNext} 
                  className="p-3 rounded-xl transition-all duration-200 hover:bg-opacity-90"
                  style={{backgroundColor: 'rgb(209,51,19)', color: 'white'}}
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
                    className={`h-2 rounded-full transition-all duration-300 hover:opacity-80`}
                    style={{
                        backgroundColor: index === currentIndex ? 'rgb(209,51,19)' : 'rgba(0,75,173,0.3)',
                        width: index === currentIndex ? '32px' : '8px'
                    }}
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