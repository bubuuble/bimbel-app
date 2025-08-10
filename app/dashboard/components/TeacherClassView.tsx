// FILE: app/dashboard/components/TeacherClassView.tsx

import type { Class, Material, AttendanceSession } from "@/lib/types";
import { deleteMaterial } from "@/lib/actions";

import UploadMaterialForm from "./UploadMaterialForm";
import EnrolledStudentsList from "./EnrolledStudentsList";
import DeleteClassForm from "./DeleteClassForm";
import TeacherAttendanceManager from "./TeacherAttendanceManager";

type Props = {
  classInfo: Pick<Class, 'id' | 'name' | 'description'>;
  materials: Material[];
  initialSessions: AttendanceSession[];
};

export default function TeacherClassView({ classInfo, materials, initialSessions }: Props) {
  return (
    <>
      {/* Zona Berbahaya */}
      <div style={{ border: '1px solid #dc3545', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3 style={{ color: '#dc3545', marginTop: 0 }}>Zona Berbahaya (Admin/Guru)</h3>
        <DeleteClassForm classId={classInfo.id} />
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* Upload Materi */}
      <div style={{ marginBottom: '2rem' }}>
        <UploadMaterialForm classId={classInfo.id} />
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* Manajemen Absensi */}
      <TeacherAttendanceManager classId={classInfo.id} initialSessions={initialSessions} />

      <hr style={{ margin: '2rem 0' }} />

      {/* Daftar Materi & Tugas */}
      <div>
        <h2>Daftar Materi & Tugas</h2>
        {materials && materials.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {materials.map(material => (
              <li key={material.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                <a href={material.file_url!} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                  {material.title} {material.is_task ? ' (Tugas)' : ''}
                </a>
                <form action={deleteMaterial}>
                  <input type="hidden" name="materialId" value={material.id} />
                  <input type="hidden" name="fileUrl" value={material.file_url || ''} />
                  <input type="hidden" name="classId" value={classInfo.id} />
                  <button type="submit" style={{ marginLeft: '1rem', background: 'none', border: '1px solid red', color: 'red', fontSize: '0.8rem', padding: '4px 8px', cursor: 'pointer' }}>Hapus</button>
                </form>
              </li>
            ))}
          </ul>
        ) : ( <p>Belum ada materi yang diunggah untuk kelas ini.</p> )}
      </div>
      
      <hr style={{ margin: '2rem 0' }} />
      
      {/* Daftar Siswa Terdaftar */}
      <EnrolledStudentsList classId={classInfo.id} />
    </>
  );
}