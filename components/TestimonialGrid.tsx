// FILE: components/TestimonialGrid.tsx
"use client"

import React from 'react';
import Image from 'next/image';
import { Star, GraduationCap } from 'lucide-react';
import { TestimonialWithImage } from '@/types/testimonial';

interface TestimonialGridProps {
  testimonials: TestimonialWithImage[];
  tilted?: boolean;
  gridClassName?: string;
}

const COLORS = [
  { bg: '#FFF8E8', iconColor: '#B8934A', starColor: '#B8934A', border: '#F5E5C0' },
  { bg: '#E8F8F3', iconColor: '#5BA08A', starColor: '#5BA08A', border: '#C0EAD9' },
  { bg: '#FEF0EE', iconColor: '#D4806A', starColor: '#D4806A', border: '#F5CFC8' },
  { bg: '#EBF4FF', iconColor: '#5B8FC4', starColor: '#5B8FC4', border: '#C0D9F5' },
  { bg: '#F3EEFF', iconColor: '#9B7EC8', starColor: '#9B7EC8', border: '#DDD0F5' },
  { bg: '#E8F4F8', iconColor: '#4A8FA8', starColor: '#4A8FA8', border: '#C0DCE8' },
];

const TILTS = [-2, 0, 2]; // left → tilt left, middle → straight, right → tilt right

const TestimonialCard: React.FC<{ testimonial: TestimonialWithImage; index: number; tilted?: boolean }> = ({ testimonial, index, tilted }) => {
  const color = COLORS[index % COLORS.length];
  const tilt = TILTS[index % 3];
  return (
    <div
      className="p-8 rounded-[2rem] transition-all duration-300 flex flex-col h-full"
      style={{
        backgroundColor: color.bg,
        border: `1.5px solid ${color.border}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
        ...(tilted ? { transform: `rotate(${tilt}deg)`, transformOrigin: 'center bottom' } : {}),
      }}
    >
      {/* Header: Avatar + Name */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
          style={{ border: `2px solid ${color.border}` }}
        >
          {testimonial.imageUrl ? (
            <Image
              src={testimonial.imageUrl}
              alt={testimonial.imageAlt || testimonial.name}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: color.border, color: color.iconColor }}
            >
              {testimonial.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-sans font-bold text-base leading-tight truncate" style={{ color: color.iconColor }}>
            {testimonial.name}
          </h4>
          {testimonial.school && (
            <p className="text-xs mt-0.5 truncate" style={{ color: color.iconColor, opacity: 0.7 }}>
              {testimonial.school}
            </p>
          )}
        </div>
        {/* Quote mark decoration */}
        <div className="ml-auto text-4xl font-serif leading-none select-none" style={{ color: color.border }}>
          &ldquo;
        </div>
      </div>

      {/* Quote text */}
      <p className="text-sm leading-relaxed italic flex-grow mb-6" style={{ color: color.iconColor, opacity: 0.85 }}>
        {testimonial.testimonial}
      </p>

      {/* Rating */}
      <div className="flex gap-1 pt-4" style={{ borderTop: `1px solid ${color.border}` }}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            style={{ color: i < (testimonial.rating || 5) ? color.starColor : color.border }}
            className={`w-4 h-4 ${i < (testimonial.rating || 5) ? 'fill-current' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

const TestimonialGrid: React.FC<TestimonialGridProps> = ({ testimonials, tilted = false, gridClassName }) => {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-16">
        <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-semibold text-gray-500 mb-2">Belum Ada Testimoni</h3>
        <p className="text-gray-400">Testimoni dari siswa akan ditampilkan di sini.</p>
      </div>
    );
  }
  
  const defaultGrid = "grid md:grid-cols-2 lg:grid-cols-3 gap-8";

  return (
    <div className={gridClassName || defaultGrid}>
      {testimonials.map((t, i) => (
        <TestimonialCard key={t._id} testimonial={t} index={i} tilted={tilted} />
      ))}
    </div>
  );
};

export default TestimonialGrid;
