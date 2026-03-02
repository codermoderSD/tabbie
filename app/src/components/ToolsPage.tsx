import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Wind, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ToolsPageProps {
  theme?: 'clean' | 'retro';
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';
const BREATH_PHASES: { phase: BreathPhase; duration: number; label: string }[] = [
  { phase: 'inhale', duration: 4, label: 'Breathe In' },
  { phase: 'hold', duration: 4, label: 'Hold' },
  { phase: 'exhale', duration: 4, label: 'Breathe Out' },
  { phase: 'rest', duration: 2, label: 'Rest' },
];

const QUICK_LINKS = [
  { label: 'Notion', url: 'https://notion.so', icon: '📓' },
  { label: 'Linear', url: 'https://linear.app', icon: '📋' },
  { label: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { label: 'Figma', url: 'https://figma.com', icon: '🎨' },
  { label: 'Gmail', url: 'https://mail.google.com', icon: '📧' },
  { label: 'Calendar', url: 'https://calendar.google.com', icon: '📅' },
  { label: 'ChatGPT', url: 'https://chat.openai.com', icon: '🤖' },
  { label: 'Spotify', url: 'https://open.spotify.com', icon: '🎵' },
];

const FOCUS_TIPS = [
  '🎯 Start with the hardest task first — your energy is highest in the morning.',
  '📵 Put your phone face-down (or in another room) during deep work.',
  '🎵 Instrumental music or white noise helps block distracting sounds.',
  '⏱️ Use the 2-minute rule: if it takes less than 2 mins, do it now.',
  '✍️ Write tomorrow\'s tasks tonight — wake up with a clear plan.',
  '💧 Stay hydrated. Even mild dehydration reduces focus significantly.',
  '🌿 A 5-min walk outside resets your focus better than a coffee break.',
  '📖 Read for 10 minutes before bed instead of scrolling — sleep quality improves.',
  '🧘 Deep breathing for 60 seconds reduces cortisol and resets your mind.',
  '🔕 Close unused browser tabs — each open tab is a potential distraction.',
];

const ToolsPage: React.FC<ToolsPageProps> = ({ theme = 'clean' }) => {
  const isRetro = theme === 'retro';
  const cardClass = isRetro
    ? 'border-2 border-black dark:border-gray-600 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] rounded-xl'
    : 'border rounded-lg';

  // ── Quick Timer ────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState(5 * 60); // total seconds remaining
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerTotal, setTimerTotal] = useState(5 * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timerDone, setTimerDone] = useState(false);

  // Derived display values
  const timerMinutes = Math.floor(timeLeft / 60);
  const timerSeconds = timeLeft % 60;

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            setTimerDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  const startTimer = (mins: number) => {
    const total = mins * 60;
    setTimeLeft(total);
    setTimerTotal(total);
    setTimerDone(false);
    setTimerRunning(true);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerDone(false);
    setTimeLeft(timerTotal);
  };

  const progress = timerTotal > 0 ? ((timerTotal - timeLeft) / timerTotal) * 100 : 0;

  // ── Breathing Exercise ─────────────────────────────────────────
  const [breathRunning, setBreathRunning] = useState(false);
  const [breathPhaseIdx, setBreathPhaseIdx] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [breathTimeLeft, setBreathTimeLeft] = useState(BREATH_PHASES[0].duration);
  const breathRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (breathRunning) {
      breathRef.current = setInterval(() => {
        setBreathTimeLeft(prev => {
          if (prev > 1) return prev - 1;
          setBreathPhaseIdx(pi => {
            const next = (pi + 1) % BREATH_PHASES.length;
            if (next === 0) setBreathCount(c => c + 1);
            setBreathTimeLeft(BREATH_PHASES[next].duration);
            return next;
          });
          return prev;
        });
      }, 1000);
    }
    return () => { if (breathRef.current) clearInterval(breathRef.current); };
  }, [breathRunning]);

  const stopBreath = () => {
    setBreathRunning(false);
    setBreathPhaseIdx(0);
    setBreathTimeLeft(BREATH_PHASES[0].duration);
    setBreathCount(0);
  };

  const currentPhase = BREATH_PHASES[breathPhaseIdx];
  const breathScale = currentPhase.phase === 'inhale' ? 1.3 : currentPhase.phase === 'exhale' ? 0.8 : 1;

  // ── Tip of the day ─────────────────────────────────────────────
  const tipIndex = useMemo(() => new Date().getDate() % FOCUS_TIPS.length, []);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className={`text-2xl font-bold ${isRetro ? 'font-black' : ''}`}>🛠️ Tools</h1>
        <p className="text-muted-foreground text-sm mt-1">Quick productivity tools at your fingertips.</p>
      </div>

      {/* Tip of the Day */}
      <Card className={`${cardClass} bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30`}>
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">💡 Tip of the day</p>
          <p className="text-sm">{FOCUS_TIPS[tipIndex]}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Quick Timer */}
        <Card className={cardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">⏱️ Quick Timer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!timerRunning && !timerDone ? (
              <>
                <p className="text-xs text-muted-foreground">Pick a duration to start:</p>
                <div className="flex flex-wrap gap-2">
                  {[1, 3, 5, 10, 15, 20].map(m => (
                    <Button key={m} size="sm" variant="outline" onClick={() => startTimer(m)}>{m} min</Button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center space-y-3">
                {timerDone ? (
                  <p className="text-2xl">✅ Done!</p>
                ) : (
                  <>
                    <p className="font-mono text-4xl font-bold">
                      {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </>
                )}
                <div className="flex gap-2 justify-center">
                  {!timerDone && (
                    <Button size="sm" variant="outline" onClick={() => setTimerRunning(v => !v)}>
                      {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={resetTimer}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Breathing Exercise */}
        <Card className={cardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Wind className="w-4 h-4 text-teal-500" /> Box Breathing (4-4-4-2)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 font-bold text-lg transition-transform duration-1000"
              style={{ transform: `scale(${breathRunning ? breathScale : 1})` }}
            >
              {breathRunning ? currentPhase.label.split(' ')[0] : '🌬️'}
            </div>
            {breathRunning && (
              <div className="text-center">
                <p className="font-semibold text-sm">{currentPhase.label}</p>
                <p className="text-2xl font-mono font-bold">{breathTimeLeft}s</p>
                <p className="text-xs text-muted-foreground">Cycle {breathCount + 1}</p>
              </div>
            )}
            <div className="flex gap-2">
              {!breathRunning ? (
                <Button size="sm" onClick={() => setBreathRunning(true)}>
                  <Play className="w-3 h-3 mr-1" /> Start
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={stopBreath}>
                  <RotateCcw className="w-3 h-3 mr-1" /> Stop
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className={cardClass}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">🔗 Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {QUICK_LINKS.map(link => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors text-center group"
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors leading-tight">{link.label}</span>
                <ExternalLink className="w-2.5 h-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Productivity Tips */}
      <Card className={cardClass}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">🧠 Productivity Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {FOCUS_TIPS.map((tip, i) => (
              <li key={i} className={`text-sm py-1 ${i === tipIndex ? 'font-medium' : 'text-muted-foreground'}`}>{tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolsPage;
