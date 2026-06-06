'use client';

import React from 'react';
import { LayoutDashboard, Timer, FolderTree, Cpu } from 'lucide-react';
import { AppTab } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const items = [
    { id: 'dashboard' as const, label: 'Home', icon: LayoutDashboard },
    { id: 'pomodoro' as const, label: 'Focus', icon: Timer },
    { id: 'projects' as const, label: 'Vault', icon: FolderTree },
    { id: 'ai-core' as const, label: 'Core', icon: Cpu },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-safe">
      {/* Gradient Fog to make content behind look faded */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none" />
      
      <div className="max-w-md mx-auto px-6 pb-8 relative pointer-events-auto">
        <div className="h-20 glass-panel rounded-[2.5rem] flex items-center justify-around px-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-white/5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-white"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-2xl transition-all duration-500",
                  isActive && "bg-primary/10 glow-primary scale-110"
                )}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 h-0 overflow-hidden"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-primary glow-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}