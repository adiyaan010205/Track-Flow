"use client"

import { ChartContainer, ChartTooltip, ChartLegend } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import ActivityFeed from '@/components/dashboard/activity-feed'
import React from 'react'

interface LiveAnalyticsChartsProps {
  user: any
  sessions: any[]
  lineChartData: any[]
  donutChartData: any[]
  stats: any
}

export default function LiveAnalyticsCharts({ user, sessions, lineChartData, donutChartData, stats }: LiveAnalyticsChartsProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Live Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pomodoro Timer and Session Overview */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded shadow">
              <div className="text-sm text-gray-500">Pomodoros Completed Today</div>
              <div className="text-2xl font-bold">{stats.completedToday}</div>
            </div>
            <div className="bg-green-50 p-4 rounded shadow">
              <div className="text-sm text-gray-500">Avg. Focus Session (min)</div>
              <div className="text-2xl font-bold">{stats.avgSessionLength}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded shadow">
              <div className="text-sm text-gray-500">Breaks Skipped</div>
              <div className="text-2xl font-bold">{stats.breakSkipped}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded shadow">
              <div className="text-sm text-gray-500">Focus/Break Ratio</div>
              <div className="text-2xl font-bold">{stats.focusBreakRatio}%</div>
            </div>
          </div>
        </div>
        {/* Productivity Charts & Team Feed */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow min-h-[200px] flex flex-col items-center justify-center">
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="pomodoros" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <ChartTooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-gray-500 mt-2">Pomodoros by Time of Day</div>
          </div>
          <div className="bg-white p-4 rounded shadow min-h-[120px] flex flex-col items-center justify-center">
            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {donutChartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                  <ChartLegend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-gray-500 mt-2">Focus vs Break Time</div>
          </div>
          <div className="bg-white p-4 rounded shadow min-h-[120px] flex items-center justify-center">
            {/* TODO: Heatmap Calendar (Productivity by hour) */}
            <span className="text-gray-400">[Heatmap Calendar Placeholder]</span>
          </div>
          <div className="bg-white p-4 rounded shadow min-h-[120px] flex items-center justify-center">
            {/* Team Activity Feed (Pomodoro + project/task events) */}
            <div className="w-full">
              <ActivityFeed user={user} pomodoroSessions={sessions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 