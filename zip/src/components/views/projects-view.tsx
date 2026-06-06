'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FolderPlus, 
  BookOpen, 
  PlusCircle, 
  CheckCircle, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ArrowLeft,
  RotateCcw,
  Layers,
  MoreVertical,
  Timer,
  ClipboardList,
  FileQuestion
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project, Subject, Chapter, Lecture } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadialProgress } from '@/components/radial-progress';

interface ProjectsViewProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onAddTask: (text: string) => void;
  onStartFocus: (title: string) => void;
}

interface SelectionState {
  projectId: string;
  subjectId: string;
  chapterId: string;
}

export function ProjectsView({ projects, setProjects, onAddTask, onStartFocus }: ProjectsViewProps) {
  const [selection, setSelection] = useState<SelectionState | null>(null);

  // Helper functions for progress calculation
  const getChapterStats = (chapter: Chapter) => {
    const total = chapter.lectures.length;
    const completed = chapter.lectures.filter(l => l.completed).length;
    return { 
      total, 
      completed, 
      percent: total > 0 ? Math.round((completed / total) * 100) : 0 
    };
  };

  const getSubjectStats = (subject: Subject) => {
    let total = 0;
    let completed = 0;
    subject.chapters.forEach(c => {
      c.lectures.forEach(l => {
        total++;
        if (l.completed) completed++;
      });
    });
    return { 
      total, 
      completed, 
      percent: total > 0 ? Math.round((completed / total) * 100) : 0 
    };
  };

  const getProjectStats = (project: Project) => {
    let total = 0;
    let completed = 0;
    project.subjects.forEach(s => {
      s.chapters.forEach(c => {
        c.lectures.forEach(l => {
          total++;
          if (l.completed) completed++;
        });
      });
    });
    return { 
      total, 
      completed, 
      percent: total > 0 ? Math.round((completed / total) * 100) : 0 
    };
  };

  const activeChapter = selection 
    ? projects.find(p => p.id === selection.projectId)
        ?.subjects.find(s => s.id === selection.subjectId)
        ?.chapters.find(c => c.id === selection.chapterId)
    : null;

  const addProject = () => {
    const newProj: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Class',
      subjects: []
    };
    setProjects([newProj, ...projects]);
    toast({ title: "Class Added", description: "Academic branch initialized." });
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast({ title: "Class Removed", description: "Academic branch erased." });
  };

  const addSubject = (projectId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const newSub: Subject = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'New Subject',
        chapters: []
      };
      return { ...p, subjects: [...p.subjects, newSub] };
    }));
  };

  const deleteSubject = (projectId: string, subjectId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, subjects: p.subjects.filter(s => s.id !== subjectId) };
    }));
  };

  const addChapter = (projectId: string, subjectId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        subjects: p.subjects.map(s => {
          if (s.id !== subjectId) return s;
          const newChap: Chapter = {
            id: Math.random().toString(36).substr(2, 9),
            title: 'New Module',
            lectures: [],
            revisionCount: 0,
            practiceCount: 0
          };
          return { ...s, chapters: [...s.chapters, newChap] };
        })
      };
    }));
  };

  const deleteChapter = (projectId: string, subjectId: string, chapterId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        subjects: p.subjects.map(s => {
          if (s.id !== subjectId) return s;
          return { ...s, chapters: s.chapters.filter(c => c.id !== chapterId) };
        })
      };
    }));
    setSelection(null);
  };

  const addLecture = (projectId: string, subjectId: string, chapterId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        subjects: p.subjects.map(s => {
          if (s.id !== subjectId) return s;
          return {
            ...s,
            chapters: s.chapters.map(c => {
              if (c.id !== chapterId) return c;
              const newLec: Lecture = {
                id: Math.random().toString(36).substr(2, 9),
                title: 'New Sync Node',
                completed: false
              };
              return { ...c, lectures: [...c.lectures, newLec] };
            })
          };
        })
      };
    }));
  };

  const deleteLecture = (projectId: string, subjectId: string, chapterId: string, lectureId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        subjects: p.subjects.map(s => {
          if (s.id !== subjectId) return s;
          return {
            ...s,
            chapters: s.chapters.map(c => {
              if (c.id !== chapterId) return c;
              return { ...c, lectures: c.lectures.filter(l => l.id !== lectureId) };
            })
          };
        })
      };
    }));
  };

  const toggleLecture = (projectId: string, subjectId: string, chapterId: string, lectureId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        subjects: p.subjects.map(s => {
          if (s.id !== subjectId) return s;
          return {
            ...s,
            chapters: s.chapters.map(c => {
              if (c.id !== chapterId) return c;
              return {
                ...c,
                lectures: c.lectures.map(l => l.id === lectureId ? { ...l, completed: !l.completed } : l)
              };
            })
          };
        })
      };
    }));
  };

  const updateLectureTitle = (projectId: string, subjectId: string, chapterId: string, lectureId: string, title: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        subjects: p.subjects.map(s => {
          if (s.id !== subjectId) return s;
          return {
            ...s,
            chapters: s.chapters.map(c => {
              if (c.id !== chapterId) return c;
              return {
                ...c,
                lectures: c.lectures.map(l => l.id === lectureId ? { ...l, title } : l)
              };
            })
          };
        })
      };
    }));
  };

  const updateChapterTitle = (projectId: string, subjectId: string, chapterId: string, title: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        subjects: p.subjects.map(s => {
          if (s.id !== subjectId) return s;
          return {
            ...s,
            chapters: s.chapters.map(c => c.id === chapterId ? { ...c, title } : c)
          };
        })
      };
    }));
  };

  const updateChapterStats = (projectId: string, subjectId: string, chapterId: string, field: 'revisionCount' | 'practiceCount', delta: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        subjects: p.subjects.map(s => {
          if (s.id !== subjectId) return s;
          return {
            ...s,
            chapters: s.chapters.map(c => {
              if (c.id !== chapterId) return c;
              return { ...c, [field]: Math.max(0, (c[field] || 0) + delta) };
            })
          };
        })
      };
    }));
  };

  const renderMainView = () => (
    <div className="flex flex-col gap-8 w-full animate-slide-up pb-32">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="text-secondary w-4 h-4 glow-secondary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Knowledge Vault</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white font-headline">Aura Classes</h1>
        </div>
        <Button onClick={addProject} size="icon" className="rounded-2xl bg-white/5 border border-white/10 w-14 h-14 hover:bg-white/10 transition-all">
          <Plus size={22} className="text-secondary" strokeWidth={3} />
        </Button>
      </header>

      <div className="space-y-10">
        {projects.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4 opacity-30">
            <FolderPlus size={48} className="text-muted-foreground" />
            <p className="text-xs font-black uppercase tracking-widest">No classes synced</p>
          </div>
        ) : (
          projects.map((project) => {
            const projectStats = getProjectStats(project);
            return (
              <div key={project.id} className="space-y-6">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="shrink-0 relative">
                      <RadialProgress 
                        value={projectStats.percent} 
                        size={44} 
                        strokeWidth={4} 
                        color="hsl(var(--primary))"
                      >
                        <span className="text-[9px] font-black text-white">{projectStats.percent}%</span>
                      </RadialProgress>
                    </div>
                    <input 
                      className="bg-transparent border-none text-2xl font-black text-white font-headline focus:outline-none w-full"
                      value={project.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, title: val } : p));
                      }}
                    />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => addSubject(project.id)} className="text-secondary hover:bg-secondary/10">
                      <PlusCircle size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteProject(project.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-6 pl-4 border-l border-white/5">
                  {project.subjects.map((subject) => {
                    const subjectStats = getSubjectStats(subject);
                    return (
                      <div key={subject.id} className="space-y-3">
                        <div className="flex items-center gap-3 px-2 group/sub">
                          <div className="shrink-0 relative">
                            <RadialProgress 
                              value={subjectStats.percent} 
                              size={28} 
                              strokeWidth={3} 
                              color="hsl(var(--secondary))"
                            >
                              <span className="text-[6px] font-black text-white">{subjectStats.percent}%</span>
                            </RadialProgress>
                          </div>
                          <BookOpen size={14} className="text-secondary/60 ml-1" />
                          <input 
                            className="bg-transparent border-none text-[11px] font-black text-white/40 uppercase tracking-widest focus:outline-none flex-1"
                            value={subject.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProjects(prev => prev.map(p => p.id === project.id ? {
                                ...p, subjects: p.subjects.map(s => s.id === subject.id ? { ...s, title: val } : s)
                              } : p));
                            }}
                          />
                          <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:bg-white/10" onClick={() => addChapter(project.id, subject.id)}>
                              <Plus size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive/60 hover:bg-destructive/10" onClick={() => deleteSubject(project.id, subject.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {subject.chapters.map((chapter) => {
                            const chapterStats = getChapterStats(chapter);
                            return (
                              <motion.button 
                                key={chapter.id}
                                layoutId={`chapter-${chapter.id}`}
                                onClick={() => setSelection({ projectId: project.id, subjectId: subject.id, chapterId: chapter.id })}
                                className="w-full flex items-center gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-2xl transition-all hover:bg-white/[0.06] hover:border-primary/20 text-left"
                              >
                                <div className="shrink-0 relative">
                                  <RadialProgress 
                                    value={chapterStats.percent} 
                                    size={40} 
                                    strokeWidth={4} 
                                    color="hsl(var(--primary))"
                                  >
                                    <span className="text-[8px] font-black text-white">{chapterStats.percent}%</span>
                                  </RadialProgress>
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-black text-white font-headline">{chapter.title}</h4>
                                  <div className="flex items-center gap-3 mt-1.5 opacity-60">
                                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">
                                      {chapter.lectures.length} Nodes
                                    </p>
                                    <div className="w-1 h-1 rounded-full bg-white/10" />
                                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">
                                      {chapter.revisionCount} Rev
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground opacity-30" />
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderDetailView = () => {
    if (!activeChapter || !selection) return null;

    const completedCount = activeChapter.lectures.filter(l => l.completed).length;
    const progress = activeChapter.lectures.length > 0 ? Math.round((completedCount / activeChapter.lectures.length) * 100) : 0;

    return (
      <motion.div 
        layoutId={`chapter-${activeChapter.id}`}
        className="fixed inset-0 z-[60] bg-background flex flex-col p-6 overflow-y-auto no-scrollbar pb-32"
      >
        <header className="flex flex-col gap-6 mb-10 pt-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setSelection(null)}
              className="w-fit p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-white flex items-center gap-2 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Vault List</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => deleteChapter(selection.projectId, selection.subjectId, selection.chapterId)}
              className="text-destructive/60 hover:bg-destructive/10"
            >
              <Trash2 size={18} />
            </Button>
          </div>

          <div className="flex items-center gap-6">
            <div className="shrink-0 relative">
              <RadialProgress 
                value={progress} 
                size={80} 
                strokeWidth={8} 
                color="hsl(var(--primary))"
              >
                <span className="text-sm font-black text-white">{progress}%</span>
              </RadialProgress>
            </div>
            <div className="space-y-1 flex-1">
              <input 
                className="bg-transparent border-none text-4xl font-black tracking-tighter text-white font-headline leading-[1.1] w-full focus:outline-none"
                value={activeChapter.title}
                onChange={(e) => updateChapterTitle(selection.projectId, selection.subjectId, selection.chapterId, e.target.value)}
              />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary block mt-2">Architecture Core</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-6 flex flex-col items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10">
               <RotateCcw className="text-primary glow-primary w-5 h-5" />
            </div>
            <div className="text-center">
              <span className="text-3xl font-black text-white block leading-none">{activeChapter.revisionCount}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-2 block">Rev Cycle</span>
            </div>
            <div className="flex gap-2 mt-2 w-full">
              <Button size="icon" variant="outline" className="flex-1 h-10 rounded-xl border-white/5 bg-white/5" onClick={() => updateChapterStats(selection.projectId, selection.subjectId, selection.chapterId, 'revisionCount', -1)}>
                <Plus className="rotate-45" size={14} />
              </Button>
              <Button size="icon" variant="outline" className="flex-1 h-10 rounded-xl border-white/5 bg-white/5" onClick={() => updateChapterStats(selection.projectId, selection.subjectId, selection.chapterId, 'revisionCount', 1)}>
                <Plus size={14} />
              </Button>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-6 flex flex-col items-center gap-3">
            <div className="p-3 rounded-2xl bg-secondary/10">
              <FileQuestion className="text-secondary glow-secondary w-5 h-5" />
            </div>
            <div className="text-center">
              <span className="text-3xl font-black text-white block leading-none">{activeChapter.practiceCount}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-2 block">Lab Tests</span>
            </div>
            <div className="flex gap-2 mt-2 w-full">
              <Button size="icon" variant="outline" className="flex-1 h-10 rounded-xl border-white/5 bg-white/5" onClick={() => updateChapterStats(selection.projectId, selection.subjectId, selection.chapterId, 'practiceCount', -1)}>
                <Plus className="rotate-45" size={14} />
              </Button>
              <Button size="icon" variant="outline" className="flex-1 h-10 rounded-xl border-white/5 bg-white/5" onClick={() => updateChapterStats(selection.projectId, selection.subjectId, selection.chapterId, 'practiceCount', 1)}>
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6 pb-20">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Sync Progress ({progress}%)</h2>
            <Button size="sm" variant="ghost" onClick={() => addLecture(selection.projectId, selection.subjectId, selection.chapterId)} className="text-primary hover:bg-primary/10 h-8 gap-2 px-4 rounded-full transition-all">
              <Plus size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">New Node</span>
            </Button>
          </div>

          <div className="space-y-4">
            {activeChapter.lectures.map((lecture) => (
              <div 
                key={lecture.id}
                className={cn(
                  "w-full flex items-center gap-4 p-5 rounded-[2.5rem] border transition-all duration-500 group relative",
                  lecture.completed ? "bg-primary/5 border-primary/20 shadow-2xl" : "bg-white/[0.02] border-white/5"
                )}
              >
                <button 
                  onClick={() => toggleLecture(selection.projectId, selection.subjectId, selection.chapterId, lecture.id)}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 shrink-0",
                    lecture.completed ? "bg-primary border-primary text-black glow-primary" : "border-white/10"
                  )}
                >
                  {lecture.completed && <CheckCircle size={22} strokeWidth={3} />}
                </button>
                <div className="flex-1">
                  <input 
                    className={cn(
                      "bg-transparent border-none text-lg font-black font-headline block w-full focus:outline-none",
                      lecture.completed ? "text-primary/60 line-through" : "text-white"
                    )}
                    value={lecture.title}
                    onChange={(e) => updateLectureTitle(selection.projectId, selection.subjectId, selection.chapterId, lecture.id, e.target.value)}
                  />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mt-1 block">
                    {lecture.completed ? "Secure" : "Awaiting Sync"}
                  </span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:bg-white/10 transition-colors">
                      <MoreVertical size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-muted/95 backdrop-blur-2xl border-white/5 rounded-2xl min-w-[200px] z-[100]">
                    <DropdownMenuItem 
                      onSelect={() => {
                        onAddTask(lecture.title);
                        toast({ title: "Node Synced", description: "Added to mission log." });
                      }}
                      className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest p-4 cursor-pointer focus:bg-primary/20 transition-colors"
                    >
                      <ClipboardList size={16} className="text-primary" />
                      Add to Mission Log
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => {
                        onStartFocus(lecture.title);
                        toast({ title: "Cycle Initialized", description: "Navigating to focus core." });
                      }}
                      className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest p-4 cursor-pointer focus:bg-secondary/20 transition-colors"
                    >
                      <Timer size={16} className="text-secondary" />
                      Connect to Timer
                    </DropdownMenuItem>
                    <div className="h-px bg-white/5 my-1" />
                    <DropdownMenuItem 
                      onSelect={() => deleteLecture(selection.projectId, selection.subjectId, selection.chapterId, lecture.id)}
                      className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest p-4 cursor-pointer text-destructive focus:bg-destructive/20 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete Node
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full relative">
      <AnimatePresence mode="wait">
        {selection ? renderDetailView() : renderMainView()}
      </AnimatePresence>
    </div>
  );
}
