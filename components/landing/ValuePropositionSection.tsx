// FILE: components/landing/ValuePropositionSection.tsx

'use client'
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

// Tipe data ini akan menerima _key dari Sanity
export interface Benefit { 
    _key: string;
    title: string; 
    description: string; 
}

export default function ValuePropositionSection({ title, benefits }: { title: string; benefits: Benefit[] }) {

    return (
        <section className="bg-white py-20 px-4">
            <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="relative w-full h-80 md:h-[450px] rounded-xl overflow-hidden">
                    <Image 
                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
                        alt="Suasana belajar kolaboratif di Bimbel Master"
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <h2 
                        className="text-3xl font-bold text-gray-900 mb-8" 
                        dangerouslySetInnerHTML={{ __html: title || "Keuntungan Bergabung Bersama Kami" }}
                    ></h2>

                    {(!benefits || benefits.length === 0) ? (
                        <p className="text-gray-500">Daftar keuntungan akan segera ditampilkan. Silakan cek kembali nanti.</p>
                    ) : (
                        <ul className="space-y-4">
                            {benefits.map((benefit) => (
                                <li key={benefit._key} className="flex items-start gap-4">
                                    <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-lg">{benefit.title}</h3>
                                        <p className="text-gray-600">{benefit.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
}