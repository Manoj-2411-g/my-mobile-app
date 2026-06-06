'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppTab, Task, UserStats, Project } from '@/lib/types';
import { BottomNav } from '@/components/layout/bottom-nav';
import { DashboardView } from '@/components/views/dashboard-view';
import { PomodoroView } from '@/components/views/pomodoro-view';
import { ProjectsView } from '@/components/views/projects-view';
import { AiCoreView } from '@/components/views/ai-core-view';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';

export default function AuraStudyTracker() {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [activeFocus, setActiveFocus] = useState<string | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isNavLocked, setIsNavLocked] = useState(false);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalFocusMinutes: 0,
    todayFocusMinutes: 0,
    completedTasksCount: 0,
    dailyStreak: 0,
    lastActiveDay: null,
    dailyFocusGoal: 120,
    totalGoalsCount: 0,
    completedGoalsCount: 0,
    dailyHistory: {},
    permanentIdentity: ''
  });
  const [projects, setProjects] = useState<Project[]>([]);

  // Sound ref for task completion
  const completeSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initial Load from LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      completeSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
      
      const savedTasks = localStorage.getItem('aura_tasks');
      const savedStats = localStorage.getItem('aura_stats');
      const savedProjects = localStorage.getItem('aura_projects');
      
      let loadedStats = savedStats ? JSON.parse(savedStats) : null;
      let loadedTasks = savedTasks ? JSON.parse(savedTasks) : [];
      let loadedProjects = savedProjects ? JSON.parse(savedProjects) : null;

      const today = new Date().toISOString().split('T')[0];

      if (loadedStats) {
        // Daily Reset Logic
        if (loadedStats.lastActiveDay !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (loadedStats.lastActiveDay === yesterdayStr) {
            loadedStats.dailyStreak += 1;
          } else if (loadedStats.lastActiveDay !== null) {
            loadedStats.dailyStreak = 1;
          }

          loadedStats.todayFocusMinutes = 0;
          loadedStats.lastActiveDay = today;
          // Clean up missions for the new day
          loadedTasks = loadedTasks.filter((t: Task) => !t.completed);
        }
        setStats(loadedStats);
      } else {
        const initialStats = {
          totalFocusMinutes: 0,
          todayFocusMinutes: 0,
          completedTasksCount: 0,
          dailyStreak: 1,
          lastActiveDay: today,
          dailyFocusGoal: 120,
          totalGoalsCount: 0,
          completedGoalsCount: 0,
          dailyHistory: {},
          permanentIdentity: ''
        };
        setStats(initialStats);
      }

      if (loadedTasks) setTasks(loadedTasks);
      if (loadedProjects) {
        setProjects(loadedProjects);
      } else {
        // Initial Demo Data
        setProjects([
          {
            id: 'p1',
            title: 'University Core',
            subjects: [
              {
                id: 's1',
                title: 'Advanced Computation',
                chapters: [
                  {
                    id: 'c1',
                    title: 'Neural Networks',
                    revisionCount: 2,
                    practiceCount: 5,
                    lectures: [
                      { id: 'l1', title: 'Backpropagation', completed: true },
                      { id: 'l2', title: 'Transformers Architecture', completed: false },
                    ]
                  }
                ]
              }
            ]
          }
        ]);
      }
    }
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aura_tasks', JSON.stringify(tasks));
      localStorage.setItem('aura_stats', JSON.stringify(stats));
      localStorage.setItem('aura_projects', JSON.stringify(projects));
    }
  }, [tasks, stats, projects]);

  const addTask = useCallback((text: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      createdAt: Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const completed = !t.completed;
        if (completed && completeSoundRef.current) {
          completeSoundRef.current.currentTime = 0;
          completeSoundRef.current.play().catch(() => {});
        }
        setStats(s => ({ 
          ...s, 
          completedTasksCount: completed ? s.completedTasksCount + 1 : Math.max(0, s.completedTasksCount - 1) 
        }));
        return { ...t, completed };
      }
      return t;
    }));
  }, []);

  const editTask = useCallback((id: string, text: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, text } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const completePomodoro = useCallback((minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    setStats(prev => {
      const newHistory = { ...prev.dailyHistory };
      newHistory[today] = (newHistory[today] || 0) + minutes;
      
      return {
        ...prev,
        totalFocusMinutes: prev.totalFocusMinutes + minutes,
        todayFocusMinutes: prev.todayFocusMinutes + minutes,
        dailyHistory: newHistory,
        lastActiveDay: today
      };
    });
  }, []);

  const handleStartFocus = useCallback((title: string) => {
    setActiveFocus(title);
    setActiveTab('pomodoro');
  }, []);

  const updateStats = useCallback((newStats: Partial<UserStats>) => {
    setStats(prev => ({ ...prev, ...newStats }));
  }, []);

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <DashboardView 
          key="dashboard" 
          tasks={tasks} 
          stats={stats} 
          onAddTask={addTask}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onEditTask={editTask}
        />;
      case 'pomodoro': 
        return <PomodoroView 
          key="pomodoro" 
          activeFocus={activeFocus}
          onClearFocus={() => setActiveFocus(null)}
          onComplete={completePomodoro}
          isTimerActive={isTimerActive}
          setIsTimerActive={setIsTimerActive}
          isNavLocked={isNavLocked}
          setIsNavLocked={setIsNavLocked}
        />;
      case 'projects': 
        return <ProjectsView 
          key="projects" 
          projects={projects}
          setProjects={setProjects}
          onAddTask={addTask}
          onStartFocus={handleStartFocus}
        />;
      case 'ai-core': 
        return <AiCoreView 
          key="ai-core" 
          stats={stats} 
          tasks={tasks} 
          projects={projects}
          onAddTask={addTask}
          onUpdateStats={updateStats}
        />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-background relative overflow-hidden">
      <main className="flex-1 w-full overflow-y-auto no-scrollbar relative">
        <div className="px-5 pt-10 pb-64 max-w-lg mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {!isNavLocked && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster />
    </div>
  );
}