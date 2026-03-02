import React, { useMemo } from 'react';
import { CheckSquare, Clock, Flame, Trophy, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodo } from '@/contexts/TodoContext';

interface StatsPageProps {
  theme?: 'clean' | 'retro';
}

const StatsPage: React.FC<StatsPageProps> = ({ theme = 'clean' }) => {
  const { userData } = useTodo();
  const isRetro = theme === 'retro';
  const cardClass = isRetro
    ? 'border-2 border-black dark:border-gray-600 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] rounded-xl'
    : 'border rounded-lg';

  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
    const monthAgo = new Date(now); monthAgo.setDate(now.getDate() - 30);

    const allTasks = [...userData.tasks, ...userData.completedTasks];
    const completedToday = userData.completedTasks.filter(t => {
      const d = new Date(t.completed);
      return d.toISOString().slice(0, 10) === todayStr;
    }).length;
    const completedThisWeek = userData.completedTasks.filter(t => new Date(t.completed) >= weekAgo).length;
    const completedThisMonth = userData.completedTasks.filter(t => new Date(t.completed) >= monthAgo).length;
    const totalCompleted = userData.completedTasks.length;

    const sessions = userData.pomodoroSessions.filter(s => s.completed && s.type === 'work');
    const pomodorosToday = sessions.filter(s => new Date(s.started).toISOString().slice(0, 10) === todayStr).length;
    const pomodorosThisWeek = sessions.filter(s => new Date(s.started) >= weekAgo).length;
    const pomodorosTotal = sessions.length;
    const focusMinutes = sessions.reduce((acc, s) => acc + (s.duration || 25), 0);

    // Habit stats
    const habits = userData.habits || [];
    const habitCompletionsToday = habits.filter(h => h.completions.includes(todayStr)).length;
    const longestHabitStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);

    // Pending tasks
    const pendingTasks = userData.tasks.filter(t => !t.completed).length;
    const highPriority = userData.tasks.filter(t => !t.completed && t.priority === 'high').length;

    // Activity last 7 days
    const dailyActivity: { date: string; completed: number; pomodoros: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      dailyActivity.push({
        date: dateStr,
        completed: userData.completedTasks.filter(t => new Date(t.completed).toISOString().slice(0, 10) === dateStr).length,
        pomodoros: sessions.filter(s => new Date(s.started).toISOString().slice(0, 10) === dateStr).length,
      });
    }

    const completionRate = allTasks.length > 0
      ? Math.round((totalCompleted / (totalCompleted + pendingTasks)) * 100) : 0;

    return {
      completedToday, completedThisWeek, completedThisMonth, totalCompleted,
      pomodorosToday, pomodorosThisWeek, pomodorosTotal, focusMinutes,
      habitCompletionsToday, longestHabitStreak,
      pendingTasks, highPriority,
      dailyActivity, completionRate,
    };
  }, [userData]);

  const maxActivity = useMemo(() =>
    Math.max(1, ...stats.dailyActivity.map(d => d.completed + d.pomodoros)),
    [stats.dailyActivity]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className={`text-2xl font-bold ${isRetro ? 'font-black' : ''}`}>📊 Stats</h1>
        <p className="text-muted-foreground text-sm mt-1">Your productivity at a glance.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {[
          { icon: <CheckSquare className="w-5 h-5 text-green-500" />, label: 'Completed Today', value: stats.completedToday },
          { icon: <Clock className="w-5 h-5 text-orange-500" />, label: 'Pomodoros Today', value: stats.pomodorosToday },
          { icon: <Flame className="w-5 h-5 text-red-500" />, label: 'Best Habit Streak', value: stats.longestHabitStreak },
          { icon: <Target className="w-5 h-5 text-blue-500" />, label: 'Completion Rate', value: `${stats.completionRate}%` },
        ].map(item => (
          <Card key={item.label} className={cardClass}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">{item.icon}</div>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Activity Bar Chart */}
      <Card className={cardClass}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Last 7 Days Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-24">
            {stats.dailyActivity.map(day => {
              const total = day.completed + day.pomodoros;
              const height = Math.round((total / maxActivity) * 100);
              const dayLabel = dayLabels[new Date(day.date + 'T12:00:00').getDay()];
              const isToday = day.date === new Date().toISOString().slice(0, 10);
              return (
                <div key={day.date} className="flex flex-col items-center flex-1 gap-1">
                  <div className="relative w-full flex items-end justify-center" style={{ height: 80 }}>
                    {total > 0 && (
                      <div
                        className={`w-full rounded-t transition-all ${isToday ? 'bg-blue-500' : 'bg-blue-300 dark:bg-blue-700'}`}
                        style={{ height: `${Math.max(4, height)}%` }}
                        title={`${day.completed} tasks, ${day.pomodoros} 🍅`}
                      />
                    )}
                    {total === 0 && <div className="w-full rounded-t bg-muted" style={{ height: '4%' }} />}
                  </div>
                  <span className={`text-[10px] ${isToday ? 'font-bold text-blue-500' : 'text-muted-foreground'}`}>{dayLabel}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-sm bg-blue-500" /> Completed + Pomodoros
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className={cardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-green-500" /> Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              ['Completed Today', stats.completedToday],
              ['Completed This Week', stats.completedThisWeek],
              ['Completed This Month', stats.completedThisMonth],
              ['Total Completed', stats.totalCompleted],
              ['Pending', stats.pendingTasks],
              ['High Priority Pending', stats.highPriority],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" /> Focus Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              ['Pomodoros Today', stats.pomodorosToday],
              ['Pomodoros This Week', stats.pomodorosThisWeek],
              ['Total Pomodoros', stats.pomodorosTotal],
              ['Total Focus Time', `${Math.floor(stats.focusMinutes / 60)}h ${stats.focusMinutes % 60}m`],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={`${cardClass} sm:col-span-2`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" /> Habits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              ['Habits Completed Today', `${stats.habitCompletionsToday} / ${(userData.habits || []).length}`],
              ['Best Streak (all habits)', `${stats.longestHabitStreak} days`],
              ['Total Habits Tracked', (userData.habits || []).length],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
            {(userData.habits || []).length > 0 && (
              <div className="mt-3 space-y-2">
                {(userData.habits || []).map(h => (
                  <div key={h.id} className="flex items-center gap-2 text-sm">
                    <span>{h.icon}</span>
                    <span className="flex-1 truncate">{h.name}</span>
                    <span className="flex items-center gap-1 text-orange-500 font-medium">
                      <Trophy className="w-3 h-3" /> {h.longestStreak}d best
                    </span>
                    <span className="text-muted-foreground">({h.completions.length} total)</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsPage;
