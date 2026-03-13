// FILE: app/dashboard/components/NotificationData.tsx

import { createClient } from "@/lib/supabase/server";
import MarkAsReadButton from "./MarkAsReadButton";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, ExternalLink } from "lucide-react";

export default async function NotificationData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    // Ambil semua notifikasi, yang terbaru di atas
    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-4">
            {notifications && notifications.length > 0 ? (
                notifications.map(notif => (
                    <div key={notif.id} className={`bg-white rounded-2xl border shadow-sm transition-all overflow-hidden ${
                        !notif.is_read ? 'border-indigo-100 ring-1 ring-indigo-50/50' : 'border-slate-100'
                    }`}>
                        <div className={`p-5 sm:p-6 ${!notif.is_read ? 'bg-indigo-50/30' : ''}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${!notif.is_read ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <Bell className="h-4 w-4" />
                                        </div>
                                        {!notif.is_read && (
                                            <Badge className="bg-indigo-100 hover:bg-indigo-100 text-indigo-700 border-none font-medium px-2 py-0.5 rounded-md text-xs">
                                                Baru
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-slate-800 mb-1">
                                        {notif.message}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(notif.created_at).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100/60">
                                {notif.link && (
                                    <Button variant="outline" size="sm" asChild className="h-9 rounded-lg shadow-sm border-slate-200">
                                        <Link href={notif.link} className="flex items-center gap-2 text-slate-700">
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            Lihat Detail
                                        </Link>
                                    </Button>
                                )}
                                {!notif.is_read && (
                                    <MarkAsReadButton notificationId={notif.id} />
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mx-auto mb-4 border border-slate-100 shadow-sm">
                        <Bell className="h-7 w-7" />
                    </div>
                    <p className="text-slate-500 font-medium">Tidak ada notifikasi.</p>
                </div>
            )}
        </div>
    );
}