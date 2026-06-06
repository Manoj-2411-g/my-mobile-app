
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
  const currentTheme = stats.theme;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  const todayHours = (stats.todayFocusMinutes / 60).toFixed(1);
  const goalProgress = Math.min(Math.round((stats.todayFocusMinutes / stats.dailyFocusGoal) * 100), 100);

  const isNeo = currentTheme === 'neo-tokyo';
  const isAtlas = currentTheme === 'starlight-atlas';

  return (
    <div className={cn(
      "flex flex-col gap-8 w-full animate-slide-up",
      isAtlas && "items-center text-center"
    )}>
      <header className="flex flex-col gap-1">
        <div className={cn("flex items-center gap-2", isAtlas && "justify-center")}>
          <Sparkles className="text-primary w-4 h-4 glow-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            {isNeo ? "SYSTEM::ACTIVE_RESONANCE" : "Active Resonance"}
          </span>
        </div>
        <h1 className={cn(
          "text-4xl font-black tracking-tight text-white font-headline",
          isNeo && "italic skew-x-[-10deg]"
        )}>
          {isNeo ? "AURA_PULSE" : isAtlas ? "Celestial Pulse" : "Aura Pulse"}
        </h1>
      </header>

      {/* Stats Cards */}
      <div className={cn("grid grid-cols-2 gap-4", isAtlas && "w-full")}>
        <Card className={cn(
          "bg-muted/30 border-white/5 rounded-[2rem] group relative overflow-hidden transition-all hover:bg-muted/40",
          isNeo && "rounded-none border-2 border-primary bg-black",
          isAtlas && "rounded-[3rem] bg-white/5 backdrop-blur-xl border-white/10"
        )}>
          <CardContent className="p-6 flex flex-col gap-1">
            <Flame size={40} className={cn(
              "absolute -right-2 -top-2 opacity-10 text-orange-500 group-hover:scale-125 transition-transform",
              isNeo && "text-primary opacity-20"
            )} fill="currentColor" />
            <span className="text-4xl font-black text-white font-headline">{stats.dailyStreak}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Streak Day</span>
          </CardContent>
        </Card>
        <Card className={cn(
          "bg-muted/30 border-white/5 rounded-[2rem] group relative overflow-hidden transition-all hover:bg-muted/40",
          isNeo && "rounded-none border-2 border-primary bg-black",
          isAtlas && "rounded-[3rem] bg-white/5 backdrop-blur-xl border-white/10"
        )}>
          <CardContent className="p-6 flex flex-col gap-1">
            <Clock size={40} className={cn(
              "absolute -right-2 -top-2 opacity-10 text-secondary group-hover:scale-125 transition-transform",
              isNeo && "text-secondary opacity-20"
            )} />
            <span className="text-4xl font-black text-white font-headline">{todayHours}h</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Focus Today</span>
          </CardContent>
        </Card>
      </div>

      {/* Progress Goal */}
      <Card className={cn(
        "glass-panel rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden",
        isNeo && "rounded-none border-2 border-primary bg-black p-10",
        isAtlas && "rounded-[4rem] bg-white/5 backdrop-blur-2xl border-white/10 p-10"
      )}>
        {!isNeo && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] -mr-10 -mt-10" />}
        <div className={cn("flex justify-between items-end relative z-10", isAtlas && "flex-col items-center gap-2")}>
          <div className="space-y-1">
            <h3 className="font-black text-xl text-white font-headline">Focus Threshold</h3>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">{stats.todayFocusMinutes} / {stats.dailyFocusGoal} min logged</p>
          </div>
          <span className="text-3xl font-black text-primary font-headline glow-primary">{goalProgress}%</span>
        </div>
        <Progress value={goalProgress} className={cn("h-4 bg-white/5", isNeo && "rounded-none h-6 border-2 border-primary bg-black")} />
      </Card>

      {/* Missions */}
      <div className="space-y-6">
        <div className={cn("flex items-center justify-between px-2", isAtlas && "justify-center")}>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            {isNeo ? "CORE::MISSION_PARAMETERS" : "Mission Parameters"}
          </h2>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder={isNeo ? "INPUT_NODE..." : "Next objective..."}
            className={cn(
              "bg-white/5 border-white/5 rounded-2xl h-14 px-6 text-sm font-medium focus:ring-1 focus:ring-primary/20",
              isNeo && "rounded-none border-2 border-primary bg-black font-mono",
              isAtlas && "rounded-full bg-white/10 border-white/20 text-center"
            )}
          />
          <Button type="submit" size="icon" className={cn(
            "h-14 w-14 rounded-2xl bg-white text-black hover:bg-white/90",
            isNeo && "rounded-none border-2 border-primary bg-primary text-black",
            isAtlas && "rounded-full bg-primary text-black"
          )}>
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
                  task.completed ? "opacity-50" : "opacity-100 hover:bg-white/[0.05]",
                  isNeo && "rounded-none border-2 border-primary bg-black",
                  isAtlas && "rounded-[2.5rem] bg-white/5 backdrop-blur-xl border-white/10"
                )}
              >
                <button 
                  onClick={() => onToggleTask(task.id)}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all active:scale-90",
                    task.completed ? 'bg-primary border-primary text-black glow-primary' : 'border-white/10',
                    isNeo && "rounded-none border-primary"
                  )}
                >
                  {task.completed ? <CheckCircle2 size={16} strokeWidth={3} /> : null}
                </button>
                <input 
                  className={cn(
                    "bg-transparent border-none text-sm font-semibold flex-1 transition-all focus:outline-none",
                    task.completed ? 'text-muted-foreground line-through' : 'text-white',
                    isNeo && "font-mono uppercase"
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
