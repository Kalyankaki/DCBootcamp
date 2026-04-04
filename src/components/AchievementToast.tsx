"use client";

import { useEffect, useState } from "react";

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
  const [shown, setShown] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newOnes = achievements.filter((a) => !shown.has(a.id));
    if (newOnes.length === 0) return;

    setShown((prev) => {
      const next = new Set(prev);
      for (const a of newOnes) next.add(a.id);
      return next;
    });

    // Queue them with a slight stagger
    newOnes.forEach((a, i) => {
      setTimeout(() => {
        setVisible((prev) => [...prev.slice(-1), { achievement: a, exiting: false }]);
        // Auto-dismiss after 3s
        setTimeout(() => {
          setVisible((prev) =>
            prev.map((t) => (t.achievement.id === a.id ? { ...t, exiting: true } : t))
          );
          setTimeout(() => {
            setVisible((prev) => prev.filter((t) => t.achievement.id !== a.id));
          }, 300);
        }, 3000);
      }, i * 400);
    });
  }, [achievements, shown]);

  if (visible.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {visible.map((t) => (
        <div
          key={t.achievement.id}
          className={`pointer-events-auto flex items-center gap-3 bg-gradient-to-r from-amber-900/95 to-yellow-900/95 border border-amber-500/50 rounded-xl px-4 py-3 shadow-lg shadow-amber-500/20 backdrop-blur-sm ${
            t.exiting ? "animate-toast-out" : "animate-toast-in"
          }`}
        >
          <span className="text-2xl">{t.achievement.emoji}</span>
          <div>
            <div className="text-amber-300 font-bold text-sm">{t.achievement.title}</div>
            <div className="text-amber-100/70 text-xs">{t.achievement.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
