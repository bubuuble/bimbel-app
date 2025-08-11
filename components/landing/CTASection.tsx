// FILE: components/landing/CTASection.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto text-center max-w-4xl">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
          Siap Meraih Prestasi Terbaik Bersama Kami?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Bergabunglah dengan ribuan siswa yang telah merasakan peningkatan prestasi belajar yang signifikan bersama Bimbel Master.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">
              Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">Pelajari Lebih Lanjut</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;