"use client";
import React from 'react';
import { BookOpen, Users, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ProductDetail: React.FC = () => {
    const features = [
        {
            icon: BookOpen,
            title: 'Kurikulum Adaptif',
            description: 'Materi pembelajaran yang disesuaikan dengan kemampuan dan kecepatan belajar setiap siswa secara individual.'
        },
        {
            icon: Users,
            title: 'Mentor Terpilih',
            description: 'Instruktur bersertifikat dengan track record mengajar yang terbukti di berbagai institusi pendidikan terkemuka.'
        },
        {
            icon: Trophy,
            title: 'Hasil Terukur',
            description: 'Sistem evaluasi komprehensif dengan laporan progres real-time untuk memantau perkembangan belajar.'
        }
    ];

    return (
        <section className="py-20 px-6" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.02) 0%, rgba(209,51,19,0.02) 100%)'}}>
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left content */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium border" 
                                 style={{borderColor: 'rgb(0,75,173)', color: 'rgb(0,75,173)'}}>
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'rgb(209,51,19)'}} />
                                Program unggulan
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{color: 'rgb(0,75,173)'}}>
                                Metode pembelajaran yang <span style={{color: 'rgb(209,51,19)'}}>terbukti efektif</span>
                            </h2>
                            
                            <p className="text-lg leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                                Kombinasi pendekatan tradisional dan teknologi modern untuk memberikan pengalaman belajar yang optimal dan hasil yang memuaskan.
                            </p>
                        </div>
                        
                        <Button asChild size="lg" 
                                className="px-8 py-6 rounded-xl font-medium group border-2 hover:shadow-lg transition-all duration-300 hover:bg-[rgb(189,46,17)]" 
                                style={{
                                    backgroundColor: 'rgb(209,51,19)', 
                                    borderColor: 'rgb(209,51,19)', 
                                    color: 'white'
                                }}>
                            <Link href="/product" className="inline-flex items-center gap-2">
                                Jelajahi Program
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                        </Button>
                    </div>
                    
                    {/* Right features */}
                    <div className="space-y-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div 
                                    key={index}
                                    className="group bg-white p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg brand-hover-card"
                                    style={{borderColor: 'rgba(0,75,173,0.1)'}}
                                >
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center brand-icon-hover"
                                             style={{backgroundColor: 'rgba(209,51,19,0.1)'}}>
                                            <Icon className="w-6 h-6 transition-colors duration-300" 
                                                  style={{color: 'rgb(209,51,19)'}} />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-lg font-semibold" style={{color: 'rgb(0,75,173)'}}>
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;