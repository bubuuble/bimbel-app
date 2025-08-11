'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations = {
  id: {
    // Dashboard
    'dashboard.admin': 'Panel Admin',
    'dashboard.teacher': 'Dashboard Guru',
    'dashboard.student': 'Portal Siswa',
    'dashboard.welcome': 'Selamat datang',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.classes': 'Kelas',
    'nav.users': 'Pengguna',
    'nav.attendance': 'Kehadiran',
    'nav.logout': 'Keluar',
    'nav.profile': 'Profil',
    
    // Classes
    'classes.title': 'Daftar Kelas',
    'classes.create': 'Buat Kelas Baru',
    'classes.upload': 'Upload Materi',
    'classes.students': 'Siswa Terdaftar',
    'classes.materials': 'Materi dan Tugas',
    'classes.delete': 'Hapus Kelas',
    'classes.my': 'Kelas Saya',
    
    // Teacher
    'teacher.dashboard': 'Dashboard Guru',
    'teacher.welcome': 'Selamat datang kembali',
    'teacher.overview': 'Berikut adalah ringkasan pengajaran Anda.',
    'teacher.stats.error': 'Gagal memuat statistik.',
    'teacher.stats.totalClasses': 'Total Kelas',
    'teacher.stats.totalStudents': 'Total Siswa',
    'teacher.stats.totalTasks': 'Total Tugas',
    'teacher.stats.needGrading': 'Perlu Dinilai',
    'teacher.stats.classesYouTeach': 'Kelas yang Anda ajar',
    'teacher.stats.uniqueStudents': 'Siswa unik di semua kelas',
    'teacher.stats.tasksGiven': 'Tugas yang telah diberikan',
    'teacher.stats.awaitingGrade': 'Jawaban menunggu penilaian',
    
    // Student
    'student.dashboard': 'Portal Siswa',
    'student.welcome': 'Selamat datang kembali',
    'student.overview': 'Berikut adalah ringkasan kemajuan belajar Anda',
    'student.stats.attendance': 'Kehadiran',
    'student.stats.assignments': 'Tugas',
    'student.stats.classes': 'Kelas',
    'student.stats.average': 'Rata-rata',
    'student.stats.totalPresent': 'Total Hadir',
    'student.stats.completed': 'Selesai',
    'student.stats.enrolled': 'Terdaftar',
    'student.stats.grade': 'Nilai',
    'student.recentActivity': 'Aktivitas Terbaru',
    'student.myClasses': 'Kelas Saya',
    'student.viewAll': 'Lihat Semua',
    'student.noActivity': 'Belum ada aktivitas terbaru',
    'student.startLearning': 'Mulai belajar untuk melihat aktivitas Anda di sini',
    
    // Admin
    'admin.dashboard': 'Panel Admin',
    'admin.welcome': 'Selamat datang, Admin',
    'admin.overview': 'Berikut adalah ringkasan sistem Anda',
    'admin.stats.totalUsers': 'Total Pengguna',
    'admin.stats.totalStudents': 'Total Siswa',
    'admin.stats.totalTeachers': 'Total Guru',
    'admin.stats.registeredUsers': 'Pengguna terdaftar',
    'admin.stats.activeStudents': 'Siswa aktif',
    'admin.stats.activeTeachers': 'Guru aktif',
    
    // Common
    'common.save': 'Simpan',
    'common.cancel': 'Batal',
    'common.delete': 'Hapus',
    'common.edit': 'Edit',
    'common.view': 'Lihat',
    'common.loading': 'Memuat...',
    
    // Language
    'language.indonesian': 'Bahasa Indonesia',
    'language.english': 'English'
  },
  en: {
    // Dashboard
    'dashboard.admin': 'Admin Panel',
    'dashboard.teacher': 'Teacher Dashboard',
    'dashboard.student': 'Student Portal',
    'dashboard.welcome': 'Welcome',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.classes': 'Classes',
    'nav.users': 'Users',
    'nav.attendance': 'Attendance',
    'nav.logout': 'Logout',
    'nav.profile': 'Profile',
    
    // Classes
    'classes.title': 'Class List',
    'classes.create': 'Create New Class',
    'classes.upload': 'Upload Material',
    'classes.students': 'Enrolled Students',
    'classes.materials': 'Materials and Tasks',
    'classes.delete': 'Delete Class',
    'classes.my': 'My Classes',
    
    // Teacher
    'teacher.dashboard': 'Teacher Dashboard',
    'teacher.welcome': 'Welcome back',
    'teacher.overview': 'Here\'s your teaching overview.',
    'teacher.stats.error': 'Failed to load statistics.',
    'teacher.stats.totalClasses': 'Total Classes',
    'teacher.stats.totalStudents': 'Total Students',
    'teacher.stats.totalTasks': 'Total Tasks',
    'teacher.stats.needGrading': 'Need Grading',
    'teacher.stats.classesYouTeach': 'Classes you teach',
    'teacher.stats.uniqueStudents': 'Unique students across all classes',
    'teacher.stats.tasksGiven': 'Tasks that have been assigned',
    'teacher.stats.awaitingGrade': 'Answers awaiting grading',
    
    // Student
    'student.dashboard': 'Student Portal',
    'student.welcome': 'Welcome back',
    'student.overview': 'Here\'s your learning progress overview',
    'student.stats.attendance': 'Attendance',
    'student.stats.assignments': 'Assignments',
    'student.stats.classes': 'Classes',
    'student.stats.average': 'Average',
    'student.stats.totalPresent': 'Total Present',
    'student.stats.completed': 'Completed',
    'student.stats.enrolled': 'Enrolled',
    'student.stats.grade': 'Grade',
    'student.recentActivity': 'Recent Activity',
    'student.myClasses': 'My Classes',
    'student.viewAll': 'View All',
    'student.noActivity': 'No recent activity',
    'student.startLearning': 'Start learning to see your activity here',
    
    // Admin
    'admin.dashboard': 'Admin Panel',
    'admin.welcome': 'Welcome, Admin',
    'admin.overview': 'Here\'s your system overview',
    'admin.stats.totalUsers': 'Total Users',
    'admin.stats.totalStudents': 'Total Students',
    'admin.stats.totalTeachers': 'Total Teachers',
    'admin.stats.registeredUsers': 'Registered users',
    'admin.stats.activeStudents': 'Active students',
    'admin.stats.activeTeachers': 'Active teachers',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.loading': 'Loading...',
    
    // Language
    'language.indonesian': 'Bahasa Indonesia',
    'language.english': 'English'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'id' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['id']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
