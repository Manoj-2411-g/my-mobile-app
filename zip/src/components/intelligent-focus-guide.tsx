"use client"

import React, { useState } from 'react'
import { Sparkles, Loader2, BrainCircuit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { intelligentFocusGuide, IntelligentFocusGuideOutput } from '@/ai/flows/intelligent-focus-guide'

interface IntelligentFocusGuideProps {
  pendingTasks: string[];
  totalFocusHours: number;
  dailyStreak: number;
}

export function IntelligentFocusGuide({ pendingTasks, totalFocusHours, dailyStreak }: IntelligentFocusGuideProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [guide, setGuide] = useState<IntelligentFocusGuideOutput | null>(null);

  const getAdvice = async () => {
    setIsLoading(true);
    try {
      const result = await intelligentFocusGuide({
        pendingTasks,
        totalFocusHours,
        dailyStreak
      });
      setGuide(result);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20 overflow-hidden backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary glow-purple" />
            <h3 className="font-headline text-sm font-bold tracking-wider uppercase">Focus Intelligence</h3>
          </div>
          {!guide && (
            <Button 
              onClick={getAdvice} 
              disabled={isLoading} 
              size="sm"
              className="bg-primary text-black hover:bg-primary/80 font-bold"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Optimize Plan"}
            </Button>
          )}
        </div>

        {isLoading && !guide && (
          <div className="flex flex-col items-center gap-3 py-4 text-muted-foreground">
            <BrainCircuit className="w-8 h-8 animate-pulse text-secondary" />
            <p className="text-xs font-medium animate-pulse">Analyzing your study aura...</p>
          </div>
        )}

        {guide && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-4">
              <div className="flex-1 bg-black/40 p-3 rounded-xl border border-white/5">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Focus</p>
                <p className="text-xl font-headline font-bold text-primary">{guide.focusDurationMinutes}m</p>
              </div>
              <div className="flex-1 bg-black/40 p-3 rounded-xl border border-white/5">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Break</p>
                <p className="text-xl font-headline font-bold text-secondary">{guide.breakDurationMinutes}m</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground italic border-l-2 border-primary/40 pl-3">
              "{guide.recommendation}"
            </p>
            <Button 
              variant="link" 
              onClick={() => setGuide(null)} 
              className="text-primary p-0 h-auto text-[10px] uppercase font-bold tracking-widest"
            >
              Recalculate
            </Button>
          </div>
        )}

        {!guide && !isLoading && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            Let the AI analyze your tasks and streak to suggest the perfect study rhythm for today.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
