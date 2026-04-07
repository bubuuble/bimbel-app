"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Award, Star, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function TestimoniJuaraPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const dummyJuaraTestimonials = [
    { id: 1, name: "Siswa Juara 1", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+1" },
    { id: 2, name: "Siswa Juara 2", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+2" },
    { id: 3, name: "Siswa Juara 3", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+3" },
    { id: 4, name: "Siswa Juara 4", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+4" },
    { id: 5, name: "Siswa Juara 5", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+5" },
    { id: 6, name: "Siswa Juara 6", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+6" },
    { id: 7, name: "Siswa Juara 7", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+7" },
    { id: 8, name: "Siswa Juara 8", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+8" },
    { id: 9, name: "Siswa Juara 9", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+9" },
    { id: 10, name: "Siswa Juara 10", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+10" },
    { id: 11, name: "Siswa Juara 11", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+11" },
    { id: 12, name: "Siswa Juara 12", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+12" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-20">
      <div className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/testimoni" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors mb-6 font-medium bg-white/50 px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-slate-100">
            <ChevronLeft className="w-4 h-4" /> Kembali ke Testimoni
          </Link>
          
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-orange-100 rounded-2xl text-orange-600 shadow-sm border border-orange-200">
                  <Award className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-heading tracking-tight">Kisah <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">Juara</span></h1>
              </div>
              <p className="text-slate-600 text-lg md:text-xl max-w-2xl mt-4">Lihat prestasi luar biasa dan cerita inspiratif peraih medali & juara kelas dari program bimbingan kami.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dummyJuaraTestimonials.map((item, i) => (
              <Card 
                key={item.id} 
                className="border-[6px] border-white shadow-lg overflow-hidden rounded-[2rem] h-[380px] flex items-center justify-center relative group hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
                onClick={() => setSelectedImage(item.image)}
              >
                <CardContent className="p-0 flex items-center justify-center h-full w-full bg-orange-50">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="relative z-10 flex flex-col items-center justify-end h-full pb-6 w-full gap-2 opacity-90">
                    <Star className="w-8 h-8 text-orange-400 fill-orange-400" />
                    <div className="text-white font-bold px-4 text-center">{item.name}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent showCloseButton={false} className="max-w-[90vw] md:max-w-4xl p-0 bg-transparent border-0 shadow-none flex justify-center items-center pointer-events-none">
          <DialogTitle className="sr-only">Preview Gambar Testimoni Juara</DialogTitle>
          {selectedImage && (
            <div className="relative inline-flex items-center justify-center max-w-full max-h-[85vh] pointer-events-auto">
              <img 
                src={selectedImage} 
                alt="Preview Testimoni" 
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 bg-white/70 hover:bg-white backdrop-blur-md p-2 rounded-full shadow-xl hover:scale-110 transition-all duration-300 z-50 group border border-white/50"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-slate-700 group-hover:text-rose-500 transition-colors" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}