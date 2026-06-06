"use client"

import React from 'react'
import { Flame, Clock, CheckCircle2, Zap } from 'lucide-react'
import { RadialProgress } from './radial-progress'
import { UserStats, Task } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { IntelligentFocusGuide } from './intelligent-focus-guide'

interface DashboardTabProps {
  stats: UserStats;
  tasks: Task[];
}

export function DashboardTab({ stats, tasks }: DashboardTabProps) {
  const pendingCount = tasks.filter(t => !t.completed).length;
  const totalCount = tasks.length;
  
  // Calculate focus score: (completed / total * 50%) + (currentFocus / goal * 50%)
  const taskFactor = totalCount === 0 ? 100 : (stats.completedTasksCount / Math.max(stats.completedTasksCount + pendingCount, 1)) * 100;
  const focusFactor = (stats.totalFocusMinutes / stats.dailyFocusGoal) * 100;
  const focusScore = Math.min(Math.round((taskFactor + focusFactor) / 2), 100);

  const formatHours = (mins: number) => {
    return (mins / 60).toFixed(1);
  };

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-headline text-primary glow-purple tracking-tight">Daily Focus</h1>
        <p className="text-muted-foreground text-sm font-medium">Keep your aura bright.</p>
      </header>

      <div className="flex justify-center">
        <RadialProgress value={focusScore} size={240} strokeWidth={14}>
          <span className="text-5xl font-bold font-headline">{focusScore}%</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">Focus Score</span>
        </RadialProgress>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-black/40 border-primary/20 backdrop-blur-md">
          <CardContent className="p-4 flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Flame className="w-6 h-6 text-primary glow-purple" fill="currentColor" />
            </div>
            <div className="text-2xl font-bold font-headline">{stats.dailyStreak}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-tighter font-semibold">Day Streak</div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-secondary/20 backdrop-blur-md">
          <CardContent className="p-4 flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-secondary/10">
              <Zap className="w-6 h-6 text-secondary glow-teal" fill="currentColor" />
            </div>
            <div className="text-2xl font-bold font-headline">{stats.dailyFocusGoal}m</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-tighter font-semibold">Daily Goal</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-headline flex items-center gap-2 px-1">
          <Clock className="w-5 h-5 text-primary" /> Lifetime Aura
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 p-4 rounded-2xl flex flex-col justify-between border border-white/5">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total Hours</span>
            <span className="text-2xl font-bold font-headline mt-1">{formatHours(stats.totalFocusMinutes)} <span className="text-sm font-normal text-muted-foreground">h</span></span>
          </div>
          <div className="bg-muted/30 p-4 rounded-2xl flex flex-col justify-between border border-white/5">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Tasks Done</span>
            <span className="text-2xl font-bold font-headline mt-1">{stats.completedTasksCount}</span>
          </div>
        </div>
      </div>

      <IntelligentFocusGuide 
        pendingTasks={tasks.filter(t => !t.completed).map(t => t.text)}
        totalFocusHours={parseFloat(formatHours(stats.totalFocusMinutes))}
        dailyStreak={stats.dailyStreak}
      />
    </div>
  )
}
