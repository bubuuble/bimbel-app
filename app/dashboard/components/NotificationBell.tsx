// FILE: app/dashboard/components/NotificationBell.tsx (VERSI MANDIRI & BENAR)

'use client'
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client"; // <<-- PENTING: Gunakan client
import NotificationModal from "./NotificationModal";
import MarkAsReadButton from "./MarkAsReadButton";
import Link from "next/link";

// Tipe untuk notifikasi, didefinisikan secara lokal
type Notification = {
    id: string;
    message: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Fungsi untuk mengambil notifikasi dari client-side
  const fetchNotifications = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setNotifications(data || []);
      setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();

    // Dengarkan perubahan real-time
    const channel = supabase.channel('notifications')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'notifications' },
          (payload) => {
              console.log('Perubahan notifikasi diterima!', payload);
              // Saat ada perubahan, ambil ulang semua notifikasi
              fetchNotifications();
          }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div>
      <button onClick={() => setIsOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
        <span>🔔</span>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-5px', right: '-10px',
            backgroundColor: 'red', color: 'white',
            borderRadius: '50%', width: '20px', height: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', border: '2px solid white'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      <NotificationModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {loading ? <p style={{ padding: '1rem' }}>Memuat notifikasi...</p> : 
          notifications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {notifications.map(notif => (
                    <div key={notif.id} style={{ padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: notif.is_read ? 'transparent' : '#f7faff' }}>
                        <p style={{ margin: 0 }}>{notif.message}</p>
                        <small>{new Date(notif.created_at).toLocaleString()}</small>
                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                            {notif.link && <Link href={notif.link} onClick={() => setIsOpen(false)}>Lihat Detail</Link>}
                            {!notif.is_read && <MarkAsReadButton notificationId={notif.id} />}
                        </div>
                    </div>
                ))}
            </div>
          ) : <p style={{ padding: '1rem' }}>Tidak ada notifikasi.</p>
        }
      </NotificationModal>
    </div>
  );
}