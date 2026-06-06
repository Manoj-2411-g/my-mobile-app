'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Flame, Clock, CheckCircle2, Plus, Trash2, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Task, UserStats } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DashboardViewProps {
  tasks: Task[];
  stats: UserStats;
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, text: string) => void;
}

export function DashboardView({ tasks, stats, onAddTask, onToggleTask, onDeleteTask, onEditTask }: DashboardViewProps) {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  const todayHours = (stats.todayFocusMinutes / 60).toFixed(1);
  const goalProgress = Math.min(Math.round((stats.todayFocusMinutes / stats.dailyFocusGoal) * 100), 100);

  return (
    <div className="flex flex-col gap-8 w-full animate-slide-up">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary w-4 h-4 glow-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Active Resonance</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white font-headline">Aura Pulse</h1>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-muted/30 border-white/5 rounded-[2rem] group relative overflow-hidden transition-all hover:bg-muted/40">
          <CardContent className="p-6 flex flex-col gap-1">
            <Flame size={40} className="absolute -right-2 -top-2 opacity-10 text-orange-500 group-hover:scale-125 transition-transform" fill="currentColor" />
            <span className="text-4xl font-black text-white font-headline">{stats.dailyStreak}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Streak Day</span>
          </CardContent>
        </Card>
        <Card className="bg-muted/30 border-white/5 rounded-[2rem] group relative overflow-hidden transition-all hover:bg-muted/40">
          <CardContent className="p-6 flex flex-col gap-1">
            <Clock size={40} className="absolute -right-2 -top-2 opacity-10 text-secondary group-hover:scale-125 transition-transform" />
            <span className="text-4xl font-black text-white font-headline">{todayHours}h</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Focus Today</span>
          </CardContent>
        </Card>
      </div>

      {/* Progress Goal */}
      <Card className="glass-panel rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] -mr-10 -mt-10" />
        <div className="flex justify-between items-end relative z-10">
          <div className="space-y-1">
            <h3 className="font-black text-xl text-white font-headline">Focus Threshold</h3>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">{stats.todayFocusMinutes} / {stats.dailyFocusGoal} min logged</p>
          </div>
          <span className="text-3xl font-black text-primary font-headline glow-primary">{goalProgress}%</span>
        </div>
        <Progress value={goalProgress} className="h-4 bg-white/5" />
      </Card>

      {/* Missions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Mission Parameters</h2>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Next objective..."
            className="bg-white/5 border-white/5 rounded-2xl h-14 px-6 text-sm font-medium focus:ring-1 focus:ring-primary/20"
          />
          <Button type="submit" size="icon" className="h-14 w-14 rounded-2xl bg-white text-black hover:bg-white/90">
            <Plus size={20} strokeWidth={3} />
          </Button>
        </form>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 opacity-20">
              <Circle size={40} className="text-muted-foreground" />
              <p className="text-xs font-black uppercase tracking-widest italic">All systems clear</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className={cn(
                  "flex items-center gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-2xl group transition-all duration-300",
                  task.completed ? "opacity-50" : "opacity-100 hover:bg-white/[0.05]"
                )}
              >
                <button 
                  onClick={() => onToggleTask(task.id)}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all active:scale-90",
                    task.completed ? 'bg-primary border-primary text-black glow-primary' : 'border-white/10'
                  )}
                >
                  {task.completed ? <CheckCircle2 size={16} strokeWidth={3} /> : null}
                </button>
                <input 
                  className={cn(
                    "bg-transparent border-none text-sm font-semibold flex-1 transition-all focus:outline-none",
                    task.completed ? 'text-muted-foreground line-through' : 'text-white'
                  )}
                  value={task.text}
                  onChange={(e) => onEditTask(task.id, e.target.value)}
                />
                <button 
                  onClick={() => onDeleteTask(task.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
