// src/app/dashboard/components/DashboardClient.tsx
'use client'
import type { UserProfile } from "../page";
import AdminView from "./AdminView";         // Akan kita buat
import TeacherView from "./TeacherView";       // Akan kita buat
import StudentView from "./StudentView";       // Akan kita buat

export default function DashboardClient({ userProfile }: { userProfile: UserProfile }) {
  
  const renderContent = () => {
    switch (userProfile.role) {
      case 'ADMIN':
        return <AdminView />;
      case 'GURU':
        return <TeacherView userProfile={userProfile} />;
      case 'SISWA':
        return <StudentView userProfile={userProfile} />;
      default:
        return <div>Error: Invalid user role.</div>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}> {/* Sesuaikan tinggi jika perlu */}
      <aside style={{ width: '250px', backgroundColor: '#f4f4f4', padding: '1.5rem', borderRight: '1px solid #ddd' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>BimbelApp</h2>
        <div style={{ marginBottom: '2rem' }}>
          <p>
            Selamat Datang, <strong>{userProfile.name || userProfile.username}</strong>
          </p>
          <p style={{ 
            padding: '4px 8px', backgroundColor: '#e9ecef', 
            borderRadius: '4px', display: 'inline-block', fontSize: '0.9rem'
          }}>
            Peran: {userProfile.role}
          </p>
        </div>
        <nav>
          {/* Menu navigasi dinamis bisa ditambahkan di sini */}
          <ul>
            <li>Menu Item 1</li>
            <li>Menu Item 2</li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {renderContent()}
      </main>
    </div>
  );
}