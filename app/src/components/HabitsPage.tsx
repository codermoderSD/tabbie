import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Bell, BellOff, Flame, Trophy, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodo } from '@/contexts/TodoContext';
import type { Habit, Reminder } from '@/types/todo';

interface HabitsPageProps {
  theme?: 'clean' | 'retro';
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ICONS = ['💧', '🏃', '📖', '🧘', '💊', '🥗', '😴', '✍️', '🎯', '💪', '🎵', '🌿'];
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const today = () => new Date().toISOString().slice(0, 10);

const HabitsPage: React.FC<HabitsPageProps> = ({ theme = 'clean' }) => {
  const { userData, addHabit, deleteHabit, toggleHabitCompletion, addReminder, updateReminder, deleteReminder } = useTodo();
  const habits: Habit[] = useMemo(() => userData.habits || [], [userData.habits]);
  const reminders: Reminder[] = useMemo(() => userData.reminders || [], [userData.reminders]);

  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitIcon, setHabitIcon] = useState('💧');
  const [habitColor, setHabitColor] = useState(COLORS[0]);
  const [habitFreq, setHabitFreq] = useState<'daily' | 'weekly'>('daily');
  const [habitDays, setHabitDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [reminderDays, setReminderDays] = useState<number[]>([]);

  const todayStr = today();

  const handleAddHabit = () => {
    if (!habitName.trim()) return;
    addHabit(habitName.trim(), habitIcon, habitColor, habitFreq, habitFreq === 'weekly' ? habitDays : undefined);
    setHabitName('');
    setHabitIcon('💧');
    setHabitColor(COLORS[0]);
    setHabitFreq('daily');
    setHabitDays([1, 2, 3, 4, 5]);
    setShowHabitForm(false);
  };

  const handleAddReminder = () => {
    if (!reminderTitle.trim()) return;
    addReminder(reminderTitle.trim(), reminderTime, reminderDays);
    setReminderTitle('');
    setReminderTime('09:00');
    setReminderDays([]);
    setShowReminderForm(false);
  };

  const toggleReminderDay = (day: number) => {
    setReminderDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const toggleHabitDay = (day: number) => {
    setHabitDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const isRetro = theme === 'retro';
  const cardClass = isRetro
    ? 'border-2 border-black dark:border-gray-600 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] rounded-xl'
    : 'border rounded-lg';

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isRetro ? 'font-black' : ''}`}>🔁 Habits & Reminders</h1>
          <p className="text-muted-foreground text-sm mt-1">Build lasting habits and never miss a beat.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowReminderForm(v => !v)}>
            <Bell className="w-4 h-4 mr-1" /> Reminder
          </Button>
          <Button size="sm" onClick={() => setShowHabitForm(v => !v)}>
            <Plus className="w-4 h-4 mr-1" /> Habit
          </Button>
        </div>
      </div>

      {/* Add Habit Form */}
      {showHabitForm && (
        <Card className={cardClass}>
          <CardHeader><CardTitle className="text-base">New Habit</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Habit name (e.g. Drink water)" value={habitName} onChange={e => setHabitName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddHabit()} />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Pick an icon</p>
              <div className="flex flex-wrap gap-2">
                {ICONS.map(ic => (
                  <button key={ic} onClick={() => setHabitIcon(ic)}
                    className={`text-xl p-1 rounded ${habitIcon === ic ? 'ring-2 ring-blue-500' : ''}`}>{ic}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Color</p>
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setHabitColor(c)}
                    className={`w-6 h-6 rounded-full border-2 ${habitColor === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {(['daily', 'weekly'] as const).map(f => (
                <Button key={f} size="sm" variant={habitFreq === f ? 'default' : 'outline'} onClick={() => setHabitFreq(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
            {habitFreq === 'weekly' && (
              <div className="flex gap-1">
                {DAYS.map((d, i) => (
                  <button key={d} onClick={() => toggleHabitDay(i)}
                    className={`px-2 py-1 rounded text-xs font-medium border ${habitDays.includes(i) ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                    {d}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleAddHabit}>Add Habit</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowHabitForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Reminder Form */}
      {showReminderForm && (
        <Card className={cardClass}>
          <CardHeader><CardTitle className="text-base">New Reminder</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Reminder title (e.g. Drink water)" value={reminderTitle} onChange={e => setReminderTitle(e.target.value)} />
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Time</label>
              <Input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} className="w-32" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Repeat on days (empty = every day)</p>
              <div className="flex gap-1">
                {DAYS.map((d, i) => (
                  <button key={d} onClick={() => toggleReminderDay(i)}
                    className={`px-2 py-1 rounded text-xs font-medium border ${reminderDays.includes(i) ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleAddReminder}>Add Reminder</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowReminderForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Habits List */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Today's Habits</h2>
        {habits.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-3xl mb-2">🌱</p>
            <p className="text-sm">No habits yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {habits.map(habit => {
              const done = habit.completions.includes(todayStr);
              return (
                <Card key={habit.id} className={`${cardClass} transition-all`} style={{ borderLeftColor: habit.color, borderLeftWidth: 4 }}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <button onClick={() => toggleHabitCompletion(habit.id, todayStr)} className="shrink-0">
                      {done
                        ? <CheckCircle2 className="w-6 h-6" style={{ color: habit.color }} />
                        : <Circle className="w-6 h-6 text-muted-foreground" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{habit.icon}</span>
                        <span className={`font-medium truncate ${done ? 'line-through text-muted-foreground' : ''}`}>{habit.name}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" /> {habit.streak} day streak
                        </span>
                        {habit.longestStreak > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-yellow-500" /> Best: {habit.longestStreak}
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => deleteHabit(habit.id)} className="text-muted-foreground hover:text-red-500 transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Reminders List */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Reminders</h2>
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-3xl mb-2">🔔</p>
            <p className="text-sm">No reminders yet. Add one above!</p>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {reminders.map(reminder => (
              <Card key={reminder.id} className={cardClass}>
                <CardContent className="p-3 flex items-center gap-3">
                  <button onClick={() => updateReminder(reminder.id, { enabled: !reminder.enabled })} className="shrink-0">
                    {reminder.enabled
                      ? <Bell className="w-5 h-5 text-blue-500" />
                      : <BellOff className="w-5 h-5 text-muted-foreground" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${!reminder.enabled ? 'text-muted-foreground' : ''}`}>{reminder.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {reminder.time} · {reminder.days.length === 0 ? 'Every day' : reminder.days.map(d => DAYS[d]).join(', ')}
                    </p>
                  </div>
                  <button onClick={() => deleteReminder(reminder.id)} className="text-muted-foreground hover:text-red-500 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsPage;
