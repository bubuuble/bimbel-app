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
        <section className="py-20 px-6" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.03) 0%, rgba(209,51,19,0.03) 100%)'}}>
            <div className="container mx-auto">
                
                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium border" 
                         style={{borderColor: 'rgb(0,75,173)', color: 'rgb(0,75,173)'}}>
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'rgb(209,51,19)'}} />
                        Target pencapaian
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-4xl mx-auto" style={{color: 'rgb(0,75,173)'}}>
                        Capaian yang akan kamu dapatkan setelah bergabung
                    </h2>
                    
                    <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                        Bukan hanya belajar teori, kami mempersiapkan kamu dengan keterampilan praktis yang dibutuhkan untuk sukses di masa depan.
                    </p>
                </div>

                {(!outcomes || outcomes.length === 0) ? (
                    <div className="text-center">
                        <div className="bg-white p-8 rounded-2xl border-2 max-w-md mx-auto" style={{borderColor: 'rgba(0,75,173,0.1)'}}>
                            <p style={{color: 'rgb(0,75,173)'}}>Detail capaian program akan segera tersedia. Pantau terus update dari kami.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {outcomes.map((outcome, index) => {
                            const Icon = iconMap[outcome.icon] || Award;
                            return (
                                <div 
                                    key={`outcome-${index}-${outcome._key || outcome.title}`} 
                                    className="group bg-white p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 brand-hover-card"
                                    style={{borderColor: 'rgba(0,75,173,0.1)'}}
                                >
                                    <div className="space-y-4">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center brand-icon-hover"
                                             style={{backgroundColor: 'rgba(209,51,19,0.1)'}}>
                                            <Icon className="w-7 h-7 transition-colors duration-300" 
                                                  style={{color: 'rgb(209,51,19)'}} />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-semibold group-hover:opacity-90 transition-opacity duration-200" style={{color: 'rgb(0,75,173)'}}>
                                                {outcome.title}
                                            </h3>
                                            <p className="leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
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