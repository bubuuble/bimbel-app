"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { alert } from "@/lib/alerts";
import { Trash2, ArrowLeft, Loader2, Info } from "lucide-react";
import { useMidtransSnap } from "@/lib/hooks/useMidtransSnap";
import { useCartStore } from "@/lib/store/useCartStore";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";

export default function CartPage() {
  const { cartItem, clearCartItem } = useCartStore();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const snap = useMidtransSnap();
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthLoading(false);
    };
    checkUser();
  }, []);

  const handlePayment = async () => {
    if (!cartItem) return;
    if (isAuthLoading) return;
    if (!user) {
      alert.warning("Login Diperlukan", "Anda harus login terlebih dahulu untuk checkout.");
      router.push('/login');
      return;
    }

    setIsProcessingPayment(true);
    try {
      const response = await fetch('/api/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: cartItem._id,
          productName: cartItem.title,
          price: cartItem.price,
          classId: cartItem.supabaseClassId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal membuat transaksi.");
      }

      const { token } = await response.json();

      snap.pay(token, {
        onSuccess: (result: any) => { 
          alert.success("Pembayaran Berhasil", "Transaksi Anda berhasil diproses. Anda akan dialihkan ke halaman kelas.");
          clearCartItem();
          setTimeout(() => {
            window.location.href = '/dashboard/kelas';
          }, 2000);
        },
        onPending: (result: any) => { 
          alert.info("Pembayaran Diproses", "Pembayaran Anda sedang diproses. Silahkan tunggu.");
        },
        onError: (result: any) => { 
          alert.error("Pembayaran Gagal", "Pembayaran Anda gagal diproses. Silahkan coba lagi.");
        },
        onClose: () => { 
          console.log('customer closed the popup'); 
        },
      });
    } catch (error: any) {
      console.error("Payment Error:", error);
      alert.error("Error", error.message || "Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <main className="min-h-screen bg-background/50 pt-32 pb-24 px-4">
      <div className="container max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-8 pl-0 hover:text-primary hover:bg-transparent"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </Button>

        <h1 className="text-3xl font-extrabold text-foreground mb-8">Keranjang Belanja</h1>

        {!cartItem ? (
          <div className="bg-card border border-border/50 rounded-2xl p-12 text-center shadow-sm">
            <Info className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Keranjang Anda Kosong</h2>
            <p className="text-foreground/70 mb-6">Silakan pilih program bimbingan terlebih dahulu.</p>
            <Button onClick={() => router.push('/product')} className="rounded-full">
              Lihat Program Bimbingan
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cart Item */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-6">
              <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden bg-muted">
                {(cartItem.featuredImage || cartItem.pricelistImage) ? (
                  <Image
                    src={urlForImage((cartItem.featuredImage || cartItem.pricelistImage) as any).url()}
                    alt={cartItem.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                    No Image
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-foreground pr-8">{cartItem.title}</h2>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={clearCartItem}
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 -mt-2 -mr-2"
                      title="Hapus dari keranjang"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-foreground/70 line-clamp-2 text-sm">{typeof cartItem.description === 'string' ? cartItem.description : 'Program bimbingan komprehensif.'}</p>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    1 Item (Maksimal)
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-foreground/50 block mb-1">Total Harga</span>
                    <span className="text-3xl font-extrabold text-primary">
                      Rp {cartItem.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary / Checkout CTA */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border/50 pb-4">Ringkasan Pesanan</h3>
              
              <div className="space-y-3 mb-6 font-medium">
                <div className="flex justify-between text-foreground/80">
                  <span>Subtotal ({cartItem.title})</span>
                  <span>Rp {cartItem.price.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-foreground/80 pb-3 border-b border-border/50">
                  <span>Pajak & Biaya Layanan</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-primary">Rp {cartItem.price.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-lg rounded-xl shadow-lg hover:shadow-primary/25 transition-all space-x-2"
                onClick={handlePayment}
                disabled={isProcessingPayment || isAuthLoading}
              >
                {isProcessingPayment || isAuthLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : null}
                <span>{isProcessingPayment ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}</span>
              </Button>

              <div className="mt-4 text-center">
                <span className="text-xs text-foreground/40 flex items-center justify-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Pembayaran diproses secara aman oleh Midtrans
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
