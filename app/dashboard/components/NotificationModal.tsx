// FILE: app/dashboard/components/NotificationModal.tsx

'use client'

export default function NotificationModal({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div 
      onClick={onClose} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      {/* Modal Content */}
      <div 
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat diklik di dalam
        style={{
          position: 'fixed',
          top: '60px', // Sedikit di bawah header
          right: '20px',
          width: '400px',
          maxHeight: '80vh',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <header style={{ padding: '1rem', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
            Notifikasi
        </header>
        <div style={{ overflowY: 'auto', flex: 1 }}>
            {children}
        </div>
        <footer style={{ padding: '1rem', borderTop: '1px solid #ddd', textAlign: 'right' }}>
            <button onClick={onClose}>Tutup</button>
        </footer>
      </div>
    </div>
  );
}