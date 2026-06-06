"use client"

import React, { useState } from 'react'
import { Plus, CheckCircle2, Circle, Trash2, ListTodo } from 'lucide-react'
import { Task } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface TasksTabProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TasksTab({ tasks, onAddTask, onToggleTask, onDeleteTask }: TasksTabProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAddTask(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="flex flex-col h-full gap-6 pb-24 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline text-secondary glow-teal tracking-tight">Mission Log</h1>
        <p className="text-muted-foreground text-sm font-medium">Clear the list, enhance your aura.</p>
      </header>

      <div className="flex gap-2 sticky top-0 z-10">
        <Input 
          placeholder="New focus task..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-muted/40 border-white/5 h-14 rounded-2xl px-5 text-base"
        />
        <Button 
          size="icon" 
          onClick={handleAdd}
          className="w-14 h-14 rounded-2xl bg-secondary hover:bg-secondary/80 text-black shadow-lg shadow-secondary/20"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <ScrollArea className="flex-1 pr-4 -mr-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center gap-4">
            <ListTodo className="w-16 h-16" />
            <p className="font-medium text-lg">No tasks yet.<br/>What will you conquer today?</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 group",
                  task.completed 
                    ? "bg-muted/10 border-white/5 opacity-60" 
                    : "bg-muted/30 border-white/10 hover:border-secondary/40"
                )}
              >
                <button 
                  onClick={() => onToggleTask(task.id)}
                  className="shrink-0 transition-transform active:scale-90"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-secondary glow-teal" fill="currentColor" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </button>
                
                <span className={cn(
                  "flex-1 text-base font-medium transition-all duration-300",
                  task.completed && "line-through text-muted-foreground decoration-secondary/50"
                )}>
                  {task.text}
                </span>

                <button 
                  onClick={() => onDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
