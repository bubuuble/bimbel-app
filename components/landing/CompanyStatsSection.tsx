// FILE: components/landing/CompanyStatsSection.tsx
'use client';
import React, { useState, useEffect, useRef } from "react";
import * as LucideIcons from "lucide-react";

export interface CompanyStat { 
    _key: string; // Sanity menambahkan _key
    _id: string; 
    title: string; 
    targetValue: number; 
    suffix?: string; 
    isPercentage?: boolean; 
    icon: keyof typeof LucideIcons; 
}

const getLucideIcon = (iconName: keyof typeof LucideIcons | undefined) => {
  if (!iconName) return <LucideIcons.Activity className="w-10 h-10 text-blue-600" />;
  const Icon = LucideIcons[iconName] as React.ElementType;
  if (typeof Icon === "function") {
    return <Icon className="w-10 h-10 text-blue-600" />;
  }
  return <LucideIcons.Activity className="w-10 h-10 text-blue-600" />;
};

const StatCard = ({ stat, isVisible }: { stat: CompanyStat, isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const end = stat.targetValue || 0;
    const duration = 2000;
    const increment = end === 0 ? 0 : end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(stat.isPercentage ? parseFloat(start.toFixed(1)) : Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [isVisible, stat]);

  const formatNumber = (num: number) => {
    if (stat.isPercentage) return `${num.toFixed(1)}${stat.suffix || "%"}`;
    return `${Math.round(num).toLocaleString()}${stat.suffix || ""}`;
  };
  
  return (
    <div className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
          {getLucideIcon(stat.icon)}
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">
        {formatNumber(count)}
      </div>
      <div className="text-gray-600 font-medium">
        {stat.title}
      </div>
    </div>
  );
};

export default function CompanyStatsSection({ stats }: { stats: CompanyStat[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { 
        if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
        }
    }, { threshold: 0.3 });
    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pencapaian Kami dalam Angka
          </h2>
          <p className="text-gray-600 text-lg">Dipercaya oleh ratusan siswa dan orang tua.</p>
        </div>
        {stats && stats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <StatCard key={stat._key || stat._id} stat={stat} isVisible={isVisible} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Statistik belum tersedia.</p>
        )}
      </div>
    </section>
  );
}