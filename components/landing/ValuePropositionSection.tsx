// FILE: components/landing/ValuePropositionSection.tsx

'use client'
import Image from 'next/image';
import { Check } from 'lucide-react';

// Tipe data ini akan menerima _key dari Sanity
export interface Benefit { 
    _key: string;
    title: string; 
    description: string; 
}

export default function ValuePropositionSection({ title, benefits }: { title: string; benefits: Benefit[] }) {

    return (
        <section className="py-20 px-6" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.02) 0%, rgba(209,51,19,0.02) 100%)'}}>
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Image section */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
                            <Image 
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                                alt="Suasana belajar kolaboratif di Bimbel Master"
                                fill
                                className="object-cover"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(0,75,173,0.3), transparent)'}} />
                        </div>
                        
                        {/* Floating card */}
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border-2" style={{borderColor: 'rgb(0,75,173)'}}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: 'rgba(209,51,19,0.1)'}}>
                                    <Check className="w-6 h-6" style={{color: 'rgb(209,51,19)'}} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold" style={{color: 'rgb(0,75,173)'}}>95%</div>
                                    <div className="text-sm" style={{color: 'rgb(0,75,173)'}}>Tingkat kepuasan</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content section */}
                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border" 
                                 style={{backgroundColor: 'rgba(0,75,173,0.05)', borderColor: 'rgb(0,75,173)', color: 'rgb(0,75,173)'}}>
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'rgb(209,51,19)'}} />
                                Keunggulan kami
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{color: 'rgb(0,75,173)'}}>
                                {title || "Mengapa memilih bimbingan bersama kami?"}
                            </h2>
                        </div>

                        {(!benefits || benefits.length === 0) ? (
                            <div className="p-6 rounded-2xl border-2" style={{backgroundColor: 'rgba(0,75,173,0.02)', borderColor: 'rgba(0,75,173,0.1)'}}>
                                <p style={{color: 'rgb(0,75,173)'}}>Daftar keunggulan akan segera ditampilkan. Silakan kembali lagi nanti.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={`benefit-${index}-${benefit._key || benefit.title}`} 
                                         className="group flex gap-4 p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-2 brand-hover-card">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1" 
                                             style={{backgroundColor: 'rgba(209,51,19,0.1)'}}>
                                            <Check className="w-4 h-4" style={{color: 'rgb(209,51,19)'}} />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h3 className="font-semibold text-lg group-hover:opacity-90 transition-opacity duration-200" style={{color: 'rgb(0,75,173)'}}>
                                                {benefit.title}
                                            </h3>
                                            <p className="leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}