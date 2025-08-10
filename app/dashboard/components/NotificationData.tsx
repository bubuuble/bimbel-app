// FILE: app/dashboard/components/NotificationData.tsx

import { createClient } from "@/lib/supabase/server";
import MarkAsReadButton from "./MarkAsReadButton";
import Link from "next/link";

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
        <div>
            {notifications && notifications.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {notifications.map(notif => (
                        <div key={notif.id} style={{ 
                            padding: '1rem', 
                            borderBottom: '1px solid #eee',
                            backgroundColor: notif.is_read ? 'transparent' : '#f7faff' 
                        }}>
                            <p style={{ margin: 0 }}>{notif.message}</p>
                            <small>{new Date(notif.created_at).toLocaleString()}</small>
                            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                {notif.link && <Link href={notif.link}>Lihat Detail</Link>}
                                {!notif.is_read && <MarkAsReadButton notificationId={notif.id} />}
                            </div>
                        </div>
                    ))}
                </div>
            ) : <p style={{ padding: '1rem' }}>Tidak ada notifikasi.</p>}
        </div>
    );
}