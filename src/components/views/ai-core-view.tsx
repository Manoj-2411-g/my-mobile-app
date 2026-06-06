'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Cpu, 
  BrainCircuit, 
  Key, 
  FileJson, 
  Copy, 
  Check, 
  Terminal, 
  Activity, 
  TrendingUp, 
  Calendar as CalendarIcon,
  BarChart3,
  History,
  UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import { UserStats, Task, Project } from '@/lib/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface AiCoreViewProps {
  stats: UserStats;
  tasks: Task[];
  projects: Project[];
  onAddTask: (text: string) => void;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
}

export function AiCoreView({ stats, tasks, projects, onAddTask, onUpdateStats }: AiCoreViewProps) {
  const [apiKey, setApiKey] = useState('');
  const [aiCode, setAiCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleCopyReport = () => {
    // Calculate comprehensive vault progress
    const vaultSummary = projects.map(p => ({
      title: p.title,
      subjects: p.subjects.map(s => ({
        title: s.title,
        chapters: s.chapters.map(c => ({
          title: c.title,
          progress: c.lectures.length > 0 
            ? Math.round((c.lectures.filter(l => l.completed).length / c.lectures.length) * 100) 
            : 0
        }))
      }))
    }));

    const reportData = JSON.stringify({
      permanent_context: {
        study_persona: stats.permanentIdentity || "Unspecified Learner",
        overall_total_focus_min: stats.totalFocusMinutes,
        lifetime_streak: stats.dailyStreak,
        academic_vault_structure: vaultSummary
      },
      daily_resonance_snapshot: {
        date: new Date().toISOString().split('T')[0],
        today_focus_min: stats.todayFocusMinutes,
        focus_goal_min: stats.dailyFocusGoal,
        goal_completion_pct: Math.round((stats.todayFocusMinutes / stats.dailyFocusGoal) * 100),
        active_missions: tasks.filter(t => !t.completed).map(t => t.text),
        conquered_today: tasks.filter(t => t.completed).map(t => t.text)
      },
      historical_momentum: stats.dailyHistory
    }, null, 2);
    
    navigator.clipboard.writeText(reportData);
    setCopied(true);
    toast({ title: "Deep Resonance Report Copied", description: "Context optimized for AI analysis." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcessAiCode = () => {
    try {
      let newTasks: string[] = [];
      if (aiCode.trim().startsWith('[') || aiCode.trim().startsWith('{')) {
        const parsed = JSON.parse(aiCode);
        newTasks = Array.isArray(parsed) ? parsed : (parsed.tasks || []);
      } else {
        newTasks = aiCode.split('\n').filter(line => line.trim().length > 0);
      }

      if (Array.isArray(newTasks)) {
        newTasks.forEach(task => {
          if (typeof task === 'string' && task.trim().length > 0) {
            onAddTask(task.trim());
          }
        });
        toast({ title: "Missions Constructed", description: `${newTasks.length} nodes added to objective log.` });
        setAiCode('');
      } else {
        throw new Error('Invalid format');
      }
    } catch (e) {
      toast({ 
        variant: "destructive", 
        title: "Link Error", 
        description: "Could not parse AI code. Ensure it is a valid list or JSON array." 
      });
    }
  };

  const chartData = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      days.push({
        date: key,
        label,
        minutes: stats.dailyHistory[key] || 0
      });
    }
    return days;
  }, [stats.dailyHistory]);

  const yesterdayFocus = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const key = yesterday.toISOString().split('T')[0];
    return stats.dailyHistory[key] || 0;
  }, [stats.dailyHistory]);

  const studiedDates = useMemo(() => {
    return Object.keys(stats.dailyHistory)
      .filter(dateKey => stats.dailyHistory[dateKey] > 0)
      .map(dateKey => {
        const [year, month, day] = dateKey.split('-').map(Number);
        return new Date(year, month - 1, day);
      });
  }, [stats.dailyHistory]);

  const selectedDateStats = useMemo(() => {
    if (!selectedDate) return 0;
    const key = selectedDate.toISOString().split('T')[0];
    return stats.dailyHistory[key] || 0;
  }, [selectedDate, stats.dailyHistory]);

  return (
    <div className="flex flex-col gap-8 w-full animate-slide-up pb-52">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Activity className="text-primary w-4 h-4 glow-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Neural Core</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white font-headline">Resonance Sync</h1>
      </header>

      {/* Permanent Identity Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <UserCircle size={14} className="text-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Permanent Identity</h3>
        </div>
        <Card className="bg-white/[0.03] border-white/5 rounded-[2.5rem] p-8 space-y-4">
          <p className="text-[10px] text-muted-foreground font-medium leading-relaxed tracking-wide uppercase">
            Define your study persona once. AI will use this to personalize every suggestion.
          </p>
          <Input 
            placeholder="e.g. 3rd Year Med Student focusing on Cardiology..."
            value={stats.permanentIdentity}
            onChange={(e) => onUpdateStats({ permanentIdentity: e.target.value })}
            className="bg-black/40 border-white/5 h-16 px-6 rounded-2xl text-sm focus:ring-primary/30"
          />
        </Card>
      </section>

      {/* Analytics Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <TrendingUp size={14} className="text-secondary" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Self Statistics</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/[0.03] border-white/5 rounded-[2rem] p-6">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Today Focus</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white font-headline">{stats.todayFocusMinutes}</span>
              <span className="text-xs text-muted-foreground">min</span>
            </div>
          </Card>
          <Card className="bg-white/[0.03] border-white/5 rounded-[2rem] p-6">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Yesterday</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white/60 font-headline">{yesterdayFocus}</span>
              <span className="text-xs text-muted-foreground">min</span>
            </div>
          </Card>
        </div>

        <Card className="glass-panel rounded-[2.5rem] p-8 overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BarChart3 size={16} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">7-Day Momentum</span>
            </div>
            <CalendarIcon size={14} className="text-muted-foreground opacity-30" />
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 10, fontWeight: 700 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/90 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                          <p className="text-[10px] font-black text-white">{payload[0].value} MINS</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="minutes" radius={[6, 6, 6, 6]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 6 ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.1)'} 
                      className={index === 6 ? 'glow-primary' : ''}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Historical Calendar Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <History size={14} className="text-secondary" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Resonance Vault</h3>
        </div>

        <Card className="bg-white/[0.03] border-white/5 rounded-[2.5rem] p-8 space-y-8">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="bg-transparent border-none p-0 text-white"
              modifiers={{ studied: studiedDates }}
              modifiersStyles={{
                studied: {
                  backgroundColor: 'hsla(var(--primary), 0.15)',
                  color: 'hsl(var(--primary))',
                  fontWeight: '900',
                  borderRadius: '1rem',
                  border: '1px solid hsla(var(--primary), 0.3)'
                }
              }}
              classNames={{
                head_cell: "text-muted-foreground/50 text-[10px] font-black uppercase tracking-widest p-2",
                day: "h-10 w-10 p-0 font-bold text-xs aria-selected:bg-primary aria-selected:text-black rounded-xl transition-all hover:bg-white/10",
                day_today: "bg-white/5 text-primary border border-primary/20",
                nav_button: "hover:bg-white/10 rounded-xl transition-all",
                caption_label: "text-sm font-black uppercase tracking-[0.2em] text-white"
              }}
            />
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
                {selectedDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <h4 className="text-lg font-black text-white font-headline">Focus Session History</h4>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-primary font-headline block leading-none">{selectedDateStats}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total Min</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Intelligence Link Card */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <BrainCircuit size={14} className="text-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Uplink Parameters</h3>
        </div>
        
        <Card className="glass-panel rounded-[3rem] overflow-hidden relative border-white/5 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-30" />
          <CardContent className="p-10 flex flex-col gap-8 relative z-10">
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-white font-headline leading-tight">Neural Sync</h2>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed tracking-wide">
                Provide your API key for direct analysis or use the manual report sync below.
              </p>
            </div>
            <div className="space-y-4">
               <div className="relative group">
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="password"
                  placeholder="GEMINI_CORE_API_KEY"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-black/60 border-white/5 h-16 pl-14 rounded-2xl focus:ring-primary/30 font-mono text-sm"
                />
              </div>
              <Button className="w-full h-16 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white/90 transition-all">
                Initialize Neural Sync
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <Button 
            variant="outline" 
            onClick={handleCopyReport}
            className="h-24 rounded-[2rem] border-white/5 bg-white/[0.03] justify-between px-8 group hover:bg-white/[0.06] transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <FileJson size={24} />
              </div>
              <div className="text-left">
                <span className="block font-black text-[12px] uppercase tracking-widest text-white">Deep Resonance Report</span>
                <span className="block text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">Full permanent context + daily metrics</span>
              </div>
            </div>
            {copied ? <Check className="text-primary" size={20} strokeWidth={3} /> : <Copy className="text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" size={20} />}
          </Button>

          <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                 <Terminal size={16} className="text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Uplink Parser</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic pl-2">Paste mission code or AI-suggested nodes below to sync back to Aura.</p>
              <Textarea 
                placeholder="Paste mission code or AI-suggested nodes here..."
                value={aiCode}
                onChange={(e) => setAiCode(e.target.value)}
                className="min-h-[140px] bg-black/40 border-white/5 rounded-2xl p-5 text-xs font-mono text-primary focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/30 resize-none"
              />
              <Button 
                onClick={handleProcessAiCode}
                disabled={!aiCode.trim()}
                className="w-full h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[10px] hover:bg-primary/80 transition-all"
              >
                Construct Mission Sequence
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
