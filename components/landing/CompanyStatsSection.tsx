// FILE: components/landing/CompanyStatsSection.tsx
'use client';
import React, { useState, useEffect, useRef } from "react";
import { Users, BookOpen, Award, UserCheck } from "lucide-react";

// Hardcode stats data dengan icon yang benar
const staticStats = [
    { 
      _id: '1', 
      title: 'Siswa Terdaftar', 
      targetValue: 1200, 
      icon: Users, 
      suffix: '+',
      description: 'Siswa aktif belajar bersama kami'
    },
    { 
      _id: '2', 
      title: 'Kelas Tersedia', 
      targetValue: 50, 
      icon: BookOpen, 
      suffix: '+',
      description: 'Program pembelajaran yang beragam'
    },
    { 
      _id: '3', 
      title: 'Tingkat Kelulusan', 
      targetValue: 95, 
      icon: Award, 
      isPercentage: true,
      description: 'Siswa berhasil mencapai target'
    },
    { 
      _id: '4', 
      title: 'Guru Profesional', 
      targetValue: 25, 
      icon: UserCheck, 
      suffix: '+',
      description: 'Tenaga pengajar berpengalaman'
    },
];

interface StatCardProps {
  stat: typeof staticStats[0];
  isVisible: boolean;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat, isVisible, index }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    const delay = index * 150;
    const startDelay = setTimeout(() => {
      let start = 0;
      const end = stat.targetValue;
      const duration = 1800;
      const increment = end / (duration / 16);

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
    }, delay);

    return () => clearTimeout(startDelay);
  }, [isVisible, stat, index]);

  const formatNumber = (num: number) => {
    if (stat.isPercentage) return `${num.toFixed(1)}${stat.suffix || "%"}`;
    return `${Math.round(num).toLocaleString()}${stat.suffix || ""}`;
  };

  const IconComponent = stat.icon;

  return (
    <div className="group text-center space-y-4 p-6">
      {/* Icon */}
      <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:transition-all duration-500 border-2" 
           style={{borderColor: 'rgb(0,75,173)'} as React.CSSProperties}
           onMouseEnter={(e) => {
             e.currentTarget.style.backgroundColor = 'rgb(0,75,173)';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.backgroundColor = 'rgba(0,75,173,0.1)';
           }}>
        <IconComponent className="w-7 h-7 transition-colors duration-500" 
                      style={{color: 'rgb(209,51,19)'}}
                      onMouseEnter={(e) => {
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.style.color = 'white';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgb(209,51,19)';
                      }} />
      </div>
      
      {/* Count */}
      <div className="space-y-1">
        <div className="text-3xl md:text-4xl font-bold tabular-nums" style={{color: 'rgb(0,75,173)'}}>
          {formatNumber(count)}
        </div>
        
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {stat.title}
        </h3>
        
        <p className="text-xs text-neutral-500 max-w-32 mx-auto leading-relaxed">
          {stat.description}
        </p>
      </div>
    </div>
  );
};

const CompanyStatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="container mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border" 
               style={{backgroundColor: 'rgba(0,75,173,0.05)', borderColor: 'rgb(0,75,173)', color: 'rgb(0,75,173)'}}>
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'rgb(209,51,19)'}} />
            Dipercaya lebih dari 1000+ siswa
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-3xl mx-auto leading-tight" style={{color: 'rgb(0,75,173)'}}>
            Pencapaian yang membanggakan bersama siswa-siswa terbaik
          </h2>
          
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{color: 'rgb(0,75,173)'}}>
            Hasil nyata dari komitmen kami dalam menghadirkan pendidikan berkualitas tinggi dan bimbingan yang personal.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {staticStats.map((stat, index) => (
            <StatCard 
              key={stat._id} 
              stat={stat} 
              isVisible={isVisible} 
              index={index}
            />
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="mt-16 flex justify-center">
          <div className="w-24 h-px" style={{background: 'linear-gradient(to right, transparent, rgb(0,75,173), transparent)'}} />
        </div>
      </div>
    </section>
  );
};

export default CompanyStatsSection;