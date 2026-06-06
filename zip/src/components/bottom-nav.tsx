"use client"

import React from 'react'
import { LayoutDashboard, Timer, ClipboardList } from 'lucide-react'
import { AppTab } from '@/lib/types'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timer' as const, label: 'Focus', icon: Timer },
    { id: 'tasks' as const, label: 'Tasks', icon: ClipboardList },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent pointer-events-none">
      <div className="max-w-md mx-auto h-16 bg-muted/40 backdrop-blur-2xl rounded-2xl border border-white/10 flex items-center justify-around px-2 shadow-2xl pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300 rounded-xl",
                isActive ? "text-primary" : "text-muted-foreground hover:text-white"
              )}
            >
              <Icon className={cn(
                "w-6 h-6 transition-transform duration-300",
                isActive && "scale-110 glow-purple"
              )} />
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-opacity",
                isActive ? "opacity-100" : "opacity-0"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary glow-purple" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  )
}
