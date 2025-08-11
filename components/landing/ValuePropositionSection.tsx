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
        <section className="py-20 px-6 bg-white">
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Image section */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
                            <Image 
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                                alt="Suasana belajar kolaboratif di Bimbel Master"
                                fill
                                className="object-cover"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </div>
                        
                        {/* Floating card */}
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-neutral-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Check className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900">95%</div>
                                    <div className="text-sm text-neutral-600">Tingkat kepuasan</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content section */}
                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full text-sm text-neutral-600 font-medium">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                Keunggulan kami
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
                                {title || "Mengapa memilih bimbingan bersama kami?"}
                            </h2>
                        </div>

                        {(!benefits || benefits.length === 0) ? (
                            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                                <p className="text-neutral-600">Daftar keunggulan akan segera ditampilkan. Silakan kembali lagi nanti.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={`benefit-${index}-${benefit._key || benefit.title}`} className="group flex gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors duration-200">
                                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
                                            <Check className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h3 className="font-semibold text-lg text-neutral-900 group-hover:text-neutral-700 transition-colors duration-200">
                                                {benefit.title}
                                            </h3>
                                            <p className="text-neutral-600 leading-relaxed">
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