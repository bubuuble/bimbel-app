// FILE: app/dashboard/components/StudentClassView.tsx (KODE LENGKAP)

import type { User } from "@supabase/supabase-js";
import type { Class, Material, Submission } from "@/lib/types";
import SubmissionForm from "./SubmissionForm";
import StudentAttendance from "./StudentAttendance";

type Props = {
  user: User;
  classInfo: Pick<Class, 'id' | 'name' | 'description'>;
  materials: Material[];
  activeSession: { id: string, title: string | null, expires_at: string } | null;
  hasAttended: boolean;
  submissions: Pick<Submission, 'material_id' | 'id' | 'file_url'>[];
};

export default function StudentClassView({ user, classInfo, materials, activeSession, hasAttended, submissions }: Props) {
  const submissionMap = new Map(submissions.map(s => [s.material_id, s]));
  const now = new Date(); // Waktu saat ini untuk perbandingan deadline

  return (
    <>
      {/* Komponen Absensi Siswa */}
      <StudentAttendance
        classId={classInfo.id}
        activeSession={activeSession}
        hasAttended={hasAttended}
      />

      <hr style={{ margin: '2rem 0' }} />

      {/* Daftar Materi & Tugas */}
      <div>
        <h2>Materi & Tugas</h2>
        {materials && materials.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {materials.map(material => {
              const hasDeadline = material.is_task && material.deadline;
              const deadlineDate = hasDeadline ? new Date(material.deadline!) : null;
              const isOverdue = hasDeadline && deadlineDate! < now;
              
              return (
                <li key={material.id} style={{ padding: '1rem', border: '1px solid #ddd', marginBottom: '1rem', borderRadius: '8px' }}>
                  <h3 style={{ marginTop: 0 }}>{material.title}</h3>
                  {material.description && <p>{material.description}</p>}
                  
                  {hasDeadline && (
                    <div style={{ 
                      padding: '8px 12px', 
                      marginBottom: '1rem', 
                      borderRadius: '4px',
                      backgroundColor: isOverdue ? '#fff0f1' : '#e7f3ff',
                      border: `1px solid ${isOverdue ? '#dc3545' : '#007bff'}` 
                    }}>
                      <strong style={{ color: isOverdue ? '#dc3545' : '#007bff' }}>
                        {/* TIDAK ADA PERUBAHAN DI SINI, KARENA INI SUDAH BENAR */}
                        {/* toLocaleString tanpa timeZone akan otomatis mengonversi ke waktu lokal browser */}
                        Deadline: {deadlineDate!.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                      </strong>
                      {isOverdue && <span style={{ marginLeft: '10px', fontWeight: 'bold', color: '#dc3545' }}>(TERLAMBAT)</span>}
                    </div>
                  )}

                  {material.file_url && (
                    <a href={material.file_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginBottom: '1rem', fontWeight: 'bold' }}>
                      Lihat Materi/Soal
                    </a>
                  )}

                  {material.is_task && (
                    <SubmissionForm
                      materialId={material.id}
                      studentId={user.id}
                      classId={classInfo.id}
                      existingSubmission={submissionMap.get(material.id) || null}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        ) : ( <p>Belum ada materi atau tugas yang diunggah untuk kelas ini.</p> )}
      </div>
    </>
  );
}