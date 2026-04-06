"use client";

import React from 'react';
import Image from 'next/image';

interface SimpleAchievementCardProps {
  name: string;
  university?: string;
  imageUrl?: string;
  imageAlt?: string;
}

const SimpleAchievementCard: React.FC<SimpleAchievementCardProps> = ({
  name,
  university,
  imageUrl,
  imageAlt,
}) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      {/* Image Container */}
      <div className="relative w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden shadow-md bg-white border-[6px] border-white">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 320px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      {/* Student Info */}
      <div className="space-y-1">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          {name}
        </h3>
        {university && (
          <p className="text-lg md:text-xl text-foreground/70 font-medium">
            {university}
          </p>
        )}
      </div>
    </div>
  );
};

export default SimpleAchievementCard;
