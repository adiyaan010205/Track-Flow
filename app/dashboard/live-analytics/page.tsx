"use client";
import PomodoroTimer from '@/components/time-tracking/PomodoroTimer'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ActivityFeed from '@/components/dashboard/activity-feed'

const LiveAnalyticsCharts = dynamic(() => import('./LiveAnalyticsCharts'), { ssr: false })

// Add User type for client-side
interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

function getStatsAndChartData(sessions: any[]) {
  // Stats
  const focusSessions = sessions.filter((s: any) => s.type === 'focus' && s.status === 'completed')
  const breakSessions = sessions.filter((s: any) => s.type === 'break')
  const completedToday = focusSessions.length
  const avgSessionLength = focusSessions.length
    ? Math.round(
        focusSessions.reduce((sum: number, s: any) => sum + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()), 0) /
          (focusSessions.length * 60000)
      )
    : 25
  const breakSkipped = breakSessions.filter((s: any) => s.status === 'skipped').length
  const focusBreakRatio = breakSessions.length
    ? Math.round((focusSessions.length / breakSessions.length) * 100)
    : 100

  // Line chart: Pomodoros by hour
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const lineChartData = hours.map((hour) => ({
    hour: `${hour}:00`,
    pomodoros: focusSessions.filter((s: any) => new Date(s.startTime).getHours() === hour).length,
  }))

  // Donut chart: Focus vs Break time (minutes)
  const focusMinutes = focusSessions.reduce((sum: number, s: any) => sum + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 60000, 0)
  const breakMinutes = breakSessions.reduce((sum: number, s: any) => sum + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 60000, 0)
  const donutChartData = [
    { name: 'Focus', value: Math.round(focusMinutes), color: '#3B82F6' },
    { name: 'Break', value: Math.round(breakMinutes), color: '#F59E0B' },
  ]

  return {
    stats: { completedToday, avgSessionLength, breakSkipped, focusBreakRatio },
    lineChartData,
    donutChartData,
  }
}

export default function LiveAnalyticsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (res.status === 401) {
          router.push('/auth/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          fetch(`/api/pomodoro-sessions?userId=${data.user._id}&startDate=${today.toISOString()}`)
            .then((res) => res.ok ? res.json() : [])
            .then((sessionsData) => {
              setSessions(sessionsData || []);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        router.push('/auth/login');
      });
  }, [router]);

  if (loading) return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
  if (!user) return null;
  const { stats, lineChartData, donutChartData } = getStatsAndChartData(sessions);

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <PomodoroTimer userId={user._id} />
      </div>
      <LiveAnalyticsCharts
        user={user}
        sessions={sessions}
        lineChartData={lineChartData}
        donutChartData={donutChartData}
        stats={stats}
      />
    </>
  );
} 