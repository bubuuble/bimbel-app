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

export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'MATCHING' | 'ESSAY';

export type Test = {
  id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  total_questions: number;
  points_per_question: number;
  created_at: string;
};

export type MultipleChoiceOption = {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
};

export type TrueFalseStatement = {
  id: string;
  question_id: string;
  statement_text: string;
  is_true: boolean;
};

export type MatchingPrompt = {
    id: string;
    question_id: string;
    prompt_text: string;
}

export type MatchingOption = {
    id: string;
    question_id: string;
    option_text: string;
}

export type MatchingCorrectPair = {
    prompt_id: string;
    option_id: string;
}

// [PERBAIKAN UTAMA] Perbarui tipe Question untuk menyertakan semua relasi
export type Question = {
  id: string;
  test_id: string;
  question_text: string;
  type: QuestionType;
  // 'marks' sudah kita hapus dari sini, yang mana sudah benar
  sort_order: number;
  multiple_choice_options?: MultipleChoiceOption[];
  true_false_statements?: TrueFalseStatement[];
  matching_prompts?: MatchingPrompt[];
  matching_options?: MatchingOption[];
  matching_correct_pairs?: MatchingCorrectPair[];
  
  // Tambahkan relasi baru ini sebagai array (Supabase mengembalikannya sebagai array)
  essay_answer?: EssayAnswer;
};

export type TestSubmission = {
  id: string;
  test_id: string;
  class_id: string; // Tambahkan ini agar mudah query
  student_id: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  started_at: string;
  completed_at: string | null;
  total_score: number | null;
};

export type EssayAnswer = {
  id: string;
  question_id: string;
  answer_key: string;
  created_at: string;
};