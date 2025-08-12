'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { UserProfile } from "@/lib/types";
import Link from "next/link";
import { BookOpen, Calendar, Target, TrendingUp, Clock, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/LanguageContext";

// --- Type Definitions ---
type StudentStats = {
  total_kehadiran: number;
  persentase_tugas: number;
  total_kelas: number;
  rata_rata_nilai: number;
};

type RecentActivity = {
  id: number;
  created_at: string;
  materials: {
    title: string;
    classes: {
      name: string;
    } | null;
  } | null;
};

export default function StudentView({ userProfile }: { userProfile: UserProfile }) {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data: statsData, error: statsError } = await supabase.rpc('get_student_dashboard_stats');
    if (statsData) setStats(statsData);
    if (statsError) console.error("Error fetching stats:", statsError);

    const { data: activityData } = await supabase
      .from('submissions')
      .select(`
        id, 
        created_at, 
        materials!inner ( 
          title, 
          classes!inner ( name ) 
        )
      `)
      .eq('student_id', userProfile.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .returns<RecentActivity[]>();
    if (activityData) setRecentActivities(activityData);

    const { data: enrolledClassesData } = await supabase
      .from('enrollments')
      .select(`classes ( id, name )`)
      .eq('student_id', userProfile.id);
    if (enrolledClassesData) setEnrolledClasses(enrolledClassesData);
    
    setLoading(false);
  }, [supabase, userProfile.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />
          <Skeleton className="h-4 w-32 sm:w-48" />
        </div>
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <Skeleton className="h-48 sm:h-64" />
          <Skeleton className="h-48 sm:h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t('student.welcome')}, {userProfile.name || 'Student'}!
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t('student.overview')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('student.stats.attendance')}</p>
                <p className="text-xl sm:text-2xl font-bold">{stats?.total_kehadiran || 0}</p>
                <p className="text-xs text-muted-foreground">{t('student.stats.totalPresent')}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t('student.stats.assignments')}</p>
                <p className="text-2xl font-bold">{stats?.persentase_tugas.toFixed(0) || 0}%</p>
                <p className="text-xs text-muted-foreground">{t('student.stats.completed')}</p>
              </div>
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Target className="h-4 w-4 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('student.stats.classes')}</p>
                <p className="text-xl sm:text-2xl font-bold">{stats?.total_kelas || 0}</p>
                <p className="text-xs text-muted-foreground">{t('student.stats.enrolled')}</p>
              </div>
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('student.stats.average')} Score</p>
                <p className="text-xl sm:text-2xl font-bold">{stats?.rata_rata_nilai.toFixed(1) || 0}</p>
                <p className="text-xs text-muted-foreground">Out of 100</p>
              </div>
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Award className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Activities */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              {t('student.recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-4 rounded-lg border">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-medium">
                        Assignment Submitted: <span className="text-blue-600">{activity.materials?.title}</span>
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {activity.materials?.classes?.name || 'N/A'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('student.noActivity')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('student.startLearning')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              {t('student.myClasses')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {enrolledClasses.length > 0 ? (
              <div className="space-y-3">
                {enrolledClasses.map((enrollment, index) => {
                  const classData = enrollment.classes;
                  if (!classData) return null;
                  return (
                    <Link
                      key={`${classData.id}-${index}`}
                      href={`/dashboard/class/${classData.id}`}
                      className="block p-3 rounded-lg border hover:border-primary hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="font-medium">{classData.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                <div className="space-y-2">
                  <p className="text-muted-foreground">No classes enrolled</p>
                  <Button asChild>
                    <Link href="/dashboard/classes">
                      {t('student.viewAll')} Classes
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}