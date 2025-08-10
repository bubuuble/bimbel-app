// FILE: app/dashboard/components/MarkAsReadButton.tsx

'use client'
import { markNotificationAsRead } from "@/lib/actions";
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function MarkAsReadButton({ notificationId }: { notificationId: string }) {
    let [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleClick = () => {
        startTransition(async () => {
            await markNotificationAsRead(notificationId);
            // Secara manual memicu refresh pada data yang ditampilkan di dalam modal.
            // Ini diperlukan karena revalidatePath di server action tidak selalu
            // memicu refresh pada Server Component yang dirender di dalam Client Component.
            router.refresh(); 
        });
    };

    return (
        <button onClick={handleClick} disabled={isPending} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
            {isPending ? '...' : 'Tandai sudah dibaca'}
        </button>
    );
}