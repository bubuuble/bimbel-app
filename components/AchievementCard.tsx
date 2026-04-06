"use client";

import React from 'react';
import Image from 'next/image';
import { Award, GraduationCap, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface AchievementCardProps {
  name: string;
  achievementTitle: string; // e.g. "Lolos SNBT 2024"
  universityAccepted?: string; // e.g. "Kedokteran UI"
  school?: string; // e.g. "SMAN 8 Jakarta"
  imageUrl?: string;
  imageAlt?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  name,
  achievementTitle,
  universityAccepted,
  school,
  imageUrl,
  imageAlt,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative p-7 md:p-10 rounded-[3rem] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border-2 border-orange-200 dark:border-slate-800 transition-all duration-500 group"
    >
      
      {/* Dynamic Shimmer Effect Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[3rem]">
        <div className="absolute inset-y-0 -left-[100%] w-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent skew-x-[-25deg] group-hover:animate-shimmer" />
      </div>

      {/* Modern Background Accents */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-3xl group-hover:bg-orange-400/30 transition-colors" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-colors" />
      
      {/* Decorative Dots SVG */}
      <div className="absolute top-8 left-8 opacity-[0.07] dark:opacity-[0.05] pointer-events-none">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="currentColor">
          {[...Array(6)].map((_, r) => (
            [...Array(6)].map((_, c) => (
              <circle key={`${r}-${c}`} cx={r * 10 + 5} cy={c * 10 + 5} r="1.5" />
            ))
          ))}
        </svg>
      </div>

      {/* Header - Celebratory Badge */}
      <div className="relative z-10 flex flex-col items-center mb-8">
        <div className="mb-4 p-3 bg-orange-100 dark:bg-orange-950/30 rounded-2xl border border-orange-200 dark:border-orange-800 shadow-sm animate-bounce-subtle">
          <Trophy className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="text-center">
          <p className="text-[11px] md:text-sm font-black uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400 mb-1.5 flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3" /> SELAMAT ATAS KELULUSAN <Sparkles className="w-3 h-3" />
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-orange-300 dark:via-orange-800 to-transparent mx-auto" />
        </div>
      </div>

      {/* Main Student Section */}
      <div className="relative z-10 space-y-8 flex flex-col items-center">
        
        {/* Photo Container with Multi-layer Framing */}
        <div className="relative w-48 h-48 md:w-56 md:h-56">
          {/* Animated Outer Rings */}
          <div className="absolute inset-0 border-2 border-dashed border-orange-300 dark:border-orange-800/50 rounded-[2.5rem] animate-spin-slow opacity-60" />
          <div className="absolute -inset-2 border border-blue-200 dark:border-blue-900/30 rounded-[2.75rem] opacity-30" />
          
          <div className="absolute inset-2 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 p-1.5 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden group-hover:scale-105 transition-transform duration-500">
            <div className="relative w-full h-full rounded-[1.75rem] overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt || name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 192px, 224px"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <GraduationCap className="w-14 h-14 text-slate-200 dark:text-slate-800 mb-2" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Master Alumni</span>
                </div>
              )}
            </div>
          </div>

          {/* Floater Badge */}
          <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 transform rotate-12 group-hover:rotate-0 transition-all duration-300">
            <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Student Name Section */}
        <div className="w-full flex flex-col items-center">
          <div className="relative inline-block group/btn px-1">
            <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-400/5 rounded-2xl blur-lg group-hover:bg-blue-600/20 transition-all" />
            <div className="relative px-8 py-3 bg-blue-600 dark:bg-blue-700 rounded-2xl border border-blue-500 dark:border-blue-600 shadow-xl shadow-blue-600/20 group-hover:translate-y-[-2px] transition-all">
              <h3 className="font-extrabold text-lg md:text-2xl text-white text-center leading-none tracking-tight">
                {name}
              </h3>
            </div>
            {/* Glossy Reflection for Banner */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-white/20 rounded-t-2xl pointer-events-none" />
          </div>
        </div>

        {/* Detail Information Box */}
        <div className="w-full max-w-[320px] bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-800/40 dark:to-slate-900/60 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-5 shadow-inner">
          <div className="flex flex-col items-center space-y-2">
            <p className="font-black text-blue-800 dark:text-blue-400 uppercase text-xs md:text-sm tracking-tight text-center leading-tight">
              {universityAccepted || achievementTitle}
            </p>
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Bimbel Master</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>
            <p className="text-[10px] md:text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
              {school || "SMA Pilihan"}
            </p>
          </div>
        </div>
      </div>

      {/* Styled Footer Ornaments */}
      <div className="absolute bottom-6 inset-x-0 px-10 flex justify-between items-center opacity-30 pointer-events-none hidden md:flex">
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-800" />
        <span className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Class of 2024</span>
        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-800" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default AchievementCard;
