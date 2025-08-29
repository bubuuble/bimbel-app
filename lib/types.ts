// FILE: lib/types.ts

// Tipe dasar untuk profil pengguna
// [PERBAIKAN] - Tambahkan semua kolom dari tabel 'profiles' di sini
export type UserProfile = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null; // Tambahkan ini
  role: 'ADMIN' | 'GURU' | 'SISWA';
  place_of_birth?: string | null; // Tambahkan semua field data diri
  date_of_birth?: string | null;
  religion?: string | null;
  school_origin?: string | null;
  grade?: string | null;
  address?: string | null;
  phone_number?: string | null;
  parent_name?: string | null;
  parent_phone_number?: string | null;
};

// Tipe untuk tabel 'classes'
export type Class = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  teacher_id: string;
};

export type MaterialFile = {
  id: number;
  file_name: string;
  file_url: string;
};

// Tipe untuk tabel 'materials'
export type Material = {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  class_id: string;
  is_task: boolean;
  deadline: string | null;
  material_files: MaterialFile[]; 
};

// Tipe untuk tabel 'attendance_sessions'
export type AttendanceSession = {
  id: string;
  class_id: string;
  session_date: string;
  created_at: string;
  title: string;
  start_time: string;
  expires_at: string | null;
};

// Tipe untuk tabel 'submissions'
export type Submission = {
  id: number;
  created_at: string;
  student_id: string;
  material_id: string;
  class_id: string;
  file_url: string | null;
  text_content: string | null;
  grade: number | null;
  feedback: string | null;
};