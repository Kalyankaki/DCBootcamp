"use client";

import { useEffect, useRef, useState } from "react";

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

interface ToastItem {
  achievement: Achievement;
  exiting: boolean;
}

export function AchievementToast({ achievements }: { achievements: Achievement[] }) {
  const [visible, setVisible] = useState<ToastItem[]>([]);
  // Use a ref so we don't create an effect feedback loop (previously `shown`
  // was state that was also in the effect deps — that re-fired the effect
  // and in React 19 concurrent mode the toasts never rendered).
  const shownRef = useRef<Set<string>>(new Set());
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    const newOnes = achievements.filter((a) => !shownRef.current.has(a.id));
    if (newOnes.length === 0) return;

    for (const a of newOnes) shownRef.current.add(a.id);

    newOnes.forEach((a, i) => {
      const showTimer = setTimeout(() => {
        // Keep up to 2 previous toasts, add the new one (max 3 visible)
        setVisible((prev) => [...prev.slice(-2), { achievement: a, exiting: false }]);

        const exitTimer = setTimeout(() => {
          setVisible((prev) =>
            prev.map((t) => (t.achievement.id === a.id ? { ...t, exiting: true } : t))
          );
          const removeTimer = setTimeout(() => {
            setVisible((prev) => prev.filter((t) => t.achievement.id !== a.id));
          }, 300);
          timersRef.current.push(removeTimer);
        }, 3000);
        timersRef.current.push(exitTimer);
      }, i * 400);
      timersRef.current.push(showTimer);
    });
  }, [achievements]);

  // Clean up any pending timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, []);

  if (visible.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {visible.map((t) => (
        <div
          key={t.achievement.id}
          className={`pointer-events-auto flex items-center gap-3 bg-gradient-to-r from-amber-900/95 to-yellow-900/95 border border-amber-500/50 rounded-xl px-4 py-3 shadow-lg shadow-amber-500/30 backdrop-blur-sm min-w-[260px] ${
            t.exiting ? "animate-toast-out" : "animate-toast-in"
          }`}
        >
          <span className="text-2xl shrink-0">{t.achievement.emoji}</span>
          <div className="min-w-0">
            <div className="text-amber-300 font-bold text-sm">{t.achievement.title}</div>
            <div className="text-amber-100/80 text-xs">{t.achievement.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
