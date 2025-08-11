// FILE: components/landing/ProgramOutcomesSection.tsx

'use client'
import React from 'react';
import { Award, Briefcase, Rocket, type LucideIcon } from 'lucide-react';

// Mapping dari string ke komponen ikon
const iconMap = { 
    Award: Award, 
    Briefcase: Briefcase, 
    Rocket: Rocket 
};

// Tipe data ini akan menerima _key dari Sanity
export interface Outcome { 
    _key: string;
    icon: keyof typeof iconMap; 
    title: string; 
    description: string; 
}

export default function ProgramOutcomesSection({ outcomes }: { outcomes: Outcome[] }) {

    return (
        <section className="py-20 px-6 bg-neutral-50">
            <div className="container mx-auto">
                
                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm text-neutral-600 font-medium">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        Target pencapaian
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight max-w-4xl mx-auto">
                        Capaian yang akan kamu dapatkan setelah bergabung
                    </h2>
                    
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                        Bukan hanya belajar teori, kami mempersiapkan kamu dengan keterampilan praktis yang dibutuhkan untuk sukses di masa depan.
                    </p>
                </div>

                {(!outcomes || outcomes.length === 0) ? (
                    <div className="text-center">
                        <div className="bg-white p-8 rounded-2xl border border-neutral-200 max-w-md mx-auto">
                            <p className="text-neutral-600">Detail capaian program akan segera tersedia. Pantau terus update dari kami.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {outcomes.map((outcome, index) => {
                            const Icon = iconMap[outcome.icon] || Award;
                            return (
                                <div 
                                    key={`outcome-${index}-${outcome._key || outcome.title}`} 
                                    className="group bg-white p-8 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div className="space-y-4">
                                        <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center group-hover:bg-neutral-900 transition-colors duration-300">
                                            <Icon className="w-7 h-7 text-neutral-600 group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors duration-200">
                                                {outcome.title}
                                            </h3>
                                            <p className="text-neutral-600 leading-relaxed">
                                                {outcome.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}