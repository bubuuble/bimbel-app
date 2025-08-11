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
        <section className="py-20 px-6 bg-neutral-50">
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left content */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm text-neutral-600 font-medium">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                Program unggulan
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
                                Metode pembelajaran yang <span className="text-neutral-600">terbukti efektif</span>
                            </h2>
                            
                            <p className="text-lg text-neutral-600 leading-relaxed">
                                Kombinasi pendekatan tradisional dan teknologi modern untuk memberikan pengalaman belajar yang optimal dan hasil yang memuaskan.
                            </p>
                        </div>
                        
                        <Button asChild size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-6 rounded-xl font-medium group">
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
                                    className="group bg-white p-6 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center group-hover:bg-neutral-900 transition-colors duration-300">
                                            <Icon className="w-6 h-6 text-neutral-600 group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-lg font-semibold text-neutral-900">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-neutral-600 leading-relaxed">
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