export type AppTab = 'dashboard' | 'pomodoro' | 'projects' | 'ai-core';

export interface Lecture {
  id: string;
  title: string;
  completed: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  lectures: Lecture[];
  revisionCount: number;
  practiceCount: number;
}

export interface Subject {
  id: string;
  title: string;
  chapters: Chapter[];
}

export interface Project {
  id: string;
  title: string;
  subjects: Subject[];
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface UserStats {
  totalFocusMinutes: number;
  todayFocusMinutes: number;
  completedTasksCount: number;
  dailyStreak: number;
  lastActiveDay: string | null;
  dailyFocusGoal: number;
  totalGoalsCount: number;
  completedGoalsCount: number;
  dailyHistory: Record<string, number>; // Maps 'YYYY-MM-DD' to minutes
  permanentIdentity?: string; // Permanent context for AI
}
