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
        <section className="bg-gray-50 py-20 px-4">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Capaian Program Kami</h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                    Kami tidak hanya mengajar, kami menciptakan para juara dan mempersiapkan mereka untuk masa depan.
                </p>

                {(!outcomes || outcomes.length === 0) ? (
                    <p className="text-gray-500">Detail capaian program akan segera tersedia.</p>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {outcomes.map((outcome) => {
                            const Icon = iconMap[outcome.icon] || Award; // Fallback ke ikon Award
                            return (
                                <div key={outcome._key} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                                    <Icon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">{outcome.title}</h3>
                                    <p className="text-gray-600">{outcome.description}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}