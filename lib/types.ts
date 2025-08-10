// FILE: d:/Projects/bimbel-app/lib/types.ts

// Tipe dasar untuk profil pengguna
export type UserProfile = {
  id: string;
  name: string | null;
  username: string | null;
  role: 'ADMIN' | 'GURU' | 'SISWA';
};

// Tipe untuk tabel 'classes'
export type Class = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  teacher_id: string;
};

// Tipe untuk tabel 'materials'
export type Material = {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  file_url: string | null;
  file_type: string | null;
  class_id: string;
  is_task: boolean;
  deadline: string | null;
};

// Tipe untuk tabel 'attendance_sessions' (meski tidak dipakai, baik untuk ada)
export type AttendanceSession = {
  id: string;
  class_id: string;
  session_date: string; // YYYY-MM-DD
  created_at: string; // Timestamp
  title: string; // <-- Nama yang benar
  start_time: string; // Timestamp
  expires_at: string | null; // Timestamp
};

// Tipe untuk tabel 'submissions'
export type Submission = {
  id: string;
  created_at: string;
  student_id: string;
  material_id: string;
  file_url: string;
  submitted_at: string; // Asumsi ada kolom ini
};