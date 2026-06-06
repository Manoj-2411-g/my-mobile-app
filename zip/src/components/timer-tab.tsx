"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Coffee, Zap, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

interface TimerTabProps {
  onSessionComplete: (minutes: number) => void;
}

export function TimerTab({ onSessionComplete }: TimerTabProps) {
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('25');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    }
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerEnd();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isActive, timeLeft]);

  const handleTimerEnd = () => {
    setIsActive(false);
    audioRef.current?.play().catch(() => {});
    
    if (mode === 'study') {
      const finishedMinutes = Math.floor(parseInt(customMinutes) || 25);
      onSessionComplete(finishedMinutes);
      toast({
        title: "Study session complete!",
        description: "Time for a 5-minute break.",
      });
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      toast({
        title: "Break over!",
        description: "Back to the grind.",
      });
      setMode('study');
      setTimeLeft(parseInt(customMinutes) * 60 || 25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    const mins = mode === 'study' ? (parseInt(customMinutes) || 25) : 5;
    setTimeLeft(mins * 60);
  };

  const updateCustomTime = () => {
    const val = parseInt(customMinutes);
    if (!isNaN(val) && val > 0 && val <= 180) {
      setTimeLeft(val * 60);
      setIsSettingsOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid time",
        description: "Please enter a value between 1 and 180 minutes.",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full min-h-[500px] animate-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-500 ${mode === 'study' ? 'border-primary/50 bg-primary/10 text-primary' : 'border-secondary/50 bg-secondary/10 text-secondary'}`}>
          {mode === 'study' ? <Zap className="w-4 h-4 fill-current" /> : <Coffee className="w-4 h-4 fill-current" />}
          <span className="text-xs font-bold uppercase tracking-widest">{mode === 'study' ? 'Focus Session' : 'Relaxation Break'}</span>
        </div>
        
        <div className="text-[100px] font-bold font-headline leading-none tabular-nums tracking-tighter glow-purple text-white">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Button 
          variant="outline" 
          size="icon" 
          className="w-14 h-14 rounded-full border-white/10 bg-white/5 hover:bg-white/10"
          onClick={resetTimer}
        >
          <RotateCcw className="w-6 h-6" />
        </Button>

        <Button 
          size="icon" 
          className={`w-24 h-24 rounded-full transition-transform active:scale-90 ${isActive ? 'bg-white/10 text-white' : 'bg-primary text-black'}`}
          onClick={toggleTimer}
        >
          {isActive ? <Pause className="w-10 h-10" fill="currentColor" /> : <Play className="w-10 h-10 ml-1" fill="currentColor" />}
        </Button>

        <Button 
          variant="outline" 
          size="icon" 
          className="w-14 h-14 rounded-full border-white/10 bg-white/5 hover:bg-white/10"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          <Settings2 className="w-6 h-6" />
        </Button>
      </div>

      {isSettingsOpen && (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs p-6 rounded-2xl bg-muted/40 backdrop-blur-xl border border-white/5 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1 block">Set Session Length (min)</label>
              <Input 
                type="number" 
                value={customMinutes} 
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="bg-black/40 border-white/10 text-white font-headline h-12"
              />
            </div>
            <Button className="mt-5 h-12 px-6" onClick={updateCustomTime}>Apply</Button>
          </div>
        </div>
      )}

      {!isSettingsOpen && (
        <p className="text-sm text-muted-foreground text-center max-w-[200px]">
          {isActive ? "Deep focus in progress..." : "Ready to glow? Press start to begin."}
        </p>
      )}
    </div>
  )
}
