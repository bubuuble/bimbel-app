// src/app/dashboard/guru/kelas/[classId]/AttendanceList.tsx (FIXED)
import { createClient } from "@/lib/supabase/server";

// --- DEKLARASIKAN TIPE DATA YANG KITA HARAPKAN ---
type EnrolledStudent = {
  profiles: {
    id: string;
    name: string | null;
    username: string | null;
  } | null;
};
// ----------------------------------------------

type Props = {
  classId: string;
};

export default async function AttendanceList({ classId }: Props) {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  // 1. Ambil semua siswa yang terdaftar
  const { data: enrolledStudents, error: studentsError } = await supabase
    .from('enrollments')
    .select(`profiles (id, name, username)`)
    .eq('class_id', classId)
    .returns<EnrolledStudent[]>(); // <-- Beri tahu TypeScript tipe datanya

  if (studentsError) {
    return <p>Error loading student list: {studentsError.message}</p>;
  }
  if (!enrolledStudents || enrolledStudents.length === 0) {
    return <p>No students are enrolled in this class yet.</p>;
  }

  // 2. Ambil semua catatan absensi untuk hari ini
  const { data: attendanceRecords, error: attendanceError } = await supabase
    .from('attendance_records')
    .select('student_id, status')
    .eq('class_id', classId)
    .eq('date', today);
  
  if (attendanceError) {
    return <p>Error loading attendance data: {attendanceError.message}</p>;
  }

  // 3. Proses data
  const attendanceMap = new Map(
    attendanceRecords.map(record => [record.student_id, record.status])
  );

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Daftar Kehadiran - {today}</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Nama Siswa</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Username</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* --- PERBAIKAN DI SINI --- */}
          {enrolledStudents.map(enrollment => {
            const student = enrollment.profiles;
            if (!student) return null; // Lewati jika data profil tidak ada

            const status = attendanceMap.get(student.id) || 'HADIR';

            return (
              <tr key={student.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{student.name}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{student.username}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold', 
                    color: status === 'HADIR' ? 'green' : 'red' }}>
                  {status}
                </td>
              </tr>
            );
          })}
          {/* --- AKHIR PERBAIKAN --- */}
        </tbody>
      </table>
    </div>
  );
}