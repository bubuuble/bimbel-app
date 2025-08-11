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
                    <Card key={notif.id} className={`transition-colors ${
                        !notif.is_read ? 'bg-blue-50 border-blue-200' : ''
                    }`}>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Bell className="h-4 w-4 text-muted-foreground" />
                                        {!notif.is_read && (
                                            <Badge variant="secondary" className="text-xs">
                                                Baru
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-foreground mb-2">
                                        {notif.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(notif.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                                {notif.link && (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={notif.link} className="flex items-center gap-2">
                                            <ExternalLink className="h-3 w-3" />
                                            Lihat Detail
                                        </Link>
                                    </Button>
                                )}
                                {!notif.is_read && (
                                    <MarkAsReadButton notificationId={notif.id} />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Tidak ada notifikasi.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}