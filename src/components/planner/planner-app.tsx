"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Target, AlarmClock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface PlannerItemDTO {
  id: string;
  date: string; // yyyy-MM-dd
  title: string;
  type: string;
  href?: string | null;
  done: boolean;
}

export interface GoalDTO {
  id: string;
  title: string;
  metric: string;
  target: number;
  current: number;
  deadline?: string | null;
  done: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  LESSON: "bg-brand-400",
  REVIEW: "bg-violet-400",
  EXERCISE: "bg-emerald-400",
  EXAM: "bg-rose-400",
  CUSTOM: "bg-sky-400",
};

function ymd(d: Date): string {
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

export function PlannerApp({
  initialItems,
  goals: initialGoals,
  examDate,
  examTarget,
}: {
  initialItems: PlannerItemDTO[];
  goals: GoalDTO[];
  examDate: string | null;
  examTarget: string | null;
}) {
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [items, setItems] = useState(initialItems);
  const [goals, setGoals] = useState(initialGoals);
  const [selectedDay, setSelectedDay] = useState<string>(ymd(today));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("CUSTOM");
  const [goalTitle, setGoalTitle] = useState("");
  const [goalMetric, setGoalMetric] = useState("xp");
  const [goalTarget, setGoalTarget] = useState("500");

  const loadMonth = useCallback(async (m: Date) => {
    const from = ymd(new Date(m.getFullYear(), m.getMonth(), 1));
    const to = ymd(new Date(m.getFullYear(), m.getMonth() + 1, 0));
    const res = await fetch(`/api/planner?from=${from}&to=${to}`);
    if (res.ok) {
      const json = await res.json();
      setItems(
        json.items.map((i: { id: string; date: string; title: string; type: string; href?: string; done: boolean }) => ({
          ...i,
          date: i.date.slice(0, 10),
        }))
      );
    }
  }, []);

  useEffect(() => {
    loadMonth(month);
  }, [month, loadMonth]);

  // Calendar grid (Monday first)
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => ymd(new Date(month.getFullYear(), month.getMonth(), i + 1))),
  ];

  const dayItems = items.filter((i) => i.date === selectedDay);
  const todayKey = ymd(today);

  async function addItem() {
    if (!newTitle.trim()) return;
    const res = await fetch("/api/planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: selectedDay, title: newTitle.trim(), type: newType }),
    });
    if (!res.ok) return toast.error("Could not add task");
    const { item } = await res.json();
    setItems((is) => [...is, { ...item, date: item.date.slice(0, 10) }]);
    setNewTitle("");
    setDialogOpen(false);
  }

  async function toggleDone(item: PlannerItemDTO) {
    setItems((is) => is.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i)));
    await fetch("/api/planner", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, done: !item.done }),
    });
  }

  async function removeItem(id: string) {
    setItems((is) => is.filter((i) => i.id !== id));
    await fetch(`/api/planner?id=${id}`, { method: "DELETE" });
  }

  async function addGoal() {
    const target = parseInt(goalTarget, 10);
    if (!goalTitle.trim() || !target) return;
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: goalTitle.trim(), metric: goalMetric, target }),
    });
    if (!res.ok) return toast.error("Could not create goal");
    const { goal } = await res.json();
    setGoals((gs) => [...gs, { ...goal, current: 0 }]);
    setGoalTitle("");
    setGoalDialogOpen(false);
  }

  async function removeGoal(id: string) {
    setGoals((gs) => gs.filter((g) => g.id !== id));
    await fetch(`/api/goals?id=${id}`, { method: "DELETE" });
  }

  const daysToExam = examDate
    ? Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar */}
      <div className="rounded-2xl border bg-card p-5 shadow-card lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">
            {month.toLocaleDateString("en", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex gap-1">
            <Button variant="outline" size="icon-sm" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>
              Today
            </Button>
            <Button variant="outline" size="icon-sm" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) =>
            day === null ? (
              <div key={`empty-${i}`} />
            ) : (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border text-sm transition-colors",
                  day === selectedDay
                    ? "border-primary bg-primary text-primary-foreground"
                    : day === todayKey
                      ? "border-brand-400 font-bold"
                      : "border-transparent hover:bg-accent"
                )}
              >
                {Number(day.slice(8))}
                <span className="flex h-1.5 gap-0.5">
                  {items
                    .filter((it) => it.date === day)
                    .slice(0, 3)
                    .map((it) => (
                      <span key={it.id} className={cn("h-1.5 w-1.5 rounded-full", it.done ? "bg-muted-foreground/40" : TYPE_COLORS[it.type] ?? "bg-sky-400")} />
                    ))}
                </span>
              </button>
            )
          )}
        </div>

        {/* Day details */}
        <div className="mt-5 border-t pt-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-bold">
              {new Date(selectedDay).toLocaleDateString("en", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-3.5 w-3.5" /> Add task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>New study task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Task</Label>
                    <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Review Dativ prepositions" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Select value={newType} onValueChange={setNewType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LESSON">Lesson</SelectItem>
                        <SelectItem value="REVIEW">Revision</SelectItem>
                        <SelectItem value="EXERCISE">Exercise</SelectItem>
                        <SelectItem value="EXAM">Exam prep</SelectItem>
                        <SelectItem value="CUSTOM">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={addItem}>
                    Add to {new Date(selectedDay).toLocaleDateString("en", { month: "short", day: "numeric" })}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            {dayItems.length === 0 && <p className="text-sm text-muted-foreground">Nothing planned for this day.</p>}
            {dayItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border bg-secondary/30 px-3.5 py-2.5">
                <Checkbox checked={item.done} onCheckedChange={() => toggleDone(item)} />
                <span className={cn("h-2 w-2 shrink-0 rounded-full", TYPE_COLORS[item.type] ?? "bg-sky-400")} />
                <span className={cn("flex-1 text-sm font-medium", item.done && "text-muted-foreground line-through")}>
                  {item.title}
                </span>
                <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar: countdown + goals */}
      <div className="space-y-5">
        <div className="rounded-2xl border bg-card p-5 text-center shadow-card">
          <div className="mb-1 flex items-center justify-center gap-2 text-sm font-bold">
            <AlarmClock className="h-4 w-4 text-brand-500" /> Exam countdown
          </div>
          {daysToExam !== null ? (
            <>
              <div className="text-4xl font-bold tracking-tight">{daysToExam}</div>
              <div className="text-sm text-muted-foreground">days until {examTarget ?? "your exam"}</div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No exam date set — add one in your <Link href="/profile" className="font-medium underline underline-offset-2">profile</Link> to start the countdown.
            </p>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Target className="h-4 w-4 text-brand-500" /> Study goals
            </div>
            <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-3.5 w-3.5" /> New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>New study goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Goal</Label>
                    <Input value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder="e.g. Earn 500 XP this month" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Metric</Label>
                      <Select value={goalMetric} onValueChange={setGoalMetric}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xp">XP</SelectItem>
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="lessons">Lessons</SelectItem>
                          <SelectItem value="cards">Card reviews</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Target</Label>
                      <Input type="number" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} min={1} />
                    </div>
                  </div>
                  <Button className="w-full" onClick={addGoal}>
                    Create goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3.5">
            {goals.length === 0 && <p className="text-sm text-muted-foreground">Set a goal — progress fills in automatically.</p>}
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.current / Math.max(1, g.target)) * 100));
              return (
                <div key={g.id}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                    <span className="truncate font-medium">{g.title}</span>
                    <span className="flex items-center gap-1.5">
                      {pct >= 100 && <Badge variant="success" className="text-[9px]">Done!</Badge>}
                      <button onClick={() => removeGoal(g.id)} className="text-muted-foreground hover:text-destructive" aria-label="Delete goal">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" indicatorClassName={pct >= 100 ? "bg-emerald-500" : "bg-brand-500"} />
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {g.current.toLocaleString()} / {g.target.toLocaleString()} {g.metric}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 text-xs leading-relaxed text-foreground/80 dark:border-brand-900 dark:bg-brand-950/30">
          💡 <strong>Planning tip:</strong> small daily blocks beat weekend marathons. 20 focused minutes a day is ~2
          CEFR levels a year.
        </div>
      </div>
    </div>
  );
}
