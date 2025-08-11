// FILE: components/landing/PricingSection.tsx
'use client'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

export interface Feature { text: string; included: boolean; }
export interface Package { name: string; price: string; price_period: string; description: string; features: Feature[]; isFeatured?: boolean; }

export default function PricingSection({ packages }: { packages: Package[] }) {
    if (!packages || packages.length === 0) return null;

    return (
        <section className="bg-white py-20 px-4">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Paket yang Bisa Kamu Pilih</h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                    Pilih paket yang paling sesuai dengan kebutuhan belajar Anda.
                </p>
                <div className="flex justify-center items-start gap-8 flex-wrap">
                    {packages.map((pkg, index) => (
                        <div key={index} className={`bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border-2 ${pkg.isFeatured ? 'border-blue-600' : 'border-gray-200'}`}>
                            <h3 className="text-2xl font-bold">{pkg.name}</h3>
                            <div className="my-6">
                                <span className="text-4xl font-extrabold">{pkg.price}</span>
                                <span className="text-gray-500">{pkg.price_period}</span>
                            </div>
                            <Button asChild size="lg" className="w-full">
                                <Link href="/register">Ambil Sekarang</Link>
                            </Button>
                            <ul className="text-left mt-8 space-y-4">
                                {pkg.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-center gap-3">
                                        {feature.included 
                                            ? <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            : <X className="h-5 w-5 text-red-400 flex-shrink-0" />
                                        }
                                        <span className={!feature.included ? 'text-gray-400 line-through' : ''}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}