// src/app/dashboard/components/EnrolledStudentsList.tsx
import { createClient } from "@/lib/supabase/server";

type EnrolledStudent = {
  profiles: { id: string; name: string | null; username: string | null; } | null;
};

export default async function EnrolledStudentsList({ classId }: { classId: string }) {
  const supabase = await createClient();

  const { data: enrolledStudents, error } = await supabase
    .from('enrollments')
    .select(`profiles (id, name, username)`)
    .eq('class_id', classId)
    .returns<EnrolledStudent[]>();

  if (error) {
    console.error("Error fetching enrolled students:", error);
    return <p style={{ color: 'red' }}>Error loading student list.</p>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Siswa Terdaftar ({enrolledStudents.length})</h2>
      {enrolledStudents.length > 0 ? (
        <ul style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>
          {enrolledStudents.map(enrollment => {
            const student = enrollment.profiles;
            if (!student) return null;
            return (
              <li key={student.id} style={{ marginBottom: '0.5rem' }}>
                <strong>{student.name}</strong> (@{student.username})
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Belum ada siswa yang mendaftar di kelas ini.</p>
      )}
    </div>
  );
}