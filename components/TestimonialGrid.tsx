// FILE: components/TestimonialGrid.tsx
"use client"

import React from 'react';
import Image from 'next/image';
import { TestimonialWithImage } from '@/types/testimonial';
import { Star, Quote, GraduationCap, MapPin, Trophy } from 'lucide-react';

interface TestimonialGridProps {
  testimonials: TestimonialWithImage[];
}

const TestimonialCard: React.FC<{ testimonial: TestimonialWithImage }> = ({ testimonial }) => {
  // Helper function untuk mendapatkan label program
  const getProgramLabel = (program: string): string => {
    const labels: Record<string, string> = {
      'sd': 'SD', 'smp': 'SMP', 'sma': 'SMA', 'sbmptn': 'SBMPTN',
      'cpns': 'CPNS', 'toefl': 'TOEFL', 'umum': 'Umum', 'utbk': 'UTBK',
      'olimpiade-matematika': 'Olimpiade Matematika',
      'olimpiade-fisika': 'Olimpiade Fisika',
      'olimpiade-kimia': 'Olimpiade Kimia',
      'persiapan-un': 'Persiapan UN',
      'bimbingan-reguler': 'Bimbingan Reguler'
    };
    return labels[program] || program;
  };

  // Render stars untuk rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 group">
      {/* Header dengan Quote Icon */}
      <div className="relative p-6 pb-4" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.05) 0%, rgba(209,51,19,0.05) 100%)'}}>
        <div className="absolute top-4 right-4 opacity-20">
          <Quote className="w-8 h-8" style={{color: 'rgb(0,75,173)'}} />
        </div>
        
        {/* Avatar dan Info */}
        <div className="flex items-start gap-4">
          <div className="relative">
            {testimonial.imageUrl ? (
              <Image
                src={testimonial.imageUrl}
                alt={testimonial.imageAlt || testimonial.name}
                width={80}
                height={80}
                className="rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-red-100 flex items-center justify-center border-2 border-white shadow-md">
                <GraduationCap className="w-8 h-8" style={{color: 'rgb(0,75,173)'}} />
              </div>
            )}
            {testimonial.featured && (
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
                <Trophy className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate" style={{color: 'rgb(0,75,173)'}}>
              {testimonial.name}
            </h3>
            
            {testimonial.school && (
              <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{testimonial.school}</span>
              </div>
            )}
            
            {testimonial.program && (
              <div className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border" 
                   style={{backgroundColor: 'rgba(209,51,19,0.1)', borderColor: 'rgb(209,51,19)', color: 'rgb(209,51,19)'}}>
                <GraduationCap className="w-3 h-3" />
                {getProgramLabel(testimonial.program)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {renderStars(testimonial.rating)}
          <span className="text-sm text-gray-600 ml-1">({testimonial.rating}/5)</span>
        </div>

        {/* Testimonial Text */}
        <blockquote className="text-gray-700 leading-relaxed text-sm mb-4 line-clamp-4">
          "{testimonial.testimonial}"
        </blockquote>

        {/* Achievement */}
        {testimonial.achievement && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Pencapaian:</span>
            </div>
            <p className="text-green-700 text-sm mt-1">{testimonial.achievement}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {new Date(testimonial.publishedAt).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          {testimonial.featured && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
              ⭐ Unggulan
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const TestimonialGrid: React.FC<TestimonialGridProps> = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-md mx-auto">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Testimoni</h3>
            <p className="text-gray-500">Testimoni dari siswa akan ditampilkan di sini.</p>
          </div>
        </div>
      </section>
    );
  }

  // Pisahkan featured dan non-featured testimonials
  const featuredTestimonials = testimonials.filter(t => t.featured);
  const regularTestimonials = testimonials.filter(t => !t.featured);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {/* Featured Testimonials */}
        {featuredTestimonials.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full text-sm font-medium border border-yellow-300 mb-4">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span style={{color: 'rgb(209,51,19)'}}>Testimoni Unggulan</span>
              </div>
              <h2 className="text-3xl font-bold" style={{color: 'rgb(0,75,173)'}}>
                Prestasi Terbaik Siswa Kami
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Testimonials */}
        {regularTestimonials.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{color: 'rgb(0,75,173)'}}>
                Semua Testimoni
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pengalaman nyata dari siswa-siswa kami yang telah merasakan kualitas pembelajaran terbaik.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialGrid;
