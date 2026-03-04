// FILE: components/TestimonialGrid.tsx
"use client"

import React from 'react';
import Image from 'next/image';
import { Star, GraduationCap } from 'lucide-react';
import { TestimonialWithImage } from '@/types/testimonial';

interface TestimonialGridProps {
  testimonials: TestimonialWithImage[];
}

const COLORS = [
  { bg: 'bg-blue-100',    iconColor: '#1D4ED8', starColor: '#1D4ED8' },
  { bg: 'bg-rose-300',    iconColor: '#BE123C', starColor: '#BE123C' },
  { bg: 'bg-violet-100',  iconColor: '#6D28D9', starColor: '#6D28D9' },
  { bg: 'bg-emerald-100', iconColor: '#065F46', starColor: '#065F46' },
  { bg: 'bg-amber-100',   iconColor: '#92400E', starColor: '#92400E' },
  { bg: 'bg-indigo-100',  iconColor: '#3730A3', starColor: '#3730A3' },
];

const TestimonialCard: React.FC<{ testimonial: TestimonialWithImage; index: number }> = ({ testimonial, index }) => {
  const color = COLORS[index % COLORS.length];
  return (
    <div className={`${color.bg} p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col h-full`}>
      {/* Header: Avatar + Name */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/60 flex-shrink-0">
          {testimonial.imageUrl ? (
            <Image
              src={testimonial.imageUrl}
              alt={testimonial.imageAlt || testimonial.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/60 flex items-center justify-center font-bold text-xl" style={{ color: color.iconColor }}>
              {testimonial.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-sans font-bold text-xl text-foreground truncate">{testimonial.name}</h4>
          {testimonial.school && (
            <p className="text-sm text-foreground/60 truncate">{testimonial.school}</p>
          )}
        </div>
      </div>

      {/* Quote text */}
      <p className="text-foreground/70 text-lg leading-relaxed italic mb-8 flex-grow">
        &ldquo;{testimonial.testimonial}&rdquo;
      </p>

      {/* Rating */}
      <div className="flex gap-1 pt-4 border-t border-foreground/10">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            style={{ color: i < (testimonial.rating || 5) ? color.starColor : undefined }}
            className={`w-5 h-5 ${i < (testimonial.rating || 5) ? 'fill-current' : 'text-foreground/20'}`}
          />
        ))}
      </div>
    </div>
  );
};

const TestimonialGrid: React.FC<TestimonialGridProps> = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-16">
        <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-semibold text-gray-500 mb-2">Belum Ada Testimoni</h3>
        <p className="text-gray-400">Testimoni dari siswa akan ditampilkan di sini.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((t, i) => (
        <TestimonialCard key={t._id} testimonial={t} index={i} />
      ))}
    </div>
  );
};

export default TestimonialGrid;
