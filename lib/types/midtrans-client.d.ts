declare module 'midtrans-client' {
  // Deklarasikan struktur dasar yang kita tahu dari dokumentasi
  export class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });

    createTransaction(parameter: any): Promise<{ token: string; redirect_url: string; }>;
    
  }

  export class CoreApi {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });
    transaction: {
      notification(notification: any): Promise<any>;
    };
  }

  // Jika ada modul lain yang diekspor, tambahkan di sini
  // export class CoreApi { ... }
}