// FILE: components/landing/StatCard.tsx (REVISED FOR NEW DESIGN)

'use client';
import { Award, CheckCircle, Star, Users, type LucideIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const iconMap = {
    Award: Award,
    CheckCircle: CheckCircle,
    Star: Star,
    Users: Users
};

export type StatCardData = {
    id: string;
    icon: keyof typeof iconMap;
    value: string;
    label: string;
    position: string;
    color: 'blue' | 'orange' | 'green' | 'yellow';
    // Properti baru untuk mengontrol layout
    layout: 'vertical' | 'horizontal'; 
};

// Warna baru yang lebih lembut, fokus pada warna ikon
const colorClasses = {
    blue: { icon: 'text-blue-500', bg: 'bg-blue-100', line: 'bg-blue-500' },
    orange: { icon: 'text-orange-500', bg: 'bg-orange-100', line: 'bg-orange-500' },
    green: { icon: 'text-green-500', bg: 'bg-green-100', line: 'bg-green-500' },
    yellow: { icon: 'text-yellow-500', bg: 'bg-yellow-100', line: 'bg-yellow-500' },
};

export default function StatCard({ card }: { card: StatCardData }) {
    const Icon = iconMap[card.icon];
    const colors = colorClasses[card.color];
    const [isClient, setIsClient] = useState(false);
    const [animationDelay, setAnimationDelay] = useState('0s');
    
    useEffect(() => {
        setIsClient(true);
        setAnimationDelay(`${Math.random() * -2.5}s`);
    }, []);
    
    // Layout Horizontal
    if (card.layout === 'horizontal') {
        return (
            <div 
                className={`absolute ${card.position} bg-white/80 backdrop-blur-md rounded-full shadow-lg p-3 flex items-center gap-3 animate-float w-max z-20`}
                style={isClient ? { animationDelay } : {}}
            >
                <div className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <span className="font-semibold text-sm text-gray-800">{card.value}</span>
                <span className="text-sm text-gray-500 -ml-2">{card.label}</span>
            </div>
        );
    }

    // Layout Vertikal (Default)
    return (
        <div 
            className={`absolute ${card.position} bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 text-center animate-float w-40 z-20`}
            style={isClient ? { animationDelay } : {}}
        >
            <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mx-auto`}>
                <Icon className={`w-7 h-7 ${colors.icon}`} />
            </div>
            <p className="font-bold text-lg text-gray-900 mt-2">{card.value}</p>
            <p className="text-sm text-gray-600 -mt-1">{card.label}</p>
            <div className={`w-8 h-1 ${colors.line} rounded-full mt-2 mx-auto`}></div>
        </div>
    );
}