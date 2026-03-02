import React, { useMemo } from 'react';
import { Sparkles, TrendingUp, Clock, CheckSquare, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodo } from '@/contexts/TodoContext';

interface InsightsPageProps {
  theme?: 'clean' | 'retro';
}

/**
 * Smart Insights — pattern analysis from local user data.
 * No external AI model required. Runs entirely in-browser.
 */
const InsightsPage: React.FC<InsightsPageProps> = ({ theme = 'clean' }) => {
  const { userData } = useTodo();
  const isRetro = theme === 'retro';
  const cardClass = isRetro
    ? 'border-2 border-black dark:border-gray-600 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] rounded-xl'
    : 'border rounded-lg';

  const insights = useMemo(() => {
    const tips: { icon: string; title: string; body: string; color: string }[] = [];
    const sessions = (userData.pomodoroSessions || []).filter(s => s.completed && s.type === 'work');
    const completed = userData.completedTasks || [];
    const pending = userData.tasks.filter(t => !t.completed);
    const habits = userData.habits || [];

    // ── Most productive hour ──────────────────────────────────────
    const hourCounts: number[] = new Array(24).fill(0);
    sessions.forEach(s => { hourCounts[new Date(s.started).getHours()]++; });
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    if (sessions.length >= 3) {
      const ampm = peakHour < 12 ? 'AM' : 'PM';
      const h = peakHour % 12 || 12;
      tips.push({
        icon: '⏰',
        title: 'Peak Focus Hour',
        body: `You do your best deep work around ${h}:00 ${ampm}. Schedule your hardest tasks then.`,
        color: 'text-blue-500',
      });
    }

    // ── Most productive day ───────────────────────────────────────
    const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounts: number[] = new Array(7).fill(0);
    completed.forEach(t => { dayCounts[new Date(t.completed).getDay()]++; });
    const peakDay = dayCounts.indexOf(Math.max(...dayCounts));
    if (completed.length >= 5) {
      tips.push({
        icon: '📅',
        title: 'Most Productive Day',
        body: `${dayLabels[peakDay]} is your best day. Plan your most important tasks for then.`,
        color: 'text-green-500',
      });
    }

    // ── Streak encouragement ──────────────────────────────────────
    const topHabit = habits.reduce((best: typeof habits[0] | null, h) =>
      !best || h.streak > best.streak ? h : best, null);
    if (topHabit && topHabit.streak >= 3) {
      tips.push({
        icon: '🔥',
        title: 'Habit Streak!',
        body: `You're on a ${topHabit.streak}-day streak with "${topHabit.name}" — keep it up!`,
        color: 'text-orange-500',
      });
    } else if (habits.length > 0 && (!topHabit || topHabit.streak < 3)) {
      tips.push({
        icon: '💧',
        title: 'Build Your Habits',
        body: 'Complete your habits 3 days in a row to start a streak. Small steps compound!',
        color: 'text-blue-400',
      });
    }

    // ── High priority backlog ─────────────────────────────────────
    const highPriority = pending.filter(t => t.priority === 'high');
    if (highPriority.length >= 3) {
      tips.push({
        icon: '⚠️',
        title: 'High Priority Backlog',
        body: `You have ${highPriority.length} high-priority tasks waiting. Consider breaking them into smaller steps.`,
        color: 'text-red-500',
      });
    }

    // ── Completion trend ──────────────────────────────────────────
    const thisWeek = completed.filter(t => {
      const d = new Date(t.completed);
      const diff = (Date.now() - d.getTime()) / 86400000;
      return diff < 7;
    }).length;
    const lastWeek = completed.filter(t => {
      const d = new Date(t.completed);
      const diff = (Date.now() - d.getTime()) / 86400000;
      return diff >= 7 && diff < 14;
    }).length;
    if (thisWeek > lastWeek && lastWeek > 0) {
      tips.push({
        icon: '📈',
        title: 'You\'re Improving!',
        body: `You completed ${thisWeek} tasks this week vs ${lastWeek} last week. You're trending up!`,
        color: 'text-green-500',
      });
    } else if (thisWeek < lastWeek && lastWeek > 0 && lastWeek - thisWeek >= 2) {
      tips.push({
        icon: '📉',
        title: 'Productivity Dip',
        body: `Completed ${thisWeek} tasks this week vs ${lastWeek} last week. Try a short Pomodoro session to get back on track.`,
        color: 'text-yellow-500',
      });
    }

    // ── Average pomodoros per task ───────────────────────────────
    if (sessions.length > 0 && completed.length > 0) {
      const avgPomo = (sessions.length / completed.length).toFixed(1);
      tips.push({
        icon: '🍅',
        title: 'Focus Pattern',
        body: `On average you use ${avgPomo} Pomodoros per completed task. Use this to estimate future tasks.`,
        color: 'text-orange-500',
      });
    }

    // ── Workspace suggestion ──────────────────────────────────────
    const workspaces = userData.workspaces || [];
    if (workspaces.length === 0 && pending.length >= 3) {
      tips.push({
        icon: '🖥️',
        title: 'Try Workspaces',
        body: 'Group your frequently used tabs into a Workspace and launch them all at once to get into the zone faster.',
        color: 'text-purple-500',
      });
    }

    // ── Overdue tasks ─────────────────────────────────────────────
    const overdue = pending.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length;
    if (overdue > 0) {
      tips.push({
        icon: '📌',
        title: 'Overdue Tasks',
        body: `You have ${overdue} overdue task${overdue > 1 ? 's' : ''}. Review and reschedule or delegate them.`,
        color: 'text-red-500',
      });
    }

    // Fallback if no data yet
    if (tips.length === 0) {
      tips.push({
        icon: '🌱',
        title: 'Getting to know you…',
        body: 'Complete a few tasks and Pomodoro sessions. Tabbie will start learning your patterns and giving you personalized tips!',
        color: 'text-gray-500',
      });
    }

    return tips;
  }, [userData]);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${isRetro ? 'font-black' : ''}`}>✨ Smart Insights</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Tabbie analyses your local data to suggest smarter ways to work.
            <span className="ml-1 text-xs text-green-600 dark:text-green-400 font-medium">100% private — runs on your machine.</span>
          </p>
        </div>
      </div>

      {/* AI Note */}
      <Card className={`${cardClass} bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20`}>
        <CardContent className="p-4 flex gap-3 items-start">
          <span className="text-2xl shrink-0">🤖</span>
          <div>
            <p className="font-semibold text-sm">About Tabbie AI</p>
            <p className="text-sm text-muted-foreground mt-1">
              Currently Tabbie uses lightweight rule-based pattern analysis (no model required — fast and private).
              A future version will optionally integrate a small on-device model (like <strong>Llama 3.2 1B</strong> via <em>WebLLM</em>)
              that can run on a MacBook with ≈300 MB RAM, perfect for the physical Tabbie hardware too.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {insights.map((insight, i) => (
          <Card key={i} className={cardClass}>
            <CardContent className="p-4 flex gap-3">
              <span className="text-2xl shrink-0">{insight.icon}</span>
              <div>
                <p className={`font-semibold text-sm ${insight.color}`}>{insight.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{insight.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pattern Overview */}
      <Card className={cardClass}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Your Productivity Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <CheckSquare className="w-4 h-4 text-green-500" />, label: 'Tasks Done', value: (userData.completedTasks || []).length },
              { icon: <Clock className="w-4 h-4 text-orange-500" />, label: 'Focus Sessions', value: (userData.pomodoroSessions || []).filter(s => s.completed && s.type === 'work').length },
              { icon: <Flame className="w-4 h-4 text-red-500" />, label: 'Habits Tracked', value: (userData.habits || []).length },
              { icon: <Sparkles className="w-4 h-4 text-purple-500" />, label: 'Workspaces', value: (userData.workspaces || []).length },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className="flex justify-center mb-1">{item.icon}</div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsPage;
