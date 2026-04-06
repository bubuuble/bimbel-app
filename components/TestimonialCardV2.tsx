"use client";

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface TestimonialCardV2Props {
  name: string;
  testimonial: string;
  imageUrl?: string;
  imageAlt?: string;
  role?: string; // e.g. "Siswa SMAN 8 Jakarta"
  rating?: number;
}

const TestimonialCardV2: React.FC<TestimonialCardV2Props> = ({
  name,
  testimonial,
  imageUrl,
  imageAlt,
  role,
  rating = 5,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Stars at Top */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
          />
        ))}
      </div>

      {/* Testimonial Content */}
      <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed flex-grow mb-6">
        "{testimonial}"
      </p>

      {/* User Info Footer */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt || name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white truncate">
            {name}
          </h4>
          {role && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {role}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCardV2;
