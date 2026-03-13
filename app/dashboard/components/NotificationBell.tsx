// FILE: app/dashboard/components/NotificationBell.tsx

'use client'
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import MarkAsReadButton from "./MarkAsReadButton";
import Link from "next/link";

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const unreadCount = notifications.filter(n => !n.is_read).length;

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

  const channel = supabase.channel('notifications')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'notifications' },
      (payload) => {
        console.log('Perubahan notifikasi diterima!', payload);
        fetchNotifications();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
  }, [supabase]);

  // Close dropdown when clicking outside
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    setIsOpen(false);
    }
  };

  if (isOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
  }, [isOpen]);

  return (
  <div className="relative" ref={dropdownRef}>
    <Button
    variant="ghost"
    size="icon"
    onClick={() => setIsOpen(!isOpen)}
    className="relative"
    >
    <Bell className="h-5 w-5" />
    {unreadCount > 0 && (
      <Badge
      variant="destructive"
      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
      >
      {unreadCount > 99 ? '99+' : unreadCount}
      </Badge>
    )}
    </Button>

    {isOpen && (
      <div className="absolute right-0 top-12 w-80 bg-white shadow-xl border border-slate-100 rounded-2xl z-50 overflow-hidden text-left">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800">Notifikasi</h3>
        </div>
        <div className="p-0">
        {loading ? (
          <div className="p-6 text-center text-sm text-slate-500">
          Memuat notifikasi...
          </div>
        ) : notifications.length > 0 ? (
          <ScrollArea className="h-80">
          {notifications.map((notif, index) => (
            <div key={notif.id}>
            <div className={`p-4 transition-colors ${!notif.is_read ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
              <p className="text-sm text-slate-700 mb-1.5 leading-snug">{notif.message}</p>
              <p className="text-xs text-slate-400 mb-2">
              {new Date(notif.created_at).toLocaleString('id-ID')}
              </p>
              <div className="flex items-center gap-3">
              {notif.link && (
                <Link
                href={notif.link}
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                Lihat Detail
                </Link>
              )}
              {!notif.is_read && (
                <MarkAsReadButton notificationId={notif.id} />
              )}
              </div>
            </div>
            {index < notifications.length - 1 && <Separator className="bg-slate-50" />}
            </div>
          ))}
          </ScrollArea>
        ) : (
          <div className="p-6 text-center text-sm text-slate-500">
          Tidak ada notifikasi.
          </div>
        )}
        </div>
      </div>
    )}
  </div>
  );
}