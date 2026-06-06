'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Square, RotateCcw, Coffee, Zap, Settings2, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PomodoroViewProps {
  onComplete: (minutes: number) => void;
  activeFocus: string | null;
  onClearFocus: () => void;
  isTimerActive: boolean;
  setIsTimerActive: (active: boolean) => void;
  isNavLocked: boolean;
  setIsNavLocked: (locked: boolean) => void;
}

export function PomodoroView({ 
  onComplete, 
  activeFocus, 
  onClearFocus, 
  isTimerActive, 
  setIsTimerActive,
  isNavLocked,
  setIsNavLocked
}: PomodoroViewProps) {
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeLeftRef = useRef<number>(25 * 60);

  // Sync ref with state for use in callbacks without triggering re-renders or dependency loops
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    }
  }, []);

  const playChime = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleTimerEnd = useCallback((isManual = false) => {
    setIsTimerActive(false);
    setIsNavLocked(false);
    playChime();
    
    if (mode === 'study') {
      const currentRemaining = timeLeftRef.current;
      const totalSeconds = sessionMinutes * 60;
      const elapsedSeconds = totalSeconds - currentRemaining;
      const actualMinutes = isManual 
        ? Math.floor(elapsedSeconds / 60) 
        : sessionMinutes;

      if (actualMinutes > 0) {
        onComplete(actualMinutes);
      }
      
      toast({ 
        title: isManual ? "Session Logged" : "Cycle Completed", 
        description: `Logged ${actualMinutes}m to your focus history.` 
      });
      setMode('break');
      const nextTime = breakMinutes * 60;
      setTimeLeft(nextTime);
      timeLeftRef.current = nextTime;
    } else {
      toast({ title: "Break Finished", description: "Initiating focus cycle." });
      setMode('study');
      const nextTime = sessionMinutes * 60;
      setTimeLeft(nextTime);
      timeLeftRef.current = nextTime;
    }
    
    if (timerRef.current) clearInterval(timerRef.current);
    endTimeRef.current = null;
  }, [mode, sessionMinutes, breakMinutes, onComplete, setIsTimerActive, setIsNavLocked]);

  useEffect(() => {
    if (isTimerActive) {
      // Calculate end time ONCE when the timer starts or resumes
      endTimeRef.current = Date.now() + timeLeftRef.current * 1000;
      
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.round((endTimeRef.current! - now) / 1000));
        
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          handleTimerEnd(false);
        }
      }, 500); // Check twice a second for precision
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => { 
      if (timerRef.current) clearInterval(timerRef.current); 
    };
  }, [isTimerActive, handleTimerEnd]);

  const toggleTimer = () => {
    if (!isTimerActive) {
      setIsNavLocked(true);
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  };
  
  const restartTimer = () => {
    setIsTimerActive(false);
    const mins = mode === 'study' ? sessionMinutes : breakMinutes;
    const nextTime = mins * 60;
    setTimeLeft(nextTime);
    timeLeftRef.current = nextTime;
    endTimeRef.current = null;
  };

  const stopTimer = () => {
    setIsTimerActive(false);
    setIsNavLocked(false);
    setMode('study');
    const nextTime = sessionMinutes * 60;
    setTimeLeft(nextTime);
    timeLeftRef.current = nextTime;
    endTimeRef.current = null;
    toast({ title: "Session Stopped", description: "Aura resonance reset." });
  };

  const completeSession = () => {
    handleTimerEnd(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-10 w-full items-center justify-center animate-slide-up pb-20">
      {activeFocus && (
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl animate-in fade-in slide-in-from-top-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary truncate max-w-[200px]">
            Target: {activeFocus}
          </span>
          {!isNavLocked && (
            <button onClick={onClearFocus} className="text-muted-foreground hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
      )}

      <div className={cn(
        "flex items-center gap-3 px-6 py-2 rounded-full border transition-all duration-700",
        mode === 'study' 
          ? "border-primary/40 bg-primary/5 text-primary glow-primary" 
          : "border-secondary/40 bg-secondary/5 text-secondary glow-secondary"
      )}>
        {mode === 'study' ? <Zap size={14} fill="currentColor" /> : <Coffee size={14} fill="currentColor" />}
        <span className="text-[10px] font-black uppercase tracking-[0.4em]">
          {mode === 'study' ? 'Hyper Focus' : 'Recovery Core'}
        </span>
      </div>

      <div className="relative flex items-center justify-center w-full max-w-[340px] aspect-square">
        <div className={cn(
          "absolute inset-0 aura-pulse transition-all duration-1000 rounded-full",
          isNavLocked 
            ? (mode === 'study' ? 'bg-primary/30' : 'bg-secondary/30') 
            : 'bg-white/5'
        )} />
        <span className="text-[120px] font-black tracking-tighter tabular-nums text-white relative z-10 drop-shadow-[0_0_50px_rgba(255,255,255,0.15)] font-headline">
          {formatTime(timeLeft)}
        </span>
      </div>

      <Card className="glass-panel rounded-[3.5rem] w-full max-w-sm shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-white/5">
        <CardContent className="p-10 flex flex-col items-center gap-12">
          <div className="flex items-center justify-around w-full">
            <Button 
              size="icon" 
              variant="outline" 
              onClick={restartTimer}
              className="w-16 h-16 rounded-full border-white/5 bg-white/5 text-muted-foreground hover:text-white transition-all active:scale-90"
            >
              <RotateCcw size={24} />
            </Button>

            <Button 
              size="icon" 
              onClick={toggleTimer}
              className={cn(
                "w-28 h-28 rounded-full transition-all duration-500 active:scale-95 shadow-2xl",
                isTimerActive 
                  ? "bg-white/10 text-white border border-white/10" 
                  : (mode === 'study' ? "bg-primary text-black glow-primary" : "bg-secondary text-black glow-secondary")
              )}
            >
              {isTimerActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1.5" />}
            </Button>

            <Button 
              size="icon" 
              variant="outline" 
              onClick={stopTimer}
              className="w-16 h-16 rounded-full border-white/5 bg-white/5 text-muted-foreground hover:text-destructive transition-all active:scale-90"
            >
              <Square size={24} fill="currentColor" />
            </Button>
          </div>

          <div className="flex items-center gap-4 w-full">
            <Button 
              variant="outline"
              onClick={completeSession}
              disabled={mode === 'break'}
              className="flex-1 h-16 rounded-3xl border-white/5 bg-white/5 text-white font-black uppercase tracking-[0.2em] text-[10px] gap-3 hover:bg-white/10 disabled:opacity-30"
            >
              <CheckCircle2 size={18} className="text-primary" />
              Finish & Log
            </Button>
            
            {!isNavLocked && (
              <Button 
                size="icon"
                variant="outline"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={cn(
                  "h-16 w-16 rounded-3xl border-white/5 bg-white/5 transition-all",
                  isSettingsOpen && "bg-white/10 text-primary border-primary/20"
                )}
              >
                <Settings2 size={22} />
              </Button>
            )}
          </div>

          {isSettingsOpen && !isNavLocked && (
            <div className="w-full space-y-6 pt-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black text-muted-foreground tracking-widest pl-2">Focus (Min)</label>
                  <Input 
                    type="number"
                    value={sessionMinutes}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      setSessionMinutes(val);
                      if (mode === 'study') {
                        setTimeLeft(val * 60);
                        timeLeftRef.current = val * 60;
                      }
                    }}
                    className="bg-black border-white/5 rounded-2xl h-14 text-center font-black text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black text-muted-foreground tracking-widest pl-2">Break (Min)</label>
                  <Input 
                    type="number"
                    value={breakMinutes}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      setBreakMinutes(val);
                      if (mode === 'break') {
                        setTimeLeft(val * 60);
                        timeLeftRef.current = val * 60;
                      }
                    }}
                    className="bg-black border-white/5 rounded-2xl h-14 text-center font-black text-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {isNavLocked && (
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/40 animate-pulse mt-4">
          Session Active • Navigation Locked
        </p>
      )}
    </div>
  );
}